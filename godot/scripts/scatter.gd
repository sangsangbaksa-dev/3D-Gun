extends Node3D
## 구역별 잔 소품: 풀, 돌, 쓰러진 통나무, 잔해, 뼈, 광석 조각, 길가 폐차.
## world.glb 에 이미 있는 나무·건물·큰 바위 사이를 채워 구역마다 색과 질감이 달라 보이게 한다.
## 종류마다 MultiMesh 하나(그림자 없음)라 그리기 호출이 20개 안팎이고 웹에서도 가볍다.
## 배치는 고정 씨앗이라 실행마다 같다. 길·기지 건설 구역·기존 장애물(나무·바위·건물)은 피한다. 폐차만 충돌을 가진다.

const KEEP_LANE := 3.2 # 레인 중심선에서 이만큼은 비워 둔다
const WILD_COUNT := 520

# 구역 종류별 소품: [모양, 제곱미터당 개수, 가로 최소, 가로 최대, 세로 최소, 세로 최대, 색 목록, 재질(lit|glow)]
# 모양: cone(풀·관목·뾰족한 것) rock(돌) chunk(잔해 덩어리) log(통나무) bone(뼈) dot(꽃·반짝임)
const DECOR := {
	"forest": [
		["cone", 0.085, 0.28, 0.5, 0.5, 1.1, [Color(0.3, 0.5, 0.15), Color(0.2, 0.4, 0.13), Color(0.14, 0.28, 0.1)], "lit"],
		["rock", 0.012, 0.4, 1.0, 0.3, 0.7, [Color(0.34, 0.37, 0.3), Color(0.28, 0.3, 0.25)], "lit"],
		["log", 0.0032, 0.3, 0.5, 2.0, 3.6, [Color(0.3, 0.2, 0.12), Color(0.24, 0.17, 0.11)], "lit"],
	],
	"field": [
		["cone", 0.1, 0.25, 0.45, 0.6, 1.3, [Color(0.62, 0.55, 0.2), Color(0.5, 0.5, 0.18), Color(0.4, 0.45, 0.16)], "lit"],
		["dot", 0.014, 0.12, 0.2, 0.12, 0.2, [Color(0.9, 0.35, 0.5), Color(0.95, 0.9, 0.5), Color(0.62, 0.5, 0.95)], "lit"],
		["rock", 0.004, 0.3, 0.7, 0.25, 0.5, [Color(0.5, 0.46, 0.36)], "lit"],
	],
	"quarry": [
		["rock", 0.03, 0.4, 1.5, 0.35, 1.0, [Color(0.55, 0.48, 0.38), Color(0.3, 0.28, 0.26), Color(0.62, 0.6, 0.54)], "lit"],
		["chunk", 0.01, 0.3, 0.9, 0.3, 0.8, [Color(0.5, 0.46, 0.4), Color(0.36, 0.33, 0.3)], "lit"],
		["cone", 0.012, 0.3, 0.45, 0.4, 0.8, [Color(0.5, 0.45, 0.25)], "lit"],
	],
	"mine": [
		["rock", 0.034, 0.35, 1.2, 0.3, 0.9, [Color(0.2, 0.18, 0.2), Color(0.28, 0.25, 0.27), Color(0.15, 0.13, 0.15)], "lit"],
		["cone", 0.008, 0.3, 0.5, 0.9, 2.2, [Color(0.22, 0.2, 0.24)], "lit"],
		["dot", 0.012, 0.14, 0.26, 0.14, 0.26, [Color(0.3, 0.3, 0.36), Color(0.4, 0.36, 0.3)], "lit"],
	],
	"ruins": [
		["chunk", 0.05, 0.3, 1.3, 0.2, 0.9, [Color(0.38, 0.36, 0.35), Color(0.26, 0.25, 0.27), Color(0.45, 0.3, 0.26)], "lit"],
		["cone", 0.012, 0.06, 0.12, 1.0, 2.6, [Color(0.3, 0.15, 0.1), Color(0.22, 0.12, 0.1)], "lit"],
		["cone", 0.02, 0.25, 0.4, 0.4, 0.8, [Color(0.3, 0.35, 0.18), Color(0.25, 0.3, 0.16)], "lit"],
	],
	"wasteland": [
		["cone", 0.03, 0.4, 0.8, 0.4, 0.8, [Color(0.5, 0.4, 0.2), Color(0.42, 0.32, 0.16)], "lit"],
		["rock", 0.016, 0.3, 1.0, 0.25, 0.7, [Color(0.55, 0.4, 0.28), Color(0.45, 0.33, 0.24)], "lit"],
		["bone", 0.008, 0.07, 0.11, 0.5, 1.1, [Color(0.85, 0.82, 0.7), Color(0.75, 0.72, 0.62)], "lit"],
	],
	"boss": [
		["cone", 0.05, 0.3, 0.6, 1.4, 3.4, [Color(0.35, 0.05, 0.06), Color(0.22, 0.04, 0.06)], "lit"],
		["bone", 0.03, 0.08, 0.13, 0.6, 1.4, [Color(0.7, 0.65, 0.6)], "lit"],
		["chunk", 0.03, 0.3, 0.9, 0.3, 0.8, [Color(0.15, 0.1, 0.12), Color(0.24, 0.12, 0.12)], "lit"],
		["dot", 0.03, 0.14, 0.26, 0.14, 0.26, [Color(0.3, 0.07, 0.08), Color(0.4, 0.12, 0.1)], "lit"],
	],
}
# 구역 밖(들판): 성긴 풀과 자갈. [모양, 개수, 가로 최소, 최대, 세로 최소, 최대, 색 목록, 재질]
const WILD := [
	["cone", 340, 0.2, 0.4, 0.3, 0.7, [Color(0.4, 0.34, 0.2), Color(0.34, 0.3, 0.18), Color(0.3, 0.36, 0.18)], "lit"],
	["rock", 180, 0.3, 0.7, 0.2, 0.45, [Color(0.42, 0.38, 0.32), Color(0.34, 0.32, 0.3)], "lit"],
]
const CAR_TINTS := [Color(0.55, 0.28, 0.18), Color(0.28, 0.36, 0.5), Color(0.62, 0.6, 0.56), Color(0.32, 0.36, 0.22), Color(0.42, 0.18, 0.16)]

var world: Node3D
var _rng := RandomNumberGenerator.new()
var _lanes: Array = [] # 레인마다 PackedVector2Array
var _circles: Array = []
var _lit: StandardMaterial3D
var _glow: StandardMaterial3D
var _meshes := {}
var _groups := {} # "모양|재질" -> {"xf": [], "col": []}
var _core := Vector2.ZERO
var _keep_r := 17.0
var _half := 200.0

func build(w: Node3D) -> void:
	world = w
	_rng.seed = 7351
	_half = float(GameData.map.half)
	_core = Vector2(float(GameData.map.core.x), float(GameData.map.core.z))
	_keep_r = float(GameData.map.buildRadius) + 3.0
	for l in GameData.map.lanes:
		var pts := PackedVector2Array()
		for p in l.waypoints:
			pts.append(Vector2(float(p.x), float(p.z)))
		_lanes.append(pts)
	_circles = GameData.models.obstacles.circles
	_make_materials()
	for z in GameData.map.zones:
		var kind: String = z.kind
		if not DECOR.has(kind):
			continue
		var zc := Vector2(float(z.x), float(z.z))
		var zr: float = float(z.r)
		for e in DECOR[kind]:
			_scatter_disc(zc, zr, e)
	_scatter_wild()
	_commit_groups()
	_place_wrecks()

func _make_materials() -> void:
	_lit = StandardMaterial3D.new()
	_lit.vertex_color_use_as_albedo = true
	_lit.cull_mode = BaseMaterial3D.CULL_DISABLED
	_lit.roughness = 1.0
	_lit.metallic_specular = 0.0
	_glow = StandardMaterial3D.new()
	_glow.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	_glow.vertex_color_use_as_albedo = true
	_glow.cull_mode = BaseMaterial3D.CULL_DISABLED

# ── 배치 ─────────────────────────────────────────────────────────────

func _dist_lane(p: Vector2) -> float:
	var best := INF
	for pts in _lanes:
		for i in range(1, pts.size()):
			var q := Geometry2D.get_closest_point_to_segment(p, pts[i - 1], pts[i])
			best = minf(best, q.distance_to(p))
	return best

func _in_obstacle(p: Vector2, pad: float) -> bool:
	for c in _circles:
		var dx: float = p.x - float(c[0])
		var dz: float = p.y - float(c[1])
		var rr: float = float(c[2]) + pad
		if dx * dx + dz * dz < rr * rr:
			return true
	return false

func _free_spot(p: Vector2, check_obstacles: bool) -> bool:
	if absf(p.x) > _half - 4.0 or absf(p.y) > _half - 4.0:
		return false
	if p.distance_to(_core) < _keep_r:
		return false
	if _dist_lane(p) < KEEP_LANE:
		return false
	if check_obstacles and _in_obstacle(p, 0.3):
		return false
	return true

func _scatter_disc(zc: Vector2, zr: float, e: Array) -> void:
	var shape: String = e[0]
	var n: int = int(PI * zr * zr * float(e[1]))
	var cols: Array = e[6]
	var check := shape != "cone" and shape != "dot" and shape != "bone"
	for i in n:
		var a := _rng.randf() * TAU
		var d := zr * sqrt(_rng.randf())
		if _rng.randf() < pow(d / zr, 3.0) * 0.7: # 가장자리로 갈수록 성기게
			continue
		var p := zc + Vector2(cos(a), sin(a)) * d
		if not _free_spot(p, check):
			continue
		var wd := _rng.randf_range(float(e[2]), float(e[3]))
		var ht := _rng.randf_range(float(e[4]), float(e[5]))
		_add(shape, e[7], p, wd, ht, cols[_rng.randi() % cols.size()])

func _scatter_wild() -> void:
	for e in WILD:
		var shape: String = e[0]
		var cols: Array = e[6]
		for i in int(e[1]):
			var p := Vector2(_rng.randf_range(-_half + 8.0, _half - 8.0), _rng.randf_range(-_half + 8.0, _half - 8.0))
			if not _free_spot(p, shape == "rock"):
				continue
			_add(shape, e[7], p, _rng.randf_range(float(e[2]), float(e[3])), _rng.randf_range(float(e[4]), float(e[5])), cols[_rng.randi() % cols.size()])

func _add(shape: String, mat: String, p: Vector2, wd: float, ht: float, col: Color) -> void:
	var y: float = world.ground_y(p.x, p.y)
	var yaw := _rng.randf() * TAU
	var b := Basis(Vector3.UP, yaw)
	var pos := Vector3(p.x, y, p.y)
	match shape:
		"cone":
			b = b * Basis.from_scale(Vector3(wd, ht, wd))
			pos.y += ht * 0.5 - 0.03
		"rock":
			b = b * Basis.from_euler(Vector3(_rng.randf_range(-0.25, 0.25), 0.0, _rng.randf_range(-0.25, 0.25)))
			b = b * Basis.from_scale(Vector3(wd, ht, wd * _rng.randf_range(0.7, 1.2)))
			pos.y += ht * 0.5 - ht * 0.28 # 땅에 반쯤 묻힌다
		"chunk":
			b = b * Basis.from_euler(Vector3(_rng.randf_range(-0.5, 0.5), 0.0, _rng.randf_range(-0.5, 0.5)))
			b = b * Basis.from_scale(Vector3(wd, ht, wd * _rng.randf_range(0.6, 1.3)))
			pos.y += ht * 0.3
		"log":
			# 원통을 눕힌다: 가로 = 굵기, 세로 = 길이
			b = b * Basis(Vector3(0, 0, 1), PI * 0.5) * Basis.from_scale(Vector3(wd, ht, wd))
			pos.y += wd * 0.5 - 0.05
		"bone":
			b = b * Basis.from_euler(Vector3(0.0, 0.0, _rng.randf_range(-0.2, 0.2))) * Basis.from_scale(Vector3(wd, wd, ht))
			pos.y += wd * 0.6
		_: # dot
			b = b * Basis.from_scale(Vector3(wd, wd, wd))
			pos.y += wd * 0.5 + 0.12
	var key := shape + "|" + mat
	if not _groups.has(key):
		_groups[key] = {"shape": shape, "mat": mat, "xf": [], "col": []}
	var g: Dictionary = _groups[key]
	# 색에 약간의 밝기 편차를 줘서 같은 색이 판박이로 보이지 않게
	var v := _rng.randf_range(0.88, 1.12)
	(g.xf as Array).append(Transform3D(b, pos))
	(g.col as Array).append(Color(col.r * v, col.g * v, col.b * v, 1.0))

func _mesh_for(shape: String) -> Mesh:
	if _meshes.has(shape):
		return _meshes[shape]
	var m: Mesh
	match shape:
		"cone": # 풀·관목·뾰족한 것: 4각 뿔 (높이 1, 지름 1)
			var c := CylinderMesh.new()
			c.top_radius = 0.0
			c.bottom_radius = 0.5
			c.height = 1.0
			c.radial_segments = 4
			c.rings = 1
			c.cap_bottom = false
			m = c
		"rock", "dot":
			var s := SphereMesh.new()
			s.radius = 0.5
			s.height = 1.0
			s.radial_segments = 6 if shape == "rock" else 5
			s.rings = 3
			m = s
		"log": # 통나무: 길이 1(세로축), 지름 1
			var c := CylinderMesh.new()
			c.top_radius = 0.5
			c.bottom_radius = 0.5
			c.height = 1.0
			c.radial_segments = 7
			c.rings = 1
			m = c
		_: # chunk, bone
			var b := BoxMesh.new()
			b.size = Vector3.ONE
			m = b
	_meshes[shape] = m
	return m

func _commit_groups() -> void:
	for key in _groups:
		var g: Dictionary = _groups[key]
		var xf: Array = g.xf
		if xf.is_empty():
			continue
		var mm := MultiMesh.new()
		mm.transform_format = MultiMesh.TRANSFORM_3D
		mm.use_colors = true
		mm.mesh = _mesh_for(g.shape)
		mm.instance_count = xf.size()
		for i in xf.size():
			mm.set_instance_transform(i, xf[i])
			mm.set_instance_color(i, (g.col as Array)[i])
		var mi := MultiMeshInstance3D.new()
		mi.name = "scatter_" + str(key).replace("|", "_")
		mi.multimesh = mm
		mi.material_override = _glow if g.mat == "glow" else _lit
		mi.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
		mi.extra_cull_margin = 10.0
		add_child(mi)

# ── 폐차 ─────────────────────────────────────────────────────────────

## 정점색이 든 폐차 하나(차체·지붕·바퀴). 인스턴스 색이 차체 색조를 정한다.
func _car_mesh() -> ArrayMesh:
	var st := SurfaceTool.new()
	st.begin(Mesh.PRIMITIVE_TRIANGLES)
	_box(st, Vector3(0, 0.55, 0), Vector3(4.2, 0.7, 1.8), Color(1, 1, 1))
	_box(st, Vector3(-0.3, 1.15, 0), Vector3(2.1, 0.55, 1.6), Color(0.55, 0.58, 0.6))
	_box(st, Vector3(1.5, 0.95, 0), Vector3(0.9, 0.12, 1.7), Color(0.9, 0.9, 0.9))
	for sx in [-1.4, 1.4]:
		for sz in [-0.95, 0.95]:
			_box(st, Vector3(sx, 0.32, sz), Vector3(0.7, 0.64, 0.24), Color(0.09, 0.09, 0.09))
	return st.commit()

static func _box(st: SurfaceTool, c: Vector3, s: Vector3, col: Color) -> void:
	var h := s * 0.5
	# [법선, u, v] (u x v = 법선). Godot 앞면은 시계 방향이라 BL -> TR -> BR, BL -> TL -> TR 순서로 낸다
	var faces := [
		[Vector3(1, 0, 0), Vector3(0, 1, 0), Vector3(0, 0, 1)],
		[Vector3(-1, 0, 0), Vector3(0, 0, 1), Vector3(0, 1, 0)],
		[Vector3(0, 1, 0), Vector3(0, 0, 1), Vector3(1, 0, 0)],
		[Vector3(0, -1, 0), Vector3(1, 0, 0), Vector3(0, 0, 1)],
		[Vector3(0, 0, 1), Vector3(1, 0, 0), Vector3(0, 1, 0)],
		[Vector3(0, 0, -1), Vector3(0, 1, 0), Vector3(1, 0, 0)],
	]
	var order := [[-1, -1], [1, 1], [1, -1], [-1, -1], [-1, 1], [1, 1]]
	for f in faces:
		var n: Vector3 = f[0]
		var u: Vector3 = f[1]
		var v: Vector3 = f[2]
		for o in order:
			var p: Vector3 = c + (n + u * float(o[0]) + v * float(o[1])) * h
			st.set_normal(n)
			st.set_color(col)
			st.add_vertex(p)

func _place_wrecks() -> void:
	var spots: Array = [] # [위치, 방향]
	# 길가: 레인마다 2~3대, 중심선에서 5~8m 떨어진 곳 (길을 막지 않는다)
	for pts in _lanes:
		var total := 0.0
		for i in range(1, pts.size()):
			total += pts[i].distance_to(pts[i - 1])
		for k in 3:
			var at := total * _rng.randf_range(0.25, 0.92)
			var acc := 0.0
			for i in range(1, pts.size()):
				var seg: float = pts[i].distance_to(pts[i - 1])
				if acc + seg >= at:
					var dir: Vector2 = (pts[i] - pts[i - 1]).normalized()
					var side := Vector2(-dir.y, dir.x) * (1.0 if _rng.randf() < 0.5 else -1.0)
					var p: Vector2 = pts[i - 1] + dir * (at - acc) + side * _rng.randf_range(5.0, 8.0)
					spots.append([p, atan2(dir.y, dir.x) + _rng.randf_range(-0.5, 0.5)])
					break
				acc += seg
	# 폐허·황무지 구역 안
	for z in GameData.map.zones:
		if z.kind != "ruins" and z.kind != "wasteland":
			continue
		for k in 3:
			var a := _rng.randf() * TAU
			var d: float = float(z.r) * sqrt(_rng.randf()) * 0.8
			spots.append([Vector2(float(z.x), float(z.z)) + Vector2(cos(a), sin(a)) * d, _rng.randf() * TAU])
	var mm_xf: Array = []
	var mm_col: Array = []
	var body := StaticBody3D.new()
	body.collision_layer = 1
	body.collision_mask = 0
	add_child(body)
	for s in spots:
		var p: Vector2 = s[0]
		var yaw: float = s[1]
		if absf(p.x) > _half - 6.0 or absf(p.y) > _half - 6.0 or p.distance_to(_core) < _keep_r + 2.0:
			continue
		if _dist_lane(p) < 4.2 or _in_obstacle(p, 2.2):
			continue
		var y: float = world.ground_y(p.x, p.y)
		var b := Basis(Vector3.UP, -yaw) * Basis.from_euler(Vector3(0, 0, _rng.randf_range(-0.12, 0.12)))
		mm_xf.append(Transform3D(b, Vector3(p.x, y + 0.05, p.y)))
		mm_col.append(CAR_TINTS[_rng.randi() % CAR_TINTS.size()])
		var cs := CollisionShape3D.new()
		var bs := BoxShape3D.new()
		bs.size = Vector3(4.2, 1.6, 1.8)
		cs.shape = bs
		cs.transform = Transform3D(Basis(Vector3.UP, -yaw), Vector3(p.x, y + 0.8, p.y))
		body.add_child(cs)
	if mm_xf.is_empty():
		return
	var mm := MultiMesh.new()
	mm.transform_format = MultiMesh.TRANSFORM_3D
	mm.use_colors = true
	mm.mesh = _car_mesh()
	mm.instance_count = mm_xf.size()
	for i in mm_xf.size():
		mm.set_instance_transform(i, mm_xf[i])
		mm.set_instance_color(i, mm_col[i])
	var mi := MultiMeshInstance3D.new()
	mi.name = "scatter_wrecks"
	mi.multimesh = mm
	mi.material_override = _lit
	mi.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_ON
	mi.extra_cull_margin = 10.0
	add_child(mi)
