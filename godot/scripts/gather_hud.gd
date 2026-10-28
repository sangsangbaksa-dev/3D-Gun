extends Control
## 채집 HUD: 화면 중앙의 진행 링, 완료 시 자원 아이콘(코드로 그린 도형)이 상단 자원 칸으로 날아가는 연출.
## gathering.gd 가 처음 채집할 때 game.hud 아래에 만든다.

const FxScript := preload("res://scripts/gather_fx.gd")
var game: Node
var gathering: Node
var _fly: Array = [] # {res, from, to, t, delay, life, bow}
var _ring := 0.0     # 표시 중인 진행도
var _ring_a := 0.0
var _ring_col := Color.WHITE
var _flash := 0.0
var arrived := 0     # 도착한 아이콘 수 (테스트용)
var launched := 0    # 날린 아이콘 수 (테스트용)

func _ready() -> void:
	set_anchors_preset(Control.PRESET_FULL_RECT)
	mouse_filter = Control.MOUSE_FILTER_IGNORE
	gathering.gathered.connect(_on_gathered)

func _on_gathered(res: String, amount: int, pos: Vector3) -> void:
	var from := size * 0.5
	var cam: Camera3D = game.player.camera if game.player else null
	if cam and not cam.is_position_behind(pos + Vector3.UP):
		from = cam.unproject_position(pos + Vector3.UP)
	var keys: Array = GameData.res.keys
	var idx := maxi(0, keys.find(res))
	var rect: Rect2 = game.lbl_res.get_global_rect()
	var to := Vector2(rect.position.x + rect.size.x * (float(idx) + 0.5) / float(keys.size() + 1), rect.position.y + rect.size.y * 0.5)
	for i in mini(amount, 6):
		_fly.append({"res": res, "from": from + Vector2(randf_range(-18, 18), randf_range(-14, 14)), "to": to, "t": 0.0,
			"delay": 0.06 * i, "life": 0.75 + 0.05 * i, "bow": randf_range(-90.0, 90.0)})
		launched += 1
	_ring = 1.0 # 완료: 링이 가득 찬 채로 사라진다
	_ring_a = 1.0

func _process(dt: float) -> void:
	if gathering.is_gathering():
		var n: Dictionary = gathering.current
		_ring_col = FxScript.KIND[n.kind].col
		_ring = n.progress
		_ring_a = move_toward(_ring_a, 1.0, dt * 10.0)
	else:
		_ring_a = move_toward(_ring_a, 0.0, dt * 3.0)
	for f in _fly.duplicate():
		if f.delay > 0.0:
			f.delay -= dt
			continue
		f.t += dt
		if f.t >= f.life:
			_fly.erase(f)
			arrived += 1
			_flash = 1.0
	if _flash > 0.0:
		_flash = maxf(0.0, _flash - dt * 4.0)
		game.lbl_res.modulate = Color(1, 1, 1).lerp(Color(1.5, 1.4, 0.9), _flash)
	if _ring_a > 0.01 or not _fly.is_empty():
		queue_redraw()

func _draw() -> void:
	if _ring_a > 0.01:
		var c := size * 0.5
		var r := 34.0
		draw_arc(c, r, 0.0, TAU, 48, Color(0, 0, 0, 0.45 * _ring_a), 7.0, true)
		if _ring > 0.005:
			draw_arc(c, r, -PI * 0.5, -PI * 0.5 + TAU * clampf(_ring, 0.0, 1.0), 48, Color(_ring_col, 0.9 * _ring_a), 5.0, true)
		draw_circle(c, 2.5, Color(1, 1, 1, 0.6 * _ring_a))
	for f in _fly:
		if f.delay > 0.0:
			continue
		var k: float = clampf(f.t / f.life, 0.0, 1.0)
		var e := k * k * (3.0 - 2.0 * k)
		var mid: Vector2 = (f.from + f.to) * 0.5 + Vector2(f.bow, -70.0)
		var p: Vector2 = f.from.lerp(mid, e).lerp(mid.lerp(f.to, e), e) # 2차 베지에
		var s := (1.0 + 0.35 * sin(k * PI)) * (1.0 - 0.45 * k)
		draw_icon(f.res, p, 14.0 * s, 1.0 - maxf(0.0, k - 0.85) * 5.0)

## 자원 아이콘을 코드로 그린다. 중심 p, 반지름 r.
func draw_icon(res: String, p: Vector2, r: float, a: float) -> void:
	var edge := Color(0, 0, 0, 0.7 * a)
	match res:
		"wood": # 통나무: 갈색 몸통 + 나이테 단면
			draw_rect(Rect2(p - Vector2(r, r * 0.6), Vector2(r * 2, r * 1.2)), Color(0.55, 0.36, 0.18, a))
			draw_circle(p + Vector2(r, 0), r * 0.6, Color(0.82, 0.62, 0.36, a))
			draw_arc(p + Vector2(r, 0), r * 0.32, 0, TAU, 16, Color(0.5, 0.33, 0.16, a), 1.5)
		"stone":
			var pts := PackedVector2Array([p + Vector2(-r, r * 0.5), p + Vector2(-r * 0.6, -r * 0.7), p + Vector2(r * 0.3, -r), p + Vector2(r, -r * 0.1), p + Vector2(r * 0.7, r * 0.7)])
			draw_colored_polygon(pts, Color(0.68, 0.7, 0.74, a))
			draw_polyline(pts + PackedVector2Array([pts[0]]), edge, 1.5)
		"iron": # 주괴
			var q := PackedVector2Array([p + Vector2(-r, r * 0.5), p + Vector2(-r * 0.6, -r * 0.5), p + Vector2(r * 0.6, -r * 0.5), p + Vector2(r, r * 0.5)])
			draw_colored_polygon(q, Color(0.5, 0.72, 1.0, a))
			draw_line(p + Vector2(-r * 0.5, -r * 0.2), p + Vector2(r * 0.3, -r * 0.2), Color(1, 1, 1, 0.7 * a), 2.0)
			draw_polyline(q + PackedVector2Array([q[0]]), edge, 1.5)
		"herb": # 잎
			var leaf := PackedVector2Array([p + Vector2(0, r), p + Vector2(-r * 0.8, -r * 0.1), p + Vector2(-r * 0.2, -r), p + Vector2(r * 0.7, -r * 0.5), p + Vector2(r * 0.7, r * 0.2)])
			draw_colored_polygon(leaf, Color(0.4, 0.88, 0.38, a))
			draw_line(p + Vector2(0, r), p + Vector2(0.1 * r, -r * 0.6), Color(0.15, 0.45, 0.15, a), 1.8)
		_: # parts: 톱니바퀴
			for i in 8:
				var ang := TAU * i / 8.0
				draw_circle(p + Vector2(cos(ang), sin(ang)) * r * 0.85, r * 0.22, Color(1.0, 0.72, 0.3, a))
			draw_circle(p, r * 0.7, Color(1.0, 0.72, 0.3, a))
			draw_circle(p, r * 0.28, Color(0.15, 0.12, 0.1, a))
