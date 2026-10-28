extends Node3D
## Resource nodes (trees, rocks, iron, herbs, wrecks): hold E next to one to gather it.
## Port of src/gathering/logic/gathering.ts. The layout is the web game's own (same seed), exported to JSON.

signal gathered(res: String, amount: int, pos: Vector3)
signal hit(node: Dictionary) # 채집 중 0.26초마다 (웹의 gather:hit)

const FxScript := preload("res://scripts/gather_fx.gd")
const ToolScript := preload("res://scripts/tool_view.gd")
const HudScript := preload("res://scripts/gather_hud.gd")
var fx: Node3D
var tool_view: Node3D  # 1인칭 도구 (tool_view.gd, 카메라 자식)
var gather_hud: Control # 진행 링·날아가는 아이콘 (gather_hud.gd)
var current = null     # 지금 채집 중인 노드 (harvest 가 매 프레임 갱신). 완료되거나 손을 뗀 지 2프레임이 지나면 null
var _last_frame := -99
var swing := 0.0 # 스윙 위상(주기 수). 타격 시점은 gather_fx.KIND[kind].impact
var _swing_node = null
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
			"i": nodes.size(), "r": n.r, "state": "ready", "progress": 0.0, "idle": 0.0, "respawn_t": 0.0, "hit_t": 0.0, "shape": cs, "recoil": 0.0, "away": Vector3.FORWARD, "fx_on": false}
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
	var pp: Vector3 = game.player.global_position
	var aw := Vector3(n.pos.x - pp.x, 0, n.pos.z - pp.z)
	n.away = aw.normalized() if aw.length() > 0.01 else Vector3.FORWARD
	if not _active.has(n):
		_active.append(n)
	n.progress += dt / float(def.work)
	if fx == null and game.player:
		fx = FxScript.new()
		fx.game = game
		add_child(fx)
		tool_view = ToolScript.new()
		tool_view.game = game
		tool_view.gathering = self
		game.player.camera.add_child(tool_view)
		gather_hud = HudScript.new()
		gather_hud.game = game
		gather_hud.gathering = self
		game.hud.add_child(gather_hud)
	current = n
	_last_frame = Engine.get_process_frames()
	var K: Dictionary = FxScript.KIND[n.kind]
	if _swing_node != n:
		_swing_node = n
		swing = 0.0
	var prev := swing
	swing += dt / float(K.period)
	if floorf(swing - float(K.impact)) > floorf(prev - float(K.impact)) and n.progress < 1.0:
		n.recoil = 1.0
		hit.emit(n)
		if fx:
			fx.hit(n, false)
	if n.progress < 1.0:
		return false
	var amount: int = game.rng.randi_range(int(def.yieldMin), int(def.yieldMax))
	# 채집 추가 확률(gatherExtra): 걸리면 +1. 0 이면 난수를 쓰지 않아 시드가 달라지지 않는다
	var extra_p: float = float(game.meta.get("gatherExtra", 0.0))
	if extra_p > 0.0 and game.rng.randf() < extra_p:
		amount += 1
	n.state = "depleted"
	n.progress = 0.0
	n.recoil = 0.0
	current = null
	n.respawn_t = game.rng.randf_range(float(def.respawnMin), float(def.respawnMax))
	if fx:
		var sl: Array = _slot[n.i]
		var pt = _mm[sl[0]][0]
		fx.finish(n, pt.mesh if pt else null)
	_refresh(n.i)
	gathered.emit(n.res, amount, n.pos)
	return true

## tick(): progress decays when not gathered, depleted nodes grow back. Only nodes that were touched are visited.
func is_gathering() -> bool:
	return current != null and Engine.get_process_frames() - _last_frame <= 2

## 채집 중인 노드의 흔들림: 타격마다 튕기고(recoil), 진행도에 따라 기울고(나무) 줄어든다(바위·철광·약초).
func _animate(n: Dictionary, dt: float) -> void:
	n.recoil = maxf(0.0, n.recoil - dt * 4.5)
	var K: Dictionary = FxScript.KIND[n.kind]
	var pr: float = n.progress
	if pr <= 0.0 and n.recoil <= 0.0:
		if n.fx_on:
			n.fx_on = false
			_refresh(n.i)
		return
	n.fx_on = true
	var t := Time.get_ticks_msec() * 0.001
	var ang: float = pr * float(K.lean) + sin(t * 42.0) * float(K.wobble) * n.recoil * 0.6
	var pulse: float = n.recoil * float(K.squash)
	var s: float = float(n.scale) * (1.0 - float(K.shrink) * pr)
	var axis: Vector3 = Vector3.UP.cross(n.away).normalized()
	var b := Basis(axis, ang) * Basis(Vector3.UP, n.yaw) * Basis.from_scale(Vector3(1.0 + pulse, 1.0 - pulse, 1.0 + pulse) * s)
	var part = _mm[_slot[n.i][0]][0]
	if part:
		part.set_instance_transform(_slot[n.i][1], Transform3D(b, n.pos))

func _process(dt: float) -> void:
	if current != null and not is_gathering():
		current = null
	var grace: float = GameData.gather.idleGrace
	var decay: float = GameData.gather.decay
	for n in _active.duplicate():
		n.idle += dt
		if n.state == "ready":
			_animate(n, dt)
		if n.state == "depleted":
			n.respawn_t -= dt
			if n.respawn_t <= 0.0:
				n.state = "ready"
				n.progress = 0.0
				_refresh(n.i)
				_active.erase(n)
		elif n.idle > grace:
			n.progress = maxf(0.0, n.progress - decay * dt)
			if n.progress <= 0.0 and n.recoil <= 0.0:
				_animate(n, 0.0) # 흔들림 끝: 원래 자세로
				_active.erase(n)
