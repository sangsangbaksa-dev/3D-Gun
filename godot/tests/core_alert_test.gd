extends SceneTree
## Headless test: core arrow geometry + auto alert (banner, alarm cooldown, 50%/25% emphasis, clear after quiet).
## Run: godot --headless --path godot --fixed-fps 60 -s res://tests/core_alert_test.gd

const Alert := preload("res://scripts/core_alert.gd")
var game: Node
var frames := 0
var ok := {}

func _initialize() -> void:
	game = load("res://scenes/game.tscn").instantiate()
	root.add_child(game)
	game.prep_left = 9999.0

func _near(a: float, b: float) -> bool:
	return absf(a - b) < 0.01

func _process(_dt: float) -> bool:
	frames += 1
	if frames < 3:
		return false
	var cp: Node = game.get_node("CorePointer")
	# 순수 규칙: 방위, 가장자리 점, 투명도, 색
	ok.bearing = _near(Alert.bearing(0, 0, 0, -1, 0, -10), 0.0) and _near(Alert.bearing(0, 0, 0, -1, 10, 0), PI / 2) \
		and _near(absf(Alert.bearing(0, 0, 0, -1, 0, 10)), PI) and _near(Alert.bearing(0, 0, 0, -1, -10, 0), -PI / 2)
	var e := Alert.edge_point(PI / 2, 1000, 600, 40)
	ok.edge = _near(e.x, 960.0) and _near(e.y, 300.0) and Alert.edge_point(0, 1000, 600, 40).y < 41.0
	ok.alpha = Alert.distance_alpha(10) > 0.99 and Alert.distance_alpha(500) < 0.4 and Alert.distance_alpha(120) < Alert.distance_alpha(60)
	ok.color = Alert.hp_color(1.0).g > 0.8 and Alert.hp_color(0.1).r > 0.8 and Alert.hp_color(0.1).g < 0.3
	# 상태 기계
	var a := Alert.new()
	a.on_hp(500, 500)
	var ev := a.on_hp(480, 500)
	ok.hit = "hit" in ev and "alarm" in ev and a.active
	ev = a.on_hp(470, 500)
	ok.cooldown = "hit" in ev and not ("alarm" in ev)
	ev = a.on_hp(240, 500)
	ok.half = "half" in ev and "alarm" in ev and a.emphasis > 0.0
	ev = a.on_hp(100, 500)
	ok.quarter = "quarter" in ev and a.level == 2
	a.on_hp(200, 500)
	ok.heal_reset = a.level == 1
	for i in 300:
		a.update(0.02)
	ok.clear = not a.active
	# 실제 장면: 핵을 때리면 배너와 경보음
	var core = game.core
	game.player.global_position = Vector3(0, 1.5, 12)
	core.take_damage(10.0)
	cp.step(0.016)
	ok.scene_hit = cp.alert.active and cp.banner.visible and cp.alarms == 1
	core.take_damage(10.0)
	cp.step(0.016)
	ok.scene_cd = cp.alarms == 1
	core.take_damage(core.max_hp * 0.5)
	cp.step(0.016)
	ok.scene_half = cp.alarms == 2 and cp.sub.visible and cp.alert.level == 1
	ok.arrow = cp.shown
	for i in 400:
		cp.step(0.016)
	ok.scene_clear = not cp.alert.active and not cp.banner.visible
	var good := true
	for k in ok:
		if not ok[k]:
			good = false
			print("FAIL ", k)
	print("CORE_ALERT ", ok, " -> ", "PASS" if good else "FAIL")
	quit(0 if good else 1)
	return true
