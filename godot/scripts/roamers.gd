extends Node
## Zone roamers: zombies that wander inside the map's danger zones, separate from the lane waves.
## Port of Sim.updateRoamers() in src/enemies/logic/sim.ts. Every 2 s each zone (not the base, danger >= 2)
## is topped up to floor(roamPerDanger * danger) zombies, away from the player. They are not counted in the
## wave (game.alive) so clearing a wave does not wait for them; their kills still pay coins and samples.

const ZombieScript := preload("res://scripts/zombie.gd")
const SPAWN_MIN_DIST := 48.0 # 눈앞에서 튀어나오지 않게

var game: Node
var enabled := true
var freeze_dist := 130.0 # 이보다 멀리 있는 배회 좀비는 멈춰 둔다 (구역 단위 비활성화로 성능 확보)
var _t := 1.0
var _far_t := 0.0

func _process(dt: float) -> void:
	if not enabled or game.phase == "ended" or game.player.dead:
		return
	_far_t -= dt
	if _far_t <= 0.0:
		_far_t = 1.0
		_update_activation()
	_t -= dt
	if _t > 0.0:
		return
	_t = 2.0
	_top_up()

func roamers() -> Array:
	var out := []
	for z in game.zombies_root.get_children():
		if not z.dead and not z.home.is_empty():
			out.append(z)
	return out

func _top_up() -> void:
	var rules: Dictionary = GameData.enemy_rules
	var p: Vector3 = game.player.global_position
	var have := {}
	for z in roamers():
		have[z.home.zone] = int(have.get(z.home.zone, 0)) + 1
	for zone in GameData.map.zones:
		if zone.kind == "base" or float(zone.danger) < 2.0:
			continue
		var want := maxi(0, floori(float(rules.roamPerDanger) * float(zone.danger)))
		if int(have.get(zone.id, 0)) >= want:
			continue
		var a: float = game.rng.randf() * TAU
		var r: float = sqrt(game.rng.randf()) * float(zone.r)
		var x: float = float(zone.x) + cos(a) * r
		var zz: float = float(zone.z) + sin(a) * r
		if Vector2(x - p.x, zz - p.z).length() < SPAWN_MIN_DIST:
			continue
		spawn(_pick_type(float(zone.danger), game.rng.randf()), Vector3(x, 0.2, zz), zone)

## danger 4+ brings tanks and fatties, 3+ leapers and runners, the rest crawlers and normal ones.
static func _pick_type(danger: float, rr: float) -> String:
	if danger >= 4.0 and rr < 0.3:
		return "tank"
	if danger >= 4.0 and rr < 0.5:
		return "fatty"
	if danger >= 3.0 and rr < 0.35:
		return "leaper"
	if danger >= 3.0 and rr < 0.6:
		return "runner"
	if rr < 0.8:
		return "crawler"
	return "normal"

func spawn(type: String, pos: Vector3, zone: Dictionary) -> Node3D:
	var z := ZombieScript.new()
	z.type = type
	z.wave = maxi(1, game.wave) + int(zone.danger)
	z.wave_zombie = false
	z.home = {"x": float(zone.x), "z": float(zone.z), "r": float(zone.r) * 0.8, "zone": zone.id}
	z.lane = 0
	z.game = game
	z.position = Vector3(pos.x, game.world.ground_y(pos.x, pos.z) + 0.3, pos.z)
	z.killed.connect(_on_killed)
	game.zombies_root.add_child(z)
	z.state = "chase" # 등장 연출 없이 바로 돌아다닌다
	z.state_t = 0.0
	return z

## Same payout as game.gd _on_zombie_killed, but the wave counter (alive) is left alone.
func _on_killed(z: Node, gold: int) -> void:
	z.process_mode = Node.PROCESS_MODE_INHERIT # 멈춰 있던 채로 죽어도 쓰러지는 연출은 돌아야 한다
	game.kills += 1
	game.coins += gold
	if not z.converted:
		game.allies.roll_sample(z.type)

func _update_activation() -> void:
	var p: Vector3 = game.player.global_position
	for z in roamers():
		var far := Vector2(z.global_position.x - p.x, z.global_position.z - p.z).length() > freeze_dist
		z.process_mode = Node.PROCESS_MODE_DISABLED if far else Node.PROCESS_MODE_INHERIT
