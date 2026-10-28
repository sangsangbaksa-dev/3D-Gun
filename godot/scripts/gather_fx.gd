extends Node3D
## 채집 연출 (월드 쪽): 타격 파편·먼지·불꽃 파티클, 쓰러지는 나무/부서지는 바위 조각, 타격음, 카메라 미세 흔들림.
## gathering.gd 가 만들고 hit/브레이크 때 불러 준다. 화면(HUD) 쪽은 gather_hud.gd, 1인칭 도구는 tool_view.gd.

## 종류별 설정. period=한 번 휘두르는 시간(초), windup=들어올리기 끝, impact=타격 시점 (스윙 위상 0~1)
## h=타격 높이, sfx/pitch=타격음, shake=카메라 흔들림 세기, col=링·아이콘 대표색
const KIND := {
	"tree": {"period": 0.8, "windup": 0.42, "impact": 0.58, "h": 1.1, "sfx": "build", "pitch": 0.8, "shake": 0.010, "col": Color(0.78, 0.55, 0.26),
		"shrink": 0.0, "lean": 0.09, "wobble": 0.045, "squash": 0.03},
	"rock": {"period": 0.9, "windup": 0.46, "impact": 0.62, "h": 0.6, "sfx": "build", "pitch": 1.5, "shake": 0.013, "col": Color(0.72, 0.74, 0.78),
		"shrink": 0.22, "lean": 0.0, "wobble": 0.02, "squash": 0.07},
	"iron": {"period": 0.95, "windup": 0.46, "impact": 0.62, "h": 0.6, "sfx": "stun", "pitch": 1.7, "shake": 0.014, "col": Color(0.55, 0.78, 1.0),
		"shrink": 0.2, "lean": 0.0, "wobble": 0.02, "squash": 0.06},
	"herb": {"period": 0.5, "windup": 0.3, "impact": 0.55, "h": 0.25, "sfx": "gather", "pitch": 0.75, "shake": 0.003, "col": Color(0.45, 0.9, 0.4),
		"shrink": 0.12, "lean": 0.0, "wobble": 0.12, "squash": 0.08},
	"wreck": {"period": 0.85, "windup": 0.4, "impact": 0.55, "h": 0.6, "sfx": "stun", "pitch": 0.75, "shake": 0.010, "col": Color(1.0, 0.7, 0.3),
		"shrink": 0.06, "lean": 0.0, "wobble": 0.03, "squash": 0.05},
}

## 파티클 층. n=개수(완료 때는 big_mul 배), speed, spread(도), grav, size, life, col, shape(box|ball), glow=발광, spin
const LAYERS := {
	"tree": [
		{"n": 7, "speed": 3.2, "spread": 60, "grav": 9.0, "size": 0.07, "life": 0.7, "col": Color(0.62, 0.42, 0.2), "shape": "box", "spin": 12.0},
		{"n": 4, "speed": 2.2, "spread": 80, "grav": 4.0, "size": 0.05, "life": 0.9, "col": Color(0.3, 0.6, 0.22), "shape": "box", "spin": 8.0},
	],
	"rock": [
		{"n": 8, "speed": 3.6, "spread": 65, "grav": 11.0, "size": 0.07, "life": 0.65, "col": Color(0.6, 0.6, 0.62), "shape": "box", "spin": 14.0},
		{"n": 5, "speed": 1.2, "spread": 90, "grav": -0.6, "size": 0.26, "life": 0.9, "col": Color(0.72, 0.68, 0.6, 0.55), "shape": "ball", "dust": true},
	],
	"iron": [
		{"n": 10, "speed": 5.0, "spread": 55, "grav": 10.0, "size": 0.035, "life": 0.45, "col": Color(1.0, 0.8, 0.35), "shape": "box", "glow": true},
		{"n": 5, "speed": 3.0, "spread": 70, "grav": 11.0, "size": 0.06, "life": 0.6, "col": Color(0.45, 0.62, 0.78), "shape": "box", "spin": 12.0},
		{"n": 3, "speed": 1.0, "spread": 90, "grav": -0.5, "size": 0.2, "life": 0.7, "col": Color(0.6, 0.62, 0.66, 0.4), "shape": "ball", "dust": true},
	],
	"herb": [
		{"n": 7, "speed": 1.8, "spread": 85, "grav": 2.0, "size": 0.05, "life": 1.0, "col": Color(0.4, 0.85, 0.35), "shape": "box", "spin": 9.0},
		{"n": 3, "speed": 1.4, "spread": 90, "grav": 1.2, "size": 0.04, "life": 1.1, "col": Color(0.95, 0.85, 0.4), "shape": "box", "spin": 6.0},
	],
	"wreck": [
		{"n": 9, "speed": 5.0, "spread": 60, "grav": 10.0, "size": 0.035, "life": 0.5, "col": Color(1.0, 0.65, 0.25), "shape": "box", "glow": true},
		{"n": 5, "speed": 3.0, "spread": 75, "grav": 11.0, "size": 0.07, "life": 0.7, "col": Color(0.55, 0.3, 0.18), "shape": "box", "spin": 12.0},
		{"n": 3, "speed": 1.0, "spread": 90, "grav": -0.4, "size": 0.24, "life": 1.0, "col": Color(0.3, 0.3, 0.32, 0.45), "shape": "ball", "dust": true},
	],
}

var game: Node
var _shake := 0.0
var _shake_t := 0.0
var _falls: Array = [] # {mi, kind, t, dir, basis, pos, landed}
var _mats := {}
var particle_count := 0 # 만든 파티클 묶음 수 (테스트용)

func _ready() -> void:
	process_mode = Node.PROCESS_MODE_PAUSABLE

## 타격 한 번. final=true 면 완료 타격(파편이 3배).
func hit(n: Dictionary, final: bool) -> void:
	var def: Dictionary = KIND[n.kind]
	var pp: Vector3 = game.player.global_position
	var to_p := Vector3(pp.x - n.pos.x, 0, pp.z - n.pos.z)
	to_p = to_p.normalized() if to_p.length() > 0.01 else Vector3.BACK
	var at: Vector3 = n.pos + Vector3.UP * float(def.h) * float(n.scale) + to_p * float(n.r) * 0.7
	burst(at, (to_p + Vector3.UP * 0.9).normalized(), n.kind, 3.0 if final else 1.0)
	Sfx._emit(Sfx._stream(def.sfx), 0.9 * Sfx.SFX_GAIN, float(def.pitch) * randf_range(0.93, 1.07), null)
	if def.sfx != "gather" and not final:
		pass
	var near := clampf(1.0 - Vector2(pp.x - n.pos.x, pp.z - n.pos.z).length() / 6.0, 0.4, 1.0)
	kick_camera(float(def.shake) * (2.0 if final else 1.0) * near)

func kick_camera(amount: float) -> void:
	_shake = minf(0.05, maxf(_shake, amount))

func burst(at: Vector3, dir: Vector3, kind: String, mul: float) -> void:
	for layer in LAYERS[kind]:
		_emit(at, dir, layer, mul)

func _emit(at: Vector3, dir: Vector3, L: Dictionary, mul: float) -> void:
	var p := CPUParticles3D.new()
	p.amount = maxi(1, int(round(float(L.n) * mul)))
	p.lifetime = float(L.life)
	p.one_shot = true
	p.explosiveness = 0.92
	p.local_coords = false
	p.direction = dir
	p.spread = float(L.spread)
	p.initial_velocity_min = float(L.speed) * 0.5
	p.initial_velocity_max = float(L.speed)
	p.gravity = Vector3(0, -float(L.grav), 0)
	var dust: bool = L.get("dust", false)
	if dust:
		p.scale_amount_min = 0.5
		p.scale_amount_max = 1.0
		var curve := Curve.new()
		curve.add_point(Vector2(0, 0.4))
		curve.add_point(Vector2(1, 1.6))
		p.scale_amount_curve = curve
	else:
		p.scale_amount_min = 0.6
		p.scale_amount_max = 1.3
	var spin := float(L.get("spin", 0.0))
	p.angular_velocity_min = -spin * 40.0
	p.angular_velocity_max = spin * 40.0
	var g := Gradient.new()
	var c: Color = L.col
	g.set_color(0, c)
	g.set_color(1, Color(c.r, c.g, c.b, 0.0))
	if not dust:
		g.add_point(0.7, c)
	p.color_ramp = g
	if L.shape == "ball":
		var sm := SphereMesh.new()
		sm.radius = float(L.size) * 0.5
		sm.height = float(L.size)
		sm.radial_segments = 8
		sm.rings = 4
		p.mesh = sm
	else:
		var bm := BoxMesh.new()
		bm.size = Vector3(1, 0.6, 0.35) * float(L.size)
		p.mesh = bm
	p.material_override = _mat(bool(L.get("glow", false)), dust)
	p.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	add_child(p)
	p.global_position = at
	p.emitting = true
	particle_count += 1
	get_tree().create_timer(float(L.life) + 0.4).timeout.connect(func(): if is_instance_valid(p): p.queue_free())

func _mat(glow: bool, dust: bool) -> StandardMaterial3D:
	var key := "%s%s" % [glow, dust]
	if not _mats.has(key):
		var m := StandardMaterial3D.new()
		m.vertex_color_use_as_albedo = true
		m.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED if (glow or dust) else BaseMaterial3D.SHADING_MODE_PER_PIXEL
		if glow:
			m.emission_enabled = true
			m.emission = Color(1, 0.7, 0.3)
			m.emission_energy_multiplier = 2.0
		if dust:
			m.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
		_mats[key] = m
	return _mats[key]

## 노드 완료: 원래 모양(mesh)을 임시 조각으로 떼어 내 쓰러뜨리거나(나무) 부수거나(바위·철광) 뽑아낸다(약초).
func finish(n: Dictionary, mesh: Mesh) -> void:
	hit(n, true)
	if mesh == null:
		return
	var mi := MeshInstance3D.new()
	mi.mesh = mesh
	mi.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	add_child(mi)
	var pp: Vector3 = game.player.global_position
	var away := Vector3(n.pos.x - pp.x, 0, n.pos.z - pp.z)
	away = away.normalized() if away.length() > 0.01 else Vector3.FORWARD
	var b := Basis(Vector3.UP, n.yaw).scaled(Vector3.ONE * float(n.scale))
	mi.transform = Transform3D(b, n.pos)
	_falls.append({"mi": mi, "kind": n.kind, "t": 0.0, "dir": away, "basis": b, "pos": n.pos, "landed": false, "r": n.r})

func _process(dt: float) -> void:
	for f in _falls.duplicate():
		f.t += dt
		if _fall_step(f):
			f.mi.queue_free()
			_falls.erase(f)
	var cam: Camera3D = game.player.camera if game.player else null
	if cam == null:
		return
	if _shake > 0.0004:
		_shake_t += dt
		_shake = maxf(0.0, _shake - dt * 0.12 - _shake * dt * 6.0)
		cam.h_offset = sin(_shake_t * 83.0) * _shake + randf_range(-0.2, 0.2) * _shake
		cam.v_offset = cos(_shake_t * 71.0) * _shake * 0.8
	elif cam.h_offset != 0.0 or cam.v_offset != 0.0:
		cam.h_offset = 0.0
		cam.v_offset = 0.0

## 조각 하나를 한 걸음 진행. 끝나면 true.
func _fall_step(f: Dictionary) -> bool:
	var mi: MeshInstance3D = f.mi
	var t: float = f.t
	var sc: float = f.basis.get_scale().x
	match f.kind:
		"tree": # 밑동을 축으로 기울다가 쿵 하고 눕고, 살짝 튕긴 뒤 가라앉는다
			var fall_t := 0.95
			var k := clampf(t / fall_t, 0.0, 1.0)
			var ang := k * k * k * deg_to_rad(88.0)
			if t > fall_t:
				ang += sin((t - fall_t) * 22.0) * exp(-(t - fall_t) * 7.0) * deg_to_rad(3.0)
				if not f.landed:
					f.landed = true
					var at: Vector3 = f.pos + f.dir * 1.6 * sc
					burst(at, Vector3.UP, "rock", 1.5)
					burst(at, Vector3.UP, "tree", 2.0)
					kick_camera(0.012)
					Sfx._emit(Sfx._stream("destroyed"), 0.6 * Sfx.SFX_GAIN, 1.4, null)
			var axis := Vector3.UP.cross(f.dir).normalized()
			var shrink := 1.0 - clampf((t - 1.7) / 0.6, 0.0, 1.0)
			var bs: Basis = Basis(axis, ang) * f.basis
			mi.transform = Transform3D(bs.scaled(Vector3.ONE * maxf(shrink, 0.001)), f.pos)
			return t > 2.3
		"rock", "iron": # 금이 가듯 위아래로 눌리며 부서진다
			var k2 := clampf(t / 0.35, 0.0, 1.0)
			var sy := 1.0 - k2 * k2
			var sxz := 1.0 + k2 * 0.25 - (k2 * k2) * 0.9
			mi.transform = Transform3D(f.basis * Basis.from_scale(Vector3(maxf(sxz, 0.001), maxf(sy, 0.001), maxf(sxz, 0.001))), f.pos)
			return t > 0.36
		"herb": # 뽑혀 올라가며 줄어든다
			var k3 := clampf(t / 0.3, 0.0, 1.0)
			var s3 := maxf(1.0 - k3, 0.001)
			mi.transform = Transform3D(f.basis * Basis(Vector3.RIGHT, -k3 * 0.5) * Basis.from_scale(Vector3.ONE * s3), f.pos + Vector3.UP * k3 * 0.5)
			return t > 0.31
		_: # 폐차: 털썩 주저앉는다
			var k4 := clampf(t / 0.45, 0.0, 1.0)
			var sy4 := 1.0 - k4 * k4 * 0.85
			var sx4 := 1.0 + k4 * 0.12
			mi.transform = Transform3D(f.basis * Basis.from_scale(Vector3(sx4, maxf(sy4, 0.001), sx4)), f.pos)
			if t > 0.45:
				var s5 := maxf(1.0 - (t - 0.45) / 0.25, 0.001)
				mi.transform = Transform3D(f.basis * Basis.from_scale(Vector3(sx4 * s5, 0.15 * s5, sx4 * s5)), f.pos)
			return t > 0.71
