extends Node3D
## Area attacks and their effects: warning rings, blasts, acid spit, bomb rain, gas / acid pools.
## Port of the aoe / explode / projs / gases part of src/enemies/logic/sim.ts.
## Targets are the player, the core and placed buildings (allies join in a later stage).

var game: Node
var _pools: Array = [] # {pos, r, t, tick, dps, node}

const WARN := Color(1.0, 0.25, 0.15)

func targets() -> Array:
	var out: Array = [game.player]
	if not game.core_dead:
		out.append(game.core)
	if game.base:
		for b in game.base.structures:
			if not b.dead and b.kind != "trap":
				out.append(b)
	return out

## Damage everything within r (flat distance + target radius).
func aoe(pos: Vector3, r: float, dmg: float, skip: Node = null) -> void:
	for t in targets():
		if t == skip or t.get("dead"):
			continue
		var tr: float = float(t.get("radius")) if t.get("radius") != null else 0.4
		if Vector2(t.global_position.x - pos.x, t.global_position.z - pos.z).length() <= r + tr:
			t.take_damage(dmg)

func explode(pos: Vector3, r: float, dmg: float, kind: String) -> void:
	aoe(pos, r, dmg)
	var col := Color(1.0, 0.55, 0.15) if kind == "bomb" else (Color(0.5, 1.0, 0.25) if kind == "acid" else Color(0.75, 0.6, 0.45))
	_blast(pos, r, col)

## Flat ring on the ground that fills up until the hit lands.
func ring(pos: Vector3, r: float, time: float, col: Color = WARN) -> void:
	var mi := MeshInstance3D.new()
	var m := TorusMesh.new()
	m.inner_radius = maxf(0.05, r - 0.18)
	m.outer_radius = r
	m.rings = 48
	mi.mesh = m
	mi.material_override = _glow(col, 0.85)
	mi.position = Vector3(pos.x, game.world.ground_y(pos.x, pos.z) + 0.06, pos.z)
	mi.scale = Vector3(1, 0.05, 1)
	mi.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	add_child(mi)
	var fill := MeshInstance3D.new()
	var c := CylinderMesh.new()
	c.top_radius = r
	c.bottom_radius = r
	c.height = 0.02
	fill.mesh = c
	fill.material_override = _glow(col, 0.25)
	fill.position = Vector3(pos.x, game.world.ground_y(pos.x, pos.z) + 0.04, pos.z)
	fill.scale = Vector3(0.05, 1, 0.05)
	fill.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	add_child(fill)
	var tw := create_tween()
	tw.tween_property(fill, "scale", Vector3.ONE, maxf(0.05, time))
	tw.tween_callback(mi.queue_free)
	tw.tween_callback(fill.queue_free)

## Acid glob flying in an arc; splashes and leaves a pool (spitter, acid boss volley).
func spit(from: Vector3, to: Vector3, time: float, r: float, dmg: float, pool: float, dps: float) -> void:
	var ball := MeshInstance3D.new()
	var s := SphereMesh.new()
	s.radius = 0.22
	s.height = 0.44
	ball.mesh = s
	ball.material_override = _glow(Color(0.5, 1.0, 0.2), 1.0)
	add_child(ball)
	ball.global_position = from
	var land := Vector3(to.x, game.world.ground_y(to.x, to.z), to.z)
	ring(land, r, time)
	var tw := create_tween()
	tw.tween_method(func(k: float):
		var p := from.lerp(land, k)
		p.y += sin(PI * k) * 3.0
		ball.global_position = p, 0.0, 1.0, maxf(0.05, time))
	tw.tween_callback(func():
		ball.queue_free()
		explode(land, r, dmg, "acid")
		if pool > 0.0:
			add_pool(land, r, pool, dps, "acid"))

## Delayed explosion with a warning ring (boss bomb rain).
func bomb_at(pos: Vector3, delay: float, r: float, dmg: float) -> void:
	var p := Vector3(pos.x, game.world.ground_y(pos.x, pos.z), pos.z)
	ring(p, r, delay)
	get_tree().create_timer(delay, false).timeout.connect(func(): explode(p, r, dmg, "bomb"))

## Lingering damage area (fatty death gas, acid puddle). Ticks like updateGas.
func add_pool(pos: Vector3, r: float, time: float, dps: float, kind: String) -> void:
	var mi := MeshInstance3D.new()
	var c := CylinderMesh.new()
	c.top_radius = r
	c.bottom_radius = r
	c.height = 0.6 if kind == "gas" else 0.04
	mi.mesh = c
	mi.material_override = _glow(Color(0.55, 0.75, 0.2) if kind == "gas" else Color(0.45, 1.0, 0.2), 0.32)
	mi.position = Vector3(pos.x, c.height * 0.5 + 0.03, pos.z)
	mi.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	add_child(mi)
	_pools.append({"pos": pos, "r": r, "t": time, "tick": 0.0, "dps": dps, "every": 0.5 if kind == "gas" else 0.3, "node": mi})

func _physics_process(dt: float) -> void:
	for i in range(_pools.size() - 1, -1, -1):
		var g: Dictionary = _pools[i]
		g.t -= dt
		g.tick -= dt
		if g.tick <= 0.0:
			g.tick = g.every
			var p: Node3D = game.player
			if not p.dead and Vector2(p.global_position.x - g.pos.x, p.global_position.z - g.pos.z).length() <= g.r:
				p.take_damage(g.dps * g.every)
		if g.t <= 0.0:
			g.node.queue_free()
			_pools.remove_at(i)

func _blast(pos: Vector3, r: float, col: Color) -> void:
	var mi := MeshInstance3D.new()
	var s := SphereMesh.new()
	s.radius = 1.0
	s.height = 1.0 # 반구처럼 납작하게
	mi.mesh = s
	var mat := _glow(col, 0.7)
	mi.material_override = mat
	mi.position = Vector3(pos.x, game.world.ground_y(pos.x, pos.z) + 0.1, pos.z)
	mi.scale = Vector3.ONE * 0.2
	mi.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	add_child(mi)
	var light := OmniLight3D.new()
	light.light_color = col
	light.omni_range = r * 2.0
	light.light_energy = 3.0
	light.position = Vector3(0, 1, 0)
	mi.add_child(light)
	var tw := create_tween()
	tw.tween_property(mi, "scale", Vector3(r, r * 0.6, r), 0.25).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
	tw.parallel().tween_property(mat, "albedo_color:a", 0.0, 0.45)
	tw.parallel().tween_property(light, "light_energy", 0.0, 0.45)
	tw.tween_callback(mi.queue_free)

func _glow(col: Color, alpha: float) -> StandardMaterial3D:
	var m := StandardMaterial3D.new()
	m.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	m.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	m.albedo_color = Color(col.r, col.g, col.b, alpha)
	m.cull_mode = BaseMaterial3D.CULL_DISABLED
	return m
