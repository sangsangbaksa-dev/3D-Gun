extends Node3D
## 핵의 빛 연출: 수정이 숨 쉬듯 빛나고, 체력이 줄수록 청록 -> 호박색 -> 붉은 깜빡임으로 바뀐다.
## 맞으면 붉게 번쩍, 회복하면 밝게 번쩍. 체력 50% 아래는 불꽃 튐, 30% 아래는 검은 연기. 핵 아래 빛무리와 하늘로 뻗는 빛기둥.
## 보기만 한다: core.hp 와 game.phase 를 읽을 뿐 아무것도 쓰지 않는다. 수정 재질은 공유라 건드리지 않고 material_overlay(덧칠)로만 빛낸다.
## look.gd 가 핵 노드 아래에 붙인다.

const Fx := preload("res://scripts/fx.gd")

var game: Node
var core: Node3D
var _visual_id := 0
var _meshes: Array = []
var _glow: StandardMaterial3D
var _beam: MeshInstance3D
var _beam_mat: StandardMaterial3D
var _halo: MeshInstance3D
var _halo_mat: StandardMaterial3D
var _light: OmniLight3D
var _sparks: CPUParticles3D
var _smoke: CPUParticles3D
var _t := 0.0
var _hp_prev := -1.0
var _hit := 0.0
var _heal := 0.0

func setup(g: Node) -> void:
	game = g
	core = g.core
	_glow = StandardMaterial3D.new()
	_glow.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	_glow.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	_glow.blend_mode = BaseMaterial3D.BLEND_MODE_ADD
	_glow.albedo_color = Color(0.3, 0.9, 1.0, 0.0)
	# 빛기둥: 아래가 굵고 위로 갈수록 가늘어지는 속 빈 원뿔
	_beam_mat = StandardMaterial3D.new()
	_beam_mat.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	_beam_mat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	_beam_mat.blend_mode = BaseMaterial3D.BLEND_MODE_ADD
	_beam_mat.cull_mode = BaseMaterial3D.CULL_DISABLED
	_beam_mat.albedo_color = Color(0.3, 0.9, 1.0, 0.08)
	_beam_mat.disable_receive_shadows = true
	var cm := CylinderMesh.new()
	cm.top_radius = 0.03
	cm.bottom_radius = 0.45
	cm.height = 16.0
	cm.radial_segments = 12
	cm.rings = 1
	cm.cap_top = false
	cm.cap_bottom = false
	_beam = MeshInstance3D.new()
	_beam.mesh = cm
	_beam.material_override = _beam_mat
	_beam.position = Vector3(0, 3.0 + 8.0, 0)
	_beam.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	add_child(_beam)
	# 바닥 빛무리
	var rad: float = float(core.radius) + 1.6
	_halo_mat = StandardMaterial3D.new()
	_halo_mat.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	_halo_mat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	_halo_mat.blend_mode = BaseMaterial3D.BLEND_MODE_ADD
	_halo_mat.albedo_texture = Fx.soft_tex()
	_halo_mat.albedo_color = Color(0.3, 0.9, 1.0, 0.2)
	_halo_mat.cull_mode = BaseMaterial3D.CULL_DISABLED
	_halo_mat.disable_receive_shadows = true
	var pm := PlaneMesh.new()
	pm.size = Vector2(rad * 2.0, rad * 2.0)
	_halo = MeshInstance3D.new()
	_halo.mesh = pm
	_halo.material_override = _halo_mat
	_halo.position = Vector3(0, 0.1, 0)
	_halo.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	add_child(_halo)
	# 불꽃 튐 (체력 50% 아래)
	_sparks = CPUParticles3D.new()
	_sparks.local_coords = false
	_sparks.emitting = false
	_sparks.amount = 20
	_sparks.lifetime = 0.9
	_sparks.emission_shape = CPUParticles3D.EMISSION_SHAPE_SPHERE
	_sparks.emission_sphere_radius = 0.5
	_sparks.direction = Vector3(0, 1, 0)
	_sparks.spread = 180.0
	_sparks.initial_velocity_min = 1.5
	_sparks.initial_velocity_max = 3.8
	_sparks.gravity = Vector3(0, -5.0, 0)
	_sparks.scale_amount_min = 0.07
	_sparks.scale_amount_max = 0.16
	var qs := QuadMesh.new()
	qs.size = Vector2(1, 1)
	_sparks.mesh = qs
	var rg := Gradient.new()
	rg.set_color(0, Color(1, 1, 1, 1))
	rg.set_color(1, Color(1, 1, 1, 0))
	_sparks.color_ramp = rg
	_sparks.material_override = Fx.puff_material(Color(1.0, 0.6, 0.2, 1.0), true)
	_sparks.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	add_child(_sparks)
	_sparks.position = Vector3(0, 2.9, 0)
	# 검은 연기 (체력 30% 아래)
	_smoke = Fx.smoke_emitter(self, Vector3(0, 3.4, 0), 10)
	for n in core.find_children("*", "OmniLight3D", false, false):
		_light = n
		break
	if core.has_signal("damaged"):
		core.damaged.connect(_on_damaged)

func _on_damaged(_hp: float) -> void:
	_hit = 1.0

## 체력 비율에 따른 빛 색: 가득 = 청록, 중간 = 호박색, 위험 = 빨강
static func hp_color(r: float) -> Color:
	var cyan := Color(0.25, 0.9, 1.0)
	var amber := Color(1.0, 0.68, 0.22)
	var red := Color(1.0, 0.2, 0.18)
	if r >= 0.6:
		return cyan
	if r >= 0.3:
		return amber.lerp(cyan, (r - 0.3) / 0.3)
	return red.lerp(amber, r / 0.3)

## core_visual 이 바뀌면(핵 강화) 새 수정에 덧칠을 다시 건다.
func _bind_visual() -> void:
	for m in _meshes:
		if is_instance_valid(m):
			(m as MeshInstance3D).material_overlay = null
	_meshes.clear()
	var v: Node = game.core_visual
	_visual_id = v.get_instance_id() if v else 0
	if v == null:
		return
	var cr: Node = v.find_child("crystal-*", true, false)
	if cr == null:
		return
	if cr is MeshInstance3D:
		_meshes.append(cr)
	for m in cr.find_children("*", "MeshInstance3D", true, false):
		_meshes.append(m)
	for m in _meshes:
		(m as MeshInstance3D).material_overlay = _glow

func _process(dt: float) -> void:
	if core == null or not is_instance_valid(core) or game == null:
		return
	_t += dt
	var v: Node = game.core_visual
	var vid: int = v.get_instance_id() if v else 0
	if vid != _visual_id:
		_bind_visual()
	var r := clampf(core.hp / maxf(core.max_hp, 1.0), 0.0, 1.0)
	if _hp_prev >= 0.0 and core.hp > _hp_prev + 0.5:
		_heal = 1.0
	_hp_prev = core.hp
	_hit = maxf(0.0, _hit - dt * 2.5)
	_heal = maxf(0.0, _heal - dt * 1.6)
	var alive: bool = not core.dead
	var combat: bool = game.phase == "combat"
	var col := hp_color(r).lerp(Color(1.0, 0.2, 0.15), _hit).lerp(Color(0.85, 1.0, 0.9), _heal * 0.6)
	var rate := 1.6 + (1.0 - r) * 4.0 # 다칠수록 맥박이 빨라진다
	var pulse := 0.5 + 0.5 * sin(_t * rate)
	var flick := 1.0
	if r < 0.3:
		flick = 0.6 + 0.4 * absf(sin(_t * 23.0) * sin(_t * 37.0 + 1.0))
	var live := 1.0 if alive else 0.0
	var k := (0.16 + 0.3 * pulse) * flick * live * (1.2 if combat else 1.0) + _hit * 0.55 + _heal * 0.45
	_glow.albedo_color = Color(col.r, col.g, col.b, clampf(k, 0.0, 1.0))
	_beam_mat.albedo_color = Color(col.r, col.g, col.b, (0.05 + 0.07 * pulse) * flick * live + _hit * 0.1)
	_beam.scale = Vector3(1, 0.35 + 0.65 * r, 1) * 1.0
	_beam.position.y = 3.0 + 8.0 * _beam.scale.y
	_beam.visible = alive
	_halo_mat.albedo_color = Color(col.r, col.g, col.b, (0.14 + 0.2 * pulse) * flick * live + _hit * 0.2 + _heal * 0.15)
	_halo.scale = Vector3.ONE * (1.0 + 0.06 * pulse + _heal * 0.15)
	if _light:
		_light.light_color = col
		_light.light_energy = ((0.42 + 0.34 * pulse) * (0.55 + 0.45 * r) * flick * live) + _hit * 1.1 + _heal * 0.7
	var want_sparks: bool = alive and r < 0.5
	if _sparks.emitting != want_sparks:
		_sparks.emitting = want_sparks
	var want_smoke: bool = alive and r < 0.3
	if _smoke.emitting != want_smoke:
		_smoke.emitting = want_smoke
