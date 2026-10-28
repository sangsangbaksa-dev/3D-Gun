extends Node
## 핵 위치 화살표 + 핵 피격 자동 알림 (HUD). 규칙은 core_alert.gd, 여기는 그리기와 소리만.
## - 핵이 화면 밖이면 화면 가장자리에서 핵 쪽으로 도는 화살표와 거리(m), 화면 안이면 핵 위 마커로 바뀐다.
## - 멀수록 흐리고, 핵 체력이 낮을수록 청록 → 주황 → 빨강.
## - 핵이 공격받으면 상단 경고 배너, 경보음(쿨다운), 화살표 붉은 점멸, 화면 가장자리 붉은 테두리.
##   체력 50%·25% 를 처음 지날 때는 한 줄 더 강조하고, 마지막 피격 4초 뒤 알림을 거둔다.
## game.gd 는 add_child 한 줄만 한다 (CorePointer.apply(self)).

const Alert := preload("res://scripts/core_alert.gd")

const RED := Color8(0xe0, 0x30, 0x3a)
const MARGIN := 46.0

const STRINGS := {
	"en": {
		"attack": "The core is under attack!", "lane": "{lane} lane",
		"half": "Core at 50%!", "quarter": "Core at 25% — critical!",
	},
	"ko": {
		"attack": "핵이 공격받고 있습니다!", "lane": "{lane} 레인",
		"half": "핵 체력 50%!", "quarter": "핵 체력 25% — 위험!",
	},
}
const LANE_NAMES := {
	"en": {"N": "North", "E": "East", "S": "South", "W": "West", "NE": "Northeast", "SW": "Southwest"},
	"ko": {"N": "북쪽", "E": "동쪽", "S": "남쪽", "W": "서쪽", "NE": "북동쪽", "SW": "남서쪽"},
}

var game: Node
var alert := Alert.new()
var layer: CanvasLayer
var canvas: Control
var banner: Label
var sub: Label
var alarms := 0          # 울린 경보음 수 (테스트용)
var events_seen: Array = []
var shown := false       # 화살표/마커가 그려지는 중
var on_screen := false   # 마커 모드 (핵이 화면 안)
var arrow_pos := Vector2.ZERO
var arrow_angle := 0.0
var arrow_alpha := 1.0
var dist := 0.0
var _emph_text := ""

static func apply(g: Node) -> Node:
	var s = (load("res://scripts/core_pointer.gd") as GDScript).new()
	s.game = g
	s.name = "CorePointer"
	g.add_child(s)
	return s

func _ready() -> void:
	layer = CanvasLayer.new()
	layer.layer = 1
	add_child(layer)
	canvas = Control.new()
	canvas.set_anchors_preset(Control.PRESET_FULL_RECT)
	canvas.mouse_filter = Control.MOUSE_FILTER_IGNORE
	canvas.draw.connect(_draw_pointer)
	layer.add_child(canvas)
	banner = _make_label(24, 0.0)
	sub = _make_label(15, 40.0)
	banner.visible = false
	sub.visible = false
	game.core.damaged.connect(func(hp: float): _on_hp(hp))
	I18n.locale_changed.connect(_refresh_texts)

func _make_label(font_size: int, y: float) -> Label:
	var l := Label.new()
	l.anchor_left = 0.5
	l.anchor_right = 0.5
	l.grow_horizontal = Control.GROW_DIRECTION_BOTH
	l.position.y = 104.0 + y
	l.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	l.mouse_filter = Control.MOUSE_FILTER_IGNORE
	l.add_theme_font_size_override("font_size", font_size)
	l.add_theme_color_override("font_color", Color(1, 0.92, 0.9))
	l.add_theme_color_override("font_shadow_color", Color(0, 0, 0, 0.85))
	l.add_theme_constant_override("shadow_offset_x", 2)
	l.add_theme_constant_override("shadow_offset_y", 2)
	var sb := StyleBoxFlat.new()
	sb.bg_color = Color(0.35, 0.05, 0.07, 0.82) if y == 0.0 else Color(0.07, 0.1, 0.12, 0.8)
	sb.border_color = RED
	sb.set_border_width_all(1)
	sb.set_corner_radius_all(8)
	sb.content_margin_left = 18
	sb.content_margin_right = 18
	sb.content_margin_top = 6
	sb.content_margin_bottom = 6
	l.add_theme_stylebox_override("normal", sb)
	canvas.add_child(l)
	return l

func _tr(key: String) -> String:
	return STRINGS[I18n.locale][key]

func _lane_name(i: int) -> String:
	var lanes: Array = GameData.map.lanes
	if i < 0 or i >= lanes.size():
		return ""
	var id := str(lanes[i].id)
	return LANE_NAMES[I18n.locale].get(id, id)

## 핵을 치고 있는 좀비의 레인 (핵에서 가장 가까운 살아 있는 좀비).
func _attacker_lane() -> int:
	var best := -1
	var best_d := game.core.radius + 7.0
	var c: Vector3 = game.core.global_position
	for z in game.zombies_root.get_children():
		if z.dead:
			continue
		var d := Vector2(z.global_position.x - c.x, z.global_position.z - c.z).length()
		if d < best_d:
			best_d = d
			best = z.lane
	return best

func _on_hp(hp: float) -> void:
	var ev: Array = alert.on_hp(hp, game.core.max_hp)
	if ev.is_empty():
		return
	events_seen.append_array(ev)
	if "hit" in ev:
		var ln := _attacker_lane()
		if ln >= 0:
			alert.lane = ln
	if "half" in ev:
		_emph_text = _tr("half")
	elif "quarter" in ev:
		_emph_text = _tr("quarter")
	if "alarm" in ev:
		alarms += 1
		Sfx.play("coreAlarm")
	_refresh_texts()

func _refresh_texts() -> void:
	if banner == null:
		return
	var t := "⚠ " + _tr("attack")
	var ln := _lane_name(alert.lane)
	if ln != "":
		t += "  ·  " + _tr("lane").replace("{lane}", ln)
	banner.text = t
	sub.text = _emph_text if alert.emphasis > 0.0 else ""

func _process(dt: float) -> void:
	step(dt)

func step(dt: float) -> void:
	if game.core == null:
		return
	_on_hp(game.core.hp) # 회복과 최대 체력 변화도 따라간다 (줄지 않았으면 아무 일 없음)
	if alert.update(dt):
		_emph_text = ""
	var live: bool = not game.core_dead and game.phase != "ended" and not game.player.dead and not get_tree().paused
	var pu: float = alert.pulse() if live else 0.0
	banner.visible = live and alert.active
	sub.visible = banner.visible and alert.emphasis > 0.0
	if sub.visible:
		sub.text = _emph_text
	if banner.visible:
		banner.modulate = Color(1, 1, 1, 0.65 + 0.35 * pu)
		banner.add_theme_color_override("font_color", Color(1, 0.92, 0.9).lerp(Color(1, 0.35, 0.3), pu))
	_aim(live)
	canvas.queue_redraw()

## 화살표/마커 위치 계산 (그리기와 테스트가 같이 쓴다).
func _aim(live: bool) -> void:
	shown = false
	if not live:
		return
	var cam := get_viewport().get_camera_3d()
	if cam == null:
		return
	var size: Vector2 = canvas.size
	var target: Vector3 = game.core.global_position + Vector3(0, float(GameData.core.height) + 0.8, 0)
	var cp := cam.global_position
	dist = Vector2(target.x - cp.x, target.z - cp.z).length()
	arrow_alpha = Alert.distance_alpha(dist)
	var behind := cam.is_position_behind(target)
	var sp := cam.unproject_position(target)
	var inside := not behind and sp.x > MARGIN and sp.x < size.x - MARGIN and sp.y > MARGIN and sp.y < size.y - MARGIN
	on_screen = inside
	if inside:
		arrow_pos = sp
		arrow_angle = 0.0
	else:
		var f := -cam.global_transform.basis.z
		arrow_angle = Alert.bearing(cp.x, cp.z, f.x, f.z, target.x, target.z)
		arrow_pos = Alert.edge_point(arrow_angle, size.x, size.y, MARGIN)
	shown = true

func _draw_pointer() -> void:
	if not shown:
		return
	var frac: float = game.core.hp / maxf(1.0, game.core.max_hp)
	var pu: float = alert.pulse()
	var col := Alert.hp_color(frac).lerp(RED, pu * 0.85)
	col.a = clampf(arrow_alpha + pu * 0.4, 0.0, 1.0)
	var font := ThemeDB.fallback_font
	var txt := "%dm" % roundi(dist)
	var s := 1.0 + 0.3 * pu
	if alert.active:
		_draw_edge_glow(pu)
	if on_screen:
		# 핵 위 마커: 아래를 가리키는 삼각형 + 거리
		var p := arrow_pos + Vector2(0, -14.0 * s)
		var tri := PackedVector2Array([p + Vector2(-11, -12) * s, p + Vector2(11, -12) * s, p + Vector2(0, 8) * s])
		canvas.draw_colored_polygon(tri, col)
		canvas.draw_polyline(PackedVector2Array([tri[0], tri[1], tri[2], tri[0]]), Color(0, 0, 0, col.a * 0.8), 1.5)
		_text(font, txt, p + Vector2(0, -22 * s), col, 15)
		return
	# 가장자리 화살표: 핵 쪽(arrow_angle)을 가리킨다
	var dir := Vector2(sin(arrow_angle), -cos(arrow_angle))
	var side := Vector2(-dir.y, dir.x)
	var tip := arrow_pos + dir * 16.0 * s
	var base := arrow_pos - dir * 14.0 * s
	var tri2 := PackedVector2Array([tip, base + side * 16.0 * s, base - side * 16.0 * s])
	canvas.draw_colored_polygon(tri2, col)
	canvas.draw_polyline(PackedVector2Array([tri2[0], tri2[1], tri2[2], tri2[0]]), Color(0, 0, 0, col.a * 0.8), 1.5)
	# 거리 글자는 화살표 안쪽(화면 중심 쪽)에 둔다
	var label_at := arrow_pos - dir * 34.0
	_text(font, txt, label_at, col, 15)

func _text(font: Font, txt: String, center: Vector2, col: Color, fs: int) -> void:
	var w := font.get_string_size(txt, HORIZONTAL_ALIGNMENT_LEFT, -1, fs).x
	var at := center - Vector2(w * 0.5, -fs * 0.35)
	canvas.draw_string(font, at + Vector2(1.5, 1.5), txt, HORIZONTAL_ALIGNMENT_LEFT, -1, fs, Color(0, 0, 0, col.a * 0.9))
	canvas.draw_string(font, at, txt, HORIZONTAL_ALIGNMENT_LEFT, -1, fs, col)

## 경보 중 화면 테두리의 붉은 번쩍임.
func _draw_edge_glow(pu: float) -> void:
	var size: Vector2 = canvas.size
	for i in 6:
		var a := pu * 0.2 * (1.0 - float(i) / 6.0)
		var w := 6.0 * (i + 1)
		var c := Color(RED.r, RED.g, RED.b, a)
		canvas.draw_rect(Rect2(0, 0, size.x, w), c)
		canvas.draw_rect(Rect2(0, size.y - w, size.x, w), c)
		canvas.draw_rect(Rect2(0, 0, w, size.y), c)
		canvas.draw_rect(Rect2(size.x - w, 0, w, size.y), c)
