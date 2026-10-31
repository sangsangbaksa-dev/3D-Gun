extends Control
## Low HP / core-under-pressure screen vignette. Reads game state only; sits above hurt flash, under crosshair.

const RED := Color8(0xe0, 0x30, 0x3a)

var game: Node
var _t := 0.0

static func apply(g: Node) -> void:
	var s = (load("res://scripts/combat_vignette.gd") as GDScript).new()
	s.game = g
	s.name = "CombatVignette"
	s.set_anchors_preset(Control.PRESET_FULL_RECT)
	s.mouse_filter = Control.MOUSE_FILTER_IGNORE
	g.hud.add_child(s)
	g.hud.move_child(s, g.hurt_flash.get_index() + 1)

func _process(dt: float) -> void:
	_t += dt
	queue_redraw()

func _draw() -> void:
	if game == null or game.phase == "ended" or game.player.dead:
		return
	var p_r := clampf(game.player.hp / maxf(game.player.max_hp, 1.0), 0.0, 1.0)
	var c_r := clampf(game.core.hp / maxf(game.core.max_hp, 1.0), 0.0, 1.0)
	var threat := 0.0
	if p_r < 0.4:
		threat = maxf(threat, (0.4 - p_r) / 0.4)
	if c_r < 0.55:
		threat = maxf(threat, (0.55 - c_r) / 0.55 * 0.9)
	var cp := game.get_node_or_null("CorePointer")
	if cp and cp.get("alert") and cp.alert.active:
		threat = maxf(threat, cp.alert.pulse() * 0.45)
	if threat <= 0.02:
		return
	var pulse := 0.72 + 0.28 * sin(_t * (9.0 if threat > 0.55 else 6.0))
	var base_a := clampf(threat * 0.62 * pulse, 0.0, 0.78)
	var w := size.x
	var h := size.y
	var band := lerpf(120.0, 220.0, threat)
	_edge_gradient(Rect2(0, 0, w, band), base_a, true)
	_edge_gradient(Rect2(0, h - band, w, band), base_a, false)
	_edge_gradient(Rect2(0, 0, band, h), base_a, true, true)
	_edge_gradient(Rect2(w - band, 0, band, h), base_a, false, true)

func _edge_gradient(r: Rect2, peak: float, fade_in: bool, vertical := false) -> void:
	var steps := 10
	for i in steps:
		var t := float(i) / float(steps)
		var a := peak * (t if fade_in else (1.0 - t))
		if a <= 0.001:
			continue
		var slice := r.size / float(steps)
		var pos := r.position
		if vertical:
			pos.y += slice.y * i
		else:
			pos.x += slice.x * i
		draw_rect(Rect2(pos, slice), Color(RED.r, RED.g, RED.b, a))
