extends Node3D
## Base building: B build mode (prep only), grid placement around the core, demolish, repair, upgrade,
## and the core's own repair / upgrade. Port of src/base/logic/base.ts + grid.ts.

const StructureScript := preload("res://scripts/structure.gd")
## 지을 수 있는 건물 (1~7 키). 연구소·숙소·상점의 동작은 allies.gd / station_panel.gd
const BUILDABLE := ["tower", "mgtower", "barricade", "trap", "lab", "barracks", "shop"]

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
## 포탑은 판이 끝나도 남는다 (meta.turrets). 헤드리스 테스트에서는 저장소를 건드리지 않는다.
var persist := DisplayServer.get_name() != "headless"
var _save_dirty := false
var _save_t := 0.0
var _regen_t := 0.0
const SAVE_EVERY := 2.0

func _ready() -> void:
	call_deferred("restore_turrets") # game.gd 가 meta(영구 업그레이드)를 채운 뒤에
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

func _process(dt: float) -> void:
	_core_regen(dt)
	if _save_dirty:
		_save_t += dt
		if _save_t >= SAVE_EVERY:
			persist_turrets(true)
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

## 준비 단계에는 핵이 0.5초마다 최대 체력의 0.6% 씩 저절로 회복된다 (base.ts update).
func _core_regen(dt: float) -> void:
	var c: Node = game.core
	if game.phase != "prep" or c.dead or c.hp >= c.max_hp:
		_regen_t = 0.0
		return
	_regen_t += dt
	if _regen_t >= 0.5:
		_regen_t = 0.0
		c.heal_pct(0.006)

func place() -> bool:
	if not building or not ghost_ok:
		if building and hover == null:
			game.toast(I18n.t("build.reason." + ghost_reason))
		return false
	var def: Dictionary = GameData.buildings[pick]
	if not game.spend(def.cost):
		return false
	var s: Node = spawn(pick, ghost_pos)
	Sfx.play("build", s.global_position)
	game.hazards.ring(ghost_pos, float(def.radius), 0.35, Color(0.3, 1, 0.5)) # 웹의 'placed' 이펙트
	if def.has("turret"):
		persist_turrets(true)
	return true

func spawn(kind: String, pos: Vector3) -> Node:
	var s := StructureScript.new()
	s.kind = kind
	s.game = game
	s.position = pos
	s.destroyed.connect(_on_destroyed)
	add_child(s)
	structures.append(s)
	return s

func _on_destroyed(n: Node) -> void:
	structures.erase(n)
	if n.def.has("turret"):
		persist_turrets(true)

# ── 포탑 저장 (persistTurrets / restoreTurrets) ─────────────────────────

## meta.turrets 에 살아 있고 내구도가 남은 포탑을 적는다. now=false 면 저장소 쓰기는 미뤄 2초마다 한 번만.
func persist_turrets(now := true) -> void:
	if not persist:
		return
	var list := []
	for s in structures:
		if not s.dead and s.def.has("turret") and s.ammo > 0:
			list.append({"kind": s.kind, "x": s.position.x, "z": s.position.z, "level": s.level, "hp": s.hp, "ammo": s.ammo})
	Save.meta["turrets"] = list
	if now:
		_save_dirty = false
		_save_t = 0.0
		Save.save_meta()
	else:
		_save_dirty = true

func flush_turrets() -> void:
	if _save_dirty:
		persist_turrets(true)

func _exit_tree() -> void:
	flush_turrets()

func restore_turrets() -> void:
	if not persist:
		return
	for t in Save.meta.get("turrets", []):
		if not t is Dictionary or not t.get("kind") in ["tower", "mgtower"]:
			continue
		if not float(t.get("hp", 0)) > 0.0 or not float(t.get("ammo", 0)) > 0.0:
			continue
		var dup := false
		for o in structures:
			if o.kind == t.kind and Vector2(o.position.x - float(t.x), o.position.z - float(t.z)).length() < 0.5:
				dup = true
		if dup:
			continue
		var def: Dictionary = GameData.buildings[t.kind]
		var lv := clampi(int(t.get("level", 1)), 1, def.turret.levels.size())
		var s: Node = spawn(t.kind, Vector3(float(t.x), game.world.ground_y(float(t.x), float(t.z)), float(t.z)))
		if lv > 1:
			s.set_level(lv)
		s.max_hp = roundf(float(def.hp) * (1.0 + float(game.meta.get("turretHpMul", 0.0))) * (1.0 + 0.25 * (lv - 1)))
		s.hp = minf(s.max_hp, maxf(1.0, float(t.hp)))
		s.ammo = maxi(1, int(t.ammo))

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

## E 로 쓰는 건물 곁: 가까운 건물 하나 (src/base/index.ts linkFor: range = radius + 2.4).
## 연구소·상점은 allies.gd 의 station_near 가 맡으므로 여기서는 제외한다.
func near_building(p: Vector3) -> Node:
	var best: Node = null
	var bd := INF
	for s in structures:
		if s.dead or s.kind == "lab" or s.kind == "shop":
			continue
		var d := Vector2(s.global_position.x - p.x, s.global_position.z - p.z).length()
		if d <= s.radius + 2.4 and d < bd:
			bd = d
			best = s
	return best

## actionFor(): 다친 건물은 수리, 아니면 준비 단계에 강화, 포탑이면 내구도 안내. 없으면 {}.
func building_action(s: Node) -> Dictionary:
	var name := I18n.bld_name(s.kind)
	if s.hp < s.max_hp - 0.5:
		return {"kind": "repair", "label": I18n.t("build.act.repair", {"name": name, "c": I18n.cost_text(repair_cost(s))})}
	var u := upgrade_info(s) if game.phase == "prep" else {}
	if not u.is_empty():
		return {"kind": "upgrade", "label": I18n.t("build.act.upgrade", {"name": name, "lv": s.level + 1, "c": I18n.cost_text(u.upCost, int(u.upGold))})}
	if s.def.has("turret"):
		return {"kind": "info", "label": I18n.t("build.act.durability", {"name": name, "n": s.ammo, "max": s.def.turret.ammo})}
	return {}

## near_building() only when E would really do something there (repair / upgrade).
func actionable_near(p: Vector3) -> Node:
	var b := near_building(p)
	if b and building_action(b).get("kind", "") in ["repair", "upgrade"]:
		return b
	return null

func perform(s: Node, a: Dictionary) -> bool:
	match a.get("kind", ""):
		"repair": return repair(s)
		"upgrade": return upgrade(s)
	return false

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
	if s.def.has("turret"):
		persist_turrets(true)
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
	s.max_hp = roundf(float(s.def.hp) * (1.0 + float(game.meta.get("turretHpMul", 0.0))) * (1.0 + 0.25 * (s.level - 1)))
	s.hp = s.max_hp
	game.hazards.ring(s.global_position, s.radius, 0.35, Color(0.3, 1, 0.5))
	persist_turrets(true)
	return true

## Demolish refunds DEMOLISH_REFUND of the cost scaled by remaining hp.
func demolish(s: Node) -> void:
	var frac: float = float(GameData.base.demolishRefund) * s.hp / s.max_hp
	for r in s.def.cost:
		game.res[r] += int(floor(float(s.def.cost[r]) * frac))
	structures.erase(s)
	s.dead = true
	s.fx_demolish()
	s.queue_free()
	if s.def.has("turret"):
		persist_turrets(true)

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
