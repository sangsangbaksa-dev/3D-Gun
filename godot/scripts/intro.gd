extends CanvasLayer
## 출격 직후 도입 컷 3장 (좀비 사태 → 도시 함락과 핵 돔 → 사명). 컷마다 그림이 서서히 나타나고 글이 페이드로 오간다.
## 아무 키나 클릭으로 통째로 건너뛴다. 첫 출격(totalRuns == 0)에만 나오고, 설정에서 "다시 보기" 를 누르면 다음 출격에 또 나온다.
## 쓰는 법(title.gd): if Intro.should_play(): Intro.play(self, 콜백) else 콜백.call()

const Text := preload("res://scripts/tutorial_text.gd")
const CUTS := [
	{"art": "res://assets/art/story1.webp", "text": "intro.0", "hold": 4.6},
	{"art": "res://assets/art/story3.webp", "text": "intro.1", "hold": 3.6},
	{"art": "res://assets/art/story4.webp", "text": "intro.2", "hold": 3.6, "em": true},
]
const FADE := 0.8
const IGNORE_S := 0.3 # 출격을 누른 그 키가 곧바로 건너뛰기가 되지 않게

signal finished

var cut := -1
var skipped := false
var done := false
var art: TextureRect
var label: Label
var skip_label: Label
var _age := 0.0
var _tw: Tween

static func should_play() -> bool:
	if bool(Save.settings.get("intro_seen", false)) and not bool(Save.settings.get("intro_force", false)):
		return false
	return float(Save.meta.get("totalRuns", 0)) == 0.0 or bool(Save.settings.get("intro_force", false))

## parent 위에 도입을 얹고, 끝나면(건너뛰어도) on_done 을 부른다.
static func play(parent: Node, on_done: Callable) -> Node:
	var s = (load("res://scripts/intro.gd") as GDScript).new()
	s.name = "Intro"
	s.finished.connect(on_done, CONNECT_ONE_SHOT)
	parent.add_child(s)
	return s

func _ready() -> void:
	layer = 60
	process_mode = Node.PROCESS_MODE_ALWAYS
	var bg := ColorRect.new()
	bg.color = Color.BLACK
	bg.set_anchors_preset(Control.PRESET_FULL_RECT)
	bg.mouse_filter = Control.MOUSE_FILTER_STOP
	add_child(bg)
	art = TextureRect.new()
	art.set_anchors_preset(Control.PRESET_FULL_RECT)
	art.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	art.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_COVERED
	art.mouse_filter = Control.MOUSE_FILTER_IGNORE
	art.modulate = Color(0.72, 0.72, 0.72, 0.0)
	add_child(art)
	var shade := ColorRect.new() # 글자가 읽히게 아래를 어둡게
	shade.set_anchors_preset(Control.PRESET_FULL_RECT)
	shade.color = Color(0, 0, 0, 0.35)
	shade.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(shade)
	label = Label.new()
	label.set_anchors_preset(Control.PRESET_FULL_RECT)
	label.offset_left = 80
	label.offset_right = -80
	label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	label.add_theme_font_size_override("font_size", 30)
	label.add_theme_color_override("font_color", Color("e6f2f1"))
	label.add_theme_color_override("font_shadow_color", Color(0, 0, 0, 0.9))
	label.add_theme_constant_override("shadow_offset_x", 2)
	label.add_theme_constant_override("shadow_offset_y", 2)
	label.add_theme_constant_override("line_spacing", 14)
	label.modulate.a = 0.0
	label.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(label)
	skip_label = Label.new()
	skip_label.set_anchors_preset(Control.PRESET_BOTTOM_RIGHT)
	skip_label.grow_horizontal = Control.GROW_DIRECTION_BEGIN
	skip_label.grow_vertical = Control.GROW_DIRECTION_BEGIN
	skip_label.offset_right = -24
	skip_label.offset_bottom = -18
	skip_label.add_theme_font_size_override("font_size", 14)
	skip_label.add_theme_color_override("font_color", Color("2ee6d6", 0.6))
	skip_label.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(skip_label)
	_next_cut()

func _process(dt: float) -> void:
	_age += dt
	skip_label.text = Text.t("intro.skip")

func _next_cut() -> void:
	cut += 1
	if cut >= CUTS.size():
		_finish()
		return
	var c: Dictionary = CUTS[cut]
	art.texture = load(c.art)
	label.text = Text.t(c.text)
	label.add_theme_color_override("font_color", Color("ff8a2a") if c.get("em", false) else Color("e6f2f1"))
	_tw = create_tween()
	_tw.tween_property(art, "modulate:a", 1.0, FADE)
	_tw.tween_property(label, "modulate:a", 1.0, FADE)
	_tw.tween_interval(float(c.hold))
	_tw.tween_property(label, "modulate:a", 0.0, FADE)
	_tw.parallel().tween_property(art, "modulate:a", 0.0, FADE)
	_tw.tween_callback(_next_cut)

func _input(event: InputEvent) -> void:
	if done or _age < IGNORE_S:
		return
	if (event is InputEventKey and event.pressed and not event.echo) or (event is InputEventMouseButton and event.pressed):
		skipped = true
		get_viewport().set_input_as_handled()
		_finish()

func _finish() -> void:
	if done:
		return
	done = true
	if _tw:
		_tw.kill()
	Save.settings.intro_seen = true
	Save.settings.intro_force = false
	Save.save_settings()
	finished.emit()
