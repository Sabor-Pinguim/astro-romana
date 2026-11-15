import { box, cyl, cylOpen, cylArc, flatRing } from '../lib/shapes.mjs';
import { createPartBuilder } from '../lib/part-builder.mjs';

// Builder structures: the hull modules the crew assembles the rocket from.
// Normalized scale (Ø 1.00 m), like the stage bay in docs/resources/equipamentos-estagios.md.
// They carry no engine or tank of their own: those attach at the Attach_* nodes.

/** Same cylinder, faces turned inward (the inner wall seen through the cutaway). */
function inward(geometry) {
  const g = geometry.toNonIndexed();
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i += 3) {
    for (let axis = 0; axis < 3; axis++) {
      const a = p.getComponent(i + 1, axis);
      p.setComponent(i + 1, axis, p.getComponent(i + 2, axis));
      p.setComponent(i + 2, axis, a);
    }
  }
  return g;
}

const BACK_HALF = [Math.PI / 2, Math.PI]; // thetaStart, thetaLength: the half at z < 0
const FRONT_HALF = [-Math.PI / 2, Math.PI]; // the half at z > 0
const DEG = Math.PI / 180;

// Open and closed versions: the front half of a hull sits on its own node, `Closed`. The builder hides it
// (the open cutaway shows what is mounted inside); the launch pad and other outside views keep it.

const boosterThrustSection = {
  id: 'booster-thrust-section',
  category: 'structures',
  tier: 1,
  name: 'BoosterThrustSection',
  displayName: 'Booster Thrust Section',
  vehicle: 'Main Booster (required base)',
  role: 'Aft skirt with thrust plate: takes the engine cluster below and the tank above',
  summary: 'Slightly conical white skirt with a black band, a steel thrust plate and a hexagonal engine mounting boss; fins are an optional part.',
  originNote: 'Bottom plane of the thrust plate; engines hang below y = 0',
  references: ['references/parts/structures/booster-thrust-section/README.md'],
  build() {
    const p = createPartBuilder({
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
      attachTop: [0, 0.5, 0],
      attachBottom: [0, 0, 0],
      extraAnchors: [
        { name: 'Attach_Tank', pos: [0, 0.5, 0] },
        { name: 'Attach_Engines', pos: [0, 0, 0] },
      ],
      budget: { triangles: 500, meshes: 6 },
    });
    p.add('Root', 'Steel', cyl(0.49, 0.49, 0.05, 12), { p: [0, 0.025, 0] })
      .add('Root', 'Titanium', cyl(0.12, 0.12, 0.03, 6), { p: [0, -0.015, 0] })
      .add('Root', 'Hull', cylOpen(0.5, 0.53, 0.42, 12), { p: [0, 0.27, 0] })
      .add('Root', 'HullBlack', cylOpen(0.535, 0.535, 0.08, 12), { p: [0, 0.1, 0] })
      .add('Root', 'Aluminum', flatRing(0.52, 0.44, 0.04, 12), { p: [0, 0.48, 0] });
    // No fins of its own: fins are an optional booster part (fins.mjs), bolted on the same skirt.
    return p;
  },
};

const stageModule = {
  id: 'stage-module',
  category: 'structures',
  tier: 1,
  name: 'StageModule',
  displayName: 'Middle Stage Module',
  vehicle: 'Middle stages (0 to 7, stackable)',
  role: 'Cutaway bay with a mounting point for 1 equipment item; the front half (node Closed) closes it',
  summary: 'White half shell open to the front, dark inner wall, aluminum decks and a gold hexagonal mounting plate at the bay center; the Closed node adds the front half with its black band and an access panel.',
  originNote: 'Bottom interface (y = 0); next module fits at y = 1',
  references: ['references/parts/structures/stage-module/README.md'],
  build() {
    const p = createPartBuilder({
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
      attachTop: [0, 1, 0],
      attachBottom: [0, 0, 0],
      extraAnchors: [{ name: 'Attach_Bay', pos: [0, 0.1, 0] }],
      pivots: [{ name: 'Closed' }],
      budget: { triangles: 700, meshes: 10 },
    });
    p.add('Root', 'Hull', cylArc(0.5, 0.5, 0.84, 12, ...BACK_HALF), { p: [0, 0.5, 0] })
      .add('Root', 'HullBlack', inward(cylArc(0.485, 0.485, 0.84, 12, ...BACK_HALF)), { p: [0, 0.5, 0] })
      .add('Root', 'HullBlack', cylArc(0.505, 0.505, 0.1, 12, ...BACK_HALF), { p: [0, 0.8, 0] })
      .add('Root', 'Aluminum', cyl(0.5, 0.5, 0.08, 12), { p: [0, 0.04, 0] })
      .add('Root', 'Aluminum', cyl(0.5, 0.5, 0.08, 12), { p: [0, 0.96, 0] })
      .add('Root', 'Steel', box(0.03, 0.84, 0.03), { p: [0.488, 0.5, 0] })
      .add('Root', 'Steel', box(0.03, 0.84, 0.03), { p: [-0.488, 0.5, 0] })
      .add('Root', 'Titanium', cyl(0.16, 0.16, 0.02, 6), { p: [0, 0.09, 0] })
      .add('Root', 'FoilGold', flatRing(0.2, 0.17, 0.012, 6), { p: [0, 0.086, 0] });
    // Closed version: the front half of the shell, its black band and a bolted access panel.
    p.add('Closed', 'Hull', cylArc(0.5, 0.5, 0.84, 12, ...FRONT_HALF), { p: [0, 0.5, 0] })
      .add('Closed', 'HullBlack', cylArc(0.505, 0.505, 0.1, 12, ...FRONT_HALF), { p: [0, 0.8, 0] })
      .add('Closed', 'Aluminum', box(0.12, 0.3, 0.012), { p: [0, 0.42, 0.497] });
    return p;
  },
};

// Crew cabin: pressurized bay (4 module slots on two decks, see web/views.js CABIN_SLOTS) under a capsule
// cone, a docking ring and a launch abort tower. Shape after the Apollo CM + LES and Orion + LAS
// (references/parts/structures/crew-cabin/README.md); sizes normalized to the Ø 1.00 m stack.
const CONE = { y0: 0.95, y1: 1.45, r0: 0.5, r1: 0.24 }; // capsule cone (half angle ≈ 27.5°)
const coneR = (y) => CONE.r0 + (CONE.r1 - CONE.r0) * (y - CONE.y0) / (CONE.y1 - CONE.y0);
const CONE_TILT = Math.atan((CONE.r0 - CONE.r1) / (CONE.y1 - CONE.y0)) / DEG;
const WINDOW_Y = 1.15;
const TOP = 2.15;

const crewCabin = {
  id: 'crew-cabin',
  category: 'structures',
  tier: 1,
  name: 'CrewCabin',
  displayName: 'Crew Cabin',
  vehicle: 'Crew cabin (required top)',
  role: 'Pressurized cabin with 4 module slots under a launch abort tower; the front half (node Closed) closes it',
  summary: 'White cylinder and capsule cone cut open to the front, dark inner wall, two aluminum decks, a gold-foil upper bulkhead, a docking ring and a launch abort tower; the Closed node adds the front half with the hatch and two windows.',
  originNote: 'Center of the cabin floor (y = 0); the cutaway opening faces +Z',
  references: ['references/parts/structures/crew-cabin/README.md'],
  build() {
    const p = createPartBuilder({
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
      attachTop: [0, TOP, 0],
      attachBottom: [0, 0, 0],
      // Between the two forward windows, facing out: where the launch camera flies in.
      extraAnchors: [{ name: 'View_Window', pos: [0, WINDOW_Y, coneR(WINDOW_Y)], rot: [-CONE_TILT, 0, 0] }],
      pivots: [{ name: 'Closed' }],
      budget: { triangles: 1400, meshes: 12 },
    });
    // Open version (always shown): back half of the shell, inner walls, decks and the tower.
    p.add('Root', 'Hull', cylArc(0.5, 0.5, 0.95, 12, ...BACK_HALF), { p: [0, 0.475, 0] })
      .add('Root', 'HullBlack', inward(cylArc(0.485, 0.485, 0.95, 12, ...BACK_HALF)), { p: [0, 0.475, 0] })
      .add('Root', 'Hull', cylArc(CONE.r1, CONE.r0, CONE.y1 - CONE.y0, 12, ...BACK_HALF), { p: [0, 1.2, 0] })
      .add('Root', 'FoilGold', inward(cylArc(CONE.r1 - 0.015, CONE.r0 - 0.015, CONE.y1 - CONE.y0, 12, ...BACK_HALF)), { p: [0, 1.2, 0] })
      .add('Root', 'HullBlack', cylArc(0.505, 0.505, 0.06, 12, ...BACK_HALF), { p: [0, 0.03, 0] })
      .add('Root', 'Aluminum', cyl(0.5, 0.5, 0.03, 12), { p: [0, 0.015, 0] }) // floor deck, top at y = 0.03
      .add('Root', 'Aluminum', cyl(0.46, 0.46, 0.03, 12), { p: [0, 0.485, 0] }) // upper deck, top at y = 0.5
      .add('Root', 'Aluminum', flatRing(0.48, 0.42, 0.03, 12), { p: [0, CONE.y0, 0] }) // stays inside the cone
      .add('Root', 'Steel', box(0.03, 0.95, 0.03), { p: [0.488, 0.475, 0] })
      .add('Root', 'Steel', box(0.03, 0.95, 0.03), { p: [-0.488, 0.475, 0] })
      .add('Root', 'Aluminum', cyl(0.16, CONE.r1, 0.08, 10), { p: [0, CONE.y1 + 0.04, 0] }); // docking ring
    // Launch abort tower: four leaning struts, the abort motor with four canted nozzles, the nose cone.
    const strutY = [CONE.y1 + 0.08, 1.83];
    const lean = Math.atan(0.05 / (strutY[1] - strutY[0])) / DEG;
    for (const [sx, sz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
      p.add('Root', 'Steel', box(0.02, strutY[1] - strutY[0] + 0.02, 0.02), {
        p: [sx * 0.067, (strutY[0] + strutY[1]) / 2, sz * 0.067], r: [-sz * lean, 0, sx * lean],
      });
    }
    p.add('Root', 'Hull', cyl(0.07, 0.07, 0.2, 8), { p: [0, 1.93, 0] })
      .add('Root', 'HullBlack', cyl(0, 0.07, TOP - 2.03, 8), { p: [0, (TOP + 2.03) / 2, 0] });
    for (const [x, z, r] of [[0.075, 0, [0, 0, 35]], [-0.075, 0, [0, 0, -35]], [0, 0.075, [-35, 0, 0]], [0, -0.075, [35, 0, 0]]]) {
      p.add('Root', 'HullBlack', cyl(0.02, 0.032, 0.05, 6), { p: [x, 1.85, z], r });
    }
    // RCS thruster quads on the diagonals: the two at the back stay, the two at the front close with the hull.
    for (const deg of [45, 135, 225, 315]) {
      const a = deg * DEG, front = Math.cos(a) > 0;
      p.add(front ? 'Closed' : 'Root', 'HullBlack', box(0.07, 0.09, 0.04), { p: [Math.sin(a) * 0.51, 0.8, Math.cos(a) * 0.51], r: [0, deg, 0] });
    }
    // Closed version: the front half of the shell, the hatch with its window and two forward windows.
    p.add('Closed', 'Hull', cylArc(0.5, 0.5, 0.95, 12, ...FRONT_HALF), { p: [0, 0.475, 0] })
      .add('Closed', 'Hull', cylArc(CONE.r1, CONE.r0, CONE.y1 - CONE.y0, 12, ...FRONT_HALF), { p: [0, 1.2, 0] })
      .add('Closed', 'HullBlack', cylArc(0.505, 0.505, 0.06, 12, ...FRONT_HALF), { p: [0, 0.03, 0] })
      .add('Closed', 'Aluminum', box(0.16, 0.28, 0.012), { p: [0, 0.44, 0.497] })
      .add('Closed', 'Visor', cyl(0.035, 0.035, 0.01, 8), { p: [0, 0.5, 0.505], r: [90, 0, 0] })
      .add('Closed', 'HullBlack', box(0.07, 0.014, 0.012), { p: [0, 0.37, 0.507] });
    // Each window sits on one cone facet (12 per half: 15° each), centred 7.5° off the front.
    for (const side of [-1, 1]) {
      const a = side * 7.5 * DEG, d = coneR(WINDOW_Y) * Math.cos(7.5 * DEG);
      const at = (out) => [Math.sin(a) * (d + out), WINDOW_Y, Math.cos(a) * (d + out)];
      p.add('Closed', 'Aluminum', box(0.1, 0.09, 0.008), { p: at(0.002), r: [-CONE_TILT, side * 7.5, 0] })
        .add('Closed', 'Visor', box(0.08, 0.07, 0.008), { p: at(0.005), r: [-CONE_TILT, side * 7.5, 0] });
    }
    return p;
  },
};

export default [boosterThrustSection, stageModule, crewCabin];
