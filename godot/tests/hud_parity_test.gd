extends SceneTree
## Headless: prep bar tracks prep_left / prep_total; wave clear copy matches web i18n keys.
## Run: godot --headless --path godot --fixed-fps 60 -s res://tests/hud_parity_test.gd

var game: Node
var frames := 0
var ok := {}
var i18n: Node

func _initialize() -> void:
	i18n = root.get_node("I18n")
	game = load("res://scenes/game.tscn").instantiate()
	root.add_child(game)

func _process(_dt: float) -> bool:
	frames += 1
	if frames < 4:
		return false
	var prep: Node = game.get_node("PrepHud")
	ok.total = prep.prep_total >= 60.0
	game.prep_left = 30.0
	prep.set_prep_total(60.0)
	prep._process(0.016)
	ok.half = absf(prep.bar.value - 50.0) < 0.1
	game.phase = "combat"
	prep._process(0.016)
	ok.hide = not prep.root.visible
	var wcf: Node = game.get_node("WaveClearFlash")
	wcf.show_wave(3)
	ok.title = wcf.title.text == i18n.t("waveClear.title", {"n": 3})
	ok.gold = "16" in wcf.sub.text
	game.wave = 9
	wcf.show_wave(9)
	ok.boss = i18n.t("waveClear.nextBoss") in wcf.sub.text
	var passed := ok.values().all(func(v): return v)
	print("HUD_PARITY ", ok, "->", "PASS" if passed else "FAIL")
	quit(0 if passed else 1)
	return true
