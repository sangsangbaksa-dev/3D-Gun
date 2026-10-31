extends Control
## Title screen: splash key art, 3D-GUN logo, Deploy button, language toggle.
## Port of src/title/title.ts + style.ts: logo chip top-left, Deploy button bottom-centre, teal menu buttons
## bottom-right, drifting embers and a vignette over the art (the story intro comes later).

const TEAL := Color("2ee6d6")
const ORANGE := Color("ff8a2a")
const RED := Color("e0303a")
const PANEL := Color("121a20b3")
const SettingsScript := preload("res://scripts/settings_panel.gd")
const UiKit := preload("res://scripts/ui_kit.gd")
const Intro := preload("res://scripts/intro.gd")

var logo: Control
var sub: Label
var slice: Label
var btn: Button
var hint: Label
var lang: Button
var hub: Button
var settings_btn: Button
var controls_btn: Button
var embers: CPUParticles2D

func _ready() -> void:
	Input.mouse_mode = Input.MOUSE_MODE_VISIBLE
	UiKit.auto_scale(self) # 세로 모바일 화면에서 확대
	I18n.locale = Save.settings.locale
	set_anchors_preset(Control.PRESET_FULL_RECT)
	var art := TextureRect.new()
	art.texture = load("res://assets/art/splash.webp")
	art.set_anchors_preset(Control.PRESET_FULL_RECT)
	art.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	art.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_COVERED
	add_child(art)
	# 아래쪽을 어둡게 해서 글자가 읽히게
	var shade := TextureRect.new()
	var g := GradientTexture2D.new()
	var grad := Gradient.new()
	grad.set_color(0, Color(0, 0, 0, 0.0))
	grad.set_color(1, Color(0.04, 0.012, 0.024, 0.67))
	g.gradient = grad
	g.fill_from = Vector2(0, 0.55)
	g.fill_to = Vector2(0, 1)
	shade.texture = g
	shade.set_anchors_preset(Control.PRESET_FULL_RECT)
	shade.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	shade.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(shade)
	_embers()
	var vig := TextureRect.new()
	var vg := GradientTexture2D.new()
	var vgrad := Gradient.new()
	vgrad.offsets = PackedFloat32Array([0.0, 0.55, 1.0])
	vgrad.colors = PackedColorArray([Color(0, 0, 0, 0), Color(0, 0, 0, 0), Color(0, 0, 0, 0.3)])
	vg.gradient = vgrad
	vg.fill = GradientTexture2D.FILL_RADIAL
	vg.fill_from = Vector2(0.5, 0.5)
	vg.fill_to = Vector2(1.0, 0.5)
	vig.texture = vg
	vig.set_anchors_preset(Control.PRESET_FULL_RECT)
	vig.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	vig.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(vig)
	_logo_block()
	_launch_block()
	_menu_block()
	slice = _label(self, 13, Color(1, 1, 1, 0.5))
	slice.set_anchors_preset(Control.PRESET_BOTTOM_LEFT)
	slice.position = Vector2(32, -36)
	I18n.locale_changed.connect(_refresh)
	_refresh()
	btn.grab_focus()

## 왼쪽 위 로고: 조준 문양과 3D-GUN 글자, 아래에 청록 부제
func _logo_block() -> void:
	var col := VBoxContainer.new()
	col.position = Vector2(32, 24)
	col.add_theme_constant_override("separation", 6)
	col.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(col)
	var chip := PanelContainer.new()
	chip.add_theme_stylebox_override("panel", _box(Color("10141a"), Color(TEAL, 0.0), 10, 0, Vector4(14, 6, 22, 6)))
	chip.size_flags_horizontal = Control.SIZE_SHRINK_BEGIN
	chip.mouse_filter = Control.MOUSE_FILTER_IGNORE
	col.add_child(chip)
	var row := HBoxContainer.new()
	row.add_theme_constant_override("separation", 10)
	chip.add_child(row)
	var cross := Control.new()
	cross.custom_minimum_size = Vector2(52, 52)
	cross.draw.connect(func():
		var c := Vector2(26, 26)
		cross.draw_arc(c, 17.0, 0.0, TAU, 40, TEAL, 3.0, true)
		cross.draw_arc(c, 7.5, 0.0, TAU, 28, ORANGE, 2.5, true)
		for d in [Vector2.UP, Vector2.DOWN, Vector2.LEFT, Vector2.RIGHT]:
			cross.draw_line(c + d * 22.0, c + d * 26.0, TEAL, 3.0, true)
			cross.draw_line(c + d * 12.0, c + d * 14.0, TEAL, 3.0, true)
		cross.draw_circle(c, 2.4, RED))
	row.add_child(cross)
	var words := HBoxContainer.new()
	words.add_theme_constant_override("separation", 0)
	row.add_child(words)
	for part in [["3D", Color("e8eef0")], ["-", ORANGE], ["GUN", TEAL]]:
		var l := Label.new()
		l.text = part[0]
		l.add_theme_font_size_override("font_size", 46)
		l.add_theme_color_override("font_color", part[1])
		l.add_theme_color_override("font_outline_color", part[1])
		l.add_theme_constant_override("outline_size", 2)
		l.size_flags_vertical = Control.SIZE_SHRINK_CENTER
		words.add_child(l)
	logo = chip
	sub = Label.new()
	var fv := FontVariation.new()
	fv.base_font = load("res://assets/fonts/ui_font.tres")
	fv.spacing_glyph = 5
	sub.add_theme_font_override("font", fv)
	sub.add_theme_font_size_override("font_size", 17)
	sub.add_theme_color_override("font_color", Color(TEAL, 0.9))
	sub.add_theme_color_override("font_shadow_color", Color(0, 0, 0, 0.85))
	sub.add_theme_constant_override("shadow_offset_x", 0)
	sub.add_theme_constant_override("shadow_offset_y", 1)
	sub.add_theme_constant_override("shadow_outline_size", 4)
	col.add_child(sub)
	# 은은한 청록 빛 숨쉬기
	var glow := create_tween().set_loops()
	glow.tween_property(chip, "modulate", Color(1.12, 1.12, 1.12), 1.6).set_trans(Tween.TRANS_SINE)
	glow.tween_property(chip, "modulate", Color(1, 1, 1), 1.6).set_trans(Tween.TRANS_SINE)

## 아래 가운데: 출격 버튼과 안내 줄
func _launch_block() -> void:
	var box := VBoxContainer.new()
	box.set_anchors_and_offsets_preset(Control.PRESET_CENTER_BOTTOM, Control.PRESET_MODE_MINSIZE, 56)
	box.grow_horizontal = Control.GROW_DIRECTION_BOTH
	box.grow_vertical = Control.GROW_DIRECTION_BEGIN
	box.add_theme_constant_override("separation", 10)
	box.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(box)
	btn = Button.new()
	btn.custom_minimum_size = Vector2(240, 56)
	btn.size_flags_horizontal = Control.SIZE_SHRINK_CENTER
	btn.add_theme_font_size_override("font_size", 24)
	btn.pressed.connect(_launch)
	# 원본 타이틀(src/title/style.ts)처럼 주황 버튼에 어두운 글자, 은은히 깜빡이는 빛
	var states := {"normal": ORANGE, "hover": Color("ffa557"), "pressed": Color("e8761c"), "focus": ORANGE}
	for st in states:
		var sb := _box(states[st], TEAL if st == "hover" else Color(TEAL, 0.0), 6, 2 if st == "hover" else 0, Vector4(44, 8, 44, 8))
		sb.shadow_color = Color(ORANGE, 0.55)
		sb.shadow_size = 14
		if st == "focus":
			# 포커스 스타일은 normal 위에 겹쳐 그려진다. 같은 색으로 채우면 그림자까지 겹쳐 눌린 것처럼 보이므로 윤곽선만 둔다.
			sb = _box(Color(0, 0, 0, 0), Color(1, 1, 1, 0.55), 6, 2, Vector4(44, 8, 44, 8))
		btn.add_theme_stylebox_override(st, sb)
	for c in ["font_color", "font_hover_color", "font_pressed_color", "font_focus_color"]:
		btn.add_theme_color_override(c, Color("07090d"))
	var pulse := create_tween().set_loops()
	pulse.tween_property(btn, "modulate", Color(1.1, 1.04, 1.0), 0.9)
	pulse.tween_property(btn, "modulate", Color(1, 1, 1), 0.9)
	box.add_child(btn)
	hint = _label(box, 13, Color(1, 1, 1, 0.6))

## 오른쪽 아래: 설정, 조작키, 언어, 본부 버튼 (음량은 설정 창에서) (원본의 청록 테두리 메뉴)
func _menu_block() -> void:
	var row := HBoxContainer.new()
	row.set_anchors_and_offsets_preset(Control.PRESET_BOTTOM_RIGHT, Control.PRESET_MODE_MINSIZE, 28)
	row.grow_horizontal = Control.GROW_DIRECTION_BEGIN
	row.grow_vertical = Control.GROW_DIRECTION_BEGIN
	row.add_theme_constant_override("separation", 10)
	add_child(row)
	settings_btn = _menu_button(row)
	settings_btn.pressed.connect(_open_settings.bind("settings"))
	controls_btn = _menu_button(row)
	controls_btn.pressed.connect(_open_settings.bind("controls"))
	lang = _menu_button(row)
	lang.pressed.connect(func():
		I18n.toggle()
		Save.settings.locale = I18n.locale
		Save.save_settings())
	hub = _menu_button(row)
	hub.pressed.connect(func(): Loading.go("res://scenes/hub.tscn"))

func _open_settings(page: String) -> void:
	var p := SettingsScript.new()
	add_child(p)
	p.show_page(page)
	p.closed.connect(func(): btn.grab_focus())

func _menu_button(parent: Control) -> Button:
	var b := Button.new()
	b.add_theme_font_size_override("font_size", 15)
	b.add_theme_stylebox_override("normal", _box(PANEL, TEAL, 6, 1, Vector4(18, 8, 18, 8)))
	b.add_theme_stylebox_override("hover", _box(Color(TEAL, 0.12).blend(PANEL), TEAL, 6, 1, Vector4(18, 8, 18, 8)))
	b.add_theme_stylebox_override("pressed", _box(Color(TEAL, 0.2).blend(PANEL), TEAL, 6, 1, Vector4(18, 8, 18, 8)))
	b.add_theme_stylebox_override("focus", _box(Color(0, 0, 0, 0), Color(TEAL, 0.8), 6, 2, Vector4(18, 8, 18, 8)))
	for c in ["font_color", "font_hover_color", "font_pressed_color", "font_focus_color"]:
		b.add_theme_color_override(c, TEAL)
	parent.add_child(b)
	return b

## 아래에서 위로 떠오르는 불씨 (원본의 .ember)
func _embers() -> void:
	embers = CPUParticles2D.new()
	var dot := GradientTexture2D.new()
	var dg := Gradient.new()
	dg.set_color(0, Color(1, 0.75, 0.4, 1))
	dg.set_color(1, Color(ORANGE, 0.0))
	dot.gradient = dg
	dot.fill = GradientTexture2D.FILL_RADIAL
	dot.fill_from = Vector2(0.5, 0.5)
	dot.fill_to = Vector2(1.0, 0.5)
	dot.width = 16
	dot.height = 16
	embers.texture = dot
	embers.amount = 60
	embers.lifetime = 9.0
	embers.preprocess = 9.0
	embers.emission_shape = CPUParticles2D.EMISSION_SHAPE_RECTANGLE
	embers.direction = Vector2(0.45, -1)
	embers.spread = 12.0
	embers.gravity = Vector2.ZERO
	embers.initial_velocity_min = 50.0
	embers.initial_velocity_max = 110.0
	embers.scale_amount_min = 0.25
	embers.scale_amount_max = 0.6
	var fade := Gradient.new()
	fade.offsets = PackedFloat32Array([0.0, 0.1, 1.0])
	fade.colors = PackedColorArray([Color(1, 1, 1, 0), Color(1, 1, 1, 1), Color(1, 0.6, 0.4, 0)])
	embers.color_ramp = fade
	var mat := CanvasItemMaterial.new()
	mat.blend_mode = CanvasItemMaterial.BLEND_MODE_ADD
	embers.material = mat
	add_child(embers)
	get_viewport().size_changed.connect(_fit_embers)
	_fit_embers()

func _fit_embers() -> void:
	var s := get_viewport_rect().size
	embers.position = Vector2(s.x * 0.5, s.y + 10.0)
	embers.emission_rect_extents = Vector2(s.x * 0.5, 2.0)

func _box(bg: Color, edge: Color, radius: int, border: int, margin := Vector4.ZERO) -> StyleBoxFlat:
	var sb := StyleBoxFlat.new()
	sb.bg_color = bg
	sb.border_color = edge
	sb.set_border_width_all(border)
	sb.set_corner_radius_all(radius)
	sb.anti_aliasing = true
	sb.content_margin_left = margin.x
	sb.content_margin_top = margin.y
	sb.content_margin_right = margin.z
	sb.content_margin_bottom = margin.w
	return sb

func _label(parent: Control, font_size: int, col: Color) -> Label:
	var l := Label.new()
	l.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	l.add_theme_font_size_override("font_size", font_size)
	l.add_theme_color_override("font_color", col)
	l.add_theme_color_override("font_shadow_color", Color(0, 0, 0, 0.8))
	parent.add_child(l)
	return l

func _refresh() -> void:
	sub.text = I18n.t("title.sub").to_upper()
	btn.text = I18n.t("title.launch")
	hint.text = I18n.t("title.launchHint")
	lang.text = I18n.t("title.lang")
	slice.text = I18n.t("title.halloween") if _halloween() else I18n.t("title.slice")
	hub.text = I18n.t("title.hub")
	settings_btn.text = I18n.t("title.settings")
	controls_btn.text = I18n.t("title.controls")

static func _halloween() -> bool:
	var d := Time.get_date_dict_from_system()
	return d.month == 10 and d.day == 31

func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventKey and event.pressed and (event.keycode == KEY_ENTER or event.keycode == KEY_KP_ENTER):
		_launch()

var _launching := false

func _launch() -> void:
	if _launching:
		return
	_launching = true
	var go := func(): Loading.go("res://scenes/game.tscn")
	if Intro.should_play(): # 첫 출격: 도입 컷 (intro.gd)
		Intro.play(self, go)
	else:
		go.call()
