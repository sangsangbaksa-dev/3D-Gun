extends RefCounted
## 튜토리얼·도입·설정 항목의 한/영 문구 (i18n.gd 를 건드리지 않으려고 따로 둔다). 쓰는 법: TutorialText.t("key")

const STRINGS := {
	"en": {
		"step": "Step {i}/{n}", "skip": "H  skip hint",
		"move.title": "Move and look", "move.body": "Walk with WASD and turn with the mouse. Click the screen first to lock the mouse.", "move.keys": "W A S D|Mouse",
		"shoot.title": "Shoot and reload", "shoot.body": "Left-click to fire (right-click aims). Press R to reload before the magazine runs dry.", "shoot.keys": "LMB|RMB|R",
		"core.title": "Find the core", "core.body": "Protect the glowing core at the centre. The arrow at the screen edge always points to it — if it is destroyed, the sortie fails.", "core.keys": "",
		"gather.title": "Gather", "gather.body": "Hold E next to trees, rocks, iron or herbs to gather resources.", "gather.keys": "Hold E",
		"build.title": "Build", "build.body": "Only during the prep phase: press B, pick a building with 1–7 and left-click to place it. Turrets guard the core.", "build.keys": "B|1–7|LMB",
		"wave.title": "Start the wave", "wave.body": "Ready? Press N to start the wave now instead of waiting for the timer.", "wave.keys": "N",
		"ally.title": "Vaccine and allies", "ally.body": "Kills drop samples. Craft a vaccine at a lab, then hold E next to a stunned, weakened zombie to recruit it.", "ally.keys": "Hold E",
		"settings.tutorial": "Tutorial hints", "settings.replay": "Replay intro & hints", "settings.replayDone": "Plays on your next sortie",
		"intro.skip": "Press any key to skip",
		"intro.0": "2031 — Helix Pharma announces the immortality vaccine V-0.\nOn clinical day 47, every subject’s heart stops.\nThen they rise again.",
		"intro.1": "The city falls in 72 hours.\nOnly the core guarding the vaccine serum remains.",
		"intro.2": "If the core dies, the cure dies with it.\nSurvivor — deploy.",
	},
	"ko": {
		"step": "{i}/{n} 단계", "skip": "H  이 힌트 넘기기",
		"move.title": "이동과 시점", "move.body": "WASD 로 걷고 마우스로 둘러보세요. 먼저 화면을 한 번 클릭해 마우스를 고정합니다.", "move.keys": "W A S D|마우스",
		"shoot.title": "사격과 재장전", "shoot.body": "좌클릭으로 쏘고(우클릭 조준), 탄창이 비기 전에 R 로 재장전하세요.", "shoot.keys": "좌클릭|우클릭|R",
		"core.title": "핵의 위치", "core.body": "가운데에서 빛나는 핵을 지키세요. 화면 가장자리의 화살표가 항상 핵을 가리킵니다. 핵이 부서지면 출격 실패입니다.", "core.keys": "",
		"gather.title": "채집", "gather.body": "나무·바위·철·약초 곁에서 E 를 길게 눌러 자원을 모으세요.", "gather.keys": "E 길게",
		"build.title": "건설", "build.body": "준비 단계에만 가능해요. B 로 건설 모드를 열고 1~7 로 건물을 골라 좌클릭으로 놓으세요. 포탑이 핵을 지켜 줍니다.", "build.keys": "B|1~7|좌클릭",
		"wave.title": "웨이브 시작", "wave.body": "준비됐나요? 타이머를 기다리지 말고 N 으로 바로 웨이브를 시작하세요.", "wave.keys": "N",
		"ally.title": "백신과 아군", "ally.body": "처치하면 샘플이 나옵니다. 연구소에서 백신을 만든 뒤, 기절한 약한 좀비 곁에서 E 를 길게 눌러 아군으로 만드세요.", "ally.keys": "E 길게",
		"settings.tutorial": "튜토리얼 힌트", "settings.replay": "도입·힌트 다시 보기", "settings.replayDone": "다음 출격에서 다시 나와요",
		"intro.skip": "아무 키나 눌러 건너뛰기",
		"intro.0": "2031년, 제약사 헬릭스는 불사 백신 V-0을 발표한다.\n임상 47일째, 투여자 전원의 심장이 멈춘다.\n그리고 다시 일어난다.",
		"intro.1": "72시간 만에 도시가 함락된다.\n남은 건 백신 원액을 지키는 마지막 코어뿐.",
		"intro.2": "코어가 꺼지면, 치료제도 끝난다.\n생존자, 출격하라.",
	},
}

static func t(key: String, args: Dictionary = {}) -> String:
	var s: String = STRINGS[I18n.locale].get(key, key)
	for k in args:
		s = s.replace("{%s}" % k, str(args[k]))
	return s
