extends Node
## Progress that outlives a run (src/core/meta.ts) and the title settings (src/title/settings.ts).
## On the web it lives in the same localStorage keys as the classic game at /classic (same origin),
## so both versions share coins, upgrades, allies and the volume. On desktop: user://save.json (older builds wrote
## user://meta.json, which is still read once if save.json does not exist yet), user://settings.json.
## Fields this port does not use yet are kept as they are, so saving here never drops the classic game's data.

const META_KEY := "zt3d.meta.v1"
const SETTINGS_KEY := "3dgun.settings.v2"
const HubLogic := preload("res://scripts/hub_logic.gd")
const SAVE_PATH := "user://save.json"
const LEGACY_PATH := "user://meta.json"
const NUM_KEYS := ["currency", "totalRuns", "bestWave", "bestCheckpoint", "lastSeen", "totalKills"]
const MAP_KEYS := ["upgrades", "facilities", "wallet", "skills"]

var meta: Dictionary = {}
var settings: Dictionary = {}
## Desktop file of the meta save. Tests point this at a scratch file.
var save_path := SAVE_PATH
## Wave the next sortie starts at (bought in the headquarters, read once by meta_bonus.gd when the game scene starts).
var pending_start_wave := 1

func _ready() -> void:
	load_meta()
	var s := _read(SETTINGS_KEY, "user://settings.json")
	settings = {
		"volume": clampf(float(s.get("volume", 0.8)), 0.0, 1.0),
		"sensitivity": clampf(float(s.get("sensitivity", 1.0)), 0.3, 3.0),
		"locale": s.get("locale", "en") if s.get("locale", "en") in ["en", "ko"] else "en",
	}
	for k in s:
		if not settings.has(k):
			settings[k] = s[k]

## loadMeta(): reads the save (or starts fresh when it is missing or broken).
func load_meta() -> void:
	var d := _read(META_KEY, save_path)
	if d.is_empty() and not _web() and save_path == SAVE_PATH:
		d = _read(META_KEY, LEGACY_PATH)
	meta = _clean_meta(d)

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
	_write(META_KEY, save_path, meta)

func save_settings() -> void:
	_write(SETTINGS_KEY, "user://settings.json", settings)

func wallet(k: String) -> float:
	return float(meta.wallet.get(k, 0.0))

func add_wallet(k: String, v: float) -> void:
	meta.wallet[k] = wallet(k) + v

func upgrade_lv(id: String) -> int:
	return int(meta.upgrades.get(id, 0))

func skill_lv(id: String) -> int:
	return int(meta.skills.get(id, 0))

## bankRun(): what the run earned (start grant excluded) × keep ratio, plus the wave/kill bonus, goes to the wallet.
## snap: see hub_logic.gd bank_run(). Returns {gold, kept, waveBonus, keepRatio, newBest}.
func bank(snap: Dictionary) -> Dictionary:
	var report := HubLogic.bank_run(meta, snap)
	save_meta()
	return report

## Banks a finished game scene (game.gd): gold, resources and samples it holds, minus what the hub gave at the start.
func bank_game(game: Node) -> Dictionary:
	return bank({"wave": game.wave, "kills": game.kills, "gold": game.coins, "res": game.res, "samples": game.samples, "samplesSp": game.samples_sp, "skillPoints": game.get_meta("skill_points", 0),
		"grant": game.get_meta("run_grant", {})})

func bank_run(wave: int, kills: int, gold: int) -> Dictionary:
	return bank({"wave": wave, "kills": kills, "gold": gold})

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
		# 임시 파일에 쓴 뒤 바꿔치기: 쓰다가 꺼져도 예전 저장이 남는다
		var tmp := path + ".tmp"
		var f := FileAccess.open(tmp, FileAccess.WRITE)
		if f == null:
			return
		f.store_string(text)
		f.close()
		if DirAccess.rename_absolute(ProjectSettings.globalize_path(tmp), ProjectSettings.globalize_path(path)) != OK:
			var g := FileAccess.open(path, FileAccess.WRITE)
			if g:
				g.store_string(text)
