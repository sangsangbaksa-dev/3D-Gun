extends Node
## Balance tables exported from the web game's src/data (see tools/export-data.ts).
## Never edit data/game_data.json by hand: change src/data and re-run the exporter.

var player: Dictionary
var guns: Dictionary
var zombie_tuning: Dictionary
var zombie_reward: Dictionary
var enemy_rules: Dictionary
var max_alive: int
var _stats_by_wave: Dictionary
var _wave_count: Array

func _ready() -> void:
	var f := FileAccess.open("res://data/game_data.json", FileAccess.READ)
	var d: Dictionary = JSON.parse_string(f.get_as_text())
	player = d.player
	guns = d.guns
	zombie_tuning = d.zombieTuning
	zombie_reward = d.zombieReward
	enemy_rules = d.enemyRules
	max_alive = int(d.maxAlive)
	_stats_by_wave = d.zombieStatsByWave
	_wave_count = d.waveCount

## hp / speed / dmg / scale for a zombie type at a wave (waves past 50 use wave 50).
func zombie_stats(wave: int, type: String = "normal") -> Dictionary:
	var rows: Array = _stats_by_wave[type]
	return rows[clampi(wave, 1, rows.size()) - 1]

func wave_count(wave: int) -> int:
	return int(_wave_count[clampi(wave, 1, _wave_count.size()) - 1])
