// 빨간 하늘 빌드(recovered/cli-build-2026-10-23)의 타이틀·인트로·튜토리얼 CSS 를 옮겨 온 것.
export const TEAL = '#2EE6D6';
export const ORANGE = '#FF8A2A';
export const RED = '#E0303A';
const FONT = "Pretendard,'Pretendard Variable','Malgun Gothic','Apple SD Gothic Neo',system-ui,sans-serif";
const STORY_FADE = 0.4;

export const TITLE_CSS = `
body.titleOn>:not(#c):not(#ztTitle):not(script):not(style){opacity:0!important;visibility:hidden!important}
body.hudIn>:not(#c):not(#ztTitle):not(script):not(style){transition:opacity .45s ease-out,visibility 0s}
#ztTitle{position:fixed;inset:0;z-index:66;overflow:hidden;font-family:${FONT};color:#e6f2f1;user-select:none;
  background:linear-gradient(#0000 55%,#0a0306aa),linear-gradient(#ff8a2a14,#0000 40%);transition:opacity .6s cubic-bezier(.4,0,.2,1)}
#ztTitle.hide{opacity:0;pointer-events:none}
#ztTitle.hide .ui,#ztTitle.hide .go{transition:opacity .4s ease-out,transform .6s cubic-bezier(.4,0,.2,1);opacity:0}
#ztTitle.hide .ui{transform:translateY(-8px)}#ztTitle.hide .go{transform:translate(-50%,10px)}
#ztTitle .ember{position:absolute;bottom:-10px;width:3px;height:3px;border-radius:50%;background:${ORANGE};box-shadow:0 0 6px ${ORANGE},0 0 12px ${RED};animation:tbEmber linear infinite}
#ztTitle .scan{position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,#0000 0 2px,#0004 2px 3px);mix-blend-mode:multiply}
#ztTitle .vig{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 50%,#0000 55%,#0000004d 100%)}
#ztTitle .ui{position:absolute;left:32px;top:24px}
#ztTitle .go{position:absolute;left:50%;bottom:9%;transform:translateX(-50%);text-align:center}
#ztTitle .ui img{display:block;width:min(380px,50vw);filter:drop-shadow(0 0 18px ${TEAL}88);animation:tbGlow 3.2s ease-in-out infinite}
#ztTitle .ui .sub{margin-top:6px;font-size:20px;letter-spacing:6px;color:rgba(46,230,214,.6);text-shadow:0 0 10px ${RED}}
#ztTitle .go button{padding:12px 44px;font-family:inherit;font-weight:800;font-size:20px;color:#07090d;background:${ORANGE};border:0;border-radius:6px;cursor:pointer;box-shadow:0 0 24px ${ORANGE}aa;animation:tbPulseBtn 1.8s ease-in-out infinite;outline:none;transition:background .18s ease-out,transform .18s ease-out,box-shadow .18s ease-out,color .18s}
#ztTitle .go button:hover{background:#ffa557;transform:translateY(-2px);box-shadow:0 0 0 2px ${TEAL},0 0 30px ${ORANGE}cc;animation:none}
#ztTitle .go button:focus-visible{box-shadow:0 0 0 3px #07090d,0 0 0 5px ${TEAL},0 0 28px ${TEAL}88;animation:none}
#ztTitle .go button:active{background:#e8761c;transform:translateY(1px) scale(.97);box-shadow:0 0 0 2px ${TEAL},0 0 12px ${ORANGE}88;transition-duration:.06s}
#ztTitle .go button:disabled{cursor:default}
#ztTitle .go .hint{margin-top:10px;font-size:13px;opacity:.6}
@keyframes tbEmber{0%{transform:translate(0,0);opacity:0}10%{opacity:1}100%{transform:translate(60px,-105vh);opacity:0}}
@keyframes tbGlow{50%{filter:drop-shadow(0 0 26px ${TEAL}bb) drop-shadow(0 0 6px ${TEAL}55)}}
@keyframes tbPulseBtn{50%{box-shadow:0 0 8px ${ORANGE}66}}

#ztTitle .tmenu{position:absolute;right:28px;bottom:28px;display:flex;gap:10px;z-index:2}
#ztTitle .tmenu button,#ztTitle .tpanel .x{padding:8px 18px;font:600 15px ${FONT};color:${TEAL};background:#121A20b3;border:1px solid ${TEAL};border-radius:6px;cursor:pointer;transition:background .25s ease-out,box-shadow .25s ease-out}
#ztTitle .tmenu button:hover,#ztTitle .tmenu button[aria-expanded=true],#ztTitle .tpanel .x:hover{background:#2EE6D61f;box-shadow:0 0 12px #2EE6D655}
#ztTitle .tmenu button:focus-visible,#ztTitle .tpanel .x:focus-visible{outline:2px solid ${TEAL};outline-offset:2px}
#ztTitle .tpanel{position:absolute;right:24px;top:24px;width:min(420px,calc(100vw - 48px));max-height:min(70vh,calc(91vh - 136px));overscroll-behavior:contain;overflow:auto;box-sizing:border-box;padding:16px 18px;background:#121A20b3;border:1px solid ${TEAL};border-radius:8px;color:#e6f2f1;font:14px/1.5 ${FONT};backdrop-filter:blur(6px);transform:translateY(-16px);opacity:0;visibility:hidden;transition:transform .25s ease-out,opacity .25s ease-out,visibility 0s .25s;z-index:2;scrollbar-width:thin;scrollbar-color:#2EE6D655 transparent}
#ztTitle .tpanel.open{transform:none;opacity:1;visibility:visible;transition:transform .25s ease-out,opacity .25s ease-out}
#ztTitle .tpanel h3{margin:0 0 10px;font-size:16px;color:${TEAL};display:flex;justify-content:space-between;align-items:center}
#ztTitle .tpanel .x{padding:2px 10px;font-size:13px}
#ztTitle .tpanel .g{margin:10px 0 4px;font-size:12px;color:#2EE6D6aa;letter-spacing:1px}
#ztTitle .tpanel .g:first-of-type{margin-top:0}
#ztTitle .tpanel .r{display:flex;justify-content:space-between;align-items:baseline;gap:12px;padding:4px 0;border-bottom:1px solid #2EE6D614}
#ztTitle .tpanel .r.c{align-items:center}
#ztTitle .tpanel .cols .r{font-size:13px;padding:3px 0}
#ztTitle .tpanel kbd{font:600 12px ui-monospace,monospace;color:${ORANGE};white-space:nowrap}
#ztTitle .tpanel output{font:600 12px ui-monospace,monospace;color:${ORANGE};min-width:3.2em;text-align:right}
#ztTitle .tpanel input[type=range]{width:120px;accent-color:${TEAL}}
#ztTitle .tpanel .ctl{display:flex;align-items:center;gap:8px}
#ztTitle .tpanel kbd.zk{font:700 12px/1.45 ${FONT};color:#e9fbf9}
#ztTitle .tpanel .zk-grp h4{color:#2EE6D6aa}
#ztTitle .tpanel .khint{margin:8px 0 0;font-size:12px;color:#9aa8ba}
#ztTitle .tpanel .x:disabled{opacity:.7;cursor:default}

#ztTitle .intro{position:absolute;inset:0;z-index:5;background:#000;display:flex;align-items:center;justify-content:center;transition:opacity .6s ease-out;cursor:default}
#ztTitle .intro.out{opacity:0;pointer-events:none}
#ztTitle .intro p{margin:0;padding:0 6vw;max-width:1100px;text-align:center;font:600 clamp(18px,2.4vw,32px)/1.5 ${FONT};letter-spacing:.5px;color:#e6f2f1;text-shadow:0 0 18px #2EE6D633;transition:opacity ${STORY_FADE}s ease-out;word-break:keep-all}
#ztTitle .intro p.fade{opacity:0}
#ztTitle .intro p.wait{font-size:15px;font-weight:500;color:${TEAL};opacity:.7}
#ztTitle .intro p.em{color:${ORANGE};text-shadow:0 0 22px #FF8A2A66}
#ztTitle .intro p .cur{display:inline-block;width:.5em;border-bottom:2px solid ${TEAL};margin-left:2px;animation:ztCur .8s steps(1) infinite}
#ztTitle .intro .skip{position:absolute;right:24px;bottom:20px;font:13px system-ui,sans-serif;color:${TEAL};opacity:.55}
#ztTitle .intro .art{position:absolute;inset:0;overflow:hidden}
#ztTitle .intro .art i{position:absolute;inset:-3%;background:#000 center/cover no-repeat;opacity:0;transform:scale(1);transition:opacity 1.2s ease-out;will-change:opacity,transform}
#ztTitle .intro .art i.on{opacity:1;animation:ztKen 22s ease-out forwards}
#ztTitle .intro .art::after{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 75% 70% at 50% 45%,#0000 40%,#000a 100%),linear-gradient(#0000 55%,#000d 100%)}
#ztTitle .intro.story .art i{filter:brightness(.72) saturate(.95)}
#ztTitle .intro.story .art::after{background:radial-gradient(ellipse 80% 70% at 50% 40%,#0000 35%,#000b 100%),linear-gradient(#0000 45%,#000e 88%)}
#ztTitle .intro .ilogo{position:absolute;left:50%;top:9%;width:min(440px,56vw);transform:translateX(-50%);filter:drop-shadow(0 0 22px #2EE6D688) drop-shadow(0 6px 18px #000);transition:opacity .5s ease-out}
#ztTitle .intro.story .ilogo{opacity:0}
#ztTitle .intro p{position:relative}
#ztTitle .intro{align-items:flex-end}
#ztTitle .intro p{margin-bottom:11vh;text-shadow:0 2px 12px #000,0 0 18px #2EE6D633}
#ztTitle .intro p.wait{padding:9px 22px;border:1px solid #2EE6D666;border-radius:999px;background:#07090dcc;opacity:1;color:${TEAL};animation:ztWait 2.2s ease-in-out infinite;backdrop-filter:blur(4px)}
@keyframes ztKen{from{transform:scale(1.0) translate(0,0)}to{transform:scale(1.07) translate(-1%,-1%)}}
@keyframes ztWait{50%{box-shadow:0 0 18px #2EE6D655;border-color:${TEAL}}}
@keyframes ztCur{50%{opacity:0}}

@media (max-width:600px){
#ztTitle .ui{left:16px;top:16px}#ztTitle .ui img{width:min(300px,70vw)}#ztTitle .ui .sub{font-size:15px;letter-spacing:4px}
#ztTitle .tmenu{right:16px;bottom:16px}#ztTitle .go{bottom:calc(16px + 64px)}
#ztTitle .tpanel{right:16px;top:16px;width:calc(100vw - 32px)}
}
@media (prefers-reduced-motion:reduce){
#ztTitle *,#ztTitle{animation:none!important}#ztTitle .ember{display:none}
#ztTitle .go button,#ztTitle.hide .ui,#ztTitle.hide .go{transition:background .1s,opacity .4s!important}
#ztTitle .go,#ztTitle.hide .go{transform:translateX(-50%)!important}#ztTitle.hide .ui{transform:none!important}
#ztTitle .tpanel,#ztTitle .tpanel.open{transform:none;transition:opacity .1s,visibility 0s}
#ztTitle .intro p{transition:none}
}
`;

export const STORY_FADE_S = STORY_FADE;

export const TUTORIAL_CSS = `
#ztTut{position:fixed;left:50%;top:104px;transform:translate(-50%,-6px);z-index:7;pointer-events:none;box-sizing:border-box;width:max-content;max-width:min(560px,calc(100vw - 32px));padding:8px 14px 7px;border:1px solid ${TEAL};border-radius:8px;background:#121A20d9;color:#e6f2f1;font:600 15px ${FONT};opacity:0;transition:opacity .3s ease-out,transform .3s ease-out;box-shadow:0 6px 24px #0008}
#ztTut.on{opacity:1;transform:translate(-50%,0)}
#ztTut .tt-top{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
#ztTut .tt-n{color:${TEAL};font-weight:700;font-size:13px}
#ztTut .tt-k{display:inline-flex;align-items:center;gap:2px}
#ztTut .tt-k kbd.zk{font-size:14px;padding:1px 8px;border-color:${ORANGE};color:#fff}
#ztTut .tt-t{font-size:16px}
#ztTut .tt-skip{margin-left:auto;pointer-events:auto;cursor:pointer;font:600 12px ${FONT};color:#9aa8ba;background:transparent;border:1px solid #ffffff33;border-radius:5px;padding:2px 9px}
#ztTut .tt-skip:hover{color:${TEAL};border-color:${TEAL}}
#ztTut .tt-why{margin-top:4px;font-weight:500;font-size:13px;color:#c9d6dc;line-height:1.45}
#ztTut .tt-hint{margin-top:3px;font-weight:600;font-size:12.5px;color:${ORANGE}}
#ztTut .tt-foot{margin-top:4px;font-weight:500;font-size:11px;color:#7f8d9e}
@media (prefers-reduced-motion:reduce){#ztTut{transition:opacity .1s;transform:translate(-50%,0)}}
`;
