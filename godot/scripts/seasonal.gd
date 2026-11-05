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
