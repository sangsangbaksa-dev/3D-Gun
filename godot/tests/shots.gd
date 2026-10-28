extends SceneTree
## Visual check: renders a few fixed camera views of the sortie and saves PNGs.
## Needs a display (not --headless). In a container: xvfb-run -s "-screen 0 1280x720x24" godot --path godot -s res://tests/shots.gd
## OUT=/some/dir picks the output folder (default user://shots).
## Web build (preset "WebShots", args -s res://tests/shots.gd): prints "SHOT <name>" and holds the view 2 s
## so a browser script can take the screenshot (Godot's own capture skips the web canvas's colour output).

var game: Node
var frames := 0
var out := ""
var shots: Array = []
var idx := 0
var wait := 0
var _placed := false

func _initialize() -> void:
	out = OS.get_environment("OUT") if OS.has_environment("OUT") else ProjectSettings.globalize_path("user://shots")
	DirAccess.make_dir_recursive_absolute(out)
	game = load("res://scenes/game.tscn").instantiate()
	root.add_child(game)
	game.roamers.enabled = false # 구역 배회 좀비는 roamers_test 에서만
	game.rng.seed = 2
	# [이름, 플레이어 위치 오프셋(xz, 시작점 기준), 바라볼 방향(yaw 도), 피치(도), 대기 프레임, 할 일]
	shots = [
		["spawn", Vector2(0, -3), 180.0, -4.0, 30, ""],
		["base", Vector2(0, 0), 0.0, -12.0, 10, ""],
		["field", Vector2(30, -40), 200.0, -2.0, 10, ""],
		["combat", Vector2(0, 0), 180.0, -6.0, 600, "wave"],
		["lineup", Vector2(0, 0), 180.0, -8.0, 10, "lineup"],
	]
	for a in OS.get_cmdline_user_args():
		if a.begins_with("--shots="):
			var only := a.substr(8).split(",")
			shots = shots.filter(func(x): return x[0] in only)
	if OS.has_environment("SHOTS"):
		var only := OS.get_environment("SHOTS").split(",")
		shots = shots.filter(func(x): return x[0] in only)

func _process(_dt: float) -> bool:
	frames += 1
	if frames < 5:
		return false
	if idx >= shots.size():
		return true
	var s: Array = shots[idx]
	var p: CharacterBody3D = game.player
	if wait == 0 and not _placed:
		_placed = true
		var ps: Dictionary = game.get_node("/root/GameData").map.playerStart
		var o: Vector2 = s[1]
		var x := float(ps.x) + o.x
		var z := float(ps.z) + 3.0 + o.y
		p.position = Vector3(x, game.world.ground_y(x, z) + 0.3, z)
		p.rotation.y = deg_to_rad(s[2])
		p.camera.rotation.x = deg_to_rad(s[3])
		if s[5] == "wave" and game.phase == "prep":
			game.prep_left = 0.0
		if s[5] == "lineup":
			_lineup(p)
		wait = int(s[4])
	wait -= 1
	if s[5] == "wave":
		p.hp = p.max_hp
	if wait <= 0:
		if OS.has_feature("web"):
			if wait == 0:
				print("SHOT ", s[0])
			if wait > -120:
				return false
		else:
			var img := root.get_texture().get_image()
			img.save_png(out.path_join("%s.png" % s[0]))
			print("shot ", s[0])
		idx += 1
		wait = 0
		_placed = false
		return false
	return false

## Every zombie type in a row in front of the player, frozen.
func _lineup(p: CharacterBody3D) -> void:
	for z in game.zombies_root.get_children():
		z.queue_free()
	var types: Array = ["normal", "runner", "fatty", "crawler", "swarmer", "leaper", "spitter", "bomber", "screamer", "tank"]
	var fwd := -p.global_transform.basis.z
	var right := p.global_transform.basis.x
	for i in types.size():
		var pos: Vector3 = p.position + fwd * (9.0 + (i % 2) * 3.0) + right * ((i - 4.5) * 1.6)
		pos.y = game.world.ground_y(pos.x, pos.z)
		var z = game.spawn_zombie(types[i], pos, -1, false)
		if z:
			z.look_at(Vector3(p.position.x, pos.y, p.position.z), Vector3.UP, true)
			z.set_physics_process(false)
			z.set_process(false)
