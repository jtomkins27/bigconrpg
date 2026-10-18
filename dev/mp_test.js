/* ============================================================
   dev/mp_test.js — headless multiplayer harness for BIGCON RPG
   ------------------------------------------------------------
   Boots the real game TWICE (host + client) in two fake-DOM
   sandboxes wired by a synchronous FakePeer bus (PeerJS-shaped).
   Then it plays a full campaign as a 2-player crew:

     · host: HOST player + all NPC allies (engine lives here)
     · client: REMY player, controlling their own character's
       battle turns over the wire (menu payloads → menuPick)
     · dialogue advances go through the CLIENT's skip requests
       (exercises the stale-skip bs guard); choices/battles/
       panels through whichever role owns them
     · invariants run on the host exactly like dev/playtest.js
     · desync detector: host vs client G (cash/intel/cort/scene/
       milestones) must match after every host-side action
     · FINALLY: a disconnect test — the client drops mid-scene
       and the host must take over their character (no stall).

   Usage: node dev/mp_test.js [runs]     (default 2)
   Exit 1 on any error-level finding.
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'index.html');
const SRCSCRIPT = fs.readFileSync(SRC,'utf8').match(/<script>([\s\S]*)<\/script>/)[1];

/* ---------------- FakePeer bus ---------------- */
function makeBus(){
  const peers=new Map();
  class FakeConn{
    constructor(){ this._h={}; this._other=null; this._open=false; }
    get peer(){ return this._other? this._other._ownPeer.id : '?'; }
    get open(){ return this._open; }
    on(ev,fn){ this._h[ev]=fn; return this; }
    emit(ev,arg){ const f=this._h[ev]; if(f) f(arg); }
    send(m){ if(!this._open||!this._other) return;
      this._other.emit('data', m); }
    close(){ if(!this._open) return;
      this._open=false; const o=this._other;
      if(o){ o._open=false; setTimeout(()=>{ o.emit('close'); },0); }
      setTimeout(()=>{ this.emit('close'); },0); }
  }
  class FakePeer{
    constructor(id, opts){
      this._ownPeer=this;
      this.id=(typeof id==='string')? id : 'peer-'+Math.random().toString(36).slice(2,9);
      this._h={}; this._destroyed=false;
      peers.set(this.id, this);
    }
    on(ev,fn){ this._h[ev]=fn;
      if(ev==='open') setTimeout(()=>{ if(!this._destroyed) fn(); },0);
      return this; }
    connect(id){
      const target=peers.get(id);
      const mine=new FakeConn(); const theirs=new FakeConn();
      mine._other=theirs; theirs._other=mine; theirs._ownPeer=target||this;
      setTimeout(()=>{
        if(!target || target._destroyed){
          const ef=this._h['error']; if(ef) ef({type:'peer-unavailable'});
          return;
        }
        mine._open=true; theirs._open=true;
        const cf=target._h['connection']; if(cf) cf(theirs);
        const of=mine._h['open']; if(of) of();
      },0);
      return mine;
    }
    destroy(){ this._destroyed=true; peers.delete(this.id); }
  }
  return FakePeer;
}

/* ---------------- fake DOM (same shape as playtest.js) ---------------- */
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
const mkEl=(function(){
  function make(){
    const list=rebuildingCls();
    const o={
      style:{cssText:''}, classList:list, textContent:'', title:'',
      disabled:false, onclick:null, onerror:null, inner:'', children:[], removed:false,
      dataset:{}, parentNode:null,
      appendChild(c){ c.parentNode=this; this.children.push(c);
        if(this.children.length>320) this.children.splice(0, this.children.length-320);
        return c; },
      insertAdjacentHTML(){}, remove(){ this.removed=true; }, setAttribute(){},
      scrollTop:0, scrollHeight:0
    };
    Object.defineProperty(o,'className',{
      set(v){ list.__members.clear();
        String(v||'').split(/\s+/).filter(Boolean).forEach(c=>list.__members.add(c)); },
      get(){ return [...list.__members].join(' '); }
    });
    Object.defineProperty(o,'innerHTML',{ set(v){ o.inner=v; }, get(){ return o.inner; } });
    o.className=''; o.innerHTML='';
    return o;
  }
  return make;
})();
function fakeDom(){
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

/* ---------------- boot an instance ---------------- */
const CANDIDATES_API=()=>null; /* fetched from api later */
function makeInstance(PeerCtor){
  const env=fakeDom();
  env.window.Peer=PeerCtor;
  let api;
  try{
    api=new Function('document','window','localStorage','Peer',
      SRCSCRIPT+'\n;return window.BCRPG;')(env.document, env.window, env.localStorage, PeerCtor);
  }catch(e){ return { env, api:null, bootError:e }; }
  env.stopRecording();
  return { env, api, bootError:null };
}
const tick=()=> new Promise(r=>setTimeout(r,0));
const isOn=(env,id)=> !!(env.byId[id] && env.byId[id].classList.contains('on'));

/* ---------------- click policies ---------------- */
function stageKids(run){ return run.env.byId['stage'].children.filter(c=>!c.removed); }
function chbtns(w){
  return (w.children||[]).filter(c=>!c.removed && c.classList.contains('chbtn')
    && typeof c.onclick==='function');
}
function newestChwrap(run){
  const k=stageKids(run);
  for(let i=k.length-1;i>=0;i--) if(k[i].classList.contains('chwrap')) return k[i];
  return null;
}
const pick=a=>a[Math.floor(Math.random()*a.length)];
function chooseOption(run, btns, hint){
  const labels=btns.map(b=>String(b.inner||b.textContent||''));
  const storyIdx=[...labels.keys()].filter(i=>/Continue story|RBA|verdict|dungeon|Parliament House|Fly North|Follow the Money|Tower lobby/i.test(labels[i]));
  if(storyIdx.length) return btns[storyIdx[0]];
  hint=hint||{};
  /* combat awareness: boss fights merit skills; a battered crew needs the
     ♥ heal/revive options. On the client api.battle() is null so the host
     passes the flags in. */
  const boss=hint.boss!==undefined? hint.boss
    : !!(run.api.battle() && (run.api.battle().foes||[]).some(f=>f.boss));
  const needCare=hint.low || hint.anyDown;
  if(boss && !labels.some(l=>/MP|Attack|Skill|Item|Defend|Back/.test(l))){
    return btns[0];
  }
  if(labels.some(l=>/Attack/.test(l))){
    const iAttack=btns[0];
    const iSkill=btns.find(b=>/Skill/.test(String(b.inner||'')));
    const iDefend=btns.find(b=>/Defend/.test(String(b.inner||'')));
    const r=Math.random();
    if(needCare && iSkill && Math.random()<0.7) return iSkill;   /* open the ♥ kit */
    if(boss && iSkill && Math.random()<0.5) return iSkill;
    if(r<0.66 || !iDefend) return iAttack;
    if(r<0.82 && iSkill) return iSkill;
    return iDefend;
  }
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
/* CLIENT: may click (a) the newest chwrap once, (b) the newest dline once.
   Everything else (CONTINUE/door) is host business. */
function clientAction(run, used, log, hint){
  const w=newestChwrap(run);
  if(w && !used.has(w)){
    const btns=chbtns(w);
    if(btns.length){
      const b=chooseOption(run,btns,hint);
      used.add(w);
      if(log) log.push('C:'+String(b.innerHTML||'').replace(/<[^>]*>/g,'').slice(0,24));
      b.onclick();
      return true;
    }
  }
  const k=stageKids(run);
  for(let i=k.length-1;i>=0;i--){
    const e=k[i];
    if(e.classList.contains('dline') && typeof e.onclick==='function' && !used.has(e)){
      used.add(e);
      if(log) log.push('C:dline');
      e.onclick();
      return true;
    }
  }
  return false;
}
function collectButtons(el, out, depth){
  if(!el || depth>5) return out;
  if(typeof el.onclick==='function' && !el.removed) out.push(el);
  (el.children||[]).forEach(c=>collectButtons(c, out, depth+1));
  return out;
}
function shopForHeals(run){
  /* shop policy: while the panel is open, buy ONE healing item (HP rows),
     then close — keeps a broke party from spiralling into endless retreats.
     Also: if a bench member is much fresher than the party tail, seat them
     (what a real host would do from the swap panel). */
  const G=run.api.G();
  const body=run.env.byId['stBody'];
  const btns=collectButtons(body, [], 0);
  const lineup=btns.filter(b=>/LINEUP/.test(String(b.textContent||'')));
  if(lineup.length && G.bench.length===lineup.length && G.party.length){
    let best=-1, bestHp=0;
    G.bench.forEach((bid,i)=>{ const st=G.st[bid]; if(st&&st.hp>bestHp){ bestHp=st.hp; best=i; } });
    const tail=G.party[G.party.length-1];
    const tailHp=(G.st[tail]||{}).hp||0;
    if(best>=0 && bestHp>tailHp+15 && !(G.mpSeats||[]).includes(tail)){
      lineup[best].onclick();
      return true;
    }
  }
  const heals=btns.filter(b=>{
    const p=b.parentNode;
    return /BUY/.test(String(b.textContent||'')) && /HP|MEAL|TEA|COFFEE|PARACET/.test(String((p&&p.inner)||''));
  });
  let acted=false;
  if(heals.length){ heals[Math.floor(Math.random()*heals.length)].onclick(); acted=true; }
  run.env.byId['stClose'].onclick();
  return acted;
}
/* HOST: overlays, beats-with-buttons (CONTINUE/door), menus. NEVER dlines
   (dialogue advancing belongs to the client in this harness so the bs
   guard is exercised end to end). */
function hostAction(run, log, hint){
  if(isOn(run.env,'mstone')){ if(log) log.push('H:mstone'); run.env.byId['mstoneOk'].onclick(); return true; }
  if(isOn(run.env,'evov')){ if(log) log.push('H:evov'); run.env.byId['evOk'].onclick(); return true; }
  if(isOn(run.env,'stov')){ if(log) log.push('H:shop'); return shopForHeals(run); }
  const k=stageKids(run);
  for(let i=k.length-1;i>=0;i--){
    const e=k[i];
    if(e.classList.contains('chwrap')){
      const btns=chbtns(e);
      if(btns.length){
        const b=chooseOption(run,btns,hint);
        if(log) log.push('H:'+String(b.innerHTML||'').replace(/<[^>]*>/g,'').slice(0,24));
        b.onclick();
        return true;
      }
    }
    if(typeof e.onclick==='function' && !e.classList.contains('dline')){
      if(log) log.push('H:beat-child:'+String(e.textContent||'').slice(0,14));
      e.onclick();
      return true;
    }
    const kid=(e.children||[]).filter(c=>!c.removed && typeof c.onclick==='function'
      && !c.classList.contains('chbtn') && c.classList.contains('chbtn')!==true);
    if(kid.length){
      if(log) log.push('H:beat-btn:'+String(kid[0].textContent||'').slice(0,14));
      kid[0].onclick();
      return true;
    }
  }
  return false;
}

/* ---------------- invariants (host, same as playtest) ---------------- */
const ROSTER_IDS=['butler','max','aidan','lane','simring','swain','kiran','jason','lucian','tan'];
function issue(level,msg){ return {level,msg}; }
const dbg=(function(){ try{ fs.writeFileSync(path.join(__dirname,'mp_debug.txt'), '=== MP DEBUG '+new Date().toISOString()+'\n'); }catch(e){} return x=>{ try{ fs.appendFileSync(path.join(__dirname,'mp_debug.txt'), x+'\n'); }catch(e){} }; })();
function invariants(api){
  const G=api.G(), out=[];
  ['cash','intel','cort'].forEach(k=>{
    if(typeof G[k]!=='number'||!isFinite(G[k])) out.push(issue('error','resource '+k+' is '+G[k]));
  });
  if(G.cash<0) out.push(issue('error','cash negative: $'+G.cash));
  if(G.intel<0) out.push(issue('error','intel negative: '+G.intel));
  const all=G.party.concat(G.bench);
  if(all.length!==new Set(all).size) out.push(issue('error','duplicate roster member: '+all.join(',')));
  if(G.party.length>4) out.push(issue('error','party size '+G.party.length+' > 4'));
  all.forEach(id=>{ if(!ROSTER_IDS.includes(id)) out.push(issue('error','unknown roster id: '+id)); });
  const B=api.battle();
  if(B){
    [...B.team,...B.foes].forEach(u=>{
      if(typeof u.hp!=='number'||!isFinite(u.hp)) out.push(issue('error','unit '+u.name+' HP '+u.hp));
    });
  }
  /* seats: mpSeats must be a subset of party and have no dupes */
  if(G.mpSeats){
    if(new Set(G.mpSeats).size!==G.mpSeats.length) out.push(issue('error','mpSeats dupes'));
    G.mpSeats.forEach(id=>{ if(!G.party.includes(id)) out.push(issue('error','seat '+id+' benched in MP')); });
  }
  return out;
}
/* desync: client mirror must equal host truth */
function desync(H,C){
  const g=H.api.G(), c=C.api.G();
  if(!c) return 'client G is null';
  for(const k of ['cash','intel','cort','scene','phase']){
    if(JSON.stringify(g[k])!==JSON.stringify(c[k])) return k+': host='+JSON.stringify(g[k])+' client='+JSON.stringify(c[k]);
  }
  if(JSON.stringify(Object.keys(g.mile))!==JSON.stringify(Object.keys(c.mile)))
    return 'milestone keys differ';
  if(JSON.stringify(g.mpSeats)!==JSON.stringify(c.mpSeats)) return 'mpSeats differ';
  if(JSON.stringify(g.party)!==JSON.stringify(c.party)) return 'party differs (host '+g.party+' vs client '+c.party+')';
  return null;
}

/* ---------------- one crew playthrough ---------------- */
async function mpPlaythrough(idx){
  const findings=[];
  const PeerCtor=makeBus();
  const H=makeInstance(PeerCtor);
  const C=makeInstance(PeerCtor);
  if(H.bootError||C.bootError){
    findings.push(issue('error','boot failed: '+((H.bootError||C.bootError).message)));
    return { findings, verdict:null };
  }
  H.api.net.fast(true); C.api.net.fast(true);

  /* --- lobby --- */
  H.env.get('mpName').textContent='NEMO';
  H.api.net.host('WG7'+idx+'X');
  await tick();
  if(H.api.net.state().role!=='host') findings.push(issue('error','host role not set'));
  const hostPicks=['butler','aidan','swain','kiran','jason','lucian','max','tan','lane','simring'];
  const hpc=hostPicks[Math.floor(Math.random()*hostPicks.length)];
  H.api.net.pick(hpc);
  const cpc=hostPicks.filter(id=>id!==hpc)[Math.floor(Math.random()*(hostPicks.length-1))];
  C.api.net.join('WG7'+idx+'X', 'REMY');
  await tick();   /* peer open + connect + hello */
  C.api.net.pick(cpc);
  await tick();   /* pcpick + lobby echo */
  const players=H.api.net.players();
  if(players.length!==2) findings.push(issue('error','lobby has '+players.length+' players, expected 2'));
  if(players.filter(p=>p.pc).length!==2) findings.push(issue('error','not every seat picked: '+JSON.stringify(players.map(p=>[p.name,p.pc]))));
  const clientState=C.api.net.state();
  if(clientState.role!=='client') findings.push(issue('error','client role not set'));

  /* --- start --- */
  H.api.net.begin();
  await tick();
  if(!H.api.net.state().started) findings.push(issue('error','campaign did not start'));
  if(C.api.net.state().selfPc!==cpc) findings.push(issue('error','client did not receive their PC (got '+C.api.net.state().selfPc+', expected '+cpc+')'));
  const G=H.api.G();
  if(!G.mpSeats.includes(hpc)||!G.mpSeats.includes(cpc))
    findings.push(issue('error','mpSeats wrong: '+JSON.stringify(G.mpSeats)));
  if(G.mpSeats.length!==2) findings.push(issue('error','expected 2 seats, got '+G.mpSeats.length));
  const d0=desync(H,C);
  if(d0) findings.push(issue('error','DESYNC at start: '+d0));

  /* --- main loop --- */
  const usedC=new Set();
  let battleKey='', battleSame=0, blockKey='', sameN=0, noClick=0;
  const recentClicks=[];
  let prevB=null, battleStarts=0;
  let lastBattleLog=[], lastBattleTip='';
  const MAX=parseInt(process.env.MP_MAX||'24000',10);
  let verdict=null, clientVerdict=null;
  /* desync tracking: tiny windows (e.g. a retreat penalty between endBattle
     and the CONT click) self-heal within a beat; only PERSISTENT mismatch
     across 3+ samples is a real finding */
  let desyncPending=null, desyncAge=0;
  const lossCount={};
  for(let s=0;s<MAX;s++){
    if(isOn(H.env,'endov')){
      verdict=String(H.env.byId['endName'].textContent||'').trim();
      clientVerdict=isOn(C.env,'endov')? String(C.env.byId['endName'].textContent||'').trim(): '(client never saw the verdict)';
      if(clientVerdict!==verdict) findings.push(issue('error','verdict desync: host "'+verdict+'" vs client "'+clientVerdict+'"'));
      else findings.push(...[0].map(()=>issue('ok','verdict synced: '+verdict)));
      break;
    }
    const Gh=H.api.G();
    if(!Gh){ findings.push(issue('error','host G null at step '+s)); break; }

    if(s%10===0){
      invariants(H.api).forEach(x=>{ if(x.level!=='ok') findings.push(x); });
      const d=desync(H,C);
      if(d){
        /* transient windows (a retreat fee between endBattle and the CONT
           click) heal within a beat: only report mismatches that persist
           across 3+ consecutive samples */
        if(desyncPending===d){ desyncAge++; }
        else { desyncPending=d; desyncAge=1; }
        if(desyncAge>=3){
          const g2=H.api.G(), B2=H.api.battle();
          findings.push(issue('error','DESYNC at step '+s+': '+d+
            ' | scene='+g2.scene+':'+g2.block+
            ' battle='+(B2&&B2.b? B2.b.id:'-')+
            ' log='+JSON.stringify((g2.log||[]).slice(0,4))));
        }
      } else { desyncPending=null; desyncAge=0; }
    }
    /* battle start/end transitions (robust against G.log truncation) */
    const B=H.api.battle();
    if(!prevB && B){
      battleStarts++;
      dbg('START '+B.b.id+' step '+s+' | mood='+(Gh.mood||'?')+' phase='+Gh.phase+
        ' | party='+JSON.stringify(Gh.party)+' seats='+JSON.stringify(Gh.mpSeats)+' pc='+Gh.pc+
        ' | st='+JSON.stringify(Gh.st)+' | recent='+JSON.stringify(recentClicks.slice(-3)));
    }
    if(prevB && !B){
      const top=(Gh.log||[]).slice(0,6);
      const ret=top.find(l=>/^RETREAT: /.test(l));
      if(ret){
        const foe=ret.replace(/^RETREAT: /,'').trim();
        lossCount[foe]=(lossCount[foe]||0)+1;
        dbg('LOSS #'+lossCount[foe]+' vs '+foe+
          ' | st='+JSON.stringify(Gh.st)+
          ' | '+lastBattleTip+' | log='+JSON.stringify(lastBattleLog));
        if(lossCount[foe]===3)
          findings.push(issue('warn','grind: the 2-crew has dropped 3 fights vs "'+foe+'" — watch for a death spiral (detail in dev/mp_debug.txt)'));
        if(lossCount[foe]===8)
          findings.push(issue('error','grind: the 2-crew dropped 8 fights vs "'+foe+'" — spiral never resolved'));
      } else dbg('END '+lastBattleLog[0]);
    }
    prevB=B;
    if(B && !B.over){
      sameN=0;
      B._mpSteps=(B._mpSteps||0)+1;
      if(B._mpSteps===2000){
        const act=B.q[Math.max(0,Math.min(B.q.length-1,B.qi))]||{};
        findings.push(issue('error','BATTLE STUCK: '+B.b.id+' at step '+s+
          ' round '+B.round+' qi '+B.qi+'/'+B.q.length+
          ' actor='+act.name+' mp='+act.mp+' kit='+JSON.stringify((act.kit||[]).map(k=>k.name))+
          ' team='+JSON.stringify(B.team.map(u=>({n:u.name,hp:u.hp,mp:u.mp,down:!!u.down,st:u.statuses.map(s=>s.k)})))+
          ' foes='+JSON.stringify(B.foes.map(f=>({n:f.name,hp:f.hp,down:!!f.down,st:f.statuses.map(x=>x.k)})))+
          ' recent='+JSON.stringify(recentClicks.slice(-10))));
        break;
      }
      const bk='round:'+B.round+':'+B.qi;
      if(bk===battleKey){
        battleSame++;
        if(battleSame===150 && process.env.MP_STOP!=='1'){
          findings.push(issue('error','BATTLE STUCK round '+B.round+' battle '+B.b.id+
            ' foesAlive '+B.foes.filter(f=>!f.down).length+'/'+B.foes.length+
            ' teamAlive '+B.team.filter(u=>!u.down).length+'/'+B.team.length+
            ' actor='+(B.q[B.qi]||{}).name+' mp='+(B.q[B.qi]||{}).mp+
            ' kit='+(B.q[B.qi]||{kit:[]}).kit.map(s=>s.name).join('|')+
            ' log='+JSON.stringify(B.log.slice(-4))+
            ' recentClicks='+JSON.stringify((recentClicks||[]).slice(-8))));
          break;
        }
      } else battleSame=0;
      battleKey=bk;
      let acted=false, crash=null;
      lastBattleLog=B.log.slice(-10);
      lastBattleTip='teamHP '+B.team.map(u=>u.hp+'/'+u.maxhp+(u.down?'(K)':'')).join(',')+
        ' foesHP '+B.foes.map(f=>f.hp+'/'+f.maxhp+(f.down?'(K)':'')).join(',');
      const bossOn=B.foes.some(f=>f.boss);
      const act=B.q[Math.max(0,Math.min(B.q.length-1,B.qi))]||{};
      const hint={boss:bossOn,
        low:(act.maxhp>0 && act.hp<act.maxhp*0.4),
        anyDown:B.team.some(u=>u.down)};
      try{ acted=clientAction(C, usedC, recentClicks, hint) || hostAction(H, recentClicks, hint); }catch(err){ crash='CLIENT/HOST battle click: '+err.message; }
      if(acted) recentClicks.push(String(B.b.id)+' r'+B.round+' qi'+B.qi);
      if(acted) { const now=H.api.battle(); recentClicks.push(' -> r'+(now? now.round:'end')+(now? now.qi:'')); }
      if(crash){ findings.push(issue('error','CRASH '+crash)); break; }
      if(!acted){
        noClick++;
        if(noClick>40){
          findings.push(issue('error','BATTLE WAITING with no clickable on either side (battle '+B.b.id+' round '+B.round+')'));
          break;
        }
      } else noClick=0;
      continue;
    }
    const nk=(Gh.scene||'?')+':'+(Gh.block!=null? Gh.block:'?');
    if(nk===blockKey){
      sameN++;
      if(sameN>250){ findings.push(issue('error','STALL at '+blockKey+' after '+sameN+' steps')); break; }
    } else { sameN=0; blockKey=nk; }
    const clientWent = (s%2===0);
    let acted=false, crash=null;
    try{
      acted= clientWent? (clientAction(C,usedC,recentClicks) || hostAction(H,recentClicks))
                        : (hostAction(H,recentClicks) || clientAction(C,usedC,recentClicks));
    }catch(err){ crash=(clientWent?'client':'host')+' click: '+err.message+(err.stack? ' | '+String(err.stack).split('\n')[1].trim():''); }
    if(crash){ findings.push(issue('error','CRASH '+crash)); break; }
    if(!acted){
      noClick++;
      if(noClick>30){ findings.push(issue('error','NO CLICKABLE anywhere at '+blockKey)); break; }
    } else noClick=0;
  }
  if(!verdict && !findings.some(f=>f.level==='error'))
    findings.push(issue('error','OUT OF STEPS at '+blockKey+
      ' — cash $'+H.api.G().cash+' intel '+H.api.G().intel+' cort '+H.api.G().cort+
      ' seats '+JSON.stringify(H.api.G().mpSeats)+
      ' party '+JSON.stringify(H.api.G().party)+
      ' battle='+(H.api.battle()? (H.api.battle().b.id+' round '+H.api.battle().round+
        ' foesAlive '+H.api.battle().foes.filter(f=>!f.down).length+
        ' teamAlive '+H.api.battle().team.filter(u=>!u.down).length+' over='+H.api.battle().over):'-')+
      ' stov='+String(isOn(H.env,'stov'))+
      ' battleStarts='+battleStarts+
      ' recent='+JSON.stringify(recentClicks.slice(-14))+
      ' lossCount='+JSON.stringify(lossCount)+
      ' log='+JSON.stringify((H.api.G().log||[]).slice(0,8))));

  /* --- disconnect test: client drops, host must keep the story moving --- */
  if(verdict){
    findings.push(...await disconnectTest(PeerCtor, idx));
  }
  try{ dbg('JOINLOG '+JSON.stringify(H.env.window.__joinLog||[])); }catch(e){}
  const errors=findings.filter(f=>f.level==='error');
  return { findings, verdict, errors };
}

/* disconnect: fresh 2-crew → advance a few story beats with client skips →
   the client drops → the host must take over the seat and keep advancing. */
async function disconnectTest(PeerCtor, idx){
  const findings=[];
  const H=makeInstance(PeerCtor), C=makeInstance(PeerCtor);
  if(H.bootError||C.bootError){ findings.push({level:'error',msg:'disconnect boot failed'}); return findings; }
  H.api.net.fast(true); C.api.net.fast(true);
  H.api.net.host('WG8'+idx+'X'); await tick();
  H.api.net.pick('butler');
  C.api.net.join('WG8'+idx+'X','TEMP'); await tick();
  C.api.net.pick('aidan'); await tick();
  H.api.net.begin(); await tick();
  /* advance three beats with client skips (exercises skip + bs ack) */
  const used=new Set();
  let advanced=0;
  for(let i=0;i<6;i++){
    const st=C.env.byId['stage'];
    const kids=st.children.filter(c=>!c.removed);
    let dl=null;
    for(let j=kids.length-1;j>=0;j--){
      const e=kids[j];
      if(e.classList.contains('dline') && typeof e.onclick==='function' && !used.has(e)){ dl=e; break; }
    }
    if(!dl) break;
    used.add(dl); dl.onclick(); advanced++;
  }
  if(!advanced){ findings.push({level:'error', msg:'disconnect test: client could not skip the opening dialogue'}); return findings; }
  const before=H.api.G().mpSeats.length;
  if(before!==2) findings.push({level:'error', msg:'disconnect test: seats='+before+' before drop'});
  /* THE DROP — the client tab dies; FakeConn.close fires host conn 'close' */
  C.env=null; C.api=null;
  H.api.net.drop(); await tick();
  const after=H.api.G().mpSeats.length;
  if(after!==1) findings.push({level:'error', msg:'disconnect test: seats='+after+' after drop (expected 1 — host takes the wheel)'});
  if(!H.api.net.state().started) findings.push({level:'error', msg:'disconnect test: host dropped the campaign on disconnect'});
  /* story must still advance with host-local dline clicks */
  const usedH=new Set(); let moved=0;
  for(let i=0;i<12;i++){
    const st=H.env.byId['stage'];
    const kids=st.children.filter(c=>!c.removed);
    let dl=null;
    for(let j=kids.length-1;j>=0;j--){
      const e=kids[j];
      if(e.classList.contains('dline') && typeof e.onclick==='function' && !usedH.has(e)){ dl=e; break; }
    }
    if(!dl) break;
    usedH.add(dl); dl.onclick(); moved++;
  }
  if(!moved) findings.push({level:'error', msg:'disconnect test: story frozen after the client left'});
  else findings.push({level:'ok', msg:'disconnect test: host advanced '+moved+' beats after drop, seats '+after+', scene '+H.api.G().scene});
  return findings;
}

/* ---------------- main ---------------- */
async function main(){
  const runs=parseInt(process.argv[2]||'2',10)||2;
  const t0=Date.now();
  const tally={error:0,warn:0};
  let battleTotal=0; const verdicts={};
  console.log('MP CREW TEST: '+runs+' two-player campaigns over FakePeer ...');
  for(let i=0;i<runs;i++){
    const r=await mpPlaythrough(i);
    battleTotal+=0;
    r.findings.forEach(f=>{
      if(f.level==='error') tally.error++;
      else if(f.level==='ok') return;
      else tally.warn++;
    });
    if(r.verdict) verdicts[r.verdict]=(verdicts[r.verdict]||0)+1;
    console.log('  CREW '+(i+1)+' -> '+(r.verdict? 'VERDICT: '+r.verdict : 'STOPPED: '+String((r.findings.filter(x=>x.level==='error')[0]||{msg:'maxed steps'}).msg).slice(0,120)));
    r.findings.filter(f=>f.level!=='ok').forEach(f=>console.log('      ['+f.level+'] '+f.msg.slice(0,180)));
  }
  console.log('\nverdict mix: '+JSON.stringify(verdicts));
  console.log('=== findings: '+tally.error+' errors, '+tally.warn+' warns ===');
  if(!tally.error && !tally.warn) console.log('   none. the crew holds.');
  console.log('=== done in '+((Date.now()-t0)/1000).toFixed(1)+'s ===');
  process.exit(tally.error>0? 1:0);
}
main();
