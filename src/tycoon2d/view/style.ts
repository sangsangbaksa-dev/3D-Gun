// 2D 타이쿤 화면 스타일 (DOM/CSS). 한 번만 <style>로 붙인다.
// 팔레트는 타이틀(src/title/style.ts)과 같다: 붉은 하늘 + 주황(행동) + 청록(정보). 배경 그림은 public/hub/ (tools/hub-art 로 생성).
const ART = `${import.meta.env.BASE_URL}hub/`;
const FONT = "Pretendard,'Pretendard Variable','Malgun Gothic','Apple SD Gothic Neo',system-ui,sans-serif";

export const CSS = `
#t2d{--or:#FF8A2A;--te:#2EE6D6;--rd:#E0303A;--gd:#ffc94a;--ink:#07090d;--glass:rgba(14,8,10,.72);--glass2:rgba(22,12,14,.82);--line:rgba(255,170,120,.14);
  position:fixed;inset:0;z-index:60;display:none;flex-direction:column;color:#efe6e2;font-family:${FONT};background:#0a0507;overflow:hidden;user-select:none}
#t2d.open{display:flex;animation:t2dIn .45s ease-out}
@keyframes t2dIn{from{opacity:0;transform:scale(1.015)}to{opacity:1;transform:none}}
#t2d .bgimg{position:absolute;inset:-2%;background:url(${ART}bg.webp) center 45%/cover no-repeat;animation:t2dPan 60s ease-in-out infinite alternate;pointer-events:none}
#t2d .bgimg::after{content:"";position:absolute;inset:0;background:
  linear-gradient(90deg,#0a0507e6 0,#0a050799 13%,#0a050726 40%,#0a050726 62%,#0a0507a6 80%,#0a0507ee 100%),
  linear-gradient(#0a0507d9 0,#0a050733 22%,#0a050700 50%,#0a0507cc 100%)}
#t2d[data-bg=shop] .bgimg{background-image:url(${ART}shop.webp);filter:brightness(1.35) saturate(1.1)}
#t2d[data-bg=lab] .bgimg{background-image:url(${ART}lab.webp)}
#t2d[data-bg=outpost] .bgimg{background-image:url(${ART}outpost.webp)}
#t2d[data-bg=turret] .bgimg{background-image:url(${ART}turret.webp)}
#t2d[data-bg=base] .bgimg{background-image:url(${ART}base.webp)}
/* 탭 그림이 있을 때는 가운데를 덜 가려 그림이 보이게 한다 (양옆 글자 쪽만 어둡게) */
#t2d[data-bg]:not([data-bg=""]) .bgimg::after{background:
  linear-gradient(90deg,#0a0507d9 0,#0a050766 14%,#0a050700 38%,#0a050700 64%,#0a050773 82%,#0a0507e0 100%),
  linear-gradient(#0a0507a6 0,#0a050700 20%,#0a050700 62%,#0a050799 100%)}
@keyframes t2dPan{to{transform:scale(1.06) translate(-1%,-1%)}}
#t2d .bgfx{position:absolute;inset:0;pointer-events:none;
  background:repeating-linear-gradient(0deg,#0000 0 2px,#0000002e 2px 3px),
  linear-gradient(#2EE6D608 1px,transparent 1px) 0 0/56px 56px,linear-gradient(90deg,#2EE6D608 1px,transparent 1px) 0 0/56px 56px}
#t2d .embers{position:absolute;inset:0;pointer-events:none;overflow:hidden}
#t2d .embers i{position:absolute;bottom:-12px;width:3px;height:3px;border-radius:50%;background:var(--or);box-shadow:0 0 6px var(--or),0 0 12px var(--rd);animation:t2dEmber linear infinite;opacity:0}
@keyframes t2dEmber{0%{transform:translate(0,0);opacity:0}10%{opacity:.9}100%{transform:translate(80px,-104vh);opacity:0}}

/* 머리글 */
#t2d header{position:relative;padding:14px 24px 12px;display:flex;gap:16px;align-items:center;flex-wrap:wrap;background:linear-gradient(#0a0507ee,#0a0507aa)}
#t2d header::after,#t2d footer::before{content:"";position:absolute;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--or) 20%,#FF8A2A55 60%,transparent)}
#t2d header::after{bottom:0}#t2d footer::before{top:0}
#t2d .emblem{width:48px;height:48px;flex:none;display:grid;place-items:center;color:var(--te);border:1px solid #2EE6D666;border-radius:10px;background:radial-gradient(#2EE6D622,#2EE6D605 70%);box-shadow:0 0 18px #2EE6D633,inset 0 0 12px #2EE6D622}
#t2d .emblem .si{animation:t2dSpin 14s linear infinite}
@keyframes t2dSpin{to{transform:rotate(360deg)}}
#t2d h1{margin:0;font-size:24px;font-weight:800;letter-spacing:.5px;line-height:1.15;text-shadow:0 2px 12px #000}
#t2d h1 .kick{display:block;font-size:10.5px;font-weight:700;letter-spacing:4px;color:var(--or);margin-bottom:2px}
#t2d h1 small{display:block;font-size:12px;font-weight:400;color:#c9b5ad;opacity:.8;margin-top:3px;letter-spacing:0}
#t2d .report{flex:1;min-width:260px;display:flex;gap:8px;flex-wrap:wrap;align-items:center;justify-content:flex-end}
#t2d .rchip{background:var(--glass);border:1px solid var(--line);border-left:3px solid var(--or);border-radius:4px;padding:5px 12px;font-size:13px;animation:t2dPop .5s both;backdrop-filter:blur(4px)}
#t2d .rchip.best{border-color:#ffc94a88;border-left-color:var(--gd);color:#ffe08a;background:#3a2a0ccc}
@keyframes t2dPop{from{opacity:0;transform:translateY(8px) scale(.94)}to{opacity:1;transform:none}}

/* 지갑 */
#t2d .wallet{position:relative;display:flex;gap:8px;flex-wrap:wrap;padding:10px 24px}
#t2d .coin{display:flex;align-items:center;gap:8px;background:var(--glass);border:1px solid var(--line);border-radius:6px;padding:5px 12px 5px 6px;min-width:108px;backdrop-filter:blur(6px)}
#t2d .coin .ic{width:30px;height:30px;border-radius:5px;display:grid;place-items:center;background:#FF8A2A1a;color:var(--or);flex:none}
#t2d .coin[data-k=gold] .ic{background:#ffc94a22;color:var(--gd)}
#t2d .coin[data-k=samples] .ic,#t2d .coin[data-k=samplesSp] .ic{background:#2EE6D61a;color:var(--te)}
#t2d .coin[data-k=skillPoints] .ic{background:#b98cff22;color:#c9a6ff}
#t2d .coin .lb{font-size:10px;color:#a8928a;letter-spacing:.5px;line-height:1}
#t2d .coin .v{font-weight:800;font-variant-numeric:tabular-nums;font-size:16px;line-height:1.25}
#t2d .coin .r{font-size:10.5px;color:var(--te);min-height:12px;line-height:1}

/* 본문 */
#t2d main{position:relative;flex:1;display:flex;min-height:0}
#t2d nav{width:168px;padding:10px 10px 10px 16px;display:flex;flex-direction:column;gap:6px;overflow:auto}
#t2d nav button{display:flex;align-items:center;gap:10px;background:var(--glass);color:#d9c9c3;border:1px solid var(--line);border-radius:6px;padding:7px 10px 7px 7px;text-align:left;cursor:pointer;font:inherit;font-size:14px;font-weight:600;transition:.15s;backdrop-filter:blur(6px);position:relative}
#t2d nav .ni{width:30px;height:30px;display:grid;place-items:center;border-radius:5px;background:#ffffff0a;color:var(--tc);flex:none;transition:.15s}
#t2d nav button:hover{border-color:#2EE6D655;transform:translateX(2px);color:#fff}
#t2d nav button.on{color:#fff;border-color:var(--or);background:linear-gradient(90deg,#FF8A2A44,#FF8A2A0d 75%),var(--glass2);box-shadow:0 0 18px #FF8A2A33}
#t2d nav button.on::before{content:"";position:absolute;left:-1px;top:6px;bottom:6px;width:3px;border-radius:2px;background:var(--or);box-shadow:0 0 8px var(--or)}
#t2d nav button.on .ni{background:var(--or);color:var(--ink)}
#t2d .content{flex:1;overflow:auto;padding:10px 16px 18px;min-width:0}
#t2d .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(224px,1fr));gap:12px}

/* 카드 */
#t2d .tone-orange{--tc:#FF8A2A}#t2d .tone-teal{--tc:#2EE6D6}#t2d .tone-red{--tc:#ff5560}#t2d .tone-green{--tc:#7be08a}#t2d .tone-gold{--tc:#ffc94a}#t2d .tone-violet{--tc:#c9a6ff}
#t2d .card{position:relative;background:url(${ART}grunge.webp) 0 0/256px,linear-gradient(165deg,rgba(34,16,18,.9),rgba(12,7,9,.94));background-blend-mode:soft-light,normal;
  border:1px solid #ffffff12;border-radius:4px;padding:12px 14px;display:flex;flex-direction:column;gap:7px;transition:transform .15s,box-shadow .2s,border-color .2s;animation:t2dPop .4s both;backdrop-filter:blur(6px)}
#t2d .card::before{content:"";position:absolute;left:14px;right:14px;top:-1px;height:2px;background:linear-gradient(90deg,var(--tc),transparent);opacity:.75}
#t2d .card .cn{position:absolute;width:12px;height:12px;border:0 solid var(--tc);opacity:.85;pointer-events:none}
#t2d .card .cn.tl{left:-1px;top:-1px;border-top-width:2px;border-left-width:2px}
#t2d .card .cn.br{right:-1px;bottom:-1px;border-bottom-width:2px;border-right-width:2px}
#t2d .card:hover{transform:translateY(-2px);box-shadow:0 10px 26px #000a,0 0 0 1px #ffffff1c}
#t2d .card.can{border-color:#2EE6D640;box-shadow:0 0 16px #2EE6D61c}
#t2d .card.maxed{--tc:#ffc94a;border-color:#ffc94a55;background:url(${ART}grunge.webp) 0 0/256px,linear-gradient(165deg,rgba(52,38,12,.92),rgba(18,13,6,.95));background-blend-mode:soft-light,normal}
#t2d .card.lock{filter:saturate(.35) brightness(.7)}
#t2d .card.lock:hover{transform:none}
#t2d .card.flash{animation:t2dFlash .6s}
@keyframes t2dFlash{0%{box-shadow:0 0 0 0 #2EE6D6cc;transform:scale(1.03)}100%{box-shadow:0 0 0 18px #2EE6D600;transform:none}}
#t2d .card .top{display:flex;gap:12px;align-items:center}
#t2d .card .ico{width:50px;height:50px;border-radius:6px;flex:none;display:grid;place-items:center;color:var(--tc);font-size:28px;
  background:radial-gradient(circle at 50% 40%,color-mix(in srgb,var(--tc) 26%,transparent),color-mix(in srgb,var(--tc) 6%,transparent) 70%);border:1px solid color-mix(in srgb,var(--tc) 45%,transparent);box-shadow:inset 0 0 14px color-mix(in srgb,var(--tc) 22%,transparent)}
#t2d .card .ico .si{width:30px;height:30px;filter:drop-shadow(0 0 4px color-mix(in srgb,var(--tc) 70%,transparent))}
#t2d .card .nm{font-weight:800;font-size:15.5px;text-shadow:0 1px 6px #000}
#t2d .card .lv{font-size:11.5px;color:#b9a49c;font-variant-numeric:tabular-nums;letter-spacing:.3px}
#t2d .card .ds{font-size:12.5px;color:#d6c6c0;min-height:32px;line-height:1.45}
#t2d .card .eff{font-size:12px;color:var(--te)}
#t2d .card .eff:empty{display:none}
#t2d .pips{display:flex;gap:3px}
#t2d .pip{flex:1;max-width:18px;height:6px;border-radius:1px;background:#ffffff14;transform:skewX(-20deg)}
#t2d .pip.f{background:var(--tc);box-shadow:0 0 6px color-mix(in srgb,var(--tc) 70%,transparent)}
#t2d .costs{display:flex;gap:5px;flex-wrap:wrap}
#t2d .cost{display:inline-flex;align-items:center;gap:4px;background:#00000066;border:1px solid #ffffff10;border-radius:4px;padding:2px 8px 2px 5px;font-size:12px;font-weight:600;font-variant-numeric:tabular-nums}
#t2d .cost .si{color:var(--or)}
#t2d .cost.bad{color:#ff8e8e;background:#3a0f12aa;border-color:#ff556033}
#t2d .cost.bad .si{color:#ff8e8e}
#t2d .buy{margin-top:auto;background:var(--or);color:var(--ink);border:0;border-radius:5px;padding:9px 10px;font:inherit;font-weight:800;font-size:14px;letter-spacing:1px;cursor:pointer;transition:.12s;box-shadow:0 3px 0 #8a3a08,0 0 16px #FF8A2A44}
#t2d .buy:hover:not(:disabled){background:#ffa557;box-shadow:0 3px 0 #8a3a08,0 0 0 2px var(--te),0 0 22px #FF8A2A88}
#t2d .buy:active:not(:disabled){transform:translateY(3px);box-shadow:0 0 0 #8a3a08}
#t2d .buy:disabled{background:#2a1c1e;color:#8f7b76;box-shadow:0 3px 0 #150c0d;cursor:not-allowed}
#t2d .card.maxed .buy{background:linear-gradient(#ffd76a,#d99a1c);color:#2a1a02;box-shadow:0 3px 0 #6b4a08;cursor:default}

/* 오른쪽 패널 */
#t2d aside{width:290px;padding:10px 16px 14px 6px;display:flex;flex-direction:column;gap:12px;overflow:auto}
#t2d .exchange,#t2d .panelbox{position:relative;background:var(--glass);border:1px solid var(--line);border-radius:4px;padding:12px 12px 10px;backdrop-filter:blur(8px)}
#t2d .exchange::before,#t2d .panelbox::before{content:"";position:absolute;left:-1px;top:-1px;width:12px;height:12px;border-top:2px solid var(--te);border-left:2px solid var(--te)}
#t2d .exchange h3,#t2d .panelbox h3{display:flex;align-items:center;gap:6px;margin:0 0 4px;font-size:14px;color:var(--te);letter-spacing:.5px}
#t2d .exchange .ex-sub{margin:0 0 6px;font-size:11px;line-height:1.45;color:#a8928a}
#t2d .ex-row{padding:7px 0;border-bottom:1px solid #ffffff0d;font-size:12px}
#t2d .ex-row:last-child{border-bottom:0}
#t2d .ex-row .n{display:flex;align-items:center;gap:6px;margin-bottom:5px;color:#e6d8d2}
#t2d .ex-row .n .si{color:var(--or)}
#t2d .ex-row .n .own{color:#a8928a;font-variant-numeric:tabular-nums;margin-right:auto}
#t2d .ex-row .px{font-size:10.5px;padding:1px 6px;border-radius:3px;font-variant-numeric:tabular-nums}
#t2d .ex-row .px.ps{color:var(--te);background:#2EE6D614}
#t2d .ex-row .px.pb{color:var(--or);background:#FF8A2A14}
#t2d .ex-row .btns{display:grid;grid-template-columns:repeat(4,1fr);gap:3px}
#t2d .ex-btn{background:#2EE6D60f;color:var(--te);border:1px solid #2EE6D655;border-radius:4px;padding:4px 2px;font:inherit;font-size:11px;cursor:pointer;font-weight:700;transition:.12s}
#t2d .ex-btn:hover{background:#2EE6D62a}
#t2d .ex-btn:nth-child(3),#t2d .ex-btn:nth-child(4){background:#FF8A2A0f;color:var(--or);border-color:#FF8A2A55}
#t2d .ex-btn:nth-child(3):hover,#t2d .ex-btn:nth-child(4):hover{background:#FF8A2A2a}
#t2d .panelbox{font-size:12.5px;line-height:1.75}
#t2d .panelbox div{display:flex;justify-content:space-between;gap:8px;border-bottom:1px dashed #ffffff0c}
#t2d .panelbox div span{color:#bba7a0}
#t2d .panelbox div b{font-variant-numeric:tabular-nums;color:#fff}

/* 바닥글 */
#t2d footer{position:relative;padding:12px 24px;display:flex;gap:12px;align-items:center;justify-content:space-between;background:linear-gradient(#0a0507aa,#0a0507f2)}
#t2d footer .fl{display:flex;gap:8px;flex-wrap:wrap}
#t2d .ghost{display:inline-flex;align-items:center;gap:6px;background:#121A20b3;color:var(--te);border:1px solid #2EE6D688;border-radius:6px;padding:7px 12px;font:inherit;font-size:12.5px;font-weight:600;cursor:pointer;transition:.2s}
#t2d .ghost:hover{background:#2EE6D61f;box-shadow:0 0 12px #2EE6D655}
#t2d .ghost[data-act=reset]{color:#ff8e8e;border-color:#ff556066;background:#2a0c0eb3}
#t2d .ghost[data-act=reset]:hover{background:#ff55601f;box-shadow:0 0 12px #ff556044}
#t2d .launch{display:inline-flex;align-items:center;gap:12px;background:var(--or);color:var(--ink);border:0;border-radius:6px;padding:13px 34px;font:inherit;font-size:21px;font-weight:900;letter-spacing:3px;cursor:pointer;box-shadow:0 0 24px #FF8A2Aaa;animation:t2dBeat 1.8s ease-in-out infinite;transition:background .18s,transform .18s,box-shadow .18s}
#t2d .launch .si{width:24px;height:24px;stroke-width:2.2}
#t2d .launch .chev{font-size:16px;letter-spacing:-2px;opacity:.55;animation:t2dChev 1.2s ease-in-out infinite}
#t2d .launch .chev.r{animation-direction:reverse}
#t2d .launch:hover{background:#ffa557;transform:translateY(-2px);box-shadow:0 0 0 2px var(--te),0 0 32px #FF8A2Acc;animation:none}
#t2d .launch:active{background:#e8761c;transform:translateY(1px) scale(.97)}
@keyframes t2dBeat{50%{box-shadow:0 0 8px #FF8A2A66}}
@keyframes t2dChev{50%{opacity:1}}
#t2d button:focus-visible{outline:2px solid var(--te);outline-offset:2px}

#t2d .si{width:22px;height:22px;flex:none;display:block}
#t2d .si.big{width:28px;height:28px}
#t2d .si.sm{width:16px;height:16px}
#t2d .si.xs{width:13px;height:13px}
#t2d .emo{font-size:20px;line-height:1}
#t2d .float{position:fixed;pointer-events:none;font-weight:900;color:var(--te);text-shadow:0 0 8px #2EE6D6aa,0 2px 4px #000;animation:t2dFloat .9s ease-out forwards;z-index:70;letter-spacing:1px}
@keyframes t2dFloat{to{transform:translateY(-60px);opacity:0}}
#t2d .toast2{position:absolute;left:50%;bottom:88px;transform:translateX(-50%);background:#0a0507e6;border:1px solid #FF8A2A66;padding:8px 20px;border-radius:6px;font-size:14px;font-weight:600;animation:t2dToast 2s forwards;pointer-events:none;box-shadow:0 0 18px #FF8A2A33}
@keyframes t2dToast{0%{opacity:0;transform:translate(-50%,10px)}10%,80%{opacity:1;transform:translate(-50%,0)}100%{opacity:0}}
#t2d .sect{margin:8px 2px 2px;font-size:12px;font-weight:800;letter-spacing:2px;color:var(--or);grid-column:1 / -1;display:flex;align-items:center;gap:10px}
#t2d .sect::after{content:"";flex:1;height:1px;background:linear-gradient(90deg,#FF8A2A66,transparent)}
#t2d .content>.sect{margin-bottom:10px;letter-spacing:.3px;font-weight:500;color:#c9b5ad;font-size:12.5px}
#t2d .content>.sect::after{display:none}
#t2d .content,#t2d aside,#t2d nav{scrollbar-width:thin;scrollbar-color:#FF8A2A55 transparent}
@media(max-width:1100px){#t2d aside{width:250px}#t2d .wallet{gap:6px}#t2d .coin{min-width:0;padding-right:10px}#t2d .coin .lb{display:none}#t2d .coin .ic{width:26px;height:26px}}
@media(max-width:900px){#t2d aside{display:none}#t2d nav{width:64px;padding-left:10px}#t2d nav .nl{display:none}#t2d .coin{min-width:0}}
@media(prefers-reduced-motion:reduce){#t2d .bgimg,#t2d .embers i,#t2d .emblem .si,#t2d .launch,#t2d .launch .chev{animation:none}}
`;
