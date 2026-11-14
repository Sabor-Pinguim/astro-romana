import * as THREE from 'three';
import { createPalette } from './palette.mjs';
import { PartSet, box, cyl, ball, ring, shell } from './shapes.mjs';

const DEG = THREE.MathUtils.DEG2RAD;

/**
 * Shared astronaut rig. Every avatar has exactly these pivots, with these names, so
 * game code and animations can treat all characters the same way.
 *
 * Conventions: meters, +Y up, the character faces +Z, origin between the feet.
 * The character's left side is +X. Pivots are empty nodes placed at the joints;
 * meshes are children named `<Pivot>_<Material>`.
 *
 * `pos` is relative to the parent pivot; `rest` is the rest rotation in degrees (XYZ).
 */
export const RIG = [
  { name: 'Hips', parent: null, pos: [0, 0.95, 0] },
  { name: 'Torso', parent: 'Hips', pos: [0, 0.1, 0] },
  { name: 'Head', parent: 'Torso', pos: [0, 0.47, 0] },
  { name: 'UpperArm_L', parent: 'Torso', pos: [0.31, 0.39, 0], rest: [0, 0, 10] },
  { name: 'LowerArm_L', parent: 'UpperArm_L', pos: [0, -0.3, 0], rest: [-10, 0, 0] },
  { name: 'Hand_L', parent: 'LowerArm_L', pos: [0, -0.25, 0] },
  { name: 'UpperArm_R', parent: 'Torso', pos: [-0.31, 0.39, 0], rest: [0, 0, -10] },
  { name: 'LowerArm_R', parent: 'UpperArm_R', pos: [0, -0.3, 0], rest: [-10, 0, 0] },
  { name: 'Hand_R', parent: 'LowerArm_R', pos: [0, -0.25, 0] },
  { name: 'UpperLeg_L', parent: 'Hips', pos: [0.11, -0.05, 0] },
  { name: 'LowerLeg_L', parent: 'UpperLeg_L', pos: [0, -0.38, 0] },
  { name: 'Foot_L', parent: 'LowerLeg_L', pos: [0, -0.4, 0] },
  { name: 'UpperLeg_R', parent: 'Hips', pos: [-0.11, -0.05, 0] },
  { name: 'LowerLeg_R', parent: 'UpperLeg_R', pos: [0, -0.38, 0] },
  { name: 'Foot_R', parent: 'LowerLeg_R', pos: [0, -0.4, 0] },
];

export const PIVOT_NAMES = RIG.map((j) => j.name);
export const SIDES = { L: 1, R: -1 };

/**
 * Creates the base astronaut (suit, helmet, backpack, gloves, boots).
 * Characters add their own gear with `avatar.part(pivot).add(...)` and
 * `avatar.anchor(...)`, then call `avatar.finish()`.
 */
export function createAvatar({ id, accent, visor = 'Visor' }) {
  const materials = createPalette(accent);
  const root = new THREE.Group();
  root.name = `Avatar_${id}`;

  const pivots = {};
  const restQuaternions = {};
  const parts = {};
  for (const joint of RIG) {
    const node = new THREE.Group();
    node.name = joint.name;
    node.position.set(...joint.pos);
    const [rx, ry, rz] = joint.rest ?? [0, 0, 0];
    node.quaternion.setFromEuler(new THREE.Euler(rx * DEG, ry * DEG, rz * DEG));
    restQuaternions[joint.name] = node.quaternion.clone();
    (joint.parent ? pivots[joint.parent] : root).add(node);
    pivots[joint.name] = node;
    parts[joint.name] = new PartSet(materials);
  }

  const avatar = {
    id,
    root,
    pivots,
    materials,
    restQuaternions,
    restPositions: Object.fromEntries(RIG.map((j) => [j.name, new THREE.Vector3(...j.pos)])),
    fx: [],
    part: (pivot) => parts[pivot],
    /** Empty node used as a particle emitter in the viewer and in Godot. Emits along its local +Y. */
    anchor(name, pivot, { p = [0, 0, 0], r = [0, 0, 0] } = {}, fx = null) {
      if (!name.startsWith('FX_')) throw new Error(`FX anchors must start with "FX_": ${name}`);
      const node = new THREE.Object3D();
      node.name = name;
      node.position.set(...p);
      node.rotation.set(r[0] * DEG, r[1] * DEG, r[2] * DEG);
      if (fx) node.userData = { fx: fx.preset };
      pivots[pivot].add(node);
      if (fx) avatar.fx.push({ anchor: name, ...fx });
      return node;
    },
    finish() {
      for (const name of PIVOT_NAMES) parts[name].attachTo(pivots[name], name);
      return root;
    },
  };

  buildBody(avatar, visor);
  return avatar;
}

function buildBody(avatar, visorMaterial) {
  const P = avatar.part;

  // Hips: soft lower torso, waist bearing (xEMU-style hip ring), hip joints.
  P('Hips')
    .add('Suit', cyl(0.19, 0.17, 0.2, 8), { p: [0, -0.02, 0], s: [1, 1, 0.75] })
    .add('Metal', ring(0.19, 0.022, 12), { p: [0, 0.08, 0], s: [1, 1, 0.78] })
    .add('Suit', ball(0.1, 8, 6), { p: [0.11, -0.07, 0] })
    .add('Suit', ball(0.1, 8, 6), { p: [-0.11, -0.07, 0] });

  // Torso: abdomen + octagonal hard upper torso, chest display/control box, navy life-support pack.
  P('Torso')
    .add('Suit', cyl(0.2, 0.19, 0.12, 8), { p: [0, 0.04, 0], s: [1, 1, 0.78] })
    .add('Suit', cyl(0.25, 0.21, 0.34, 8), { p: [0, 0.27, 0], s: [1, 1, 0.74] })
    .add('Suit', cyl(0.17, 0.25, 0.06, 8), { p: [0, 0.47, 0], s: [1, 1, 0.74] })
    .add('SuitGrey', box(0.24, 0.12, 0.08), { p: [0, 0.25, 0.19] })
    .add('Visor', box(0.1, 0.035, 0.006), { p: [0, 0.27, 0.233] })
    .add('Metal', cyl(0.016, 0.016, 0.03, 6), { p: [0.08, 0.23, 0.235], r: [90, 0, 0] })
    .add('Metal', cyl(0.016, 0.016, 0.03, 6), { p: [-0.08, 0.23, 0.235], r: [90, 0, 0] })
    .add('Pack', box(0.46, 0.56, 0.2), { p: [0, 0.27, -0.27] })
    .add('Accent', box(0.47, 0.05, 0.21), { p: [0, 0.56, -0.27] })
    .add('Accent', box(0.47, 0.03, 0.21), { p: [0, -0.01, -0.27] })
    .add('SuitGrey', box(0.3, 0.12, 0.03), { p: [0, 0.38, -0.38] })
    .add('Strap', box(0.06, 0.32, 0.02), { p: [0.13, 0.28, 0.165], r: [8, 0, 0] })
    .add('Strap', box(0.06, 0.32, 0.02), { p: [-0.13, 0.28, 0.165], r: [8, 0, 0] });

  // Head: colored neck ring (character identity), dome helmet, visor, side lamps (EMU helmet lights).
  P('Head')
    .add('Accent', ring(0.14, 0.03, 12), { p: [0, 0.0, 0] })
    .add('Helmet', ball(0.18, 12, 9), { p: [0, 0.17, 0] })
    .add(visorMaterial, shell(0.186, 8, 4, Math.PI / 2 - 0.95, 1.9, 0.6, 1.1), { p: [0, 0.17, 0] });
  for (const side of [1, -1]) {
    P('Head')
      .add('SuitGrey', box(0.05, 0.065, 0.08), { p: [side * 0.185, 0.2, 0.03] })
      .add('Lamp', box(0.032, 0.035, 0.01), { p: [side * 0.185, 0.2, 0.072] });
  }

  for (const [suffix, side] of [['L', 1], ['R', -1]]) {
    // Arms: shoulder bearing, upper arm, elbow, forearm, wrist ring, glove.
    P(`UpperArm_${suffix}`)
      .add('Suit', ball(0.1, 8, 6), { p: [0, 0, 0] })
      .add('Metal', ring(0.088, 0.018, 10), { p: [0, -0.06, 0] })
      .add('Suit', cyl(0.075, 0.07, 0.25, 8), { p: [0, -0.18, 0] });
    P(`LowerArm_${suffix}`)
      .add('Suit', ball(0.07, 8, 5), { p: [0, 0, 0] })
      .add('Suit', cyl(0.068, 0.062, 0.21, 8), { p: [0, -0.12, 0] })
      .add('Metal', ring(0.064, 0.016, 10), { p: [0, -0.235, 0] });
    P(`Hand_${suffix}`)
      .add('Glove', box(0.085, 0.1, 0.1), { p: [0, -0.05, 0] })
      .add('Glove', box(0.08, 0.06, 0.092), { p: [0, -0.13, 0.004] })
      .add('GloveTip', box(0.082, 0.026, 0.094), { p: [0, -0.172, 0.004] })
      .add('Glove', box(0.03, 0.06, 0.035), { p: [-side * 0.045, -0.07, 0.04], r: [0, 0, side * 12] });

    // Legs: thigh, knee, shin, boot with dark sole.
    P(`UpperLeg_${suffix}`)
      .add('Suit', cyl(0.105, 0.09, 0.36, 8), { p: [0, -0.19, 0] })
      .add('Suit', ball(0.088, 8, 5), { p: [0, -0.38, 0] });
    P(`LowerLeg_${suffix}`)
      .add('Suit', cyl(0.085, 0.08, 0.33, 8), { p: [0, -0.18, 0] })
      .add('SuitGrey', ring(0.082, 0.02, 10), { p: [0, -0.33, 0] });
    P(`Foot_${suffix}`)
      .add('Boot', box(0.15, 0.1, 0.27), { p: [0, -0.05, 0.035] })
      .add('Boot', box(0.13, 0.05, 0.1), { p: [0, 0.01, -0.02] })
      .add('Sole', box(0.16, 0.035, 0.29), { p: [0, -0.1025, 0.035] });
  }
}

/** Accent stripe on the outer side of a limb (NASA uses colored stripes to tell crew apart). */
export function addLimbStripe(avatar, pivot, side, { y, length, offset = 0.093, width = 0.05 }) {
  avatar.part(pivot).add('Accent', box(0.014, length, width), { p: [side * offset, y, 0] });
}

/** Accent band around a limb segment. */
export function addLimbBand(avatar, pivot, { y, radius, height = 0.04 }) {
  avatar.part(pivot).add('Accent', cyl(radius, radius, height, 8), { p: [0, y, 0] });
}
