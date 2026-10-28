extends RefCounted
## Skill tree and run experience (src/data/index.ts SKILLS · calcStats, tycoon2d/logic/economy.ts skillCost · buySkill · addXp).
## Pure rules over plain dictionaries, no nodes: `m` is the meta dictionary of save.gd (wallet, skills, upgrades ...).
## Skills are bought with skill points in the headquarters (or the Tab window) and take effect from the next sortie.
## Points are earned by levelling up during a run (kill xp) and banked on death (hub_logic.bank_run).

const HubLogic := preload("res://scripts/hub_logic.gd")

static func defs() -> Array:
	return HubLogic.data().skills

static func def(id: String) -> Dictionary:
	for s in defs():
		if s.id == id:
			return s
	return {}

static func level(m: Dictionary, id: String) -> int:
	return int(m.get("skills", {}).get(id, 0))

## skillCost(): costBase + current level.
static func cost(m: Dictionary, id: String) -> int:
	return int(HubLogic.data().idle.skillCostBase) + level(m, id)

## buySkill(): "ok", "max", "poor" or "unknown".
static func buy(m: Dictionary, id: String) -> String:
	var s := def(id)
	if s.is_empty():
		return "unknown"
	var lv := level(m, id)
	if lv >= int(s.max):
		return "max"
	var c := cost(m, id)
	if HubLogic.bal(m, "skillPoints") + 1e-9 < c:
		return "poor"
	m.wallet.skillPoints = HubLogic.bal(m, "skillPoints") - c
	m.skills[id] = float(lv + 1)
	return "ok"

## refundSkills(): every invested point comes back, levels reset. Returns the points.
static func refund(m: Dictionary) -> int:
	var n := 0
	var base := int(HubLogic.data().idle.skillCostBase)
	for id in m.skills:
		for i in int(m.skills[id]):
			n += base + i
	m.skills = {}
	m.wallet.skillPoints = HubLogic.bal(m, "skillPoints") + n
	return n

## calcStats(): statsBase + statsPerLevel × level, clamped by statsMin (spread/recoil never drop below it).
static func stats(levels: Dictionary) -> Dictionary:
	var d := HubLogic.data()
	var out: Dictionary = d.statsBase.duplicate()
	for id in d.statsPerLevel:
		var lv := float(levels.get(id, 0))
		var per: Dictionary = d.statsPerLevel[id]
		for k in per:
			out[k] = float(out[k]) + float(per[k]) * lv
	for k in d.statsMin:
		out[k] = maxf(float(d.statsMin[k]), float(out[k]))
	return out

static func stats_of(m: Dictionary) -> Dictionary:
	return stats(m.get("skills", {}))

# ── 글 ────────────────────────────────────────────────────────────────

const TEXT := {
	"en": {"skill.title": "Skills", "skill.points": "Skill points {n}", "skill.buy": "Learn · {n}", "skill.max": "MAX", "skill.reset": "Reset skills",
		"skill.close": "Close", "skill.levelup": "Level {lv}! Skill points +{sp} (spend them with Tab or at HQ)", "skill.hint": "Tab or Esc to close · changes apply from the next sortie",
		"skill.run": "Run level {lv} · XP {xp}/{next} · +{sp} points this run", "skill.hub": "Skills",
		"skill.branch.생존": "Survival", "skill.branch.채집": "Gathering", "skill.branch.연구": "Research", "skill.branch.사령": "Command",
		"skill.refunded": "Skills reset, {n} points returned"},
	"ko": {"skill.title": "스킬", "skill.points": "스킬 포인트 {n}", "skill.buy": "배우기 · {n}", "skill.max": "최대", "skill.reset": "스킬 초기화",
		"skill.close": "닫기", "skill.levelup": "레벨 {lv}! 스킬 포인트 +{sp} (Tab 또는 본부에서 사용)", "skill.hint": "Tab 또는 Esc 로 닫기 · 다음 출격부터 적용돼요",
		"skill.run": "런 레벨 {lv} · 경험치 {xp}/{next} · 이번 판 +{sp} 포인트", "skill.hub": "스킬",
		"skill.branch.생존": "생존", "skill.branch.채집": "채집", "skill.branch.연구": "연구", "skill.branch.사령": "사령",
		"skill.refunded": "스킬을 초기화했어요 (포인트 {n} 반환)"},
}

static func locale() -> String:
	var l = Engine.get_main_loop()
	var loc := "en"
	if l is SceneTree and l.root.has_node("I18n"):
		loc = String(l.root.get_node("I18n").locale)
	return loc

static func tx(key: String, args := {}) -> String:
	var s: String = TEXT[locale()].get(key, TEXT.en.get(key, key))
	for k in args:
		s = s.replace("{%s}" % k, str(args[k]))
	return s

## Skill name/description from the exported text table (meta_data.json text.<locale>).
static func name_of(id: String) -> String:
	return HubLogic.data().text.get(locale(), {}).get("skill.%s.name" % id, id)

static func desc_of(id: String) -> String:
	return HubLogic.data().text.get(locale(), {}).get("skill.%s.desc" % id, "")

# ── 런 경험치 ─────────────────────────────────────────────────────────

## xpToNext(): experience needed at run level `lv` (the run starts at level 0).
static func xp_to_next(lv: int) -> float:
	var x: Dictionary = HubLogic.data().runXp
	return float(x.base) + float(x.perLevel) * lv

## addXp(): r = {xp, level}; returns how many levels were gained.
static func add_xp(r: Dictionary, amount: float) -> int:
	r.xp = float(r.xp) + maxf(0.0, amount)
	var ups := 0
	while float(r.xp) >= xp_to_next(int(r.level)):
		r.xp = float(r.xp) - xp_to_next(int(r.level))
		r.level = int(r.level) + 1
		ups += 1
	return ups

## Run experience multiplier: the 교범 학습 upgrade (xpMul, +per × level).
static func xp_mul(m: Dictionary) -> float:
	return 1.0 + HubLogic.effect_sum(m, "xpMul")

# ── 출격에 반영 ───────────────────────────────────────────────────────

## Run state kept on the game node: run_xp {xp, level} and skill_points (earned this run, banked on death).
static func init_run(game: Node) -> void:
	game.set_meta("run_xp", {"xp": 0.0, "level": 0})
	game.set_meta("skill_points", 0)

static func run_level(game: Node) -> int:
	return int(game.get_meta("run_xp", {"level": 0}).level)

static func run_points(game: Node) -> int:
	return int(game.get_meta("skill_points", 0))

## Give kill xp. Returns the levels gained; each level adds runXp.spPerLevel skill points.
static func gain_xp(game: Node, amount: float) -> int:
	var run: Dictionary = game.get_meta("run_xp", {"xp": 0.0, "level": 0})
	var ups := add_xp(run, amount)
	game.set_meta("run_xp", run)
	if ups > 0:
		var sp := ups * int(HubLogic.data().runXp.spPerLevel)
		game.set_meta("skill_points", run_points(game) + sp)
	return ups

## A kill: returns the coins to add (× goldMul from 전리품) and gives xp for the zombie.
static func on_kill(game: Node, z: Node, gold: int) -> int:
	var save: Node = game.get_node("/root/Save")
	var gd: Node = game.get_node("/root/GameData")
	var st: Dictionary = game.get_meta("skill_stats", {})
	var coins := roundi(float(gold) * float(st.get("goldMul", 1.0)))
	if z.converted:
		return coins
	var rw: Dictionary = gd.zombie_reward.get(z.type, {})
	var amount := float(rw.get("xp", 0)) * (float(gd.elite.reward) if z.elite else 1.0) * xp_mul(save.meta)
	var ups := gain_xp(game, amount)
	if ups > 0:
		var run: Dictionary = game.get_meta("run_xp")
		game.toast(tx("skill.levelup", {"lv": int(run.level), "sp": ups * int(HubLogic.data().runXp.spPerLevel)}))
	return coins

## Fills the player, game and rules with the skill stats (once when the game scene starts, after meta_bonus.gd).
static func apply(game: Node) -> void:
	var save: Node = game.get_node("/root/Save")
	var gd: Node = game.get_node("/root/GameData")
	var st := stats_of(save.meta)
	game.set_meta("skill_stats", st)
	init_run(game)
	var p: Node = game.player
	p.max_hp += float(st.maxHp) - float(HubLogic.data().statsBase.maxHp)
	p.hp = p.max_hp
	p.dmg_mul += float(st.dmgMul) - 1.0 # 웹: 영구 업그레이드의 dmgMul 과 스킬 dmgMul 은 더한다
	p.dash_cd_time = float(st.dashCd)
	p.recoil_mul = float(st.recoilMul)
	p.mag_mul = float(st.magMul)
	p.reload_mul = float(st.reloadMul)
	p.spread_mul = float(st.spreadMul)
	p.head_mul = float(st.headMul)
	p.speed_mul = float(st.speedMul)
	for id in p.owned:
		p.refresh_gun(id) # 탄창 배율이 바뀌었으니 다시 채운다
	game.meta["gatherSpeed"] = float(game.meta.get("gatherSpeed", 0.0)) + float(st.gatherSpeed) - 1.0
	game.meta["gatherExtra"] = float(game.meta.get("gatherExtra", 0.0)) + float(st.gatherExtra)
	# 기절 확률: zombie.gd 는 enemy_rules.stunBase 를 읽는다. 오토로드라 장면이 바뀌어도 남으므로 매번 기본값에서 다시 정한다
	gd.enemy_rules["stunBase"] = float(HubLogic.data().stunBase) + float(st.stunBonus)
