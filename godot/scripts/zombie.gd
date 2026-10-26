extends CharacterBody3D
## One zombie: chase the player, wind up and hit, flash when shot, fall over when killed.
## Port of the chase/attack part of src/enemies/logic/zombie.ts. Stats come from GameData.

signal killed(zombie: Node, gold: int)

var type := "normal"
var wave := 1
var target: Node3D

var hp: float
var max_hp: float
var speed: float
var dmg: float
var scale_k: float
var tune: Dictionary
var atk_cd := 0.0
var windup := 0.0
var dead := false
var _walk := 0.0
var _flash := 0.0
var _mats: Array[StandardMaterial3D] = []
var _base_cols: Array[Color] = []
var _body: Node3D
var _legs: Array[Node3D] = []
var _arms: Array[Node3D] = []

func _ready() -> void:
	var s := GameData.zombie_stats(wave, type)
	tune = GameData.zombie_tuning[type]
	max_hp = s.hp
	hp = max_hp
	speed = s.speed
	dmg = s.dmg
	scale_k = s.scale
	collision_layer = 4
	collision_mask = 1 | 4
	var shape := CollisionShape3D.new()
	var cap := CapsuleShape3D.new()
	cap.radius = float(tune.radius) * scale_k
	cap.height = float(tune.height) * scale_k
	shape.shape = cap
	shape.position.y = cap.height * 0.5
	add_child(shape)
	_build_model()
	_walk = randf() * TAU

## Primitive humanoid, same proportions as src/core/humanoid.ts (1.9 m tall at scale 1).
func _build_model() -> void:
	_body = Node3D.new()
	_body.scale = Vector3.ONE * scale_k
	add_child(_body)
	var skin_col := Color(0.45, 0.58, 0.36) if type == "normal" else Color(0.6, 0.5, 0.33)
	var skin := _mat(skin_col)
	var shirt := _mat(Color(0.32, 0.26, 0.3) if type == "normal" else Color(0.45, 0.15, 0.12))
	var pants := _mat(Color(0.2, 0.22, 0.3))
	for side in [-1, 1]:
		var leg := _pivot(_body, Vector3(0.13 * side, 0.9, 0))
		_part(leg, Vector3(0.17, 0.9, 0.2), Vector3(0, -0.45, 0), pants)
		_legs.append(leg)
		var arm := _pivot(_body, Vector3(0.33 * side, 1.5, 0))
		_part(arm, Vector3(0.13, 0.7, 0.14), Vector3(0, -0.33, 0), skin)
		arm.rotation.x = 1.35 # 좀비 자세: 팔을 앞으로
		_arms.append(arm)
	_part(_body, Vector3(0.5, 0.65, 0.28), Vector3(0, 1.22, 0), shirt)
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

func is_head_hit(p: Vector3) -> bool:
	return p.y - global_position.y >= float(tune.height) * scale_k * 0.78

## Returns true when this hit killed the zombie.
func take_hit(amount: float, dir: Vector3) -> bool:
	if dead:
		return false
	hp -= amount * (1.0 - float(tune.get("armor", 0.0)))
	_flash = 0.08
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
	killed.emit(self, int(reward.gold))
	# 맞은 방향으로 뒤로 넘어지고 땅속으로 가라앉는다
	var away := Vector3(dir.x, 0, dir.z).normalized()
	look_at(global_position - away, Vector3.UP)
	var tw := create_tween()
	tw.tween_property(_body, "rotation:x", PI * 0.5, 0.45).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_IN)
	tw.tween_interval(1.6)
	tw.tween_property(_body, "position:y", -0.6, 0.8)
	tw.tween_callback(queue_free)

func _physics_process(dt: float) -> void:
	if _flash > 0.0:
		_flash = maxf(0.0, _flash - dt)
		var k := 0.7 if _flash > 0.0 else 0.0 # 맞은 순간 하얗게 번쩍
		for i in _mats.size():
			_mats[i].albedo_color = _base_cols[i].lerp(Color.WHITE, k)
	if dead or target == null:
		return
	atk_cd = maxf(0.0, atk_cd - dt)
	var to := target.global_position - global_position
	to.y = 0
	var dist := to.length()
	var reach: float = float(tune.radius) * scale_k + float(GameData.player.radius) + float(GameData.enemy_rules.reach) + float(tune.reach)
	if dist > 0.01:
		look_at(global_position + to, Vector3.UP)
	if windup > 0.0:
		windup -= dt
		velocity.x = 0
		velocity.z = 0
		for a in _arms:
			a.rotation.x = lerpf(a.rotation.x, 2.5, dt * 10.0)
		if windup <= 0.0:
			if dist <= reach + 0.4 and target.has_method("take_damage"):
				target.take_damage(dmg)
			atk_cd = tune.atkCd
	elif dist <= reach:
		velocity.x = 0
		velocity.z = 0
		if atk_cd <= 0.0:
			windup = GameData.enemy_rules.windup
	else:
		var v := to / dist * speed
		# 길찾기 대신: 벽에 막히면 벽을 따라 옆으로 돌아간다 (내비메시는 다음 단계)
		if is_on_wall():
			var n := get_wall_normal()
			var side := n.cross(Vector3.UP)
			if side.dot(to) < 0.0:
				side = -side
			v = (v * 0.3 + side.normalized() * speed).normalized() * speed
		velocity.x = v.x
		velocity.z = v.z
		_walk += dt * speed * 2.2
		for i in _legs.size():
			_legs[i].rotation.x = sin(_walk + PI * i) * 0.6
		for i in _arms.size():
			_arms[i].rotation.x = lerpf(_arms[i].rotation.x, 1.35 + sin(_walk + PI * i) * 0.15, dt * 8.0)
	if not is_on_floor():
		velocity.y -= 20.0 * dt
	else:
		velocity.y = 0
	move_and_slide()
