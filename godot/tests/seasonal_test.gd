extends SceneTree
## Headless checks for seasonal.gd (month-aware polish). Run in November on CI cron for full coverage.
## Run: godot --headless --path godot -s res://tests/seasonal_test.gd

const Seasonal := preload("res://scripts/seasonal.gd")

func _initialize() -> void:
	var month: int = int(Time.get_datetime_dict_from_system().month)
	var ko := Seasonal.title_slice_extra("ko")
	var en := Seasonal.title_slice_extra("en")
	if month == 11:
		_assert(ko.find("11월") >= 0, "November ko title slice")
		_assert(en.find("November") >= 0, "November en title slice")
	elif month == 12:
		_assert(ko.find("12월") >= 0, "December ko title slice")
	var core_t := Seasonal.combat_vignette_tint(true, false)
	var hp_t := Seasonal.combat_vignette_tint(false, true)
	var ammo_t := Seasonal.combat_vignette_tint(false, false, true)
	_assert(core_t != Color.WHITE, "core vignette tint")
	_assert(hp_t != Color.WHITE, "hp vignette tint")
	_assert(ammo_t != Color.WHITE, "ammo vignette tint")
	_assert(Seasonal.world_ember_color().a == 1.0, "world ember opaque rgb")
	_assert(Seasonal.prep_bar_color().g > 0.5, "prep bar has green/teal channel")
	_assert(Seasonal.low_ammo_vignette_cap() > 0.05 and Seasonal.low_ammo_vignette_cap() < 0.2, "ammo vignette cap sane")
	var pulse := 0.75
	var am := Seasonal.low_ammo_hud_modulate(pulse)
	_assert(am.r >= 0.95 and am.g > am.b, "ammo hud warm")
	print("SEASONAL ", month, " -> PASS")
	quit(0)

func _assert(ok: bool, label: String) -> void:
	if not ok:
		push_error("SEASONAL FAIL: " + label)
		quit(1)
