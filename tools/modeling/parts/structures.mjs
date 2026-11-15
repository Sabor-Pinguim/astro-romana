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

// Crew cabin: enlarged hammerhead upper capsule with stowed Mars lander base & folded landing legs
// above a flared Ø 1.00 m -> Ø 1.44 m SLA adapter skirt (references/parts/structures/crew-cabin/README.md).
const R_BASE = 0.50;
const R_CAB = 0.72;
const CONE = { y0: 1.38, y1: 2.08, r0: R_CAB, r1: 0.30 }; // capsule cone (half angle ≈ 31°)
const coneR = (y) => CONE.r0 + (CONE.r1 - CONE.r0) * (y - CONE.y0) / (CONE.y1 - CONE.y0);
const CONE_TILT = Math.atan((CONE.r0 - CONE.r1) / (CONE.y1 - CONE.y0)) / DEG;
const WINDOW_Y = 1.68;
const TOP = 2.82;

const crewCabin = {
  id: 'crew-cabin',
  category: 'structures',
  tier: 1,
  name: 'CrewCabin',
  displayName: 'Crew Cabin',
  vehicle: 'Crew cabin & stowed Mars lander (required top)',
  role: 'Enlarged pressurized cabin (4 module slots) and stowed Mars lander base over a flared SLA adapter; the front half (node Closed) closes it',
  summary: 'Flared Ø 1.00 m to Ø 1.44 m SLA adapter carrying a wider white-and-gold Mars lander & crew capsule with four folded landing legs, dark inner walls, two aluminum decks, a gold-foil upper bulkhead, docking ring and launch abort tower; the Closed node adds the front half with hatch and forward windows.',
  originNote: 'Center of the Ø 1.00 m lower stage interface (y = 0); the cutaway opening faces +Z',
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
      pivots: [{ name: 'Closed' }, { name: 'Stowed_Back' }, { name: 'Stowed_Front' }],
      budget: { triangles: 1800, meshes: 20 },
    });
    // Flared SLA adapter skirt (Ø 1.00 m -> Ø 1.44 m) & lower interface ring (rocket stack only; shed before landing).
    p.add('Stowed_Back', 'Aluminum', cyl(R_BASE, R_BASE, 0.04, 12), { p: [0, 0.02, 0] })
      .add('Stowed_Back', 'Hull', cylArc(R_CAB, R_BASE, 0.20, 12, ...BACK_HALF), { p: [0, 0.14, 0] })
      .add('Stowed_Back', 'HullBlack', inward(cylArc(R_CAB - 0.015, R_BASE - 0.015, 0.20, 12, ...BACK_HALF)), { p: [0, 0.14, 0] })
      .add('Stowed_Back', 'HullBlack', cylArc(0.54, 0.506, 0.04, 12, ...BACK_HALF), { p: [0, 0.05, 0] });
    // Stowed Mars lander base collar & gold thermal foil lower bay band.
    p.add('Root', 'HullBlack', cylArc(R_CAB + 0.015, R_CAB + 0.015, 0.07, 12, ...BACK_HALF), { p: [0, 0.26, 0] })
      .add('Root', 'FoilGold', cylArc(R_CAB + 0.006, R_CAB + 0.006, 0.28, 12, ...BACK_HALF), { p: [0, 0.44, 0] });
    // Open version: enlarged cylinder, dark inner wall, capsule cone, decks and cutaway frames.
    p.add('Root', 'Hull', cylArc(R_CAB, R_CAB, 1.14, 12, ...BACK_HALF), { p: [0, 0.81, 0] })
      .add('Root', 'HullBlack', inward(cylArc(R_CAB - 0.018, R_CAB - 0.018, 1.14, 12, ...BACK_HALF)), { p: [0, 0.81, 0] })
      .add('Root', 'Hull', cylArc(CONE.r1, CONE.r0, CONE.y1 - CONE.y0, 12, ...BACK_HALF), { p: [0, 1.73, 0] })
      .add('Root', 'FoilGold', inward(cylArc(CONE.r1 - 0.018, CONE.r0 - 0.018, CONE.y1 - CONE.y0, 12, ...BACK_HALF)), { p: [0, 1.73, 0] })
      .add('Root', 'Aluminum', cyl(R_CAB - 0.01, R_CAB - 0.04, 0.035, 12), { p: [0, 0.2225, 0] }) // lower deck, top at y = 0.24
      .add('Root', 'FoilGold', cyl(0.32, 0.36, 0.02, 6), { p: [0, 0.245, 0] }) // hexagonal lander core plate
      .add('Root', 'Aluminum', cyl(R_CAB - 0.03, R_CAB - 0.03, 0.035, 12), { p: [0, 0.7825, 0] }) // upper deck, top at y = 0.80
      .add('Root', 'Aluminum', flatRing(R_CAB - 0.02, R_CAB - 0.10, 0.035, 12), { p: [0, CONE.y0, 0] }) // upper cone ring
      .add('Root', 'Steel', box(0.035, 1.14, 0.035), { p: [R_CAB - 0.015, 0.81, 0] })
      .add('Root', 'Steel', box(0.035, 1.14, 0.035), { p: [-(R_CAB - 0.015), 0.81, 0] })
      .add('Root', 'Steel', box(0.03, 1.12, 0.03), { p: [0.26, 0.80, -0.58] })
      .add('Root', 'Steel', box(0.03, 1.12, 0.03), { p: [-0.26, 0.80, -0.58] })
      .add('Root', 'Aluminum', cyl(0.20, CONE.r1, 0.10, 10), { p: [0, CONE.y1 + 0.05, 0] }) // docking ring
      .add('Root', 'FoilGold', cyl(0.16, 0.16, 0.02, 8), { p: [0, CONE.y1 + 0.105, 0] }); // docking hatch cap
    // Launch abort tower: four leaning struts, the abort motor with four canted nozzles, the nose cone.
    const strutY = [CONE.y1 + 0.10, 2.46];
    const lean = Math.atan(0.075 / (strutY[1] - strutY[0])) / DEG;
    for (const [sx, sz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
      p.add('Root', 'Steel', box(0.024, strutY[1] - strutY[0] + 0.02, 0.024), {
        p: [sx * 0.085, (strutY[0] + strutY[1]) / 2, sz * 0.085], r: [-sz * lean, 0, sx * lean],
      });
    }
    p.add('Root', 'Hull', cyl(0.085, 0.085, 0.24, 8), { p: [0, 2.58, 0] })
      .add('Root', 'HullBlack', cyl(0, 0.085, TOP - 2.70, 8), { p: [0, (TOP + 2.70) / 2, 0] });
    for (const [x, z, r] of [[0.09, 0, [0, 0, 35]], [-0.09, 0, [0, 0, -35]], [0, 0.09, [-35, 0, 0]], [0, -0.09, [35, 0, 0]]]) {
      p.add('Root', 'HullBlack', cyl(0.024, 0.038, 0.06, 6), { p: [x, 2.48, z], r });
    }
    // Folded Mars lander landing legs (stowed nodes hidden once landed on Mars) & upper RCS thruster quads.
    for (const deg of [45, 135, 225, 315]) {
      const a = deg * DEG, front = Math.cos(a) > 0, target = front ? 'Closed' : 'Root', stowedTarget = front ? 'Stowed_Front' : 'Stowed_Back';
      const sin = Math.sin(a), cos = Math.cos(a);
      p.add(stowedTarget, 'Steel', box(0.045, 0.56, 0.055), { p: [sin * (R_CAB + 0.035), 0.54, cos * (R_CAB + 0.035)], r: [0, deg, 0] })
        .add(target, 'Titanium', box(0.08, 0.07, 0.07), { p: [sin * (R_CAB + 0.03), 0.28, cos * (R_CAB + 0.03)], r: [0, deg, 0] })
        .add(stowedTarget, 'Steel', cyl(0.13, 0.11, 0.025, 6).rotateX(Math.PI / 2), { p: [sin * (R_CAB + 0.065), 0.83, cos * (R_CAB + 0.065)], r: [0, deg, 0] })
        .add(target, 'HullBlack', box(0.085, 0.11, 0.05), { p: [sin * (R_CAB + 0.015), 1.22, cos * (R_CAB + 0.015)], r: [0, deg, 0] });
    }
    // Front SLA adapter flare (only shown when Rocket Stack is Closed; hidden in Builder and on Mars).
    p.add('Stowed_Front', 'Hull', cylArc(R_CAB, R_BASE, 0.20, 12, ...FRONT_HALF), { p: [0, 0.14, 0] })
      .add('Stowed_Front', 'HullBlack', cylArc(0.54, 0.506, 0.04, 12, ...FRONT_HALF), { p: [0, 0.05, 0] });
    // Closed version: front half of lander lower bay, cabin shell, hatch and two forward windows.
    p.add('Closed', 'HullBlack', cylArc(R_CAB + 0.015, R_CAB + 0.015, 0.07, 12, ...FRONT_HALF), { p: [0, 0.26, 0] })
      .add('Closed', 'FoilGold', cylArc(R_CAB + 0.006, R_CAB + 0.006, 0.28, 12, ...FRONT_HALF), { p: [0, 0.44, 0] })
      .add('Closed', 'Hull', cylArc(R_CAB, R_CAB, 1.14, 12, ...FRONT_HALF), { p: [0, 0.81, 0] })
      .add('Closed', 'Hull', cylArc(CONE.r1, CONE.r0, CONE.y1 - CONE.y0, 12, ...FRONT_HALF), { p: [0, 1.73, 0] })
      .add('Closed', 'Aluminum', box(0.22, 0.36, 0.016), { p: [0, 0.88, R_CAB - 0.002] })
      .add('Closed', 'Visor', cyl(0.048, 0.048, 0.012, 8), { p: [0, 0.95, R_CAB + 0.006], r: [90, 0, 0] })
      .add('Closed', 'HullBlack', box(0.09, 0.018, 0.014), { p: [0, 0.78, R_CAB + 0.008] });
    // Each window sits on one cone facet (12 per half: 15° each), centred 7.5° off the front.
    for (const side of [-1, 1]) {
      const a = side * 7.5 * DEG, d = coneR(WINDOW_Y) * Math.cos(7.5 * DEG);
      const at = (out) => [Math.sin(a) * (d + out), WINDOW_Y, Math.cos(a) * (d + out)];
      p.add('Closed', 'Aluminum', box(0.14, 0.12, 0.01), { p: at(0.003), r: [-CONE_TILT, side * 7.5, 0] })
        .add('Closed', 'Visor', box(0.11, 0.095, 0.01), { p: at(0.007), r: [-CONE_TILT, side * 7.5, 0] });
    }
    return p;
  },
};

export default [boosterThrustSection, stageModule, crewCabin];
