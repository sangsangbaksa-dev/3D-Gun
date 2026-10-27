extends Node3D
## Vaccines and allies for one sortie (src/allies/index.ts + logic/inject.ts + logic/vaccine.ts):
## hold E next to a stunned zombie to inject a vaccine; success turns it into an ally, failure wakes it enraged.
## Allies with HP left are saved in Save.meta.allies (shared with the classic game) and come back next run.
## Vaccine crafting needs the lab and gathering; until those land each run starts with START_VACCINES.

const AllyScript := preload("res://scripts/ally.gd")
const START_VACCINES := [2, 0, 0]
const SAVE_EVERY := 2.0
const GATHER_RADIUS := 20.0

var game: Node
var data: Dictionary
var vaccines: Array = START_VACCINES.duplicate()
var tier := -1
var progress := 0.0
var target: Node
var res_delivered := {}

var _dirty := false
var _save_t := 0.0
var _hud: Control
var _lbl: Label
var _bar: ProgressBar
var _lbl_vac: Label

func _ready() -> void:
	data = JSON.parse_string(FileAccess.get_file_as_string("res://data/meta_data.json"))
	_build_hud()
	_restore()

func list() -> Array:
	return get_tree().get_nodes_in_group("allies")

func count_role(r: String) -> int:
	return list().filter(func(a): return a.role == r).size()

## allyCap(): 2 + 숙소 확장(a_cap) 업그레이드, 절대 천장 30
func cap() -> int:
	return mini(int(data.allyHardCap), 2 + Save.upgrade_lv("a_cap"))

func dmg_mul() -> float:
	return 1.0 + 0.08 * Save.upgrade_lv("a_adm")

func hp_mul() -> float:
	return 1.0 + 0.12 * Save.upgrade_lv("a_ahp")

func anchor() -> Vector3:
	return game.core.global_position

## Nearest zombie that isn't stunned (stunned ones are left for the player's vaccine).
func foe(at: Vector3, max_d: float) -> Node3D:
	var best: Node3D = null
	var bd := max_d * max_d
	for z in game.zombies_root.get_children():
		if z.dead or z.stunned:
			continue
		var d := Vector2(z.global_position.x - at.x, z.global_position.z - at.z).length_squared()
		if d < bd:
			bd = d
			best = z
	return best

## pickRole(): fighters 2 → guard 1 → gatherers 2 → researcher 1 → guards 3 → gatherers 4 → least used.
func pick_role() -> String:
	for w in [["fighter", 2], ["guard", 1], ["gatherer", 2], ["researcher", 1], ["guard", 3], ["gatherer", 4]]:
		if count_role(w[0]) < w[1]:
			return w[0]
	var best := "guard"
	for r in data.allyRoleOrder:
		if count_role(r) < int(data.allyRoles[r].max) and count_role(r) < count_role(best):
			best = r
	return best

func spawn(pos: Vector3, z_type: String, role := "") -> Node:
	var a := AllyScript.new()
	a.mgr = self
	a.role = role if role != "" else pick_role()
	a.z_type = z_type
	a.max_hp = round(float(data.ally.hp) * hp_mul())
	a.hp = a.max_hp
	a.slot = list().size()
	add_child(a)
	a.global_position = Vector3(pos.x, game.world.ground_y(pos.x, pos.z) + 0.2, pos.z)
	mark_dirty(true)
	return a

func _restore() -> void:
	for s in Save.meta.allies:
		if not s.role in data.allyRoleOrder:
			continue
		var a: Node = spawn(Vector3(float(s.x), 0, float(s.z)), str(s.get("zType", "normal")), s.role)
		a.max_hp = maxf(1.0, float(s.maxHp))
		a.hp = minf(a.max_hp, float(s.hp))
		a.rotation.y = float(s.get("yaw", 0.0))
		a.born = 1.0

func on_ally_dead(_a: Node) -> void:
	mark_dirty(true)

## persistAllies(): save allies with HP left. now=false defers to every SAVE_EVERY seconds.
func mark_dirty(now := false) -> void:
	_dirty = true
	if now:
		_save()

func _save() -> void:
	var out: Array = []
	for a in list():
		if a.dead or a.hp <= 0.0 or not a.is_inside_tree():
			continue
		out.append({"role": a.role, "x": a.global_position.x, "z": a.global_position.z, "hp": a.hp, "maxHp": a.max_hp, "zType": a.z_type, "yaw": a.rotation.y})
	Save.meta.allies = out
	Save.save_meta()
	_dirty = false
	_save_t = 0.0

func flush() -> void:
	if _dirty:
		_save()

## virtualNodes(): four resource spots 20 m around the core (wood, stone, herb, iron).
func gather_spot(a: Node) -> Dictionary:
	var keys := ["wood", "stone", "herb", "iron"]
	var c := anchor()
	var taken := {}
	for o in list():
		if o != a and o.role == "gatherer":
			taken[o.node_id] = true
	if a.node_id == 0:
		for i in keys.size():
			if not taken.has(-(i + 1)):
				a.node_id = -(i + 1)
				break
		if a.node_id == 0:
			a.node_id = -(1 + a.slot % keys.size())
	var i: int = -a.node_id - 1
	var ang := float(i) / keys.size() * TAU + 0.8
	return {"pos": c + Vector3(cos(ang), 0, sin(ang)) * GATHER_RADIUS, "res": keys[i]}

## Gatherers hand in at the core. The base thread's resources take it when they exist (game.gain_res).
func deliver(res: String, n: int) -> void:
	if game.has_method("gain_res"):
		game.gain_res(res, n)
	else:
		res_delivered[res] = int(res_delivered.get(res, 0)) + n

# ── 주사 (inject.ts) ─────────────────────────────────────────────────

func active_tier() -> int:
	if tier < 0 or int(vaccines[tier]) <= 0:
		tier = -1
		for t in range(vaccines.size() - 1, -1, -1):
			if int(vaccines[t]) > 0:
				tier = t
				break
	return tier

## conversionChance(): vaccine rate + low-HP bonus + vaccine research, bosses harder, clamped.
func chance_for(z: Node) -> float:
	var t := active_tier()
	if t < 0:
		return 0.0
	var inj: Dictionary = data.inject
	var ratio := clampf(z.hp / z.max_hp, 0.0, 1.0) if z.max_hp > 0.0 else 1.0
	var p: float = float(data.vaccines[t].rate) + (1.0 - ratio) * float(inj.lowHpBonus) + 0.05 * Save.upgrade_lv("a_vac")
	if z.is_boss:
		p -= float(inj.bossPenalty)
	return clampf(p, float(inj.minRate), float(inj.maxRate))

func _stunned_near(at: Vector3) -> Node:
	var best: Node = null
	var bd := float(data.inject.range)
	for z in game.zombies_root.get_children():
		if z.dead or not z.stunned:
			continue
		var d := Vector2(z.global_position.x - at.x, z.global_position.z - at.z).length()
		if d < bd:
			bd = d
			best = z
	return best

func _process(dt: float) -> void:
	if _dirty:
		_save_t += dt
		if _save_t >= SAVE_EVERY:
			_save()
	var p: Node3D = game.player
	var z: Node = null if p.dead else _stunned_near(p.global_position)
	if z != target:
		target = z
		progress = 0.0
	_refresh_hud()
	if z == null:
		return
	var block := ""
	if active_tier() < 0:
		block = "nostock"
	elif list().size() >= cap():
		block = "cap"
	if block != "" or not Input.is_physical_key_pressed(KEY_E):
		progress = maxf(0.0, progress - dt * 2.0)
		return
	progress = minf(1.0, progress + dt / float(data.inject.time))
	if progress < 1.0:
		return
	var t := active_tier()
	var ch := chance_for(z)
	vaccines[t] = maxi(0, int(vaccines[t]) - 1)
	progress = 0.0
	target = null
	if randf() < ch:
		var pos: Vector3 = z.global_position
		var zt: String = z.type
		var yaw: float = z.rotation.y
		z.convert_to_ally()
		var a: Node = spawn(pos, zt)
		a.rotation.y = yaw
		Sfx.play("convert")
		game.toast(_t("ally.ok", {"role": _role_name(a.role)}))
	else:
		z._wake()
		game.toast(_t("ally.fail", {"p": roundi(ch * 100.0)}))

# ── 주사 HUD ─────────────────────────────────────────────────────────

const TEXT := {
	"en": {"ally.inject": "Hold E · inject {v} ({p}%)", "ally.nostock": "No vaccine left", "ally.cap": "Ally limit reached ({n})",
		"ally.ok": "Vaccine worked! New ally: {role}", "ally.fail": "The vaccine failed ({p}%) — it woke up enraged!",
		"ally.vac": "Vaccines {a}/{b}/{c} · Allies {n}/{cap}",
		"role.fighter": "Fighter", "role.guard": "Guard", "role.gatherer": "Gatherer", "role.researcher": "Lab helper",
		"vac.0": "basic vaccine", "vac.1": "advanced vaccine", "vac.2": "superior vaccine"},
	"ko": {"ally.inject": "E 길게 · {v} 주사 ({p}%)", "ally.nostock": "백신이 없습니다", "ally.cap": "아군이 가득 찼습니다 ({n})",
		"ally.ok": "아군화 성공! 새 아군: {role}", "ally.fail": "백신 실패 ({p}%) — 분노해서 깨어났다!",
		"ally.vac": "백신 {a}/{b}/{c} · 아군 {n}/{cap}"},
}

func _t(key: String, args := {}) -> String:
	var s: String = TEXT.get(I18n.locale, TEXT.en).get(key, TEXT.en.get(key, key))
	for k in args:
		s = s.replace("{%s}" % k, str(args[k]))
	return s

func _role_name(r: String) -> String:
	return data.allyRoles[r].name if I18n.locale == "ko" else _t("role." + r)

func _vac_name(t: int) -> String:
	return data.vaccines[t].name if I18n.locale == "ko" else _t("vac.%d" % t)

func _build_hud() -> void:
	var layer := CanvasLayer.new()
	add_child(layer)
	_hud = Control.new()
	_hud.set_anchors_preset(Control.PRESET_FULL_RECT)
	_hud.mouse_filter = Control.MOUSE_FILTER_IGNORE
	layer.add_child(_hud)
	_lbl = Label.new()
	_lbl.set_anchors_preset(Control.PRESET_CENTER)
	_lbl.position = Vector2(-260, 46)
	_lbl.size = Vector2(520, 30)
	_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	_lbl.add_theme_font_size_override("font_size", 20)
	_lbl.add_theme_color_override("font_color", Color("8ff5e9"))
	_lbl.add_theme_color_override("font_shadow_color", Color(0, 0, 0, 0.8))
	_hud.add_child(_lbl)
	_bar = ProgressBar.new()
	_bar.set_anchors_preset(Control.PRESET_CENTER)
	_bar.position = Vector2(-110, 80)
	_bar.size = Vector2(220, 10)
	_bar.show_percentage = false
	_bar.max_value = 1.0
	var fill := StyleBoxFlat.new()
	fill.bg_color = Color("2ee6d6")
	var bg := StyleBoxFlat.new()
	bg.bg_color = Color(0, 0, 0, 0.55)
	_bar.add_theme_stylebox_override("fill", fill)
	_bar.add_theme_stylebox_override("background", bg)
	_hud.add_child(_bar)
	_lbl_vac = Label.new()
	_lbl_vac.set_anchors_preset(Control.PRESET_TOP_LEFT)
	_lbl_vac.position = Vector2(24, 48)
	_lbl_vac.add_theme_font_size_override("font_size", 16)
	_lbl_vac.add_theme_color_override("font_color", Color("8ff5e9"))
	_lbl_vac.add_theme_color_override("font_shadow_color", Color(0, 0, 0, 0.8))
	_hud.add_child(_lbl_vac)

func _refresh_hud() -> void:
	_lbl_vac.text = _t("ally.vac", {"a": vaccines[0], "b": vaccines[1], "c": vaccines[2], "n": list().size(), "cap": cap()})
	var show := target != null
	_lbl.visible = show
	_bar.visible = show and progress > 0.0
	if not show:
		return
	if active_tier() < 0:
		_lbl.text = _t("ally.nostock")
	elif list().size() >= cap():
		_lbl.text = _t("ally.cap", {"n": cap()})
	else:
		_lbl.text = _t("ally.inject", {"v": _vac_name(active_tier()), "p": roundi(chance_for(target) * 100.0)})
	_bar.value = progress
