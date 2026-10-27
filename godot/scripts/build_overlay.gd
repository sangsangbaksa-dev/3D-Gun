extends Node3D
## Port of src/base/view/overlay.ts: the teal build-zone ring and 2 m grid (only while building) and the
## zombie lane gates (three orange chevrons and two pillars with glowing caps) that are always visible.
## Visual only: it reads the map and the build mode and changes nothing in the game.

const GRID := 2.0
const TEAL := Color("2ee6d6")
const ORANGE := Color("ff8a2a")

var game: Node
var _grid: MeshInstance3D
var _ring: MeshInstance3D
var _grid_mat: StandardMaterial3D
var _ring_mat: StandardMaterial3D
var _gate_mat: StandardMaterial3D
var _t := 0.0

static func apply(g: Node) -> void:
	var o = (load("res://scripts/build_overlay.gd") as GDScript).new()
	o.game = g
	o.name = "BuildOverlay"
	g.add_child(o)

func _ready() -> void:
	var map: Dictionary = GameData.map
	var core := Vector2(float(map.core.x), float(map.core.z))
	var r := float(map.buildRadius)
	_grid_mat = _unshaded(Color(TEAL, 0.2))
	_ring_mat = _unshaded(Color(TEAL, 0.7))
	_gate_mat = _unshaded(Color(ORANGE, 0.22))
	_make_grid(core, r)
	_make_ring(core, r)
	for l in map.lanes:
		var gate := _lane_gate(l.waypoints, core, r)
		if not gate.is_empty():
			_make_gate(gate)
	_apply_visibility(false)

func _unshaded(c: Color) -> StandardMaterial3D:
	var m := StandardMaterial3D.new()
	m.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	m.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	m.cull_mode = BaseMaterial3D.CULL_DISABLED
	m.albedo_color = c
	m.no_depth_test = false
	return m

func _gy(x: float, z: float) -> float:
	return game.world.ground_y(x, z)

## 1 m segments so the grid follows the terrain.
func _make_grid(core: Vector2, r: float) -> void:
	var pts := PackedVector3Array()
	var lim := ceilf(r / GRID) * GRID
	var a := -lim
	while a <= lim:
		var b := -lim
		while b < lim:
			_seg(pts, core, r, core.x + a, core.y + b, core.x + a, core.y + b + 1.0)
			_seg(pts, core, r, core.x + b, core.y + a, core.x + b + 1.0, core.y + a)
			b += 1.0
		a += GRID
	var arr := []
	arr.resize(Mesh.ARRAY_MAX)
	arr[Mesh.ARRAY_VERTEX] = pts
	var mesh := ArrayMesh.new()
	mesh.add_surface_from_arrays(Mesh.PRIMITIVE_LINES, arr)
	_grid = MeshInstance3D.new()
	_grid.mesh = mesh
	_grid.material_override = _grid_mat
	_grid.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	add_child(_grid)

func _seg(pts: PackedVector3Array, core: Vector2, r: float, ax: float, az: float, bx: float, bz: float) -> void:
	if Vector2(ax, az).distance_to(core) > r or Vector2(bx, bz).distance_to(core) > r:
		return
	pts.append(Vector3(ax, _gy(ax, az) + 0.07, az))
	pts.append(Vector3(bx, _gy(bx, bz) + 0.07, bz))

func _make_ring(core: Vector2, r: float) -> void:
	var n := 120
	var verts := PackedVector3Array()
	var idx := PackedInt32Array()
	for i in n + 1:
		var ang := float(i) / n * TAU
		for rr in [r - 0.18, r + 0.18]:
			var x: float = core.x + cos(ang) * rr
			var z: float = core.y + sin(ang) * rr
			verts.append(Vector3(x, _gy(x, z) + 0.1, z))
		if i < n:
			idx.append_array(PackedInt32Array([i * 2, i * 2 + 1, i * 2 + 2, i * 2 + 1, i * 2 + 3, i * 2 + 2]))
	var arr := []
	arr.resize(Mesh.ARRAY_MAX)
	arr[Mesh.ARRAY_VERTEX] = verts
	arr[Mesh.ARRAY_INDEX] = idx
	var mesh := ArrayMesh.new()
	mesh.add_surface_from_arrays(Mesh.PRIMITIVE_TRIANGLES, arr)
	_ring = MeshInstance3D.new()
	_ring.mesh = mesh
	_ring.material_override = _ring_mat
	_ring.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	add_child(_ring)

## laneGate(): where the lane path enters the build zone, and the way it heads (toward the core).
func _lane_gate(pts: Array, core: Vector2, r: float) -> Dictionary:
	if pts.size() < 2:
		return {}
	for i in pts.size() - 1:
		var a := Vector2(float(pts[i].x), float(pts[i].z))
		var b := Vector2(float(pts[i + 1].x), float(pts[i + 1].z))
		var da := a.distance_to(core)
		var db := b.distance_to(core)
		if da > r and db <= r:
			var t := (da - r) / (da - db)
			var p := a + (b - a) * t
			var d := (b - a).normalized()
			return {"x": p.x, "z": p.y, "dx": d.x, "dz": d.y}
	# 경로 전체가 구역 밖이면 마지막 점에서 핵을 향한다
	var last := Vector2(float(pts[-1].x), float(pts[-1].z))
	var to_core := (core - last).normalized()
	return {"x": last.x, "z": last.y, "dx": to_core.x, "dz": to_core.y}

func _make_gate(g: Dictionary) -> void:
	var grp := Node3D.new()
	grp.position = Vector3(g.x, _gy(g.x, g.z), g.z)
	grp.rotation.y = atan2(-float(g.dx), -float(g.dz))
	add_child(grp)
	# 안쪽 화살표 3개
	var poly := PackedVector2Array([Vector2(0, 0.9), Vector2(1.2, -0.5), Vector2(0.55, -0.5), Vector2(0, 0.25), Vector2(-0.55, -0.5), Vector2(-1.2, -0.5)])
	var tri := Geometry2D.triangulate_polygon(poly)
	var verts := PackedVector3Array()
	for p in poly:
		verts.append(Vector3(p.x, 0.0, p.y))
	var arr := []
	arr.resize(Mesh.ARRAY_MAX)
	arr[Mesh.ARRAY_VERTEX] = verts
	arr[Mesh.ARRAY_INDEX] = tri
	var arrow := ArrayMesh.new()
	arrow.add_surface_from_arrays(Mesh.PRIMITIVE_TRIANGLES, arr)
	for i in 3:
		var m := MeshInstance3D.new()
		m.mesh = arrow
		m.material_override = _gate_mat
		m.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
		m.position = Vector3(0, 0.12, 1.6 - i * 1.5 + 2.5)
		grp.add_child(m)
	# 양옆 기둥과 주황 구슬
	var pillar := BoxMesh.new()
	pillar.size = Vector3(0.35, 2.2, 0.35)
	var pmat := StandardMaterial3D.new()
	pmat.albedo_color = Color("4a525c")
	var cap := SphereMesh.new()
	cap.radius = 0.28
	cap.height = 0.56
	cap.radial_segments = 10
	cap.rings = 8
	var cmat := StandardMaterial3D.new()
	cmat.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	cmat.albedo_color = ORANGE
	for s in [-1.0, 1.0]:
		var p := MeshInstance3D.new()
		p.mesh = pillar
		p.material_override = pmat
		p.position = Vector3(s * 3.2, 1.1, 0)
		grp.add_child(p)
		var c := MeshInstance3D.new()
		c.mesh = cap
		c.material_override = cmat
		c.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
		c.position = Vector3(s * 3.2, 2.35, 0)
		grp.add_child(c)

func _apply_visibility(on: bool) -> void:
	_grid.visible = on
	_ring.visible = on

func _process(dt: float) -> void:
	_t += dt
	var building: bool = game.base.building
	if _grid.visible != building:
		_apply_visibility(building)
	_gate_mat.albedo_color.a = (0.55 + 0.35 * sin(_t * 4.0)) if building else 0.22
	_ring_mat.albedo_color.a = 0.45 + 0.25 * sin(_t * 2.0)
