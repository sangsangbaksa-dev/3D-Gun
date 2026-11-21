extends RefCounted
## Optional title / shell copy keyed off the real-world date (automation polish, not gameplay).

static func is_late_november() -> bool:
	var dt := Time.get_datetime_dict_from_system()
	return dt.month == 11 and dt.day >= 16

static func title_slice_extra(locale: String) -> String:
	var dt := Time.get_datetime_dict_from_system()
	match dt.month:
		11:
			if is_late_november():
				return " · " + ("11월 막바지, 거센 안개" if locale == "ko" else "Late November gusts in the fog")
			return " · " + ("11월, 낙엽 사이의 안개" if locale == "ko" else "November leaves in the fog")
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

## Cool fog multiplier during November/December (look.gd can lerp fog toward this).
static func atmosphere_fog_tint() -> Color:
	match Time.get_datetime_dict_from_system().month:
		11:
			return Color(0.78, 0.86, 0.94)
		12:
			return Color(0.82, 0.76, 0.92)
		_:
			return Color.WHITE

static func atmosphere_fog_far_mul() -> float:
	match Time.get_datetime_dict_from_system().month:
		11:
			return 1.08 if is_late_november() else 1.05
		12:
			return 1.04
		_:
			return 1.0

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
		11:
			return 42 if is_late_november() else 48
		12:
			return 48
		_:
			return 60

## Subtle full-screen cool mist during November combat (alpha scaled in game.gd).
static func combat_mist_tint() -> Color:
	match Time.get_datetime_dict_from_system().month:
		11:
			return Color(0.38, 0.52, 0.68, 0.085 if is_late_november() else 0.07)
		12:
			return Color(0.42, 0.38, 0.58, 0.06)
		_:
			return Color(0.5, 0.55, 0.6, 0.0)

## Prep-phase mist alpha fraction of combat mist (late-year months only).
static func prep_mist_alpha_mul() -> float:
	match Time.get_datetime_dict_from_system().month:
		11, 12:
			return 0.42
		_:
			return 0.0

## Late November (16th+): gustier leaves before December (mirrors src/ui/seasonal.ts lateNovemberLeafMul).
static func late_november_leaf_mul() -> float:
	var dt := Time.get_datetime_dict_from_system()
	if dt.month != 11:
		return 1.0
	return 1.22 if dt.day >= 16 else 1.0

## Drifting leaf particles (November only; mirrors src/ui/seasonal.ts combatLeafParticles).
static func leaf_particles() -> Dictionary:
	if Time.get_datetime_dict_from_system().month != 11:
		return {}
	var mul := late_november_leaf_mul()
	var strength := minf(0.72, 0.58 * mul)
	return {"count": int(round(55.0 * mul)), "strength": strength}

## Wind / drone bed tweaks for November–December (mirrors src/ui/seasonal.ts ambientSeasonAdjust).
static func ambient_season_adjust() -> Dictionary:
	match Time.get_datetime_dict_from_system().month:
		11:
			if is_late_november():
				return {"wind_mul": 1.32, "drone_mul": 0.84, "cutoff_add": 52.0}
			return {"wind_mul": 1.2, "drone_mul": 0.88, "cutoff_add": 45.0}
		12:
			return {"wind_mul": 1.12, "drone_mul": 0.92, "cutoff_add": 32.0}
		_:
			return {"wind_mul": 1.0, "drone_mul": 1.0, "cutoff_add": 0.0}

## Wave / clear banner accent (mirrors src/ui/seasonal.ts bannerClearAccentHex).
static func banner_clear_accent() -> Color:
	match Time.get_datetime_dict_from_system().month:
		11:
			if is_late_november():
				return Color(0.55, 0.78, 0.92)
			return Color(0.45, 0.72, 0.88)
		12:
			return Color(0.72, 0.68, 0.92)
		_:
			return Color(1.0, 0.7, 0.28)

## Prep timer bar fill (mirrors index.html #prepBar seasonal fills).
static func hud_prep_fill() -> Color:
	match Time.get_datetime_dict_from_system().month:
		11:
			if is_late_november():
				return Color(0.48, 0.69, 0.83)
			return Color(0.42, 0.61, 0.77)
		12:
			return Color(0.48, 0.54, 0.78)
		_:
			return Color(0.18, 0.9, 0.84)

## Build HUD pill edge (mirrors src/base/view/panels.ts seasonal borders).
static func hud_build_edge_alpha() -> float:
	match Time.get_datetime_dict_from_system().month:
		11:
			return 0.55 if is_late_november() else 0.45
		12:
			return 0.5
		_:
			return 0.35

## Core attack edge pulse color (lerps cool mist → alert red with pulse). Mirrors src/ui/seasonal.ts coreAlertEdgeGlowRgb.
static func core_alert_edge_glow(pulse: float) -> Color:
	const RED := Color(0.88, 0.19, 0.23)
	match Time.get_datetime_dict_from_system().month:
		11:
			var cool := Color(0.35, 0.55, 0.72) if is_late_november() else Color(0.30, 0.48, 0.62)
			return cool.lerp(RED, clampf(pulse, 0.0, 1.0))
		12:
			return Color(0.42, 0.35, 0.60).lerp(RED, clampf(pulse, 0.0, 1.0))
		_:
			return RED

## Core alert banner chrome during November (core_pointer.gd).
static func core_alert_banner_border() -> Color:
	match Time.get_datetime_dict_from_system().month:
		11:
			return Color(0.48, 0.69, 0.83) if is_late_november() else Color(0.42, 0.61, 0.77)
		12:
			return Color(0.55, 0.48, 0.72)
		_:
			return Color(0.88, 0.19, 0.23)

static func core_alert_banner_bg() -> Color:
	match Time.get_datetime_dict_from_system().month:
		11:
			return Color(0.10, 0.16, 0.22, 0.85) if is_late_november() else Color(0.12, 0.18, 0.24, 0.82)
		12:
			return Color(0.14, 0.10, 0.20, 0.85)
		_:
			return Color(0.35, 0.05, 0.07, 0.82)

## Combat edge vignette RGB tint (alpha handled in game.gd).
static func combat_vignette_tint(low_core: bool, low_hp: bool) -> Color:
	if not low_core and not low_hp:
		return Color.WHITE
	match Time.get_datetime_dict_from_system().month:
		11:
			if low_core:
				return Color(0.62, 0.78, 0.95)
			return Color(0.95, 0.38, 0.42)
		12:
			if low_core:
				return Color(0.72, 0.68, 0.92)
			return Color(0.95, 0.35, 0.45)
		_:
			if low_core:
				return Color(1.0, 0.55, 0.55)
			return Color(1.0, 0.45, 0.48)
