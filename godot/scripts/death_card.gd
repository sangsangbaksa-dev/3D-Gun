extends CanvasLayer
## Death / core destroyed scene (src/ui/deathScreen.ts): slow motion, the screen drains and turns red with a heartbeat,
## the big title drops in, then the record card slides up and its numbers count up. Any key or click skips to the card.
## Created by game.gd when the sortie ends; `report` is what Save.bank_game returned (the numbers match the headquarters).

const UiKit := preload("res://scripts/ui_kit.gd")
const Skills := preload("res://scripts/skills.gd")
const RED := Color8(0xe0, 0x30, 0x3a)

const SLOW_SCALE := 0.2 # 슬로모션 속도
const SLOW_HOLD := 1.1 # 슬로모션이 이어지는 실제 시간(초)
const SKIP_GUARD := 0.5 # 이 시간이 지나야 키·클릭으로 넘길 수 있다 (쏘던 클릭이 바로 넘기지 않게)

const SHADER := """
shader_type canvas_item;
uniform sampler2D screen : hint_screen_texture, filter_linear_mipmap;
uniform float k : hint_range(0.0, 1.0) = 0.0;
uniform float pulse : hint_range(0.0, 1.0) = 0.0;
void fragment() {
	vec3 c = textureLod(screen, SCREEN_UV, 0.0).rgb;
	float g = dot(c, vec3(0.299, 0.587, 0.114));
	vec3 d = mix(c, vec3(g), 0.7 * k);
	d *= mix(vec3(1.0), vec3(1.0, 0.55, 0.55), k);
	float v = smoothstep(0.25, 0.85, length(UV - 0.5) * 1.25);
	d = mix(d, vec3(0.38, 0.0, 0.04), v * (0.55 * k + 0.45 * pulse));
	d *= 1.0 - 0.28 * k;
	COLOR = vec4(d, 1.0);
}
"""

const TEXT := {
	"en": {"title": "You fell", "coreTitle": "Core destroyed", "sub": "Reached wave {w}", "results": "RESULTS", "best": "NEW BEST", "wave": "Reached wave", "kills": "Kills",
		"level": "Sortie level", "gold": "Gold kept", "recovery": "{p}% recovery", "waveBonus": "Wave & kill bonus", "sp": "Skill points", "hub": "Headquarters (Enter)",
		"back": "Back to title", "skip": "Any key or click to continue"},
	"ko": {"title": "쓰러졌습니다", "coreTitle": "핵이 파괴됐습니다", "sub": "도달 웨이브 {w}", "results": "기록", "best": "최고 기록", "wave": "도달 웨이브", "kills": "처치",
		"level": "출격 레벨", "gold": "지켜낸 골드", "recovery": "회수 {p}%", "waveBonus": "웨이브·처치 보너스", "sp": "스킬 포인트", "hub": "본부로 (Enter)",
		"back": "타이틀로", "skip": "아무 키나 클릭으로 넘기기"},
}

var game: Node
var report: Dictionary = {}
var reason := "player"

## 시험·점검용 상태: 슬로모션이 끝나 카드가 떴는지, 숫자 줄이 몇 개인지
var card_shown := false
var title_shown := false
var slowed := false
var rows: Array = []
var number_labels: Array = []

var _fx: ColorRect
var _mat: ShaderMaterial
var _tween: Tween
var _title: Label
var _sub: Label
var _card: Control
var _art: TextureRect
var _hub_btn: Button
var _age := 0.0
var _beat := 0.0
var _skipped := false

func _tx(key: String, args := {}) -> String:
	var s: String = TEXT[I18n.locale].get(key, TEXT.en.get(key, key))
	for k in args:
		s = s.replace("{%s}" % k, str(args[k]))
	return s

func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	layer = 5
	name = "DeathCard"
	_build()
	_play()

func _exit_tree() -> void:
	Engine.time_scale = 1.0 # 장면을 바꿀 때 슬로모션이 남지 않게

func _build() -> void:
	# 화면이 바래며 붉어지는 층 (셰이더가 화면을 읽는다)
	var sh := Shader.new()
	sh.code = SHADER
	_mat = ShaderMaterial.new()
	_mat.shader = sh
	_mat.set_shader_parameter("k", 0.0)
	_mat.set_shader_parameter("pulse", 0.0)
	_fx = ColorRect.new()
	_fx.material = _mat
	_fx.set_anchors_preset(Control.PRESET_FULL_RECT)
	_fx.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(_fx)
	_art = TextureRect.new()
	_art.texture = load("res://assets/art/death.webp")
	_art.set_anchors_preset(Control.PRESET_FULL_RECT)
	_art.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	_art.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_COVERED
	_art.modulate = Color(1, 1, 1, 0)
	_art.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(_art)
	var shade := ColorRect.new()
	shade.color = Color(0.02, 0, 0, 0.0)
	shade.set_anchors_preset(Control.PRESET_FULL_RECT)
	shade.mouse_filter = Control.MOUSE_FILTER_IGNORE
	shade.name = "Shade"
	add_child(shade)
	var center := CenterContainer.new()
	center.set_anchors_preset(Control.PRESET_FULL_RECT)
	center.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(center)
	var col := VBoxContainer.new()
	col.alignment = BoxContainer.ALIGNMENT_CENTER
	col.add_theme_constant_override("separation", 14)
	col.mouse_filter = Control.MOUSE_FILTER_IGNORE
	center.add_child(col)
	_title = Label.new()
	_title.text = _tx("coreTitle" if reason == "core" else "title")
	_title.add_theme_font_size_override("font_size", 84)
	_title.add_theme_color_override("font_color", Color8(0xff, 0x3a, 0x44))
	_title.add_theme_color_override("font_shadow_color", Color(RED, 0.6))
	_title.add_theme_constant_override("shadow_outline_size", 22)
	_title.add_theme_constant_override("shadow_offset_y", 0)
	_title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	_title.modulate.a = 0.0
	col.add_child(_title)
	_sub = UiKit.label(_tx("sub", {"w": report.get("wave", 0)}), 20, Color(UiKit.TEAL, 0.85), HORIZONTAL_ALIGNMENT_CENTER)
	_sub.modulate.a = 0.0
	col.add_child(_sub)
	_card = _build_card()
	_card.modulate.a = 0.0
	_card.visible = false
	col.add_child(_card)

func _build_card() -> Control:
	var r: Dictionary = report
	var panel := PanelContainer.new()
	var sb := UiKit.box(Color8(0x12, 0x1a, 0x20, 0xf0), Color(RED, 0.55), 14, 1, Vector4(34, 22, 34, 24))
	sb.shadow_color = Color(RED, 0.2)
	sb.shadow_size = 32
	panel.add_theme_stylebox_override("panel", sb)
	UiKit.fit_width(panel, 520)
	var box := VBoxContainer.new()
	box.add_theme_constant_override("separation", 6)
	panel.add_child(box)
	var head := HBoxContainer.new()
	box.add_child(head)
	var h := UiKit.label(_tx("results"), 14, UiKit.ORANGE)
	h.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	head.add_child(h)
	if r.get("newBest", false):
		var best := UiKit.label(_tx("best"), 13, Color("10141a"))
		best.add_theme_stylebox_override("normal", UiKit.box(UiKit.ORANGE, UiKit.ORANGE, 99, 0, Vector4(10, 2, 10, 2)))
		head.add_child(best)
	var level := Skills.run_level(game) if game != null else 0
	var keep_pct := roundi(float(r.get("keepRatio", 0.0)) * 100.0)
	var kept: Dictionary = r.get("kept", {})
	_row(box, "wave", _tx("wave"), float(r.get("wave", 0)), "", Color(UiKit.TEAL), 24)
	_row(box, "kills", _tx("kills"), float(r.get("kills", 0)), "", UiKit.TEXT, 18)
	_row(box, "level", _tx("level"), float(level), "", UiKit.TEXT, 18)
	_row(box, "gold", _tx("gold") + "  (" + _tx("recovery", {"p": keep_pct}) + ")", float(kept.get("gold", 0)), "+", Color("ffd23b"), 18)
	_row(box, "waveBonus", _tx("waveBonus"), float(r.get("waveBonus", 0)), "+", Color("ffd23b"), 18)
	_row(box, "sp", _tx("sp"), float(kept.get("skillPoints", 0)), "+", Color(0.79, 0.65, 1.0), 18)
	var extras: Array = []
	for k in kept:
		if k != "gold" and k != "skillPoints" and float(kept[k]) > 0.0:
			extras.append("%s +%d" % [I18n.res_name(k) if k in ["wood", "stone", "iron", "herb", "parts"] else ("Samples" if I18n.locale == "en" else ("샘플" if k == "samples" else "특수 샘플")), int(kept[k])])
	if not extras.is_empty():
		var ex := UiKit.label("  ·  ".join(extras), 14, Color(UiKit.TEXT, 0.8))
		ex.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
		box.add_child(ex)
	var btns := HBoxContainer.new()
	btns.alignment = BoxContainer.ALIGNMENT_CENTER
	btns.add_theme_constant_override("separation", 14)
	box.add_child(btns)
	_hub_btn = UiKit.button(_tx("hub"), Vector2(250, 52), true, 20)
	_hub_btn.pressed.connect(func(): _go("res://scenes/hub.tscn"))
	btns.add_child(_hub_btn)
	var back := UiKit.button(_tx("back"), Vector2(170, 52), false, 17)
	back.pressed.connect(func(): _go("res://scenes/title.tscn"))
	btns.add_child(back)
	return panel

func _row(parent: Control, id: String, key: String, value: float, prefix: String, col: Color, size: int) -> void:
	var row := HBoxContainer.new()
	row.modulate.a = 0.0
	parent.add_child(row)
	var k := UiKit.label(key, size - 3, Color("9aa8ba"))
	k.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	row.add_child(k)
	var v := UiKit.label(prefix + "0", size, col, HORIZONTAL_ALIGNMENT_RIGHT)
	row.add_child(v)
	rows.append(row)
	number_labels.append({"id": id, "label": v, "value": value, "prefix": prefix})

func _go(scene: String) -> void:
	Engine.time_scale = 1.0
	Loading.go(scene)

func _play() -> void:
	var tw := create_tween().set_ignore_time_scale(true)
	_tween = tw
	# 1) 슬로모션 + 화면이 바래며 붉어짐 (실제 시간 기준)
	slowed = true
	tw.tween_property(Engine, "time_scale", SLOW_SCALE, 0.25)
	tw.parallel().tween_property(_mat, "shader_parameter/k", 1.0, 1.0)
	tw.tween_callback(func(): _beat_now())
	tw.tween_interval(SLOW_HOLD)
	# 2) 시간이 돌아오고 제목이 떨어진다
	tw.tween_property(Engine, "time_scale", 1.0, 0.3)
	tw.tween_callback(_show_title)
	tw.tween_interval(1.5)
	tw.tween_callback(_show_card)

func _beat_now() -> void:
	_mat.set_shader_parameter("pulse", 1.0)
	var t := create_tween().set_ignore_time_scale(true)
	t.tween_property(_mat, "shader_parameter/pulse", 0.0, 0.7).set_trans(Tween.TRANS_EXPO).set_ease(Tween.EASE_OUT)

func _process(dt: float) -> void:
	_age += dt / maxf(Engine.time_scale, 0.05) # 실제 시간
	if not card_shown:
		_beat += dt / maxf(Engine.time_scale, 0.05)
		if _beat >= 1.2:
			_beat = 0.0
			_beat_now() # 심장 박동

func _show_title() -> void:
	if title_shown:
		return
	title_shown = true
	if game != null and game.get("hud") != null:
		game.hud.visible = false
	_title.pivot_offset = _title.get_minimum_size() * 0.5
	_title.scale = Vector2(1.35, 1.35)
	var tw := create_tween().set_ignore_time_scale(true).set_parallel(true)
	tw.tween_property(_title, "modulate:a", 1.0, 0.5)
	tw.tween_property(_title, "scale", Vector2.ONE, 0.6).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	tw.tween_property(_sub, "modulate:a", 1.0, 0.8).set_delay(0.3)

func _show_card() -> void:
	if card_shown:
		return
	_show_title()
	card_shown = true
	Engine.time_scale = 1.0
	_card.visible = true
	_card.modulate.a = 0.0
	_card.pivot_offset = _card.get_combined_minimum_size() * 0.5
	var shade: ColorRect = get_node("Shade")
	var tw := create_tween().set_ignore_time_scale(true).set_parallel(true)
	tw.tween_property(_art, "modulate:a", 0.85, 0.9)
	tw.tween_property(shade, "color:a", 0.45, 0.6)
	tw.tween_property(_card, "modulate:a", 1.0, 0.45)
	# 카드는 살짝 작게 시작해 튀어나오듯 자리를 잡는다 (컨테이너 안이라 위치 대신 크기를 쓴다)
	_card.scale = Vector2(0.88, 0.88)
	tw.tween_property(_card, "scale", Vector2.ONE, 0.5).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	# 줄이 차례로 나타나며 숫자가 올라간다
	for i in rows.size():
		var d: float = 0.35 + 0.16 * i
		var row: Control = rows[i]
		var nl: Dictionary = number_labels[i]
		tw.tween_property(row, "modulate:a", 1.0, 0.25).set_delay(d)
		var lab: Label = nl.label
		var target: float = nl.value
		var prefix: String = nl.prefix
		var count := create_tween().set_ignore_time_scale(true)
		count.tween_interval(d)
		count.tween_method(func(v: float): lab.text = prefix + str(roundi(v)), 0.0, target, 0.6).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
	if _hub_btn:
		_hub_btn.grab_focus()

## 키·클릭으로 연출을 건너뛰어 바로 카드를 보인다.
func skip() -> void:
	if card_shown or _skipped:
		return
	_skipped = true
	if _tween:
		_tween.kill()
	_mat.set_shader_parameter("k", 1.0)
	Engine.time_scale = 1.0
	_show_card()

func _input(event: InputEvent) -> void:
	if card_shown and _hub_btn and event is InputEventKey and event.pressed and not event.echo and event.keycode in [KEY_ENTER, KEY_KP_ENTER]:
		_go("res://scenes/hub.tscn")
		return
	if card_shown or _age < SKIP_GUARD:
		return
	if (event is InputEventKey and event.pressed and not event.echo) or (event is InputEventMouseButton and event.pressed):
		skip()
		get_viewport().set_input_as_handled()
