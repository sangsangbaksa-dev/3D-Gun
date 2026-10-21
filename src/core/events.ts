// 모듈 간 느슨한 통신용 이벤트 버스. 이벤트 이름은 아래 GameEvents 에 추가한다.
export interface GameEvents {
  'wave:start': { wave: number };
  'wave:clear': { wave: number };
  'player:dead': undefined;
  'enemy:killed': { x: number; z: number; type: string; byAlly: boolean };
  'toast': { text: string };
}

type Handler<T> = (payload: T) => void;
const handlers = new Map<string, Handler<never>[]>();

export const events = {
  on<K extends keyof GameEvents>(name: K, fn: Handler<GameEvents[K]>) {
    const list = handlers.get(name) ?? [];
    list.push(fn as Handler<never>);
    handlers.set(name, list);
  },
  emit<K extends keyof GameEvents>(name: K, payload: GameEvents[K]) {
    handlers.get(name)?.forEach((fn) => (fn as Handler<GameEvents[K]>)(payload));
  },
};
