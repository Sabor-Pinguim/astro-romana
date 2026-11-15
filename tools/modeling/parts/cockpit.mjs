import * as THREE from 'three';
import { createPartBuilder } from '../lib/part-builder.mjs';
import { ball, box, cyl, ring, shell } from '../lib/shapes.mjs';

/**
 * First-person pilot panel (`cockpit-pilot`), laid out after NASA's Orion crew module cockpit:
 * 3 display units with bezel keys, 7 switch interface panels (about 60 switches), rotational and
 * translational hand controllers, cursor control devices on the armrests, caution and warning lights.
 * Counts and sources: references/parts/crew-cabins.md and references/parts/cockpit/cockpit-pilot/README.md.
 *
 * Game choices (say so in the README): one pilot station centred on the camera, the hand controllers on a
 * pedestal in view (Orion has them on the seat armrests), a throttle lever and an abort T-handle for the
 * flight minigame, the screen graphics.
 *
 * Conventions: metres, +Y up, the windshield toward -Z (the camera looks along -Z); origin on the cabin
 * floor under the pilot. The cockpit screen in index.html animates the nodes by name: keep them.
 */

const DEG = Math.PI / 180;

/**
 * A flat surface turned toward the pilot (yaw about Y, then tilt about its own X).
 * `at(u, v, w)` gives a point on it (u right, v up the surface, w out of it); `rot(local)` gives the
 * Euler XYZ angles, in degrees, for a part lying on it with an extra local rotation.
 */
function surface(origin, yawDeg, tiltDeg) {
  const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(tiltDeg * DEG, yawDeg * DEG, 0, 'YXZ'));
  const o = new THREE.Vector3(...origin);
  const rot = (local = [0, 0, 0]) => {
    const ql = new THREE.Quaternion().setFromEuler(new THREE.Euler(local[0] * DEG, local[1] * DEG, local[2] * DEG));
    const e = new THREE.Euler().setFromQuaternion(q.clone().multiply(ql), 'XYZ');
    return [e.x / DEG, e.y / DEG, e.z / DEG];
  };
  return { at: (u, v, w = 0) => new THREE.Vector3(u, v, w).applyQuaternion(q).add(o).toArray(), rot, r: rot() };
}

const PANEL = surface([0, 0.86, -0.7], 0, -35); // main instrument panel, leaning back toward the windshield
const WING_L = surface([-0.72, 0.74, -0.36], 35, -30); // side panels turned toward the pilot
const WING_R = surface([0.72, 0.74, -0.36], -35, -30);
const BULKHEAD = surface([0, 1.3, -0.8], 0, 30); // forward wall of the cone, leaning over the panel
const DU_U = [-0.5, 0, 0.5]; // the 3 display units
// Navball (attitude ball) on the left display: radius, and the band edge in degrees of ball rotation.
// index.html turns the ball so its horizon line stays between the fixed green brackets while the pilot is in range.
const NAV_R = 0.095, NAV_BAND_DEG = 20;
// The ball and its fixed marks face the pilot's eyes (Camera_Pilot), so the horizon reads level and centred.
const CAMERA = [0, 1.18, 0.38];
const NAV_C = PANEL.at(-0.5, 0.065, 0.008);
const NAV = (() => {
  const d = CAMERA.map((c, i) => c - NAV_C[i]);
  return surface(NAV_C, Math.atan2(d[0], d[2]) / DEG, -Math.atan2(d[1], Math.hypot(d[0], d[2])) / DEG);
})();

// The two guarded switches and the throttle flip about their own X axis in index.html: no base rotation.
const PIVOTS = [
  { name: 'Joystick_RHC', pos: [0.15, 0.625, -0.3] },
  { name: 'Controller_THC', pos: [-0.15, 0.625, -0.3] },
  { name: 'Throttle_Lever', pos: [-0.15, 0.625, -0.15] },
  { name: 'Stage_Sep_Switch', pos: [0.09, 0.625, -0.15] },
  { name: 'EDL_Arm_Switch', pos: [0.21, 0.625, -0.15] },
  { name: 'Abort_Button', pos: [0, 0.625, -0.4] },
  { name: 'Navball', pos: NAV_C, rot: NAV.r },
  { name: 'Breaker_Bank', pos: WING_L.at(0, -0.09, 0.022), rot: WING_L.r },
  { name: 'Alarm_Master_Red', pos: PANEL.at(-0.09, 0.255, 0.035), rot: PANEL.r },
  { name: 'Alarm_Caution_Amber', pos: PANEL.at(0.09, 0.255, 0.035), rot: PANEL.r },
];

const cockpitPilot = {
  id: 'cockpit-pilot',
  name: 'CockpitPilot',
  category: 'cockpit',
  tier: 2,
  displayName: 'Pilot Control Panel (Orion layout)',
  vehicle: 'NASA Orion crew module (layout reference)',
  role: 'First-person cockpit for launch, ascent, orbit and landing minigames',
  summary:
    'Orion-style panel: 3 display units with bezel keys, 7 switch panels (58 switches), circuit breakers, guarded stage and landing switches, hand controllers, cursor controls, caution and warning lights, two forward windows.',
  originNote: 'Origin on the cabin floor under the pilot; windshield toward -Z; Camera_Pilot at (0, 1.18, 0.38)',
  references: ['references/parts/cockpit/cockpit-pilot/README.md', 'references/parts/crew-cabins.md'],
  build() {
    const b = createPartBuilder({
      id: this.id,
      name: this.name,
      category: this.category,
      tier: this.tier,
      displayName: this.displayName,
      vehicle: this.vehicle,
      role: this.role,
      summary: this.summary,
      originNote: this.originNote,
      references: this.references,
      attachTop: [0, 1.64, 0],
      attachBottom: [0, 0, 0],
      extraAnchors: [
        { name: 'Camera_Pilot', pos: CAMERA, rot: [-18, 0, 0], userData: { target: [0, 0.86, -0.55], fov: 62 } },
      ],
      pivots: PIVOTS,
      fxAnchors: [
        { name: 'FX_Sparks_Left', pos: WING_L.at(-0.15, 0.1, 0.05), rot: [0, 0, -25], preset: 'sparks' },
        { name: 'FX_Sparks_Right', pos: WING_R.at(0.15, 0.1, 0.05), rot: [0, 0, 25], preset: 'sparks' },
      ],
      budget: { triangles: 5000, meshes: 48 },
    });
    // Pivot children are given as local offsets; part-builder expects root coordinates (it subtracts the origin).
    const origin = Object.fromEntries(PIVOTS.map(pv => [pv.name, pv.pos]));
    const pin = (node, mat, geo, local, r) => b.add(node, mat, geo, { p: local.map((x, i) => x + origin[node][i]), ...(r ? { r } : {}) });
    const on = (s, mat, geo, u, v, w, local) => b.add('Root', mat, geo, { p: s.at(u, v, w), r: local ? s.rot(local) : s.r });

    // 1. Cabin shell: floor, the cone walls leaning in, the forward bulkhead with two windows.
    b.add('Root', 'Titanium', box(2.0, 0.04, 1.4), { p: [0, 0.02, -0.25] });
    for (const sx of [-1, 1]) {
      b.add('Root', 'Hull', box(0.04, 1.42, 1.3), { p: [sx * 0.98, 0.75, -0.3], r: [0, 0, sx * 6] });
      for (const z of [-0.75, 0.15]) b.add('Root', 'Aluminum', box(0.03, 1.3, 0.03), { p: [sx * 0.955, 0.75, z], r: [0, 0, sx * 6] });
    }
    on(BULKHEAD, 'Hull', box(1.96, 0.65, 0.04), 0, 0, 0);
    for (const u of [-0.42, 0.42]) {
      on(BULKHEAD, 'HullBlack', box(0.3, 0.2, 0.02), u, 0.04, 0.025);
      on(BULKHEAD, 'Visor', box(0.26, 0.16, 0.01), u, 0.04, 0.038);
    }

    // 2. Main instrument panel on a console, with a brow over the displays.
    b.add('Root', 'HullBlack', box(1.56, 0.62, 0.4), { p: [0, 0.31, -0.64] });
    on(PANEL, 'Strap', box(1.6, 0.58, 0.05), 0, 0, 0);
    on(PANEL, 'HullBlack', box(1.64, 0.04, 0.1), 0, 0.3, 0.03);

    // 3. Display units: bezel, screen and bezel keys (a row below, a column on each side).
    for (const u of DU_U) {
      on(PANEL, 'HullBlack', box(0.42, 0.3, 0.03), u, 0.06, 0.04);
      on(PANEL, 'Display', box(0.34, 0.235, 0.006), u, 0.065, 0.058);
      for (let i = 0; i < 6; i++) on(PANEL, 'Metal', box(0.034, 0.02, 0.01), u - 0.125 + i * 0.05, -0.065, 0.058);
      for (const side of [-1, 1]) for (let j = 0; j < 4; j++) on(PANEL, 'Metal', box(0.022, 0.03, 0.01), u + side * 0.19, -0.01 + j * 0.045, 0.058);
    }
    // Screen graphics (game art): attitude on the left, system levels in the centre, ascent path on the right.
    const S = 0.063;
    // Navball: sky and ground halves, a lit horizon line, pitch lines every 20°, sunk into the left screen so a
    // cap bulges out like a flight director attitude indicator. The aircraft symbol and the band brackets are fixed.
    const half = Math.PI / 2;
    pin('Navball', 'Pack', shell(NAV_R, 16, 6, 0, Math.PI * 2, 0, half), [0, 0, 0]);
    pin('Navball', 'Foam', shell(NAV_R, 16, 6, 0, Math.PI * 2, half, half), [0, 0, 0]);
    pin('Navball', 'Lamp', ring(NAV_R * 1.02, 0.006, 24, 3), [0, 0, 0]); // ring() already lies flat (XZ)
    for (const deg of [-40, -20, 20, 40]) {
      const a = deg * DEG;
      pin('Navball', 'Hull', ring(NAV_R * Math.cos(a) * 1.005, 0.0022, 20, 3), [0, NAV_R * Math.sin(a), 0]);
    }
    // A meridian shows yaw; the green target on the front of the ball is what the pilot keeps centred.
    pin('Navball', 'Hull', ring(NAV_R * 1.01, 0.0022, 24, 3), [0, 0, 0], [0, 0, 90]);
    pin('Navball', 'LedGreen', ring(0.013, 0.0025, 12, 3), [0, 0, NAV_R + 0.002], [90, 0, 0]);
    for (const [x, y] of [[0, 0.02], [-0.02, 0], [0.02, 0]]) pin('Navball', 'LedGreen', box(x ? 0.012 : 0.003, x ? 0.003 : 0.012, 0.004), [x, y, NAV_R - 0.002]);
    // Fixed: the aircraft symbol (where the nose points) and the corners of the band, a square around it.
    const front = NAV_R + 0.012, edge = NAV_R * Math.sin(NAV_BAND_DEG * DEG), arm = 0.014, bar = 0.004;
    on(NAV, 'LedAmber', box(0.008, 0.008, 0.004), 0, 0, front);
    for (const sx of [-1, 1]) on(NAV, 'LedAmber', box(0.016, 0.005, 0.004), sx * 0.016, 0, front);
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
      on(NAV, 'LedGreen', box(arm, bar, 0.004), sx * (edge - arm / 2 + bar / 2), sy * edge, front);
      on(NAV, 'LedGreen', box(bar, arm, 0.004), sx * edge, sy * (edge - arm / 2 + bar / 2), front);
    }
    [[0.15, 'LedGreen'], [0.11, 'LedGreen'], [0.17, 'Lamp'], [0.08, 'LedAmber'], [0.13, 'LedGreen']].forEach(([h, mat], i) => {
      on(PANEL, mat, box(0.035, h, 0.002), -0.12 + i * 0.06, -0.035 + h / 2, S);
    });
    on(PANEL, 'Lamp', box(0.3, 0.004, 0.002), 0, -0.038, S);
    const path = [[-0.14, -0.03], [-0.08, -0.015], [-0.02, 0.01], [0.04, 0.05], [0.09, 0.085], [0.14, 0.11]];
    for (let k = 0; k < path.length - 1; k++) {
      const [u0, v0] = path[k], [u1, v1] = path[k + 1], len = Math.hypot(u1 - u0, v1 - v0);
      on(PANEL, 'Lamp', box(len, 0.005, 0.002), 0.5 + (u0 + u1) / 2, 0.065 + (v0 + v1) / 2 - 0.04, S, [0, 0, Math.atan2(v1 - v0, u1 - u0) / DEG]);
    }
    on(PANEL, 'LedAmber', box(0.02, 0.02, 0.002), 0.64, 0.135, S, [0, 0, 45]);

    // 4. Switch interface panels: 3 under the displays (12 switches each), 2 on each side wing.
    // Toggle switches on a plate whose front face is at w = face: a square base and a tilted lever.
    const toggles = (s, face, u0, v0, cols, rows, du, dv) => {
      for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
        const u = u0 + i * du, v = v0 + j * dv;
        on(s, 'Metal', box(0.02, 0.02, 0.006), u, v, face + 0.003);
        on(s, 'Steel', box(0.006, 0.006, 0.03), u, v + 0.004, face + 0.017, [-15, 0, 0]);
      }
    };
    for (const u of DU_U) {
      on(PANEL, 'SuitGrey', box(0.42, 0.17, 0.012), u, -0.18, 0.032);
      toggles(PANEL, 0.038, u - 0.15, -0.215, 6, 2, 0.06, 0.07);
      for (const du of [-0.12, 0, 0.12]) on(PANEL, 'LedGreen', box(0.012, 0.008, 0.004), u + du, -0.115, 0.04);
    }
    for (const [s, sx] of [[WING_L, -1], [WING_R, 1]]) {
      b.add('Root', 'HullBlack', box(0.5, 0.55, 0.36), { p: [sx * 0.72, 0.275, -0.36], r: [0, -sx * 35, 0] });
      on(s, 'Strap', box(0.52, 0.42, 0.04), 0, 0, 0);
      on(s, 'SuitGrey', box(0.44, 0.15, 0.012), 0, 0.09, 0.026);
      toggles(s, 0.032, -0.15, 0.055, 4, 2, 0.1, 0.07);
      for (const du of [-0.1, 0.1]) on(s, 'LedGreen', box(0.012, 0.008, 0.004), du, 0.155, 0.034);
    }
    on(WING_R, 'SuitGrey', box(0.44, 0.15, 0.012), 0, -0.09, 0.026); // lower right panel
    toggles(WING_R, 0.032, -0.15, -0.09, 4, 1, 0.1, 0);

    // 5. Circuit breakers (lower left panel; clickable in the minigame).
    pin('Breaker_Bank', 'SuitGrey', box(0.44, 0.15, 0.012), [0, 0, 0.004]);
    for (let i = 0; i < 6; i++) for (let j = 0; j < 3; j++) pin('Breaker_Bank', 'Pack', box(0.022, 0.022, 0.018), [-0.15 + i * 0.06, -0.04 + j * 0.04, 0.019]);

    // 6. Caution and warning lights over the displays (index.html blinks their materials).
    for (const u of [-0.09, 0.09]) on(PANEL, 'HullBlack', box(0.13, 0.06, 0.01), u, 0.255, 0.03);
    pin('Alarm_Master_Red', 'LedRed', box(0.1, 0.04, 0.012), [0, 0, 0.006]);
    pin('Alarm_Caution_Amber', 'LedAmber', box(0.1, 0.04, 0.012), [0, 0, 0.006]);

    // 7. Centre pedestal: hand controllers, throttle, guarded switches, abort handle.
    b.add('Root', 'HullBlack', box(0.5, 0.6, 0.36), { p: [0, 0.3, -0.26] });
    b.add('Root', 'Strap', box(0.52, 0.025, 0.38), { p: [0, 0.6125, -0.26] });
    b.add('Root', 'Aluminum', box(0.52, 0.012, 0.012), { p: [0, 0.62, -0.075] });
    b.add('Root', 'Steel', box(0.05, 0.006, 0.12), { p: [-0.15, 0.628, -0.15] }); // throttle gate
    // Rotational hand controller (attitude): boot, grip, head, trigger, thumb hat.
    pin('Joystick_RHC', 'HullBlack', cyl(0.035, 0.045, 0.03, 8), [0, 0.015, 0]);
    pin('Joystick_RHC', 'Pack', cyl(0.018, 0.022, 0.11, 8), [0, 0.085, 0]);
    pin('Joystick_RHC', 'Pack', box(0.05, 0.035, 0.045), [0, 0.15, 0]);
    pin('Joystick_RHC', 'LedRed', box(0.012, 0.02, 0.012), [0, 0.145, -0.026]);
    pin('Joystick_RHC', 'Metal', cyl(0.008, 0.008, 0.012, 6), [0, 0.173, 0]);
    // Translational hand controller: a T-handle on a short stem.
    pin('Controller_THC', 'HullBlack', cyl(0.035, 0.045, 0.03, 8), [0, 0.015, 0]);
    pin('Controller_THC', 'Steel', cyl(0.012, 0.012, 0.07, 6), [0, 0.05, 0]);
    pin('Controller_THC', 'Pack', box(0.1, 0.03, 0.035), [0, 0.095, 0]);
    for (const sx of [-1, 1]) pin('Controller_THC', 'Metal', box(0.015, 0.034, 0.039), [sx * 0.055, 0.095, 0]);
    // Throttle (game control: Orion's crew does not throttle an engine).
    pin('Throttle_Lever', 'Steel', box(0.016, 0.13, 0.016), [0, 0.065, 0]);
    pin('Throttle_Lever', 'Foam', ball(0.022, 8, 6), [0, 0.135, 0]);
    // Guarded switches: the cover flips with the lever.
    for (const [node, guard] of [['Stage_Sep_Switch', 'LedRed'], ['EDL_Arm_Switch', 'LedAmber']]) {
      pin(node, 'HullBlack', box(0.05, 0.012, 0.05), [0, 0.006, 0]);
      pin(node, 'Steel', box(0.008, 0.05, 0.008), [0, 0.035, 0]);
      pin(node, guard, box(0.044, 0.004, 0.052), [0, 0.064, 0]);
      for (const sx of [-1, 1]) pin(node, guard, box(0.004, 0.05, 0.052), [sx * 0.022, 0.04, 0]);
    }
    // Abort T-handle, striped, between two guard rails (after Crew Dragon's abort handle).
    pin('Abort_Button', 'Steel', cyl(0.01, 0.01, 0.05, 6), [0, 0.025, 0]);
    pin('Abort_Button', 'FoilGold', box(0.11, 0.03, 0.03), [0, 0.06, 0]);
    for (const x of [-0.03, 0.03]) pin('Abort_Button', 'HullBlack', box(0.012, 0.032, 0.032), [x, 0.06, 0]);
    for (const sx of [-1, 1]) pin('Abort_Button', 'Steel', box(0.004, 0.04, 0.06), [sx * 0.07, 0.02, 0]);

    // 8. Seat armrests with the cursor control devices.
    for (const sx of [-1, 1]) {
      b.add('Root', 'Pack', box(0.09, 0.07, 0.42), { p: [sx * 0.36, 0.52, 0.16] })
        .add('Root', 'Steel', cyl(0.02, 0.02, 0.48, 6), { p: [sx * 0.36, 0.24, 0.16] })
        .add('Root', 'HullBlack', cyl(0.028, 0.032, 0.016, 8), { p: [sx * 0.36, 0.563, -0.02] })
        .add('Root', 'LedGreen', box(0.012, 0.006, 0.012), { p: [sx * 0.36, 0.574, -0.02] });
    }
    return b;
  },
};

export default [cockpitPilot];
