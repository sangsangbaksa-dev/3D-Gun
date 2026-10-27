extends RefCounted
## Permanent upgrades (src/data/tycoon2d.ts UPGRADES) → this run, like bonuses() in tycoon2d/logic/economy.ts.
## Applied now: start gold, max HP, core HP, starting guns, gun quality, prep time. Allies read their own
## upgrades (allies.gd). Turret, gathering and start-resource upgrades apply once those systems are ported.

static func data() -> Dictionary:
	return JSON.parse_string(FileAccess.get_file_as_string("res://data/meta_data.json"))

static func bonuses(save: Node) -> Dictionary:
	var b := {"startGold": 0.0, "maxHp": 0.0, "coreHp": 0.0, "prepBonus": 0.0, "weapons": ["pistol"], "weaponLv": {}}
	for u in data().upgrades:
		var lv: int = save.upgrade_lv(u.id)
		if lv <= 0:
			continue
		var e: Dictionary = u.effect
		match e.kind:
			"startGold", "maxHp", "coreHp", "prepBonus":
				b[e.kind] += float(e.per) * lv
			"weapon":
				if not e.id in b.weapons:
					b.weapons.append(e.id)
			"weaponLv":
				b.weaponLv[e.weapon] = int(b.weaponLv.get(e.weapon, 0)) + int(e.per) * lv
	return b

static func apply(game: Node) -> void:
	var save: Node = game.get_node("/root/Save")
	var gd: Node = game.get_node("/root/GameData")
	var b := bonuses(save)
	var p: Node = game.player
	p.max_hp += b.maxHp
	p.hp = p.max_hp
	game.core.max_hp += b.coreHp
	game.core.hp = game.core.max_hp
	game.coins += int(b.startGold)
	game.prep_left += b.prepBonus
	for id in b.weapons:
		p.owned[id] = true
	var all := int(b.weaponLv.get("*", 0))
	for id in gd.gun_order:
		var add := all + int(b.weaponLv.get(id, 0))
		if add > 0:
			p.lv[id] = mini(int(gd.gun_upgrade.maxLv), int(p.lv.get(id, 0)) + add)
			p.refresh_gun(id)
