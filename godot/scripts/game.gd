extends Node3D
## The 3D sortie: world, lanes, core, waves, coins, HUD and the death card.
## Waves port src/enemies/logic/director.ts (queue of lane groups, roster, elites, bosses).
## Gathering (E), base building (B) and turrets port src/gathering and src/base. Allies, vaccines, lab and shop: allies.gd, station_panel.gd.

const ZombieScript := preload("res://scripts/zombie.gd")
const PlayerScript := preload("res://scripts/player.gd")
const ShopScript := preload("res://scripts/weapon_shop.gd")
const HazardsScript := preload("res://scripts/hazards.gd")
const CoreScript := preload("res://scripts/core.gd")
const WorldScript := preload("res://scripts/world.gd")
const AlliesScript := preload("res://scripts/allies.gd")
const AudioDirectorScript := preload("res://scripts/audio_director.gd")
const BaseScript := preload("res://scripts/base.gd")
const StationScript := preload("res://scripts/station_panel.gd")
const PauseScript := preload("res://scripts/pause_menu.gd")
const GatheringScript := preload("res://scripts/gathering.gd")
const RoamersScript := preload("res://scripts/roamers.gd")
const LookScript := preload("res://scripts/look.gd")
const HudStyle := preload("res://scripts/hud_style.gd")
const BuildOverlay := preload("res://scripts/build_overlay.gd")
const UiKit := preload("res://scripts/ui_kit.gd")
const FloatingText := preload("res://scripts/floating_text.gd")
const Skills := preload("res://scripts/skills.gd")
const SkillPanelScript := preload("res://scripts/skill_panel.gd")
const DeathCardScript := preload("res://scripts/death_card.gd")
const PREP_TIME := 60.0 # 웹 게임과 같은 기지 건설 시간. N 으로 바로 시작

var player: CharacterBody3D
var wave := 0
var wave_started := false
var phase := "prep" # prep / combat / ended
var queue: Array = [] # [{type, lane, elite}]
var boss_pending := {}
var boss_at := 0.0
var spawn_gap := 0.5
var alive := 0
var spawn_timer := 0.0
var prep_left := PREP_TIME
var res := {}
var meta := {} # 본부 영구 업그레이드 보너스 (meta_bonus.gd)
var base: Node3D
var gathering: Node3D
var roamers: Node
var gather_focus := {}
var lbl_res: Label
var lbl_prompt: Label
var gather_bar: ProgressBar
var build_panel: Label
var build_hover: Label
var core: StaticBody3D
var core_dead := false
var hazards: Node3D
var boss: Node3D
var lose_reason := "player"
var kills := 0
var coins := 0
var rng := RandomNumberGenerator.new()

var hud: Control
var lbl_top: Label
var lbl_ammo: Label
var lbl_center: Label
var lbl_hint: Label
var lbl_gun: Label
var scope: Control
var shop: CanvasLayer
var hp_bar: ProgressBar
var core_bar: ProgressBar
var boss_bar: ProgressBar
var lbl_boss: Label
var lbl_toast: Label
var lbl_core: Label
var crosshair: Control
var hitmark := 0.0
var hurt_flash: ColorRect
var zombies_root: Node3D
var world: Node3D
var core_visual: Node3D
var allies: Node3D
var station: CanvasLayer
var skill_panel: CanvasLayer
var samples := 0
var samples_sp := 0
var _t := 0.0
var _toast_tw: Tween
var floating: Node # 데미지 숫자 (floating_text.gd)
var _pending_dmg: Array = [] # 이번 프레임 피해 [좀비 위치, 수치, 처치]; 사격이면 fired 가 헤드샷 여부를 붙여 비운다
var hit_kind := "normal"
var hit_total := 0.25

func _ready() -> void:
	rng.randomize()
	hazards = HazardsScript.new()
	hazards.game = self
	add_child(hazards)
	_build_environment()
	_build_world()
	player = PlayerScript.new()
	var ps: Dictionary = GameData.map.playerStart
	player.position = Vector3(float(ps.x), world.ground_y(float(ps.x), float(ps.z) + 3.0) + 0.3, float(ps.z) + 3.0)
	player.rotation.y = PI # 핵을 등지고 바깥을 본다
	add_child(player)
	player.fired.connect(_on_fired)
	player.hurt.connect(_on_hurt)
	player.died.connect(_on_died)
	zombies_root = Node3D.new()
	add_child(zombies_root)
	for r in GameData.res.keys:
		res[r] = int(GameData.base_start.get(r, 0))
	base = BaseScript.new()
	base.game = self
	add_child(base)
	gathering = GatheringScript.new()
	gathering.game = self
	add_child(gathering)
	gathering.gathered.connect(_on_gathered)
	roamers = RoamersScript.new()
	roamers.game = self
	add_child(roamers)
	_build_hud()
	HudStyle.apply(self) # 웹 HUD 모양(어두운 알약 패널, 로고)
	floating = FloatingText.apply(self)
	zombies_root.child_entered_tree.connect(func(n: Node):
		if n.has_signal("damaged"):
			n.damaged.connect(_on_zombie_damaged))
	preload("res://scripts/core_pointer.gd").apply(self) # 핵 위치 화살표와 피격 알림
	BuildOverlay.apply(self) # 건설 구역 테두리·격자, 레인 입구 표식
	I18n.locale_changed.connect(_refresh_hud)
	shop = ShopScript.new()
	shop.game = self
	add_child(shop)
	allies = AlliesScript.new()
	allies.game = self
	add_child(allies)
	station = StationScript.new()
	station.game = self
	add_child(station)
	skill_panel = SkillPanelScript.new() # Tab: 스킬 트리
	skill_panel.game = self
	add_child(skill_panel)
	var pause_menu := PauseScript.new()
	pause_menu.game = self
	add_child(pause_menu)
	var audio := AudioDirectorScript.new()
	audio.game = self
	add_child(audio)
	preload("res://scripts/meta_bonus.gd").apply(self) # 본부 영구 업그레이드
	Skills.apply(self) # 스킬 트리 (런 경험치 포함)

# ── 월드 ─────────────────────────────────────────────────────────────

## Sky, fog, lights, skyline and embers: look.gd (port of src/core/atmosphere.ts).
func _build_environment() -> void:
	var look := LookScript.new()
	look.game = self
	add_child(look)

func _build_world() -> void:
	world = WorldScript.new()
	add_child(world)
	core = CoreScript.new()
	core.setup(GameData.core)
	core.destroyed.connect(_on_core_destroyed)
	var shape := CollisionShape3D.new()
	var cyl := CylinderShape3D.new()
	cyl.radius = core.radius
	cyl.height = float(GameData.core.height)
	shape.shape = cyl
	shape.position.y = cyl.height * 0.5
	core.add_child(shape)
	add_child(core)
	core.position.y = world.ground_y(0, 0)
	# 핵 모양은 웹 게임의 buildCoreModel 그대로
	var lib: Node = (load("res://assets/models/buildings.glb") as PackedScene).instantiate()
	core_visual = lib.get_node("core_0").duplicate()
	core.add_child(core_visual)
	for n in core_visual.find_children("shield*", "MeshInstance3D", true, false):
		n.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	var core_light := OmniLight3D.new() # 웹: PointLight(0x66ccff, 2.2, 22, 감쇠 1.6) — 은은하게
	core_light.light_color = Color(0.4, 0.8, 1.0)
	core_light.omni_range = 22.0
	core_light.omni_attenuation = 1.6
	core_light.light_energy = 0.6
	core_light.light_specular = 0.0
	core_light.position = Vector3(0, 3.2, 0)
	core.add_child(core_light)

## Core upgrade swaps in buildCoreModel(level), as baseView.ts does.
func set_core_level(lv: int) -> void:
	var lib: Node = (load("res://assets/models/buildings.glb") as PackedScene).instantiate()
	if core_visual:
		core_visual.queue_free()
	core_visual = lib.get_node("core_%d" % clampi(lv, 0, 3)).duplicate()
	core.add_child(core_visual)
	lib.free()
	for n in core_visual.find_children("shield*", "MeshInstance3D", true, false):
		n.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF

func _process_core_visual(t: float) -> void:
	if core_visual == null:
		return
	var crystal := core_visual.find_child("crystal-*", true, false)
	if crystal:
		crystal.rotation.y = t * 0.8
		crystal.position.y = 2.9 + sin(t * 1.6) * 0.12
	for sh in core_visual.find_children("shards*", "Node3D", true, false):
		sh.rotation.y = -t * 0.5

func _near_lane(p: Vector3, margin: float) -> bool:
	for l in GameData.map.lanes:
		var pts: Array = l.waypoints
		for i in range(1, pts.size()):
			var a := Vector2(float(pts[i - 1].x), float(pts[i - 1].z))
			var b := Vector2(float(pts[i].x), float(pts[i].z))
			var q := Geometry2D.get_closest_point_to_segment(Vector2(p.x, p.z), a, b)
			if q.distance_to(Vector2(p.x, p.z)) < margin:
				return true
	return false

func _static_box(size: Vector3, pos: Vector3, mat: Material) -> StaticBody3D:
	var mesh := BoxMesh.new()
	mesh.size = size
	var shape := BoxShape3D.new()
	shape.size = size
	return _static(mesh, shape, pos, mat)

func _static_cylinder(radius: float, height: float, pos: Vector3, mat: Material, body: StaticBody3D = null) -> StaticBody3D:
	var mesh := CylinderMesh.new()
	mesh.top_radius = radius * 0.7
	mesh.bottom_radius = radius
	mesh.height = height
	var shape := CylinderShape3D.new()
	shape.radius = radius
	shape.height = height
	return _static(mesh, shape, pos, mat, body)

func _static(mesh: Mesh, shape: Shape3D, pos: Vector3, mat: Material, body: StaticBody3D = null) -> StaticBody3D:
	if body == null:
		body = StaticBody3D.new()
	body.position = pos
	var mi := MeshInstance3D.new()
	mi.mesh = mesh
	mi.material_override = mat
	body.add_child(mi)
	var cs := CollisionShape3D.new()
	cs.shape = shape
	body.add_child(cs)
	add_child(body)
	return body

# ── 자원 ─────────────────────────────────────────────────────────────

func can_afford(cost: Dictionary, gold: int = 0) -> bool:
	if coins < gold:
		return false
	for r in cost:
		if int(res.get(r, 0)) < int(cost[r]):
			return false
	return true

## Pays cost (+ coins) or toasts what is missing.
func spend(cost: Dictionary, gold: int = 0) -> bool:
	if not can_afford(cost, gold):
		toast(I18n.t("toast.lacking", {"c": I18n.cost_text(cost, gold)}))
		return false
	coins -= gold
	for r in cost:
		res[r] -= int(cost[r])
	return true

func _on_gathered(r: String, amount: int, _pos: Vector3) -> void:
	res[r] += amount
	toast(I18n.t("toast.gathered", {"n": amount, "res": I18n.res_name(r)}))

## Hold E next to a node to gather it; press E near the core to repair / upgrade it.
func _update_interact(dt: float) -> void:
	var p := player.global_position
	gather_focus = {} if player.dead or base.building else gathering.nearest_ready(p)
	var holding := Input.is_physical_key_pressed(KEY_E) and Input.mouse_mode == Input.MOUSE_MODE_CAPTURED
	if not gather_focus.is_empty() and holding:
		gathering.harvest(gather_focus, dt * (1.0 + float(meta.get("gatherSpeed", 0.0))))

func core_action() -> Dictionary:
	if core_dead or base.building:
		return {}
	if core.hp < core.max_hp - 0.5:
		return {"kind": "repair", "label": I18n.t("core.repair", {"c": I18n.cost_text(GameData.base.coreRepair.cost)})}
	var u: Dictionary = base.core_upgrade_info() if phase == "prep" else {}
	if not u.is_empty():
		return {"kind": "upgrade", "label": I18n.t("core.upgrade", {"lv": base.core_level + 2, "c": I18n.cost_text(u.cost, int(u.gold))})}
	return {}

func _near_core() -> bool:
	var p := player.global_position
	return Vector2(p.x - core.global_position.x, p.z - core.global_position.z).length() < core.radius + 3.0

# ── 웨이브 ───────────────────────────────────────────────────────────

func _process(dt: float) -> void:
	_t += dt
	_process_core_visual(_t)
	hitmark = maxf(0.0, hitmark - dt)
	if not _pending_dmg.is_empty(): # 사격이 아닌 피해(아군·포탑·함정·폭발)
		_flush_damage(false)
	hurt_flash.color.a = maxf(0.0, hurt_flash.color.a - dt * 1.5)
	if phase == "ended":
		return
	if phase == "prep":
		prep_left -= dt
		if prep_left <= 0.0:
			_start_wave()
	else:
		_update_combat(dt)
	_update_interact(dt)
	_refresh_hud()

func _unhandled_input(event: InputEvent) -> void:
	if phase == "ended" or player.dead:
		return
	var captured := Input.mouse_mode == Input.MOUSE_MODE_CAPTURED
	if event is InputEventKey and event.pressed and not event.echo:
		match event.keycode:
			KEY_N: # 준비 시간을 건너뛰고 다음 웨이브 (웹 게임과 같은 키)
				if phase == "prep":
					if base.building:
						base.toggle()
					prep_left = 0.0
			KEY_B:
				base.toggle()
			KEY_E:
				var st: String = allies.station_near(player.global_position)
				if st != "" and not base.building:
					station.open(st)
				elif not base.building and gathering.nearest_ready(player.global_position).is_empty() and base.actionable_near(player.global_position):
					var b: Node = base.actionable_near(player.global_position)
					base.perform(b, base.building_action(b))
				elif _near_core() and gathering.nearest_ready(player.global_position).is_empty():
					var a := core_action()
					if a.get("kind") == "repair":
						base.repair_core()
					elif a.get("kind") == "upgrade" and base.upgrade_core():
						set_core_level(base.core_level)
			KEY_X:
				if base.building and base.hover:
					_demolish(base.hover)
			KEY_F:
				if base.building and base.hover:
					base.repair(base.hover)
			KEY_U:
				if base.building and base.hover:
					base.upgrade(base.hover)
			_:
				if base.building and event.keycode >= KEY_1 and event.keycode <= KEY_7:
					base.select(event.keycode - KEY_1)
	elif event is InputEventMouseButton and event.pressed and captured and base.building:
		if event.button_index == MOUSE_BUTTON_LEFT:
			base.place()
		elif event.button_index == MOUSE_BUTTON_RIGHT and base.hover:
			_demolish(base.hover)

func _demolish(s: Node) -> void:
	var name := I18n.bld_name(s.kind)
	var refund := {}
	var frac: float = float(GameData.base.demolishRefund) * s.hp / s.max_hp
	for r in s.def.cost:
		refund[r] = int(floor(float(s.def.cost[r]) * frac))
	base.demolish(s)
	toast(I18n.t("build.demolish", {"name": name, "refund": I18n.cost_text(refund)}))

func _roll(w: int) -> Dictionary:
	var roster := GameData.wave_roster(w)
	var r := rng.randf()
	for e in roster:
		r -= float(e.weight)
		if r <= 0.0:
			return e
	return roster[0]

## startCombat(): 3~5마리씩 같은 레인에서 몰려오고, 떼거리는 한 무리가 통째로. 10의 배수는 보스 웨이브
func _start_wave() -> void:
	wave_started = true
	wave += 1
	phase = "combat"
	var lanes: int = GameData.map.lanes.size()
	var count := GameData.wave_count(wave)
	var is_boss := GameData.is_boss_wave(wave)
	if is_boss:
		count = ceili(count * 0.6)
	queue.clear()
	var lane := rng.randi() % lanes
	var left := 0
	var ec := GameData.elite_chance(wave)
	while queue.size() < count:
		left -= 1
		if left < 0:
			lane = rng.randi() % lanes
			left = 2 + rng.randi() % 3
		var e := _roll(wave)
		if int(e.pack) > 1:
			for i in int(e.pack):
				if queue.size() < count:
					queue.append({"type": e.type, "lane": lane, "elite": false})
			left = 0
			continue
		queue.append({"type": e.type, "lane": lane, "elite": ec > 0.0 and e.type != "swarmer" and rng.randf() < ec})
	spawn_gap = (18.0 + minf(30.0, wave * 0.5)) / count
	spawn_timer = 1.5
	boss_pending = {}
	if is_boss:
		boss_pending = {"type": GameData.boss_type_for(wave), "lane": rng.randi() % lanes}
		boss_at = 3.0
		var bt: String = boss_pending.type
		toast(I18n.t("toast.bossKing") if wave == GameData.final_wave else I18n.t("toast.bossWave", {"n": wave, "name": I18n.zombie_name(bt)}))
	_banner(I18n.t("hud.wave", {"n": wave}), "boss" if is_boss else "wave", I18n.t("toast.bossKing") if is_boss and wave == GameData.final_wave else (I18n.t("toast.bossWave", {"n": wave, "name": I18n.zombie_name(GameData.boss_type_for(wave))}) if is_boss else ""))
	# 이번 웨이브에 처음 나오는 종류 알림
	var prev: Array = GameData.wave_roster(wave - 1).map(func(e): return e.type) if wave > 1 else ["normal"]
	for e in GameData.wave_roster(wave):
		if not e.type in prev:
			toast(I18n.t("toast.newEnemy", {"name": I18n.zombie_name(e.type)}))

func _update_combat(dt: float) -> void:
	spawn_timer -= dt
	if not boss_pending.is_empty():
		boss_at -= dt
		if boss_at <= 0.0:
			boss = spawn_on_lane(boss_pending.type, int(boss_pending.lane), false)
			boss_pending = {}
	while spawn_timer <= 0.0 and not queue.is_empty() and alive < GameData.max_alive:
		var n: Dictionary = queue.pop_front()
		spawn_on_lane(n.type, int(n.lane), bool(n.elite))
		spawn_timer += spawn_gap * (0.6 + rng.randf() * 0.8)
	spawn_timer = maxf(spawn_timer, 0.0)
	if queue.is_empty() and boss_pending.is_empty() and alive == 0:
		_wave_cleared()

## HUD 웨이브 번호: 아직 한 웨이브도 시작하지 않았으면(시작 웨이브를 산 경우 wave 는 N-1) 곧 시작할 웨이브를 보여 준다
func shown_wave() -> int:
	return maxi(wave + (1 if not wave_started else 0), 1)

func remaining() -> int:
	return alive + queue.size() + (0 if boss_pending.is_empty() else 1)

## spawnOnLane(): 핵에서 레인 경로로 laneSpawnDist(wave) 만큼 거슬러 올라간 곳
func spawn_on_lane(type: String, lane: int, elite: bool) -> Node3D:
	var pts: Array = GameData.map.lanes[lane % GameData.map.lanes.size()].waypoints
	var i := pts.size() - 1
	var p := Vector2(float(pts[i].x), float(pts[i].z))
	var c := Vector2(float(GameData.map.core.x), float(GameData.map.core.z))
	var left := GameData.lane_spawn_dist(wave) - p.distance_to(c)
	while left > 0.0 and i > 0:
		var a := Vector2(float(pts[i - 1].x), float(pts[i - 1].z))
		var seg := p.distance_to(a)
		if left < seg:
			p = p.lerp(a, left / seg)
			break
		left -= seg
		p = a
		i -= 1
	var ang := rng.randf() * TAU
	var r := rng.randf() * 3.0
	var z := spawn_zombie(type, Vector3(p.x + cos(ang) * r, 0.2, p.y + sin(ang) * r), lane, elite)
	z.wp = i
	return z

func spawn_zombie(type: String, pos: Vector3, lane: int, elite: bool) -> Node3D:
	var z := ZombieScript.new()
	z.type = type
	z.wave = maxi(1, wave)
	z.elite = elite
	z.lane = lane
	z.game = self
	z.position = Vector3(pos.x, world.ground_y(pos.x, pos.z) + 0.3, pos.z)
	z.killed.connect(_on_zombie_killed)
	zombies_root.add_child(z)
	alive += 1
	return z

func _on_zombie_killed(z: Node, gold: int) -> void:
	alive -= 1
	kills += 1
	coins += Skills.on_kill(self, z, gold)
	if not z.converted:
		allies.roll_sample(z.type)
	if z == boss:
		boss = null
		if z.type == "king":
			toast(I18n.t("toast.kingDown"))

func _wave_cleared() -> void:
	var bonus: int = int(GameData.enemy_rules.waveClearGold) + wave * 2
	coins += bonus
	core.heal_pct(GameData.enemy_rules.waveClearCorePct)
	var sp: float = GameData.enemy_rules.waveClearStructPct
	for b in base.structures:
		b.hp = minf(b.max_hp, b.hp + b.max_hp * sp)
	phase = "prep"
	prep_left = PREP_TIME + float(meta.get("prepBonus", 0.0)) # 웹 prepTime(): 매 웨이브 영구 보너스 포함
	_banner(I18n.t("hud.wave", {"n": wave}) + "  ✓", "clear", "+%d" % bonus)

func _on_core_destroyed() -> void:
	core_dead = true
	if phase == "ended": # 플레이어가 먼저 쓰러졌으면 사망 사유를 바꾸지 않는다
		return
	lose_reason = "core"
	player.die()

func toast(text: String) -> void:
	lbl_toast.text = text
	lbl_toast.modulate.a = 1.0
	if _toast_tw:
		_toast_tw.kill() # 앞선 토스트의 페이드가 새 글자를 일찍 지우지 않게
	var tw := create_tween()
	_toast_tw = tw
	tw.tween_interval(2.6)
	tw.tween_property(lbl_toast, "modulate:a", 0.0, 0.6)

# ── 사격 연출 ─────────────────────────────────────────────────────────

func _on_zombie_damaged(z: Node, amount: float, died: bool) -> void:
	_pending_dmg.append([z.global_position + Vector3(0, z.height, 0), amount, died])

## 쌓인 피해를 숫자로 띄운다. 플레이어 사격이면 head 가 true (관통이면 첫 명중 외엔 일반 숫자).
func _flush_damage(head: bool) -> void:
	for i in _pending_dmg.size():
		var d: Array = _pending_dmg[i]
		floating.spawn(d[0], d[1], "kill" if d[2] else ("head" if head and i == 0 else "normal"))
	_pending_dmg.clear()

func _on_fired(from: Vector3, to: Vector3, hit_zombie: bool, headshot: bool, kill: bool, also: Array) -> void:
	_flush_damage(headshot)
	tracer(from, to)
	for pt in also:
		_blood(pt)
	if hit_zombie:
		hit_kind = "kill" if kill else ("head" if headshot else "normal")
		hit_total = HudStyle.HIT_TIME[hit_kind]
		hitmark = hit_total
		_blood(to)
	else:
		_puff(to)

func tracer(from: Vector3, to: Vector3, col: Color = Color(0, 0, 0, 0)) -> void:
	var mesh := ImmediateMesh.new()
	mesh.surface_begin(Mesh.PRIMITIVE_LINES)
	mesh.surface_add_vertex(from)
	mesh.surface_add_vertex(to)
	mesh.surface_end()
	var mat := StandardMaterial3D.new()
	mat.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	mat.albedo_color = col if col.a > 0.0 else Color.hex((int(player.gun.tracer) << 8) | 0xff)
	mat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	var mi := MeshInstance3D.new()
	mi.mesh = mesh
	mi.material_override = mat
	add_child(mi)
	var tw := create_tween()
	tw.tween_property(mat, "albedo_color:a", 0.0, 0.08)
	tw.tween_callback(mi.queue_free)

func _burst(at: Vector3, col: Color, n: int, spd: float) -> void:
	var p := CPUParticles3D.new()
	p.one_shot = true
	p.emitting = true
	p.amount = n
	p.lifetime = 0.45
	p.explosiveness = 1.0
	p.direction = Vector3.UP
	p.spread = 70.0
	p.initial_velocity_min = spd * 0.5
	p.initial_velocity_max = spd
	p.gravity = Vector3(0, -12, 0)
	var m := BoxMesh.new()
	m.size = Vector3.ONE * 0.06
	var mat := StandardMaterial3D.new()
	mat.albedo_color = col
	mat.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	m.material = mat
	p.mesh = m
	p.position = at
	add_child(p)
	get_tree().create_timer(1.0).timeout.connect(p.queue_free)

func _blood(at: Vector3) -> void:
	_burst(at, Color(0.55, 0.05, 0.04), 14, 4.0)

func _puff(at: Vector3) -> void:
	_burst(at, Color(0.6, 0.55, 0.45), 8, 2.5)

func _on_hurt(_hp: float) -> void:
	hurt_flash.color.a = 0.45

# ── HUD ──────────────────────────────────────────────────────────────

func _build_hud() -> void:
	var layer := CanvasLayer.new()
	add_child(layer)
	hud = Control.new()
	hud.set_anchors_preset(Control.PRESET_FULL_RECT)
	hud.mouse_filter = Control.MOUSE_FILTER_IGNORE
	layer.add_child(hud)
	hurt_flash = ColorRect.new()
	hurt_flash.color = Color(0.7, 0, 0, 0)
	hurt_flash.set_anchors_preset(Control.PRESET_FULL_RECT)
	hurt_flash.mouse_filter = Control.MOUSE_FILTER_IGNORE
	hud.add_child(hurt_flash)
	scope = Control.new()
	scope.set_anchors_preset(Control.PRESET_FULL_RECT)
	scope.mouse_filter = Control.MOUSE_FILTER_IGNORE
	scope.draw.connect(_draw_scope)
	scope.visible = false
	hud.add_child(scope)
	crosshair = Control.new()
	crosshair.set_anchors_preset(Control.PRESET_CENTER)
	crosshair.mouse_filter = Control.MOUSE_FILTER_IGNORE
	crosshair.draw.connect(_draw_crosshair)
	hud.add_child(crosshair)
	lbl_top = _label(hud, 22, Control.PRESET_TOP_LEFT, Vector2(24, 18))
	lbl_ammo = _label(hud, 34, Control.PRESET_BOTTOM_RIGHT, Vector2(-220, -78))
	lbl_ammo.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	lbl_ammo.size.x = 196
	lbl_gun = _label(hud, 18, Control.PRESET_BOTTOM_RIGHT, Vector2(-320, -104))
	lbl_gun.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	lbl_gun.size.x = 296
	lbl_gun.modulate.a = 0.85
	lbl_center = _label(hud, 40, Control.PRESET_CENTER_TOP, Vector2(-400, 90))
	lbl_center.size.x = 800
	lbl_center.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	lbl_hint = _label(hud, 15, Control.PRESET_CENTER_BOTTOM, Vector2(-500, -34))
	lbl_hint.size.x = 1000
	lbl_hint.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	lbl_hint.modulate.a = 0.75
	hp_bar = ProgressBar.new()
	hp_bar.set_anchors_preset(Control.PRESET_BOTTOM_LEFT)
	hp_bar.position = Vector2(24, -56)
	hp_bar.size = Vector2(280, 22)
	hp_bar.show_percentage = false
	var fill := StyleBoxFlat.new()
	fill.bg_color = Color(0.85, 0.2, 0.2)
	var bg := StyleBoxFlat.new()
	bg.bg_color = Color(0, 0, 0, 0.55)
	hp_bar.add_theme_stylebox_override("fill", fill)
	hp_bar.add_theme_stylebox_override("background", bg)
	hud.add_child(hp_bar)
	# 위치는 화면 크기에 맞춰 _refresh_hud 에서 정한다
	core_bar = _bar(Vector2.ZERO, Vector2(280, 12), Color(0.2, 0.85, 0.8))
	boss_bar = _bar(Vector2.ZERO, Vector2(560, 18), Color(0.85, 0.15, 0.15))
	lbl_core = _label(hud, 13, Control.PRESET_TOP_LEFT, Vector2.ZERO)
	lbl_boss = _label(hud, 18, Control.PRESET_CENTER_TOP, Vector2(-280, 52))
	lbl_boss.size.x = 560
	lbl_boss.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	lbl_toast = _label(hud, 22, Control.PRESET_CENTER_TOP, Vector2(-450, 150))
	lbl_toast.size.x = 900
	lbl_toast.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	lbl_toast.add_theme_color_override("font_color", Color(1, 0.8, 0.4))
	lbl_res = _label(hud, 18, Control.PRESET_TOP_LEFT, Vector2(24, 50))
	lbl_prompt = _label(hud, 20, Control.PRESET_CENTER, Vector2(-300, 40))
	lbl_prompt.size.x = 600
	lbl_prompt.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	lbl_prompt.add_theme_color_override("font_color", Color(1, 0.95, 0.7))
	gather_bar = _bar(Vector2.ZERO, Vector2(180, 10), Color(1, 0.82, 0.35))
	build_panel = _label(hud, 17, Control.PRESET_TOP_RIGHT, Vector2.ZERO)
	build_panel.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	build_panel.size.x = 520
	build_hover = _label(hud, 17, Control.PRESET_CENTER, Vector2(-320, 70))
	build_hover.size.x = 640
	build_hover.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	_refresh_hud()

func _bar(pos: Vector2, size: Vector2, col: Color) -> ProgressBar:
	var b := ProgressBar.new()
	b.position = pos
	b.size = size
	b.show_percentage = false
	var fill := StyleBoxFlat.new()
	fill.bg_color = col
	var bg := StyleBoxFlat.new()
	bg.bg_color = Color(0, 0, 0, 0.55)
	b.add_theme_stylebox_override("fill", fill)
	b.add_theme_stylebox_override("background", bg)
	b.mouse_filter = Control.MOUSE_FILTER_IGNORE
	hud.add_child(b)
	return b

func _label(parent: Control, font_size: int, preset: int, pos: Vector2) -> Label:
	var l := Label.new()
	l.set_anchors_preset(preset)
	l.position = pos
	l.add_theme_font_size_override("font_size", font_size)
	l.add_theme_color_override("font_shadow_color", Color(0, 0, 0, 0.8))
	l.add_theme_constant_override("shadow_offset_x", 2)
	l.add_theme_constant_override("shadow_offset_y", 2)
	l.mouse_filter = Control.MOUSE_FILTER_IGNORE
	parent.add_child(l)
	return l

## 웨이브 배너. kind: "wave" 시작, "boss" 보스 웨이브(붉게), "clear" 클리어. 연출은 HudStyle.banner.
func _banner(text: String, kind := "wave", sub := "") -> void:
	var hs := get_node_or_null("HudStyle")
	if hs:
		hs.banner(text, kind, sub)

func _refresh_hud() -> void:
	if hud == null:
		return
	lbl_top.text = "%s    %s    %s" % [I18n.t("hud.wave", {"n": shown_wave()}), I18n.t("hud.kills", {"n": kills}), I18n.t("hud.coins", {"n": coins})]
	lbl_top.text += "    Lv %d (+%d)" % [Skills.run_level(self), Skills.run_points(self)] # 런 레벨과 이번 판에 번 스킬 포인트
	if phase == "prep":
		lbl_top.text += "    " + I18n.t("hud.prep", {"n": ceili(prep_left)})
	elif phase == "combat":
		lbl_top.text += "    " + I18n.t("hud.left", {"n": remaining()})
	core_bar.position = Vector2(24, hud.size.y - 92)
	lbl_core.position = Vector2(312, hud.size.y - 90)
	lbl_core.text = I18n.t("hud.core")
	boss_bar.position = Vector2((hud.size.x - boss_bar.size.x) * 0.5, 80)
	core_bar.max_value = core.max_hp
	core_bar.value = core.hp
	var show_boss: bool = is_instance_valid(boss) and not boss.dead
	boss_bar.visible = show_boss
	lbl_boss.visible = show_boss
	if show_boss:
		boss_bar.max_value = boss.max_hp
		boss_bar.value = maxf(0.0, boss.hp)
		lbl_boss.text = I18n.zombie_name(boss.type)
	lbl_ammo.text = I18n.t("hud.reloading") if player.is_reloading() else "%d / %d" % [player.ammo, player.mag_size(player.gun_id)]
	lbl_gun.text = "%s  Lv %d" % [I18n.gun_name(player.gun_id), player.lv[player.gun_id]]
	var scoped: bool = player.aiming and bool(player.gun.scope)
	scope.visible = scoped
	crosshair.visible = not scoped
	hp_bar.max_value = player.max_hp
	hp_bar.value = player.hp
	_refresh_base_hud()
	var help := I18n.t("help") + " · " + I18n.t("help.build")
	lbl_hint.text = help if Input.mouse_mode == Input.MOUSE_MODE_CAPTURED else I18n.t("hud.click") + "  ·  " + help
	crosshair.queue_redraw()
	if scoped:
		scope.queue_redraw()

func _refresh_base_hud() -> void:
	var parts := []
	for r in GameData.res.keys:
		parts.append("%s %d" % [I18n.res_name(r), int(res[r])])
	if allies == null: # HUD 는 아군 노드보다 먼저 한 번 그려진다
		return
	parts.append(allies.tt("lab.samples", {"s": samples, "sp": samples_sp}))
	lbl_res.text = "   ".join(parts)
	# 채집 / 핵 안내
	var prompt := ""
	gather_bar.visible = false
	if not gather_focus.is_empty():
		prompt = "E  " + I18n.t("node.%s.verb" % gather_focus.kind)
		# 진행도는 gather_hud.gd 의 링이 그린다
	elif allies.station_near(player.global_position) != "" and not base.building:
		prompt = allies.tt("prompt." + allies.station_near(player.global_position))
	elif not base.building and base.near_building(player.global_position) != null and (base.actionable_near(player.global_position) != null or (not _near_core() and not base.building_action(base.near_building(player.global_position)).is_empty())):
		prompt = base.building_action(base.near_building(player.global_position)).label
	elif _near_core():
		prompt = core_action().get("label", "")
	lbl_prompt.text = prompt
	# 건설 패널
	build_panel.visible = base.building
	build_hover.visible = base.building
	if base.building:
		build_panel.position = Vector2(hud.size.x - 544, 18)
		var lines := [I18n.t("build.title")]
		for i in base.BUILDABLE.size():
			var k: String = base.BUILDABLE[i]
			var mark := "> " if k == base.pick else "   "
			lines.append("%s%d  %s  —  %s" % [mark, i + 1, I18n.bld_name(k), I18n.cost_text(GameData.buildings[k].cost)])
		lines.append(I18n.bld_desc(base.pick))
		lines.append(I18n.t("build.keys"))
		build_panel.text = "\n".join(lines)
		var h: Node = base.hover
		if h and is_instance_valid(h):
			var ammo := I18n.t("build.ammo", {"n": h.ammo}) if h.def.has("turret") else ""
			var t := I18n.t("build.hover", {"name": I18n.bld_name(h.kind), "lv": h.level, "hp": ceili(h.hp), "max": ceili(h.max_hp), "ammo": ammo})
			if h.hp < h.max_hp - 0.5:
				t += "\n" + I18n.t("build.repairCost", {"c": I18n.cost_text(base.repair_cost(h))})
			if h.def.has("turret"):
				var u: Dictionary = base.upgrade_info(h)
				t += "\n" + (I18n.t("build.upCost", {"c": I18n.cost_text(u.upCost, int(u.upGold))}) if not u.is_empty() else I18n.t("build.maxLv"))
			build_hover.text = t
			build_hover.add_theme_color_override("font_color", Color.WHITE)
		elif base.ghost_ok:
			build_hover.text = I18n.t("build.place.click")
			build_hover.add_theme_color_override("font_color", Color(0.5, 1, 0.6))
		else:
			build_hover.text = I18n.t("build.reason." + base.ghost_reason) if base.ghost_reason != "" else ""
			build_hover.add_theme_color_override("font_color", Color(1, 0.45, 0.4))

## Crosshair gap follows the real spread, like the web HUD.
func _draw_crosshair() -> void:
	var px_per_rad: float = get_viewport().get_visible_rect().size.y / deg_to_rad(player.camera.fov)
	var gap: float = 6.0 + player.current_spread() * px_per_rad * 2.0
	var c := Color(1, 1, 1, 0.9)
	for d in [Vector2.RIGHT, Vector2.LEFT, Vector2.UP, Vector2.DOWN]:
		crosshair.draw_line(d * gap, d * (gap + 9.0), c, 2.0)
	if hitmark > 0.0:
		HudStyle.draw_hitmarker(crosshair, hit_kind, 1.0 - hitmark / hit_total)

## Sniper scope: black outside a circle, thin cross lines.
func _draw_scope() -> void:
	var sz := scope.size
	var c := sz * 0.5
	var r := sz.y * 0.42
	var black := Color(0, 0, 0, 0.96)
	scope.draw_rect(Rect2(0, 0, c.x - r, sz.y), black)
	scope.draw_rect(Rect2(c.x + r, 0, sz.x - c.x - r, sz.y), black)
	var pts := PackedVector2Array()
	for i in 65: # 원 바깥 위/아래를 다각형으로 칠한다
		var a := PI + PI * i / 64.0
		pts.append(c + Vector2(cos(a), sin(a)) * r)
	pts.append(Vector2(c.x + r, 0))
	pts.append(Vector2(c.x - r, 0))
	scope.draw_colored_polygon(pts, black)
	var pts2 := PackedVector2Array()
	for i in 65:
		var a := PI * i / 64.0
		pts2.append(c + Vector2(cos(a), sin(a)) * r)
	pts2.append(Vector2(c.x - r, sz.y))
	pts2.append(Vector2(c.x + r, sz.y))
	scope.draw_colored_polygon(pts2, black)
	scope.draw_arc(c, r, 0, TAU, 96, Color(0, 0, 0), 4.0)
	var line := Color(0, 0, 0, 0.85)
	scope.draw_line(Vector2(c.x - r, c.y), Vector2(c.x + r, c.y), line, 1.5)
	scope.draw_line(Vector2(c.x, c.y - r), Vector2(c.x, c.y + r), line, 1.5)
	scope.draw_circle(c, 2.0, Color(1, 0.2, 0.15))

# ── 사망 카드 ─────────────────────────────────────────────────────────

func _on_died() -> void:
	phase = "ended"
	allies.flush()
	var report := Save.bank_game(self)
	report["wave"] = wave
	report["kills"] = kills
	# 슬로모션·붉어짐·기록 카드 연출은 death_card.gd
	var card := DeathCardScript.new()
	card.game = self
	card.report = report
	card.reason = lose_reason
	add_child(card)
