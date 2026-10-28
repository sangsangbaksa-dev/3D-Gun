extends RefCounted
## 가벼운 일회성·지속 연출 모음 (먼지, 파편, 불꽃 반짝임, 연기, 그을음).
## 모두 CPUParticles3D + 공유 부드러운 점 텍스처로, 웹(Compatibility)에서도 싸게 돈다. 호출하는 쪽은 preload 해서 정적 함수로 쓴다.

static var _soft_tex: GradientTexture2D

## 흰 원형 그라데이션 (가운데 불투명, 가장자리 투명)
static func soft_tex() -> GradientTexture2D:
	if _soft_tex == null:
		var g := GradientTexture2D.new()
		var grad := Gradient.new()
		grad.set_color(0, Color(1, 1, 1, 1))
		grad.set_color(1, Color(1, 1, 1, 0))
		grad.add_point(0.4, Color(1, 1, 1, 0.55))
		g.gradient = grad
		g.fill = GradientTexture2D.FILL_RADIAL
		g.fill_from = Vector2(0.5, 0.5)
		g.fill_to = Vector2(1.0, 0.5)
		g.width = 64
		g.height = 64
		_soft_tex = g
	return _soft_tex

static func puff_material(color: Color, additive := false) -> StandardMaterial3D:
	var m := StandardMaterial3D.new()
	m.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	m.billboard_mode = BaseMaterial3D.BILLBOARD_PARTICLES
	m.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	if additive:
		m.blend_mode = BaseMaterial3D.BLEND_MODE_ADD
	m.vertex_color_use_as_albedo = true
	m.albedo_texture = soft_tex()
	m.albedo_color = color
	m.disable_receive_shadows = true
	return m

static func _fade_ramp(a0: float, a1 := 0.0) -> Gradient:
	var g := Gradient.new()
	g.set_color(0, Color(1, 1, 1, a0))
	g.set_color(1, Color(1, 1, 1, a1))
	return g

static func _quad() -> QuadMesh:
	var q := QuadMesh.new()
	q.size = Vector2(1, 1)
	return q

## 파티클을 parent 아래 pos 에 놓는다. parent 가 트리 밖이면 null.
static func _spawn(parent: Node, pos: Vector3, one_shot: bool) -> CPUParticles3D:
	if parent == null or not parent.is_inside_tree():
		return null
	var p := CPUParticles3D.new()
	p.local_coords = false
	p.one_shot = one_shot
	p.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	p.emitting = false
	parent.add_child(p)
	p.global_position = pos
	if one_shot:
		p.finished.connect(p.queue_free)
	return p

## 설치·철거 때 땅에서 번지는 먼지 구름
static func dust(parent: Node, pos: Vector3, radius: float, color := Color(0.55, 0.5, 0.42, 0.5), amount := 14) -> void:
	var p := _spawn(parent, pos + Vector3(0, 0.2, 0), true)
	if p == null:
		return
	p.amount = amount
	p.lifetime = 0.9
	p.explosiveness = 0.95
	p.emission_shape = CPUParticles3D.EMISSION_SHAPE_SPHERE
	p.emission_sphere_radius = maxf(0.3, radius * 0.6)
	p.direction = Vector3(0, 1, 0)
	p.spread = 90.0
	p.initial_velocity_min = 0.8
	p.initial_velocity_max = 2.6
	p.gravity = Vector3(0, 0.2, 0)
	p.damping_min = 1.2
	p.damping_max = 2.4
	p.scale_amount_min = 0.7
	p.scale_amount_max = 1.5
	p.color_ramp = _fade_ramp(1.0)
	p.mesh = _quad()
	p.material_override = puff_material(color)
	p.emitting = true

## 위로 솟는 반짝이 (강화·회복 연출). additive 라 어두운 곳에서 더 잘 보인다.
static func sparkle(parent: Node, pos: Vector3, radius: float, color := Color(0.5, 1.0, 0.7, 0.9), amount := 18) -> void:
	var p := _spawn(parent, pos + Vector3(0, 0.3, 0), true)
	if p == null:
		return
	p.amount = amount
	p.lifetime = 1.1
	p.explosiveness = 0.6
	p.emission_shape = CPUParticles3D.EMISSION_SHAPE_SPHERE
	p.emission_sphere_radius = maxf(0.3, radius * 0.7)
	p.direction = Vector3(0, 1, 0)
	p.spread = 25.0
	p.initial_velocity_min = 1.5
	p.initial_velocity_max = 3.5
	p.gravity = Vector3.ZERO
	p.scale_amount_min = 0.12
	p.scale_amount_max = 0.28
	p.color_ramp = _fade_ramp(1.0)
	p.mesh = _quad()
	p.material_override = puff_material(color, true)
	p.emitting = true

## 부서질 때 튀는 상자 파편 (중력에 떨어지며 작아져 사라진다)
static func debris(parent: Node, pos: Vector3, radius: float, color := Color(0.4, 0.34, 0.28), amount := 12) -> void:
	var p := _spawn(parent, pos + Vector3(0, 0.6, 0), true)
	if p == null:
		return
	p.amount = amount
	p.lifetime = 1.1
	p.explosiveness = 1.0
	p.emission_shape = CPUParticles3D.EMISSION_SHAPE_SPHERE
	p.emission_sphere_radius = maxf(0.3, radius * 0.5)
	p.direction = Vector3(0, 1, 0)
	p.spread = 65.0
	p.initial_velocity_min = 3.5
	p.initial_velocity_max = 8.0
	p.gravity = Vector3(0, -16, 0)
	p.angular_velocity_min = -360.0
	p.angular_velocity_max = 360.0
	p.scale_amount_min = 0.6
	p.scale_amount_max = 1.8
	var c := Curve.new()
	c.add_point(Vector2(0, 1))
	c.add_point(Vector2(0.65, 1))
	c.add_point(Vector2(1, 0))
	p.scale_amount_curve = c
	var bm := BoxMesh.new()
	bm.size = Vector3(0.16, 0.12, 0.2)
	p.mesh = bm
	var m := StandardMaterial3D.new()
	m.albedo_color = color
	m.roughness = 1.0
	m.metallic_specular = 0.0
	p.material_override = m
	p.emitting = true

## 잿더미 자국: 부서진 자리에 어두운 원이 남았다가 천천히 사라진다
static func scorch(parent: Node, pos: Vector3, radius: float) -> void:
	if parent == null or not parent.is_inside_tree():
		return
	var mi := MeshInstance3D.new()
	var pm := PlaneMesh.new()
	pm.size = Vector2(radius * 2.6, radius * 2.6)
	mi.mesh = pm
	var m := StandardMaterial3D.new()
	m.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	m.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	m.albedo_texture = soft_tex()
	m.albedo_color = Color(0.02, 0.015, 0.015, 0.6)
	m.cull_mode = BaseMaterial3D.CULL_DISABLED
	mi.material_override = m
	mi.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	parent.add_child(mi)
	mi.global_position = pos + Vector3(0, 0.07, 0)
	var tw := mi.create_tween()
	tw.tween_interval(7.0)
	tw.tween_property(m, "albedo_color:a", 0.0, 5.0)
	tw.tween_callback(mi.queue_free)

## 다친 건물에서 피어오르는 연기 (지속). 호출한 쪽이 emitting 을 켜고 끈다.
static func smoke_emitter(parent: Node3D, local_pos: Vector3, amount := 8) -> CPUParticles3D:
	var p := CPUParticles3D.new()
	p.local_coords = false
	p.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	p.emitting = false
	p.amount = amount
	p.lifetime = 2.4
	p.direction = Vector3(0.2, 1, 0)
	p.spread = 18.0
	p.initial_velocity_min = 0.7
	p.initial_velocity_max = 1.4
	p.gravity = Vector3(0.25, 0.1, 0)
	p.scale_amount_min = 0.7
	p.scale_amount_max = 1.5
	var c := Curve.new()
	c.add_point(Vector2(0, 0.4))
	c.add_point(Vector2(1, 1.6))
	p.scale_amount_curve = c
	var g := Gradient.new()
	g.set_color(0, Color(1, 1, 1, 0.0))
	g.set_color(1, Color(1, 1, 1, 0.0))
	g.add_point(0.2, Color(1, 1, 1, 0.5))
	p.color_ramp = g
	p.mesh = _quad()
	p.material_override = puff_material(Color(0.16, 0.15, 0.15, 1.0))
	parent.add_child(p)
	p.position = local_pos
	return p

## 거의 부서진 건물의 작은 불꽃 (지속, additive)
static func flame_emitter(parent: Node3D, local_pos: Vector3, amount := 10) -> CPUParticles3D:
	var p := CPUParticles3D.new()
	p.local_coords = false
	p.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	p.emitting = false
	p.amount = amount
	p.lifetime = 0.65
	p.emission_shape = CPUParticles3D.EMISSION_SHAPE_SPHERE
	p.emission_sphere_radius = 0.25
	p.direction = Vector3(0, 1, 0)
	p.spread = 20.0
	p.initial_velocity_min = 0.8
	p.initial_velocity_max = 1.8
	p.gravity = Vector3.ZERO
	p.scale_amount_min = 0.3
	p.scale_amount_max = 0.55
	var c := Curve.new()
	c.add_point(Vector2(0, 1))
	c.add_point(Vector2(1, 0.1))
	p.scale_amount_curve = c
	p.color_ramp = _fade_ramp(1.0)
	p.mesh = _quad()
	p.material_override = puff_material(Color(1.0, 0.5, 0.15, 0.9), true)
	parent.add_child(p)
	p.position = local_pos
	return p
