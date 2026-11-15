extends SceneTree
## Checks that every character GLB imports into Godot as the game expects:
## rig pivots, animations (and their loop flags) and FX anchors. Also checks the
## rocket parts and the celestial bodies (radius 1, Site_* anchors).
##
## Run from the repository root, after `godot --headless --path godot --import`:
##   godot --headless --path godot --script "$PWD/tools/godot/check_models.gd"

const MODELS_DIR := "res://assets/models/characters"
const PART_CATEGORIES := {
	"engines": {"dir": "res://assets/models/parts/engines", "max_meshes": 10},
	"tanks": {"dir": "res://assets/models/parts/tanks", "max_meshes": 8},
	"equipment": {"dir": "res://assets/models/parts/equipment", "max_meshes": 12},
	"cabin": {"dir": "res://assets/models/parts/cabin", "max_meshes": 12},
	"cockpit": {"dir": "res://assets/models/parts/cockpit", "max_meshes": 35},
}
const BODIES_DIR := "res://assets/models/bodies"
const BODY_MAX_MESHES := 12
const BODY_DIAMETER_RANGE := Vector2(1.99, 2.2) # mean radius 1 plus exaggerated relief
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

	for category: String in PART_CATEGORIES:
		var cfg: Dictionary = PART_CATEGORIES[category]
		var part_dir: String = cfg["dir"]
		var max_meshes: int = cfg["max_meshes"]
		var part_files := DirAccess.get_files_at(part_dir)
		if part_files.is_empty():
			push_error("No files in %s (did you run --import?)" % part_dir)
			failures += 1
			continue
		for file in part_files:
			if file.get_extension() != "glb":
				continue
			failures += _check_part(part_dir.path_join(file), category, max_meshes)

	var body_files := DirAccess.get_files_at(BODIES_DIR)
	if body_files.is_empty():
		push_error("No files in %s (did you run --import?)" % BODIES_DIR)
		failures += 1
	for file in body_files:
		if file.get_extension() == "glb":
			failures += _check_body(BODIES_DIR.path_join(file))

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


func _check_part(path: String, category: String, max_meshes: int) -> int:
	var problems: Array[String] = []
	var packed := load(path) as PackedScene
	if packed == null:
		print("✘ %s: could not load (not imported?)" % path)
		return 1
	var root := packed.instantiate()

	if root.find_child("Attach_Top", true, false) == null:
		problems.append("missing Attach_Top")
	if category in ["tanks", "equipment", "cabin", "cockpit"] and root.find_child("Attach_Bottom", true, false) == null:
		problems.append("missing Attach_Bottom")
	if category == "engines" and root.find_child("FX_Exhaust", true, false) == null:
		problems.append("missing FX_Exhaust")
	if category == "cockpit" and root.find_child("Camera_Pilot", true, false) == null:
		problems.append("missing Camera_Pilot")

	var anchors: Array[String] = []
	for node in root.find_children("FX_*", "", true, false):
		anchors.append(String(node.name))

	var meshes := root.find_children("*", "MeshInstance3D", true, false).size()
	if meshes == 0:
		problems.append("no meshes")
	elif meshes > max_meshes:
		problems.append("%d meshes > %d" % [meshes, max_meshes])

	var label := "%s/%s: %d meshes, fx %s" % [category, path.get_file(), meshes, anchors]
	root.free()

	if problems.is_empty():
		print("✔ " + label)
		return 0
	print("✘ " + label)
	for problem in problems:
		print("    - " + problem)
	return problems.size()


func _check_body(path: String) -> int:
	var problems: Array[String] = []
	var packed := load(path) as PackedScene
	if packed == null:
		print("✘ %s: could not load (not imported?)" % path)
		return 1
	var root := packed.instantiate() as Node3D

	var bounds := AABB()
	var meshes := root.find_children("*", "MeshInstance3D", true, false)
	for node in meshes:
		var mesh := node as MeshInstance3D
		var box := mesh.transform * mesh.get_aabb()
		bounds = box if bounds.size == Vector3.ZERO else bounds.merge(box)
	if meshes.is_empty():
		problems.append("no meshes")
	elif meshes.size() > BODY_MAX_MESHES:
		problems.append("%d meshes > %d" % [meshes.size(), BODY_MAX_MESHES])
	for axis in 3:
		if bounds.size[axis] < BODY_DIAMETER_RANGE.x or bounds.size[axis] > BODY_DIAMETER_RANGE.y:
			problems.append("size %s outside %s on axis %d" % [bounds.size, BODY_DIAMETER_RANGE, axis])
			break

	var sites: Array[String] = []
	for node in root.find_children("Site_*", "", true, false):
		sites.append(String(node.name))
		var radius := (node as Node3D).position.length()
		if absf(radius - 1.0) > 0.1:
			problems.append("%s at radius %.4f" % [node.name, radius])

	var label := "bodies/%s: %d meshes, size %s, sites %s" % [path.get_file(), meshes.size(), bounds.size, sites]
	root.free()

	if problems.is_empty():
		print("✔ " + label)
		return 0
	print("✘ " + label)
	for problem in problems:
		print("    - " + problem)
	return problems.size()
