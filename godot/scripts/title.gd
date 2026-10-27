extends Control
## Title screen: splash key art, 3D-GUN logo, Deploy button, language toggle.
## Port of src/title/title.ts (the story intro and settings panel come later).

var logo: Label
var sub: Label
var slice: Label
var btn: Button
var hint: Label
var lang: Button
var hub: Button
var vol_lbl: Label

func _ready() -> void:
	Input.mouse_mode = Input.MOUSE_MODE_VISIBLE
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
	grad.set_color(1, Color(0.05, 0, 0, 0.85))
	g.gradient = grad
	g.fill_from = Vector2(0, 0.2)
	g.fill_to = Vector2(0, 1)
	shade.texture = g
	shade.set_anchors_preset(Control.PRESET_FULL_RECT)
	shade.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	add_child(shade)
	var box := VBoxContainer.new()
	box.set_anchors_preset(Control.PRESET_CENTER_BOTTOM)
	box.position = Vector2(-320, -360)
	box.size = Vector2(640, 290)
	box.alignment = BoxContainer.ALIGNMENT_END
	box.add_theme_constant_override("separation", 10)
	add_child(box)
	logo = _label(box, 96, Color(0.95, 0.2, 0.18))
	logo.text = "3D-GUN"
	logo.add_theme_constant_override("outline_size", 10)
	logo.add_theme_color_override("font_outline_color", Color(0.1, 0, 0))
	sub = _label(box, 26, Color(1, 0.9, 0.8))
	btn = Button.new()
	btn.custom_minimum_size = Vector2(280, 64)
	btn.size_flags_horizontal = Control.SIZE_SHRINK_CENTER
	btn.add_theme_font_size_override("font_size", 30)
	btn.pressed.connect(_launch)
	# 원본 타이틀(src/title/style.ts)처럼 주황 버튼에 어두운 글자, 은은히 깜빡이는 빛
	for st in ["normal", "hover", "pressed", "focus"]:
		var sb := StyleBoxFlat.new()
		sb.bg_color = Color("ff8a2a") if st != "hover" else Color("ffa04d")
		sb.set_corner_radius_all(6)
		sb.shadow_color = Color(1, 0.54, 0.16, 0.6)
		sb.shadow_size = 14
		btn.add_theme_stylebox_override(st, sb)
	for c in ["font_color", "font_hover_color", "font_pressed_color", "font_focus_color"]:
		btn.add_theme_color_override(c, Color("07090d"))
	var pulse := create_tween().set_loops()
	pulse.tween_property(btn, "modulate", Color(1.12, 1.05, 1.0), 0.9)
	pulse.tween_property(btn, "modulate", Color(1, 1, 1), 0.9)
	box.add_child(btn)
	hub = Button.new()
	hub.custom_minimum_size = Vector2(200, 44)
	hub.size_flags_horizontal = Control.SIZE_SHRINK_CENTER
	hub.add_theme_font_size_override("font_size", 20)
	hub.pressed.connect(func(): get_tree().change_scene_to_file("res://scenes/hub.tscn"))
	box.add_child(hub)
	hint = _label(box, 16, Color(1, 1, 1, 0.7))
	# 음량 (설정의 volume, 원본과 같은 저장소)
	var vol := HBoxContainer.new()
	vol.set_anchors_preset(Control.PRESET_TOP_LEFT)
	vol.position = Vector2(20, 24)
	add_child(vol)
	vol_lbl = _label(vol, 16, Color(1, 1, 1, 0.8))
	var slider := HSlider.new()
	slider.custom_minimum_size = Vector2(160, 24)
	slider.max_value = 1.0
	slider.step = 0.05
	slider.value = float(Save.settings.volume)
	slider.value_changed.connect(func(v: float):
		Save.settings.volume = v
		Sfx.set_volume(v)
		Save.save_settings())
	vol.add_child(slider)
	slice = _label(self, 14, Color(1, 1, 1, 0.55))
	slice.set_anchors_preset(Control.PRESET_BOTTOM_LEFT)
	slice.position = Vector2(20, -34)
	lang = Button.new()
	lang.set_anchors_preset(Control.PRESET_TOP_RIGHT)
	lang.position = Vector2(-140, 20)
	lang.custom_minimum_size = Vector2(120, 40)
	lang.pressed.connect(func():
		I18n.toggle()
		Save.settings.locale = I18n.locale
		Save.save_settings())
	add_child(lang)
	I18n.locale_changed.connect(_refresh)
	_refresh()
	btn.grab_focus()

func _label(parent: Control, font_size: int, col: Color) -> Label:
	var l := Label.new()
	l.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	l.add_theme_font_size_override("font_size", font_size)
	l.add_theme_color_override("font_color", col)
	l.add_theme_color_override("font_shadow_color", Color(0, 0, 0, 0.8))
	parent.add_child(l)
	return l

func _refresh() -> void:
	sub.text = I18n.t("title.sub")
	btn.text = I18n.t("title.launch")
	hint.text = I18n.t("title.launchHint")
	lang.text = I18n.t("title.lang")
	slice.text = I18n.t("title.slice")
	hub.text = I18n.t("title.hub")
	vol_lbl.text = I18n.t("title.volume")

func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventKey and event.pressed and (event.keycode == KEY_ENTER or event.keycode == KEY_KP_ENTER):
		_launch()

func _launch() -> void:
	get_tree().change_scene_to_file("res://scenes/game.tscn")
