extends Node
## HUD look of the web game (src/player/view/hud.ts, src/ui/keybar.ts): dark glass pills with a thin teal edge,
## the 3D-GUN logo chip, wave + resources centred at the top, HP/core panel bottom-left, gun panel bottom-right.
## Visual only: it restyles and re-places the labels and bars game.gd builds and never changes their text or values.
## Hooked from game.gd with HudStyle.apply(self) after the HUD is built.

const PANEL := Color8(0x12, 0x1a, 0x20, 0xb3)
const PANEL_SOLID := Color8(0x12, 0x1a, 0x20, 0xd9)
const TEAL := Color8(0x2e, 0xe6, 0xd6)
const ORANGE := Color8(0xff, 0x8a, 0x2a)
const RED := Color8(0xe0, 0x30, 0x3a)
const TEXT := Color8(0xd6, 0xe4, 0xe8)

var game: Node
var hud: Control
var _pills: Array = [] # [label, panel, pad]
var _hp_label: Label
var _hp_panel: Panel
var _gun_panel: Panel

static func apply(g: Node) -> void:
	var s = (load("res://scripts/hud_style.gd") as GDScript).new()
	s.game = g
	s.name = "HudStyle"
	g.add_child(s)

static func box(bg: Color, edge: Color, radius := 10, border := 1, margin := Vector4.ZERO) -> StyleBoxFlat:
	var sb := StyleBoxFlat.new()
	sb.content_margin_left = margin.x
	sb.content_margin_top = margin.y
	sb.content_margin_right = margin.z
	sb.content_margin_bottom = margin.w
	sb.bg_color = bg
	sb.border_color = edge
	sb.set_border_width_all(border)
	sb.set_corner_radius_all(radius)
	sb.anti_aliasing = true
	return sb

func _ready() -> void:
	hud = game.hud
	_logo()
	for l in [game.lbl_top, game.lbl_res, game.lbl_ammo, game.lbl_gun, game.lbl_hint, game.lbl_center, game.lbl_toast,
			game.lbl_core, game.lbl_boss, game.lbl_prompt, game.build_panel, game.build_hover]:
		if l is Label:
			_text_style(l)
	# 위: 웨이브 줄은 가운데 큰 알약, 그 아래 자원 줄
	game.lbl_top.set_anchors_preset(Control.PRESET_TOP_LEFT)
	game.lbl_top.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	game.lbl_top.add_theme_font_size_override("font_size", 20)
	game.lbl_res.set_anchors_preset(Control.PRESET_TOP_LEFT)
	game.lbl_res.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	game.lbl_res.add_theme_font_size_override("font_size", 14)
	game.lbl_res.add_theme_color_override("font_color", TEXT)
	_pill(game.lbl_top, box(PANEL, Color(TEAL, 0.25), 99), Vector2(22, 6))
	_pill(game.lbl_res, box(PANEL, Color(TEAL, 0.2), 10), Vector2(14, 4))
	_pill(game.lbl_hint, box(PANEL, Color(TEAL, 0.2), 8), Vector2(10, 4))
	_pill(game.lbl_toast, box(PANEL_SOLID, Color(ORANGE, 0.55), 10), Vector2(18, 6))
	_pill(game.lbl_prompt, box(PANEL_SOLID, Color(ORANGE, 0.55), 8), Vector2(14, 5))
	_pill(game.build_hover, box(PANEL_SOLID, Color(ORANGE, 0.4), 10), Vector2(14, 6))
	_pill(game.build_panel, box(PANEL_SOLID, Color(TEAL, 0.35), 10), Vector2(14, 8))
	game.lbl_hint.modulate.a = 1.0
	game.lbl_hint.add_theme_font_size_override("font_size", 12)
	game.lbl_hint.text_overrun_behavior = TextServer.OVERRUN_TRIM_ELLIPSIS
	game.lbl_hint.clip_text = true
	game.lbl_hint.add_theme_color_override("font_color", TEXT)
	game.lbl_center.add_theme_font_size_override("font_size", 44)
	game.lbl_center.add_theme_color_override("font_color", Color(1, 1, 1))
	game.lbl_center.add_theme_color_override("font_outline_color", Color(RED, 0.6))
	game.lbl_center.add_theme_constant_override("outline_size", 8)
	# 아래 왼쪽: HP·핵 패널
	_hp_panel = Panel.new()
	_hp_panel.add_theme_stylebox_override("panel", box(PANEL, Color(TEAL, 0.2), 10))
	_hp_panel.mouse_filter = Control.MOUSE_FILTER_IGNORE
	hud.add_child(_hp_panel)
	hud.move_child(_hp_panel, _first_label_index())
	_hp_label = Label.new()
	_hp_label.add_theme_font_size_override("font_size", 14)
	_hp_label.add_theme_color_override("font_color", TEXT)
	_text_style(_hp_label)
	hud.add_child(_hp_label)
	_bar_style(game.hp_bar, RED, 10)
	_bar_style(game.core_bar, TEAL, 6)
	_bar_style(game.boss_bar, RED, 14)
	_bar_style(game.gather_bar, Color8(0xff, 0xd2, 0x5a), 8)
	if game.prep_bar:
		_bar_style(game.prep_bar, TEAL, 5)
		game.prep_bar.size = Vector2(300, 5)
	game.hp_bar.size = Vector2(260, 12)
	game.core_bar.size = Vector2(260, 6)
	game.lbl_core.add_theme_font_size_override("font_size", 12)
	game.lbl_core.add_theme_color_override("font_color", TEAL)
	# 아래 오른쪽: 총 패널
	_gun_panel = Panel.new()
	_gun_panel.add_theme_stylebox_override("panel", box(PANEL, Color(TEAL, 0.2), 12))
	_gun_panel.mouse_filter = Control.MOUSE_FILTER_IGNORE
	hud.add_child(_gun_panel)
	hud.move_child(_gun_panel, _first_label_index())
	game.lbl_ammo.add_theme_font_size_override("font_size", 40)
	game.lbl_gun.add_theme_font_size_override("font_size", 15)
	game.lbl_gun.add_theme_color_override("font_color", TEXT)
	game.lbl_gun.modulate.a = 1.0
	_late.call_deferred()

## Labels other systems add to the HUD later (allies.gd's vaccine line) get the same pill.
func _late() -> void:
	var a = game.get("allies")
	if a != null and a.get("_lbl_vac") is Label:
		var l: Label = a._lbl_vac
		_text_style(l)
		l.position = Vector2(26, 82)
		_pill(l, box(PANEL, Color(TEAL, 0.2), 8), Vector2(10, 3))
		var pill: Panel = _pills[-1][1]
		pill.reparent(l.get_parent(), false)
		l.get_parent().move_child(pill, l.get_index())

## Index just after the full-screen layers (hurt flash, scope, crosshair) so panels sit under the text.
func _first_label_index() -> int:
	return game.crosshair.get_index() + 1

func _logo() -> void:
	var p := PanelContainer.new()
	p.add_theme_stylebox_override("panel", box(Color(PANEL, 0.85), Color(TEAL, 0.0), 8, 0))
	p.position = Vector2(16, 12)
	p.mouse_filter = Control.MOUSE_FILTER_IGNORE
	var row := HBoxContainer.new()
	row.add_theme_constant_override("separation", 0)
	p.add_child(row)
	var a := Label.new()
	a.text = "3D"
	var b := Label.new()
	b.text = "-GUN"
	b.add_theme_color_override("font_color", TEAL)
	for l in [a, b]:
		l.add_theme_font_size_override("font_size", 16)
		row.add_child(l)
	a.add_theme_color_override("font_color", Color(1, 1, 1))
	hud.add_child(p)

func _text_style(l: Label) -> void:
	l.add_theme_color_override("font_shadow_color", Color(0, 0, 0, 0.75))
	l.add_theme_constant_override("shadow_offset_x", 0)
	l.add_theme_constant_override("shadow_offset_y", 1)
	l.add_theme_constant_override("shadow_outline_size", 3)

func _bar_style(b: ProgressBar, col: Color, h: int) -> void:
	if b == null:
		return
	b.add_theme_stylebox_override("fill", box(col, Color(col, 0.0), 4, 0))
	b.add_theme_stylebox_override("background", box(Color(0, 0, 0, 0.55), Color(1, 1, 1, 0.12), 4))
	b.custom_minimum_size.y = h

func _pill(l: Label, sb: StyleBoxFlat, pad: Vector2) -> void:
	if l == null:
		return
	var p := Panel.new()
	p.add_theme_stylebox_override("panel", sb)
	p.mouse_filter = Control.MOUSE_FILTER_IGNORE
	p.visible = false
	hud.add_child(p)
	hud.move_child(p, _first_label_index())
	_pills.append([l, p, pad])

## Rect of the text actually drawn inside a label (labels here have fixed widths and align their text).
static func text_rect(l: Label) -> Rect2:
	var font := l.get_theme_font("font")
	var fs := l.get_theme_font_size("font_size")
	var sz := font.get_multiline_string_size(l.text, HORIZONTAL_ALIGNMENT_LEFT, -1, fs)
	var w := l.size.x
	sz.x = minf(sz.x, w)
	var x := l.position.x
	match l.horizontal_alignment:
		HORIZONTAL_ALIGNMENT_CENTER:
			x += (w - sz.x) * 0.5
		HORIZONTAL_ALIGNMENT_RIGHT:
			x += w - sz.x
	return Rect2(Vector2(x, l.position.y), Vector2(sz.x, maxf(sz.y, l.size.y if l.size.y < sz.y * 1.6 else sz.y)))

func _process(_dt: float) -> void:
	if hud == null:
		return
	var w := hud.size.x
	var h := hud.size.y
	var lt: Label = game.lbl_top
	lt.size.x = 900
	lt.position = Vector2((w - 900) * 0.5, 14)
	var lr: Label = game.lbl_res
	lr.size.x = 900
	lr.position = Vector2((w - 900) * 0.5, 54)
	# 아래 왼쪽 HP 패널: HP 글자, 체력 막대, 핵 막대와 이름
	_hp_label.text = "HP %d / %d" % [ceili(maxf(0.0, game.player.hp)), int(game.player.max_hp)]
	_hp_label.size.x = 260
	_hp_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	_hp_label.position = Vector2(26, h - 112)
	game.hp_bar.position = Vector2(26, h - 88)
	game.lbl_core.size.x = 260
	game.lbl_core.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	game.lbl_core.position = Vector2(26, h - 70)
	game.core_bar.position = Vector2(26, h - 50)
	_hp_panel.position = Vector2(14, h - 120)
	_hp_panel.size = Vector2(284, 86)
	# 아래 오른쪽 총 패널
	game.lbl_gun.size.x = 234
	game.lbl_gun.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	game.lbl_gun.position = Vector2(w - 250, h - 120)
	game.lbl_ammo.size.x = 234
	game.lbl_ammo.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	game.lbl_ammo.position = Vector2(w - 250, h - 94)
	_gun_panel.position = Vector2(w - 250, h - 134)
	_gun_panel.size = Vector2(234, 100)
	game.lbl_hint.size.x = minf(w - 40.0, 1100.0)
	game.lbl_hint.position = Vector2((w - game.lbl_hint.size.x) * 0.5, h - 30)
	game.lbl_center.position.y = 124
	game.build_panel.position.y = 96 # 위쪽 웨이브·자원 알약 아래로
	for e in _pills:
		var l: Label = e[0]
		var p: Panel = e[1]
		var pad: Vector2 = e[2]
		var show := l.is_visible_in_tree() and l.text.strip_edges() != "" and l.modulate.a > 0.05
		p.visible = show
		if show:
			var r := text_rect(l)
			p.position = r.position - pad
			p.size = r.size + pad * 2.0
			p.modulate.a = l.modulate.a
