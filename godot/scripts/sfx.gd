extends Node
## Sound: plays the web game's synth sounds, recorded to assets/sfx by tools/audio (same recipes as
## src/audio/logic/cues.ts and src/player/view/sfx.ts). Rules ported from src/audio/index.ts:
## per-sound cooldown, pitch jitter, distance falloff 4–45 m and left/right pan, low-HP heartbeat,
## nearby zombie groans and the wind + drone ambience. Master volume follows Save.settings.volume.

const SFX_GAIN := 0.9          # synth.ts sfxBus
const GUN_GAIN := 0.32 / 0.5   # sfx.ts master 0.32, recorded at 0.5
const DRONE_REC := 0.2         # amb_drone recorded at 0.2
const NEAR := 4.0
const FAR := 45.0

var rules: Dictionary = {}
var _streams := {}
var _last := {}
var _wind: AudioStreamPlayer
var _drone: AudioStreamPlayer
var _drone_lp: AudioEffectLowPassFilter
var _wind_v := 0.0
var _drone_v := 0.0
var _cut := 300.0
var _amb := {"wind": 0.0, "drone": 0.0, "cutoff": 300.0}

func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	rules = JSON.parse_string(FileAccess.get_file_as_string("res://data/sfx.json"))
	# 여러 소리가 겹쳐도 찢어지지 않게 마지막에 가볍게 누른다 (engine.ts 의 컴프레서)
	var comp := AudioEffectCompressor.new()
	comp.threshold = -10.0
	comp.ratio = 4.0
	comp.attack_us = 3000.0
	comp.release_ms = 200.0
	AudioServer.add_bus_effect(0, comp)
	AudioServer.add_bus(1)
	AudioServer.set_bus_name(1, "Drone")
	_drone_lp = AudioEffectLowPassFilter.new()
	_drone_lp.cutoff_hz = 300.0
	_drone_lp.resonance = 0.6
	AudioServer.add_bus_effect(1, _drone_lp)
	_wind = _loop("amb_wind", "Master")
	_drone = _loop("amb_drone", "Drone")
	set_volume(float(Save.settings.volume))
	_amb = ambient_target("prep", false, 0.0, true)
	# UI 클릭: 버튼을 누르면 짧은 딸깍 (index.ts 의 pointerdown 리스너)
	get_tree().node_added.connect(func(n: Node):
		if n is BaseButton:
			n.button_down.connect(func(): play("click")))

func set_volume(v: float) -> void:
	AudioServer.set_bus_volume_db(0, linear_to_db(maxf(0.0001, v)))

func _stream(id: String) -> AudioStreamWAV:
	if not _streams.has(id):
		_streams[id] = load("res://assets/sfx/%s.wav" % id)
	return _streams[id]

## 가져오기(--import)를 안 한 프로젝트에서는 wav 를 못 읽어 null 이 돌아온다. 그러면 루프 플레이어도 없다(_process 가 건너뜀).
func _loop(id: String, bus: String) -> AudioStreamPlayer:
	var base := _stream(id)
	if base == null:
		return null
	var s: AudioStreamWAV = base.duplicate()
	s.loop_mode = AudioStreamWAV.LOOP_FORWARD
	s.loop_begin = 0
	s.loop_end = int(s.get_length() * s.mix_rate)
	var p := AudioStreamPlayer.new()
	p.stream = s
	p.bus = bus
	p.volume_db = -80.0
	add_child(p)
	p.play()
	return p

## CueGate: the same sound can't restart within its cooldown.
func _allow(id: String, cooldown: float) -> bool:
	var now := Time.get_ticks_msec() / 1000.0
	if _last.has(id) and now - float(_last[id]) < cooldown:
		return false
	_last[id] = now
	return true

## One cue from cues.ts. `at` (world position) adds distance falloff and panning around the camera.
func play(id: String, at = null, gain := 1.0) -> void:
	var r: Dictionary = rules.get(id, {"cooldown": 0.05, "jitter": 0.0})
	var cam := get_viewport().get_camera_3d() if is_inside_tree() else null
	if at is Vector3 and cam:
		gain *= distance_gain(Vector2(at.x - cam.global_position.x, at.z - cam.global_position.z).length())
		if gain <= 0.01:
			return
	if not _allow(id, float(r.cooldown)):
		return
	var pitch := 1.0 + (randf() * 2.0 - 1.0) * float(r.jitter)
	var st := _stream(id)
	if st == null:
		return
	_emit(st, SFX_GAIN * gain, pitch, at if at is Vector3 and cam else null)

## Gun sounds (sfx.ts): fire per gun, plus dry / switch / reload / reloadDone / hit / headshot / kill.
func gun(kind: String) -> void:
	if kind == "hit" and not _allow("gun_hit", 0.03):
		return
	var st := _stream("gun_" + kind)
	if st != null:
		_emit(st, GUN_GAIN, 1.0, null)

func _emit(s: AudioStream, gain: float, pitch: float, at) -> void:
	var p: Node
	if at is Vector3:
		# 거리 감쇠는 위에서 직접 계산했으니 고도의 감쇠는 끄고 좌우 위치만 쓴다 (panFor 의 0.8 배)
		var p3 := AudioStreamPlayer3D.new()
		p3.attenuation_model = AudioStreamPlayer3D.ATTENUATION_DISABLED
		p3.unit_size = 100.0
		p3.panning_strength = 0.8
		p3.volume_db = linear_to_db(gain)
		p3.pitch_scale = pitch
		p3.stream = s
		var host: Node = get_tree().current_scene if get_tree().current_scene else get_tree().root
		host.add_child(p3)
		p3.global_position = at
		p = p3
	else:
		var p2 := AudioStreamPlayer.new()
		p2.volume_db = linear_to_db(gain)
		p2.pitch_scale = pitch
		p2.stream = s
		add_child(p2)
		p = p2
	p.finished.connect(p.queue_free)
	p.play()

## distanceGain(): 1 inside 4 m, 0 past 45 m, squared falloff between.
static func distance_gain(d: float) -> float:
	if d <= NEAR:
		return 1.0
	if d >= FAR:
		return 0.0
	var k := 1.0 - (d - NEAR) / (FAR - NEAR)
	return k * k

## ambientTarget(): wind / drone levels and drone filter for the phase and tension (0..1).
static func ambient_target(phase: String, boss: bool, tension: float, paused: bool) -> Dictionary:
	var duck := 0.45 if paused else 1.0
	if phase == "ended":
		return {"wind": 0.05 * duck, "drone": 0.02 * duck, "cutoff": 260.0}
	var t := clampf(tension, 0.0, 1.0)
	if boss:
		return {"wind": 0.1 * duck, "drone": 0.1 * duck, "cutoff": 700.0}
	if phase == "combat":
		return {"wind": (0.08 + 0.03 * t) * duck, "drone": (0.04 + 0.05 * t) * duck, "cutoff": 380.0 + 260.0 * t}
	return {"wind": 0.07 * duck, "drone": 0.025 * duck, "cutoff": 300.0}

## heartbeatInterval(): seconds between beats under 30% HP, 0 = none.
static func heartbeat_interval(hp_frac: float) -> float:
	if not (hp_frac > 0.0) or hp_frac >= 0.3:
		return 0.0
	return 0.55 + hp_frac * 2.2

func set_ambient(t: Dictionary) -> void:
	_amb = t

func _process(dt: float) -> void:
	# setTargetAtTime(…, 1.5): 1.5초 시상수로 다가간다
	var k := 1.0 - exp(-dt / 1.5)
	_wind_v = lerpf(_wind_v, float(_amb.wind), k)
	_drone_v = lerpf(_drone_v, float(_amb.drone), k)
	_cut = lerpf(_cut, float(_amb.cutoff), k)
	if _wind:
		_wind.volume_db = linear_to_db(maxf(0.0001, _wind_v))
	if _drone:
		_drone.volume_db = linear_to_db(maxf(0.0001, _drone_v / DRONE_REC))
	_drone_lp.cutoff_hz = _cut
