extends StaticBody3D
## One placed building: watchtower, MG tower, barricade, slow trap (lab, barracks and shop come with allies).
## Port of the Building part of src/base/logic/base.ts: hp, turret aim and fire with limited durability, trap pulses.

signal destroyed(s: Node)

var kind := "tower"
var def: Dictionary
var game: Node
var level := 1
var hp: float
var max_hp: float
var ammo := 0
var radius: float
var dead := false
var cooldown := 0.0
var aim_yaw := 0.0
var pulse := 0.0
var head: Node3D
var yaw := 0.0
var model: Node3D
var _flash := 0.0
var _meshes: Array = []
static var _flash_mat: StandardMaterial3D

func _ready() -> void:
	def = GameData.buildings[kind]
	radius = def.radius
	max_hp = roundf(float(def.hp) * (1.0 + float(game.meta.get("turretHpMul", 0.0))) if def.has("turret") else float(def.hp))
	hp = max_hp
	if def.has("turret"):
		ammo = maxi(1, roundi(float(def.turret.ammo) * (1.0 + float(game.meta.get("turretAmmoMul", 0.0)))))
	collision_layer = 1 if kind != "trap" else 0 # 함정은 밟고 지나간다
	collision_mask = 0
	if kind != "trap":
		var cs := CollisionShape3D.new()
		var c := CylinderShape3D.new()
		c.radius = radius * 0.95
		c.height = def.height
		cs.shape = c
		cs.position.y = float(def.height) * 0.5
		add_child(cs)
	# 건물은 핵을 바라본다 (yawTo(core - b))
	var c: Vector3 = game.core.global_position
	yaw = atan2(-(c.x - position.x), -(c.z - position.z))
	_build_model()
	aim_yaw = yaw

static var _lib: Node

static func library() -> Node:
	if _lib == null:
		_lib = (load("res://assets/models/buildings.glb") as PackedScene).instantiate()
	return _lib

## The web game's buildModel(kind, level) (buildings.glb: b_<kind>_<level>). The glb has ~90 loose meshes per tower,
## so each model is merged once into one mesh per material (the turret head stays separate so it can turn).
static var _merged := {}

static func make_model(kind: String, level: int) -> Node3D:
	var lib := library()
	var name := "b_%s_%d" % [kind, level]
	if not lib.has_node(name):
		name = "b_%s_1" % kind
	if not _merged.has(name):
		_merged[name] = _merge(lib.get_node(name))
	var m: Node3D = _merged[name].duplicate()
	m.name = "model"
	return m

static func _merge(src: Node3D) -> Node3D:
	var out := Node3D.new()
	var head := src.find_child("head-*", true, false) as Node3D
	var tools := {} # material id -> SurfaceTool
	var mats := {}
	for mi in src.find_children("*", "MeshInstance3D", true, false):
		if head and (head == mi or head.is_ancestor_of(mi)):
			continue
		var xf := Transform3D.IDENTITY
		var n: Node = mi
		while n != src:
			xf = (n as Node3D).transform * xf
			n = n.get_parent()
		var mesh := (mi as MeshInstance3D).mesh
		for i in mesh.get_surface_count():
			var mat := mesh.surface_get_material(i)
			var key := mat.get_instance_id() if mat else 0
			if not tools.has(key):
				var st := SurfaceTool.new()
				st.begin(Mesh.PRIMITIVE_TRIANGLES)
				tools[key] = st
				mats[key] = mat
			(tools[key] as SurfaceTool).append_from(mesh, i, xf)
	var merged := ArrayMesh.new()
	for key in tools:
		(tools[key] as SurfaceTool).commit(merged)
		merged.surface_set_material(merged.get_surface_count() - 1, mats[key])
	var body := MeshInstance3D.new()
	body.name = "body"
	body.mesh = merged
	out.add_child(body)
	if head:
		var h: Node3D = head.duplicate()
		var xf := Transform3D.IDENTITY
		var n: Node = head
		while n != src:
			xf = (n as Node3D).transform * xf
			n = n.get_parent()
		h.transform = xf
		out.add_child(h)
	return out

func _build_model() -> void:
	if model:
		model.queue_free()
	model = make_model(kind, level)
	model.rotation.y = yaw
	add_child(model)
	head = model.find_child("head-*", true, false)
	_meshes.clear()
	for mi in model.find_children("*", "MeshInstance3D", true, false):
		_meshes.append(mi)
		if kind == "trap":
			mi.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF

func set_level(lv: int) -> void:
	level = lv
	_build_model()

func take_damage(dmg: float) -> void:
	if dead or dmg <= 0.0:
		return
	hp = maxf(0.0, hp - dmg)
	_flash = 0.12
	_set_flash(true)
	if hp <= 0.0:
		destroy()

## Hit flash: a red overlay on every mesh (the glb materials are shared, so they are not touched).
func _set_flash(on: bool) -> void:
	if _flash_mat == null:
		_flash_mat = StandardMaterial3D.new()
		_flash_mat.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
		_flash_mat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
		_flash_mat.albedo_color = Color(1, 0.3, 0.2, 0.45)
	for mi in _meshes:
		mi.material_overlay = _flash_mat if on else null

func destroy() -> void:
	if dead:
		return
	dead = true
	destroyed.emit(self)
	game.hazards._blast(global_position, radius * 2.0, Color(0.8, 0.5, 0.3))
	queue_free()

func levels() -> Array:
	return def.turret.levels if def.has("turret") else []

func _physics_process(dt: float) -> void:
	if dead:
		return
	if _flash > 0.0:
		_flash -= dt
		_set_flash(_flash > 0.0)
	cooldown = maxf(0.0, cooldown - dt)
	if def.has("trap"):
		_trap(dt)
	elif def.has("turret"):
		_turret(dt)

func _trap(dt: float) -> void:
	var t: Dictionary = def.trap
	pulse -= dt
	var now := pulse <= 0.0
	if now:
		pulse = 0.5
	for z in game.zombies_root.get_children():
		if z.dead:
			continue
		var d := Vector2(z.global_position.x - global_position.x, z.global_position.z - global_position.z).length()
		if d > float(t.radius) + z.radius * 0.5:
			continue
		z.slow_mul = minf(z.slow_mul, float(t.slow))
		z.slow_t = 0.2
		if now:
			z.take_hit(float(t.dps) * 0.5 * (1.0 + float(game.meta.get("trapDpsMul", 0.0))), Vector3.ZERO)

func _turret(dt: float) -> void:
	var lv: Dictionary = levels()[level - 1]
	var range_m: float = float(lv.range) * (1.0 + float(game.meta.get("turretRangeMul", 0.0)))
	var target: Node3D = null
	var bd := range_m
	for z in game.zombies_root.get_children():
		if z.dead:
			continue
		var d := Vector2(z.global_position.x - global_position.x, z.global_position.z - global_position.z).length()
		if d < bd:
			bd = d
			target = z
	if target == null:
		return
	var to := target.global_position - global_position
	var want := atan2(-to.x, -to.z) # yaw 0 = -z
	var diff := wrapf(want - aim_yaw, -PI, PI)
	aim_yaw += clampf(diff, -dt * 9.0, dt * 9.0)
	head.rotation.y = aim_yaw - yaw
	if cooldown > 0.0 or ammo <= 0 or absf(wrapf(want - aim_yaw, -PI, PI)) > 0.12:
		return
	var crit: bool = game.rng.randf() < 0.1
	var aim_pt: Vector3 = target.global_position + Vector3(game.rng.randf_range(-0.2, 0.2), target.height * (0.45 + game.rng.randf() * 0.3), game.rng.randf_range(-0.2, 0.2))
	target.take_hit(float(lv.dmg) * (1.0 + float(game.meta.get("turretDmgMul", 0.0))) * (2.0 if crit else 1.0), (aim_pt - head.global_position).normalized())
	game.tracer(head.global_position + Vector3(-sin(aim_yaw), 0.1, -cos(aim_yaw)) * 0.9, aim_pt, Color(1, 0.85, 0.5))
	ammo -= 1
	cooldown = float(lv.rate) * maxf(0.55, 1.0 - float(game.meta.get("turretRateMul", 0.0)))
	if ammo <= 0:
		game.toast(I18n.t("build.ammoOut", {"name": I18n.bld_name(kind)}))
		destroy()
