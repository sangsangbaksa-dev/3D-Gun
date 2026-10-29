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
const UiKit := preload("res://scripts/ui_kit.gd")

## 명중 마커가 보이는 시간(초)
const HIT_TIME := {"normal": 0.18, "head": 0.28, "kill": 0.42}

var game: Node
var hud: Control
var _banner_root: Control
var _banner_tw: Tween
var _pills: Array = [] # [label, panel, pad]
var _hp_label: Label
var _hp_panel: Panel
var _gun_panel: Panel
var _core_pulse := 0.0

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
	UiKit.auto_scale(game) # 세로 모바일 화면에서 HUD 가 너무 작아지지 않게
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
	var tw := minf(900.0, w - 24.0)
	lt.size.x = tw
	lt.position = Vector2((w - tw) * 0.5, 14)
	var lr: Label = game.lbl_res
	lr.size.x = tw
	lr.position = Vector2((w - tw) * 0.5, 54)
	# 좁은 화면에서도 가운데 정렬 유지 (생성 때 앵커 기준 위치가 화면 폭을 따라가지 않으므로 매번 정한다)
	var tl: Label = game.lbl_toast
	tl.size.x = minf(900.0, w - 24.0)
	tl.position.x = (w - tl.size.x) * 0.5
	var pr: Label = game.lbl_prompt
	pr.size.x = minf(600.0, w - 24.0)
	pr.position.x = (w - pr.size.x) * 0.5
	var bh: Label = game.build_hover
	bh.size.x = minf(640.0, w - 24.0)
	bh.position.x = (w - bh.size.x) * 0.5
	game.build_panel.size.x = minf(520.0, w - 24.0)
	game.build_panel.position.x = w - game.build_panel.size.x - 12.0
	game.boss_bar.size.x = minf(560.0, w - 24.0)
	game.lbl_boss.size.x = minf(560.0, w - 24.0)
	game.lbl_boss.position.x = (w - game.lbl_boss.size.x) * 0.5
	_core_pulse += _dt
	var core_frac: float = game.core.hp / maxf(game.core.max_hp, 1.0)
	var core_low: bool = core_frac > 0.0 and core_frac < 0.28
	var fill_col := TEAL
	if core_low:
		var flick := 0.65 + 0.35 * sin(_core_pulse * 8.0)
		fill_col = ORANGE.lerp(RED, 1.0 - core_frac / 0.28) * Color(1, 1, 1, flick)
	_bar_style(game.core_bar, fill_col, 6)
	var hp_frac: float = game.player.hp / maxf(game.player.max_hp, 1.0)
	var hp_low: bool = hp_frac > 0.0 and hp_frac < 0.3
	_bar_style(game.hp_bar, RED if hp_low else RED, 10)
	if hp_low:
		game.hp_bar.modulate = Color(1.0, 0.85 + 0.15 * sin(_core_pulse * 6.0), 0.85, 1.0)
	else:
		game.hp_bar.modulate = Color.WHITE
	if game.boss_bar.visible and game.boss_bar.max_value > 0.0:
		var boss_frac: float = game.boss_bar.value / game.boss_bar.max_value
		var rage: bool = boss_frac > 0.0 and boss_frac < 0.5
		_bar_style(game.boss_bar, RED.lerp(Color8(0xff, 0x55, 0x33), 0.35) if rage else RED, 14)
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

# ── 명중 마커 ────────────────────────────────────────────────────────

## 조준선 위에 그리는 명중 표시. kind: normal(흰 X), head(노랑 X + 위쪽 화살촉), kill(붉은 큰 X + 십자 + 퍼지는 고리).
## t: 0 → 1 (시작 → 끝). 처음엔 바깥에서 안으로 모이며 커졌다가 뒤쪽에서 사라진다.
static func draw_hitmarker(ci: Control, kind: String, t: float) -> void:
	var settle := 1.0 - pow(1.0 - clampf(t * 3.0, 0.0, 1.0), 2.0) # 0 → 1 빠르게
	var pull := 1.0 + (1.0 - settle) * 0.6 # 처음 1.6배 → 1
	var a := 1.0 - clampf((t - 0.55) / 0.45, 0.0, 1.0)
	var diag := [Vector2(1, 1), Vector2(-1, 1), Vector2(1, -1), Vector2(-1, -1)]
	match kind:
		"kill":
			var col := Color(1.0, 0.22, 0.18, a)
			for d in diag:
				ci.draw_line(d.normalized() * 8.0 * pull, d.normalized() * 22.0 * pull, col, 3.5, true)
			for d in [Vector2.UP, Vector2.DOWN, Vector2.LEFT, Vector2.RIGHT]:
				ci.draw_line(d * 26.0 * pull, d * 33.0 * pull, Color(1, 0.55, 0.35, a), 2.5, true)
			ci.draw_arc(Vector2.ZERO, 12.0 + 26.0 * t, 0.0, TAU, 32, Color(1.0, 0.3, 0.2, a * 0.7), 2.0, true)
		"head":
			var col := Color(1.0, 0.86, 0.2, a)
			for d in diag:
				ci.draw_line(d.normalized() * 7.0 * pull, d.normalized() * 18.0 * pull, col, 3.0, true)
			# 위쪽 화살촉 (머리 쪽을 가리킴)
			var y := -30.0 - (1.0 - settle) * 8.0
			ci.draw_polyline(PackedVector2Array([Vector2(-8, y - 6), Vector2(0, y + 3), Vector2(8, y - 6)]), col, 3.0, true)
		_:
			var col := Color(1, 1, 1, a)
			for d in diag:
				ci.draw_line(d.normalized() * 6.0 * pull, d.normalized() * 13.0 * pull, col, 2.2, true)

# ── 웨이브 배너 ──────────────────────────────────────────────────────

## 가로 띠가 옆에서 밀려 들어와 잠시 머물고 반대쪽으로 사라진다. kind: wave(청록) / boss(붉게, 더 크고 오래) / clear(주황 금빛).
func banner(text: String, kind := "wave", sub := "") -> void:
	if _banner_tw:
		_banner_tw.kill()
	if _banner_root and is_instance_valid(_banner_root):
		_banner_root.queue_free()
	var w := hud.size.x
	var k := clampf(w / 1280.0, 0.55, 1.0) # 좁은 화면에서는 글자를 줄인다
	var boss := kind == "boss"
	var accent: Color = RED if boss else (Color8(0xff, 0xb3, 0x47) if kind == "clear" else TEAL)
	var h := (150.0 if boss else 118.0) * k
	var root := Control.new()
	root.mouse_filter = Control.MOUSE_FILTER_IGNORE
	root.size = Vector2(w, h)
	root.position = Vector2(0, maxf(104.0, hud.size.y * 0.2))
	root.pivot_offset = Vector2(w * 0.5, h * 0.5)
	hud.add_child(root)
	_banner_root = root
	# 양 끝이 투명하게 사라지는 어두운 띠
	var band := TextureRect.new()
	var gt := GradientTexture2D.new()
	var gr := Gradient.new()
	gr.offsets = PackedFloat32Array([0.0, 0.2, 0.8, 1.0])
	var base := Color(0.16, 0.0, 0.02) if boss else Color(0.03, 0.06, 0.08)
	gr.colors = PackedColorArray([Color(base, 0.0), Color(base, 0.82), Color(base, 0.82), Color(base, 0.0)])
	gt.gradient = gr
	gt.fill_from = Vector2(0, 0)
	gt.fill_to = Vector2(1, 0)
	band.texture = gt
	band.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	band.size = Vector2(w, h)
	band.mouse_filter = Control.MOUSE_FILTER_IGNORE
	root.add_child(band)
	# 위·아래 가는 강조선
	for y in [0.0, h - 2.0]:
		var line := ColorRect.new()
		line.color = Color(accent, 0.7)
		line.position = Vector2(w * 0.15, y)
		line.size = Vector2(w * 0.7, 2)
		line.mouse_filter = Control.MOUSE_FILTER_IGNORE
		root.add_child(line)
	var col := VBoxContainer.new()
	col.size = Vector2(w, h)
	col.alignment = BoxContainer.ALIGNMENT_CENTER
	col.add_theme_constant_override("separation", int(2 * k))
	col.mouse_filter = Control.MOUSE_FILTER_IGNORE
	root.add_child(col)
	var title := Label.new()
	title.text = text
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	title.add_theme_font_size_override("font_size", int((64.0 if boss else 50.0) * k))
	title.add_theme_color_override("font_color", Color(1, 0.92, 0.9) if boss else Color(1, 1, 1))
	title.add_theme_color_override("font_outline_color", Color(accent, 0.85))
	title.add_theme_constant_override("outline_size", int(8 * k))
	col.add_child(title)
	if sub != "":
		var sl := Label.new()
		sl.text = sub
		sl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		sl.add_theme_font_size_override("font_size", int((24.0 if boss else 22.0) * k))
		sl.add_theme_color_override("font_color", Color8(0xff, 0x9a, 0x9a) if boss else accent)
		sl.add_theme_color_override("font_shadow_color", Color(0, 0, 0, 0.8))
		sl.add_theme_constant_override("shadow_offset_y", 1)
		sl.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
		sl.custom_minimum_size.x = w - 40.0
		col.add_child(sl)
	root.modulate.a = 0.0
	root.position.x = -w * 0.25
	var base_y := root.position.y
	var hold := 2.4 if boss else 1.5
	var tw := create_tween()
	_banner_tw = tw
	tw.tween_property(root, "position:x", 0.0, 0.42).set_trans(Tween.TRANS_CUBIC).set_ease(Tween.EASE_OUT)
	tw.parallel().tween_property(root, "modulate:a", 1.0, 0.3)
	if boss:
		# 보스: 도착할 때 한 번 쿵 하고 흔들린다
		tw.tween_property(root, "position:y", base_y + 5.0, 0.05)
		tw.tween_property(root, "position:y", base_y - 4.0, 0.06)
		tw.tween_property(root, "position:y", base_y, 0.08)
	tw.tween_interval(hold)
	tw.tween_property(root, "position:x", w * 0.25, 0.5).set_trans(Tween.TRANS_CUBIC).set_ease(Tween.EASE_IN)
	tw.parallel().tween_property(root, "modulate:a", 0.0, 0.5)
	tw.tween_callback(root.queue_free)
