extends SceneTree
## Headless test: tutorial rules (steps advance on conditions), first-sortie gating, settings off switch, HUD in the game scene, intro skip.
## Run: godot --headless --path godot --fixed-fps 60 -s res://tests/tutorial_test.gd

var Rules: GDScript
var Intro: GDScript
var game: Node
var frames := 0
var ok := {}
var saved_settings := {}
var saved_meta := {}
var saved_path := ""

func _initialize() -> void:
	pass

func _process(_dt: float) -> bool:
	frames += 1
	if frames == 1:
		var save0: Node = root.get_node("Save")
		saved_settings = save0.settings.duplicate(true)
		saved_meta = save0.meta.duplicate(true)
		saved_path = save0.save_path
		save0.save_path = "user://tutorial_test_save.json" # 저장 파일을 건드리지 않는다
		Rules = load("res://scripts/tutorial.gd")
		Intro = load("res://scripts/intro.gd")
		_pure_rules()
		_gating()
		_intro_skip()
		var save: Node = root.get_node("Save")
		save.settings.tutorial = true
		save.settings.tutorial_force = false
		save.meta.totalRuns = 0.0
		game = load("res://scenes/game.tscn").instantiate()
		root.add_child(game)
		game.prep_left = 9999.0
		return false
	if frames < 4:
		return false
	return _scene()

func _pure_rules() -> void:
	var r = Rules.new()
	ok.start = r.current() == "move"
	var o := {"moved": 0.0, "turned": 0.0, "shots": 0, "reloads": 0, "core_dwell": 0.0, "gathered": 0, "built": 0, "wave": 0, "prep": true, "allies": 0}
	r.update(o, 0.1)
	ok.wait = r.current() == "move"
	o.moved = 7.0 # 걷기만 하고 시점을 안 돌리면 안 넘어감
	r.update(o, 0.1)
	ok.need_turn = r.current() == "move"
	o.turned = 1.5
	r.update(o, 0.1)
	ok.to_shoot = r.current() == "shoot"
	o.shots = 5 # 쏘기만 하고 재장전 안 하면 그대로
	r.update(o, 0.1)
	ok.need_reload = r.current() == "shoot"
	o.reloads = 1
	r.update(o, 0.1)
	ok.to_core = r.current() == "core"
	o.core_dwell = 7.0
	r.update(o, 0.1)
	ok.to_gather = r.current() == "gather"
	o.gathered = 1
	r.update(o, 0.1)
	ok.to_build = r.current() == "build"
	o.built = 1
	r.update(o, 0.1)
	ok.to_wave = r.current() == "wave"
	o.wave = 1
	r.update(o, 0.1)
	ok.to_ally = r.current() == "ally"
	o.allies = 1
	r.update(o, 0.1)
	ok.finished = r.finished and r.current() == ""
	# 건설 단계는 전투 중이면 건너뜀, 마지막 단계는 시간이 지나면 끝
	var r2 = Rules.new()
	for i in 3:
		r2.skip()
	ok.skip3 = r2.current() == "gather"
	o = {"gathered": 1, "prep": false}
	r2.update(o, 0.1)
	ok.combat_skips_build = r2.current() == "wave"
	var r3 = Rules.new()
	for i in 6:
		r3.skip()
	r3.update({}, Rules.ALLY_SHOW_S + 1.0)
	ok.ally_timeout = r3.finished

func _gating() -> void:
	ok.gate_first = Rules.enabled({}, {"totalRuns": 0})
	ok.gate_later = not Rules.enabled({}, {"totalRuns": 3})
	ok.gate_off = not Rules.enabled({"tutorial": false}, {"totalRuns": 0})
	ok.gate_force = Rules.enabled({"tutorial_force": true}, {"totalRuns": 5})
	var save: Node = root.get_node("Save")
	save.meta.totalRuns = 0.0
	save.settings.intro_seen = false
	save.settings.intro_force = false
	ok.intro_first = Intro.should_play()
	save.settings.intro_seen = true
	ok.intro_once = not Intro.should_play()
	save.settings.intro_force = true # 설정의 다시 보기
	ok.intro_replay = Intro.should_play()
	save.settings.intro_force = false
	save.settings.intro_seen = false
	save.meta.totalRuns = 2.0
	ok.intro_later = not Intro.should_play()
	save.meta.totalRuns = 0.0

func _intro_skip() -> void:
	var save: Node = root.get_node("Save")
	save.settings.intro_seen = false
	var state := {"done": false}
	var intro: Node = Intro.play(root, func(): state.done = true)
	var e := InputEventKey.new()
	e.pressed = true
	e.keycode = KEY_SPACE
	intro._input(e) # 막 뜬 직후엔 무시 (출격을 누른 키)
	ok.intro_ignores_first = not state.done
	intro._age = 1.0
	intro._input(e)
	ok.intro_skip = state.done and intro.skipped and save.settings.intro_seen
	intro.queue_free()

func _scene() -> bool:
	var hud: Node = game.get_node_or_null("TutorialHud")
	ok.hud_exists = hud != null
	if hud == null:
		return _report()
	ok.card_move = hud.shown_id == "move" and hud.card.visible and hud.keys_row.get_child_count() == 2
	ok.ignores_mouse = hud.card.mouse_filter == Control.MOUSE_FILTER_IGNORE
	# 걷고 돌고 쏘고 재장전
	for i in 3:
		game.player.global_position += Vector3(3, 0, 0)
		hud.step(0.016)
	game.player.rotation.y += 2.0
	hud.step(0.016)
	ok.scene_move = hud.shown_id == "shoot"
	for i in 3:
		game.player.fired.emit(Vector3.ZERO, Vector3.ZERO, false, false, false, [])
	game.player.reload_left = 1.0
	hud.step(0.016)
	ok.scene_shoot = hud.shown_id == "core"
	hud.step(7.0)
	ok.scene_core = hud.shown_id == "gather"
	game.gathering.gathered.emit("wood", 1, Vector3.ZERO)
	hud.step(0.016)
	ok.scene_gather = hud.shown_id == "build"
	game.base.spawn("tower", Vector3(6, 0, 6))
	hud.step(0.016)
	ok.scene_build = hud.shown_id == "wave"
	# 한/영 문구
	var I: Node = root.get_node("I18n")
	I.locale = "ko"
	hud._show("wave", false)
	var ko: String = hud.lbl_title.text
	I.locale = "en"
	hud._show("wave", false)
	ok.i18n = ko != hud.lbl_title.text and hud.lbl_title.text == "Start the wave"
	# H 로 넘기기
	var e := InputEventKey.new()
	e.pressed = true
	e.keycode = KEY_H
	hud._unhandled_input(e)
	ok.skip_key = hud.shown_id == "ally"
	hud._unhandled_input(e)
	ok.ends = hud.rules.finished and not hud.card.visible
	# 첫 출격이 아니면 HUD 가 만들어지지 않는다
	var save: Node = root.get_node("Save")
	save.meta.totalRuns = 4.0
	ok.not_first = load("res://scripts/tutorial_hud.gd").apply(game) == null
	save.meta.totalRuns = 0.0
	save.settings.tutorial = false
	ok.off = load("res://scripts/tutorial_hud.gd").apply(game) == null
	return _report()

func _report() -> bool:
	var save: Node = root.get_node("Save")
	save.settings = saved_settings # 사용자의 설정을 되돌린다
	save.save_settings()
	save.meta = saved_meta
	save.save_path = saved_path
	var bad := []
	for k in ok:
		if not ok[k]:
			bad.append(k)
	print("TUTORIAL %d checks, failed=%s -> %s" % [ok.size(), bad, "PASS" if bad.is_empty() else "FAIL"])
	quit(0 if bad.is_empty() else 1)
	return true
