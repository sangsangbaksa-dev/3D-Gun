extends CharacterBody3D
## One zombie of any type (normal … king): lane walking, target choice, melee, special moves, boss patterns.
## Port of src/enemies/logic/sim.ts (updateZombie / abilityThink / runAct / bossThink / runBossAct).
## Stun (for vaccines, allies.gd) as in sim.ts damaged()/stun()/wake(); structures other than the core with the base stage.

signal killed(zombie: Node, gold: int)

var type := "normal"
var wave := 1
var elite := false
var lane := 0
var wp := 0
var wave_zombie := true # false: 구역 배회 좀비 (roamers.gd) - 레인도 핵도 건물도 노리지 않는다
var home := {}          # 배회 구역 {x, z, r, zone}
var slow_mul := 1.0     # 감속 함정 (structure.gd) 이 매 맥박 0.2초씩 건다
var slow_t := 0.0
var game: Node # game.gd: player, core, hazards

var hp: float
var max_hp: float
var speed: float
var dmg: float
var scale_k: float
var radius: float
var height: float
var tune: Dictionary
var is_boss := false
var dead := false

var state := "spawn" # spawn / chase / windup / act
var state_t := 0.6
var move := "none"   # 특수 동작: fuse leap spit scream slam charge volley bombRain summon
var move_t := 0.0
var phase := 0
var atk_t := 0.0
var ability_cd := 0.0
var move_cd := 0.0
var summon_cd := 0.0
var frenzy := 0.0
var offset := 0.0
var target: Node3D
var retarget_t := 0.0
var aim := Vector3.ZERO
var leap_from := Vector3.ZERO
var charge_dir := Vector3.ZERO
var hit_once := false
var exploded := false
var stunned := false
var converted := false
var stun_t := 0.0
var rage := false

var _walk := 0.0
var _flash := 0.0
var _mats: Array[StandardMaterial3D] = []
var _base_cols: Array[Color] = []
var _body: Node3D
var _legs: Array[Node3D] = []
var _arms: Array[Node3D] = []
var _detour := Vector3.ZERO
var _detour_t := 0.0
var _stuck_t := 0.0
var _last_pos := Vector3.ZERO
var _wander := Vector3.ZERO
var _wander_t := 0.0

func _ready() -> void:
	var s := GameData.zombie_stats(wave, type)
	tune = GameData.zombie_tuning[type]
	is_boss = type == "king" or type in GameData.boss_types
	var el: Dictionary = GameData.elite
	max_hp = float(s.hp) * (float(el.hp) if elite else 1.0)
	hp = max_hp
	speed = s.speed
	dmg = float(s.dmg) * (float(el.dmg) if elite else 1.0)
	scale_k = float(s.scale) * (float(el.scale) if elite else 1.0)
	radius = float(tune.radius) * scale_k
	height = float(tune.height) * scale_k
	collision_layer = 4
	collision_mask = 1 | 4
	var shape := CollisionShape3D.new()
	var cap := CapsuleShape3D.new()
	cap.radius = radius
	cap.height = maxf(height, radius * 2.0 + 0.01)
	shape.shape = cap
	shape.position.y = cap.height * 0.5
	add_child(shape)
	_build_model()
	_walk = randf() * TAU
	offset = _rand() * 2.0 - 1.0
	ability_cd = 1.0 + _rand() * 2.0
	move_cd = 2.5 + _rand() * 2.0
	_last_pos = global_position

# ── 모델 ─────────────────────────────────────────────────────────────

## 웹 게임의 src/enemies/view/models.ts 를 그대로 내보낸 모델 (godot/tools/models). 종류별 가로·깊이 배율은 거기 값이다.
const WIDTH := {
	"runner": [0.84, 1.0], "fatty": [1.4, 1.3], "leaper": [0.9, 1.0], "bomber": [1.12, 1.0], "screamer": [0.85, 1.0],
	"tank": [1.25, 1.15], "boss": [1.3, 1.15], "bossBomb": [1.3, 1.2], "bossAcid": [1.4, 1.25], "bossLord": [1.25, 1.15], "king": [1.2, 1.1],
}
const UNIT_H := 1.88
static var _lib: Node
var _torso: Node3D
var _head: Node3D
var _hunch := 0.22
var _eye_mats: Array[StandardMaterial3D] = []

static func _library() -> Node:
	if _lib == null:
		_lib = (load("res://assets/models/zombies.glb") as PackedScene).instantiate()
	return _lib

func _build_model() -> void:
	_body = Node3D.new()
	add_child(_body)
	var tag := "z_%s_%s" % [type, ("e%d" % (get_instance_id() % 2)) if elite else str(get_instance_id() % 6)]
	if type == "boss" and wave >= 20 and not elite:
		tag = "z_boss_w%d" % mini(40, (wave / 10) * 10)
	var src: Node = _library().get_node_or_null(tag)
	if src == null:
		src = _library().get_node("z_normal_0")
	var model: Node3D = src.duplicate()
	_body.add_child(model)
	var k: float = height / UNIT_H if type != "crawler" else 0.9 * scale_k * float(tune.height) / float(tune.height)
	if type == "crawler":
		k = 0.9 * scale_k
	var w: Array = WIDTH.get(type, [1.0, 1.0])
	model.scale = Vector3(k * float(w[0]), k, k * float(w[1]))
	_hunch = float(GameData.models.zombies.hunch.get(type, 0.22))
	for n in model.find_children("*", "Node3D", true, false):
		var nm: String = String(n.name).get_slice("-", 0)
		match nm:
			"leg0": _legs.append(n)
			"leg1": _legs.append(n)
			"arm0": _arms.append(n)
			"arm1": _arms.append(n)
			"torso": _torso = n
			"head": _head = n
	_legs.sort_custom(func(a, b): return String(a.name) < String(b.name))
	_arms.sort_custom(func(a, b): return String(a.name) < String(b.name))
	# 몸 재질은 개체마다 따로 (피격 번쩍임), 눈은 발광
	var cache := {}
	for mi in model.find_children("*", "MeshInstance3D", true, false):
		var m: Material = mi.mesh.surface_get_material(0)
		if m == null:
			continue
		if not cache.has(m):
			var d: StandardMaterial3D = (m as StandardMaterial3D).duplicate()
			var mname := String(m.resource_name)
			if mname.begins_with("eyes"):
				d.emission_enabled = true
				d.emission = d.albedo_color
				d.emission_energy_multiplier = 1.6
				d.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
				_eye_mats.append(d)
			elif mname.begins_with("body") or true:
				d.emission_enabled = true
				d.emission = Color.BLACK
				if elite:
					d.emission = Color(0.14, 0.1, 0.0)
				_mats.append(d)
				_base_cols.append(d.emission)
			cache[m] = d
		mi.set_surface_override_material(0, cache[m])
	if _torso:
		_torso.rotation.x = -_hunch
	if _head:
		_head.rotation.x = 0.12
	for a in _arms:
		a.rotation.x = 1.35
	# 기어다니는 좀비: 다리 없이 몸을 앞으로 눕힌다 (판정 높이 0.85m)
	if type == "crawler":
		_body.rotation.x = -1.25
		_body.position = Vector3(0, 0.18, 0)
		_head.rotation.x = 0.95

func _mat(c: Color) -> StandardMaterial3D:
	var m := StandardMaterial3D.new()
	m.albedo_color = c
	m.roughness = 0.9
	_mats.append(m)
	_base_cols.append(c)
	return m

func _pivot(parent: Node3D, pos: Vector3) -> Node3D:
	var n := Node3D.new()
	n.position = pos
	parent.add_child(n)
	return n

func _part(parent: Node3D, size: Vector3, pos: Vector3, mat: Material) -> void:
	var m := MeshInstance3D.new()
	var b := BoxMesh.new()
	b.size = size
	m.mesh = b
	m.position = pos
	m.material_override = mat
	parent.add_child(m)

# ── 피해 / 사망 ──────────────────────────────────────────────────────

func is_head_hit(p: Vector3) -> bool:
	return p.y - global_position.y >= height * 0.78

## Returns true when this hit killed the zombie. by_ally: allies never stun, they finish.
func take_hit(amount: float, dir: Vector3, by_ally := false) -> bool:
	if dead:
		return false
	var r: Dictionary = GameData.enemy_rules
	var left := hp - amount * (1.0 if stunned else 1.0 - float(tune.get("armor", 0.0))) # 기절하면 장갑 약점이 드러난다
	_flash = 0.1
	# 체력이 기절 구간이 되는 타격은 확률적으로 죽이지 않고 기절시킨다 (아군 타격, 보스, 자폭 중 제외)
	if not by_ally and not is_boss and not stunned and state != "spawn" and move != "fuse" \
			and left <= max_hp * float(r.stunHpRatio) and _rand() < float(r.stunBase):
		hp = maxf(1.0, left)
		_stun()
		return false
	hp = left
	if not is_boss:
		global_position += Vector3(dir.x, 0, dir.z).normalized() * 0.08 # 작은 넉백
	if hp <= 0.0:
		_die(dir)
		return true
	return false

func _die(dir: Vector3) -> void:
	dead = true
	collision_layer = 0
	collision_mask = 0
	var reward: Dictionary = GameData.zombie_reward[type]
	killed.emit(self, int(round(float(reward.gold) * (float(GameData.elite.reward) if elite else 1.0))))
	if type == "fatty":
		var r: Dictionary = GameData.enemy_rules
		game.hazards.add_pool(global_position, r.gasRadius, r.gasTime, r.gasDps, "gas")
	var bomb: Dictionary = tune.get("bomb", {})
	if not bomb.is_empty() and not exploded:
		game.hazards.explode(global_position, bomb.deathRadius, dmg * float(bomb.deathMul), "bomb")
	# 맞은 방향으로 뒤로 넘어지고 땅속으로 가라앉는다
	var away := Vector3(dir.x, 0, dir.z).normalized()
	if away.length() > 0.1:
		look_at(global_position - away, Vector3.UP)
	var tw := create_tween()
	tw.tween_property(_body, "rotation:x", PI * 0.5, 0.45).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_IN)
	tw.tween_interval(1.6)
	tw.tween_property(_body, "position:y", -0.6 * scale_k, 0.8)
	tw.tween_callback(queue_free)

func _stun() -> void:
	stunned = true
	stun_t = float(GameData.enemy_rules.stunTime)
	state = "stunned"
	move = "none"
	target = null
	velocity = Vector3.ZERO
	Sfx.play("stun", global_position)

func _wake() -> void:
	stunned = false
	state = "chase"
	rage = true
	atk_t = 0.6
	_body.rotation.x = 0.0

## Vaccine worked: leave the wave quietly (no gold) so allies.gd can stand an ally here.
func convert_to_ally() -> void:
	dead = true
	stunned = false
	converted = true
	collision_layer = 0
	collision_mask = 0
	killed.emit(self, 0)
	queue_free()

func _self_destruct() -> void:
	exploded = true
	var b: Dictionary = tune.bomb
	game.hazards.explode(global_position, b.radius, dmg * float(b.dmgMul), "bomb")
	hp = 0.0
	_die(Vector3.FORWARD)

# ── 매 프레임 ────────────────────────────────────────────────────────

func _physics_process(dt: float) -> void:
	if _flash > 0.0:
		_flash = maxf(0.0, _flash - dt)
		var k := 0.7 if _flash > 0.0 else 0.0 # 맞은 순간 하얗게 번쩍
		for i in _mats.size():
			_mats[i].emission = _base_cols[i].lerp(Color(0.9, 0.7, 0.6), k)
	if dead:
		return
	if slow_t > 0.0:
		slow_t -= dt
		if slow_t <= 0.0:
			slow_mul = 1.0
	if stunned:
		# 기절: 휘청이며 서 있다가 stunTime 뒤 분노해서 깬다
		stun_t -= dt
		_body.rotation.x = lerpf(_body.rotation.x, 0.35 + sin(stun_t * 5.0) * 0.06, dt * 6.0)
		for a in _arms:
			a.rotation.x = lerpf(a.rotation.x, 0.15, dt * 6.0)
		velocity = Vector3(0, velocity.y - 20.0 * dt if not is_on_floor() else 0.0, 0)
		move_and_slide()
		if stun_t <= 0.0:
			_wake()
		return
	atk_t -= dt
	ability_cd -= dt
	frenzy = maxf(0.0, frenzy - dt)
	var want := Vector3.ZERO # 이번 프레임 수평 이동 속도
	match state:
		"spawn":
			state_t -= dt
			if state_t <= 0.0:
				state = "chase"
		"windup":
			state_t -= dt
			_face(target.global_position if is_instance_valid(target) else global_position + _fwd())
			for a in _arms:
				a.rotation.x = lerpf(a.rotation.x, 2.5, dt * 10.0)
			if state_t <= 0.0:
				_strike()
				state = "chase"
				atk_t = float(tune.atkCd)
		_:
			if move != "none":
				want = _run_act(dt)
			else:
				want = _think(dt)
	velocity.x = want.x
	velocity.z = want.z
	if move == "leap" and phase == 1:
		velocity.y = 0.0
	elif not is_on_floor():
		velocity.y -= 20.0 * dt
	else:
		velocity.y = 0.0
	move_and_slide()
	_animate(dt, Vector2(want.x, want.z).length())

func _fwd() -> Vector3:
	return -global_transform.basis.z

func _face(p: Vector3) -> void:
	var d := p - global_position
	d.y = 0
	if d.length() > 0.05:
		look_at(global_position + d, Vector3.UP)

func _flat_dist(p: Vector3) -> float:
	return Vector2(p.x - global_position.x, p.z - global_position.z).length()

func _target_radius(t: Node3D) -> float:
	return float(t.get("radius")) if t.get("radius") != null else 0.4

## Player within aggro range, else the lane, else the core (pickTarget + laneGoal).
func _pick_target() -> void:
	var r: Dictionary = GameData.enemy_rules
	var p: Node3D = game.player
	target = null
	var bd := INF
	var dp := _flat_dist(p.global_position) * 0.9
	var aggro: float = float(r.aggroPlayer) if wave_zombie else float(r.roamAggro)
	if not p.dead and dp <= aggro * (1.6 if is_boss else 1.0):
		target = p
		bd = dp
	# 아군도 노린다 (sim.ts pickTarget: aggroAlly 안의 가장 가까운 아군, 가까울 때)
	var boss_k := 1.6 if is_boss else 1.0
	for a in get_tree().get_nodes_in_group("allies"):
		var da := _flat_dist(a.global_position)
		if not a.dead and da <= float(r.aggroAlly) * boss_k and da < bd:
			target = a
			bd = da
	# 웨이브 좀비는 길목의 방어 건물을 부순다 (핵 제외, 가장 가까운 건물 하나)
	var sb: Node3D = null
	var sd: float = r.aggroStructure
	for s in game.base.structures:
		if s.dead or not wave_zombie: # 배회 좀비는 기지 건물에 관심 없다
			continue
		var d: float = _flat_dist(s.global_position) - s.radius
		if d < sd:
			sd = d
			sb = s
	if sb:
		var d2 := _flat_dist(sb.global_position)
		if d2 <= float(r.aggroStructure) + sb.radius and d2 < bd:
			target = sb
	if target == null and wave_zombie and wp >= _lane_points().size() and not game.core_dead:
		target = game.core

func _lane_points() -> Array:
	var lanes: Array = GameData.map.lanes
	return lanes[lane % lanes.size()].waypoints

func _lane_goal() -> Vector3:
	var pts := _lane_points()
	var spread: float = GameData.enemy_rules.laneSpread
	while wp < pts.size():
		var w: Dictionary = pts[wp]
		var g := Vector3(float(w.x) + offset * spread, 0, float(w.z) + offset * spread * 0.7)
		if _flat_dist(g) > 2.5:
			return g
		wp += 1
	return game.core.global_position

## 배회 좀비: 구역(home) 안의 임의 지점을 3~8초마다 새로 고른다 (sim.ts wanderGoal)
func _wander_goal(dt: float) -> Vector3:
	if home.is_empty():
		return global_position
	_wander_t -= dt
	if _wander_t <= 0.0 or Vector2(_wander.x - global_position.x, _wander.z - global_position.z).length() < 1.2:
		_wander_t = 3.0 + _rand() * 5.0
		var a := _rand() * TAU
		var d := sqrt(_rand()) * float(home.r)
		_wander = Vector3(float(home.x) + cos(a) * d, 0, float(home.z) + sin(a) * d)
	return _wander

## Choose what to do this frame; returns the wanted horizontal velocity.
func _think(dt: float) -> Vector3:
	retarget_t -= dt
	if retarget_t <= 0.0 or (target and target.get("dead")):
		retarget_t = 0.25 + _rand() * 0.15
		_pick_target()
	if is_boss and _boss_think(dt):
		return Vector3.ZERO
	if not is_boss and _ability_think():
		return Vector3.ZERO
	var goal: Vector3 = target.global_position if target else (_lane_goal() if wave_zombie else _wander_goal(dt))
	var to := goal - global_position
	to.y = 0
	var dist := to.length()
	if dist < 0.01:
		return Vector3.ZERO
	var dir := to / dist
	var sign := 1.0
	if target:
		_face(goal)
		var gap := dist - _target_radius(target) - radius
		if tune.has("keep"):
			# 원거리 유닛: 너무 가까우면 물러나고, 사거리 안이면 서서 능력을 쓴다
			if dist < float(tune.keep[0]):
				sign = -0.8
			elif dist <= float(tune.keep[1]):
				return Vector3.ZERO
		elif gap <= float(GameData.enemy_rules.reach) + float(tune.reach):
			if atk_t <= 0.0:
				state = "windup"
				state_t = GameData.enemy_rules.windup
			return Vector3.ZERO
	elif dist < 1.2:
		return Vector3.ZERO
	var sp := speed * (float(GameData.enemy_rules.rageSpeed) if rage else 1.0) * (1.4 if frenzy > 0.0 else 1.0) * absf(sign) * slow_mul
	if target == null and not wave_zombie:
		sp *= 0.45 # 목표 없이 어슬렁거릴 때는 느리게
	var v := dir * sign * sp
	if sign > 0.0:
		_face(goal)
	return _steer(v, dir, dist, sp, dt)

## 길찾기 대신: 벽에 막히면 한쪽을 골라 1초쯤 벽을 따라 돌아간다 (내비메시는 다음 단계)
func _steer(v: Vector3, dir: Vector3, dist: float, sp: float, dt: float) -> Vector3:
	_detour_t -= dt
	if is_on_wall() and _detour_t <= 0.0:
		var side := get_wall_normal().cross(Vector3.UP).normalized()
		if side.dot(dir) < 0.0:
			side = -side
		_detour = side
		_detour_t = 1.0
	# 2초 동안 거의 못 움직였으면 반대쪽으로 돌아간다 (모서리에 끼었을 때)
	_stuck_t += dt
	if _stuck_t >= 2.0:
		if global_position.distance_to(_last_pos) < 1.0 and dist > 3.0:
			_detour = -_detour if _detour != Vector3.ZERO else dir.cross(Vector3.UP)
			_detour_t = 1.5
		_stuck_t = 0.0
		_last_pos = global_position
	if _detour_t > 0.0:
		return (v * 0.3 + _detour * sp).normalized() * sp
	return v

func _strike() -> void:
	if not is_instance_valid(target) or target.get("dead"):
		return
	var gap := _flat_dist(target.global_position) - _target_radius(target) - radius
	if gap > float(GameData.enemy_rules.reach) * 1.6 + float(tune.reach):
		return # 피했다
	target.take_damage(dmg)
	# 보스의 휘두르기는 주변도 함께 맞는다
	if is_boss:
		game.hazards.aoe(global_position, radius + 2.2, dmg * 0.5, target)

# ── 일반 좀비 능력 (leap / spit / bomb / scream) ─────────────────────

func _ability_think() -> bool:
	if not target:
		return false
	var d := _flat_dist(target.global_position)
	if tune.has("bomb"):
		var b: Dictionary = tune.bomb
		if d - _target_radius(target) - radius <= float(b.range):
			move = "fuse"
			move_t = b.fuse
			game.hazards.ring(global_position, b.radius, b.fuse)
			return true
	elif tune.has("leap"):
		var l: Dictionary = tune.leap
		if ability_cd <= 0.0 and d >= 4.0 and d <= float(l.range):
			move = "leap"
			phase = 0
			move_t = l.windup
			aim = target.global_position
			_face(aim)
			game.hazards.ring(aim, l.radius, float(l.windup) + float(l.time))
			return true
	elif tune.has("spit") and tune.has("keep"):
		if ability_cd <= 0.0 and d <= float(tune.keep[1]) + 1.5:
			move = "spit"
			move_t = tune.spit.windup
			aim = target.global_position
			_face(aim)
			return true
	elif tune.has("scream"):
		if ability_cd <= 0.0 and d <= 30.0:
			move = "scream"
			move_t = tune.scream.windup
			return true
	return false

## Advance the running special move (normal abilities and boss patterns). Returns wanted velocity.
func _run_act(dt: float) -> Vector3:
	move_t -= dt
	var v := Vector3.ZERO
	match move:
		"fuse":
			_flash = 0.1 if fmod(move_t, 0.2) < 0.1 else 0.0 # 깜빡이며 터질 준비
			if move_t <= 0.0:
				_self_destruct()
		"leap":
			var l: Dictionary = tune.leap
			if phase == 0:
				if move_t <= 0.0:
					phase = 1
					move_t = l.time
					leap_from = global_position
			else:
				var k := 1.0 - maxf(0.0, move_t) / float(l.time)
				var p := leap_from.lerp(aim, k)
				p.y = leap_from.y + sin(PI * k) * 2.2
				global_position = p
				if move_t <= 0.0:
					global_position.y = leap_from.y
					game.hazards.explode(global_position, l.radius, dmg * float(l.dmgMul), "slam")
					move = "none"
					ability_cd = l.cd
					atk_t = 0.4
		"spit":
			var s: Dictionary = tune.spit
			if move_t <= 0.0:
				game.hazards.spit(global_position + Vector3(0, height * 0.85, 0), aim, s.time, s.radius, dmg * float(s.dmgMul), s.pool, s.dps)
				move = "none"
				ability_cd = s.cd
		"scream":
			var s: Dictionary = tune.scream
			if move_t <= 0.0:
				_scream(s.radius, s.time)
				_summon(s.summon, int(s.count))
				move = "none"
				ability_cd = s.cd
		_:
			v = _run_boss_act(dt)
	return v

func _scream(r: float, time: float) -> void:
	game.hazards.ring(global_position, minf(r, 14.0), 0.7, Color(0.8, 0.5, 1.0))
	for z in game.zombies_root.get_children():
		if not z.dead and z.global_position.distance_to(global_position) <= r:
			z.frenzy = time

func _summon(t: String, count: int) -> void:
	if game.alive >= int(GameData.max_alive) + 10:
		return
	for i in count:
		var a := TAU * i / count + _rand()
		var p := global_position + Vector3(cos(a), 0, sin(a)) * (radius + 2.5)
		var z = game.spawn_zombie(t, p, lane, false)
		z.wp = 99 # 소환된 좀비는 바로 핵/목표를 향한다

# ── 보스 패턴 ────────────────────────────────────────────────────────

func _boss_think(dt: float) -> bool:
	var kit: Dictionary = GameData.boss_kit[type]
	var enraged := hp < max_hp * 0.5
	move_cd -= dt
	summon_cd -= dt
	if move_cd > 0.0 or not target:
		return false
	var d := _flat_dist(target.global_position)
	var opts: Array = []
	var total := 0.0
	for m in kit.moves:
		var ok := true
		match String(m.kind):
			"slam": ok = d <= float(kit.slamRadius) + 3.0
			"charge": ok = d >= 6.0 and d <= 26.0
			"volley": ok = d >= 5.0
			"summon", "scream": ok = summon_cd <= 0.0
		if ok:
			opts.append(m)
			total += float(m.w)
	if opts.is_empty():
		return false
	var r := _rand() * total
	var pick: String = opts[0].kind
	for m in opts:
		r -= float(m.w)
		if r <= 0.0:
			pick = m.kind
			break
	var bm: Dictionary = GameData.boss_move
	move_cd = float(kit.cd[1 if enraged else 0])
	phase = 0
	aim = target.global_position
	_face(aim)
	move = pick
	match pick:
		"slam":
			move_t = bm.slam.windup
			game.hazards.ring(global_position, kit.slamRadius, bm.slam.windup)
		"charge":
			move_t = bm.charge.windup
			charge_dir = (aim - global_position)
			charge_dir.y = 0
			charge_dir = charge_dir.normalized()
		"volley":
			move_t = bm.volley.windup
		"bombRain":
			var b: Dictionary = bm.bombRain
			move_t = b.windup
			for i in int(b.count):
				var a := _rand() * TAU
				var rr := 0.0 if i == 0 else sqrt(_rand()) * float(b.scatter)
				game.hazards.bomb_at(aim + Vector3(cos(a), 0, sin(a)) * rr, b.windup, b.radius, dmg * float(b.dmgMul))
		"summon", "scream":
			move_t = bm[pick].windup
			summon_cd = float(kit.summonCd[1 if enraged else 0])
		_:
			move = "none"
			return false
	return true

func _run_boss_act(dt: float) -> Vector3:
	var kit: Dictionary = GameData.boss_kit.get(type, {})
	var bm: Dictionary = GameData.boss_move
	match move:
		"slam":
			for a in _arms:
				a.rotation.x = lerpf(a.rotation.x, 2.9, dt * 6.0)
			if move_t <= 0.0:
				game.hazards.explode(global_position, kit.slamRadius, dmg * float(bm.slam.dmgMul), "slam")
				move = "none"
		"charge":
			var c: Dictionary = bm.charge
			if phase == 0:
				if move_t <= 0.0:
					phase = 1
					move_t = c.time
					hit_once = false
			else:
				var p: Node3D = game.player
				if not hit_once and not p.dead and _flat_dist(p.global_position) <= radius + 0.4 + 0.8:
					p.take_damage(dmg * float(c.dmgMul))
					hit_once = true
				if move_t <= 0.0:
					move = "none"
					atk_t = 0.7
				return charge_dir * float(c.speed)
		"volley":
			if move_t <= 0.0:
				var v: Dictionary = bm.volley
				var to := aim - global_position
				var base := atan2(to.z, to.x)
				var dist := maxf(8.0, Vector2(to.x, to.z).length())
				var n := int(v.count)
				for i in n:
					var a := base + (i - (n - 1) / 2.0) * (float(v.spread) / (n - 1))
					var tgt := global_position + Vector3(cos(a), 0, sin(a)) * dist
					game.hazards.spit(global_position + Vector3(0, height * 0.8, 0), tgt, v.time, v.radius, dmg * float(v.dmgMul), v.pool, v.dps)
				move = "none"
		"bombRain":
			if move_t <= 0.0:
				move = "none"
		"summon":
			if move_t <= 0.0:
				for s in kit.get("summon", []):
					_summon(s.type, int(s.count))
				move = "none"
		"scream":
			if move_t <= 0.0:
				_scream(bm.scream.radius, bm.scream.time)
				move = "none"
		_:
			move = "none"
	return Vector3.ZERO

# ── 걷기 연출 ────────────────────────────────────────────────────────

func _animate(dt: float, sp: float) -> void:
	if state == "windup" or move == "slam":
		return
	if sp > 0.1:
		_walk += dt * sp * 2.2 / maxf(0.6, scale_k)
		for i in _legs.size():
			_legs[i].rotation.x = sin(_walk + PI * i) * 0.6
	var raise := 2.2 if move in ["scream", "summon", "spit", "volley"] else 1.35
	for i in _arms.size():
		_arms[i].rotation.x = lerpf(_arms[i].rotation.x, raise + sin(_walk + PI * i) * 0.15, dt * 8.0)

## The sortie's seeded RNG (tests fix the seed), as a typed float.
func _rand() -> float:
	return game.rng.randf()
