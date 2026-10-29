extends Node
## Prep countdown bar (web #prepBar). Fills as prep time runs out; turns orange under 5s; greys out in build mode.

const HudStyle := preload("res://scripts/hud_style.gd")

var game: Node
var layer: CanvasLayer
var root: Control
var bar: ProgressBar
var prep_total := 60.0

static func apply(g: Node) -> Node:
	var s = (load("res://scripts/prep_hud.gd") as GDScript).new()
	s.game = g
	s.name = "PrepHud"
	g.add_child(s)
	return s

func _ready() -> void:
	layer = CanvasLayer.new()
	layer.layer = 0
	add_child(layer)
	root = Control.new()
	root.mouse_filter = Control.MOUSE_FILTER_IGNORE
	layer.add_child(root)
	bar = ProgressBar.new()
	bar.min_value = 0.0
	bar.max_value = 100.0
	bar.show_percentage = false
	bar.size = Vector2(300, 5)
	bar.mouse_filter = Control.MOUSE_FILTER_IGNORE
	_style(false, false)
	root.add_child(bar)

func set_prep_total(t: float) -> void:
	prep_total = maxf(1.0, t)

func _style(urgent: bool, paused: bool) -> void:
	var fill := HudStyle.box(Color8(0x2e, 0xe6, 0xd6) if not urgent else Color8(0xff, 0x8a, 0x2a), Color(0, 0, 0, 0), 3, 0)
	if paused:
		fill.bg_color = Color8(0x5a, 0x6a, 0x70)
		fill.bg_color.a = 0.85
	var bg := HudStyle.box(Color(0, 0, 0, 0.55), Color8(0x2e, 0xe6, 0xd6, 0.2), 3, 1)
	bar.add_theme_stylebox_override("fill", fill)
	bar.add_theme_stylebox_override("background", bg)

func _process(_dt: float) -> void:
	if game == null or game.hud == null:
		return
	var hud: Control = game.hud
	var show: bool = game.phase == "prep" and prep_total > 0.0
	root.visible = show
	if not show:
		return
	var w := minf(300.0, hud.size.x * 0.88)
	bar.size.x = w
	root.position = Vector2((hud.size.x - w) * 0.5, 78.0)
	var pct := clampf(game.prep_left / prep_total, 0.0, 1.0)
	bar.value = pct * 100.0
	var urgent: bool = game.prep_left > 0.0 and game.prep_left <= 5.0
	var paused: bool = game.base != null and game.base.building
	_style(urgent, paused)
