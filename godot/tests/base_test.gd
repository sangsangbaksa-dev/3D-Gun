extends SceneTree
## Headless test for stage 4: gathering a node pays resources, the four buildings place on the grid
## (and bad spots are refused), turret / core upgrades swap the model, turrets kill lane zombies,
## and wave zombies break a barricade standing on their lane.
## Run: godot --headless --path godot --fixed-fps 60 -s res://tests/base_test.gd

var game: Node
var gd: Node
var frames := 0
var gather_ok := false
var reasons_ok := false
var place_ok := false
var upgrade_ok := false
var core_ok := false
var meta_ok := false
var barricade: Node
var barricade_hit := false
var turret_kills := 0
var start := 0

func _initialize() -> void:
	gd = root.get_node("GameData")
	game = load("res://scenes/game.tscn").instantiate()
	root.add_child(game)
	game.roamers.enabled = false # 구역 배회 좀비는 roamers_test 에서만
	game.rng.seed = 3
	game.prep_left = 9999.0

func _process(_dt: float) -> bool:
	frames += 1
	var p = game.player
	if frames == 3:
		# 채집: 나무 하나를 끝까지 벤다
		var tree: Dictionary = {}
		for n in game.gathering.nodes:
			if n.kind == "tree":
				tree = n
				break
		var before: int = game.res.wood
		while not game.gathering.harvest(tree, 0.1):
			pass
		var got: int = game.res.wood - before
		gather_ok = tree.state == "depleted" and got >= int(gd.gather.nodes.tree.yieldMin) and got <= int(gd.gather.nodes.tree.yieldMax)
		# 건설: 플레이어는 멀리, 자원은 넉넉히
		p.global_position = Vector3(-150, game.world.ground_y(-150, 150) + 0.3, 150)
		for r in game.res:
			game.res[r] = 999
		game.coins = 9999
		var spots := {"barricade": Vector3(10, 0, 0), "trap": Vector3(7, 0, 2), "tower": Vector3(6, 0, 4), "mgtower": Vector3(6, 0, -4)}
		var placed := 0
		for k in spots:
			var at: Vector3 = spots[k]
			at.y = game.world.ground_y(at.x, at.z)
			if game.base.check_spot(k, at.x, at.z) == "" and game.spend(gd.buildings[k].cost):
				var s: Node = game.base.spawn(k, at)
				placed += 1
				if k == "barricade":
					barricade = s
		place_ok = placed == 4 and game.base.structures.size() == 4
		reasons_ok = game.base.check_spot("tower", 6, 4) == "overlap" and game.base.check_spot("tower", 20, 0) == "outside" \
			and game.base.check_spot("tower", 1, 1) == "tooCloseCore"
		# 강화: 감시탑 Lv2 모델로 바뀌고, 핵은 Lv1 모델 + 체력 800
		var tower: Node = null
		for s in game.base.structures:
			if s.kind == "tower":
				tower = s
		upgrade_ok = tower != null and game.base.upgrade(tower) and tower.level == 2 and tower.model.get_child_count() > 0
		core_ok = game.base.upgrade_core() and game.base.core_level == 1 and is_equal_approx(game.core.max_hp, float(gd.core.hp[1]))
		if core_ok:
			game.set_core_level(game.base.core_level)
		# 영구 업그레이드: 내구도·체력 보너스가 새 포탑에 붙는다
		game.meta = {"turretAmmoMul": 0.5, "turretHpMul": 0.18}
		var t2: Node = game.base.spawn("tower", Vector3(-8, game.world.ground_y(-8, 0), 0))
		meta_ok = t2.ammo == roundi(float(gd.buildings.tower.turret.ammo) * 1.5) and t2.max_hp == roundf(float(gd.buildings.tower.hp) * 1.18)
		game.meta = {}
		game.base.demolish(t2)
		# 동쪽 레인(1)으로 좀비 무리
		game.wave = 3
		for i in 8:
			game.spawn_on_lane("normal", 1, false)
		start = frames
		return false
	if frames > 3:
		p.hp = p.max_hp
		if is_instance_valid(barricade) and barricade.hp < barricade.max_hp:
			barricade_hit = true
		if not is_instance_valid(barricade) or barricade.dead:
			barricade_hit = true
		turret_kills = game.kills
		if (barricade_hit and turret_kills >= 3) or frames - start > 60 * 90:
			var ok := gather_ok and reasons_ok and place_ok and upgrade_ok and core_ok and meta_ok and barricade_hit and turret_kills >= 3
			print("BASE gather=%s place=%s reasons=%s upgrade=%s core=%s meta=%s barricade_hit=%s turret_kills=%d res=%s -> %s" % [gather_ok, place_ok, reasons_ok, upgrade_ok, core_ok, meta_ok, barricade_hit, turret_kills, game.res, "PASS" if ok else "FAIL"])
			quit(0 if ok else 1)
	return false
