# 모듈: 오디오 (`src/audio/`)

WebAudio 합성음만 사용한다(파일 에셋 없음, 번들 가벼움).

## 구조
| 경로 | 역할 | 엔진 의존 |
|------|------|-----------|
| `logic/cues.ts` | 이벤트→효과음 매핑, 재생 간격 제한(`CueGate`), 배경 드론 목표값 | 없음 |
| `view/synth.ts` | `AudioContext`, 레시피 재생, 드론, 음소거 저장(localStorage) | WebAudio |
| `index.ts` | `AudioSystem`(이벤트 구독), `playSfx(id)`, `audio.{unlock,toggleMute}` | |

## 데이터 모델
`SFX: Record<SfxId, SfxDef>` (src/data): `{ vol, cooldown, jitter, layers: [{kind:'osc'|'noise', wave, f0, f1, dur, gain, delay, attack, filter}] }`. 직렬화 가능.

## 이벤트 → 소리
`weapon:fired`(권총/샷건/기관총), `player:hit`, `enemy:killed`, `zombie:stunned`, `wave:start/clear`, `boss:spawn/dead`, `chest:opened`(보상 등급별), `resource:gathered`, `zombie:converted`, `building:placed`, `core:damaged`, `ally:dead`, `player:dead`, `game:end`. UI 소리는 `playSfx('click'|'buy'|'deny'|'levelUp')`.

## 규칙
- 브라우저 정책상 첫 클릭/키 입력에서 `AudioContext` 를 연다. M 키/일시정지 화면 버튼으로 음소거.
- 배경 드론은 단계(`prep`/`combat`)와 보스 존재에 따라 볼륨/필터가 변한다.

## Unity(C#) 메모
`SfxDef` → ScriptableObject(AudioClip + 볼륨/쿨다운/피치 지터). `CueGate` → 정적 클래스. `Synth` → `AudioSource` 풀 + `AudioMixer`(Master/SFX/Ambient).
