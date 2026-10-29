extends SceneTree
## Headless test: 웹 키맵에서 옮겨 온 G 약초 응급처치, C 백신 등급 순환, Q 아군 역할 순환.
## Run: godot --headless --path godot --fixed-fps 60 -s res://tests/controls_test.gd

var game: Node
var frames := 0
var ok := {}

func _initialize() -> void:
	root.get_node("Save").meta.allies = []
	game = load("res://scenes/game.tscn").instantiate()
	root.add_child(game)
	game.ready.connect(func(): game.roamers.enabled = false)

func _process(_dt: float) -> bool:
	frames += 1
	if frames == 5:
		var hh: Dictionary = root.get_node("GameData").herb_heal
		ok.data = int(hh.cost) == 3 and is_equal_approx(float(hh.healPct), 0.4) and float(hh.cooldown) == 6.0
		# G: 체력이 가득이면 못 쓴다
		game.res.herb = 10
		ok.full = not game.herb_heal() and game.res.herb == 10
		# 약초 부족
		game.player.hp = 10.0
		game.res.herb = 2
		ok.need = not game.herb_heal() and game.player.hp == 10.0
		# 성공: 약초 3개, 체력 +40% (최대 체력 기준)
		game.res.herb = 7
		var mx: float = game.player.max_hp
		ok.heal = game.herb_heal() and game.res.herb == 4 and is_equal_approx(game.player.hp, 10.0 + mx * 0.4)
		# 재사용 대기
		ok.cooldown = not game.herb_heal() and game.res.herb == 4 and game.herb_cd > 5.0
		# 최대 체력을 넘지 않는다
		game.herb_cd = 0.0
		game.player.hp = mx - 3.0
		ok.clamp = game.herb_heal() and is_equal_approx(game.player.hp, mx)
		# C: 보유한 등급만 순환
		game.allies.vaccines = [2, 0, 1]
		game.allies.tier = 0
		game.allies.cycle_tier()
		ok.cycle1 = game.allies.tier == 2
		game.allies.cycle_tier()
		ok.cycle2 = game.allies.tier == 0
		game.allies.vaccines = [0, 0, 0]
		game.allies.cycle_tier()
		ok.cycle_none = game.allies.next_owned_tier(-1) == -1
		# Q: 가까운 아군 역할이 다음 칸으로
		var pl: Vector3 = game.player.global_position
		var a: Node = game.allies.spawn(pl + Vector3(2, 0, 0), "normal", "fighter")
		var order: Array = game.allies.data.allyRoleOrder
		game.allies.cycle_nearest_role(pl)
		ok.role = a.role != "fighter" and a.role in order
	if frames >= 8:
		var pass_ := true
		for k in ok:
			pass_ = pass_ and ok[k]
		print("CONTROLS ", ok, " -> ", "PASS" if pass_ else "FAIL")
		quit(0 if pass_ else 1)
	return false
