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
const Fx := preload("res://scripts/fx.gd")
## 바닥 받침이 있는 건물 (바리케이드·함정은 모양이 길거나 납작해서 제외)
const PAD_KINDS := ["tower", "mgtower", "lab", "barracks", "shop"]
var _pad: MeshInstance3D
var _smoke: CPUParticles3D
var _fire: CPUParticles3D
var _fx_t := 0.0
var _dmg_state := 0
var _built := false
var _pop_tw: Tween
static var _pad_mat: StandardMaterial3D

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
	_build_pad()
	aim_yaw = yaw
	_built = true

static var _lib: Node

static func library() -> Node:
	if _lib == null:
		_lib = (load("res://assets/models/buildings.glb") as PackedScene).instantiate()
		_ruinize(_lib)
	return _lib

## 폐허 분위기: 핵(core_*)을 뺀 모든 건물 재질에서 불빛(발광)을 끄고 창은 어두운 구멍으로, 나머지는 그을음·이끼빛으로 낡게.
static func _ruinize(lib: Node) -> void:
	var core_mats := {}
	for ch in lib.get_children():
		if str(ch.name).begins_with("core_"):
			for mi in ch.find_children("*", "MeshInstance3D", true, false):
				var cm: Mesh = (mi as MeshInstance3D).mesh
				for i in cm.get_surface_count():
					core_mats[cm.surface_get_material(i)] = true
	var done := {}
	for ch in lib.get_children():
		if str(ch.name).begins_with("core_"):
			continue
		for mi in ch.find_children("*", "MeshInstance3D", true, false):
			var m: Mesh = (mi as MeshInstance3D).mesh
			if m == null:
				continue
			for i in m.get_surface_count():
				var mat := m.surface_get_material(i)
				if not mat is BaseMaterial3D or core_mats.has(mat) or done.has(mat):
					continue
				done[mat] = true
				var bm := mat as BaseMaterial3D
				if bm.emission_enabled or str(bm.resource_name).begins_with("glow"):
					bm.emission_enabled = false
					bm.albedo_texture = null
					bm.albedo_color = Color(0.035, 0.035, 0.04) # 꺼진 창·구멍
				else:
					var c := bm.albedo_color
					var g := (c.r + c.g + c.b) / 3.0
					c = c.lerp(Color(g, g, g), 0.35) # 색을 바랜다
					bm.albedo_color = (c * Color(0.78, 0.76, 0.7)).lerp(Color(0.2, 0.2, 0.15), 0.18) # 그을음 + 이끼빛

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
	_pop_in(not _built)

func set_level(lv: int) -> void:
	level = lv
	_build_model()

## 설치(처음)·강화 때 땅에서 솟아오르는 연출: 납작하게 시작해 살짝 튀어 오른 뒤 자리를 잡는다. 충돌은 그대로.
func _pop_in(first: bool) -> void:
	if model == null or not is_inside_tree():
		return
	var from := Vector3(0.7, 0.04, 0.7) if first else Vector3(0.88, 0.62, 0.88)
	model.scale = from
	if _pop_tw and _pop_tw.is_valid():
		_pop_tw.kill()
	var tw := create_tween()
	_pop_tw = tw
	tw.tween_property(model, "scale", Vector3.ONE, 0.5 if first else 0.38).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	var p := get_parent()
	if first:
		Fx.dust(p, global_position, radius, Color(0.55, 0.5, 0.42, 0.5), 8 if kind == "trap" else 14)
	else:
		Fx.sparkle(p, global_position, radius, Color(0.55, 1.0, 0.75, 0.9))

## 탑·시설 밑에 어두운 콘크리트 받침: 흙색 땅과 색 대비가 생기고 비탈에서도 떠 보이지 않게 땅속으로 묻는다.
func _build_pad() -> void:
	if not kind in PAD_KINDS:
		return
	if _pad_mat == null:
		_pad_mat = StandardMaterial3D.new()
		_pad_mat.albedo_color = Color(0.2, 0.2, 0.21)
		_pad_mat.roughness = 1.0
		_pad_mat.metallic_specular = 0.0
	_pad = MeshInstance3D.new()
	var cm := CylinderMesh.new()
	cm.top_radius = radius * 0.92
	cm.bottom_radius = radius * 0.98
	cm.height = 0.5
	cm.radial_segments = 20
	cm.rings = 1
	_pad.mesh = cm
	_pad.material_override = _pad_mat
	_pad.position.y = -0.2
	_pad.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	add_child(_pad)
	if kind in ["lab", "barracks", "shop"]:
		_build_rubble()

static var _rubble_mesh: BoxMesh
static var _rubble_mat: StandardMaterial3D

## 시설 둘레의 무너진 잔해 더미 (위치는 건물 좌표로 정해져 늘 같다). 모양만 있고 충돌·빛은 없다.
func _build_rubble() -> void:
	if _rubble_mesh == null:
		_rubble_mesh = BoxMesh.new()
		_rubble_mesh.size = Vector3.ONE
		_rubble_mat = StandardMaterial3D.new()
		_rubble_mat.albedo_color = Color(0.3, 0.28, 0.26)
		_rubble_mat.roughness = 1.0
		_rubble_mat.metallic_specular = 0.0
	var rng := RandomNumberGenerator.new()
	rng.seed = int(absf(position.x) * 131.0 + absf(position.z) * 71.0) + 5
	for i in 7:
		var a := rng.randf() * TAU
		var d := radius * rng.randf_range(0.75, 1.25)
		var mi := MeshInstance3D.new()
		mi.mesh = _rubble_mesh
		mi.material_override = _rubble_mat
		var sz := rng.randf_range(0.25, 0.7)
		mi.scale = Vector3(sz * rng.randf_range(0.8, 1.6), sz * rng.randf_range(0.4, 0.9), sz)
		mi.rotation = Vector3(rng.randf_range(-0.4, 0.4), rng.randf() * TAU, rng.randf_range(-0.4, 0.4))
		mi.position = Vector3(cos(a) * d, sz * 0.15, sin(a) * d)
		mi.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
		add_child(mi)

func take_damage(dmg: float) -> void:
	if dead or dmg <= 0.0:
		return
	hp = maxf(0.0, hp - dmg)
	_flash = 0.12
	_set_flash(true)
	if hp <= 0.0:
		destroy()
	elif def.has("turret"):
		game.base.persist_turrets(false)

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
	Sfx.play("destroyed", global_position)
	game.hazards._blast(global_position, radius * 2.0, Color(0.8, 0.5, 0.3))
	var p := get_parent()
	if kind != "trap":
		Fx.debris(p, global_position, radius, Color(0.36, 0.3, 0.25), 14)
		Fx.dust(p, global_position, radius, Color(0.3, 0.27, 0.24, 0.55), 12)
		Fx.scorch(p, global_position, radius)
	queue_free()

## 철거(환급)할 때: 폭발 없이 먼지와 작은 파편만. base.gd demolish 가 부른다.
func fx_demolish() -> void:
	var p := get_parent()
	Fx.dust(p, global_position, radius, Color(0.55, 0.5, 0.42, 0.5), 12)
	if kind != "trap":
		Fx.debris(p, global_position, radius, Color(0.45, 0.4, 0.34), 7)

## 체력이 줄면 연기(50% 이하), 불꽃(25% 이하). 수리하면 다시 꺼진다. 체력은 밖에서 바로 바뀌므로 0.4초마다 확인한다.
func _sync_damage_fx() -> void:
	if kind == "trap":
		return
	var r := hp / maxf(max_hp, 1.0)
	var st := 0
	if r < 0.25:
		st = 2
	elif r < 0.5:
		st = 1
	if st == _dmg_state:
		return
	_dmg_state = st
	var top := Vector3(0, float(def.height) * 0.85, 0)
	if st >= 1 and _smoke == null:
		_smoke = Fx.smoke_emitter(self, top)
	if _smoke:
		_smoke.emitting = st >= 1
	if _smoke:
		_smoke.amount = 8 if st == 1 else 14 # 많이 다치면 연기만 짙어진다 (불꽃·빛은 없음)

func levels() -> Array:
	return def.turret.levels if def.has("turret") else []

func _physics_process(dt: float) -> void:
	if dead:
		return
	if _flash > 0.0:
		_flash -= dt
		_set_flash(_flash > 0.0)
		if kind != "trap" and model:
			model.position = Vector3(randf_range(-1.0, 1.0), 0.0, randf_range(-1.0, 1.0)) * 0.05 * maxf(_flash, 0.0) / 0.12
	elif model and model.position != Vector3.ZERO:
		model.position = Vector3.ZERO
	_fx_t += dt
	if _fx_t >= 0.4:
		_fx_t = 0.0
		_sync_damage_fx()
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
	var hit_any := false
	for z in game.zombies_root.get_children():
		if z.dead:
			continue
		var d := Vector2(z.global_position.x - global_position.x, z.global_position.z - global_position.z).length()
		if d > float(t.radius) + z.radius * 0.5:
			continue
		z.slow_mul = minf(z.slow_mul, float(t.slow))
		z.slow_t = 0.2
		hit_any = true
		if now:
			z.take_hit(float(t.dps) * 0.5 * (1.0 + float(game.meta.get("trapDpsMul", 0.0))), Vector3.ZERO, true) # 건물 피해는 기절시키지 않는다 (byAlly)
	if now and hit_any: # 웹의 pulse 이펙트: 좀비가 걸려 있을 때만 퍼지는 고리
		game.hazards.ring(global_position, float(t.radius), 0.4, Color(0.18, 0.9, 0.84))

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
	target.take_hit(float(lv.dmg) * (1.0 + float(game.meta.get("turretDmgMul", 0.0))) * (2.0 if crit else 1.0), (aim_pt - head.global_position).normalized(), true)
	game.tracer(head.global_position + Vector3(-sin(aim_yaw), 0.1, -cos(aim_yaw)) * 0.9, aim_pt, Color(1, 0.85, 0.5))
	ammo -= 1
	cooldown = float(lv.rate) * maxf(0.55, 1.0 - float(game.meta.get("turretRateMul", 0.0)))
	if ammo <= 0:
		game.toast(I18n.t("build.ammoOut", {"name": I18n.bld_name(kind)}))
		destroy()
	else:
		game.base.persist_turrets(false)
