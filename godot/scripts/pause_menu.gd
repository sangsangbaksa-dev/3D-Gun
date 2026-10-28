extends CanvasLayer
## P / Esc pause (src/core/game.ts pause banner): Resume, Settings, Controls, Back to title.
## Also opens by itself when the mouse is released in the middle of a sortie, like the web game's pointer-lock pause.

const UiKit := preload("res://scripts/ui_kit.gd")
const SettingsScript := preload("res://scripts/settings_panel.gd")

var game: Node
var root: Control
var open := false
var _was_captured := false
var _settings: Node

func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	layer = 7
	visible = false
	I18n.locale_changed.connect(_build)

func _unhandled_input(event: InputEvent) -> void:
	if not (event is InputEventKey and event.pressed and not event.echo):
		return
	if event.keycode != KEY_P and event.keycode != KEY_ESCAPE:
		return
	if open and _settings == null:
		resume()
		get_viewport().set_input_as_handled()
	elif not open and _can_pause():
		pause()
		get_viewport().set_input_as_handled()

func _can_pause() -> bool:
	return not get_tree().paused and not game.player.dead and game.phase != "ended"

## A released mouse during play (Esc on the web, alt-tab) opens the pause menu.
func _process(_dt: float) -> void:
	var captured := Input.mouse_mode == Input.MOUSE_MODE_CAPTURED
	if _was_captured and not captured and not open and _can_pause():
		pause()
	_was_captured = captured

func pause() -> void:
	open = true
	visible = true
	get_tree().paused = true
	Input.mouse_mode = Input.MOUSE_MODE_VISIBLE
	_build()

func resume() -> void:
	open = false
	visible = false
	get_tree().paused = false
	Input.mouse_mode = Input.MOUSE_MODE_CAPTURED

func _build() -> void:
	if not open:
		return
	if root:
		root.queue_free()
	var center := UiKit.modal(self, 0.55)
	root = center.get_parent()
	var panel := UiKit.panel(UiKit.TEAL)
	panel.custom_minimum_size = Vector2(380, 0)
	center.add_child(panel)
	var col := VBoxContainer.new()
	col.add_theme_constant_override("separation", 12)
	panel.add_child(col)
	col.add_child(UiKit.label(I18n.t("pause.title"), 30, Color.WHITE, HORIZONTAL_ALIGNMENT_CENTER))
	var line := ColorRect.new()
	line.color = Color(UiKit.TEAL, 0.25)
	line.custom_minimum_size = Vector2(0, 1)
	col.add_child(line)
	var items := [
		[I18n.t("pause.resume"), resume, true],
		[I18n.t("title.settings"), _open_settings.bind("settings"), false],
		[I18n.t("title.controls"), _open_settings.bind("controls"), false],
		[I18n.t("death.back"), _to_title, false],
	]
	for it in items:
		var b := UiKit.button(it[0], Vector2(0, 44), it[2], 18)
		b.pressed.connect(it[1])
		col.add_child(b)
	col.add_child(UiKit.label(I18n.t("pause.hint"), 14, Color(UiKit.TEXT, 0.6), HORIZONTAL_ALIGNMENT_CENTER))
	(col.get_child(2) as Control).grab_focus()

func _open_settings(page: String) -> void:
	_settings = SettingsScript.new()
	add_child(_settings)
	_settings.show_page(page)
	_settings.closed.connect(func(): _settings = null)

func _to_title() -> void:
	open = false
	get_tree().paused = false
	Loading.go("res://scenes/title.tscn")
