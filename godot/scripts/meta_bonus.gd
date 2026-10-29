extends RefCounted
## Permanent upgrades (src/data/tycoon2d.ts UPGRADES) → this run, like bonuses() in tycoon2d/logic/economy.ts.
## Applied now: start gold and resources, max HP, core HP, starting guns, gun quality, prep time. Allies read their own
## upgrades (allies.gd). Turret, trap and gather-speed bonuses are kept in game.meta for structure.gd / gathering.gd.

static func data() -> Dictionary:
	return preload("res://scripts/hub_logic.gd").data() # 한 번만 읽어 둔다

static func bonuses(save: Node) -> Dictionary:
	var b := {"startGold": 0.0, "maxHp": 0.0, "coreHp": 0.0, "prepBonus": 0.0, "weapons": ["pistol"], "weaponLv": {}, "startRes": {}, "startSamples": 0, "startSamplesSp": 0,
		"turretDmgMul": 0.0, "turretRangeMul": 0.0, "turretRateMul": 0.0, "turretAmmoMul": 0.0, "turretHpMul": 0.0, "trapDpsMul": 0.0, "gatherSpeed": 0.0, "dmgMul": 0.0}
	for u in data().upgrades:
		var lv: int = save.upgrade_lv(u.id)
		if lv <= 0:
			continue
		var e: Dictionary = u.effect
		match e.kind:
			"startGold", "maxHp", "coreHp", "prepBonus", "turretDmgMul", "turretRangeMul", "turretRateMul", "turretAmmoMul", "turretHpMul", "trapDpsMul", "gatherSpeed", "dmgMul":
				b[e.kind] += float(e.per) * lv
			"startSamples", "startSamplesSp":
				b[e.kind] += int(e.per) * lv
			"startRes":
				b.startRes[e.res] = int(b.startRes.get(e.res, 0)) + int(e.per) * lv
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
	game.meta = b
	var p: Node = game.player
	p.max_hp += b.maxHp
	p.hp = p.max_hp
	game.core.max_hp += b.coreHp
	game.core.hp = game.core.max_hp
	game.coins += int(b.startGold)
	p.dmg_mul = 1.0 + b.dmgMul
	game.prep_left += b.prepBonus
	if game.has_method("sync_prep_total"):
		game.sync_prep_total()
	# 본부에서 산 시작 웨이브: _start_wave() 가 wave += 1 부터 시작하므로 하나 모자라게 둔다
	if save.pending_start_wave > 1:
		game.wave = save.pending_start_wave - 1
	save.pending_start_wave = 1
	game.samples += 2 + int(b.startSamples) # 기본 샘플 2개 (bonuses().startSamples)
	game.samples_sp += int(b.startSamplesSp)
	for r in b.startRes:
		game.res[r] = int(game.res.get(r, 0)) + int(b.startRes[r])
	for id in b.weapons:
		p.owned[id] = true
	var all := int(b.weaponLv.get("*", 0))
	for id in gd.gun_order:
		var add := all + int(b.weaponLv.get(id, 0))
		if add > 0:
			p.lv[id] = mini(int(gd.gun_upgrade.maxLv), int(p.lv.get(id, 0)) + add)
			p.refresh_gun(id)
	# 시작 지급분: 사망 정산(Save.bank_game)에서 빼서, 공짜 지급을 자살로 불리지 못하게 한다
	game.set_meta("run_grant", {"gold": game.coins, "res": game.res.duplicate(), "samples": game.samples, "samplesSp": game.samples_sp})
