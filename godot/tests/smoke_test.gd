extends SceneTree
## Headless smoke test: load the sortie, let a bot aim at the nearest zombie and shoot,
## and check that waves spawn, zombies die, coins come in, and zombies can hurt the player.
## Run: godot --headless --path godot --fixed-fps 60 -s res://tests/smoke_test.gd

var game: Node
var frames := 0
var hurt_seen := false

func _initialize() -> void:
	game = load("res://scenes/game.tscn").instantiate()
	root.add_child(game)

func _process(_dt: float) -> bool:
	frames += 1
	if frames == 2:
		Input.mouse_mode = Input.MOUSE_MODE_CAPTURED
		game.player.hurt.connect(func(_hp): hurt_seen = true)
	var p = game.player
	if frames > 2 and not p.dead:
		var best: Node3D = null
		var best_d := INF
		for z in game.zombies_root.get_children():
			if z.dead:
				continue
			var d: float = z.global_position.distance_to(p.global_position)
			if d < best_d:
				best_d = d
				best = z
		# 처음 한 대 맞을 때까지는 좀비가 다가오게 두고(피격 확인), 그 뒤로는 쏜다
		if best and hurt_seen:
			var aim: Vector3 = best.global_position + Vector3(0, 1.2 * best.scale_k, 0)
			p.look_at(Vector3(aim.x, p.global_position.y, aim.z), Vector3.UP)
			var flat := Vector2(aim.x - p.camera.global_position.x, aim.z - p.camera.global_position.z).length()
			p.camera.rotation.x = atan2(aim.y - p.camera.global_position.y, flat)
			p.bloom = 0.0
			p._try_fire()
	if frames >= 60 * 75 or p.dead:
		var ok: bool = game.wave >= 1 and game.kills > 0 and game.coins > 0 and hurt_seen
		print("SMOKE wave=%d kills=%d coins=%d alive=%d hp=%.0f hurt_seen=%s dead=%s -> %s" % [game.wave, game.kills, game.coins, game.alive, p.hp, hurt_seen, p.dead, "PASS" if ok else "FAIL"])
		quit(0 if ok else 1)
	return false
