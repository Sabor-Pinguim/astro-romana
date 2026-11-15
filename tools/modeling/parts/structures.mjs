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
  displayName: 'Seção de Empuxo do Propulsor',
  vehicle: 'Main Booster (base obrigatória)',
  role: 'Saia traseira com placa de empuxo: recebe o conjunto de motores embaixo e o tanque em cima',
  summary: 'Saia branca levemente cônica com faixa preta, quatro aletas, placa de empuxo de aço e ressalto hexagonal de fixação dos motores.',
  originNote: 'Plano inferior da placa de empuxo; motores penduram abaixo de y = 0',
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
    for (let k = 0; k < 4; k++) {
      const a = 45 + k * 90;
      const rad = (a * Math.PI) / 180;
      p.add('Root', 'HullBlack', box(0.03, 0.34, 0.24), {
        p: [Math.sin(rad) * 0.64, 0.19, Math.cos(rad) * 0.64],
        r: [0, a, 0],
      });
    }
    return p;
  },
};

const stageModule = {
  id: 'stage-module',
  category: 'structures',
  tier: 1,
  name: 'StageModule',
  displayName: 'Módulo de Estágio do Meio',
  vehicle: 'Estágios do meio (0 a 7, empilháveis)',
  role: 'Baia aberta em cutaway com um ponto de fixação para 1 equipamento',
  summary: 'Meia casca branca aberta para a frente, parede interna escura, pisos de alumínio e placa hexagonal dourada de fixação no centro da baia.',
  originNote: 'Interface inferior (y = 0); próximo módulo encaixa em y = 1',
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
