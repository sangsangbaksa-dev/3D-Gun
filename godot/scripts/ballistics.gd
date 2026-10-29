extends RefCounted
## 탄도와 반동 규칙. 웹 게임의 src/player/logic (hitscan.ts 의 낙차, controller.ts·movement.ts 의 시선 반동)을 그대로 옮긴 것.
## 노드 없이 부를 수 있는 정적 함수만 둔다 (tests/ballistics_test.gd 가 직접 검사한다). 수치는 GameData.player / guns 에서 온다.
##
## 낙차: 총알은 직선 방향으로 날다가 비행 거리 t(m)에서 y 가 bulletDrop * dropMul * t² 만큼 내려간다.
##       (30m 약 0.7m, 50m 약 2m. 저격총은 dropMul 0.05 라 1/20.) 조준 보정은 원본에도 없다 - 조준선은 항상 시선 방향이다.
## 반동: 한 발마다 시선이 위로 튄다(kick, 라디안). 연사(bloom)가 쌓일수록 더 튀고, 조준하면 0.45배. 가로 반동과 앉기 보정은 원본에 없다.

## 한 구간의 길이(m). 구간 안의 포물선 오차는 낙차 × s²/4 라 8m 구간이면 최대 약 1.3cm.
const TRACE_STEP := 8.0

## 시선 반동. controller.ts: kickCap/kickMul, movement.ts: kickRecover, controller.ts: 쏘지 않을 때 추가 회복
const KICK_CAP := 0.62
const KICK_CAP_SNIPER := 0.92
const KICK_MUL := 2.4
const KICK_MUL_SNIPER := 3.4
const KICK_AIM_MUL := 0.45
const KICK_SPRAY := 0.85
const KICK_RECOVER := 0.85
const KICK_RECOVER_IDLE := 4.0
const KICK_IDLE_AFTER := 0.16

# ── 낙차 ─────────────────────────────────────────────────────────────

## 비행 거리 t(m)에서 내려간 높이. hitscan.ts bulletDropAt
static func drop_at(t: float, drop_mul: float, bullet_drop: float) -> float:
	return bullet_drop * drop_mul * t * t

## 직선 방향 + 낙차. hitscan.ts rayPoint
static func point_at(o: Vector3, d: Vector3, t: float, drop_mul: float, bullet_drop: float) -> Vector3:
	return o + d * t - Vector3(0, drop_at(t, drop_mul, bullet_drop), 0)

## 총알 길을 8m 구간으로 잘라 물리 광선을 쏜다. 처음 닿는 것 하나를 돌려준다 (없으면 빈 Dictionary).
## 돌려주는 값: intersect_ray 결과 + "t" (직선 기준 비행 거리, 사거리 감쇠에 쓴다).
## t_from 은 관통탄이 맞힌 곳 다음부터 다시 쏠 때 쓴다.
static func trace(space: PhysicsDirectSpaceState3D, o: Vector3, d: Vector3, max_t: float, drop_mul: float, bullet_drop: float,
		mask: int, exclude: Array[RID] = [], t_from := 0.0) -> Dictionary:
	var t0 := t_from
	var p0 := point_at(o, d, t0, drop_mul, bullet_drop)
	while t0 < max_t:
		var t1 := minf(t0 + TRACE_STEP, max_t)
		var p1 := point_at(o, d, t1, drop_mul, bullet_drop)
		var q := PhysicsRayQueryParameters3D.create(p0, p1, mask)
		q.exclude = exclude
		var hit := space.intersect_ray(q)
		if not hit.is_empty():
			var seg := p0.distance_to(p1)
			hit["t"] = t0 + (t1 - t0) * (p0.distance_to(hit.position) / seg if seg > 1e-6 else 0.0)
			return hit
		t0 = t1
		p0 = p1
	return {}

# ── 반동 ─────────────────────────────────────────────────────────────

## 한 발 쏜 뒤의 시선 반동(라디안). bloom_after 는 이번 발이 더해진 뒤의 값. controller.ts 의 p.kick 갱신식
static func kick_after_shot(kick: float, gun: Dictionary, bloom_after: float, aiming: bool, recoil_mul := 1.0) -> float:
	var sniper := String(gun.kind) == "sniper"
	var cap := KICK_CAP_SNIPER if sniper else KICK_CAP
	var mul := KICK_MUL_SNIPER if sniper else KICK_MUL
	var spray := 1.0 + bloom_after * KICK_SPRAY
	return minf(cap, kick + float(gun.recoil) * mul * recoil_mul * (KICK_AIM_MUL if aiming else 1.0) * spray)

## 매 프레임 천천히 돌아오는 양. movement.ts (쏘는 동안에도 이만큼은 내려온다)
static func kick_recover(kick: float, dt: float) -> float:
	return maxf(0.0, kick - kick * dt * KICK_RECOVER)

## 마지막 발사 후 0.16초가 지났고 이번 프레임에 쏘지 않았다면 더 빨리 내려온다
static func kick_recover_idle(kick: float, dt: float, since_shot: float, fired_now: bool) -> float:
	if fired_now or since_shot <= KICK_IDLE_AFTER:
		return kick
	return maxf(0.0, kick - kick * dt * KICK_RECOVER_IDLE)

# ── 조준 보정 (hitscan.ts rayCylinder/castRay 의 pad = PLAYER.aimAssist) ─────────

## 세로 원기둥(중심 cx,cz, 반지름 r, 바닥 base, 높이 h)에 광선이 처음 닿는 직선 거리 t. 안 닿으면 -1. hitscan.ts rayCylinder
static func ray_cylinder(o: Vector3, d: Vector3, cx: float, cz: float, r: float, h: float, base: float) -> float:
	var t0 := -INF
	var t1 := INF
	var a := d.x * d.x + d.z * d.z
	var ox := o.x - cx
	var oz := o.z - cz
	if a < 1e-9:
		if ox * ox + oz * oz > r * r:
			return -1.0
	else:
		var b := ox * d.x + oz * d.z
		var c := ox * ox + oz * oz - r * r
		var disc := b * b - a * c
		if disc < 0.0:
			return -1.0
		var s := sqrt(disc)
		t0 = (-b - s) / a
		t1 = (-b + s) / a
	if absf(d.y) < 1e-9:
		if o.y < base or o.y > base + h:
			return -1.0
	else:
		var ty0 := (base - o.y) / d.y
		var ty1 := (base + h - o.y) / d.y
		if ty0 > ty1:
			var tmp := ty0
			ty0 = ty1
			ty1 = tmp
		t0 = maxf(t0, ty0)
		t1 = minf(t1, ty1)
	t0 = maxf(t0, 0.0)
	return -1.0 if t0 > t1 else t0

## 물리 충돌(캡슐)이 놓친 가장자리 탄을 웹처럼 (반지름 + pad) 원기둥으로 구제한다.
## 살아 있는 대상(radius, height 속성 + take_hit)만, 직선 거리가 [t_from, t_limit) 안이고 맞은 높이가 -0.2~height 인 가장 가까운 것.
## 돌려주는 값: {collider, position, rid, t} (없으면 빈 Dictionary). t_limit 는 물리 광선이 이미 맞힌 거리(없으면 사거리).
static func assist_pick(targets: Array, o: Vector3, d: Vector3, drop_mul: float, bullet_drop: float, pad: float,
		t_from: float, t_limit: float, exclude: Array[RID] = []) -> Dictionary:
	var best := {}
	var best_t := t_limit
	for z in targets:
		if not is_instance_valid(z) or bool(z.get("dead")):
			continue
		var zr: RID = z.get_rid()
		if exclude.has(zr):
			continue
		var gp: Vector3 = z.global_position
		var t := ray_cylinder(o, d, gp.x, gp.z, float(z.radius) + pad, float(z.height), gp.y)
		if t < 0.0 or t < t_from or t >= best_t:
			continue
		var p := point_at(o, d, t, drop_mul, bullet_drop)
		var y := p.y - gp.y
		if y < -0.2 or y > float(z.height):
			continue
		best = {"collider": z, "position": p, "rid": zr, "t": t}
		best_t = t
	return best
