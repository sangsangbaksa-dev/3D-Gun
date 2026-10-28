extends SceneTree
## Headless smoke test: load the sortie, let a bot aim at the nearest zombie and shoot,
## and check that waves spawn, zombies die, coins come in, zombies can hurt the player,
## every gun can be bought from the weapon panel and lands hits, and upgrades raise damage.
## Run: godot --headless --path godot --fixed-fps 60 -s res://tests/smoke_test.gd

var game: Node
var frames := 0
var hurt_seen := false
var hits_by_gun := {}
var upgrade_ok := false
var gd: Node # 자동 로드는 -s 스크립트에서 이름으로 못 쓴다

func _initialize() -> void:
	gd = root.get_node("GameData")
	game = load("res://scenes/game.tscn").instantiate()
	root.add_child(game)
	game.ready.connect(func(): game.roamers.enabled = false) # 구역 배회 좀비는 roamers_test 에서만
	game.rng.seed = int(OS.get_environment("SEED")) if OS.has_environment("SEED") else 1

func _process(_dt: float) -> bool:
	frames += 1
	var p = game.player
	if frames == 2:
		Input.mouse_mode = Input.MOUSE_MODE_CAPTURED
		game.prep_left = 5.0 # 건설 시간 60초는 건너뛴다
		p.hurt.connect(func(_hp): hurt_seen = true)
		p.fired.connect(func(_f, _t, hit, _h, _k, _a): if hit: hits_by_gun[p.gun_id] = hits_by_gun.get(p.gun_id, 0) + 1)
	if hurt_seen and p.hp < 60:
		p.hp = p.max_hp # 무기 시험이 끝날 때까지 버티게
	# 15초: 코인을 넣고 강화창으로 모든 총을 사고 권총을 한 번 강화한다
	if frames == 60 * 15:
		game.coins = 99999
		var before: float = p.stats("pistol").dmg
		for id in gd.gun_order:
			if not p.owned.get(id, false):
				game.shop._buy(id, int(gd.gun_unlock_gold[id]))
		game.shop._upgrade("pistol", int(gd.gun_upgrade.gold[0]))
		upgrade_ok = p.stats("pistol").dmg > before and p.lv["pistol"] == 1
	# 그 뒤로 지금 총이 좀비를 맞히면 다음 총으로 바꾼다
	if frames > 60 * 15 and hits_by_gun.get(p.gun_id, 0) > 0 and frames % 30 == 0:
		var i: int = (gd.gun_order.find(p.gun_id) + 1) % gd.gun_order.size()
		p.switch_weapon(gd.gun_order[i])
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
	var all_guns := true
	for id in gd.gun_order:
		all_guns = all_guns and hits_by_gun.get(id, 0) > 0
	if frames >= 60 * 150 or p.dead or (all_guns and frames > 60 * 40):
		var ok: bool = game.wave >= 1 and game.kills > 0 and hurt_seen and all_guns and upgrade_ok
		print("SMOKE wave=%d kills=%d coins=%d hp=%.0f hurt_seen=%s upgrade=%s hits=%s dead=%s -> %s" % [game.wave, game.kills, game.coins, p.hp, hurt_seen, upgrade_ok, hits_by_gun, p.dead, "PASS" if ok else "FAIL"])
		quit(0 if ok else 1)
	return false
