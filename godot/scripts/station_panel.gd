extends CanvasLayer
## E at a research lab (craft vaccines) or a shop (exchange resources), like the web game's lab panel
## (src/allies/view/labPanel.ts) and exchange. The game pauses while it is open; Esc / E closes it.

var game: Node
var kind := ""
var root: Control
var title: Label
var body: VBoxContainer
var foot: Label

func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	layer = 4
	root = Control.new()
	root.set_anchors_preset(Control.PRESET_FULL_RECT)
	add_child(root)
	var dim := ColorRect.new()
	dim.color = Color(0, 0, 0, 0.55)
	dim.set_anchors_preset(Control.PRESET_FULL_RECT)
	root.add_child(dim)
	var panel := PanelContainer.new()
	var sb := StyleBoxFlat.new()
	sb.bg_color = Color(0.05, 0.08, 0.08, 0.96)
	sb.border_color = Color("2ee6d6")
	sb.set_border_width_all(2)
	sb.set_corner_radius_all(8)
	sb.set_content_margin_all(18)
	panel.add_theme_stylebox_override("panel", sb)
	panel.set_anchors_preset(Control.PRESET_CENTER)
	panel.position = Vector2(-340, -240)
	panel.custom_minimum_size = Vector2(680, 460)
	root.add_child(panel)
	var col := VBoxContainer.new()
	col.add_theme_constant_override("separation", 10)
	panel.add_child(col)
	title = Label.new()
	title.add_theme_font_size_override("font_size", 28)
	col.add_child(title)
	body = VBoxContainer.new()
	body.add_theme_constant_override("separation", 8)
	body.size_flags_vertical = Control.SIZE_EXPAND_FILL
	col.add_child(body)
	foot = Label.new()
	foot.add_theme_font_size_override("font_size", 14)
	foot.modulate.a = 0.7
	col.add_child(foot)
	visible = false
	I18n.locale_changed.connect(_rebuild)

func open(k: String) -> void:
	kind = k
	visible = true
	get_tree().paused = true
	Input.mouse_mode = Input.MOUSE_MODE_VISIBLE
	_rebuild()

func close() -> void:
	visible = false
	get_tree().paused = false
	Input.mouse_mode = Input.MOUSE_MODE_CAPTURED

func _unhandled_input(event: InputEvent) -> void:
	if visible and event is InputEventKey and event.pressed and not event.echo and (event.keycode == KEY_ESCAPE or event.keycode == KEY_E):
		close()
		get_viewport().set_input_as_handled()

func _btn(text: String, enabled: bool, cb: Callable) -> Button:
	var b := Button.new()
	b.text = text
	b.disabled = not enabled
	b.custom_minimum_size = Vector2(110, 38)
	b.pressed.connect(cb)
	return b

func _row(left: String, sub: String) -> HBoxContainer:
	var r := HBoxContainer.new()
	r.add_theme_constant_override("separation", 12)
	var v := VBoxContainer.new()
	v.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	var a := Label.new()
	a.text = left
	a.add_theme_font_size_override("font_size", 20)
	v.add_child(a)
	var b := Label.new()
	b.text = sub
	b.add_theme_font_size_override("font_size", 14)
	b.modulate.a = 0.75
	v.add_child(b)
	r.add_child(v)
	body.add_child(r)
	return r

func _rebuild() -> void:
	if not visible:
		return
	for c in body.get_children():
		c.queue_free()
	if kind == "lab":
		_lab()
	else:
		_exchange()

# ── 연구소: 백신 제작 ────────────────────────────────────────────────

func _lab() -> void:
	var al: Node = game.allies
	title.text = al.tt("lab.title")
	for t in al.data.vaccines.size():
		var c: Dictionary = al.vaccine_cost(t)
		var ok: bool = al.can_afford_vaccine(c) and al.craft_queue.size() < 9
		var r := _row("%s  ×%d  (%d%%)" % [al.vac_name(t), int(al.data.vaccines[t].uses), roundi(float(al.data.vaccines[t].rate) * 100.0)], al.vaccine_cost_text(c))
		r.add_child(_btn(al.tt("lab.craft"), ok, func(): al.enqueue_craft(t); _rebuild()))
	var q: int = al.craft_queue.size()
	var st: String = al.tt("lab.queue", {"n": q, "left": snappedf(al.craft_left(), 0.1)}) if q > 0 else al.tt("lab.idle")
	foot.text = "%s   ·   %s   ·   %s" % [st, al.tt("lab.have", {"a": al.vaccines[0], "b": al.vaccines[1], "c": al.vaccines[2]}), al.tt("lab.samples", {"s": game.samples, "sp": game.samples_sp})]

# ── 상점: 자원 교환 ──────────────────────────────────────────────────

func _exchange() -> void:
	title.text = game.allies.tt("shop.title")
	for r in GameData.res.keys:
		var buy: int = int(GameData.res.buyPrice[r])
		var sell: int = game.allies.sell_unit(r)
		var row := _row("%s  %d" % [I18n.res_name(r), int(game.res[r])], game.allies.tt("shop.prices", {"sell": sell, "buy": buy}))
		row.add_child(_btn(game.allies.tt("shop.sell"), int(game.res[r]) > 0, func(): game.res[r] -= 1; game.coins += sell; Sfx.play("gather"); _rebuild()))
		row.add_child(_btn(game.allies.tt("shop.buy"), game.coins >= buy, func(): game.res[r] += 1; game.coins -= buy; Sfx.play("gather"); _rebuild()))
	foot.text = game.allies.tt("shop.coins", {"n": game.coins})
