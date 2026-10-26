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
		"death.title": "You fell", "death.sub": "Reached wave {w} · {k} kills · {c} coins", "death.back": "Back to title",
		"help": "WASD move · Mouse look · LMB fire · RMB aim · R reload · Shift dash · Space jump · Esc release mouse",
	},
	"ko": {
		"title.sub": "좀비 타이쿤 3D", "title.launch": "출격", "title.launchHint": "Enter 또는 클릭",
		"title.lang": "English", "title.slice": "Godot 이식 · 첫 플레이 버전",
		"hud.wave": "웨이브 {n}", "hud.kills": "처치 {n}", "hud.coins": "코인 {n}", "hud.reloading": "재장전 중…",
		"hud.prep": "다음 웨이브까지 {n}초", "hud.click": "클릭하면 마우스가 고정돼요",
		"death.title": "쓰러졌습니다", "death.sub": "도달 웨이브 {w} · 처치 {k} · 코인 {c}", "death.back": "타이틀로",
		"help": "WASD 이동 · 마우스 시점 · 좌클릭 사격 · 우클릭 조준 · R 재장전 · Shift 구르기 · Space 점프 · Esc 마우스 풀기",
	},
}

var locale := "en"

func t(key: String, args: Dictionary = {}) -> String:
	var s: String = STRINGS[locale].get(key, key)
	for k in args:
		s = s.replace("{%s}" % k, str(args[k]))
	return s

func toggle() -> void:
	locale = "ko" if locale == "en" else "en"
	locale_changed.emit()
