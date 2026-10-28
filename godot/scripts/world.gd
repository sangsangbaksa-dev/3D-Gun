extends Node3D
## The map. The look is world.glb, exported straight from the web game's worldview.ts + scenery.ts
## (godot/tools/models), so terrain, roads, buildings, landmarks, rocks, trees and mountains match the original.
## Collisions come from the same data: the baked terrainY heightmap plus the web game's obstacle circles and boxes.

var half: float
var _step: float
var _size: int
var _origin: float
var _h: PackedFloat32Array

const ZONE_TINT := {
	"forest": Color(0.2, 0.3, 0.12), "quarry": Color(0.42, 0.4, 0.36), "mine": Color(0.22, 0.2, 0.2),
	"field": Color(0.38, 0.38, 0.14), "ruins": Color(0.26, 0.22, 0.2), "wasteland": Color(0.45, 0.33, 0.18),
	"boss": Color(0.3, 0.06, 0.05), "base": Color(0.3, 0.27, 0.22),
}

func _ready() -> void:
	half = GameData.map.half
	_load_terrain()
	var vis: Node3D = (load("res://assets/models/world.glb") as PackedScene).instantiate()
	add_child(vis)
	# 재질은 look.gd 가 웹의 람베르트처럼 바꾼다. 지형 정점색은 glb 에 선형값으로 들어 있는데
	# Compatibility 렌더러는 색을 sRGB 공간에서 계산하므로 sRGB 로 되돌려야 웹과 같은 밝기가 된다
	for mi in vis.find_children("*", "MeshInstance3D", true, false):
		_vertex_colors_to_srgb(mi)
	_unlight(vis)
	_build_collision()

## 폐허 분위기: 맵의 발광 재질(창 불빛, 붉은·청록 불빛)을 모두 끄고 어두운 구멍처럼 만든다. 유일한 빛은 핵뿐.
func _unlight(root: Node) -> void:
	var done := {}
	for mi in root.find_children("*", "MeshInstance3D", true, false):
		var m: Mesh = (mi as MeshInstance3D).mesh
		if m == null:
			continue
		for i in m.get_surface_count():
			var mat := m.surface_get_material(i)
			if mat is BaseMaterial3D and not done.has(mat):
				done[mat] = true
				var bm := mat as BaseMaterial3D
				if bm.emission_enabled:
					bm.emission_enabled = false
					bm.albedo_color = bm.albedo_color.lerp(Color(0.05, 0.05, 0.055), 0.75)

func _vertex_colors_to_srgb(mi: MeshInstance3D) -> void:
	var src := mi.mesh as ArrayMesh
	if src == null or not (src.surface_get_format(0) & Mesh.ARRAY_FORMAT_COLOR):
		return
	var out := ArrayMesh.new()
	for i in src.get_surface_count():
		var arr := src.surface_get_arrays(i)
		var mat := src.surface_get_material(i)
		var cols = arr[Mesh.ARRAY_COLOR]
		if cols is PackedColorArray and not (cols as PackedColorArray).is_empty():
			var pc := cols as PackedColorArray
			for k in pc.size():
				pc[k] = pc[k].linear_to_srgb()
			arr[Mesh.ARRAY_COLOR] = pc
		out.add_surface_from_arrays(src.surface_get_primitive_type(i), arr)
		out.surface_set_material(i, mat)
	mi.mesh = out

# ── 높이 ─────────────────────────────────────────────────────────────

func _load_terrain() -> void:
	var f := FileAccess.open("res://data/terrain.json", FileAccess.READ)
	var d: Dictionary = JSON.parse_string(f.get_as_text())
	_step = d.step
	_size = int(d.size)
	_origin = d.origin
	_h = PackedFloat32Array(d.heights)

## Ground height at (x, z), bilinear over the baked terrainY grid.
func ground_y(x: float, z: float) -> float:
	var fx := clampf((x - _origin) / _step, 0.0, _size - 1.001)
	var fz := clampf((z - _origin) / _step, 0.0, _size - 1.001)
	var i := int(fx)
	var j := int(fz)
	var tx := fx - i
	var tz := fz - j
	var a := _h[j * _size + i]
	var b := _h[j * _size + i + 1]
	var c := _h[(j + 1) * _size + i]
	var d := _h[(j + 1) * _size + i + 1]
	return lerpf(lerpf(a, b, tx), lerpf(c, d, tx), tz)

func _build_collision() -> void:
	var body := StaticBody3D.new()
	body.collision_layer = 1
	var cs := CollisionShape3D.new()
	var hm := HeightMapShape3D.new()
	hm.map_width = _size
	hm.map_depth = _size
	hm.map_data = _h
	cs.shape = hm
	cs.scale = Vector3(_step, 1, _step)
	body.add_child(cs)
	add_child(body)
	var obs: Dictionary = GameData.models.obstacles
	var solid := StaticBody3D.new()
	solid.collision_layer = 1
	add_child(solid)
	for c in obs.circles:
		var gy := ground_y(float(c[0]), float(c[1]))
		var sh := CylinderShape3D.new()
		sh.radius = maxf(0.2, float(c[2]))
		sh.height = 8.0
		var n := CollisionShape3D.new()
		n.shape = sh
		n.position = Vector3(float(c[0]), gy + 3.0, float(c[1]))
		solid.add_child(n)
	for b in obs.boxes:
		var gy := ground_y(float(b[0]), float(b[1]))
		var sh := BoxShape3D.new()
		sh.size = Vector3(float(b[2]) * 2.0, 8.0, float(b[3]) * 2.0)
		var n := CollisionShape3D.new()
		n.shape = sh
		n.position = Vector3(float(b[0]), gy + 3.0, float(b[1]))
		n.rotation.y = float(b[4])
		solid.add_child(n)

