extends CanvasLayer
## Settings and controls window (port of the title's 설정 / 조작키 panels, src/title/title.ts + src/ui/keys.ts).
## Opened from the title screen and from the pause menu. Volume, mouse sensitivity and language are saved in Save.settings.

signal closed

const UiKit := preload("res://scripts/ui_kit.gd")
const Text := preload("res://scripts/tutorial_text.gd")

## [keys, action string, group]. A key starting with "@" is looked up in I18n.
const BINDS := [
	[["W", "A", "S", "D"], "keys.bind.move", "move"],
	[["Shift"], "keys.bind.roll", "move"],
	[["Space"], "keys.bind.jump", "move"],
	[["@key.mouse"], "keys.bind.look", "move"],
	[["@key.lmb"], "keys.bind.shoot", "combat"],
	[["@key.rmb"], "keys.bind.ads", "combat"],
	[["R"], "keys.bind.reload", "combat"],
	[["1–6"], "keys.bind.weapons", "combat"],
	[["V"], "keys.bind.shop", "combat"],
	[["B"], "keys.bind.buildMode", "base"],
	[["1–7"], "keys.bind.buildPick", "base"],
	[["@key.lmb"], "keys.bind.buildPlace", "base"],
	[["@key.rmb", "X"], "keys.bind.demolish", "base"],
	[["F"], "keys.bind.repair", "base"],
	[["U"], "keys.bind.upgrade", "base"],
	[["E"], "keys.bind.interact", "base"],
	[["N"], "keys.bind.wave", "base"],
	[["P", "Esc"], "keys.bind.pause", "system"],
	[["@key.click"], "keys.bind.resume", "system"],
]
const GROUPS_LEFT := ["move", "combat"]
const GROUPS_RIGHT := ["base", "system"]

var page := "settings"
var body: VBoxContainer
var vol_slider: HSlider
var sens_slider: HSlider
var vol_val: Label
var sens_val: Label

func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	layer = 9
	I18n.locale_changed.connect(_rebuild)
	_rebuild()

func show_page(p: String) -> void:
	page = p
	_rebuild()

func _rebuild() -> void:
	for c in get_children():
		c.queue_free()
	var center := UiKit.modal(self, 0.6)
	var panel := UiKit.panel(UiKit.TEAL)
	panel.custom_minimum_size = Vector2(860 if page == "controls" else 600, 0)
	center.add_child(panel)
	body = VBoxContainer.new()
	body.add_theme_constant_override("separation", 12)
	panel.add_child(body)
	if page == "controls":
		_controls()
	else:
		_settings()

func _rule() -> void:
	var line := ColorRect.new()
	line.color = Color(UiKit.TEAL, 0.25)
	line.custom_minimum_size = Vector2(0, 1)
	body.add_child(line)

func _buttons(items: Array) -> void:
	var r := HBoxContainer.new()
	r.alignment = BoxContainer.ALIGNMENT_CENTER
	r.add_theme_constant_override("separation", 12)
	body.add_child(r)
	for it in items:
		var b := UiKit.button(it[0], Vector2(150, 42), it.size() > 2 and it[2])
		b.pressed.connect(it[1])
		r.add_child(b)

# ── 설정 ─────────────────────────────────────────────────────────────

func _settings() -> void:
	body.add_child(UiKit.label(I18n.t("settings.title"), 26, Color.WHITE, HORIZONTAL_ALIGNMENT_CENTER))
	_rule()
	var v := _slider_row(I18n.t("settings.volume"), 0.0, 1.0, float(Save.settings.volume))
	vol_slider = v[0]
	vol_val = v[1]
	vol_val.text = "%d%%" % roundi(vol_slider.value * 100.0)
	vol_slider.value_changed.connect(func(x: float):
		Save.settings.volume = x
		Sfx.set_volume(x)
		vol_val.text = "%d%%" % roundi(x * 100.0)
		Save.save_settings())
	var s := _slider_row(I18n.t("settings.sensitivity"), 0.3, 3.0, float(Save.settings.sensitivity))
	sens_slider = s[0]
	sens_val = s[1]
	sens_val.text = "×%.2f" % sens_slider.value
	sens_slider.value_changed.connect(func(x: float):
		Save.settings.sensitivity = x
		sens_val.text = "×%.2f" % x
		Save.save_settings())
	var row := UiKit.row_card(body)
	row.add_child(_expand_label(I18n.t("settings.language")))
	var lang := UiKit.button(I18n.t("title.lang"), Vector2(150, 38))
	lang.pressed.connect(func():
		I18n.toggle()
		Save.settings.locale = I18n.locale
		Save.save_settings())
	row.add_child(lang)
	var trow := UiKit.row_card(body)
	trow.add_child(_expand_label(Text.t("settings.tutorial")))
	var tcheck := CheckButton.new()
	tcheck.button_pressed = bool(Save.settings.get("tutorial", true))
	tcheck.toggled.connect(func(on: bool):
		Save.settings.tutorial = on
		Save.save_settings())
	trow.add_child(tcheck)
	var rrow := UiKit.row_card(body)
	var rlabel := _expand_label(Text.t("settings.replay"))
	rrow.add_child(rlabel)
	var replay := UiKit.button("▶", Vector2(150, 38))
	replay.pressed.connect(func():
		Save.settings.intro_seen = false
		Save.settings.intro_force = true
		Save.settings.tutorial = true
		Save.settings.tutorial_force = true
		Save.save_settings()
		replay.text = Text.t("settings.replayDone"))
	rrow.add_child(replay)
	_buttons([
		[I18n.t("settings.reset"), _reset],
		[I18n.t("title.controls"), show_page.bind("controls")],
		[I18n.t("settings.close"), close, true],
	])

func _expand_label(text: String) -> Label:
	var l := UiKit.label(text, 18, Color.WHITE)
	l.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	l.size_flags_vertical = Control.SIZE_SHRINK_CENTER
	return l

## One card: name on the left, slider in the middle, value on the right. Returns [slider, value label].
func _slider_row(name: String, lo: float, hi: float, val: float) -> Array:
	var row := UiKit.row_card(body)
	row.add_child(_expand_label(name))
	var sl := HSlider.new()
	sl.custom_minimum_size = Vector2(200, 30)
	sl.size_flags_vertical = Control.SIZE_SHRINK_CENTER
	sl.min_value = lo
	sl.max_value = hi
	sl.step = 0.05
	sl.value = val
	row.add_child(sl)
	var vl := UiKit.label("", 16, UiKit.TEAL, HORIZONTAL_ALIGNMENT_RIGHT)
	vl.custom_minimum_size = Vector2(64, 0)
	vl.size_flags_vertical = Control.SIZE_SHRINK_CENTER
	row.add_child(vl)
	return [sl, vl]

func _reset() -> void:
	Save.settings.volume = 0.8
	Save.settings.sensitivity = 1.0
	Sfx.set_volume(0.8)
	Save.save_settings()
	_rebuild()

# ── 조작키 ───────────────────────────────────────────────────────────

func _controls() -> void:
	body.add_child(UiKit.label(I18n.t("controls.title"), 26, Color.WHITE, HORIZONTAL_ALIGNMENT_CENTER))
	_rule()
	var cols := HBoxContainer.new()
	cols.add_theme_constant_override("separation", 36)
	body.add_child(cols)
	for groups in [GROUPS_LEFT, GROUPS_RIGHT]:
		var col := VBoxContainer.new()
		col.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		col.add_theme_constant_override("separation", 14)
		cols.add_child(col)
		for g in groups:
			_group(col, g)
	body.add_child(UiKit.label(I18n.t("controls.hint"), 14, Color(UiKit.TEXT, 0.65), HORIZONTAL_ALIGNMENT_CENTER))
	_buttons([[I18n.t("controls.back"), show_page.bind("settings"), true]])

func _group(col: VBoxContainer, g: String) -> void:
	var box := VBoxContainer.new()
	box.add_theme_constant_override("separation", 6)
	col.add_child(box)
	box.add_child(UiKit.label(I18n.t("keys.group." + g).to_upper(), 14, UiKit.TEAL))
	for b in BINDS:
		if b[2] != g:
			continue
		var r := HBoxContainer.new()
		r.add_theme_constant_override("separation", 10)
		box.add_child(r)
		var keys := HBoxContainer.new()
		keys.custom_minimum_size = Vector2(132, 0)
		keys.add_theme_constant_override("separation", 4)
		r.add_child(keys)
		for k in b[0]:
			keys.add_child(_keycap(I18n.t(k.substr(1)) if k.begins_with("@") else k))
		var act := UiKit.label(I18n.t(b[1]), 14, UiKit.TEXT)
		act.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		act.size_flags_vertical = Control.SIZE_SHRINK_CENTER
		act.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
		r.add_child(act)

func _keycap(text: String) -> Control:
	var p := PanelContainer.new()
	p.size_flags_vertical = Control.SIZE_SHRINK_CENTER
	var sb := UiKit.box(Color8(0x16, 0x20, 0x27), Color(UiKit.TEAL, 0.5), 5, 1, Vector4(8, 2, 8, 3))
	sb.border_width_bottom = 3
	p.add_theme_stylebox_override("panel", sb)
	p.add_child(UiKit.label(text, 13, Color("e9fbf9"), HORIZONTAL_ALIGNMENT_CENTER))
	return p

# ── 닫기 ─────────────────────────────────────────────────────────────

func close() -> void:
	closed.emit()
	queue_free()

func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventKey and event.pressed:
		if not event.echo and event.keycode == KEY_ESCAPE:
			if page == "controls":
				show_page("settings")
			else:
				close()
		get_viewport().set_input_as_handled()
