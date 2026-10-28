extends Node3D
## The apocalypse look: overcast dusk sky (soft horizon-to-zenith gradient, layered clouds, one small sun), phase lighting
## (prep / combat / ended), fog tinted by zone and wave, blue-grey over brown hemisphere ambient, ruined skyline and sparse faint embers.
## 월드 분위기 작업: 하늘은 흐린 노을(큰 주황 원반·붉은 소용돌이 구름 제거), 구역별 안개 색, 웨이브가 오를수록 해가 낮고 붉어짐.
## Port of src/core/atmosphere.ts + the lights in src/core/world.ts. Visual only: reads game.phase, writes nothing back.
## Also turns every imported material into the web game's look (MeshLambertMaterial: diffuse only, no shine),
## which removes the orange horizon glare that Godot's default specular put on flat ground.

var game: Node

# 팔레트: bg #10141a, teal #2EE6D6, orange #FF8A2A, red #E0303A (atmosphere.ts LOOKS 그대로)
const LOOKS := {
	"prep": {"top": 0x1d2a33, "horizon": 0x8c6650, "fog": 0x65524a, "fog_near": 48.0, "fog_far": 248.0, "sun": 1.5, "sun_color": 0xffbb85, "hemi": 1.08, "hemi_sky": 0x5f8290, "hemi_ground": 0x3e352c, "ember": 0.35},
	"combat": {"top": 0x16141c, "horizon": 0x6e3d3e, "fog": 0x45292d, "fog_near": 38.0, "fog_far": 188.0, "sun": 1.1, "sun_color": 0xe99a6a, "hemi": 0.86, "hemi_sky": 0x4c6a78, "hemi_ground": 0x3a2a26, "ember": 0.7},
	"ended": {"top": 0x0f1a1c, "horizon": 0x3d5b5a, "fog": 0x25393a, "fog_near": 28.0, "fog_far": 130.0, "sun": 0.55, "sun_color": 0xb8c0cc, "hemi": 0.6, "hemi_sky": 0x1a4a48, "hemi_ground": 0x1c2226, "ember": 0.1},
}
# 구역 안개: [색, 세기, 안개 거리 배율] — 구역에 들어서면 안개가 그 색으로 서서히 기운다
const ZONE_FOG := {
	"forest": [0x344a34, 0.34, 0.8], "field": [0x7a6c3c, 0.28, 1.0], "quarry": [0x6a645c, 0.3, 1.05],
	"mine": [0x2a2832, 0.4, 0.7], "ruins": [0x4a4044, 0.32, 0.85], "wasteland": [0x86603a, 0.32, 1.1],
	"boss": [0x5a1a20, 0.45, 0.75],
}
const SUN_BASE := Vector3(0.55, 0.5, 0.45) # 해 방향 (하늘 셰이더와 햇빛이 같이 쓴다)
const AmbienceScript := preload("res://scripts/ambience.gd")
const ScatterScript := preload("res://scripts/scatter.gd")
const CoreFxScript := preload("res://scripts/core_fx.gd")
const BOOST := 1.08
const FADE := 2.5
# 웹은 선형 공간 조명 + ACES, Godot Compatibility 는 sRGB 공간에서 바로 계산해 톤매핑 없이 쓴다.
# 원본 화면과 같은 자리 스크린샷을 비교해 맞춘 빛 세기 배율
const SUN_K := 0.42
const AMB_K := 0.6
const FILL_K := 1.5

const SKY_SHADER := """
shader_type sky;
uniform vec3 top; uniform vec3 hor; uniform vec3 sun_dir; uniform vec3 sun_col; uniform vec3 fog_c;
uniform vec3 hemi_sky; uniform vec3 hemi_ground; uniform float hemi; uniform float hemi_desat = 0.45;
uniform float t;

float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + 1.), f.x), f.y); }

void sky() {
	vec3 vP = EYEDIR;
	if (AT_CUBEMAP_PASS) {
		// 주변광은 웹의 HemisphereLight: 위는 하늘색, 아래는 흙색
		vec3 hc = mix(hemi_ground, hemi_sky, vP.y * .5 + .5);
		COLOR = mix(hc, vec3(dot(hc, vec3(.3, .55, .15))), hemi_desat) * hemi;
	} else {
		float y = max(vP.y, 0.);
		// 수평선에서 천정까지 부드러운 그라데이션 (흐린 노을)
		vec3 c = mix(hor, top, smoothstep(0., .9, pow(y, .62)));
		// 해 쪽 수평선이 은은히 밝아진다
		vec2 hd = normalize(sun_dir.xz + 1e-4);
		float az = max(dot(normalize(vP.xz + 1e-4), hd), 0.);
		c += sun_col * .16 * pow(az, 5.) * (1. - smoothstep(0., .4, y));
		// 구름 층: 하늘 돔을 평면에 투영해 3겹 노이즈로. 멀리(지평선)는 촘촘하고 천정은 넓다. 대비는 낮게
		vec2 cp = vP.xz / (y + .25) * .85 + vec2(t * .006, t * .0025);
		float f = n(cp) * .5 + n(cp * 2.1 + 7.) * .3 + n(cp * 4.3 + 3.) * .2;
		float cl = smoothstep(.4, .82, f) * smoothstep(0., .22, y);
		vec3 cloud = mix(top, hor, .5) * 1.12;
		c = mix(c, cloud, cl * .55);
		// 작은 해 하나 (구름에 가려진다) + 아주 옅은 번짐
		float s = max(dot(vP, sun_dir), 0.);
		c += sun_col * (pow(s, 2200.) * 1.5 + pow(s, 70.) * .08) * (1. - cl * .85);
		// 지평선 안개
		c = mix(fog_c, c, smoothstep(-.02, .16, vP.y));
		// 웹은 이 선형 값을 sRGB 로 바꿔 화면에 쓴다. Compatibility 렌더러는 셰이더 값을 그대로 화면에 쓰므로(톤매핑 Linear) 여기서 바꾼다
		c = max(c, vec3(0.));
		COLOR = mix(1.055 * pow(c, vec3(1. / 2.4)) - .055, c * 12.92, step(c, vec3(.0031308)));
	}
}
"""

var env: Environment
var sky_mat: ShaderMaterial
var sun: DirectionalLight3D
var fill: DirectionalLight3D
var skyline: Node3D
var embers: CPUParticles3D
var ember_mat: StandardMaterial3D
var cur := {}
var from := {}
var phase := "prep"
var prog := 1.0
var t := 0.0
var _patched := {}
var _late := false
var zone_col := Color(0, 0, 0)
var zone_a := 0.0 # 구역 안개 세기 (서서히 변한다)
var zone_mul := 1.0
var wf := 0.0 # 웨이브 진행 0..1 (50웨이브에서 1)
var _sun_pos := Vector3.ZERO

func _ready() -> void:
	cur = LOOKS.prep.duplicate()
	from = cur.duplicate()
	_build_env()
	_build_lights()
	_build_skyline()
	_build_embers()
	_apply()
	get_tree().node_added.connect(_on_node_added)
	_lambert_all(get_tree().root)

# ── 하늘·안개·조명 ───────────────────────────────────────────────────

func _build_env() -> void:
	var sh := Shader.new()
	sh.code = SKY_SHADER
	sky_mat = ShaderMaterial.new()
	sky_mat.shader = sh
	var sky := Sky.new()
	sky.sky_material = sky_mat
	sky.radiance_size = Sky.RADIANCE_SIZE_32
	sky.process_mode = Sky.PROCESS_MODE_INCREMENTAL
	env = Environment.new()
	env.background_mode = Environment.BG_SKY
	env.sky = sky
	env.ambient_light_source = Environment.AMBIENT_SOURCE_SKY
	env.reflected_light_source = Environment.REFLECTION_SOURCE_DISABLED
	env.tonemap_mode = Environment.TONE_MAPPER_LINEAR
	env.fog_enabled = true
	env.fog_mode = Environment.FOG_MODE_DEPTH
	env.fog_density = 1.0
	env.fog_depth_curve = 2.0 # 웹 Fog 는 smoothstep 이라 가까운 곳은 덜 뿌옇다
	env.fog_sky_affect = 0.0
	env.fog_aerial_perspective = 0.0
	var we := WorldEnvironment.new()
	we.environment = env
	add_child(we)

func _build_lights() -> void:
	sun = DirectionalLight3D.new()
	sun.shadow_enabled = true
	sun.shadow_bias = 0.03
	sun.shadow_normal_bias = 1.0
	sun.directional_shadow_max_distance = 90.0
	sun.directional_shadow_mode = DirectionalLight3D.SHADOW_ORTHOGONAL
	add_child(sun)
	_sun_pos = SUN_BASE.normalized() * 60.0
	sun.look_at_from_position(_sun_pos, Vector3.ZERO)
	fill = DirectionalLight3D.new()
	fill.light_color = Color.hex(0x3a5a68ff)
	fill.light_energy = 0.32 * FILL_K
	fill.light_specular = 0.0
	add_child(fill)
	fill.look_at_from_position(Vector3(-28, 22, -32), Vector3.ZERO)

static func _c(hex: int) -> Color:
	return Color.hex((hex << 8) | 0xff)

## Web Color.setHex() turns sRGB hex into linear; shader uniforms get those linear numbers.
static func _lin(hex: int) -> Vector3:
	var c := _c(hex).srgb_to_linear()
	return Vector3(c.r, c.g, c.b)

static func _srgb(hex: int) -> Vector3:
	var c := _c(hex)
	return Vector3(c.r, c.g, c.b)

func _process(dt: float) -> void:
	t += dt
	if not _late and game != null and game.get("world") != null and game.get("core") != null:
		_late = true
		_build_extras()
	var p: String = game.phase if game and "phase" in game else "prep"
	if p != phase and LOOKS.has(p):
		phase = p
		from = cur.duplicate()
		prog = 0.0
	if prog < 1.0:
		prog = minf(1.0, prog + dt / FADE)
		var k := prog * prog * (3.0 - 2.0 * prog)
		var to: Dictionary = LOOKS[phase]
		for key in to:
			if to[key] is int:
				cur[key] = _c(from[key]).lerp(_c(to[key]), k).to_rgba32() >> 8
			else:
				cur[key] = lerpf(from[key], to[key], k)
	var cam := get_viewport().get_camera_3d()
	if cam:
		var cp := cam.global_position
		skyline.position = Vector3(cp.x * 0.85, 0, cp.z * 0.85)
		embers.global_position = Vector3(cp.x, cp.y - 4.0, cp.z)
		# 구역 안개: 들어선 구역의 색으로 서서히
		var zk := clampf(dt * 0.7, 0.0, 1.0)
		var zi: Array = ZONE_FOG.get(AmbienceScript.zone_at(cp), [])
		var tc := zone_col
		var ta := 0.0
		var tm := 1.0
		if not zi.is_empty():
			tc = _c(int(zi[0]))
			ta = float(zi[1])
			tm = float(zi[2])
		zone_col = zone_col.lerp(tc, zk) if zone_a > 0.01 else tc
		zone_a = lerpf(zone_a, ta, zk)
		zone_mul = lerpf(zone_mul, tm, zk)
	var w: float = float(game.wave) if game != null and "wave" in game else 0.0
	wf = lerpf(wf, clampf(w / 50.0, 0.0, 1.0), clampf(dt * 0.5, 0.0, 1.0))
	_apply()

func _apply() -> void:
	var s := cur
	# 웨이브가 오를수록 하늘은 어두워지고 수평선은 붉어지며 해는 낮고 약해진다
	var top_c := _c(s.top).lerp(Color(0.03, 0.02, 0.04), wf * 0.35)
	var hor_c := _c(s.horizon).lerp(Color(0.62, 0.2, 0.18), wf * 0.22)
	var fog_c := _c(s.fog).lerp(zone_col, zone_a).lerp(Color(0.3, 0.1, 0.1), wf * 0.15)
	var sun_c := _c(s.sun_color).lerp(Color(1.0, 0.5, 0.3), wf * 0.35)
	sky_mat.set_shader_parameter("top", _lin_col(top_c))
	sky_mat.set_shader_parameter("hor", _lin_col(hor_c))
	sky_mat.set_shader_parameter("sun_col", _lin_col(sun_c))
	sky_mat.set_shader_parameter("fog_c", _lin_col(fog_c) * BOOST)
	var sd := Vector3(SUN_BASE.x, SUN_BASE.y * (1.0 - 0.5 * wf), SUN_BASE.z).normalized()
	sky_mat.set_shader_parameter("sun_dir", sd)
	sky_mat.set_shader_parameter("hemi_sky", _srgb(s.hemi_sky))
	sky_mat.set_shader_parameter("hemi_ground", _srgb(s.hemi_ground))
	sky_mat.set_shader_parameter("hemi", s.hemi * BOOST * AMB_K) # Compatibility 는 ambient_light_energy 를 하늘 주변광에 쓰지 않는다
	sky_mat.set_shader_parameter("t", t)
	env.fog_light_color = fog_c * BOOST
	var fm := zone_mul * (1.0 - 0.15 * wf)
	env.fog_depth_begin = s.fog_near * fm
	env.fog_depth_end = s.fog_far * fm
	sun.light_energy = s.sun * BOOST * SUN_K * lerpf(1.0, 0.78, wf)
	sun.light_color = sun_c
	sun.light_specular = 0.0
	var sp := sd * 60.0
	if sp.distance_squared_to(_sun_pos) > 0.01:
		_sun_pos = sp
		sun.look_at_from_position(sp, Vector3.ZERO)
	if ember_mat:
		var e: float = s.ember
		ember_mat.albedo_color.a = 0.05 + e * 0.2 * (0.85 + sin(t * 3.0) * 0.15)

func _build_extras() -> void:
	var sc := ScatterScript.new()
	add_child(sc)
	sc.build(game.world)
	var cf := CoreFxScript.new()
	game.core.add_child(cf)
	cf.setup(game)
	var am := AmbienceScript.new()
	am.game = game
	add_child(am)

static func _lin_col(c: Color) -> Vector3:
	var l := c.srgb_to_linear()
	return Vector3(l.r, l.g, l.b)

# ── 지평선 폐허·불씨 ─────────────────────────────────────────────────

## Two rings of ruined high-rises beyond the map edge (±200 m), like atmosphere.ts buildSkyline.
func _build_skyline() -> void:
	skyline = Node3D.new()
	add_child(skyline)
	var s := 7
	var rings := [[228.0, 0x1c1418, 76], [262.0, 0x120d12, 96]]
	for ring in rings:
		var rad: float = ring[0]
		var count: int = ring[2]
		var mm := MultiMesh.new()
		mm.transform_format = MultiMesh.TRANSFORM_3D
		mm.mesh = BoxMesh.new()
		mm.instance_count = count
		for i in count:
			s = (s * 16807) % 2147483647
			var r1 := float(s) / 2147483647.0
			s = (s * 16807) % 2147483647
			var r2 := float(s) / 2147483647.0
			s = (s * 16807) % 2147483647
			var r3 := float(s) / 2147483647.0
			s = (s * 16807) % 2147483647
			var r4 := float(s) / 2147483647.0
			s = (s * 16807) % 2147483647
			var r5 := float(s) / 2147483647.0
			s = (s * 16807) % 2147483647
			var r6 := float(s) / 2147483647.0
			s = (s * 16807) % 2147483647
			var r7 := float(s) / 2147483647.0
			var a := float(i) / count * TAU + r1 * 0.05
			var hgt := 10.0 + pow(r2, 1.8) * (64.0 if rad > 240.0 else 44.0)
			var w := 6.0 + r3 * 14.0
			var tilt := (r5 - 0.5) * (0.24 if r6 < 0.22 else 0.04)
			var b := Basis.from_euler(Vector3(0, -a + (r4 - 0.5) * 0.3, tilt), EULER_ORDER_XYZ).scaled(Vector3(w, hgt, 5.0 + r7 * 7.0))
			mm.set_instance_transform(i, Transform3D(b, Vector3(cos(a) * rad, hgt / 2.0 - 2.5, sin(a) * rad)))
		var mi := MultiMeshInstance3D.new()
		mi.multimesh = mm
		var m := StandardMaterial3D.new()
		m.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
		m.albedo_color = _c(ring[1])
		m.disable_fog = true
		mi.material_override = m
		mi.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
		mi.extra_cull_margin = 600.0
		skyline.add_child(mi)

## Orange embers drifting up around the camera (atmosphere.ts buildEmbers, 500 points in an 80 m box).
func _build_embers() -> void:
	embers = CPUParticles3D.new()
	embers.amount = 90 if not OS.has_feature("web") else 50
	embers.lifetime = 30.0
	embers.preprocess = 30.0
	embers.local_coords = false
	embers.emission_shape = CPUParticles3D.EMISSION_SHAPE_BOX
	embers.emission_box_extents = Vector3(40, 2, 40)
	embers.direction = Vector3(0.3, 1, 0)
	embers.spread = 25.0
	embers.gravity = Vector3.ZERO
	embers.initial_velocity_min = 0.6
	embers.initial_velocity_max = 1.5
	embers.visibility_aabb = AABB(Vector3(-60, -10, -60), Vector3(120, 60, 120))
	var q := QuadMesh.new()
	q.size = Vector2(0.1, 0.1)
	embers.mesh = q
	ember_mat = StandardMaterial3D.new()
	ember_mat.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	ember_mat.billboard_mode = BaseMaterial3D.BILLBOARD_PARTICLES
	ember_mat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	ember_mat.blend_mode = BaseMaterial3D.BLEND_MODE_ADD
	ember_mat.no_depth_test = false
	ember_mat.disable_receive_shadows = true
	ember_mat.albedo_color = Color(0.85, 0.5, 0.28, 0.1)
	var g := GradientTexture2D.new()
	var grad := Gradient.new()
	grad.set_color(0, Color(1, 1, 1, 1))
	grad.set_color(1, Color(1, 1, 1, 0))
	grad.add_point(0.35, Color(1, 1, 1, 0.67))
	g.gradient = grad
	g.fill = GradientTexture2D.FILL_RADIAL
	g.fill_from = Vector2(0.5, 0.5)
	g.fill_to = Vector2(1.0, 0.5)
	g.width = 32
	g.height = 32
	ember_mat.albedo_texture = g
	embers.material_override = ember_mat
	embers.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	add_child(embers)

# ── 재질: 웹의 MeshLambertMaterial 처럼 ─────────────────────────────

func _on_node_added(n: Node) -> void:
	if n is GeometryInstance3D:
		_lambert(n)

func _lambert_all(n: Node) -> void:
	for c in n.find_children("*", "GeometryInstance3D", true, false):
		_lambert(c)

func _lambert(gi: GeometryInstance3D) -> void:
	if gi.material_override is BaseMaterial3D:
		_lambert_mat(gi.material_override)
	if gi is MeshInstance3D and (gi as MeshInstance3D).mesh:
		var m: Mesh = (gi as MeshInstance3D).mesh
		for i in m.get_surface_count():
			var sm := m.surface_get_material(i)
			if sm is BaseMaterial3D:
				_lambert_mat(sm)
		for i in (gi as MeshInstance3D).get_surface_override_material_count():
			var om := (gi as MeshInstance3D).get_surface_override_material(i)
			if om is BaseMaterial3D:
				_lambert_mat(om)

func _lambert_mat(m: BaseMaterial3D) -> void:
	if _patched.has(m) or m.shading_mode == BaseMaterial3D.SHADING_MODE_UNSHADED:
		return
	_patched[m] = true
	m.specular_mode = BaseMaterial3D.SPECULAR_DISABLED
	m.metallic = 0.0
	m.metallic_specular = 0.0
	m.roughness = 1.0
