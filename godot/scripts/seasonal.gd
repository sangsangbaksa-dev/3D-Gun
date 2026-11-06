extends RefCounted
## Optional title / shell copy keyed off the real-world date (automation polish, not gameplay).

static func title_slice_extra(locale: String) -> String:
	var dt := Time.get_datetime_dict_from_system()
	match dt.month:
		11:
			return " · " + ("11월, 기지 밖 안개" if locale == "ko" else "November fog over the base")
		12:
			return " · " + ("12월, 차가운 밤" if locale == "ko" else "December cold nights")
		_:
			return ""

static func meta_description(locale: String) -> String:
	var base := "좀비 타이쿤 3D — 웨이브 방어, 기지 건설, 본부 영구 성장." if locale == "ko" else "Zombie Tycoon 3D — wave defense, base building, permanent HQ upgrades."
	var extra := title_slice_extra(locale).strip_edges()
	if extra.begins_with("·"):
		extra = extra.substr(1).strip_edges()
	return base if extra == "" else "%s %s" % [base, extra]

## Title-screen ember palette (monthly mood; defaults match warm orange sparks).
static func ember_hot() -> Color:
	match Time.get_datetime_dict_from_system().month:
		11:
			return Color(0.72, 0.82, 0.95, 1.0)
		12:
			return Color(0.85, 0.78, 0.95, 1.0)
		_:
			return Color(1.0, 0.75, 0.4, 1.0)

static func ember_fade() -> Color:
	match Time.get_datetime_dict_from_system().month:
		11:
			return Color(0.35, 0.55, 0.62, 0.0)
		12:
			return Color(0.45, 0.38, 0.62, 0.0)
		_:
			return Color(1.0, 0.54, 0.16, 0.0)

static func ember_amount() -> int:
	match Time.get_datetime_dict_from_system().month:
		11, 12:
			return 48
		_:
			return 60
