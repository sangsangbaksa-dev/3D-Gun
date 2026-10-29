extends SceneTree
## Headless test: 탄 낙차(거리별 값, 총기별 dropMul)와 시선 반동(누적·상한·조준·회복), 구간 광선(낙차를 따라 벽에 닿는 높이, 관통 제외).
## 웹 게임의 hitscan.ts / controller.ts / movement.ts 와 같은 값이 나와야 한다.
## Run: godot --headless --path godot --fixed-fps 60 -s res://tests/ballistics_test.gd

const Ballistics := preload("res://scripts/ballistics.gd")

var gd: Node
var ok := {}
var frames := 0
var wall: StaticBody3D
var wall2: StaticBody3D

func _initialize() -> void:
	gd = root.get_node("GameData")
	# 물리 광선 검사용 벽: z=-60 (두께 2) 과 그 앞 z=-30 (낮은 상자, 위쪽 y<0 에서만 막힘)
	wall = _make_box(Vector3(0, 0, -60), Vector3(40, 40, 2))
	wall2 = _make_box(Vector3(0, -10.5, -30), Vector3(40, 20, 2)) # 윗면 y=-0.5
	root.add_child(wall)
	root.add_child(wall2)

func _make_box(pos: Vector3, size: Vector3) -> StaticBody3D:
	var b := StaticBody3D.new()
	b.collision_layer = 1
	var cs := CollisionShape3D.new()
	var sh := BoxShape3D.new()
	sh.size = size
	cs.shape = sh
	b.add_child(cs)
	b.position = pos
	return b

func _near(a: float, b: float, eps := 1e-4) -> bool:
	return absf(a - b) <= eps

func _test_drop() -> void:
	var bd: float = gd.player.bulletDrop
	ok.drop_30 = _near(Ballistics.drop_at(30.0, 1.0, bd), 0.72) # "30m 약 0.7m"
	ok.drop_50 = _near(Ballistics.drop_at(50.0, 1.0, bd), 2.0) # "50m 약 2m"
	ok.drop_80 = _near(Ballistics.drop_at(80.0, 1.0, bd), 5.12) # 권총 사거리 끝
	ok.drop_0 = Ballistics.drop_at(0.0, 1.0, bd) == 0.0
	# 낙차는 거리의 제곱: 2배 멀리 가면 4배
	ok.drop_sq = _near(Ballistics.drop_at(100.0, 1.0, bd), 4.0 * Ballistics.drop_at(50.0, 1.0, bd))
	# 저격총은 dropMul 0.05: 100m 에서 0.4m, 사거리 끝 220m 에서 약 1.94m
	var sdm: float = float(gd.guns.sniper.dropMul)
	ok.sniper_mul = sdm == 0.05
	ok.sniper_100 = _near(Ballistics.drop_at(100.0, sdm, bd), 0.4)
	ok.sniper_220 = _near(Ballistics.drop_at(220.0, sdm, bd), 1.936)
	# 다른 총은 dropMul 이 없다 (=1)
	var others := true
	for id in ["pistol", "shotgun", "smg", "magnum", "rifle"]:
		others = others and not gd.guns[id].has("dropMul")
	ok.others_default = others
	var p := Ballistics.point_at(Vector3(1, 2, 3), Vector3(0, 0, -1), 50.0, 1.0, bd)
	ok.point = _near(p.x, 1.0) and _near(p.y, 0.0) and _near(p.z, -47.0)

func _test_kick() -> void:
	var pistol: Dictionary = gd.guns.pistol
	var sniper: Dictionary = gd.guns.sniper
	var smg: Dictionary = gd.guns.smg
	# 첫 발: recoil × 2.4 × (1 + bloom × 0.85). 권총 bloom 0.6 × 1.15 = 0.69
	var bloom := float(pistol.bloom) * 1.15
	var k1 := Ballistics.kick_after_shot(0.0, pistol, bloom, false)
	ok.kick_first = _near(k1, 0.035 * 2.4 * (1.0 + bloom * 0.85))
	# 조준하면 0.45배
	ok.kick_aim = _near(Ballistics.kick_after_shot(0.0, pistol, bloom, true), k1 * 0.45)
	# 반동 줄이기 스킬 (recoilMul 0.5)
	ok.kick_skill = _near(Ballistics.kick_after_shot(0.0, pistol, bloom, false, 0.5), k1 * 0.5)
	# 저격총은 배율 3.4, 상한 0.92. 일반 총기 상한 0.62
	ok.kick_sniper = _near(Ballistics.kick_after_shot(0.0, sniper, 0.575, false), minf(0.92, 0.48 * 3.4 * (1.0 + 0.575 * 0.85)))
	ok.cap_sniper = _near(Ballistics.kick_after_shot(0.9, sniper, 0.575, false), 0.92)
	ok.cap_pistol = _near(Ballistics.kick_after_shot(0.6, pistol, bloom, false), 0.62)
	# 연사 누적: 기관단총을 쏘면(0.068초 간격) 반동이 계속 쌓이고 상한 0.62 를 넘지 않는다. 쌓일수록 한 발이 커진다(bloom)
	var kick := 0.0
	var b := 0.0
	var since := 9.0
	var dt := 1.0 / 60.0
	var first_kick := -1.0
	var peak := 0.0
	var cooldown := 0.0
	for f in 120:
		# tickWeapon: bloom 감쇠, 반동 회복
		b = maxf(0.0, b - dt * (1.5 if since < 0.28 else 2.4))
		since += dt
		cooldown = maxf(0.0, cooldown - dt)
		kick = Ballistics.kick_recover(kick, dt)
		if cooldown <= 0.0:
			b = minf(b + float(smg.bloom) * 1.15, 2.8)
			var nk := Ballistics.kick_after_shot(kick, smg, b, false)
			kick = nk
			if first_kick < 0.0:
				first_kick = kick
			since = 0.0
			cooldown = float(smg.rate)
		peak = maxf(peak, kick)
	ok.spray_peak = peak > 0.2 and peak <= 0.62 + 1e-9
	ok.spray_grows = peak > first_kick * 4.0 # 연사하면 첫 발의 몇 배로 쌓인다
	# 회복: 멈추면 0.16초 뒤부터 빠르게 (4/s), 그 전에는 천천히 (0.85/s)
	var k0 := 0.5
	var slow := Ballistics.kick_recover(k0, 0.1)
	ok.recover_slow = _near(slow, k0 - k0 * 0.1 * 0.85)
	ok.idle_wait = Ballistics.kick_recover_idle(k0, 0.1, 0.1, false) == k0
	ok.idle_fired = Ballistics.kick_recover_idle(k0, 0.1, 1.0, true) == k0
	ok.idle_fast = _near(Ballistics.kick_recover_idle(k0, 0.1, 0.2, false), k0 - k0 * 0.1 * 4.0)
	# 1초 동안 쉬면 거의 0 으로 돌아온다
	var r := 0.62
	var since2 := 0.0
	for f in 60:
		since2 += dt
		r = Ballistics.kick_recover(r, dt)
		r = Ballistics.kick_recover_idle(r, dt, since2, false)
	ok.recover_full = r < 0.03
	ok.recover_nonneg = Ballistics.kick_recover(0.0, dt) == 0.0

func _test_assist() -> void:
	var bd: float = gd.player.bulletDrop
	var pad: float = float(gd.player.aimAssist)
	ok.assist_val = _near(pad, 0.15)
	var o := Vector3(0, 1.6, 0)
	var d := Vector3(0, 0, -1)
	# 원기둥 규칙: 정면 20m, 반지름 0.4, 높이 1.8 -> 19.6m 에서 닿는다. 옆 0.5 는 빗나가고 pad 0.15 를 더하면(0.55) 닿는다
	ok.cyl_front = _near(Ballistics.ray_cylinder(o, d, 0, -20, 0.4, 1.8, 0.0), 19.6, 1e-3)
	ok.cyl_miss = Ballistics.ray_cylinder(o, d, 0.5, -20, 0.4, 1.8, 0.0) < 0.0
	ok.cyl_pad = Ballistics.ray_cylinder(o, d, 0.5, -20, 0.4 + pad, 1.8, 0.0) > 0.0
	var src := GDScript.new()
	src.source_code = "extends CharacterBody3D\nvar radius := 0.4\nvar height := 1.8\nvar dead := false\n"
	src.reload()
	var z: CharacterBody3D = src.new()
	root.add_child(z)
	z.global_position = Vector3(0.5, 0, -20)
	var arr := [z]
	var none := Array([], TYPE_RID, "", null)
	var pick := Ballistics.assist_pick(arr, o, d, 1.0, bd, pad, 0.0, 100.0, none)
	ok.assist_edge = not pick.is_empty() and pick.collider == z and float(pick.t) > 19.0 and float(pick.t) < 20.5
	# 보정 없이는 못 맞힌다
	ok.assist_off = Ballistics.assist_pick(arr, o, d, 1.0, bd, 0.0, 0.0, 100.0, none).is_empty()
	# 더 가까운 물리 충돌(t_limit 10) 뒤에 있으면 무시, 이미 맞힌 좀비(exclude)도 무시, 죽은 좀비도 무시
	ok.assist_blocked = Ballistics.assist_pick(arr, o, d, 1.0, bd, pad, 0.0, 10.0, none).is_empty()
	var ex: Array[RID] = [z.get_rid()]
	ok.assist_excl = Ballistics.assist_pick(arr, o, d, 1.0, bd, pad, 0.0, 100.0, ex).is_empty()
	z.dead = true
	ok.assist_dead = Ballistics.assist_pick(arr, o, d, 1.0, bd, pad, 0.0, 100.0, none).is_empty()
	z.dead = false
	# 낙차 때문에 머리 위로 지나가는(저격 아닌 총 100m) 탄은 높이 범위 밖이면 거른다: 60m 낙차 2.88m -> 1.6-2.88 < -0.2
	z.global_position = Vector3(0.5, 0, -60)
	ok.assist_drop = Ballistics.assist_pick(arr, o, d, 1.0, bd, pad, 0.0, 100.0, none).is_empty()
	z.queue_free()

func _test_data() -> void:
	# 6종 모두 recoil 이 있고 kind 가 있다 (kick_after_shot 이 읽는 값)
	var all6: bool = gd.gun_order.size() == 6
	for id in gd.gun_order:
		all6 = all6 and float(gd.guns[id].recoil) > 0.0 and String(gd.guns[id].kind) != ""
	ok.guns_have_recoil = all6
	# 샷건 산탄·매그넘·저격총 관통은 그대로
	ok.pellets = int(gd.guns.shotgun.pellets) == 9 and int(gd.guns.magnum.pierce) == 2 and int(gd.guns.sniper.pierce) == 3 and bool(gd.guns.sniper.scope)

func _process(_dt: float) -> bool:
	frames += 1
	if frames == 1: # 자동 로드(GameData)가 데이터를 읽은 뒤에 수치 검사
		_test_drop()
		_test_kick()
		_test_data()
		_test_assist()
	if frames == 4: # 벽이 물리 서버에 올라간 뒤
		var space := root.world_3d.direct_space_state
		var bd: float = gd.player.bulletDrop
		var o := Vector3(0, 1.6, 0)
		var d := Vector3(0, 0, -1)
		# 낙차 없이(dropMul 0) 수평으로 쏘면 z=-59 면에 y=1.6 으로 맞는다
		var flat := Ballistics.trace(space, o, d, 100.0, 0.0, bd, 1)
		ok.trace_flat = not flat.is_empty() and _near(flat.position.y, 1.6, 0.02) and _near(float(flat.t), 59.0, 0.05)
		# 일반 낙차로 같은 방향: 낮은 상자(z=-30, 윗면 y=-0.5)에는 그 앞에서 y 가 -0.5 아래로 떨어진 뒤 맞지 않고(상자 앞면 z=-29), 앞면은 y<-0.5 에서만 있다.
		# 29m 에서 낙차 0.67m: y = 0.93 > -0.5 이라 상자 위로 지나가고, 벽(59m)에서는 낙차 2.78m → y = -1.18
		var drop := Ballistics.trace(space, o, d, 100.0, 1.0, bd, 1)
		ok.trace_drop = not drop.is_empty() and drop.collider == wall and _near(float(drop.position.y), 1.6 - Ballistics.drop_at(float(drop.t), 1.0, bd), 0.05) and float(drop.position.y) < 0.0
		# 저격총 낙차(1/20)는 벽에서 약 0.14m 만 내려간다
		var sn := Ballistics.trace(space, o, d, 220.0, 0.05, bd, 1)
		ok.trace_sniper = not sn.is_empty() and _near(float(sn.position.y), 1.6 - Ballistics.drop_at(59.0, 0.05, bd), 0.05)
		# 사거리가 모자라면 안 맞는다 (벽까지 59m, 사거리 50m)
		ok.trace_range = Ballistics.trace(space, o, d, 50.0, 0.0, bd, 1).is_empty()
		# 맞은 것을 exclude 에 넣고 그 자리부터 다시 쏘면 다음 것에 맞거나(없으면) 빈 결과 (관통)
		var ex: Array[RID] = [wall.get_rid()]
		var again := Ballistics.trace(space, o, d, 100.0, 0.0, bd, 1, ex, float(flat.t))
		ok.trace_pierce = again.is_empty()
		# 낮게 쏘면(아래로 향함) 낮은 상자 앞면(z=-29)에 먼저 맞는다
		var low := Ballistics.trace(space, Vector3(0, 0.0, 0), d, 100.0, 1.0, bd, 1)
		ok.trace_low = not low.is_empty() and low.collider == wall2 and float(low.t) < 40.0
	if frames >= 6:
		var keys := ok.keys()
		var pass_ := true
		for k in keys:
			pass_ = pass_ and ok[k]
		print("BALLISTICS ", ok, " -> ", "PASS" if pass_ else "FAIL")
		quit(0 if pass_ else 1)
	return false
