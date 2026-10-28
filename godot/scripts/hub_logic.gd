extends RefCounted
## Rules of the 2D headquarters (src/tycoon2d/logic/economy.ts), kept free of nodes and files so they can be tested
## with a plain Dictionary. `m` is the meta dictionary of save.gd: {wallet, upgrades, facilities, bestWave, ...}.
## Every function that changes `m` leaves saving to the caller.

const WALLET := ["gold", "wood", "stone", "iron", "herb", "parts", "samples", "samplesSp", "skillPoints"]
const RES := ["wood", "stone", "iron", "herb", "parts"]
const FINAL_WAVE := 50 # FINAL_WAVE in src/data (game_data.json finalWave)

static var _data: Dictionary = {}

static func data() -> Dictionary:
	if _data.is_empty():
		_data = JSON.parse_string(FileAccess.get_file_as_string("res://data/meta_data.json"))
	return _data

static func upgrade_def(id: String) -> Dictionary:
	for u in data().upgrades:
		if u.id == id:
			return u
	return {}

static func producer_def(id: String) -> Dictionary:
	for p in data().producers:
		if p.id == id:
			return p
	return {}

static func bal(m: Dictionary, k: String) -> float:
	return float(m.wallet.get(k, 0.0))

static func upgrade_lv(m: Dictionary, id: String) -> int:
	return int(m.upgrades.get(id, 0))

static func facility_lv(m: Dictionary, id: String) -> int:
	return int(m.facilities.get(id, 0))

## costAt(): base × growth^lv, rounded up.
static func cost_at(base: Dictionary, growth: float, lv: int) -> Dictionary:
	var out := {}
	for k in base:
		out[k] = ceili(float(base[k]) * pow(growth, lv))
	return out

static func can_afford(m: Dictionary, c: Dictionary) -> bool:
	for k in c:
		if bal(m, k) + 1e-9 < float(c[k]):
			return false
	return true

static func pay(m: Dictionary, c: Dictionary) -> void:
	for k in c:
		m.wallet[k] = maxf(0.0, bal(m, k) - float(c[k]))

static func add(m: Dictionary, g: Dictionary) -> void:
	for k in g:
		m.wallet[k] = bal(m, k) + float(g[k])

# ── 영구 업그레이드 ───────────────────────────────────────────────────

static func upgrade_cost(m: Dictionary, u: Dictionary) -> Dictionary:
	return cost_at(u.cost, float(u.costGrowth), upgrade_lv(m, u.id))

## Empty string when open, else the id of the missing prerequisite.
static func upgrade_lock(m: Dictionary, u: Dictionary) -> String:
	if not u.has("requires"):
		return ""
	return "" if upgrade_lv(m, u.requires.id) >= int(u.requires.lv) else String(u.requires.id)

## buyUpgrade(): returns "ok", "max", "poor", "locked" or "unknown".
static func buy_upgrade(m: Dictionary, id: String) -> String:
	var u := upgrade_def(id)
	if u.is_empty():
		return "unknown"
	if upgrade_lv(m, id) >= int(u.max):
		return "max"
	if upgrade_lock(m, u) != "":
		return "locked"
	var c := upgrade_cost(m, u)
	if not can_afford(m, c):
		return "poor"
	pay(m, c)
	m.upgrades[id] = float(upgrade_lv(m, id) + 1)
	return "ok"

## Sum of `per × level` over the upgrades of one effect kind (bonuses() in economy.ts).
static func effect_sum(m: Dictionary, kind: String) -> float:
	var s := 0.0
	for u in data().upgrades:
		if u.effect.kind == kind:
			s += float(u.effect.per) * upgrade_lv(m, u.id)
	return s

# ── 방치 생산 시설 ────────────────────────────────────────────────────

static func facility_cost(m: Dictionary, p: Dictionary) -> Dictionary:
	return cost_at(p.cost, float(p.costGrowth), facility_lv(m, p.id))

static func facility_unlocked(m: Dictionary, p: Dictionary) -> bool:
	if not p.has("unlockEarned"):
		return true
	var u: Dictionary = p.unlockEarned
	return facility_lv(m, p.id) > 0 or bal(m, u.key) >= float(u.amount) or float(m.totalRuns) > 3.0

static func buy_facility(m: Dictionary, id: String) -> String:
	var p := producer_def(id)
	if p.is_empty():
		return "unknown"
	if facility_lv(m, id) >= int(p.max):
		return "max"
	if not facility_unlocked(m, p):
		return "locked"
	var c := facility_cost(m, p)
	if not can_afford(m, c):
		return "poor"
	pay(m, c)
	m.facilities[id] = float(facility_lv(m, id) + 1)
	return "ok"

## Income multiplier: 운영 효율 upgrades × the global producerIncomeMul.
static func income_mul(m: Dictionary) -> float:
	return (1.0 + effect_sum(m, "incomeMul")) * float(data().idle.producerIncomeMul)

static func facility_income(m: Dictionary, p: Dictionary) -> float:
	return float(p.perSec) * facility_lv(m, p.id) * income_mul(m)

## Per second, by wallet key.
static func income_per_sec(m: Dictionary) -> Dictionary:
	var out := {}
	for p in data().producers:
		if facility_lv(m, p.id) > 0:
			out[p.produces] = float(out.get(p.produces, 0.0)) + facility_income(m, p)
	return out

## tick(): idle income for dt seconds, only while the headquarters is on screen (no offline pay). Returns what was added.
static func tick(m: Dictionary, dt: float) -> Dictionary:
	var out := {}
	var inc := income_per_sec(m)
	for k in inc:
		var v: float = float(inc[k]) * dt
		out[k] = v
		m.wallet[k] = bal(m, k) + v
		if k == "gold":
			m.currency = float(m.currency) + v
	return out

# ── 출격 웨이브 구매 ──────────────────────────────────────────────────

static func max_start_wave(m: Dictionary) -> int:
	return clampi(int(m.bestWave), 1, FINAL_WAVE)

static func wave_skip_discount(m: Dictionary) -> float:
	return minf(0.8, effect_sum(m, "startWave") * 0.08)

## startWaveSkipCost(): every wave in from+1..to adds a step cost.
static func start_wave_cost(m: Dictionary, from_wave: int, to_wave: int) -> Dictionary:
	var mul := maxf(0.2, 1.0 - wave_skip_discount(m))
	var out := {}
	var lo := maxi(1, from_wave)
	for w in range(lo + 1, maxi(lo, to_wave) + 1):
		out.gold = int(out.get("gold", 0)) + floori((68.0 + w * 48.0 * pow(1.13, w - 2)) * mul)
		if w >= 3:
			out.iron = int(out.get("iron", 0)) + maxi(1, floori((1.0 + w / 4.0) * mul))
		if w >= 5:
			out.parts = int(out.get("parts", 0)) + maxi(1, floori((1.0 + w / 6.0) * mul))
		if w >= 8 and w % 4 == 0:
			out.samples = int(out.get("samples", 0)) + 1
	return out

## buyStartWaveSkip(): "ok" (paid, or wave 1 for free), "locked" (not reached yet) or "poor".
static func buy_start_wave(m: Dictionary, target: int) -> String:
	if target <= 1:
		return "ok"
	if target > max_start_wave(m):
		return "locked"
	var c := start_wave_cost(m, 1, target)
	if not can_afford(m, c):
		return "poor"
	pay(m, c)
	return "ok"

# ── 런 정산 ───────────────────────────────────────────────────────────

## bankRun(): the part of what the run earned (start grant excluded) that survives death, plus the wave/kill bonus.
## snap: {wave, kills, gold, res:{}, samples, samplesSp, grant:{gold, res:{}, samples}}. Returns {gold, kept, waveBonus, keepRatio, newBest}.
static func bank_run(m: Dictionary, snap: Dictionary) -> Dictionary:
	var d := data()
	var keep := minf(1.0, float(d.keepBase) + effect_sum(m, "keepRatio"))
	var g: Dictionary = snap.get("grant", {})
	var kept := {
		"gold": floori(maxf(0.0, float(snap.get("gold", 0)) - float(g.get("gold", 0))) * keep),
		"samples": floori(maxf(0.0, float(snap.get("samples", 0)) - float(g.get("samples", 0))) * keep),
		"samplesSp": floori(float(snap.get("samplesSp", 0)) * keep),
	}
	var gres: Dictionary = g.get("res", {})
	for r in snap.get("res", {}):
		kept[r] = floori(maxf(0.0, float(snap.res[r]) - float(gres.get(r, 0))) * keep)
	var wave := int(snap.get("wave", 0))
	var kills := int(snap.get("kills", 0))
	var wave_bonus := floori(maxf(0.0, wave - 1) * float(d.waveBonusGold) + kills * float(d.killBonusGold))
	var total := kept.duplicate()
	total.gold = int(total.gold) + wave_bonus
	add(m, total)
	m.currency = float(m.currency) + float(total.gold)
	var best := wave > int(m.bestWave)
	m.bestWave = maxf(float(m.bestWave), wave)
	m.totalRuns = float(m.totalRuns) + 1.0
	m.totalKills = float(m.totalKills) + kills
	return {"gold": int(total.gold), "kept": kept, "waveBonus": wave_bonus, "keepRatio": keep, "newBest": best}
