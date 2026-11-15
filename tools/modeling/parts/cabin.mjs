import { box, cyl, ball, ring, flatRing } from '../lib/shapes.mjs';
import { createPartBuilder } from '../lib/part-builder.mjs';

const CABIN_COMMON_REF = ['references/parts/cabin-equipment.md', 'docs/resources/equipamentos-cabine.md'];

// ---------------------------------------------------------------------------
// A. Helena — Command, Docking & Launch Safety
// ---------------------------------------------------------------------------

const cabinLaunchSeats = {
  id: 'cabin-launch-seats',
  category: 'cabin',
  tier: 1,
  name: 'CabinLaunchSeats',
  displayName: 'Assentos Reclinados de Lançamento (4 Tripulantes)',
  vehicle: 'Helena · Cabine da Tripulação (Lançamento & EDL)',
  role: 'Amortecimento de g em subida orbital (Fase 5) e pouso em Marte (Fase 6/7)',
  summary:
    'Plataforma em dois níveis com quatro assentos espaciais reclinados a -35° estilo Orion/Crew Dragon, amortecedores hidráulicos e cintos laranja.',
  originNote: 'Centro do piso de montagem da cabine (y = 0, abertura cutaway em +Z)',
  references: [...CABIN_COMMON_REF, 'references/experiments/mars-experiments.md'],
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

    // Base rail deck flush on y = 0 + lateral mounting rails
    p.add('Root', 'Titanium', box(0.58, 0.03, 0.44), { p: [0, 0.015, 0] });
    for (const sx of [-1, 1]) {
      p.add('Root', 'Aluminum', box(0.03, 0.035, 0.4), { p: [sx * 0.26, 0.048, 0] });
    }

    // Two terraced rows of 2 shock-attenuating seats facing forward/up (+Z/+Y)
    const rows = [
      { z: 0.1, seatY: 0.09, strutH: 0.06 },
      { z: -0.11, seatY: 0.19, strutH: 0.16 },
    ];
    for (const row of rows) {
      for (const sx of [-1, 1]) {
        const x = sx * 0.135;
        // Hydraulic shock damper column
        p.add('Root', 'Steel', cyl(0.016, 0.018, row.strutH, 6), {
          p: [x, 0.03 + row.strutH / 2, row.z],
        })
          // Seat pan & navy cushion
          .add('Root', 'Hull', box(0.17, 0.028, 0.13), { p: [x, row.seatY, row.z + 0.03], r: [-18, 0, 0] })
          .add('Root', 'Pack', box(0.145, 0.022, 0.11), { p: [x, row.seatY + 0.02, row.z + 0.03], r: [-18, 0, 0] })
          // Reclined backrest shell & headrest
          .add('Root', 'Hull', box(0.17, 0.22, 0.03), { p: [x, row.seatY + 0.1, row.z - 0.055], r: [-35, 0, 0] })
          .add('Root', 'Pack', box(0.145, 0.19, 0.024), { p: [x, row.seatY + 0.105, row.z - 0.038], r: [-35, 0, 0] })
          .add('Root', 'Strap', box(0.1, 0.06, 0.04), { p: [x, row.seatY + 0.21, row.z - 0.105], r: [-35, 0, 0] });
        // Twin orange 4-point launch harness belts
        for (const bx of [-0.035, 0.035]) {
          p.add('Root', 'Foam', box(0.018, 0.15, 0.016), {
            p: [x + bx, row.seatY + 0.11, row.z - 0.024],
            r: [-35, 0, 0],
          });
        }
      }
    }

    return p;
  },
};

const cabinOrionCockpit = {
  id: 'cabin-orion-cockpit',
  category: 'cabin',
  tier: 2,
  name: 'CabinOrionCockpit',
  displayName: 'Painel Glass Cockpit Orion (3 DUs)',
  vehicle: 'Helena · Cabine da Tripulação (Lançamento & Navegação)',
  role: 'HUD de lançamento em 1ª pessoa (`§7.1`) e controle manual (`H-O1` / `H-S2`)',
  summary:
    'Console frontal com 3 Display Units iluminados, chaves de proteção, punho translacional T-bar à esquerda e joystick rotacional à direita.',
  originNote: 'Centro do piso da cabine (y = 0), mostradores voltados para +Z',
  references: [...CABIN_COMMON_REF, 'references/experiments/mars-experiments.md'],
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
      attachTop: [0, 0.52, 0],
      attachBottom: [0, 0, 0],
      budget: { triangles: 700, meshes: 12 },
    });

    // Floor baseplate & twin pedestal columns
    p.add('Root', 'Aluminum', box(0.58, 0.03, 0.36), { p: [0, 0.015, 0] });
    for (const sx of [-1, 1]) {
      p.add('Root', 'Titanium', box(0.075, 0.22, 0.12), { p: [sx * 0.19, 0.14, -0.02] });
    }
    p.add('Root', 'Copper', cyl(0.016, 0.016, 0.2, 6), { p: [0, 0.13, -0.1] });

    // Lower forward pilot deck + upper angled display hood
    p.add('Root', 'HullBlack', box(0.6, 0.045, 0.24), { p: [0, 0.265, 0.02], r: [10, 0, 0] })
      .add('Root', 'Aluminum', box(0.6, 0.018, 0.03), { p: [0, 0.25, 0.14] })
      .add('Root', 'HullBlack', box(0.6, 0.2, 0.12), { p: [0, 0.39, -0.05], r: [-18, 0, 0] });

    // 3 Glass Display Units (DUs) angled toward viewer (+Z)
    for (const dx of [-0.185, 0, 0.185]) {
      p.add('Root', 'Pack', box(0.155, 0.135, 0.02), { p: [dx, 0.395, 0.006], r: [-18, 0, 0] })
        .add('Root', 'Visor', box(0.132, 0.108, 0.022), { p: [dx, 0.395, 0.01], r: [-18, 0, 0] })
        .add('Root', 'LedGreen', box(0.09, 0.012, 0.01), { p: [dx, 0.388, 0.02], r: [-18, 0, 0] });
    }

    // Master caution / guard switches + abort beacon on center eyebrow
    p.add('Root', 'Lamp', box(0.06, 0.016, 0.018), { p: [-0.08, 0.485, -0.025], r: [-18, 0, 0] })
      .add('Root', 'LedRed', box(0.045, 0.016, 0.018), { p: [0.08, 0.485, -0.025], r: [-18, 0, 0] })
      .add('Root', 'Steel', box(0.22, 0.022, 0.05), { p: [0, 0.295, 0.06], r: [10, 0, 0] });

    // Left Translational Hand Controller (T-bar)
    p.add('Root', 'Titanium', cyl(0.014, 0.018, 0.08, 6), { p: [-0.22, 0.31, 0.08] })
      .add('Root', 'Strap', box(0.09, 0.022, 0.024), { p: [-0.22, 0.355, 0.085] });

    // Right Rotational Hand Controller (joystick)
    p.add('Root', 'Foam', cyl(0.026, 0.032, 0.028, 8), { p: [0.22, 0.295, 0.08] })
      .add('Root', 'Strap', cyl(0.016, 0.02, 0.095, 6), { p: [0.22, 0.35, 0.09], r: [18, 0, 0] });

    return p;
  },
};

const cabinIdssDocking = {
  id: 'cabin-idss-docking',
  category: 'cabin',
  tier: 3,
  name: 'CabinIdssDocking',
  displayName: 'Anel de Acoplamento IDSS/NDS & Reabastecimento Crio',
  vehicle: 'Helena · Cabine da Tripulação (Órbita de Marte)',
  role: 'Reabastecimento orbital obrigatório (`§6.1`, `§8.1`) e acoplamento seguro',
  summary:
    'Túnel pressurizado circular IDSS/NDS com escotilha de vigia central, 3 pétalas de captura em cobre, ganchos de trava e umbilicais criogênicos.',
  originNote: 'Centro da base inferior de adaptação na cabine (y = 0)',
  references: [...CABIN_COMMON_REF, 'references/experiments/mars-experiments.md'],
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
      budget: { triangles: 700, meshes: 12 },
    });

    // Square bulkhead deck plate + corner mounting gussets
    p.add('Root', 'Aluminum', box(0.58, 0.03, 0.48), { p: [0, 0.015, 0] });
    for (const [sx, sz] of [
      [-1, -1],
      [1, -1],
      [-1, 1],
      [1, 1],
    ]) {
      p.add('Root', 'Titanium', box(0.06, 0.05, 0.06), { p: [sx * 0.23, 0.055, sz * 0.18] });
    }

    // Main pressurized cylindrical transfer tunnel + SCS steel petal ring
    p.add('Root', 'Hull', cyl(0.205, 0.215, 0.34, 12), { p: [0, 0.2, 0] })
      .add('Root', 'Steel', flatRing(0.255, 0.175, 0.04, 12), { p: [0, 0.39, 0] })
      .add('Root', 'HullBlack', cyl(0.175, 0.175, 0.03, 12), { p: [0, 0.39, 0] })
      .add('Root', 'Visor', cyl(0.058, 0.058, 0.038, 10), { p: [0, 0.395, 0] })
      .add('Root', 'Copper', ring(0.05, 0.008, 8, 4), { p: [0, 0.422, 0] });

    // 3 angled IDSS alignment petals + 4 active hard-capture latches
    for (let i = 0; i < 3; i++) {
      const a = (i * 120 + 60) * (Math.PI / 180);
      const r = 0.205;
      const deg = (a * 180) / Math.PI;
      p.add('Root', 'Copper', box(0.085, 0.085, 0.018), {
        p: [Math.sin(a) * r, 0.445, Math.cos(a) * r],
        r: [-22, deg, 0],
      });
    }
    for (let i = 0; i < 4; i++) {
      const a = (i * 90 + 45) * (Math.PI / 180);
      const r = 0.242;
      p.add('Root', 'Titanium', box(0.032, 0.042, 0.032), {
        p: [Math.sin(a) * r, 0.415, Math.cos(a) * r],
      });
    }

    // Left & right cryogenic refueling PDTU umbilical manifolds
    for (const sx of [-1, 1]) {
      p.add('Root', 'FoilSilver', box(0.06, 0.19, 0.1), { p: [sx * 0.25, 0.2, 0] })
        .add('Root', 'Foam', cyl(0.022, 0.022, 0.07, 8), { p: [sx * 0.265, 0.23, 0.06], r: [90, 0, 0] })
        .add('Root', 'Copper', cyl(0.012, 0.012, 0.16, 6), { p: [sx * 0.24, 0.32, 0] });
    }
    p.add('Root', 'LedGreen', box(0.05, 0.018, 0.02), { p: [0, 0.28, 0.215] });

    return p;
  },
};

// ---------------------------------------------------------------------------
// B. Lucas — Cabin Life Support, EVA Airlock & Power/Thermal Distribution
// ---------------------------------------------------------------------------

const cabinPcduThermal = {
  id: 'cabin-pcdu-thermal',
  category: 'cabin',
  tier: 1,
  name: 'CabinPcduThermal',
  displayName: 'Barramento 120 VDC & Trocador Térmico da Cabine',
  vehicle: 'Lucas · Cabine da Tripulação (Energia & Resfriamento)',
  role: 'Previne sobrecargas elétricas e permite reparar bomba térmica (`P8`)',
  summary:
    'Rack duplo compacto com painel PCDU de 120 VDC e disjuntores à esquerda, núcleo condensador aletado, bomba de fluido e acumulador dourado à direita (`FX_Sparks`).',
  originNote: 'Centro do piso da cabine (y = 0)',
  references: [...CABIN_COMMON_REF, 'references/experiments/experiments.md'],
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
      attachTop: [0, 0.6, 0],
      attachBottom: [0, 0, 0],
      fxAnchors: [{ name: 'FX_Sparks', pos: [0.02, 0.38, 0.13], rot: [75, 0, 0], preset: 'sparks' }],
      budget: { triangles: 700, meshes: 12 },
    });

    // Baseplate + outer structural cage
    p.add('Root', 'Aluminum', box(0.5, 0.03, 0.34), { p: [0, 0.015, 0] })
      .add('Root', 'Titanium', box(0.5, 0.025, 0.34), { p: [0, 0.585, 0] });
    for (const [sx, sz] of [
      [-1, -1],
      [1, -1],
      [-1, 1],
      [1, 1],
    ]) {
      p.add('Root', 'Titanium', cyl(0.012, 0.012, 0.54, 6), { p: [sx * 0.23, 0.3, sz * 0.15] });
    }

    // Left: 120 VDC PCDU switchgear cabinet & copper busbars
    p.add('Root', 'HullBlack', box(0.2, 0.48, 0.24), { p: [-0.11, 0.28, -0.02] })
      .add('Root', 'Pack', box(0.16, 0.26, 0.02), { p: [-0.11, 0.32, 0.1] })
      .add('Root', 'Copper', box(0.022, 0.38, 0.03), { p: [0.005, 0.28, 0.04] })
      .add('Root', 'LedGreen', box(0.045, 0.016, 0.016), { p: [-0.14, 0.46, 0.108] })
      .add('Root', 'Lamp', box(0.035, 0.016, 0.016), { p: [-0.075, 0.46, 0.108] })
      .add('Root', 'LedRed', box(0.022, 0.022, 0.02), { p: [0.01, 0.47, 0.1] });
    for (let i = 0; i < 3; i++) {
      p.add('Root', 'Foam', box(0.032, 0.022, 0.028), { p: [-0.15 + i * 0.045, 0.32, 0.115] });
    }

    // Right: Finned condensing heat exchanger core, coolant pump & gold accumulator
    for (let i = 0; i < 5; i++) {
      p.add('Root', 'Aluminum', box(0.16, 0.012, 0.18), { p: [0.12, 0.12 + i * 0.045, -0.01] });
    }
    p.add('Root', 'Steel', cyl(0.048, 0.048, 0.15, 8), { p: [0.12, 0.39, 0.02], r: [0, 0, 90] })
      .add('Root', 'Copper', cyl(0.012, 0.012, 0.24, 6), { p: [0.055, 0.32, 0.06] })
      .add('Root', 'FoilGold', ball(0.06, 8, 6), { p: [0.14, 0.495, -0.03] });

    return p;
  },
};

const cabinEvaAirlock = {
  id: 'cabin-eva-airlock',
  category: 'cabin',
  tier: 2,
  name: 'CabinEvaAirlock',
  displayName: 'Escotilha de Eclusa & Suitports Duplos (AxEMU)',
  vehicle: 'Lucas · Cabine da Tripulação (EVA & Controle de Poeira)',
  role: 'Habilita reparos orbitais seguros (`E5` / `P8`) e saída limpa em Marte (`EN15`)',
  summary:
    'Antepara pressurizada com escotilha circular de trava em cobre e vigia, flanqueada por dois trajes AxEMU acoplados em suitports laterais.',
  originNote: 'Centro do piso da cabine (y = 0), lado frontal em +Z',
  references: [...CABIN_COMMON_REF, 'references/experiments/mars-experiments.md'],
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
      attachTop: [0, 0.63, 0],
      attachBottom: [0, 0, 0],
      budget: { triangles: 700, meshes: 12 },
    });

    // Base floor deck + rear pressure bulkhead wall
    p.add('Root', 'Aluminum', box(0.62, 0.03, 0.32), { p: [0, 0.015, 0] })
      .add('Root', 'Hull', box(0.6, 0.59, 0.1), { p: [0, 0.325, -0.09] })
      .add('Root', 'Aluminum', box(0.6, 0.03, 0.12), { p: [0, 0.615, -0.08] })
      // Lower Martian dust sump & filter vent
      .add('Root', 'Titanium', box(0.24, 0.08, 0.14), { p: [0, 0.07, 0.02] })
      .add('Root', 'Strap', box(0.18, 0.05, 0.02), { p: [0, 0.07, 0.095] });

    // Central airlock hatch door, seal, porthole, handwheel & status LEDs
    p.add('Root', 'HullBlack', cyl(0.155, 0.155, 0.025, 10), { p: [0, 0.33, -0.035], r: [90, 0, 0] })
      .add('Root', 'Steel', cyl(0.135, 0.135, 0.036, 10), { p: [0, 0.33, -0.022], r: [90, 0, 0] })
      .add('Root', 'Visor', cyl(0.044, 0.044, 0.044, 8), { p: [0, 0.37, -0.018], r: [90, 0, 0] })
      .add('Root', 'Copper', ring(0.048, 0.008, 8, 4), { p: [0, 0.27, 0.002], r: [90, 0, 0] })
      .add('Root', 'LedGreen', box(0.035, 0.018, 0.02), { p: [-0.08, 0.52, -0.03] })
      .add('Root', 'Lamp', box(0.035, 0.018, 0.02), { p: [0.08, 0.52, -0.03] });

    // Twin docked AxEMU / xEMU Suitport torso racks on left & right wings
    for (const sx of [-1, 1]) {
      const x = sx * 0.22;
      p.add('Root', 'Hull', box(0.11, 0.21, 0.09), { p: [x, 0.27, 0.02] })
        .add('Root', 'Pack', box(0.075, 0.08, 0.028), { p: [x, 0.29, 0.072] })
        .add('Root', 'Foam', box(0.08, 0.02, 0.02), { p: [x, 0.21, 0.068] })
        .add('Root', 'Steel', ring(0.048, 0.009, 8, 4), { p: [x, 0.385, 0.02] })
        .add('Root', 'VisorGold', ball(0.052, 8, 6), { p: [x, 0.435, 0.02] });
    }

    return p;
  },
};

const cabinEclssWrs = {
  id: 'cabin-eclss-wrs',
  category: 'cabin',
  tier: 3,
  name: 'CabinEclssWrs',
  displayName: 'Rack ECLSS Fechado (98% Água) & UWMS',
  vehicle: 'Lucas · Cabine da Tripulação (Suporte de Vida)',
  role: 'Recupera 98% da água (`EN2`) e neutraliza falhas de suporte (`E3`)',
  summary:
    'Rack ISPR branco com tambor de destilação a vácuo, filtros e serpentina de salmoura à esquerda, mais unidade sanitária compacta UWMS à direita.',
  originNote: 'Centro do piso da cabine (y = 0)',
  references: [...CABIN_COMMON_REF, 'references/experiments/experiments.md'],
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
      attachTop: [0, 0.67, 0],
      attachBottom: [0, 0, 0],
      budget: { triangles: 700, meshes: 12 },
    });

    // ISPR double-bay enclosure shell (open front in +Z)
    p.add('Root', 'Hull', box(0.58, 0.03, 0.36), { p: [0, 0.015, 0] })
      .add('Root', 'Hull', box(0.58, 0.035, 0.36), { p: [0, 0.652, 0] })
      .add('Root', 'Hull', box(0.58, 0.61, 0.04), { p: [0, 0.335, -0.16] })
      .add('Root', 'HullBlack', box(0.52, 0.59, 0.02), { p: [0, 0.335, -0.13] });
    for (const x of [-0.275, 0, 0.275]) {
      p.add('Root', 'Hull', box(0.03, 0.61, 0.34), { p: [x, 0.335, 0] });
    }

    // Left bay: Water Recovery System (WPA/UPA drum, filters, copper brine coil)
    p.add('Root', 'Steel', cyl(0.072, 0.072, 0.18, 10), { p: [-0.14, 0.47, 0] })
      .add('Root', 'FoilSilver', cyl(0.076, 0.076, 0.06, 10), { p: [-0.14, 0.47, 0] })
      .add('Root', 'Titanium', cyl(0.038, 0.038, 0.24, 8), { p: [-0.19, 0.19, 0] })
      .add('Root', 'Titanium', cyl(0.038, 0.038, 0.24, 8), { p: [-0.09, 0.19, 0] })
      .add('Root', 'Copper', cyl(0.012, 0.012, 0.34, 6), { p: [-0.04, 0.32, 0.06] })
      .add('Root', 'LedGreen', box(0.12, 0.018, 0.02), { p: [-0.14, 0.6, 0.13] });

    // Right bay: Compact UWMS bowl housing, thigh restraints & separator blower
    p.add('Root', 'Aluminum', cyl(0.085, 0.07, 0.19, 10), { p: [0.14, 0.16, 0.04] })
      .add('Root', 'HullBlack', cyl(0.075, 0.055, 0.04, 10), { p: [0.14, 0.27, 0.04] })
      .add('Root', 'Strap', cyl(0.016, 0.016, 0.2, 6), { p: [0.14, 0.38, -0.02] })
      .add('Root', 'Steel', cyl(0.058, 0.058, 0.13, 8), { p: [0.14, 0.51, -0.02], r: [0, 0, 90] })
      .add('Root', 'LedGreen', box(0.08, 0.018, 0.02), { p: [0.14, 0.6, 0.13] });
    for (const dx of [-0.09, 0.09]) {
      p.add('Root', 'Pack', box(0.024, 0.04, 0.18), { p: [0.14 + dx, 0.18, 0.06], r: [15, 0, 0] });
    }

    return p;
  },
};

// ---------------------------------------------------------------------------
// C. Oscar — Cabin Telemetry, Radiation Warning & Autonomy
// ---------------------------------------------------------------------------

const cabinHeraDosimetry = {
  id: 'cabin-hera-dosimetry',
  category: 'cabin',
  tier: 1,
  name: 'CabinHeraDosimetry',
  displayName: 'Monitor de Radiação HERA & Sirene SPE',
  vehicle: 'Oscar · Cabine da Tripulação (Alerta Solar)',
  role: 'Detecta tempestades solares (`PH1` / `P10`) e dá tempo extra para `M-S5`',
  summary:
    'Ponte compacta com duas unidades Timepix HERA douradas em ângulos ortogonais ligadas por cabos coaxiais a um painel com strobes âmbar e vermelho.',
  originNote: 'Centro do piso da cabine (y = 0)',
  references: [...CABIN_COMMON_REF, 'references/experiments/mars-experiments.md'],
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
      attachTop: [0, 0.45, 0],
      attachBottom: [0, 0, 0],
      budget: { triangles: 700, meshes: 12 },
    });

    // Mounting base & rear sensor bridge rack
    p.add('Root', 'Aluminum', box(0.46, 0.03, 0.32), { p: [0, 0.015, 0] })
      .add('Root', 'Titanium', box(0.42, 0.34, 0.05), { p: [0, 0.2, -0.09] });

    // 2 Orthogonal FoilGold HERA Sensor Units (HSUs) with recessed Timepix apertures
    for (const sx of [-1, 1]) {
      const x = sx * 0.14;
      p.add('Root', 'FoilGold', box(0.095, 0.11, 0.095), { p: [x, 0.13, 0.03], r: [0, -sx * 25, 0] })
        .add('Root', 'Visor', box(0.06, 0.06, 0.02), { p: [x, 0.135, 0.075], r: [0, -sx * 25, 0] })
        .add('Root', 'Copper', cyl(0.01, 0.01, 0.14, 6), { p: [x * 0.72, 0.22, -0.02], r: [-32, 0, sx * 22] });
    }

    // Center alarm / radiation matrix panel + top solar warning klaxons
    p.add('Root', 'HullBlack', box(0.22, 0.17, 0.07), { p: [0, 0.28, -0.04] })
      .add('Root', 'Visor', box(0.16, 0.09, 0.015), { p: [0, 0.295, -0.002] })
      .add('Root', 'LedGreen', box(0.14, 0.016, 0.016), { p: [0, 0.22, 0] })
      .add('Root', 'Lamp', cyl(0.028, 0.032, 0.05, 8), { p: [0, 0.39, -0.04] });
    for (const sx of [-1, 1]) {
      p.add('Root', 'LedRed', cyl(0.022, 0.026, 0.042, 8), { p: [sx * 0.1, 0.386, -0.04] });
    }

    return p;
  },
};

const cabinScanConsole = {
  id: 'cabin-scan-console',
  category: 'cabin',
  tier: 2,
  name: 'CabinScanConsole',
  displayName: 'Estação de Telecomunicações DTN & Atraso Terra-Marte',
  vehicle: 'Oscar · Cabine da Tripulação (Comunicações)',
  role: 'Gerencia atraso de 3–22 min (`O-O1` / `O-S1`) com terminal DTN interno',
  summary:
    'Mesa L com modem DTN inferior, duas telas largas inclinadas com barras de sincronia, console de áudio e antena interna helicoidal (`FX_Antenna`).',
  originNote: 'Centro do piso da cabine (y = 0)',
  references: [...CABIN_COMMON_REF, 'references/experiments/mars-experiments.md'],
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
      attachTop: [0, 0.56, 0],
      attachBottom: [0, 0, 0],
      fxAnchors: [{ name: 'FX_Antenna', pos: [-0.22, 0.56, -0.1], rot: [0, 0, 0], preset: 'signal' }],
      budget: { triangles: 700, meshes: 12 },
    });

    // Desk deck, support legs, front grab rail & lower DTN store-and-forward modem
    p.add('Root', 'Aluminum', box(0.56, 0.03, 0.38), { p: [0, 0.015, 0] })
      .add('Root', 'Pack', box(0.56, 0.036, 0.28), { p: [0, 0.25, 0.01] })
      .add('Root', 'Titanium', cyl(0.012, 0.012, 0.52, 6), { p: [0, 0.25, 0.165], r: [0, 0, 90] })
      .add('Root', 'HullBlack', box(0.32, 0.11, 0.2), { p: [0, 0.095, -0.02] })
      .add('Root', 'LedGreen', box(0.14, 0.015, 0.015), { p: [0, 0.11, 0.082] });
    for (const sx of [-1, 1]) {
      p.add('Root', 'Titanium', box(0.04, 0.21, 0.16), { p: [sx * 0.23, 0.135, -0.01] });
    }

    // Twin angled wide telemetry displays
    for (const sx of [-1, 1]) {
      const x = sx * 0.125;
      p.add('Root', 'HullBlack', box(0.22, 0.15, 0.025), { p: [x, 0.37, -0.04], r: [-12, -sx * 14, 0] })
        .add('Root', 'Visor', box(0.19, 0.12, 0.028), { p: [x, 0.37, -0.036], r: [-12, -sx * 14, 0] })
        .add('Root', 'LedGreen', box(0.12, 0.012, 0.012), { p: [x, 0.33, -0.022], r: [-12, -sx * 14, 0] });
    }

    // Equalizer & push-to-talk comms handset
    p.add('Root', 'Aluminum', box(0.12, 0.026, 0.09), { p: [0.15, 0.28, 0.09] })
      .add('Root', 'Strap', box(0.08, 0.022, 0.03), { p: [-0.04, 0.28, 0.09] });

    // Internal helical cabin transceiver mast (`FX_Antenna`)
    p.add('Root', 'FoilGold', cyl(0.026, 0.03, 0.04, 8), { p: [-0.22, 0.29, -0.1] })
      .add('Root', 'Steel', cyl(0.011, 0.014, 0.25, 8), { p: [-0.22, 0.43, -0.1] })
      .add('Root', 'Copper', ring(0.024, 0.006, 8, 4), { p: [-0.22, 0.53, -0.1] });

    return p;
  },
};

const cabinAutonavConjunction = {
  id: 'cabin-autonav-conjunction',
  category: 'cabin',
  tier: 3,
  name: 'CabinAutonavConjunction',
  displayName: 'Coprocessador AutoNav & Conjunção Solar IA',
  vehicle: 'Oscar · Cabine da Tripulação (Autonomia em Blecaute)',
  role: 'Opera em blecaute de 2–3 semanas (`§1`) e acelera navegação (`EN8`)',
  summary:
    'Monólito computacional anti-radiação com lâminas redundantes douradas de blindagem EMI, tubos de cobre de refrigeração e dissipador aletado no topo.',
  originNote: 'Centro do piso da cabine (y = 0)',
  references: [...CABIN_COMMON_REF, 'references/experiments/mars-experiments.md'],
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
      attachTop: [0, 0.53, 0],
      attachBottom: [0, 0, 0],
      budget: { triangles: 700, meshes: 12 },
    });

    // Cold-plate base + rugged black compute chassis
    p.add('Root', 'Aluminum', box(0.42, 0.035, 0.34), { p: [0, 0.0175, 0] })
      .add('Root', 'HullBlack', box(0.36, 0.4, 0.26), { p: [0, 0.235, -0.02] });

    // Dual vertical hot-swap AI compute blades with FoilGold EMI plates
    for (const sx of [-1, 1]) {
      const x = sx * 0.085;
      p.add('Root', 'Titanium', box(0.14, 0.32, 0.05), { p: [x, 0.235, 0.095] })
        .add('Root', 'FoilGold', box(0.105, 0.24, 0.02), { p: [x, 0.24, 0.115] })
        .add('Root', 'LedGreen', box(0.018, 0.18, 0.016), { p: [x + sx * 0.04, 0.235, 0.122] })
        // Side copper cooling manifolds climbing to top radiator
        .add('Root', 'Copper', cyl(0.014, 0.014, 0.4, 6), { p: [sx * 0.195, 0.26, -0.02] });
    }
    p.add('Root', 'Lamp', box(0.05, 0.018, 0.02), { p: [0, 0.415, 0.105] });

    // Top stacked aluminum heatsink fins
    for (let i = 0; i < 4; i++) {
      p.add('Root', 'Aluminum', box(0.38, 0.012, 0.24), { p: [0, 0.45 + i * 0.022, -0.02] });
    }

    return p;
  },
};

// ---------------------------------------------------------------------------
// D. Maya — Physiological Countermeasures, Bio-Lab & Storm Shelter
// ---------------------------------------------------------------------------

const cabinAredExercise = {
  id: 'cabin-ared-exercise',
  category: 'cabin',
  tier: 2,
  name: 'CabinAredExercise',
  displayName: 'Estação de Exercício Resistivo ARED (203+ dias)',
  vehicle: 'Maya · Cabine da Tripulação (Contramedida Óssea)',
  role: 'Previne perda óssea de 1–1,5%/mês (`BI8`) na travessia até Marte',
  summary:
    'Plataforma de isolamento VIS com cilindros gêmeos de vácuo em alumínio, discos inerciais traseiros e braço de levantamento com ombreira laranja.',
  originNote: 'Centro da plataforma isoladora na cabine (y = 0)',
  references: [...CABIN_COMMON_REF, 'references/experiments/mars-experiments.md'],
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
      attachTop: [0, 0.54, 0],
      attachBottom: [0, 0, 0],
      budget: { triangles: 700, meshes: 12 },
    });

    // VIS isolation base platform & textured footplate
    p.add('Root', 'Titanium', box(0.58, 0.04, 0.44), { p: [0, 0.02, 0] })
      .add('Root', 'Strap', box(0.42, 0.015, 0.28), { p: [0, 0.047, 0.03] });

    // Twin vertical 20 cm (8 in) vacuum cylinders + gold end seals + inertial flywheels
    for (const sx of [-1, 1]) {
      p.add('Root', 'Aluminum', cyl(0.052, 0.052, 0.46, 10), { p: [sx * 0.2, 0.27, -0.13] })
        .add('Root', 'FoilGold', cyl(0.056, 0.056, 0.026, 10), { p: [sx * 0.2, 0.51, -0.13] })
        .add('Root', 'Titanium', cyl(0.085, 0.085, 0.032, 10), { p: [sx * 0.11, 0.13, -0.07], r: [0, 0, 90] });
    }

    // Diagonal lifting boom + padded orange squat shoulder yokes + front bar
    p.add('Root', 'Steel', box(0.052, 0.052, 0.4), { p: [0, 0.28, -0.01], r: [-36, 0, 0] })
      .add('Root', 'Steel', cyl(0.014, 0.014, 0.36, 6), { p: [0, 0.39, 0.11], r: [0, 0, 90] })
      .add('Root', 'HullBlack', cyl(0.018, 0.018, 0.28, 6), { p: [0, 0.34, 0.16], r: [0, 0, 90] });
    for (const sx of [-1, 1]) {
      p.add('Root', 'Foam', box(0.09, 0.055, 0.08), { p: [sx * 0.1, 0.4, 0.11] });
    }

    return p;
  },
};

const cabinStormShelter = {
  id: 'cabin-storm-shelter',
  category: 'cabin',
  tier: 2,
  name: 'CabinStormShelter',
  displayName: 'Abrigo Solar de Parede d’Água & Baia Médica ISO 7010',
  vehicle: 'Maya · Cabine da Tripulação (Proteção SPE & SANS)',
  role: 'Refúgio em tempestades solares (`M-S5`) e exame SANS (`BI8` / `BI11`)',
  summary:
    'Bunker em C revestido com blocos de água contra radiação, assento médico, ultrassom portátil e sinalização de primeiros socorros ISO 7010 (cruz branca em fundo verde).',
  originNote: 'Centro do piso da cabine (y = 0)',
  references: [...CABIN_COMMON_REF, 'references/experiments/mars-experiments.md'],
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

    // Baseplate + aluminum outer frame roof & vertical ribs
    p.add('Root', 'Aluminum', box(0.58, 0.03, 0.44), { p: [0, 0.015, 0] })
      .add('Root', 'Aluminum', box(0.58, 0.03, 0.4), { p: [0, 0.605, -0.02] })
      // Rear water-wall shielding bladder stack (-Z) + side walls
      .add('Root', 'Pack', box(0.54, 0.56, 0.1), { p: [0, 0.31, -0.15] })
      .add('Root', 'Pack', box(0.08, 0.56, 0.28), { p: [-0.24, 0.31, -0.01] })
      .add('Root', 'Visor', box(0.46, 0.44, 0.02), { p: [0, 0.31, -0.095] })
      // Internal cushioned shelter / medical exam bench
      .add('Root', 'Strap', box(0.28, 0.06, 0.22), { p: [-0.03, 0.09, -0.02] })
      .add('Root', 'Strap', box(0.28, 0.24, 0.05), { p: [-0.03, 0.22, -0.075] });

    // SANS ultrasound diagnostic screen on left front pillar
    p.add('Root', 'HullBlack', box(0.11, 0.11, 0.04), { p: [-0.21, 0.34, 0.13], r: [0, 28, 0] })
      .add('Root', 'Visor', box(0.085, 0.075, 0.015), { p: [-0.205, 0.345, 0.15], r: [0, 28, 0] })
      .add('Root', 'Lamp', box(0.08, 0.018, 0.02), { p: [0, 0.585, 0.17] });

    // Front-right medical supply bulkhead with ISO 7010 white cross on green ground (NEVER red cross)
    p.add('Root', 'Hull', box(0.22, 0.42, 0.09), { p: [0.165, 0.24, 0.145] })
      .add('Root', 'LedGreen', box(0.105, 0.105, 0.01), { p: [0.165, 0.3, 0.193] })
      .add('Root', 'Hull', box(0.072, 0.022, 0.01), { p: [0.165, 0.3, 0.198] })
      .add('Root', 'Hull', box(0.022, 0.072, 0.01), { p: [0.165, 0.3, 0.198] });

    return p;
  },
};

const cabinMsgMinion = {
  id: 'cabin-msg-minion',
  category: 'cabin',
  tier: 3,
  name: 'CabinMsgMinion',
  displayName: 'Glovebox Microgravidade MSG & Sequenciador MinION',
  vehicle: 'Maya · Cabine da Tripulação (Biologia & Biomining)',
  role: 'Sequencia 4–20 Gb/run em órbita (`BI9` / `BI10`) mantendo biocontenção',
  summary:
    'Cabine fechada MSG iluminada com janela angulada, dois portos circulares com luvas navais, centrífuga interna e sequenciador MinION dourado.',
  originNote: 'Centro do piso da cabine (y = 0)',
  references: [...CABIN_COMMON_REF, 'references/experiments/mars-experiments.md'],
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

    // Baseplate & lower utility drawer cabinet
    p.add('Root', 'Aluminum', box(0.54, 0.03, 0.38), { p: [0, 0.015, 0] })
      .add('Root', 'Titanium', box(0.5, 0.14, 0.34), { p: [0, 0.1, 0] })
      // Sealed glovebox rear wall, top illumination hood & side cheeks
      .add('Root', 'Hull', box(0.52, 0.44, 0.12), { p: [0, 0.39, -0.11] })
      .add('Root', 'Hull', box(0.52, 0.05, 0.32), { p: [0, 0.59, -0.01] })
      .add('Root', 'Lamp', box(0.38, 0.018, 0.08), { p: [0, 0.56, 0.02] });
    for (const sx of [-1, 1]) {
      p.add('Root', 'Hull', box(0.045, 0.44, 0.32), { p: [sx * 0.238, 0.39, -0.01] });
    }

    // Illuminated bio-containment work tray, MinION sequencer & mini centrifuge
    p.add('Root', 'Aluminum', box(0.42, 0.02, 0.24), { p: [0, 0.19, 0.01] })
      .add('Root', 'FoilGold', box(0.085, 0.026, 0.042), { p: [0.09, 0.215, 0.03] })
      .add('Root', 'HullBlack', box(0.045, 0.028, 0.044), { p: [0.13, 0.215, 0.03] })
      .add('Root', 'Titanium', cyl(0.048, 0.054, 0.08, 8), { p: [-0.09, 0.24, 0] })
      .add('Root', 'LedGreen', box(0.09, 0.016, 0.016), { p: [0.15, 0.54, 0.14] });

    // Angled front glass visor + lower glove bulkhead with twin glove ports
    p.add('Root', 'Visor', box(0.42, 0.22, 0.016), { p: [0, 0.43, 0.11], r: [-22, 0, 0] })
      .add('Root', 'Hull', box(0.43, 0.13, 0.03), { p: [0, 0.25, 0.145] });
    for (const sx of [-1, 1]) {
      p.add('Root', 'Steel', ring(0.048, 0.008, 10, 4), { p: [sx * 0.105, 0.25, 0.162], r: [90, 0, 0] })
        .add('Root', 'Pack', cyl(0.032, 0.022, 0.04, 8), { p: [sx * 0.105, 0.25, 0.142], r: [90, 0, 0] });
    }

    return p;
  },
};

export default [
  cabinLaunchSeats,
  cabinOrionCockpit,
  cabinIdssDocking,
  cabinPcduThermal,
  cabinEvaAirlock,
  cabinEclssWrs,
  cabinHeraDosimetry,
  cabinScanConsole,
  cabinAutonavConjunction,
  cabinAredExercise,
  cabinStormShelter,
  cabinMsgMinion,
];
