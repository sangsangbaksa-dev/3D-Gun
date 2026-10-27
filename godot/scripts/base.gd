extends Node3D
## Base building: B build mode (prep only), grid placement around the core, demolish, repair, upgrade,
## and the core's own repair / upgrade. Port of src/base/logic/base.ts + grid.ts.

const StructureScript := preload("res://scripts/structure.gd")
## 이번 단계에서 지을 수 있는 건물. 연구소·숙소·상점은 아군 단계에서
const BUILDABLE := ["tower", "mgtower", "barricade", "trap"]

var game: Node
var building := false
var pick := "tower"
var structures: Array = []
var ghost: Node3D
var ghost_ok := false
var ghost_reason := ""
var ghost_pos := Vector3.ZERO
var _ghost_mat: StandardMaterial3D
var _ring_mat: StandardMaterial3D
var hover: Node = null # 건설 모드에서 조준한 건물 (F 수리 · U 강화 · X/우클릭 철거)
var core_level := 0

func _ready() -> void:
	ghost = Node3D.new()
	add_child(ghost)
	_ghost_mat = StandardMaterial3D.new()
	_ghost_mat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	_ghost_mat.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	_ring_mat = _ghost_mat.duplicate()
	_rebuild_ghost()
	ghost.visible = false

func _rebuild_ghost() -> void:
	for c in ghost.get_children():
		c.free()
	# 미리보기는 실제 건물 모양을 반투명하게 (웹 build.ts 의 ghost)
	var m: Node3D = StructureScript.make_model(pick, 1)
	ghost.add_child(m)
	for mi in m.find_children("*", "MeshInstance3D", true, false):
		mi.material_override = _ghost_mat
		mi.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	var def: Dictionary = GameData.buildings[pick]
	if def.has("trap") or def.has("turret"):
		var ring := MeshInstance3D.new()
		var t := TorusMesh.new()
		var r: float = def.trap.radius if def.has("trap") else def.turret.levels[0].range
		t.inner_radius = r - 0.12
		t.outer_radius = r
		t.rings = 64
		ring.mesh = t
		ring.scale = Vector3(1, 0.05, 1)
		ring.position.y = 0.12
		ring.material_override = _ring_mat
		ghost.add_child(ring)

func toggle() -> void:
	if not building and game.phase != "prep":
		game.toast(I18n.t("build.reason.prepOnly"))
		return
	building = not building
	ghost.visible = building
	game.player.build_mode = building
	hover = null

func select(i: int) -> void:
	if i < BUILDABLE.size():
		pick = BUILDABLE[i]
		_rebuild_ghost()

## checkSpot(): inside the build radius, clear of the core, other buildings and the player.
func check_spot(kind: String, x: float, z: float) -> String:
	var def: Dictionary = GameData.buildings[kind]
	var core := Vector2(float(GameData.map.core.x), float(GameData.map.core.z))
	var d := Vector2(x, z).distance_to(core)
	if d + float(def.radius) > float(GameData.map.buildRadius):
		return "outside"
	if d < float(GameData.core.radius) + float(def.radius) + 0.8:
		return "tooCloseCore"
	for s in structures:
		if Vector2(x - s.global_position.x, z - s.global_position.z).length() < s.radius + float(def.radius) - 0.05:
			return "overlap"
	var p: Vector3 = game.player.global_position
	if kind != "trap" and Vector2(x - p.x, z - p.z).length() < float(def.radius) + 0.6:
		return "onPlayer"
	if not game.can_afford(def.cost):
		return "noResources"
	return ""

func _process(_dt: float) -> void:
	if not building:
		return
	if game.phase != "prep":
		building = false
		ghost.visible = false
		game.player.build_mode = false
		hover = null
		game.toast(I18n.t("build.waveExit"))
		return
	# 화면 가운데에서 땅으로 광선을 쏘아 격자에 맞춘다
	var cam: Camera3D = game.player.camera
	var from := cam.global_position
	var to := from - cam.global_transform.basis.z * 30.0
	var q := PhysicsRayQueryParameters3D.create(from, to, 1)
	q.exclude = [game.player.get_rid()]
	var hit := get_world_3d().direct_space_state.intersect_ray(q)
	var p: Vector3 = hit.position if hit else to
	hover = null
	var bd := INF
	for s in structures:
		var d := Vector2(s.global_position.x - p.x, s.global_position.z - p.z).length()
		if d < s.radius + 0.5 and d < bd:
			bd = d
			hover = s
	var g: float = GameData.base.grid
	var cx: float = GameData.map.core.x
	var cz: float = GameData.map.core.z
	p.x = cx + roundf((p.x - cx) / g) * g
	p.z = cz + roundf((p.z - cz) / g) * g
	p.y = game.world.ground_y(p.x, p.z)
	ghost_pos = p
	ghost.visible = hover == null
	ghost.global_position = p
	ghost.rotation.y = atan2(-(cx - p.x), -(cz - p.z))
	ghost_reason = check_spot(pick, p.x, p.z)
	ghost_ok = ghost_reason == "" and hover == null
	_ghost_mat.albedo_color = Color(0.3, 1, 0.5, 0.35) if ghost_ok else Color(1, 0.25, 0.2, 0.35)
	_ring_mat.albedo_color = Color(0.18, 0.9, 0.84, 0.6) if ghost_ok else Color(0.88, 0.19, 0.23, 0.6)

func place() -> bool:
	if not building or not ghost_ok:
		if building and hover == null:
			game.toast(I18n.t("build.reason." + ghost_reason))
		return false
	var def: Dictionary = GameData.buildings[pick]
	if not game.spend(def.cost):
		return false
	spawn(pick, ghost_pos)
	return true

func spawn(kind: String, pos: Vector3) -> Node:
	var s := StructureScript.new()
	s.kind = kind
	s.game = game
	s.position = pos
	s.destroyed.connect(func(n): structures.erase(n))
	add_child(s)
	structures.append(s)
	return s

## The building the player is looking at / standing next to.
func focus_building() -> Node:
	var p: Vector3 = game.player.global_position
	var fwd: Vector3 = -game.player.camera.global_transform.basis.z
	var best: Node = null
	var bs := -INF
	for s in structures:
		var to: Vector3 = s.global_position - p
		to.y = 0
		var d := to.length()
		if d > s.radius + 3.0:
			continue
		var score := fwd.dot(to.normalized()) - d * 0.2
		if score > bs:
			bs = score
			best = s
	return best

func repair_cost(s: Node) -> Dictionary:
	var out := {}
	var k: float = 0.5 * (1.0 - s.hp / s.max_hp)
	for r in s.def.cost:
		var n := ceili(float(s.def.cost[r]) * k)
		if n > 0:
			out[r] = n
	return out

func repair(s: Node) -> bool:
	if s.hp >= s.max_hp or not game.spend(repair_cost(s)):
		return false
	s.hp = s.max_hp
	return true

func upgrade_info(s: Node) -> Dictionary:
	var lv: Array = s.levels()
	return lv[s.level] if s.level < lv.size() else {}

func upgrade(s: Node) -> bool:
	if game.phase != "prep":
		game.toast(I18n.t("build.upgradePrepOnly"))
		return false
	var u := upgrade_info(s)
	if u.is_empty() or not game.spend(u.upCost, int(u.upGold)):
		return false
	s.set_level(s.level + 1)
	s.max_hp = roundf(float(s.def.hp) * (1.0 + 0.25 * (s.level - 1)))
	s.hp = s.max_hp
	return true

## Demolish refunds DEMOLISH_REFUND of the cost scaled by remaining hp.
func demolish(s: Node) -> void:
	var frac: float = float(GameData.base.demolishRefund) * s.hp / s.max_hp
	for r in s.def.cost:
		game.res[r] += int(floor(float(s.def.cost[r]) * frac))
	structures.erase(s)
	s.dead = true
	s.queue_free()

# ── 핵 ───────────────────────────────────────────────────────────────

func core_upgrade_info() -> Dictionary:
	var ups: Array = GameData.base.coreUpgrades
	return ups[core_level] if core_level < ups.size() else {}

func repair_core() -> bool:
	var c: Node = game.core
	var rep: Dictionary = GameData.base.coreRepair
	if c.dead or c.hp >= c.max_hp or not game.spend(rep.cost):
		return false
	c.hp = minf(c.max_hp, c.hp + c.max_hp * float(rep.pct))
	return true

func upgrade_core() -> bool:
	if game.phase != "prep":
		game.toast(I18n.t("build.upgradePrepOnly"))
		return false
	var u := core_upgrade_info()
	if u.is_empty() or not game.spend(u.cost, int(u.gold)):
		return false
	core_level += 1
	var c: Node = game.core
	var old: float = c.max_hp
	c.max_hp = float(GameData.core.hp[core_level])
	c.hp = minf(c.max_hp, c.hp + (c.max_hp - old))
	return true
