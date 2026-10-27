extends CharacterBody3D
## One ally: a vaccinated zombie in mint skin, teal work clothes, role-colored hat and a teal visor.
## AI ported from src/allies/logic/ally.ts (fighter follows the player, guard patrols the core,
## gatherer works resource spots, researcher stays by the lab). Look from src/allies/view/allyView.ts.

const SKIN := Color("8fd6b0")
const CLOTH := Color("1f5f5c")
const BANDAGE := Color("d8d2c0")
const TEAL := Color("2ee6d6")
const UNIT_H := 1.88

var mgr: Node        # allies.gd
var role := "fighter"
var z_type := "normal"
var hp := 60.0
var max_hp := 60.0
var radius := 0.45
var dead := false
var act := "idle"
var act_t := 0.0
var atk_cd := 0.0
var swing := 0.0
var hurt_t := 0.0
var since_hit := 99.0
var slot := 0
var patrol := 0.0
var born := 0.0
var carry := {}      # {res, amount}
var node_id := 0

var _model: Node3D
var _legs: Array[Node3D] = []
var _arms: Array[Node3D] = []
var _head: Node3D
var _torso: Node3D
var _hat_mat: StandardMaterial3D
var _marker: MeshInstance3D
var _crate: MeshInstance3D
var _hp_back: MeshInstance3D
var _hp_fill: MeshInstance3D
var _walk := 0.0
var _speed := 0.0
var _mats: Array[StandardMaterial3D] = []

func _ready() -> void:
	add_to_group("allies")
	collision_layer = 8
	collision_mask = 1
	var a: Dictionary = mgr.data.ally
	radius = float(a.radius)
	var shape := CollisionShape3D.new()
	var cap := CapsuleShape3D.new()
	cap.radius = radius
	cap.height = float(a.height)
	shape.shape = cap
	shape.position.y = cap.height * 0.5
	add_child(shape)
	patrol = randf() * TAU
	_build_model()

# ── 모델 ─────────────────────────────────────────────────────────────

func _build_model() -> void:
	var lib: Node = load("res://scripts/zombie.gd")._library()
	var src: Node = lib.get_node_or_null("z_%s_0" % z_type)
	if src == null or z_type == "crawler":
		src = lib.get_node("z_normal_0")
	_model = src.duplicate()
	add_child(_model)
	var k := 1.9 / UNIT_H
	_model.scale = Vector3(k, k, k)
	for n in _model.find_children("*", "Node3D", true, false):
		match String(n.name).get_slice("-", 0):
			"leg0", "leg1": _legs.append(n)
			"arm0", "arm1": _arms.append(n)
			"torso": _torso = n
			"head": _head = n
	# 백신 맞은 몸: 옷은 청록, 피부는 민트, 얼룩 자리는 붕대, 눈은 청록 (allyView.tint)
	var cache := {}
	for mi in _model.find_children("*", "MeshInstance3D", true, false):
		var m: Material = mi.mesh.surface_get_material(0)
		if m == null:
			continue
		if not cache.has(m):
			var d: StandardMaterial3D = (m as StandardMaterial3D).duplicate()
			var nm := String(m.resource_name)
			if nm.begins_with("eyes"):
				d.albedo_color = TEAL
				d.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
			elif nm.begins_with("body0"):
				d.albedo_color = CLOTH
			elif nm.begins_with("body1"):
				d.albedo_color = SKIN
			elif nm.begins_with("body3"):
				d.albedo_color = BANDAGE
			else:
				d.albedo_color = d.albedo_color.lerp(SKIN, 0.55)
			d.emission_enabled = true
			d.emission = Color.BLACK
			_mats.append(d)
			cache[m] = d
		mi.set_surface_override_material(0, cache[m])
	# 역할 색 모자 (둥근 모자 + 챙) 와 청록 바이저: 머리와 함께 움직인다
	_hat_mat = StandardMaterial3D.new()
	_hat_mat.roughness = 0.9
	var holder: Node3D = _head if _head else _model
	var hat := Node3D.new()
	holder.add_child(hat)
	var top_y := 0.40 if _head else 1.96
	var dome := MeshInstance3D.new()
	var dm := CylinderMesh.new()
	dm.top_radius = 0.25
	dm.bottom_radius = 0.28
	dm.height = 0.16
	dome.mesh = dm
	dome.material_override = _hat_mat
	dome.position.y = top_y + 0.08
	hat.add_child(dome)
	var brim := MeshInstance3D.new()
	var bm := CylinderMesh.new()
	bm.top_radius = 0.36
	bm.bottom_radius = 0.36
	bm.height = 0.03
	brim.mesh = bm
	brim.material_override = _hat_mat
	brim.position = Vector3(0, top_y + 0.01, -0.04)
	hat.add_child(brim)
	var visor := MeshInstance3D.new()
	var vm := BoxMesh.new()
	vm.size = Vector3(0.46, 0.075, 0.05)
	visor.mesh = vm
	var vmat := StandardMaterial3D.new()
	vmat.albedo_color = TEAL
	vmat.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	visor.material_override = vmat
	visor.position = Vector3(0, top_y - 0.13, -0.215) if _head else Vector3(0, 1.69, -0.215)
	holder.add_child(visor)
	# 머리 위 표시 (역할 색 팔면체)
	_marker = MeshInstance3D.new()
	var om := BoxMesh.new()
	om.size = Vector3.ONE * 0.16
	_marker.mesh = om
	_marker.rotation = Vector3(PI / 4, 0, PI / 4)
	var mm := StandardMaterial3D.new()
	mm.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	_marker.material_override = mm
	_marker.position.y = 2.55
	add_child(_marker)
	# 채집병이 나르는 상자
	_crate = MeshInstance3D.new()
	var cm := BoxMesh.new()
	cm.size = Vector3(0.4, 0.3, 0.4)
	_crate.mesh = cm
	var cmat := StandardMaterial3D.new()
	cmat.albedo_color = Color("b98b52")
	_crate.material_override = cmat
	_crate.position = Vector3(0, 1.0, -0.5)
	_crate.visible = false
	add_child(_crate)
	# 체력 막대 (다쳤을 때만)
	_hp_back = _bar(Color(0, 0, 0, 0.6), Vector2(1.1, 0.12), 0)
	_hp_fill = _bar(Color("66ff88"), Vector2(1.04, 0.07), 1)
	_apply_role()

func _bar(col: Color, size: Vector2, pri: int) -> MeshInstance3D:
	var m := MeshInstance3D.new()
	var q := QuadMesh.new()
	q.size = size
	m.mesh = q
	var mat := StandardMaterial3D.new()
	mat.albedo_color = col
	mat.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	mat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	mat.billboard_mode = BaseMaterial3D.BILLBOARD_ENABLED
	mat.no_depth_test = true
	mat.render_priority = pri
	m.material_override = mat
	m.position.y = 2.3
	m.visible = false
	add_child(m)
	return m

func _apply_role() -> void:
	var c := Color.hex((int(mgr.data.allyRoles[role].color) << 8) | 0xff)
	_hat_mat.albedo_color = c
	(_marker.material_override as StandardMaterial3D).albedo_color = c

func set_role(r: String) -> void:
	role = r
	carry = {}
	node_id = 0
	act = "idle"
	act_t = 0.0
	_apply_role()

# ── 피해 ─────────────────────────────────────────────────────────────

func take_damage(dmg: float) -> void:
	if dead or dmg <= 0.0:
		return
	hp -= dmg
	hurt_t = 0.25
	since_hit = 0.0
	if hp <= 0.0:
		hp = 0.0
		_die()
	else:
		mgr.mark_dirty()

func _die() -> void:
	dead = true
	collision_layer = 0
	remove_from_group("allies")
	Sfx.play("allyDead", global_position)
	mgr.on_ally_dead(self)
	var tw := create_tween()
	tw.tween_property(_model, "rotation:x", -PI * 0.5, 0.5).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_IN)
	tw.tween_interval(1.4)
	tw.tween_property(_model, "position:y", -0.6, 0.8)
	tw.tween_callback(queue_free)

# ── AI (ally.ts updateAlly) ──────────────────────────────────────────

func _physics_process(dt: float) -> void:
	if dead:
		return
	var a: Dictionary = mgr.data.ally
	born += dt
	atk_cd = maxf(0.0, atk_cd - dt)
	swing = maxf(0.0, swing - dt * 4.0)
	hurt_t = maxf(0.0, hurt_t - dt)
	since_hit += dt
	if since_hit > float(a.regenDelay) and hp < max_hp:
		hp = minf(max_hp, hp + float(a.regen) * dt)
	_speed = 0.0
	velocity.x = 0.0
	velocity.z = 0.0
	if act == "attack" and swing <= 0.0:
		act = "idle"
	if born >= 0.6: # 등장 연출 동안 가만히
		if act != "attack":
			act = "idle"
		match role:
			"fighter": _fighter(dt)
			"guard": _guard(dt)
			"gatherer": _gatherer(dt)
			_: _researcher(dt)
	velocity.y = 0.0 if is_on_floor() else velocity.y - 20.0 * dt
	move_and_slide()
	_animate(dt)

func _move_speed(k := 1.0) -> float:
	return float(mgr.data.ally.speed) * k

## moveTo(): walk toward (tx, tz) until `stop` away. Returns the distance.
func _move_to(t: Vector3, speed: float, dt: float, stop: float) -> float:
	var d3 := t - global_position
	d3.y = 0.0
	var d := d3.length()
	if d > stop:
		var s := minf(speed, (d - stop) / maxf(dt, 1e-4))
		velocity.x = d3.x / d * s
		velocity.z = d3.z / d * s
		_turn_to(d3, dt * 12.0)
		_speed = s
		if act != "attack":
			act = "move"
	return d

func _turn_to(dir: Vector3, k: float) -> void:
	var want := atan2(-dir.x, -dir.z)
	rotation.y = lerp_angle(rotation.y, want, clampf(k, 0.0, 1.0))

func _strike(t: Node3D, dt: float) -> void:
	var a: Dictionary = mgr.data.ally
	var reach := float(a.atkRange) + float(t.radius)
	var d := _move_to(t.global_position, _move_speed(), dt, reach * 0.8)
	_turn_to(t.global_position - global_position, dt * 14.0)
	if d <= reach and atk_cd <= 0.0:
		atk_cd = float(a.atkRate)
		swing = 1.0
		act = "attack"
		act_t = 0.0
		var dir := (t.global_position - global_position).normalized()
		t.take_hit(float(a.dmg) * mgr.dmg_mul() * (0.9 + randf() * 0.2), dir, true)

func _fighter(dt: float) -> void:
	var a: Dictionary = mgr.data.ally
	var p: Node3D = mgr.game.player
	var t: Node3D = mgr.foe(global_position, float(a.aggro))
	if t and Vector2(t.global_position.x - p.global_position.x, t.global_position.z - p.global_position.z).length() < float(a.leash):
		_strike(t, dt)
		return
	var n := maxi(1, mgr.count_role("fighter"))
	var ang := float(slot) / n * TAU + 0.6
	var goal := p.global_position + Vector3(cos(ang), 0, sin(ang)) * 3.0
	if _move_to(goal, _move_speed(1.15), dt, 0.6) < 0.8:
		act = "idle"

func _guard(dt: float) -> void:
	var c: Vector3 = mgr.anchor()
	var t: Node3D = mgr.foe(c, float(mgr.data.ally.leash))
	if t:
		_strike(t, dt)
		return
	patrol += dt * 0.18
	var ang := patrol + slot * 1.3
	var r := 6.5 + slot % 3
	if _move_to(c + Vector3(cos(ang), 0, sin(ang)) * r, _move_speed(0.45), dt, 0.4) < 0.5:
		act = "idle"

func _researcher(dt: float) -> void:
	var base: Vector3 = mgr.anchor()
	var ang := slot * 2.1
	var goal := base + Vector3(cos(ang), 0, sin(ang)) * 2.8
	if _move_to(goal, _move_speed(0.7), dt, 0.3) <= 0.6:
		act = "work"
		_turn_to(base - global_position, dt * 6.0)

## Gatherer: walks to a resource spot, works GATHER.time seconds, carries the load to the core.
## Uses the virtual spots around the core (virtualNodes) until gathering nodes exist in this port.
func _gatherer(dt: float) -> void:
	var c: Vector3 = mgr.anchor()
	if mgr.foe(global_position, 7.0): # 좀비가 가까우면 기지로 도망
		_move_to(c, _move_speed(1.3), dt, 2.0)
		act = "flee"
		return
	if not carry.is_empty():
		if _move_to(c, _move_speed(0.9), dt, 2.5) <= 2.8:
			mgr.deliver(carry.res, int(carry.amount))
			carry = {}
			node_id = 0
			act = "idle"
		return
	var node: Dictionary = mgr.gather_spot(self)
	if node.is_empty():
		act = "idle"
		return
	if _move_to(node.pos, _move_speed(0.9), dt, 1.2) <= 1.5:
		act = "work"
		_turn_to(node.pos - global_position, dt * 8.0)
		act_t += dt
		if act_t >= 3.0:
			act_t = 0.0
			carry = {"res": node.res, "amount": 1}

# ── 걷기·일하기 연출 ─────────────────────────────────────────────────

func _animate(dt: float) -> void:
	var t := Time.get_ticks_msec() / 1000.0
	if _speed > 0.1:
		_walk += dt * _speed * 2.2
		for i in _legs.size():
			_legs[i].rotation.x = sin(_walk + PI * i) * 0.6
	else:
		for l in _legs:
			l.rotation.x = lerpf(l.rotation.x, 0.0, dt * 8.0)
	for i in _arms.size():
		var want := sin(_walk + PI * i) * 0.4 if _speed > 0.1 else 0.0
		if swing > 0.0 and i == 0:
			want = 1.6 * swing # 휘두르기
		elif act == "work":
			want = 0.9 + sin(t * 8.0 + i * PI) * 0.35 # 망치질·채집
		_arms[i].rotation.x = lerpf(_arms[i].rotation.x, want, dt * 12.0)
	_crate.visible = not carry.is_empty()
	_marker.position.y = 2.55 + sin(t * 2.0 + slot) * 0.06
	_marker.rotation.y += dt * 1.5
	var k := 0.7 if hurt_t > 0.0 else 0.0
	for m in _mats:
		m.emission = Color(0.9, 0.3, 0.3) * k
	var show := hp < max_hp - 0.5
	_hp_back.visible = show
	_hp_fill.visible = show
	if show:
		var f := clampf(hp / max_hp, 0.0, 1.0)
		_hp_fill.scale.x = maxf(0.001, f)
