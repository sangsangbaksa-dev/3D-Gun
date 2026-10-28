extends CanvasLayer
## Skill tree window (src/tycoon2d/view/panel.ts skills tab): 19 nodes in four branches, bought with skill points.
## Tab opens it in a sortie (the game pauses) and the headquarters has a button for it. Rules live in skills.gd.
## Points earned in a run are banked when it ends, so what you can spend here is the wallet; changes apply from the next sortie.

const Skills := preload("res://scripts/skills.gd")
const UiKit := preload("res://scripts/ui_kit.gd")
const BRANCHES := ["생존", "채집", "연구", "사령"]

## The game scene when opened in a sortie (pauses it); null in the headquarters.
var game: Node
var on_change := Callable() # 구매·초기화 뒤에 부르는 콜백 (본부가 지갑을 다시 그리게)
var panel_ref: Control
var list: VBoxContainer
var lbl_points: Label
var lbl_run: Label
var lbl_title: Label
var btn_reset: Button
var btn_close: Button
var lbl_hint: Label

func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	layer = 6
	var center := UiKit.modal(self)
	var panel := UiKit.panel(UiKit.TEAL)
	UiKit.fit_width(panel, 860)
	panel_ref = panel
	center.add_child(panel)
	var col := VBoxContainer.new()
	col.add_theme_constant_override("separation", 8)
	panel.add_child(col)
	var head := HBoxContainer.new()
	head.add_theme_constant_override("separation", 14)
	col.add_child(head)
	lbl_title = UiKit.label("", 26, Color.WHITE)
	lbl_title.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	head.add_child(lbl_title)
	lbl_points = UiKit.label("", 20, Color(0.79, 0.65, 1.0), HORIZONTAL_ALIGNMENT_RIGHT)
	head.add_child(lbl_points)
	lbl_run = UiKit.label("", 14, Color(UiKit.TEXT, 0.75))
	col.add_child(lbl_run)
	var scroll := ScrollContainer.new()
	scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	scroll.custom_minimum_size = Vector2(0, 380)
	scroll.size_flags_vertical = Control.SIZE_EXPAND_FILL
	col.add_child(scroll)
	list = VBoxContainer.new()
	list.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	list.add_theme_constant_override("separation", 5)
	scroll.add_child(list)
	var foot := HBoxContainer.new()
	foot.add_theme_constant_override("separation", 12)
	col.add_child(foot)
	lbl_hint = UiKit.label("", 13, Color(UiKit.TEXT, 0.55))
	lbl_hint.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	foot.add_child(lbl_hint)
	btn_reset = UiKit.button("", Vector2(150, 38))
	btn_reset.pressed.connect(_reset)
	foot.add_child(btn_reset)
	btn_close = UiKit.button("", Vector2(110, 38), true)
	btn_close.pressed.connect(close)
	foot.add_child(btn_close)
	visible = false
	I18n.locale_changed.connect(_rebuild)

func _unhandled_input(event: InputEvent) -> void:
	if not (event is InputEventKey and event.pressed and not event.echo):
		return
	if event.keycode == KEY_TAB and game != null and not game.player.dead and game.phase != "ended" and (visible or not get_tree().paused):
		toggle()
		get_viewport().set_input_as_handled()
	elif event.keycode == KEY_ESCAPE and visible:
		close()
		get_viewport().set_input_as_handled()

func toggle() -> void:
	if visible:
		close()
	else:
		open()

func open() -> void:
	visible = true
	if game != null:
		get_tree().paused = true
		Input.mouse_mode = Input.MOUSE_MODE_VISIBLE
	_rebuild()
	UiKit.pop_in(panel_ref)

func close() -> void:
	visible = false
	if game != null:
		get_tree().paused = false
		Input.mouse_mode = Input.MOUSE_MODE_CAPTURED

func _points() -> int:
	return floori(Save.wallet("skillPoints"))

func _buy(id: String) -> void:
	if Skills.buy(Save.meta, id) == "ok":
		Save.save_meta()
		Sfx.play("build")
		_changed()

func _reset() -> void:
	var n := Skills.refund(Save.meta)
	if n > 0:
		Save.save_meta()
		_changed()

func _changed() -> void:
	_rebuild()
	if on_change.is_valid():
		on_change.call()

func _rebuild() -> void:
	if not visible:
		return
	lbl_title.text = Skills.tx("skill.title")
	lbl_points.text = Skills.tx("skill.points", {"n": _points()})
	btn_reset.text = Skills.tx("skill.reset")
	btn_close.text = Skills.tx("skill.close")
	lbl_hint.text = Skills.tx("skill.hint")
	lbl_run.visible = game != null
	if game != null:
		var lv := Skills.run_level(game)
		lbl_run.text = Skills.tx("skill.run", {"lv": lv, "xp": floori(float(game.get_meta("run_xp").xp)), "next": floori(Skills.xp_to_next(lv)), "sp": Skills.run_points(game)})
	for c in list.get_children():
		c.queue_free()
	for b in BRANCHES:
		list.add_child(UiKit.label(Skills.tx("skill.branch." + b), 16, UiKit.ORANGE))
		for s in Skills.defs():
			if s.branch == b:
				_row(s)

func _row(s: Dictionary) -> void:
	var lv := Skills.level(Save.meta, s.id)
	var row := UiKit.row_card(list)
	var info := VBoxContainer.new()
	info.add_theme_constant_override("separation", 1)
	info.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	row.add_child(info)
	var nm := UiKit.label("%s   Lv %d/%d" % [Skills.name_of(s.id), lv, int(s.max)], 18, Color(0.4, 1, 0.9) if lv > 0 else Color.WHITE)
	info.add_child(nm)
	var d := UiKit.label(Skills.desc_of(s.id), 13, Color(UiKit.TEXT, 0.7))
	d.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	info.add_child(d)
	var btn := UiKit.button("", Vector2(130, 36))
	if lv >= int(s.max):
		btn.text = Skills.tx("skill.max")
		btn.disabled = true
	else:
		var c := Skills.cost(Save.meta, s.id)
		btn.text = Skills.tx("skill.buy", {"n": c})
		btn.disabled = _points() < c
		btn.pressed.connect(_buy.bind(s.id))
	row.add_child(btn)
