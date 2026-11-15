(async () => {
// Launch pad: the rocket the crew designed stands on the pad while the camera circles it and the countdown
// runs. At zero the engines light, the stack starts to climb and the camera flies up to the pilot's windows
// (the closed cabin faces +Z); the screen fades and the cockpit, in the pilot's view, takes over.
// window.ASTRO_LAUNCHPAD() shows this screen and resolves when the cockpit should start.
const THREE = await import('three');
const screen = document.getElementById('launchpad'), host = document.getElementById('launchpad-view');
const $id = id => document.getElementById(id);
const ui = window.ASTRO, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
// game: countdown length, how long the engines burn on screen before the camera moves, the fly-in time.
const COUNT = 10, IGNITION_HOLD = 1.6, FLY_IN = 2.2;
const STATUS = [[10, 'Final checks'], [7, 'Go for launch'], [5, 'Tower arm retracting'], [2, 'Engines armed'], [0, 'Ignition · liftoff']];

let renderer = null;
try { renderer = new THREE.WebGLRenderer({ antialias: true }); } catch { renderer = null; }
const flat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: .85, flatShading: true, ...extra });
let view = null;

// Stylized Sorocaba technology park, reconstructed from the supplied photographs.
// Dimensions and placement are game-scale approximations, not a surveyed site plan.
function addTechnologyPark(scene) {
  const park = new THREE.Group(); scene.add(park);
  const concrete = flat(0xbcb9ae), seam = flat(0x8b8982), glass = flat(0x26665d, { metalness: .12, roughness: .35 });
  const pavement = flat(0xafa99d), road = flat(0x777a76), trunk = flat(0x74644b);
  const greens = [flat(0x466f38), flat(0x5c833e), flat(0x78954b), flat(0x345d38)];
  const white = flat(0xe3e8e5), greyCloud = flat(0xc5d0d3);
  const box = (parent, w, h, d, mat, x, y, z, ry = 0) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    mesh.position.set(x, y, z); mesh.rotation.y = ry; parent.add(mesh); return mesh;
  };

  // The photographed building is a broad, curved concrete facade over a band of green glazing.
  // Short tangent panels make the horseshoe recognisable while keeping a faceted low-poly silhouette.
  const building = new THREE.Group(); building.position.set(0, 0, -55); park.add(building);
  const radius = 28, segments = 14, start = -1.12, span = 2.24;
  for (let i = 0; i < segments; i++) {
    const a = start + (i + .5) * span / segments, width = 2 * radius * Math.tan(span / segments / 2) + .03;
    const x = Math.sin(a) * radius, z = Math.cos(a) * radius - radius;
    box(building, width, 2.7, .35, glass, x, 1.55, z, a);
    box(building, width, 5.1, .7, concrete, x, 5.45, z, a);
    for (const y of [3.02, 5.25, 7.72]) box(building, width, .045, .74, seam, x, y, z, a);
    box(building, .14, 2.7, .46, concrete, x - Math.cos(a) * width * .48, 1.55, z + Math.sin(a) * width * .48, a);
  }
  // Recessed wings and entrance beyond the curved facade, as seen in the oblique photographs.
  box(building, 19, 7.7, 12, concrete, -19, 3.85, -9, -.17);
  box(building, 19, 7.7, 12, concrete, 19, 3.85, -9, .17);
  box(building, 14, 6.4, 10, concrete, 0, 3.2, -14);
  box(building, 11, 3, .2, glass, 0, 2, -8.9);
  box(building, 13, .25, 3, concrete, 0, 3.6, -7.8);

  // Concrete paths, perimeter road and lights, with the launch pad kept clear.
  box(park, 76, .06, 7, pavement, 0, .04, -27);
  box(park, 5, .07, 21, pavement, 0, .05, -17);
  box(park, 180, .05, 5, road, 0, .035, -96);
  box(park, 140, .05, 3, pavement, 0, .04, 42);
  function lamp(x, z) {
    const g = new THREE.Group(); g.position.set(x, 0, z); park.add(g);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(.09, .14, 9, 6), seam); pole.position.y = 4.5; g.add(pole);
    for (const s of [-1, 1]) box(g, 1.4, .1, .16, seam, s * .62, 8.9, 0, 0);
    for (const s of [-1, 1]) box(g, .55, .1, .27, white, s * 1.15, 8.83, 0);
  }
  for (const x of [-60, -40, -20, 20, 40, 60]) { lamp(x, -35); lamp(x, 40); }

  function palm(x, z, scale, tall = false) {
    const g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(scale); park.add(g);
    const h = tall ? 3.3 : 1.05;
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(.10, .2, h, 6), trunk); stem.position.y = h / 2; g.add(stem);
    for (let i = 0; i < 8; i++) {
      const leaf = new THREE.Mesh(new THREE.ConeGeometry(.32, 2.2, 4), greens[i % greens.length]);
      const a = i * Math.PI / 4; leaf.position.set(Math.sin(a) * .7, h + .25, Math.cos(a) * .7);
      leaf.rotation.set(Math.cos(a) * .95, 0, -Math.sin(a) * .95); g.add(leaf);
    }
  }
  [[-21,-25,1],[-13,-24,.8],[14,-24,1],[25,-23,.85],[-26,15,1.1],[24,19,1],[-42,0,.8],[42,-2,1]].forEach(([x,z,s]) => palm(x,z,s));
  [[-60,-48],[60,-48],[-50,28],[52,30],[-35,50],[35,52]].forEach(([x,z]) => palm(x,z,1.15,true));
  // Distant treeline provides the wooded horizon seen in the panorama.
  const treeGeo = new THREE.IcosahedronGeometry(1, 0);
  for (let i = 0; i < 64; i++) {
    const a = i / 64 * Math.PI * 2, r = 125 + (i % 5) * 4, h = 4 + (i % 4);
    const tree = new THREE.Mesh(treeGeo, greens[i % greens.length]);
    tree.position.set(Math.sin(a) * r, h * .65, Math.cos(a) * r); tree.scale.set(3.2, h, 3.2); park.add(tree);
  }
  // Cumulus: clusters of flat-shaded polyhedra rather than photo textures.
  const cloudGeo = new THREE.IcosahedronGeometry(1, 1);
  for (let i = 0; i < 18; i++) {
    const a = i * 2.4, r = 100 + (i % 4) * 24, cloud = new THREE.Group();
    cloud.position.set(Math.sin(a) * r, 55 + (i % 5) * 8, Math.cos(a) * r); park.add(cloud);
    for (let j = 0; j < 5; j++) {
      const puff = new THREE.Mesh(cloudGeo, j === 0 ? greyCloud : white);
      puff.position.set((j - 2) * 5, (j % 3) * 1.6, (j % 2) * 2); puff.scale.set(6, 3.2 + (j % 2), 3.8); cloud.add(puff);
    }
  }
}

function initScene() {
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  host.prepend(renderer.domElement);
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(45, 1, .1, 2000);
  // Faceted daytime sky inspired by the supplied park photographs.
  const sky = new THREE.IcosahedronGeometry(900, 2), sp = sky.attributes.position, c = [];
  const low = new THREE.Color(0xc2d8e2), high = new THREE.Color(0x3976b6);
  for (let k = 0; k < sp.count; k++) { const col = low.clone().lerp(high, Math.pow(Math.max(0, sp.getY(k) / 900), .45)); c.push(col.r, col.g, col.b); }
  sky.setAttribute('color', new THREE.Float32BufferAttribute(c, 3));
  scene.add(new THREE.Mesh(sky, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false })));
  scene.fog = new THREE.Fog(0xb9d0d8, 160, 520);
  scene.add(new THREE.HemisphereLight(0xe8f5ff, 0x536b44, 1.3));
  const sun = new THREE.DirectionalLight(0xfff4df, 2.2); sun.position.set(-40, 48, 30); scene.add(sun);
  const glow = new THREE.PointLight(0xf59e0b, 0, 40, 1.6); scene.add(glow);
  // Ground, pad, flame trench and a crimson service tower with a swing arm to the cabin.
  scene.add(new THREE.Mesh(new THREE.CircleGeometry(600, 9).rotateX(-Math.PI / 2), flat(0x668e49)));
  addTechnologyPark(scene);
  const pad = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.9, .6, 6), flat(0x8f86ab)); pad.position.y = .3; scene.add(pad);
  const trench = new THREE.Mesh(new THREE.BoxGeometry(1.1, .05, 4.6), flat(0x1d1128)); trench.position.y = .61; scene.add(trench);
  const tower = new THREE.Group(), red = flat(0x8f241e), arm = new THREE.Group();
  scene.add(tower); tower.add(arm);
  const rocket = new THREE.Group(); scene.add(rocket);
  // Exhaust: three nested 7-sided cones (orange, amber, cream), additive, as on the menu's Saturn V.
  const plume = new THREE.Group();
  [[.62, 3.6, 0xe04f26, .55], [.42, 2.6, 0xf59e0b, .7], [.2, 1.5, 0xfce8a6, .95]].forEach(([r, h, color, opacity]) => {
    const cone = new THREE.Mesh(new THREE.ConeGeometry(r, h, 7, 1, true), new THREE.MeshBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
    cone.rotation.x = Math.PI; cone.position.y = -h / 2; plume.add(cone);
  });
  // Smoke: faceted puffs that billow out of the trench after ignition.
  const smoke = Array.from({ length: 16 }, (_, i) => {
    const m = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 0), new THREE.MeshStandardMaterial({ color: 0xd8c8c0, roughness: 1, flatShading: true, transparent: true, opacity: 0 }));
    m.userData.dir = new THREE.Vector3(Math.cos(i * 2.4), 0, Math.sin(i * 2.4)).multiplyScalar(i % 2 ? 1 : -1); scene.add(m); return m;
  });
  const v = { scene, camera, glow, tower, red, arm, rocket, plume, smoke, height: 6, width: 0, h: 0 };
  new ResizeObserver(() => {
    v.width = host.clientWidth; v.h = host.clientHeight;
    if (!v.width || !v.h) return;
    renderer.setSize(v.width, v.h, false); camera.aspect = v.width / v.h; camera.updateProjectionMatrix();
  }).observe(host);
  return v;
}

/** Rebuilds the tower for the rocket's height. */
function buildTower(v) {
  v.tower.clear(); v.arm.clear(); v.tower.add(v.arm);
  const H = v.height + 1.2, x = 3.1;
  for (const [dx, dz] of [[-.35, -.35], [.35, -.35], [-.35, .35], [.35, .35]]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(.12, H, .12), v.red); post.position.set(x + dx, .6 + H / 2, dz); v.tower.add(post);
  }
  for (let y = 1.4; y < H; y += 1.1) {
    const beam = new THREE.Mesh(new THREE.BoxGeometry(.82, .08, .82), v.red); beam.position.set(x, .6 + y, 0); v.tower.add(beam);
  }
  const cabinY = .6 + v.cabinMid;
  const armMesh = new THREE.Mesh(new THREE.BoxGeometry(1.6, .14, .3), v.red); armMesh.position.set(-.8, 0, 0); v.arm.add(armMesh);
  v.arm.position.set(x - .35, cabinY, 0); v.arm.rotation.y = 0;
}

function countdownText(t) {
  const left = Math.max(0, Math.ceil(COUNT - t));
  $id('launchpad-count').textContent = t < COUNT ? `T−${String(left).padStart(2, '0')}` : 'LIFTOFF';
  $id('launchpad-status').textContent = ([...STATUS].reverse().find(([s]) => s >= left) ?? STATUS[0])[1]; // the latest step reached
}

window.ASTRO_LAUNCHPAD = () => new Promise(async resolve => {
  ui.show('launchpad');
  const site = ui.sites?.[ui.state.site];
  $id('launchpad-title').textContent = `Mission: ${site?.mission ?? 'Mars'}`;
  $id('launchpad-fade').classList.remove('on'); $id('launchpad-count').style.opacity = '';
  let done = false;
  const finish = () => { if (done) return; done = true; $id('launchpad-fade').classList.add('on'); setTimeout(resolve, reduce ? 0 : 350); };
  $id('launchpad-skip').onclick = finish;
  const onKey = e => { if (e.code === 'Escape') finish(); };
  addEventListener('keydown', onKey, { once: true });

  if (!renderer || !window.ASTRO_BUILD_ROCKET) { // no 3D: the countdown alone
    const t0 = performance.now();
    const tick = () => { if (done) return; const t = (performance.now() - t0) / 1000; countdownText(t); if (t >= COUNT) finish(); else requestAnimationFrame(tick); };
    tick(); return;
  }
  view ||= initScene();
  const v = view, { camera } = v;
  // The designed rocket, stacked without gaps (views.js), standing on the pad.
  const stackGroup = await window.ASTRO_BUILD_ROCKET();
  // The engines hang below the booster's origin: lift the stack so the nozzles clear the pad top.
  const base = .62 - stackGroup.userData.minY + .08;
  v.rocket.clear(); v.rocket.add(stackGroup); v.rocket.position.set(0, base, 0);
  v.height = stackGroup.userData.height; v.cabinMid = base - .62 + stackGroup.userData.cabinMid;
  buildTower(v);
  v.plume.scale.setScalar(0.001); v.rocket.add(v.plume); v.plume.position.y = stackGroup.userData.minY;
  v.smoke.forEach(m => { m.material.opacity = 0; m.scale.setScalar(.01); });
  const mid = new THREE.Vector3(), cabin = new THREE.Vector3(), look = new THREE.Vector3(), into = new THREE.Vector3();
  const R = v.height * 1.15 + 4;
  let t = reduce ? COUNT : 0, last = performance.now(), flyFrom = null, lookFrom = null;
  function frame(now) {
    if (done || !screen.classList.contains('active')) return;
    requestAnimationFrame(frame);
    const dt = Math.min(.1, Math.max(0, (now - last) / 1000)); last = now; t += dt; // rAF time can precede performance.now()
    if (window.ASTRO_LAUNCH_PAUSE) t -= dt; // tests: hold the moment
    if (window.ASTRO_LAUNCH_JUMP != null) { t = window.ASTRO_LAUNCH_JUMP; window.ASTRO_LAUNCH_JUMP = null; } // tests: jump in time
    countdownText(t);
    const lit = Math.max(0, t - COUNT), climb = Math.max(0, lit - .8);
    v.rocket.position.y = base + climb * climb * .9; // slow at first, then faster
    // Tower arm swings away at T−5.
    v.arm.rotation.y = -Math.min(1, Math.max(0, (t - (COUNT - 5)) / 2)) * 1.4;
    // Ignition: plume, glow, smoke.
    const flame = Math.min(1, lit / .6);
    v.plume.scale.set(flame, flame * (1 + .08 * Math.sin(now * .05)), flame);
    v.glow.position.set(0, v.rocket.position.y + stackGroup.userData.minY - .5, 0); v.glow.intensity = flame * (28 + 6 * Math.sin(now * .04));
    v.smoke.forEach((m, i) => {
      const age = Math.max(0, lit - i * .05);
      m.position.copy(m.userData.dir).multiplyScalar(1 + age * 2.4); m.position.y = .8 + age * .4 + (i % 3) * .3;
      m.scale.setScalar(Math.min(2.2, .2 + age * .9)); m.material.opacity = Math.min(.75, age * .9) * Math.max(0, 1 - age / 6);
    });
    stackGroup.userData.cabin.getWorldPosition(cabin);
    mid.set(0, v.rocket.position.y + v.height * .45, 0);
    if (t < COUNT + IGNITION_HOLD) {
      // Orbit around the rocket; a little shake once the engines are lit.
      // At ignition the camera drops and looks at the base, so the flame and the smoke are in frame.
      const a = .6 + t * .32, shake = flame * .06, low = Math.min(1, lit / .8), baseY = v.rocket.position.y + stackGroup.userData.minY + 1.2;
      look.set(0, mid.y + (baseY - mid.y) * low * .85, 0);
      camera.position.set(Math.sin(a) * R + (Math.random() - .5) * shake, look.y + Math.sin(t * .5) * 1.2 * (1 - low) + 1.5 * low + (Math.random() - .5) * shake, Math.cos(a) * R);
      camera.lookAt(look);
    } else {
      // Fly up to the pilot's windows (+Z), following the climbing rocket; the fade covers the way in.
      if (!flyFrom) { flyFrom = camera.position.clone(); lookFrom = look.clone(); }
      const k = Math.min(1, (t - COUNT - IGNITION_HOLD) / FLY_IN), e = k * k * (3 - 2 * k);
      $id('launchpad-count').style.opacity = String(1 - e);
      into.copy(cabin).add({ x: 0, y: .02, z: .14 });
      // Swing round the rocket to its front (+Z) and up to the windows by halfway, then close in.
      const half = Math.min(1, k * 2), turn = half * half * (3 - 2 * half);
      const a = Math.atan2(flyFrom.x, flyFrom.z) * (1 - turn), r0 = Math.hypot(flyFrom.x, flyFrom.z), rr = r0 + (into.z - r0) * e;
      camera.position.set(Math.sin(a) * rr, flyFrom.y + (into.y - flyFrom.y) * turn, Math.cos(a) * rr); // level with the windows by halfway
      look.copy(lookFrom).lerp(cabin.clone().add({ x: 0, y: 0, z: -1 }), turn); // the gaze is on the windows by then
      camera.lookAt(look);
      if (k >= .9) $id('launchpad-fade').classList.add('on');
      if (k >= 1) finish();
    }
    renderer.render(v.scene, camera);
  }
  requestAnimationFrame(frame);
});
})().catch(error => console.warn('launch pad unavailable:', error));
