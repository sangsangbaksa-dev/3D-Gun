extends SceneTree
## 채집 장면 스크린샷 (웹 빌드용): 종류별로 스윙을 고정해 두고 "SHOT 이름" 을 찍는다. 마지막에 완료 직후(아이콘이 날아가는 중) 장면.
## 웹 빌드: --export-release WebShots 후 인자 "-s res://tests/gather_shots.gd" 로 실행 (tools/godot-shots.mjs 의 스크립트 경로만 바꿈).
var game: Node
var frames := 0
var idx := 0
var wait := 0
var cur = null
## [이름, 종류, 스윙 위상(주기 중), 진행도]
var shots := [
	["g_tree_wind", "tree", 0.42, 0.45],
	["g_tree_hit", "tree", 0.6, 0.5],
	["g_rock_hit", "rock", 0.62, 0.5],
	["g_herb", "herb", 0.55, 0.4],
	["g_wreck", "wreck", 0.5, 0.4],
	["g_done", "tree", 0.0, 0.0],
]
var phase_wait := 0

func _initialize() -> void:
	game = load("res://scenes/game.tscn").instantiate()
	root.add_child(game)
	game.ready.connect(func(): game.roamers.enabled = false)

func _find(kind: String) -> Dictionary:
	var ps: Dictionary = game.get_node("/root/GameData").map.playerStart
	var best := {}
	var bd := INF
	for n in game.gathering.nodes:
		if n.kind != kind:
			continue
		var d := Vector2(n.pos.x - float(ps.x), n.pos.z - float(ps.z)).length()
		if d < bd:
			bd = d
			best = n
	return best

func _process(_dt: float) -> bool:
	frames += 1
	if frames < 10:
		return false
	if idx >= shots.size():
		return true
	var s: Array = shots[idx]
	var g = game.gathering
	var p: CharacterBody3D = game.player
	if cur == null:
		cur = _find(s[1])
		g.reset()
		var dir := Vector3(1, 0, 0)
		p.position = cur.pos + dir * (float(cur.r) + 1.1)
		p.position.y = game.world.ground_y(p.position.x, p.position.z) + 0.3
		p.rotation.y = atan2(dir.x, dir.z)
		p.camera.rotation.x = deg_to_rad(-12.0)
		wait = 0
	wait += 1
	if s[0] == "g_done":
		if wait == 1:
			g.swing = 0.0
			cur.progress = 0.995
		if wait < 4:
			g.harvest(cur, 0.1) # 완료 → 자원 아이콘이 날아간다
		if wait == 30:
			print("SHOT ", s[0])
		if wait > 150:
			idx += 1
			cur = null
		return false
	g.swing = float(s[2])
	cur.progress = float(s[3])
	cur.idle = 0.0
	g.harvest(cur, 0.00001)
	g.swing = float(s[2]) # harvest 가 조금 더했으므로 되돌려 고정
	cur.progress = float(s[3])
	if wait == 40:
		print("SHOT ", s[0])
	if wait > 160:
		idx += 1
		cur = null
	return false
