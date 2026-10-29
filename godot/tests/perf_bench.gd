extends SceneTree
## 성능 벤치(로직 비용만; 헤드리스라 렌더링은 안 잼). 좀비 N마리 + 건물/포탑 + 아군을 깔고
## 프레임당 _process / _physics_process 시간을 Performance 모니터로 재고, 스크립트별로 처리를 끄며 차이를 순위로 낸다.
## Run: godot --headless --path godot --fixed-fps 60 -s res://tests/perf_bench.gd -- 60
## 출력은 PERF 로 시작. 통과/실패 없음(수치 보고용).

var game: Node
var gd: Node
var frames := 0
var zcount := 50
var samples: Array = []
var phase_start := 0
const WARM := 90
const WIN := 240
var scripts_off: Array = []   # [path, [nodes]]
var idx := -1
var results := {}

func _initialize() -> void:
	for a in OS.get_cmdline_user_args():
		if a.is_valid_int():
			zcount = int(a)
	gd = root.get_node("GameData")
	game = load("res://scenes/game.tscn").instantiate()
	root.add_child(game)
	game.ready.connect(func(): game.roamers.enabled = false)
	game.rng.seed = 11
	game.prep_left = 9999.0

func _populate() -> void:
	var types := ["normal", "runner", "fatty", "crawler", "swarmer", "leaper", "spitter", "bomber"]
	for i in zcount:
		var ang := float(i) / zcount * TAU
		var r := 8.0 + float(i % 7) * 5.0
		var pos := Vector3(cos(ang) * r, 0.5, sin(ang) * r)
		var z = game.spawn_zombie(types[i % types.size()], pos, i % 6, false)
		z.wp = 99
	var spots := [["tower", 8, 6], ["turret", -8, 6], ["barricade", 5, -9], ["trap", -6, -9], ["lab", 11, -3], ["dorm", -11, -3], ["shop", 0, 12]]
	for s in spots:
		var k: String = s[0]
		if not gd.buildings.has(k):
			continue
		var at := Vector3(s[1], game.world.ground_y(s[1], s[2]), s[2])
		if game.base.check_spot(k, at.x, at.z) == "":
			game.base.spawn(k, at)
	for i in 6:
		game.allies.spawn(Vector3(3 + i, 0.5, 5), "normal")
	print("PERF setup zombies=%d structures=%d allies=%d nodes=%d" % [game.zombies_root.get_child_count(), game.base.structures.size(), game.allies.list().size(), Performance.get_monitor(Performance.OBJECT_NODE_COUNT)])

var _last_us := 0

## 헤드리스는 vsync 가 없어 연속 프레임 사이의 실제 시간이 곧 프레임 비용(물리 포함)이다.
func _mon() -> Array:
	var now := Time.get_ticks_usec()
	var d := float(now - _last_us) / 1000.0
	_last_us = now
	return [d, Performance.get_monitor(Performance.TIME_PHYSICS_PROCESS) * 1000.0]

func _med(v: Array) -> float:
	v.sort()
	return v[v.size() / 2] if v.size() > 0 else 0.0

func _avg_report(label: String) -> void:
	var a: Array = []
	var b: Array = []
	for s in samples:
		a.append(s[0])
		b.append(s[1])
	var ma := _med(a.duplicate())
	var mb := _med(b.duplicate())
	a.sort()
	var p95: float = a[int(a.size() * 0.95)] if a.size() > 0 else 0.0
	results[label] = [ma, mb]
	print("PERF %-36s median frame=%.3f ms physics-part=%.3f ms (frame p95=%.2f max=%.2f)" % [label, ma, mb, p95, a.back() if a.size() > 0 else 0.0])
	samples.clear()

func _collect_scripts() -> void:
	var by := {}
	var stack: Array = [game]
	while not stack.is_empty():
		var n: Node = stack.pop_back()
		var s = n.get_script()
		if s != null and (n.is_processing() or n.is_physics_processing()):
			by[s.resource_path] = by.get(s.resource_path, []) + [n]
		for c in n.get_children():
			stack.push_back(c)
	for k in by.keys():
		scripts_off.append([k, by[k]])

func _process(_dt: float) -> bool:
	frames += 1
	if frames == 5:
		_populate()
		phase_start = frames
		return false
	if frames < 5:
		return false
	var t := frames - phase_start
	game.player.hp = game.player.max_hp
	game.core.hp = game.core.max_hp
	var m := _mon()
	if t > WARM:
		samples.append(m)
	if t == WARM:
		for k in ["zms","zan","zth"]: Engine.set_meta(k, 0)
	if t >= WARM + WIN:
		if idx == -1:
			print("PERF zombie split per frame: move_and_slide=%.2f animate=%.2f think=%.2f ms" % [Engine.get_meta("zms")/1000.0/WIN, Engine.get_meta("zan")/1000.0/WIN, Engine.get_meta("zth")/1000.0/WIN])
			_avg_report("baseline (%d zombies)" % zcount)
			print("PERF nodes=%d orphan=%d objects=%d mem=%.1fMB" % [Performance.get_monitor(Performance.OBJECT_NODE_COUNT),
				Performance.get_monitor(Performance.OBJECT_ORPHAN_NODE_COUNT), Performance.get_monitor(Performance.OBJECT_COUNT),
				Performance.get_monitor(Performance.MEMORY_STATIC) / 1048576.0])
			_collect_scripts()
		else:
			var e = scripts_off[idx]
			_avg_report("off: " + str(e[0]).get_file())
			for n in e[1]:
				if is_instance_valid(n):
					n.set_process(true)
					n.set_physics_process(true)
		idx += 1
		if idx >= scripts_off.size():
			_rank()
			quit(0)
			return true
		for n in scripts_off[idx][1]:
			if is_instance_valid(n):
				n.set_process(false)
				n.set_physics_process(false)
		phase_start = frames
	return false

func _rank() -> void:
	var base: Array = results["baseline (%d zombies)" % zcount]
	var rows: Array = []
	for e in scripts_off:
		var r: Array = results.get("off: " + str(e[0]).get_file(), base)
		rows.append([base[0] - r[0], str(e[0]).get_file(), e[1].size()])
	rows.sort_custom(func(a, b): return a[0] > b[0])
	print("PERF --- 스크립트별 비용 순위 (끄면 줄어드는 ms/프레임, 노드 수) ---")
	for r in rows:
		print("PERF %7.3f ms  %-28s x%d" % [r[0], r[1], r[2]])
