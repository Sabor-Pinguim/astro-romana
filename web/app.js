(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const crew = [
    // Keep HUD, labels, and lobby accents in sync with each avatar's 3D Accent material.
    {id:'helena',name:'Helena',role:'Commander & Pilot',color:'#D7263D',quote:'A mission only succeeds when every choice has a way home.',tags:['Aerospace Engineering','Test Pilot','Trajectory'],perk:'Precision Piloting',perkText:'Improves the crew’s margin during orbital maneuvers (full game).'},
    {id:'lucas',name:'Lucas',role:'Systems Engineer',color:'#F2A900',quote:'A reliable spacecraft is built from a thousand careful decisions.',tags:['Electrical Power','Structures','Repairs'],perk:'Redundant Engineering',perkText:'Reduces the impact of component failures (full game).'},
    {id:'oscar',name:'Oscar',role:'Data & Telecom Specialist',color:'#1FA2FF',quote:'A discovery that never reaches Earth is a story left untold.',tags:['Data Systems','Communications','Signal Planning'],perk:'Smart Compression',perkText:'Moves more science data through a limited connection (full game).'},
    {id:'maya',name:'Maya',role:'Mission Scientist & Medical Officer',color:'#2BB673',quote:'Every rock on Mars holds a secret waiting to be decoded.',tags:['Planetary Geology','Astrobiology','Crew Health'],perk:'Experimental Synergy',perkText:'Rewards a well-matched set of science instruments (full game).'}
  ];
  const SITES_INFO = {
    jezero:{name:'Jezero Crater',mission:'Biosignature Hunters',tag:'Ancient delta · biosignatures',desc:'An ancient lake with a river delta, a target in the search for biosignatures. The Perseverance rover has explored the crater since 2021.'},
    gale:{name:'Gale Crater',mission:'Gale Climate Archive',tag:'Layered rocks · climate',desc:'The rock layers of Mount Sharp hold the history of the Martian climate. The Curiosity rover has explored the crater since 2012.'}
  };
  // Per difficulty (game-balance): budget multiplier (the base budget comes from missionRules) and the surface
  // window in seconds. The badge shows exactly these two effects.
  const difficulty = {easy:{factor:1.2,surfaceS:210},normal:{factor:1,surfaceS:180},hard:{factor:.8,surfaceS:140}};
  const EQUIPMENT_GROUPS = [['power','Power',/^power-/],['data','Data & comms',/^(comm|data)-/],['science','Science',/^(sci|drill|truss)-/],['edl','Landing',/^edl-/],['systems','Systems',/^(attitude|isru|hab)-/]];
  const CABIN_GROUPS = [['helena','Helena',['cabin-launch-seats','cabin-orion-cockpit','cabin-idss-docking']],['lucas','Lucas',['cabin-pcdu-thermal','cabin-eva-airlock','cabin-eclss-wrs']],['oscar','Oscar',['cabin-hera-dosimetry','cabin-scan-console','cabin-autonav-conjunction']],['maya','Maya',['cabin-ared-exercise','cabin-storm-shelter','cabin-msg-minion']]];
  const CREW_MODELS = { helena: 'characters/helena.glb', lucas: 'characters/lucas.glb', oscar: 'characters/oscar.glb', maya: 'characters/maya.glb' };
  const COCKPIT_MODEL = 'rocket/cockpit_pilot.glb';
  const THUMB_CACHE = new Map();
  window.ASTRO_THUMBS = THUMB_CACHE;
  // Specs of every part and the mission rules (tools/modeling/parts/specs.mjs → parts/manifest.json).
  let DATA = null;
  const useData = manifest => { DATA = {rules:manifest.missionRules,parts:Object.fromEntries(manifest.parts.map(p=>[p.id,p]))}; };
  if (window.ASTRO_FILES?.['parts/manifest.json']) useData(window.ASTRO_FILES['parts/manifest.json']);
  const rule = (key,fallback) => DATA?.rules?.[key] ?? fallback;
  const MAX_STAGES = () => rule('maxInternalStages',7), CABIN_SLOTS = () => rule('cabinModuleSlots',4), TWR_MIN = () => rule('minSafeLiftoffTwr',1.2), TWR_BARE = () => rule('minBareLiftoffTwr',1), UPPER_TWR = () => rule('minUpperStageTwr',.3);
  const stageName = key => key==='booster'?'stage 1':`stage ${+key.slice(6)+2}`;
  // Ascent (game-balance): at a constant net acceleration (TWR − 1)·g the time to climb a fixed height goes as
  // 1/√(TWR − 1). The liftoff minigame lasts refS at refTwr, follows that law and stays within minS–maxS.
  const ASCENT = { refTwr: 1.5, refS: 15, minS: 9, maxS: 30 };
  const ascentSeconds = twr => Math.round(Math.min(ASCENT.maxS, Math.max(ASCENT.minS, ASCENT.refS*Math.sqrt((ASCENT.refTwr-1)/Math.max(1e-3,twr-1)))));
  // Liftoff (rule): stage 1 needs an engine that can fire (with a tank of its propellants) and thrust above the
  // weight (TWR_BARE). Otherwise the rocket stays on the pad and the mission ends there.
  // accel: net climb acceleration relative to the reference design (the launch pad animation uses it).
  function liftoffOf(m){
    const b=state.rocket.booster,fail=(reason,pad,status,title,detail)=>({ok:false,reason,pad,status,title,detail,twr:m.twr});
    if(!b.engine)return fail('no-engine','NO IGNITION','No ignition · no stage 1 engine','No Ignition','Stage 1 had no engine, so nothing lit at T−0.');
    if(!b.tank)return fail('no-tank','NO IGNITION','No ignition · no propellant','No Ignition','Stage 1 had no tank, so the engines had no propellant to burn.');
    if(m.issue==='propellant')return fail('propellant','NO IGNITION','No ignition · wrong propellant','No Ignition',`The stage 1 engine burns ${fuelOf(b.engine)}, but the tank held ${fuelOf(b.tank)}.`);
    if(m.twr<TWR_BARE())return fail('low-twr','NO LIFTOFF','Thrust below weight · engines shut down','No Liftoff',`Thrust-to-weight ${m.twr.toFixed(2)} is below ${TWR_BARE().toFixed(1)}: the engines lit, but the rocket never left the pad.`);
    return {ok:true,twr:m.twr,seconds:ascentSeconds(m.twr),accel:(m.twr-1)/(ASCENT.refTwr-1)};
  }
  const ORBIT = { altKm: 400, velMs: 7670 }; // game: ISS-like orbit; 7,670 m/s ≈ √(GM/r) at 400 km (derived)
  // Δv (rule): stages that run dry before orbit abort the flight after the ascent; a rocket that cannot make the Mars
  // transfer even refuelled aborts after the orbital refuel. Either way the capsule splashes down and the mission fails.
  // warn: the launch review (future); detail: the debrief (past).
  function abortOf(m){
    if(!m.ready)return null;
    const v=number(Math.round(m.dv/m.leo*ORBIT.velMs)),base={ok:false,pad:'SPLASHDOWN'};
    if(!m.orbit)return {...base,reason:'no-orbit',status:'Abort · Δv short of orbit',title:'Orbit Not Reached',
      warn:`Its stages run dry at ${v} of the ${number(ORBIT.velMs)} m/s needed for orbit: the crew will abort and splash down.`,
      detail:`The stages ran dry at ${v} m/s, short of the ${number(ORBIT.velMs)} m/s for orbit (Δv ${number(m.dv)} of ${number(m.leo)} m/s). The capsule separated and splashed down.`};
    if(!m.marsOk)return {...base,reason:'no-mars',status:'Abort · Mars out of reach',title:'Mars Out of Reach',
      warn:`Even refuelled in orbit, the transfer burn gives ${number(m.marsDv)} of the ${number(m.transfer)} m/s to Mars: the crew will return to Earth.`,
      detail:`Even refuelled, the transfer burn gave ${number(m.marsDv)} of the ${number(m.transfer)} m/s to Mars. The crew came home: the capsule re-entered and splashed down.`};
    return null;
  }
  const budgetOf = level => rule('defaultBudgetM',250)*difficulty[level].factor;
  const defaultRocket=()=>({booster:{engine:'merlin-1d',fins:'fins-small',tank:'falcon-9-stage-1-tank'},stages:[{item:'power-rosa-solar'},{item:null}],cabin:[]});
  const state={screen:'menu',difficulty:'normal',friends:new Set(),site:'jezero',detail:{kind:'crew',id:'helena'},rocket:defaultRocket(),sel:{kind:'booster'},tab:'engine'};
  const money = n => (n<0?'−$':'$')+Math.abs(n).toLocaleString('en-US',{maximumFractionDigits:Math.abs(n)<10?1:0})+'M';
  const number = n => n==null?'n/f':Math.round(n).toLocaleString('en-US');
  const tonnes = kg => kg==null?'n/f':(kg/1000).toLocaleString('en-US',{maximumFractionDigits:kg<10000?2:1})+' t';
  const part = id => DATA?.parts[id];
  const spec = id => part(id)?.specs || {};
  const warn = (id,key) => String(spec(id).sources?.[key]||'').includes('⚠')?' <span class="warn" title="sources disagree">⚠</span>':'';
  const shortName = id => (part(id)?.name||id).replace(/\s*\(.*\)\s*$/,'');
  // Low-poly astronaut: flat polygons; s* = suit tones, c* = crew colour, v* = visor, d1 = dark gear.
  const astronaut = (person) => `<svg class="astronaut" style="--crew:${person.color}" viewBox="0 0 150 215" aria-hidden="true">${[
    ['d1','40,62 110,62 114,120 36,120'],
    ['s1','52,138 74,138 72,170 54,170'],['s2','54,170 72,170 70,196 55,196'],['c2','55,165 71,165 70,176 56,176'],
    ['s2','98,138 76,138 78,170 96,170'],['s3','96,170 78,170 80,196 95,196'],['c2','95,165 79,165 80,176 94,176'],
    ['d1','50,196 72,196 73,206 46,206'],['d1','100,196 78,196 77,206 104,206'],
    ['s1','52,64 75,64 75,140 50,140 44,108'],['s2','75,64 98,64 106,108 100,140 75,140'],['s3','98,64 106,108 86,92'],
    ['c2','49,128 101,128 100,138 50,138'],
    ['d1','62,84 88,84 90,108 60,108'],['c1','64,96 86,96 86,100 64,100'],['c1','75,87 78,90 75,93 72,90'],
    ['c1','44,66 58,62 56,78 40,82'],['c2','92,62 106,66 110,82 94,78'],
    ['s2','40,68 54,70 50,104 36,102'],['s1','36,102 50,104 46,128 32,126'],['d1','31,126 47,128 46,140 33,140'],['c1','32,123 47,125 47,130 32,128'],
    ['s3','110,68 96,70 100,104 114,102'],['s2','114,102 100,104 104,128 118,126'],['d1','119,126 103,128 104,140 117,140'],['c1','118,123 103,125 103,130 118,128'],
    ['c1','58,69 92,69 96,80 54,80'],
    ['s2','106.4,29 88,10.6 62,10.6 43.6,29 43.6,55 62,73.4 88,73.4 106.4,55'],
    ['s1','75,42 62,10.6 43.6,29'],['s1','75,42 88,10.6 62,10.6'],['s1','75,42 43.6,29 43.6,55'],
    ['s3','75,42 106.4,29 106.4,55'],['s3','75,42 106.4,55 88,73.4'],
    ['v1','50,30 62,22 88,22 100,30 98,52 75,60 52,52'],['v2','50,30 62,22 88,22 52,52'],['v3','55,31 63,26 77,26 59,37']
  ].map(([c,p])=>`<polygon class="${c}" points="${p}"/>`).join('')}</svg>`;
  const showScreen = id => {state.screen=id;$$('.screen').forEach(screen=>screen.classList.toggle('active',screen.id===id));window.scrollTo(0,0);if(id==='planner')renderPlanner();};
  let toastTimer;
  const toast = message => {const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3500);};

  // Lobby: crew cards on the left, the selected crew member or landing site on the right.
  function renderLobby(){
    const site=SITES_INFO[state.site];
    $('#mission-name').textContent=site.mission;
    $('#planner-title').textContent='Mission: '+site.mission;
    $$('[data-site]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.site===state.site)));
    $('#crew-count').textContent=`${state.friends.size+1}/4 PLAYERS`;
    $('#crew-grid').innerHTML=crew.map((p,i)=>{const host=i===0,friend=state.friends.has(p.id),picked=state.detail.kind==='crew'&&state.detail.id===p.id;
      return `<article class="crew-card ${picked?'selected':''}" style="--crew:${p.color}"><div class="crew-stage">${astronaut(p)}</div><div class="crew-info"><h4 class="crew-name">${p.name}</h4><span class="crew-role">${p.role}</span><span class="status ${host||friend?'player':''}"><span class="dot"></span>${host?'HOST (PLAYER)':friend?'FRIEND (PLAYER)':'AI (NPC)'}</span></div><div class="crew-actions"><button class="pick" type="button" data-pick="${p.id}" aria-label="Details: ${p.name}" aria-pressed="${picked}">Details</button></div></article>`;}).join('');
    $$('#crew-grid [data-pick]').forEach(b=>b.addEventListener('click',()=>{state.detail={kind:'crew',id:b.dataset.pick};renderLobby();}));
    renderDetail();
  }
  function renderDetail(){
    const d=state.detail,view=$('#detail-view');
    if(d.kind==='crew'){
      const p=crew.find(c=>c.id===d.id),i=crew.indexOf(p);
      $('#detail-kind').textContent='Crew member';$('#detail-name').textContent=p.name;$('#detail-role').textContent=p.role;$('#detail-desc').textContent='“'+p.quote+'”';
      $('#detail-status').textContent=i===0?'HOST (PLAYER)':state.friends.has(p.id)?'FRIEND (PLAYER)':'AI (NPC)';
      $('#detail-extra').innerHTML=p.tags.map(t=>`<span class="tag">${t}</span>`).join('')+`<div class="perk"><strong>${p.perk}</strong><p>${p.perkText}</p></div>`;
      view.classList.remove('site');view.style.setProperty('--crew',p.color);
    }else{
      const s=SITES_INFO[d.id];
      $('#detail-kind').textContent='Landing site';$('#detail-name').textContent=s.name;$('#detail-role').textContent=s.tag;$('#detail-desc').textContent=s.desc;
      $('#detail-status').textContent=state.site===d.id?'SELECTED SITE':'AVAILABLE';
      $('#detail-extra').innerHTML='';$('#detail-site').innerHTML=sitePhoto(d.id,true);view.classList.add('site');
    }
    window.dispatchEvent(new CustomEvent('astro:detail',{detail:d}));
  }

  // Planner: Main Booster (engine cluster + tank) → 0 to 7 middle stages (1 module each) → cabin (4 modules).
  const moduleKey = sel => sel.kind==='stage'?`stage-${sel.index}`:sel.kind;
  const parseKey = key => key.startsWith('stage-')?{kind:'stage',index:+key.slice(6)}:{kind:key};
  // [title, contents, status]; the status line (Δv of a propulsive stage or why it cannot fire) needs metrics().
  function moduleLabel(key,m){
    const r=state.rocket,st=m?.stack.find(s=>s.key===key);
    const engineSub=s=>s.engine&&s.tank?`${shortName(s.engine)} + ${shortName(s.tank)}`:s.engine?'tank missing':s.tank?'engine missing':'engine + tank empty';
    const status=!st?'':st.issue==='propellant'?'propellant mismatch':st.issue==='thrust'?`too weak · TWR ${st.twr.toFixed(2)}`
      :st.dv?`Δv ${number(st.dv)} m/s${key!=='booster'?` · TWR ${st.twr.toFixed(2)}`:''}`:st.issue&&key!=='booster'?'dead weight':'';
    if(key==='booster')return ['Stage 1 · booster',engineSub(r.booster)+(r.booster.fins?' + fins':''),status];
    if(key==='cabin')return ['Cabin',`${r.cabin.length}/${CABIN_SLOTS()} modules`,''];
    const i=+key.slice(6),stage=r.stages[i],item=stage?.item;if(stage?.type==='booster')return [`Stage ${i+2} · booster`,engineSub(stage),status];return [`Stage ${i+2} · bay`,item?shortName(item):'empty bay',''];
  }
  // An engine and a tank work together only when they hold the same propellants (specs: `propellants`).
  const fuelOf = id => (spec(id).propellants||[]).join('/');
  const sameFuel = (engine,tank) => [...(spec(engine).propellants||[])].sort().join('/')===[...(spec(tank).propellants||[])].sort().join('/');
  // Totals: cost, mass and cruise power of every module, plus the staged Δv (references/parts/parts.md: Tsiolkovsky
  // per stage, m0 = the stage and everything above it, fuelled).
  // - Propulsive stages are the Main Booster and every middle stage set to "booster". They fire bottom-up; each
  //   one drops its engines, tank, thrust section (and the fins, on stage 1) when its tank runs dry.
  // - Stage 1 uses the Isp averaged between sea level and vacuum; upper stages use the vacuum Isp.
  // - A stage with a missing part or mismatched propellants cannot fire: it rides along as dead weight.
  // - Equipment bays and the cabin ride all the way to Mars.
  // - Orbit: the stage burning when the running Δv reaches low Earth orbit refuels in orbit. Refilled, it and the
  //   stages above must give the Mars transfer Δv; the refuel is the propellant it is missing for that.
  // Engine pumps draw power only during the ascent, so engines stay out of the cruise power balance.
  function metrics(){
    const r=state.rocket,g0=rule('g0Ms2',9.80665),leo=rule('earthOrbitDeltaVMs',9400),transfer=rule('marsTransferDeltaVMs',4300);
    let cost=0,draw=0,gen=0,payload=0;
    const take=s=>{if(!s)return 0;cost+=s.costM||0;if(s.powerW<0)draw-=s.powerW;else gen+=s.powerW||0;return s.massDryKg||0;};
    const engineStage=(key,m,first)=>{
      const e=m.engine?spec(m.engine):null,t=m.tank?spec(m.tank):null,n=e?(e.defaultClusterCount||1):0;
      let hw=take(spec('booster-thrust-section'));
      if(e){cost+=n*(e.costM||0);hw+=n*(e.massDryKg||0);}
      if(t){cost+=t.costM||0;hw+=t.massDryKg||0;}
      if(first&&m.fins)hw+=take(spec(m.fins));
      const issue=!e||!t?'incomplete':sameFuel(m.engine,m.tank)?null:'propellant';
      const ispVac=e?.ispVacS||0,isp=first&&e?.ispSlS?(e.ispSlS+ispVac)/2:ispVac;
      return {key,hw,prop:t?.propellantMassKg||0,isp,ispVac,thrustSl:n*(e?.thrustSlKn||0)*1000,thrustVac:n*(e?.thrustVacKn||0)*1000,issue,ready:!issue,dv:0};
    };
    const stack=[engineStage('booster',r.booster,true)];
    r.stages.forEach((s,i)=>{if(s.type==='booster')stack.push(engineStage(`stage-${i}`,s,false));else payload+=take(spec('stage-module'))+take(s.item?spec(s.item):null);});
    payload+=take(spec('crew-cabin'));r.cabin.forEach(id=>{payload+=take(spec(id));});
    // Upper stages that cannot fire ride along as dead weight. Besides an incomplete stage or a propellant mismatch, that
    // includes a stage too weak to climb: vacuum thrust-to-weight at its ignition below minUpperStageTwr. Dead weight
    // makes the stages above heavier, so the check runs again from the bottom up until nothing changes.
    const ready=stack[0].ready,upperTwr=UPPER_TWR(),mass=payload+stack.reduce((a,s)=>a+s.hw+s.prop,0);
    let firing=[];
    for(let pass=0;pass<stack.length;pass++){
      firing=ready?stack.filter(s=>s.ready):[];
      let m=mass;
      stack.forEach(s=>{s.dv=0;});
      for(const s of firing){s.m0=m;s.mf=m-s.prop;s.dv=s.prop&&s.mf>0?s.isp*g0*Math.log(s.m0/s.mf):0;s.twr=s.thrustVac/(m*g0);m=s.mf-s.hw;}
      const weak=firing.slice(1).find(s=>s.twr<upperTwr);
      if(!weak)break;
      weak.issue='thrust';weak.ready=false;
    }
    const dv=firing.reduce((a,s)=>a+s.dv,0),orbit=ready&&dv>=leo;
    let marsDv=0,refuelKg=0,refuelStage=null,orbitLeftKg=0;
    if(orbit){
      let k=0,run=0;while(k<firing.length-1&&run+firing[k].dv<leo)run+=firing[k++].dv;
      const s=firing[k],left=s.m0*Math.exp(-(leo-run)/(s.isp*g0))-s.mf; // propellant still in stage k at orbit
      const above=firing.slice(k+1).reduce((a,x)=>a+x.dv,0),owed=Math.max(0,transfer-above);
      marsDv=s.ispVac*g0*Math.log(s.m0/s.mf)+above; // stage k refilled, burning in vacuum
      refuelKg=Math.max(0,Math.min(s.prop,owed?s.mf*(Math.exp(owed/(s.ispVac*g0))-1):0)-left);
      refuelStage=s;orbitLeftKg=Math.max(0,left);
    }
    const thrust=ready?stack[0].thrustSl:0;
    return {cost,mass,draw,gen,thrust,ready,issue:stack[0].issue,stack,twr:ready&&mass?thrust/(mass*g0):0,dv,orbit,
      marsDv,marsOk:orbit&&marsDv>=transfer,refuelKg,refuelPct:refuelStage?refuelKg/refuelStage.prop*100:0,refuelStage,orbitLeftKg,
      budget:budgetOf(state.difficulty),leo,transfer};
  }
  function setBar(id,frac,mode){const el=$(id);el.style.width=Math.min(100,Math.max(0,frac*100))+'%';el.classList.toggle('danger',mode==='danger');el.classList.toggle('short',mode==='short');}
  function renderTelemetry(){
    if(!DATA)return null;
    const m=metrics();
    $('#cost-value').textContent=`${money(m.cost)} / ${money(m.budget)}`;setBar('#cost-fill',m.cost/m.budget,m.cost>m.budget?'danger':'');
    $('#twr-value').textContent=m.ready?m.twr.toLocaleString('en-US',{maximumFractionDigits:2}):'—';setBar('#twr-fill',m.ready?m.twr/2:0,m.ready&&m.twr<TWR_MIN()?'danger':'');
    $('#twr-hint').textContent=m.ready&&m.twr>=TWR_BARE()?`Ascent to MECO ≈ ${ascentSeconds(m.twr)} s: more thrust per tonne climbs faster. Below ${TWR_MIN().toFixed(1)} the stack wallows; below ${TWR_BARE().toFixed(1)} it stays on the pad.`:`Below ${TWR_BARE().toFixed(1)}, or with no working engine, the rocket stays on the pad and the mission fails.`;
    $('#power-value').textContent=`${number(m.gen)} W / ${number(m.draw)} W`;setBar('#power-fill',m.draw?m.gen/(m.draw*1.5):0,m.gen<m.draw?'danger':'');
    $('#dv-value').textContent=m.ready?`${number(m.dv)} / ${number(m.leo)} m/s`:'—';setBar('#dv-fill',m.dv/m.leo,m.ready&&!m.orbit?'short':'');
    $('#mars-value').textContent=m.orbit?`${number(m.marsDv)} / ${number(m.transfer)} m/s`:'—';setBar('#mars-fill',m.marsDv/m.transfer,m.orbit&&!m.marsOk?'short':'');
    $('#mars-hint').textContent=(!m.orbit?'Reach low Earth orbit first: the stage burning there refuels, then it and the stages above make the transfer.'
      :!m.marsOk?`Even with a full tank, ${stageName(m.refuelStage.key)} and the stages above fall short.`
      :m.refuelKg>0?`Orbital refuel: ${Math.ceil(m.refuelPct)}% of the ${stageName(m.refuelStage.key)} tank (${tonnes(m.refuelKg)}).`:'No refuel needed: the tanks already hold enough.')+` Target ≈ ${number(m.transfer)} m/s ⚠.`;
    $('#mass-value').textContent=tonnes(m.mass);
    const b=state.rocket.booster,dead=m.stack.slice(1).find(s=>s.issue);
    $('#booster-alert').textContent=!b.engine?'NO MAIN ENGINE! Nothing lights at T−0: install a stage 1 engine.':!b.tank?'NO STAGE 1 TANK! The engines have no propellant and will not ignite.':`PROPELLANT MISMATCH! The stage 1 engine burns ${fuelOf(b.engine)}; the tank holds ${fuelOf(b.tank)}. It will not ignite.`;
    $('#booster-alert').classList.toggle('show',!m.ready);
    $('#stage-alert').textContent=!dead?'':dead.issue==='thrust'?`${stageName(dead.key).toUpperCase()} TOO WEAK! Thrust-to-weight ${dead.twr.toFixed(2)} at ignition (needs ${UPPER_TWR().toFixed(1)}): it cannot climb and rides along as dead weight.`
      :`${stageName(dead.key).toUpperCase()} ${dead.issue==='propellant'?'PROPELLANT MISMATCH':'INCOMPLETE'}! It cannot fire and rides along as dead weight.`;
    $('#stage-alert').classList.toggle('show',!!dead);
    $('#twr-alert').textContent=m.twr<TWR_BARE()?`WON'T LEAVE THE PAD! Thrust-to-weight below ${TWR_BARE().toFixed(1)}: the mission ends at liftoff.`:`LOW THRUST! Thrust-to-weight below ${TWR_MIN().toFixed(1)}: a long, rough ascent.`;
    $('#twr-alert').classList.toggle('show',m.ready&&m.twr<TWR_MIN());
    $('#dv-alert').textContent=!m.orbit?`CAN'T REACH ORBIT! The crew would abort and splash down: add a bigger tank or an upper stage.`:`MARS OUT OF REACH! Refuelled, the rocket gives ${number(m.marsDv)} of ${number(m.transfer)} m/s: the crew would return to Earth.`;
    $('#dv-alert').classList.toggle('show',m.ready&&!m.marsOk);
    $('#budget-alert').classList.toggle('show',m.cost>m.budget);$('#power-alert').classList.toggle('show',m.gen<m.draw);
    $('#budget-remaining').textContent=money(m.budget-m.cost);$('#budget-readout').classList.toggle('negative',m.cost>m.budget);
    return m;
  }
  function renderRocket(){
    const r=state.rocket,keys=['booster',...r.stages.map((_,i)=>`stage-${i}`),'cabin'],cur=moduleKey(state.sel),m=DATA?metrics():null;
    $('#stack-overlay').innerHTML=keys.map((k,i)=>{const [title,sub,status]=moduleLabel(k,m),rem=k.startsWith('stage-')?`<button class="remove-stage" type="button" data-remove="${k.slice(6)}" title="Remove ${title}" aria-label="Remove ${title}">×</button>`:'';return `<div class="stage-node ${i%2?'right':'left'}" data-module="${k}"><button class="rocket-stage ${k===cur?'selected':''}" type="button" data-select="${k}" aria-pressed="${k===cur}"><strong>${title}</strong><small>${sub}</small>${status?`<small>${status}</small>`:''}</button>${rem}</div>`;}).join('')
      +(r.stages.length<MAX_STAGES()?Array.from({length:r.stages.length+1},(_,i)=>`<button class="add-stage" type="button" data-insert="${i}" title="Add stage" aria-label="Add a stage at position ${i+2}">+</button>`).join(''):'');
    $$('#stack-overlay [data-select]').forEach(b=>b.addEventListener('click',()=>selectModule(b.dataset.select)));
    $$('#stack-overlay [data-remove]').forEach(b=>b.addEventListener('click',()=>removeStage(+b.dataset.remove)));
    $$('#stack-overlay [data-insert]').forEach(b=>b.addEventListener('click',()=>addStage(+b.dataset.insert)));
    const installed=[r.booster.engine,r.booster.tank,r.booster.fins,...r.stages.flatMap(s=>s.type==='booster'?[s.engine,s.tank]:[s.item]),...r.cabin].filter(Boolean).length;
    $('#rocket-tags').innerHTML=`<span class="tag">${r.stages.length+2} STAGES</span><span class="tag">${installed} PARTS INSTALLED</span>`;
    window.dispatchEvent(new Event('astro:rocket'));
  }
  const isBooster = sel => sel.kind==='booster'||(sel.kind==='stage'&&state.rocket.stages[sel.index]?.type==='booster');
  const tabsFor = sel => isBooster(sel)?[['engine','Engines'],['tank','Tanks'],...(sel.kind==='booster'?[['fins','Fins']]:[])]:sel.kind==='stage'?EQUIPMENT_GROUPS.map(([k,l])=>[k,l]):CABIN_GROUPS.map(([k,l])=>[k,l]);
  function partsFor(sel,tab){
    const all=Object.entries(DATA.parts);
    // Stage 1 takes sea-level engines; the upper stages take the vacuum ones (thrustSlKn = 0: they cannot lift off).
    if(isBooster(sel))return all.filter(([,p])=>tab==='engine'?p.specs?.engineRole===(sel.kind==='booster'?'booster':'upper-stage'):tab==='fins'?p.category==='fins':p.category==='tanks'&&p.specs?.tankRole==='stage').map(([id])=>id);
    if(sel.kind==='stage'){const g=EQUIPMENT_GROUPS.find(x=>x[0]===tab);return all.filter(([id,p])=>p.category==='equipment'&&g[2].test(id)).map(([id])=>id);}
    return CABIN_GROUPS.find(x=>x[0]===tab)[2];
  }
  const installedIn = sel => isBooster(sel)?Object.values(sel.kind==='booster'?state.rocket.booster:{engine:state.rocket.stages[sel.index].engine,tank:state.rocket.stages[sel.index].tank}).filter(Boolean):sel.kind==='stage'?[state.rocket.stages[sel.index]?.item].filter(Boolean):state.rocket.cabin;
  // Flags a catalog engine or tank whose propellants differ from the partner already installed in the selected stage.
  function fuelClash(id){
    const sel=state.sel;if(!isBooster(sel))return '';
    const m=sel.kind==='booster'?state.rocket.booster:state.rocket.stages[sel.index],partner=part(id)?.category==='engines'?'tank':'engine',other=m[partner];
    return other&&!sameFuel(id,other)?` <span class="warn" title="Different propellants from the installed ${partner}">≠ ${partner}</span>`:'';
  }
  // Upper stage catalog: the thrust-to-weight the stage would have at ignition with this part (minUpperStageTwr).
  function stageTwr(id){
    const sel=state.sel;if(sel.kind!=='stage'||!isBooster(sel))return [];
    const st=state.rocket.stages[sel.index],slot=part(id)?.category==='engines'?'engine':'tank',was=st[slot];
    st[slot]=id;const s=metrics().stack.find(x=>x.key===`stage-${sel.index}`);st[slot]=was;
    if(!s||s.twr==null||!(s.ready||s.issue==='thrust'))return [];
    return [s.twr<UPPER_TWR()?`<span class="warn" title="Too weak to climb: needs ${UPPER_TWR().toFixed(1)}">TWR ${s.twr.toFixed(2)}</span>`:`TWR ${s.twr.toFixed(2)}`];
  }
  function partMetrics(id){
    const s=spec(id),p=part(id);
    if(p.category==='engines'){const n=s.defaultClusterCount||1,sl=s.thrustSlKn>0;return [`${n}×`,sl?`${number(s.thrustSlKn)} kN${warn(id,'thrustSlKn')}`:`${number(s.thrustVacKn)} kN vac${warn(id,'thrustVacKn')}`,sl?`Isp ${number(s.ispSlS)}${s.ispVacS&&s.ispVacS!==s.ispSlS?'–'+number(s.ispVacS):''} s${warn(id,'ispSlS')}`:`Isp ${number(s.ispVacS)} s vac${warn(id,'ispVacS')}`,`${number(s.massDryKg)} kg each${warn(id,'massDryKg')}`,fuelOf(id)+fuelClash(id),...stageTwr(id),money(n*s.costM)];}
    if(p.category==='fins')return [`${number(s.massDryKg)} kg`,`gusts −${Math.round((1-(s.aeroDriftFactor??1))*100)}%`,money(s.costM)];
    if(p.category==='tanks')return [`propellant ${tonnes(s.propellantMassKg)}${warn(id,'propellantMassKg')}`,`dry ${tonnes(s.massDryKg)}${warn(id,'massDryKg')}`,fuelOf(id)+fuelClash(id),...stageTwr(id),money(s.costM)];
    return [`${number(s.massDryKg)} kg${warn(id,'massDryKg')}`,s.powerW>0?`+${number(s.powerW)} W`:`${number(Math.abs(s.powerW||0))} W`,money(s.costM)];
  }
  function partThumbFallback(id, p) {
    const cached = THUMB_CACHE.get(id);
    if (cached) return `<img src="${cached}" alt="">`;
    let polys = '';
    if (p?.category === 'engines') {
      polys = '<polygon points="22,8 42,8 42,18 22,18" fill="#B9B0CE"/><polygon points="20,18 44,18 39,26 25,26" fill="#F59E0B"/><polygon points="25,26 39,26 48,54 16,54" fill="#3a2f52"/><polygon points="25,26 32,26 24,54 16,54" fill="#8f86ab"/>';
    } else if (p?.category === 'tanks') {
      polys = '<polygon points="22,12 32,6 42,12 42,52 32,58 22,52" fill="#e9dccb"/><polygon points="22,12 32,6 32,58 22,52" fill="#FFFFFF"/><polygon points="22,22 42,22 42,27 22,27" fill="#E04F26"/>';
    } else if (id.startsWith('power-')) {
      polys = '<polygon points="6,24 24,18 24,46 6,40" fill="#1d5f9a"/><polygon points="40,18 58,24 58,40 40,46" fill="#2c86ba"/><polygon points="25,16 39,16 39,48 25,48" fill="#F59E0B"/><polygon points="28,22 36,22 36,42 28,42" fill="#FCE8A6"/>';
    } else if (/^(comm|data)-/.test(id)) {
      polys = '<polygon points="14,22 32,10 50,22 42,38 22,38" fill="#FCE8A6"/><polygon points="14,22 32,10 32,38 22,38" fill="#FFFFFF"/><polygon points="30,22 34,12 34,26" fill="#E04F26"/><polygon points="26,38 38,38 42,54 22,54" fill="#3a2f52"/>';
    } else if (/^(sci|drill|truss)-/.test(id)) {
      polys = '<polygon points="16,14 48,14 48,36 16,36" fill="#7EDAC2"/><polygon points="20,18 44,18 44,32 20,32" fill="#17183B"/><polygon points="29,36 35,36 32,56" fill="#F59E0B"/>';
    } else if (id.startsWith('edl-')) {
      polys = '<polygon points="12,34 32,14 52,34" fill="#E04F26"/><polygon points="12,34 32,14 32,34" fill="#EE7B57"/><polygon points="18,34 46,34 38,50 26,50" fill="#F59E0B"/>';
    } else {
      polys = '<polygon points="14,14 50,14 54,24 54,50 10,50 10,24" fill="#9B5DE5"/><polygon points="16,18 48,18 48,32 16,32" fill="#17183B"/><polygon points="18,36 46,36 46,44 18,44" fill="#7EDAC2"/>';
    }
    return `<svg viewBox="0 0 64 64" aria-hidden="true">${polys}</svg>`;
  }
  function renderCatalog(){
    if(!DATA){$('#parts-list').innerHTML='<div class="empty-state">Loading part data…</div>';return;}
    const sel=state.sel,tabs=tabsFor(sel);if(!tabs.some(t=>t[0]===state.tab))state.tab=tabs[0][0];
    $('#category-tabs').innerHTML=tabs.map(([k,l])=>`<button type="button" role="tab" data-tab="${k}" aria-selected="${k===state.tab}">${l}</button>`).join('');
    $$('#category-tabs [data-tab]').forEach(b=>b.addEventListener('click',()=>{state.tab=b.dataset.tab;renderCatalog();}));
    $('#selected-stage-tag').textContent=moduleLabel(moduleKey(sel))[0].toUpperCase();
    $('#catalog-summary').innerHTML=sel.kind==='stage'?`<label>Stage type <select id="stage-type"><option value="bay">Bay</option><option value="booster">Booster</option></select></label><br>${isBooster(sel)?`Upper stage: a vacuum engine and a tank with the same propellants. It lights when the stage below runs dry and drops once empty; it needs a thrust-to-weight of ${UPPER_TWR().toFixed(1)} at ignition to keep climbing.`:'One equipment module per bay.'}`:sel.kind==='booster'?'Stage 1 engine and tank, with real data for each part; both must use the same propellants. Fins (optional) steady the ascent through Max-Q.':`${state.rocket.cabin.length}/${CABIN_SLOTS()} cabin slots filled. Three modules per specialist.`;
    if(sel.kind==='stage'){const control=$('#stage-type');control.value=state.rocket.stages[sel.index].type||'bay';control.addEventListener('change',()=>{state.rocket.stages[sel.index].type=control.value;state.tab=control.value==='booster'?'engine':'power';renderPlanner();});}
    const inst=installedIn(sel),current=isBooster(sel)?(sel.kind==='booster'?state.rocket.booster:state.rocket.stages[sel.index])[state.tab]:sel.kind==='stage'?inst[0]:null;
    $('#parts-list').innerHTML=partsFor(sel,state.tab).map(id=>{const p=part(id),on=inst.includes(id);
      return `<article class="part ${on?'equipped':''}"><div class="part-head"><div class="part-thumb" data-part-thumb="${id}">${partThumbFallback(id,p)}</div><div class="part-body"><div class="part-top"><span class="part-name">${p.name}</span><span class="part-slot">Tier ${p.tier}</span></div><p>${(p.role||'').replace(/`/g,'')}</p></div></div><div class="part-metrics">${partMetrics(id).map(x=>`<span>${x}</span>`).join('')}</div><button type="button" data-part="${id}">${on?'REMOVE':current?'SWAP':'INSTALL'}</button></article>`;}).join('');
    $$('#parts-list [data-part]').forEach(b=>b.addEventListener('click',()=>togglePart(b.dataset.part)));
    window.dispatchEvent(new Event('astro:catalog'));
  }
  function renderPlanner(){renderTelemetry();renderRocket();renderCatalog();}
  function selectModule(key,tab){state.sel=parseKey(key);const r=state.rocket;state.tab=tab||(state.sel.kind==='booster'?(r.booster.engine&&!r.booster.tank?'tank':'engine'):state.sel.kind==='cabin'?'helena':'power');window.dispatchEvent(new CustomEvent('astro:focus-module',{detail:key}));renderPlanner();}
  function addStage(index){const r=state.rocket;if(r.stages.length>=MAX_STAGES())return;r.stages.splice(index,0,{item:null});toast(`Stage ${index+2} added.`);selectModule(`stage-${index}`);}
  function removeStage(index){state.rocket.stages.splice(index,1);toast('Stage removed.');state.sel=parseKey(index>0?`stage-${index-1}`:'booster');state.tab=isBooster(state.sel)?'engine':'power';window.dispatchEvent(new CustomEvent('astro:stage-removed',{detail:moduleKey(state.sel)}));renderPlanner();}
  function togglePart(id){
    const r=state.rocket,sel=state.sel;
    if(isBooster(sel)){const k=state.tab,target=sel.kind==='booster'?r.booster:r.stages[sel.index];target[k]=target[k]===id?null:id;}
    else if(sel.kind==='stage'){const s=r.stages[sel.index];s.item=s.item===id?null:id;}
    else{const i=r.cabin.indexOf(id);if(i>=0)r.cabin.splice(i,1);else if(r.cabin.length>=CABIN_SLOTS()){toast(`The cabin is full: ${CABIN_SLOTS()} modules at most.`);return;}else r.cabin.push(id);}
    renderPlanner();
  }
  function showLaunch(){
    const m=metrics(),lift=liftoffOf(m),abort=lift.ok?abortOf(m):null,warnings=[];
    if(!lift.ok)warnings.push(`${lift.status[0].toUpperCase()+lift.status.slice(1).toLowerCase()}: the mission ends on the pad`);
    m.stack.slice(1).filter(s=>s.issue).forEach(s=>warnings.push(`${stageName(s.key)[0].toUpperCase()+stageName(s.key).slice(1)} ${s.issue==='thrust'?`too weak to fire (TWR ${s.twr.toFixed(2)} < ${UPPER_TWR().toFixed(1)})`:'cannot fire'}: dead weight`));
    if(lift.ok&&m.twr<TWR_MIN())warnings.push(`Thrust-to-weight below ${TWR_MIN().toFixed(1)}: slow, rough ascent`);
    if(m.cost>m.budget)warnings.push('Over budget');
    if(m.gen<m.draw)warnings.push('Power deficit');
    if(m.ready&&!m.orbit)warnings.push(`Δv below low Earth orbit (${number(m.dv)} of ${number(m.leo)} m/s): abort and splashdown`);
    if(m.orbit&&!m.marsOk)warnings.push(`Mars out of reach even after refueling (${number(m.marsDv)} of ${number(m.transfer)} m/s): the crew returns to Earth`);
    $('#launch-title').textContent=!lift.ok?'This rocket will not leave the pad':abort?(abort.reason==='no-orbit'?'This rocket will not reach orbit':'This rocket cannot reach Mars'):warnings.length?'Review the mission risks':'Mission ready to launch';
    $('#launch-message').textContent=!lift.ok?`${lift.detail} Launching now ends the mission on the pad.`:abort?`${abort.warn} The mission fails.`:warnings.length?'These choices will have consequences at launch or on arrival. Revise the design or launch with risks.':'The crew is ready for liftoff, orbital checklist, Mars landing, and surface operations.';
    $('#launch-summary').innerHTML=[['Crew',`${state.friends.size+1} player${state.friends.size?'s':''} · ${3-state.friends.size} AI`],['Site',SITES_INFO[state.site].name],['Difficulty',{easy:'EASY',normal:'NORMAL',hard:'HARD'}[state.difficulty]],['Stages',`${state.rocket.stages.length+2}`],['Budget remaining',money(m.budget-m.cost)],['Liftoff mass',tonnes(m.mass)],['Thrust-to-weight',m.ready?`${m.twr.toLocaleString('en-US',{maximumFractionDigits:2})} · ${lift.ok?`${lift.seconds} s ascent`:'no liftoff'}`:'— · no ignition'],['Δv to orbit',m.ready?`${number(m.dv)} / ${number(m.leo)} m/s`:'—'],['Mars transfer',m.orbit?`${number(m.marsDv)} / ${number(m.transfer)} m/s`:'—'],['Orbital refuel',m.marsOk?(m.refuelKg>0?`${Math.ceil(m.refuelPct)}% · ${tonnes(m.refuelKg)}`:'Not needed'):'—'],['Power',`${number(m.gen)} / ${number(m.draw)} W`],['Risks',warnings.length?warnings.join('; '):'All clear']].map(([label,value])=>`<div><span>${label}</span><strong>${value}</strong></div>`).join('');
    $('#launch-confirm').textContent=!lift.ok||abort?'Launch anyway →':warnings.length?'Launch with risks →':'Launch mission →';
    $('#launch-dialog').showModal();
  }
  function setupStars(){const canvas=$('#stars'),ctx=canvas.getContext('2d');if(!ctx)return;let stars=[];let width=0,height=0;const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;function resize(){const ratio=Math.min(devicePixelRatio||1,2);width=canvas.clientWidth;height=canvas.clientHeight;canvas.width=width*ratio;canvas.height=height*ratio;ctx.setTransform(ratio,0,0,ratio,0,0);stars=Array.from({length:Math.min(150,Math.floor(width*height/8500))},(_,i)=>({x:((i*2819)%1009)/1009*width,y:((i*3877)%1013)/1013*height,r:.4+(i%5)*.25,phase:i*.63,c:['#FCE8A6','#f7dfff','#c9a6ff'][i%3]}));}function draw(time){ctx.clearRect(0,0,width,height);for(const star of stars){ctx.globalAlpha=.25+.45*(.5+.5*Math.sin(time*.0008+star.phase));const r=star.r*1.7;ctx.fillStyle=star.c;ctx.beginPath();ctx.moveTo(star.x,star.y-r);ctx.lineTo(star.x+r*.6,star.y);ctx.lineTo(star.x,star.y+r);ctx.lineTo(star.x-r*.6,star.y);ctx.fill();}ctx.globalAlpha=1;if(!reduce)requestAnimationFrame(draw);}resize();window.addEventListener('resize',resize);requestAnimationFrame(draw);}
  const WORLD_NAMES={mercury:'Mercury',venus:'Venus',earth:'Earth',mars:'Mars',jupiter:'Jupiter',saturn:'Saturn',uranus:'Uranus',neptune:'Neptune'};
  $('#orbit-back').addEventListener('click',()=>showScreen('menu'));
  $('#objective-next').addEventListener('click',()=>showScreen('lobby'));
  // Every planet can be picked; only Mars opens a mission in this prototype, the others show as unavailable.
  // The orbit map listens to astro:world (reticle, and the planet the planning background zooms into).
  state.world = state.world || 'mars';
  function selectWorld(w){
    state.world=w;
    $$('[data-world]').forEach(b=>{const on=b.dataset.world===w;b.classList.toggle('selected',on);b.setAttribute('aria-pressed',String(on));});
    const open=w==='mars',name=WORLD_NAMES[w];
    $('#objective-title').textContent=open?'Explore Mars':name;
    $('#objective-description').textContent=open?'Land a crew, investigate ancient environments, and return discoveries to Earth.':w==='earth'?'The launch origin. Pick Mars to plan a mission.':`${name} is not open in this prototype. Mars is the only destination you can plan now.`;
    $('#objective-profile').textContent=open?'CREWED · SURFACE':'—';
    $('#objective-constraint').textContent=open?'MASS · POWER · DATA':'—';
    $('#objective-status').textContent=open?'READY TO PLAN':w==='earth'?'LAUNCH ORIGIN':'UNAVAILABLE';
    $('#objective-status').classList.toggle('locked',!open);
    const next=$('#objective-next');next.disabled=!open;next.textContent=open?'Plan this mission →':'Unavailable';
    window.dispatchEvent(new CustomEvent('astro:world',{detail:w}));
  }
  $$('[data-world]').forEach(button=>button.addEventListener('click',()=>selectWorld(button.dataset.world)));
  $$('[data-site]').forEach(button=>button.addEventListener('click',()=>{state.site=button.dataset.site;state.detail={kind:'site',id:state.site};renderLobby();}));
  $('#play-button').addEventListener('click',()=>{const go=()=>showScreen('orbit');window.ASTRO_LAUNCH?window.ASTRO_LAUNCH().then(go):go();});
  $('#lobby-back').addEventListener('click',()=>showScreen('orbit'));
  $('#to-assembly').addEventListener('click',()=>showScreen('planner'));
  $('#planner-back').addEventListener('click',()=>showScreen('lobby'));
  $('#quit-button').addEventListener('click',()=>$('#quit-dialog').showModal());
  $('#quit-cancel').addEventListener('click',()=>$('#quit-dialog').close());
  $('#quit-confirm').addEventListener('click',()=>$('#quit-dialog').close());
  $$('#difficulty-buttons button').forEach(button=>button.addEventListener('click',()=>{state.difficulty=button.dataset.difficulty;$$('#difficulty-buttons button').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));renderBadge();renderTelemetry();}));
  $('#launch-button').addEventListener('click',showLaunch);
  $('#launch-close').addEventListener('click',()=>$('#launch-dialog').close());
  // Launch: the pad and the countdown (web/launch.js), then the cockpit in the pilot's view. The pad already
  // showed the ignition, so the ascent (liftoff minigame) starts at once.
  // A rocket that cannot lift off (liftoffOf) plays its failure on the pad and goes straight to the debrief.
  $('#launch-confirm').addEventListener('click',()=>{
    $('#launch-dialog').close();
    const lift=DATA?liftoffOf(metrics()):{ok:true,accel:1};
    const go=()=>{const sim=window.ASTRO_SIM;if(!lift.ok){sim?.failLaunch(lift);return;}sim?.startFlight();if(sim?.flight)sim.flight.throttle=Math.max(sim.flight.throttle,.7);};
    window.ASTRO_LAUNCHPAD?window.ASTRO_LAUNCHPAD(lift).then(go):go();
  });
  // Low-poly art: planets and terrain are flat-shaded triangles, like the 3D models.
  const RAMPS = {
    mars:['#3a0f1c','#8F241E','#b8391f','#E04F26','#EE7B57','#f6a07f'],
    marsDark:['#2a0c18','#4a1420','#6e1d1d','#8F241E','#a8361f','#c4502e'],
    ice:['#8a7a86','#c9b8b0','#e9dccb','#FCE8A6','#fff6dc','#ffffff'],
    ocean:['#0b1a3a','#123a6b','#1d5f9a','#2c86ba','#5fb8dc','#a8e6f0'],
    land:['#14261a','#24432a','#3d6b3a','#5f8f4a','#93b46a','#cfe0a0'],
    jupiter:['#2e2020','#5a3e33','#8c6a50','#b8936e','#dcc19a','#f4e2c4'],
    jupiterBand:['#2a1612','#4e2c22','#7a4632','#a5643f','#c98855','#e8b27a'],
    sun:['#8F241E','#E04F26','#F59E0B','#f8c14a','#FCE8A6','#fff7df'],
    rock:['#1a1022','#33263a','#4d3d4c','#6b5a62','#8e7c7c','#b3a196'],
    jezero:['#2a0f22','#4a1420','#8F241E','#b8391f','#E04F26','#EE7B57'],
    gale:['#24101f','#3f1d24','#6e3324','#9c5129','#c27a3a','#e0a35a'],
    ground:['#1D1128','#3a1424','#5e1d22','#8F241E','#b8391f','#E04F26'],
    mercury:['#2a2428','#4a4246','#6e6468','#948a88','#b8aea6','#d8d0c6'],
    venus:['#5a4a2a','#8c7442','#bfa065','#dcc288','#efdcab','#fbf0d0'],
    saturn:['#4a3b25','#7d6542','#b09460','#d4ba82','#ead6a6','#f8ecc9'],
    saturnBand:['#3e2f1e','#6b5236','#957650','#b89a6a','#d2b88a','#e8d6ae'],
    uranus:['#1c3d48','#2f6573','#4f97a5','#7cc2cc','#aee0e3','#dff5f5'],
    neptune:['#0d1a4a','#1a2f7a','#2b4fb0','#4672d4','#7c9fe8','#b9cdf6']
  };
  const random = seed => { let s = (seed * 9973) % 2147483647 || 1; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
  const unit = v => { const l = Math.hypot(...v) || 1; return v.map(x => x / l); };
  const pick = (ramp, t) => ramp[Math.max(0, Math.min(ramp.length - 1, Math.floor(t * ramp.length)))];
  const poly = (pts, fill) => `<polygon points="${pts.map(p => p[0].toFixed(3) + ',' + p[1].toFixed(3)).join(' ')}" fill="${fill}" stroke="${fill}"/>`;
  // Triangle strip between two closed rings of different vertex counts.
  function zip(A, B) {
    const T = Math.PI * 2, base = Math.atan2(A[0][1], A[0][0]);
    const ang = p => ((Math.atan2(p[1], p[0]) - base) % T + T) % T;
    let start = 0; B.forEach((p, j) => { if (ang(p) < ang(B[start])) start = j; });
    const b = B.map((_, j) => B[(start + j) % B.length]), at = A.map(ang), bt = b.map(ang), tris = [];
    let i = 0, j = 0;
    while (i < A.length || j < b.length) {
      const nextA = i < A.length ? (i + 1 < A.length ? at[i + 1] : T) : Infinity;
      const nextB = j < b.length ? (j + 1 < b.length ? bt[j + 1] : T + bt[0]) : Infinity;
      if (nextA <= nextB) { tris.push([A[i % A.length], A[(i + 1) % A.length], b[j % b.length]]); i++; }
      else { tris.push([A[i % A.length], b[(j + 1) % b.length], b[j % b.length]]); j++; }
    }
    return tris;
  }
  // Sphere seen from the front: rings of vertices lifted onto the sphere, one flat colour per face.
  function facetPolys({ ramp, seed = 1, rings = [6, 12, 18], light = [-.55, -.6, .58], regions = [] }) {
    const rnd = random(seed), L = unit(light);
    const loops = rings.map((n, i) => {
      const last = i === rings.length - 1, r = (i + 1) / rings.length, off = rnd() * 6.283;
      return Array.from({ length: n }, (_, k) => {
        const a = off + (k + (last ? 0 : (rnd() - .5) * .5)) * 6.283 / n, rr = last ? 1 : r * (.9 + rnd() * .14);
        return [rr * Math.cos(a), rr * Math.sin(a)];
      });
    });
    const tris = loops[0].map((p, k, a) => [[0, 0], p, a[(k + 1) % a.length]]);
    for (let i = 0; i + 1 < loops.length; i++) tris.push(...zip(loops[i], loops[i + 1]));
    const lift = ([x, y]) => [x, y, Math.sqrt(Math.max(0, 1 - x * x - y * y))];
    return `<g stroke-width=".008" stroke-linejoin="round">${tris.map(t => {
      const [a, b, c] = t.map(lift), u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
      let n = unit([u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]);
      if (n[2] < 0) n = n.map(x => -x);
      const cx = (a[0] + b[0] + c[0]) / 3, cy = (a[1] + b[1] + c[1]) / 3;
      const region = regions.find(r => r.test(cx, cy));
      return poly(t, pick(region ? region.ramp : ramp, Math.max(0, n[0] * L[0] + n[1] * L[1] + n[2] * L[2]) + (rnd() - .5) * .12));
    }).join('')}</g>`;
  }
  const facetPlanet = opts => `<svg viewBox="-1.02 -1.02 2.04 2.04" aria-hidden="true">${facetPolys(opts)}</svg>`;
  const PLANETS = {
    mars: { ramp: RAMPS.mars, regions: [{ test: (x, y) => y < -.8, ramp: RAMPS.ice }, { test: (x, y) => Math.sin(x * 4.2 + 1.3) * Math.cos(y * 3.1 - .4) > .42, ramp: RAMPS.marsDark }] },
    earth: { ramp: RAMPS.ocean, regions: [{ test: (x, y) => Math.abs(y) > .82, ramp: RAMPS.ice }, { test: (x, y) => Math.sin(x * 3.3 + .6) + Math.cos(y * 4.1 + x * 1.7) > .9, ramp: RAMPS.land }] },
    jupiter: { ramp: RAMPS.jupiter, regions: [{ test: (x, y) => Math.floor((y + 1) * 3.2) % 2 === 1, ramp: RAMPS.jupiterBand }] },
    mercury: { ramp: RAMPS.mercury },
    venus: { ramp: RAMPS.venus },
    saturn: { ramp: RAMPS.saturn, regions: [{ test: (x, y) => Math.floor((y + 1) * 3.6) % 2 === 1, ramp: RAMPS.saturnBand }] },
    uranus: { ramp: RAMPS.uranus },
    neptune: { ramp: RAMPS.neptune, regions: [{ test: (x, y) => Math.hypot(x + .3, y + .25) < .22, ramp: RAMPS.ocean }] }
  };
  // Landscape: rows of jittered vertices from a silhouette profile down to the bottom edge.
  function facetTerrain({ profile, ramp, seed = 1, w = 160, h = 100, cols = 12, rows = 5 }) {
    const rnd = random(seed);
    const top = x => { for (let k = 1; k < profile.length; k++) if (x <= profile[k][0]) { const [x0, y0] = profile[k - 1], [x1, y1] = profile[k]; return y0 + (y1 - y0) * (x - x0) / (x1 - x0); } return profile[profile.length - 1][1]; };
    const xs = Array.from({ length: cols + 1 }, (_, c) => c === 0 || c === cols ? c / cols : (c + (rnd() - .5) * .6) / cols);
    const grid = Array.from({ length: rows + 1 }, (_, r) => xs.map(x => {
      const y0 = top(x), t = Math.pow(r / rows, 1.5), jitter = r > 0 && r < rows ? (rnd() - .5) * .05 : 0;
      return [x * w, (y0 + (1 - y0) * t + jitter) * h];
    }));
    let out = '';
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const a = grid[r][c], b = grid[r][c + 1], d = grid[r + 1][c], e = grid[r + 1][c + 1];
      const pair = (r + c) % 2 ? [[a, b, e], [a, e, d]] : [[a, b, d], [b, e, d]];
      pair.forEach((t, k) => { out += poly(t, pick(ramp, .78 - r / rows * .5 + (k ? -.12 : .1) + (rnd() - .5) * .22)); });
    }
    return `<g stroke-width=".25" stroke-linejoin="round">${out}</g>`;
  }
  const SITES = {
    jezero: { ramp: RAMPS.jezero, seed: 4, profile: [[0, .34], [.12, .3], [.22, .38], [.35, .44], [.5, .46], [.65, .45], [.78, .39], [.9, .31], [1, .35]] },
    gale: { ramp: RAMPS.gale, seed: 9, profile: [[0, .52], [.15, .5], [.3, .47], [.42, .36], [.5, .22], [.58, .3], [.68, .42], [.82, .49], [1, .5]] }
  };
  // Landing site photo: the real HiRISE orthoimage around the landing point (assets/sites, tools/web/site-photos.mjs).
  // The big view marks the 512 m walkable terrain (centre third of the 1.5 km photo) and credits the source.
  const sitePhoto = (id, big) => `<img class="site-photo" src="assets/sites/${id}.png" alt="${big ? `HiRISE orbital photo around the ${SITES_INFO[id].name} landing point` : ''}">`
    + (big ? `<span class="site-walk" aria-hidden="true"><small>512 m walk area</small></span><span class="site-credit">HiRISE (MRO) · 1.5 km wide · north up · NASA/JPL/UArizona, USGS (CC0)</span>` : '');
  function menuMars() {
    const tilt = -14 * Math.PI / 180, at = t => { const x = 1.45 * Math.cos(t), y = .36 * Math.sin(t); return [x * Math.cos(tilt) - y * Math.sin(tilt), x * Math.sin(tilt) + y * Math.cos(tilt)]; };
    const arc = (t0, t1) => Array.from({ length: 13 }, (_, k) => at(t0 + (t1 - t0) * k / 12).map(v => v.toFixed(3)).join(',')).join(' ');
    const [px, py] = at(Math.PI * .8);
    return `<svg viewBox="-1.6 -1.6 3.2 3.2" aria-hidden="true"><polyline class="orbit-back" points="${arc(Math.PI, Math.PI * 2)}"/>${facetPolys({ ...PLANETS.mars, seed: 11, rings: [6, 12, 18, 24] })}<polyline points="${arc(0, Math.PI)}"/><g transform="translate(${px.toFixed(3)} ${py.toFixed(3)}) scale(.09)">${facetPolys({ ramp: RAMPS.rock, seed: 5, rings: [5, 9] })}</g></svg>`;
  }
  // Polygonal orbits plus a Hohmann-style transfer from Earth (r 26, 200°) to Mars arrival (r 38.5, 20°).
  function orbitRings() {
    const ring = (r, n) => `<polygon points="${Array.from({ length: n }, (_, k) => { const a = k / n * Math.PI * 2; return (50 + r * Math.cos(a)).toFixed(2) + ',' + (50 + r * Math.sin(a)).toFixed(2); }).join(' ')}"/>`;
    const r1 = 26, r2 = 38.5, e = (r2 - r1) / (r2 + r1), p = (r1 + r2) / 2 * (1 - e * e), th0 = 200 * Math.PI / 180;
    const transfer = Array.from({ length: 11 }, (_, k) => { const t = k / 10 * Math.PI, r = p / (1 + e * Math.cos(t)); return (50 + r * Math.cos(th0 + t)).toFixed(2) + ',' + (50 - r * Math.sin(th0 + t)).toFixed(2); }).join(' ');
    return `<svg class="orbit-rings" viewBox="0 0 100 100" aria-hidden="true">${ring(13.5, 14)}${ring(26, 20)}${ring(38.5, 26)}${ring(50, 32)}<polyline class="transfer" points="${transfer}"/></svg>`;
  }
  function paintArt() {
    $('.mars').innerHTML = menuMars();
    $('.orbit-system').insertAdjacentHTML('afterbegin', orbitRings());
    $('.orbit-sun').innerHTML = facetPlanet({ ramp: RAMPS.sun, seed: 7, rings: [6, 12], light: [0, 0, 1] });
    $('.earth .planet-disc').innerHTML = facetPlanet({ ...PLANETS.earth, seed: 2, rings: [5, 10, 15] });
    $('.mars-target .planet-disc').innerHTML = facetPlanet({ ...PLANETS.mars, seed: 8, rings: [6, 12, 17] });
    $('.jupiter .planet-disc').innerHTML = facetPlanet({ ...PLANETS.jupiter, seed: 6, rings: [6, 12, 18] });
    $$('.site-thumb .thumb-art').forEach(el => { el.innerHTML = sitePhoto(el.parentElement.dataset.site); });
  }
  // ===========================================================================
  // PHASES 5–7 SIMULATION ENGINE & RAD SOUNDSCAPE (Cockpit -> Mars Surface -> Results)
  // ===========================================================================
  const SIM = (() => {
    const refuelTarget = () => flight.design?.refuelTarget ?? 100;
    const PUMP_STEP = 25; // game-balance: percentage points per transfer
    // All four flight phases are timed game-balance challenges. The stepper uses these
    // durations directly, so its fill and its remaining-time counter cannot diverge.
    // The liftoff lasts ASCENT.refS for the reference design and follows the liftoff TWR (ascentSeconds).
    const FLIGHT_PHASES = [
      { id: 'liftoff', duration: ASCENT.refS },
      { id: 'separation', duration: 60 },
      { id: 'docking', duration: 32 },
      { id: 'mars-burn', duration: 15 },
    ];
    const phaseDuration = step => (step === 0 && flight.liftoffSeconds) || (FLIGHT_PHASES[step]?.duration ?? 0);
    // Cockpit telemetry, consistent with the rocket that was built (metrics) and with the real order of a flight.
    // Ascent: x = Δv used / leo; speed = x × ORBIT.velMs (the ascent losses spread evenly over the climb) and
    // altitude = ORBIT.altKm × x^1.5 (game shape). Step 0 burns stage 1 dry (or all the way to orbit, if it gets
    // there alone); the first INSERT_S seconds of step 1 finish the climb with the stages above.
    // Landing: Perseverance's entry, descent and landing (Mars 2020) squeezed into the landing minigame.
    const INSERT_S = 6; // game-balance: seconds of upper-stage burn at the start of step 1
    // [seconds after entry, altitude km, speed m/s]. Real (references/experiments/mars-experiments.md): entry at 125 km
    // and 19,500 km/h; parachute at E+4:00, 11 km, 1,512 km/h; backshell off and powered descent from 2.1 km at E+5:50;
    // sky crane from 20 m at 2.7 km/h, 12 s before touchdown, ~7 min after entry. The rows in between are est.:
    // most of the speed goes around peak deceleration (~E+90 s).
    const EDL = [[0, 125, 5417], [60, 66, 4620], [90, 46, 2920], [120, 32, 1210], [150, 21, 590], [240, 11, 420],
      [300, 6, 160], [350, 2.1, 90], [408, 0.02, 0.75], [420, 0, 0]];
    const EDL_CHUTE = 240, EDL_POWERED = 350, EDL_END = 420;
    const DESCENT_RESERVE = 25; // game-balance: % left in the descent tanks at touchdown
    const RAD_MARS_UGY_DAY = 165; // real: quiet-window median, Curiosity RAD detector E (references/datasets/msl-rad)
    const lerp = (a, b, k) => a + (b - a) * Math.max(0, Math.min(1, k));
    const edlAt = e => {
      const i = Math.max(1, EDL.findIndex(r => r[0] >= e)), [e0, h0, v0] = EDL[i - 1], [e1, h1, v1] = EDL[i];
      const k = (e - e0) / (e1 - e0);
      return [lerp(h0, h1, k), lerp(v0, v1, k)];
    };
    // Which stage burns when: stage 1 in step 0, the orbit stage (the one refuelled in orbit) in steps 1–2.
    function ascentPlan(d) {
      const firing = (d.stack || []).filter(s => s.m0 && s.prop), s1 = firing[0];
      if (!s1) return null;
      const k = d.refuelStage ? Math.max(0, firing.findIndex(s => s.key === d.refuelStage.key)) : firing.length - 1;
      const solo = d.orbit && k === 0, top = firing[k];
      return { s1, top, solo, burn1: solo ? s1.prop - d.orbitLeftKg : s1.prop, x0: solo ? 1 : Math.min(1, s1.dv / d.leo),
        topLeftPct: d.orbit ? (d.orbitLeftKg / top.prop) * 100 : 0, g0: rule('g0Ms2', 9.80665) };
    }
    function updateTelemetry(dt) {
      const f = flight, d = f.design, p = f.ascent, climb = x => { f.velMs = x * ORBIT.velMs; f.altKm = ORBIT.altKm * Math.pow(x, 1.5); };
      if (f.step === 0) {
        const g = f.liftoff, k = g ? g.t / g.duration : 0;
        if (p && g) climb(p.s1.isp * p.g0 * Math.log(p.s1.m0 / (p.s1.m0 - k * p.burn1)) / d.leo);
        else { f.velMs = 0; f.altKm = 0; }
        f.propellant = p ? 100 - (k * p.burn1 / p.s1.prop) * 100 : 100;
      } else if (f.step === 1) {
        f.insertT = Math.min(INSERT_S, f.insertT + dt);
        const k = f.insertT / INSERT_S;
        climb(p ? lerp(p.x0, 1, k) : 1);
        f.propellant = !p ? 0 : p.top === p.s1 ? (p.solo ? p.topLeftPct : 0) : lerp(100, p.topLeftPct, k);
        f.throttle = k < 1 && p && !p.solo ? 1 : 0; // the upper stage burns to orbit, then the engines stop
      } else if (f.step === 2) {
        f.altKm = ORBIT.altKm; f.velMs = ORBIT.velMs; f.throttle = 0;
        f.propellant = Math.min(100, (p?.topLeftPct ?? 0) + f.refuelDone);
      } else if (f.step === 3) {
        const g = f.marsBurn, e = g ? (g.t / g.duration) * EDL_END : 0;
        [f.altKm, f.velMs] = edlAt(e);
        f.propellant = e < EDL_POWERED ? 100 : lerp(100, DESCENT_RESERVE, (e - EDL_POWERED) / (EDL_END - EDL_POWERED));
        f.throttle = e >= EDL_POWERED ? 0.6 : 0; // descent engines only fire after the backshell separates
        if (e >= EDL_CHUTE && !f.edlChuteDeployed) {
          f.edlChuteDeployed = true;
          logFlight('Supersonic parachute deployed: 11 km, 1,512 km/h.');
          radAudio.tone(820, 0.12, 'triangle', 0.06);
        }
      }
    }
    const tankLabel = () => flight.step === 3 ? 'Descent tank' : !flight.ascent ? 'Propellant'
      : `${(flight.step === 0 ? 'stage 1' : stageName(flight.ascent.top.key)).replace(/^s/, 'S')} tank`;
    const clock = seconds => `${String(Math.floor(Math.max(0, seconds) / 60)).padStart(2, '0')}:${String(Math.ceil(Math.max(0, seconds) % 60)).padStart(2, '0')}`;
    const radAudio = {
      muted: false,
      bed: null,
      ctx: null,
      geigerTimer: null,
      ensureCtx() {
        if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
          this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx?.state === 'suspended') this.ctx.resume().catch(() => {});
      },
      tone(freq, dur = 0.08, type = 'triangle', gain = 0.05) {
        if (this.muted) return;
        this.ensureCtx();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        g.gain.setValueAtTime(gain, this.ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
        osc.connect(g).connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + dur);
      },
      startSurfaceBed() {
        if (this.muted) return;
        try {
          if (!this.bed) {
            this.bed = new Audio('assets/audio/rad_surface_bed.wav');
            this.bed.loop = true;
            this.bed.volume = 0.35;
          }
          this.bed.play().catch(() => {});
        } catch { /* file:// or autoplay policy fallback */ }
        clearInterval(this.geigerTimer);
        this.geigerTimer = setInterval(() => {
          if (!this.muted && state.screen === 'surface' && Math.random() < 0.38) {
            this.tone(1400 + Math.random() * 500, 0.015, 'square', 0.018);
          }
        }, 420);
      },
      stopAll() {
        if (this.bed) { this.bed.pause(); this.bed.currentTime = 0; }
        clearInterval(this.geigerTimer);
      },
      toggleMute() {
        this.muted = !this.muted;
        if (this.muted) this.stopAll();
        else if (state.screen === 'surface') this.startSurfaceBed();
        const txt = this.muted ? 'Audio: Off' : 'Audio: On';
        $('#audio-toggle-cockpit').textContent = txt;
      }
    };
    $('#audio-toggle-cockpit').addEventListener('click', () => radAudio.toggleMute());

    const flight = {
      active: false,
      step: 0, // 0=Liftoff & Max-Q, 1=Bus & Stage Sep, 2=Refuel & Solar Storm, 3=Mars EDL
      progress: 0,
      altKm: 0,
      velMs: 0,
      hull: 100,
      propellant: 100,
      throttle: 0.4,
      pitchX: 0,
      pitchY: 0,
      stability: 100,
      breakers: [false, false, false],
      stageSeparated: false,
      separationAdvancing: false,
      refuelDone: 0,
      stormShielded: false,
      edlChuteDeployed: false,
      score: 100,
      design: null,
      phaseElapsed: 0,
      phaseTimedOut: false,
      completedPhases: new Set(),
      docking: null,
      docked: false,
      marsBurn: null,
      keys: new Set(),
      raf: 0,
      lastTime: 0,
      sparksUntil: 0,
    };

    // Surface experiments: the MVP ground candidates of docs/minigames.md, one per crew member. The owner runs
    // the minigame next to its block and the experiment counts in the results. Real facts come from
    // references/experiments/minigames/*/README.md.
    const SURFACE_TASKS = [
      {
        id: 'H-S1', crew: 'helena', title: 'Surface escort', minigame: 'Escort route', mechanic: 'Route planning',
        basis: 'Mars traverse & Ingenuity recon (2021–24)',
        desc: 'Trace a path from 1 to 5 in order without stepping onto ⚠ sand traps or crossing your trail.',
        fact: 'Real fact: Reconnaissance routes on Mars avoid featureless sand ripples — Ingenuity completed 72 flights (17 km total, over 10× its 5-flight plan) before smooth sand confused its navigation camera on Flight 72.',
      },
      {
        id: 'L-S1', crew: 'lucas', title: 'Oxygen oven', minigame: 'Make oxygen', mechanic: 'Keep in range',
        basis: 'MOXIE on Perseverance (2021–23)',
        desc: 'Hold Heat to keep the reactor inside the 780–820 °C green zone (target 800 °C) until 6.0 g of O₂ is produced.',
        fact: 'Real fact: MOXIE produced 122 g of ≥98% pure oxygen across 16 runs on Mars at 800 °C (300 W), peaking at 12 g/h — twice NASA’s original goal.',
      },
      {
        id: 'O-S1', crew: 'oscar', title: 'Orbiter pass', minigame: 'Contact window', mechanic: 'Choice under a limit',
        basis: 'Electra UHF relay (MRO / TGO)',
        desc: 'Pick the highest-value science packets that fit inside the 250 Mb pass budget before the 40 s orbiter window closes.',
        fact: 'Real fact: A single 8-minute UHF orbiter pass relays 100–250 Mb at up to 2 Mbps. With MAVEN lost in Dec 2025, every remaining Mars relay pass is even more critical.',
      },
      {
        id: 'M-S1', crew: 'maya', title: 'Biosignature hunter', minigame: 'Leopard spots', mechanic: 'Pattern search',
        basis: 'PIXL + SHERLOC on Cheyava Falls (2024–25)',
        desc: 'Step 1: Sweep 3×3 zones with SHERLOC to spot glowing ✦ suspects. Step 2: Test them with PIXL (1×1) to confirm 3 real leopard spots.',
        fact: 'Real fact: In Sept 2025, NASA called the vivianite and greigite “leopard spots” on Cheyava Falls a potential biosignature; confirming it requires returning samples to Earth, while Mars Sample Return was cancelled in Jan 2026.',
      },
    ];

    // Surface state (rules). The 3D module walks the crew on the real terrain and reports back.
    const surf = { active: false, timerSec: 180, lastTick: 0, raf: 0, activeCrew: 'helena', tasks: SURFACE_TASKS, completed: new Set(), stranded: [] };

    function logFlight(msg) {
      const box = $('#flight-log');
      if (!box) return;
      const line = document.createElement('div');
      line.textContent = msg;
      box.prepend(line);
      while (box.children.length > 7) box.lastElementChild.remove();
    }

    function captureDesign() {
      const r = state.rocket;
      const installed = new Set([r.booster.engine, r.booster.tank, ...r.stages.map(s => s.item), ...r.cabin].filter(Boolean));
      const m = DATA ? metrics() : { cost: 0, mass: 0, draw: 0, gen: 0, dv: 0, budget: budgetOf(state.difficulty), leo: 9400, twr: 0, ready: false, orbit: false, marsOk: false, refuelPct: 0 };
      return {
        ...m,
        // Share of the refuelling stage's tank to pump in orbit (metrics); a full tank when Mars is out of reach.
        refuelTarget: m.marsOk ? Math.ceil(m.refuelPct) : 100,
        refuelTank: m.marsOk && m.refuelStage ? stageName(m.refuelStage.key) : null,
        overweight: !m.ready || m.twr < TWR_MIN(),
        finsDrift: r.booster.fins ? (spec(r.booster.fins).aeroDriftFactor ?? 1) : 1, // aerodynamic minigames: gust scale
        overBudget: m.cost > m.budget,
        powerDeficit: m.gen < m.draw,
        lowDv: !m.orbit,
        hasHera: installed.has('cabin-hera-dosimetry'),
        hasShelter: installed.has('cabin-storm-shelter') || installed.has('hab-veggie-rad-astrorad'),
        hasCockpitUpgrade: installed.has('cabin-orion-cockpit') || installed.has('cabin-autonav-conjunction'),
        hasLoftid: installed.has('edl-aspire-loftid'),
        hasTrn: installed.has('edl-trn-medli2'),
        hasDrill: installed.has('drill-corer-cryo') || installed.has('sci-seis-caching'),
        hasSpec: installed.has('sci-pixl-sherloc-supercam') || installed.has('sci-hirise-sharad') || installed.has('truss-ingenuity'),
        hasDna: installed.has('cabin-msg-minion'),
        hasDish: installed.has('comm-dsoc-laser') || installed.has('comm-electra-marco') || installed.has('comm-rise-xband') || installed.has('cabin-scan-console'),
      };
    }

    function startFlight() {
      flight.design = captureDesign();
      flight.liftoffSeconds = flight.design.ready ? ascentSeconds(flight.design.twr) : 0;
      flight.ascent = ascentPlan(flight.design);
      flight.insertT = 0;
      flight.landingShare = null;
      flight.active = true;
      flight.step = 0;
      flight.progress = 0;
      flight.altKm = 0;
      flight.velMs = 0;
      flight.hull = 100;
      flight.propellant = 100;
      flight.throttle = 0.35;
      flight.pitchX = 0;
      flight.pitchY = 0;
      flight.stability = 100;
      flight.liftoff = null;
      flight.hold = null;
      flight.breakers = [
        flight.design.powerDeficit,
        flight.design.powerDeficit || flight.design.overweight,
        false,
      ];
      flight.stageSeparated = false;
      flight.separationAdvancing = false;
      flight.refuelDone = 0;
      flight.stormShielded = false;
      flight.edlChuteDeployed = false;
      flight.score = 100 - (flight.design.overBudget ? 12 : 0) - (flight.design.overweight ? 10 : 0);
      flight.sparksUntil = flight.design.powerDeficit || flight.design.overweight ? performance.now() + 2800 : 0;
      flight.phaseElapsed = 0;
      flight.phaseTimedOut = false;
      flight.completedPhases = new Set();
      flight.docking = null;
      flight.docked = false;
      flight.marsBurn = null;

      logFlight('T-00:00 Flight Deck online. Camera_Pilot locked.');
      if (flight.design.ready) logFlight(`Liftoff TWR ${flight.design.twr.toFixed(2)}: ${phaseDuration(0)} s climb to MECO.`);
      if (flight.design.overweight) logFlight(`ALERT: Low liftoff TWR (<${TWR_MIN().toFixed(1)}): slow climb and heavy aerodynamic buffet!`);
      if (flight.design.powerDeficit) logFlight('ALERT: Electrical bus deficit — inspect Breaker_Bank.');
      if (flight.design.overBudget) logFlight('CAUTION: Mission exceeded budget — finance penalty logged.');
      showScreen('cockpit');
      renderFlightUI();
      cancelAnimationFrame(flight.raf);
      flight.lastTime = performance.now();
      flight.raf = requestAnimationFrame(flightTick);
    }

    // Reusable mechanic "keep in range" (docs/minigames.md): a value drifts on its own and the player pushes it
    // back (input −1…1) to keep it inside the green band. The value has inertia, so corrections overshoot.
    // Stars come from the share of time spent inside the band (0–3, docs/minigames.md rule 3).
    // axes: 1 (a gauge) or 2 (a reticle: inside the band when the distance to the centre is ≤ band).
    // drift(t) and input return one number per axis.
    function createKeepInRange({ duration, band, limit, authority, damping = 1.5, drift, axes = 1 }) {
      const g = { t: 0, value: Array(axes).fill(0), rate: Array(axes).fill(0), inBand: 0, duration, band, limit, axes, error: 0, done: false };
      g.tick = (dt, input) => {
        if (g.done) return g;
        g.t = Math.min(duration, g.t + dt);
        const d = [].concat(drift(g.t, g.value)), u = [].concat(input);
        for (let k = 0; k < axes; k++) {
          g.rate[k] += ((d[k] || 0) + (u[k] || 0) * authority - g.rate[k] * damping) * dt;
          g.value[k] = Math.max(-limit, Math.min(limit, g.value[k] + g.rate[k] * dt));
          if (Math.abs(g.value[k]) === limit) g.rate[k] = 0;
        }
        g.error = Math.hypot(...g.value);
        if (g.error <= band) g.inBand += dt;
        g.done = g.t >= duration;
        return g;
      };
      g.share = () => (g.t ? g.inBand / g.t : 1);
      g.stars = () => { const k = g.share(); return k >= 0.85 ? 3 : k >= 0.65 ? 2 : k >= 0.4 ? 1 : 0; };
      return g;
    }

    // Liftoff (Helena, keep in range on the navball): hold the ascent program through Max-Q in pitch and yaw.
    // value = [pitch, yaw] error in degrees (pitch > 0 = nose high, yaw > 0 = nose right); the band is a circle.
    // Gusts grow at Max-Q and with a low TWR; fins damp them (design.finsDrift). All numbers are game-balance.
    // The climb lasts phaseDuration(0), set by the liftoff TWR; maxQ is the share of it where the gusts peak.
    const LIFTOFF = { band: 3, limit: 12, authority: 8, maxQ: [0.4, 0.67], throttle: 0.7 };
    function startLiftoff() {
      const d = flight.design, s1 = Math.random() * 100, s2 = Math.random() * 100, duration = phaseDuration(0);
      const gust = (d.overweight ? 1.6 : 1) * (d.finsDrift ?? 1); // low TWR: the stack wallows more
      return createKeepInRange({
        axes: 2, duration, band: LIFTOFF.band, limit: LIFTOFF.limit,
        authority: LIFTOFF.authority * (d.hasCockpitUpgrade ? 1.25 : 1),
        drift: t => {
          const u = t / duration, k = gust * (u > LIFTOFF.maxQ[0] && u < LIFTOFF.maxQ[1] ? 2.4 : 1); // gusts peak around Max-Q
          return [k * (3.2 * Math.sin(t * 0.9 + s1) + 2.6 * Math.sin(t * 2.3 + s1 * 1.7) + 1),
            k * (2.8 * Math.sin(t * 1.1 + s2) + 2.2 * Math.sin(t * 1.9 + s2 * 1.3))];
        },
      });
    }
    function finishLiftoff(g) {
      const stars = g.stars(), share = Math.round(g.share() * 100);
      flight.liftoffStars = stars;
      flight.score += (stars - 1) * 4;
      logFlight(`MECO. Ascent program held ${share}% of the time (${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}).`);
      toast(`Liftoff ${'★'.repeat(stars)}${'☆'.repeat(3 - stars)} · ${share}% inside the band`);
      if (!flight.design.orbit) { abortMission(abortOf(flight.design)); return; } // the stages ran dry short of orbit
      setFlightStep(1);
    }

    // After the orbital refuel: the transfer burn either reaches Mars or the crew comes home (abortOf).
    function toMars() {
      const abort = abortOf(flight.design);
      if (abort) abortMission(abort); else setFlightStep(3);
    }

    // Δv abort: the flight stops, the capsule comes down under parachutes into the sea (web/launch.js) and the
    // debrief shows the cause with an empty podium.
    function abortMission(info) {
      flight.active = false;
      cancelAnimationFrame(flight.raf);
      logFlight(`ABORT. ${info.detail}`);
      const debrief = () => failLaunch(info);
      if (window.ASTRO_SPLASHDOWN) window.ASTRO_SPLASHDOWN(info).then(debrief); else debrief();
    }

    // Phase 03: relative motion to the station, seen from the centre console's external camera.
    // The station is intentionally close to keep the MVP legible; values are game-balance.
    const DOCKING = { duration: 18, band: 0.18, limit: 1, authority: 1.35 };
    function startDocking() {
      const s1 = Math.random() * 100, s2 = Math.random() * 100;
      const consequence = flight.liftoffStars < 2 || !flight.stageSeparated ? 1.35 : 1;
      return createKeepInRange({
        axes: 2, ...DOCKING,
        drift: t => [
          consequence * (.36 * Math.sin(t * 1.35 + s1) + .18 * Math.sin(t * 2.8 + s1 * .7)),
          consequence * (.32 * Math.sin(t * 1.1 + s2) + .16 * Math.sin(t * 2.4 + s2 * 1.2)),
        ],
      });
    }
    function finishDocking(g) {
      const aligned = Math.round(g.share() * 100);
      flight.docked = true;
      flight.stability = aligned;
      flight.score += g.stars() * 3;
      logFlight(`Station hard-dock confirmed. Relative alignment held ${aligned}% of the approach.`);
      toast(`Docking secure · ${aligned}% inside the approach corridor`);
      renderFlightUI();
    }

    // Phase 04 reuses the pilot mechanic with the response mirrored: the burn is observed
    // from behind the vehicle, so the player has to counter-steer in the opposite direction.
    const MARS_BURN = { duration: phaseDuration(3), band: LIFTOFF.band, limit: LIFTOFF.limit, authority: LIFTOFF.authority };
    function startMarsBurn() {
      const s1 = Math.random() * 100, s2 = Math.random() * 100;
      const transferPenalty = flight.docking?.stars() < 2 ? 1.25 : 1;
      return createKeepInRange({
        axes: 2, ...MARS_BURN,
        drift: t => [
          transferPenalty * (2.6 * Math.sin(t * .82 + s1) + 1.9 * Math.sin(t * 2.1 + s1 * 1.4)),
          transferPenalty * (2.2 * Math.sin(t * 1.16 + s2) + 1.7 * Math.sin(t * 2.5 + s2 * .8)),
        ],
      });
    }
    function finishMarsBurn(g, timedOut = false) {
      const share = Math.round(g.share() * 100), stars = g.stars();
      flight.score += (stars - 1) * 5 - (timedOut ? 8 : 0);
      flight.landingShare = share;
      logFlight(`Touchdown. ${share}% inside the landing corridor.`);
      toast(`Mars landing ${'★'.repeat(stars)}${'☆'.repeat(3 - stars)} · ${share}% aligned`);
      finishFlightAndLand();
    }

    function triggerPhaseTransition() {
      for (const el of [$('#cockpit-viewport'), $('#cockpit-minigame')]) {
        if (!el) continue;
        el.classList.remove('is-transitioning');
        void el.offsetWidth;
        el.classList.add('is-transitioning');
        window.setTimeout(() => el.classList.remove('is-transitioning'), 600);
      }
    }

    function setFlightStep(nextStep) {
      flight.completedPhases.add(flight.step);
      flight.step = nextStep;
      flight.progress = 0;
      flight.phaseElapsed = 0;
      flight.phaseTimedOut = false;
      if (nextStep !== 1) flight.separationAdvancing = false;
      flight.input = null;
      triggerPhaseTransition();
      if (nextStep === 1) {
        const roughAscent = (flight.liftoffStars ?? 0) < 2;
        flight.portDock = {
          x: roughAscent ? 0.62 : 0.45,
          y: roughAscent ? -0.42 : -0.3,
          z: 5,
          fuel: 100,
          status: 'approach',
        };
        flight.breakers = [false, false, false];
        flight.sparksUntil = 0;
        logFlight(roughAscent
          ? 'Rough ascent increased station approach offset. Align the cabin hatch on the centre monitor.'
          : 'Booster separated. Align the cabin hatch with the rotating station port on the centre monitor.');
        radAudio.tone(520, 0.14, 'triangle', 0.05);
      } else if (nextStep === 2) {
        flight.docking = startDocking();
        flight.docked = false;
        flight.refuelDone = 0;
        logFlight(`ORBIT ACHIEVED. Match velocity with the tanker, then transfer ${refuelTarget()}% propellant.`);
        radAudio.tone(660, 0.12, 'triangle', 0.05);
      } else if (nextStep === 3) {
        flight.marsBurn = startMarsBurn();
        logFlight('Trans-Mars injection and cruise complete. Entry interface: 125 km, 19,500 km/h. Hold the landing corridor.');
        radAudio.tone(520, 0.15, 'triangle', 0.05);
      }
      renderFlightUI();
    }

    function handleCockpitAction(actionId, arg) {
      if (!flight.active) return;
      if (actionId === 'throttle_up') {
        flight.throttle = Math.min(1, flight.throttle + 0.35);
        radAudio.tone(240 + flight.throttle * 180, 0.09, 'triangle', 0.05);
        if (flight.step === 0) logFlight(`Throttle_Lever pushed to ${Math.round(flight.throttle * 100)}%.`);
      } else if (actionId === 'steer') {
        const [dx, dy] = arg || [0, 0];
        const gain = flight.design.hasCockpitUpgrade ? 0.32 : 0.24;
        flight.pitchX = Math.max(-1, Math.min(1, flight.pitchX + dx * gain));
        flight.pitchY = Math.max(-1, Math.min(1, flight.pitchY + dy * gain));
        radAudio.tone(440, 0.04, 'sine', 0.03);
      } else if (actionId === 'stabilize') {
        if (flight.step === 2 && flight.docking && !flight.docked) {
          flight.docking.value = flight.docking.value.map(v => v * 0.68);
          flight.docking.rate = flight.docking.rate.map(v => v * 0.2);
          flight.docking.error = Math.hypot(...flight.docking.value);
          flight.stability = Math.min(100, flight.stability + 8);
          logFlight('Relative-velocity trim fired.');
          radAudio.tone(540, 0.06, 'triangle', 0.04);
          renderFlightUI();
          return;
        }
        flight.pitchX *= 0.25;
        flight.pitchY *= 0.25;
        flight.stability = Math.min(100, flight.stability + 12);
        radAudio.tone(540, 0.06, 'triangle', 0.04);
      } else if (actionId === 'breaker') {
        const idx = typeof arg === 'number' ? arg : flight.breakers.findIndex(Boolean);
        if (idx >= 0) {
          flight.breakers[idx] = false;
          logFlight(`Breaker_Bank #${idx + 1} reset to NOMINAL.`);
          radAudio.tone(780, 0.07, 'triangle', 0.05);
        }
      } else if (actionId === 'stage_sep') {
        if (flight.step === 1 && !flight.portDock && !flight.breakers.some(Boolean) && !flight.stageSeparated) {
          flight.stageSeparated = true;
          flight.separationAdvancing = true;
          logFlight('Stage_Sep_Switch actuated! Main booster separated cleanly.');
          radAudio.tone(880, 0.14, 'triangle', 0.06);
          renderFlightUI();
          window.setTimeout(() => {
            if (flight.active && flight.step === 1 && flight.separationAdvancing) setFlightStep(2);
          }, 1800);
          return;
        }
        toast('Reset all tripped Breaker_Bank switches before stage separation.');
      } else if (actionId === 'pump_fuel') {
        if (flight.step === 2 && flight.docked) {
          const target = refuelTarget();
          if (flight.refuelDone >= target) return;
          flight.refuelDone = Math.min(target, flight.refuelDone + PUMP_STEP);
          flight.progress = Math.min(100, (flight.refuelDone / target) * 100);
          logFlight(`Orbital propellant transfer: ${flight.refuelDone}% / ${target}%.`);
          radAudio.tone(500, 0.06, 'sine', 0.04);
        } else if (flight.step === 2) {
          toast('Hold the docking corridor until the hard-dock latches.');
        }
      } else if (actionId === 'shield_storm') {
        flight.stormShielded = true;
        logFlight(flight.design.hasShelter ? 'Orion Storm Shelter sealed! Solar storm dose reduced by 82%.' : 'Water bags stacked for solar storm protection.');
        radAudio.tone(740, 0.1, 'triangle', 0.05);
      } else if (actionId === 'edl_arm') {
        if (flight.step === 3 && !flight.edlChuteDeployed) {
          flight.edlChuteDeployed = true;
          const bonus = (flight.design.hasTrn || flight.design.hasLoftid) ? 18 : 6;
          flight.stability = Math.min(100, flight.stability + bonus);
          logFlight(`EDL_Arm_Switch ON! ${flight.design.hasTrn || flight.design.hasLoftid ? 'Supersonic parachute & LOFTID shield inflated.' : 'Backup drogue chute deployed!'}`);
          radAudio.tone(820, 0.12, 'triangle', 0.06);
        }
      } else if (actionId === 'complete_step') {
        if (flight.step === 2 && flight.docked && flight.refuelDone >= refuelTarget()) {
          toMars();
          return;
        }
      }
      renderFlightUI();
    }

    function finishFlightAndLand() {
      flight.active = false;
      cancelAnimationFrame(flight.raf);
      toast(`Mars transfer confirmed. Arrival and landing sequence complete at ${state.site === 'jezero' ? 'Jezero Crater' : 'Gale Crater'}!`);
      startSurface();
    }

    function pilotInput() {
      const k = flight.keys, h = flight.hold || {};
      return [
        (k.has('KeyW') || k.has('ArrowUp') || h.up ? 1 : 0) - (k.has('KeyS') || k.has('ArrowDown') || h.down ? 1 : 0),
        (k.has('KeyD') || k.has('ArrowRight') || h.right ? 1 : 0) - (k.has('KeyA') || k.has('ArrowLeft') || h.left ? 1 : 0),
      ];
    }

    function timeOutFlightPhase() {
      if (flight.phaseTimedOut) return;
      flight.phaseTimedOut = true;
      if (flight.step === 1) {
        flight.score -= 10;
        flight.hull = Math.max(55, flight.hull - 12);
        flight.stageSeparated = true;
        logFlight('Separation window expired. Emergency separation fired with hull damage (-10 pts).');
        setFlightStep(2);
      } else if (flight.step === 2) {
        flight.score -= flight.docked ? 4 : 12;
        flight.docked = true;
        flight.refuelDone = refuelTarget();
        logFlight('Docking window expired. Auto-capture and minimum transfer completed with a mission penalty.');
        toMars();
      }
    }

    function flightTick(now) {
      if (!flight.active || state.screen !== 'cockpit') return;
      const dt = Math.min(0.05, (now - flight.lastTime) / 1000);
      flight.lastTime = now;

      // Keyboard steering (disabled during step 1 3D camera translation)
      if (flight.step !== 1) {
        if (flight.keys.has('ArrowLeft') || flight.keys.has('KeyA')) flight.pitchX = Math.max(-1, flight.pitchX - dt * 1.4);
        if (flight.keys.has('ArrowRight') || flight.keys.has('KeyD')) flight.pitchX = Math.min(1, flight.pitchX + dt * 1.4);
        if (flight.keys.has('ArrowUp') || flight.keys.has('KeyW')) flight.pitchY = Math.max(-1, flight.pitchY - dt * 1.4);
        if (flight.keys.has('ArrowDown') || flight.keys.has('KeyS')) flight.pitchY = Math.min(1, flight.pitchY + dt * 1.4);
      }

      if (flight.step === 0) {
        if (!flight.liftoff && flight.throttle >= LIFTOFF.throttle) {
          flight.liftoff = startLiftoff();
          logFlight(`Liftoff! Hold the navball target inside the green brackets for ${phaseDuration(0)} s.`);
          renderFlightUI();
        }
        const g = flight.liftoff;
        if (g) {
          const [pitch, yaw] = pilotInput();
          flight.input = { up: pitch > 0, down: pitch < 0, right: yaw > 0, left: yaw < 0 };
          g.tick(dt, [pitch, yaw]);
          flight.phaseElapsed = g.t;
          flight.progress = (g.t / g.duration) * 100;
          flight.stability = Math.round(g.share() * 100);
          flight.pitchX = g.value[1] / g.limit; // the RHC leans with the error
          flight.pitchY = -g.value[0] / g.limit;
          if (g.error > g.limit * 0.75) flight.hull = Math.max(50, flight.hull - dt * 3); // off-program loads
          if (g.done) { finishLiftoff(g); }
        }
      } else if (flight.step === 1) {
        const d = flight.portDock, k = flight.keys;
        if (d && d.status === 'approach') {
          flight.phaseElapsed += dt;
          const hasAny = (...codes) => codes.some(c => k.has(c)) ? 1 : 0;
          const x = hasAny('ArrowRight', 'KeyD') - hasAny('ArrowLeft', 'KeyA');
          const y = hasAny('ArrowUp') - hasAny('ArrowDown');
          const z = hasAny('KeyE', 'KeyW') - hasAny('KeyQ', 'KeyS');
          d.input = { left: x < 0, right: x > 0, up: y > 0, down: y < 0, forward: z > 0, back: z < 0 };
          const movement = Math.abs(x) + Math.abs(y) + Math.abs(z);
          const speed = .55; // game-balance: metres per second of relative translation
          d.x = Math.max(-2, Math.min(2, d.x + x * speed * dt));
          d.y = Math.max(-2, Math.min(2, d.y + y * speed * dt));
          d.z = Math.max(.35, Math.min(7, d.z - z * speed * dt));
          d.fuel = Math.max(0, d.fuel - movement * 3 * dt); // game-balance: percent per axis-second
          flight.pitchX = Math.max(-1, Math.min(1, d.x));
          flight.pitchY = Math.max(-1, Math.min(1, -d.y));
          flight.stability = Math.round(Math.max(0, 100 - Math.hypot(d.x, d.y) * 100));
          flight.progress = Math.max(0, Math.min(100, (5 - d.z) / 4.65 * 100));
          if (d.z <= .36 && Math.hypot(d.x, d.y) < .18) {
            d.status = 'success'; flight.stageSeparated = true; flight.score += 10;
            logFlight('Hard-dock achieved! Cabin hatch latched to station port.');
            radAudio.tone(880, 0.14, 'triangle', 0.06);
            toast('Docking complete'); renderFlightUI();
            window.setTimeout(() => { if (flight.active && flight.step === 1 && d.status === 'success') setFlightStep(2); }, 1400);
          } else if (d.fuel <= 0 || flight.phaseElapsed >= phaseDuration(1)) {
            d.status = 'failed'; flight.score -= 5;
            logFlight(d.fuel <= 0 ? 'RCS docking propellant depleted! Advancing to orbital transfer.' : 'Approach window expired! Advancing to orbital transfer.');
            radAudio.tone(240, 0.16, 'sawtooth', 0.06);
            toast('Docking failed — proceeding to next phase'); renderFlightUI();
            window.setTimeout(() => { if (flight.active && flight.step === 1 && d.status === 'failed') setFlightStep(2); }, 1400);
          }
        }
      } else if (flight.step === 2) {
        flight.phaseElapsed += dt;
        const g = flight.docking;
        if (g && !flight.docked) {
          const [pitch, yaw] = pilotInput();
          flight.input = { up: pitch > 0, down: pitch < 0, right: yaw > 0, left: yaw < 0 };
          g.tick(dt, [pitch, yaw]);
          flight.stability = Math.round(g.share() * 100);
          flight.progress = Math.min(65, (g.t / g.duration) * 65);
          flight.pitchX = g.value[1] / g.limit;
          flight.pitchY = -g.value[0] / g.limit;
          if (g.done) finishDocking(g);
        } else if (flight.docked) {
          flight.progress = 65 + (refuelTarget() ? flight.refuelDone / refuelTarget() : 1) * 35;
        }
        if (flight.phaseElapsed >= phaseDuration(2)) { timeOutFlightPhase(); }
      } else if (flight.step === 3) {
        const g = flight.marsBurn;
        if (g) {
          const [pitch, yaw] = pilotInput();
          // Mirrored burn: the outside view reverses the correction axes.
          // Keep the pressed-state tied to the mirrored labels; the physics input below is inverted.
          flight.input = { up: pitch > 0, down: pitch < 0, right: yaw > 0, left: yaw < 0 };
          g.tick(dt, [pitch, yaw]);
          flight.phaseElapsed = g.t;
          flight.progress = (g.t / g.duration) * 100;
          flight.stability = Math.round(g.share() * 100);
          flight.pitchX = g.value[1] / g.limit;
          flight.pitchY = -g.value[0] / g.limit;
          if (g.error > g.limit * .75) flight.hull = Math.max(50, flight.hull - dt * 2);
          if (g.done) {
            finishMarsBurn(g);
            return;
          }
        }
        if (flight.phaseElapsed >= phaseDuration(3) && g) {
          finishMarsBurn(g, true);
          return;
        }
      }

      updateTelemetry(dt);
      window.dispatchEvent(new CustomEvent('astro:cockpit', { detail: flight }));
      updateCockpitHUD();
      flight.raf = requestAnimationFrame(flightTick);
    }

    function updateFlightStepper() {
      $$('#flight-stepper .flight-phase').forEach((el, idx) => {
        const active = idx === flight.step, done = idx < flight.step;
        const fill = done ? 100 : active ? Math.min(100, (flight.phaseElapsed / phaseDuration(idx)) * 100) : 0;
        el.classList.toggle('active', active);
        el.classList.toggle('done', done);
        el.style.setProperty('--phase-fill', `${fill}%`);
        el.setAttribute('aria-current', active ? 'step' : 'false');
        const readout = el.querySelector('[data-phase-time]');
        if (readout) readout.textContent = clock(done ? 0 : active ? phaseDuration(idx) - flight.phaseElapsed : phaseDuration(idx));
      });
    }

    function updateCockpitHUD() {
      updateFlightStepper();
      $('#flight-progress-val').textContent = Math.round(flight.progress) + '%';
      const dockFuel = $('#port-dock-fuel');
      if (dockFuel && flight.portDock) {
        const fuel = Math.max(0, flight.portDock.fuel);
        dockFuel.style.width = `${fuel}%`;
        dockFuel.classList.toggle('amber', fuel <= 45 && fuel > 20);
        dockFuel.classList.toggle('danger', fuel <= 20);
        $('#port-dock-fuel-value').textContent = `${Math.ceil(fuel)}%`;
        $('#port-dock-distance').textContent = `${flight.portDock.z.toFixed(1)} m`;
        const offsetEl = $('#port-dock-offset');
        if (offsetEl) {
          const err = Math.hypot(flight.portDock.x, flight.portDock.y);
          offsetEl.textContent = err < 0.18 ? `LOCKED (${err.toFixed(2)} m)` : `OFFSET ${err.toFixed(2)} m`;
        }
      }
      $('#flight-alt-val').textContent = flight.altKm < 1 ? `${Math.round(flight.altKm * 1000)} m` : `${number(Math.round(flight.altKm * 10) / 10)} km`;
      $('#flight-vel-val').textContent = `${flight.velMs < 10 ? flight.velMs.toFixed(1) : number(Math.round(flight.velMs))} m/s`;
      $('#flight-hull-val').textContent = `${Math.round(flight.propellant)}% / ${Math.round(flight.hull)}%`;
      $('#flight-hull-val').previousElementSibling.textContent = `${tankLabel()} / Hull`;
      const goalLabels = ['Ascent Corridor Alignment', 'Cabin Docking Alignment', 'Docking Corridor Alignment', 'Landing Corridor Alignment'];
      const goal = flight.step === 1
        ? Math.round(Math.max(0, 100 - Math.hypot(flight.portDock?.x ?? 0, flight.portDock?.y ?? 0) * 100))
        : flight.step === 2 && flight.docking && !flight.docked
          ? Math.round(flight.docking.share() * 100)
          : flight.docked ? 100 : Math.round(flight.stability);
      $('#flight-goal-label').textContent = goalLabels[flight.step];
      $('#flight-goal-val').textContent = goal + '%';
      setBar('#flight-goal-fill', goal / 100, goal < 55 ? 'danger' : '');

      const g = flight.step === 0 ? flight.liftoff : flight.step === 3 ? flight.marsBurn : null, mark = $('#kir-mark');
      if (g && mark) {
        mark.style.left = `${50 + (g.value[1] / g.limit) * 50}%`;
        mark.style.top = `${50 - (g.value[0] / g.limit) * 50}%`;
        mark.classList.toggle('out', g.error > g.band);
        $('#kir-time').textContent = `${Math.ceil(g.duration - g.t)} s to ${flight.step === 0 ? 'MECO' : 'touchdown'}`;
        $('#kir-share').textContent = `${Math.round(g.share() * 100)}% in band`;
        const st = g.stars(); $('#kir-stars').textContent = '★'.repeat(st) + '☆'.repeat(3 - st);
        $$('[data-hold]').forEach(b => b.classList.toggle('on', !!flight.input?.[b.dataset.hold]));
      }
      const pip = $('#cockpit-pip');
      if (pip) {
        pip.style.translate = `calc(-50% + ${Math.round(flight.pitchX * 48)}px) calc(-50% + ${Math.round(flight.pitchY * 48)}px)`;
        pip.classList.toggle('danger', Math.hypot(flight.pitchX, flight.pitchY) > 0.55);
      }
      const hasAlert = flight.breakers.some(Boolean) || (flight.step === 2 && !flight.docked);
      $('#cockpit-badge').textContent = hasAlert ? 'ACTION REQUIRED' : 'NOMINAL';
      $('#cockpit-alert-tag').textContent = hasAlert ? 'C&W MATRIX ALERT ACTIVE' : 'ALL SYSTEMS NOMINAL';
      // Real RAD data exists only for the surface of Mars (Curiosity), so the tag appears on arrival.
      const rad = $('#cockpit-rad-tag');
      rad.style.display = flight.step === 3 ? '' : 'none';
      rad.textContent = `Mars surface RAD: ${RAD_MARS_UGY_DAY} µGy/day`;
      const actionBtn = $('#cockpit-minigame [data-act="complete_step"]');
      if (actionBtn && flight.step === 2) actionBtn.disabled = !flight.docked || flight.refuelDone < refuelTarget();
      const dockReadout = $('#docking-monitor-readout'), docking = flight.docking;
      if (dockReadout && flight.step === 2 && docking) {
        const align = Math.round(Math.max(0, 100 - (docking.error / docking.limit) * 100));
        dockReadout.textContent = flight.docked ? 'HARD-DOCK' : `ALIGN ${align}%`;
        $('#docking-monitor').style.setProperty('--dock-x', `${docking.value[1] * 28}px`);
        $('#docking-monitor').style.setProperty('--dock-y', `${-docking.value[0] * 18}px`);
      }
    }

    function renderFlightUI() {
      updateFlightStepper();
      const titles = [
        ['Flight Operations / Phase 05', 'Liftoff & Max-Q Corridor'],
        ['Flight Operations / Phase 05B', 'Cabin Docking'],
        ['Transit Operations / Phase 06A', 'Orbital Docking & Propellant Transfer'],
        ['Mars Arrival / Phase 06B', 'Mars Landing'],
      ];
      $('.cockpit-reticle')?.toggleAttribute('hidden', true);
      $('#cockpit-eyebrow').textContent = titles[flight.step][0];
      $('#cockpit-title').textContent = titles[flight.step][1];
      const exterior = $('#flight-exterior'), monitor = $('#docking-monitor');
      exterior?.toggleAttribute('hidden', true);
      exterior?.classList.toggle('is-separated', flight.stageSeparated);
      monitor?.toggleAttribute('hidden', true);

      const outcome = $('#port-dock-outcome');
      if (outcome) {
        const st = flight.step === 1 ? flight.portDock?.status : null;
        const done = st === 'success' || st === 'failed';
        outcome.hidden = !done;
        outcome.className = `dock-outcome${st === 'success' ? ' is-success' : st === 'failed' ? ' is-failed' : ''}`;
        outcome.innerHTML = st === 'success'
          ? '<span class="dock-outcome-mark" aria-hidden="true"><svg viewBox="0 0 36 36"><polyline points="7,19 15,27 29,10"/></svg></span><strong>Docking Complete</strong>'
          : st === 'failed'
            ? '<span class="dock-outcome-mark" aria-hidden="true"><svg viewBox="0 0 36 36"><line x1="9" y1="9" x2="27" y2="27"/><line x1="27" y1="9" x2="9" y2="27"/></svg></span><strong>Docking Failed</strong>'
            : '';
      }

      const box = $('#cockpit-minigame');
      if (flight.step === 0) {
        const g = flight.liftoff;
        box.innerHTML = `
          <span class="eyebrow">Helena · Liftoff · Keep in range</span>
          <h4>Hold the ascent program</h4>
          <p>${g ? 'Keep the navball target centred, inside the green brackets, until MECO. <b>W/S</b> or <b>↑/↓</b> pitch, <b>A/D</b> or <b>←/→</b> yaw; corrections take a moment to bite.' : `Push <b>Throttle_Lever</b> to ${LIFTOFF.throttle * 100}% (<b>Space</b>) to lift off.`}${flight.design.ready ? ` <b>TWR ${flight.design.twr.toFixed(2)}: ${phaseDuration(0)} s climb${flight.design.overweight ? ', and the stack wallows more' : ''}.</b>` : ''}${flight.design.finsDrift < 1 ? ` <b>Fins damp the gusts (−${Math.round((1 - flight.design.finsDrift) * 100)}%).</b>` : ''}</p>
          <div class="kir-row">
            <div class="kir kir-2d" style="--band:${(LIFTOFF.band / LIFTOFF.limit) * 100}%"><div class="kir-band"></div><div class="kir-mark" id="kir-mark"></div><span class="kir-label top">Nose high</span><span class="kir-label bottom">Nose low</span></div>
            <div class="kir-ctrl ${g ? 'kir-pad' : ''}">${g
              ? '<button class="button secondary up" type="button" data-hold="up">▲<kbd>W · ↑</kbd></button><button class="button secondary left" type="button" data-hold="left">◀<kbd>A · ←</kbd></button><button class="button secondary right" type="button" data-hold="right">▶<kbd>D · →</kbd></button><button class="button secondary down" type="button" data-hold="down">▼<kbd>S · ↓</kbd></button>'
              : `<button class="button primary" type="button" data-act="throttle_up">Throttle ${Math.round(flight.throttle * 100)}%<kbd>Space</kbd></button>`}</div>
          </div>
          <div class="kir-stats"><span id="kir-time">${phaseDuration(0)} s to MECO</span><span id="kir-share">—</span><span id="kir-stars">☆☆☆</span></div>`;
      } else if (flight.step === 1) {
        box.innerHTML = `
          <span class="eyebrow">Helena · Station docking</span>
          <h4>Align the cabin hatch</h4>
          <p>Align the cabin hatch with the rotating station port on the centre monitor (keyboard only). Use <b>← →</b> (or <b>A / D</b>) left/right, <b>↑ ↓</b> up/down, <b>E / Q</b> (or <b>W / S</b>) forward/back. Every movement uses fuel.</p>
          <div class="meter"><div class="meter-head"><span class="meter-label">Docking fuel</span><strong id="port-dock-fuel-value">100%</strong></div><div class="meter-track"><div class="meter-fill" id="port-dock-fuel" style="width:100%"></div></div></div>
          <div class="docking-readout"><span id="port-dock-offset">OFFSET 0.54 m</span><strong id="port-dock-distance">5.0 m</strong></div>
          <p>${flight.portDock?.status === 'failed' ? '✕ Docking failed. Advancing to orbital transfer…' : flight.portDock?.status === 'success' ? '✓ Hatch secured! Advancing to orbital transfer…' : 'Centre the port inside the green ring before closing to 0.36 m.'}</p>`;
      } else if (flight.step === 2) {
        const g = flight.docking, aligned = g ? Math.round(g.share() * 100) : 0;
        box.innerHTML = `
          <span class="eyebrow">Oscar &amp; Maya · Orbital docking</span>
          <h4>Match velocity &amp; transfer propellant</h4>
          <p>${flight.docked ? `Hard-dock secure. Press ↑ to transfer propellant, then → to continue to Mars landing.` : 'Keep the tanker centred in the external view on the right monitor. W/S or ↑/↓ translate vertical, A/D or ←/→ translate lateral; the rougher the ascent, the more the stack drifts.'}</p>
          <div class="docking-readout"><span>${flight.docked ? 'LATCHED · READY TO TRANSFER' : `ALIGNMENT ${aligned}%`}</span><strong>${flight.docked ? `${flight.refuelDone}/${refuelTarget()}%` : `${Math.ceil((g?.duration ?? 0) - (g?.t ?? 0))} s APPROACH`}</strong></div>
          <div class="control-grid">
            <button class="button secondary" type="button" data-act="pump_fuel" ${flight.docked && flight.refuelDone < refuelTarget() ? '' : 'disabled'}>Transfer Propellant (${flight.refuelDone}/${refuelTarget()}%)</button>
            <button class="button secondary" type="button" data-act="stabilize" ${flight.docked ? 'disabled' : ''}>Trim Relative Velocity</button>
          </div>
          <button class="button primary" type="button" data-act="complete_step" ${!flight.docked || flight.refuelDone < refuelTarget() ? 'disabled' : ''}>Continue to Mars Landing →</button>`;
      } else {
        const g = flight.marsBurn;
        box.innerHTML = `
          <span class="eyebrow">Helena · Mars landing · Keep in range</span>
          <h4>Hold the landing program</h4>
          <p>Keep the navball target centred, inside the green brackets, until touchdown. <b>W/S</b> or <b>↑/↓</b> pitch, <b>A/D</b> or <b>←/→</b> yaw; corrections take a moment to bite.</p>
          <div class="kir-row">
            <div class="kir kir-2d" style="--band:${(MARS_BURN.band / MARS_BURN.limit) * 100}%"><div class="kir-band"></div><div class="kir-mark" id="kir-mark"></div><span class="kir-label top">Burn high</span><span class="kir-label bottom">Burn low</span></div>
            <div class="kir-ctrl kir-pad"><button class="button secondary up" type="button" data-hold="up">▲<kbd>W · ↑</kbd></button><button class="button secondary left" type="button" data-hold="left">◀<kbd>A · ←</kbd></button><button class="button secondary right" type="button" data-hold="right">▶<kbd>D · →</kbd></button><button class="button secondary down" type="button" data-hold="down">▼<kbd>S · ↓</kbd></button></div>
          </div>
          <div class="kir-stats"><span id="kir-time">${MARS_BURN.duration} s to touchdown</span><span id="kir-share">—</span><span id="kir-stars">☆☆☆</span></div>`;
      }
      $$('[data-hold]', box).forEach(btn => {
        btn.addEventListener('pointerdown', () => { flight.hold = { [btn.dataset.hold]: true }; });
        for (const ev of ['pointerup', 'pointerleave', 'pointercancel']) btn.addEventListener(ev, () => { flight.hold = null; });
      });
      $$('[data-act]', box).forEach(btn => btn.addEventListener('click', () => {
        const idx = btn.dataset.idx !== undefined ? Number(btn.dataset.idx) : undefined;
        handleCockpitAction(btn.dataset.act, idx);
      }));
      updateCockpitHUD();
    }

    // -------------------------------------------------------------------------
    // PHASE 7: MARS SURFACE EXPLORATION
    // -------------------------------------------------------------------------
    function startSurface() {
      flight.design ||= captureDesign();
      surf.active = true;
      surf.timerSec = difficulty[state.difficulty].surfaceS;
      surf.activeCrew = state.detail.kind === 'crew' ? state.detail.id : 'maya';
      surf.completed = new Set();
      surf.stranded = [];
      showScreen('surface');
      radAudio.startSurfaceBed();
      window.dispatchEvent(new CustomEvent('astro:land', { detail: { site: state.site, crew: surf.activeCrew } }));
      updateSurfaceTimer();
      cancelAnimationFrame(surf.raf);
      surf.lastTick = performance.now();
      surf.raf = requestAnimationFrame(surfaceTick);
    }

    function completeSurfaceTask(id) {
      const t = surf.tasks.find(item => item.id === id);
      if (!surf.active || !t || t.crew !== surf.activeCrew || surf.completed.has(id)) return;
      surf.completed.add(id);
      radAudio.tone(860, 0.14, 'triangle', 0.06);
      toast(surf.completed.size === surf.tasks.length ? 'All surface experiments done! Walk back to the lander and board the ascent vehicle.' : `${id} · ${t.title} done (${surf.completed.size}/${surf.tasks.length}).`);
      window.dispatchEvent(new CustomEvent('astro:surface', { detail: surf }));
    }

    function boardShipAndFinish(forcedTimeout = false) {
      surf.active = false;
      if ($('#minigame-dialog').open) $('#minigame-dialog').close();
      cancelAnimationFrame(surf.raf);
      radAudio.stopAll();
      // game-balance: on timeout, crew members more than 35 m from the lander are left behind.
      surf.stranded = forcedTimeout ? crew.filter(p => (window.ASTRO_SURFACE?.distanceToLander(p.id) ?? 0) > 35).map(p => p.name) : [];
      showResults(forcedTimeout);
    }

    // The launch window only counts down while the crew is walking (not paused, loading or in a minigame).
    function surfaceTick(now) {
      if (!surf.active || state.screen !== 'surface') return;
      const dt = Math.min(0.1, (now - surf.lastTick) / 1000);
      surf.lastTick = now;
      if (window.ASTRO_SURFACE?.running?.() ?? true) surf.timerSec = Math.max(0, surf.timerSec - dt);
      if (surf.timerSec <= 0) {
        toast('Return launch window reached! Mandatory ascent initiating.');
        boardShipAndFinish(true);
        return;
      }
      updateSurfaceTimer();
      surf.raf = requestAnimationFrame(surfaceTick);
    }

    function updateSurfaceTimer() {
      const timerEl = $('#surface-timer'), m = Math.floor(surf.timerSec / 60), sec = Math.floor(surf.timerSec % 60);
      timerEl.textContent = `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
      timerEl.classList.toggle('urgent', surf.timerSec <= 30);
    }

    document.addEventListener('keydown', e => {
      if (state.screen === 'cockpit') {
        flight.keys.add(e.code);
        if (e.code.startsWith('Arrow')) e.preventDefault(); // steer, do not scroll the page
        if (!e.repeat && flight.step === 2 && flight.docked) {
          if (e.code === 'ArrowUp') handleCockpitAction('pump_fuel');
          if (e.code === 'ArrowRight') handleCockpitAction('complete_step');
        }
        if (e.code === 'Space' && e.repeat) { e.preventDefault(); return; }
        if (e.code === 'Space') { e.preventDefault(); if (flight.step !== 1) handleCockpitAction(flight.step === 0 ? 'throttle_up' : flight.step === 2 ? 'pump_fuel' : 'stabilize'); }
      }
    });
    document.addEventListener('keyup', e => flight.keys.delete(e.code));
    window.addEventListener('blur', () => { flight.keys.clear(); flight.hold = null; });

    // -------------------------------------------------------------------------
    // FINAL RESULTS, RANKING & ANIMATED PODIUM
    // -------------------------------------------------------------------------
    // The debrief screen serves both endings: the mission flown (showResults) or a rocket stuck on the pad (failLaunch).
    // failed: 'pad' (never left the pad), 'sea' (aborted, splashed down) or false (the mission flown).
    function setResultsMode(failed) {
      $('#results').classList.toggle('is-failed', !!failed);
      $('#results-retry').hidden = !failed;
      $('#results-eyebrow').textContent = failed === 'sea' ? 'Mission Debrief / Ocean Recovery' : failed ? 'Mission Debrief / Launch Pad' : 'Mission Debrief / Phase 07 Complete';
      $('#results-title').textContent = failed === 'sea' ? 'Mission Abort' : failed ? 'Launch Failure' : 'Mars Return & Final Ranking';
    }

    function showResults(forcedTimeout) {
      setResultsMode(false);
      const d = flight.design;
      const tasksDone = surf.completed.size;
      const scienceBonus = (d.hasDrill ? 6 : 0) + (d.hasSpec ? 6 : 0) + (d.hasDna ? 6 : 0) + (d.hasDish ? 5 : 0);
      const returnBonus = forcedTimeout ? (surf.stranded.length ? -18 : 4) : 18;
      const edlBonus = (d.hasLoftid && d.hasTrn) ? 14 : (d.hasLoftid || d.hasTrn) ? 9 : 4;
      const timeBonus = Math.round(surf.timerSec * 0.08);
      const total = Math.max(150, Math.round((flight.score * 6.5) + tasksDone * 140 + scienceBonus * 5 + edlBonus * 6 + returnBonus * 6 + timeBonus));
      const grade = total >= 1150 ? 'S+' : total >= 950 ? 'A' : total >= 740 ? 'B' : 'C';

      $('#results-rank-letter').textContent = grade;
      $('#results-score-text').textContent = `Total Score: ${number(total)} pts · ${tasksDone}/${surf.tasks.length} Surface Experiments`;
      $('#results-status-badge').textContent = surf.stranded.length ? `LEFT BEHIND: ${surf.stranded.join(', ').toUpperCase()}` : 'ALL 4 CREW RETURNED';
      $('#results-headline').textContent = surf.stranded.length ? 'Emergency Extraction Partial' : grade === 'S+' ? 'Historic Mars Triumph' : 'Mission Complete';
      $('#podium-site-tag').textContent = `${state.site === 'jezero' ? 'JEZERO' : 'GALE'} CRATER · RANK ${grade}`;

      const helenaPts = Math.round(210 + flight.stability * 1.1 + edlBonus * 4 + (surf.completed.has('H-S1') ? 60 : 0));
      const lucasPts = Math.round(200 + (d.powerDeficit ? 10 : 45) + (surf.completed.has('L-S1') ? 130 : 25));
      const oscarPts = Math.round(195 + (d.hasDish ? 45 : 15) + (surf.completed.has('O-S1') ? 130 : 25));
      const mayaPts = Math.round(200 + scienceBonus * 4 + (surf.completed.has('M-S1') ? 145 : 25));
      const ranked = [
        { ...crew[0], pts: helenaPts },
        { ...crew[1], pts: lucasPts },
        { ...crew[2], pts: oscarPts },
        { ...crew[3], pts: mayaPts },
      ].sort((a, b) => b.pts - a.pts).map((c, idx) => ({
        ...c,
        pos: ['1ST', '2ND', '3RD', '4TH'][idx],
        grade: c.pts >= 360 ? 'S+' : c.pts >= 310 ? 'A' : c.pts >= 240 ? 'B' : 'C',
      }));

      $('#results-leaderboard').innerHTML = ranked.map(r => `
        <div class="leader-row">
          <span class="leader-pos">${r.pos}</span>
          <span><b>${r.name}</b> <small class="muted">· ${r.role}</small></span>
          <strong>${r.pts} pts</strong>
          <span class="leader-grade">${r.grade}</span>
        </div>`).join('');

      $('#results-breakdown').innerHTML = [
        ['Budget & TWR', `${d.overBudget ? 'Exceeded' : 'On budget'} · ${d.overweight ? 'Low TWR buffet' : 'Liftoff TWR nominal'}`],
        ['EDL Landing', `${flight.landingShare ?? 0}% in the landing corridor · ${hasEdlLabel(d)}`],
        ['Radiation (RAD)', `No solar storm this flight · ${d.hasShelter ? 'storm shelter aboard' : 'no storm shelter'}`],
        ['Surface Window', forcedTimeout ? (surf.stranded.length ? `Timeout — stranded: ${surf.stranded.join(', ')}` : 'Returned on timer') : `Cleared with ${Math.floor(surf.timerSec)}s margin`],
      ].map(([k, v]) => `<div><span>${k}</span><strong>${v}</strong></div>`).join('');

      $('#podium-fallback').innerHTML = ranked.map((r, i) => `
        <div class="podium-col">
          ${astronaut(r)}
          <div class="podium-step" style="background:${r.color};padding-top:${(4 - i) * 10}px">${r.pos} · ${r.name.toUpperCase()} (${r.grade})</div>
        </div>`).join('');

      showScreen('results');
      window.dispatchEvent(new CustomEvent('astro:results', { detail: { ranked, grade } }));
    }

    // Mission failed: on the pad (liftoffOf: no ignition, or thrust below weight) or after a Δv abort (abortOf: no orbit,
    // or Mars out of reach) that ended in a splashdown. Nothing is scored and the podium stays empty.
    function failLaunch(lift) {
      const sea = lift.pad === 'SPLASHDOWN';
      flight.design = captureDesign();
      flight.active = false;
      cancelAnimationFrame(flight.raf);
      surf.active = false;
      surf.completed = new Set();
      surf.stranded = [];
      const d = flight.design;
      setResultsMode(sea ? 'sea' : 'pad');
      radAudio.tone(150, 0.6, 'sawtooth', 0.05);
      $('#results-rank-letter').textContent = 'F';
      $('#results-score-text').textContent = `Total Score: 0 pts · 0/${surf.tasks.length} Surface Experiments`;
      $('#results-status-badge').textContent = sea ? 'MISSION FAILED · CREW RECOVERED AT SEA' : 'MISSION FAILED · CREW NEVER LEFT EARTH';
      $('#results-headline').textContent = lift.title;
      $('#podium-site-tag').textContent = sea ? `SPLASHDOWN · ${lift.title.toUpperCase()}` : `LAUNCH PAD · ${lift.pad}`;
      $('#results-leaderboard').innerHTML = `<p class="muted">No ranking: the mission ${sea ? 'was aborted before Mars' : 'ended on the launch pad'}.</p>`;
      $('#results-breakdown').innerHTML = [
        ...(sea ? [
          ['Abort', lift.detail],
          ['Δv to orbit', `${number(d.dv)} / ${number(d.leo)} m/s`],
          ['Mars transfer', d.orbit ? `${number(d.marsDv)} / ${number(d.transfer)} m/s (refuelled)` : '—'],
        ] : [
          ['Liftoff', lift.detail],
          ['Thrust-to-weight', d.ready ? `${d.twr.toFixed(2)} · needs ${TWR_BARE().toFixed(1)} to lift off` : 'No thrust'],
        ]),
        ['Budget', d.overBudget ? 'Exceeded' : 'On budget'],
        ['Mars', `Not reached · 0/${surf.tasks.length} surface experiments`],
      ].map(([k, v]) => `<div><span>${k}</span><strong>${v}</strong></div>`).join('');
      $('#podium-fallback').innerHTML = ['1ST', '2ND', '3RD', '4TH'].map((pos, i) => `
        <div class="podium-col"><div class="podium-step is-empty" style="padding-top:${(4 - i) * 10}px">${pos} · —</div></div>`).join('');
      showScreen('results');
      window.dispatchEvent(new CustomEvent('astro:results', { detail: { ranked: [], grade: 'F', failed: true } }));
    }

    function hasEdlLabel(d) {
      if (d.hasLoftid && d.hasTrn) return 'Full EDL suite';
      if (d.hasLoftid || d.hasTrn) return 'Cabin EDL gear';
      return 'Minimal EDL gear';
    }

    $('#results-retry').addEventListener('click', () => showScreen('planner'));
    $('#results-replay').addEventListener('click', () => {
      state.rocket = defaultRocket();
      state.sel = { kind: 'booster' };
      state.tab = 'engine';
      showScreen('lobby');
    });

    return { startFlight, failLaunch, handleCockpitAction, startSurface, completeSurfaceTask, board: () => boardShipAndFinish(false), flight, surf };
  })();
  window.ASTRO_SIM = SIM;
  // Shared with the 3D modules below.
  function renderBadge(){const s=difficulty[state.difficulty].surfaceS;$('#modifier-badge').textContent=`${money(budgetOf(state.difficulty))} · ${Math.floor(s/60)}:${String(s%60).padStart(2,'0')} on Mars`;}
  window.ASTRO_ART={RAMPS,PLANETS};
  window.ASTRO={state,crew,sites:SITES_INFO,toast,show:showScreen,showScreen,land:()=>SIM.startSurface(),data:()=>DATA,selectedKey:()=>moduleKey(state.sel),select:(key,tab)=>selectModule(key,tab),CREW_MODELS,COCKPIT_MODEL};
  paintArt();renderLobby();renderBadge();renderPlanner();setupStars();
  if(!DATA)fetch('assets/models/parts/manifest.json').then(r=>r.json()).then(m=>{useData(m);renderBadge();renderPlanner();}).catch(()=>toast('Could not load the part specs.'));
})();
