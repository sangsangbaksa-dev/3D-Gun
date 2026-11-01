extends SceneTree
## 웨이브 클리어 i18n 키와 보상 문구 조합.
## godot --headless --path godot --fixed-fps 60 -s res://tests/wave_clear_i18n_test.gd

func _initialize() -> void:
	var i18n: Node = load("res://scripts/i18n.gd").new()
	i18n.locale = "en"
	var heal: String = i18n.t("waveClear.heal", {"corePct": 30, "structPct": 50})
	assert(heal.find("30") >= 0 and heal.find("50") >= 0)
	var sub: String = i18n.t("waveClear.rewards", {"gold": 12, "heal": heal})
	assert(sub.find("12") >= 0)
	assert(i18n.t("waveClear.title", {"n": 3}).find("3") >= 0)
	i18n.locale = "ko"
	assert(i18n.t("waveClear.title", {"n": 1}).find("1") >= 0)
	print("wave_clear_i18n_test ok")
	quit(0)
