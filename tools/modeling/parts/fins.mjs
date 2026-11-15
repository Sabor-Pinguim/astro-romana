import * as THREE from 'three';
import { box } from '../lib/shapes.mjs';
import { createPartBuilder } from '../lib/part-builder.mjs';

// Fins for the Main Booster: four fixed fins bolted to the skirt of booster-thrust-section, same origin and
// normalized scale (Ø 1.00 m), so the builder places them on the hull without offsets. Fixed fins move the
// centre of pressure aft, which makes the rocket weathervane back into the airflow (passive stability):
// in the game they damp the gusts of the liftoff minigame (specs.aeroDriftFactor, game-balance).

const SKIRT_R = 0.48; // fins start just inside the skirt surface (radius 0.50–0.53)
const ANGLES = [45, 135, 225, 315]; // same diagonals as the stage seams, clear of the cutaway front

/** One swept fin in its own plane: x = outward span, y = up the body; thickness along z. */
function fin({ root, tip, span, drop, thick, base = 0.02 }) {
  const shape = new THREE.Shape([
    new THREE.Vector2(0, base), new THREE.Vector2(span, base - drop),
    new THREE.Vector2(span, base - drop + tip), new THREE.Vector2(0, base + root),
  ]);
  return new THREE.ExtrudeGeometry(shape, { depth: thick, bevelEnabled: false }).translate(SKIRT_R, 0, -thick / 2);
}

function finSet({ id, name, tier, displayName, vehicle, role, summary, geometry, material, fairing }) {
  return {
    id, category: 'fins', tier, name, displayName, vehicle, role, summary,
    originNote: 'Same origin as booster-thrust-section (bottom of the thrust plate); fins on the skirt diagonals',
    references: [`references/parts/fins/${id}/README.md`],
    build() {
      const p = createPartBuilder({
        id: this.id, name: this.name, category: this.category, tier: this.tier, displayName: this.displayName,
        vehicle: this.vehicle, role: this.role, summary: this.summary, originNote: this.originNote, references: this.references,
        attachTop: [0, 0.5, 0], budget: { triangles: 400, meshes: 4 },
      });
      for (const a of ANGLES) {
        p.add('Root', material, fin(geometry), { r: [0, a, 0] });
        if (fairing) { // engine fairing at the fin root, as on the S-IC
          const rad = (a * Math.PI) / 180, r = SKIRT_R + fairing.w / 2;
          p.add('Root', 'HullBlack', box(fairing.w, fairing.h, fairing.d), { p: [Math.cos(rad) * r, fairing.h / 2 - 0.06, -Math.sin(rad) * r], r: [0, a, 0] });
        }
      }
      return p;
    },
  };
}

export default [
  finSet({
    id: 'fins-small', name: 'FinsSmall', tier: 1,
    displayName: 'Small Fixed Fins',
    vehicle: 'Redstone family (Mercury-Redstone, Jupiter-C)',
    role: 'Light passive stability for the ascent; damps gusts a little',
    summary: 'Four small swept black fins on the booster skirt diagonals.',
    geometry: { root: 0.3, tip: 0.13, span: 0.16, drop: 0.04, thick: 0.02 },
    material: 'HullBlack',
  }),
  finSet({
    id: 'fins-large', name: 'FinsLarge', tier: 2,
    displayName: 'Large Fixed Fins with Fairings',
    vehicle: 'Saturn V first stage (S-IC)',
    role: 'Strong passive stability through Max-Q; heavier and dearer',
    summary: 'Four large swept white fins reaching below the base, each with a dark engine fairing at the root.',
    geometry: { root: 0.42, tip: 0.2, span: 0.3, drop: 0.12, thick: 0.03 },
    material: 'Hull',
    fairing: { w: 0.07, h: 0.46, d: 0.12 },
  }),
];
