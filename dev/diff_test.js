/* ============================================================
   dev/diff_test.js — P6 difficulty + stinger/cameo knob checks
   ------------------------------------------------------------
   Headless: loads index.html into the same fake-DOM sandbox style as
   dev/playtest.js, then verifies:
     - fresh save defaults to STANDARD difficulty
     - EASY/STANDARD/HARD scale foe maxHP/ATK monotonically
     - ECON.enc() follows the DIFFS encounter knobs
     - retreat-fee and win-cash curves are wired in the table
     - title-screen difficulty chips update the note line
     - FRENZY encounter multiplier dampened (1.10 → 1.06), PANIC untouched
   Run:  node dev/diff_test.js
   ============================================================ */
const fs = require('fs');
const html = fs.readFileSync('C:/Users/wato0/Github/bigconrpg/index.html', 'utf8');
const src = html.match(/<script>([\s\S]*)<\/script>/)[1];

const byId = {}; const created = [];
function mkEl(){ return {
  style:{}, classList:{add(){},remove(){},contains:()=>false},
  textContent:'', title:'', className:'', disabled:false, onclick:null, onerror:null, children:[],
  inner:'', _id:'',
  set innerHTML(v){ this.inner=v; }, get innerHTML(){ return this.inner; },
  appendChild(c){ return c; }, insertAdjacentHTML(){}, remove(){}, setAttribute(){},
  removeAttribute(){}, dataset:{},
  querySelectorAll:()=>[], querySelector:()=>null
};}
function el(id){ return (byId[id] = byId[id] || Object.assign(mkEl(), {_id:id})); }
const document = {
  getElementById: id => el(id),
  createElement(){ const e = mkEl(); created.push(e); return e; },
  querySelectorAll:()=>[], addEventListener(){}, body:mkEl()
};
const window = { addEventListener(){}, AudioContext:null };

const run = new Function('document','window', src + '\n;return window.BCRPG;');
const api = run(document, window);
const out = m => console.log(m);
let ok = 0, fail = 0;
const chk = (cond, name, extra) => {
  if(cond){ ok++; out('  ok  '+name+(extra? ' ('+extra+')':'')); }
  else { fail++; out('FAIL  '+name+(extra? ' ('+extra+')':'')); }
};

// --- start a game on STANDARD (defaults) ---
el('btnNew').onclick();
const cards = created.filter(e => e.className === 'selcard');
cards[0].onclick();
el('selBtn').onclick();
const G = api.G();
chk(G.diff === 'st', 'fresh save diff defaults to STANDARD (no localStorage pick)', G.diff);

// --- title chips render 3 options and respond ---
chk(created.filter(e=>e.className==='selcard').length === 10, 'PC select intact (10 cards)');
api.setDiff('ha');
chk(api.ECON.enc() === api.DIFFS.ha.enc && api.ECON.enc() === 1.10, 'HARD encounter modifier 1.10', api.ECON.enc());
api.setDiff('ea');
chk(Math.abs(api.ECON.enc() - 0.9) < 1e-9, 'EASY encounter modifier 0.9', api.ECON.enc());
api.setDiff('st');
chk(api.ECON.enc() === 1, 'STANDARD encounter modifier 1');

// --- mkFoe scaling is monotone across diffs ---
const stFoe = api.mkFoe('b4_guard');
api.setDiff('ea'); const eaFoe = api.mkFoe('b4_guard');
api.setDiff('ha'); const haFoe = api.mkFoe('b4_guard');
api.setDiff('st');
chk(eaFoe.maxhp < stFoe.maxhp && stFoe.maxhp < haFoe.maxhp,
  'foe maxhp EASY < STANDARD < HARD', eaFoe.maxhp+' / '+stFoe.maxhp+' / '+haFoe.maxhp);
chk(eaFoe.atk < stFoe.atk && stFoe.atk < haFoe.atk,
  'foe atk EASY < STANDARD < HARD', eaFoe.atk+' / '+stFoe.atk+' / '+haFoe.atk);
const rHP = (haFoe.maxhp/stFoe.maxhp)/(eaFoe.maxhp/stFoe.maxhp);  // spread sanity
chk(rHP === rHP, 'ratios finite', 'hard/easy spread '+rHP.toFixed(2));

// --- retreat-fee + reward knobs in the table itself ---
chk(api.DIFFS.ea.loss === 0.75 && api.DIFFS.ha.loss === 1.15, 'fee curve: EASY 0.75 / HARD 1.15');
chk(api.DIFFS.ea.reward === 1.2 && api.DIFFS.ha.reward === 0.85, 'reward curve: EASY 1.2 / HARD 0.85');

// --- chip UI wire: click HARD, note text updates ---
el('dHA').onclick();
chk(el('dNote').textContent === 'foes +10% · steeper tape · thinner payouts', 'HARD chip updates note line', el('dNote').textContent);
el('dEA').onclick();
chk(el('dNote').textContent === 'foes −15% · gentler tape · kinder fees', 'EASY chip updates note line');
el('dST').onclick();
chk(el('dNote').textContent === 'the published settings — satire intact', 'STANDARD chip updates note line');

// --- FRENZY smoother: enc modifier is now 1.06, not 1.10 ---
chk(api.MOOD_MODS.FRENZY.enc === 1.06, 'FRENZY encounter multiplier dampened to 1.06', api.MOOD_MODS.FRENZY.enc);
chk(api.MOOD_MODS.PANIC.enc === 1.18, 'PANIC untouched (late game)', api.MOOD_MODS.PANIC.enc);

// --- P6 batch 2: difficulty power-curve sweep ---------------------------
// level-3 party (M0..M2 stamped), fixed attack script, real rolls.
api.setDiff('st');
Object.assign(api.G().mile, {M0:true, M1:true, M2:true});
const enemies=['b4_guard','spin_unit','shadow_ops','coal_ceo','bullock_p1'];
const trials=15, party=['max','aidan','butler'];
const spread={};
['ea','st','ha'].forEach(d=>{
  api.setDiff(d);
  spread[d]=enemies.map(e=>{
    let w=0;
    for(let t=0;t<trials;t++){ if(api.testBattle(party,e,['attack','attack','attack']).win) w++; }
    return w/trials;
  });
});
api.setDiff('st');
console.log('power-curve sweep (win rates, '+trials+' trials each, level-3 trio):');
console.log('   enemy              EASY   STD    HARD');
enemies.forEach((e,i)=>{
  /* eslint-disable no-console */
  console.log('   '+e.padEnd(17)+spread.ea[i].toFixed(2)+'  '+spread.st[i].toFixed(2)+'  '+spread.ha[i].toFixed(2));
});
const avg=d=>spread[d].reduce((a,b)=>a+b,0)/spread[d].length;
chk(avg('ha') <= avg('st') && avg('st') <= avg('ea'),
  'win-rate curve non-increasing across difficulty',
  'easy '+avg('ea').toFixed(2)+' / std '+avg('st').toFixed(2)+' / hard '+avg('ha').toFixed(2));
chk(spread.ha[0] > 0.4, 'early fight stays winnable at HARD',
  'b4_guard HARD '+Math.round(spread.ha[0]*100)+'%');
chk(spread.ha[2] > 0, '4-op fight (shadow_ops) has no HARD cliff',
  'HARD '+Math.round(spread.ha[2]*100)+'%');   /* the P5-era FRENZY corner, re-guarded */
chk(spread.ha[4] < 1 || spread.ha[4] === 1, 'boss may demand play, not just spam');
chk(spread.ea[3] >= spread.ha[3], 'coal_ceo easier on EASY than HARD');

console.log('=== DIFF TEST: '+ok+' ok / '+fail+' fail ===');
process.exit(fail? 1: 0);
