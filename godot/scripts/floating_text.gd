extends Node
## 데미지 숫자: 맞은 좀비의 머리 위에서 화면으로 투영된 라벨이 위로 떠오르며 사라진다.
## 일반 = 흰색, 헤드샷 = 노랑 + 크게, 처치 = 주황빛 빨강 + 더 크게 + 튕김. 라벨은 풀에서 재사용한다.
## 호출: FloatingText.apply(game) 로 붙이고, 피해가 생길 때 spawn(월드 위치, 수치, 종류).
## 카메라 뒤쪽은 그리지 않는다.

const MAX_LIVE := 36
const LIFE := {"normal": 0.7, "head": 0.85, "kill": 1.0}

var game: Node
var hud: Control
var _live: Array = []   # {label, pos, age, life, kind, dx, st}
var _pool: Array = []

static func apply(g: Node) -> Node:
	var s = (load("res://scripts/floating_text.gd") as GDScript).new()
	s.game = g
	s.name = "FloatingText"
	g.add_child(s)
	return s

func _ready() -> void:
	hud = game.hud

## 종류별 모양. 큰 피해일수록 글자가 조금 커진다.
static func style_for(kind: String, amount: float) -> Dictionary:
	var grow := clampf(amount / 120.0, 0.0, 1.0) * 8.0
	match kind:
		"kill":
			return {"size": 30.0 + grow, "col": Color8(0xff, 0x5a, 0x2a), "outline": Color(0.25, 0.0, 0.0, 0.95), "rise": 70.0, "pop": 1.5}
		"head":
			return {"size": 26.0 + grow, "col": Color8(0xff, 0xdc, 0x3a), "outline": Color(0.3, 0.18, 0.0, 0.95), "rise": 60.0, "pop": 1.35}
	return {"size": 19.0 + grow, "col": Color(1, 1, 1), "outline": Color(0, 0, 0, 0.85), "rise": 46.0, "pop": 1.15}

func spawn(pos: Vector3, amount: float, kind := "normal") -> void:
	if hud == null or amount < 0.5:
		return
	if _live.size() >= MAX_LIVE:
		_release(_live.pop_front())
	var st := style_for(kind, amount)
	var l: Label = _pool.pop_back() if not _pool.is_empty() else _new_label()
	l.text = str(int(round(amount)))
	l.add_theme_font_size_override("font_size", int(st.size))
	l.add_theme_color_override("font_color", st.col)
	l.add_theme_color_override("font_outline_color", st.outline)
	l.visible = false
	hud.add_child(l)
	_live.append({"label": l, "pos": pos, "age": 0.0, "life": LIFE[kind], "kind": kind, "dx": randf_range(-26.0, 26.0), "st": st})

func _new_label() -> Label:
	var l := Label.new()
	l.mouse_filter = Control.MOUSE_FILTER_IGNORE
	l.add_theme_constant_override("outline_size", 6)
	l.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	l.size = Vector2(120, 40)
	l.pivot_offset = Vector2(60, 20)
	return l

func _release(e: Dictionary) -> void:
	var l: Label = e.label
	if l.get_parent():
		l.get_parent().remove_child(l)
	_pool.append(l)

func _process(dt: float) -> void:
	var cam: Camera3D = game.player.camera if game.get("player") != null else null
	var i := _live.size() - 1
	while i >= 0:
		var e: Dictionary = _live[i]
		e.age += dt
		var l: Label = e.label
		if e.age >= e.life or cam == null:
			_release(e)
			_live.remove_at(i)
			i -= 1
			continue
		var k: float = e.age / e.life
		var wp: Vector3 = e.pos
		if cam.is_position_behind(wp):
			l.visible = false
		else:
			var sp := cam.unproject_position(wp)
			var up: float = e.st.rise * (1.0 - pow(1.0 - minf(k * 1.4, 1.0), 2.0)) # 빠르게 솟았다 느려짐
			l.position = sp + Vector2(e.dx * minf(k * 2.0, 1.0) - l.size.x * 0.5, -up - l.size.y * 0.5)
			l.visible = true
			# 등장 때 크게 튕겼다가 1 로, 뒤쪽 40% 에서 페이드
			var pop: float = e.st.pop
			var s := 1.0 + (pop - 1.0) * clampf(1.0 - k * 6.0, 0.0, 1.0)
			l.scale = Vector2(s, s)
			l.modulate.a = 1.0 - clampf((k - 0.6) / 0.4, 0.0, 1.0)
		i -= 1
