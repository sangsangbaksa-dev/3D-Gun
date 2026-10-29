extends SceneTree
## 장면 반복 생성·해제 시 노드/객체가 늘어나는지(누수) 확인한다. 출력: LEAK 줄.
## Run: godot --headless --path godot --fixed-fps 60 -s res://tests/leak_check.gd
var frames := 0
var cur: Node
var round_n := 0
var counts: Array = []

func _snap() -> Array:
	return [Performance.get_monitor(Performance.OBJECT_NODE_COUNT), Performance.get_monitor(Performance.OBJECT_COUNT),
		Performance.get_monitor(Performance.OBJECT_ORPHAN_NODE_COUNT), Performance.get_monitor(Performance.MEMORY_STATIC) / 1048576.0]

func _process(_dt: float) -> bool:
	frames += 1
	if frames % 30 != 0:
		return false
	if cur != null:
		cur.spawn_zombie("normal", cur.player.global_position + Vector3(0, 0.3, -6), 0, false)
		cur.base.spawn("tower", Vector3(8, cur.world.ground_y(8, 6), 6))
		cur.queue_free()
		cur = null
		return false
	if round_n > 0:
		var s := _snap()
		counts.append(s)
		print("LEAK round %d nodes=%d objects=%d orphans=%d mem=%.1fMB" % [round_n, s[0], s[1], s[2], s[3]])
	if round_n >= 5:
		var grow: float = counts[4][1] - counts[1][1]
		print("LEAK objects growth round2->5: %d -> %s" % [grow, "OK" if grow < 50 else "LEAK?"])
		quit(0)
		return true
	round_n += 1
	cur = load("res://scenes/game.tscn").instantiate()
	root.add_child(cur)
	return false
