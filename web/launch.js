(async () => {
// Launch pad: the rocket the crew designed stands on the pad while the camera circles it and the countdown
// runs. At zero the engines light, the stack starts to climb and the camera flies into the cabin (the cutaway
// faces +Z); then the cockpit, in the pilot's view, takes over.
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

function initScene() {
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  host.prepend(renderer.domElement);
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(45, 1, .1, 2000);
  // Dawn sky (palette): coral at the horizon, indigo overhead; faceted dome.
  const sky = new THREE.IcosahedronGeometry(900, 2), sp = sky.attributes.position, c = [];
  const low = new THREE.Color(0xee7b57), high = new THREE.Color(0x281147);
  for (let k = 0; k < sp.count; k++) { const col = low.clone().lerp(high, Math.pow(Math.max(0, sp.getY(k) / 900), .45)); c.push(col.r, col.g, col.b); }
  sky.setAttribute('color', new THREE.Float32BufferAttribute(c, 3));
  scene.add(new THREE.Mesh(sky, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false })));
  scene.fog = new THREE.Fog(0xb8664f, 60, 420);
  scene.add(new THREE.HemisphereLight(0xfce8a6, 0x281147, 1.3));
  const sun = new THREE.DirectionalLight(0xffd2a6, 2.2); sun.position.set(-40, 18, 30); scene.add(sun);
  const glow = new THREE.PointLight(0xf59e0b, 0, 40, 1.6); scene.add(glow);
  // Ground, pad, flame trench and a crimson service tower with a swing arm to the cabin.
  scene.add(new THREE.Mesh(new THREE.CircleGeometry(600, 9).rotateX(-Math.PI / 2), flat(0x3a2f52)));
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
  const mid = new THREE.Vector3(), cabin = new THREE.Vector3(), from = new THREE.Vector3(), look = new THREE.Vector3(), into = new THREE.Vector3();
  const R = v.height * 1.15 + 4;
  let t = reduce ? COUNT : 0, last = performance.now(), flyFrom = null;
  function frame(now) {
    if (done || !screen.classList.contains('active')) return;
    requestAnimationFrame(frame);
    const dt = Math.min(.1, Math.max(0, (now - last) / 1000)); last = now; t += dt; // rAF time can precede performance.now()
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
      // Fly into the cabin through the cutaway (+Z), following the climbing rocket.
      if (!flyFrom) flyFrom = camera.position.clone();
      const k = Math.min(1, (t - COUNT - IGNITION_HOLD) / FLY_IN), e = k * k * (3 - 2 * k);
      $id('launchpad-count').style.opacity = String(1 - e);
      into.copy(cabin).add({ x: 0, y: .15, z: .25 });
      from.copy(flyFrom).lerp(into, e);
      camera.position.copy(from);
      look.lerp(cabin.clone().add({ x: 0, y: .05, z: -1 }), e * .35); // from where the camera was looking
      camera.lookAt(look);
      if (k >= 1) finish();
    }
    renderer.render(v.scene, camera);
  }
  requestAnimationFrame(frame);
});
})().catch(error => console.warn('launch pad unavailable:', error));
