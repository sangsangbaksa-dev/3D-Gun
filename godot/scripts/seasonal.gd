extends RefCounted
## Calendar footers for the title screen (en/ko). Empty string → use i18n `title.slice`.

static func title_slice(locale: String) -> String:
	var month: int = Time.get_date_dict_from_system().month
	match month:
		11:
			return "November siege · hold the core" if locale == "en" else "11월 거점 방어 · 핵을 지켜라"
		12:
			return "Winter outbreak · stay sharp" if locale == "en" else "겨울 광란 · 버텨내세요"
		1:
			return "New year sortie · fresh supplies" if locale == "en" else "새해 출격 · 보급을 챙겨라"
		_:
			return ""
