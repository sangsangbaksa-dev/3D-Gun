extends SceneTree
## Headless test for the rest of stage 4: zone roamers fill every danger zone and stay out of the wave count,
## the slow trap really slows a zombie, E-repair / upgrade next to a building works, the core regrows in prep,
## and turrets survive into the next run (meta.turrets round trip, without touching the save file).
## Run: godot --headless --path godot --fixed-fps 60 -s res://tests/roamers_test.gd

var game: Node
var frames := 0
var zone_ok := false
var wave_count_ok := false
var home_ok := false
var slow_ok := false
var action_ok := false
var regen_ok := false
var persist_ok := false
var trap_z: Node
var core_hp0 := 0.0

func _initialize() -> void:
	game = load("res://scenes/game.tscn").instantiate()
	root.add_child(game)
	game.rng.seed = 5
	game.prep_left = 99999.0
	game.player.global_position = Vector3(-150, game.world.ground_y(-150, 150) + 0.3, 150)
	game.roamers.freeze_dist = 1.0e9 # 멀어도 얼리지 않는다
	game.base.persist = false
	core_hp0 = game.core.max_hp * 0.5
	game.core.hp = core_hp0

func _want(zone: Dictionary) -> int:
	return maxi(0, floori(float(GameData.enemy_rules.roamPerDanger) * float(zone.danger)))

func _process(_dt: float) -> bool:
	frames += 1
	game.player.hp = game.player.max_hp
	if frames == 700: # 약 11초: 구역마다 2초에 한 마리씩 채워져 있어야 한다
		var have := {}
		for z in game.roamers.roamers():
			have[z.home.zone] = int(have.get(z.home.zone, 0)) + 1
		zone_ok = true
		var any_zone := false
		for zone in GameData.map.zones:
			if zone.kind == "base" or float(zone.danger) < 2.0:
				continue
			any_zone = true
			var want := _want(zone)
			# 플레이어와 48m 안의 자리는 건너뛰므로 적어도 한 마리, 최대 want 마리
			if int(have.get(zone.id, 0)) < 1 or int(have.get(zone.id, 0)) > want:
				zone_ok = false
				print("zone %s have=%d want=%d" % [zone.id, int(have.get(zone.id, 0)), want])
		zone_ok = zone_ok and any_zone
		wave_count_ok = game.alive == 0 and game.remaining() == 0
		home_ok = true
		for z in game.roamers.roamers():
			if z.wave_zombie or Vector2(z.global_position.x - float(z.home.x), z.global_position.z - float(z.home.z)).length() > float(z.home.r) + 8.0:
				home_ok = false
		# 감속 함정: 배회 좀비 한 마리 발밑에 함정을 놓는다
		trap_z = game.roamers.roamers()[0]
		var at: Vector3 = trap_z.global_position
		game.base.spawn("trap", at)
		# E 수리/강화: 핵 곁에 다친 감시탑
		for r in game.res:
			game.res[r] = 999
		game.coins = 9999
		var tw: Node = game.base.spawn("tower", Vector3(6, game.world.ground_y(6, 4), 4))
		tw.hp = tw.max_hp * 0.4
		game.player.global_position = Vector3(8, game.world.ground_y(8, 4) + 0.3, 4)
		var near: Node = game.base.actionable_near(game.player.global_position)
		var a: Dictionary = game.base.building_action(tw) if near == tw else {}
		var wood: int = game.res.wood
		var fixed: bool = a.get("kind", "") == "repair" and game.base.perform(tw, a) and is_equal_approx(tw.hp, tw.max_hp) and game.res.wood < wood
		var a2: Dictionary = game.base.building_action(tw)
		var up: bool = a2.get("kind", "") == "upgrade" and game.base.perform(tw, a2) and tw.level == 2
		action_ok = fixed and up
		# 포탑 저장 → 새 판에서 복원
		game.base.persist = true
		game.base.persist_turrets(false) # now=false: 저장소에는 쓰지 않고 meta.turrets 만 채운다
		var saved: Array = Save.meta.get("turrets", [])
		var entry: Dictionary = saved[0] if saved.size() > 0 else {}
		var snap_ok: bool = saved.size() == 1 and entry.get("kind") == "tower" and int(entry.get("level", 0)) == 2 and int(entry.get("ammo", 0)) == tw.ammo
		var ammo := tw.ammo
		game.base.persist = false # 철거가 파일을 쓰지 않게
		game.base.demolish(tw)
		game.base.persist = true
		game.base.persist_turrets(false)
		var gone: bool = Save.meta.get("turrets", []).size() == 0
		Save.meta["turrets"] = [entry]
		game.base.restore_turrets()
		var back: Node = null
		for s in game.base.structures:
			if s.kind == "tower" and s.level == 2:
				back = s
		persist_ok = snap_ok and gone and back != null and back.ammo == ammo
		game.base.persist = false
		game.base._save_dirty = false
		Save.meta["turrets"] = []
		game.player.global_position = Vector3(-150, game.world.ground_y(-150, 150) + 0.3, 150)
	if frames == 760:
		slow_ok = is_instance_valid(trap_z) and trap_z.slow_mul < 1.0
		# 준비 단계 핵 자연 회복 (0.5초마다 0.6%): 11초 동안 반드시 늘어났다
		regen_ok = game.core.hp > core_hp0
		var ok := zone_ok and wave_count_ok and home_ok and slow_ok and action_ok and regen_ok and persist_ok
		print("ROAMERS zones=%s wave_count=%s home=%s slow=%s action=%s regen=%s persist=%s roamers=%d -> %s" % [zone_ok, wave_count_ok, home_ok, slow_ok, action_ok, regen_ok, persist_ok, game.roamers.roamers().size(), "PASS" if ok else "FAIL"])
		quit(0 if ok else 1)
	return false
