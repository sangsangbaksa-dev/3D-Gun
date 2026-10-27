extends Node
## Progress that outlives a run (src/core/meta.ts) and the title settings (src/title/settings.ts).
## On the web it lives in the same localStorage keys as the classic game at /classic (same origin),
## so both versions share coins, upgrades, allies and the volume. On desktop: user://meta.json, user://settings.json.
## Fields this port does not use yet are kept as they are, so saving here never drops the classic game's data.

const META_KEY := "zt3d.meta.v1"
const SETTINGS_KEY := "3dgun.settings.v2"
const NUM_KEYS := ["currency", "totalRuns", "bestWave", "bestCheckpoint", "lastSeen", "totalKills"]
const MAP_KEYS := ["upgrades", "facilities", "wallet", "skills"]

var meta: Dictionary = {}
var settings: Dictionary = {}

func _ready() -> void:
	meta = _clean_meta(_read(META_KEY, "user://meta.json"))
	var s := _read(SETTINGS_KEY, "user://settings.json")
	settings = {
		"volume": clampf(float(s.get("volume", 0.8)), 0.0, 1.0),
		"sensitivity": clampf(float(s.get("sensitivity", 1.0)), 0.3, 3.0),
		"locale": s.get("locale", "en") if s.get("locale", "en") in ["en", "ko"] else "en",
	}
	for k in s:
		if not settings.has(k):
			settings[k] = s[k]

## loadMeta(): numbers must be finite, maps hold non-negative numbers, allies need hp > 0.
func _clean_meta(d: Dictionary) -> Dictionary:
	var m := d.duplicate(true)
	for k in NUM_KEYS:
		var v = d.get(k, 0)
		m[k] = float(v) if (v is float or v is int) and is_finite(float(v)) else 0.0
	for k in MAP_KEYS:
		var clean := {}
		var o = d.get(k, {})
		if o is Dictionary:
			for id in o:
				var v = o[id]
				if (v is float or v is int) and is_finite(float(v)) and float(v) >= 0.0:
					clean[id] = float(v)
		m[k] = clean
	var allies: Array = []
	for a in d.get("allies", []):
		if a is Dictionary and a.get("role") is String and float(a.get("hp", 0)) > 0.0 and float(a.get("maxHp", 0)) > 0.0:
			allies.append(a)
	m["allies"] = allies
	if not m.get("turrets") is Array:
		m["turrets"] = []
	return m

func save_meta() -> void:
	_write(META_KEY, "user://meta.json", meta)

func save_settings() -> void:
	_write(SETTINGS_KEY, "user://settings.json", settings)

func wallet(k: String) -> float:
	return float(meta.wallet.get(k, 0.0))

func add_wallet(k: String, v: float) -> void:
	meta.wallet[k] = wallet(k) + v

func upgrade_lv(id: String) -> int:
	return int(meta.upgrades.get(id, 0))

## bankRun(): part of the gold earned this run (keep ratio) plus a wave/kill bonus goes to the wallet.
## Resources and samples join when gathering is ported. Returns {gold, newBest}.
func bank_run(wave: int, kills: int, gold: int) -> Dictionary:
	var d: Dictionary = JSON.parse_string(FileAccess.get_file_as_string("res://data/meta_data.json"))
	var keep := minf(1.0, float(d.keepBase) + 0.06 * upgrade_lv("e_keep"))
	var total := floori(gold * keep) + floori(maxf(0.0, wave - 1) * float(d.waveBonusGold) + kills * float(d.killBonusGold))
	add_wallet("gold", total)
	meta.currency = float(meta.currency) + total
	var best := wave > int(meta.bestWave)
	meta.bestWave = maxf(float(meta.bestWave), wave)
	meta.totalRuns = float(meta.totalRuns) + 1.0
	meta.totalKills = float(meta.totalKills) + kills
	save_meta()
	return {"gold": total, "newBest": best}

## Wipes progress (title settings → reset). Same as resetMeta().
func reset_meta() -> void:
	meta = _clean_meta({})
	save_meta()

func _web() -> bool:
	return OS.has_feature("web")

func _read(key: String, path: String) -> Dictionary:
	var raw = null
	if _web():
		raw = JavaScriptBridge.eval("(function(){try{return localStorage.getItem(%s)}catch(e){return null}})()" % JSON.stringify(key), true)
	elif FileAccess.file_exists(path):
		raw = FileAccess.get_file_as_string(path)
	if not raw is String or raw == "":
		return {}
	var d = JSON.parse_string(raw)
	return d if d is Dictionary else {}

func _write(key: String, path: String, d: Dictionary) -> void:
	var text := JSON.stringify(d)
	if _web():
		JavaScriptBridge.eval("(function(){try{localStorage.setItem(%s,%s)}catch(e){}})()" % [JSON.stringify(key), JSON.stringify(text)], true)
	else:
		var f := FileAccess.open(path, FileAccess.WRITE)
		if f:
			f.store_string(text)
