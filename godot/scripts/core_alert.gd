extends RefCounted
## 핵 위치 화살표와 피격 알림의 규칙 (화면을 모르는 순수 계산). 웹 게임 src/corealert/logic/alert.ts 와 같은 규칙.
## 핵 체력이 줄면 경보가 켜지고(배너·경보음·붉은 점멸), 마지막 피격 뒤 CLEAR_AFTER 초가 지나면 꺼진다.
## 체력이 50%·25% 아래로 처음 내려갈 때는 따로 강조한다. 회복해서 문턱 위로 올라가면 다시 울릴 수 있다.

const CLEAR_AFTER := 4.0     # 마지막 피격 후 경보를 거두기까지(초)
const ALARM_COOLDOWN := 3.0  # 경보음 사이 최소 간격(초)
const EMPHASIS_TIME := 2.5   # 50%·25% 통과 강조가 이어지는 시간(초)
const NEAR_FULL := 40.0      # 이 거리 안이면 화살표가 또렷하고
const FAR_FADE := 220.0      # 이 거리 밖이면 가장 흐리다
const MIN_ALPHA := 0.35

var active := false
var since_hit := 99.0
var level := 0               # 0 정상, 1 체력 50% 이하를 겪음, 2 25% 이하를 겪음
var emphasis := 0.0          # 남은 강조 시간(초)
var emphasis_level := 0      # 강조 중인 문턱 (1 = 50%, 2 = 25%)
var phase := 0.0             # 점멸용 시계
var alarm_cd := 0.0
var last_hp := -1.0
var lane := -1               # 가장 최근 공격자의 레인 번호 (-1 = 모름)

## 체력이 바뀔 때마다 부른다 (줄었으면 피격, 늘었으면 회복). 일어난 일을 문자열 배열로 돌려준다:
## "hit" 피격 · "alarm" 경보음 · "half" 50% 통과 · "quarter" 25% 통과
func on_hp(hp: float, max_hp: float) -> Array:
	var ev: Array = []
	var frac := clampf(hp / maxf(1.0, max_hp), 0.0, 1.0)
	if last_hp >= 0.0 and hp < last_hp - 0.01:
		active = true
		since_hit = 0.0
		ev.append("hit")
		var alarm := alarm_cd <= 0.0
		if frac <= 0.25 and level < 2 and hp > 0.0:
			level = 2
			emphasis = EMPHASIS_TIME
			emphasis_level = 2
			ev.append("quarter")
			alarm = true
		elif frac <= 0.5 and level < 1:
			level = 1
			emphasis = EMPHASIS_TIME
			emphasis_level = 1
			ev.append("half")
			alarm = true
		if alarm:
			alarm_cd = ALARM_COOLDOWN
			ev.append("alarm")
	elif last_hp >= 0.0 and hp > last_hp + 0.01:
		if frac > 0.5:
			level = 0
		elif frac > 0.25 and level == 2:
			level = 1
	last_hp = hp
	return ev

## 매 프레임. 경보가 꺼지면 true.
func update(dt: float) -> bool:
	phase += dt
	alarm_cd = maxf(0.0, alarm_cd - dt)
	emphasis = maxf(0.0, emphasis - dt)
	var cleared := false
	if active:
		since_hit += dt
		if since_hit >= CLEAR_AFTER:
			active = false
			cleared = true
	return cleared

func reset() -> void:
	active = false
	since_hit = 99.0
	level = 0
	emphasis = 0.0
	alarm_cd = 0.0
	last_hp = -1.0
	lane = -1

## 점멸 세기 0..1. 경보 중에만 0보다 크고, 처음 맞은 직후와 강조 중에 더 세다.
func pulse() -> float:
	if not active:
		return 0.0
	var base := 0.5 + 0.5 * sin(phase * (9.0 if emphasis > 0.0 else 6.0))
	var fresh := clampf(1.0 - since_hit / 1.2, 0.0, 1.0)
	return clampf(0.35 + 0.65 * base * (0.6 + 0.4 * fresh) + (0.25 if emphasis > 0.0 else 0.0), 0.0, 1.0)

# ── 순수 도우미 ──────────────────────────────────────────────────────

## 플레이어가 보는 방향 기준 핵의 방위 (라디안, 0 = 정면, 양수 = 오른쪽, ±π = 뒤).
## (fx, fz) 는 시선의 수평 성분.
static func bearing(px: float, pz: float, fx: float, fz: float, tx: float, tz: float) -> float:
	var l := sqrt(fx * fx + fz * fz)
	if l < 0.0001:
		return 0.0
	fx /= l
	fz /= l
	var dx := tx - px
	var dz := tz - pz
	var right := dx * -fz + dz * fx
	var fwd := dx * fx + dz * fz
	return atan2(right, fwd)

## 방위를 화면 가장자리 점으로 바꾼다. 화면 중심에서 (sin, -cos) 방향으로 뻗은 반직선이 margin 만큼 안쪽 사각형과 만나는 곳.
static func edge_point(angle: float, w: float, h: float, margin: float) -> Vector2:
	var dir := Vector2(sin(angle), -cos(angle))
	var hx := maxf(1.0, w * 0.5 - margin)
	var hy := maxf(1.0, h * 0.5 - margin)
	var k := minf(hx / maxf(absf(dir.x), 0.0001), hy / maxf(absf(dir.y), 0.0001))
	return Vector2(w * 0.5, h * 0.5) + dir * k

## 거리에 따른 투명도: 가까울수록 또렷하고 멀수록 흐리다.
static func distance_alpha(d: float) -> float:
	var k := clampf((d - NEAR_FULL) / (FAR_FADE - NEAR_FULL), 0.0, 1.0)
	return lerpf(1.0, MIN_ALPHA, k)

## 핵 체력 비율에 따른 색: 청록 → 주황 → 빨강.
static func hp_color(frac: float) -> Color:
	var teal := Color8(0x2e, 0xe6, 0xd6)
	var orange := Color8(0xff, 0x8a, 0x2a)
	var red := Color8(0xe0, 0x30, 0x3a)
	if frac >= 0.85:
		return teal
	if frac >= 0.5:
		return teal.lerp(orange, (0.85 - frac) / 0.35)
	return orange.lerp(red, clampf((0.5 - frac) / 0.25, 0.0, 1.0))

## (x, z) 에서 가장 가까운 레인 번호 (끝 구간 웨이포인트 거리 기준). lanes 는 [{waypoints:[{x,z}...]}...].
static func nearest_lane(x: float, z: float, lanes: Array) -> int:
	var best := -1
	var best_d := INF
	for i in lanes.size():
		for p in lanes[i].waypoints:
			var d := Vector2(x - float(p.x), z - float(p.z)).length()
			if d < best_d:
				best_d = d
				best = i
	return best
