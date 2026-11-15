extends SceneTree
## Checks that every terrain GLB listed in the terrain manifest imports into Godot as
## the game expects: a "Terrain" mesh with its photo texture, a trimesh collision body
## and the size and height range recorded in the manifest.
##
## Run from the repository root, after `godot --headless --path godot --import`:
##   godot --headless --path godot --script "$PWD/tools/godot/check_terrain.gd"

const MANIFEST_PATH := "res://assets/terrain/manifest.json"
const TERRAIN_DIR := "res://assets/terrain"
const TOLERANCE_M := 0.05


func _initialize() -> void:
	var manifest: Variant = JSON.parse_string(FileAccess.get_file_as_string(MANIFEST_PATH))
	if typeof(manifest) != TYPE_DICTIONARY or not manifest.has("sites"):
		push_error("Could not read %s (run `npm run terrain` first)" % MANIFEST_PATH)
		quit(1)
		return
	var failures := 0
	for site: Dictionary in manifest["sites"]:
		failures += _check_site(site)
	print("RESULT: %s" % ("OK" if failures == 0 else "%d problem(s)" % failures))
	quit(1 if failures > 0 else 0)


func _check_site(site: Dictionary) -> int:
	var path := TERRAIN_DIR.path_join(site["file"])
	var packed := load(path) as PackedScene
	if packed == null:
		print("✘ %s: could not load (not imported?)" % path)
		return 1
	var root := packed.instantiate()
	var problems: Array[String] = []

	var terrain := root.find_child("Terrain", true, false) as MeshInstance3D
	if terrain == null:
		problems.append("no MeshInstance3D named Terrain")
	else:
		var size_m: float = site["sizeM"]
		var relief_m: float = site["elevation"]["reliefM"]
		var aabb := terrain.mesh.get_aabb()
		if absf(aabb.size.x - size_m) > TOLERANCE_M or absf(aabb.size.z - size_m) > TOLERANCE_M:
			problems.append("footprint %.2f x %.2f m, expected %.0f m" % [aabb.size.x, aabb.size.z, size_m])
		if absf(aabb.size.y - relief_m) > TOLERANCE_M:
			problems.append("relief %.2f m, manifest says %.2f m" % [aabb.size.y, relief_m])
		var material := terrain.mesh.surface_get_material(0) as BaseMaterial3D
		if material == null or material.albedo_texture == null:
			problems.append("material has no albedo texture")

	var shapes := root.find_children("*", "CollisionShape3D", true, false)
	if shapes.is_empty() or not (shapes[0] as CollisionShape3D).shape is ConcavePolygonShape3D:
		problems.append("no trimesh collision (node must be named Terrain-col in the GLB)")
	elif shapes[0].get_parent() is not StaticBody3D:
		problems.append("collision shape is not under a StaticBody3D")

	if problems.is_empty():
		var faces := ((shapes[0] as CollisionShape3D).shape as ConcavePolygonShape3D).get_faces().size() / 3
		print("✔ %s: %s, collision %d triangles" % [site["id"], terrain.mesh.get_aabb().size, faces])
	else:
		print("✘ %s:" % site["id"])
		for problem in problems:
			print("    - %s" % problem)
	root.free()
	return 0 if problems.is_empty() else 1
