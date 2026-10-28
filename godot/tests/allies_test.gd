extends SceneTree
## Headless test for stun → vaccine → ally, ally fighting, saving, and the sound hooks.
## Run: godot --headless --path godot --fixed-fps 60 -s res://tests/allies_test.gd

var game: Node
var frames := 0
var save: Node
var ok := {}
var ally: Node
var z: Node

func _initialize() -> void:
	save = root.get_node("Save")
	save.meta.allies = []
	game = load("res://scenes/game.tscn").instantiate()
	root.add_child(game)
	game.roamers.enabled = false # 구역 배회 좀비는 roamers_test 에서만
	game.rng.seed = 3

func _process(_dt: float) -> bool:
	frames += 1
	var p = game.player
	p.hp = p.max_hp
	if frames == 30:
		# 플레이어 앞에 좀비를 세우고 기절 구간까지 깎는다
		z = game.spawn_zombie("normal", p.global_position + Vector3(0, 0, -1.5), 0, false)
	if frames == 70:
		z.state = "chase"
		z.hp = z.max_hp * 0.5
		var stunned := false
		for i in 40: # 기절 확률(35%)이라 여러 번 시도: 맞을 때마다 체력을 되돌린다
			z.take_hit(z.max_hp * 0.25, Vector3.FORWARD)
			if z.stunned:
				stunned = true
				break
			if z.dead:
				break
			z.hp = z.max_hp * 0.5
		ok.stunned = stunned
		game.allies.vaccines = [0, 0, 5]
	if frames > 70 and frames < 400 and ok.get("stunned") and is_instance_valid(z) and not z.dead and z.stunned:
		# 주사: E 를 누른 것처럼 진행도를 채운다 (성공률 80%+ 고급 백신, 실패하면 다시 기절시킨다)
		Input.action_press("ui_accept")
		game.allies.progress = 0.99
		Input.parse_input_event(_key(true))
	if frames > 70 and is_instance_valid(z) and not z.dead and not z.stunned and ok.get("stunned") and not ok.has("ally"):
		z._stun()
	if not ok.has("ally") and game.allies.list().size() > 0:
		ok.ally = true
		ally = game.allies.list()[0]
		Input.parse_input_event(_key(false))
	if frames == 500:
		ok.saved = save.meta.allies.size() >= 1
		# 전투병이면 플레이어 곁의 좀비를 친다
		var z2 = game.spawn_zombie("normal", p.global_position + Vector3(2, 0, -3), 0, false)
		z2.set_meta("t", true)
		ok.target_z = z2
	if frames == 900:
		var z2 = ok.target_z
		ok.ally_fought = not is_instance_valid(z2) or z2.dead or z2.hp < z2.max_hp
	if frames >= 910:
		var pass_: bool = ok.get("stunned", false) and ok.get("ally", false) and ok.get("saved", false) and ok.get("ally_fought", false)
		print("ALLIES stunned=%s ally=%s role=%s saved=%s fought=%s -> %s" % [ok.get("stunned"), ok.get("ally"), ally.role if ally else "-", ok.get("saved"), ok.get("ally_fought"), "PASS" if pass_ else "FAIL"])
		save.meta.allies = []
		quit(0 if pass_ else 1)
	return false

func _key(down: bool) -> InputEventKey:
	var e := InputEventKey.new()
	e.physical_keycode = KEY_E
	e.keycode = KEY_E
	e.pressed = down
	return e
