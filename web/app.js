(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const crew = [
    {id:'helena',name:'Helena',role:'Commander & Pilot',color:'#EAA668',quote:'A mission only succeeds when every choice has a way home.',tags:['Aerospace Engineering','Test Pilot','Trajectory'],perk:'Precision Piloting',perkText:'Improves the crew’s margin during orbital maneuvers (full game).'},
    {id:'lucas',name:'Lucas',role:'Systems Engineer',color:'#7EDAC2',quote:'A reliable spacecraft is built from a thousand careful decisions.',tags:['Electrical Power','Structures','Repairs'],perk:'Redundant Engineering',perkText:'Reduces the impact of component failures (full game).'},
    {id:'oscar',name:'Oscar',role:'Data & Telecom Specialist',color:'#95B8F6',quote:'A discovery that never reaches Earth is a story left untold.',tags:['Data Systems','Communications','Signal Planning'],perk:'Smart Compression',perkText:'Moves more science data through a limited connection (full game).'},
    {id:'maya',name:'Maya',role:'Mission Scientist & Medical Officer',color:'#D5A5EE',quote:'Every rock on Mars holds a secret waiting to be decoded.',tags:['Planetary Geology','Astrobiology','Crew Health'],perk:'Experimental Synergy',perkText:'Rewards a well-matched set of science instruments (full game).'}
  ];
  const SITES_INFO = {
    jezero:{name:'Jezero Crater',mission:'Biosignature Hunters',tag:'Ancient delta · biosignatures',desc:'An ancient lake with a river delta, a target in the search for biosignatures. The Perseverance rover has explored the crater since 2021.'},
    gale:{name:'Gale Crater',mission:'Gale Climate Archive',tag:'Layered rocks · climate',desc:'The rock layers of Mount Sharp hold the history of the Martian climate. The Curiosity rover has explored the crater since 2012.'}
  };
  // Budget multipliers per difficulty (game-balance); the base budget comes from missionRules.
  const difficulty = {easy:{factor:1.2,risk:'−10% FAILURE'},normal:{factor:1,risk:'STANDARD RISK'},hard:{factor:.8,risk:'+15% FAILURE'}};
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
  const MAX_STAGES = () => rule('maxInternalStages',7), CABIN_SLOTS = () => rule('cabinModuleSlots',4), TWR_MIN = () => rule('minSafeLiftoffTwr',1.2);
  const budgetOf = level => rule('defaultBudgetM',250)*difficulty[level].factor;
  const state={screen:'menu',difficulty:'normal',friends:new Set(),site:'jezero',detail:{kind:'crew',id:'helena'},rocket:{booster:{engine:null,tank:null},stages:[{item:null},{item:null}],cabin:[]},sel:{kind:'booster'},tab:'engine'};
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
      return `<article class="crew-card ${picked?'selected':''}" style="--crew:${p.color}"><div class="crew-stage">${astronaut(p)}</div><div class="crew-info"><h4 class="crew-name">${p.name}</h4><span class="crew-role">${p.role}</span><span class="status ${host||friend?'player':''}"><span class="dot"></span>${host?'HOST (PLAYER)':friend?'FRIEND (PLAYER)':'AI (NPC)'}</span></div><div class="crew-actions"><button class="invite" type="button" data-invite="${p.id}" ${host?'disabled':''}>${host?'Host':friend?'Remove':'Invite player'}</button><button class="pick" type="button" data-pick="${p.id}" aria-pressed="${picked}">Select</button></div></article>`;}).join('');
    $$('#crew-grid [data-pick]').forEach(b=>b.addEventListener('click',()=>{state.detail={kind:'crew',id:b.dataset.pick};renderLobby();}));
    $$('#crew-grid [data-invite]').forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.invite;if(state.friends.has(id)){state.friends.delete(id);toast('The seat went back to the AI crew.');}else{state.friends.add(id);toast('A friend joined this local lobby preview.');}renderLobby();}));
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
      $('#detail-extra').innerHTML='';$('#detail-site').innerHTML=siteScene(d.id);view.classList.add('site');
    }
    window.dispatchEvent(new CustomEvent('astro:detail',{detail:d}));
  }

  // Planner: Main Booster (engine cluster + tank) → 0 to 7 middle stages (1 module each) → cabin (4 modules).
  const moduleKey = sel => sel.kind==='stage'?`stage-${sel.index}`:sel.kind;
  const parseKey = key => key.startsWith('stage-')?{kind:'stage',index:+key.slice(6)}:{kind:key};
  function moduleLabel(key){
    const r=state.rocket;
    if(key==='booster'){const {engine:e,tank:t}=r.booster;return ['Stage 1 · booster',e&&t?`${shortName(e)} + ${shortName(t)}`:e?'tank missing':t?'engine missing':'engine + tank empty'];}
    if(key==='cabin')return ['Cabin',`${r.cabin.length}/${CABIN_SLOTS()} modules`];
    const i=+key.slice(6),stage=r.stages[i],item=stage?.item;if(stage?.type==='booster')return [`Stage ${i+2} · booster`,stage.engine&&stage.tank?`${shortName(stage.engine)} + ${shortName(stage.tank)}`:stage.engine?'tank missing':stage.tank?'engine missing':'engine + tank empty'];return [`Stage ${i+2} · bay`,item?shortName(item):'empty bay'];
  }
  // Totals: cost, mass and cruise power of every module; thrust, Isp and Δv (Tsiolkovsky) of the booster.
  // Engine pumps draw power only during the ascent, so engines stay out of the cruise power balance.
  function metrics(){
    const r=state.rocket,g0=rule('g0Ms2',9.80665);let cost=0,mass=0,draw=0,gen=0,thrust=0,isp=0,prop=0;
    const add=s=>{if(!s)return;cost+=s.costM||0;mass+=s.massDryKg||0;if(s.powerW<0)draw-=s.powerW;else gen+=s.powerW||0;};
    add(spec('booster-thrust-section'));r.stages.forEach(s=>{if(s.type==='booster'){add(spec('booster-thrust-section'));if(s.engine){const e=spec(s.engine),n=e.defaultClusterCount||1;cost+=n*e.costM;mass+=n*e.massDryKg;}if(s.tank){const t=spec(s.tank);cost+=t.costM;mass+=t.massDryKg+(t.propellantMassKg||0);}}else{add(spec('stage-module'));if(s.item)add(spec(s.item));}});add(rule('cabinHull'));r.cabin.forEach(id=>add(spec(id)));
    if(r.booster.engine){const s=spec(r.booster.engine),n=s.defaultClusterCount||1;cost+=n*s.costM;mass+=n*s.massDryKg;thrust=n*(s.thrustSlKn||0)*1000;isp=s.ispSlS&&s.ispVacS?(s.ispSlS+s.ispVacS)/2:(s.ispSlS||s.ispVacS||0);}
    if(r.booster.tank){const s=spec(r.booster.tank);cost+=s.costM;prop=s.propellantMassKg||0;mass+=s.massDryKg+prop;}
    const ready=!!(r.booster.engine&&r.booster.tank);
    return {cost,mass,draw,gen,thrust,isp,prop,ready,twr:mass?thrust/(mass*g0):0,dv:ready&&mass>prop?isp*g0*Math.log(mass/(mass-prop)):0,budget:budgetOf(state.difficulty),leo:rule('earthOrbitDeltaVMs',9400)};
  }
  function setBar(id,frac,mode){const el=$(id);el.style.width=Math.min(100,Math.max(0,frac*100))+'%';el.classList.toggle('danger',mode==='danger');el.classList.toggle('short',mode==='short');}
  function renderTelemetry(){
    if(!DATA)return null;
    const m=metrics();
    $('#cost-value').textContent=`${money(m.cost)} / ${money(m.budget)}`;setBar('#cost-fill',m.cost/m.budget,m.cost>m.budget?'danger':'');
    $('#twr-value').textContent=m.ready?m.twr.toLocaleString('en-US',{maximumFractionDigits:2}):'—';setBar('#twr-fill',m.ready?m.twr/2:0,m.ready&&m.twr<TWR_MIN()?'danger':'');
    $('#power-value').textContent=`${number(m.gen)} W / ${number(m.draw)} W`;setBar('#power-fill',m.draw?m.gen/(m.draw*1.5):0,m.gen<m.draw?'danger':'');
    $('#dv-value').textContent=m.ready?`${number(m.dv)} m/s`:'—';setBar('#dv-fill',m.dv/m.leo,m.ready&&m.dv<m.leo?'short':'');
    $('#mass-value').textContent=tonnes(m.mass);
    $('#booster-alert').classList.toggle('show',!m.ready);$('#twr-alert').classList.toggle('show',m.ready&&m.twr<TWR_MIN());
    $('#budget-alert').classList.toggle('show',m.cost>m.budget);$('#power-alert').classList.toggle('show',m.gen<m.draw);
    $('#budget-remaining').textContent=money(m.budget-m.cost);$('#budget-readout').classList.toggle('negative',m.cost>m.budget);
    return m;
  }
  function renderRocket(){
    const r=state.rocket,keys=['booster',...r.stages.map((_,i)=>`stage-${i}`),'cabin'],cur=moduleKey(state.sel);
    $('#stack-overlay').innerHTML=keys.map((k,i)=>{const [title,sub]=moduleLabel(k),rem=k.startsWith('stage-')?`<button class="remove-stage" type="button" data-remove="${k.slice(6)}" title="Remove ${title}" aria-label="Remove ${title}">×</button>`:'';return `<div class="stage-node ${i%2?'right':'left'}" data-module="${k}"><button class="rocket-stage ${k===cur?'selected':''}" type="button" data-select="${k}" aria-pressed="${k===cur}"><strong>${title}</strong><small>${sub}</small></button>${rem}</div>`;}).join('')
      +(r.stages.length<MAX_STAGES()?Array.from({length:r.stages.length+1},(_,i)=>`<button class="add-stage" type="button" data-insert="${i}" title="Add stage" aria-label="Add a stage at position ${i+2}">+</button>`).join(''):'');
    $$('#stack-overlay [data-select]').forEach(b=>b.addEventListener('click',()=>selectModule(b.dataset.select)));
    $$('#stack-overlay [data-remove]').forEach(b=>b.addEventListener('click',()=>removeStage(+b.dataset.remove)));
    $$('#stack-overlay [data-insert]').forEach(b=>b.addEventListener('click',()=>addStage(+b.dataset.insert)));
    const installed=[r.booster.engine,r.booster.tank,...r.stages.flatMap(s=>s.type==='booster'?[s.engine,s.tank]:[s.item]),...r.cabin].filter(Boolean).length;
    $('#rocket-tags').innerHTML=`<span class="tag">${r.stages.length+2} STAGES</span><span class="tag">${installed} PARTS INSTALLED</span>`;
    window.dispatchEvent(new Event('astro:rocket'));
  }
  const isBooster = sel => sel.kind==='booster'||(sel.kind==='stage'&&state.rocket.stages[sel.index]?.type==='booster');
  const tabsFor = sel => isBooster(sel)?[['engine','Engines'],['tank','Tanks']]:sel.kind==='stage'?EQUIPMENT_GROUPS.map(([k,l])=>[k,l]):CABIN_GROUPS.map(([k,l])=>[k,l]);
  function partsFor(sel,tab){
    const all=Object.entries(DATA.parts);
    if(isBooster(sel))return all.filter(([,p])=>tab==='engine'?p.specs?.engineRole==='booster':p.category==='tanks'&&p.specs?.tankRole==='stage').map(([id])=>id);
    if(sel.kind==='stage'){const g=EQUIPMENT_GROUPS.find(x=>x[0]===tab);return all.filter(([id,p])=>p.category==='equipment'&&g[2].test(id)).map(([id])=>id);}
    return CABIN_GROUPS.find(x=>x[0]===tab)[2];
  }
  const installedIn = sel => isBooster(sel)?Object.values(sel.kind==='booster'?state.rocket.booster:{engine:state.rocket.stages[sel.index].engine,tank:state.rocket.stages[sel.index].tank}).filter(Boolean):sel.kind==='stage'?[state.rocket.stages[sel.index]?.item].filter(Boolean):state.rocket.cabin;
  function partMetrics(id){
    const s=spec(id),p=part(id);
    if(p.category==='engines'){const n=s.defaultClusterCount||1;return [`${n}×`,`${number(s.thrustSlKn)} kN${warn(id,'thrustSlKn')}`,`Isp ${number(s.ispSlS)}${s.ispVacS&&s.ispVacS!==s.ispSlS?'–'+number(s.ispVacS):''} s${warn(id,'ispSlS')}`,`${number(s.massDryKg)} kg each${warn(id,'massDryKg')}`,money(n*s.costM)];}
    if(p.category==='tanks')return [`propellant ${tonnes(s.propellantMassKg)}${warn(id,'propellantMassKg')}`,`dry ${tonnes(s.massDryKg)}${warn(id,'massDryKg')}`,money(s.costM)];
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
    $('#catalog-summary').innerHTML=sel.kind==='stage'?`<label>Stage type <select id="stage-type"><option value="bay">Bay</option><option value="booster">Booster</option></select></label><br>${isBooster(sel)?'Choose an engine and tank. Upper-stage propulsion is not yet included in Δv.':'One equipment module per bay.'}`:sel.kind==='booster'?'Stage 1 engine and tank, with real data for each part.':`${state.rocket.cabin.length}/${CABIN_SLOTS()} cabin slots filled. Three modules per specialist.`;
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
    const m=metrics(),warnings=[];
    if(!m.ready)warnings.push('Booster without an engine or a tank');
    if(m.ready&&m.twr<TWR_MIN())warnings.push('Thrust-to-weight below 1.2');
    if(m.cost>m.budget)warnings.push('Over budget');
    if(m.gen<m.draw)warnings.push('Power deficit');
    if(m.ready&&m.dv<m.leo)warnings.push('Δv below low Earth orbit (orbital refueling is not simulated yet)');
    $('#launch-title').textContent=warnings.length?'Review the mission risks':'Mission ready to launch';
    $('#launch-message').textContent=warnings.length?'These choices will have consequences at launch or on arrival. Revise the design or launch with risks.':'The crew is ready for liftoff, orbital checklist, Mars landing, and surface operations.';
    $('#launch-summary').innerHTML=[['Crew',`${state.friends.size+1} player${state.friends.size?'s':''} · ${3-state.friends.size} AI`],['Site',SITES_INFO[state.site].name],['Difficulty',{easy:'EASY',normal:'NORMAL',hard:'HARD'}[state.difficulty]],['Stages',`${state.rocket.stages.length+2}`],['Budget remaining',money(m.budget-m.cost)],['Liftoff mass',tonnes(m.mass)],['Thrust-to-weight',m.ready?m.twr.toLocaleString('en-US',{maximumFractionDigits:2}):'—'],['Booster Δv',m.ready?`${number(m.dv)} m/s`:'—'],['Power',`${number(m.gen)} / ${number(m.draw)} W`],['Risks',warnings.length?warnings.join('; '):'All clear']].map(([label,value])=>`<div><span>${label}</span><strong>${value}</strong></div>`).join('');
    $('#launch-confirm').textContent=warnings.length?'Launch with risks →':'Launch mission →';
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
  $('#launch-confirm').addEventListener('click',()=>{$('#launch-dialog').close();window.ASTRO_SIM?.startFlight();});
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
  const siteScene = id => `<svg class="${id}" viewBox="0 0 160 100" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><rect width="160" height="100" fill="#17183B"/>${poly([[0, 0], [160, 0], [0, 48]], '#1c1a45')}${poly([[160, 0], [160, 56], [30, 56]], '#241848')}${poly([[0, 40], [160, 30], [160, 60], [0, 60]], '#3a1f4a')}<g transform="translate(92 16) scale(4)">${facetPolys({ ramp: RAMPS.rock, seed: 3, rings: [5, 9] })}</g>${facetTerrain(SITES[id])}</svg>`;
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
    $$('.site-thumb .thumb-art').forEach(el => { el.innerHTML = siteScene(el.parentElement.dataset.site); });
  }
  // ===========================================================================
  // PHASES 5–7 SIMULATION ENGINE & RAD SOUNDSCAPE (Cockpit -> Mars Surface -> Results)
  // ===========================================================================
  const SIM = (() => {
    const TARGET_FUEL = 100;
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
        $('#audio-toggle-surface').textContent = txt;
      }
    };
    $('#audio-toggle-cockpit').addEventListener('click', () => radAudio.toggleMute());
    $('#audio-toggle-surface').addEventListener('click', () => radAudio.toggleMute());

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
      refuelDone: 0,
      stormShielded: false,
      edlChuteDeployed: false,
      radRate: 232,
      score: 100,
      design: null,
      keys: new Set(),
      raf: 0,
      lastTime: 0,
      sparksUntil: 0,
    };

    // Surface experiments: the MVP ground candidates of docs/minigames.md, one per crew member. The owner runs
    // the minigame next to its block and the experiment counts in the results.
    const SURFACE_TASKS = [
      { id: 'H-S1', crew: 'helena', title: 'Helicopter flight', minigame: 'Scout', mechanic: 'Piloting', basis: 'Ingenuity (2021–24)', desc: 'Fly through the scouting points before the battery runs out. Smooth, featureless sand confuses the navigation camera.' },
      { id: 'L-S1', crew: 'lucas', title: 'Oxygen oven', minigame: 'Make oxygen', mechanic: 'Keep in range', basis: 'MOXIE on Perseverance (2021–23)', desc: 'Heat the reactor to about 800 °C and hold it in the green zone. Too hot damages the cell; too cold makes nothing.' },
      { id: 'O-S1', crew: 'oscar', title: 'Orbiter pass', minigame: 'Contact window', mechanic: 'Choice under a limit', basis: 'UHF relay (Electra)', desc: 'The orbiter passes overhead for a few seconds. Pick which data packets to send before the window closes.' },
      { id: 'M-S1', crew: 'maya', title: 'Biosignature hunter', minigame: 'Leopard spots', mechanic: 'Pattern search', basis: 'PIXL + SHERLOC on Perseverance', desc: 'The rock is a grid. Each scan costs time and power; find the hidden spots before time runs out.' },
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
      const m = DATA ? metrics() : { cost: 0, mass: 0, draw: 0, gen: 0, dv: 0, budget: budgetOf(state.difficulty), leo: 9400, twr: 0, ready: false };
      return {
        ...m,
        overweight: !m.ready || m.twr < TWR_MIN(),
        overBudget: m.cost > m.budget,
        powerDeficit: m.gen < m.draw,
        lowDv: !m.ready || m.dv < m.leo,
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
      flight.hold = 0;
      flight.breakers = [
        flight.design.powerDeficit,
        flight.design.powerDeficit || flight.design.overweight,
        false,
      ];
      flight.stageSeparated = false;
      flight.refuelDone = 0;
      flight.stormShielded = false;
      flight.edlChuteDeployed = false;
      flight.radRate = 232;
      flight.score = 100 - (flight.design.overBudget ? 12 : 0) - (flight.design.overweight ? 10 : 0);
      flight.sparksUntil = flight.design.powerDeficit || flight.design.overweight ? performance.now() + 2800 : 0;

      $('#flight-log').innerHTML = '';
      logFlight('T-00:00 Flight Deck online. Camera_Pilot locked.');
      if (flight.design.overweight) logFlight('ALERT: Low liftoff TWR (<1.2) or incomplete booster — high aerodynamic buffet!');
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
    function createKeepInRange({ duration, band, limit, authority, damping = 1.5, drift }) {
      const g = { t: 0, value: 0, rate: 0, inBand: 0, duration, band, limit, done: false };
      g.tick = (dt, input) => {
        if (g.done) return g;
        g.t = Math.min(duration, g.t + dt);
        g.rate += (drift(g.t, g.value) + input * authority - g.rate * damping) * dt;
        g.value = Math.max(-limit, Math.min(limit, g.value + g.rate * dt));
        if (g.value === limit || g.value === -limit) g.rate = 0;
        if (Math.abs(g.value) <= band) g.inBand += dt;
        g.done = g.t >= duration;
        return g;
      };
      g.share = () => (g.t ? g.inBand / g.t : 1);
      g.stars = () => { const k = g.share(); return k >= 0.85 ? 3 : k >= 0.65 ? 2 : k >= 0.4 ? 1 : 0; };
      return g;
    }

    // Liftoff (Helena, keep in range): hold the pitch program through Max-Q. value = pitch error in degrees,
    // positive = nose above the program. All numbers are game-balance.
    const LIFTOFF = { duration: 30, band: 2.5, limit: 12, authority: 8, maxQ: [12, 20], throttle: 0.7 };
    function startLiftoff() {
      const d = flight.design, wallow = d.overweight ? 1.6 : 1, seed = Math.random() * 100; // low TWR: the stack wallows more
      return createKeepInRange({
        duration: LIFTOFF.duration, band: LIFTOFF.band, limit: LIFTOFF.limit,
        authority: LIFTOFF.authority * (d.hasCockpitUpgrade ? 1.25 : 1),
        drift: t => {
          const q = t > LIFTOFF.maxQ[0] && t < LIFTOFF.maxQ[1] ? 2.4 : 1; // gusts peak around Max-Q
          return wallow * q * (3.2 * Math.sin(t * 0.9 + seed) + 2.6 * Math.sin(t * 2.3 + seed * 1.7) + 1);
        },
      });
    }
    function finishLiftoff(g) {
      const stars = g.stars(), share = Math.round(g.share() * 100);
      flight.liftoffStars = stars;
      flight.score += (stars - 1) * 4;
      logFlight(`MECO. Pitch program held ${share}% of the ascent (${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}).`);
      toast(`Liftoff ${'★'.repeat(stars)}${'☆'.repeat(3 - stars)} · ${share}% inside the band`);
      setFlightStep(1);
    }

    function setFlightStep(nextStep) {
      flight.step = nextStep;
      flight.progress = 0;
      if (nextStep === 1) {
        flight.breakers = [true, flight.design.powerDeficit || flight.design.overweight, true];
        flight.sparksUntil = performance.now() + 3000;
        logFlight('MAX-Q SURGE: Power bus tripped! Reset Breaker_Bank then engage Stage_Sep_Switch.');
        radAudio.tone(320, 0.14, 'sawtooth', 0.06);
      } else if (nextStep === 2) {
        flight.radRate = 810;
        logFlight(`ORBIT ACHIEVED. Target refueling reserve: ${TARGET_FUEL}%. MSL RAD warns of 810 µGy/h solar particle event!`);
        radAudio.tone(660, 0.12, 'triangle', 0.05);
      } else if (nextStep === 3) {
        flight.altKm = 125;
        flight.velMs = 5400;
        flight.radRate = 232;
        logFlight(`MARS ENTRY INTERFACE: Prepare ${state.site === 'jezero' ? 'Jezero' : 'Gale'} EDL. Deploy chute in Mach window!`);
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
        if (flight.step === 1 && !flight.breakers.some(Boolean)) {
          flight.stageSeparated = true;
          logFlight('Stage_Sep_Switch actuated! Main booster separated cleanly.');
          radAudio.tone(880, 0.14, 'triangle', 0.06);
          setFlightStep(2);
          return;
        }
        toast('Reset all tripped Breaker_Bank switches before stage separation.');
      } else if (actionId === 'pump_fuel') {
        if (flight.step === 2) {
          flight.refuelDone = Math.min(TARGET_FUEL, flight.refuelDone + 25);
          flight.progress = Math.min(100, (flight.refuelDone / TARGET_FUEL) * 100);
          logFlight(`Orbital propellant transfer: ${flight.refuelDone}% / ${TARGET_FUEL}%.`);
          radAudio.tone(500, 0.06, 'sine', 0.04);
        }
      } else if (actionId === 'shield_storm') {
        flight.stormShielded = true;
        flight.radRate = flight.design.hasShelter ? 140 : 210;
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
        if (flight.step === 2 && flight.refuelDone >= TARGET_FUEL) {
          if (!flight.stormShielded && !flight.design.hasHera) {
            flight.score -= 10;
            logFlight('Radiation dose absorbed during unshielded solar storm (-10 pts).');
          }
          setFlightStep(3);
          return;
        } else if (flight.step === 3 && flight.progress >= 95) {
          finishFlightAndLand();
          return;
        }
      }
      renderFlightUI();
    }

    function finishFlightAndLand() {
      flight.active = false;
      cancelAnimationFrame(flight.raf);
      const hasEdlHardware = flight.design.hasLoftid || flight.design.hasTrn;
      if (!flight.edlChuteDeployed || !hasEdlHardware) {
        flight.hull = Math.max(45, flight.hull - 20);
        flight.score -= 12;
      }
      if (!flight.design.hasTrn) flight.score -= 4;
      toast(`Touchdown at ${state.site === 'jezero' ? 'Jezero Crater' : 'Gale Crater'}! Release harnesses for EVA.`);
      startSurface();
    }

    function flightTick(now) {
      if (!flight.active || state.screen !== 'cockpit') return;
      const dt = Math.min(0.05, (now - flight.lastTime) / 1000);
      flight.lastTime = now;

      // Keyboard steering
      if (flight.keys.has('ArrowLeft') || flight.keys.has('KeyA')) flight.pitchX = Math.max(-1, flight.pitchX - dt * 1.4);
      if (flight.keys.has('ArrowRight') || flight.keys.has('KeyD')) flight.pitchX = Math.min(1, flight.pitchX + dt * 1.4);
      if (flight.keys.has('ArrowUp') || flight.keys.has('KeyW')) flight.pitchY = Math.max(-1, flight.pitchY - dt * 1.4);
      if (flight.keys.has('ArrowDown') || flight.keys.has('KeyS')) flight.pitchY = Math.min(1, flight.pitchY + dt * 1.4);

      if (flight.step === 0) {
        if (!flight.liftoff && flight.throttle >= LIFTOFF.throttle) {
          flight.liftoff = startLiftoff();
          logFlight('Liftoff! Keep the navball horizon between the green brackets.');
          renderFlightUI();
        }
        const g = flight.liftoff;
        if (g) {
          const up = flight.keys.has('KeyW') || flight.keys.has('ArrowUp') || flight.hold > 0;
          const down = flight.keys.has('KeyS') || flight.keys.has('ArrowDown') || flight.hold < 0;
          flight.input = (up ? 1 : 0) - (down ? 1 : 0);
          g.tick(dt, flight.input);
          flight.progress = (g.t / g.duration) * 100;
          flight.altKm = flight.progress * 0.85;
          flight.velMs = Math.round(flight.progress * 26.5);
          flight.stability = Math.round(g.share() * 100);
          flight.pitchX = 0;
          flight.pitchY = -g.value / g.limit; // the RHC leans with the error
          if (Math.abs(g.value) > g.limit * 0.75) flight.hull = Math.max(50, flight.hull - dt * 3); // off-program loads
          if (g.done) { finishLiftoff(g); }
        }
      } else if (flight.step === 1) {
        flight.altKm = Math.min(220, flight.altKm + dt * 6);
        flight.velMs = Math.min(7800, flight.velMs + dt * 210);
        flight.progress = flight.breakers.filter(b => !b).length * 33;
      } else if (flight.step === 2) {
        flight.altKm = 400;
        flight.velMs = 7670;
        if (!flight.stormShielded) flight.radRate = 810;
      } else if (flight.step === 3) {
        const descentRate = flight.edlChuteDeployed ? 18 : 11;
        flight.progress = Math.min(100, flight.progress + dt * descentRate);
        flight.altKm = Math.max(0, 125 * (1 - flight.progress / 100));
        const brakeFactor = (flight.edlChuteDeployed ? 0.55 : 0.92) * (flight.design.hasLoftid ? 0.8 : 1);
        flight.velMs = Math.max(2, Math.round(5400 * (1 - flight.progress / 100) * brakeFactor));
        flight.pitchX += Math.sin(now * 0.0031) * (flight.design.hasTrn ? 0.14 : 0.35) * dt;
        if (flight.progress >= 100) {
          finishFlightAndLand();
          return;
        }
      }

      flight.propellant = Math.max(8, 100 - flight.step * 18 - flight.progress * 0.14);
      window.dispatchEvent(new CustomEvent('astro:cockpit', { detail: flight }));
      updateCockpitHUD();
      flight.raf = requestAnimationFrame(flightTick);
    }

    function updateCockpitHUD() {
      $('#flight-progress-val').textContent = Math.round(flight.progress) + '%';
      $('#flight-alt-val').textContent = flight.altKm.toFixed(1) + ' km';
      $('#flight-vel-val').textContent = number(flight.velMs) + ' m/s';
      $('#flight-hull-val').textContent = `${Math.round(flight.propellant)}% / ${Math.round(flight.hull)}%`;
      $('#flight-goal-val').textContent = Math.round(flight.stability) + '%';
      setBar('#flight-goal-fill', flight.stability / 100, flight.stability < 55 ? 'danger' : '');

      const g = flight.step === 0 ? flight.liftoff : null, mark = $('#kir-mark');
      if (g && mark) {
        mark.style.top = `${50 - (g.value / g.limit) * 50}%`;
        mark.classList.toggle('out', Math.abs(g.value) > g.band);
        $('#kir-time').textContent = `${Math.ceil(g.duration - g.t)} s to MECO`;
        $('#kir-share').textContent = `${Math.round(g.share() * 100)}% in band`;
        const st = g.stars(); $('#kir-stars').textContent = '★'.repeat(st) + '☆'.repeat(3 - st);
        $$('[data-hold]').forEach(b => b.classList.toggle('on', Number(b.dataset.hold) === flight.input));
      }
      const pip = $('#cockpit-pip');
      if (pip) {
        pip.style.translate = `calc(-50% + ${Math.round(flight.pitchX * 48)}px) calc(-50% + ${Math.round(flight.pitchY * 48)}px)`;
        pip.classList.toggle('danger', Math.hypot(flight.pitchX, flight.pitchY) > 0.55);
      }
      const hasAlert = flight.breakers.some(Boolean) || (flight.step === 2 && !flight.stormShielded) || (flight.step === 3 && flight.progress > 35 && !flight.edlChuteDeployed);
      $('#cockpit-badge').textContent = hasAlert ? 'ACTION REQUIRED' : 'NOMINAL';
      $('#cockpit-alert-tag').textContent = hasAlert ? 'C&W MATRIX ALERT ACTIVE' : 'ALL SYSTEMS NOMINAL';
      $('#cockpit-rad-tag').textContent = `MSL RAD: ${flight.radRate} µGy/h`;
      const actionBtn = $('#cockpit-minigame [data-act="complete_step"]');
      if (actionBtn && flight.step === 2) actionBtn.disabled = flight.refuelDone < TARGET_FUEL;
    }

    function renderFlightUI() {
      $$('#flight-stepper .flight-pill').forEach((el, idx) => {
        el.classList.toggle('active', idx === flight.step);
        el.classList.toggle('done', idx < flight.step);
      });
      const titles = [
        ['Flight Operations / Phase 05', 'Liftoff & Max-Q Corridor'],
        ['Flight Operations / Phase 05B', 'Electrical Bus & Stage Separation'],
        ['Transit Operations / Phase 06A', 'Orbital Refueling & Solar Storm'],
        ['Mars Arrival / Phase 06B', 'Entry, Descent & Landing (EDL)'],
      ];
      $('.cockpit-reticle')?.toggleAttribute('hidden', flight.step === 0);
      $('#cockpit-eyebrow').textContent = titles[flight.step][0];
      $('#cockpit-title').textContent = titles[flight.step][1];

      const box = $('#cockpit-minigame');
      if (flight.step === 0) {
        const g = flight.liftoff;
        box.innerHTML = `
          <span class="eyebrow">Helena · Liftoff · Keep in range</span>
          <h4>Hold the pitch program</h4>
          <p>${g ? 'Keep the navball horizon between the green brackets until MECO. <b>W/↑</b> nose up, <b>S/↓</b> nose down; corrections take a moment to bite.' : `Push <b>Throttle_Lever</b> to ${LIFTOFF.throttle * 100}% (<b>Space</b>) to lift off.`}${flight.design.overweight ? ' <b>Low TWR: the stack wallows more.</b>' : ''}</p>
          <div class="kir-row">
            <div class="kir" style="--band:${(LIFTOFF.band / LIFTOFF.limit) * 50}%"><div class="kir-band"></div><div class="kir-mark" id="kir-mark"></div><span class="kir-label top">Nose high</span><span class="kir-label bottom">Nose low</span></div>
            <div class="kir-ctrl">${g
              ? '<button class="button secondary" type="button" data-hold="1">▲ Nose up<kbd>W · ↑</kbd></button><button class="button secondary" type="button" data-hold="-1">▼ Nose down<kbd>S · ↓</kbd></button>'
              : `<button class="button primary" type="button" data-act="throttle_up">Throttle ${Math.round(flight.throttle * 100)}%<kbd>Space</kbd></button>`}</div>
          </div>
          <div class="kir-stats"><span id="kir-time">${LIFTOFF.duration} s to MECO</span><span id="kir-share">—</span><span id="kir-stars">☆☆☆</span></div>`;
        $$('[data-hold]', box).forEach(btn => {
          btn.addEventListener('pointerdown', () => { flight.hold = Number(btn.dataset.hold); });
          for (const ev of ['pointerup', 'pointerleave', 'pointercancel']) btn.addEventListener(ev, () => { flight.hold = 0; });
        });
      } else if (flight.step === 1) {
        box.innerHTML = `
          <span class="eyebrow">Lucas · Minigame L-S4</span>
          <h4>Reset Breaker_Bank &amp; Separate</h4>
          <p>Max-Q tripped flight deck buses. Click all flashing red breakers (or click the 3D left wing), then flip <b>Stage_Sep_Switch</b>.</p>
          <div class="breaker-grid">${flight.breakers.map((t, i) => `<button class="breaker-btn ${t ? 'tripped' : ''}" type="button" data-act="breaker" data-idx="${i}">Bus ${i + 1}: ${t ? 'TRIP' : 'OK'}</button>`).join('')}</div>
          <button class="button primary" type="button" data-act="stage_sep" ${flight.breakers.some(Boolean) ? 'disabled' : ''}>Engage Stage_Sep_Switch →</button>`;
      } else if (flight.step === 2) {
        box.innerHTML = `
          <span class="eyebrow">Oscar &amp; Maya · Phase 06A</span>
          <h4>Refuel (${TARGET_FUEL}%) &amp; Shield Solar Storm</h4>
          <p>Cryogenic tanker docked. Pump fuel to your planned reserve and shield the crew from the 810 µGy/h storm (2024-05-20 RAD dataset).</p>
          <div class="control-grid">
            <button class="button secondary" type="button" data-act="pump_fuel">Pump Fuel (${flight.refuelDone}/${TARGET_FUEL}%)</button>
            <button class="button secondary" type="button" data-act="shield_storm" ${flight.stormShielded ? 'disabled' : ''}>${flight.stormShielded ? 'Shelter Sealed ✓' : flight.design.hasShelter ? 'Seal Storm Shelter' : 'Deploy Water Wall'}</button>
          </div>
          <button class="button primary" type="button" data-act="complete_step" ${flight.refuelDone < TARGET_FUEL ? 'disabled' : ''}>Commit to Mars EDL →</button>`;
      } else {
        box.innerHTML = `
          <span class="eyebrow">Helena · Minigame H-S1/S2</span>
          <h4>Mars Thin-Air EDL Approach</h4>
          <p>Arm <b>EDL_Arm_Switch</b> to deploy parachute/heat-shield (${flight.design.hasLoftid ? 'LOFTID + ASPIRE armed' : 'No extra heat-shield!'}) and stabilize for touchdown.</p>
          <div class="control-grid">
            <button class="button primary" type="button" data-act="edl_arm" ${flight.edlChuteDeployed ? 'disabled' : ''}>${flight.edlChuteDeployed ? 'Chute Deployed ✓' : 'Flip EDL_Arm_Switch'}</button>
            <button class="button secondary" type="button" data-act="stabilize">${flight.design.hasTrn ? 'TRN Hazard Avoid' : 'Manual THC Flare'}</button>
          </div>
          <button class="button primary" type="button" data-act="complete_step">Final Touchdown →</button>`;
      }
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
      surf.timerSec = state.difficulty === 'easy' ? 210 : state.difficulty === 'hard' ? 140 : 180;
      surf.activeCrew = state.detail.kind === 'crew' ? state.detail.id : 'maya';
      surf.completed = new Set();
      surf.stranded = [];
      $('#surface-rad-badge').textContent = flight.design.hasHera ? 'RAD: 232 µGy/sol · HERA MONITOR' : 'RAD: 232 µGy/sol · CALM';
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
      if (!surf.active || !t || surf.completed.has(id)) return;
      surf.completed.add(id);
      radAudio.tone(860, 0.14, 'triangle', 0.06);
      toast(surf.completed.size === surf.tasks.length ? 'All surface experiments done! Walk back to the lander and board the ascent vehicle.' : `${id} · ${t.title} done (${surf.completed.size}/${surf.tasks.length}).`);
      window.dispatchEvent(new CustomEvent('astro:surface', { detail: surf }));
    }

    function boardShipAndFinish(forcedTimeout = false) {
      surf.active = false;
      cancelAnimationFrame(surf.raf);
      radAudio.stopAll();
      // game-balance: on timeout, crew members more than 35 m from the lander are left behind.
      surf.stranded = forcedTimeout ? crew.filter(p => (window.ASTRO_SURFACE?.distanceToLander(p.id) ?? 0) > 35).map(p => p.name) : [];
      showResults(forcedTimeout);
    }

    function abortSurface() {
      surf.active = false;
      cancelAnimationFrame(surf.raf);
      radAudio.stopAll();
      showScreen('planner');
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

    $('#cockpit-abort').addEventListener('click', () => {
      flight.active = false;
      cancelAnimationFrame(flight.raf);
      showScreen('planner');
    });

    document.addEventListener('keydown', e => {
      if (state.screen === 'cockpit') {
        flight.keys.add(e.code);
        if (e.code.startsWith('Arrow')) e.preventDefault(); // steer, do not scroll the page
        if (e.code === 'Space' && e.repeat) { e.preventDefault(); return; }
        if (e.code === 'Space') { e.preventDefault(); handleCockpitAction(flight.step === 0 ? 'throttle_up' : flight.step === 1 ? 'stage_sep' : flight.step === 2 ? 'pump_fuel' : 'edl_arm'); }
      }
    });
    document.addEventListener('keyup', e => flight.keys.delete(e.code));
    window.addEventListener('blur', () => { flight.keys.clear(); flight.hold = 0; });

    // -------------------------------------------------------------------------
    // FINAL RESULTS, RANKING & ANIMATED PODIUM
    // -------------------------------------------------------------------------
    function showResults(forcedTimeout) {
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
        ['EDL Landing', `${flight.edlChuteDeployed ? 'Chute deployed' : 'Hard burn'} · ${hasEdlLabel(d)}`],
        ['Solar Storm (RAD)', flight.stormShielded || d.hasShelter ? 'Shielded (low dose)' : 'Unshielded exposure'],
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

    function hasEdlLabel(d) {
      if (d.hasLoftid && d.hasTrn) return 'Full EDL suite';
      if (d.hasLoftid || d.hasTrn) return 'Cabin EDL gear';
      return 'Minimal EDL gear';
    }

    $('#results-replay').addEventListener('click', () => showScreen('lobby'));

    return { startFlight, handleCockpitAction, startSurface, completeSurfaceTask, board: () => boardShipAndFinish(false), abortSurface, flight, surf };
  })();
  window.ASTRO_SIM = SIM;
  // Shared with the 3D modules below.
  function renderBadge(){$('#modifier-badge').textContent=`${money(budgetOf(state.difficulty))} · ${difficulty[state.difficulty].risk}`;}
  window.ASTRO_ART={RAMPS,PLANETS};
  window.ASTRO={state,crew,sites:SITES_INFO,toast,show:showScreen,showScreen,land:()=>SIM.startSurface(),data:()=>DATA,selectedKey:()=>moduleKey(state.sel),select:(key,tab)=>selectModule(key,tab),CREW_MODELS,COCKPIT_MODEL};
  paintArt();renderLobby();renderBadge();renderPlanner();setupStars();
  if(!DATA)fetch('assets/models/parts/manifest.json').then(r=>r.json()).then(m=>{useData(m);renderBadge();renderPlanner();}).catch(()=>toast('Could not load the part specs.'));
})();
