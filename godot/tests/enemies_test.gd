extends SceneTree
## Headless test for stage 3: every zombie type can hurt the player and be killed for the right coins,
## a wave zombie walks its lane and damages the core, and wave 10 brings a boss.
## Run: godot --headless --path godot --fixed-fps 60 -s res://tests/enemies_test.gd
## (the shell wrapper should also fail on any "SCRIPT ERROR" line)

const TYPES := ["normal", "runner", "fatty", "crawler", "swarmer", "leaper", "spitter", "bomber", "screamer", "tank",
	"boss", "bossBomb", "bossAcid", "bossLord", "king"]
const WINDOW := 60 * 12

var game: Node
var gd: Node
var frames := 0
var step := 0      # 0..TYPES.size()-1 = 종류별 시험, 그 뒤 레인/보스 시험
var step_start := 0
var cur: Node3D
var hurt_by := {}
var coins_ok := {}
var core_hit := false
var boss_ok := false
var lane_z: Node3D
var killed_at := -9999
var gold_paid := -1

func _initialize() -> void:
	gd = root.get_node("GameData")
	game = load("res://scenes/game.tscn").instantiate()
	root.add_child(game)
	game.rng.seed = 7
	game.prep_left = 9999.0 # 웨이브는 직접 부른다

func _process(_dt: float) -> bool:
	frames += 1
	var p = game.player
	if frames < 3:
		return false
	if step < TYPES.size():
		var t: String = TYPES[step]
		if cur == null:
			if frames - killed_at < 60 * 5:
				p.hp = p.max_hp # 앞 좀비의 독가스·폭발이 다음 종류 탓이 되지 않게 기다린다
				return false
			_clear()
			p.hp = p.max_hp
			p.iframes = 0.0
			cur = game.spawn_zombie(t, p.global_position + Vector3(10, 0.2, 0), 0, false)
			cur.wp = 99
			gold_paid = -1
			cur.killed.connect(func(_z, g): gold_paid = g)
			step_start = frames
		if p.hp < p.max_hp - 0.01:
			hurt_by[t] = true
		p.hp = p.max_hp
		if hurt_by.get(t, false) or frames - step_start > WINDOW:
			if is_instance_valid(cur) and not cur.dead:
				cur.take_hit(1e9, Vector3.FORWARD, true) # 아군 타격: 기절 없이 바로 죽인다
			# 폭탄 좀비는 스스로 터져도 처치 코인을 준다 (웹 게임과 같음)
			coins_ok[t] = gold_paid == int(gd.zombie_reward[t].gold)
			cur = null
			killed_at = frames
			step += 1
		return false
	if step == TYPES.size():
		# 레인: 플레이어를 멀리 두고 동쪽 레인 좀비가 핵까지 걸어가 때리는지
		_clear()
		p.global_position = Vector3(-150, 0.2, 150)
		game.wave = 1
		lane_z = game.spawn_on_lane("runner", 1, false)
		game.core.damaged.connect(func(_hp): core_hit = true)
		step_start = frames
		step += 1
		return false
	if step == TYPES.size() + 1:
		if core_hit or frames - step_start > 60 * 70:
			_clear()
			game.wave = 9
			game.prep_left = 0.0
			game.phase = "prep"
			step_start = frames
			step += 1
		return false
	if step == TYPES.size() + 2:
		p.hp = p.max_hp
		if is_instance_valid(game.boss) and game.boss_bar.visible and game.boss.type == gd.boss_type_for(10):
			boss_ok = true
		if boss_ok or frames - step_start > 60 * 10:
			_finish()
	return false

func _clear() -> void:
	for z in game.zombies_root.get_children():
		if not z.dead:
			z.take_hit(1e9, Vector3.FORWARD, true) # 아군 타격: 기절 없이 바로 죽인다

func _finish() -> void:
	var ok := core_hit and boss_ok
	var bad: Array = []
	for t in TYPES:
		if not hurt_by.get(t, false) or not coins_ok.get(t, false):
			bad.append(t)
	ok = ok and bad.is_empty()
	print("ENEMIES hurt=%s coins_ok=%s core_hit=%s boss_ok=%s failing=%s -> %s" % [hurt_by.size(), coins_ok.values().count(true), core_hit, boss_ok, bad, "PASS" if ok else "FAIL"])
	quit(0 if ok else 1)
