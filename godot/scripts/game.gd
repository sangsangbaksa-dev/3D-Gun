extends Node3D
## The 3D sortie: world, lanes, core, waves, coins, HUD and the death card.
## Waves port src/enemies/logic/director.ts (queue of lane groups, roster, elites, bosses).
## Buildings, allies and gathering come in later stages.

const ZombieScript := preload("res://scripts/zombie.gd")
const PlayerScript := preload("res://scripts/player.gd")
const ShopScript := preload("res://scripts/weapon_shop.gd")
const HazardsScript := preload("res://scripts/hazards.gd")
const CoreScript := preload("res://scripts/core.gd")
const PREP_TIME := 15.0 # 웹 게임은 60초(기지 건설 시간). 건설이 아직 없어 짧게. N 으로 바로 시작

var player: CharacterBody3D
var wave := 0
var phase := "prep" # prep / combat / ended
var queue: Array = [] # [{type, lane, elite}]
var boss_pending := {}
var boss_at := 0.0
var spawn_gap := 0.5
var alive := 0
var spawn_timer := 0.0
var prep_left := 5.0
var core: StaticBody3D
var core_dead := false
var hazards: Node3D
var boss: Node3D
var lose_reason := "player"
var kills := 0
var coins := 0
var rng := RandomNumberGenerator.new()

var hud: Control
var lbl_top: Label
var lbl_ammo: Label
var lbl_center: Label
var lbl_hint: Label
var lbl_gun: Label
var scope: Control
var shop: CanvasLayer
var hp_bar: ProgressBar
var core_bar: ProgressBar
var boss_bar: ProgressBar
var lbl_boss: Label
var lbl_toast: Label
var lbl_core: Label
var crosshair: Control
var hitmark := 0.0
var hurt_flash: ColorRect
var zombies_root: Node3D

func _ready() -> void:
	rng.randomize()
	hazards = HazardsScript.new()
	hazards.game = self
	add_child(hazards)
	_build_environment()
	_build_world()
	player = PlayerScript.new()
	var ps: Dictionary = GameData.map.playerStart
	player.position = Vector3(float(ps.x), 0.1, float(ps.z) + 3.0)
	player.rotation.y = PI # 핵을 등지고 바깥을 본다
	add_child(player)
	player.fired.connect(_on_fired)
	player.hurt.connect(_on_hurt)
	player.died.connect(_on_died)
	zombies_root = Node3D.new()
	add_child(zombies_root)
	_build_hud()
	I18n.locale_changed.connect(_refresh_hud)
	shop = ShopScript.new()
	shop.game = self
	add_child(shop)

# ── 월드 ─────────────────────────────────────────────────────────────

## Red dusk sky like the live "red" build (src/core/atmosphere.ts).
func _build_environment() -> void:
	var sky_mat := ProceduralSkyMaterial.new()
	sky_mat.sky_top_color = Color(0.32, 0.05, 0.06)
	sky_mat.sky_horizon_color = Color(0.85, 0.32, 0.18)
	sky_mat.ground_horizon_color = Color(0.4, 0.16, 0.1)
	sky_mat.ground_bottom_color = Color(0.08, 0.04, 0.03)
	sky_mat.sun_angle_max = 20.0
	var sky := Sky.new()
	sky.sky_material = sky_mat
	var env := Environment.new()
	env.background_mode = Environment.BG_SKY
	env.sky = sky
	env.ambient_light_source = Environment.AMBIENT_SOURCE_SKY
	env.ambient_light_energy = 0.5
	env.tonemap_mode = Environment.TONE_MAPPER_FILMIC
	env.fog_enabled = true
	env.fog_light_color = Color(0.4, 0.14, 0.1)
	env.fog_density = 0.006
	var we := WorldEnvironment.new()
	we.environment = env
	add_child(we)
	var sun := DirectionalLight3D.new()
	sun.light_color = Color(1.0, 0.72, 0.55)
	sun.light_energy = 1.1
	sun.rotation_degrees = Vector3(-28, -40, 0)
	sun.shadow_enabled = true
	sun.directional_shadow_max_distance = 80.0
	add_child(sun)

func _build_world() -> void:
	var half: float = GameData.map.half
	# 땅: 400m × 400m (MAP.half = 200), 잡음 텍스처로 흙/풀 얼룩
	var noise := FastNoiseLite.new()
	noise.frequency = 0.03
	var tex := NoiseTexture2D.new()
	tex.noise = noise
	tex.seamless = true
	var grad := Gradient.new()
	grad.set_color(0, Color(0.16, 0.12, 0.08))
	grad.set_color(1, Color(0.3, 0.27, 0.15))
	tex.color_ramp = grad
	var ground_mat := StandardMaterial3D.new()
	ground_mat.albedo_texture = tex
	ground_mat.uv1_scale = Vector3(48, 48, 1)
	ground_mat.roughness = 1.0
	var ground := _static_box(Vector3(half * 2, 1, half * 2), Vector3(0, -0.5, 0), ground_mat)
	ground.get_child(0).cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	# 가운데 핵 (기지 자리 표시). 기지 건설은 다음 슬라이스에서
	var core_mat := StandardMaterial3D.new()
	core_mat.albedo_color = Color(0.1, 0.45, 0.45)
	core_mat.metallic = 0.5
	core_mat.emission_enabled = true
	core_mat.emission = Color(0.18, 0.9, 0.84)
	core_mat.emission_energy_multiplier = 0.35
	core = CoreScript.new()
	core.setup(GameData.core)
	core.destroyed.connect(_on_core_destroyed)
	_static_cylinder(core.radius, float(GameData.core.height), Vector3(0, float(GameData.core.height) * 0.5, 0), core_mat, core)
	_build_lanes()
	var core_light := OmniLight3D.new()
	core_light.light_color = Color(0.3, 1, 0.9)
	core_light.omni_range = 14.0
	core_light.light_energy = 1.5
	core_light.position = Vector3(0, 4.5, 0)
	add_child(core_light)
	# 엄폐물: 상자, 무너진 벽, 폐차 덩어리를 흩어 둔다 (data/map.ts 의 장애물 자리 대신 임시 배치)
	var crate := StandardMaterial3D.new()
	crate.albedo_color = Color(0.42, 0.3, 0.17)
	var concrete := StandardMaterial3D.new()
	concrete.albedo_color = Color(0.45, 0.43, 0.42)
	var rust := StandardMaterial3D.new()
	rust.albedo_color = Color(0.45, 0.2, 0.1)
	rust.metallic = 0.4
	var layout := RandomNumberGenerator.new()
	layout.seed = 20240607 # GATHER_LAYOUT.seed 와 같은 씨앗
	var placed := 0
	while placed < 150:
		var a := layout.randf() * TAU
		var r := layout.randf_range(9.0, half - 10.0)
		var p := Vector3(cos(a) * r, 0, sin(a) * r)
		if _near_lane(p, 7.0):
			continue # 레인은 비워 둔다 (MAP 의 nearLane 과 같은 규칙)
		placed += 1
		var kind := layout.randi() % 3
		var node: Node3D
		match kind:
			0:
				var s := layout.randf_range(0.9, 1.6)
				node = _static_box(Vector3(s, s, s), p + Vector3(0, s * 0.5, 0), crate)
			1:
				var w := layout.randf_range(3.0, 7.0)
				var h := layout.randf_range(1.2, 2.8)
				node = _static_box(Vector3(w, h, 0.5), p + Vector3(0, h * 0.5, 0), concrete)
			_:
				node = _static_box(Vector3(1.9, 1.3, 4.2), p + Vector3(0, 0.65, 0), rust)
		node.rotation.y = layout.randf() * TAU
	# 맵 가장자리 벽
	for side in 4:
		var horiz := side < 2
		var off := half * (1 if side % 2 == 0 else -1)
		var size := Vector3(half * 2, 6, 1) if horiz else Vector3(1, 6, half * 2)
		var pos := Vector3(0, 3, off) if horiz else Vector3(off, 3, 0)
		_static_box(size, pos, concrete)

## Lanes as darker dirt roads from MAP.lanes, so the player can see where waves come from.
func _build_lanes() -> void:
	var road := StandardMaterial3D.new()
	road.albedo_color = Color(0.12, 0.08, 0.06)
	road.roughness = 1.0
	for l in GameData.map.lanes:
		var pts: Array = l.waypoints
		for i in range(1, pts.size()):
			var a := Vector3(float(pts[i - 1].x), 0, float(pts[i - 1].z))
			var b := Vector3(float(pts[i].x), 0, float(pts[i].z))
			var mi := MeshInstance3D.new()
			var m := PlaneMesh.new()
			m.size = Vector2(6.0, a.distance_to(b) + 6.0)
			mi.mesh = m
			mi.material_override = road
			mi.position = (a + b) * 0.5 + Vector3(0, 0.01, 0)
			mi.rotation.y = atan2(b.x - a.x, b.z - a.z)
			mi.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
			add_child(mi)

func _near_lane(p: Vector3, margin: float) -> bool:
	for l in GameData.map.lanes:
		var pts: Array = l.waypoints
		for i in range(1, pts.size()):
			var a := Vector2(float(pts[i - 1].x), float(pts[i - 1].z))
			var b := Vector2(float(pts[i].x), float(pts[i].z))
			var q := Geometry2D.get_closest_point_to_segment(Vector2(p.x, p.z), a, b)
			if q.distance_to(Vector2(p.x, p.z)) < margin:
				return true
	return false

func _static_box(size: Vector3, pos: Vector3, mat: Material) -> StaticBody3D:
	var mesh := BoxMesh.new()
	mesh.size = size
	var shape := BoxShape3D.new()
	shape.size = size
	return _static(mesh, shape, pos, mat)

func _static_cylinder(radius: float, height: float, pos: Vector3, mat: Material, body: StaticBody3D = null) -> StaticBody3D:
	var mesh := CylinderMesh.new()
	mesh.top_radius = radius * 0.7
	mesh.bottom_radius = radius
	mesh.height = height
	var shape := CylinderShape3D.new()
	shape.radius = radius
	shape.height = height
	return _static(mesh, shape, pos, mat, body)

func _static(mesh: Mesh, shape: Shape3D, pos: Vector3, mat: Material, body: StaticBody3D = null) -> StaticBody3D:
	if body == null:
		body = StaticBody3D.new()
	body.position = pos
	var mi := MeshInstance3D.new()
	mi.mesh = mesh
	mi.material_override = mat
	body.add_child(mi)
	var cs := CollisionShape3D.new()
	cs.shape = shape
	body.add_child(cs)
	add_child(body)
	return body

# ── 웨이브 ───────────────────────────────────────────────────────────

func _process(dt: float) -> void:
	hitmark = maxf(0.0, hitmark - dt)
	hurt_flash.color.a = maxf(0.0, hurt_flash.color.a - dt * 1.5)
	if phase == "ended":
		return
	if phase == "prep":
		prep_left -= dt
		if prep_left <= 0.0:
			_start_wave()
	else:
		_update_combat(dt)
	_refresh_hud()

func _unhandled_input(event: InputEvent) -> void:
	# N: 준비 시간을 건너뛰고 다음 웨이브 (웹 게임과 같은 키)
	if event is InputEventKey and event.pressed and not event.echo and event.keycode == KEY_N and phase == "prep":
		prep_left = 0.0

func _roll(w: int) -> Dictionary:
	var roster := GameData.wave_roster(w)
	var r := rng.randf()
	for e in roster:
		r -= float(e.weight)
		if r <= 0.0:
			return e
	return roster[0]

## startCombat(): 3~5마리씩 같은 레인에서 몰려오고, 떼거리는 한 무리가 통째로. 10의 배수는 보스 웨이브
func _start_wave() -> void:
	wave += 1
	phase = "combat"
	var lanes: int = GameData.map.lanes.size()
	var count := GameData.wave_count(wave)
	var is_boss := GameData.is_boss_wave(wave)
	if is_boss:
		count = ceili(count * 0.6)
	queue.clear()
	var lane := rng.randi() % lanes
	var left := 0
	var ec := GameData.elite_chance(wave)
	while queue.size() < count:
		left -= 1
		if left < 0:
			lane = rng.randi() % lanes
			left = 2 + rng.randi() % 3
		var e := _roll(wave)
		if int(e.pack) > 1:
			for i in int(e.pack):
				if queue.size() < count:
					queue.append({"type": e.type, "lane": lane, "elite": false})
			left = 0
			continue
		queue.append({"type": e.type, "lane": lane, "elite": ec > 0.0 and e.type != "swarmer" and rng.randf() < ec})
	spawn_gap = (18.0 + minf(30.0, wave * 0.5)) / count
	spawn_timer = 1.5
	boss_pending = {}
	if is_boss:
		boss_pending = {"type": GameData.boss_type_for(wave), "lane": rng.randi() % lanes}
		boss_at = 3.0
		var bt: String = boss_pending.type
		toast(I18n.t("toast.bossKing") if wave == GameData.final_wave else I18n.t("toast.bossWave", {"n": wave, "name": I18n.zombie_name(bt)}))
	_banner(I18n.t("hud.wave", {"n": wave}))
	# 이번 웨이브에 처음 나오는 종류 알림
	var prev: Array = GameData.wave_roster(wave - 1).map(func(e): return e.type) if wave > 1 else ["normal"]
	for e in GameData.wave_roster(wave):
		if not e.type in prev:
			toast(I18n.t("toast.newEnemy", {"name": I18n.zombie_name(e.type)}))

func _update_combat(dt: float) -> void:
	spawn_timer -= dt
	if not boss_pending.is_empty():
		boss_at -= dt
		if boss_at <= 0.0:
			boss = spawn_on_lane(boss_pending.type, int(boss_pending.lane), false)
			boss_pending = {}
	while spawn_timer <= 0.0 and not queue.is_empty() and alive < GameData.max_alive:
		var n: Dictionary = queue.pop_front()
		spawn_on_lane(n.type, int(n.lane), bool(n.elite))
		spawn_timer += spawn_gap * (0.6 + rng.randf() * 0.8)
	spawn_timer = maxf(spawn_timer, 0.0)
	if queue.is_empty() and boss_pending.is_empty() and alive == 0:
		_wave_cleared()

func remaining() -> int:
	return alive + queue.size() + (0 if boss_pending.is_empty() else 1)

## spawnOnLane(): 핵에서 레인 경로로 laneSpawnDist(wave) 만큼 거슬러 올라간 곳
func spawn_on_lane(type: String, lane: int, elite: bool) -> Node3D:
	var pts: Array = GameData.map.lanes[lane % GameData.map.lanes.size()].waypoints
	var i := pts.size() - 1
	var p := Vector2(float(pts[i].x), float(pts[i].z))
	var c := Vector2(float(GameData.map.core.x), float(GameData.map.core.z))
	var left := GameData.lane_spawn_dist(wave) - p.distance_to(c)
	while left > 0.0 and i > 0:
		var a := Vector2(float(pts[i - 1].x), float(pts[i - 1].z))
		var seg := p.distance_to(a)
		if left < seg:
			p = p.lerp(a, left / seg)
			break
		left -= seg
		p = a
		i -= 1
	var ang := rng.randf() * TAU
	var r := rng.randf() * 3.0
	var z := spawn_zombie(type, Vector3(p.x + cos(ang) * r, 0.2, p.y + sin(ang) * r), lane, elite)
	z.wp = i
	return z

func spawn_zombie(type: String, pos: Vector3, lane: int, elite: bool) -> Node3D:
	var z := ZombieScript.new()
	z.type = type
	z.wave = maxi(1, wave)
	z.elite = elite
	z.lane = lane
	z.game = self
	z.position = pos
	z.killed.connect(_on_zombie_killed)
	zombies_root.add_child(z)
	alive += 1
	return z

func _on_zombie_killed(z: Node, gold: int) -> void:
	alive -= 1
	kills += 1
	coins += gold
	if z == boss:
		boss = null
		if z.type == "king":
			toast(I18n.t("toast.kingDown"))

func _wave_cleared() -> void:
	var bonus: int = int(GameData.enemy_rules.waveClearGold) + wave * 2
	coins += bonus
	core.heal_pct(GameData.enemy_rules.waveClearCorePct)
	phase = "prep"
	prep_left = PREP_TIME
	_banner(I18n.t("hud.wave", {"n": wave}) + "  ✓  +%d" % bonus)

func _on_core_destroyed() -> void:
	core_dead = true
	lose_reason = "core"
	player.die()

func toast(text: String) -> void:
	lbl_toast.text = text
	lbl_toast.modulate.a = 1.0
	var tw := create_tween()
	tw.tween_interval(2.6)
	tw.tween_property(lbl_toast, "modulate:a", 0.0, 0.6)

# ── 사격 연출 ─────────────────────────────────────────────────────────

func _on_fired(from: Vector3, to: Vector3, hit_zombie: bool, headshot: bool, kill: bool, also: Array) -> void:
	_tracer(from, to)
	for pt in also:
		_blood(pt)
	if hit_zombie:
		hitmark = 0.25 if kill or headshot else 0.15
		crosshair.set_meta("hit_col", Color(1, 0.25, 0.2) if kill else (Color(1, 0.85, 0.2) if headshot else Color.WHITE))
		_blood(to)
	else:
		_puff(to)

func _tracer(from: Vector3, to: Vector3) -> void:
	var mesh := ImmediateMesh.new()
	mesh.surface_begin(Mesh.PRIMITIVE_LINES)
	mesh.surface_add_vertex(from)
	mesh.surface_add_vertex(to)
	mesh.surface_end()
	var mat := StandardMaterial3D.new()
	mat.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	mat.albedo_color = Color.hex((int(player.gun.tracer) << 8) | 0xff)
	mat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	var mi := MeshInstance3D.new()
	mi.mesh = mesh
	mi.material_override = mat
	add_child(mi)
	var tw := create_tween()
	tw.tween_property(mat, "albedo_color:a", 0.0, 0.08)
	tw.tween_callback(mi.queue_free)

func _burst(at: Vector3, col: Color, n: int, spd: float) -> void:
	var p := CPUParticles3D.new()
	p.one_shot = true
	p.emitting = true
	p.amount = n
	p.lifetime = 0.45
	p.explosiveness = 1.0
	p.direction = Vector3.UP
	p.spread = 70.0
	p.initial_velocity_min = spd * 0.5
	p.initial_velocity_max = spd
	p.gravity = Vector3(0, -12, 0)
	var m := BoxMesh.new()
	m.size = Vector3.ONE * 0.06
	var mat := StandardMaterial3D.new()
	mat.albedo_color = col
	mat.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	m.material = mat
	p.mesh = m
	p.position = at
	add_child(p)
	get_tree().create_timer(1.0).timeout.connect(p.queue_free)

func _blood(at: Vector3) -> void:
	_burst(at, Color(0.55, 0.05, 0.04), 14, 4.0)

func _puff(at: Vector3) -> void:
	_burst(at, Color(0.6, 0.55, 0.45), 8, 2.5)

func _on_hurt(_hp: float) -> void:
	hurt_flash.color.a = 0.45

# ── HUD ──────────────────────────────────────────────────────────────

func _build_hud() -> void:
	var layer := CanvasLayer.new()
	add_child(layer)
	hud = Control.new()
	hud.set_anchors_preset(Control.PRESET_FULL_RECT)
	hud.mouse_filter = Control.MOUSE_FILTER_IGNORE
	layer.add_child(hud)
	hurt_flash = ColorRect.new()
	hurt_flash.color = Color(0.7, 0, 0, 0)
	hurt_flash.set_anchors_preset(Control.PRESET_FULL_RECT)
	hurt_flash.mouse_filter = Control.MOUSE_FILTER_IGNORE
	hud.add_child(hurt_flash)
	scope = Control.new()
	scope.set_anchors_preset(Control.PRESET_FULL_RECT)
	scope.mouse_filter = Control.MOUSE_FILTER_IGNORE
	scope.draw.connect(_draw_scope)
	scope.visible = false
	hud.add_child(scope)
	crosshair = Control.new()
	crosshair.set_anchors_preset(Control.PRESET_CENTER)
	crosshair.mouse_filter = Control.MOUSE_FILTER_IGNORE
	crosshair.draw.connect(_draw_crosshair)
	hud.add_child(crosshair)
	lbl_top = _label(hud, 22, Control.PRESET_TOP_LEFT, Vector2(24, 18))
	lbl_ammo = _label(hud, 34, Control.PRESET_BOTTOM_RIGHT, Vector2(-220, -78))
	lbl_ammo.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	lbl_ammo.size.x = 196
	lbl_gun = _label(hud, 18, Control.PRESET_BOTTOM_RIGHT, Vector2(-320, -104))
	lbl_gun.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	lbl_gun.size.x = 296
	lbl_gun.modulate.a = 0.85
	lbl_center = _label(hud, 40, Control.PRESET_CENTER_TOP, Vector2(-400, 90))
	lbl_center.size.x = 800
	lbl_center.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	lbl_hint = _label(hud, 15, Control.PRESET_CENTER_BOTTOM, Vector2(-500, -34))
	lbl_hint.size.x = 1000
	lbl_hint.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	lbl_hint.modulate.a = 0.75
	hp_bar = ProgressBar.new()
	hp_bar.set_anchors_preset(Control.PRESET_BOTTOM_LEFT)
	hp_bar.position = Vector2(24, -56)
	hp_bar.size = Vector2(280, 22)
	hp_bar.show_percentage = false
	var fill := StyleBoxFlat.new()
	fill.bg_color = Color(0.85, 0.2, 0.2)
	var bg := StyleBoxFlat.new()
	bg.bg_color = Color(0, 0, 0, 0.55)
	hp_bar.add_theme_stylebox_override("fill", fill)
	hp_bar.add_theme_stylebox_override("background", bg)
	hud.add_child(hp_bar)
	# 위치는 화면 크기에 맞춰 _refresh_hud 에서 정한다
	core_bar = _bar(Vector2.ZERO, Vector2(280, 12), Color(0.2, 0.85, 0.8))
	boss_bar = _bar(Vector2.ZERO, Vector2(560, 18), Color(0.85, 0.15, 0.15))
	lbl_core = _label(hud, 13, Control.PRESET_TOP_LEFT, Vector2.ZERO)
	lbl_boss = _label(hud, 18, Control.PRESET_CENTER_TOP, Vector2(-280, 52))
	lbl_boss.size.x = 560
	lbl_boss.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	lbl_toast = _label(hud, 22, Control.PRESET_CENTER_TOP, Vector2(-450, 150))
	lbl_toast.size.x = 900
	lbl_toast.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	lbl_toast.add_theme_color_override("font_color", Color(1, 0.8, 0.4))
	_refresh_hud()

func _bar(pos: Vector2, size: Vector2, col: Color) -> ProgressBar:
	var b := ProgressBar.new()
	b.position = pos
	b.size = size
	b.show_percentage = false
	var fill := StyleBoxFlat.new()
	fill.bg_color = col
	var bg := StyleBoxFlat.new()
	bg.bg_color = Color(0, 0, 0, 0.55)
	b.add_theme_stylebox_override("fill", fill)
	b.add_theme_stylebox_override("background", bg)
	b.mouse_filter = Control.MOUSE_FILTER_IGNORE
	hud.add_child(b)
	return b

func _label(parent: Control, font_size: int, preset: int, pos: Vector2) -> Label:
	var l := Label.new()
	l.set_anchors_preset(preset)
	l.position = pos
	l.add_theme_font_size_override("font_size", font_size)
	l.add_theme_color_override("font_shadow_color", Color(0, 0, 0, 0.8))
	l.add_theme_constant_override("shadow_offset_x", 2)
	l.add_theme_constant_override("shadow_offset_y", 2)
	l.mouse_filter = Control.MOUSE_FILTER_IGNORE
	parent.add_child(l)
	return l

func _banner(text: String) -> void:
	lbl_center.text = text
	lbl_center.modulate.a = 1.0
	var tw := create_tween()
	tw.tween_interval(1.6)
	tw.tween_property(lbl_center, "modulate:a", 0.0, 0.6)

func _refresh_hud() -> void:
	if hud == null:
		return
	lbl_top.text = "%s    %s    %s" % [I18n.t("hud.wave", {"n": maxi(wave, 1)}), I18n.t("hud.kills", {"n": kills}), I18n.t("hud.coins", {"n": coins})]
	if phase == "prep":
		lbl_top.text += "    " + I18n.t("hud.prep", {"n": ceili(prep_left)})
	elif phase == "combat":
		lbl_top.text += "    " + I18n.t("hud.left", {"n": remaining()})
	core_bar.position = Vector2(24, hud.size.y - 92)
	lbl_core.position = Vector2(312, hud.size.y - 90)
	lbl_core.text = I18n.t("hud.core")
	boss_bar.position = Vector2((hud.size.x - boss_bar.size.x) * 0.5, 80)
	core_bar.max_value = core.max_hp
	core_bar.value = core.hp
	var show_boss: bool = is_instance_valid(boss) and not boss.dead
	boss_bar.visible = show_boss
	lbl_boss.visible = show_boss
	if show_boss:
		boss_bar.max_value = boss.max_hp
		boss_bar.value = maxf(0.0, boss.hp)
		lbl_boss.text = I18n.zombie_name(boss.type)
	lbl_ammo.text = I18n.t("hud.reloading") if player.is_reloading() else "%d / %d" % [player.ammo, player.mag_size(player.gun_id)]
	lbl_gun.text = "%s  Lv %d" % [I18n.gun_name(player.gun_id), player.lv[player.gun_id]]
	var scoped: bool = player.aiming and bool(player.gun.scope)
	scope.visible = scoped
	crosshair.visible = not scoped
	hp_bar.max_value = player.max_hp
	hp_bar.value = player.hp
	var help := I18n.t("help")
	lbl_hint.text = help if Input.mouse_mode == Input.MOUSE_MODE_CAPTURED else I18n.t("hud.click") + "  ·  " + help
	crosshair.queue_redraw()
	if scoped:
		scope.queue_redraw()

## Crosshair gap follows the real spread, like the web HUD.
func _draw_crosshair() -> void:
	var px_per_rad: float = get_viewport().get_visible_rect().size.y / deg_to_rad(player.camera.fov)
	var gap: float = 6.0 + player.current_spread() * px_per_rad * 2.0
	var c := Color(1, 1, 1, 0.9)
	for d in [Vector2.RIGHT, Vector2.LEFT, Vector2.UP, Vector2.DOWN]:
		crosshair.draw_line(d * gap, d * (gap + 9.0), c, 2.0)
	if hitmark > 0.0:
		var hc: Color = crosshair.get_meta("hit_col", Color.WHITE)
		for d in [Vector2(1, 1), Vector2(-1, 1), Vector2(1, -1), Vector2(-1, -1)]:
			crosshair.draw_line(d * 7.0, d * 14.0, hc, 2.5)

## Sniper scope: black outside a circle, thin cross lines.
func _draw_scope() -> void:
	var sz := scope.size
	var c := sz * 0.5
	var r := sz.y * 0.42
	var black := Color(0, 0, 0, 0.96)
	scope.draw_rect(Rect2(0, 0, c.x - r, sz.y), black)
	scope.draw_rect(Rect2(c.x + r, 0, sz.x - c.x - r, sz.y), black)
	var pts := PackedVector2Array()
	for i in 65: # 원 바깥 위/아래를 다각형으로 칠한다
		var a := PI + PI * i / 64.0
		pts.append(c + Vector2(cos(a), sin(a)) * r)
	pts.append(Vector2(c.x + r, 0))
	pts.append(Vector2(c.x - r, 0))
	scope.draw_colored_polygon(pts, black)
	var pts2 := PackedVector2Array()
	for i in 65:
		var a := PI * i / 64.0
		pts2.append(c + Vector2(cos(a), sin(a)) * r)
	pts2.append(Vector2(c.x - r, sz.y))
	pts2.append(Vector2(c.x + r, sz.y))
	scope.draw_colored_polygon(pts2, black)
	scope.draw_arc(c, r, 0, TAU, 96, Color(0, 0, 0), 4.0)
	var line := Color(0, 0, 0, 0.85)
	scope.draw_line(Vector2(c.x - r, c.y), Vector2(c.x + r, c.y), line, 1.5)
	scope.draw_line(Vector2(c.x, c.y - r), Vector2(c.x, c.y + r), line, 1.5)
	scope.draw_circle(c, 2.0, Color(1, 0.2, 0.15))

# ── 사망 카드 ─────────────────────────────────────────────────────────

func _on_died() -> void:
	phase = "ended"
	await get_tree().create_timer(1.0).timeout
	var layer := CanvasLayer.new()
	layer.layer = 5
	add_child(layer)
	var root := Control.new()
	root.set_anchors_preset(Control.PRESET_FULL_RECT)
	layer.add_child(root)
	var art := TextureRect.new()
	art.texture = load("res://assets/art/death.webp")
	art.set_anchors_preset(Control.PRESET_FULL_RECT)
	art.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	art.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_COVERED
	art.modulate = Color(1, 1, 1, 0.85)
	root.add_child(art)
	var panel := ColorRect.new()
	panel.color = Color(0.04, 0.01, 0.01, 0.72)
	panel.set_anchors_preset(Control.PRESET_CENTER)
	panel.position = Vector2(-330, -130)
	panel.size = Vector2(660, 260)
	root.add_child(panel)
	var box := VBoxContainer.new()
	box.set_anchors_preset(Control.PRESET_CENTER)
	box.position = Vector2(-300, -110)
	box.size = Vector2(600, 220)
	box.alignment = BoxContainer.ALIGNMENT_CENTER
	box.add_theme_constant_override("separation", 16)
	root.add_child(box)
	var title := Label.new()
	title.text = I18n.t("death.coreTitle" if lose_reason == "core" else "death.title")
	title.add_theme_font_size_override("font_size", 56)
	title.add_theme_color_override("font_color", Color(1, 0.3, 0.25))
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	box.add_child(title)
	var sub := Label.new()
	sub.text = I18n.t("death.sub", {"w": wave, "k": kills, "c": coins})
	sub.add_theme_font_size_override("font_size", 22)
	sub.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	box.add_child(sub)
	var btn := Button.new()
	btn.text = I18n.t("death.back")
	btn.custom_minimum_size = Vector2(260, 54)
	btn.size_flags_horizontal = Control.SIZE_SHRINK_CENTER
	btn.add_theme_font_size_override("font_size", 22)
	btn.pressed.connect(func(): get_tree().change_scene_to_file("res://scenes/title.tscn"))
	box.add_child(btn)
	btn.grab_focus()
