/* ============================================================
   dev/playtest.js — automated playtester for BIGCON RPG: BONDMAGEDDON
   ------------------------------------------------------------
   What it does (no browser needed, pure node):
     1. Loads index.html's <script> into a fake-DOM sandbox (classList
        is synced with className like a real element) and boots the real
        game (New Game → PC select → m0 → hub).
     2. Auto-plays the WHOLE story to the verdict screen by clicking the
        real scene-engine beats (dialogues, choices, panels, battles),
        with random choice diversity so rivals/branches/verdicts vary.
     3. Sweeps every enemy in ENEMY_STATS through testBattle with a
        4-person level-6 party to sanity-check tuning (win-rate table).
     4. Watches invariants the whole way (NaN resources, negative cash,
        roster overflow/dupes, battle unit sanity) and records any
        exception thrown by a click with the scene/block where it
        happened, plus stall detection (same block clicked 40× no progress).

   Usage:
     node dev/playtest.js            (default: 12 playthroughs + sweep)
     node dev/playtest.js 5          (5 playthroughs)
     node dev/playtest.js sweep      (balance sweep only)

   Exit code 1 if any error-level issue is found (crashes, stalls).
   Memory note: the fake DOM caps container children to keep long runs cheap.
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'index.html');

/* --- fake DOM -------------------------------------------------------- */
function fakeDom(){
  const byId={}; let recording=true; const created=[];
  function cls(){ const s=[]; return {
    add:(c)=>{ if(!s.includes(c)) s.push(c); },
    remove:(c)=>{ const i=s.indexOf(c); if(i>=0) s.splice(i,1); },
    contains:(c)=> s.includes(c)
  };}
  function el(){
    const list=cls();
    const o={
      style:{cssText:''}, classList:list, textContent:'', title:'', className:'',
      disabled:false, onclick:null, onerror:null, inner:'', children:[], removed:false,
      dataset:{}, scrollTop:0, scrollHeight:0, parentNode:null,
      appendChild(c){ c.parentNode=this; this.children.push(c);
        if(this.children.length>320) this.children.splice(0, this.children.length-320);
        return c; },
      insertAdjacentHTML(){}, remove(){ this.removed=true; }, setAttribute(){},
      querySelectorAll:()=>[], querySelector:()=>null,
      set scrollTop(v){}, get scrollTop(){ return 0; },
      set scrollHeight(v){}, get scrollHeight(){ return 0; }
    };
    Object.defineProperty(o,'innerHTML',{
      set(v){ o.inner=v; }, get(){ return o.inner; }
    });
    /* keep className and classList in sync, like a real element */
    Object.defineProperty(o,'className',{
      get(){ return list._names? list._names: list.join && list.join(' ') || ''; },
      set(v){
        list._names=v;
        sClear(list);
        String(v).split(/\s+/).filter(Boolean).forEach(c=>list.add(c));
      }
    });
    function sClear(l){ while(l.contains('_x_')) l.remove('_x_'); l._names=l._names||''; }
    /* simple clear: track original members ourselves */
    o._classListRaw=list;
    return o;
  }
  function get(id){ if(!byId[id]){ byId[id]=el(); byId[id]._id=id; } return byId[id]; }
  const document={ getElementById:get,
    createElement(){ const e=el(); if(recording) created.push(e); return e; },
    querySelectorAll:()=>[], addEventListener(){}, body:el() };
  const window={ addEventListener(){}, AudioContext:null };
  const localStorage={ _d:{},
    getItem(k){ return this._d[k]||null; },
    setItem(k,v){ this._d[k]=String(v); },
    removeItem(k){ delete this._d[k]; } };
  return { byId, created, document, window, localStorage,
    stopRecording(){ recording=false; } };
}
/* fake classList needs to be mutable from className outside — the closure s hack
   is fragile, so rebuild classList support more simply: make cls() list-driven. */
function rebuildingCls(){
  const members=new Set();
  const l={
    add:c=>{ members.add(c); },
    remove:c=>{ members.delete(c); },
    contains:c=> members.has(c)
  };
  l.__members=members;
  return l;
}
/* simpler, correct element factory */
function elFactory(){
  return function(){
    const list=rebuildingCls();
    const o={
      style:{cssText:''}, classList:list, textContent:'', title:'',
      disabled:false, onclick:null, onerror:null, inner:'', children:[], removed:false,
      dataset:{}, scrollTop:0, scrollHeight:0, parentNode:null,
      appendChild(c){ c.parentNode=this; this.children.push(c);
        if(this.children.length>320) this.children.splice(0, this.children.length-320);
        return c; },
      insertAdjacentHTML(){}, remove(){ this.removed=true; }, setAttribute(){},
      querySelectorAll:()=>[], querySelector:()=>null
    };
    Object.defineProperty(o,'className',{
      set(v){ list.__members.clear();
        String(v||'').split(/\s+/).filter(Boolean).forEach(c=>list.__members.add(c)); },
      get(){ return [...list.__members].join(' '); }
    });
    Object.defineProperty(o,'innerHTML',{ set(v){ o.inner=v; }, get(){ return o.inner; } });
    o.className=''; o.innerHTML='';
    return o;
  };
}
const mkEl=elFactory();
function fakeDom2(){
  const byId={}; let recording=true; const created=[];
  function get(id){ if(!byId[id]){ const e=mkEl(); e._id=id; byId[id]=e; } return byId[id]; }
  return { byId, created, get,
    document:{ getElementById:get,
      createElement(){ const e=mkEl(); if(recording) created.push(e); return e; },
      querySelectorAll:()=>[], addEventListener(){}, body:mkEl() },
    window:{ addEventListener(){}, AudioContext:null },
    localStorage:{ _d:{},
      getItem(k){ return this._d[k]||null; },
      setItem(k,v){ this._d[k]=String(v); },
      removeItem(k){ delete this._d[k]; } },
    stopRecording(){ recording=false; } };
}

/* --- boot a fresh run -------------------------------------------------- */
function boot(){
  const env=fakeDom2();
  const html=fs.readFileSync(SRC,'utf8');
  const src=html.match(/<script>([\s\S]*)<\/script>/)[1];
  const api=new Function('document','window','localStorage',src+'\n;return window.BCRPG;')
    (env.document, env.window, env.localStorage);
  env.byId['btnNew'].onclick();
  const cards=env.created.filter(e=>e.className==='selcard');
  const pc=cards[Math.floor(Math.random()*cards.length)];
  pc.onclick();
  env.byId['selBtn'].onclick();
  env.stopRecording(); /* stop retaining every createElement after select */
  return { api, env };
}

/* --- helpers ------------------------------------------------------------ */
const pick=a=>a[Math.floor(Math.random()*a.length)];
const isOn=(env,id)=> !!(env.byId[id] && env.byId[id].classList.contains('on'));

function chooseOption(run, btns, hint){
  const labels=btns.map(b=>String(b.inner||b.textContent||''));
  /* story progress first — the hub must leave its loop */
  const storyIdx=[...labels.keys()].filter(i=>/Continue story|RBA|verdict|dungeon|Parliament House|Fly North|Follow the Money|Tower lobby/i.test(labels[i]));
  if(storyIdx.length) return btns[storyIdx[0]];
  hint=hint||{};
  /* combat awareness: boss fights merit skills; a battered crew needs the
     ♥ heal/revive options */
  const B=run.api.battle();
  const boss=hint.boss!==undefined? hint.boss : !!(B && (B.foes||[]).some(f=>f.boss));
  const needCare=hint.low || hint.anyDown;
  /* target menus (no MP/Attack/Skill/Item/Defend labels): focus the boss —
     summoned minions waste the pilot's turn otherwise */
  if(B && boss && !labels.some(l=>/MP|Attack|Skill|Item|Defend|Back/.test(l))){
    return btns[0];
  }
  /* party battle pilot */
  if(labels.some(l=>/Attack/.test(l))){
    const r=Math.random();
    const iAttack=btns[0];
    const iSkill=btns.find(b=>/Skill/.test(String(b.inner||'')));
    const iDefend=btns.find(b=>/Defend/.test(String(b.inner||'')));
    if(needCare && iSkill && Math.random()<0.7) return iSkill;   /* open the ♥ kit */
    if(boss && iSkill && Math.random()<0.5) return iSkill;
    if(r<0.66 || !iDefend) return iAttack;
    if(r<0.82 && iSkill) return iSkill;
    return iDefend;
  }
  /* skill/target menus: prefer a ♥ heal/revive when the crew needs care;
     otherwise pick whatever is enabled; if everything is disabled, take the
     Back button so the turn can still resolve */
  const heal=btns.find(b=>/^♥/.test(String(b.inner||'')) && !b.disabled)
          || btns.find(b=>/♥/.test(String(b.inner||'')) && !b.disabled);
  if(needCare && heal) return heal;
  const usable=btns.filter(b=>!b.disabled);
  if(!usable.length){
    const back=btns.find(b=>/Back/.test(String(b.inner||'')));
    return back||btns[0];
  }
  return pick(usable);
}

function oneClick(run){
  const stage=run.env.byId['stage'];
  const kids=stage.children.filter(c=>!c.removed);
  const bumps=(label)=>{
    run.result.clicks++;
    run.result.recentClicks=(run.result.recentClicks||[]);
    run.result.recentClicks.push(String(label||'?').slice(0,30));
    if(run.result.recentClicks.length>12) run.result.recentClicks.shift();
  };
  const B=run.api.battle();
  let hint=null;
  if(B && !B.over){
    const act=B.q[Math.max(0,Math.min(B.q.length-1,B.qi))]||{};
    hint={boss:B.foes.some(f=>f.boss),
      low:(act.maxhp>0 && act.hp<act.maxhp*0.4),
      anyDown:B.team.some(u=>u.down)};
  }
  for(let i=kids.length-1;i>=0;i--){
    const e=kids[i];
    if(e.classList.contains('chwrap')){
      const btns=(e.children||[]).filter(c=>!c.removed && c.classList.contains('chbtn') && typeof c.onclick==='function');
      if(btns.length){ const b=chooseOption(run,btns,hint); bumps(String(b.inner||'')+' [skip:'+(b.disabled?'disabled':'enabled')+']'); b.onclick(); return true; }
    }
    if(typeof e.onclick==='function'){ bumps('dline/beat'); e.onclick(); return true; }
    const kid=(e.children||[]).filter(c=>!c.removed && typeof c.onclick==='function' && !c.classList.contains('chbtn'));
    if(kid.length){ bumps('beat-child:'+String(kid[0].textContent||'')); kid[0].onclick(); return true; }
  }
  return false;
}

/* --- invariants --------------------------------------------------------- */
const ROSTER_IDS=['butler','max','aidan','lane','simring','swain','kiran','jason','lucian','tan'];
function invariants(run){
  const G=run.api.G(), out=[];
  ['cash','intel','cort'].forEach(k=>{
    if(typeof G[k]!=='number'||!isFinite(G[k])) out.push(issue('error','resource '+k+' is '+G[k]));
  });
  if(G.cash<0) out.push(issue('error','cash negative: $'+G.cash));
  if(G.intel<0) out.push(issue('error','intel negative: '+G.intel));
  if(G.cort<0||G.cort>9) out.push(issue('error','cortisol out of range: '+G.cort));
  const all=G.party.concat(G.bench);
  if(all.length!==new Set(all).size) out.push(issue('error','duplicate roster member: '+all.join(',')));
  if(G.party.length>4) out.push(issue('error','active party size '+G.party.length+' > 4'));
  all.forEach(id=>{ if(!ROSTER_IDS.includes(id)) out.push(issue('error','roster contains unknown id: '+id)); });
  Object.values(G.st||{}).forEach(s=>{
    if(s && (!isFinite(s.hp)||!isFinite(s.mp))) out.push(issue('error','non-finite hp/mp persisted: '+JSON.stringify(s)));
  });
  const B=run.api.battle();
  if(B){
    [...B.team,...B.foes].forEach(u=>{
      if(typeof u.hp!=='number'||!isFinite(u.hp)) out.push(issue('error','unit '+u.name+' HP '+u.hp));
      if(u.side==='foe' && u.hp<0) out.push(issue('error','foe '+u.name+' negative HP '+u.hp));
    });
    if(B.q.length<2) out.push(issue('warn','battle queue short: '+B.q.length));
  }
  return out;
}
function issue(level,msg,ctx){ return { level, msg, ctx: ctx||{} }; }

function collectButtons(el, out, depth){
  if(!el || depth>5) return out;
  if(typeof el.onclick==='function' && !el.removed) out.push(el);
  (el.children||[]).forEach(c=>collectButtons(c, out, depth+1));
  return out;
}
function shopForHeals(run){
  /* shop policy: while the panel is open, buy ONE healing item (HP rows),
     then close — keeps a broke party from spiralling into endless retreats.
     Also: if a bench member is much fresher than the party tail, seat them. */
  const G=run.api.G();
  const body=run.env.byId['stBody'];
  const btns=collectButtons(body, [], 0);
  const lineup=btns.filter(b=>/LINEUP/.test(String(b.textContent||'')));
  if(lineup.length && G.bench.length===lineup.length && G.party.length){
    let best=-1, bestHp=0;
    G.bench.forEach((bid,i)=>{ const st=G.st[bid]; if(st&&st.hp>bestHp){ bestHp=st.hp; best=i; } });
    const tail=G.party[G.party.length-1];
    const tailHp=(G.st[tail]||{}).hp||0;
    if(best>=0 && bestHp>tailHp+15){ lineup[best].onclick(); return true; }
  }
  const heals=btns.filter(b=>{
    const t=String(b.textContent||'');
    const p=b.parentNode;
    const row=String((p&&p.inner)||'');
    return /BUY/.test(t) && /HP|MEAL|TEA|COFFEE|PARACET/.test(row);
  });
  let acted=false;
  if(heals.length){ heals[Math.floor(Math.random()*heals.length)].onclick(); acted=true; }
  run.env.byId['stClose'].onclick();
  return acted;
}
function closeOverlays(run){
  const {env}=run;
  if(isOn(env,'endov')){ env.byId['endOk'].onclick(); run.result.clicks++; return true; }
  if(isOn(env,'mstone')){ env.byId['mstoneOk'].onclick(); run.result.clicks++; return true; }
  if(isOn(env,'evov')){ env.byId['evOk'].onclick(); run.result.clicks++; return true; }
  if(isOn(env,'stov')){ return shopForHeals(run); }
  return false;
}

/* --- one full playthrough ------------------------------------------------ */
function playthrough(idx){
  const run=boot();
  const result=run.result={
    pc:run.api.G().pc, clicks:0, steps:0, scenes:new Set(), milestones:new Set(),
    battles:[], issues:[], verdict:null, madeVisits:0, lastBlock:'', sameBlock:0,
    seenBattleLogLen:0, battleKey:'', battleSameRound:0
  };
  const {api,env}=run;
  const G0=api.G();
  if(!G0||!G0.pc){ result.issues.push(issue('error','game did not boot into a world (pc='+(G0&&G0.pc)+')')); return result; }
  const MAX=15000;
  for(let s=0;s<MAX;s++){
    result.steps=s+1;
    if(isOn(env,'endov')){
      result.verdict=String(env.byId['endName'].textContent||'').trim();
      result.madeVisits=(api.G().flags.madeVisits||0);
      closeOverlays(run);
      return result;
    }
    const G=api.G();
    if(!G){ result.issues.push(issue('error','G became null mid-run (step '+s+')')); return result; }
    result.scenes.add(G.scene);
    Object.keys(G.mile).forEach(k=>{ if(G.mile[k]) result.milestones.add(k); });

    if(s%8===0){
      invariants(run).forEach(x=>{
        const key=x.level+':'+x.msg;
        if(!result.issueSeen) result.issueSeen=new Set();
        if(!result.issueSeen.has(key)){ result.issueSeen.add(key); result.issues.push(x); }
      });
    }

    /* battle bookkeeping via the log (endBattle nulls the live object) */
    const seenBattleLog = (G.log||[]).filter(l=>/^BATTLE WON:|^RETREAT:/.test(l));
    if(seenBattleLog.length > result.seenBattleLogLen){
      seenBattleLog.slice(result.seenBattleLogLen).reverse().forEach(l=>{
        const won=/^BATTLE WON/.test(l);
        const name=l.replace(/^BATTLE WON: |^RETREAT: /,'').trim();
        result.battles.push({ won, line:l.slice(0,60) });
        if(!won){
          result.lossCount=(result.lossCount||{});
          result.lossCount[name]=(result.lossCount[name]||0)+1;
          if(result.lossCount[name]===3)
            result.issues.push(issue('warn','grind loop: lost to "'+name+'" 3 times — boss may be overtuned for basic-attack play or the pilot retries endlessly'));
        }
      });
      result.seenBattleLogLen = seenBattleLog.length;
    }

    if(closeOverlays(run)) continue;

    const B=api.battle();
    const sceneKey=(G.scene||'?')+':'+(G.block!=null? G.block:'?');
    /* mid-battle: block doesn't advance; measure battle progress by round */
    if(B && !B.over){
      result.sameBlock=0;
      const bk='battle_round:'+B.round+':'+B.qi;
      if(bk===result.battleKey){
        result.battleSameRound=(result.battleSameRound||0)+1;
        if(result.battleSameRound>200 && !result.battleStuckPushed){
          const labels=( ()=>{ const st=run.env.byId['stage'];
            const k=st.children.filter(c=>!c.removed);
            for(let ii=k.length-1;ii>=0;ii--){ const e=k[ii];
              if(e.classList.contains('chwrap')){
                return (e.children||[]).filter(c=>c.classList.contains('chbtn')&&!c.removed)
                  .map(c=>String(c.innerHTML||'').replace(/<[^>]*>/g,'').slice(0,26)+'['+(c.disabled?'D':'e')+']');
              } }
            return []; })();
          const act=B.q[Math.max(0,Math.min(B.q.length-1,B.qi))]||{};
          result.issues.push(issue('error','BATTLE STUCK near round '+B.round+
            ' (foes alive '+B.foes.filter(f=>!f.down).length+'/'+B.foes.length+
            ', team alive '+B.team.filter(u=>!u.down).length+'/'+B.team.length+
            ', battle id '+B.b.id+', actor '+(act.name||'?')+' mp='+act.mp+
            ' kitCosts='+JSON.stringify((act.kit||[]).map(s=>s&&s.mp))+
            ', click history: '+JSON.stringify(result.recentClicks)+
            ', visible buttons: '+JSON.stringify(labels)+
            ', log tail: '+JSON.stringify(B.log.slice(-4))));
          result.battleStuckPushed=true;
        }
      } else result.battleSameRound=0;
      result.battleKey=bk;
      try{ if(!oneClick(run)) result.issues.push(issue('error','BATTLE WAITING with nothing to click at '+sceneKey)); }catch(err){
        result.issues.push(issue('error','CRASH in battle click: '+err.message));
        return result;
      }
      if(result.battleStuckPushed) return result;
      continue;
    }
    const blockKey=sceneKey;
    if(blockKey===result.lastBlock){
      result.sameBlock++;
      if(result.sameBlock>=40){
        result.issues.push(issue('error','STALL: no progress at '+blockKey+' after '+result.sameBlock+
          ' clicks (recent log: '+JSON.stringify((G.log||[]).slice(0,3))+')'));
        return result;
      }
    } else result.sameBlock=0;
    result.lastBlock=blockKey;

    try{
      if(!oneClick(run)){
        if(result.sameBlock>=3)
          result.issues.push(issue('error','NO CLICKABLE beat at '+blockKey+
            ' — engine waiting (log: '+JSON.stringify((G.log||[]).slice(0,2))+')'));
      }
    }catch(err){
      result.issues.push(issue('error','CRASH on click: '+err.message+' @ '+blockKey+
        (err.stack? ' :: '+String(err.stack).split('\n').slice(1,2).join('').trim():'')));
      return result;
    }
  }
  result.issues.push(issue('error','OUT OF STEPS before verdict at '+result.lastBlock+
    ' — clicks '+result.clicks+', party ['+api.G().party.join(',')+'] bench ['+api.G().bench.join(',')+
    '], cash $'+api.G().cash+', rogues gallery flags: '+JSON.stringify(Object.keys(api.G().flags||{}))+
    ', recent clicks: '+JSON.stringify(result.recentClicks||[])+
    ', log tail: '+JSON.stringify((api.G().log||[]).slice(0,4))));
  return result;
}

/* --- balance sweep ------------------------------------------------------- */
function sweep(rows){
  const run=boot(); const api=run.api;
  const g=api.G();
  ['M0','M1','M2','M3','M4','M5'].forEach(m=>g.mile[m]=true);
  const skills=Object.keys(api.SKILL_FX||{});
  const ids=Object.keys(api.ENEMY_STATS||{});
  ids.forEach(id=>{
    if(id==='scaffold') return;
    let win=0; const N=6;
    try{
      for(let t=0;t<N;t++){
        const party=['butler','aidan','swain','tan'].sort(()=>Math.random()-0.5);
        const acts=[];
        for(let z=0;z<8;z++) acts.push(Math.random()<0.25? ['skill',pick(skills)] : 'attack');
        const r=api.testBattle(party,id,acts);
        if(r.win) win++;
      }
      rows.push({ id, wr:(win/N).toFixed(2) });
    }catch(err){ rows.push({ id, wr:'ERR', note:err.message }); }
  });
  return rows.sort((a,b)=> (a.wr<b.wr? -1: 1));
}

/* --- main ---------------------------------------------------------------- */
function main(){
  const arg=process.argv[2];
  const t0=Date.now();
  const allIssues=[]; const tally={};
  let sceneUnion=new Set(); let battleTotal=0, battleWins=0; const verdicts={};
  if(arg!=='sweep'){
    const runs=parseInt(arg||'12',10)||12;
    console.log('PLAYTEST: '+runs+' full headless playthroughs ...');
    for(let i=0;i<runs;i++){
      const r=playthrough(i);
      r.issues.forEach(x=>{
        tally[x.level]=(tally[x.level]||0)+1;
        allIssues.push('RUN '+(i+1)+' ['+x.level+'] '+x.msg);
      });
      sceneUnion=new Set([...sceneUnion,...r.scenes]);
      battleTotal+=r.battles.length;
      battleWins+=r.battles.filter(b=>b.won).length;
      if(r.verdict) verdicts[r.verdict]=(verdicts[r.verdict]||0)+1;
      console.log('  RUN '+(i+1)+' pc='+(r.pc||'?')+'  ->  '+(r.verdict? 'VERDICT: '+r.verdict : 'STOPPED: '+String((r.issues.filter(x=>x.level==='error')[0]||{msg:'maxed steps'}).msg).slice(0,110))+
        '  (clicks '+r.clicks+', scenes '+r.scenes.size+', milestones '+[...r.milestones].join(',')+', battles '+r.battles.length+')');
    }
    console.log('\nverdict mix: '+JSON.stringify(verdicts));
    console.log('battle record: '+battleWins+'/'+battleTotal+' won');
    console.log('scenes reached ('+sceneUnion.size+'): '+[...sceneUnion].sort().join(' '));
  }
  console.log('\nBALANCE SWEEP (level-6 4-party auto-battle, 6 trials each):');
  const rows=[]; sweep(rows);
  rows.forEach(r=> console.log('   '+r.wr+'  '+r.id+(r.note? '   THREW: '+r.note:'')));

  console.log('\n=== findings: '+(tally.error||0)+' errors, '+(tally.warn||0)+' warns ===');
  if(!allIssues.length) console.log('   none. good.');
  allIssues.slice(0,60).forEach(x=>console.log('   '+x));
  console.log('=== done in '+((Date.now()-t0)/1000).toFixed(1)+'s ===');
  process.exit((tally.error||0)>0? 1:0);
}
main();
