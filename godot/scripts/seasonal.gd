extends RefCounted
## 짧은 시즌 문구: 타이틀 왼쪽 아래 slice 라벨에 쓴다 (웹 자동화·기념일과 같은 톤).

static func slice_key() -> String:
	var m: int = Time.get_datetime_dict_from_system().get("month", 0)
	match m:
		10:
			return "seasonal.october"
		11:
			return "seasonal.november"
		12:
			return "seasonal.december"
		_:
			return "title.slice"
