extends SceneTree
## Headless test for the skill tree, run experience, the wallet exchange and the death scene.
## Run: godot --headless --path godot --fixed-fps 60 -s res://tests/skills_test.gd
## Saves go to a scratch file, never to the player's real save.

const HubLogic := preload("res://scripts/hub_logic.gd")
const Skills := preload("res://scripts/skills.gd")
const TEST_PATH := "user://skills_test_save.json"

var save: Node
var gd: Node
var game: Node
var frames := 0
var ok := {}
var base_stun := 0.0
var slow_seen := false

func _initialize() -> void:
	save = root.get_node("Save")
	save.save_path = TEST_PATH
	_test_rules()
	_test_exchange()
	_test_bank()

func _fresh() -> Dictionary:
	return save._clean_meta({})

func _near(a: float, b: float) -> bool:
	return absf(a - b) < 1e-6

func _test_rules() -> void:
	var m := _fresh()
	ok.sk_count = Skills.defs().size() == 19
	# 구매: 비용 = 1 + 현재 레벨
	ok.sk_poor = Skills.buy(m, "hp") == "poor"
	m.wallet.skillPoints = 10.0
	ok.sk_buy = Skills.buy(m, "hp") == "ok" and Skills.level(m, "hp") == 1 and HubLogic.bal(m, "skillPoints") == 9.0
	ok.sk_cost = Skills.cost(m, "hp") == 2 and Skills.buy(m, "hp") == "ok" and Skills.buy(m, "hp") == "ok" and HubLogic.bal(m, "skillPoints") == 4.0 # 1+2+3
	ok.sk_unknown = Skills.buy(m, "nope") == "unknown"
	m.skills["dash"] = 4.0
	ok.sk_max = Skills.buy(m, "dash") == "max"
	# 초기화: 투자한 포인트 전부 반환 (hp 3레벨 = 1+2+3, dash 4레벨 = 1+2+3+4)
	var back := Skills.refund(m)
	ok.sk_refund = back == 16 and m.skills.is_empty() and HubLogic.bal(m, "skillPoints") == 20.0
	# calcStats
	var s0 := Skills.stats({})
	ok.st_base = s0.maxHp == 100.0 and s0.dashCd == 2.0 and s0.allyCap == 2.0 and s0.recoilMul == 1.0 and s0.goldMul == 1.0
	var s := Skills.stats({"hp": 5, "dash": 4, "dmg": 5, "reload": 4, "mag": 3, "stun": 4, "cap": 5, "recoil": 5, "steady": 4, "gextra": 5, "loot": 4, "vcost": 3})
	ok.st_max = _near(s.maxHp, 200.0) and _near(s.dashCd, 0.8) and _near(s.dmgMul, 1.5) and _near(s.reloadMul, 0.48) and _near(s.magMul, 1.6) \
		and _near(s.stunBonus, 0.4) and _near(s.allyCap, 12.0) and _near(s.gatherExtra, 0.6) and _near(s.goldMul, 1.6) and _near(s.vacCostMul, 0.7)
	ok.st_min = _near(s.recoilMul, 0.5) and _near(s.spreadMul, 0.68)
	ok.st_clamp = _near(Skills.stats({"recoil": 50}).recoilMul, 0.5) and _near(Skills.stats({"steady": 50}).spreadMul, 0.55)
	# 런 경험치: 68 + 44 × 레벨
	ok.xp_curve = Skills.xp_to_next(0) == 68.0 and Skills.xp_to_next(2) == 156.0
	var r := {"xp": 0.0, "level": 0}
	ok.xp_one = Skills.add_xp(r, 70.0) == 1 and r.level == 1 and _near(r.xp, 2.0)
	ok.xp_multi = Skills.add_xp(r, 500.0) == 3 and r.level == 4
	ok.xp_mul = _near(Skills.xp_mul(_fresh()), 1.0)
	var mm := _fresh()
	mm.upgrades["e_sp"] = 3.0
	ok.xp_mul_up = _near(Skills.xp_mul(mm), 1.6)

func _test_exchange() -> void:
	var m := _fresh()
	# 기본 판매가 = 기본가, 교환 협상 레벨만큼 오르되 구매가 - 1 을 넘지 않는다 (철: 기본 8, 구매 24)
	ok.ex_base = HubLogic.sell_unit(m, "iron") == 8 and HubLogic.buy_unit("iron") == 24
	m.wallet.iron = 10.0
	ok.ex_sell = HubLogic.meta_sell(m, "iron", 4) == 4 and HubLogic.bal(m, "iron") == 6.0 and HubLogic.bal(m, "gold") == 32.0
	m.upgrades["e_click"] = 3.0
	ok.ex_click = HubLogic.sell_unit(m, "iron") == 11 and HubLogic.meta_sell(m, "iron", 100) == 6 and HubLogic.bal(m, "gold") == 32.0 + 66.0
	m.upgrades["e_click"] = 10.0
	ok.ex_cap = HubLogic.sell_unit(m, "iron") == 18 and HubLogic.sell_unit(m, "wood") == 5 # 나무: 기본 2, 구매 6 -> 최대 5
	ok.ex_nothing = HubLogic.meta_sell(m, "iron", 5) == 0 and HubLogic.meta_sell(m, "gold", 5) == 0
	# 구매: 골드가 모자라면 살 수 있는 만큼만
	m.wallet.gold = 50.0
	ok.ex_buy = HubLogic.meta_buy(m, "iron", 10) == 2 and HubLogic.bal(m, "gold") == 2.0 and HubLogic.bal(m, "iron") == 2.0
	ok.ex_poor = HubLogic.meta_buy(m, "iron", 1) == 0
	# 팔고 다시 사도 골드가 늘지 않는다
	m.wallet.gold = 0.0
	m.wallet.wood = 1.0
	HubLogic.meta_sell(m, "wood", 1)
	ok.ex_arb = HubLogic.meta_buy(m, "wood", 1) == 0

func _test_bank() -> void:
	var m := _fresh()
	# 번 스킬 포인트는 전부 정산된다 (회수율을 곱하지 않는다)
	var r := HubLogic.bank_run(m, {"wave": 2, "kills": 3, "gold": 10, "res": {}, "skillPoints": 4, "grant": {}})
	ok.bank_sp = int(r.kept.skillPoints) == 4 and HubLogic.bal(m, "skillPoints") == 4.0
	var r2 := HubLogic.bank_run(m, {"wave": 1, "kills": 0, "gold": 0, "res": {}, "skillPoints": 3, "grant": {"skillPoints": 1}})
	ok.bank_sp_grant = int(r2.kept.skillPoints) == 2 and HubLogic.bal(m, "skillPoints") == 6.0
	ok.bank_sp_none = int(HubLogic.bank_run(_fresh(), {"wave": 1, "kills": 0, "gold": 0, "res": {}}).kept.skillPoints) == 0

## 자동 로드가 _ready 를 끝낸 뒤라야 한다 (첫 프레임).
func _handover() -> void:
	gd = root.get_node("GameData")
	base_stun = float(HubLogic.data().stunBase)
	save.reset_meta()
	save.meta.skills = {"hp": 2.0, "dash": 2.0, "recoil": 3.0, "stun": 2.0, "gspeed": 2.0, "gextra": 3.0, "cap": 1.0, "mag": 1.0, "reload": 2.0,
		"steady": 2.0, "hs": 2.0, "run": 1.0, "dmg": 2.0, "loot": 2.0}
	save.pending_start_wave = 1
	game = load("res://scenes/game.tscn").instantiate()
	root.add_child(game)

func _check_game() -> void:
	var p = game.player
	var gun_mag := int(gd.guns["pistol"].mag)
	ok.g_hp = _near(p.max_hp, 100.0 + 40.0) and _near(p.hp, p.max_hp)
	ok.g_dash = _near(p.dash_cd_time, 1.4)
	ok.g_recoil = _near(p.recoil_mul, 0.7)
	ok.g_dmg = _near(p.dmg_mul, 1.2) and _near(float(p.stats("pistol").dmg), float(gd.guns["pistol"].dmg) * 1.2)
	ok.g_mag = int(p.stats("pistol").mag) == roundi(gun_mag * 1.2) and p.ammo == p.mag_size("pistol")
	ok.g_reload = _near(float(p.stats("pistol").reload), float(gd.guns["pistol"].reload) * 0.74)
	ok.g_spread = _near(float(p.stats("pistol").spread), float(gd.guns["pistol"].spread)) and _near(p.spread_mul, 0.84)
	ok.g_head = _near(p.head_mul, 1.24) and _near(p.speed_mul, 1.08)
	ok.g_stun = _near(float(gd.enemy_rules.stunBase), base_stun + 0.2)
	ok.g_gather = _near(float(game.meta.gatherExtra), 0.36) and _near(float(game.meta.gatherSpeed), 0.5)
	ok.g_cap = game.allies.cap() == 2 + 2 # 기본 2 + 사령관 1레벨(+2)
	# 아군 배율: 스킬 없음 1.0, 사령 훈련이 더해진다
	ok.g_ally_mul = _near(game.allies.dmg_mul(), 1.0) and _near(game.allies.hp_mul(), 1.0)
	save.meta.skills["adm"] = 2.0
	save.meta.skills["ahp"] = 4.0
	save.meta.skills["vrate"] = 5.0
	save.meta.skills["vcost"] = 3.0
	ok.g_ally_skill = _near(game.allies.dmg_mul(), 1.4) and _near(game.allies.hp_mul(), 2.0)
	# 재료 절약 3레벨: 초급 백신(약초 10, 샘플 6, 부품 2, 철 0) × 0.7 -> 7, 4, 1, 0
	var c: Dictionary = game.allies.vaccine_cost(0)
	ok.g_vcost = c.herb == 7 and c.sample == 4 and c.parts == 1 and c.iron == 0
	# 처치: 코인 × 1.3 (전리품 2레벨), 경험치
	game.roamers.enabled = false
	var z: Node = game.spawn_zombie("normal", game.player.global_position + Vector3(0, 0, -30), 0, false)
	var before: int = game.coins
	game._on_zombie_killed(z, 4)
	ok.g_loot = game.coins - before == roundi(4.0 * 1.3)
	ok.g_xp = _near(float(game.get_meta("run_xp").xp), 5.0)
	for i in 14: # 5 xp × 15 = 75 >= 68 -> 레벨 1 (스킬 포인트 1)
		game._on_zombie_killed(game.spawn_zombie("normal", game.player.global_position + Vector3(0, 0, -30), 0, false), 4)
	ok.g_level = Skills.run_level(game) == 1 and Skills.run_points(game) == 1
	# 엘리트는 경험치 3배
	var e: Node = game.spawn_zombie("normal", game.player.global_position + Vector3(0, 0, -30), 0, true)
	var xp0 := float(game.get_meta("run_xp").xp)
	game._on_zombie_killed(e, 12)
	ok.g_elite_xp = _near(float(game.get_meta("run_xp").xp) - xp0, 15.0)
	# 탭 창
	game.skill_panel.open()
	ok.g_panel = game.skill_panel.visible and game.get_tree().paused
	game.skill_panel.close()
	ok.g_panel_close = not game.skill_panel.visible and not game.get_tree().paused
	# 정산: 번 스킬 포인트 1 이 지갑으로
	save.meta.wallet.erase("skillPoints")
	var rep: Dictionary = save.bank_game(game)
	ok.g_bank_sp = int(rep.kept.skillPoints) == 1 and save.wallet("skillPoints") == 1.0

func _check_death_start() -> void:
	# 한 번 더 시작: 플레이어가 쓰러지면 사망 연출이 시작된다
	game.player.take_damage(9999.0)

func _process(_dt: float) -> bool:
	frames += 1
	if frames == 1:
		_handover()
	elif frames == 6:
		_check_game()
	elif frames == 8:
		_check_death_start()
	elif frames > 8:
		var card: Node = game.get_node_or_null("DeathCard")
		if card != null:
			if Engine.time_scale < 0.9:
				slow_seen = true
			if frames == 40:
				ok.d_card = true
				ok.d_slow = slow_seen
				ok.d_not_yet = not card.card_shown
			if frames >= 41 and not card.card_shown and frames == 41:
				card.skip() # 건너뛰기: 곧바로 카드
			if frames == 42:
				ok.d_card_shown = card.card_shown
				ok.d_time_back = _near(Engine.time_scale, 1.0)
				ok.d_rows = card.rows.size() == 6 and card.number_labels.size() == 6
				ok.d_phase = game.phase == "ended"
			if frames == 160:
				# 숫자가 다 올라갔다: 도달 웨이브 줄
				var first: Label = card.number_labels[0].label
				ok.d_count = first.text == str(int(card.report.wave)) and card.rows[0].modulate.a > 0.99
				_finish()
				return true
		elif frames == 20:
			ok.d_card = false
			_finish()
			return true
	return false

func _finish() -> void:
	Engine.time_scale = 1.0
	for f in [TEST_PATH, TEST_PATH + ".tmp"]:
		if FileAccess.file_exists(f):
			DirAccess.remove_absolute(ProjectSettings.globalize_path(f))
	var pass_ := true
	for k in ok:
		if not ok[k]:
			pass_ = false
			print("SKILLS FAIL: ", k)
	print("SKILLS ", ok.size(), " checks -> ", "PASS" if pass_ else "FAIL")
	quit(0 if pass_ else 1)
