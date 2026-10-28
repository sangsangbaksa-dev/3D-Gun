extends RefCounted
## Shared look for the menu-style panels (weapon shop, lab, exchange, death card): the dark glass panel,
## the row card and the centred-text buttons, so they all match the HUD (src/ui/theme.ts palette).

const TEAL := Color("2ee6d6")
const ORANGE := Color("ff8a2a")
const RED := Color("e0303a")
const TEXT := Color("d6e4e8")
const GLASS := Color8(0x0d, 0x14, 0x18, 0xf2)

static func box(bg: Color, edge: Color, radius := 10, border := 1, margin := Vector4.ZERO) -> StyleBoxFlat:
	var sb := StyleBoxFlat.new()
	sb.bg_color = bg
	sb.border_color = edge
	sb.set_border_width_all(border)
	sb.set_corner_radius_all(radius)
	sb.anti_aliasing = true
	sb.content_margin_left = margin.x
	sb.content_margin_top = margin.y
	sb.content_margin_right = margin.z
	sb.content_margin_bottom = margin.w
	return sb

## The big dark glass panel with an accent edge.
static func panel(accent: Color) -> PanelContainer:
	var p := PanelContainer.new()
	var sb := box(GLASS, Color(accent, 0.55), 14, 1, Vector4(28, 24, 28, 22))
	sb.shadow_color = Color(accent, 0.18)
	sb.shadow_size = 28
	p.add_theme_stylebox_override("panel", sb)
	return p

## One list row: a faint card whose children are laid out left to right and vertically centred.
static func row_card(parent: Control) -> HBoxContainer:
	var card := PanelContainer.new()
	card.add_theme_stylebox_override("panel", box(Color(1, 1, 1, 0.04), Color(1, 1, 1, 0.08), 10, 1, Vector4(16, 7, 12, 7)))
	parent.add_child(card)
	var r := HBoxContainer.new()
	r.add_theme_constant_override("separation", 12)
	r.alignment = BoxContainer.ALIGNMENT_BEGIN
	card.add_child(r)
	return r

static func label(text: String, size: int, col := TEXT, align := HORIZONTAL_ALIGNMENT_LEFT) -> Label:
	var l := Label.new()
	l.text = text
	l.horizontal_alignment = align
	l.add_theme_font_size_override("font_size", size)
	l.add_theme_color_override("font_color", col)
	return l

## A button with its text centred both ways. primary = the orange call-to-action, otherwise a teal outline.
static func button(text: String, min_size := Vector2(120, 40), primary := false, size := 16) -> Button:
	var b := Button.new()
	b.text = text
	b.custom_minimum_size = min_size
	b.size_flags_vertical = Control.SIZE_SHRINK_CENTER
	b.alignment = HORIZONTAL_ALIGNMENT_CENTER
	b.add_theme_font_size_override("font_size", size)
	var m := Vector4(16, 6, 16, 6)
	b.clip_text = true
	b.text_overrun_behavior = TextServer.OVERRUN_TRIM_ELLIPSIS
	if primary:
		b.add_theme_stylebox_override("normal", box(ORANGE, Color(ORANGE, 0.0), 8, 0, m))
		b.add_theme_stylebox_override("hover", box(Color("ffa557"), Color(TEAL, 0.9), 8, 2, m))
		b.add_theme_stylebox_override("pressed", box(Color("e8761c"), Color(TEAL, 0.9), 8, 2, m))
		b.add_theme_stylebox_override("hover_pressed", box(Color("e8761c"), Color(TEAL, 0.9), 8, 2, m))
		b.add_theme_stylebox_override("disabled", box(Color(ORANGE, 0.25), Color(ORANGE, 0.0), 8, 0, m))
		b.add_theme_stylebox_override("focus", box(Color(0, 0, 0, 0), Color(1, 1, 1, 0.7), 8, 2, m))
		for c in ["font_color", "font_hover_color", "font_pressed_color", "font_focus_color"]:
			b.add_theme_color_override(c, Color("07090d"))
		b.add_theme_color_override("font_disabled_color", Color(0, 0, 0, 0.45))
	else:
		var bg := Color8(0x12, 0x1a, 0x20, 0xb3)
		b.add_theme_stylebox_override("normal", box(bg, Color(TEAL, 0.7), 8, 1, m))
		b.add_theme_stylebox_override("hover", box(Color(TEAL, 0.16).blend(bg), TEAL, 8, 1, m))
		b.add_theme_stylebox_override("pressed", box(Color(TEAL, 0.26).blend(bg), TEAL, 8, 1, m))
		b.add_theme_stylebox_override("hover_pressed", box(Color(TEAL, 0.26).blend(bg), TEAL, 8, 1, m))
		b.add_theme_stylebox_override("disabled", box(Color(1, 1, 1, 0.03), Color(1, 1, 1, 0.1), 8, 1, m))
		b.add_theme_stylebox_override("focus", box(Color(0, 0, 0, 0), Color(TEAL, 0.9), 8, 2, m))
		for c in ["font_color", "font_hover_color", "font_pressed_color", "font_focus_color"]:
			b.add_theme_color_override(c, TEAL)
		b.add_theme_color_override("font_disabled_color", Color(1, 1, 1, 0.35))
	polish(b)
	return b

## Full-screen dim with the panel centred in it, sized to its content (12px margin so it never touches the edge).
static func modal(parent: Node, dim := 0.55) -> CenterContainer:
	var root := Control.new()
	root.set_anchors_preset(Control.PRESET_FULL_RECT)
	parent.add_child(root)
	var d := ColorRect.new()
	d.color = Color(0, 0, 0, dim)
	d.set_anchors_preset(Control.PRESET_FULL_RECT)
	root.add_child(d)
	var m := MarginContainer.new()
	m.set_anchors_preset(Control.PRESET_FULL_RECT)
	for side in ["left", "right", "top", "bottom"]:
		m.add_theme_constant_override("margin_" + side, 12)
	m.mouse_filter = Control.MOUSE_FILTER_IGNORE
	root.add_child(m)
	var c := CenterContainer.new()
	c.mouse_filter = Control.MOUSE_FILTER_IGNORE
	m.add_child(c)
	return c

## 버튼 호버 확대 / 눌림 축소. 일시정지 중에도 돈다.
static func polish(b: Button) -> void:
	b.resized.connect(func(): b.pivot_offset = b.size * 0.5)
	var to := func(s: float, t: float):
		if b.disabled:
			s = 1.0
		var tw := b.create_tween().set_pause_mode(Tween.TWEEN_PAUSE_PROCESS)
		tw.tween_property(b, "scale", Vector2(s, s), t).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
	b.mouse_entered.connect(func(): to.call(1.04, 0.1))
	b.mouse_exited.connect(func(): to.call(1.0, 0.12))
	b.button_down.connect(func(): to.call(0.96, 0.06))
	b.button_up.connect(func(): to.call(1.04 if b.is_hovered() else 1.0, 0.1))

## 패널 등장: 투명 + 살짝 작게 → 제자리, 어두운 막도 같이 페이드.
static func pop_in(panel: Control, dim: Control = null) -> void:
	panel.resized.connect(func(): panel.pivot_offset = panel.size * 0.5)
	panel.pivot_offset = panel.size * 0.5
	panel.modulate.a = 0.0
	panel.scale = Vector2(0.95, 0.95)
	var tw := panel.create_tween().set_pause_mode(Tween.TWEEN_PAUSE_PROCESS).set_parallel(true)
	tw.tween_property(panel, "modulate:a", 1.0, 0.18)
	tw.tween_property(panel, "scale", Vector2.ONE, 0.22).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	if dim:
		dim.modulate.a = 0.0
		tw.tween_property(dim, "modulate:a", 1.0, 0.18)

## 패널 가로폭 = want 와 (화면폭 - 여백) 중 작은 쪽. 창 크기가 바뀌면 따라간다.
static func fit_width(panel: Control, want: float, margin := 32.0) -> void:
	var f := func():
		if panel.is_inside_tree():
			panel.custom_minimum_size.x = minf(want, panel.get_viewport().get_visible_rect().size.x - margin)
	panel.custom_minimum_size.x = want
	panel.tree_entered.connect(func():
		f.call()
		panel.get_viewport().size_changed.connect(f))

## 좁은 세로 화면(모바일)에서 UI 가 너무 작아지지 않게 창의 content_scale_factor 를 올린다.
## 가상 가로폭이 w/0.75 (520~1280) 가 되게. 가로 창에서는 1.0 그대로.
static func auto_scale(n: Node) -> void:
	var win := n.get_window()
	if win == null or win.has_meta("ui_auto_scale"):
		return
	win.set_meta("ui_auto_scale", true)
	var f := func():
		var s := Vector2(win.size)
		if s.x < 1.0 or s.y < 1.0:
			return
		var v := clampf(s.x / 0.75, 520.0, 1280.0)
		var s0 := minf(s.x / 1280.0, s.y / 720.0)
		win.content_scale_factor = clampf((s.x / v) / s0, 1.0, 3.0)
	win.size_changed.connect(f)
	f.call()
