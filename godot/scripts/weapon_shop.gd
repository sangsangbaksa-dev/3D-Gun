extends CanvasLayer
## V weapon panel: buy guns and upgrade them with coins (src/player/view/hud.ts weapon panel).
## The game pauses while it is open. Upgrade parts cost comes with gathering; for now only coins are charged.

const UiKit := preload("res://scripts/ui_kit.gd")

var game: Node
var root: Control
var list: VBoxContainer
var lbl_coins: Label
var lbl_title: Label

func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	layer = 4
	var center := UiKit.modal(self)
	root = center.get_parent()
	var panel := UiKit.panel(UiKit.RED)
	panel.custom_minimum_size = Vector2(760, 0)
	center.add_child(panel)
	var col := VBoxContainer.new()
	col.add_theme_constant_override("separation", 12)
	panel.add_child(col)
	lbl_title = UiKit.label("", 26, Color.WHITE, HORIZONTAL_ALIGNMENT_CENTER)
	col.add_child(lbl_title)
	lbl_coins = UiKit.label("", 20, Color(1, 0.85, 0.3), HORIZONTAL_ALIGNMENT_CENTER)
	col.add_child(lbl_coins)
	var line := ColorRect.new()
	line.color = Color(UiKit.RED, 0.35)
	line.custom_minimum_size = Vector2(0, 1)
	col.add_child(line)
	list = VBoxContainer.new()
	list.add_theme_constant_override("separation", 6)
	col.add_child(list)
	visible = false
	I18n.locale_changed.connect(_rebuild)

func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventKey and event.pressed and not event.echo:
		if event.keycode == KEY_V and not game.player.dead:
			toggle()
			get_viewport().set_input_as_handled()
		elif event.keycode == KEY_ESCAPE and visible:
			toggle()
			get_viewport().set_input_as_handled()

func toggle() -> void:
	visible = not visible
	get_tree().paused = visible
	Input.mouse_mode = Input.MOUSE_MODE_VISIBLE if visible else Input.MOUSE_MODE_CAPTURED
	if visible:
		_rebuild()

func _rebuild() -> void:
	if not visible:
		return
	var p = game.player
	lbl_title.text = I18n.t("shop.title")
	lbl_coins.text = I18n.t("hud.coins", {"n": game.coins})
	for c in list.get_children():
		c.queue_free()
	var max_lv: int = int(GameData.gun_upgrade.maxLv)
	for i in GameData.gun_order.size():
		var id: String = GameData.gun_order[i]
		var row := UiKit.row_card(list)
		var info := VBoxContainer.new()
		info.add_theme_constant_override("separation", 2)
		info.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		row.add_child(info)
		var name := Label.new()
		var owned: bool = p.owned.get(id, false)
		var l: int = p.lv[id]
		name.text = "%d  %s" % [i + 1, I18n.gun_name(id)] + ("   Lv %d" % l if owned else "")
		name.add_theme_font_size_override("font_size", 20)
		if id == p.gun_id:
			name.add_theme_color_override("font_color", Color(0.4, 1, 0.9))
		info.add_child(name)
		var desc := Label.new()
		var s: Dictionary = p.stats(id)
		desc.text = "%s  ·  %s %.0f%s  ·  %s %d" % [I18n.gun_desc(id), I18n.t("shop.dmg"), s.dmg, " ×%d" % s.pellets if s.pellets > 1 else "", I18n.t("shop.mag"), s.mag]
		desc.add_theme_font_size_override("font_size", 14)
		desc.modulate.a = 0.75
		info.add_child(desc)
		var btn := UiKit.button("", Vector2(170, 40))
		if not owned:
			var price: int = int(GameData.gun_unlock_gold.get(id, 0))
			btn.text = I18n.t("shop.buy", {"n": price})
			btn.disabled = game.coins < price
			btn.pressed.connect(_buy.bind(id, price))
		elif l >= max_lv:
			btn.text = I18n.t("shop.max")
			btn.disabled = true
		else:
			var cost: int = int(GameData.gun_upgrade.gold[l])
			btn.text = I18n.t("shop.upgrade", {"n": cost})
			btn.disabled = game.coins < cost
			btn.pressed.connect(_upgrade.bind(id, cost))
		row.add_child(btn)
		var eq := UiKit.button(I18n.t("shop.equip"), Vector2(110, 40))
		eq.disabled = not owned or id == p.gun_id
		eq.pressed.connect(func():
			p.switch_weapon(id)
			_rebuild())
		row.add_child(eq)
	var hint := UiKit.label(I18n.t("shop.hint"), 14, Color(UiKit.TEXT, 0.6), HORIZONTAL_ALIGNMENT_CENTER)
	list.add_child(hint)

func _buy(id: String, price: int) -> void:
	if game.coins < price:
		return
	game.coins -= price
	game.player.owned[id] = true
	game.player.refresh_gun(id)
	game.player.switch_weapon(id)
	_rebuild()

func _upgrade(id: String, cost: int) -> void:
	if game.coins < cost:
		return
	game.coins -= cost
	game.player.lv[id] += 1
	game.player.refresh_gun(id)
	_rebuild()
