// 2D 타이쿤 화면 스타일 (DOM/CSS). 한 번만 <style>로 붙인다.
export const CSS = `
#t2d{position:fixed;inset:0;z-index:60;display:none;flex-direction:column;color:#e9eef5;font-family:'Malgun Gothic','Apple SD Gothic Neo',system-ui,sans-serif;
  background:radial-gradient(1200px 700px at 20% -10%,#24344a 0,#121923 55%,#0b0f15 100%);overflow:hidden;user-select:none}
#t2d.open{display:flex;animation:t2dIn .35s ease-out}
@keyframes t2dIn{from{opacity:0;transform:scale(1.02)}to{opacity:1;transform:none}}
#t2d .bgfx{position:absolute;inset:0;background-image:linear-gradient(#ffffff08 1px,transparent 1px),linear-gradient(90deg,#ffffff08 1px,transparent 1px);background-size:44px 44px;animation:t2dGrid 24s linear infinite;pointer-events:none}
@keyframes t2dGrid{to{background-position:44px 44px}}
#t2d header{position:relative;padding:14px 22px 10px;display:flex;gap:18px;align-items:center;flex-wrap:wrap;border-bottom:1px solid #ffffff14;background:#0b0f1599;backdrop-filter:blur(4px)}
#t2d h1{margin:0;font-size:22px;letter-spacing:.5px}
#t2d h1 small{display:block;font-size:12px;font-weight:400;opacity:.65;margin-top:2px}
#t2d .report{flex:1;min-width:260px;display:flex;gap:8px;flex-wrap:wrap;align-items:center}
#t2d .rchip{background:#1d2a3b;border:1px solid #ffffff1f;border-radius:20px;padding:4px 12px;font-size:13px;animation:t2dPop .5s both}
#t2d .rchip.best{background:#4a3a12;border-color:#ffd24d88;color:#ffe08a}
@keyframes t2dPop{from{opacity:0;transform:translateY(8px) scale(.9)}to{opacity:1;transform:none}}
#t2d .wallet{position:relative;display:flex;gap:8px;flex-wrap:wrap;padding:10px 22px;background:#0a0e14aa;border-bottom:1px solid #ffffff10}
#t2d .coin{display:flex;align-items:center;gap:6px;background:#17202d;border:1px solid #ffffff17;border-radius:10px;padding:5px 10px;min-width:104px}
#t2d .coin .ic{font-size:18px}
#t2d .coin .v{font-weight:700;font-variant-numeric:tabular-nums;font-size:15px}
#t2d .coin .r{font-size:11px;color:#7ee0a0;min-height:13px}
#t2d .coin.pulse{animation:t2dCoin .35s}
@keyframes t2dCoin{50%{transform:scale(1.08);background:#25405a}}
#t2d main{position:relative;flex:1;display:flex;min-height:0}
#t2d nav{width:150px;padding:12px 8px;display:flex;flex-direction:column;gap:6px;border-right:1px solid #ffffff10;background:#0a0e1477;overflow:auto}
#t2d nav button{background:#18222f;color:#cfd8e3;border:1px solid transparent;border-radius:10px;padding:10px 8px;text-align:left;cursor:pointer;font:inherit;font-size:14px;transition:.15s}
#t2d nav button:hover{background:#223245;transform:translateX(2px)}
#t2d nav button.on{background:linear-gradient(90deg,#2f6f4e,#245a40);color:#fff;border-color:#6fe0a055;box-shadow:0 0 14px #2f6f4e66}
#t2d .content{flex:1;overflow:auto;padding:16px 18px;min-width:0}
#t2d .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px}
#t2d .card{position:relative;background:linear-gradient(160deg,#1a2535,#131b27);border:1px solid #ffffff17;border-radius:14px;padding:12px 14px;display:flex;flex-direction:column;gap:7px;transition:transform .15s,box-shadow .2s,border-color .2s;animation:t2dPop .4s both}
#t2d .card:hover{transform:translateY(-2px);box-shadow:0 8px 22px #0008}
#t2d .card.can{border-color:#6fe0a066}
#t2d .card.maxed{border-color:#ffd24d66;background:linear-gradient(160deg,#2a2515,#1a1810)}
#t2d .card.lock{opacity:.5}
#t2d .card.flash{animation:t2dFlash .6s}
@keyframes t2dFlash{0%{box-shadow:0 0 0 0 #6fe0a0cc;transform:scale(1.03)}100%{box-shadow:0 0 0 18px #6fe0a000;transform:none}}
#t2d .card .top{display:flex;gap:10px;align-items:center}
#t2d .card .ico{font-size:28px;width:44px;height:44px;border-radius:10px;background:#0c121a;display:flex;align-items:center;justify-content:center;flex:none}
#t2d .card .nm{font-weight:700;font-size:15px}
#t2d .card .lv{font-size:12px;opacity:.75}
#t2d .card .ds{font-size:12.5px;opacity:.8;min-height:32px}
#t2d .card .eff{font-size:12px;color:#8fd4ff}
#t2d .pips{display:flex;gap:3px;flex-wrap:wrap}
#t2d .pip{width:9px;height:9px;border-radius:3px;background:#2a3646}
#t2d .pip.f{background:linear-gradient(#7ef0b0,#2fb070);box-shadow:0 0 6px #4fe09a88}
#t2d .costs{display:flex;gap:5px;flex-wrap:wrap}
#t2d .cost{background:#0c121a;border-radius:8px;padding:2px 8px;font-size:12px;font-variant-numeric:tabular-nums}
#t2d .cost.bad{color:#ff8e8e;background:#2a1414}
#t2d .buy{background:linear-gradient(#35a56e,#27824f);color:#fff;border:0;border-radius:10px;padding:8px 10px;font:inherit;font-weight:700;cursor:pointer;transition:.1s;box-shadow:0 3px 0 #164a2e}
#t2d .buy:hover:not(:disabled){filter:brightness(1.12)}
#t2d .buy:active:not(:disabled){transform:translateY(3px);box-shadow:0 0 0 #164a2e}
#t2d .buy:disabled{background:#2b3440;color:#8b96a5;box-shadow:0 3px 0 #1b222b;cursor:not-allowed}
#t2d aside{width:270px;padding:14px;border-left:1px solid #ffffff10;background:#0a0e1477;display:flex;flex-direction:column;gap:12px;overflow:auto}
#t2d .crate{border:0;border-radius:18px;padding:16px 10px;cursor:pointer;font:inherit;color:#fff;font-size:15px;font-weight:700;background:radial-gradient(circle at 50% 30%,#d9a441,#8a5a14);box-shadow:0 6px 0 #5b3a0b,0 0 24px #d9a44155;transition:.08s;position:relative}
#t2d .crate:active{transform:translateY(5px);box-shadow:0 1px 0 #5b3a0b}
#t2d .crate .big{font-size:42px;display:block}
#t2d .panelbox{background:#131b27;border:1px solid #ffffff14;border-radius:12px;padding:10px 12px;font-size:12.5px;line-height:1.7}
#t2d .panelbox h3{margin:0 0 4px;font-size:13px;color:#9cc8ff}
#t2d .panelbox div{display:flex;justify-content:space-between;gap:8px}
#t2d footer{position:relative;padding:12px 22px;display:flex;gap:12px;align-items:center;justify-content:space-between;border-top:1px solid #ffffff14;background:#0b0f15cc}
#t2d .launch{background:linear-gradient(#e4513d,#b52a1c);color:#fff;border:0;border-radius:14px;padding:14px 38px;font:inherit;font-size:20px;font-weight:800;letter-spacing:1px;cursor:pointer;box-shadow:0 5px 0 #6b1409,0 0 26px #e4513d66;animation:t2dBeat 1.8s infinite}
#t2d .launch:hover{filter:brightness(1.1)}
#t2d .launch:active{transform:translateY(4px);box-shadow:0 1px 0 #6b1409}
@keyframes t2dBeat{50%{box-shadow:0 5px 0 #6b1409,0 0 42px #ff6a52aa}}
#t2d .ghost{background:#1b2431;color:#9aa8ba;border:1px solid #ffffff1a;border-radius:8px;padding:6px 10px;font:inherit;font-size:12px;cursor:pointer}
#t2d .ghost:hover{background:#26334a;color:#fff}
#t2d .float{position:fixed;pointer-events:none;font-weight:800;color:#ffe08a;text-shadow:0 2px 4px #000;animation:t2dFloat .9s ease-out forwards;z-index:70}
@keyframes t2dFloat{to{transform:translateY(-60px);opacity:0}}
#t2d .toast2{position:absolute;left:50%;bottom:84px;transform:translateX(-50%);background:#000c;border:1px solid #ffffff2a;padding:8px 18px;border-radius:20px;font-size:14px;animation:t2dToast 2s forwards;pointer-events:none}
@keyframes t2dToast{0%{opacity:0;transform:translate(-50%,10px)}10%,80%{opacity:1;transform:translate(-50%,0)}100%{opacity:0}}
#t2d .sect{margin:6px 2px 10px;font-size:13px;color:#9cc8ff}
@media(max-width:900px){#t2d aside{display:none}#t2d nav{width:96px}}
`;
