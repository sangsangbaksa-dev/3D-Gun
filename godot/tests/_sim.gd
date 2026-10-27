extends SceneTree
var game: Node
var gd: Node
var frames := 0
var built := false
var max_alive := 0
var wave_log := {}
var t_acc := 0.0
var worst := 0.0
func _initialize() -> void:
	gd = root.get_node("GameData")
	game = load("res://scenes/game.tscn").instantiate()
	root.add_child(game)
	game.rng.seed = 11
func _process(dt: float) -> bool:
	frames += 1
	var p = game.player
	var t0 := Time.get_ticks_usec()
	if frames == 3:
		Input.mouse_mode = Input.MOUSE_MODE_CAPTURED
		p.global_position = Vector3(-150, game.world.ground_y(-150, 150) + 0.3, 150)
	p.hp = p.max_hp
	if game.phase == "prep":
		if not built or game.wave % 3 == 0:
			for r in game.res: game.res[r] = 200
			game.coins = 500
			var spots := [Vector3(8,0,0),Vector3(0,0,8),Vector3(0,0,-8),Vector3(-8,0,0),Vector3(6,0,6),Vector3(-6,0,-6),Vector3(6,0,-6),Vector3(-6,0,6)]
			for s in spots:
				var k: String = "mgtower" if int(s.x + s.z) % 4 == 0 else "tower"
				s.y = game.world.ground_y(s.x, s.z)
				if game.base.check_spot(k, s.x, s.z) == "":
					game.spend(gd.buildings[k].cost); game.base.spawn(k, s)
			built = true
		game.prep_left = 0.0
	max_alive = maxi(max_alive, game.alive)
	var w: int = game.wave
	if not wave_log.has(w): wave_log[w] = {"f0": frames, "core": game.core.hp, "structs": game.base.structures.size()}
	var ms := (Time.get_ticks_usec() - t0) / 1000.0
	worst = maxf(worst, ms)
	if frames % 3000 == 0:
		print("f=%d wave=%d phase=%s alive=%d kills=%d core=%.0f structs=%d worst_ms=%.1f" % [frames, game.wave, game.phase, game.alive, game.kills, game.core.hp, game.base.structures.size(), worst])
	if game.wave >= 12 or frames > 60 * 60 * 20 or game.core_dead:
		print("END frames=%d wave=%d kills=%d core=%.0f/%.0f structs=%d max_alive=%d dead=%s" % [frames, game.wave, game.kills, game.core.hp, game.core.max_hp, game.base.structures.size(), max_alive, game.core_dead])
		print(wave_log)
		quit()
	return false
