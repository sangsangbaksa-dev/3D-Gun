extends Node3D
## Resource nodes (trees, rocks, iron, herbs, wrecks): hold E next to one to gather it.
## Port of src/gathering/logic/gathering.ts. The layout is the web game's own (same seed), exported to JSON.

signal gathered(res: String, amount: int, pos: Vector3)

var game: Node
var nodes: Array = [] # {id, kind, res, pos, yaw, scale, r, state, progress, idle, respawn_t, shape}
var _mm := {}         # kind -> [[MultiMesh, local Transform3D, depleted scale]]
var _index := {}      # kind -> instance index list (node index per instance)
var _body: StaticBody3D

func _ready() -> void:
	_body = StaticBody3D.new()
	add_child(_body)
	var by_kind := {}
	for n in GameData.gather_layout:
		var w: Node3D = game.world
		var pos := Vector3(n.x, w.ground_y(n.x, n.z), n.z)
		var cs := CollisionShape3D.new()
		var c := CylinderShape3D.new()
		c.radius = n.r
		c.height = 3.0
		cs.shape = c
		cs.position = pos + Vector3(0, 1.5, 0)
		_body.add_child(cs)
		var node := {"id": n.id, "kind": n.kind, "res": n.res, "pos": pos, "yaw": n.yaw, "scale": n.scale, "variant": n.variant,
			"r": n.r, "state": "ready", "progress": 0.0, "idle": 0.0, "respawn_t": 0.0, "shape": cs}
		nodes.append(node)
		if not by_kind.has(n.kind):
			by_kind[n.kind] = []
		by_kind[n.kind].append(nodes.size() - 1)
	for kind in by_kind:
		_index[kind] = by_kind[kind]
		_mm[kind] = []
		for part in _parts(kind):
			var mmi := MultiMeshInstance3D.new()
			var mm := MultiMesh.new()
			mm.transform_format = MultiMesh.TRANSFORM_3D
			mm.mesh = part[0]
			mm.instance_count = by_kind[kind].size()
			mmi.multimesh = mm
			add_child(mmi)
			_mm[kind].append([mm, part[1], part[2]])
		for i in by_kind[kind].size():
			_refresh(kind, i)

## Mesh parts per kind: [mesh, local transform, scale kept when depleted (0 = hidden)].
func _parts(kind: String) -> Array:
	var w = game.world
	match kind:
		"tree":
			return [[_cyl(0.18, 0.26, 2.0, w.mat(Color(0.32, 0.21, 0.12))), _t(Vector3(0, 1.0, 0)), 0.4],
				[_cyl(0.0, 1.4, 3.6, w.mat(Color(0.16, 0.3, 0.12))), _t(Vector3(0, 3.6, 0)), 0.0]]
		"rock":
			return [[_sph(1.0, w.mat(Color(0.5, 0.49, 0.47))), Transform3D(Basis.from_scale(Vector3(1.1, 0.75, 0.95)), Vector3(0, 0.4, 0)), 0.35]]
		"iron":
			return [[_sph(0.95, w.mat(Color(0.3, 0.28, 0.3), 0.3)), Transform3D(Basis.from_scale(Vector3(1.0, 0.8, 0.9)), Vector3(0, 0.4, 0)), 0.35],
				[_box(Vector3(0.9, 0.18, 0.5), w.mat(Color(0.7, 0.4, 0.15), 0.6)), _t(Vector3(0.2, 0.75, 0.2)), 0.0]]
		"herb":
			return [[_sph(0.5, w.mat(Color(0.28, 0.5, 0.18))), Transform3D(Basis.from_scale(Vector3(1, 0.7, 1)), Vector3(0, 0.3, 0)), 0.0],
				[_sph(0.12, w.mat(Color(0.85, 0.75, 0.3))), _t(Vector3(0.15, 0.62, 0.1)), 0.0]]
		_: # wreck
			return [[_box(Vector3(1.8, 0.9, 3.4), w.mat(Color(0.45, 0.22, 0.1), 0.4)), _t(Vector3(0, 0.45, 0)), 0.8],
				[_box(Vector3(1.6, 0.6, 1.6), w.mat(Color(0.3, 0.16, 0.08), 0.4)), _t(Vector3(0, 1.2, -0.2)), 0.0]]

func _t(p: Vector3) -> Transform3D:
	return Transform3D(Basis(), p)

func _cyl(rt: float, rb: float, h: float, m: Material) -> Mesh:
	return game.world._cyl_mesh(rt, rb, h, m)

func _sph(r: float, m: Material) -> Mesh:
	return game.world._sphere_mesh(r, m)

func _box(size: Vector3, m: Material) -> Mesh:
	return game.world._box_mesh(size, m)

func _refresh(kind: String, i: int) -> void:
	var n: Dictionary = nodes[_index[kind][i]]
	var ready: bool = n.state == "ready"
	var base := Transform3D(Basis.from_scale(Vector3.ONE * float(n.scale)).rotated(Vector3.UP, n.yaw), n.pos)
	for part in _mm[kind]:
		var k: float = 1.0 if ready else float(part[2])
		var local: Transform3D = part[1]
		if k <= 0.0:
			part[0].set_instance_transform(i, Transform3D(Basis.from_scale(Vector3.ONE * 0.0001), n.pos))
		else:
			part[0].set_instance_transform(i, base * Transform3D(Basis.from_scale(Vector3(1, k, 1)), Vector3.ZERO) * local)
	var block: float = 1.0 if ready else float(GameData.gather.nodes[kind].depletedBlock)
	n.shape.disabled = block <= 0.0
	if block > 0.0:
		n.shape.shape.radius = float(n.r) * block

func _node_slot(n: Dictionary) -> int:
	return _index[n.kind].find(nodes.find(n))

## Ready node the player can reach right now, or {}.
func nearest_ready(p: Vector3) -> Dictionary:
	var best := {}
	var bd := INF
	var reach: float = GameData.gather.reach
	for n in nodes:
		if n.state != "ready":
			continue
		var d := Vector2(p.x - n.pos.x, p.z - n.pos.z).length() - float(n.r)
		if d < reach and d < bd:
			bd = d
			best = n
	return best

## harvest(): call every frame while E is held. Returns true when the node was finished.
func harvest(n: Dictionary, dt: float) -> bool:
	if n.state != "ready":
		return false
	var def: Dictionary = GameData.gather.nodes[n.kind]
	n.idle = 0.0
	n.progress += dt / float(def.work)
	if n.progress < 1.0:
		return false
	var amount := game.rng.randi_range(int(def.yieldMin), int(def.yieldMax))
	n.state = "depleted"
	n.progress = 0.0
	n.respawn_t = game.rng.randf_range(float(def.respawnMin), float(def.respawnMax))
	_refresh(n.kind, _node_slot(n))
	gathered.emit(n.res, amount, n.pos)
	return true

## tick(): progress decays when not gathered, depleted nodes grow back.
func _process(dt: float) -> void:
	var grace: float = GameData.gather.idleGrace
	var decay: float = GameData.gather.decay
	for n in nodes:
		n.idle += dt
		if n.state == "depleted":
			n.respawn_t -= dt
			if n.respawn_t <= 0.0:
				n.state = "ready"
				n.progress = 0.0
				_refresh(n.kind, _node_slot(n))
		elif n.progress > 0.0 and n.idle > grace:
			n.progress = maxf(0.0, n.progress - decay * dt)
