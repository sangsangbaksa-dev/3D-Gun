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
	if primary:
		b.add_theme_stylebox_override("normal", box(ORANGE, Color(ORANGE, 0.0), 8, 0, m))
		b.add_theme_stylebox_override("hover", box(Color("ffa557"), Color(TEAL, 0.9), 8, 2, m))
		b.add_theme_stylebox_override("pressed", box(Color("e8761c"), Color(TEAL, 0.9), 8, 2, m))
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
		b.add_theme_stylebox_override("disabled", box(Color(1, 1, 1, 0.03), Color(1, 1, 1, 0.1), 8, 1, m))
		b.add_theme_stylebox_override("focus", box(Color(0, 0, 0, 0), Color(TEAL, 0.9), 8, 2, m))
		for c in ["font_color", "font_hover_color", "font_pressed_color", "font_focus_color"]:
			b.add_theme_color_override(c, TEAL)
		b.add_theme_color_override("font_disabled_color", Color(1, 1, 1, 0.35))
	return b

## Full-screen dim with the panel centred in it, sized to its content.
static func modal(parent: Node, dim := 0.55) -> CenterContainer:
	var root := Control.new()
	root.set_anchors_preset(Control.PRESET_FULL_RECT)
	parent.add_child(root)
	var d := ColorRect.new()
	d.color = Color(0, 0, 0, dim)
	d.set_anchors_preset(Control.PRESET_FULL_RECT)
	root.add_child(d)
	var c := CenterContainer.new()
	c.set_anchors_preset(Control.PRESET_FULL_RECT)
	root.add_child(c)
	return c
