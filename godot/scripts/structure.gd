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
var _flash := 0.0
var _mats: Array[StandardMaterial3D] = []
var _cols: Array[Color] = []

func _ready() -> void:
	def = GameData.buildings[kind]
	radius = def.radius
	max_hp = def.hp
	hp = max_hp
	if def.has("turret"):
		ammo = int(def.turret.ammo)
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
	_build_model()
	aim_yaw = game.rng.randf() * TAU

func _m(c: Color, metal := 0.0) -> StandardMaterial3D:
	var m := StandardMaterial3D.new()
	m.albedo_color = c
	m.metallic = metal
	m.roughness = 0.8
	_mats.append(m)
	_cols.append(c)
	return m

func _box(parent: Node3D, size: Vector3, pos: Vector3, m: Material) -> MeshInstance3D:
	var mi := MeshInstance3D.new()
	var b := BoxMesh.new()
	b.size = size
	mi.mesh = b
	mi.position = pos
	mi.material_override = m
	parent.add_child(mi)
	return mi

## Stand-ins for src/base/view/models.ts.
func _build_model() -> void:
	var wood := _m(Color(0.42, 0.3, 0.17))
	var metal := _m(Color(0.32, 0.34, 0.36), 0.6)
	match kind:
		"tower":
			for sx in [-0.6, 0.6]:
				for sz in [-0.6, 0.6]:
					_box(self, Vector3(0.18, 4.0, 0.18), Vector3(sx, 2.0, sz), wood)
			_box(self, Vector3(1.8, 0.25, 1.8), Vector3(0, 4.0, 0), wood)
			head = Node3D.new()
			head.position = Vector3(0, 4.45, 0)
			add_child(head)
			_box(head, Vector3(0.5, 0.5, 0.7), Vector3.ZERO, metal)
			_box(head, Vector3(0.1, 0.1, 0.9), Vector3(0, 0.05, -0.7), metal)
		"mgtower":
			_box(self, Vector3(1.6, 1.4, 1.6), Vector3(0, 0.7, 0), _m(Color(0.35, 0.36, 0.33)))
			head = Node3D.new()
			head.position = Vector3(0, 1.75, 0)
			add_child(head)
			_box(head, Vector3(0.8, 0.6, 0.9), Vector3.ZERO, metal)
			_box(head, Vector3(0.09, 0.09, 1.0), Vector3(-0.15, 0.05, -0.85), metal)
			_box(head, Vector3(0.09, 0.09, 1.0), Vector3(0.15, 0.05, -0.85), metal)
		"barricade":
			for i in 3:
				var plank := _box(self, Vector3(2.0, 0.3, 0.25), Vector3(0, 0.35 + i * 0.45, 0), wood)
				plank.rotation.z = 0.12 * (i - 1)
			_box(self, Vector3(0.2, 1.5, 0.3), Vector3(-0.8, 0.75, 0.05), wood)
			_box(self, Vector3(0.2, 1.5, 0.3), Vector3(0.8, 0.75, 0.05), wood)
		"trap":
			var plate := MeshInstance3D.new()
			var c := CylinderMesh.new()
			c.top_radius = float(def.trap.radius)
			c.bottom_radius = float(def.trap.radius)
			c.height = 0.06
			plate.mesh = c
			var g := _m(Color(0.25, 0.55, 0.9))
			g.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
			g.albedo_color.a = 0.28
			_cols[-1].a = 0.28
			plate.material_override = g
			plate.position.y = 0.04
			add_child(plate)
			_box(self, Vector3(0.9, 0.3, 0.9), Vector3(0, 0.15, 0), metal)
		_:
			_box(self, Vector3(radius * 1.8, def.height, radius * 1.8), Vector3(0, float(def.height) * 0.5, 0), wood)

func take_damage(dmg: float) -> void:
	if dead or dmg <= 0.0:
		return
	hp = maxf(0.0, hp - dmg)
	_flash = 0.12
	if hp <= 0.0:
		destroy()

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
		for i in _mats.size():
			_mats[i].albedo_color = _cols[i].lerp(Color(1, 0.4, 0.3, _cols[i].a), 0.6 if _flash > 0.0 else 0.0)
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
			z.take_hit(float(t.dps) * 0.5, Vector3.ZERO)

func _turret(dt: float) -> void:
	var lv: Dictionary = levels()[level - 1]
	var range_m: float = lv.range
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
	head.rotation.y = aim_yaw
	if cooldown > 0.0 or ammo <= 0 or absf(wrapf(want - aim_yaw, -PI, PI)) > 0.12:
		return
	var crit := game.rng.randf() < 0.1
	var aim_pt: Vector3 = target.global_position + Vector3(game.rng.randf_range(-0.2, 0.2), target.height * (0.45 + game.rng.randf() * 0.3), game.rng.randf_range(-0.2, 0.2))
	target.take_hit(float(lv.dmg) * (2.0 if crit else 1.0), (aim_pt - head.global_position).normalized())
	game.tracer(head.global_position + Vector3(-sin(aim_yaw), 0, -cos(aim_yaw)) * 0.7, aim_pt, Color(1, 0.85, 0.5))
	ammo -= 1
	cooldown = lv.rate
	if ammo <= 0:
		game.toast(I18n.t("build.ammoOut", {"name": I18n.bld_name(kind)}))
		destroy()
