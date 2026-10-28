extends Control
## 2D headquarters between runs: the wallet and permanent upgrades (src/tycoon2d, data/tycoon2d.ts UPGRADES).
## Same save as the classic game, so upgrades bought in either version show up in both.
## Idle production buildings earn while this screen is open (no offline pay); the start wave of the next sortie can be bought.
## The skill tree and the wallet exchange come later. Rules live in hub_logic.gd (testable without nodes).

const MetaBonus := preload("res://scripts/meta_bonus.gd")
const HubLogic := preload("res://scripts/hub_logic.gd")
const FACILITY := "facility" # 탭 id (업그레이드 분류 5개 뒤의 여섯 번째 탭)
const EMBER := Color("ff8a2a") # 원본 ORANGE
const PANEL := Color(0.09, 0.04, 0.035, 0.88)

var data: Dictionary
var cat := "weapon"
var wallet_box: HBoxContainer
var tabs: HBoxContainer
var grid: GridContainer
var stats: Label
var title: Label
var launch: Button
var back: Button
var lang: Button
var wave_minus: Button
var wave_plus: Button
var wave_label: Label
var wave_cost: Label
var toast_label: Label
var start_wave := 1
var sig := ""
var since_ui := 0.0
var since_save := 0.0
var toast_left := 0.0

const TEXT := {
	"en": {"hub.title": "Headquarters", "hub.launch": "Deploy", "hub.back": "Title", "hub.stats": "Best wave {w} · Runs {r} · Kills {k}",
		"hub.buy": "Upgrade", "hub.max": "MAX", "hub.locked": "Needs {name} Lv{lv}", "hub.lv": "Lv {a}/{b}",
		"hub.later": "Not applied in this version yet", "cat.facility": "Facilities", "hub.perSec": "+{n}/s", "hub.income": "Income {n}/s",
		"hub.startWave": "Start wave {w} / {m}", "hub.startFree": "free", "hub.poor": "Not enough resources", "hub.unreached": "Not reached yet",
		"hub.earned": "Earn {n} {k} first",
		"cat.weapon": "Weapons", "cat.base": "Base & core", "cat.turret": "Turrets", "cat.ally": "Allies", "cat.econ": "Supply",
		"wallet.gold": "Gold", "wallet.wood": "Wood", "wallet.stone": "Stone", "wallet.iron": "Iron", "wallet.herb": "Herb",
		"wallet.parts": "Parts", "wallet.samples": "Samples", "wallet.samplesSp": "Special samples", "wallet.skillPoints": "Skill points"},
	"ko": {"hub.title": "본부", "hub.launch": "출격", "hub.back": "타이틀", "hub.stats": "최고 웨이브 {w} · 출격 {r}회 · 처치 {k}",
		"hub.buy": "강화", "hub.max": "최대", "hub.locked": "{name} Lv{lv} 필요", "hub.lv": "Lv {a}/{b}",
		"hub.later": "이 버전에는 아직 적용되지 않아요", "cat.facility": "시설", "hub.perSec": "+{n}/초", "hub.income": "수입 {n}/초",
		"hub.startWave": "시작 웨이브 {w} / {m}", "hub.startFree": "무료", "hub.poor": "재화가 부족해요", "hub.unreached": "아직 도달하지 못했어요",
		"hub.earned": "{k} {n} 누적 필요"},
}
## Upgrades whose effect this port already applies (meta_bonus.gd, allies.gd, save.gd bank_run).
const LIVE := ["startGold", "maxHp", "coreHp", "prepBonus", "startRes", "startSamples", "startSamplesSp", "turretDmgMul", "turretRangeMul", "turretRateMul", "turretAmmoMul", "turretHpMul", "trapDpsMul", "gatherSpeed", "weapon", "weaponLv", "allyCap", "allyDmgMul", "allyHpMul", "vacBonus", "keepRatio", "dmgMul", "startWave", "incomeMul"]

func _t(key: String, args := {}) -> String:
	var dt: Dictionary = data.text.get(I18n.locale, {}) if data else {}
	var s: String = dt.get(key, TEXT.get(I18n.locale, TEXT.en).get(key, TEXT.en.get(key, key)))
	for k in args:
		s = s.replace("{%s}" % k, str(args[k]))
	return s

func _ready() -> void:
	Input.mouse_mode = Input.MOUSE_MODE_VISIBLE
	data = MetaBonus.data()
	set_anchors_preset(Control.PRESET_FULL_RECT)
	var art := TextureRect.new()
	art.texture = load("res://assets/art/death.webp")
	art.set_anchors_preset(Control.PRESET_FULL_RECT)
	art.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	art.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_COVERED
	art.modulate = Color(0.45, 0.4, 0.4)
	add_child(art)
	var root := VBoxContainer.new()
	root.set_anchors_preset(Control.PRESET_FULL_RECT)
	root.offset_left = 32
	root.offset_right = -32
	root.offset_top = 22
	root.offset_bottom = -22
	root.add_theme_constant_override("separation", 14)
	add_child(root)
	# 위: 제목 + 지갑
	var top := HBoxContainer.new()
	top.alignment = BoxContainer.ALIGNMENT_CENTER
	top.add_theme_constant_override("separation", 18)
	root.add_child(top)
	title = _label(top, 40, Color(0.95, 0.25, 0.2))
	title.add_theme_constant_override("outline_size", 8)
	title.add_theme_color_override("font_outline_color", Color(0.1, 0, 0))
	wallet_box = HBoxContainer.new()
	wallet_box.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	wallet_box.alignment = BoxContainer.ALIGNMENT_END
	wallet_box.size_flags_vertical = Control.SIZE_SHRINK_CENTER
	wallet_box.add_theme_constant_override("separation", 10)
	top.add_child(wallet_box)
	lang = _button(top, 16, Vector2(110, 40))
	lang.size_flags_vertical = Control.SIZE_SHRINK_CENTER
	lang.pressed.connect(I18n.toggle)
	stats = _label(root, 16, Color(1, 0.9, 0.8, 0.8))
	tabs = HBoxContainer.new()
	tabs.add_theme_constant_override("separation", 8)
	root.add_child(tabs)
	var scroll := ScrollContainer.new()
	scroll.size_flags_vertical = Control.SIZE_EXPAND_FILL
	scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	root.add_child(scroll)
	grid = GridContainer.new()
	grid.columns = 3
	grid.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	grid.add_theme_constant_override("h_separation", 12)
	grid.add_theme_constant_override("v_separation", 12)
	scroll.add_child(grid)
	var bottom := HBoxContainer.new()
	bottom.alignment = BoxContainer.ALIGNMENT_CENTER
	bottom.add_theme_constant_override("separation", 16)
	root.add_child(bottom)
	wave_minus = _button(bottom, 22, Vector2(48, 48))
	wave_minus.text = "-"
	wave_minus.pressed.connect(_step_wave.bind(-1))
	wave_label = _label(bottom, 18, Color(1, 0.93, 0.85))
	wave_label.custom_minimum_size.x = 170
	wave_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	wave_plus = _button(bottom, 22, Vector2(48, 48))
	wave_plus.text = "+"
	wave_plus.pressed.connect(_step_wave.bind(1))
	wave_cost = _label(bottom, 14, Color(1, 0.85, 0.5))
	wave_cost.custom_minimum_size.x = 200
	back = _button(bottom, 20, Vector2(180, 56))
	back.pressed.connect(func(): Loading.go("res://scenes/title.tscn"))
	launch = _button(bottom, 28, Vector2(280, 60))
	launch.add_theme_stylebox_override("normal", _box(Color("ff8a2a"), Color("ffb070")))
	launch.add_theme_stylebox_override("hover", _box(Color("ffa04d"), Color("ffd0a0")))
	launch.add_theme_stylebox_override("pressed", _box(Color("e8761c"), Color("ffb070")))
	launch.add_theme_stylebox_override("hover_pressed", _box(Color("e8761c"), Color("ffb070")))
	for c in ["font_color", "font_hover_color", "font_pressed_color", "font_focus_color", "font_hover_pressed_color"]:
		launch.add_theme_color_override(c, Color("07090d"))
	launch.pressed.connect(_launch)
	toast_label = _label(root, 16, Color(1, 0.6, 0.4))
	toast_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	I18n.locale_changed.connect(_refresh)
	resized.connect(_refresh)
	_refresh()
	launch.grab_focus()

func _label(parent: Control, size: int, col: Color) -> Label:
	var l := Label.new()
	l.add_theme_font_size_override("font_size", size)
	l.add_theme_color_override("font_color", col)
	l.add_theme_color_override("font_shadow_color", Color(0, 0, 0, 0.8))
	parent.add_child(l)
	return l

func _box(bg: Color, border: Color) -> StyleBoxFlat:
	var b := StyleBoxFlat.new()
	b.bg_color = bg
	b.border_color = border
	b.set_border_width_all(1)
	b.set_corner_radius_all(6)
	b.content_margin_left = 12
	b.content_margin_right = 12
	b.content_margin_top = 8
	b.content_margin_bottom = 8
	return b

func _button(parent: Control, size: int, min_size: Vector2) -> Button:
	var b := Button.new()
	b.custom_minimum_size = min_size
	b.add_theme_font_size_override("font_size", size)
	b.add_theme_stylebox_override("normal", _box(Color(0.16, 0.06, 0.05, 0.92), Color(0.5, 0.2, 0.12)))
	b.add_theme_stylebox_override("hover", _box(Color(0.26, 0.09, 0.07, 0.95), EMBER))
	b.add_theme_stylebox_override("pressed", _box(Color(0.35, 0.1, 0.07), EMBER))
	b.add_theme_stylebox_override("disabled", _box(Color(0.1, 0.06, 0.06, 0.8), Color(0.25, 0.15, 0.12)))
	b.add_theme_stylebox_override("focus", StyleBoxEmpty.new())
	parent.add_child(b)
	return b

func _wallet_name(k: String) -> String:
	return _t("wallet." + k)

func _upgrade_lv(id: String) -> int:
	return HubLogic.upgrade_lv(Save.meta, id)

func _cost(u: Dictionary) -> Dictionary:
	return HubLogic.upgrade_cost(Save.meta, u)

func _afford(c: Dictionary) -> bool:
	return HubLogic.can_afford(Save.meta, c)

func _locked(u: Dictionary) -> String:
	var need := HubLogic.upgrade_lock(Save.meta, u)
	if need == "":
		return ""
	return _t("hub.locked", {"name": _t("upg.%s.name" % need), "lv": int(u.requires.lv)})

func _cost_text(c: Dictionary) -> String:
	var parts: Array = []
	for k in c:
		parts.append("%s %d" % [_wallet_name(k), int(c[k])])
	return " · ".join(parts)

## buyUpgrade(): pay the cost, level up, save.
func _buy(u: Dictionary) -> void:
	if HubLogic.buy_upgrade(Save.meta, u.id) == "ok":
		Save.save_meta()
		Sfx.play("build")
		_refresh()

func _buy_facility(p: Dictionary) -> void:
	if HubLogic.buy_facility(Save.meta, p.id) == "ok":
		Save.save_meta()
		Sfx.play("build")
		_refresh()

func _step_wave(d: int) -> void:
	start_wave = clampi(start_wave + d, 1, HubLogic.max_start_wave(Save.meta))
	_refresh()

func _wave_cost() -> Dictionary:
	return HubLogic.start_wave_cost(Save.meta, 1, start_wave)

## Sortie: pay for the start wave, remember it for the game scene, go.
func _launch() -> void:
	var r := HubLogic.buy_start_wave(Save.meta, start_wave)
	if r != "ok":
		_toast(_t("hub.poor" if r == "poor" else "hub.unreached"))
		return
	Save.pending_start_wave = start_wave
	Save.save_meta()
	Loading.go("res://scenes/game.tscn")

func _toast(text: String) -> void:
	toast_label.text = text
	toast_left = 2.5

func _process(dt: float) -> void:
	HubLogic.tick(Save.meta, dt)
	since_ui += dt
	since_save += dt
	if toast_left > 0.0:
		toast_left -= dt
		if toast_left <= 0.0:
			toast_label.text = ""
	if since_save >= 5.0:
		since_save = 0.0
		Save.save_meta()
	if since_ui >= 0.5:
		since_ui = 0.0
		_refresh_wallet()
		if _signature() != sig:
			_refresh() # 살 수 있는 것이 달라졌을 때만 카드를 다시 만든다 (누르는 중 버튼이 사라지지 않게)

func _notification(what: int) -> void:
	if what == NOTIFICATION_WM_CLOSE_REQUEST:
		Save.save_meta()

func _exit_tree() -> void:
	Save.save_meta()

## What can be bought right now in the open tab (and the sortie button): when it changes the cards are rebuilt.
func _signature() -> String:
	var s := ""
	if cat == FACILITY:
		for p in data.producers:
			s += "1" if HubLogic.facility_lv(Save.meta, p.id) < int(p.max) and HubLogic.facility_unlocked(Save.meta, p) and _afford(HubLogic.facility_cost(Save.meta, p)) else "0"
	else:
		for u in data.upgrades:
			if u.cat == cat:
				s += "1" if _upgrade_lv(u.id) < int(u.max) and _locked(u) == "" and _afford(_cost(u)) else "0"
	return s + ("L" if _afford(_wave_cost()) else "l")

func _refresh() -> void:
	title.text = _t("hub.title")
	launch.text = _t("hub.launch")
	back.text = _t("hub.back")
	lang.text = I18n.t("title.lang")
	stats.text = _t("hub.stats", {"w": int(Save.meta.bestWave), "r": int(Save.meta.totalRuns), "k": int(Save.meta.totalKills)})
	grid.columns = 3 if size.x >= 1100 else (2 if size.x >= 720 else 1)
	start_wave = clampi(start_wave, 1, HubLogic.max_start_wave(Save.meta))
	var wc := _wave_cost()
	wave_label.text = _t("hub.startWave", {"w": start_wave, "m": HubLogic.max_start_wave(Save.meta)})
	wave_cost.text = _t("hub.startFree") if wc.is_empty() else _cost_text(wc)
	wave_cost.add_theme_color_override("font_color", Color(1, 0.85, 0.5) if _afford(wc) else Color(1, 0.45, 0.35))
	wave_minus.disabled = start_wave <= 1
	wave_plus.disabled = start_wave >= HubLogic.max_start_wave(Save.meta)
	launch.disabled = not _afford(wc)
	_refresh_wallet()
	for c in tabs.get_children():
		c.queue_free()
	for k in data.catOrder + [FACILITY]:
		var b := _button(tabs, 18, Vector2(140, 42))
		b.text = _t("cat." + k)
		if k == cat:
			b.add_theme_stylebox_override("normal", _box(Color(0.45, 0.12, 0.08), EMBER))
		b.pressed.connect(func(): cat = k; _refresh())
	for c in grid.get_children():
		c.queue_free()
	if cat == FACILITY:
		for p in data.producers:
			grid.add_child(_facility_card(p))
	else:
		for u in data.upgrades:
			if u.cat == cat:
				grid.add_child(_card(u))
	sig = _signature()

func _refresh_wallet() -> void:
	for c in wallet_box.get_children():
		c.queue_free()
	for k in data.walletKeys:
		var v := Save.wallet(k)
		if v < 1.0 and k != "gold":
			continue
		var chip := PanelContainer.new()
		chip.add_theme_stylebox_override("panel", _box(PANEL, Color(0.45, 0.2, 0.12)))
		chip.custom_minimum_size = Vector2(0, 40)
		var l := Label.new()
		l.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		l.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
		l.text = "%s %s" % [_wallet_name(k), _num(v)]
		l.add_theme_font_size_override("font_size", 16)
		l.add_theme_color_override("font_color", Color(1, 0.85, 0.45) if k == "gold" else Color(0.95, 0.9, 0.85))
		chip.add_child(l)
		wallet_box.add_child(chip)

func _num(v: float) -> String:
	return str(floori(v)) if v >= 10.0 or v == floorf(v) else "%.1f" % v

func _rate(v: float) -> String:
	return "%.3f" % v

## 방치 생산 시설 카드: 이름, 지금 수입과 한 단계당 수입, 비용, 구매
func _facility_card(p: Dictionary) -> Control:
	var lv := HubLogic.facility_lv(Save.meta, p.id)
	var unlocked := HubLogic.facility_unlocked(Save.meta, p)
	var c := HubLogic.facility_cost(Save.meta, p)
	var can_buy := lv < int(p.max) and unlocked and _afford(c)
	var card := PanelContainer.new()
	card.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	card.add_theme_stylebox_override("panel", _box(PANEL, Color(EMBER, 0.75) if can_buy else Color(0.35, 0.16, 0.1)))
	card.custom_minimum_size.y = 118
	var v := VBoxContainer.new()
	v.add_theme_constant_override("separation", 4)
	card.add_child(v)
	var head := HBoxContainer.new()
	v.add_child(head)
	var nm := _label(head, 19, Color(1, 0.93, 0.85))
	nm.text = _t("prod.%s.name" % p.id)
	nm.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	var lvl := _label(head, 15, EMBER)
	lvl.text = _t("hub.lv", {"a": lv, "b": int(p.max)})
	var desc := _label(v, 14, Color(0.9, 0.85, 0.8, 0.85))
	var now := HubLogic.facility_income(Save.meta, p)
	var one: float = float(p.perSec) * HubLogic.income_mul(Save.meta)
	desc.text = "%s\n%s %s (%s)" % [_t("prod.%s.desc" % p.id), _wallet_name(p.produces), _t("hub.income", {"n": _rate(now)}), _t("hub.perSec", {"n": _rate(one)})]
	desc.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	desc.horizontal_alignment = HORIZONTAL_ALIGNMENT_LEFT
	desc.size_flags_vertical = Control.SIZE_EXPAND_FILL
	var row := HBoxContainer.new()
	v.add_child(row)
	var cost := _label(row, 14, Color(1, 0.85, 0.5))
	cost.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	var btn := _button(row, 15, Vector2(110, 34))
	btn.text = _t("hub.buy")
	if lv >= int(p.max):
		cost.text = ""
		btn.text = _t("hub.max")
		btn.disabled = true
	elif not unlocked:
		var ue: Dictionary = p.unlockEarned
		cost.text = _t("hub.earned", {"n": int(ue.amount), "k": _wallet_name(ue.key)})
		btn.disabled = true
	else:
		cost.text = _cost_text(c)
		btn.disabled = not _afford(c)
	btn.pressed.connect(_buy_facility.bind(p))
	return card

func _card(u: Dictionary) -> Control:
	var lv := _upgrade_lv(u.id)
	var card := PanelContainer.new()
	card.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	var can_buy := lv < int(u.max) and _locked(u) == "" and _afford(_cost(u))
	card.add_theme_stylebox_override("panel", _box(PANEL, Color(EMBER, 0.75) if can_buy else Color(0.35, 0.16, 0.1)))
	card.custom_minimum_size.y = 118
	var v := VBoxContainer.new()
	v.add_theme_constant_override("separation", 4)
	card.add_child(v)
	var head := HBoxContainer.new()
	v.add_child(head)
	var name := _label(head, 19, Color(1, 0.93, 0.85))
	name.text = _t("upg.%s.name" % u.id)
	name.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	var lvl := _label(head, 15, EMBER)
	lvl.text = _t("hub.lv", {"a": lv, "b": int(u.max)})
	var desc := _label(v, 14, Color(0.9, 0.85, 0.8, 0.85))
	desc.text = _t("upg.%s.desc" % u.id)
	desc.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	desc.horizontal_alignment = HORIZONTAL_ALIGNMENT_LEFT
	desc.size_flags_vertical = Control.SIZE_EXPAND_FILL
	if not u.effect.kind in LIVE:
		var later := _label(v, 12, Color(0.75, 0.7, 0.65, 0.7))
		later.text = _t("hub.later")
	var row := HBoxContainer.new()
	v.add_child(row)
	var cost := _label(row, 14, Color(1, 0.85, 0.5))
	cost.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	var btn := _button(row, 15, Vector2(110, 34))
	var c := _cost(u)
	var lock := _locked(u)
	if lv >= int(u.max):
		cost.text = ""
		btn.text = _t("hub.max")
		btn.disabled = true
	elif lock != "":
		cost.text = lock
		btn.text = _t("hub.buy")
		btn.disabled = true
	else:
		var parts: Array = []
		for k in c:
			parts.append("%s %d" % [_wallet_name(k), int(c[k])])
		cost.text = " · ".join(parts)
		btn.text = _t("hub.buy")
		btn.disabled = not _afford(c)
	btn.pressed.connect(_buy.bind(u))
	return card
