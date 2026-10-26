extends StaticBody3D
## The base core zombies walk the lanes to destroy (CORE in src/data). Building and upgrades come in stage 4.

signal damaged(hp: float)
signal destroyed

var radius: float
var max_hp: float
var hp: float
var dead := false

func setup(data: Dictionary) -> void:
	radius = data.radius
	max_hp = float(data.hp[0])
	hp = max_hp

func take_damage(dmg: float) -> void:
	if dead:
		return
	hp = maxf(0.0, hp - dmg)
	damaged.emit(hp)
	if hp <= 0.0:
		dead = true
		destroyed.emit()

func heal_pct(pct: float) -> void:
	if not dead:
		hp = minf(max_hp, hp + max_hp * pct)
