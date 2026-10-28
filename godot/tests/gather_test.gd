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
		ok.particles = g.fx != null and g.fx.particle_count >= 15
		ok.falls = g.fx._falls.size() >= 1
		ok.shake = g.fx._shake > 0.0
	if frames == 5 + 200:
		ok.cleared = game.gathering.fx._falls.size() == 0
		var pass_ := true
		for k in ok:
			pass_ = pass_ and ok[k]
		print("GATHER ", ok, " hits=", hits, " -> ", "PASS" if pass_ else "FAIL")
		quit(0 if pass_ else 1)
	return false
