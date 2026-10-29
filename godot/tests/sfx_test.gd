extends SceneTree
## Headless test: 합성 효과음이 모두 만들어지고, 재생 요청(거리·그룹·동시 재생 제한 포함)이 오류 없이 처리되며,
## 게임 장면에서 재장전·이동을 돌려도 audio_director 가 멈추지 않는다.
## Run: godot --headless --path godot --fixed-fps 60 -s res://tests/sfx_test.gd

const Synth := preload("res://scripts/sfx_synth.gd")
var game: Node
var frames := 0
var ok := {}

func _initialize() -> void:
	game = load("res://scenes/game.tscn").instantiate()
	root.add_child(game)
	game.prep_left = 9999.0

func _process(_dt: float) -> bool:
	frames += 1
	var sfx: Node = root.get_node("Sfx")
	if frames == 2:
		var all_ok := true
		for id in Synth.IDS:
			var st: AudioStreamWAV = Synth.make(id)
			all_ok = all_ok and st != null and st.data.size() > 100
		ok.synth = all_ok
		ok.loop = Synth.make("amb_tension").loop_mode == AudioStreamWAV.LOOP_FORWARD
		for id in Synth.IDS:
			sfx.play(id, Vector3(5, 0, 5) if id.begins_with("z_") else null)
		for i in 100: # 같은 그룹을 쏟아부어도 상한을 넘지 않는다
			sfx._last.clear()
			sfx.play("z_growl", Vector3(2, 0, 2))
		ok.group = int(sfx._groups.get("voc", 0)) <= int(sfx.GROUP_MAX.voc)
		for i in 60:
			sfx._emit(sfx._stream("click"), 0.5, 1.0, null)
		ok.voices = sfx._voices <= sfx.MAX_VOICES
		sfx.set_mix(0.0, 0.0)
		var before: int = sfx._voices
		sfx.play("jump")
		ok.mute = sfx._voices == before # 효과음 0 이면 새 소리가 만들어지지 않는다
		sfx.set_mix(1.0, 1.0)
	if frames == 4:
		game.player.ammo = 0
		game.player._start_reload()
	if frames > 4 and frames < 120 and game.player.is_reloading():
		game.player.reload_left = maxf(0.0, game.player.reload_left - 0.03) # 재장전 단계음을 빨리 지나간다
	if frames == 130:
		game.player.velocity = Vector3(5, 6, 0)
	if frames == 200:
		var bad := []
		for k in ok:
			print(k, "=", ok[k])
			if not ok[k]:
				bad.append(k)
		print("PASS" if bad.is_empty() else "FAIL: " + str(bad))
		quit(0 if bad.is_empty() else 1)
	return false
