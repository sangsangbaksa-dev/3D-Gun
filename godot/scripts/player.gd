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
var dash_dir := Vector3.ZERO
var iframes := 0.0
var aiming := false
var dead := false
var build_mode := false # 건설 모드: 좌클릭은 배치, 숫자 키는 건물 선택이라 총을 쓰지 않는다

var camera: Camera3D
var view_model: Node3D
var muzzle: Node3D
var flash: OmniLight3D
var _kick := 0.0
var _bob := 0.0
var _trigger_was_down := false

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
	var trigger := captured and not build_mode and Input.is_action_pressed("fire")
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
	if Input.is_action_just_pressed("dash") and dash_left <= 0.0:
		dash_dir = wish if wish.length() > 0.1 else -transform.basis.z
		dash_left = P.dashTime
		iframes = maxf(iframes, P.dashIframes)
	var speed: float = P.speed * (P.aimSpeedMul if aiming else 1.0)
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
	if reload_left > 0.0:
		reload_left -= dt
		if reload_left <= 0.0:
			reload_left = 0.0
			ammo = mag_size(gun_id)

func _start_reload() -> void:
	if reload_left > 0.0 or ammo >= mag_size(gun_id):
		return
	reload_left = stats(gun_id).reload

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
		"mag": maxi(1, roundi(float(d.mag) * (1.0 + float(u.mag) * l))),
		"reload": float(d.reload) * (1.0 - float(u.reload) * l),
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
	view_model.position = _hip_pos() + Vector3(0, -0.25, 0)
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
	return float(stats(gun_id).spread) * (1.0 + spray) * (1.35 if is_moving() else 1.0) * (0.5 if aiming else 1.0)

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
	camera.rotation.x = clampf(camera.rotation.x + float(gun.recoil) * 0.35, -1.45, 1.45)
	var origin := camera.global_position
	var basis := camera.global_transform.basis
	var range_m: float = gun.range
	var space := get_world_3d().direct_space_state
	for _i in int(gs.pellets):
		# 원판 안 균일 분포 (weapons.ts 와 같은 방식)
		var ang := randf() * TAU
		var rad := sqrt(randf()) * spread
		var dir := (-basis.z + basis.x * cos(ang) * rad + basis.y * sin(ang) * rad).normalized()
		var end := origin + dir * range_m
		var exclude: Array[RID] = [get_rid()]
		var hits := 0
		var headshot := false
		var kill := false
		var also: Array = []
		# 관통: 좀비를 맞히면 그 좀비를 빼고 다시 쏜다. 맞힐 때마다 피해 70%
		while hits < maxi(1, int(gun.pierce)):
			var q := PhysicsRayQueryParameters3D.create(origin, origin + dir * range_m, 1 | 4)
			q.exclude = exclude
			var hit := space.intersect_ray(q)
			if not hit:
				break
			var target: Object = hit.collider
			if target == null or not target.has_method("take_hit"):
				end = hit.position
				break
			if hits > 0:
				also.append(end)
			end = hit.position
			var head: bool = target.is_head_hit(end)
			var fall := 1.0 - float(gun.falloff) * clampf(origin.distance_to(end) / range_m, 0.0, 1.0)
			var dmg: float = float(gs.dmg) * fall * pow(0.7, hits) * (float(P.headshotMul) if head else 1.0)
			kill = target.take_hit(dmg, dir) or kill
			headshot = headshot or head
			exclude.append(hit.rid)
			hits += 1
		fired.emit(muzzle.global_position, end, hits > 0, headshot, kill, also)
	if ammo <= 0:
		_start_reload()

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
	_kick = maxf(0.0, _kick - dt * 9.0)
	var fov_target: float = gun.adsFov if aiming else BASE_FOV
	camera.fov = lerpf(camera.fov, fov_target, minf(1.0, dt * 14.0))
	if is_moving() and is_on_floor():
		_bob += dt * 9.0
	var bob := Vector3(sin(_bob) * 0.01, absf(cos(_bob)) * 0.012, 0) * float(gun.sway)
	var rest := _ads_pos() if aiming else _hip_pos()
	view_model.visible = not build_mode and not (aiming and bool(gun.scope)) # 조준경: 총을 숨기고 HUD 가 스코프를 그린다. 건설 중에도 숨긴다
	var reload_dip := 0.0
	if is_reloading():
		reload_dip = sin(PI * (1.0 - reload_left / float(stats(gun_id).reload))) * 0.18
	view_model.position = view_model.position.lerp(rest + bob * (0.25 if aiming else 1.0) + Vector3(0, -reload_dip, _kick * 0.06), minf(1.0, dt * 18.0))
	var tgt_scale: float = _ads_scale() if aiming else FP_SCALE
	view_model.scale = view_model.scale.lerp(Vector3.ONE * tgt_scale, minf(1.0, dt * 14.0))
	if _mag:
		_mag.position.y = -reload_dip * 0.9
	view_model.rotation.x = _kick * 0.25 + reload_dip * 2.0
	flash.light_energy = 3.0 if since_shot < 0.04 else 0.0
