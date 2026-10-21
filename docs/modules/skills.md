# 모듈: 스킬트리 (`src/skills/`)

경험치 → 레벨업 → 스킬 포인트 → 스킬 구매 → `state.stats` 재계산. 규칙은 `logic/`, 창은 `view/`.

## 구조
| 경로 | 역할 | 엔진 의존 |
|------|------|-----------|
| `logic/skilltree.ts` | `addXp`, `buy`, `canBuy`, `respec`, `levelOf`, 저장/불러오기 | 없음 (순수 TS) |
| `view/skillPanel.ts` | Tab 스킬트리 DOM, 클릭 → logic 호출 | DOM |
| `index.ts` | `SkillsSystem`: 이벤트 → 경험치, Tab/Esc 처리 | |

## 데이터 모델 (`src/data/index.ts`)
- `SKILLS: SkillDef[]` = `{ id, branch, name, desc, max, icon, tier, req?: {id, lv} }`
- `BRANCHES`, `BRANCH_INFO[branch] = { color, blurb }`
- `xpToNext(level)`, `XP_KILL[type]`, `XP_GATHER`, `XP_CHEST[tier]`, `XP_CONVERT`, `XP_WAVE_CLEAR`, `respecCost(spent)`
- `calcStats(skillLv): Stats` (기존 계약 그대로. 필드는 추가만)

## 상태 (`state.ts`의 기존 필드만 사용)
`xp`(현재 레벨 안의 경험치), `skillPoints`, `skillLv: Record<id, lv>`, `gold`, `stats`.
레벨은 저장하지 않고 `1 + skillPoints + 쓴 포인트`로 계산한다(`levelOf`).

## 이벤트
- 구독: `xp:gain`, `enemy:killed`(아군 처치는 절반), `resource:gathered`, `chest:opened`, `zombie:converted`, `wave:clear`, `game:end`
- 발행: `skill:levelup {level}`, `skill:bought {id, lv}`, `toast`, `ui:modal`, `state:changed`
- 스킬을 바꾼 뒤에는 항상 `recalcStats()` 를 불러 다른 모듈이 `state.stats` 로 읽게 한다.

## 규칙
- 레벨업마다 포인트 +1. 선행 스킬(`req`)이 레벨 조건을 채워야 구매 가능.
- 초기화(리스펙): 골드 `30 + 15 × 쓴 포인트`, 포인트 전액 환불.
- 저장 형식 `SkillSave { xp, skillPoints, skillLv }` (`saveSkills/loadSkills`). localStorage 연결은 Phase 2 저장 작업에서.

## Unity(C#) 메모
- `SkillDef` → ScriptableObject `SkillData`(+ `Branch` enum, `Requirement` struct). `calcStats` → `StatCalculator.Calculate(Dictionary<string,int>)`.
- `skilltree.ts` → 순수 C# 정적 클래스 `SkillTree`(MonoBehaviour 아님). `skill:*` 이벤트 → `event Action<int>`.
- 스킬 창 → UGUI/UI Toolkit 프리팹 1개(가지 4열, 노드 버튼).
