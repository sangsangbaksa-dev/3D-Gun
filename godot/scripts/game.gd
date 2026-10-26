extends Node3D
## The 3D sortie: world, waves, coins, HUD and the death card.
## Waves follow src/enemies/logic/director.ts in spirit (waveCount, MAX_ALIVE, clear bonus);
## lanes, base, allies and turrets come in later slices.

const ZombieScript := preload("res://scripts/zombie.gd")
const PlayerScript := preload("res://scripts/player.gd")
const ShopScript := preload("res://scripts/weapon_shop.gd")
const PREP_TIME := 8.0 # 웹 게임은 60초(기지 건설 시간). 건설이 없는 첫 슬라이스라 짧게
const SPAWN_MIN := 26.0
const SPAWN_MAX := 40.0

var player: CharacterBody3D
var wave := 0
var to_spawn := 0
var alive := 0
var spawn_timer := 0.0
var prep_left := 3.0
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
var crosshair: Control
var hitmark := 0.0
var hurt_flash: ColorRect
var zombies_root: Node3D

func _ready() -> void:
	rng.randomize()
	_build_environment()
	_build_world()
	player = PlayerScript.new()
	player.position = Vector3(0, 0.1, 7)
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
	# 땅: 200m × 200m, 잡음 텍스처로 흙/풀 얼룩
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
	ground_mat.uv1_scale = Vector3(24, 24, 1)
	ground_mat.roughness = 1.0
	var ground := _static_box(Vector3(200, 1, 200), Vector3(0, -0.5, 0), ground_mat)
	ground.get_child(0).cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	# 가운데 핵 (기지 자리 표시). 기지 건설은 다음 슬라이스에서
	var core_mat := StandardMaterial3D.new()
	core_mat.albedo_color = Color(0.1, 0.45, 0.45)
	core_mat.metallic = 0.5
	core_mat.emission_enabled = true
	core_mat.emission = Color(0.18, 0.9, 0.84)
	core_mat.emission_energy_multiplier = 0.35
	_static_cylinder(2.2, 4.0, Vector3(0, 2, 0), core_mat)
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
	for i in 46:
		var a := layout.randf() * TAU
		var r := layout.randf_range(9.0, 70.0)
		var p := Vector3(cos(a) * r, 0, sin(a) * r)
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
		var off := 100.0 * (1 if side % 2 == 0 else -1)
		var size := Vector3(200, 6, 1) if horiz else Vector3(1, 6, 200)
		var pos := Vector3(0, 3, off) if horiz else Vector3(off, 3, 0)
		_static_box(size, pos, concrete)

func _static_box(size: Vector3, pos: Vector3, mat: Material) -> StaticBody3D:
	var mesh := BoxMesh.new()
	mesh.size = size
	var shape := BoxShape3D.new()
	shape.size = size
	return _static(mesh, shape, pos, mat)

func _static_cylinder(radius: float, height: float, pos: Vector3, mat: Material) -> StaticBody3D:
	var mesh := CylinderMesh.new()
	mesh.top_radius = radius * 0.7
	mesh.bottom_radius = radius
	mesh.height = height
	var shape := CylinderShape3D.new()
	shape.radius = radius
	shape.height = height
	return _static(mesh, shape, pos, mat)

func _static(mesh: Mesh, shape: Shape3D, pos: Vector3, mat: Material) -> StaticBody3D:
	var body := StaticBody3D.new()
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
	if player.dead:
		return
	if to_spawn == 0 and alive == 0:
		prep_left -= dt
		if prep_left <= 0.0:
			_start_wave()
	elif to_spawn > 0:
		spawn_timer -= dt
		if spawn_timer <= 0.0 and alive < GameData.max_alive:
			_spawn_one()
			to_spawn -= 1
			spawn_timer = maxf(0.25, 1.1 - wave * 0.04)
	hitmark = maxf(0.0, hitmark - dt)
	hurt_flash.color.a = maxf(0.0, hurt_flash.color.a - dt * 1.5)
	_refresh_hud()

func _start_wave() -> void:
	wave += 1
	to_spawn = GameData.wave_count(wave)
	spawn_timer = 0.0
	_banner(I18n.t("hud.wave", {"n": wave}))

func _spawn_one() -> void:
	var z := ZombieScript.new()
	z.wave = wave
	# 달리기 좀비: 3웨이브부터 (ROSTER 의 runner 가중치와 같은 식)
	if wave >= 3 and rng.randf() < minf(0.25, 0.08 + (wave - 3) * 0.02):
		z.type = "runner"
	z.target = player
	var a := rng.randf() * TAU
	var r := rng.randf_range(SPAWN_MIN, SPAWN_MAX)
	var p := player.global_position + Vector3(cos(a) * r, 0.2, sin(a) * r)
	p.x = clampf(p.x, -96, 96)
	p.z = clampf(p.z, -96, 96)
	z.position = p
	z.killed.connect(_on_zombie_killed)
	zombies_root.add_child(z)
	alive += 1

func _on_zombie_killed(_z: Node, gold: int) -> void:
	alive -= 1
	kills += 1
	coins += gold
	if to_spawn == 0 and alive == 0:
		var bonus: int = int(GameData.enemy_rules.waveClearGold) + wave * 2
		coins += bonus
		prep_left = PREP_TIME
		_banner(I18n.t("hud.wave", {"n": wave}) + "  ✓  +%d" % bonus)

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
	_refresh_hud()

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
	if to_spawn == 0 and alive == 0 and not player.dead:
		lbl_top.text += "    " + I18n.t("hud.prep", {"n": ceili(prep_left)})
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
	title.text = I18n.t("death.title")
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
