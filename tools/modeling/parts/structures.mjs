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
  role: 'Open cutaway bay with a mounting point for 1 equipment item',
  summary: 'White half shell open to the front, dark inner wall, aluminum decks and a gold hexagonal mounting plate at the bay center.',
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
      budget: { triangles: 700, meshes: 8 },
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
    return p;
  },
};

export default [boosterThrustSection, stageModule];
