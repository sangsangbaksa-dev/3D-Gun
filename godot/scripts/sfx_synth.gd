extends RefCounted
## 런타임 합성 효과음: wav 를 따로 두지 않고 처음 쓸 때 22.05 kHz 16비트 모노로 한 번 만들어 캐시한다
## (총 0.1~1.7초, 루프 하나 4초 — 전부 합쳐도 수백 KB). 웹 원본에 없던 발소리·재장전 단계음·좀비 종류별 소리·앰비언트용.

const RATE := 22050

const IDS := [
	"step_dirt", "step_grass", "step_stone", "step_metal", "jump", "land", "dash",
	"mag_out", "mag_in", "chamber", "pump", "shell", "bolt", "cylinder",
	"z_growl", "z_rasp", "z_scream", "z_spit", "z_leap", "z_swipe", "roar",
	"sting_warn", "repair", "amb_far", "amb_cricket", "amb_creak", "amb_tension",
]

static func has(id: String) -> bool:
	return id in IDS

static func make(id: String) -> AudioStreamWAV:
	var rng := RandomNumberGenerator.new()
	rng.seed = hash(id) # 같은 이름은 항상 같은 소리
	var buf := _recipe(id, rng)
	var pcm := PackedByteArray()
	pcm.resize(buf.size() * 2)
	for i in buf.size():
		pcm.encode_s16(i * 2, int(clampf(buf[i], -1.0, 1.0) * 32000.0))
	var w := AudioStreamWAV.new()
	w.format = AudioStreamWAV.FORMAT_16_BITS
	w.mix_rate = RATE
	w.stereo = false
	w.data = pcm
	if id == "amb_tension":
		w.loop_mode = AudioStreamWAV.LOOP_FORWARD
		w.loop_begin = 0
		w.loop_end = buf.size()
	return w

# ── 재료 ─────────────────────────────────────────────────────────────

static func _buf(dur: float) -> PackedFloat32Array:
	var b := PackedFloat32Array()
	b.resize(int(dur * RATE))
	return b

## 한 극 저역 통과 잡음 (k 가 클수록 밝다).
static func _noise(r: RandomNumberGenerator, n: int, k: float) -> PackedFloat32Array:
	var o := PackedFloat32Array()
	o.resize(n)
	var y := 0.0
	for i in n:
		y += (r.randf() * 2.0 - 1.0 - y) * k
		o[i] = y
	return o

static func _env(t: float, decay: float, attack := 0.002) -> float:
	return minf(1.0, t / attack) * exp(-t / decay)

static func _add_click(b: PackedFloat32Array, at: float, f: float, decay: float, amp: float) -> void:
	var s := int(at * RATE)
	for i in range(s, b.size()):
		var t := float(i - s) / RATE
		var e := exp(-t / decay)
		if e < 0.01:
			break
		b[i] += sin(TAU * f * t) * e * amp

static func _add_noise(b: PackedFloat32Array, r: RandomNumberGenerator, at: float, dur: float, k: float, decay: float, amp: float) -> void:
	var s := int(at * RATE)
	var nz := _noise(r, int(dur * RATE), k)
	for i in nz.size():
		if s + i >= b.size():
			break
		b[s + i] += nz[i] * _env(float(i) / RATE, decay) * amp

static func _whoosh(r: RandomNumberGenerator, dur: float, k: float, amp: float) -> PackedFloat32Array:
	var b := _buf(dur)
	var nz := _noise(r, b.size(), k)
	for i in b.size():
		b[i] = nz[i] * sin(PI * clampf(float(i) / RATE / dur, 0.0, 1.0)) * amp
	return b

## 으르렁: 톱니파 + 떨림 + 잡음. f0 = 기본음, grit = 잡음 비율.
static func _growl(dur: float, f0: float, grit: float, r: RandomNumberGenerator) -> PackedFloat32Array:
	var b := _buf(dur)
	var nz := _noise(r, b.size(), 0.3)
	for i in b.size():
		var t := float(i) / RATE
		var f := f0 * (1.0 + 0.12 * sin(PI * t / dur)) + 5.0 * sin(TAU * 6.0 * t)
		var saw := fposmod(f * t, 1.0) * 2.0 - 1.0
		var env := pow(sin(PI * clampf(t / dur, 0.0, 1.0)), 0.7)
		b[i] = (saw * (1.0 - grit) * 0.5 + nz[i] * grit * 1.4 + sin(TAU * f * 2.0 * t) * 0.12) * env * 0.8
	return b

static func _smooth(b: PackedFloat32Array, n: int) -> PackedFloat32Array:
	var o := PackedFloat32Array()
	o.resize(b.size())
	var acc := 0.0
	for i in b.size():
		acc += b[i]
		if i >= n:
			acc -= b[i - n]
		o[i] = acc / n
	return o

# ── 소리 모음 ────────────────────────────────────────────────────────

static func _recipe(id: String, r: RandomNumberGenerator) -> PackedFloat32Array:
	var b: PackedFloat32Array
	match id:
		"step_dirt":
			b = _buf(0.14)
			_add_noise(b, r, 0.0, 0.12, 0.22, 0.04, 2.2)
			_add_click(b, 0.0, 85.0, 0.05, 0.5)
		"step_grass":
			b = _buf(0.16)
			_add_noise(b, r, 0.0, 0.15, 0.5, 0.06, 1.3)
			_add_click(b, 0.0, 110.0, 0.04, 0.2)
		"step_stone":
			b = _buf(0.12)
			_add_noise(b, r, 0.0, 0.05, 0.9, 0.012, 1.0)
			_add_click(b, 0.0, 190.0, 0.035, 0.7)
		"step_metal":
			b = _buf(0.22)
			_add_noise(b, r, 0.0, 0.04, 0.9, 0.01, 0.8)
			_add_click(b, 0.0, 640.0, 0.07, 0.3)
			_add_click(b, 0.0, 1180.0, 0.05, 0.18)
			_add_click(b, 0.0, 120.0, 0.04, 0.4)
		"jump":
			b = _buf(0.18)
			_add_noise(b, r, 0.0, 0.17, 0.3, 0.07, 1.0)
			for i in b.size():
				var t := float(i) / RATE
				b[i] += sin(TAU * (160.0 + 420.0 * t) * t) * _env(t, 0.06, 0.01) * 0.15
		"land":
			b = _buf(0.24)
			_add_click(b, 0.0, 62.0, 0.09, 0.9)
			_add_noise(b, r, 0.0, 0.2, 0.2, 0.06, 1.6)
		"dash":
			b = _whoosh(r, 0.3, 0.7, 1.4)
		"mag_out":
			b = _buf(0.22)
			_add_click(b, 0.0, 1400.0, 0.012, 0.45)
			_add_noise(b, r, 0.0, 0.1, 0.6, 0.03, 0.9)
			_add_click(b, 0.07, 240.0, 0.05, 0.5)
		"mag_in":
			b = _buf(0.2)
			_add_click(b, 0.0, 170.0, 0.05, 0.8)
			_add_noise(b, r, 0.0, 0.06, 0.7, 0.018, 1.0)
			_add_click(b, 0.045, 1800.0, 0.01, 0.4)
		"chamber":
			b = _buf(0.3)
			_add_click(b, 0.0, 950.0, 0.025, 0.5)
			_add_noise(b, r, 0.0, 0.05, 0.9, 0.012, 0.8)
			_add_click(b, 0.12, 1300.0, 0.03, 0.55)
			_add_noise(b, r, 0.12, 0.05, 0.9, 0.012, 0.8)
		"pump":
			b = _buf(0.34)
			_add_noise(b, r, 0.0, 0.06, 0.5, 0.02, 1.0)
			_add_click(b, 0.0, 420.0, 0.04, 0.6)
			_add_noise(b, r, 0.15, 0.07, 0.6, 0.025, 1.2)
			_add_click(b, 0.15, 300.0, 0.05, 0.7)
		"shell":
			b = _buf(0.12)
			_add_click(b, 0.0, 2400.0, 0.015, 0.4)
			_add_click(b, 0.03, 1600.0, 0.02, 0.3)
		"bolt":
			b = _buf(0.45)
			_add_noise(b, r, 0.0, 0.2, 0.35, 0.09, 0.7)
			_add_click(b, 0.0, 800.0, 0.03, 0.4)
			_add_click(b, 0.22, 1000.0, 0.03, 0.5)
			_add_noise(b, r, 0.22, 0.06, 0.8, 0.015, 0.8)
		"cylinder":
			b = _buf(0.26)
			for k in 4:
				_add_click(b, 0.04 * k, 1500.0 + 150.0 * k, 0.012, 0.35)
			_add_click(b, 0.18, 200.0, 0.04, 0.5)
		"z_growl":
			b = _growl(0.8, 78.0, 0.45, r)
		"z_rasp":
			b = _growl(0.55, 150.0, 0.7, r)
		"z_scream":
			b = _buf(0.9)
			for i in b.size():
				var t := float(i) / RATE
				var f := 620.0 + 520.0 * sin(PI * minf(1.0, t / 0.9)) + 25.0 * sin(TAU * 9.0 * t)
				var saw := fposmod(f * t, 1.0) * 2.0 - 1.0
				b[i] = (saw * 0.5 + sin(TAU * f * 2.0 * t) * 0.15) * sin(PI * t / 0.9) * 0.55
		"z_spit":
			b = _buf(0.3)
			_add_noise(b, r, 0.0, 0.28, 0.45, 0.07, 1.7)
			_add_click(b, 0.0, 260.0, 0.05, 0.4)
		"z_leap":
			b = _whoosh(r, 0.32, 0.5, 1.0)
			for i in b.size():
				var t := float(i) / RATE
				b[i] += sin(TAU * (180.0 + 300.0 * t) * t) * _env(t, 0.09) * 0.2
		"z_swipe":
			b = _whoosh(r, 0.2, 0.6, 0.9)
		"roar":
			b = _buf(1.7)
			var nz := _noise(r, b.size(), 0.18)
			for i in b.size():
				var t := float(i) / RATE
				var f := 52.0 + 18.0 * sin(PI * t / 1.7) + 4.0 * sin(TAU * 13.0 * t)
				var sq := 1.0 if fposmod(f * t, 1.0) < 0.5 else -1.0
				var env := pow(sin(PI * clampf(t / 1.7, 0.0, 1.0)), 0.6)
				b[i] = (sq * 0.35 + sin(TAU * f * 2.0 * t) * 0.25 + nz[i] * 1.6) * env
		"sting_warn":
			b = _buf(0.7)
			for i in b.size():
				var t := float(i) / RATE
				var f := 392.0 if t < 0.28 else 294.0
				var tt := t if t < 0.28 else t - 0.28
				var sq := 1.0 if fposmod(f * t, 1.0) < 0.5 else -1.0
				b[i] = (sq * 0.12 + sin(TAU * f * t) * 0.3) * _env(tt, 0.2, 0.01)
		"repair":
			b = _buf(0.3)
			for k in 3:
				_add_click(b, 0.07 * k, 2200.0 - 150.0 * k, 0.012, 0.35)
				_add_noise(b, r, 0.07 * k, 0.03, 0.8, 0.01, 0.7)
			_add_click(b, 0.22, 520.0, 0.05, 0.4)
		"amb_far":
			# 멀리서 들리는 먹먹한 신음 (이동 평균으로 고음 제거)
			b = _smooth(_growl(1.3, 62.0, 0.35, r), 6)
			for i in b.size():
				b[i] *= 0.7
		"amb_cricket":
			b = _buf(1.0)
			for k in 4:
				var s := int((0.1 + 0.18 * k) * RATE)
				for i in int(0.07 * RATE):
					if s + i < b.size():
						var t := float(i) / RATE
						b[s + i] += sin(TAU * 3900.0 * t) * sin(PI * t / 0.07) * 0.18
		"amb_creak":
			b = _buf(1.1)
			for i in b.size():
				var t := float(i) / RATE
				var f := 210.0 + 70.0 * sin(TAU * 3.0 * t) + 80.0 * t
				b[i] = (fposmod(f * t, 1.0) * 2.0 - 1.0) * 0.18 * sin(PI * t / 1.1) * (0.6 + 0.4 * sin(TAU * 17.0 * t))
		"amb_tension":
			# 4초 루프: 55 Hz 와 57 Hz 의 맥놀이(2 Hz) + 0.5 Hz 맥박. 정수 주기라 이음매가 없다.
			b = _buf(4.0)
			for i in b.size():
				var t := float(i) / RATE
				var pulse := 0.65 + 0.35 * pow(maxf(0.0, sin(TAU * 0.5 * t)), 2.0)
				b[i] = (sin(TAU * 55.0 * t) + sin(TAU * 57.0 * t) * 0.8 + sin(TAU * 110.0 * t) * 0.15) * pulse * 0.35
		_:
			b = _buf(0.05)
	return b
