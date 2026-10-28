extends SceneTree
## 채집 연출 테스트: 종류별로 타격 파편·카메라 흔들림·완료 조각이 나오는지.
## Run: godot --headless --path godot --fixed-fps 60 -s res://tests/gather_test.gd
var game: Node
var frames := 0
var ok := {}
var kinds := ["tree", "rock", "iron", "herb", "wreck"]
var hits := 0

func _initialize() -> void:
	game = load("res://scenes/game.tscn").instantiate()
	root.add_child(game)

func _process(_dt: float) -> bool:
	frames += 1
	if frames == 5:
		var g = game.gathering
		g.hit.connect(func(_n): hits += 1)
		for k in kinds:
			var nd = null
			for n in g.nodes:
				if n.kind == k:
					nd = n
					break
			game.player.global_position = nd.pos + Vector3(nd.r + 1.0, 0, 0)
			var done := false
			var c := 0
			while not done and c < 2000:
				done = g.harvest(nd, 1.0 / 60.0)
				c += 1
			ok[k] = done and nd.state == "depleted"
		ok.hits = hits >= 8
		var t2 = null # 끝까지 안 캔 나무 하나를 살짝 치는 중으로 둔다 (도구가 올라와 있어야 함)
		for n in g.nodes:
			if n.kind == "tree" and n.state == "ready":
				t2 = n
				break
		game.player.global_position = t2.pos + Vector3(t2.r + 1.0, 0, 0)
		g.harvest(t2, 0.1)
		ok.tool_view = g.tool_view != null and g.gather_hud != null
		ok.tool_active = game.player.tool_active == false # 첫 프레임 전: 아직 _process 안 돌았음
		ok.hud_icons = g.gather_hud.launched >= 5
		ok.particles = g.fx != null and g.fx.particle_count >= 15
		ok.falls = g.fx._falls.size() >= 1
		ok.shake = g.fx._shake > 0.0
	if frames == 7:
		# 스윙 자세: 타격 순간(impact)에 도구가 가장 앞으로 숙여지고, 들어올림 끝(windup)에 가장 뒤로 젖혀진다
		var TV = load("res://scripts/tool_view.gd")
		var FX = load("res://scripts/gather_fx.gd")
		var swing_ok := true
		for k in kinds:
			var K: Dictionary = FX.KIND[k]
			var up: float = TV.swing_pose(k, K.windup).rot.x
			var hit_x: float = TV.swing_pose(k, K.impact).rot.x
			var rest: float = TV.swing_pose(k, 0.0).rot.x
			swing_ok = swing_ok and up > rest and hit_x < rest
		ok.swing_pose = swing_ok
	if frames == 8:
		ok.tool_equips = game.player.tool_active # 마지막 채집 직후 150ms 안: 도구를 든다
		ok.gun_hidden = not game.player.view_model.visible
	if frames == 5 + 200:
		ok.tool_put_away = not game.player.tool_active and game.player.view_model.visible
		ok.arrived = game.gathering.gather_hud.arrived >= 5
		ok.recoil_reset = true
		for nn in game.gathering.nodes:
			if nn.state == "ready" and nn.fx_on and nn.progress <= 0.0 and nn.recoil <= 0.0:
				ok.recoil_reset = false
		ok.cleared = game.gathering.fx._falls.size() == 0
		var pass_ := true
		for k in ok:
			pass_ = pass_ and ok[k]
		print("GATHER ", ok, " hits=", hits, " -> ", "PASS" if pass_ else "FAIL")
		quit(0 if pass_ else 1)
	return false
