import { createPartBuilder } from '../lib/part-builder.mjs';
import { ball, box, cyl, ring } from '../lib/shapes.mjs';

/**
 * Procedural low-poly 3D model for the 1st-Person Pilot Control Panel (`cockpit-pilot`).
 *
 * Synthesizes:
 * - NASA Space Shuttle Orbiter Aft Flight Deck (panels A6/A7/A8, RHC/THC, 12-tile Caution & Warning
 *   matrix above a blue "Warning" plaque, upper-left canted CCTV monitor, twin forward + twin overhead windows)
 * - NASA Orion MPCV / Space Shuttle MEDS 3-screen glass cockpit (Left: FDAI 8-ball attitude reticle;
 *   Center: vertical telemetry resource bars + engine cluster ring; Right: ascent trajectory graph)
 * - 3-wing wrap-around ergonomic console (+25 deg left wing, raised center MFD pedestal, -25 deg right wing)
 *   with red emergency glow strips, flanking pilot seats, and twin red-knobbed throttle levers.
 *
 * Conventions:
 * - Units: meters, +Y up, -Z forward through windshield (standard Godot Camera3D forward direction).
 * - Origin (0,0,0) at cabin floor center under pilot seat (`minY = 0`).
 * - `Camera_Pilot` anchor at `(0, 1.18, 0.38)` looking toward `(0, 0.86, -0.55)`.
 */

const cockpitPilot = {
  id: 'cockpit-pilot',
  name: 'CockpitPilot',
  category: 'cockpit',
  tier: 2,
  displayName: '1st-Person Pilot Control Panel & Flight Deck',
  vehicle: 'NASA Space Shuttle Orbiter (Aft Flight Deck & MEDS) / Orion MPCV',
  role: '1st-Person Launch, Ascent, Orbit Insertion & Emergency Minigame Cockpit',
  summary:
    'U-shaped 1st-person control panel with 3 MFD screens (FDAI 8-ball reticle, vertical resource bars and ascent graph), 12-light Caution & Warning matrix, upper-left CCTV monitor, articulated controls (RHC, THC, twin throttle, circuit breakers and guarded switches) and panoramic windows.',
  originNote: 'Origin (0,0,0) at the cabin floor center; front windshield at -Z; Camera_Pilot at (0, 1.18, 0.38)',
  references: [
    'references/parts/pilot-cockpit.md',
    'docs/resources/painel-piloto-1a-pessoa.md',
  ],
  build() {
    const b = createPartBuilder({
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
      attachTop: [0, 1.64, 0],
      attachBottom: [0, 0, 0],
      extraAnchors: [
        {
          name: 'Camera_Pilot',
          pos: [0, 1.18, 0.38],
          rot: [-18, 0, 0],
          userData: { target: [0, 0.86, -0.55], fov: 62 },
        },
      ],
      pivots: [
        { name: 'Joystick_RHC', pos: [0, 0.78, -0.34] },
        { name: 'Controller_THC', pos: [0.15, 0.78, -0.34] },
        { name: 'Throttle_Lever', pos: [0, 0.62, -0.08] },
        { name: 'Breaker_Bank', pos: [-0.56, 0.76, -0.34], rot: [0, 25, 0] },
        { name: 'Stage_Sep_Switch', pos: [0.48, 0.76, -0.36], rot: [0, -25, 0] },
        { name: 'EDL_Arm_Switch', pos: [0.58, 0.76, -0.32], rot: [0, -25, 0] },
        { name: 'Abort_Button', pos: [-0.22, 0.82, -0.44] },
        { name: 'Alarm_Master_Red', pos: [-0.18, 1.00, -0.48] },
        { name: 'Alarm_Caution_Amber', pos: [0.18, 1.00, -0.48] },
      ],
      fxAnchors: [
        { name: 'FX_Sparks_Left', pos: [-0.52, 0.78, -0.38], rot: [0, 0, -25], preset: 'sparks' },
        { name: 'FX_Sparks_Right', pos: [0.52, 0.78, -0.38], rot: [0, 0, 25], preset: 'sparks' },
      ],
      budget: { triangles: 2200, meshes: 35 },
    });

    // -------------------------------------------------------------------------
    // 1. CABIN FLOOR, BULKHEADS & PANORAMIC WINDSHIELD ARCH (-Z forward)
    // -------------------------------------------------------------------------
    // Main deck floor plate (minY = 0.00)
    b.add('Root', 'Titanium', box(2.08, 0.06, 1.36), { p: [0, 0.03, -0.06] });
    // Center anti-slip aisle runner & footwell recess
    b.add('Root', 'HullBlack', box(0.74, 0.02, 1.12), { p: [0, 0.07, -0.04] });
    for (const z of [-0.42, -0.24, -0.06, 0.12, 0.30]) {
      b.add('Root', 'Aluminum', box(0.64, 0.012, 0.03), { p: [0, 0.082, z] });
    }

    // Forward lower bulkhead wall beneath console
    b.add('Root', 'Titanium', box(1.96, 0.68, 0.10), { p: [0, 0.37, -0.68] });
    // Side cockpit sills / armrests framing the pilot view
    for (const sx of [-1, 1]) {
      b.add('Root', 'Hull', box(0.10, 0.86, 1.24), { p: [sx * 0.98, 0.46, -0.06] });
      // Upper angled window A-pillars (Image 1 & Image 2)
      b.add('Root', 'Hull', box(0.09, 0.78, 0.09), {
        p: [sx * 0.90, 1.22, -0.56],
        r: [12, 0, sx * 10],
      });
      // Side rear B-pillars
      b.add('Root', 'Titanium', box(0.08, 0.76, 0.08), {
        p: [sx * 0.94, 1.22, 0.36],
        r: [-6, 0, sx * 6],
      });
    }
    // Center windshield mullion post between Left and Right forward windows (Image 2)
    b.add('Root', 'Hull', box(0.12, 0.56, 0.08), { p: [0, 1.22, -0.64], r: [10, 0, 0] });

    // Forward Twin Observation Windows (Shuttle Aft Deck style, Image 2 & Image 1 panoramic view)
    for (const sx of [-1, 1]) {
      b.add('Root', 'HullBlack', box(0.68, 0.44, 0.05), {
        p: [sx * 0.44, 1.22, -0.64],
        r: [10, sx * -6, 0],
      });
      b.add('Root', 'Visor', box(0.60, 0.36, 0.025), {
        p: [sx * 0.44, 1.22, -0.64],
        r: [10, sx * -6, 0],
      });
    }

    // Overhead Canopy Arch, Twin Skylight Windows & Louvered Vents (Image 1, 2 & 3)
    b.add('Root', 'Hull', box(1.88, 0.08, 0.96), { p: [0, 1.58, -0.16] });
    // Center overhead structural spine with yellow warning stripe (Shuttle overhead post in Image 2)
    b.add('Root', 'Titanium', box(0.16, 0.09, 0.88), { p: [0, 1.55, -0.16] });
    b.add('Root', 'FoilGold', box(0.10, 0.015, 0.16), { p: [0, 1.50, -0.48] });
    // Overhead cabin dome light (Image 1 top center spotlight)
    b.add('Root', 'Aluminum', cyl(0.14, 0.16, 0.04, 8), { p: [0, 1.52, -0.06] });
    b.add('Root', 'Lamp', cyl(0.10, 0.12, 0.02, 8), { p: [0, 1.50, -0.06] });

    // Twin Overhead Skylight Windows (Image 2 top windows)
    for (const sx of [-1, 1]) {
      b.add('Root', 'HullBlack', box(0.58, 0.05, 0.44), {
        p: [sx * 0.44, 1.56, -0.26],
        r: [14, 0, 0],
      });
      b.add('Root', 'Visor', box(0.50, 0.025, 0.36), {
        p: [sx * 0.44, 1.56, -0.26],
        r: [14, 0, 0],
      });
      // Overhead louvered air vents above side consoles (Image 3 top left/right vents)
      b.add('Root', 'Titanium', box(0.26, 0.16, 0.10), {
        p: [sx * 0.68, 1.44, -0.56],
        r: [10, sx * -14, 0],
      });
      for (let i = -1; i <= 1; i++) {
        b.add('Root', 'HullBlack', box(0.22, 0.020, 0.02), {
          p: [sx * 0.68, 1.44 + i * 0.038, -0.51],
          r: [10, sx * -14, 0],
        });
      }
    }

    // -------------------------------------------------------------------------
    // 2. FLANKING PILOT & CO-PILOT SEATS (Image 1 foreground framing)
    // -------------------------------------------------------------------------
    for (const sx of [-1, 1]) {
      const x = sx * 0.56;
      // Seat pedestal base
      b.add('Root', 'Titanium', box(0.34, 0.24, 0.34), { p: [x, 0.15, 0.38] });
      // Seat pan cushion
      b.add('Root', 'Pack', box(0.42, 0.09, 0.40), { p: [x, 0.31, 0.36] });
      // Contoured seat backrest (angled slightly back so it frames peripheral view without blocking camera)
      b.add('Root', 'Hull', box(0.42, 0.54, 0.09), {
        p: [x, 0.62, 0.52],
        r: [-8, sx * -8, 0],
      });
      // Blue padded lumbar insert (Image 1)
      b.add('Root', 'Pack', box(0.30, 0.34, 0.03), {
        p: [x, 0.60, 0.47],
        r: [-8, sx * -8, 0],
      });
      // Twin headrest posts & sculpted headrest (Image 1)
      for (const px of [-0.10, 0.10]) {
        b.add('Root', 'Aluminum', cyl(0.018, 0.018, 0.12, 6), {
          p: [x + px, 0.93, 0.55],
        });
      }
      b.add('Root', 'Hull', box(0.36, 0.18, 0.10), {
        p: [x, 1.04, 0.56],
        r: [0, sx * -8, 0],
      });
      b.add('Root', 'Pack', box(0.28, 0.12, 0.03), {
        p: [x, 1.04, 0.51],
        r: [0, sx * -8, 0],
      });
      // 4-point gold/amber harness straps
      for (const hx of [-0.09, 0.09]) {
        b.add('Root', 'Foam', box(0.04, 0.46, 0.02), {
          p: [x + hx, 0.62, 0.45],
          r: [-8, sx * -8, 0],
        });
      }
    }

    // -------------------------------------------------------------------------
    // 3. 3-WING WRAP-AROUND CONSOLE DESK & RED EMERGENCY GLOW WELLS (Image 2 & 3)
    // -------------------------------------------------------------------------
    // Central desk pedestal support column
    b.add('Root', 'Titanium', box(0.86, 0.66, 0.38), { p: [0, 0.36, -0.46] });
    // Center sloped switch apron (Shuttle A6/A7 sloped console in Image 2)
    b.add('Root', 'Hull', box(0.76, 0.12, 0.38), {
      p: [0, 0.74, -0.38],
      r: [22, 0, 0],
    });
    // Left & Right wrap-around wing desks (+25 deg and -25 deg, Image 3)
    for (const sx of [-1, 1]) {
      const yaw = sx * -25;
      b.add('Root', 'Titanium', box(0.62, 0.64, 0.34), {
        p: [sx * 0.58, 0.35, -0.36],
        r: [0, yaw, 0],
      });
      b.add('Root', 'Hull', box(0.64, 0.10, 0.38), {
        p: [sx * 0.56, 0.73, -0.34],
        r: [20, yaw, 0],
      });
      // Recessed red emergency glow well between center MFD and side wings (Image 3)
      b.add('Root', 'HullBlack', box(0.14, 0.18, 0.10), {
        p: [sx * 0.32, 0.84, -0.48],
        r: [-12, yaw * 0.5, 0],
      });
      b.add('Root', 'LedRed', box(0.11, 0.14, 0.02), {
        p: [sx * 0.32, 0.84, -0.44],
        r: [-12, yaw * 0.5, 0],
      });
      // Wing status keypad strip (Image 1 & 3 side button banks)
      b.add('Root', 'HullBlack', box(0.24, 0.02, 0.14), {
        p: [sx * 0.42, 0.76, -0.28],
        r: [20, yaw, 0],
      });
      b.add('Root', 'LedRed', box(0.08, 0.025, 0.03), {
        p: [sx * 0.40, 0.77, -0.31],
        r: [20, yaw, 0],
      });
      b.add('Root', 'Lamp', box(0.08, 0.025, 0.03), {
        p: [sx * 0.40, 0.75, -0.26],
        r: [20, yaw, 0],
      });
    }

    // Raised Center MFD Housing & Anti-Glare Glareshield Hood (Image 1 & Image 3)
    b.add('Root', 'Hull', box(1.04, 0.36, 0.18), {
      p: [0, 0.90, -0.52],
      r: [-10, 0, 0],
    });
    b.add('Root', 'HullBlack', box(1.00, 0.32, 0.04), {
      p: [0, 0.90, -0.44],
      r: [-10, 0, 0],
    });
    // Navy/blue frame bezel around the 3-zone MFD (Image 1)
    b.add('Root', 'Pack', box(1.02, 0.022, 0.05), { p: [0, 1.06, -0.46], r: [-10, 0, 0] });
    b.add('Root', 'Pack', box(1.02, 0.022, 0.05), { p: [0, 0.74, -0.41], r: [-10, 0, 0] });

    // -------------------------------------------------------------------------
    // 4. THREE-ZONE PRIMARY FLIGHT DISPLAY (Image 1 + Image 3 HUD geometry)
    // -------------------------------------------------------------------------
    // --- Zone A (Left): Attitude Director (FDAI 8-Ball) & Target Crosshair ---
    b.add('Root', 'Visor', box(0.30, 0.25, 0.02), { p: [-0.32, 0.90, -0.43], r: [-10, 0, 0] });
    // Outer targeting ring
    b.add('Root', 'LedGreen', ring(0.09, 0.008, 8, 3), {
      p: [-0.32, 0.90, -0.415],
      r: [80, 0, 0],
    });
    // 3D Low-Poly Navball (FDAI sphere) with crosshair axes
    b.add('Root', 'Lamp', ball(0.062, 6, 4), { p: [-0.32, 0.90, -0.42] });
    b.add('Root', 'LedRed', box(0.11, 0.010, 0.015), { p: [-0.32, 0.90, -0.355], r: [-10, 0, 0] });
    b.add('Root', 'LedRed', box(0.010, 0.11, 0.015), { p: [-0.32, 0.90, -0.355], r: [-10, 0, 0] });

    // --- Zone B (Center): Vertical Resource Bars & Engine Cluster Ring (Image 1 center) ---
    b.add('Root', 'Pack', box(0.22, 0.25, 0.02), { p: [0, 0.90, -0.43], r: [-10, 0, 0] });
    // Top warning banners (Red & Amber bars in Image 1 center)
    b.add('Root', 'LedRed', box(0.16, 0.028, 0.015), { p: [0, 0.99, -0.435], r: [-10, 0, 0] });
    b.add('Root', 'Lamp', box(0.16, 0.028, 0.015), { p: [0, 0.95, -0.428], r: [-10, 0, 0] });
    // 4 Vertical Telemetry Bars (Propellant, Power, Thermal, Data)
    const barX = [-0.06, -0.02, 0.02, 0.06];
    const barMats = ['LedGreen', 'FoilGold', 'Lamp', 'Foam'];
    const barH = [0.09, 0.08, 0.06, 0.075];
    for (let i = 0; i < 4; i++) {
      b.add('Root', barMats[i], box(0.024, barH[i], 0.015), {
        p: [barX[i], 0.83 + barH[i] * 0.5, -0.415],
        r: [-10, 0, 0],
      });
    }
    // Bottom horizontal bar rungs (Image 1)
    for (let rIdx = 0; rIdx < 3; rIdx++) {
      b.add('Root', 'Hull', box(0.14, 0.010, 0.015), {
        p: [0, 0.78 + rIdx * 0.02, -0.405],
        r: [-10, 0, 0],
      });
    }

    // --- Zone C (Right): Ascent Trajectory Graph (Altitude vs Velocity curve, Image 1 right) ---
    b.add('Root', 'Visor', box(0.30, 0.25, 0.02), { p: [0.32, 0.90, -0.43], r: [-10, 0, 0] });
    // Graph axes (L-frame)
    b.add('Root', 'Hull', box(0.010, 0.19, 0.015), { p: [0.21, 0.90, -0.415], r: [-10, 0, 0] });
    b.add('Root', 'Hull', box(0.22, 0.010, 0.015), { p: [0.32, 0.81, -0.405], r: [-10, 0, 0] });
    // Multi-segment rising ascent trajectory line (Image 1 right graph)
    b.add('Root', 'LedGreen', box(0.06, 0.012, 0.015), {
      p: [0.24, 0.84, -0.41],
      r: [-10, 0, 38],
    });
    b.add('Root', 'LedGreen', box(0.05, 0.012, 0.015), {
      p: [0.29, 0.87, -0.412],
      r: [-10, 0, -18],
    });
    b.add('Root', 'Lamp', box(0.07, 0.012, 0.015), {
      p: [0.34, 0.91, -0.418],
      r: [-10, 0, 48],
    });
    b.add('Root', 'LedRed', box(0.06, 0.012, 0.015), {
      p: [0.39, 0.95, -0.425],
      r: [-10, 0, 22],
    });

    // -------------------------------------------------------------------------
    // 5. SHUTTLE CAUTION & WARNING (C&W) 12-TILE MATRIX & BLUE PLAQUE (Image 2)
    // -------------------------------------------------------------------------
    // Central 2x6 backlit annunciator grid on the sloped console apron
    b.add('Root', 'HullBlack', box(0.16, 0.025, 0.16), {
      p: [0, 0.72, -0.25],
      r: [22, 0, 0],
    });
    const tileMats = [
      'LedGreen', 'LedGreen',
      'LedGreen', 'Lamp',
      'LedGreen', 'LedRed',
      'Lamp',     'LedGreen',
      'LedGreen', 'LedGreen',
      'LedRed',   'Lamp',
    ];
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 2; col++) {
        const mat = tileMats[row * 2 + col];
        const dz = -0.31 + row * 0.024;
        const dy = 0.745 - row * 0.0095;
        b.add('Root', mat, box(0.062, 0.018, 0.018), {
          p: [(col === 0 ? -1 : 1) * 0.036, dy, dz],
          r: [22, 0, 0],
        });
      }
    }
    // Iconic NASA Space Shuttle Blue "Warning" Plaque right below the 12-tile matrix (Image 2)
    b.add('Root', 'Pack', box(0.14, 0.018, 0.055), {
      p: [0, 0.675, -0.14],
      r: [22, 0, 0],
    });
    b.add('Root', 'Hull', box(0.10, 0.020, 0.012), {
      p: [0, 0.680, -0.155],
      r: [22, 0, 0],
    });

    // -------------------------------------------------------------------------
    // 6. UPPER-LEFT CANTED CCTV MONITOR (`Monitor_CCTV`, Image 2 top-left CRT)
    // -------------------------------------------------------------------------
    b.add('Root', 'Hull', box(0.30, 0.24, 0.14), {
      p: [-0.66, 1.20, -0.48],
      r: [8, 28, 0],
    });
    b.add('Root', 'HullBlack', box(0.26, 0.19, 0.03), {
      p: [-0.63, 1.20, -0.42],
      r: [8, 28, 0],
    });
    b.add('Root', 'Visor', box(0.23, 0.16, 0.02), {
      p: [-0.62, 1.20, -0.41],
      r: [8, 28, 0],
    });
    // Mini rocket booster silhouette inside CCTV screen + telemetry status LEDs
    b.add('Root', 'Hull', cyl(0.016, 0.020, 0.11, 6), {
      p: [-0.61, 1.20, -0.40],
      r: [8, 28, 0],
    });
    b.add('Root', 'Foam', cyl(0.022, 0.006, 0.03, 6), {
      p: [-0.61, 1.13, -0.39],
      r: [8, 28, 0],
    });

    // -------------------------------------------------------------------------
    // 7. CENTER PEDESTAL & ARTICULATED CONTROLS (Pivots for Godot Minigames)
    // -------------------------------------------------------------------------
    // Foreground Center Throttle Pedestal between the seats (Image 1 bottom-center)
    b.add('Root', 'Hull', box(0.38, 0.56, 0.24), { p: [0, 0.28, -0.08] });
    b.add('Root', 'HullBlack', box(0.28, 0.03, 0.18), { p: [0, 0.57, -0.08] });
    // 3 illuminated red status buttons between the throttle slots (Image 1)
    for (const bx of [-0.07, 0, 0.07]) {
      b.add('Root', 'LedRed', cyl(0.018, 0.020, 0.02, 6), { p: [bx, 0.585, -0.14] });
    }

    // Pivot 1: `Throttle_Lever` at `(0, 0.62, -0.08)` — Twin levers with spherical red knobs (Image 1)
    for (const lx of [-0.09, 0.09]) {
      b.add('Throttle_Lever', 'Aluminum', box(0.022, 0.16, 0.028), {
        p: [lx, 0.68, -0.08],
        r: [-14, 0, 0],
      });
      b.add('Throttle_Lever', 'LedRed', ball(0.034, 6, 4), {
        p: [lx, 0.76, -0.10],
      });
    }

    // Pivot 2: `Joystick_RHC` at `(0, 0.78, -0.34)` — Space Shuttle Rotational Hand Controller (Image 2)
    b.add('Joystick_RHC', 'Aluminum', cyl(0.048, 0.056, 0.03, 6), { p: [0, 0.78, -0.34] });
    b.add('Joystick_RHC', 'HullBlack', cyl(0.036, 0.044, 0.04, 6), { p: [0, 0.80, -0.34] });
    b.add('Joystick_RHC', 'HullBlack', cyl(0.022, 0.026, 0.14, 6), {
      p: [0, 0.87, -0.34],
      r: [10, 0, 0],
    });
    b.add('Joystick_RHC', 'HullBlack', box(0.044, 0.045, 0.055), {
      p: [0, 0.94, -0.33],
      r: [10, 0, 0],
    });
    b.add('Joystick_RHC', 'LedRed', box(0.020, 0.015, 0.020), {
      p: [0, 0.955, -0.33],
      r: [10, 0, 0],
    });

    // Pivot 3: `Controller_THC` at `(0.15, 0.78, -0.34)` — Square Translational Hand Controller (Image 2)
    b.add('Controller_THC', 'Hull', box(0.085, 0.04, 0.085), { p: [0.15, 0.78, -0.34] });
    b.add('Controller_THC', 'HullBlack', box(0.024, 0.06, 0.024), { p: [0.15, 0.82, -0.34] });
    b.add('Controller_THC', 'HullBlack', box(0.055, 0.032, 0.038), { p: [0.15, 0.85, -0.34] });

    // Pivot 4: `Breaker_Bank` at `(-0.56, 0.76, -0.34)` — Left Wing Bus Bar / Circuit Breakers (Lucas Minigame)
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 3; col++) {
        const bx = -0.61 + col * 0.05;
        const bz = -0.37 + row * 0.05;
        b.add('Breaker_Bank', 'Aluminum', box(0.018, 0.028, 0.018), { p: [bx, 0.77, bz] });
        b.add('Breaker_Bank', 'Hull', box(0.024, 0.014, 0.024), { p: [bx, 0.79, bz] });
      }
    }

    // Pivot 5: `Stage_Sep_Switch` at `(0.48, 0.76, -0.36)` — Guarded Stage Separation Toggle
    b.add('Stage_Sep_Switch', 'FoilGold', box(0.05, 0.045, 0.06), { p: [0.48, 0.78, -0.36] });
    b.add('Stage_Sep_Switch', 'LedRed', box(0.016, 0.045, 0.016), {
      p: [0.48, 0.78, -0.35],
      r: [24, 0, 0],
    });

    // Pivot 6: `EDL_Arm_Switch` at `(0.58, 0.76, -0.32)` — Guarded Parachute/EDL Arm Toggle
    b.add('EDL_Arm_Switch', 'FoilGold', box(0.05, 0.045, 0.06), { p: [0.58, 0.78, -0.32] });
    b.add('EDL_Arm_Switch', 'LedGreen', box(0.016, 0.045, 0.016), {
      p: [0.58, 0.78, -0.31],
      r: [24, 0, 0],
    });

    // Pivot 7: `Abort_Button` at `(-0.22, 0.82, -0.44)` — Guarded Emergency Abort Pushbutton
    b.add('Abort_Button', 'Aluminum', cyl(0.038, 0.042, 0.025, 6), {
      p: [-0.22, 0.82, -0.44],
      r: [70, 0, 0],
    });
    b.add('Abort_Button', 'LedRed', cyl(0.028, 0.030, 0.032, 6), {
      p: [-0.22, 0.825, -0.43],
      r: [70, 0, 0],
    });

    // Pivot 8 & 9: `Alarm_Master_Red` & `Alarm_Caution_Amber` on the Glareshield
    b.add('Alarm_Master_Red', 'LedRed', box(0.075, 0.032, 0.032), {
      p: [-0.18, 1.00, -0.48],
      r: [-10, 0, 0],
    });
    b.add('Alarm_Caution_Amber', 'Lamp', box(0.075, 0.032, 0.032), {
      p: [0.18, 1.00, -0.48],
      r: [-10, 0, 0],
    });

    return b;
  },
};

export default [cockpitPilot];
