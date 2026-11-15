extends SceneTree
## Checks that every generated sound in assets/audio/manifest.json imports into
## Godot as the game expects: loops loop (from the WAV "smpl" chunk), one-shots
## don't, and lengths and mix rates match the manifest.
##
## Run from the repository root, after `godot --headless --path godot --import`:
##   godot --headless --path godot --script "$PWD/tools/godot/check_audio.gd"

const AUDIO_DIR := "res://assets/audio"
const LENGTH_TOLERANCE_S := 0.01


func _initialize() -> void:
	var manifest_path := AUDIO_DIR.path_join("manifest.json")
	var manifest: Variant = JSON.parse_string(FileAccess.get_file_as_string(manifest_path))
	if not manifest is Dictionary:
		push_error("Could not read %s" % manifest_path)
		quit(1)
		return

	var failures := 0
	for stem: Dictionary in manifest["stems"]:
		failures += _check_stream(
			stem["file"], stem["kind"] == "loop", float(stem["durationS"]), int(stem["sampleRate"])
		)
	var geiger: Dictionary = manifest["geiger"]
	for file: String in geiger["files"]:
		failures += _check_stream(file, false, -1.0, int(geiger["sampleRate"]))

	print("RESULT: %s" % ("OK" if failures == 0 else "%d problem(s)" % failures))
	quit(1 if failures > 0 else 0)


func _check_stream(file: String, should_loop: bool, duration_s: float, mix_rate: int) -> int:
	var path := AUDIO_DIR.path_join(file)
	var stream := load(path) as AudioStreamWAV
	if stream == null:
		print("✘ %s: could not load as AudioStreamWAV (not imported?)" % path)
		return 1

	var problems: Array[String] = []
	var looping := stream.loop_mode != AudioStreamWAV.LOOP_DISABLED
	if looping != should_loop:
		problems.append("loop_mode=%d, expected %s" % [stream.loop_mode, "loop" if should_loop else "none"])
	# Loops are written as N + 1 frames with points 0..N (see closeLoop in
	# tools/audio/lib/wav.mjs): Godot then repeats exactly N frames per cycle.
	if should_loop and stream.loop_begin != 0:
		problems.append("loop_begin=%d, expected 0" % stream.loop_begin)
	if should_loop and stream.loop_end - stream.loop_begin != roundi(duration_s * mix_rate):
		problems.append("loop period %d frames, expected %d" % [stream.loop_end - stream.loop_begin, roundi(duration_s * mix_rate)])
	if stream.mix_rate != mix_rate:
		problems.append("mix_rate=%d, expected %d" % [stream.mix_rate, mix_rate])
	if duration_s > 0.0 and absf(stream.get_length() - duration_s) > LENGTH_TOLERANCE_S:
		problems.append("length %.3f s, expected %.3f s" % [stream.get_length(), duration_s])

	if problems.is_empty():
		var loop_info := " loop %d–%d" % [stream.loop_begin, stream.loop_end] if looping else ""
		print("✔ %s: %.2f s, %d Hz, %s%s" % [file, stream.get_length(), stream.mix_rate, "stereo" if stream.stereo else "mono", loop_info])
		return 0
	print("✘ %s: %s" % [file, ", ".join(problems)])
	return 1
