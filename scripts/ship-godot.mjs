// Vercel 빌드 마무리: Vite 로 만든 기존 웹 게임은 /classic 으로 옮기고, 루트(/)에는 Godot 웹 빌드(godot-web/)를 올린다.
// Godot 빌드는 godot/build-web.sh 로 만들어 godot-web/ 에 커밋해 둔다. 되돌리려면 vercel.json 의 buildCommand 를 `npm run build` 로 돌리면 된다.
import { cpSync, existsSync, renameSync } from 'node:fs';

if (!existsSync('godot-web/index.html')) throw new Error('godot-web/index.html 이 없다');
renameSync('dist/index.html', 'dist/classic.html');
cpSync('godot-web', 'dist', { recursive: true });
console.log('ship-godot: / = Godot, /classic = 기존 웹 게임');
