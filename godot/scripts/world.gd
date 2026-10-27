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
	# 지형은 빛 반사(스페큘러)를 끈다: 낮은 해에서 기지 둘레가 주황 띠로 번쩍이던 문제
	for mi in vis.find_children("*", "MeshInstance3D", true, false):
		var m := (mi as MeshInstance3D).mesh.surface_get_material(0)
		if m is StandardMaterial3D:
			(m as StandardMaterial3D).metallic = 0.0
			(m as StandardMaterial3D).metallic_specular = 0.0
			(m as StandardMaterial3D).roughness = 1.0
			if (m as StandardMaterial3D).vertex_color_use_as_albedo:
				(m as StandardMaterial3D).albedo_color = Color(0.36, 0.42, 0.46) # 웹은 ACES 라 지형색을 2.2배 키워 둔 값. Godot 에서는 그대로면 흙길이 주황으로 번쩍인다
	for mi in vis.find_children("m0", "MeshInstance3D", true, false):
		_clean_base_pad(mi as MeshInstance3D)
	_build_collision()

## 기지 바닥의 꼭짓점 색에 흙길·어깨 색이 번져 주황 띠로 보이던 것을, 기지 한가운데 색으로 덮는다.
## (웹은 청록 하늘빛 조명이 가려 주지만 Godot 의 붉은 하늘빛에서는 그대로 드러난다)
func _clean_base_pad(mi: MeshInstance3D) -> void:
	var mesh := mi.mesh as ArrayMesh
	var arrays := mesh.surface_get_arrays(0)
	var verts: PackedVector3Array = arrays[Mesh.ARRAY_VERTEX]
	var cols: PackedColorArray = arrays[Mesh.ARRAY_COLOR]
	if cols.is_empty():
		return
	var sum := Color(0, 0, 0, 0)
	var n := 0
	for i in verts.size():
		if Vector2(verts[i].x, verts[i].z).length() < 6.0:
			sum += cols[i]
			n += 1
	if n == 0:
		return
	var pad := sum / float(n)
	pad = Color(minf(pad.r * 2.4, 0.9), minf(pad.g * 2.4, 0.9), minf(pad.b * 2.4, 0.9), 1.0)
	for i in verts.size():
		var r := Vector2(verts[i].x, verts[i].z).length()
		var w := 1.0 - smoothstep(11.0, 16.0, r)
		if w > 0.0:
			cols[i] = cols[i].lerp(pad, w)
	arrays[Mesh.ARRAY_COLOR] = cols
	var mat := mesh.surface_get_material(0)
	mesh.clear_surfaces()
	mesh.add_surface_from_arrays(Mesh.PRIMITIVE_TRIANGLES, arrays)
	mesh.surface_set_material(0, mat)

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

