extends Control
## Title screen: splash key art, 3D-GUN logo, Deploy button, language toggle.
## Port of src/title/title.ts (the story intro and settings panel come later).

var logo: Label
var sub: Label
var slice: Label
var btn: Button
var hint: Label
var lang: Button

func _ready() -> void:
	Input.mouse_mode = Input.MOUSE_MODE_VISIBLE
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
	box.position = Vector2(-320, -330)
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
	box.add_child(btn)
	hint = _label(box, 16, Color(1, 1, 1, 0.7))
	slice = _label(self, 14, Color(1, 1, 1, 0.55))
	slice.set_anchors_preset(Control.PRESET_BOTTOM_LEFT)
	slice.position = Vector2(20, -34)
	lang = Button.new()
	lang.set_anchors_preset(Control.PRESET_TOP_RIGHT)
	lang.position = Vector2(-140, 20)
	lang.custom_minimum_size = Vector2(120, 40)
	lang.pressed.connect(I18n.toggle)
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

func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventKey and event.pressed and (event.keycode == KEY_ENTER or event.keycode == KEY_KP_ENTER):
		_launch()

func _launch() -> void:
	get_tree().change_scene_to_file("res://scenes/game.tscn")
