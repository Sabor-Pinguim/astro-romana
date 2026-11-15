import { box, cyl, cylOpen, ball, ring, flatRing } from '../lib/shapes.mjs';
import { createPartBuilder } from '../lib/part-builder.mjs';

const HELENA_COMMON_REF = ['references/parts/stage-equipment.md', 'docs/resources/equipamentos-estagios.md'];

// ---------------------------------------------------------------------------
// A. Helena — Pilot, Navigation, EDL & Aerial Scouts
// ---------------------------------------------------------------------------

const trussIngenuity = {
  id: 'truss-ingenuity',
  category: 'equipment',
  tier: 2,
  name: 'TrussIngenuity',
  displayName: 'Scout Helicopter Bay (Ingenuity / SkyFall)',
  vehicle: 'Helena · Middle Stage (Aerial Scout)',
  role: 'Aerial reconnaissance on Mars (`H-S1`), revealing targets and ice',
  summary:
    'Aluminum truss cradle housing the coaxial helicopter with a gold fuselage, top solar panel, twin counter-rotating rotors and splayed landing legs.',
  originNote: 'Center of the bottom mounting base (y = 0, fits the cutaway stage deck)',
  references: [...HELENA_COMMON_REF, 'references/experiments/mars-experiments.md'],
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
      attachTop: [0, 0.66, 0],
      attachBottom: [0, 0, 0],
      budget: { triangles: 700, meshes: 12 },
    });

    // Bottom stowage baseplate & corner shock pads
    p.add('Root', 'Aluminum', box(0.46, 0.04, 0.46), { p: [0, 0.02, 0] });
    for (const [sx, sz] of [
      [-1, -1],
      [1, -1],
      [-1, 1],
      [1, 1],
    ]) {
      p.add('Root', 'Strap', box(0.05, 0.02, 0.05), { p: [sx * 0.21, 0.05, sz * 0.21] })
        // 4 outer truss corner posts forming the bay deployment cage
        .add('Root', 'Metal', cyl(0.012, 0.012, 0.58, 6), { p: [sx * 0.21, 0.35, sz * 0.21] });
    }
    // Top perimeter truss frame at y = 0.64 m
    for (const sz of [-1, 1]) {
      p.add('Root', 'Aluminum', box(0.44, 0.025, 0.025), { p: [0, 0.64, sz * 0.21] });
    }
    for (const sx of [-1, 1]) {
      p.add('Root', 'Aluminum', box(0.025, 0.025, 0.44), { p: [sx * 0.21, 0.64, 0] });
    }

    // Ingenuity fuselage & avionics gold cube suspended inside rack
    p.add('Root', 'FoilGold', box(0.15, 0.14, 0.15), { p: [0, 0.26, 0] })
      .add('Root', 'Steel', cyl(0.022, 0.026, 0.26, 8), { p: [0, 0.43, 0] })
      // Lower & upper coaxial 2-blade/4-blade rotor silhouettes
      .add('Root', 'HullBlack', box(0.62, 0.012, 0.042), { p: [0, 0.46, 0], r: [0, 22, 0] })
      .add('Root', 'HullBlack', box(0.62, 0.012, 0.042), { p: [0, 0.52, 0], r: [0, -28, 0] })
      // Top rectangular solar wing above rotors
      .add('Root', 'Pack', box(0.42, 0.016, 0.14), { p: [0, 0.57, 0] })
      .add('Root', 'Visor', box(0.38, 0.018, 0.11), { p: [0, 0.572, 0] })
      .add('Root', 'LedGreen', box(0.03, 0.02, 0.02), { p: [0, 0.26, 0.08] });

    // 4 splayed carbon-titanium helicopter landing legs resting on cradle pads
    for (const [sx, sz] of [
      [-1, -1],
      [1, -1],
      [-1, 1],
      [1, 1],
    ]) {
      p.add('Root', 'Titanium', cyl(0.009, 0.008, 0.18, 6), {
        p: [sx * 0.11, 0.14, sz * 0.11],
        r: [-sz * 34, 0, sx * 34],
      }).add('Root', 'Strap', cyl(0.016, 0.016, 0.018, 6), { p: [sx * 0.15, 0.07, sz * 0.15] });
    }

    return p;
  },
};

const edlTrnMedli2 = {
  id: 'edl-trn-medli2',
  category: 'equipment',
  tier: 2,
  name: 'EdlTrnMedli2',
  displayName: 'TRN Module, MEDLI2 Sensors & DSAC Atomic Clock',
  vehicle: 'Helena · Middle Stage (Navigation & EDL)',
  role: 'Precision landing (`H-S2`), aerobraking (`H-O1`) and protection against sensor failures',
  summary:
    'Avionics platform with the gold DSAC Atomic Clock cube, the angled LCAM optical camera of the TRN system and the MEDLI2 thermal sensor manifold.',
  originNote: 'Base of the damping tray (y = 0)',
  references: [...HELENA_COMMON_REF, 'references/experiments/mars-experiments.md'],
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
      attachTop: [0, 0.46, 0],
      attachBottom: [0, 0, 0],
      budget: { triangles: 700, meshes: 12 },
    });

    // Base isolation mounts & avionics deck
    for (const [sx, sz] of [
      [-1, -1],
      [1, -1],
      [-1, 1],
      [1, 1],
    ]) {
      p.add('Root', 'Strap', cyl(0.03, 0.035, 0.04, 6), { p: [sx * 0.22, 0.02, sz * 0.16] });
    }
    p.add('Root', 'Aluminum', box(0.56, 0.04, 0.42), { p: [0, 0.06, 0] });

    // Front-right (+X, +Z): Deep Space Atomic Clock golden cube (25 cm scale) + lock LED
    p.add('Root', 'FoilGold', box(0.24, 0.24, 0.22), { p: [0.13, 0.20, 0.06] })
      .add('Root', 'Aluminum', box(0.20, 0.03, 0.18), { p: [0.13, 0.335, 0.06] })
      .add('Root', 'LedGreen', box(0.06, 0.02, 0.02), { p: [0.13, 0.25, 0.175] });

    // Front-left (-X, +Z): TRN LCAM optical head tilted down-forward + sunshade baffle
    p.add('Root', 'Titanium', box(0.14, 0.16, 0.16), { p: [-0.15, 0.16, 0.04] })
      .add('Root', 'HullBlack', box(0.12, 0.10, 0.16), { p: [-0.15, 0.24, 0.08], r: [28, 0, 0] })
      .add('Root', 'Visor', cyl(0.045, 0.028, 0.05, 10), { p: [-0.15, 0.20, 0.16], r: [118, 0, 0] });

    // Rear MEDLI2 thermal/pressure sensor manifold arc + 5 thermocouple bosses + harness
    p.add('Root', 'Copper', cyl(0.018, 0.018, 0.44, 8), { p: [0, 0.20, -0.14], r: [0, 0, 90] })
      .add('Root', 'Aluminum', cyl(0.014, 0.014, 0.18, 6), { p: [-0.20, 0.14, -0.14] })
      .add('Root', 'Aluminum', cyl(0.014, 0.014, 0.18, 6), { p: [0.20, 0.14, -0.14] });
    for (const bx of [-0.16, -0.08, 0, 0.08, 0.16]) {
      p.add('Root', 'Titanium', cyl(0.02, 0.024, 0.06, 6), { p: [bx, 0.23, -0.14] });
    }

    // Upper frame tie-bar
    p.add('Root', 'Steel', box(0.52, 0.03, 0.05), { p: [0, 0.44, 0] })
      .add('Root', 'Steel', cyl(0.014, 0.014, 0.36, 6), { p: [-0.25, 0.26, 0] })
      .add('Root', 'Steel', cyl(0.014, 0.014, 0.36, 6), { p: [0.25, 0.26, 0] });

    return p;
  },
};

const edlAspireLoftid = {
  id: 'edl-aspire-loftid',
  category: 'equipment',
  tier: 3,
  name: 'EdlAspireLoftid',
  displayName: 'ASPIRE Supersonic Mortar & LOFTID Inflatable Shield',
  vehicle: 'Helena · Middle Stage (Heavy EDL)',
  role: 'Raises the maximum mass that can survive a Mars landing',
  summary:
    'Central mortar tube for the 21.5 m supersonic parachute, ringed by the folded orange HIAD inflatable shield and two nitrogen COPV bottles.',
  originNote: 'Bottom ring of the structural base (y = 0)',
  references: [...HELENA_COMMON_REF, 'references/experiments/mars-experiments.md'],
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
      attachTop: [0, 0.68, 0],
      attachBottom: [0, 0, 0],
      budget: { triangles: 700, meshes: 12 },
    });

    // Base structural ring plate
    p.add('Root', 'Titanium', cyl(0.32, 0.33, 0.04, 12), { p: [0, 0.02, 0] });

    // Central ASPIRE supersonic parachute mortar cannon + sabot lid
    p.add('Root', 'Aluminum', cyl(0.135, 0.145, 0.60, 12), { p: [0, 0.34, 0] })
      .add('Root', 'Steel', cyl(0.145, 0.145, 0.04, 12), { p: [0, 0.66, 0] })
      .add('Root', 'Strap', cyl(0.15, 0.15, 0.04, 10), { p: [0, 0.56, 0] });

    // Concentric LOFTID orange inflatable TPS aeroshell packed torus around the mortar base
    p.add('Root', 'Foam', ring(0.24, 0.075, 12, 6), { p: [0, 0.19, 0] });
    for (const deg of [30, 90, 150, 210, 270, 330]) {
      const rad = (deg * Math.PI) / 180;
      p.add('Root', 'HullBlack', box(0.03, 0.16, 0.16), {
        p: [Math.sin(rad) * 0.24, 0.19, Math.cos(rad) * 0.24],
        r: [0, deg, 0],
      });
    }

    // Twin high-pressure nitrogen inflation COPV bottles on left & right
    for (const sx of [-1, 1]) {
      p.add('Root', 'Titanium', cyl(0.045, 0.045, 0.30, 8), { p: [sx * 0.29, 0.44, -0.02] })
        .add('Root', 'Copper', cyl(0.02, 0.025, 0.05, 6), { p: [sx * 0.29, 0.61, -0.02] });
    }

    return p;
  },
};

const attitudeReactionWheels = {
  id: 'attitude-reaction-wheels',
  category: 'equipment',
  tier: 1,
  name: 'AttitudeReactionWheels',
  displayName: '4 Reaction Wheels & Star Trackers',
  vehicle: 'Helena · Middle Stage (Attitude Control)',
  role: 'Orbital roll (`H-O2`) and redundancy against mechanical failure',
  summary:
    'Tetrahedral frame with four tilted flywheels (3 active + 1 spare) and two star-tracker optical baffles.',
  originNote: 'Bottom circular mounting plate (y = 0)',
  references: [...HELENA_COMMON_REF, 'references/experiments/experiments.md'],
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
      attachTop: [0, 0.50, 0],
      attachBottom: [0, 0, 0],
      budget: { triangles: 700, meshes: 12 },
    });

    p.add('Root', 'Aluminum', cyl(0.28, 0.30, 0.04, 12), { p: [0, 0.02, 0] })
      .add('Root', 'Titanium', cyl(0.08, 0.24, 0.22, 4), { p: [0, 0.15, 0], r: [0, 45, 0] });

    // 4 reaction wheel pancake drums arranged around the tetrahedral pyramid
    for (const [deg, rx, rz] of [
      [45, 38, 0],
      [135, 38, 0],
      [225, 38, 0],
      [315, 38, 0],
    ]) {
      const rad = (deg * Math.PI) / 180;
      p.add('Root', 'HullBlack', cyl(0.095, 0.095, 0.06, 10), {
        p: [Math.sin(rad) * 0.15, 0.18, Math.cos(rad) * 0.15],
        r: [Math.cos(rad) * rx, 0, -Math.sin(rad) * rx + rz],
      }).add('Root', 'Steel', cyl(0.045, 0.045, 0.072, 8), {
        p: [Math.sin(rad) * 0.15, 0.18, Math.cos(rad) * 0.15],
        r: [Math.cos(rad) * rx, 0, -Math.sin(rad) * rx + rz],
      });
    }

    // Twin optical star tracker baffles + gold collar + copper conduits
    for (const sx of [-1, 1]) {
      p.add('Root', 'Aluminum', cyl(0.055, 0.032, 0.16, 8), {
        p: [sx * 0.11, 0.38, 0.08],
        r: [32, 0, -sx * 24],
      })
        .add('Root', 'FoilGold', cyl(0.036, 0.036, 0.05, 8), {
          p: [sx * 0.08, 0.31, 0.04],
          r: [32, 0, -sx * 24],
        })
        .add('Root', 'Visor', cyl(0.048, 0.048, 0.02, 8), {
          p: [sx * 0.13, 0.44, 0.12],
          r: [32, 0, -sx * 24],
        })
        .add('Root', 'Copper', cyl(0.012, 0.012, 0.24, 6), { p: [sx * 0.06, 0.18, 0] });
    }

    return p;
  },
};

// ---------------------------------------------------------------------------
// B. Lucas — Systems Engineer (Power, Cryogenics, ISRU & Drilling)
// ---------------------------------------------------------------------------

const powerRosaSolar = {
  id: 'power-rosa-solar',
  category: 'equipment',
  tier: 2,
  name: 'PowerRosaSolar',
  displayName: 'Roll-Out Solar Array Pods (ROSA / iROSA)',
  vehicle: 'Lucas · Middle Stage (Solar Power)',
  role: 'Lightweight power generation in orbit and on the surface (`L-O1`)',
  summary:
    'Central drive spar flanked by two retractable rolls of flexible photovoltaic blanket with composite tension booms and gold end caps.',
  originNote: 'Base of the structural spar (y = 0)',
  references: ['references/parts/stage-equipment.md', 'docs/resources/equipamentos-estagios.md'],
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
      attachTop: [0, 0.70, 0],
      attachBottom: [0, 0, 0],
      budget: { triangles: 700, meshes: 12 },
    });

    // Base mounting crossbar & central motor spine
    p.add('Root', 'Aluminum', box(0.52, 0.04, 0.28), { p: [0, 0.02, 0] })
      .add('Root', 'Aluminum', box(0.11, 0.64, 0.13), { p: [0, 0.36, 0] })
      .add('Root', 'Steel', box(0.50, 0.04, 0.14), { p: [0, 0.68, 0] })
      .add('Root', 'Copper', cyl(0.06, 0.06, 0.10, 8), { p: [0, 0.36, 0], r: [0, 0, 90] });

    // Left & right stowed flexible solar blanket drums + gold caps + composite slit booms
    for (const sx of [-1, 1]) {
      p.add('Root', 'Pack', cyl(0.095, 0.095, 0.56, 12), { p: [sx * 0.175, 0.36, 0] })
        .add('Root', 'Visor', box(0.03, 0.52, 0.08), { p: [sx * 0.175, 0.36, 0.075] })
        .add('Root', 'FoilGold', cyl(0.102, 0.102, 0.04, 10), { p: [sx * 0.175, 0.09, 0] })
        .add('Root', 'FoilGold', cyl(0.102, 0.102, 0.04, 10), { p: [sx * 0.175, 0.63, 0] })
        .add('Root', 'HullBlack', cyl(0.015, 0.015, 0.58, 6), { p: [sx * 0.28, 0.36, 0.06] })
        .add('Root', 'HullBlack', cyl(0.015, 0.015, 0.58, 6), { p: [sx * 0.28, 0.36, -0.06] });
    }

    return p;
  },
};

const powerMmrtgKilopower = {
  id: 'power-mmrtg-kilopower',
  category: 'equipment',
  tier: 3,
  name: 'PowerMmrtgKilopower',
  displayName: 'MMRTG / Kilopower Nuclear Generator & Li-ion Bank',
  vehicle: 'Lucas · Middle Stage (Continuous Power)',
  role: 'Continuous day/night power immune to dust storms + 900 W peaks',
  summary:
    'White MMRTG cylinder with 8 radial radiator fins, mounted beside a gold thermal vault of Li-ion batteries that covers MOXIE peaks.',
  originNote: 'Base of the lower thermal platform (y = 0)',
  references: ['references/parts/stage-equipment.md', 'docs/resources/equipamentos-estagios.md'],
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
      attachTop: [0, 0.66, 0],
      attachBottom: [0, 0, 0],
      budget: { triangles: 700, meshes: 12 },
    });

    p.add('Root', 'Titanium', box(0.56, 0.04, 0.40), { p: [0, 0.02, 0] });

    // Right: Finned white MMRTG cylinder + Stirling cap + 8 radial cooling fins
    p.add('Root', 'Hull', cyl(0.105, 0.115, 0.52, 10), { p: [0.14, 0.30, 0] })
      .add('Root', 'FoilGold', cyl(0.11, 0.11, 0.06, 10), { p: [0.14, 0.58, 0] })
      .add('Root', 'Steel', cyl(0.055, 0.08, 0.05, 8), { p: [0.14, 0.635, 0] });
    for (let i = 0; i < 4; i++) {
      p.add('Root', 'Titanium', box(0.32, 0.46, 0.014), { p: [0.14, 0.30, 0], r: [0, i * 45, 0] });
    }

    // Left: Perseverance Li-ion Peak Battery Vault + Copper busbars + Charge LED
    p.add('Root', 'FoilGold', box(0.22, 0.34, 0.24), { p: [-0.15, 0.21, 0] })
      .add('Root', 'Strap', box(0.24, 0.04, 0.26), { p: [-0.15, 0.12, 0] })
      .add('Root', 'Strap', box(0.24, 0.04, 0.26), { p: [-0.15, 0.31, 0] })
      .add('Root', 'LedGreen', box(0.08, 0.03, 0.018), { p: [-0.15, 0.22, 0.125] })
      .add('Root', 'Copper', cyl(0.016, 0.016, 0.18, 6), { p: [-0.01, 0.24, 0.04], r: [0, 0, 90] })
      .add('Root', 'Copper', cyl(0.016, 0.016, 0.18, 6), { p: [-0.01, 0.16, 0.04], r: [0, 0, 90] });

    return p;
  },
};

const isruMoxieRodwell = {
  id: 'isru-moxie-rodwell',
  category: 'equipment',
  tier: 2,
  name: 'IsruMoxieRodwell',
  displayName: 'MOXIE ISRU Oxygen Reactor & Rodwell Extractor',
  vehicle: 'Lucas · Middle Stage (O₂ & Water Production)',
  role: 'Makes oxygen from Martian air (`L-S1`, 300 W) and extracts water from ice',
  summary:
    'Insulated gold box of the 800 °C MOXIE reactor with a top HEPA compressor and thermal glow, coupled to spherical O₂ tanks and a Rodwell heater probe.',
  originNote: 'Bottom support plate (y = 0)',
  references: ['references/parts/stage-equipment.md', 'docs/resources/equipamentos-estagios.md'],
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
      attachTop: [0, 0.62, 0],
      attachBottom: [0, 0, 0],
      budget: { triangles: 700, meshes: 12 },
    });

    p.add('Root', 'Aluminum', box(0.56, 0.04, 0.42), { p: [0, 0.02, 0] });

    // Left: MOXIE thermal gold SOXE enclosure + HEPA CO2 compressor scroll + internal 800C heater glow
    p.add('Root', 'FoilGold', box(0.28, 0.28, 0.28), { p: [-0.12, 0.18, 0] })
      .add('Root', 'Aluminum', cyl(0.08, 0.095, 0.12, 10), { p: [-0.12, 0.38, 0] })
      .add('Root', 'Copper', box(0.14, 0.08, 0.04), { p: [-0.12, 0.18, 0.14] })
      .add('Root', 'Lamp', box(0.09, 0.03, 0.02), { p: [-0.12, 0.18, 0.155] });

    // Right: Twin spherical O2 accumulator tanks + Rodwell thermal probe spear + orange cryo hose
    p.add('Root', 'Titanium', ball(0.09, 8, 6), { p: [0.16, 0.15, 0.08] })
      .add('Root', 'Titanium', ball(0.09, 8, 6), { p: [0.16, 0.35, 0.08] })
      .add('Root', 'Steel', cyl(0.024, 0.016, 0.56, 8), { p: [0.18, 0.32, -0.10] })
      .add('Root', 'Foam', cyl(0.016, 0.016, 0.24, 6), { p: [0.05, 0.30, -0.02], r: [0, 0, 72] });

    return p;
  },
};

const drillCorerCryo = {
  id: 'drill-corer-cryo',
  category: 'equipment',
  tier: 2,
  name: 'DrillCorerCryo',
  displayName: 'Subsurface Drill Tower & Active Cryocooler',
  vehicle: 'Lucas · Middle Stage (Drilling & Cryogenics)',
  role: 'Collects rock cores (`L-S2`), keeps detectors cold (`L-O2`) and supports EVA repair',
  summary:
    'Vertical rails of the 2 m rotary-percussive drill with two spare bits, paired with the copper-coil cryogenic loop and the FX_Sparks anchor.',
  originNote: 'Structural base plate (y = 0)',
  references: ['references/parts/stage-equipment.md', 'docs/resources/equipamentos-estagios.md'],
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
      attachTop: [0, 0.72, 0],
      attachBottom: [0, 0, 0],
      fxAnchors: [{ name: 'FX_Sparks', pos: [-0.14, 0.26, 0.12], rot: [30, 0, 0], preset: 'sparks' }],
      budget: { triangles: 700, meshes: 12 },
    });

    p.add('Root', 'Titanium', box(0.56, 0.04, 0.42), { p: [0, 0.02, 0] });

    // Right: Subsurface drill tower rails, gearbox head, fluted auger bit, 2 spare bits
    for (const dx of [-0.07, 0.07]) {
      p.add('Root', 'Steel', box(0.025, 0.66, 0.03), { p: [0.14 + dx, 0.37, 0] });
    }
    p.add('Root', 'Steel', box(0.18, 0.03, 0.08), { p: [0.14, 0.70, 0] })
      .add('Root', 'Aluminum', box(0.14, 0.14, 0.14), { p: [0.14, 0.46, 0.04] })
      .add('Root', 'NozzleDark', cyl(0.028, 0.008, 0.30, 6), { p: [0.14, 0.24, 0.04] })
      .add('Root', 'Steel', cyl(0.012, 0.006, 0.22, 6), { p: [0.24, 0.22, 0.12] })
      .add('Root', 'Steel', cyl(0.012, 0.006, 0.22, 6), { p: [0.24, 0.22, 0.06] });

    // Left: Active cryocooler loop (CRISM / AMS-02 Stirling pistons, copper coils, radiator)
    p.add('Root', 'Hull', box(0.20, 0.36, 0.03), { p: [-0.15, 0.28, -0.10] })
      .add('Root', 'Titanium', cyl(0.045, 0.045, 0.18, 8), { p: [-0.19, 0.16, 0.04] })
      .add('Root', 'Titanium', cyl(0.045, 0.045, 0.18, 8), { p: [-0.09, 0.16, 0.04] })
      .add('Root', 'Strap', box(0.18, 0.12, 0.08), { p: [-0.14, 0.32, 0.04] });
    for (const cy of [0.18, 0.26, 0.34, 0.42]) {
      p.add('Root', 'Copper', cyl(0.014, 0.014, 0.18, 6), { p: [-0.15, cy, -0.05], r: [0, 0, 90] });
    }

    return p;
  },
};

// ---------------------------------------------------------------------------
// C. Oscar — Communications & Data Engineer
// ---------------------------------------------------------------------------

const commDsocLaser = {
  id: 'comm-dsoc-laser',
  category: 'equipment',
  tier: 3,
  name: 'CommDsocLaser',
  displayName: 'DSOC Laser Optical Transceiver (Psyche)',
  vehicle: 'Oscar · Middle Stage (High-Bandwidth Optical Comms)',
  role: 'Laser downlink at 8–267 Mbps (`O-O1`), offloading HiRISE/SHARAD images',
  summary:
    'Gold-wrapped 22 cm optical telescope on a two-axis gimbal with vibration dampers, attached to the photon electronics box.',
  originNote: 'Base of the isolation dampers (y = 0)',
  references: ['references/parts/stage-equipment.md', 'docs/resources/equipamentos-estagios.md'],
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
      attachTop: [0, 0.62, 0],
      attachBottom: [0, 0, 0],
      budget: { triangles: 700, meshes: 12 },
    });

    // Base chassis & vibration isolation struts
    p.add('Root', 'Aluminum', box(0.42, 0.12, 0.32), { p: [0, 0.09, 0] });
    for (const [sx, sz] of [
      [-1, -1],
      [1, -1],
      [-1, 1],
      [1, 1],
    ]) {
      p.add('Root', 'Strap', cyl(0.02, 0.025, 0.04, 6), { p: [sx * 0.17, 0.02, sz * 0.12] });
    }

    // 2-axis U-shaped Titanium gimbal yoke
    p.add('Root', 'Titanium', box(0.38, 0.04, 0.08), { p: [0, 0.17, 0] })
      .add('Root', 'Titanium', box(0.045, 0.24, 0.08), { p: [-0.17, 0.31, 0] })
      .add('Root', 'Titanium', box(0.045, 0.24, 0.08), { p: [0.17, 0.31, 0] });

    // 22 cm class laser transceiver telescope barrel + dark sunshade baffle + glowing emitter aperture
    p.add('Root', 'FoilGold', cyl(0.115, 0.115, 0.26, 12), { p: [0, 0.36, 0.01], r: [35, 0, 0] })
      .add('Root', 'HullBlack', cylOpen(0.14, 0.12, 0.16, 12), { p: [0, 0.48, 0.10], r: [35, 0, 0] })
      .add('Root', 'Lamp', cyl(0.08, 0.08, 0.02, 10), { p: [0, 0.42, 0.055], r: [35, 0, 0] })
      .add('Root', 'Copper', cyl(0.014, 0.014, 0.16, 6), { p: [0.13, 0.24, -0.05] });

    return p;
  },
};

const commElectraMarco = {
  id: 'comm-electra-marco',
  category: 'equipment',
  tier: 2,
  name: 'CommElectraMarco',
  displayName: 'Electra UHF Relay Radio & MarCO CubeSat Pair',
  vehicle: 'Oscar · Middle Stage (Relay Network & EDL)',
  role: 'Manages UHF windows (`O-S1`) and guards against orbiter loss (MAVEN)',
  summary:
    'Modular 4-slice Electra radio with a central helical antenna (FX_Antenna), flanked by two vertical 6U MarCO CubeSat dispensers.',
  originNote: 'Bottom support plate (y = 0)',
  references: ['references/parts/stage-equipment.md', 'docs/resources/equipamentos-estagios.md'],
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
      attachTop: [0, 0.68, 0],
      attachBottom: [0, 0, 0],
      fxAnchors: [{ name: 'FX_Antenna', pos: [0, 0.68, 0], rot: [0, 0, 0], preset: 'signal' }],
      budget: { triangles: 700, meshes: 12 },
    });

    p.add('Root', 'Titanium', box(0.56, 0.04, 0.36), { p: [0, 0.02, 0] });

    // Central Electra 4-slice SDR aluminum stack + coax + quadrifilar helical UHF antenna spire
    p.add('Root', 'Aluminum', box(0.20, 0.20, 0.18), { p: [0, 0.14, 0] })
      .add('Root', 'Steel', cyl(0.025, 0.032, 0.44, 8), { p: [0, 0.46, 0] })
      .add('Root', 'Copper', ring(0.042, 0.01, 8, 5), { p: [0, 0.42, 0] })
      .add('Root', 'Copper', ring(0.042, 0.01, 8, 5), { p: [0, 0.56, 0] })
      .add('Root', 'LedGreen', box(0.06, 0.02, 0.016), { p: [0, 0.18, 0.095] });

    // Left & right 6U MarCO CubeSat dispensers with folded gold reflectarrays & dark solar wings
    for (const sx of [-1, 1]) {
      p.add('Root', 'HullBlack', box(0.13, 0.37, 0.24), { p: [sx * 0.20, 0.225, 0] })
        .add('Root', 'FoilGold', box(0.018, 0.30, 0.20), { p: [sx * 0.275, 0.225, 0] })
        .add('Root', 'Visor', box(0.09, 0.26, 0.016), { p: [sx * 0.20, 0.225, 0.125] });
    }

    return p;
  },
};

const commRiseXband = {
  id: 'comm-rise-xband',
  category: 'equipment',
  tier: 1,
  name: 'CommRiseXband',
  displayName: 'RISE X-Band Radio Geodesy Transponder',
  vehicle: 'Oscar · Middle Stage (Radio Geodesy)',
  role: 'Measures the liquid core of Mars via Doppler (`O-S2`) over a direct DSN link',
  summary:
    'Gold X-band transponder block with copper waveguides feeding two conical horn antennas canted east and west.',
  originNote: 'Bottom avionics tray (y = 0)',
  references: ['references/parts/stage-equipment.md', 'docs/resources/equipamentos-estagios.md'],
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
      attachTop: [0, 0.48, 0],
      attachBottom: [0, 0, 0],
      budget: { triangles: 700, meshes: 12 },
    });

    p.add('Root', 'HullBlack', box(0.48, 0.04, 0.32), { p: [0, 0.02, 0] })
      .add('Root', 'FoilGold', box(0.24, 0.16, 0.18), { p: [0, 0.12, 0] })
      .add('Root', 'LedGreen', box(0.05, 0.02, 0.016), { p: [0, 0.14, 0.095] });

    // Left & right waveguides rising to flared conical horn antennas (±32 deg cant)
    for (const sx of [-1, 1]) {
      p.add('Root', 'Copper', box(0.03, 0.14, 0.03), { p: [sx * 0.10, 0.24, 0], r: [0, 0, -sx * 28] })
        .add('Root', 'Hull', cylOpen(0.095, 0.032, 0.18, 10), { p: [sx * 0.16, 0.36, 0], r: [0, 0, -sx * 32] })
        .add('Root', 'Aluminum', cyl(0.088, 0.03, 0.06, 10), { p: [sx * 0.14, 0.32, 0], r: [0, 0, -sx * 32] });
    }

    return p;
  },
};

const dataRad750Ssr = {
  id: 'data-rad750-ssr',
  category: 'equipment',
  tier: 2,
  name: 'DataRad750Ssr',
  displayName: 'RAD750 Flight Computer & Solid-State Recorder (SSR)',
  vehicle: 'Oscar · Middle Stage (Processing & Memory)',
  role: 'Image compression/cropping (`O-O2`) and storage during solar conjunction',
  summary:
    'Black-anodized radiation-shielded vault with top cooling fins, 6 modular memory blades, telemetry LEDs and a SpaceWire harness.',
  originNote: 'Bottom damping frame (y = 0)',
  references: ['references/parts/stage-equipment.md', 'docs/resources/equipamentos-estagios.md'],
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
      attachTop: [0, 0.46, 0],
      attachBottom: [0, 0, 0],
      budget: { triangles: 700, meshes: 12 },
    });

    p.add('Root', 'Aluminum', box(0.48, 0.04, 0.36), { p: [0, 0.02, 0] })
      .add('Root', 'HullBlack', box(0.40, 0.32, 0.24), { p: [0, 0.20, -0.02] });

    // Top radiator cooling fins
    for (const fx of [-0.14, -0.07, 0, 0.07, 0.14]) {
      p.add('Root', 'Aluminum', box(0.02, 0.05, 0.22), { p: [fx, 0.385, -0.02] });
    }

    // 6 front slide-in radiation-hardened memory / CPU blades + copper extractors + status LEDs
    for (let i = 0; i < 6; i++) {
      const bx = -0.15 + i * 0.06;
      p.add('Root', 'Titanium', box(0.048, 0.26, 0.022), { p: [bx, 0.20, 0.105] })
        .add('Root', 'Copper', box(0.036, 0.022, 0.028), { p: [bx, 0.09, 0.115] })
        .add('Root', i % 2 === 0 ? 'LedGreen' : 'Lamp', box(0.016, 0.016, 0.012), { p: [bx, 0.30, 0.12] });
    }

    // Braided orange SpaceWire data bus along right/bottom edge
    p.add('Root', 'Foam', cyl(0.016, 0.016, 0.26, 6), { p: [0.22, 0.18, 0.05], r: [15, 0, 12] })
      .add('Root', 'Strap', cyl(0.018, 0.018, 0.18, 6), { p: [0.16, 0.06, 0.12], r: [0, 0, 90] });

    return p;
  },
};

// ---------------------------------------------------------------------------
// D. Maya — Chief Scientist & Medical Officer
// ---------------------------------------------------------------------------

const sciHiriseSharad = {
  id: 'sci-hirise-sharad',
  category: 'equipment',
  tier: 3,
  name: 'SciHiriseSharad',
  displayName: 'HiRISE Orbital Package, SHARAD Radar & NOMAD Spectrometer',
  vehicle: 'Maya · Middle Stage (Orbital Remote Sensing)',
  role: '30 cm-resolution photos (`M-O1`), ice radar (`M-O2`) and trace gases (`M-O3`)',
  summary:
    '0.5 m-class carbon-fiber telescope tube with a silver thermal collar and gold spider, coupled to the NOMAD spectrometer and the SHARAD radar dipoles.',
  originNote: 'Bottom optical bench (y = 0)',
  references: ['references/parts/stage-equipment.md', 'docs/resources/equipamentos-estagios.md'],
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
      attachTop: [0, 0.72, 0],
      attachBottom: [0, 0, 0],
      budget: { triangles: 700, meshes: 12 },
    });

    p.add('Root', 'Titanium', box(0.58, 0.04, 0.42), { p: [0, 0.02, 0] });

    // Central HiRISE reflector barrel (0.5 m class scaled into bay) + silver MLI ring + gold spider
    p.add('Root', 'Aluminum', box(0.05, 0.34, 0.08), { p: [-0.18, 0.21, 0] })
      .add('Root', 'Aluminum', box(0.05, 0.34, 0.08), { p: [0.18, 0.21, 0] })
      .add('Root', 'HullBlack', cylOpen(0.155, 0.165, 0.56, 12), { p: [0, 0.38, 0], r: [22, 0, 0] })
      .add('Root', 'FoilSilver', cylOpen(0.164, 0.164, 0.14, 12), { p: [0, 0.22, -0.06], r: [22, 0, 0] })
      .add('Root', 'Visor', cyl(0.148, 0.148, 0.02, 12), { p: [0, 0.42, 0.02], r: [22, 0, 0] })
      .add('Root', 'FoilGold', cyl(0.045, 0.045, 0.05, 8), { p: [0, 0.62, 0.10], r: [22, 0, 0] });

    // Right: NOMAD/ACS trace-gas solar-occultation spectrometer box
    p.add('Root', 'FoilGold', box(0.13, 0.28, 0.18), { p: [0.22, 0.18, 0.04] })
      .add('Root', 'VisorGold', box(0.08, 0.05, 0.04), { p: [0.22, 0.28, 0.135] });

    // Left: Twin white SHARAD HF sounding radar antenna canisters
    p.add('Root', 'Hull', cyl(0.032, 0.032, 0.48, 8), { p: [-0.24, 0.28, 0.10] })
      .add('Root', 'Hull', cyl(0.032, 0.032, 0.48, 8), { p: [-0.24, 0.28, -0.02] });

    return p;
  },
};

const sciPixlSherlocSupercam = {
  id: 'sci-pixl-sherloc-supercam',
  category: 'equipment',
  tier: 3,
  name: 'SciPixlSherlocSupercam',
  displayName: 'PIXL, SHERLOC & SuperCam Laser Astrobiology Bench',
  vehicle: 'Maya · Middle Stage (Astrobiology & Biosignatures)',
  role: 'Detects biosignature spots (`M-S1`) and fires a laser at >7 m (`M-S2`)',
  summary:
    'White SuperCam mast with a large cyclops lens and laser (FX_Sparks) beside the folded robotic arm with the hexagonal PIXL turret and the SHERLOC UV sensor.',
  originNote: 'Bottom calibration deck (y = 0)',
  references: ['references/parts/stage-equipment.md', 'docs/resources/equipamentos-estagios.md'],
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
      attachTop: [0, 0.62, 0],
      attachBottom: [0, 0, 0],
      fxAnchors: [{ name: 'FX_Sparks', pos: [-0.14, 0.48, 0.18], rot: [90, 0, 0], preset: 'sparks' }],
      budget: { triangles: 700, meshes: 12 },
    });

    p.add('Root', 'Aluminum', box(0.54, 0.04, 0.40), { p: [0, 0.02, 0] });

    // Left: SuperCam mast column + iconic white box head + Cyclops optics + gold ring
    p.add('Root', 'Titanium', cyl(0.032, 0.042, 0.40, 8), { p: [-0.14, 0.24, -0.04] })
      .add('Root', 'Hull', box(0.22, 0.14, 0.18), { p: [-0.14, 0.49, 0] })
      .add('Root', 'FoilGold', cyl(0.052, 0.052, 0.035, 10), { p: [-0.14, 0.49, 0.10], r: [90, 0, 0] })
      .add('Root', 'Visor', cyl(0.04, 0.04, 0.02, 10), { p: [-0.14, 0.49, 0.118], r: [90, 0, 0] });

    // Right: Folded 3-link arm carrying PIXL hex X-ray sensor & SHERLOC deep-UV Raman turret
    p.add('Root', 'Titanium', box(0.055, 0.26, 0.055), { p: [0.16, 0.17, -0.08], r: [16, 0, -10] })
      .add('Root', 'Titanium', box(0.05, 0.20, 0.05), { p: [0.14, 0.36, 0.02], r: [-38, 0, 8] })
      // PIXL hexagonal head & SHERLOC UV housing
      .add('Root', 'Steel', cyl(0.075, 0.075, 0.08, 6), { p: [0.14, 0.30, 0.12], r: [90, 0, 0] })
      .add('Root', 'HullBlack', box(0.13, 0.12, 0.10), { p: [0.14, 0.19, 0.10] })
      .add('Root', 'Lamp', cyl(0.028, 0.028, 0.02, 8), { p: [0.14, 0.19, 0.155], r: [90, 0, 0] })
      // Calibration target plate mounted on deck
      .add('Root', 'Copper', box(0.08, 0.04, 0.06), { p: [0.02, 0.06, 0.13] })
      .add('Root', 'Hull', box(0.05, 0.045, 0.04), { p: [0.02, 0.065, 0.13] });

    return p;
  },
};

const sciSeisCaching = {
  id: 'sci-seis-caching',
  category: 'equipment',
  tier: 2,
  name: 'SciSeisCaching',
  displayName: 'SEIS Seismometer (Wind Shield) & 43-Tube Carousel',
  vehicle: 'Maya · Middle Stage (Seismology & Sampling)',
  role: 'Listens for marsquakes (`M-S3`) and seals the sample cores (`M-S4`)',
  summary:
    'White hexagonal wind/thermal shield dome of the SEIS seismometer with a gold skirt, next to the rotating carousel of Perseverance titanium tubes.',
  originNote: 'Bottom instrument pallet (y = 0)',
  references: ['references/parts/stage-equipment.md', 'docs/resources/equipamentos-estagios.md'],
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
      attachTop: [0, 0.44, 0],
      attachBottom: [0, 0, 0],
      budget: { triangles: 700, meshes: 12 },
    });

    p.add('Root', 'Titanium', box(0.58, 0.04, 0.42), { p: [0, 0.02, 0] });

    // Left: Hexagonal InSight SEIS Wind & Thermal Shield dome + gold apron + grapple knob + tether
    p.add('Root', 'Hull', cyl(0.075, 0.145, 0.16, 6), { p: [-0.15, 0.16, 0.02] })
      .add('Root', 'Hull', cyl(0.03, 0.075, 0.04, 6), { p: [-0.15, 0.26, 0.02] })
      .add('Root', 'FoilGold', cyl(0.145, 0.16, 0.045, 6), { p: [-0.15, 0.065, 0.02] })
      .add('Root', 'Steel', cyl(0.015, 0.015, 0.05, 6), { p: [-0.15, 0.30, 0.02] })
      .add('Root', 'Foam', box(0.14, 0.014, 0.035), { p: [-0.01, 0.048, 0.12], r: [0, -18, 0] });

    // Right: Perseverance Sample Caching Carousel showing vertical white/gold titanium tubes
    p.add('Root', 'Aluminum', flatRing(0.14, 0.09, 0.025, 10), { p: [0.16, 0.06, 0] })
      .add('Root', 'Aluminum', flatRing(0.14, 0.09, 0.025, 10), { p: [0.16, 0.32, 0] })
      .add('Root', 'Steel', cyl(0.035, 0.035, 0.34, 8), { p: [0.16, 0.21, 0] });
    for (let i = 0; i < 8; i++) {
      const ang = (i * Math.PI * 2) / 8;
      const tx = 0.16 + Math.cos(ang) * 0.115;
      const tz = Math.sin(ang) * 0.115;
      p.add('Root', 'Hull', cyl(0.015, 0.015, 0.22, 6), { p: [tx, 0.19, tz] })
        .add('Root', 'FoilGold', cyl(0.017, 0.017, 0.035, 6), { p: [tx, 0.31, tz] });
    }

    return p;
  },
};

const habVeggieRadAstroRad = {
  id: 'hab-veggie-rad-astrorad',
  category: 'equipment',
  tier: 2,
  name: 'HabVeggieRadAstroRad',
  displayName: 'Veggie Hydroponic Greenhouse, RAD Dosimeter & AstroRad Vests',
  vehicle: 'Maya · Middle Stage (Crewed Mission)',
  role: 'Solar storm alert (`M-S5`), Martian greenhouse (`M-S6`) and crew protection',
  summary:
    'Lit white Veggie/APH chamber with green seedling trays, folded AstroRad shielding blocks on the right and a cylindrical RAD detector on top.',
  originNote: 'Bottom floor of the habitat rack (y = 0)',
  references: ['references/parts/stage-equipment.md', 'docs/resources/equipamentos-estagios.md'],
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
      attachTop: [0, 0.62, 0],
      attachBottom: [0, 0, 0],
      budget: { triangles: 700, meshes: 12 },
    });

    p.add('Root', 'Aluminum', box(0.56, 0.04, 0.40), { p: [0, 0.02, 0] });

    // Left: Veggie / APH hydroponic cabinet with transparent bay, grow-light canopy & 3 green sprout trays
    p.add('Root', 'Hull', box(0.32, 0.44, 0.30), { p: [-0.09, 0.26, -0.02] })
      .add('Root', 'Visor', box(0.26, 0.28, 0.02), { p: [-0.09, 0.26, 0.132] })
      .add('Root', 'Lamp', box(0.24, 0.025, 0.20), { p: [-0.09, 0.40, 0] })
      .add('Root', 'LedGreen', box(0.06, 0.05, 0.18), { p: [-0.17, 0.16, 0.02] })
      .add('Root', 'LedGreen', box(0.06, 0.06, 0.18), { p: [-0.09, 0.165, 0.02] })
      .add('Root', 'LedGreen', box(0.06, 0.045, 0.18), { p: [-0.01, 0.158, 0.02] })
      .add('Root', 'Copper', cyl(0.012, 0.012, 0.36, 6), { p: [-0.265, 0.24, 0.04] });

    // Top-left: Cylindrical Curiosity RAD particle telescope sensor head + gold collimator ring
    p.add('Root', 'Aluminum', cyl(0.065, 0.075, 0.11, 10), { p: [-0.09, 0.535, 0] })
      .add('Root', 'FoilGold', cyl(0.072, 0.072, 0.025, 10), { p: [-0.09, 0.60, 0] });

    // Right: Stowed AstroRad high-density polyethylene shielding vests on storage rack
    p.add('Root', 'Titanium', box(0.16, 0.38, 0.03), { p: [0.18, 0.23, -0.13] })
      .add('Root', 'Pack', box(0.14, 0.16, 0.20), { p: [0.18, 0.13, 0] })
      .add('Root', 'Pack', box(0.14, 0.16, 0.20), { p: [0.18, 0.32, 0] })
      .add('Root', 'Strap', box(0.15, 0.03, 0.22), { p: [0.18, 0.225, 0] });

    return p;
  },
};

export default [
  trussIngenuity,
  edlTrnMedli2,
  edlAspireLoftid,
  attitudeReactionWheels,
  powerRosaSolar,
  powerMmrtgKilopower,
  isruMoxieRodwell,
  drillCorerCryo,
  commDsocLaser,
  commElectraMarco,
  commRiseXband,
  dataRad750Ssr,
  sciHiriseSharad,
  sciPixlSherlocSupercam,
  sciSeisCaching,
  habVeggieRadAstroRad,
];
