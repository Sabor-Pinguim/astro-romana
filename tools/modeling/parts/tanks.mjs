import { box, cyl, cylOpen, cylArc, ball, flatRing, lathe } from '../lib/shapes.mjs';
import { createPartBuilder } from '../lib/part-builder.mjs';

const electronStage1Tank = {
  id: 'electron-stage-1-tank',
  category: 'tanks',
  tier: 1,
  name: 'ElectronStage1Tank',
  displayName: 'Electron First Stage Tank',
  vehicle: 'Electron (1st stage)',
  role: 'Lightweight carbon-fiber structural tank (LOX + RP-1)',
  summary: 'Slim matte-black carbon-composite cylinder with a white band, top dome and cable raceway.',
  originNote: 'Bottom interface (above the 9-engine skirt)',
  references: ['references/parts/tanks/electron-stage-1-tank/README.md'],
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
      attachTop: [0, 11.9, 0],
      attachBottom: [0, 0, 0],
      budget: { triangles: 800, meshes: 8 },
    });

    p.add('Root', 'HullBlack', cyl(0.6, 0.55, 0.1, 16), { p: [0, 0.05, 0] })
      .add('Root', 'HullBlack', cylOpen(0.6, 0.6, 1.4, 16), { p: [0, 0.8, 0] })
      .add('Root', 'Hull', cylOpen(0.602, 0.602, 0.4, 16), { p: [0, 1.7, 0] })
      .add('Root', 'HullBlack', cylOpen(0.6, 0.6, 8.9, 16), { p: [0, 6.35, 0] })
      .add('Root', 'HullBlack', cylOpen(0.6, 0.6, 1.1, 16), { p: [0, 11.35, 0] })
      .add(
        'Root',
        'HullBlack',
        lathe(
          [
            [0.0, 11.05],
            [0.3, 11.0],
            [0.48, 10.93],
            [0.57, 10.86],
            [0.6, 10.8],
          ],
          16,
        ),
      )
      .add('Root', 'HullBlack', box(0.08, 8.8, 0.05), { p: [-0.16, 6.35, 0.6], r: [0, -15, 0] })
      .add('Root', 'Aluminum', cylOpen(0.605, 0.605, 0.04, 16), { p: [0, 11.88, 0] });

    return p;
  },
};

const hydrazineTank = {
  id: 'hydrazine-tank',
  category: 'tanks',
  tier: 1,
  name: 'HydrazineTank',
  displayName: 'Spherical Hydrazine Tank',
  vehicle: 'Probes / monopropellant RCS',
  role: 'Compact titanium hydrazine tank (MR-107)',
  summary: 'Small gray titanium sphere with a weld girth, four mounting tabs and polar fittings.',
  originNote: 'Tip of the lower polar port',
  references: ['references/parts/tanks/hydrazine-tank/README.md'],
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
      budget: { triangles: 800, meshes: 8 },
    });

    p.add(
      'Root',
      'Titanium',
      lathe(
        [
          [0.0, 0.465],
          [0.082, 0.449],
          [0.152, 0.402],
          [0.199, 0.332],
          [0.215, 0.25],
          [0.199, 0.168],
          [0.152, 0.098],
          [0.082, 0.051],
          [0.0, 0.035],
        ],
        8,
      ),
    ).add('Root', 'Titanium', cylOpen(0.222, 0.222, 0.02, 8), { p: [0, 0.25, 0] });

    for (let i = 0; i < 4; i++) {
      const deg = i * 90;
      const rad = (deg * Math.PI) / 180;
      p.add('Root', 'Titanium', box(0.05, 0.012, 0.04), {
        p: [0.24 * Math.sin(rad), 0.25, 0.24 * Math.cos(rad)],
        r: [0, deg, 0],
      });
    }

    p.add('Root', 'Metal', cyl(0.0125, 0.0125, 0.035, 6), { p: [0, 0.0175, 0] }).add(
      'Root',
      'Metal',
      cyl(0.0125, 0.0125, 0.035, 6),
      { p: [0, 0.4825, 0] },
    );

    return p;
  },
};

const falcon9Stage1Tank = {
  id: 'falcon-9-stage-1-tank',
  category: 'tanks',
  tier: 2,
  name: 'Falcon9Stage1Tank',
  displayName: 'Falcon 9 First Stage Tank',
  vehicle: 'Falcon 9 (1st stage)',
  role: 'Reusable aluminum-lithium booster tank (LOX + RP-1)',
  summary: 'Tall white cylinder with a black interstage on top, 4 stowed landing legs, 4 titanium grid fins and a raceway.',
  originNote: 'Bottom interface over the 9 Merlin engines',
  references: ['references/parts/tanks/falcon-9-stage-1-tank/README.md'],
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
      attachTop: [0, 47.1, 0],
      attachBottom: [0, 0, 0],
      budget: { triangles: 800, meshes: 8 },
    });

    p.add('Root', 'HullBlack', cyl(1.83, 1.83, 0.05, 16), { p: [0, 0.025, 0] })
      .add('Root', 'Aluminum', cylOpen(1.83, 1.83, 1.45, 16), { p: [0, 0.775, 0] })
      .add('Root', 'Hull', cylOpen(1.83, 1.83, 41.1, 16), { p: [0, 22.05, 0] })
      .add('Root', 'HullBlack', cylOpen(1.83, 1.83, 4.5, 16), { p: [0, 44.85, 0] })
      .add(
        'Root',
        'Aluminum',
        lathe(
          [
            [0.0, 43.9],
            [0.9, 43.75],
            [1.4, 43.4],
            [1.7, 42.95],
            [1.83, 42.6],
          ],
          16,
        ),
      );

    for (let i = 0; i < 4; i++) {
      const deg = 45 + i * 90;
      const rad = (deg * Math.PI) / 180;
      p.add('Root', 'HullBlack', box(0.9, 9.0, 0.35), {
        p: [2.005 * Math.sin(rad), 4.8, 2.005 * Math.cos(rad)],
        r: [0, deg, 0],
      });
    }

    for (let i = 0; i < 4; i++) {
      const deg = i * 90;
      const rad = (deg * Math.PI) / 180;
      p.add('Root', 'Titanium', box(1.2, 1.5, 0.15), {
        p: [1.905 * Math.sin(rad), 45.9, 1.905 * Math.cos(rad)],
        r: [0, deg, 0],
      });
    }

    p.add('Root', 'Hull', box(0.4, 40.0, 0.15), { p: [0, 22.0, 1.905] }).add(
      'Root',
      'Aluminum',
      cylOpen(1.84, 1.84, 0.08, 16),
      { p: [0, 47.06, 0] },
    );

    return p;
  },
};

const centaurIIITank = {
  id: 'centaur-iii-tank',
  category: 'tanks',
  tier: 2,
  name: 'CentaurIIITank',
  displayName: 'Centaur III Upper Stage Tank',
  vehicle: 'Atlas V Centaur (upper stage)',
  role: 'Ultralight stainless-steel balloon tank (LOX + LH2)',
  summary: 'Sturdy dual-tank capsule with an upper adapter skirt, side tunnel, helium bottles and thrust structure.',
  originNote: 'Bottom tip of the aft cone',
  references: ['references/parts/tanks/centaur-iii-tank/README.md'],
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
      attachTop: [0, 9.45, 0],
      attachBottom: [0, 0, 0],
      budget: { triangles: 800, meshes: 8 },
    });

    p.add(
      'Root',
      'Hull',
      lathe(
        [
          [0.0, 9.4],
          [0.47, 9.35],
          [0.9, 9.27],
          [1.24, 9.05],
          [1.45, 8.79],
          [1.525, 8.45],
          [1.525, 0.95],
          [1.45, 0.66],
          [1.24, 0.4],
          [0.9, 0.18],
          [0.47, 0.05],
          [0.0, 0.0],
        ],
        12,
      ),
    )
      .add('Root', 'Hull', cylOpen(1.535, 1.535, 1.0, 12), { p: [0, 8.95, 0] })
      .add('Root', 'Aluminum', flatRing(1.535, 1.3, 0.04, 12), { p: [0, 9.43, 0] })
      .add('Root', 'Hull', box(0.2, 7.2, 0.12), { p: [1.58, 5.0, 0] })
      .add('Root', 'Hull', box(0.32, 1.4, 0.3), { p: [1.62, 1.6, 0] })
      .add('Root', 'HullBlack', cyl(0.292, 0.292, 1.354, 8), { p: [0.85, 0.45, -0.55], r: [0, 0, 60] })
      .add('Root', 'HullBlack', cyl(0.292, 0.292, 1.354, 8), { p: [-0.85, 0.45, -0.55], r: [0, 0, -60] })
      .add('Root', 'Titanium', ball(0.25, 6, 4), { p: [0.65, 0.35, 0.75] })
      .add('Root', 'Titanium', ball(0.25, 6, 4), { p: [-0.65, 0.35, 0.75] })
      .add('Root', 'Metal', box(1.9, 0.25, 0.35), { p: [0, 0.125, 0] })
      .add('Root', 'Metal', cyl(0.08, 0.08, 1.3, 5), { p: [0.9, 0.55, 0], r: [0, 0, 50] });

    return p;
  },
};

const dawnXenonTank = {
  id: 'dawn-xenon-tank',
  category: 'tanks',
  tier: 2,
  name: 'DawnXenonTank',
  displayName: 'Dawn Xenon Tank',
  vehicle: 'Dawn probe (NSTAR / NEXT-C ion propulsion)',
  role: 'Gold-foil-wrapped high-pressure xenon tank',
  summary: 'Near-spherical composite vessel: upper half wrapped in gold MLI, lower half black with a perforated skirt.',
  originNote: 'Bottom edge of the mounting skirt',
  references: ['references/parts/tanks/dawn-xenon-tank/README.md'],
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
      attachTop: [0, 0.675, 0],
      attachBottom: [0, 0, 0],
      budget: { triangles: 800, meshes: 8 },
    });

    p.add(
      'Root',
      'FoilGold',
      lathe(
        [
          [0.0, 0.655],
          [0.15, 0.637],
          [0.26, 0.598],
          [0.345, 0.544],
          [0.405, 0.481],
          [0.44, 0.417],
          [0.455, 0.335],
        ],
        16,
      ),
    )
      .add(
        'Root',
        'HullBlack',
        lathe(
          [
            [0.455, 0.335],
            [0.44, 0.253],
            [0.405, 0.189],
            [0.345, 0.126],
            [0.26, 0.072],
            [0.15, 0.033],
            [0.0, 0.015],
          ],
          16,
        ),
      )
      .add('Root', 'HullBlack', cylOpen(0.458, 0.458, 0.335, 16), { p: [0, 0.1675, 0] })
      .add('Root', 'Titanium', cyl(0.06, 0.06, 0.02, 16), { p: [0, 0.665, 0] });

    for (let i = 0; i < 8; i++) {
      const deg = i * 45;
      const rad = (deg * Math.PI) / 180;
      p.add('Root', 'Titanium', box(0.07, 0.03, 0.05), {
        p: [0.45 * Math.sin(rad), 0.015, 0.45 * Math.cos(rad)],
        r: [0, deg, 0],
      });
    }

    return p;
  },
};

const slsCoreStageTanks = {
  id: 'sls-core-stage-tanks',
  category: 'tanks',
  tier: 3,
  name: 'SlsCoreStageTanks',
  displayName: 'SLS Main Tanks (Core Stage)',
  vehicle: 'Space Launch System (core stage)',
  role: 'Giant cryogenic tank with orange insulating foam (LH2 + LOX)',
  summary: 'Massive 8.4 m diameter orange-foam cylinder with white structural rings, aft skirt and side feed lines.',
  originNote: 'Bottom plane of the 4-engine RS-25 section',
  references: ['references/parts/tanks/sls-core-stage-tanks/README.md'],
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
      attachTop: [0, 59.9, 0],
      attachBottom: [0, 0, 0],
      extraAnchors: [
        { name: 'Attach_Engine_1', pos: [1.6, 1.5, 1.6] },
        { name: 'Attach_Engine_2', pos: [-1.6, 1.5, 1.6] },
        { name: 'Attach_Engine_3', pos: [1.6, 1.5, -1.6] },
        { name: 'Attach_Engine_4', pos: [-1.6, 1.5, -1.6] },
      ],
      budget: { triangles: 800, meshes: 8 },
    });

    p.add('Root', 'Hull', cylOpen(4.2, 4.2, 6.9, 16), { p: [0, 3.45, 0] })
      .add('Root', 'Foam', cyl(4.2, 4.2, 33.5, 16), { p: [0, 23.65, 0] })
      .add('Root', 'Foam', cyl(4.25, 4.25, 6.7, 16), { p: [0, 43.75, 0] })
      .add('Root', 'Foam', cyl(4.2, 4.2, 9.6, 16), { p: [0, 51.9, 0] })
      .add('Root', 'Foam', cylOpen(4.2, 4.2, 3.2, 16), { p: [0, 58.3, 0] })
      .add('Root', 'Hull', cyl(4.27, 4.27, 0.4, 16), { p: [0, 40.6, 0] })
      .add('Root', 'Hull', cyl(4.27, 4.27, 0.4, 16), { p: [0, 56.9, 0] })
      .add(
        'Root',
        'Foam',
        lathe(
          [
            [0.0, 59.7],
            [1.8, 59.4],
            [3.0, 58.8],
            [3.8, 57.9],
            [4.2, 56.7],
          ],
          16,
        ),
      )
      .add('Root', 'HullBlack', cyl(4.2, 4.2, 0.04, 16), { p: [0, 0.02, 0] })
      .add('Root', 'Foam', cyl(0.3, 0.3, 36.0, 6), { p: [4.5, 24.9, 0] })
      .add('Root', 'Foam', cyl(0.3, 0.3, 36.0, 6), { p: [-4.5, 24.9, 0] })
      .add('Root', 'Foam', box(0.5, 33.5, 0.3), { p: [0, 23.65, 4.35] });

    return p;
  },
};

const starshipTanks = {
  id: 'starship-tanks',
  category: 'tanks',
  tier: 3,
  name: 'StarshipTanks',
  displayName: 'Starship Tanks (LOX + CH4)',
  vehicle: 'Starship V3 (2nd stage)',
  role: 'Stainless-steel structural tank with heat shield and aft flaps',
  summary: '9 m stainless-steel cylinder split vertically, with a half shell of black tiles and two large aft fins.',
  originNote: 'Bottom edge of the engine skirt',
  references: ['references/parts/tanks/starship-tanks/README.md'],
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
      attachTop: [0, 34.2, 0],
      attachBottom: [0, 0, 0],
      budget: { triangles: 800, meshes: 8 },
    });

    p.add('Root', 'Steel', cylOpen(4.5, 4.5, 34.2, 16), { p: [0, 17.1, 0] })
      .add('Root', 'HullBlack', cylArc(4.55, 4.55, 34.2, 8, -Math.PI / 2, Math.PI), { p: [0, 17.1, 0] })
      .add(
        'Root',
        'Steel',
        lathe(
          [
            [0.0, 36.7],
            [2.0, 36.4],
            [3.4, 35.8],
            [4.2, 35.0],
            [4.5, 34.2],
          ],
          16,
        ),
      )
      .add('Root', 'HullBlack', box(3.0, 9.0, 0.4), { p: [6.0, 6.0, 0.5] })
      .add('Root', 'HullBlack', box(3.0, 9.0, 0.4), { p: [-6.0, 6.0, 0.5] })
      .add('Root', 'Steel', cyl(4.5, 4.5, 0.04, 16), { p: [0, 0.3, 0] });

    return p;
  },
};

const orionEsmTanks = {
  id: 'orion-esm-tanks',
  category: 'tanks',
  tier: 3,
  name: 'OrionEsmTanks',
  displayName: 'Orion ESM Tanks (MMH + MON)',
  vehicle: 'Orion European Service Module',
  role: 'Quad set of hypergolic tanks around the central engine',
  summary: 'Four vertical titanium capsules in a square on an annular deck, with two spherical helium tanks.',
  originNote: 'Top surface of the deck (central AJ10-190 mount below)',
  references: ['references/parts/tanks/orion-esm-tanks/README.md'],
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
      attachTop: [0, 2.542, 0],
      attachBottom: [0, 0, 0],
      budget: { triangles: 800, meshes: 8 },
    });

    const capsuleProfile = [
      [0.0, 2.542],
      [0.408, 2.373],
      [0.577, 1.965],
      [0.577, 0.577],
      [0.408, 0.169],
      [0.0, 0.0],
    ];

    for (const [x, z] of [
      [0.85, 0.85],
      [-0.85, -0.85],
      [-0.85, 0.85],
      [0.85, -0.85],
    ]) {
      p.add('Root', 'Titanium', lathe(capsuleProfile, 8), { p: [x, 0, z] });
    }

    p.add('Root', 'HullBlack', ball(0.4, 6, 4), { p: [1.25, 1.6, 0] })
      .add('Root', 'HullBlack', ball(0.4, 6, 4), { p: [-1.25, 1.6, 0] })
      .add('Root', 'Metal', flatRing(1.9, 0.6, 0.05, 16), { p: [0, -0.025, 0] });

    return p;
  },
};

export default [
  electronStage1Tank,
  hydrazineTank,
  falcon9Stage1Tank,
  centaurIIITank,
  dawnXenonTank,
  slsCoreStageTanks,
  starshipTanks,
  orionEsmTanks,
];
