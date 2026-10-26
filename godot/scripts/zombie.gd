extends CharacterBody3D
## One zombie of any type (normal … king): lane walking, target choice, melee, special moves, boss patterns.
## Port of src/enemies/logic/sim.ts (updateZombie / abilityThink / runAct / bossThink / runBossAct).
## Stun and vaccines come with the allies stage; structures other than the core with the base stage.

signal killed(zombie: Node, gold: int)

var type := "normal"
var wave := 1
var elite := false
var lane := 0
var wp := 0
var wave_zombie := true
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

## Look per type: colours and proportions, standing in for src/enemies/view/models.ts.
const LOOK := {
	"normal": {"skin": Color(0.45, 0.58, 0.36), "shirt": Color(0.32, 0.26, 0.3)},
	"runner": {"skin": Color(0.6, 0.5, 0.33), "shirt": Color(0.45, 0.15, 0.12)},
	"fatty": {"skin": Color(0.55, 0.6, 0.4), "shirt": Color(0.5, 0.45, 0.35), "wide": 1.7},
	"crawler": {"skin": Color(0.5, 0.45, 0.4), "shirt": Color(0.25, 0.25, 0.22)},
	"swarmer": {"skin": Color(0.62, 0.55, 0.45), "shirt": Color(0.3, 0.2, 0.18)},
	"leaper": {"skin": Color(0.4, 0.5, 0.45), "shirt": Color(0.18, 0.28, 0.3), "long": 1.25},
	"spitter": {"skin": Color(0.5, 0.7, 0.3), "shirt": Color(0.25, 0.35, 0.15), "glow": Color(0.5, 1.0, 0.2)},
	"bomber": {"skin": Color(0.55, 0.5, 0.4), "shirt": Color(0.35, 0.3, 0.2), "glow": Color(1.0, 0.35, 0.1)},
	"screamer": {"skin": Color(0.78, 0.76, 0.7), "shirt": Color(0.4, 0.38, 0.42)},
	"tank": {"skin": Color(0.42, 0.5, 0.36), "shirt": Color(0.3, 0.32, 0.35), "wide": 1.35, "armor": true},
	"boss": {"skin": Color(0.45, 0.4, 0.32), "shirt": Color(0.3, 0.1, 0.08), "wide": 1.3},
	"bossBomb": {"skin": Color(0.5, 0.42, 0.3), "shirt": Color(0.4, 0.2, 0.05), "wide": 1.3, "glow": Color(1.0, 0.4, 0.1)},
	"bossAcid": {"skin": Color(0.45, 0.65, 0.25), "shirt": Color(0.2, 0.3, 0.1), "wide": 1.4, "glow": Color(0.5, 1.0, 0.2)},
	"bossLord": {"skin": Color(0.4, 0.38, 0.4), "shirt": Color(0.25, 0.05, 0.1), "wide": 1.3, "armor": true},
	"king": {"skin": Color(0.35, 0.3, 0.3), "shirt": Color(0.35, 0.05, 0.08), "wide": 1.4, "armor": true, "crown": true},
}

func _build_model() -> void:
	var look: Dictionary = LOOK.get(type, LOOK.normal)
	_body = Node3D.new()
	_body.scale = Vector3.ONE * scale_k
	add_child(_body)
	var skin_col: Color = look.skin
	if elite:
		skin_col = skin_col.lerp(Color(1.0, 0.8, 0.25), 0.55) # 엘리트는 금빛
	var skin := _mat(skin_col)
	var shirt := _mat(look.shirt)
	var pants := _mat(Color(0.2, 0.22, 0.3))
	var wide: float = look.get("wide", 1.0)
	var arm_len: float = 0.7 * float(look.get("long", 1.0))
	for side in [-1, 1]:
		var leg := _pivot(_body, Vector3(0.13 * side * wide, 0.9, 0))
		_part(leg, Vector3(0.17 * wide, 0.9, 0.2), Vector3(0, -0.45, 0), pants)
		_legs.append(leg)
		var arm := _pivot(_body, Vector3((0.26 * wide + 0.07) * side, 1.5, 0))
		_part(arm, Vector3(0.13, arm_len, 0.14), Vector3(0, -arm_len * 0.47, 0), skin)
		arm.rotation.x = 1.35 # 좀비 자세: 팔을 앞으로
		_arms.append(arm)
	_part(_body, Vector3(0.5 * wide, 0.65, 0.28 * wide), Vector3(0, 1.22, 0), shirt)
	if look.get("armor", false):
		var plate := _mat(Color(0.35, 0.36, 0.4))
		plate.metallic = 0.7
		_part(_body, Vector3(0.56 * wide, 0.45, 0.06), Vector3(0, 1.28, -0.16 * wide), plate)
		_part(_body, Vector3(0.22, 0.12, 0.3), Vector3(-0.3 * wide, 1.55, 0), plate)
		_part(_body, Vector3(0.22, 0.12, 0.3), Vector3(0.3 * wide, 1.55, 0), plate)
	if look.has("glow"):
		var g := StandardMaterial3D.new()
		g.albedo_color = look.glow
		g.emission_enabled = true
		g.emission = look.glow
		g.emission_energy_multiplier = 1.5
		if type == "bomber" or type == "bossBomb":
			_part(_body, Vector3(0.36, 0.4, 0.2), Vector3(0, 1.25, 0.24 * wide), g) # 등에 멘 폭탄
		else:
			_part(_body, Vector3(0.14, 0.06, 0.04), Vector3(0, 1.62, -0.17), g)    # 빛나는 입
	var head := MeshInstance3D.new()
	var sph := SphereMesh.new()
	sph.radius = 0.17
	sph.height = 0.36
	head.mesh = sph
	head.material_override = skin
	head.position = Vector3(0, 1.72, 0.03)
	_body.add_child(head)
	var eye := StandardMaterial3D.new()
	eye.albedo_color = Color(0.9, 0.15, 0.1)
	eye.emission_enabled = true
	eye.emission = Color(1, 0.15, 0.1)
	eye.emission_energy_multiplier = 2.0
	for side in [-1, 1]:
		_part(_body, Vector3(0.05, 0.03, 0.02), Vector3(0.07 * side, 1.75, -0.15), eye)
	if look.get("crown", false):
		var gold := StandardMaterial3D.new()
		gold.albedo_color = Color(1.0, 0.8, 0.2)
		gold.metallic = 0.9
		gold.emission_enabled = true
		gold.emission = Color(0.6, 0.45, 0.1)
		for i in 5:
			var a := TAU * i / 5.0
			_part(_body, Vector3(0.06, 0.14, 0.06), Vector3(cos(a) * 0.15, 1.95, sin(a) * 0.15), gold)
	# 기어다니는 좀비: 몸을 앞으로 눕힌다 (판정 높이 0.85m)
	if type == "crawler":
		_body.rotation.x = -1.2
		_body.position = Vector3(0, 0.35, 0.6) * scale_k

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

## Returns true when this hit killed the zombie.
func take_hit(amount: float, dir: Vector3) -> bool:
	if dead:
		return false
	hp -= amount * (1.0 - float(tune.get("armor", 0.0)))
	_flash = 0.1
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
			_mats[i].albedo_color = _base_cols[i].lerp(Color.WHITE, k)
	if dead:
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
	if not p.dead and _flat_dist(p.global_position) * 0.9 <= float(r.aggroPlayer) * (1.6 if is_boss else 1.0):
		target = p
	elif wp >= _lane_points().size() and not game.core_dead:
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
	var goal: Vector3 = target.global_position if target else _lane_goal()
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
	var sp := speed * (1.4 if frenzy > 0.0 else 1.0) * absf(sign)
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
