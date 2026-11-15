(async () => {
const THREE = await import('three');
const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
const { RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js');

(() => {
  const loader = new GLTFLoader();
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const CREW_IDS = ['helena', 'lucas', 'oscar', 'maya'];
  const CREW_COLORS = {
    helena: '#ff7847',
    lucas: '#52b7ff',
    oscar: '#f6c445',
    maya: '#4be08a',
  };
  const DEFAULT_MARS_RAMP = ['#5d291a', '#7c3621', '#9c4328', '#bb5330', '#d26a3b'];

  const bufCache = new Map();
  async function loadGLBBytes(relPath) {
    if (bufCache.has(relPath)) return bufCache.get(relPath);
    const b64 = window.ASTRO_GLB?.[relPath];
    let buf;
    if (b64) {
      const bin = atob(b64);
      const u8 = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
      buf = u8.buffer;
    } else {
      const res = await fetch(`assets/models/${relPath}`);
      if (!res.ok) throw new Error(`Failed to fetch ${relPath}: ${res.status}`);
      buf = await res.arrayBuffer();
    }
    bufCache.set(relPath, buf);
    return buf;
  }

  async function parseFreshGLB(relPath) {
    const buf = await loadGLBBytes(relPath);
    return loader.parseAsync(buf.slice(0), '');
  }

  function makeViewport(container, { fov = 50, clearColor = 0x050912, clearAlpha = 1 } = {}) {
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: clearAlpha < 1, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const w = Math.max(container.clientWidth, 320);
    const h = Math.max(container.clientHeight, 240);
    renderer.setSize(w, h, false);
    renderer.setClearColor(clearColor, clearAlpha);
    renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;z-index:0;';
    container.prepend(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.55;
    pmrem.dispose();

    const camera = new THREE.PerspectiveCamera(fov, w / h, 0.05, 300);

    const resize = () => {
      const cw = container.clientWidth;
      const ch = container.clientHeight;
      if (cw > 0 && ch > 0) {
        renderer.setSize(cw, ch, false);
        camera.aspect = cw / ch;
        camera.updateProjectionMatrix();
      }
    };
    if (window.ResizeObserver) {
      new ResizeObserver(resize).observe(container);
    } else {
      window.addEventListener('resize', resize);
    }
    container.classList.add('is-3d');
    return { renderer, scene, camera, resize };
  }

  function addStandardStudioLights(scene, { warmRim = 0xff7038 } = {}) {
    scene.add(new THREE.AmbientLight(0xd9e3f5, 0.42));
    const key = new THREE.DirectionalLight(0xfff4e2, 2.2);
    key.position.set(4, 7, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(warmRim, 0.95);
    rim.position.set(-5, 3, -6);
    scene.add(rim);
  }

  function createFacetedMarsPlanet(radius = 8.5) {
    const geo = new THREE.IcosahedronGeometry(radius, 2); // already non-indexed
    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const c = new THREE.Color();
    for (let i = 0; i < pos.count; i += 3) {
      const cy = (pos.getY(i) + pos.getY(i + 1) + pos.getY(i + 2)) / 3;
      const cx = (pos.getX(i) + pos.getX(i + 1) + pos.getX(i + 2)) / 3;
      const idx = Math.abs(Math.floor((cy * 1.3 + cx * 0.7) * 2)) % DEFAULT_MARS_RAMP.length;
      c.set(DEFAULT_MARS_RAMP[idx]);
      for (let k = 0; k < 3; k++) {
        colors[(i + k) * 3] = c.r;
        colors[(i + k) * 3 + 1] = c.g;
        colors[(i + k) * 3 + 2] = c.b;
      }
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
      vertexColors: true, roughness: 0.9, metalness: 0.04, flatShading: true
    }));
  }

  function createStarfield(count = 550, minR = 45, maxR = 120) {
    const pos = new Float32Array(count * 3);
    let seed = 1337;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    for (let i = 0; i < count; i++) {
      const u = rnd() * 2 - 1;
      const phi = rnd() * Math.PI * 2;
      const r = minR + rnd() * (maxR - minR);
      const s = Math.sqrt(1 - u * u);
      pos[i * 3] = r * s * Math.cos(phi);
      pos[i * 3 + 1] = r * u;
      pos[i * 3 + 2] = r * s * Math.sin(phi);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xeaf0ff, size: 0.35, sizeAttenuation: true }));
  }

  function findClip(clips, names) {
    for (const n of names) {
      const exact = clips.find(c => c.name === n);
      if (exact) return exact;
    }
    for (const n of names) {
      const pref = clips.find(c => c.name.startsWith(n));
      if (pref) return pref;
    }
    return clips[0] || null;
  }

  function playClip(actor, clipName, fade = 0.22) {
    if (!actor?.mixer) return;
    const action = actor.actions[clipName];
    if (!action || actor.current === action) return;
    if (actor.current) actor.current.fadeOut(fade);
    action.reset().fadeIn(fade).play();
    actor.current = action;
  }

  function cloneAlarmMaterials(node) {
    const mats = [];
    if (!node) return mats;
    node.traverse(child => {
      if (child.isMesh && child.material) {
        child.material = child.material.clone();
        mats.push(child.material);
      }
    });
    return mats;
  }

  // ---------------------------------------------------------------------------
  // 1. FIRST-PERSON COCKPIT (#cockpit-viewport)
  // ---------------------------------------------------------------------------
  async function initCockpit() {
    const section = document.getElementById('cockpit');
    const container = document.getElementById('cockpit-viewport');
    if (!section || !container) return;

    const { renderer, scene, camera } = makeViewport(container, { fov: 62, clearColor: 0x030710 });
    addStandardStudioLights(scene, { warmRim: 0x5aaeff });
    const consoleGlow = new THREE.PointLight(0x52d6ff, 1.4, 3.5);
    consoleGlow.position.set(0, 1.05, -0.2);
    scene.add(consoleGlow);

    const stars = createStarfield(600, 35, 110);
    scene.add(stars);
    const marsPlanet = createFacetedMarsPlanet(7.5);
    marsPlanet.position.set(4.5, 4.2, -26);
    scene.add(marsPlanet);

    const gltf = await parseFreshGLB(window.ASTRO?.COCKPIT_MODEL || 'rocket/cockpit_pilot.glb');
    const root = gltf.scene;
    scene.add(root);

    const camAnchor = root.getObjectByName('Camera_Pilot');
    const baseCamPos = camAnchor
      ? camAnchor.getWorldPosition(new THREE.Vector3())
      : new THREE.Vector3(0, 1.18, 0.38);
    const lookTarget = new THREE.Vector3(0, 0.86, -0.55);
    camera.position.copy(baseCamPos);
    camera.lookAt(lookTarget);

    const throttlePivot = root.getObjectByName('Throttle_Lever');
    const stickRHC = root.getObjectByName('Joystick_RHC');
    const stickTHC = root.getObjectByName('Controller_THC');
    const breakerBank = root.getObjectByName('Breaker_Bank');
    const stageSwitch = root.getObjectByName('Stage_Sep_Switch');
    const edlSwitch = root.getObjectByName('EDL_Arm_Switch');
    const alarmRedMats = cloneAlarmMaterials(root.getObjectByName('Alarm_Master_Red'));
    const alarmAmberMats = cloneAlarmMaterials(root.getObjectByName('Alarm_Caution_Amber'));

    // Navball: the ball turns so its horizon line reaches the green brackets (20° on the ball) at the band edge.
    const navball = root.getObjectByName('Navball');
    const navBase = navball ? navball.quaternion.clone() : null, navQ = new THREE.Quaternion(), navGoal = new THREE.Quaternion(), navE = new THREE.Euler();
    const throttleBaseRot = throttlePivot ? throttlePivot.rotation.x : 0;
    const rhcBaseRot = stickRHC ? stickRHC.rotation.clone() : new THREE.Euler();

    // Tag clickable meshes with their cockpit action
    const interactiveMeshes = [];
    const tagPivot = (obj, actionFn) => {
      if (!obj) return;
      obj.traverse(ch => {
        if (ch.isMesh) {
          ch.userData.onCockpitClick = actionFn;
          interactiveMeshes.push(ch);
        }
      });
    };
    tagPivot(throttlePivot, () => window.ASTRO_SIM?.handleCockpitAction('throttle_up'));
    tagPivot(stickRHC, () => window.ASTRO_SIM?.handleCockpitAction('stabilize'));
    tagPivot(stickTHC, () => {
      const f = window.ASTRO_SIM?.flight;
      if (f?.step === 'radiation') window.ASTRO_SIM?.handleCockpitAction('shield_storm');
      else window.ASTRO_SIM?.handleCockpitAction('pump_fuel');
    });
    tagPivot(breakerBank, () => {
      const f = window.ASTRO_SIM?.flight;
      const tripped = f?.breakers ? f.breakers.findIndex(Boolean) : 0;
      window.ASTRO_SIM?.handleCockpitAction('breaker', tripped >= 0 ? tripped : 0);
    });
    tagPivot(stageSwitch, () => window.ASTRO_SIM?.handleCockpitAction('stage_sep'));
    tagPivot(edlSwitch, () => window.ASTRO_SIM?.handleCockpitAction('edl_arm'));

    // Spark particles for FX_Sparks_Left & FX_Sparks_Right
    const sparkAnchors = ['FX_Sparks_Left', 'FX_Sparks_Right']
      .map(n => root.getObjectByName(n))
      .filter(Boolean);
    const sparkCount = 48;
    const sparkPos = new Float32Array(sparkCount * 3);
    const sparkVel = Array.from({ length: sparkCount }, () => new THREE.Vector3());
    const sparkGeo = new THREE.BufferGeometry();
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
    const sparkMat = new THREE.PointsMaterial({ color: 0xffb347, size: 0.032, transparent: true, opacity: 0.95 });
    const sparkPoints = new THREE.Points(sparkGeo, sparkMat);
    sparkPoints.visible = false;
    sparkPoints.frustumCulled = false;
    scene.add(sparkPoints);

    function resetSpark(i) {
      const anchor = sparkAnchors.length ? sparkAnchors[i % sparkAnchors.length] : null;
      const wp = anchor ? anchor.getWorldPosition(new THREE.Vector3()) : new THREE.Vector3(i % 2 ? 0.42 : -0.42, 0.92, -0.35);
      sparkPos[i * 3] = wp.x;
      sparkPos[i * 3 + 1] = wp.y;
      sparkPos[i * 3 + 2] = wp.z;
      sparkVel[i].set((Math.random() - 0.5) * 1.4, 0.5 + Math.random() * 1.3, (Math.random() - 0.3) * 1.1);
    }
    for (let i = 0; i < sparkCount; i++) resetSpark(i);

    // Raycast interaction + slight head-look on pointer move
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let hoverOffset = new THREE.Vector2(0, 0);

    renderer.domElement.addEventListener('pointermove', e => {
      const r = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      hoverOffset.set(pointer.x * 0.04, pointer.y * 0.025);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(interactiveMeshes, false);
      renderer.domElement.style.cursor = hits.length ? 'pointer' : 'default';
    });

    renderer.domElement.addEventListener('click', e => {
      const r = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(interactiveMeshes, false);
      if (hits.length && hits[0].object.userData.onCockpitClick) {
        hits[0].object.userData.onCockpitClick();
      }
    });

    let lastT = performance.now();
    function frame(now) {
      requestAnimationFrame(frame);
      if (!section.classList.contains('active')) {
        lastT = now;
        return;
      }
      const dt = Math.min((now - lastT) / 1000, 0.05);
      lastT = now;
      const f = window.ASTRO_SIM?.flight;

      if (f) {
        // Animate cockpit controls from live flight state
        if (throttlePivot) {
          throttlePivot.rotation.x = THREE.MathUtils.lerp(throttlePivot.rotation.x, throttleBaseRot - (f.throttle || 0) * 0.65, 0.14);
        }
        if (navball) {
          // [pitch, yaw] error / band × 20°: at the band edge the target on the ball reaches the green brackets.
          const g = f.step === 0 ? f.liftoff : null, ep = g ? g.value[0] / g.band : 0, ey = g ? g.value[1] / g.band : 0;
          const deg = e => THREE.MathUtils.clamp(e * 20, -70, 70) * Math.PI / 180;
          const roll = g ? Math.sin(now * 0.0011) * 0.04 * Math.min(3, Math.hypot(ep, ey)) : 0;
          navQ.setFromEuler(navE.set(deg(ep), -deg(ey), roll)); // nose high → target drops; nose right → target moves left
          navball.quaternion.slerp(navGoal.copy(navBase).multiply(navQ), 0.3);
        }
        if (stickRHC) {
          stickRHC.rotation.z = THREE.MathUtils.lerp(stickRHC.rotation.z, rhcBaseRot.z - (f.pitchX || 0) * 0.014, 0.15);
          stickRHC.rotation.x = THREE.MathUtils.lerp(stickRHC.rotation.x, rhcBaseRot.x + (f.pitchY || 0) * 0.014, 0.15);
        }
        if (stageSwitch) {
          stageSwitch.rotation.x = THREE.MathUtils.lerp(stageSwitch.rotation.x, f.stageSeparated ? -0.65 : 0.25, 0.16);
        }
        if (edlSwitch) {
          edlSwitch.rotation.x = THREE.MathUtils.lerp(edlSwitch.rotation.x, f.edlChuteDeployed ? -0.65 : 0.25, 0.16);
        }

        // Exterior planet & stars motion according to flight progress
        const prog = Math.max(0, Math.min(1, (f.progress || 0) / 100));
        const marsScale = 0.6 + prog * 1.45;
        marsPlanet.scale.setScalar(marsScale);
        marsPlanet.position.set(4.5 - prog * 3.8, 4.2 - prog * 3.1, -26 + prog * 9);
        if (!reducedMotion) {
          marsPlanet.rotation.y += dt * 0.08;
          stars.rotation.x += dt * (0.01 + (f.throttle || 0) * 0.03);
        }

        // Master alarm & sparks
        const hasBreaker = Array.isArray(f.breakers) && f.breakers.some(Boolean);
        const offAxis = Math.hypot(f.pitchX || 0, f.pitchY || 0) > 18;
        const sparking = now < (f.sparksUntil || 0);
        const blinkRed = (hasBreaker || sparking) && Math.sin(now * 0.014) > 0;
        const blinkAmber = offAxis && Math.sin(now * 0.009) > 0;

        for (const m of alarmRedMats) {
          if (m.emissive) m.emissive.setHex(blinkRed ? 0xff2b2b : 0x2a0606);
          m.emissiveIntensity = blinkRed ? 2.4 : 0.3;
        }
        for (const m of alarmAmberMats) {
          if (m.emissive) m.emissive.setHex(blinkAmber ? 0xf6b73c : 0x2c1c04);
          m.emissiveIntensity = blinkAmber ? 2.0 : 0.3;
        }

        sparkPoints.visible = sparking || hasBreaker;
        if (sparkPoints.visible) {
          for (let i = 0; i < sparkCount; i++) {
            sparkVel[i].y -= 3.71 * dt;
            sparkPos[i * 3] += sparkVel[i].x * dt;
            sparkPos[i * 3 + 1] += sparkVel[i].y * dt;
            sparkPos[i * 3 + 2] += sparkVel[i].z * dt;
            if (sparkPos[i * 3 + 1] < 0.25) resetSpark(i);
          }
          sparkGeo.attributes.position.needsUpdate = true;
        }

        // Camera vibration from engine thrust / parachute opening
        let sx = 0, sy = 0;
        if (!reducedMotion && ((f.throttle || 0) > 0.55 || f.edlChuteDeployed || sparking)) {
          const amp = sparking ? 0.014 : f.edlChuteDeployed ? 0.011 : 0.006 * (f.throttle || 0);
          sx = (Math.random() - 0.5) * amp;
          sy = (Math.random() - 0.5) * amp;
        }
        camera.position.set(baseCamPos.x + hoverOffset.x + sx, baseCamPos.y + hoverOffset.y + sy, baseCamPos.z);
        camera.lookAt(lookTarget);
      }

      renderer.render(scene, camera);
    }
    requestAnimationFrame(frame);
  }

  // ---------------------------------------------------------------------------
  // 3. ANIMATED 3D PODIUM (#podium-viewport)
  // ---------------------------------------------------------------------------
  async function initPodium() {
    const section = document.getElementById('results');
    const container = document.getElementById('podium-viewport');
    if (!section || !container) return;

    const { renderer, scene, camera } = makeViewport(container, { fov: 44, clearColor: 0x0b1019 });
    addStandardStudioLights(scene, { warmRim: 0xf6b73c });

    // Slot coordinates for 1st, 2nd, 3rd, 4th places (x, height, z)
    const SLOTS = [
      { x: -0.35, h: 0.92, z: 0.25, col: 0xf6b73c }, // 1st Gold
      { x: -1.75, h: 0.64, z: 0.05, col: 0xc8d3e0 }, // 2nd Silver
      { x: 1.05, h: 0.44, z: 0.05, col: 0xd97a4a },  // 3rd Bronze
      { x: 2.35, h: 0.22, z: -0.25, col: 0x5c6b82 }, // 4th Slate
    ];

    const baseMat = new THREE.MeshStandardMaterial({ color: 0x1c2536, roughness: 0.65, metalness: 0.25, flatShading: true });
    for (const s of SLOTS) {
      const colMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.54, 0.62, s.h, 6).toNonIndexed(), baseMat);
      colMesh.position.set(s.x, s.h * 0.5, s.z);
      const capMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.56, 0.56, 0.07, 6).toNonIndexed(),
        new THREE.MeshStandardMaterial({ color: s.col, emissive: s.col, emissiveIntensity: 0.3, roughness: 0.35, flatShading: true })
      );
      capMesh.position.set(s.x, s.h + 0.035, s.z);
      scene.add(colMesh, capMesh);
    }

    const actors = {};
    await Promise.all(CREW_IDS.map(async id => {
      const rel = window.ASTRO?.CREW_MODELS?.[id] || `characters/${id}.glb`;
      const gltf = await parseFreshGLB(rel);
      const model = gltf.scene;
      scene.add(model);
      const mixer = new THREE.AnimationMixer(model);
      const actions = {};
      const idle = findClip(gltf.animations, ['idle_loop', 'idle']);
      const action = findClip(gltf.animations, ['action_loop', 'action']);
      const wave = findClip(gltf.animations, ['wave']);
      if (idle) actions.idle = mixer.clipAction(idle);
      if (action) actions.action = mixer.clipAction(action);
      if (wave) {
        actions.wave = mixer.clipAction(wave);
        actions.wave.setLoop(THREE.LoopRepeat, Infinity);
      }
      const actor = { id, model, mixer, actions, current: null };
      playClip(actor, 'idle', 0);
      actors[id] = actor;
    }));

    function applyRanking(ranked) {
      const list = Array.isArray(ranked) && ranked.length
        ? ranked
        : CREW_IDS.map((id, i) => ({ id, pos: i + 1 }));
      list.forEach((entry, idx) => {
        const slot = SLOTS[Math.min(idx, SLOTS.length - 1)];
        const actor = actors[entry.id];
        if (!actor) return;
        actor.model.position.set(slot.x, slot.h + 0.07, slot.z);
        actor.model.rotation.y = (0.15 - idx * 0.08);
        playClip(actor, idx === 0 ? 'wave' : idx === 1 ? 'action' : 'idle', 0.25);
      });
    }
    applyRanking();
    window.addEventListener('astro:results', e => applyRanking(e.detail?.ranked));

    let lastT = performance.now();
    let angle = 0;
    function frame(now) {
      requestAnimationFrame(frame);
      if (!section.classList.contains('active')) {
        lastT = now;
        return;
      }
      const dt = Math.min((now - lastT) / 1000, 0.05);
      lastT = now;
      for (const id of CREW_IDS) actors[id]?.mixer.update(dt);
      if (!reducedMotion) angle += dt * 0.35;
      camera.position.set(0.3 + Math.sin(angle) * 0.55, 2.35, 5.4);
      camera.lookAt(0.3, 1.35, 0);
      renderer.render(scene, camera);
    }
    requestAnimationFrame(frame);
  }

  initCockpit().catch(err => console.warn('3D cockpit fallback active:', err));
  initPodium().catch(err => console.warn('3D podium fallback active:', err));
})();

})().catch(error => console.warn('flight 3D unavailable:', error));
