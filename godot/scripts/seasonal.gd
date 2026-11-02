extends RefCounted
## 짧은 시즌 문구 (타이틀 하단 · 웹 meta). UTC 기준 달/일만 본다.

static func utc_today() -> Dictionary:
	return Time.get_datetime_dict_from_system(true)

static func title_slice(locale: String) -> String:
	var d := utc_today()
	var m := int(d.month)
	var day := int(d.day)
	if m == 10 and day >= 28:
		return "할로윈 출격 · 핵을 지켜라" if locale == "ko" else "Halloween sortie · hold the core"
	if m == 11 and day <= 7:
		return "11월 한파 · 준비 시간을 아껴 쓰자" if locale == "ko" else "November chill · spend prep wisely"
	if m == 11:
		return "늦가을 방어전 · 웨이브마다 핵을 회복하라" if locale == "ko" else "Late autumn defense · heal the core each wave"
	if m == 12:
		return "겨울 거점 · 포탑은 다음 판에도 남는다" if locale == "ko" else "Winter outpost · turrets carry to the next run"
	return "Godot 이식 · 첫 플레이 버전" if locale == "ko" else "Godot port · first playable slice"

static func meta_description(locale: String) -> String:
	var d := utc_today()
	var m := int(d.month)
	if m == 11:
		return (
			"좀비 타이쿤 3D — 11월 브라우저 FPS. 준비 바와 웨이브 클리어 회복, 핵·체력 경고 HUD."
			if locale == "ko"
			else "Zombie Tycoon 3D — November browser FPS. Prep bar, wave-clear heals, core and HP warn HUD."
		)
	return (
		"좀비 타이쿤 3D — 브라우저 3D FPS와 기지 건설. 핵을 지키고 웨이브를 버텨라."
		if locale == "ko"
		else "Zombie Tycoon 3D — browser 3D FPS base defense. Hold the core through the waves."
	)
