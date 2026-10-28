extends SceneTree
## HUD 연출 화면 확인: 타이틀, 데미지 숫자, 명중 마커 3종, 웨이브 배너 3종, 사망 카드.
## 데스크톱: xvfb-run godot --path godot --rendering-driver opengl3 -s res://tests/shots_hud.gd (OUT=폴더)
## 웹(WebShots 프리셋): "SHOT 이름" 을 찍고 잠시 화면을 붙잡는다. 화면 크기는 창(브라우저) 크기를 따른다.
## SHOTS=title,dmg 처럼 고를 수 있다.

var out := ""
var game: Node
var step := 0
var t0 := 0
var only: PackedStringArray = []

func _initialize() -> void:
	out = OS.get_environment("OUT") if OS.has_environment("OUT") else ProjectSettings.globalize_path("user://shots")
	DirAccess.make_dir_recursive_absolute(out)
	if OS.has_environment("SHOTS"):
		only = OS.get_environment("SHOTS").split(",")
	for a in OS.get_cmdline_user_args():
		if a.begins_with("--shots="):
			only = a.substr(8).split(",")
	change_scene_to_file("res://scenes/title.tscn")

func _now() -> int:
	return Time.get_ticks_msec()

func _snap(name: String) -> void:
	if only.size() > 0 and not (name in only):
		return
	if OS.has_feature("web"):
		print("SHOT ", name)
	else:
		root.get_texture().get_image().save_png(out.path_join(name + ".png"))
		print("shot ", name)

## 웹에서는 스크린샷이 찍힐 때까지 기다린다 (0.9초)
func _hold() -> int:
	return 900 if OS.has_feature("web") else 150

func _freeze_fx() -> void:
	if game and game.floating:
		for e in game.floating._live:
			e.age = e.life * 0.42

func _spot(i: int) -> Vector3:
	var p: Node3D = game.player
	var fwd := -p.global_transform.basis.z
	var right := p.global_transform.basis.x
	var pos: Vector3 = p.position + fwd * 7.0 + right * ((i - 1) * 2.2)
	pos.y = game.world.ground_y(pos.x, pos.z) + 1.7
	return pos

func _process(_dt: float) -> bool:
	var el := _now() - t0
	match step:
		0:
			if el > 1500:
				_snap("title")
				step = 1
				t0 = _now()
		1:
			if el > _hold():
				change_scene_to_file("res://scenes/game.tscn")
				step = 2
				t0 = _now()
		2:
			if el > 1500 and current_scene != null and current_scene.get("floating") != null:
				game = current_scene
				game.roamers.enabled = false
				game.prep_left = 9999.0
				step = 3
				t0 = _now()
		3: # 데미지 숫자 + 일반 명중 마커
			game.hit_kind = "normal"
			game.hit_total = 1.0
			game.hitmark = 0.78
			if el < 300 and el % 100 < 20:
				pass
			if el > 200 and game.floating._live.is_empty():
				game.floating.spawn(_spot(0), 34, "normal")
				game.floating.spawn(_spot(1), 61, "head")
				game.floating.spawn(_spot(2), 120, "kill")
			_freeze_fx()
			if el > 700:
				_snap("dmg")
				step = 4
				t0 = _now()
		4:
			game.hit_kind = "normal"
			game.hit_total = 1.0
			game.hitmark = 0.8
			_freeze_fx()
			if el > _hold():
				step = 5
				t0 = _now()
		5:
			game.hit_kind = "head"
			game.hit_total = 1.0
			game.hitmark = 0.8
			_freeze_fx()
			if el > 300:
				_snap("marker_head")
				step = 6
				t0 = _now()
		6:
			game.hit_kind = "head"
			game.hitmark = 0.8
			_freeze_fx()
			if el > _hold():
				step = 7
				t0 = _now()
		7:
			game.hit_kind = "kill"
			game.hit_total = 1.0
			game.hitmark = 0.75
			_freeze_fx()
			if el > 300:
				_snap("marker_kill")
				step = 8
				t0 = _now()
		8:
			game.hit_kind = "kill"
			game.hitmark = 0.75
			if el > _hold():
				game.hitmark = 0.0
				game._banner("Wave 7", "wave")
				step = 9
				t0 = _now()
		9:
			if el > 800:
				_snap("banner_wave")
				step = 10
				t0 = _now()
		10:
			if el > _hold() + 2400:
				game._banner("Wave 10", "boss", "⚠ Wave 10 boss Bruiser appears!")
				step = 11
				t0 = _now()
		11:
			if el > 900:
				_snap("banner_boss")
				step = 12
				t0 = _now()
		12:
			if el > _hold() + 3200:
				game._banner("Wave 7  ✓", "clear", "+38")
				step = 13
				t0 = _now()
		13:
			if el > 800:
				_snap("banner_clear")
				step = 14
				t0 = _now()
		14:
			if el > _hold() + 2400:
				game.player.hp = 1.0
				game.player.take_damage(50.0)
				step = 15
				t0 = _now()
		15:
			if el > 3200:
				_snap("death")
				step = 16
				t0 = _now()
		16:
			if el > _hold():
				return true
	return false
