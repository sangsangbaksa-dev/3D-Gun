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
		Sfx.play("coreHit")
	_core_hp = hp

func _on_zombie(z: Node) -> void:
	if z.has_signal("killed"):
		z.killed.connect(func(dz: Node, _g: int): Sfx.play("zDeath", dz.global_position))

func _process(dt: float) -> void:
	var p: Node = game.player
	# 웨이브 시작·클리어, 보스 등장
	if game.phase != _phase:
		if game.phase == "combat":
			Sfx.play("waveStart")
		elif game.phase == "prep" and _phase == "combat":
			Sfx.play("waveClear")
		_phase = game.phase
	if is_instance_valid(game.boss) and game.boss != _boss:
		_boss = game.boss
		Sfx.play("boss")
	# 총: 탄이 줄면 발사음, 재장전 시작·끝
	if p.gun_id != _gun:
		_gun = p.gun_id
	elif p.ammo < _ammo:
		Sfx.gun(p.gun_id)
	_ammo = p.ammo
	var rl: bool = p.is_reloading()
	if rl and not _reloading:
		Sfx.gun("reload")
	elif not rl and _reloading and p.ammo >= p.mag_size(p.gun_id):
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
		if z.global_position.distance_to(p.global_position) < 30.0 and not z.get("stunned"):
			near.append(z)
	_groan_t -= dt
	if _groan_t <= 0.0:
		_groan_t = (3.2 / minf(4.0, 0.6 + near.size() * 0.35) + randf() * 1.5) if near.size() > 0 else 1.0
		if near.size() > 0 and playing:
			Sfx.play("groan", near[randi() % near.size()].global_position)
	# 배경 바람 + 드론
	_amb_t -= dt
	if _amb_t <= 0.0:
		_amb_t = 0.5
		var paused := Input.mouse_mode != Input.MOUSE_MODE_CAPTURED
		Sfx.set_ambient(Sfx.ambient_target(game.phase, boss, near.size() / 8.0, paused or not playing))
