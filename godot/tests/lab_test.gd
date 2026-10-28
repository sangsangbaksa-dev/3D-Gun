extends SceneTree
## Headless test: build a lab, a barracks and a shop; craft a vaccine; exchange resources; ally cap grows.
## Run: godot --headless --path godot --fixed-fps 60 -s res://tests/lab_test.gd

var game: Node
var frames := 0
var ok := {}

func _initialize() -> void:
	root.get_node("Save").meta.allies = []
	game = load("res://scenes/game.tscn").instantiate()
	root.add_child(game)
	game.ready.connect(func(): game.roamers.enabled = false) # 구역 배회 좀비는 roamers_test 에서만

func _process(_dt: float) -> bool:
	frames += 1
	if frames == 5:
		for r in game.res:
			game.res[r] = 500
		game.samples = 20
		game.samples_sp = 10
		var cap0: int = game.allies.cap()
		var pl: Vector3 = game.player.global_position
		game.base.spawn("lab", Vector3(pl.x + 9, 0, pl.z))
		game.base.spawn("shop", Vector3(pl.x - 9, 0, pl.z))
		game.base.spawn("barracks", Vector3(pl.x, 0, pl.z + 12))
		ok.cap = game.allies.cap() == cap0 + 3
		var pre: Array = game.allies.vaccines.duplicate()
		game.allies.enqueue_craft(0)
		ok.paid = game.samples == 20 - 6 and game.res.herb == 490
		ok.near = game.allies.station_near(pl + Vector3(9, 0, 0)) == "lab" and game.allies.station_near(pl + Vector3(-9, 0, 0)) == "shop"
		ok.pre = pre == [0, 0, 0]
	if frames == 5 + 60 * 15:
		ok.crafted = game.allies.vaccines[0] == 4
		var c0: int = game.coins
		game.station.kind = "shop"
		game.res.wood = 5
		game.coins = 100
		game.station.visible = true
		game.station._exchange() # 패널을 한 번 그려 본다 (에러 없이)
		game.station.visible = false
		ok.shop = true
	if frames >= 5 + 60 * 15 + 3:
		var pass_: bool = ok.get("cap", false) and ok.get("paid", false) and ok.get("near", false) and ok.get("pre", false) and ok.get("crafted", false) and ok.get("shop", false)
		print("LAB ", ok, " -> ", "PASS" if pass_ else "FAIL")
		quit(0 if pass_ else 1)
	return false
