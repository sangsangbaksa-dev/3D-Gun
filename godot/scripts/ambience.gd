extends Node3D
## 환경 입자: 카메라 둘레에 작고 드물고 흐릿하게 떠다니는 먼지·꽃가루·재, 구역에 따라 깔리는 옅은 땅안개.
## 번쩍이는 입자는 쓰지 않는다 (알파 블렌딩, 낮은 불투명도). 구역(숲·채석장·폐허…)에 들어서면 색과 움직임이 서서히 바뀐다.
## look.gd 가 만든다. 게임 상태는 읽기만 한다.

const Fx := preload("res://scripts/fx.gd")

# 구역 종류별: color(알파 = 불투명도), size(m), vel(속도 최소·최대), dir(움직임 방향), grav(y), mist(땅안개 색, 알파 0 이면 없음)
const PROFILES := {
	"wild": {"color": Color(0.8, 0.72, 0.6, 0.2), "size": 0.05, "vel": [0.15, 0.45], "dir": Vector3(0.3, 1, 0.1), "grav": 0.0, "mist": Color(0, 0, 0, 0)},
	"base": {"color": Color(0.8, 0.72, 0.6, 0.18), "size": 0.045, "vel": [0.1, 0.4], "dir": Vector3(0.3, 1, 0.1), "grav": 0.0, "mist": Color(0, 0, 0, 0)},
	"forest": {"color": Color(0.7, 0.8, 0.55, 0.17), "size": 0.05, "vel": [0.1, 0.35], "dir": Vector3(0.2, 1, 0.2), "grav": 0.0, "mist": Color(0.3, 0.38, 0.3, 0.07)},
	"field": {"color": Color(0.85, 0.8, 0.55, 0.17), "size": 0.05, "vel": [0.15, 0.5], "dir": Vector3(0.6, 1, 0.2), "grav": 0.0, "mist": Color(0, 0, 0, 0)},
	"quarry": {"color": Color(0.75, 0.72, 0.66, 0.2), "size": 0.055, "vel": [0.4, 1.0], "dir": Vector3(1, 0.2, 0.3), "grav": 0.0, "mist": Color(0, 0, 0, 0)},
	"mine": {"color": Color(0.55, 0.5, 0.55, 0.15), "size": 0.045, "vel": [0.1, 0.3], "dir": Vector3(0.1, 1, 0.1), "grav": 0.0, "mist": Color(0.2, 0.2, 0.26, 0.08)},
	"ruins": {"color": Color(0.62, 0.6, 0.58, 0.22), "size": 0.055, "vel": [0.1, 0.4], "dir": Vector3(0.5, -0.2, 0.2), "grav": -0.2, "mist": Color(0.35, 0.33, 0.36, 0.08)},
	"wasteland": {"color": Color(0.75, 0.6, 0.42, 0.22), "size": 0.06, "vel": [0.8, 1.7], "dir": Vector3(1, 0.1, 0.3), "grav": 0.0, "mist": Color(0.5, 0.4, 0.3, 0.06)},
	"boss": {"color": Color(0.6, 0.3, 0.27, 0.2), "size": 0.055, "vel": [0.3, 0.9], "dir": Vector3(0.2, 1, 0.1), "grav": 0.0, "mist": Color(0.4, 0.1, 0.12, 0.1)},
}

var game: Node
var motes: CPUParticles3D
var mist: CPUParticles3D
var _mote_mat: StandardMaterial3D
var _mist_mat: StandardMaterial3D
var _kind := ""
var _col := Color(0.8, 0.72, 0.6, 0.2)
var _mist_col := Color(0, 0, 0, 0)

## 위치가 속한 구역 종류 ("wild" = 어느 구역도 아님). 구역 반지름 안에서 가장 중심에 가까운 곳.
static func zone_at(p: Vector3) -> String:
	var best := "wild"
	var bs := 1.0
	for z in GameData.map.zones:
		var d := Vector2(p.x - float(z.x), p.z - float(z.z)).length() / float(z.r)
		if d < bs:
			bs = d
			best = z.kind
	return best

func _ready() -> void:
	var web := OS.has_feature("web")
	motes = CPUParticles3D.new()
	motes.amount = 36 if web else 64
	motes.lifetime = 9.0
	motes.preprocess = 9.0
	motes.local_coords = false
	motes.emission_shape = CPUParticles3D.EMISSION_SHAPE_BOX
	motes.emission_box_extents = Vector3(24, 5, 24)
	motes.spread = 60.0
	motes.gravity = Vector3.ZERO
	motes.visibility_aabb = AABB(Vector3(-50, -12, -50), Vector3(100, 40, 100))
	motes.scale_amount_min = 1.0
	motes.scale_amount_max = 1.0
	var q := QuadMesh.new()
	q.size = Vector2(1, 1)
	motes.mesh = q
	var g := Gradient.new()
	g.set_color(0, Color(1, 1, 1, 0))
	g.set_color(1, Color(1, 1, 1, 0))
	g.add_point(0.25, Color(1, 1, 1, 1))
	g.add_point(0.75, Color(1, 1, 1, 1))
	motes.color_ramp = g
	_mote_mat = Fx.puff_material(_col, false)
	motes.material_override = _mote_mat
	motes.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	add_child(motes)

	mist = CPUParticles3D.new()
	mist.amount = 7 if web else 12
	mist.lifetime = 16.0
	mist.preprocess = 16.0
	mist.local_coords = false
	mist.emission_shape = CPUParticles3D.EMISSION_SHAPE_BOX
	mist.emission_box_extents = Vector3(45, 0.3, 45)
	mist.direction = Vector3(1, 0, 0.3)
	mist.spread = 180.0
	mist.initial_velocity_min = 0.2
	mist.initial_velocity_max = 0.5
	mist.gravity = Vector3.ZERO
	mist.scale_amount_min = 9.0
	mist.scale_amount_max = 15.0
	mist.visibility_aabb = AABB(Vector3(-70, -4, -70), Vector3(140, 12, 140))
	var mq := QuadMesh.new()
	mq.size = Vector2(1, 0.32)
	mist.mesh = mq
	var mg := Gradient.new()
	mg.set_color(0, Color(1, 1, 1, 0))
	mg.set_color(1, Color(1, 1, 1, 0))
	mg.add_point(0.3, Color(1, 1, 1, 1))
	mg.add_point(0.7, Color(1, 1, 1, 1))
	mist.color_ramp = mg
	_mist_mat = Fx.puff_material(Color(1, 1, 1, 0), false)
	mist.material_override = _mist_mat
	mist.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	mist.visible = false
	add_child(mist)
	_apply_profile("wild", true)

func _apply_profile(kind: String, snap: bool) -> void:
	_kind = kind
	var pr: Dictionary = PROFILES.get(kind, PROFILES.wild)
	var vel: Array = pr.vel
	motes.initial_velocity_min = float(vel[0])
	motes.initial_velocity_max = float(vel[1])
	motes.direction = pr.dir
	motes.gravity = Vector3(0, float(pr.grav), 0)
	motes.scale_amount_min = float(pr.size)
	motes.scale_amount_max = float(pr.size) * 1.6
	if snap:
		_col = pr.color
		_mist_col = pr.mist

func _process(dt: float) -> void:
	var cam := get_viewport().get_camera_3d()
	if cam == null:
		return
	var cp := cam.global_position
	var k := clampf(dt * 0.8, 0.0, 1.0)
	var kind := zone_at(cp)
	if kind != _kind:
		_apply_profile(kind, false)
	var pr: Dictionary = PROFILES.get(_kind, PROFILES.wild)
	_col = _col.lerp(pr.color, k)
	_mist_col = _mist_col.lerp(pr.mist, k)
	_mote_mat.albedo_color = _col
	_mist_mat.albedo_color = _mist_col
	motes.global_position = cp
	var show_mist := _mist_col.a > 0.01
	if mist.visible != show_mist:
		mist.visible = show_mist
	if show_mist:
		var gy := cp.y - 1.6
		if game and game.get("world") != null:
			gy = float(game.world.ground_y(cp.x, cp.z)) + 1.1
		mist.global_position = Vector3(cp.x, gy, cp.z)
