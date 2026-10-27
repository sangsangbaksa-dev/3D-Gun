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
		"help": "WASD move · Mouse look · LMB fire · RMB aim · R reload · Shift dash · Space jump · 1–6 guns · V weapons · N next wave · Esc release mouse",
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
		"help": "WASD 이동 · 마우스 시점 · 좌클릭 사격 · 우클릭 조준 · R 재장전 · Shift 구르기 · Space 점프 · 1~6 총 · V 무기 · N 다음 웨이브 · Esc 마우스 풀기",
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

func toggle() -> void:
	locale = "ko" if locale == "en" else "en"
	locale_changed.emit()
