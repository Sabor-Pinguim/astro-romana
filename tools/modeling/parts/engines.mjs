import { box, cyl, ball, ring, torusArc, lathe } from '../lib/shapes.mjs';
import { createPartBuilder } from '../lib/part-builder.mjs';

const L = (n) => (360 / 3) * n; // 120 deg step

const rutherford = {
  id: 'rutherford',
  category: 'engines',
  tier: 1,
  name: 'Rutherford',
  displayName: 'Rutherford (sea level)',
  vehicle: 'Electron (1st stage)',
  role: 'Light electric-pump kerolox engine · 9 per stage',
  summary: 'Small electric-pump-fed engine with a satin-gray chamber and short bell.',
  originNote: 'Top interface of the mounting plate',
  references: ['references/parts/engines/rutherford/README.md'],
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
      attachTop: [0, 0, 0],
      gimbal: [0, -0.03, 0],
      fxExhaust: { pos: [0, -0.72, 0], preset: 'exhaust_kerolox' },
      budget: { triangles: 1500, meshes: 10 },
    });

    p.add('Root', 'Aluminum', cyl(0.13, 0.13, 0.03, 8), { p: [0, -0.015, 0] });

    p.add('Gimbal', 'Aluminum', cyl(0.09, 0.09, 0.22, 8), { p: [0, -0.14, 0] })
      .add('Gimbal', 'Aluminum', cyl(0.05, 0.05, 0.21, 8), { p: [0, -0.16, -0.12] })
      .add('Gimbal', 'Aluminum', cyl(0.03, 0.03, 0.33, 6), { p: [0.1, -0.19, 0], r: [0, 0, 15] })
      .add(
        'Gimbal',
        'Titanium',
        lathe(
          [
            [0.075, -0.25],
            [0.075, -0.41],
            [0.055, -0.445],
            [0.038, -0.47],
            [0.055, -0.5],
            [0.085, -0.57],
            [0.106, -0.64],
            [0.12, -0.72],
          ],
          16,
        ),
      )
      .add('Gimbal', 'Metal', cyl(0.012, 0.012, 0.44, 6), { p: [0.105, -0.47, 0], r: [0, 0, -3] })
      .add('Gimbal', 'Metal', ring(0.115, 0.012, 16, 5), { p: [0, -0.68, 0] });

    return p;
  },
};

const rutherfordVacuum = {
  id: 'rutherford-vacuum',
  category: 'engines',
  tier: 1,
  name: 'RutherfordVacuum',
  displayName: 'Rutherford Vacuum',
  vehicle: 'Electron (2nd stage)',
  role: 'High-expansion orbital engine with electric pumps',
  summary: 'Same electric powerhead as Rutherford with a dark extended bell for vacuum operation.',
  originNote: 'Top interface of the mounting plate',
  references: ['references/parts/engines/rutherford-vacuum/README.md'],
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
      attachTop: [0, 0, 0],
      gimbal: [0, -0.02, 0],
      fxExhaust: { pos: [0, -1.45, 0], preset: 'exhaust_kerolox' },
      budget: { triangles: 1500, meshes: 10 },
    });

    p.add('Gimbal', 'Metal', cyl(0.12, 0.12, 0.04, 8), { p: [0, -0.02, 0] })
      .add('Gimbal', 'Titanium', cyl(0.055, 0.055, 0.2, 8), { p: [0.075, -0.14, 0] })
      .add('Gimbal', 'Titanium', cyl(0.055, 0.055, 0.2, 8), { p: [-0.075, -0.14, 0] })
      .add(
        'Gimbal',
        'Titanium',
        lathe(
          [
            [0.06, -0.04],
            [0.08, -0.08],
            [0.08, -0.3],
            [0.05, -0.38],
            [0.035, -0.42],
            [0.07, -0.5],
            [0.13, -0.58],
          ],
          12,
        ),
      )
      .add(
        'Gimbal',
        'NozzleDark',
        lathe(
          [
            [0.13, -0.58],
            [0.19, -0.75],
            [0.25, -0.95],
            [0.3, -1.18],
            [0.33, -1.35],
            [0.35, -1.45],
          ],
          12,
        ),
      )
      .add('Gimbal', 'Metal', cyl(0.015, 0.015, 0.2, 6), { p: [0.07, -0.3, 0.06], r: [25, 0, 0] })
      .add('Gimbal', 'Metal', cyl(0.015, 0.015, 0.2, 6), { p: [-0.07, -0.3, 0.06], r: [25, 0, 0] })
      .add('Gimbal', 'Metal', cyl(0.012, 0.012, 0.4, 5), { p: [0, -0.24, 0.13], r: [-10, 0, 0] })
      .add('Gimbal', 'Metal', cyl(0.012, 0.012, 0.4, 5), { p: [0.13, -0.24, 0], r: [0, 0, 10] });

    return p;
  },
};

const mr107 = {
  id: 'mr-107',
  category: 'engines',
  tier: 1,
  name: 'Mr107',
  displayName: 'MR-107 (Aerojet Rocketdyne)',
  vehicle: 'Reaction / trajectory control (Viking, Delta II)',
  role: 'Hydrazine monopropellant thruster (RCS / fine trim)',
  summary: 'Small fixed stainless-steel thruster with a top valve and compact cone.',
  originNote: 'Structure mounting flange',
  references: ['references/parts/engines/mr-107/README.md'],
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
      attachTop: [0, 0, 0],
      gimbal: null,
      fxExhaust: { pos: [0, -0.159, 0], preset: 'exhaust_mono' },
      budget: { triangles: 1500, meshes: 10 },
    });

    p.add('Root', 'Metal', cyl(0.0175, 0.0175, 0.061, 8), { p: [0, 0.0305, 0] })
      .add('Root', 'Metal', box(0.075, 0.004, 0.075), { p: [0, -0.002, 0] })
      .add(
        'Root',
        'Steel',
        lathe(
          [
            [0.0264, -0.004],
            [0.0264, -0.075],
            [0.012, -0.085],
            [0.007, -0.09],
            [0.012, -0.105],
            [0.022, -0.13],
            [0.032, -0.159],
          ],
          8,
        ),
      )
      .add('Root', 'Metal', cyl(0.004, 0.004, 0.05, 5), { p: [0.02, 0.035, 0], r: [0, 0, 20] });

    return p;
  },
};

const merlin1d = {
  id: 'merlin-1d',
  category: 'engines',
  tier: 2,
  name: 'Merlin1D',
  displayName: 'Merlin 1D (sea level)',
  vehicle: 'Falcon 9 (1st stage)',
  role: 'Reusable open-cycle kerolox engine · 9 per stage',
  summary: 'Distinctive side turbopump with a long exhaust duct and a manifold ring halfway down the bell.',
  originNote: 'Top of the gimbal block',
  references: ['references/parts/engines/merlin-1d/README.md'],
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
      attachTop: [0, 0, 0],
      gimbal: [0, -0.05, 0],
      fxExhaust: { pos: [0, -2.2, 0], preset: 'exhaust_kerolox' },
      budget: { triangles: 1500, meshes: 10 },
    });

    p.add('Gimbal', 'Metal', cyl(0.12, 0.12, 0.1, 8), { p: [0, -0.05, 0] })
      .add('Gimbal', 'Metal', box(0.55, 0.35, 0.45), { p: [0, -0.28, 0] })
      .add('Gimbal', 'Metal', cyl(0.14, 0.14, 0.45, 8), { p: [0.36, -0.4, 0] })
      .add('Gimbal', 'Metal', cyl(0.06, 0.06, 0.55, 6), { p: [0.36, -0.88, 0] })
      .add(
        'Gimbal',
        'Steel',
        lathe(
          [
            [0.25, -0.45],
            [0.25, -1.0],
            [0.18, -1.1],
            [0.117, -1.15],
            [0.2, -1.3],
            [0.3, -1.5],
            [0.38, -1.75],
            [0.43, -2.0],
            [0.465, -2.2],
          ],
          16,
        ),
      )
      .add('Gimbal', 'Steel', ring(0.345, 0.04, 16, 6), { p: [0, -1.47, 0] })
      .add('Gimbal', 'Metal', cyl(0.045, 0.045, 0.95, 6), { p: [0.3, -1.0, 0.1], r: [0, 0, -4] })
      .add('Gimbal', 'Copper', cyl(0.17, 0.17, 0.08, 16), { p: [0, -1.14, 0] });

    return p;
  },
};

const merlin1dVacuum = {
  id: 'merlin-1d-vacuum',
  category: 'engines',
  tier: 2,
  name: 'Merlin1DVacuum',
  displayName: 'Merlin 1D Vacuum (MVac)',
  vehicle: 'Falcon 9 (2nd stage)',
  role: 'High-expansion-ratio orbital engine with a large niobium bell',
  summary: 'Silver chamber joined to a huge dark radiatively cooled bell and manifold ring.',
  originNote: 'Top of the gimbal post',
  references: ['references/parts/engines/merlin-1d-vacuum/README.md'],
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
      attachTop: [0, 0, 0],
      gimbal: [0, -0.1, 0],
      fxExhaust: { pos: [0, -5.5, 0], preset: 'exhaust_kerolox' },
      budget: { triangles: 1500, meshes: 10 },
    });

    p.add('Gimbal', 'Metal', cyl(0.22, 0.22, 0.2, 8), { p: [0, -0.1, 0] })
      .add(
        'Gimbal',
        'Steel',
        lathe(
          [
            [0.15, -0.2],
            [0.3, -0.3],
            [0.3, -0.8],
            [0.18, -0.95],
            [0.12, -1.02],
            [0.3, -1.2],
            [0.5, -1.42],
            [0.58, -1.55],
          ],
          16,
        ),
      )
      .add('Gimbal', 'Steel', cyl(0.17, 0.17, 0.55, 8), { p: [0.45, -0.6, 0] })
      .add('Gimbal', 'Steel', cyl(0.08, 0.08, 0.3, 8), { p: [0.3, -0.55, 0.3] })
      .add('Gimbal', 'Steel', ring(0.65, 0.12, 16, 6), { p: [0, -1.5, 0] })
      .add(
        'Gimbal',
        'NozzleDark',
        lathe(
          [
            [0.58, -1.55],
            [0.8, -2.2],
            [1.05, -3.0],
            [1.28, -3.8],
            [1.48, -4.7],
            [1.65, -5.5],
          ],
          16,
        ),
      )
      .add('Gimbal', 'Steel', cyl(0.09, 0.09, 0.75, 6), { p: [0.5, -1.1, 0], r: [0, 0, 15] })
      .add('Gimbal', 'Metal', cyl(0.07, 0.07, 0.45, 6), { p: [0.25, -0.3, -0.15], r: [0, 0, 60] })
      .add('Gimbal', 'Metal', cyl(0.04, 0.04, 0.9, 6), { p: [0, -0.55, 0.4], r: [-15, 0, 0] })
      .add('Gimbal', 'Metal', cyl(0.04, 0.04, 0.9, 6), { p: [-0.4, -0.55, 0], r: [0, 0, -15] });

    return p;
  },
};

const rl10 = {
  id: 'rl10',
  category: 'engines',
  tier: 2,
  name: 'Rl10',
  displayName: 'RL10 (Aerojet Rocketdyne)',
  vehicle: 'Centaur III / SLS ICPS',
  role: 'High-efficiency hydrolox upper-stage engine',
  summary: 'Expander cycle with no visible gas generator, a horizontal turbopump on top and a dark nozzle extension.',
  originNote: 'Top of the mounting cone',
  references: ['references/parts/engines/rl10/README.md'],
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
      attachTop: [0, 0, 0],
      gimbal: [0, -0.08, 0],
      fxExhaust: { pos: [0, -2.46, 0], preset: 'exhaust_hydrolox' },
      budget: { triangles: 1500, meshes: 10 },
    });

    p.add('Gimbal', 'Metal', cyl(0.06, 0.22, 0.22, 8), { p: [0, -0.11, 0] })
      .add('Gimbal', 'Steel', cyl(0.13, 0.13, 0.7, 8), { p: [0, -0.32, 0], r: [0, 0, 90] })
      .add('Gimbal', 'Steel', ball(0.2, 8, 6), { p: [0, -0.45, 0] })
      .add(
        'Gimbal',
        'Steel',
        lathe(
          [
            [0.13, -0.55],
            [0.13, -0.72],
            [0.065, -0.82],
            [0.1, -0.88],
            [0.22, -1.0],
            [0.36, -1.18],
            [0.5, -1.35],
          ],
          16,
        ),
      )
      .add(
        'Gimbal',
        'NozzleDark',
        lathe(
          [
            [0.5, -1.35],
            [0.58, -1.62],
            [0.66, -1.9],
            [0.73, -2.2],
            [0.785, -2.46],
          ],
          16,
        ),
      )
      .add('Gimbal', 'Metal', ring(0.5, 0.02, 16, 4), { p: [0, -1.35, 0] })
      .add('Gimbal', 'Metal', cyl(0.05, 0.05, 0.75, 6), { p: [0.32, -0.75, 0], r: [0, 0, 8] })
      .add('Gimbal', 'Metal', cyl(0.05, 0.05, 0.75, 6), { p: [-0.32, -0.75, 0], r: [0, 0, -8] })
      .add('Gimbal', 'Metal', box(0.18, 0.14, 0.14), { p: [0, -0.3, 0.2] });

    return p;
  },
};

const r4d = {
  id: 'r-4d',
  category: 'engines',
  tier: 2,
  name: 'R4d',
  displayName: 'R-4D (Aerojet)',
  vehicle: 'Apollo CSM / Orion Aux / Mars Probes',
  role: 'Compact long-life hypergolic thruster',
  summary: 'Rectangular valve block on top with two feed lines and a sleek dark niobium bell.',
  originNote: 'Top of the valve block',
  references: ['references/parts/engines/r-4d/README.md'],
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
      attachTop: [0, 0, 0],
      gimbal: null,
      fxExhaust: { pos: [0, -0.55, 0], preset: 'exhaust_hypergolic' },
      budget: { triangles: 1500, meshes: 10 },
    });

    p.add('Root', 'Steel', box(0.1, 0.08, 0.08), { p: [0, -0.04, 0] })
      .add('Root', 'Metal', cyl(0.006, 0.006, 0.08, 5), { p: [0.035, 0.03, 0] })
      .add('Root', 'Metal', cyl(0.006, 0.006, 0.08, 5), { p: [-0.035, 0.03, 0] })
      .add(
        'Root',
        'NozzleDark',
        lathe(
          [
            [0.03, -0.08],
            [0.03, -0.17],
            [0.0105, -0.185],
            [0.03, -0.22],
            [0.065, -0.3],
            [0.1, -0.4],
            [0.125, -0.49],
            [0.1335, -0.55],
          ],
          12,
        ),
      );

    return p;
  },
};

const nstar = {
  id: 'nstar',
  category: 'engines',
  tier: 2,
  name: 'Nstar',
  displayName: 'NSTAR (Xenon Ion Thruster)',
  vehicle: 'Deep Space 1 / Dawn',
  role: 'Very-high-Isp ion thruster for interplanetary cruise',
  summary: 'Short, wide bell-less aluminum drum with a concave front grid and side neutralizer.',
  originNote: 'Rear mounting ring',
  references: ['references/parts/engines/nstar/README.md'],
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
      attachTop: [0, 0, 0],
      gimbal: [0, 0, 0],
      fxExhaust: { pos: [0, -0.33, 0], preset: 'exhaust_ion' },
      budget: { triangles: 1500, meshes: 10 },
    });

    p.add(
      'Gimbal',
      'Aluminum',
      lathe(
        [
          [0.1, 0.0],
          [0.1, -0.04],
          [0.17, -0.1],
          [0.205, -0.13],
          [0.205, -0.32],
          [0.15, -0.325],
        ],
        16,
      ),
    )
      .add('Gimbal', 'Titanium', cyl(0.143, 0.143, 0.005, 16), { p: [0, -0.327, 0] })
      .add('Gimbal', 'Steel', ring(0.18, 0.025, 16, 4), { p: [0, -0.325, 0] })
      .add('Gimbal', 'Steel', cyl(0.012, 0.012, 0.06, 6), { p: [0, -0.3, 0.19] });

    return p;
  },
};

const raptor = {
  id: 'raptor',
  category: 'engines',
  tier: 3,
  name: 'Raptor',
  displayName: 'Raptor (sea level)',
  vehicle: 'Starship / Super Heavy',
  role: 'Full-flow staged-combustion methalox engine (FFSC)',
  summary: 'Two symmetric side turbopumps with curved "elbow" ducts and a short, wide bell.',
  originNote: 'Top of the thrust block',
  references: ['references/parts/engines/raptor/README.md'],
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
      attachTop: [0, 0, 0],
      gimbal: [0, -0.1, 0],
      fxExhaust: { pos: [0, -2.9, 0], preset: 'exhaust_methalox' },
      budget: { triangles: 1500, meshes: 10 },
    });

    p.add('Gimbal', 'Metal', box(0.4, 0.2, 0.4), { p: [0, -0.1, 0] })
      .add('Gimbal', 'Metal', cyl(0.1, 0.1, 0.35, 8), { p: [0, -0.375, 0] })
      .add('Gimbal', 'Metal', cyl(0.17, 0.17, 0.55, 8), { p: [0.34, -0.7, 0] })
      .add('Gimbal', 'Metal', cyl(0.15, 0.15, 0.55, 8), { p: [-0.34, -0.7, 0] })
      .add('Gimbal', 'Metal', torusArc(0.25, 0.09, 8, 6, Math.PI / 2), { p: [0.09, -0.975, 0], r: [0, 0, -90] })
      .add('Gimbal', 'Metal', torusArc(0.25, 0.09, 8, 6, Math.PI / 2), { p: [-0.09, -0.975, 0], r: [0, 0, 180] })
      .add(
        'Gimbal',
        'Steel',
        lathe(
          [
            [0.1, -0.55],
            [0.25, -0.65],
            [0.25, -0.95],
            [0.21, -1.0],
            [0.21, -1.27],
            [0.15, -1.33],
            [0.111, -1.37],
          ],
          16,
        ),
      )
      .add(
        'Gimbal',
        'NozzleDark',
        lathe(
          [
            [0.111, -1.37],
            [0.16, -1.42],
            [0.25, -1.55],
            [0.36, -1.75],
            [0.46, -2.0],
            [0.55, -2.3],
            [0.61, -2.6],
            [0.653, -2.9],
          ],
          16,
        ),
      )
      .add('Gimbal', 'NozzleDark', ring(0.65, 0.02, 16, 4), { p: [0, -2.88, 0] });

    return p;
  },
};

const rs25 = {
  id: 'rs-25',
  category: 'engines',
  tier: 3,
  name: 'RS25',
  displayName: 'RS-25 (SSME)',
  vehicle: 'SLS Core Stage · 4 per stage',
  role: 'Main hydrolox engine with very high specific impulse',
  summary: 'Complex powerhead with side preburners, a front avionics box and a large bell with 4 stiffener rings.',
  originNote: 'Top of the mounting gimbal',
  references: ['references/parts/engines/rs-25/README.md'],
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
      attachTop: [0, 0, 0],
      gimbal: [0, -0.08, 0],
      fxExhaust: { pos: [0, -4.27, 0], preset: 'exhaust_hydrolox' },
      budget: { triangles: 1500, meshes: 10 },
    });

    p.add('Gimbal', 'Metal', cyl(0.15, 0.15, 0.15, 8), { p: [0, -0.075, 0] })
      .add('Gimbal', 'Metal', cyl(0.42, 0.42, 0.55, 8), { p: [0, -0.425, 0] })
      .add('Gimbal', 'Metal', cyl(0.15, 0.15, 0.45, 8), { p: [0.3, -0.2, -0.25], r: [90, 0, 0] })
      .add('Gimbal', 'Metal', cyl(0.13, 0.13, 0.45, 8), { p: [-0.3, -0.2, -0.25], r: [90, 0, 0] })
      .add('Gimbal', 'Aluminum', box(0.6, 0.5, 0.25), { p: [0, -0.45, 0.52] })
      .add('Gimbal', 'Steel', cyl(0.28, 0.28, 0.95, 8), { p: [0.62, -1.15, 0] })
      .add('Gimbal', 'Steel', cyl(0.3, 0.3, 0.8, 8), { p: [-0.62, -1.08, 0] })
      .add(
        'Gimbal',
        'Steel',
        lathe(
          [
            [0.3, -0.7],
            [0.3, -1.0],
            [0.24, -1.15],
            [0.15, -1.32],
            [0.131, -1.4],
          ],
          16,
        ),
      )
      .add(
        'Gimbal',
        'NozzleDark',
        lathe(
          [
            [0.131, -1.4],
            [0.28, -1.5],
            [0.48, -1.75],
            [0.68, -2.15],
            [0.86, -2.65],
            [1.0, -3.2],
            [1.1, -3.7],
            [1.195, -4.27],
          ],
          16,
        ),
      )
      .add('Gimbal', 'Metal', cyl(0.07, 0.07, 0.95, 6), { p: [0.4, -1.25, 0.28], r: [0, 0, -12] })
      .add('Gimbal', 'Metal', cyl(0.07, 0.07, 0.95, 6), { p: [0.4, -1.25, -0.28], r: [0, 0, -12] })
      .add('Gimbal', 'NozzleDark', ring(0.52, 0.07, 16, 6), { p: [0, -1.75, 0] })
      .add('Gimbal', 'NozzleDark', ring(0.8, 0.03, 16, 4), { p: [0, -2.4, 0] })
      .add('Gimbal', 'NozzleDark', ring(0.96, 0.03, 16, 4), { p: [0, -3.0, 0] })
      .add('Gimbal', 'NozzleDark', ring(1.08, 0.03, 16, 4), { p: [0, -3.6, 0] });

    return p;
  },
};

const raptorVacuum = {
  id: 'raptor-vacuum',
  category: 'engines',
  tier: 3,
  name: 'RaptorVacuum',
  displayName: 'Raptor Vacuum (RVac)',
  vehicle: 'Starship (2nd stage · 3 per ship)',
  role: 'Orbital methalox engine with a giant regeneratively cooled bell',
  summary: 'Fixed, non-gimbaled engine with a copper-toned chamber and a huge stainless-steel extension with a 2.4 m exit.',
  originNote: 'Fixed structural flange on top',
  references: ['references/parts/engines/raptor-vacuum/README.md'],
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
      attachTop: [0, 0, 0],
      gimbal: null,
      fxExhaust: { pos: [0, -4.7, 0], preset: 'exhaust_methalox' },
      budget: { triangles: 1500, meshes: 10 },
    });

    p.add('Root', 'Steel', cyl(0.35, 0.35, 0.15, 16), { p: [0, -0.075, 0] })
      .add('Root', 'Steel', cyl(0.22, 0.22, 0.55, 8), { p: [0.32, -0.45, 0] })
      .add('Root', 'Steel', cyl(0.2, 0.2, 0.55, 8), { p: [-0.32, -0.45, 0] })
      .add('Root', 'Steel', cyl(0.3, 0.3, 0.4, 8), { p: [0, -0.55, 0] })
      .add(
        'Root',
        'Copper',
        lathe(
          [
            [0.26, -0.75],
            [0.26, -1.2],
            [0.15, -1.38],
            [0.11, -1.45],
            [0.25, -1.65],
            [0.45, -1.95],
            [0.62, -2.15],
            [0.72, -2.3],
          ],
          16,
        ),
      )
      .add(
        'Root',
        'Steel',
        lathe(
          [
            [0.72, -2.3],
            [0.86, -2.8],
            [0.98, -3.35],
            [1.08, -3.9],
            [1.15, -4.35],
            [1.2, -4.7],
          ],
          16,
        ),
      )
      .add('Root', 'Metal', ring(0.73, 0.05, 16, 4), { p: [0, -2.3, 0] })
      .add('Root', 'Metal', cyl(0.1, 0.1, 0.7, 6), { p: [0.3, -0.95, 0.15], r: [0, 0, 20] })
      .add('Root', 'Metal', cyl(0.06, 0.06, 1.3, 6), { p: [-0.4, -1.55, 0], r: [0, 0, -12] });

    return p;
  },
};

const aj10190 = {
  id: 'aj10-190',
  category: 'engines',
  tier: 3,
  name: 'Aj10190',
  displayName: 'AJ10-190 (OMS)',
  vehicle: 'Orion ESM (Service Module)',
  role: 'Pressure-fed hypergolic orbital engine, restartable in deep space',
  summary: 'Valve and gimbal box on top with angled actuators and a long, smooth dark-alloy bell.',
  originNote: 'Top of the ESM mounting box',
  references: ['references/parts/engines/aj10-190/README.md'],
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
      attachTop: [0, 0, 0],
      gimbal: [0, -0.54, 0],
      fxExhaust: { pos: [0, -1.956, 0], preset: 'exhaust_hypergolic' },
      budget: { triangles: 1500, meshes: 10 },
    });

    p.add('Root', 'Steel', box(0.64, 0.54, 0.5), { p: [0, -0.27, 0] })
      .add('Root', 'Metal', ring(0.22, 0.03, 8, 5), { p: [0, -0.45, 0] })
      .add('Root', 'Metal', cyl(0.03, 0.03, 0.4, 6), { p: [0.28, -0.25, 0.1], r: [0, 0, 15] })
      .add('Root', 'Metal', cyl(0.03, 0.03, 0.4, 6), { p: [-0.28, -0.25, 0.1], r: [0, 0, -15] });

    p.add(
      'Gimbal',
      'NozzleDark',
      lathe(
        [
          [0.18, -0.54],
          [0.225, -0.58],
          [0.225, -0.62],
          [0.2, -0.64],
        ],
        12,
      ),
    ).add(
      'Gimbal',
      'NozzleDark',
      lathe(
        [
          [0.2, -0.64],
          [0.27, -0.8],
          [0.35, -1.05],
          [0.43, -1.35],
          [0.51, -1.65],
          [0.565, -1.9],
          [0.584, -1.94],
          [0.584, -1.956],
        ],
        16,
      ),
    );

    return p;
  },
};

const nextC = {
  id: 'next-c',
  category: 'engines',
  tier: 3,
  name: 'NextC',
  displayName: 'NEXT-C (Ion Thruster)',
  vehicle: 'DART / Deep Space Missions',
  role: 'High-power, long-life xenon ion thruster',
  summary: 'Short dark drum with three gimbal mounts at 120°, a large flat front grid and side neutralizer.',
  originNote: 'Rear mounting plane',
  references: ['references/parts/engines/next-c/README.md'],
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
      attachTop: [0, 0, 0],
      gimbal: [0, 0, 0],
      fxExhaust: { pos: [0, -0.376, 0], preset: 'exhaust_ion' },
      budget: { triangles: 1500, meshes: 10 },
    });

    p.add(
      'Gimbal',
      'HullBlack',
      lathe(
        [
          [0.15, 0.0],
          [0.15, -0.04],
          [0.24, -0.08],
          [0.262, -0.12],
          [0.262, -0.34],
          [0.25, -0.37],
          [0.21, -0.376],
        ],
        16,
      ),
    )
      .add('Gimbal', 'Titanium', cyl(0.2075, 0.2075, 0.006, 16), { p: [0, -0.373, 0] })
      .add('Gimbal', 'Steel', box(0.06, 0.06, 0.06), { p: [0, -0.35, 0.28] });

    for (let i = 0; i < 3; i++) {
      const deg = L(i);
      const rad = (deg * Math.PI) / 180;
      p.add('Gimbal', 'Aluminum', box(0.05, 0.08, 0.05), {
        p: [0.2 * Math.sin(rad), -0.04, 0.2 * Math.cos(rad)],
        r: [0, deg, 0],
      });
    }

    return p;
  },
};

export default [
  rutherford,
  rutherfordVacuum,
  mr107,
  merlin1d,
  merlin1dVacuum,
  rl10,
  r4d,
  nstar,
  raptor,
  rs25,
  raptorVacuum,
  aj10190,
  nextC,
];
