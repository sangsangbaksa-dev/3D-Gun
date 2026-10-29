extends Node
## Hooks the sortie to Sfx without touching the gameplay scripts: listens to player/core/zombie signals
## and watches wave phase, ammo and reloads (src/audio/index.ts AudioSystem.init/update).

var game: Node
var _phase := "prep"
var _ammo := -1
var _gun := ""
var _reloading := false
var _boss: Node
var _core_hp := INF
var _beat_t := 0.0
var _groan_t := 2.0
var _amb_t := 0.0
const Ambience := preload("res://scripts/ambience.gd")
const STEP_BY_ZONE := {"field": "step_grass", "forest": "step_grass", "base": "step_metal", "mine": "step_stone",
	"quarry": "step_stone", "ruins": "step_stone", "wasteland": "step_dirt", "boss": "step_dirt", "wild": "step_dirt"}
## 재장전 단계음: 총 종류 -> [[진행도 k(0..1), 소리 id], ...]. 뷰모델 모션(player.gd _animate_parts)의 타이밍과 맞춘다.
const RELOAD_STAGES := {
	"pistol": [[0.12, "mag_out"], [0.58, "mag_in"], [0.85, "chamber"]],
	"smg": [[0.12, "mag_out"], [0.58, "mag_in"], [0.85, "chamber"]],
	"rifle": [[0.12, "mag_out"], [0.58, "mag_in"], [0.85, "chamber"]],
	"shotgun": [[0.16, "shell"], [0.5, "shell"], [0.83, "shell"], [0.95, "pump"]], # 펌프 모션이 세 번 밀어 넣는다
	"revolver": [[0.2, "cylinder"], [0.5, "shell"], [0.85, "cylinder"]],
	"sniper": [[0.1, "mag_out"], [0.5, "mag_in"], [0.86, "bolt"]], # 볼트는 k>0.82 에서 움직인다
}
var _reload_k := 0.0       # 지금까지 재생한 단계의 진행도
var _stride := 0.0         # 마지막 발소리 이후 걸은 거리
var _was_floor := true
var _fall := 0.0           # 공중에서의 최대 낙하 속도
var _dash_prev := 0.0
var _zstate := {}          # 좀비 id -> 지난 프레임 상태 (공격 시작 감지)
var _warned := false
var _far_t := 8.0

func _ready() -> void:
	var p: Node = game.player
	p.fired.connect(_on_fired)
	p.weapon_changed.connect(func(_id): Sfx.gun("switch"))
	p.hurt.connect(func(_hp): Sfx.play("hurt"))
	p.died.connect(func(): Sfx.play("dead"); Sfx.play("runOver"))
	game.core.damaged.connect(_on_core)
	game.zombies_root.child_entered_tree.connect(_on_zombie)
	_gun = p.gun_id
	_ammo = p.ammo

func _on_fired(_from: Vector3, to: Vector3, hit: bool, headshot: bool, kill: bool, _also: Array) -> void:
	if not hit:
		return
	Sfx.play("zHit", to)
	Sfx.gun("kill" if kill else ("headshot" if headshot else "hit"))

func _on_core(hp: float) -> void:
	if hp < _core_hp - 0.01: # 회복 때도 같은 신호가 오므로 줄었을 때만
		# 경보가 막 울렸으면 피격음은 작게 (둘이 겹쳐 뭉개지지 않게)
		Sfx.play("coreHit", null, 0.45 if Sfx.recently("coreAlarm", 0.8) else 1.0)
	_core_hp = hp

func _on_zombie(z: Node) -> void:
	if z.has_signal("killed"):
		z.killed.connect(func(dz: Node, _g: int):
			var big: bool = dz.type in ["fatty", "tank"] or dz.is_boss
			Sfx.play("zDeath", dz.global_position, 1.3 if dz.is_boss else 1.0)
			if big:
				Sfx.play("z_growl", dz.global_position, 0.9)) # 덩치 큰 놈은 낮은 신음을 남기고 쓰러진다

func _process(dt: float) -> void:
	var p: Node = game.player
	# 웨이브 시작·클리어, 보스 등장
	if game.phase != _phase:
		if game.phase == "combat":
			Sfx.play("waveStart")
		elif game.phase == "prep" and _phase == "combat":
			Sfx.play("waveClear")
		_phase = game.phase
		_warned = false
	if is_instance_valid(game.boss) and game.boss != _boss:
		_boss = game.boss
		Sfx.play("boss")
		Sfx.play("roar", game.boss.global_position, 1.1)
	# 웨이브 시작 직전 경고 (준비 시간 8초 남았을 때 한 번)
	if game.phase == "prep" and not _warned and game.prep_left < 8.0 and game.prep_left > 0.0:
		_warned = true
		Sfx.play("sting_warn")
	_footsteps(p, dt)
	# 총: 탄이 줄면 발사음, 재장전 시작·끝
	if p.gun_id != _gun:
		_gun = p.gun_id
	elif p.ammo < _ammo:
		Sfx.gun(p.gun_id)
	_ammo = p.ammo
	var rl: bool = p.is_reloading()
	if rl and not _reloading:
		_reload_k = 0.0
	if rl:
		_reload_stages(p)
	if not rl and _reloading and p.ammo >= p.mag_size(p.gun_id):
		Sfx.gun("reloadDone")
	_reloading = rl
	var playing: bool = game.phase != "ended" and not p.dead and not get_tree().paused
	# 저체력 심장 박동
	var beat := Sfx.heartbeat_interval(p.hp / p.max_hp) if playing else 0.0
	if beat > 0.0:
		_beat_t -= dt
		if _beat_t <= 0.0:
			Sfx.play("heartbeat")
			_beat_t = beat
	else:
		_beat_t = 0.0
	# 가까운 좀비 신음: 많을수록 자주
	var near: Array = []
	var boss := false
	for z in game.zombies_root.get_children():
		if z.dead:
			continue
		boss = boss or z.is_boss
		var dist: float = z.global_position.distance_to(p.global_position)
		if dist < 30.0 and not z.get("stunned"):
			near.append(z)
		if dist < 45.0:
			_zombie_cues(z)
	_groan_t -= dt
	if _groan_t <= 0.0:
		_groan_t = (3.2 / minf(4.0, 0.6 + near.size() * 0.35) + randf() * 1.5) if near.size() > 0 else 1.0
		if near.size() > 0 and playing:
			var zz: Node = near[randi() % near.size()]
			_voice(zz)
	_far_ambience(dt, playing, boss)
	# 배경 바람 + 드론
	_amb_t -= dt
	if _amb_t <= 0.0:
		_amb_t = 0.5
		var paused := Input.mouse_mode != Input.MOUSE_MODE_CAPTURED
		Sfx.set_ambient(Sfx.ambient_target(game.phase, boss, near.size() / 8.0, paused or not playing))

## 좀비 종류별 목소리 (동시 4개 제한은 sfx.json 의 group "voc").
func _voice(z: Node) -> void:
	var at: Vector3 = z.global_position
	match z.type:
		"fatty", "tank": Sfx.play("z_growl", at, 1.0)
		"runner", "swarmer", "crawler": Sfx.play("z_rasp", at, 0.9)
		"screamer": Sfx.play("z_scream", at, 0.6)
		"boss", "bossBomb", "bossAcid", "bossLord", "king": Sfx.play("z_growl", at, 1.3)
		_: Sfx.play("groan", at)

## 상태가 windup 으로 바뀌는 순간 공격·능력 소리 (종류별).
func _zombie_cues(z: Node) -> void:
	var id := z.get_instance_id()
	var st: String = z.state
	if st == "windup" and _zstate.get(id, "") != "windup":
		var at: Vector3 = z.global_position
		match z.type:
			"spitter": Sfx.play("z_spit", at)
			"leaper": Sfx.play("z_leap", at)
			"screamer": Sfx.play("z_scream", at, 0.9)
			"boss", "bossBomb", "bossAcid", "bossLord", "king": Sfx.play("roar", at, 0.8)
			_: Sfx.play("z_swipe", at)
	_zstate[id] = st
	if _zstate.size() > 200: # 죽은 좀비 항목 정리
		_zstate.clear()

## 재장전 진행도에 맞춰 단계음을 한 번씩.
func _reload_stages(p: Node) -> void:
	var total: float = p._reload_total
	if total <= 0.0:
		return
	var k: float = 1.0 - p.reload_left / total
	for st in RELOAD_STAGES.get(p.gun.kind, []):
		if k >= float(st[0]) and _reload_k < float(st[0]):
			Sfx.play(st[1])
	_reload_k = k

## 발소리(지면은 구역에 따라), 점프·착지·대시.
func _footsteps(p: Node, dt: float) -> void:
	var on_floor: bool = p.is_on_floor()
	var spd := Vector2(p.velocity.x, p.velocity.z).length()
	var dashing: bool = p.dash_left > 0.0
	if dashing and _dash_prev <= 0.0:
		Sfx.play("dash")
	_dash_prev = p.dash_left
	if p.dead:
		return
	if not on_floor:
		_fall = maxf(_fall, -p.velocity.y)
		if _was_floor and p.velocity.y > 1.0:
			Sfx.play("jump")
	elif not _was_floor:
		if _fall > 2.5:
			Sfx.play("land", null, clampf(_fall / 9.0, 0.35, 1.0))
		_fall = 0.0
		_stride = 0.0
	_was_floor = on_floor
	if on_floor and spd > 1.0 and not dashing:
		_stride += spd * dt
		var stride_len := 2.2 if spd > 5.5 else 1.7 # 달릴수록 보폭이 길고, 천천히 걸으면 자주 디딘다
		if _stride >= stride_len:
			_stride = 0.0
			var quiet := 0.55 if p.aiming else 1.0 # 조준 중엔 살금살금
			var g := clampf(spd / 7.0, 0.35, 1.0) * quiet
			var id: String = STEP_BY_ZONE.get(Ambience.zone_at(p.global_position), "step_dirt")
			Sfx.play(id, null, g * 0.8)

## 구역·시간대 앰비언트 일회음: 들판/숲 준비 시간엔 귀뚜라미, 폐허·황무지·광산엔 삐걱임, 전투 중엔 먼 신음.
func _far_ambience(dt: float, playing: bool, boss: bool) -> void:
	_far_t -= dt
	if _far_t > 0.0:
		return
	_far_t = randf_range(7.0, 16.0)
	if not playing:
		return
	var p: Node = game.player
	var zone: String = Ambience.zone_at(p.global_position)
	var dir := Vector3(randf() * 2.0 - 1.0, 0.0, randf() * 2.0 - 1.0).normalized()
	var at: Vector3 = p.global_position + dir * randf_range(25.0, 40.0)
	if game.phase == "combat" or boss:
		Sfx.play("amb_far", at, 0.8)
	elif zone in ["field", "forest"]:
		Sfx.play("amb_cricket", at, 0.6)
	elif zone in ["ruins", "mine", "wasteland", "quarry"]:
		Sfx.play("amb_creak", at, 0.55)
	elif randf() < 0.5:
		Sfx.play("amb_far", at, 0.5)
