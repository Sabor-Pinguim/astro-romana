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
  const state={screen:'menu',difficulty:'normal',friends:new Set(),site:'jezero',detail:{kind:'crew',id:'helena'},rocket:{booster:{engine:null,fins:null,tank:null},stages:[{item:null},{item:null}],cabin:[]},sel:{kind:'booster'},tab:'engine'};
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
  function moduleLabel(key){
    const r=state.rocket;
    if(key==='booster'){const {engine:e,tank:t,fins:f}=r.booster;return ['Stage 1 · booster',(e&&t?`${shortName(e)} + ${shortName(t)}`:e?'tank missing':t?'engine missing':'engine + tank empty')+(f?' + fins':'')];}
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
    if(r.booster.fins)add(spec(r.booster.fins));
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
    const installed=[r.booster.engine,r.booster.tank,r.booster.fins,...r.stages.flatMap(s=>s.type==='booster'?[s.engine,s.tank]:[s.item]),...r.cabin].filter(Boolean).length;
    $('#rocket-tags').innerHTML=`<span class="tag">${r.stages.length+2} STAGES</span><span class="tag">${installed} PARTS INSTALLED</span>`;
    window.dispatchEvent(new Event('astro:rocket'));
  }
  const isBooster = sel => sel.kind==='booster'||(sel.kind==='stage'&&state.rocket.stages[sel.index]?.type==='booster');
  const tabsFor = sel => isBooster(sel)?[['engine','Engines'],['tank','Tanks'],...(sel.kind==='booster'?[['fins','Fins']]:[])]:sel.kind==='stage'?EQUIPMENT_GROUPS.map(([k,l])=>[k,l]):CABIN_GROUPS.map(([k,l])=>[k,l]);
  function partsFor(sel,tab){
    const all=Object.entries(DATA.parts);
    if(isBooster(sel))return all.filter(([,p])=>tab==='engine'?p.specs?.engineRole==='booster':tab==='fins'?p.category==='fins':p.category==='tanks'&&p.specs?.tankRole==='stage').map(([id])=>id);
    if(sel.kind==='stage'){const g=EQUIPMENT_GROUPS.find(x=>x[0]===tab);return all.filter(([id,p])=>p.category==='equipment'&&g[2].test(id)).map(([id])=>id);}
    return CABIN_GROUPS.find(x=>x[0]===tab)[2];
  }
  const installedIn = sel => isBooster(sel)?Object.values(sel.kind==='booster'?state.rocket.booster:{engine:state.rocket.stages[sel.index].engine,tank:state.rocket.stages[sel.index].tank}).filter(Boolean):sel.kind==='stage'?[state.rocket.stages[sel.index]?.item].filter(Boolean):state.rocket.cabin;
  function partMetrics(id){
    const s=spec(id),p=part(id);
    if(p.category==='engines'){const n=s.defaultClusterCount||1;return [`${n}×`,`${number(s.thrustSlKn)} kN${warn(id,'thrustSlKn')}`,`Isp ${number(s.ispSlS)}${s.ispVacS&&s.ispVacS!==s.ispSlS?'–'+number(s.ispVacS):''} s${warn(id,'ispSlS')}`,`${number(s.massDryKg)} kg each${warn(id,'massDryKg')}`,money(n*s.costM)];}
    if(p.category==='fins')return [`${number(s.massDryKg)} kg`,`gusts −${Math.round((1-(s.aeroDriftFactor??1))*100)}%`,money(s.costM)];
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
    $('#catalog-summary').innerHTML=sel.kind==='stage'?`<label>Stage type <select id="stage-type"><option value="bay">Bay</option><option value="booster">Booster</option></select></label><br>${isBooster(sel)?'Choose an engine and tank. Upper-stage propulsion is not yet included in Δv.':'One equipment module per bay.'}`:sel.kind==='booster'?'Stage 1 engine and tank, with real data for each part. Fins (optional) steady the ascent through Max-Q.':`${state.rocket.cabin.length}/${CABIN_SLOTS()} cabin slots filled. Three modules per specialist.`;
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
    const TARGET_FUEL = 100;
    // All four flight phases are timed game-balance challenges. The stepper uses these
    // durations directly, so its fill and its remaining-time counter cannot diverge.
    const FLIGHT_PHASES = [
      { id: 'liftoff', duration: 15 },
      { id: 'separation', duration: 60 },
      { id: 'docking', duration: 32 },
      { id: 'mars-burn', duration: 15 },
    ];
    const phaseDuration = step => FLIGHT_PHASES[step]?.duration ?? 0;
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
      separationAdvancing: false,
      refuelDone: 0,
      stormShielded: false,
      edlChuteDeployed: false,
      radRate: 232,
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
        finsDrift: r.booster.fins ? (spec(r.booster.fins).aeroDriftFactor ?? 1) : 1, // aerodynamic minigames: gust scale
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
      flight.radRate = 232;
      flight.score = 100 - (flight.design.overBudget ? 12 : 0) - (flight.design.overweight ? 10 : 0);
      flight.sparksUntil = flight.design.powerDeficit || flight.design.overweight ? performance.now() + 2800 : 0;
      flight.phaseElapsed = 0;
      flight.phaseTimedOut = false;
      flight.completedPhases = new Set();
      flight.docking = null;
      flight.docked = false;
      flight.marsBurn = null;

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
    const LIFTOFF = { duration: phaseDuration(0), band: 3, limit: 12, authority: 8, maxQ: [6, 10], throttle: 0.7 };
    function startLiftoff() {
      const d = flight.design, s1 = Math.random() * 100, s2 = Math.random() * 100;
      const gust = (d.overweight ? 1.6 : 1) * (d.finsDrift ?? 1); // low TWR: the stack wallows more
      return createKeepInRange({
        axes: 2, duration: LIFTOFF.duration, band: LIFTOFF.band, limit: LIFTOFF.limit,
        authority: LIFTOFF.authority * (d.hasCockpitUpgrade ? 1.25 : 1),
        drift: t => {
          const k = gust * (t > LIFTOFF.maxQ[0] && t < LIFTOFF.maxQ[1] ? 2.4 : 1); // gusts peak around Max-Q
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
      setFlightStep(1);
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
      logFlight(`${timedOut ? 'Burn window closed' : 'Trans-Mars injection complete'}. ${share}% inside the departure corridor.`);
      toast(`Mars departure ${'★'.repeat(stars)}${'☆'.repeat(3 - stars)} · ${share}% aligned`);
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
        flight.radRate = 232;
        logFlight(`ORBIT ACHIEVED. Match velocity with the tanker, then transfer ${TARGET_FUEL}% propellant.`);
        radAudio.tone(660, 0.12, 'triangle', 0.05);
      } else if (nextStep === 3) {
        flight.marsBurn = startMarsBurn();
        flight.altKm = 400;
        flight.velMs = 7670;
        flight.radRate = 232;
      logFlight('Tanker released. Hold the landing corridor for Mars.');
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
          flight.refuelDone = Math.min(TARGET_FUEL, flight.refuelDone + 25);
          flight.progress = Math.min(100, (flight.refuelDone / TARGET_FUEL) * 100);
          logFlight(`Orbital propellant transfer: ${flight.refuelDone}% / ${TARGET_FUEL}%.`);
          radAudio.tone(500, 0.06, 'sine', 0.04);
        } else if (flight.step === 2) {
          toast('Hold the docking corridor until the hard-dock latches.');
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
        if (flight.step === 2 && flight.docked && flight.refuelDone >= TARGET_FUEL) {
          setFlightStep(3);
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
        flight.refuelDone = TARGET_FUEL;
        logFlight('Docking window expired. Auto-capture and minimum transfer completed with a mission penalty.');
        setFlightStep(3);
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
          logFlight('Liftoff! Keep the navball target inside the green brackets.');
          renderFlightUI();
        }
        const g = flight.liftoff;
        if (g) {
          const [pitch, yaw] = pilotInput();
          flight.input = { up: pitch > 0, down: pitch < 0, right: yaw > 0, left: yaw < 0 };
          g.tick(dt, [pitch, yaw]);
          flight.phaseElapsed = g.t;
          flight.progress = (g.t / g.duration) * 100;
          flight.altKm = flight.progress * 0.85;
          flight.velMs = Math.round(flight.progress * 26.5);
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
          flight.altKm = Math.min(240, 28 + flight.progress * 2.1);
          flight.velMs = Math.min(7670, 2250 + Math.round(flight.progress * 54));
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
        flight.altKm = 400;
        flight.velMs = 7670;
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
          flight.progress = 65 + (flight.refuelDone / TARGET_FUEL) * 35;
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
          flight.altKm = 400 + flight.progress * 5.5;
          flight.velMs = Math.round(7670 + flight.progress * 9.8);
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

      flight.propellant = Math.max(8, 100 - flight.step * 18 - flight.progress * 0.14);
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
      $('#flight-alt-val').textContent = flight.altKm.toFixed(1) + ' km';
      $('#flight-vel-val').textContent = number(flight.velMs) + ' m/s';
      $('#flight-hull-val').textContent = `${Math.round(flight.propellant)}% / ${Math.round(flight.hull)}%`;
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
      $('#cockpit-rad-tag').textContent = `MSL RAD: ${flight.radRate} µGy/h`;
      const actionBtn = $('#cockpit-minigame [data-act="complete_step"]');
      if (actionBtn && flight.step === 2) actionBtn.disabled = !flight.docked || flight.refuelDone < TARGET_FUEL;
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
          <p>${g ? 'Keep the navball target centred, inside the green brackets, until MECO. <b>W/S</b> or <b>↑/↓</b> pitch, <b>A/D</b> or <b>←/→</b> yaw; corrections take a moment to bite.' : `Push <b>Throttle_Lever</b> to ${LIFTOFF.throttle * 100}% (<b>Space</b>) to lift off.`}${flight.design.overweight ? ' <b>Low TWR: the stack wallows more.</b>' : ''}${flight.design.finsDrift < 1 ? ` <b>Fins damp the gusts (−${Math.round((1 - flight.design.finsDrift) * 100)}%).</b>` : ''}</p>
          <div class="kir-row">
            <div class="kir kir-2d" style="--band:${(LIFTOFF.band / LIFTOFF.limit) * 100}%"><div class="kir-band"></div><div class="kir-mark" id="kir-mark"></div><span class="kir-label top">Nose high</span><span class="kir-label bottom">Nose low</span></div>
            <div class="kir-ctrl ${g ? 'kir-pad' : ''}">${g
              ? '<button class="button secondary up" type="button" data-hold="up">▲<kbd>W · ↑</kbd></button><button class="button secondary left" type="button" data-hold="left">◀<kbd>A · ←</kbd></button><button class="button secondary right" type="button" data-hold="right">▶<kbd>D · →</kbd></button><button class="button secondary down" type="button" data-hold="down">▼<kbd>S · ↓</kbd></button>'
              : `<button class="button primary" type="button" data-act="throttle_up">Throttle ${Math.round(flight.throttle * 100)}%<kbd>Space</kbd></button>`}</div>
          </div>
          <div class="kir-stats"><span id="kir-time">${LIFTOFF.duration} s to MECO</span><span id="kir-share">—</span><span id="kir-stars">☆☆☆</span></div>`;
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
          <div class="docking-readout"><span>${flight.docked ? 'LATCHED · READY TO TRANSFER' : `ALIGNMENT ${aligned}%`}</span><strong>${flight.docked ? `${flight.refuelDone}/${TARGET_FUEL}%` : `${Math.ceil((g?.duration ?? 0) - (g?.t ?? 0))} s APPROACH`}</strong></div>
          <div class="control-grid">
            <button class="button secondary" type="button" data-act="pump_fuel" ${flight.docked ? '' : 'disabled'}>Transfer Propellant (${flight.refuelDone}/${TARGET_FUEL}%)</button>
            <button class="button secondary" type="button" data-act="stabilize" ${flight.docked ? 'disabled' : ''}>Trim Relative Velocity</button>
          </div>
          <button class="button primary" type="button" data-act="complete_step" ${!flight.docked || flight.refuelDone < TARGET_FUEL ? 'disabled' : ''}>Continue to Mars Landing →</button>`;
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

    return { startFlight, handleCockpitAction, startSurface, completeSurfaceTask, board: () => boardShipAndFinish(false), flight, surf };
  })();
  window.ASTRO_SIM = SIM;
  // Shared with the 3D modules below.
  function renderBadge(){$('#modifier-badge').textContent=`${money(budgetOf(state.difficulty))} · ${difficulty[state.difficulty].risk}`;}
  window.ASTRO_ART={RAMPS,PLANETS};
  window.ASTRO={state,crew,sites:SITES_INFO,toast,show:showScreen,showScreen,land:()=>SIM.startSurface(),data:()=>DATA,selectedKey:()=>moduleKey(state.sel),select:(key,tab)=>selectModule(key,tab),CREW_MODELS,COCKPIT_MODEL};
  paintArt();renderLobby();renderBadge();renderPlanner();setupStars();
  if(!DATA)fetch('assets/models/parts/manifest.json').then(r=>r.json()).then(m=>{useData(m);renderBadge();renderPlanner();}).catch(()=>toast('Could not load the part specs.'));
})();
