extends SceneTree
## 시각 QA 용 자유 카메라 스크린샷 (데스크톱 xvfb): CASES=aerial,reload ... 로 고른다. OUT=폴더.
## xvfb-run -s "-screen 0 1280x720x24" godot --path godot --rendering-driver opengl3 --resolution 1280x720 -s res://tests/qa_shots.gd
var game: Node
var frames := 0
var idx := 0
var wait := 0
var out := ""
var cases: Array = []
var cam: Camera3D

func _initialize() -> void:
	out = OS.get_environment("OUT") if OS.has_environment("OUT") else ProjectSettings.globalize_path("user://shots")
	DirAccess.make_dir_recursive_absolute(out)
	game = load("res://scenes/game.tscn").instantiate()
	root.add_child(game)
	game.ready.connect(func(): game.roamers.enabled = false)
	game.rng.seed = 2
	cases = OS.get_environment("CASES").split(",") if OS.has_environment("CASES") else ["aerial"]

func _snap(n: String) -> void:
	root.get_texture().get_image().save_png(out.path_join(n + ".png"))
	print("shot ", n)

func _free_cam(pos: Vector3, look: Vector3) -> void:
	if cam == null:
		cam = Camera3D.new()
		cam.far = 600.0
		root.add_child(cam)
	cam.global_position = pos
	cam.look_at(look, Vector3.UP)
	cam.current = true

func _process(_dt: float) -> bool:
	frames += 1
	if frames < 8:
		return false
	if idx >= cases.size():
		return true
	var c: String = cases[idx]
	wait += 1
	var ps: Dictionary = game.get_node("/root/GameData").map.playerStart
	var p: CharacterBody3D = game.player
	if c.begins_with("rl_") or c.begins_with("fire_"): # rl_<총>_<진행도%> / fire_<총>
		var parts := c.split("_")
		var gid: String = parts[1]
		if wait == 1:
			p.owned[gid] = true
			p.mags[gid] = 5
			p.switch_weapon(gid)
			p.position = Vector3(float(ps.x), game.world.ground_y(float(ps.x), float(ps.z)) + 0.3, float(ps.z) + 8.0)
			p.rotation.y = deg_to_rad(180.0)
			p.camera.rotation.x = deg_to_rad(-6.0)
			p.dead = false
		if c.begins_with("rl_"):
			var f := float(parts[2]) / 100.0
			if wait == 40:
				p.cooldown = 0.0
				p.ammo = 0
				p._start_reload()
			if wait > 40:
				p.reload_left = p._reload_total * (1.0 - f)
			if wait > 46:
				_snap("qa_" + c)
				idx += 1
				wait = 0
		else:
			if wait == 40:
				p.cooldown = 0.0
				p.ammo = p.mag_size(gid)
				p.reload_left = 0.0
				p._try_fire()
			if wait > 40 and wait < 44:
				p._flash_t = 0.03
			if wait == 43:
				_snap("qa_" + c)
				idx += 1
				wait = 0
		return false
	match c:
		"aerial":
			_free_cam(Vector3(0, 30, 45), Vector3(0, 0, 0))
			if wait > 20:
				_snap("qa_aerial")
				idx += 1
				wait = 0
		"edge": # 맵 가장자리 바깥을 내다본다
			var h: float = game.world.half
			_free_cam(Vector3(h - 8.0, game.world.ground_y(h - 8.0, 0.0) + 1.7, 0), Vector3(h + 80.0, 6.0, 0))
			if wait > 20:
				_snap("qa_edge")
				idx += 1
				wait = 0
	return false
