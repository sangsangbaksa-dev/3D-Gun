extends Node3D
## 1인칭 채집 도구 뷰모델: 나무=도끼, 바위·철광=곡괭이, 약초=맨손, 폐차=렌치. 박스 프리미티브로 만들고,
## gathering.gd 의 스윙 위상(swing)에 맞춰 절차적으로 휘두른다. 채집 중에는 player.tool_active 로 총을 내린다.
## 카메라의 자식. gathering.gd 가 처음 채집할 때 만든다.

const FxScript := preload("res://scripts/gather_fx.gd")
var game: Node
var gathering: Node
var _t := 0.0          # 0=내려 둠, 1=들어 올림
var _kind := ""
var _tools := {}       # kind -> {root, pivot, extra}
var _kick := 0.0       # 타격 반동 (hit 시그널로 1, 감쇠)
var pose := {"pos": Vector3.ZERO, "rot": Vector3.ZERO} # 테스트용: 현재 도구 자세

func _ready() -> void:
	position = Vector3(0.30, -0.30, -0.62)
	for k in ["tree", "rock", "iron", "herb", "wreck"]:
		_build(k)
	for k in _tools:
		_tools[k].root.visible = false
	gathering.hit.connect(func(_n): _kick = 1.0)

func _box(parent: Node3D, size: Vector3, pos: Vector3, col: Color, metal := 0.0) -> MeshInstance3D:
	var m := MeshInstance3D.new()
	var b := BoxMesh.new()
	b.size = size
	m.mesh = b
	var mat := StandardMaterial3D.new()
	mat.albedo_color = col
	mat.roughness = 0.75 - metal * 0.4
	mat.metallic = metal
	m.material_override = mat
	m.position = pos
	m.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	parent.add_child(m)
	return m

func _build(kind: String) -> void:
	var root := Node3D.new()
	add_child(root)
	var pivot := Node3D.new() # 손 위치. 손잡이는 +Y 로 뻗는다
	root.add_child(pivot)
	var wood := Color(0.5, 0.33, 0.17)
	var steel := Color(0.62, 0.66, 0.7)
	var skin := Color(0.85, 0.66, 0.52)
	var extra := []
	match kind:
		"tree": # 도끼: 자루 + 도끼날(앞쪽 -Z)
			_box(pivot, Vector3(0.045, 0.62, 0.045), Vector3(0, 0.2, 0), wood)
			_box(pivot, Vector3(0.05, 0.16, 0.05), Vector3(0, -0.08, 0), Color(0.3, 0.2, 0.1))
			_box(pivot, Vector3(0.05, 0.17, 0.07), Vector3(0, 0.46, -0.03), Color(0.35, 0.37, 0.4), 0.6)
			_box(pivot, Vector3(0.025, 0.2, 0.1), Vector3(0, 0.47, -0.11), steel, 0.8)
		"rock", "iron": # 곡괭이: 자루 + 가로 날 (양끝이 뾰족)
			var head := Color(0.5, 0.52, 0.56) if kind == "rock" else Color(0.45, 0.65, 0.9)
			_box(pivot, Vector3(0.045, 0.68, 0.045), Vector3(0, 0.2, 0), wood)
			_box(pivot, Vector3(0.05, 0.16, 0.05), Vector3(0, -0.1, 0), Color(0.3, 0.2, 0.1))
			_box(pivot, Vector3(0.3, 0.05, 0.05), Vector3(0, 0.54, 0), head, 0.7)
			_box(pivot, Vector3(0.07, 0.04, 0.04), Vector3(0.18, 0.51, 0), steel, 0.8).rotation.z = -0.5
			_box(pivot, Vector3(0.07, 0.04, 0.04), Vector3(-0.18, 0.51, 0), steel, 0.8).rotation.z = 0.5
		"herb": # 손: 손바닥 + 손가락 세 개 (집게처럼 모은다)
			_box(pivot, Vector3(0.09, 0.05, 0.11), Vector3(0, 0, 0), skin)
			_box(pivot, Vector3(0.1, 0.06, 0.16), Vector3(0, -0.02, 0.14), Color(0.35, 0.4, 0.3)) # 소매
			for i in 3:
				var f := Node3D.new()
				f.position = Vector3(-0.03 + 0.03 * i, 0.0, -0.05)
				pivot.add_child(f)
				_box(f, Vector3(0.022, 0.025, 0.08), Vector3(0, 0, -0.04), skin)
				extra.append(f)
			_box(pivot, Vector3(0.1, 0.03, 0.03), Vector3(0, 0.02, -0.04), Color(0.4, 0.85, 0.35)) # 쥔 풀
		_: # 렌치
			_box(pivot, Vector3(0.05, 0.5, 0.035), Vector3(0, 0.15, 0), Color(0.75, 0.2, 0.15), 0.3)
			_box(pivot, Vector3(0.15, 0.06, 0.035), Vector3(0, 0.44, 0), steel, 0.8)
			_box(pivot, Vector3(0.04, 0.09, 0.035), Vector3(0.055, 0.5, 0), steel, 0.8)
			_box(pivot, Vector3(0.04, 0.09, 0.035), Vector3(-0.055, 0.5, 0), steel, 0.8)
	_tools[kind] = {"root": root, "pivot": pivot, "extra": extra}

static func _ease_in(x: float) -> float:
	return x * x * x
static func _ease_out(x: float) -> float:
	return 1.0 - pow(1.0 - x, 3.0)

## 스윙 위상 ph(0~1) 에서의 도구 자세. pos=위치 오프셋, rot=회전(rad: x=앞뒤 기울기, y=좌우, z=롤)
## 들어올림(0~windup) → 내리침(windup~impact, 가속) → 되돌림(impact~1). 타격 순간이 impact.
static func swing_pose(kind: String, ph: float) -> Dictionary:
	var K: Dictionary = FxScript.KIND[kind]
	var wind: float = K.windup
	var imp: float = K.impact
	# a: 0=쉬는 자세, 1=가장 치켜든 자세, -1=타격 끝
	var a := 0.0
	if ph < wind:
		a = _ease_out(ph / wind)
	elif ph < imp:
		a = 1.0 - 2.0 * _ease_in((ph - wind) / (imp - wind))
	else:
		a = -1.0 + _ease_out((ph - imp) / (1.0 - imp))
	var up := maxf(a, 0.0)
	var down := maxf(-a, 0.0)
	var pos := Vector3.ZERO
	var rot := Vector3.ZERO
	match kind:
		"tree": # 오른쪽 위에서 비스듬히 내려치는 도끼
			rot = Vector3(deg_to_rad(-10.0 + 75.0 * a), deg_to_rad(8.0 * a), deg_to_rad(-25.0 - 20.0 * a))
			pos = Vector3(-0.04 * a, 0.08 * up, 0.1 * up - 0.12 * down)
		"rock", "iron": # 머리 위에서 곧게 내려찍는 곡괭이
			rot = Vector3(deg_to_rad(-5.0 + 85.0 * a), 0.0, deg_to_rad(-6.0))
			pos = Vector3(-0.06 * a, 0.14 * up, 0.12 * up - 0.16 * down)
		"herb": # 손을 내밀어 풀을 쥐고(앞·아래) 뽑듯 끌어올린다
			var grab := clampf(1.0 - absf(a + 0.2) * 2.0, 0.0, 1.0)
			rot = Vector3(deg_to_rad(-70.0 - 20.0 * a), 0.0, 0.0)
			pos = Vector3(-0.1, -0.05 - 0.1 * down + 0.1 * up, -0.1 * (1.0 + a) + 0.06 * grab)
		_: # 렌치: 앞으로 뻗어 볼트에 걸고 돌린다
			rot = Vector3(deg_to_rad(-40.0 + 30.0 * a), 0.0, deg_to_rad(-20.0 + 70.0 * a))
			pos = Vector3(-0.05 * a, 0.04 * up, -0.1 + 0.05 * up)
	return {"pos": pos, "rot": rot}

func _process(dt: float) -> void:
	var active: bool = gathering.is_gathering()
	if active:
		var k: String = gathering.current.kind
		if k != _kind:
			if _kind != "":
				_tools[_kind].root.visible = false
			_kind = k
			_tools[k].root.visible = true
	_t = move_toward(_t, 1.0 if active else 0.0, dt * (5.0 if active else 4.0))
	if game.player:
		game.player.tool_active = _t > 0.03
	_kick = maxf(0.0, _kick - dt * 7.0)
	if _kind == "":
		return
	var tool: Dictionary = _tools[_kind]
	tool.root.visible = _t > 0.01
	var e := _ease_out(_t)
	var ph: float = fposmod(gathering.swing, 1.0) if active else 0.0
	pose = swing_pose(_kind, ph)
	# 장착/해제: 아래에서 올라오고 내려간다. 타격 반동은 도구를 뒤로 튕긴다.
	tool.root.position = Vector3(0, -0.45 * (1.0 - e), 0.1 * (1.0 - e) + 0.03 * _kick)
	var piv: Node3D = tool.pivot
	piv.position = pose.pos
	piv.rotation = pose.rot + Vector3(-0.35 * (1.0 - e), 0, 0)
	if _kind == "herb": # 손가락: 쥐기
		var curl := clampf(1.0 - absf(ph - 0.55) * 4.0, 0.0, 1.0)
		for i in tool.extra.size():
			tool.extra[i].rotation.x = -curl * 0.8 + 0.1 * i
