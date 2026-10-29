extends CharacterBody3D
## First-person player: move / look / jump / dash and the six guns.
## Port of src/player/logic (movement.ts, controller.ts, weapons.ts). Numbers come from GameData.player / guns.

## One signal per pellet. `also` = points of zombies pierced before `to`.
signal fired(from: Vector3, to: Vector3, hit_zombie: bool, headshot: bool, kill: bool, also: Array)
signal weapon_changed(id: String)
signal hurt(hp: float)
signal died

const EYE_HEIGHT := 1.65
const BASE_FOV := 70.0

var P: Dictionary
var gun_id := "pistol"
var gun: Dictionary
var hp: float
var max_hp: float
var ammo: int
## 총기별 보유·강화 레벨·남은 탄. 권총은 기본 지급 (GUN_UNLOCK_GOLD 에 없음)
var owned := {"pistol": true}
var lv := {}
var dmg_mul := 1.0 # 총열 정밀 가공 (본부 영구 업그레이드, meta_bonus.gd)
var mags := {}
var reload_left := 0.0
var cooldown := 0.0
var bloom := 0.0
var since_shot := 9.0
var dash_left := 0.0
var dash_cd := 0.0
var dash_dir := Vector3.ZERO
var iframes := 0.0
var aiming := false
var dead := false
var tool_active := false # 채집 도구(tool_view.gd)를 들고 있는 동안: 총을 숨기고 쏘지 않는다
var build_mode := false # 건설 모드: 좌클릭은 배치, 숫자 키는 건물 선택이라 총을 쓰지 않는다

var camera: Camera3D
var view_model: Node3D
var muzzle: Node3D
var flash: OmniLight3D
var _kick := 0.0
const Ballistics := preload("res://scripts/ballistics.gd")
## 사격 반동으로 시선이 위로 튄 각도(라디안, 웹의 p.kick). 시간이 지나면 돌아온다. camera.rotation.x 에는 _kick_applied 만큼 더해져 있다
var recoil_pitch := 0.0
var _kick_applied := 0.0
## 스킬 트리 (skills.gd apply(), calcStats() 의 같은 이름 값)
var recoil_mul := 1.0 # 반동 줄이기
var dash_cd_time := 2.0 # 날쌘 발: 대시 쿨타임
var mag_mul := 1.0 # 대용량 탄창
var reload_mul := 1.0 # 빠른 손
var spread_mul := 1.0 # 안정된 조준
var head_mul := 1.0 # 급소 사격
var speed_mul := 1.0 # 빠른 걸음
var _bob := 0.0
var _trigger_was_down := false
# ── 1인칭 뷰모델 상태 (playerView.ts 이식) ──
var _aim_t := 0.0          # 조준 전환 0~1 (smoothstep 해서 hip<->ADS 섞기)
var _reload_total := 0.0
var _sway := Vector2.ZERO  # 시선을 돌릴 때 총이 늦게 따라오는 값 (x: 좌우, y: 상하)
var _last_yaw := 0.0
var _last_view_pitch := 0.0
var _breath_t := 0.0
var _draw_off := 0.0       # 총을 꺼낼 때 아래에서 올라오는 정도 1 -> 0
var _drum_angle := 0.0
var _drum_target := 0.0
var _parts := {}           # 부품 이름 -> {node, pos, rot}
var _flash_quads: Node3D
var _flash_mat: StandardMaterial3D
var _flash_t := 0.0
var _pump_shell := false   # 샷건: 펌프를 당길 때 탄피가 나온다
var _shells: Array = []    # 풀 10개: {node, vel, life, spin, scale}
const SHELL_POOL := 10
const FLASH_LIFE := 0.06

func _ready() -> void:
	P = GameData.player
	gun = GameData.guns[gun_id]
	max_hp = P.hp
	hp = max_hp
	for id in GameData.gun_order:
		lv[id] = 0
		mags[id] = mag_size(id)
	ammo = mags[gun_id]
	collision_layer = 2
	collision_mask = 1
	var shape := CollisionShape3D.new()
	var cap := CapsuleShape3D.new()
	cap.radius = P.radius
	cap.height = 1.8
	shape.shape = cap
	shape.position.y = 0.9
	add_child(shape)
	camera = Camera3D.new()
	camera.position.y = EYE_HEIGHT
	camera.fov = BASE_FOV
	camera.near = 0.05
	camera.far = 400.0
	add_child(camera)
	camera.current = true
	_build_view_model()
	_build_shells()

## 웹 게임의 src/player/view/guns.ts 를 그대로 내보낸 총 모델 (godot/tools/models). 크기·위치는 playerView.ts 의 1인칭 배치값이다.
const FP_SCALE := 0.45
const FP_HIP := Vector3(0.21, -0.19, -0.5)
const ADS_DIST := 0.5
static var _guns: Node
var _sight_h := 0.15
var _mag: Node3D

func _build_view_model() -> void:
	if view_model:
		view_model.queue_free()
	if _guns == null:
		_guns = (load("res://assets/models/guns.glb") as PackedScene).instantiate()
	view_model = Node3D.new()
	view_model.position = _hip_pos()
	view_model.scale = Vector3.ONE * FP_SCALE
	camera.add_child(view_model)
	var gm: Node3D = _guns.get_node("g_%s" % gun_id).duplicate()
	view_model.add_child(gm)
	_sight_h = float(GameData.models.guns[gun_id].sightH)
	_mag = gm.find_child("mag-*", true, false) as Node3D
	var hand: Node3D = _guns.get_node("hand").duplicate()
	view_model.add_child(hand)
	for mi in gm.find_children("*", "MeshInstance3D", true, false):
		mi.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	for mi in hand.find_children("*", "MeshInstance3D", true, false):
		mi.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	muzzle = gm.find_child("muzzle-*", true, false) as Node3D
	flash = OmniLight3D.new()
	flash.light_color = Color(1.0, 0.8, 0.45)
	flash.omni_range = 6.0
	flash.light_energy = 0.0
	muzzle.add_child(flash)
	_parts.clear()
	for nm in ["slide", "mag", "drum", "hammer", "pump", "bolt", "eject"]:
		var n := gm.find_child("%s-*" % nm, true, false) as Node3D
		if n:
			_parts[nm] = {"node": n, "pos": n.position, "rot": n.rotation}
	_build_flash()
	_drum_target = 0.0
	_drum_angle = 0.0
	_flash_t = 0.0
	_pump_shell = false

## 총구 화염: 십자 판(가산 혼합) 두 장 + 옆 판. 수명 0.06초
func _build_flash() -> void:
	if _flash_mat == null:
		_flash_mat = StandardMaterial3D.new()
		_flash_mat.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
		_flash_mat.blend_mode = BaseMaterial3D.BLEND_MODE_ADD
		_flash_mat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
		_flash_mat.cull_mode = BaseMaterial3D.CULL_DISABLED
		_flash_mat.no_depth_test = true
		_flash_mat.render_priority = 5
		var gt := GradientTexture2D.new()
		gt.fill = GradientTexture2D.FILL_RADIAL
		gt.fill_from = Vector2(0.5, 0.5)
		gt.fill_to = Vector2(1.0, 0.5)
		gt.width = 64
		gt.height = 64
		var gr := Gradient.new()
		gr.colors = PackedColorArray([Color(1.0, 0.95, 0.7, 1.0), Color(1.0, 0.7, 0.25, 0.7), Color(1.0, 0.45, 0.1, 0.0)])
		gr.offsets = PackedFloat32Array([0.0, 0.45, 1.0])
		gt.gradient = gr
		_flash_mat.albedo_texture = gt
	_flash_quads = Node3D.new()
	_flash_quads.visible = false
	muzzle.add_child(_flash_quads)
	var qm := QuadMesh.new()
	qm.size = Vector2(0.5, 0.5)
	for i in 2:
		var q := MeshInstance3D.new()
		q.mesh = qm
		q.material_override = _flash_mat
		q.rotation.z = i * PI / 4.0
		q.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
		_flash_quads.add_child(q)
		var sq := MeshInstance3D.new()
		sq.mesh = qm
		sq.material_override = _flash_mat
		sq.rotation = Vector3(0, PI / 2.0, i * PI / 4.0)
		sq.position.z = -0.12
		sq.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
		_flash_quads.add_child(sq)

func _build_shells() -> void:
	var brass := StandardMaterial3D.new()
	brass.albedo_color = Color("d9a441")
	brass.metallic = 0.6
	brass.roughness = 0.4
	for i in SHELL_POOL:
		var m := MeshInstance3D.new()
		var bm := BoxMesh.new()
		bm.size = Vector3(0.02, 0.02, 0.05)
		m.mesh = bm
		m.material_override = brass
		m.top_level = true # 월드 좌표로 날아간다 (플레이어를 따라가지 않는다)
		m.visible = false
		m.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
		add_child(m)
		_shells.append({"node": m, "vel": Vector3.ZERO, "life": 0.0, "spin": 0.0, "scale": 1.0})

func _hip_pos() -> Vector3:
	return FP_HIP

func _ads_scale() -> float:
	return 0.5 * tan(deg_to_rad(float(gun.adsFov) * 0.5)) / tan(deg_to_rad(27.5))

func _ads_pos() -> Vector3:
	return Vector3(0.0, -_sight_h * _ads_scale(), -ADS_DIST)

func _box(parent: Node3D, size: Vector3, pos: Vector3, mat: Material) -> void:
	var m := MeshInstance3D.new()
	var b := BoxMesh.new()
	b.size = size
	m.mesh = b
	m.position = pos
	m.material_override = mat
	m.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	parent.add_child(m)

func _unhandled_input(event: InputEvent) -> void:
	if dead:
		return
	if event is InputEventMouseMotion and Input.mouse_mode == Input.MOUSE_MODE_CAPTURED:
		var sens: float = P.sens * float(Save.settings.sensitivity) * (0.6 if aiming else 1.0)
		rotate_y(-event.relative.x * sens)
		camera.rotation.x = clampf(camera.rotation.x - event.relative.y * sens, -1.45, 1.45)
	elif event is InputEventMouseButton and event.pressed and Input.mouse_mode != Input.MOUSE_MODE_CAPTURED:
		Input.mouse_mode = Input.MOUSE_MODE_CAPTURED
		get_viewport().set_input_as_handled()
	elif event.is_action_pressed("ui_cancel"):
		Input.mouse_mode = Input.MOUSE_MODE_VISIBLE
	elif event is InputEventKey and event.pressed and not event.echo and event.keycode >= KEY_1 and event.keycode <= KEY_6 and not build_mode:
		switch_weapon(GameData.gun_order[event.keycode - KEY_1])

func _physics_process(dt: float) -> void:
	if dead:
		return
	var captured := Input.mouse_mode == Input.MOUSE_MODE_CAPTURED
	aiming = captured and not build_mode and Input.is_action_pressed("aim")
	iframes = maxf(0.0, iframes - dt)
	_move(dt)
	_tick_weapon(dt)
	var trigger := captured and not build_mode and not tool_active and Input.is_action_pressed("fire")
	# 권총은 auto=true (누르고 있으면 연사). auto=false 총은 눌린 순간에만 쏜다
	if trigger and (bool(gun.auto) or not _trigger_was_down):
		_try_fire()
	_trigger_was_down = trigger
	if Input.is_action_just_pressed("reload"):
		_start_reload()
	_animate(dt)

func _move(dt: float) -> void:
	var input := Input.get_vector("move_left", "move_right", "move_forward", "move_back")
	var wish := (transform.basis * Vector3(input.x, 0, input.y)).normalized()
	dash_cd = maxf(0.0, dash_cd - dt)
	if Input.is_action_just_pressed("dash") and dash_left <= 0.0 and dash_cd <= 0.0:
		dash_dir = wish if wish.length() > 0.1 else -transform.basis.z
		dash_left = P.dashTime
		dash_cd = dash_cd_time
		iframes = maxf(iframes, P.dashIframes)
	var speed: float = P.speed * speed_mul * (P.aimSpeedMul if aiming else 1.0)
	if dash_left > 0.0:
		dash_left -= dt
		velocity.x = dash_dir.x * P.dashSpeed
		velocity.z = dash_dir.z * P.dashSpeed
	else:
		velocity.x = wish.x * speed
		velocity.z = wish.z * speed
	if is_on_floor():
		if Input.is_action_just_pressed("jump"):
			velocity.y = P.jumpSpeed
	else:
		velocity.y -= P.gravity * dt
	move_and_slide()

func _tick_weapon(dt: float) -> void:
	cooldown = maxf(0.0, cooldown - dt)
	bloom = maxf(0.0, bloom - dt * (1.5 if since_shot < 0.28 else 2.4))
	since_shot += dt
	# 시선 반동 회복 (movement.ts + controller.ts). 쏘는 중에도 천천히, 0.16초 쉬면 더 빨리 내려온다
	recoil_pitch = Ballistics.kick_recover(recoil_pitch, dt)
	recoil_pitch = Ballistics.kick_recover_idle(recoil_pitch, dt, since_shot, false)
	_apply_recoil_view()
	if reload_left > 0.0:
		reload_left -= dt
		if reload_left <= 0.0:
			reload_left = 0.0
			ammo = mag_size(gun_id)

func _start_reload() -> void:
	if reload_left > 0.0 or ammo >= mag_size(gun_id):
		return
	reload_left = stats(gun_id).reload
	_reload_total = reload_left

## gunStats() from weapons.ts: base numbers plus purchased upgrade levels (skills come with the hub).
func stats(id: String) -> Dictionary:
	var d: Dictionary = GameData.guns[id]
	var u: Dictionary = GameData.gun_upgrade.perLevel
	var l: int = lv.get(id, 0)
	var pellets := int(d.pellets)
	if pellets > 1:
		pellets += l / int(u.pelletEvery)
	return {
		"dmg": float(d.dmg) * (1.0 + float(u.dmg) * l) * dmg_mul,
		"mag": maxi(1, roundi(float(d.mag) * mag_mul * (1.0 + float(u.mag) * l))),
		"reload": float(d.reload) * reload_mul * (1.0 - float(u.reload) * l),
		"spread": float(d.spread) * (1.0 - float(u.spread) * l),
		"rate": float(d.rate) * (1.0 - float(u.rate) * l),
		"pellets": pellets,
	}

func mag_size(id: String) -> int:
	return int(stats(id).mag)

func switch_weapon(id: String) -> void:
	if id == gun_id or not owned.get(id, false) or dead:
		return
	mags[gun_id] = ammo
	gun_id = id
	gun = GameData.guns[id]
	ammo = mags[id]
	reload_left = 0.0 # 교체하면 재장전 취소
	cooldown = 0.28   # 꺼내는 시간
	bloom = 0.0
	_build_view_model()
	_draw_off = 1.0
	weapon_changed.emit(id)

## Called after buying a gun or an upgrade level: refills that gun's magazine.
func refresh_gun(id: String) -> void:
	mags[id] = mag_size(id)
	if id == gun_id:
		ammo = mags[id]
		reload_left = 0.0

func is_reloading() -> bool:
	return reload_left > 0.0

func is_moving() -> bool:
	return Vector2(velocity.x, velocity.z).length() > 0.5

## Same formula as currentSpread() in weapons.ts (without skill multipliers yet).
func current_spread() -> float:
	var spray := bloom * (1.0 + bloom * 0.45)
	return float(stats(gun_id).spread) * (1.0 + spray) * (1.35 if is_moving() else 1.0) * (0.5 if aiming else 1.0) * spread_mul

func _try_fire() -> void:
	if cooldown > 0.0 or is_reloading():
		return
	if ammo <= 0:
		_start_reload()
		return
	var gs := stats(gun_id)
	ammo -= 1
	cooldown = gs.rate
	since_shot = 0.0
	var spread := current_spread()
	bloom = minf(bloom + float(gun.bloom) * 1.15, 2.8)
	_kick = 1.0
	_on_fired_view()
	# 이번 발은 반동이 더해지기 전 시선으로 쏜다 (controller.ts: 발사 뒤에 p.kick 갱신)
	var origin := camera.global_position
	var basis := camera.global_transform.basis
	var range_m: float = gun.range
	var drop_mul: float = float(gun.get("dropMul", 1.0))
	var bullet_drop: float = P.bulletDrop
	var space := get_world_3d().direct_space_state
	for _i in int(gs.pellets):
		# 원판 안 균일 분포 (weapons.ts 와 같은 방식)
		var ang := randf() * TAU
		var rad := sqrt(randf()) * spread
		var dir := (-basis.z + basis.x * cos(ang) * rad + basis.y * sin(ang) * rad).normalized()
		# 낙차가 있는 탄도의 끝 (아무것도 안 맞으면 사거리 끝, 낙차 포함)
		var end := Ballistics.point_at(origin, dir, range_m, drop_mul, bullet_drop)
		var exclude: Array[RID] = [get_rid()]
		var hits := 0
		var headshot := false
		var kill := false
		var also: Array = []
		var t_from := 0.0
		# 관통: 좀비를 맞히면 그 좀비를 빼고 그 자리부터 다시 쏜다. 맞힐 때마다 피해 70%
		while hits < maxi(1, int(gun.pierce)):
			var hit := Ballistics.trace(space, origin, dir, range_m, drop_mul, bullet_drop, 1 | 4, exclude, t_from)
			# 조준 보정(웹 PLAYER.aimAssist): 물리 캡슐을 스친 탄도 판정 반경 + pad 안이면 맞힌 걸로 친다.
			# 물리 광선이 더 가까운 것(벽·다른 좀비)을 먼저 맞혔다면 그쪽이 우선
			var assist := Ballistics.assist_pick(get_tree().get_nodes_in_group("zombies"), origin, dir, drop_mul, bullet_drop,
				float(P.aimAssist), t_from, float(hit.t) if not hit.is_empty() else range_m, exclude)
			if not assist.is_empty():
				hit = assist
			if hit.is_empty():
				break
			var target: Object = hit.collider
			if target == null or not target.has_method("take_hit"):
				end = hit.position
				break
			if hits > 0:
				also.append(end)
			end = hit.position
			var head: bool = target.is_head_hit(end)
			var fall := 1.0 - float(gun.falloff) * clampf(float(hit.t) / range_m, 0.0, 1.0)
			var dmg: float = float(gs.dmg) * fall * pow(0.7, hits) * (float(P.headshotMul) * head_mul if head else 1.0)
			kill = target.take_hit(dmg, dir) or kill
			headshot = headshot or head
			exclude.append(hit.rid)
			t_from = hit.t
			hits += 1
		fired.emit(muzzle.global_position, end, hits > 0, headshot, kill, also)
	# 반동: 연사로 쌓인 bloom 이 클수록 더 튀고, 조준하면 0.45배 (controller.ts)
	recoil_pitch = Ballistics.kick_after_shot(recoil_pitch, gun, bloom, aiming, recoil_mul)
	_apply_recoil_view()
	if ammo <= 0:
		_start_reload()

## 반동은 마우스로 맞춘 시선에 덧씌우는 값이라, 바뀐 만큼만 camera.rotation.x 에 더한다 (카메라 pitch 가 -1.45~1.45 에 걸려도 어긋나지 않게 실제 적용량을 기억한다).
func _apply_recoil_view() -> void:
	var delta := recoil_pitch - _kick_applied
	if is_zero_approx(delta):
		return
	var before := camera.rotation.x
	camera.rotation.x = clampf(before + delta, -1.45, 1.45)
	_kick_applied += camera.rotation.x - before

func take_damage(dmg: float) -> void:
	if dead or iframes > 0.0:
		return
	hp = maxf(0.0, hp - dmg)
	iframes = P.hurtIframes
	hurt.emit(hp)
	if hp <= 0.0:
		die()

## Ends the sortie: player killed, or the core fell (game.gd calls this then).
func die() -> void:
	if dead:
		return
	dead = true
	Input.mouse_mode = Input.MOUSE_MODE_VISIBLE
	var tw := create_tween()
	tw.tween_property(camera, "position:y", 0.35, 0.8).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_IN)
	tw.parallel().tween_property(camera, "rotation:z", 0.6, 0.8)
	died.emit()

func _animate(dt: float) -> void:
	var kind: String = gun.kind
	var smg_like := kind == "smg" or kind == "rifle"
	_kick = maxf(0.0, _kick - dt * (4.0 if kind == "sniper" else 11.0 if smg_like else 7.0))
	_aim_t = move_toward(_aim_t, 1.0 if aiming else 0.0, dt * 7.0)
	var u := _smooth(_aim_t)
	_draw_off = maxf(0.0, _draw_off - dt * 5.0)
	var fov_target: float = gun.adsFov if aiming else BASE_FOV
	camera.fov = lerpf(camera.fov, fov_target, minf(1.0, dt * 14.0))
	_breath_t += dt
	# ── 시선을 돌리면 총이 살짝 늦게 따라온다 (반동을 뺀 순수 시선 pitch 로 계산) ──
	var view_pitch := camera.rotation.x - _kick_applied
	var dyaw := wrapf(rotation.y - _last_yaw, -PI, PI)
	var dpitch := view_pitch - _last_view_pitch
	_last_yaw = rotation.y
	_last_view_pitch = view_pitch
	var sway_amt := float(gun.sway) * (1.0 - 0.65 * u)
	var tgt := Vector2(clampf(dyaw * 0.9, -0.07, 0.07), clampf(-dpitch * 0.9, -0.05, 0.05)) * sway_amt
	_sway += (tgt - _sway) * minf(1.0, dt * 12.0)
	_sway *= maxf(0.0, 1.0 - dt * 6.0)
	# ── 걷기 흔들림(속도 비례, 조준하면 거의 없음) + 숨쉬기 ──
	var spd := Vector2(velocity.x, velocity.z).length() if is_on_floor() else 0.0
	_bob += dt * (spd * 1.5 if spd > 0.5 else 0.0)
	var walk_amt := minf(1.0, spd / 6.0) * (1.0 - 0.7 * u) if spd > 0.5 else 0.0
	var bob_y := sin(_bob * 2.0) * 0.012 * walk_amt
	var bob_x := cos(_bob) * 0.01 * walk_amt
	var breath := sin(_breath_t * 1.6) * 0.004 * (1.0 - 0.5 * u)
	# ── 반동 ──
	var kick_scale := 2.85 if kind == "sniper" else 1.4 if kind == "shotgun" else 1.3 if kind == "revolver" else 0.55 if kind == "smg" else 0.85
	var recoil_back := _kick * 0.06 * kick_scale * recoil_mul
	var recoil_rx := _kick * 0.0524 * kick_scale * recoil_mul
	# ── 재장전 (0~1) ──
	var reloading := reload_left > 0.0 and _reload_total > 0.0
	var k := 1.0 - reload_left / _reload_total if reloading else 0.0
	var dip := 0.0
	var roll := 0.0
	var hand_shift := 0.0
	if reloading:
		var bell := sin(clampf(k, 0.0, 1.0) * PI)
		dip = bell * (0.5 if kind == "shotgun" else 0.75)
		roll = bell * (0.25 if kind == "shotgun" else 0.12)
		hand_shift = bell * 0.08
	_animate_parts(dt, kind, reloading, k, since_shot)
	# ── 자세: 허리 위치 <-> 조준 위치를 _aim_t 로 섞는다 ──
	var hip := _hip_pos() + Vector3(bob_x + _sway.x * 0.3, bob_y + breath - dip * 0.08, recoil_back * 0.6 + hand_shift)
	var ads := _ads_pos() + Vector3(_sway.x * 0.05, bob_y * 0.15 + breath * 0.5, recoil_back * 0.4)
	var pos := hip.lerp(ads, u)
	pos.y -= _draw_off * 0.25
	view_model.position = pos
	var hip_rx := 0.1 + recoil_rx - dip + _sway.y * 0.8
	var ads_rx := recoil_rx * 0.5
	view_model.rotation = Vector3(
		lerpf(hip_rx, ads_rx, u),
		_sway.x * 1.2 * (1.0 - u),
		(roll + _sway.x * 0.5) * (1.0 - u))
	view_model.scale = Vector3.ONE * lerpf(FP_SCALE, _ads_scale(), u)
	# 조준경 총: 조준이 거의 끝나면 총을 숨기고 HUD 가 스코프를 그린다. 건설·채집 중에도 숨긴다
	view_model.visible = not build_mode and not tool_active and not (bool(gun.scope) and _aim_t > 0.88)
	# ── 총구 화염 (십자 가산혼합) + 순간 조명 ──
	if _flash_t > 0.0:
		_flash_t -= dt
		_flash_mat.albedo_color.a = clampf(_flash_t / FLASH_LIFE, 0.0, 1.0)
		flash.light_energy *= 0.55
		if _flash_t <= 0.0:
			_flash_quads.visible = false
			flash.light_energy = 0.0
	_tick_shells(dt)
	if _pump_shell and since_shot > 0.42:
		_pump_shell = false
		_eject_shell(true)

func _smooth(v: float) -> float:
	v = clampf(v, 0.0, 1.0)
	return v * v * (3.0 - 2.0 * v)

func _seg(v: float, a: float, b: float) -> float:
	return _smooth((v - a) / (b - a))

func _part(nm: String) -> Dictionary:
	return _parts.get(nm, {})

## 총기별 부품 모션: 탄창 분리·삽입, 샷건 펌프 3회, 저격 볼트, 리볼버 실린더·해머, 권총 슬라이드
func _animate_parts(dt: float, kind: String, reloading: bool, k: float, age: float) -> void:
	var mag := _part("mag")
	if not mag.is_empty():
		_animate_mag(mag, k if reloading else 0.0, kind)
	var drum := _part("drum")
	if not drum.is_empty():
		var bell := sin(clampf(k, 0.0, 1.0) * PI) if reloading else 0.0
		_drum_angle += (_drum_target - _drum_angle) * minf(1.0, dt * 18.0)
		drum.node.position.x = drum.pos.x - 0.07 * bell # 실린더가 옆으로 빠진다
		drum.node.rotation.z = drum.rot.z + _drum_angle
	var slide := _part("slide")
	if not slide.is_empty():
		# 쏘면 뒤로 갔다 오고, 탄이 다 떨어지면 뒤에 걸려 있다
		var back: float = (0.06 if ammo <= 0 and not reloading else 0.0) + maxf(0.0, 1.0 - age / 0.07) * 0.055
		slide.node.position.z = slide.pos.z + back
	var pump := _part("pump")
	if not pump.is_empty():
		var dz := 0.0
		if reloading:
			dz = sin(fmod(k * 3.0, 1.0) * PI) * 0.07 # 세 번 밀어 넣는다
		else:
			var t := (age - 0.22) / 0.4
			dz = sin(t * PI) * 0.085 if t > 0.0 and t < 1.0 else 0.0
		pump.node.position.z = pump.pos.z + dz
	var bolt := _part("bolt")
	if not bolt.is_empty():
		if kind == "sniper":
			if reloading:
				_animate_bolt(bolt, (k - 0.82) / 0.18 if k > 0.82 else 0.0)
			else:
				_animate_bolt(bolt, (age - 0.28) / 0.7)
		elif kind == "rifle" and not reloading:
			bolt.node.position.z = bolt.pos.z + maxf(0.0, 1.0 - age / 0.06) * 0.05
	var hammer := _part("hammer")
	if not hammer.is_empty():
		hammer.node.rotation.x = hammer.rot.x + (-0.6 * maxf(0.0, 1.0 - age / 0.18) + 0.2 * _smooth(age / 0.5 - 0.2))

func _animate_mag(part: Dictionary, k: float, kind: String) -> void:
	var o: Node3D = part.node
	if k <= 0.0:
		o.visible = true
		o.position = part.pos
		o.rotation = part.rot
		return
	var out := _seg(k, 0.12, 0.34) # 빠짐
	var inn := _seg(k, 0.55, 0.78) # 들어감
	var off := out * (1.0 - inn)
	o.visible = not (k > 0.34 and k < 0.5) # 손에 쥐고 있는 동안은 안 보인다
	var drop := 0.34 if kind == "smg" else 0.22
	o.position = Vector3(part.pos.x, part.pos.y - drop * off, part.pos.z + 0.05 * off)
	o.rotation = Vector3(part.rot.x + 0.5 * off, part.rot.y, part.rot.z)

## 볼트 액션: 들어 올리고 -> 당기고 -> 밀고 -> 내린다 (t: 0~1)
func _animate_bolt(part: Dictionary, t: float) -> void:
	var o: Node3D = part.node
	if t <= 0.0 or t >= 1.0:
		o.position = part.pos
		o.rotation = part.rot
		return
	var lift := _seg(t, 0.0, 0.2) * (1.0 - _seg(t, 0.8, 1.0))
	var back := _seg(t, 0.2, 0.5) * (1.0 - _seg(t, 0.5, 0.8))
	o.rotation = Vector3(part.rot.x, part.rot.y, part.rot.z - 1.0 * lift)
	o.position = Vector3(part.pos.x, part.pos.y, part.pos.z + 0.1 * back)

## 발사 때 뷰모델 쪽에서 할 일: 화염, 리볼버 실린더 회전, 탄피
func _on_fired_view() -> void:
	var kind: String = gun.kind
	_drum_target += PI / 3.0
	_flash_t = FLASH_LIFE
	_flash_mat.albedo_color.a = 1.0
	var sc := 1.8 if kind == "shotgun" else 1.6 if kind == "sniper" else 1.5 if kind == "revolver" else 0.9 if kind == "smg" else 1.1 if kind == "rifle" else 1.2
	_flash_quads.scale = Vector3.ONE * sc
	_flash_quads.rotation.z = randf() * PI
	_flash_quads.visible = true
	flash.light_energy = 6.0 if (kind == "shotgun" or kind == "sniper") else 3.0
	if kind == "shotgun":
		_pump_shell = true # 샷건은 펌프를 당길 때 빈 탄피가 나온다
	elif kind != "revolver": # 리볼버는 탄피가 실린더에 남는다
		_eject_shell(false)

func _eject_shell(big: bool) -> void:
	var ej := _part("eject")
	if ej.is_empty() or not view_model.visible:
		return
	var s: Dictionary = _shells[0]
	for c in _shells:
		if c.life <= 0.0:
			s = c
			break
	var kind: String = gun.kind
	var scale_k := (0.07 / 0.045 if big else 1.0) * (1.3 if kind == "sniper" or kind == "rifle" else 1.0)
	var n: MeshInstance3D = s.node
	n.global_position = (ej.node as Node3D).global_position
	n.global_rotation = camera.global_rotation
	n.scale = Vector3.ONE * scale_k
	var b := camera.global_transform.basis
	s.vel = b.x * (2.0 + randf() * 1.5) + Vector3.UP * (2.2 + randf()) + b.z * randf() * 0.8
	s.life = 1.1
	s.spin = (randf() - 0.5) * 30.0
	s.scale = scale_k
	n.visible = true

func _tick_shells(dt: float) -> void:
	var floor_y := global_position.y + 0.03
	for s in _shells:
		if s.life <= 0.0:
			continue
		s.life -= dt
		var n: MeshInstance3D = s.node
		if s.life <= 0.0:
			n.visible = false
			continue
		s.vel.y -= 16.0 * dt
		n.global_position += s.vel * dt
		if n.global_position.y < floor_y:
			n.global_position.y = floor_y
			if absf(s.vel.y) > 1.0: # 바닥에서 튕긴다
				s.vel = Vector3(s.vel.x * 0.5, -s.vel.y * 0.35, s.vel.z * 0.5)
			else:
				s.vel = Vector3(s.vel.x * 0.8, 0.0, s.vel.z * 0.8)
		n.rotation.x += s.spin * dt
		n.scale = Vector3.ONE * s.scale * (0.6 + 0.4 * clampf(s.life / 1.1, 0.0, 1.0))
