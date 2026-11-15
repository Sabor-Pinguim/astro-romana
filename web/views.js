(async () => {
// 3D views built from the generated GLBs (assets/models): the Saturn V flying on the menu,
// the selected crew member in the lobby and the rocket the crew is building in the planner.
// Models come from index.models.js (works from file://) or, when served, straight from the folder.
const THREE = await import('three');
const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
const { RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js');

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const loader = new GLTFLoader(), cache = new Map();
function loadGLTF(path) {
  if (!cache.has(path)) cache.set(path, (async () => {
    const b64 = window.ASTRO_GLB?.[path];
    let data;
    if (b64) { const bin = atob(b64); data = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) data[i] = bin.charCodeAt(i); data = data.buffer; }
    else data = await (await fetch('assets/models/' + path)).arrayBuffer();
    return loader.parseAsync(data, '');
  })());
  return cache.get(path);
}
const loadGLB = path => loadGLTF(path).then(gltf => gltf.scene.clone(true));
// One renderer per view, lit like the rest of the identity: cream key light, purple fill, Mars-orange rim.
function makeView(container, { fov = 30, append = false } = {}) {
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); } catch { return null; }
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(fov, 1, .05, 400);
  scene.add(new THREE.AmbientLight(0xb48cf0, .9));
  // Soft room reflections so metallic parts (engines, structure) are not black.
  scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), .04).texture;
  scene.environmentIntensity = .5;
  const key = new THREE.DirectionalLight(0xfce8a6, 2.4); key.position.set(-4, 6, 5); scene.add(key);
  const rim = new THREE.DirectionalLight(0xe04f26, 1.8); rim.position.set(5, 1, -4); scene.add(rim);
  container[append ? 'append' : 'prepend'](renderer.domElement);
  const view = { renderer, scene, camera, width: 0, height: 0, onResize: null };
  new ResizeObserver(() => {
    view.width = container.clientWidth; view.height = container.clientHeight;
    if (!view.width || !view.height) return;
    renderer.setSize(view.width, view.height, false);
    camera.aspect = view.width / view.height; camera.updateProjectionMatrix();
    view.onResize?.();
  }).observe(container);
  return view;
}
const isActive = id => document.getElementById(id)?.classList.contains('active');

// Menu: Saturn V in flight. Play makes it burn hard and fly away before the screen changes.
(async () => {
  const art = document.querySelector('#menu .space-art'), view = art && makeView(art, { fov: 28, append: true });
  if (!view) return;
  view.renderer.domElement.classList.add('saturn-canvas');
  const { scene, camera } = view;
  const flight = new THREE.Group(), spin = new THREE.Group(), body = await loadGLB('rocket/saturn_v_lowpoly.glb');
  const height = new THREE.Box3().setFromObject(body).getSize(new THREE.Vector3()).y;
  body.position.y = -height / 2;
  spin.add(body); flight.add(spin); scene.add(flight);
  // Exhaust: three nested 7-sided cones, additive, flickering.
  const plume = new THREE.Group();
  plume.position.y = -height / 2;
  [[.62, 3.4, 0xe04f26, .5], [.42, 2.4, 0xf59e0b, .7], [.2, 1.4, 0xfce8a6, .95]].forEach(([r, h, color, opacity]) => {
    const cone = new THREE.Mesh(new THREE.ConeGeometry(r, h, 7, 1, true), new THREE.MeshBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
    cone.rotation.x = Math.PI; cone.position.y = -h / 2;
    plume.add(cone);
  });
  spin.add(plume);
  camera.position.set(0, 0, 30); camera.lookAt(0, 0, 0);
  const home = new THREE.Vector3(), tilt = -.42;
  let scale = 1, launch = null, wasActive = true;
  view.onResize = () => {
    const H = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)), W = H * camera.aspect, narrow = camera.aspect < .9;
    home.set(narrow ? W * .2 : W * .07, narrow ? H * .22 : -H * .02, 0);
    scale = (narrow ? .36 : .56) * H / height;
  };
  window.ASTRO_LAUNCH = () => new Promise(resolve => {
    if (reduce || !view.width) return resolve();
    launch = { start: performance.now(), resolve, done: false };
  });
  const up = new THREE.Vector3();
  function frame(now) {
    requestAnimationFrame(frame);
    const active = isActive('menu');
    if (active && !wasActive) launch = null; // back on the menu: the rocket is waiting again
    wasActive = active;
    if (!active || !view.width) return;
    const t = reduce ? 0 : now / 1000;
    flight.rotation.set(-.12, 0, tilt);
    spin.rotation.y = t * .25;
    flight.scale.setScalar(scale);
    flight.position.copy(home);
    flight.position.y += Math.sin(t * 1.3) * .12;
    let burn = 1;
    if (launch) {
      const e = (now - launch.start) / 1000;
      up.set(0, 1, -.55).normalize().applyQuaternion(flight.quaternion);
      flight.position.addScaledVector(up, 26 * e * e);
      burn = 1 + e * 2.2;
      if (e > 1.05 && !launch.done) { launch.done = true; launch.resolve(); }
    }
    plume.scale.set(1 + Math.random() * .08, burn * (1 + Math.random() * .18), 1 + Math.random() * .08);
    view.renderer.render(scene, camera);
  }
  view.onResize();
  requestAnimationFrame(frame);
})().catch(err => console.warn('Saturn V not shown:', err));

// Lobby: the selected crew member (avatar GLB): idle loop, a wave when picked again.
(async () => {
  const box = document.getElementById('detail-view'), view = box && makeView(box, { fov: 24 });
  if (!view) return;
  const AVATARS = { helena: 'characters/helena.glb', lucas: 'characters/lucas.glb', oscar: 'characters/oscar.glb', maya: 'characters/maya.glb' };
  const { scene, camera } = view, holder = new THREE.Group();
  scene.add(holder);
  let mixer = null, idle = null, wave = null, current = null, last = performance.now(), token = 0;
  view.onResize = () => { const d = 1.3 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) / Math.min(1, camera.aspect * 1.1); camera.position.set(0, 1.15, d); camera.lookAt(0, .95, 0); };
  async function show(id) {
    if (!AVATARS[id]) return;
    if (id === current) { if (wave && idle) { wave.reset().play(); wave.crossFadeFrom(idle, .2, false); } return; }
    current = id;
    const mine = ++token, gltf = await loadGLTF(AVATARS[id]);
    if (mine !== token) return;
    const model = gltf.scene.clone(true);
    holder.clear(); holder.add(model);
    mixer = new THREE.AnimationMixer(model);
    const clip = name => THREE.AnimationClip.findByName(gltf.animations, name);
    idle = clip('idle_loop') && mixer.clipAction(clip('idle_loop'));
    wave = clip('wave') && mixer.clipAction(clip('wave'));
    if (wave) { wave.setLoop(THREE.LoopOnce, 1); wave.clampWhenFinished = false; }
    mixer.addEventListener('finished', () => idle?.reset().fadeIn(.2).play());
    idle?.play();
  }
  window.addEventListener('astro:detail', e => { if (e.detail.kind === 'crew') show(e.detail.id); });
  if (window.ASTRO?.state.detail.kind === 'crew') show(window.ASTRO.state.detail.id);
  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    if (!isActive('lobby') || !view.width || box.classList.contains('site')) return;
    if (!reduce) { mixer?.update(dt); holder.rotation.y = Math.sin(now / 2500) * .45; }
    view.renderer.render(scene, camera);
  }
  view.onResize();
  requestAnimationFrame(frame);
})().catch(err => console.warn('Avatar not shown:', err));

// Planner: the rocket the crew is building. Hull modules carry Attach_* nodes (the mounting points);
// engines hang from Attach_Engines in the real cluster pattern, the tank stands on Attach_Tank,
// one equipment module stands on each stage's Attach_Bay and up to 4 cabin modules sit on the cabin deck.
// Empty mounting points glow amber and can be clicked; "+" buttons in the gaps insert a stage.
(async () => {
  const blueprint = document.querySelector('.blueprint'), ui = window.ASTRO;
  const view = blueprint && ui && makeView(blueprint, { fov: 26 });
  if (!view) return;
  blueprint.classList.add('is-3d');
  const { scene, camera, renderer } = view, overlay = blueprint.querySelector('#stack-overlay');
  const HULL = { booster: 'parts/structures/booster-thrust-section.glb', stage: 'parts/structures/stage-module.glb', cabin: 'rocket/cabin_cutaway.glb' };
  const CABIN_SLOTS = [[-.2, .03], [.2, .03], [-.2, .5], [.2, .5]]; // x, y on the cabin deck; modules at half scale
  const GAP = .36, TANK_CAP = 3.2;
  const stack = new THREE.Group(); scene.add(stack);
  const padMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: .8, depthWrite: false });
  const lineMat = new THREE.LineBasicMaterial({ color: 0xfce8a6 }), selMat = new THREE.LineBasicMaterial({ color: 0xf59e0b });
  const polygon = (r, n, mat) => new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(Array.from({ length: n }, (_, k) => new THREE.Vector3(r * Math.cos(k * 2 * Math.PI / n), 0, r * Math.sin(k * 2 * Math.PI / n)))), mat);
  function mountPoint(r, info) {
    const g = new THREE.Group(), pad = new THREE.Mesh(new THREE.CylinderGeometry(r, r, .014, 6), padMat);
    pad.userData.mount = info; g.add(pad, polygon(r * 1.4, 6, lineMat));
    g.userData.pulse = true;
    return g;
  }
  const attach = (hull, name, fallback) => hull.getObjectByName(name)?.position.y ?? fallback;
  const fitWidth = (obj, width) => { const s = new THREE.Box3().setFromObject(obj).getSize(new THREE.Vector3()); obj.scale.setScalar(width / Math.max(s.x, s.z)); };
  const ring = (n, r, off = 0) => Array.from({ length: n }, (_, k) => [r * Math.cos(off + k * 2 * Math.PI / n), r * Math.sin(off + k * 2 * Math.PI / n)]);
  // Engine positions (x, z) and engine width inside the Ø 0.96 thrust plate, by cluster size (specs.defaultClusterCount).
  function cluster(n) {
    if (n === 1) return { w: .5, at: [[0, 0]] };
    if (n === 3) return { w: .32, at: ring(3, .22, Math.PI / 2) };
    if (n === 4) return { w: .3, at: ring(4, .22, Math.PI / 4) };
    if (n === 9) return { w: .22, at: [[0, 0], ...ring(8, .32)] };
    if (n === 33) return { w: .11, at: [...ring(3, .08), ...ring(10, .22), ...ring(20, .4)] };
    return { w: .8 / Math.sqrt(n), at: ring(n, .3) };
  }
  // Long tanks are squeezed so the whole stack fits the view (soft cap on the scaled height).
  const softCap = h => TANK_CAP * (1 - Math.exp(-h / TANK_CAP));

  async function booster(r, parts, module = 'booster') {
    const g = new THREE.Group(), hull = await loadGLB(HULL.booster);
    g.userData.module = module; g.add(hull);
    const engineY = attach(hull, 'Attach_Engines', 0), tankY = attach(hull, 'Attach_Tank', .5);
    let top = tankY;
    if (r.booster.engine) {
      const { w, at } = cluster(parts[r.booster.engine].specs.defaultClusterCount || 1);
      for (const [x, z] of at) { const e = await loadGLB(parts[r.booster.engine].file); fitWidth(e, w); e.position.set(x, engineY, z); g.add(e); }
    } else { const m = mountPoint(.24, { module, tab: 'engine' }); m.position.y = engineY - .03; g.add(m); }
    if (r.booster.tank) {
      const t = await loadGLB(parts[r.booster.tank].file), size = new THREE.Box3().setFromObject(t).getSize(new THREE.Vector3());
      const s = .96 / Math.max(size.x, size.z), h = size.y * s, capped = softCap(h);
      t.scale.set(s, s * capped / h, s); t.position.y = tankY; g.add(t);
      top = tankY + capped;
    } else { const m = mountPoint(.32, { module, tab: 'tank' }); m.position.y = tankY + .02; g.add(m); }
    g.userData.top = top;
    return g;
  }
  async function stage(r, i, parts) {
    if (r.stages[i].type === 'booster') return booster({ booster: r.stages[i] }, parts, `stage-${i}`);
    const g = new THREE.Group(), hull = await loadGLB(HULL.stage), key = `stage-${i}`, item = r.stages[i].item;
    g.userData.module = key; g.add(hull);
    const bay = attach(hull, 'Attach_Bay', .1);
    if (item) { const e = await loadGLB(parts[item].file); e.position.y = bay; g.add(e); }
    else { const m = mountPoint(.16, { module: key }); m.position.y = bay + .01; g.add(m); }
    g.userData.top = attach(hull, 'Attach_Top', 1);
    return g;
  }
  async function cabin(r, parts) {
    const g = new THREE.Group();
    g.userData.module = 'cabin'; g.add(await loadGLB(HULL.cabin));
    for (let k = 0; k < CABIN_SLOTS.length; k++) {
      const [x, y] = CABIN_SLOTS[k], id = r.cabin[k];
      if (id) { const e = await loadGLB(parts[id].file); e.scale.setScalar(.5); e.position.set(x, y, 0); g.add(e); }
      else { const m = mountPoint(.08, { module: 'cabin' }); m.position.set(x, y + .01, 0); g.add(m); }
    }
    g.userData.top = new THREE.Box3().setFromObject(g).max.y;
    return g;
  }

  let key = '', build = 0, layout = [], gaps = [], focusKey = null;
  const center = new THREE.Vector3();
  const cameraCenter = new THREE.Vector3();
  let distance = 10, cameraDistance = 10;
  const zoomButton = document.getElementById('rocket-overview');
  const navigation = document.getElementById('rocket-navigation');
  const upButton = document.getElementById('rocket-up'), downButton = document.getElementById('rocket-down');
  function updateZoomControls() {
    const index = layout.findIndex(item => item.key === focusKey);
    const zoomed = focusKey !== null;
    zoomButton.textContent = zoomed ? '⛶ Zoom out' : '⛶ Zoom in';
    zoomButton.setAttribute('aria-pressed', String(zoomed));
    navigation.hidden = !zoomed;
    upButton.disabled = index < 0 || index >= layout.length - 1;
    downButton.disabled = index <= 0;
  }
  window.addEventListener('astro:focus-module', e => { focusKey = e.detail; updateZoomControls(); });
  window.addEventListener('astro:stage-removed', e => { if (focusKey !== null) focusKey = e.detail; updateZoomControls(); });
  zoomButton.addEventListener('click', () => { focusKey = focusKey === null ? ui.selectedKey() : null; updateZoomControls(); });
  function moveFocus(delta) {
    const index = layout.findIndex(item => item.key === focusKey);
    const next = layout[index + delta];
    if (next) ui.select(next.key);
  }
  upButton.addEventListener('click', () => moveFocus(1));
  downButton.addEventListener('click', () => moveFocus(-1));
  async function rebuild() {
    const data = ui.data();
    if (!data) return;
    const r = ui.state.rocket, selected = ui.selectedKey(), next = JSON.stringify([r, selected]);
    if (next === key) return;
    key = next;
    const id = ++build;
    const groups = await Promise.all([booster(r, data.parts), ...r.stages.map((_, i) => stage(r, i, data.parts)), cabin(r, data.parts)]);
    if (id !== build) return;
    stack.clear(); layout = []; gaps = [];
    let y = 0;
    groups.forEach((g, i) => {
      if (i > 0) { gaps.push({ insert: i - 1, y: y + GAP / 2 }); y += GAP; }
      g.position.y = y; stack.add(g);
      const top = g.userData.top;
      layout.push({ key: g.userData.module, mid: y + top / 2, height: top });
      if (g.userData.module === selected) [0, top].forEach(h => { const p = polygon(.66, 12, selMat); p.position.y = y + h; stack.add(p); });
      y += top;
    });
    const box = new THREE.Box3().setFromObject(stack), size = box.getSize(new THREE.Vector3());
    box.getCenter(center);
    distance = (size.y * .66) / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    center.y -= size.y * .02; // room for the label above and the tags below
    if (focusKey !== null && !layout.some(item => item.key === focusKey)) focusKey = ui.selectedKey();
    updateZoomControls();
  }
  window.addEventListener('astro:rocket', rebuild);
  rebuild();

  // Clicks: a mounting point selects its module and catalog tab; anything else selects its module.
  const ray = new THREE.Raycaster(), pointer = new THREE.Vector2();
  function pick(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
    ray.setFromCamera(pointer, camera);
    for (const hit of ray.intersectObjects(stack.children, true)) {
      if (hit.object.userData.mount) return hit.object.userData.mount;
      let o = hit.object; while (o && !o.userData.module) o = o.parent;
      if (o) return { module: o.userData.module };
    }
    return null;
  }
  renderer.domElement.addEventListener('click', e => { const hit = pick(e); if (hit) ui.select(hit.module, hit.tab); });
  renderer.domElement.addEventListener('pointermove', e => { renderer.domElement.style.cursor = pick(e) ? 'pointer' : ''; });

  const v = new THREE.Vector3();
  const toY = y => { v.set(0, y, 0).project(camera); return (1 - v.y) / 2 * view.height; };
  function frame(now) {
    requestAnimationFrame(frame);
    if (!isActive('planner') || !view.width || !layout.length) return;
    const t = reduce ? 0 : now / 1000;
    stack.rotation.y = Math.sin(t * .35) * .75; // swing, but keep the open side of the cutaways in view
    stack.traverse(o => { if (o.userData.pulse) o.scale.setScalar(1 + Math.sin(t * 4) * .12); });
    const focused = layout.find(item => item.key === focusKey);
    const targetCenter = focused ? new THREE.Vector3(0, focused.mid, 0) : center;
    const halfFov = THREE.MathUtils.degToRad(camera.fov / 2);
    const targetDistance = focused ? Math.min(distance, Math.max(focused.height * .8, 1.2 / Math.min(camera.aspect, 1)) / Math.tan(halfFov)) : distance;
    const blend = reduce ? 1 : .12;
    cameraCenter.lerp(targetCenter, blend);
    cameraDistance += (targetDistance - cameraDistance) * blend;
    camera.position.set(0, cameraCenter.y + cameraDistance * .2, cameraDistance);
    camera.lookAt(cameraCenter);
    // Labels sit beside their module; "+" buttons sit in the gaps on the rocket axis.
    for (const { key: k, mid } of layout) {
      const el = overlay.querySelector(`[data-module="${k}"]`);
      if (!el) continue;
      el.style.display = focused && k !== focusKey ? 'none' : '';
      el.style.top = Math.max(52, Math.min(view.height - 96, toY(mid) - el.offsetHeight / 2)) + 'px';
      el.classList.add('placed');
    }
    v.set(0, 0, 0).project(camera);
    const axisX = (v.x + 1) / 2 * view.width;
    for (const { insert, y } of gaps) {
      const el = overlay.querySelector(`[data-insert="${insert}"]`);
      if (!el) continue;
      const screenY = toY(y);
      el.style.display = screenY >= 30 && screenY <= view.height - 30 ? '' : 'none';
      el.style.left = axisX + 'px'; el.style.top = screenY + 'px';
      el.classList.add('placed');
    }
    renderer.render(scene, camera);
  }
  requestAnimationFrame(frame);
})().catch(err => console.warn('3D rocket not shown:', err));

// Planner catalog: render each part's 3D GLB once into an offscreen studio view (cached in window.ASTRO_THUMBS).
(async () => {
  const thumbs = window.ASTRO_THUMBS;
  if (!thumbs) return;
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true }); } catch { return; }
  renderer.setPixelRatio(1);
  renderer.setSize(144, 144, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;

  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(28, 1, 0.05, 100);
  scene.add(new THREE.AmbientLight(0xb48cf0, 0.95));
  scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.55;
  const key = new THREE.DirectionalLight(0xfce8a6, 2.4); key.position.set(-4, 6, 5); scene.add(key);
  const rim = new THREE.DirectionalLight(0xe04f26, 1.8); rim.position.set(5, 1, -4); scene.add(rim);
  const holder = new THREE.Group();
  scene.add(holder);

  const box = new THREE.Box3(), size = new THREE.Vector3(), center = new THREE.Vector3();
  async function renderPartThumb(p) {
    const obj = await loadGLB(p.file);
    holder.clear();
    holder.rotation.set(0, 0, 0);
    box.setFromObject(obj);
    box.getSize(size);
    const maxXZ = Math.max(size.x, size.z, 0.01);
    if (p.category === 'tanks' && size.y > maxXZ * 2.2) {
      obj.scale.y *= (maxXZ * 2.2) / size.y;
      obj.updateMatrixWorld(true);
      box.setFromObject(obj);
    }
    box.getCenter(center);
    obj.position.sub(center);
    holder.add(obj);
    holder.rotation.set(0.24, -0.58, p.category === 'tanks' ? 0.32 : 0.06);
    holder.updateMatrixWorld(true);
    box.setFromObject(holder).getSize(size);
    const half = Math.max(size.x, size.y, 0.1) * 0.56;
    const dist = half / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) + size.z * 0.55;
    camera.position.set(0, 0, dist);
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
    return renderer.domElement.toDataURL('image/png');
  }

  let running = false, again = false;
  async function syncCatalogThumbs() {
    if (running) { again = true; return; }
    running = true;
    try {
      do {
        again = false;
        const data = window.ASTRO?.data?.();
        if (!data) break;
        const slots = [...document.querySelectorAll('#parts-list [data-part-thumb]')];
        for (const slot of slots) {
          const id = slot.dataset.partThumb, p = data.parts?.[id];
          if (!p?.file) continue;
          let url = thumbs.get(id);
          if (!url) {
            url = await renderPartThumb(p);
            thumbs.set(id, url);
          }
          document.querySelectorAll(`#parts-list [data-part-thumb="${CSS.escape(id)}"]`).forEach(el => {
            if (!el.querySelector('img')) el.innerHTML = `<img src="${url}" alt="">`;
          });
        }
      } while (again);
    } finally {
      running = false;
    }
  }
  window.addEventListener('astro:catalog', syncCatalogThumbs);
  syncCatalogThumbs();
})().catch(err => console.warn('Catalog 3D thumbnails disabled:', err));
// Surface: the landing site in 3D. The ground is the real HiRISE terrain of the chosen site
// (assets/terrain, built by tools/terrain; index.terrain.<site>.js when opened from disk).
// First-person walk with the crew member's own suit in view when looking down (V: chase camera).
// One block per crew member marks a surface experiment (window.ASTRO_SIM.surf.tasks) at a random spot;
// its owner walks there and runs the minigame (placeholder for now). The rules (launch window timer,
// boarding, results) live in ASTRO_SIM; this module moves the crew and reports back.
(() => {
  const root = document.getElementById('surface'), ui = window.ASTRO, sim = () => window.ASTRO_SIM;
  if (!root || !ui) return;
  const $s = id => document.getElementById(id);
  const viewEl = $s('surface-view'), startEl = $s('surface-start'), promptEl = $s('surface-prompt'), dlg = $s('minigame-dialog');
  const MARS_G = 3.71; // m/s², Mars surface gravity (same value as tools/modeling/lib/fx-presets.mjs)
  // game-balance: walk/run speed (m/s), jump speed, reach to a block or the lander, and where the blocks
  // land (close enough to visit all four within the launch window).
  const WALK = 2.2, RUN = 4.6, JUMP = 2.6, REACH = 3.2, BOARD_REACH = 5, SPOT_MIN = 20, SPOT_MAX = 75, SPOT_GAP = 28;
  // Where each crew member stands after touchdown (m, south of the lander).
  const CREW_START = { helena: [-5.4, 6.6], lucas: [-1.8, 7.5], oscar: [2.1, 7.5], maya: [5.7, 6.3] };
  const STRIDE = 1.33; // m/s that matches walk_loop (1.1 s cycle, two ~0.73 m steps)
  // game: the photo is a grayscale stretch; this gain on the manifest tint makes it read as warm Mars ground under the game lights.
  const GROUND_GAIN = [3, 2, 1.25];
  const tasks = () => sim()?.surf.tasks ?? [];
  const isDone = id => !!sim()?.surf.completed.has(id);
  const touch = matchMedia('(pointer: coarse)').matches, clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const s = { site: null, crew: null, emote: null, emoteCam: false, mode: 'first', yaw: 0, pitch: -.1, bodyYaw: 0, speed: 0, vy: 0, grounded: true, jump: false,
    pos: new THREE.Vector3(), keys: new Set(), stick: null, look: null, drag: null, ready: false, prompt: '' };
  let world = null;

  const hiddenMat = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false }); // still casts a shadow
  const flat = (color, roughness = .7, metalness = 0) => new THREE.MeshStandardMaterial({ color, roughness, metalness, flatShading: true });
  function initWorld() {
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true }); } catch { return null; }
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap;
    viewEl.prepend(renderer.domElement);
    const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(72, 1, .05, 1200);
    camera.rotation.order = 'YXZ';
    // Daytime Mars sky (game colors): butterscotch at the horizon, darker overhead; faceted dome.
    const horizon = new THREE.Color(0xd8a07c), zenith = new THREE.Color(0x7a4c46);
    const skyGeo = new THREE.IcosahedronGeometry(900, 2), sp = skyGeo.attributes.position, colors = [];
    for (let k = 0; k < sp.count; k++) { const c = horizon.clone().lerp(zenith, Math.pow(Math.max(0, sp.getY(k) / 900), .55)); colors.push(c.r, c.g, c.b); }
    skyGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    const sky = new THREE.Mesh(skyGeo, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false, depthWrite: false }));
    sky.renderOrder = -1; scene.add(sky);
    scene.fog = new THREE.Fog(horizon, 45, 230);
    scene.add(new THREE.HemisphereLight(0xf3c9a0, 0x4a2418, 1.25));
    const sun = new THREE.DirectionalLight(0xfff0dc, 2.1);
    sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.normalBias = .03;
    Object.assign(sun.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 180 });
    scene.add(sun, sun.target);
    const skirt = new THREE.Mesh(new THREE.CircleGeometry(1500, 6).rotateX(-Math.PI / 2), flat(0x6b3b28, 1));
    scene.add(skirt);
    const lander = makeLander(); scene.add(lander);
    const w = { renderer, scene, camera, sky, sun, skirt, lander, sunDir: new THREE.Vector3(0, 1, 0), terrain: null, hf: null,
      blocks: [], colliders: [], avatars: new Map(), avatar: null, width: 0, height: 0 };
    new ResizeObserver(() => {
      w.width = viewEl.clientWidth; w.height = viewEl.clientHeight;
      if (!w.width || !w.height) return;
      renderer.setSize(w.width, w.height, false); camera.aspect = w.width / w.height; camera.updateProjectionMatrix();
    }).observe(viewEl);
    bindInput(renderer.domElement);
    return w;
  }

  // The landed vehicle at the site center (game art from primitives, palette colors).
  function makeLander() {
    const g = new THREE.Group(), hull = flat(0xe9e4f0, .6), foil = flat(0xd8a23a, .45, .3), steel = flat(0x8c90a0, .5, .4), dark = flat(0x281147, .9);
    const add = (geo, mat, x, y, z) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; g.add(m); return m; };
    add(new THREE.CylinderGeometry(1.5, 1.7, 1.3, 6), foil, 0, 1.75, 0);
    add(new THREE.CylinderGeometry(1, 1.5, .8, 6), hull, 0, 2.8, 0);
    add(new THREE.ConeGeometry(.55, .7, 8), steel, 0, .95, 0).rotation.x = Math.PI;
    add(new THREE.BoxGeometry(.8, .9, .1), dark, 0, 1.75, 1.47);
    add(new THREE.CylinderGeometry(.05, .05, 1.2, 5), steel, .5, 3.7, 0);
    add(new THREE.ConeGeometry(.5, .22, 8, 1, true), hull, .5, 4.35, 0).rotation.x = Math.PI;
    const up = new THREE.Vector3(0, 1, 0);
    for (let k = 0; k < 4; k++) {
      const a = Math.PI / 4 + k * Math.PI / 2, top = new THREE.Vector3(Math.sin(a) * 1.35, 1.5, Math.cos(a) * 1.35), foot = new THREE.Vector3(Math.sin(a) * 2.4, .08, Math.cos(a) * 2.4);
      const dir = foot.clone().sub(top), leg = add(new THREE.CylinderGeometry(.07, .07, dir.length(), 5), steel, 0, 0, 0);
      leg.position.copy(top).add(foot).multiplyScalar(.5); leg.quaternion.setFromUnitVectors(up, dir.normalize());
      add(new THREE.CylinderGeometry(.3, .36, .1, 6), steel, foot.x, .05, foot.z);
    }
    return g;
  }

  // Experiment marker: hex plinth, a block in the owner's color, a floating gem and a light beam seen from afar.
  function makeBlock(exp, color) {
    const g = new THREE.Group(), tone = new THREE.Color(color), dark = flat(0x281147, .9), mat = flat(tone, .75);
    const plinth = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.45, .4, 6), dark); plinth.position.y = .1;
    const block = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.1, 1.1), mat); block.position.y = .85; block.rotation.y = Math.PI / 4;
    const band = new THREE.Mesh(new THREE.BoxGeometry(1.14, .16, 1.14), dark); band.position.y = 1.05; band.rotation.y = Math.PI / 4;
    const gem = new THREE.Mesh(new THREE.OctahedronGeometry(.32), new THREE.MeshBasicMaterial({ color: 0xfce8a6 })); gem.position.y = 2.2;
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(.22, .22, 60, 6, 1, true),
      new THREE.MeshBasicMaterial({ color: tone, transparent: true, opacity: .3, blending: THREE.AdditiveBlending, depthWrite: false, fog: false, side: THREE.DoubleSide }));
    beam.position.y = 31;
    for (const m of [plinth, block, band]) m.castShadow = m.receiveShadow = true;
    g.add(plinth, block, band, gem, beam);
    g.userData = { exp, gem, beam, tag: null };
    return g;
  }

  // Terrain: the GLB comes from index.terrain.<site>.js (a <script> works on file://).
  const terrains = new Map();
  function fetchTerrain(id) {
    if (!terrains.has(id)) terrains.set(id, (async () => {
      if (!window.ASTRO_TERRAIN?.[id]) await new Promise((ok, fail) => {
        const tag = document.createElement('script');
        tag.src = `index.terrain.${id}.js`; tag.onload = ok; tag.onerror = () => fail(new Error(`index.terrain.${id}.js missing (npm run web:models)`));
        document.head.append(tag);
      });
      const entry = window.ASTRO_TERRAIN?.[id];
      if (!entry?.glb) throw new Error(`no terrain for ${id}`);
      const bin = atob(entry.glb), bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      delete entry.glb;
      const gltf = await loader.parseAsync(bytes.buffer, '');
      let mesh = null; gltf.scene.traverse(o => { if (o.isMesh && !mesh) mesh = o; });
      mesh.receiveShadow = true;
      const { color, map } = mesh.material;
      color.setRGB(color.r * GROUND_GAIN[0], color.g * GROUND_GAIN[1], color.b * GROUND_GAIN[2]);
      if (map) map.anisotropy = world.renderer.capabilities.getMaxAnisotropy(); // keeps the photo sharp at grazing angles
      addGroundDetail(mesh.material, entry.site.sizeM);
      const hf = heightField(mesh);
      gltf.scene.add(scatterRocks(hf, entry.site.id));
      return { info: entry.site, scene: gltf.scene, hf };
    })().catch(err => { terrains.delete(id); throw err; }));
    return terrains.get(id);
  }
  // The photo has 0.5 m pixels, too coarse at walking distance: a tiled grain (3 m tiles) multiplies it
  // up close and averages out with distance (mipmaps). Game art, not data.
  let grain = null;
  function addGroundDetail(material, sizeM) {
    if (!grain) {
      const N = 256, data = new Uint8Array(N * N * 4), rnd = (i, seed) => { const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453; return x - Math.floor(x); };
      const octave = (cells, seed) => (x, y) => { // tileable value noise
        const fx = x / N * cells, fy = y / N * cells, i = Math.floor(fx), j = Math.floor(fy), u = fx - i, v = fy - j;
        const at = (a, b) => rnd(((b % cells) * cells) + (a % cells), seed);
        return (at(i, j) * (1 - u) + at(i + 1, j) * u) * (1 - v) + (at(i, j + 1) * (1 - u) + at(i + 1, j + 1) * u) * v;
      };
      const layers = [[octave(6, 1), .4], [octave(24, 2), .35], [octave(96, 3), .25]];
      for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
        const g = Math.round(255 * layers.reduce((sum, [f, w]) => sum + f(x, y) * w, 0)), k = (y * N + x) * 4;
        data[k] = data[k + 1] = data[k + 2] = g; data[k + 3] = 255;
      }
      grain = new THREE.DataTexture(data, N, N);
      grain.wrapS = grain.wrapT = THREE.RepeatWrapping; grain.magFilter = THREE.LinearFilter; grain.minFilter = THREE.LinearMipmapLinearFilter;
      grain.generateMipmaps = true; grain.anisotropy = world.renderer.capabilities.getMaxAnisotropy(); grain.needsUpdate = true;
    }
    material.onBeforeCompile = shader => {
      shader.uniforms.grainMap = { value: grain }; shader.uniforms.grainRepeat = { value: sizeM / 3 };
      shader.fragmentShader = 'uniform sampler2D grainMap;\nuniform float grainRepeat;\n' + shader.fragmentShader.replace('#include <map_fragment>',
        '#include <map_fragment>\n  diffuseColor.rgb *= 0.55 + 0.9 * texture2D(grainMap, vMapUv * grainRepeat).r;');
    };
  }
  // Loose rocks (game art): same spots every time for a site, so the ground has scale when walking.
  function scatterRocks(hf, seedText) {
    let seed = [...seedText].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
    const rand = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    const COUNT = 900, rocks = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(1, 0), flat(0xffffff, .95), COUNT);
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), p = new THREE.Vector3(), sc = new THREE.Vector3(), c = new THREE.Color(), lim = hf.half - 6;
    for (let i = 0; i < COUNT; i++) {
      const size = rand() < .06 ? .5 + rand() * .7 : .06 + Math.pow(rand(), 2) * .35;
      p.set((rand() * 2 - 1) * lim, 0, (rand() * 2 - 1) * lim); p.y = hf.at(p.x, p.z) - size * .25;
      sc.set(size * (.8 + rand() * .5), size * (.45 + rand() * .3), size * (.8 + rand() * .5));
      rocks.setMatrixAt(i, m.compose(p, q.setFromEuler(e.set(rand() * .6, rand() * Math.PI * 2, rand() * .6)), sc));
      rocks.setColorAt(i, c.setRGB(.2 + rand() * .1, .1 + rand() * .05, .06 + rand() * .03));
    }
    rocks.castShadow = rocks.receiveShadow = true;
    return rocks;
  }
  // Ground height by bilinear lookup in the mesh grid: row-major from the north-west corner,
  // same layout as tools/terrain/lib/terrain-mesh.mjs (cheaper than a raycast on 129k triangles).
  function heightField(mesh) {
    const p = mesh.geometry.attributes.position, n = Math.round(Math.sqrt(p.count));
    const x0 = p.getX(0), z0 = p.getZ(0), step = p.getX(1) - x0, h = new Float32Array(n * n);
    for (let k = 0; k < n * n; k++) h[k] = p.getY(k);
    const at = (x, z) => {
      const fx = clamp((x - x0) / step, 0, n - 1.0001), fz = clamp((z - z0) / step, 0, n - 1.0001);
      const i = Math.floor(fx), j = Math.floor(fz), u = fx - i, v = fz - j, k = j * n + i;
      return (h[k] * (1 - u) + h[k + 1] * u) * (1 - v) + (h[k + n] * (1 - u) + h[k + n + 1] * u) * v;
    };
    const slope = (x, z) => Math.hypot(at(x + 1, z) - at(x - 1, z), at(x, z + 1) - at(x, z - 1)) / 2;
    return { at, slope, half: (n - 1) * step / 2 };
  }

  async function loadCrew(id) {
    if (world.avatars.has(id)) return world.avatars.get(id);
    const gltf = await loadGLTF(`characters/${id}.glb`), body = gltf.scene.clone(true); // pivot rig, no skinning
    const mixer = new THREE.AnimationMixer(body), clip = name => gltf.animations.find(a => a.name === name);
    const idle = mixer.clipAction(clip('idle_loop')), walk = mixer.clipAction(clip('walk_loop'));
    const wave = mixer.clipAction(clip('wave')), action = mixer.clipAction(clip('action_loop'));
    idle.play(); walk.play(); walk.setEffectiveWeight(0);
    wave.setLoop(THREE.LoopOnce, 1);
    mixer.addEventListener('finished', e => { if (e.action === wave && world.avatar?.id === id && s.emote?.kind === 'wave') endEmote(); });
    const head = body.getObjectByName('Head'), helmet = [];
    body.traverse(o => { if (o.isMesh) o.castShadow = true; });
    head.traverse(o => { if (o.isMesh) { o.userData.mat = o.material; helmet.push(o); } });
    body.updateMatrixWorld(true);
    const a = { id, body, mixer, idle, walk, wave, action, emoteAction: null, emoteW: 0, head, helmet, walkW: 0, eyeY: head.getWorldPosition(new THREE.Vector3()).y, pos: new THREE.Vector3(), bodyYaw: 0 };
    world.avatars.set(id, a); world.scene.add(body);
    return a;
  }
  // Every crew member stands on the surface; the player controls one (keys 1–4), the others wait where they were left.
  async function useCrew(id) {
    endEmote();
    const prev = world.avatar;
    s.crew = id; renderCrewBar();
    const a = await loadCrew(id);
    if (s.crew !== id) return;
    if (prev && prev !== a) { prev.pos.copy(s.pos); prev.bodyYaw = s.bodyYaw; }
    world.avatar = a;
    s.pos.copy(a.pos); s.bodyYaw = a.bodyYaw; s.yaw = a.bodyYaw - Math.PI; s.vy = 0; s.grounded = true;
    if (sim()) sim().surf.activeCrew = id;
    applyMode(); s.prompt = '';
  }
  const clampPitch = () => { s.pitch = s.mode === 'first' ? clamp(s.pitch, -1.45, 1.2) : clamp(s.pitch, -1, .45); };
  function applyMode() {
    for (const a of world.avatars.values()) for (const m of a.helmet) m.material = a === world.avatar && s.mode === 'first' ? hiddenMat : m.userData.mat;
    clampPitch();
  }
  function setMode(mode) { s.mode = mode; applyMode(); }

  function setTerrain(t) {
    const { info, hf } = t;
    if (world.terrain) world.scene.remove(world.terrain);
    world.terrain = t.scene; world.hf = hf; world.scene.add(t.scene);
    const az = info.sun.azimuthDeg * Math.PI / 180, el = info.sun.elevationDeg * Math.PI / 180; // sun of the photo (HiRISE label)
    world.sunDir.set(Math.sin(az) * Math.cos(el), Math.sin(el), -Math.cos(az) * Math.cos(el));
    world.skirt.position.y = info.elevation.minM - info.elevation.centerM - .4;
    world.skirt.material.color.setRGB(info.tint[0] * .2, info.tint[1] * .2, info.tint[2] * .2);
    const lat = info.center.lat, lon = info.center.lon;
    $s('surface-coords').textContent = `${Math.abs(lat).toFixed(2)}°${lat < 0 ? 'S' : 'N'} ${Math.abs(lon).toFixed(2)}°${lon < 0 ? 'W' : 'E'} · HiRISE terrain ${info.sizeM} m`;
  }

  function placeBlocks() {
    const { hf, scene } = world, tags = $s('surface-tags'), spots = [], lim = hf.half - 24;
    for (const b of world.blocks) scene.remove(b);
    tags.innerHTML = ''; world.blocks = []; world.colliders = [{ x: 0, z: 0, r: 2.9 }];
    for (const exp of tasks()) {
      let spot = null;
      for (let t = 0; t < 300 && !spot; t++) {
        const r = SPOT_MIN + Math.random() * (SPOT_MAX - SPOT_MIN), a = Math.random() * Math.PI * 2, x = Math.sin(a) * r, z = Math.cos(a) * r;
        const ok = Math.abs(x) < lim && Math.abs(z) < lim && hf.slope(x, z) < .2 && spots.every(p => Math.hypot(p.x - x, p.z - z) > SPOT_GAP);
        if (ok || t === 299) spot = { x, z };
      }
      spots.push(spot);
      const owner = ui.crew.find(c => c.id === exp.crew), block = makeBlock(exp, owner.color);
      block.position.set(spot.x, hf.at(spot.x, spot.z), spot.z);
      const tag = document.createElement('span');
      tag.className = 'surface-tag'; tag.style.setProperty('--crew', owner.color);
      tags.append(tag); block.userData.tag = tag;
      scene.add(block); world.blocks.push(block); world.colliders.push({ x: spot.x, z: spot.z, r: 1.6 });
    }
    $s('surface-goals').innerHTML = tasks().map(e => { const o = ui.crew.find(c => c.id === e.crew);
      return `<li data-goal="${e.id}" style="--crew:${o.color}"><span class="goal-chip"></span><span class="goal-name"><strong>${e.id} · ${e.title}</strong><small>${o.name}</small></span><span class="goal-dist"></span><span class="goal-arrow"></span></li>`; }).join('');
  }

  function renderCrewBar() {
    $s('surface-crew').innerHTML = ui.crew.map((c, i) => `<button type="button" data-crew="${c.id}" style="--crew:${c.color}" aria-pressed="${c.id === s.crew}">${c.name}<small>${touch ? '' : `key ${i + 1}`}</small></button>`).join('');
  }
  $s('surface-crew').addEventListener('click', e => { const b = e.target.closest('[data-crew]'); if (b && world) switchCrew(b.dataset.crew); });
  function switchCrew(id) { if (id === s.crew) return; useCrew(id).then(() => ui.toast(`You are now ${ui.crew.find(c => c.id === id).name}.`)); }

  function showStart(kicker, title, keys) {
    $s('surface-start-kicker').textContent = kicker; $s('surface-start-title').textContent = title;
    $s('surface-keys').innerHTML = keys; startEl.hidden = false;
  }
  function fail(message) { root.classList.add('surface-fail'); showStart('Surface', message, 'Use “Board & depart” to end the mission.'); }

  async function land({ site, crew }) {
    root.classList.remove('surface-fail');
    if (!world) world = initWorld();
    const info = ui.sites[site];
    $s('surface-title').textContent = info?.name ?? site;
    if (!world) return fail('The 3D surface needs WebGL.');
    s.ready = false; s.site = site;
    showStart('Touchdown', `Loading ${info.name}…`, '');
    try {
      const t = await fetchTerrain(site);
      if (s.site !== site) return;
      setTerrain(t);
      world.lander.position.set(0, t.hf.at(0, 0), 0);
      placeBlocks(); buildCompass();
      await Promise.all(ui.crew.map(c => loadCrew(c.id)));
      for (const [id, [x, z]] of Object.entries(CREW_START)) { const a = world.avatars.get(id); a.pos.set(x, t.hf.at(x, z), z); a.bodyYaw = 0; }
      world.avatar = null; s.pitch = -.1;
      await useCrew(crew);
      const first = world.blocks.find(b => b.userData.exp.crew === crew)?.position ?? world.blocks[0].position;
      s.yaw = Math.atan2(-(first.x - s.pos.x), -(first.z - s.pos.z)); s.bodyYaw = s.yaw + Math.PI;
      s.ready = true;
      startEl.hidden = true;
      ui.toast(touch ? 'Left side to walk · right side to look.' : 'WASD to walk · drag to look · E to interact.');
    } catch (err) {
      console.warn('Surface not shown:', err);
      fail(`Could not load the ${info?.name ?? site} terrain.`);
    }
  }
  window.addEventListener('astro:land', e => land(e.detail));

  // Emote wheel: the animations every avatar has (AGENTS.md §5.5). Hold Q, aim with the mouse and release;
  // or click/tap the 😀 button and pick. In first person the camera steps back while the emote plays.
  // Helena's action_loop (jet-pack hover) makes no sense on the Martian surface, so she has no action emote.
  const ACTION_EMOTE = { lucas: ['🔧', 'Repair'], oscar: ['📡', 'Transmit'], maya: ['🧪', 'Sample'] };
  const wheelEl = $s('emote-wheel');
  const emotes = () => [['wave', '👋', 'Wave'], ...(ACTION_EMOTE[s.crew] ? [['action', ...ACTION_EMOTE[s.crew]]] : []), ['walk', '🚶', 'Walk'], ['idle', '🧍', 'Idle']];
  const wheel = { open: false, hold: false, pick: -1, x: 0, y: 0 };
  function openWheel(hold) {
    if (!world?.avatar || dlg.open) return;
    const list = emotes();
    wheelEl.querySelectorAll('button').forEach(b => b.remove());
    list.forEach(([kind, icon, label], i) => wheelEl.insertAdjacentHTML('beforeend', `<button type="button" role="menuitem" data-emote="${kind}" style="--a:${i * 360 / list.length}deg">${icon}<small>${label}</small></button>`));
    Object.assign(wheel, { open: true, hold, pick: -1, x: 0, y: 0 });
    $s('emote-name').textContent = 'Emotes'; wheelEl.hidden = false; s.keys.clear();
  }
  function closeWheel(play) {
    if (!wheel.open) return;
    const kind = wheel.pick >= 0 ? emotes()[wheel.pick][0] : null;
    wheel.open = false; wheelEl.hidden = true;
    if (play && kind) playEmote(kind);
  }
  function aimWheel(dx, dy) { // mouse direction picks the nearest slot (slot 0 at the top, clockwise)
    wheel.x += dx; wheel.y += dy;
    if (Math.hypot(wheel.x, wheel.y) < 20) return;
    const n = emotes().length, ang = (Math.atan2(wheel.x, -wheel.y) + Math.PI * 2) % (Math.PI * 2);
    wheel.pick = Math.round(ang / (Math.PI * 2 / n)) % n;
    wheelEl.querySelectorAll('button').forEach((b, i) => b.classList.toggle('on', i === wheel.pick));
    $s('emote-name').textContent = emotes()[wheel.pick][2];
  }
  wheelEl.addEventListener('pointerover', e => { // without pointer lock, hovering a slot picks it (hold Q, hover, release)
    const b = e.target.closest('[data-emote]'), all = [...wheelEl.querySelectorAll('button')];
    if (!b) return;
    wheel.pick = all.indexOf(b); all.forEach((x, i) => x.classList.toggle('on', i === wheel.pick)); $s('emote-name').textContent = emotes()[wheel.pick][2];
  });
  wheelEl.addEventListener('click', e => { const b = e.target.closest('[data-emote]'); if (b) { wheel.pick = [...wheelEl.querySelectorAll('button')].indexOf(b); closeWheel(true); } });
  $s('surface-emote').addEventListener('click', () => (wheel.open ? closeWheel(false) : openWheel(false)));
  function playEmote(kind) {
    const a = world?.avatar;
    if (!a) return;
    endEmote();
    if (kind === 'idle') return;
    s.emote = { kind };
    if (kind === 'wave' || kind === 'action') { a.emoteAction = a[kind]; a.emoteAction.reset().play(); }
    if (s.mode === 'first') { s.emoteCam = true; setMode('third'); }
  }
  function endEmote() {
    if (!s.emote) return;
    s.emote = null;
    if (s.emoteCam) { s.emoteCam = false; setMode('first'); }
  }

  // Compass strip: ±90° around the view heading; cardinal points, 15° ticks, the lander and each experiment.
  const compassEl = $s('surface-compass-strip'), CARDINAL = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  let compassItems = [];
  function buildCompass() {
    compassEl.innerHTML = Array.from({ length: 24 }, (_, i) => i * 15).map(d => d % 45
      ? `<span class="cmp-tick" data-deg="${d}"></span>`
      : `<span class="cmp-card${d ? '' : ' north'}" data-deg="${d}">${CARDINAL[d / 45]}</span>`).join('')
      + '<span class="cmp-mark lander" title="Lander"></span>'
      + world.blocks.map(b => `<span class="cmp-mark" data-mark="${b.userData.exp.id}" style="--crew:${ui.crew.find(c => c.id === b.userData.exp.crew).color}"></span>`).join('');
    compassItems = [...compassEl.children].map(el => ({ el, deg: el.dataset.deg == null ? null : +el.dataset.deg,
      at: el.classList.contains('lander') ? new THREE.Vector3() : world.blocks.find(b => b.userData.exp.id === el.dataset.mark)?.position, id: el.dataset.mark }));
  }
  function updateCompass() {
    const heading = ((-s.yaw * 180 / Math.PI) % 360 + 360) % 360, half = compassEl.clientWidth / 2;
    for (const it of compassItems) {
      const bearing = it.deg ?? (Math.atan2(it.at.x - s.pos.x, -(it.at.z - s.pos.z)) * 180 / Math.PI + 360) % 360;
      const d = ((bearing - heading + 540) % 360) - 180;
      it.el.hidden = Math.abs(d) > 90;
      if (!it.el.hidden) it.el.style.left = `${half + d / 90 * (half - 8)}px`;
      if (it.id) it.el.classList.toggle('done', isDone(it.id));
    }
    $s('surface-compass-readout').textContent = `HDG ${String(Math.round(heading) % 360).padStart(3, '0')}°`;
  }

  // Input: keyboard + mouse (pointer lock, or drag when the lock is not available), touch stick + look.
  function bindInput(canvas) {
    const live = () => isActive('surface') && s.ready && !dlg.open;
    addEventListener('keydown', e => {
      if (!live()) return;
      if (e.code === 'KeyQ') { if (!e.repeat) openWheel(true); return; }
      if (wheel.open) { if (e.code === 'Escape') closeWheel(false); return; }
      s.keys.add(e.code);
      if (e.code === 'Space') { s.jump = true; e.preventDefault(); }
      if (e.code.startsWith('Arrow')) e.preventDefault();
      if (e.code === 'KeyE' || e.code === 'Enter') interact();
      if (e.code === 'KeyV') setMode(s.mode === 'first' ? 'third' : 'first');
      const n = /^Digit([1-4])$/.exec(e.code)?.[1];
      if (n) switchCrew(ui.crew[n - 1].id);
    });
    addEventListener('keyup', e => { s.keys.delete(e.code); if (e.code === 'KeyQ' && wheel.hold) closeWheel(true); });
    addEventListener('blur', () => s.keys.clear());
    const turn = (dx, dy, k) => { s.yaw -= dx * k; s.pitch -= dy * k; clampPitch(); };
    let settle = false; // the first move after locking can carry a large jump (Chrome)
    document.addEventListener('pointerlockchange', () => {
      settle = true;
    });
    addEventListener('mousemove', e => {
      if (document.pointerLockElement === canvas) {
        if (settle || Math.abs(e.movementX) > 200 || Math.abs(e.movementY) > 200) { settle = false; return; }
        if (wheel.open) return aimWheel(e.movementX, e.movementY);
        turn(e.movementX, e.movementY, .0022);
      }
      else if (s.drag) { turn(e.clientX - s.drag.x, e.clientY - s.drag.y, .004); s.drag = { x: e.clientX, y: e.clientY }; }
    });
    canvas.addEventListener('mousedown', e => { if (document.pointerLockElement !== canvas) s.drag = { x: e.clientX, y: e.clientY }; });
    addEventListener('mouseup', () => { s.drag = null; });
    const stickEl = $s('surface-stick');
    canvas.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'touch' || !live()) return;
      const r = viewEl.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      if (x < r.width * .45 && !s.stick) {
        s.stick = { id: e.pointerId, ox: x, oy: y, x: 0, y: 0 };
        stickEl.style.left = x + 'px'; stickEl.style.top = y + 'px'; stickEl.classList.add('on');
      } else if (!s.look) s.look = { id: e.pointerId, x: e.clientX, y: e.clientY };
      try { canvas.setPointerCapture(e.pointerId); } catch { /* pointer already gone */ }
    });
    canvas.addEventListener('pointermove', e => {
      if (s.stick?.id === e.pointerId) {
        const r = viewEl.getBoundingClientRect(), dx = e.clientX - r.left - s.stick.ox, dy = e.clientY - r.top - s.stick.oy, len = Math.hypot(dx, dy), k = Math.min(1, len / 50) / (len || 1);
        s.stick.x = dx * k; s.stick.y = -dy * k;
        stickEl.firstElementChild.style.translate = `${s.stick.x * 33}px ${-s.stick.y * 33}px`;
      } else if (s.look?.id === e.pointerId) { turn(e.clientX - s.look.x, e.clientY - s.look.y, .006); s.look.x = e.clientX; s.look.y = e.clientY; }
    });
    const release = e => {
      if (s.stick?.id === e.pointerId) { s.stick = null; stickEl.classList.remove('on'); stickEl.firstElementChild.style.translate = ''; }
      if (s.look?.id === e.pointerId) s.look = null;
    };
    canvas.addEventListener('pointerup', release); canvas.addEventListener('pointercancel', release);
    $s('surface-jump').addEventListener('pointerdown', () => { s.jump = true; });
  }
  $s('surface-camera').addEventListener('click', () => { if (world?.avatar) setMode(s.mode === 'first' ? 'third' : 'first'); });
  const release = () => { if (document.pointerLockElement) document.exitPointerLock(); s.keys.clear(); };
  $s('surface-board').addEventListener('click', () => { release(); sim()?.board(); });
  promptEl.addEventListener('click', interact);

  // Experiments: the owner runs the minigame next to the block.
  const COMPLETE_DELAY_MS = 2500; // game-balance: time to read the confirmation.
  let completionTimer = null;
  const confirmation = document.createElement('div');
  confirmation.className = 'minigame-complete';
  confirmation.setAttribute('role', 'status');
  confirmation.innerHTML = '<span class="minigame-check" aria-hidden="true"><svg viewBox="0 0 48 48"><path d="M8 24 L19 34 L40 12"/></svg></span><strong>Experiment complete</strong>';
  dlg.querySelector('.dialog-inner').append(confirmation);
  const nearBlock = () => world.blocks.find(b => Math.hypot(b.position.x - s.pos.x, b.position.z - s.pos.z) <= REACH) ?? null;
  const nearLander = () => Math.hypot(s.pos.x, s.pos.z) <= BOARD_REACH;
  function interact() {
    if (!world || !s.ready) return;
    const b = nearBlock();
    if (!b) { if (nearLander()) { release(); sim()?.board(); } return; }
    const e = b.userData.exp;
    if (isDone(e.id)) return;
    if (e.crew !== s.crew) return;
    const owner = ui.crew.find(c => c.id === e.crew);
    if (document.pointerLockElement) document.exitPointerLock();
    s.keys.clear();
    $s('minigame-kicker').textContent = `Experiment ${e.id} · ${owner.name}`;
    $s('minigame-title').textContent = e.title;
    $s('minigame-brief').textContent = e.id === 'H-S1' ? 'Plan a continuous reconnaissance route for the helicopter, visiting each waypoint and mapping every sector.' : e.desc;
    $s('minigame-summary').innerHTML = [['Minigame', e.minigame], ['Mechanic', e.mechanic], ['Based on', e.basis]].map(([k, v]) => `<div><span>${k}</span><strong>${v}</strong></div>`).join('');
    dlg.dataset.exp = e.id;
    const scout = e.id === 'H-S1';
    $s('scout-game').hidden = !scout;
    $s('minigame-summary').hidden = scout;
    $s('minigame-placeholder').hidden = scout;
    $s('minigame-done').hidden = scout;
    $s('minigame-done').textContent = 'Complete experiment';
    if (scout) window.ASTRO_SCOUT.reset();
    dlg.showModal();
  }
  $s('minigame-close').addEventListener('click', () => dlg.close());
  function finishExperiment(id) {
    if (!dlg.open || id !== dlg.dataset.exp || !id || isDone(id)) return;
    sim()?.completeSurfaceTask(id); s.prompt = '';
    const b = world.blocks.find(x => x.userData.exp.id === id);
    if (!isDone(id)) return;
    if (b) { b.userData.beam.visible = false; b.userData.gem.material.color.set(0x7edac2); b.userData.tag.classList.add('done'); }
    dlg.classList.add('is-complete');
    completionTimer = setTimeout(() => { if (dlg.open) dlg.close(); }, COMPLETE_DELAY_MS);
  }
  $s('minigame-done').addEventListener('click', () => finishExperiment(dlg.dataset.exp));
  dlg.addEventListener('astro:minigame-completed', event => finishExperiment(event.detail.id));
  dlg.addEventListener('close', () => { clearTimeout(completionTimer); completionTimer = null; dlg.classList.remove('is-complete'); });
  dlg.addEventListener('click', event => {
    if (event.target !== dlg) return;
    const bounds = dlg.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dlg.close();
  });

  const fwd = new THREE.Vector3(), eye = new THREE.Vector3(), look = new THREE.Vector3(), tmp = new THREE.Vector3();
  function step(dt) {
    const k = s.keys, a = world.avatar, hf = world.hf;
    let ix = (k.has('KeyD') || k.has('ArrowRight') ? 1 : 0) - (k.has('KeyA') || k.has('ArrowLeft') ? 1 : 0);
    let iy = (k.has('KeyW') || k.has('ArrowUp') ? 1 : 0) - (k.has('KeyS') || k.has('ArrowDown') ? 1 : 0);
    if (s.stick) { ix += s.stick.x; iy += s.stick.y; }
    const len = Math.min(1, Math.hypot(ix, iy)), run = k.has('ShiftLeft') || k.has('ShiftRight') || (s.stick && len > .92);
    const speed = len > .08 ? len * (run ? RUN : WALK) : 0, sin = Math.sin(s.yaw), cos = Math.cos(s.yaw);
    let mx = 0, mz = 0;
    if (speed) { const n = Math.hypot(ix, iy); mx = (-sin * iy + cos * ix) / n * speed; mz = (-cos * iy - sin * ix) / n * speed; }
    const lim = hf.half - 8;
    s.pos.x = clamp(s.pos.x + mx * dt, -lim, lim); s.pos.z = clamp(s.pos.z + mz * dt, -lim, lim);
    const mates = [...world.avatars.values()].filter(o => o !== a).map(o => ({ x: o.pos.x, z: o.pos.z, r: .7 }));
    for (const c of [...world.colliders, ...mates]) {
      const dx = s.pos.x - c.x, dz = s.pos.z - c.z, d = Math.hypot(dx, dz);
      if (d < c.r && d > 1e-4) { s.pos.x = c.x + dx / d * c.r; s.pos.z = c.z + dz / d * c.r; }
    }
    s.speed = speed;
    const ground = hf.at(s.pos.x, s.pos.z);
    if (s.grounded && s.jump) { s.vy = JUMP; s.grounded = false; }
    s.jump = false;
    if (s.grounded) s.pos.y = ground;
    else { s.vy -= MARS_G * dt; s.pos.y += s.vy * dt; if (s.pos.y <= ground) { s.pos.y = ground; s.vy = 0; s.grounded = true; } }
    // First person: the body faces the view. Chase camera: it turns toward where it walks.
    const target = s.mode === 'first' ? s.yaw + Math.PI : speed ? Math.atan2(mx, mz) : s.bodyYaw;
    const d = Math.atan2(Math.sin(target - s.bodyYaw), Math.cos(target - s.bodyYaw));
    s.bodyYaw += s.mode === 'first' ? d : d * Math.min(1, dt * 10);
    a.body.position.copy(s.pos); a.body.rotation.y = s.bodyYaw;
    if (s.emote && (speed || !s.grounded)) endEmote();
    const marching = s.emote?.kind === 'walk', walking = marching || (s.grounded && speed > 0) ? 1 : 0;
    a.walkW += (walking - a.walkW) * Math.min(1, dt * 8);
    a.emoteW += ((s.emote && a.emoteAction ? 1 : 0) - a.emoteW) * Math.min(1, dt * 10);
    if (!s.emote && a.emoteAction && a.emoteW < .02) { a.emoteAction.stop(); a.emoteAction = null; a.emoteW = 0; }
    a.walk.setEffectiveWeight(a.walkW * (1 - a.emoteW)); a.idle.setEffectiveWeight((1 - a.walkW) * (1 - a.emoteW));
    a.emoteAction?.setEffectiveWeight(a.emoteW);
    a.walk.timeScale = marching ? 1 : clamp(speed / STRIDE, .6, 2.6);
    a.mixer.update(reduce && !speed && !s.emote ? 0 : dt);
    for (const o of world.avatars.values()) { // teammates idle where they were left
      if (o === a) continue;
      o.body.position.copy(o.pos); o.body.rotation.y = o.bodyYaw;
      o.walkW += (0 - o.walkW) * Math.min(1, dt * 8); o.walk.setEffectiveWeight(o.walkW); o.idle.setEffectiveWeight(1 - o.walkW);
      o.mixer.update(reduce ? 0 : dt);
    }
  }
  function placeCamera() {
    const { camera, avatar: a } = world;
    fwd.set(-Math.sin(s.yaw), 0, -Math.cos(s.yaw));
    if (s.mode === 'first') {
      a.body.updateMatrixWorld(true);
      if (reduce) eye.set(s.pos.x, s.pos.y + a.eyeY, s.pos.z); else a.head.getWorldPosition(eye);
      // Eyes in front of the suit; further forward when looking down, so the chest, legs and feet come into view.
      camera.position.copy(eye).addScaledVector(fwd, .3 + .22 * Math.max(0, -Math.sin(s.pitch))); camera.position.y += .14;
      camera.rotation.set(s.pitch, s.yaw, 0);
    } else {
      look.copy(s.pos); look.y += 1.45;
      const cp = Math.cos(s.pitch);
      camera.position.copy(look).add(tmp.set(Math.sin(s.yaw) * cp, -Math.sin(s.pitch), Math.cos(s.yaw) * cp).multiplyScalar(4.4));
      camera.position.y = Math.max(camera.position.y, world.hf.at(camera.position.x, camera.position.z) + .4);
      camera.lookAt(look);
    }
  }
  function updateHud() {
    for (const b of world.blocks) {
      const e = b.userData.exp, li = document.querySelector(`[data-goal="${e.id}"]`), dx = b.position.x - s.pos.x, dz = b.position.z - s.pos.z, dist = Math.hypot(dx, dz);
      li.classList.toggle('done', isDone(e.id)); li.classList.toggle('here', dist <= REACH);
      li.querySelector('.goal-dist').textContent = isDone(e.id) ? 'DONE' : `${Math.round(dist)} m`;
      li.querySelector('.goal-arrow').style.rotate = `${Math.atan2(dx, -dz) + s.yaw}rad`; // bearing from north, relative to the view
    }
    const surf = sim()?.surf;
    $s('surface-count').textContent = `${surf?.completed.size ?? 0}/${tasks().length} DONE`;
    const b = nearBlock(), e = b?.userData.exp, owner = e && ui.crew.find(c => c.id === e.crew);
    const state = e ? (isDone(e.id) ? 'done' : e.crew === s.crew ? 'run' : 'locked') : nearLander() ? 'board' : '';
    const key = state + (e?.id ?? '') + s.crew;
    if (key === s.prompt) return;
    s.prompt = key; promptEl.hidden = !state; promptEl.disabled = state === 'locked' || state === 'done';
    if (!state) return;
    promptEl.className = 'surface-prompt' + (state === 'run' || state === 'board' ? '' : ' ' + state);
    promptEl.textContent = state === 'board' ? `${touch ? 'Tap' : 'E'} · Board the ascent vehicle · ${surf?.completed.size ?? 0}/${tasks().length} done`
      : state === 'done' ? `${e.id} · ${e.title} · done`
      : state === 'run' ? `${touch ? 'Tap' : 'E'} · Run ${e.id} · ${e.title}`
      : `${e.id} · ${owner.name} only`;
  }
  const v = new THREE.Vector3();
  function placeTags(now) {
    const { camera } = world;
    for (const b of world.blocks) {
      const { tag, gem, beam, exp } = b.userData, dist = Math.hypot(b.position.x - s.pos.x, b.position.z - s.pos.z);
      if (!reduce) { gem.rotation.y = now / 700; gem.position.y = 2.2 + Math.sin(now / 500 + b.position.x) * .12; beam.material.opacity = .22 + .1 * Math.sin(now / 400); }
      v.copy(b.position); v.y += 2.8; v.project(camera);
      const show = v.z < 1 && dist < 260;
      tag.hidden = !show;
      if (!show) continue;
      tag.textContent = isDone(exp.id) ? `${exp.id} ✓` : `${exp.id} · ${Math.round(dist)} m`;
      tag.style.transform = `translate(${(v.x + 1) / 2 * world.width}px, ${(1 - v.y) / 2 * world.height}px)`;
    }
  }

  let last = performance.now(), hudClock = 0;
  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min(.1, (now - last) / 1000); last = now;
    if (!world || !s.ready || !world.avatar || !isActive('surface') || !world.width) return;
    if (!dlg.open) step(dt);
    placeCamera();
    world.sky.position.copy(world.camera.position);
    world.sun.target.position.copy(s.pos); world.sun.position.copy(s.pos).addScaledVector(world.sunDir, 90);
    placeTags(now); updateCompass();
    if ((hudClock += dt) > .12) { hudClock = 0; updateHud(); }
    world.renderer.render(world.scene, world.camera);
  }
  requestAnimationFrame(frame);
  // Test and debug hook (Playwright, console): state, and a teleport next to a block.
  window.ASTRO_SURFACE = { state: s, world: () => world, emote: kind => playEmote(kind), wheel: open => (open ? openWheel(false) : closeWheel(false)),
    running: () => !!(s.ready && startEl.hidden && !dlg.open),
    distanceToLander(id) { const a = world?.avatars.get(id); if (!a) return 0; const p = a === world.avatar ? s.pos : a.pos; return Math.hypot(p.x, p.z); },
    goTo(id) { const b = world?.blocks.find(x => x.userData.exp.id === id); if (b) { s.pos.x = b.position.x + 2.2; s.pos.z = b.position.z + 1.2; s.yaw = Math.atan2(-(b.position.x - s.pos.x), -(b.position.z - s.pos.z)); s.grounded = false; } } };
  // index.html#surface or #surface-gale opens the surface directly (quick testing).
  const direct = /^#surface(?:-(\w+))?$/.exec(location.hash);
  if (direct) { if (ui.sites[direct[1]]) ui.state.site = direct[1]; ui.land(); }
})();

})().catch(error => console.warn('views 3D unavailable:', error));
