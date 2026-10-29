extends Node
## 첫 출격 단계형 힌트 화면 (규칙은 tutorial.gd). 화면 왼쪽에 작은 카드 하나만 띄우고, 입력은 가로채지 않는다(비차단).
## 플레이어가 하는 일을 지켜보다가(걸음, 시점, 사격, 재장전, 채집, 건설, 웨이브, 아군) 조건이 차면 다음 단계로 넘긴다.
## H 로 지금 힌트를 넘기고, 설정 창에서 끌 수 있다. game.gd 는 한 줄만 한다: TutorialHud.apply(self)

const Rules := preload("res://scripts/tutorial.gd")
const Text := preload("res://scripts/tutorial_text.gd")
const UiKit := preload("res://scripts/ui_kit.gd")

var game: Node
var rules := Rules.new()
var obs := {"moved": 0.0, "turned": 0.0, "shots": 0, "reloads": 0, "core_dwell": 0.0, "gathered": 0, "built": 0, "wave": 0, "prep": true, "allies": 0}
var layer: CanvasLayer
var card: PanelContainer
var lbl_step: Label
var lbl_title: Label
var lbl_body: Label
var lbl_skip: Label
var keys_row: HBoxContainer
var shown_id := ""
var active := false
var _last_pos := Vector3.ZERO
var _last_yaw := 0.0
var _last_pitch := 0.0
var _was_reloading := false
var _built0 := 0

## 첫 출격이 아니거나 설정에서 껐으면 아무것도 만들지 않고 null.
static func apply(g: Node) -> Node:
	if not Rules.enabled(Save.settings, Save.meta):
		return null
	var s = (load("res://scripts/tutorial_hud.gd") as GDScript).new()
	s.game = g
	s.name = "TutorialHud"
	g.add_child(s)
	return s

func _ready() -> void:
	active = true
	layer = CanvasLayer.new()
	layer.layer = 3
	add_child(layer)
	_build_card()
	var p: Node3D = game.player
	_last_pos = p.global_position
	_last_yaw = p.rotation.y
	_last_pitch = p.camera.rotation.x
	_built0 = game.base.structures.size()
	p.fired.connect(func(_a, _b, _c, _d, _e, _f): obs.shots += 1)
	game.gathering.gathered.connect(func(_r, _n, _p): obs.gathered += 1)
	I18n.locale_changed.connect(func(): _show(rules.current(), false))
	_show(rules.current(), true)

func _build_card() -> void:
	card = PanelContainer.new()
	card.mouse_filter = Control.MOUSE_FILTER_IGNORE
	card.anchor_top = 0.36
	card.anchor_bottom = 0.36
	card.offset_left = 16
	card.custom_minimum_size = Vector2(330, 0)
	card.add_theme_stylebox_override("panel", UiKit.box(Color(0.05, 0.08, 0.1, 0.78), Color(UiKit.TEAL, 0.55), 10, 1, Vector4(16, 12, 16, 12)))
	layer.add_child(card)
	var v := VBoxContainer.new()
	v.mouse_filter = Control.MOUSE_FILTER_IGNORE
	v.add_theme_constant_override("separation", 6)
	card.add_child(v)
	lbl_step = UiKit.label("", 12, Color(UiKit.TEAL, 0.85))
	lbl_title = UiKit.label("", 20, Color.WHITE)
	lbl_body = UiKit.label("", 14, UiKit.TEXT)
	lbl_body.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	keys_row = HBoxContainer.new()
	keys_row.mouse_filter = Control.MOUSE_FILTER_IGNORE
	keys_row.add_theme_constant_override("separation", 6)
	lbl_skip = UiKit.label("", 11, Color(UiKit.TEXT, 0.5))
	for c in [lbl_step, lbl_title, lbl_body, keys_row, lbl_skip]:
		if c is Label:
			c.mouse_filter = Control.MOUSE_FILTER_IGNORE
		v.add_child(c)

func _keycap(text: String) -> Control:
	var p := PanelContainer.new()
	p.mouse_filter = Control.MOUSE_FILTER_IGNORE
	var sb := UiKit.box(Color8(0x16, 0x20, 0x27), Color(UiKit.TEAL, 0.6), 5, 1, Vector4(8, 2, 8, 3))
	sb.border_width_bottom = 3
	p.add_theme_stylebox_override("panel", sb)
	var l := UiKit.label(text, 13, Color("e9fbf9"), HORIZONTAL_ALIGNMENT_CENTER)
	l.mouse_filter = Control.MOUSE_FILTER_IGNORE
	p.add_child(l)
	return p

## 카드를 id 단계 내용으로 바꾼다. fade: 새로 뜨는 단계라 부드럽게 나타낸다.
func _show(id: String, fade: bool) -> void:
	if id == "":
		card.visible = false
		shown_id = ""
		return
	shown_id = id
	card.visible = true
	lbl_step.text = Text.t("step", {"i": rules.index + 1, "n": Rules.STEPS.size()})
	lbl_title.text = Text.t(id + ".title")
	lbl_body.text = Text.t(id + ".body")
	lbl_skip.text = Text.t("skip")
	for c in keys_row.get_children():
		keys_row.remove_child(c)
		c.queue_free()
	var ks := Text.t(id + ".keys")
	if ks != "":
		for k in ks.split("|"):
			keys_row.add_child(_keycap(k))
	keys_row.visible = ks != ""
	if fade:
		card.modulate.a = 0.0
		create_tween().tween_property(card, "modulate:a", 1.0, 0.4)

func _process(dt: float) -> void:
	step(dt)

## 한 프레임: 관측을 모으고 규칙에 먹여 단계가 바뀌면 카드를 갈아 끼운다. (테스트가 직접 부를 수 있다)
func step(dt: float) -> void:
	if not active or rules.finished:
		return
	var p: Node3D = game.player
	if p.dead or game.phase == "ended":
		card.visible = false
		return
	card.visible = shown_id != ""
	var d: Vector3 = p.global_position - _last_pos
	d.y = 0.0
	if d.length() < 5.0: # 순간이동·리스폰은 걸음으로 치지 않는다
		obs.moved += d.length()
	_last_pos = p.global_position
	obs.turned += absf(wrapf(p.rotation.y - _last_yaw, -PI, PI)) + absf(p.camera.rotation.x - _last_pitch)
	_last_yaw = p.rotation.y
	_last_pitch = p.camera.rotation.x
	var reloading: bool = p.reload_left > 0.0
	if reloading and not _was_reloading:
		obs.reloads += 1
	_was_reloading = reloading
	if rules.current() == "core":
		obs.core_dwell += dt
	obs.built = maxi(game.base.structures.size() - _built0, 0)
	obs.wave = game.wave
	obs.prep = game.phase == "prep"
	obs.allies = game.allies.list().size()
	if not rules.update(obs, dt).is_empty():
		_advance()

func _advance() -> void:
	Sfx.play("click")
	if rules.finished:
		_show("", false)
		active = false
		if Save.settings.get("tutorial_force", false):
			Save.settings.tutorial_force = false
			Save.save_settings()
		return
	_show(rules.current(), true)

func _unhandled_input(event: InputEvent) -> void:
	if active and not rules.finished and event is InputEventKey and event.pressed and not event.echo and event.keycode == KEY_H:
		rules.skip()
		_advance()
