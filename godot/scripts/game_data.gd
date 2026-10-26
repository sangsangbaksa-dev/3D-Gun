extends Node
## Balance tables exported from the web game's src/data (see tools/export-data.ts).
## Never edit data/game_data.json by hand: change src/data and re-run the exporter.

var player: Dictionary
var guns: Dictionary
var gun_order: Array
var gun_upgrade: Dictionary
var gun_unlock_gold: Dictionary
var zombie_tuning: Dictionary
var zombie_reward: Dictionary
var enemy_rules: Dictionary
var max_alive: int
var boss_kit: Dictionary
var boss_move: Dictionary
var boss_types: Array
var elite: Dictionary
var final_wave: int
var core: Dictionary
var map: Dictionary
var res: Dictionary
var gather: Dictionary
var gather_layout: Array
var buildings: Dictionary
var building_order: Array
var base: Dictionary
var models: Dictionary
var _roster: Array
var _elite_chance: Array
var _lane_spawn: Array
var _stats_by_wave: Dictionary
var _wave_count: Array

func _ready() -> void:
	var f := FileAccess.open("res://data/game_data.json", FileAccess.READ)
	var d: Dictionary = JSON.parse_string(f.get_as_text())
	player = d.player
	guns = d.guns
	gun_order = d.gunOrder
	gun_upgrade = d.gunUpgrade
	gun_unlock_gold = d.gunUnlockGold
	zombie_tuning = d.zombieTuning
	zombie_reward = d.zombieReward
	enemy_rules = d.enemyRules
	max_alive = int(d.maxAlive)
	boss_kit = d.bossKit
	boss_move = d.bossMove
	boss_types = d.bossTypes
	elite = d.elite
	final_wave = int(d.finalWave)
	core = d.core
	map = d.map
	res = d.res
	gather = d.gather
	gather_layout = d.gatherLayout
	buildings = d.buildings
	building_order = d.buildingOrder
	base = d.base
	var mf := FileAccess.open("res://data/models.json", FileAccess.READ)
	models = JSON.parse_string(mf.get_as_text())
	_roster = d.waveRoster
	_elite_chance = d.eliteChance
	_lane_spawn = d.laneSpawnDist
	_stats_by_wave = d.zombieStatsByWave
	_wave_count = d.waveCount

## hp / speed / dmg / scale for a zombie type at a wave (waves past 50 use wave 50).
func zombie_stats(wave: int, type: String = "normal") -> Dictionary:
	var rows: Array = _stats_by_wave[type]
	return rows[clampi(wave, 1, rows.size()) - 1]

func wave_count(wave: int) -> int:
	return int(_wave_count[clampi(wave, 1, _wave_count.size()) - 1])

func _at(rows: Array, wave: int):
	return rows[clampi(wave, 1, rows.size()) - 1]

## [{type, weight, pack}] summing to 1 (waveRoster in src/data).
func wave_roster(wave: int) -> Array:
	return _at(_roster, wave)

func elite_chance(wave: int) -> float:
	return float(_at(_elite_chance, wave))

func lane_spawn_dist(wave: int) -> float:
	return float(_at(_lane_spawn, wave))

func is_boss_wave(wave: int) -> bool:
	return wave > 0 and wave % 10 == 0

## 10 bruiser, 20 blaster, 30 acid beast, 40 warlord, 50 king; cycles after 50.
func boss_type_for(wave: int) -> String:
	if wave == final_wave:
		return "king"
	return boss_types[(wave / 10 - 1) % boss_types.size()]
