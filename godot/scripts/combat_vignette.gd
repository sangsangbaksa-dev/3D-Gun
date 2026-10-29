extends Node
## Low-HP and core-under-attack screen tint (web .pv-low and body.ztCoreLow).

var game: Node
var layer: CanvasLayer
var player_low: ColorRect
var core_low: ColorRect
var _pulse := 0.0

static func apply(g: Node) -> Node:
	var s = (load("res://scripts/combat_vignette.gd") as GDScript).new()
	s.game = g
	s.name = "CombatVignette"
	g.add_child(s)
	return s

func _ready() -> void:
	layer = CanvasLayer.new()
	layer.layer = -1
	add_child(layer)
	player_low = _full(Color(0.88, 0.19, 0.22, 0.0))
	core_low = _full(Color(0.35, 0.05, 0.08, 0.0))
	layer.add_child(core_low)
	layer.add_child(player_low)

func _full(col: Color) -> ColorRect:
	var r := ColorRect.new()
	r.color = col
	r.set_anchors_preset(Control.PRESET_FULL_RECT)
	r.mouse_filter = Control.MOUSE_FILTER_IGNORE
	return r

func _process(dt: float) -> void:
	if game == null or game.player == null or game.core == null:
		return
	_pulse += dt
	var p: Node = game.player
	var low: bool = not p.dead and p.max_hp > 0.0 and p.hp / p.max_hp <= 0.3
	var pulse: float = 0.55 + 0.45 * sin(_pulse * 3.9)
	player_low.color.a = (0.42 * pulse) if low else maxf(0.0, player_low.color.a - dt * 2.5)
	var core_frac: float = game.core.hp / maxf(game.core.max_hp, 1.0)
	var core_warn: bool = game.phase == "combat" and not game.core.dead and core_frac > 0.0 and core_frac < 0.28
	core_low.color.a = (0.38 + 0.12 * sin(_pulse * 5.5)) if core_warn else maxf(0.0, core_low.color.a - dt * 1.8)
