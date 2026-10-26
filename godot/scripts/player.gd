extends CharacterBody3D
## First-person player: move / look / jump / dash and the pistol.
## Port of src/player/logic (movement.ts, controller.ts, weapons.ts). Numbers come from GameData.player / guns.

signal fired(from: Vector3, to: Vector3, hit_zombie: bool, headshot: bool, kill: bool)
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
var reload_left := 0.0
var cooldown := 0.0
var bloom := 0.0
var since_shot := 9.0
var dash_left := 0.0
var dash_dir := Vector3.ZERO
var iframes := 0.0
var aiming := false
var dead := false

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
	ammo = int(gun.mag)
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

## Simple low-poly pistol held in the lower right (stand-in for src/player/view/guns.ts).
func _build_view_model() -> void:
	view_model = Node3D.new()
	view_model.position = Vector3(0.2, -0.19, -0.45)
	camera.add_child(view_model)
	var metal := StandardMaterial3D.new()
	metal.albedo_color = Color(0.16, 0.17, 0.19)
	metal.metallic = 0.6
	metal.roughness = 0.4
	var grip := StandardMaterial3D.new()
	grip.albedo_color = Color(0.32, 0.2, 0.12)
	_box(view_model, Vector3(0.04, 0.045, 0.19), Vector3(0, 0.02, -0.04), metal)   # slide
	_box(view_model, Vector3(0.036, 0.11, 0.05), Vector3(0, -0.05, 0.03), grip)    # grip
	_box(view_model, Vector3(0.03, 0.02, 0.06), Vector3(0, -0.012, -0.0), metal)   # trigger guard
	_box(view_model, Vector3(0.01, 0.012, 0.01), Vector3(0, 0.048, -0.125), metal) # front sight
	muzzle = Node3D.new()
	muzzle.position = Vector3(0, 0.02, -0.14)
	view_model.add_child(muzzle)
	flash = OmniLight3D.new()
	flash.light_color = Color(1.0, 0.8, 0.45)
	flash.omni_range = 6.0
	flash.light_energy = 0.0
	muzzle.add_child(flash)

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
		var sens: float = P.sens * (0.6 if aiming else 1.0)
		rotate_y(-event.relative.x * sens)
		camera.rotation.x = clampf(camera.rotation.x - event.relative.y * sens, -1.45, 1.45)
	elif event is InputEventMouseButton and event.pressed and Input.mouse_mode != Input.MOUSE_MODE_CAPTURED:
		Input.mouse_mode = Input.MOUSE_MODE_CAPTURED
		get_viewport().set_input_as_handled()
	elif event.is_action_pressed("ui_cancel"):
		Input.mouse_mode = Input.MOUSE_MODE_VISIBLE

func _physics_process(dt: float) -> void:
	if dead:
		return
	var captured := Input.mouse_mode == Input.MOUSE_MODE_CAPTURED
	aiming = captured and Input.is_action_pressed("aim")
	iframes = maxf(0.0, iframes - dt)
	_move(dt)
	_tick_weapon(dt)
	var trigger := captured and Input.is_action_pressed("fire")
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
			ammo = int(gun.mag)

func _start_reload() -> void:
	if reload_left > 0.0 or ammo >= int(gun.mag):
		return
	reload_left = gun.reload

func is_reloading() -> bool:
	return reload_left > 0.0

func is_moving() -> bool:
	return Vector2(velocity.x, velocity.z).length() > 0.5

## Same formula as currentSpread() in weapons.ts (without skill multipliers yet).
func current_spread() -> float:
	var spray := bloom * (1.0 + bloom * 0.45)
	return float(gun.spread) * (1.0 + spray) * (1.35 if is_moving() else 1.0) * (0.5 if aiming else 1.0)

func _try_fire() -> void:
	if cooldown > 0.0 or is_reloading():
		return
	if ammo <= 0:
		_start_reload()
		return
	ammo -= 1
	cooldown = gun.rate
	since_shot = 0.0
	var spread := current_spread()
	bloom = minf(bloom + float(gun.bloom), 3.0)
	_kick = 1.0
	camera.rotation.x = clampf(camera.rotation.x + float(gun.recoil) * 0.35, -1.45, 1.45)
	var origin := camera.global_position
	var dir := -camera.global_transform.basis.z
	var jitter := Vector3(randfn(0.0, 1.0), randfn(0.0, 1.0), randfn(0.0, 1.0)) * spread
	dir = (dir + camera.global_transform.basis * Vector3(jitter.x, jitter.y, 0)).normalized()
	var range_m: float = gun.range
	var q := PhysicsRayQueryParameters3D.create(origin, origin + dir * range_m, 1 | 4)
	q.exclude = [get_rid()]
	var hit := get_world_3d().direct_space_state.intersect_ray(q)
	var end := origin + dir * range_m
	var hit_zombie := false
	var headshot := false
	var kill := false
	if hit:
		end = hit.position
		var target: Object = hit.collider
		if target != null and target.has_method("take_hit"):
			hit_zombie = true
			headshot = target.is_head_hit(end)
			var dist := origin.distance_to(end)
			# falloff: 사거리 끝에서 피해가 (1 - falloff) 배로 줄어든다
			var dmg: float = float(gun.dmg) * (1.0 - float(gun.falloff) * clampf(dist / range_m, 0.0, 1.0))
			if headshot:
				dmg *= P.headshotMul
			kill = target.take_hit(dmg, dir)
	if ammo <= 0:
		_start_reload()
	fired.emit(muzzle.global_position, end, hit_zombie, headshot, kill)

func take_damage(dmg: float) -> void:
	if dead or iframes > 0.0:
		return
	hp = maxf(0.0, hp - dmg)
	iframes = P.hurtIframes
	hurt.emit(hp)
	if hp <= 0.0:
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
	var rest := Vector3(0.0, -0.06, -0.34) if aiming else Vector3(0.2, -0.19, -0.45)
	var reload_dip := 0.0
	if is_reloading():
		reload_dip = sin(PI * (1.0 - reload_left / float(gun.reload))) * 0.18
	view_model.position = view_model.position.lerp(rest + bob + Vector3(0, -reload_dip, _kick * 0.06), minf(1.0, dt * 18.0))
	view_model.rotation.x = _kick * 0.25 + reload_dip * 2.0
	flash.light_energy = 3.0 if since_shot < 0.04 else 0.0
