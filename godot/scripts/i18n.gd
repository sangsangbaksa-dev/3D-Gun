extends Node
## Minimal en/ko strings for the slice. English is the default, as in the web game.
## Later: move to Godot's CSV translations (TranslationServer) generated from src/i18n.

signal locale_changed

const STRINGS := {
	"en": {
		"title.sub": "Zombie Tycoon 3D", "title.launch": "Deploy", "title.launchHint": "Enter or click",
		"title.lang": "한국어", "title.slice": "Godot port · first playable slice",
		"hud.wave": "Wave {n}", "hud.kills": "Kills {n}", "hud.coins": "Coins {n}", "hud.reloading": "Reloading…",
		"hud.prep": "Next wave in {n}s", "hud.click": "Click to lock the mouse",
		"death.title": "You fell", "death.sub": "Reached wave {w} · {k} kills · {c} coins", "death.back": "Back to title", "death.bank": "+{g} gold to the wallet {best}", "death.best": "· New best!", "death.hub": "Headquarters", "title.hub": "Headquarters", "title.volume": "Volume",
		"hud.left": "Left {n}", "hud.core": "Core", "toast.bossKing": "⚠ The Zombie King awakens!", "toast.bossWave": "⚠ Wave {n} boss {name} appears!",
		"toast.newEnemy": "New enemy: {name}", "toast.kingDown": "The Zombie King has fallen!", "death.coreTitle": "Core destroyed",
		"zombie.normal": "Zombie", "zombie.runner": "Runner", "zombie.fatty": "Brute", "zombie.crawler": "Crawler",
		"zombie.swarmer": "Swarmer", "zombie.leaper": "Leaper", "zombie.spitter": "Spitter", "zombie.bomber": "Bomber",
		"zombie.screamer": "Screamer", "zombie.tank": "Armored", "zombie.boss": "Bruiser", "zombie.bossBomb": "Blaster",
		"zombie.bossAcid": "Acid beast", "zombie.bossLord": "Warlord", "zombie.king": "Zombie King",
		"shop.title": "Weapons", "shop.buy": "Buy · {n}", "shop.upgrade": "Upgrade · {n}", "shop.max": "MAX",
		"shop.equip": "Equip", "shop.dmg": "DMG", "shop.mag": "Mag", "shop.hint": "V or Esc to close · 1–6 switch guns in combat",
		"gun.pistol.name": "Pistol", "gun.shotgun.name": "Shotgun", "gun.smg.name": "SMG",
		"gun.magnum.name": "Magnum", "gun.rifle.name": "Assault rifle", "gun.sniper.name": "Sniper rifle",
		"gun.pistol.desc": "Light, reliable sidearm", "gun.shotgun.desc": "Devastating up close",
		"gun.smg.desc": "Fast fire, low spread", "gun.magnum.desc": "Heavy hits with pierce",
		"gun.rifle.desc": "Accurate automatic rifle", "gun.sniper.desc": "Scoped long-range pierce",
		"res.wood": "Wood", "res.stone": "Stone", "res.iron": "Iron", "res.herb": "Herb", "res.parts": "Parts",
		"bld.barricade.name": "Barricade", "bld.tower.name": "Watchtower", "bld.mgtower.name": "MG tower", "bld.trap.name": "Slow trap",
		"bld.lab.name": "Research lab", "bld.barracks.name": "Barracks", "bld.shop.name": "Shop",
		"bld.lab.desc": "E: craft vaccines", "bld.barracks.desc": "Ally cap +3", "bld.shop.desc": "E: exchange resources", "bld.barricade.desc": "Zombies break it first", "bld.tower.desc": "Permanent turret; breaks when durability runs out",
		"bld.mgtower.desc": "Permanent auto turret; breaks when durability runs out", "bld.trap.desc": "Slows and damages zombies in range",
		"node.tree.verb": "Chop wood", "node.rock.verb": "Break rock", "node.iron.verb": "Mine iron", "node.herb.verb": "Gather herbs", "node.wreck.verb": "Strip parts",
		"build.waveExit": "Combat started — build mode closed", "build.place.click": "Click to place",
		"build.demolish": "{name} demolished (refund {refund})", "build.reason.outside": "Outside the base zone",
		"build.reason.tooCloseCore": "Too close to the core", "build.reason.overlap": "Overlaps something else",
		"build.reason.onPlayer": "You're standing there", "build.reason.prepOnly": "Build only during prep",
		"build.reason.noResources": "Not enough resources", "build.upgradePrepOnly": "Upgrades only during prep",
		"build.ammoOut": "{name} ran out of durability", "build.title": "BUILD  (B to close)",
		"build.keys": "1–7 pick · LMB place · X / RMB demolish · F repair · U upgrade", "build.hover": "{name} Lv{lv}  HP {hp}/{max}{ammo}",
		"build.ammo": "  ·  Durability {n}", "build.repairCost": "F repair: {c}", "build.upCost": "U upgrade: {c}", "build.maxLv": "Max level",
		"core.repair": "E  Repair core ({c})", "core.upgrade": "E  Upgrade core Lv{lv} ({c})", "toast.lacking": "Not enough: {c}",
		"toast.gathered": "+{n} {res}", "hud.gold": "{n} coins", "toast.structHeal": "Buildings repaired {p}%",
		"help.build": "B build (prep) · E gather / core",
		"help": "WASD move · Mouse look · LMB fire · RMB aim · R reload · Shift dash · Space jump · 1–6 guns · V weapons · N next wave · Esc release mouse",
		"title.settings": "Settings", "title.controls": "Controls", "settings.title": "Settings", "settings.close": "Close",
		"settings.volume": "Master volume", "settings.sensitivity": "Mouse sensitivity", "settings.language": "Language", "settings.reset": "Reset defaults",
		"controls.title": "Controls", "controls.hint": "Press P or Esc in-game to pause. Esc closes this window.", "controls.back": "Back",
		"pause.title": "Paused", "pause.resume": "Resume", "pause.hint": "P or Esc to resume",
		"keys.group.move": "Movement", "keys.group.combat": "Combat", "keys.group.base": "Base", "keys.group.system": "System",
		"key.mouse": "Mouse", "key.lmb": "LMB", "key.rmb": "RMB", "key.holdE": "Hold E", "key.click": "Click",
		"keys.bind.move": "Move", "keys.bind.roll": "Dash (brief invulnerability)", "keys.bind.jump": "Jump", "keys.bind.look": "Look around",
		"keys.bind.shoot": "Fire (first click locks the mouse)", "keys.bind.ads": "Aim (hold)", "keys.bind.reload": "Reload", "keys.bind.weapons": "Switch guns",
		"keys.bind.shop": "Weapon shop (buy & upgrade)", "keys.bind.buildMode": "Build mode (prep only)", "keys.bind.buildPick": "Pick building",
		"keys.bind.buildPlace": "Place building", "keys.bind.demolish": "Demolish (partial refund)", "keys.bind.repair": "Repair targeted building",
		"keys.bind.upgrade": "Upgrade targeted building", "keys.bind.interact": "Gather (hold) · core · shop · lab", "keys.bind.wave": "Skip prep, start the wave",
		"keys.bind.pause": "Pause · close panels", "keys.bind.resume": "Resume from pause",
	},
	"ko": {
		"title.sub": "좀비 타이쿤 3D", "title.launch": "출격", "title.launchHint": "Enter 또는 클릭",
		"title.lang": "English", "title.slice": "Godot 이식 · 첫 플레이 버전",
		"hud.wave": "웨이브 {n}", "hud.kills": "처치 {n}", "hud.coins": "코인 {n}", "hud.reloading": "재장전 중…",
		"hud.prep": "다음 웨이브까지 {n}초", "hud.click": "클릭하면 마우스가 고정돼요",
		"death.title": "쓰러졌습니다", "death.sub": "도달 웨이브 {w} · 처치 {k} · 코인 {c}", "death.back": "타이틀로", "death.bank": "지갑에 골드 +{g} {best}", "death.best": "· 최고 기록!", "death.hub": "본부로", "title.hub": "본부", "title.volume": "음량",
		"hud.left": "남은 좀비 {n}", "hud.core": "핵", "toast.bossKing": "⚠ 좀비 왕이 깨어났다!", "toast.bossWave": "⚠ {n}웨이브 보스 {name} 등장!",
		"toast.newEnemy": "새로운 적: {name}", "toast.kingDown": "좀비 왕을 쓰러뜨렸다!", "death.coreTitle": "핵이 파괴됐습니다",
		"shop.title": "무기", "shop.buy": "구매 · {n}", "shop.upgrade": "강화 · {n}", "shop.max": "최대",
		"shop.equip": "장착", "shop.dmg": "피해", "shop.mag": "탄창", "shop.hint": "V 또는 Esc 로 닫기 · 전투 중 1~6 으로 총 교체",
		"build.waveExit": "전투가 시작돼 건설 모드를 종료했어요", "build.place.click": "클릭해서 배치",
		"build.demolish": "{name} 철거 (환급 {refund})", "build.reason.outside": "기지 구역 밖이에요",
		"build.reason.tooCloseCore": "핵에 너무 가까워요", "build.reason.overlap": "다른 물체와 겹쳐요",
		"build.reason.onPlayer": "내가 서 있는 자리예요", "build.reason.prepOnly": "준비 단계에만 건설할 수 있어요",
		"build.reason.noResources": "자원이 부족해요", "build.upgradePrepOnly": "강화는 준비 단계에만 할 수 있어요",
		"build.ammoOut": "{name} 내구도를 다 써서 부서졌어요", "build.title": "건설  (B 로 닫기)",
		"build.keys": "1~7 선택 · 좌클릭 배치 · X/우클릭 철거 · F 수리 · U 강화", "build.hover": "{name} Lv{lv}  체력 {hp}/{max}{ammo}",
		"build.ammo": "  ·  내구도 {n}", "build.repairCost": "F 수리: {c}", "build.upCost": "U 강화: {c}", "build.maxLv": "최대 레벨",
		"core.repair": "E  핵 수리 ({c})", "core.upgrade": "E  핵 강화 Lv{lv} ({c})", "toast.lacking": "재료가 부족해요: {c}",
		"toast.gathered": "+{n} {res}", "hud.gold": "코인 {n}", "toast.structHeal": "건물 체력 {p}% 회복",
		"help.build": "B 건설(준비 중) · E 채집 / 핵",
		"node.tree.verb": "나무 베기", "node.rock.verb": "바위 깨기", "node.iron.verb": "철광석 캐기", "node.herb.verb": "약초 뜯기", "node.wreck.verb": "부품 뜯기",
		"help": "WASD 이동 · 마우스 시점 · 좌클릭 사격 · 우클릭 조준 · R 재장전 · Shift 구르기 · Space 점프 · 1~6 총 · V 무기 · N 다음 웨이브 · Esc 마우스 풀기",
		"title.settings": "설정", "title.controls": "조작키", "settings.title": "설정", "settings.close": "닫기",
		"settings.volume": "전체 볼륨", "settings.sensitivity": "마우스 감도", "settings.language": "언어", "settings.reset": "초기화",
		"controls.title": "조작키", "controls.hint": "게임 중 P 또는 Esc 로 일시정지할 수 있어요. Esc 로 이 창을 닫아요.", "controls.back": "뒤로",
		"pause.title": "일시정지", "pause.resume": "계속하기", "pause.hint": "P 또는 Esc 로 계속",
		"keys.group.move": "이동", "keys.group.combat": "전투", "keys.group.base": "기지", "keys.group.system": "시스템",
		"key.mouse": "마우스", "key.lmb": "좌클릭", "key.rmb": "우클릭", "key.holdE": "E 길게", "key.click": "클릭",
		"keys.bind.move": "이동", "keys.bind.roll": "구르기 (잠깐 무적)", "keys.bind.jump": "점프", "keys.bind.look": "시점 회전",
		"keys.bind.shoot": "사격 (화면을 처음 누르면 마우스 고정)", "keys.bind.ads": "조준 (누르고 있기)", "keys.bind.reload": "재장전", "keys.bind.weapons": "총 바꾸기",
		"keys.bind.shop": "무기 상점 (구매·강화)", "keys.bind.buildMode": "건설 모드 (준비 시간에만)", "keys.bind.buildPick": "건물 고르기",
		"keys.bind.buildPlace": "건물 배치", "keys.bind.demolish": "철거 (일부 환급)", "keys.bind.repair": "조준한 건물 수리",
		"keys.bind.upgrade": "조준한 건물 강화", "keys.bind.interact": "채집(길게) · 핵 · 상점 · 연구소", "keys.bind.wave": "준비를 건너뛰고 웨이브 시작",
		"keys.bind.pause": "일시정지 · 창 닫기", "keys.bind.resume": "일시정지 풀고 계속",
	},
}

var locale := "en"

func t(key: String, args: Dictionary = {}) -> String:
	var s: String = STRINGS[locale].get(key, key)
	for k in args:
		s = s.replace("{%s}" % k, str(args[k]))
	return s

## Korean names/descriptions come straight from src/data (GUNS[id].name / desc); English from the table above.
func gun_name(id: String) -> String:
	return GameData.guns[id].name if locale == "ko" else t("gun.%s.name" % id)

func gun_desc(id: String) -> String:
	return GameData.guns[id].desc if locale == "ko" else t("gun.%s.desc" % id)

## Korean zombie names come from ZOMBIE_TUNING[type].name, English from the table above.
func zombie_name(type: String) -> String:
	return GameData.zombie_tuning[type].name if locale == "ko" else t("zombie." + type)

## Korean building / resource names come from src/data (BUILDINGS[k].name, RES_LABEL); English from the table.
func bld_name(kind: String) -> String:
	return GameData.buildings[kind].name if locale == "ko" else t("bld.%s.name" % kind)

func bld_desc(kind: String) -> String:
	return GameData.buildings[kind].desc if locale == "ko" else t("bld.%s.desc" % kind)

func res_name(r: String) -> String:
	return GameData.res.label[r] if locale == "ko" else t("res." + r)

## "Wood 22 · Stone 14" (+ coins).
func cost_text(cost: Dictionary, gold: int = 0) -> String:
	var parts := []
	for r in GameData.res.keys:
		if int(cost.get(r, 0)) > 0:
			parts.append("%s %d" % [res_name(r), int(cost[r])])
	if gold > 0:
		parts.append(t("hud.gold", {"n": gold}))
	return " · ".join(parts)

func toggle() -> void:
	locale = "ko" if locale == "en" else "en"
	locale_changed.emit()
