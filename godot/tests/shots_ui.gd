extends SceneTree
## Visual check of the menus: title screen, hub, and the death card. Same runner as shots.gd.

var out := ""
var f := 0
var game: Node

func _initialize() -> void:
	out = OS.get_environment("OUT") if OS.has_environment("OUT") else ProjectSettings.globalize_path("user://shots")
	DirAccess.make_dir_recursive_absolute(out)
	change_scene_to_file("res://scenes/title.tscn")

func _snap(name: String) -> void:
	root.get_texture().get_image().save_png(out.path_join(name + ".png"))
	print("shot ", name)

func _process(_dt: float) -> bool:
	f += 1
	if f == 40:
		_snap("title")
		change_scene_to_file("res://scenes/hub.tscn")
	elif f == 80:
		_snap("hub")
		change_scene_to_file("res://scenes/game.tscn")
	elif f == 120:
		game = current_scene
		game.player.hp = 1.0
		game.player.take_damage(50.0)
	elif f == 260:
		_snap("death")
		return true
	return false
