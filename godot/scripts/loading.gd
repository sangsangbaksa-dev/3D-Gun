extends CanvasLayer
## 로딩 화면. 장면을 바꾸는 동안(무거운 장면은 몇 초 멈춤) 검은 막과 "로딩 중" 을 먼저 그려서 멈춘 것처럼 보이지 않게 한다.
## 사용: Loading.go("res://scenes/game.tscn")  — get_tree().change_scene_to_file 대신.
## 웹 빌드에서는 첫 화면이 그려진 뒤 페이지의 로딩 화면(web/shell.html)도 걷어 낸다.

var _veil: ColorRect
var _label: Label
var _busy := false

func _ready() -> void:
	layer = 100
	process_mode = Node.PROCESS_MODE_ALWAYS
	_veil = ColorRect.new()
	_veil.color = Color("07090d")
	_veil.set_anchors_preset(Control.PRESET_FULL_RECT)
	_veil.mouse_filter = Control.MOUSE_FILTER_STOP
	_veil.visible = false
	add_child(_veil)
	_label = Label.new()
	_label.set_anchors_preset(Control.PRESET_FULL_RECT)
	_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	_label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	_label.add_theme_font_size_override("font_size", 26)
	_label.add_theme_color_override("font_color", Color("ffb070"))
	_veil.add_child(_label)
	_web_ready_when_drawn()

func _process(_dt: float) -> void:
	if _veil.visible:
		var dots := int(Time.get_ticks_msec() / 350) % 4
		_label.text = ("로딩 중" if I18n.locale == "ko" else "LOADING") + ".".repeat(dots)

## 장면을 바꾼다. 막을 먼저 그린 뒤 바꾸고, 새 장면이 몇 프레임 그려지면 막을 걷는다.
func go(path: String) -> void:
	if _busy:
		return
	_busy = true
	_veil.modulate.a = 1.0
	_veil.visible = true
	get_tree().paused = false
	await get_tree().process_frame
	await get_tree().process_frame
	get_tree().change_scene_to_file(path)
	for i in 4:
		await get_tree().process_frame
	var tw := create_tween()
	tw.tween_property(_veil, "modulate:a", 0.0, 0.3)
	await tw.finished
	_veil.visible = false
	_busy = false

func _web_ready_when_drawn() -> void:
	if not OS.has_feature("web"):
		return
	for i in 6:
		await get_tree().process_frame
	JavaScriptBridge.eval("if (window.__gdReady) window.__gdReady();")
