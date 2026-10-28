extends SceneTree
## Headless test for stage 6: headquarters rules (upgrades, idle facilities, start-wave purchase, run banking),
## the save file (round trip, broken files, cleaning) and the hand-over to the game scene (start wave, damage, start grant).
## Run: godot --headless --path godot --fixed-fps 60 -s res://tests/hub_test.gd
## Saves go to a scratch file, never to the player's real save.

const HubLogic := preload("res://scripts/hub_logic.gd")
const TEST_PATH := "user://hub_test_save.json"

var save: Node
var game: Node
var frames := 0
var ok := {}

func _initialize() -> void:
	save = root.get_node("Save")
	save.save_path = TEST_PATH
	_remove_test_files()
	save.load_meta()
	_test_upgrades()
	_test_facilities()
	_test_start_wave()
	_test_bank()
	_test_save_file()

## 자동 로드(Save)의 _ready 가 load_meta() 로 메타를 비운 뒤라야 하므로 첫 프레임에 한다.
func _handover() -> void:
	# 게임 장면으로 넘기기: 시작 웨이브 4, 총열 정밀 가공 2단계, 시작 골드 1단계
	save.reset_meta()
	save.meta.upgrades["w_mul"] = 2.0
	save.meta.upgrades["e_gold"] = 1.0
	save.pending_start_wave = 4
	game = load("res://scenes/game.tscn").instantiate()
	root.add_child(game)

func _remove_test_files() -> void:
	for f in [TEST_PATH, TEST_PATH + ".tmp"]:
		if FileAccess.file_exists(f):
			DirAccess.remove_absolute(ProjectSettings.globalize_path(f))

func _fresh() -> Dictionary:
	return save._clean_meta({})

func _test_upgrades() -> void:
	var m := _fresh()
	ok.up_poor = HubLogic.buy_upgrade(m, "e_gold") == "poor"
	m.wallet.gold = 1000.0
	ok.up_buy = HubLogic.buy_upgrade(m, "e_gold") == "ok" and HubLogic.upgrade_lv(m, "e_gold") == 1 and HubLogic.bal(m, "gold") == 940.0
	# 2단계 비용 = ceil(60 × 1.5)
	ok.up_growth = HubLogic.upgrade_cost(m, HubLogic.upgrade_def("e_gold")).gold == 90
	ok.up_locked = HubLogic.buy_upgrade(m, "t_iron") == "locked" # 포탑 탄두 강화 1단계가 먼저
	ok.up_unknown = HubLogic.buy_upgrade(m, "nope") == "unknown"
	m.upgrades["e_gold"] = 10.0
	ok.up_max = HubLogic.buy_upgrade(m, "e_gold") == "max"
	m.upgrades["w_mul"] = 3.0
	ok.up_sum = absf(HubLogic.effect_sum(m, "dmgMul") - 0.18) < 1e-9

func _test_facilities() -> void:
	var m := _fresh()
	m.wallet.gold = 100.0
	ok.fac_buy = HubLogic.buy_facility(m, "p_gold") == "ok" and HubLogic.facility_lv(m, "p_gold") == 1 and HubLogic.bal(m, "gold") == 38.0
	ok.fac_poor = HubLogic.buy_facility(m, "p_gold") == "poor" # 2단계 = ceil(62 × 1.26) = 79
	ok.fac_locked = HubLogic.buy_facility(m, "p_lab2") == "locked"
	# 수입 = perSec × 레벨 × 수입 배율(0.5) : 0.092 × 1 × 0.5 × 10초 = 0.46
	var before := HubLogic.bal(m, "gold")
	var got := HubLogic.tick(m, 10.0)
	ok.fac_tick = absf(float(got.gold) - 0.46) < 1e-9 and absf(HubLogic.bal(m, "gold") - before - 0.46) < 1e-9
	# 운영 효율 2단계: 수입 +20%
	m.upgrades["e_income"] = 2.0
	ok.fac_mul = absf(HubLogic.facility_income(m, HubLogic.producer_def("p_gold")) - 0.092 * 0.5 * 1.2) < 1e-9
	ok.fac_none = HubLogic.income_per_sec(_fresh()).is_empty()
	m.facilities["p_gold"] = 15.0
	ok.fac_max = HubLogic.buy_facility(m, "p_gold") == "max"

func _test_start_wave() -> void:
	var m := _fresh()
	ok.sw_default = HubLogic.max_start_wave(m) == 1 and HubLogic.start_wave_cost(m, 1, 1).is_empty() and HubLogic.buy_start_wave(m, 1) == "ok"
	ok.sw_locked = HubLogic.buy_start_wave(m, 2) == "locked"
	m.bestWave = 7.0
	ok.sw_max = HubLogic.max_start_wave(m) == 7
	m.bestWave = 99.0
	ok.sw_cap = HubLogic.max_start_wave(m) == 50
	m.bestWave = 5.0
	# 2웨이브 = floor(68 + 2 × 48 × 1.13^0) = 164 골드, 3웨이브 = floor(68 + 3×48×1.13)=230 골드 + 철 1
	var c2 := HubLogic.start_wave_cost(m, 1, 2)
	var c3 := HubLogic.start_wave_cost(m, 1, 3)
	ok.sw_cost = int(c2.gold) == 164 and not c2.has("iron") and int(c3.gold) == 164 + 230 and int(c3.iron) == 1
	ok.sw_poor = HubLogic.buy_start_wave(m, 3) == "poor"
	m.wallet.gold = 1000.0
	m.wallet.iron = 5.0
	ok.sw_pay = HubLogic.buy_start_wave(m, 3) == "ok" and HubLogic.bal(m, "gold") == 1000.0 - 394.0 and HubLogic.bal(m, "iron") == 4.0
	# 전진 기지 5단계: 비용 -40%
	m.upgrades["e_wave"] = 5.0
	ok.sw_disc = absf(HubLogic.wave_skip_discount(m) - 0.4) < 1e-9 and int(HubLogic.start_wave_cost(m, 1, 2).gold) == floori(164.0 * 0.6)

func _test_bank() -> void:
	var m := _fresh()
	# 시작 지급(골드 25, 나무 24)은 정산에서 빠진다: 번 골드 125 × 0.66 = 82, 나무 번 것 30 × 0.66 = 19
	var r := HubLogic.bank_run(m, {"wave": 5, "kills": 40, "gold": 150, "res": {"wood": 54, "iron": 0}, "samples": 6, "samplesSp": 0,
		"grant": {"gold": 25, "res": {"wood": 24}, "samples": 2}})
	var bonus := floori(4 * 13.0 + 40 * 0.45) # 70
	ok.bank_gold = int(r.kept.gold) == 82 and int(r.waveBonus) == bonus and int(r.gold) == 82 + bonus and HubLogic.bal(m, "gold") == float(82 + bonus)
	ok.bank_res = HubLogic.bal(m, "wood") == 19.0 and int(r.kept.samples) == floori(4 * 0.66)
	ok.bank_stats = int(m.totalRuns) == 1 and int(m.bestWave) == 5 and int(m.totalKills) == 40 and r.newBest
	var r2 := HubLogic.bank_run(m, {"wave": 3, "kills": 0, "gold": 0, "res": {}})
	ok.bank_best = not r2.newBest and int(m.bestWave) == 5 and int(m.totalRuns) == 2
	# 철수 보급 2단계: 회수율 +12%
	m.upgrades["e_keep"] = 2.0
	var r3 := HubLogic.bank_run(m, {"wave": 1, "kills": 0, "gold": 200, "res": {}})
	ok.bank_keep = absf(float(r3.keepRatio) - 0.78) < 1e-9 and int(r3.kept.gold) >= 155 and int(r3.kept.gold) <= 156

func _test_save_file() -> void:
	save.reset_meta()
	save.meta.wallet["gold"] = 123.5
	save.meta.upgrades["w_mul"] = 3.0
	save.meta.facilities["p_wood"] = 2.0
	save.meta.bestWave = 12.0
	save.meta["unknownFromClassic"] = {"keep": "me"}
	save.save_meta()
	ok.file_exists = FileAccess.file_exists(TEST_PATH) and not FileAccess.file_exists(TEST_PATH + ".tmp")
	save.meta = {}
	save.load_meta()
	ok.file_roundtrip = save.wallet("gold") == 123.5 and save.upgrade_lv("w_mul") == 3 and int(save.meta.facilities.get("p_wood", 0)) == 2 \
		and int(save.meta.bestWave) == 12 and save.meta.get("unknownFromClassic", {}).get("keep") == "me"
	# 깨진 값은 걸러진다: 음수·글자·무한대, hp 0 인 아군
	var f := FileAccess.open(TEST_PATH, FileAccess.WRITE)
	f.store_string('{"wallet":{"gold":50,"wood":-5,"iron":"x"},"upgrades":{"w_mul":2},"bestWave":"abc","allies":[{"role":"guard","hp":0,"maxHp":10},{"role":"guard","hp":5,"maxHp":10}]}')
	f.close()
	save.load_meta()
	ok.file_clean = save.wallet("gold") == 50.0 and not save.meta.wallet.has("wood") and not save.meta.wallet.has("iron") \
		and save.upgrade_lv("w_mul") == 2 and int(save.meta.bestWave) == 0 and save.meta.allies.size() == 1
	# 깨진 파일이면 새로 시작
	f = FileAccess.open(TEST_PATH, FileAccess.WRITE)
	f.store_string("{not json")
	f.close()
	save.load_meta()
	ok.file_broken = save.wallet("gold") == 0.0 and save.meta.upgrades.is_empty() and int(save.meta.totalRuns) == 0
	# 파일이 없어도 새로 시작
	_remove_test_files()
	save.load_meta()
	ok.file_missing = save.wallet("gold") == 0.0 and save.meta.facilities.is_empty()

func _process(_dt: float) -> bool:
	frames += 1
	if frames == 1:
		_handover()
	if frames == 6:
		var p = game.player
		# 시작 웨이브 4 → 첫 웨이브가 4 (wave 는 _start_wave 에서 +1)
		ok.game_wave = game.wave == 3 and save.pending_start_wave == 1
		ok.game_dmg = absf(float(p.stats("pistol").dmg) - float(root.get_node("GameData").guns["pistol"].dmg) * 1.12) < 1e-6
		ok.game_gold = game.coins == 25
		var grant: Dictionary = game.get_meta("run_grant", {})
		ok.game_grant = int(grant.get("gold", -1)) == 25 and int(grant.get("res", {}).get("wood", -1)) == int(game.res.wood)
		# 시작 지급만 들고 죽으면 골드는 웨이브 보너스만 정산된다 (wave 3 → 2 × 13)
		game.kills = 0
		var rep: Dictionary = save.bank_game(game)
		ok.game_bank = int(rep.kept.gold) == 0 and int(rep.gold) == 2 * 13 and save.wallet("gold") == 26.0
	if frames >= 4:
		_remove_test_files()
		var pass_ := true
		for k in ok:
			if not ok[k]:
				pass_ = false
				print("HUB FAIL: ", k)
		print("HUB ", ok.size(), " checks -> ", "PASS" if pass_ else "FAIL")
		quit(0 if pass_ else 1)
	return false
