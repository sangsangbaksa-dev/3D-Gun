extends Node
## Wave clear reward panel (web src/ui/waveClearFlash.ts). Shows gold, core/structure heal, next-boss hint.

const HudStyle := preload("res://scripts/hud_style.gd")

var game: Node
var layer: CanvasLayer
var root: Control
var panel: PanelContainer
var title: Label
var sub: Label
var timer := 0.0
var _tw: Tween

static func apply(g: Node) -> Node:
	var s = (load("res://scripts/wave_clear_flash.gd") as GDScript).new()
	s.game = g
	s.name = "WaveClearFlash"
	g.add_child(s)
	return s

func _ready() -> void:
	layer = CanvasLayer.new()
	layer.layer = 2
	add_child(layer)
	root = Control.new()
	root.set_anchors_preset(Control.PRESET_FULL_RECT)
	root.mouse_filter = Control.MOUSE_FILTER_IGNORE
	root.visible = false
	layer.add_child(root)
	panel = PanelContainer.new()
	panel.mouse_filter = Control.MOUSE_FILTER_IGNORE
	panel.add_theme_stylebox_override("panel", HudStyle.box(Color8(0x12, 0x1a, 0x20, 0xe8), Color8(0x2e, 0xe6, 0xd6, 0.4), 10, 1, Vector4(24, 10, 24, 12)))
	var col := VBoxContainer.new()
	col.add_theme_constant_override("separation", 4)
	col.mouse_filter = Control.MOUSE_FILTER_IGNORE
	panel.add_child(col)
	title = Label.new()
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	title.add_theme_font_size_override("font_size", 26)
	title.add_theme_color_override("font_color", HudStyle.TEAL)
	title.add_theme_color_override("font_shadow_color", Color(0, 0, 0, 0.85))
	title.add_theme_constant_override("shadow_offset_y", 2)
	col.add_child(title)
	sub = Label.new()
	sub.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	sub.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	sub.add_theme_font_size_override("font_size", 13)
	sub.add_theme_color_override("font_color", Color(0.9, 0.95, 0.94, 0.8))
	col.add_child(sub)
	root.add_child(panel)
	I18n.locale_changed.connect(_refresh_copy)

func show_wave(w: int) -> void:
	var gold := int(GameData.enemy_rules.waveClearGold) + w * 2
	var core_pct := int(round(GameData.enemy_rules.waveClearCorePct * 100.0))
	var struct_pct := int(round(GameData.enemy_rules.waveClearStructPct * 100.0))
	title.text = I18n.t("waveClear.title", {"n": w})
	var heal := I18n.t("waveClear.heal", {"corePct": core_pct, "structPct": struct_pct})
	var extra := ""
	if GameData.is_boss_wave(w + 1) and w + 1 <= GameData.final_wave:
		extra = I18n.t("waveClear.nextBoss")
	sub.text = I18n.t("waveClear.rewards", {"gold": gold, "heal": heal}) + extra
	_play()

func _refresh_copy() -> void:
	if not root.visible or timer <= 0.0:
		return
	show_wave(game.wave)

func _play() -> void:
	if _tw:
		_tw.kill()
	root.visible = true
	root.modulate.a = 0.0
	panel.scale = Vector2(0.94, 0.94)
	panel.pivot_offset = panel.size * 0.5
	timer = 2.4
	_tw = create_tween()
	_tw.tween_property(root, "modulate:a", 1.0, 0.32).set_trans(Tween.TRANS_CUBIC).set_ease(Tween.EASE_OUT)
	_tw.parallel().tween_property(panel, "scale", Vector2.ONE, 0.32).set_trans(Tween.TRANS_CUBIC).set_ease(Tween.EASE_OUT)

func _process(dt: float) -> void:
	if timer <= 0.0:
		return
	timer -= dt
	if game and game.hud:
		panel.position = Vector2((game.hud.size.x - panel.size.x) * 0.5, game.hud.size.y * 0.17)
	if timer <= 0.0:
		if _tw:
			_tw.kill()
		_tw = create_tween()
		_tw.tween_property(root, "modulate:a", 0.0, 0.35)
		_tw.tween_callback(func(): root.visible = false)
