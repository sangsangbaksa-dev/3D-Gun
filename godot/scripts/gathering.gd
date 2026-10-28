extends Node3D
## Resource nodes (trees, rocks, iron, herbs, wrecks): hold E next to one to gather it.
## Port of src/gathering/logic/gathering.ts. The layout is the web game's own (same seed), exported to JSON.

signal gathered(res: String, amount: int, pos: Vector3)
signal hit(node: Dictionary) # 채집 중 0.26초마다 (웹의 gather:hit)

var game: Node
var nodes: Array = [] # {id, kind, res, pos, yaw, scale, r, state, progress, idle, respawn_t, hit_t, shape}
var _mm := {}         # "kind_vi" -> [ready MultiMesh or null, always MultiMesh or null]
var _slot := {}       # node index -> [group key, instance index]
var _body: StaticBody3D
var _active: Array = [] # 채집 중이거나 다시 자라는 노드
const VARIANTS := 8

func _ready() -> void:
	_body = StaticBody3D.new()
	add_child(_body)
	var groups := {}
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
			"i": nodes.size(), "r": n.r, "state": "ready", "progress": 0.0, "idle": 0.0, "respawn_t": 0.0, "hit_t": 0.0, "shape": cs}
		nodes.append(node)
		var key := "%s_%d" % [n.kind, mini(VARIANTS - 1, int(float(n.variant) * VARIANTS))]
		if not groups.has(key):
			groups[key] = []
		_slot[nodes.size() - 1] = [key, groups[key].size()]
		groups[key].append(nodes.size() - 1)
	# 모양은 웹 게임의 buildNodeModel 그대로 (nodes.glb: 종류 × 변형 8개, 다 자란 부분 ready- 와 그루터기 always-)
	var lib: Node = (load("res://assets/models/nodes.glb") as PackedScene).instantiate()
	for key in groups:
		var src: Node = lib.get_node("n_" + key)
		var parts := []
		for prefix in ["ready-", "always-"]:
			var mi := src.find_child(prefix + "*", false, false) as MeshInstance3D
			if mi == null:
				parts.append(null)
				continue
			var mmi := MultiMeshInstance3D.new()
			var mm := MultiMesh.new()
			mm.transform_format = MultiMesh.TRANSFORM_3D
			mm.mesh = mi.mesh
			mm.instance_count = groups[key].size()
			mmi.multimesh = mm
			add_child(mmi)
			parts.append(mm)
		_mm[key] = parts
	lib.free()
	for i in nodes.size():
		_refresh(i)

func _refresh(i: int) -> void:
	var n: Dictionary = nodes[i]
	var ready: bool = n.state == "ready"
	var slot: Array = _slot[i]
	var parts: Array = _mm[slot[0]]
	var base := Transform3D(Basis(Vector3.UP, n.yaw).scaled(Vector3.ONE * float(n.scale)), n.pos)
	if parts[0]:
		parts[0].set_instance_transform(slot[1], base if ready else Transform3D(Basis.from_scale(Vector3.ONE * 0.0001), n.pos))
	if parts[1]:
		parts[1].set_instance_transform(slot[1], base)
	var block: float = 1.0 if ready else float(GameData.gather.nodes[n.kind].depletedBlock)
	n.shape.disabled = block <= 0.0
	if block > 0.0:
		n.shape.shape.radius = float(n.r) * block

## resetGathering(): 새 런이면 모든 노드를 다시 채집 가능하게 (배치는 그대로).
func reset() -> void:
	for n in nodes:
		n.state = "ready"
		n.progress = 0.0
		n.idle = 99.0
		n.hit_t = 0.0
		n.respawn_t = 0.0
		_refresh(n.i)
	_active.clear()

## Ready node the player can reach right now, or {}.
func nearest_ready(p: Vector3) -> Dictionary:
	var best := {}
	var bd := INF
	var reach: float = GameData.gather.reach
	var box := reach + 3.0 # 975 개 중 가까운 것만 거리 계산
	for n in nodes:
		if n.state != "ready" or absf(p.x - n.pos.x) > box or absf(p.z - n.pos.z) > box:
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
	if not _active.has(n):
		_active.append(n)
	n.progress += dt / float(def.work)
	n.hit_t = float(n.get("hit_t", 0.0)) - dt
	if n.hit_t <= 0.0:
		n.hit_t = 0.26
		hit.emit(n)
		Sfx.play("gather", n.pos)
	if n.progress < 1.0:
		return false
	var amount: int = game.rng.randi_range(int(def.yieldMin), int(def.yieldMax))
	# 채집 추가 확률(gatherExtra): 걸리면 +1. 0 이면 난수를 쓰지 않아 시드가 달라지지 않는다
	var extra_p: float = float(game.meta.get("gatherExtra", 0.0))
	if extra_p > 0.0 and game.rng.randf() < extra_p:
		amount += 1
	n.state = "depleted"
	n.progress = 0.0
	n.respawn_t = game.rng.randf_range(float(def.respawnMin), float(def.respawnMax))
	_refresh(n.i)
	gathered.emit(n.res, amount, n.pos)
	return true

## tick(): progress decays when not gathered, depleted nodes grow back. Only nodes that were touched are visited.
func _process(dt: float) -> void:
	var grace: float = GameData.gather.idleGrace
	var decay: float = GameData.gather.decay
	for n in _active.duplicate():
		n.idle += dt
		if n.state == "depleted":
			n.respawn_t -= dt
			if n.respawn_t <= 0.0:
				n.state = "ready"
				n.progress = 0.0
				_refresh(n.i)
				_active.erase(n)
		elif n.idle > grace:
			n.progress = maxf(0.0, n.progress - decay * dt)
			if n.progress <= 0.0:
				_active.erase(n)
