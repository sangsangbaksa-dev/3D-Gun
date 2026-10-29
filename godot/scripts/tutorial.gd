extends RefCounted
## 첫 출격 힌트의 규칙 (화면은 tutorial_hud.gd). 단계마다 "이 관측을 만족하면 다음으로" 를 정한다.
## 관측(obs)은 HUD 쪽이 매 프레임 모아서 넘기는 숫자 모음이다:
##   moved(걸은 거리 m), turned(돌린 각도 rad), shots, reloads, core_dwell(핵 안내를 보여 준 초), gathered,
##   built(지은 건물 수), wave(시작한 웨이브 수), prep(준비 단계인가), allies(아군 수)
## 한 번 채운 단계는 되돌아가지 않는다. 건설 단계는 준비 단계가 아니면 건너뛴다(전투 중엔 못 짓는다).

const STEPS := ["move", "shoot", "core", "gather", "build", "wave", "ally"]
const CORE_SHOW_S := 6.0 # 핵 화살표 안내는 이만큼 보여 주면 끝
const ALLY_SHOW_S := 25.0 # 마지막 단계는 아군을 못 얻어도 이만큼 뒤 끝낸다

## 시작해야 하는가: 설정에서 켜 있고, 첫 출격(totalRuns == 0)이거나 설정에서 다시 보기를 눌렀을 때.
static func enabled(settings: Dictionary, meta: Dictionary) -> bool:
	if not bool(settings.get("tutorial", true)):
		return false
	return float(meta.get("totalRuns", 0)) == 0.0 or bool(settings.get("tutorial_force", false))

## 단계 id 가 이 관측으로 끝났는가.
static func done(id: String, o: Dictionary, step_time: float) -> bool:
	match id:
		"move": return float(o.get("moved", 0)) >= 6.0 and float(o.get("turned", 0)) >= 1.0
		"shoot": return int(o.get("shots", 0)) >= 3 and int(o.get("reloads", 0)) >= 1
		"core": return float(o.get("core_dwell", 0)) >= CORE_SHOW_S
		"gather": return int(o.get("gathered", 0)) >= 1
		"build": return int(o.get("built", 0)) >= 1 or not bool(o.get("prep", true))
		"wave": return int(o.get("wave", 0)) >= 1
		"ally": return int(o.get("allies", 0)) >= 1 or step_time >= ALLY_SHOW_S
	return true

var index := 0
var step_time := 0.0
var finished := false

func current() -> String:
	return "" if finished else STEPS[index]

## 관측을 먹여 단계를 앞으로 보낸다. 이미 끝나 있는 단계는 연달아 넘어간다. 끝난 단계 id 목록을 돌려준다.
func update(o: Dictionary, dt: float) -> Array:
	var passed := []
	if finished:
		return passed
	step_time += dt
	while not finished and done(STEPS[index], o, step_time):
		passed.append(STEPS[index])
		_next()
	return passed

func skip() -> void:
	if not finished:
		_next()

func _next() -> void:
	index += 1
	step_time = 0.0
	if index >= STEPS.size():
		finished = true
