extends SceneTree
## Checks that every character GLB imports into Godot as the game expects:
## rig pivots, animations (and their loop flags) and FX anchors.
##
## Run from the repository root, after `godot --headless --path godot --import`:
##   godot --headless --path godot --script "$PWD/tools/godot/check_models.gd"

const MODELS_DIR := "res://assets/models/characters"
const PIVOTS: Array[String] = [
	"Hips", "Torso", "Head",
	"UpperArm_L", "LowerArm_L", "Hand_L", "UpperArm_R", "LowerArm_R", "Hand_R",
	"UpperLeg_L", "LowerLeg_L", "Foot_L", "UpperLeg_R", "LowerLeg_R", "Foot_R",
]
# The GLBs name looping clips "*_loop"; Godot's importer sets the loop flag and
# strips the suffix, so in Godot they are "idle", "walk" and "action".
const LOOPING_CLIPS: Array[String] = ["idle", "walk", "action"]
const ONE_SHOT_CLIPS: Array[String] = ["wave"]


func _initialize() -> void:
	var failures := 0
	var files := DirAccess.get_files_at(MODELS_DIR)
	if files.is_empty():
		push_error("No files in %s (did you run --import?)" % MODELS_DIR)
		quit(1)
		return
	for file in files:
		if file.get_extension() != "glb":
			continue
		failures += _check_model(MODELS_DIR.path_join(file))
	print("RESULT: %s" % ("OK" if failures == 0 else "%d problem(s)" % failures))
	quit(1 if failures > 0 else 0)


func _check_model(path: String) -> int:
	var problems: Array[String] = []
	var packed := load(path) as PackedScene
	if packed == null:
		print("✘ %s: could not load (not imported?)" % path)
		return 1
	var root := packed.instantiate()

	for pivot in PIVOTS:
		if root.find_child(pivot, true, false) == null:
			problems.append("missing pivot %s" % pivot)

	var player := root.find_child("AnimationPlayer", true, false) as AnimationPlayer
	if player == null:
		problems.append("no AnimationPlayer")
	else:
		for clip in LOOPING_CLIPS + ONE_SHOT_CLIPS:
			if not player.has_animation(clip):
				problems.append("missing animation %s" % clip)
				continue
			var looping := player.get_animation(clip).loop_mode != Animation.LOOP_NONE
			if looping != (clip in LOOPING_CLIPS):
				problems.append("animation %s loop=%s" % [clip, looping])

	var anchors: Array[String] = []
	for node in root.find_children("FX_*", "", true, false):
		anchors.append(String(node.name))
	if anchors.is_empty():
		problems.append("no FX_* anchors")

	var meshes := root.find_children("*", "MeshInstance3D", true, false).size()
	var label := "%s: %d meshes, anims %s, fx %s" % [
		path.get_file(), meshes,
		player.get_animation_list() if player else [], anchors,
	]
	root.free()

	if problems.is_empty():
		print("✔ " + label)
		return 0
	print("✘ " + label)
	for problem in problems:
		print("    - " + problem)
	return problems.size()
