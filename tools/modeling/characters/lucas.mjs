import { addLimbBand, addLimbStripe } from '../lib/avatar.mjs';
import { box, cyl, ring } from '../lib/shapes.mjs';
import { wave } from '../lib/animations.mjs';

export default {
  id: 'lucas',
  name: 'Lucas',
  role: 'Engenheiro de Sistemas',
  accent: '#F2A900',
  visor: 'Visor',
  summary:
    'Cor âmbar de engenharia, painel solar enrolado e bateria na mochila, cinto de ferramentas e furadeira de mão.',
  equipment: [
    { item: 'Painel solar enrolado sobre a mochila', basis: 'ROSA, painel solar que se desenrola, testado na ISS' },
    { item: 'Módulo de bateria com LEDs de carga', basis: 'Baterias que cobrem picos de consumo (Perseverance)' },
    { item: 'Furadeira de mão', basis: 'Pistol Grip Tool, ferramenta motorizada das caminhadas espaciais na ISS' },
    { item: 'Cinto com bolsas de ferramentas', basis: 'Ferramentas presas ao traje por cabos e bolsas nas EVAs' },
    { item: 'Joelheiras e biqueiras âmbar', basis: 'Reforço de abrasão (estilizado)' },
  ],
  animations: {
    idle_loop: 'Parado, respirando',
    walk_loop: 'Caminhada em baixa gravidade',
    wave: 'Aceno',
    action_loop: 'Consertando com a furadeira (faíscas na ponta)',
  },

  build(avatar) {
    for (const [s, side] of [['L', 1], ['R', -1]]) {
      avatar.part(`UpperLeg_${s}`).add('Accent', box(0.12, 0.1, 0.05), { p: [0, -0.38, 0.075] });
      avatar.part(`Foot_${s}`).add('Accent', box(0.155, 0.05, 0.07), { p: [0, -0.07, 0.15] });
      addLimbStripe(avatar, `LowerLeg_${s}`, side, { y: -0.08, length: 0.1, offset: 0.083 });
      addLimbStripe(avatar, `LowerLeg_${s}`, side, { y: -0.24, length: 0.1, offset: 0.08 });
      addLimbBand(avatar, `LowerArm_${s}`, { y: -0.08, radius: 0.069 });
    }

    const torso = avatar.part('Torso');
    // Rolled solar blanket on top of the pack.
    torso.add('Visor', cyl(0.045, 0.045, 0.42, 8), { p: [0, 0.625, -0.27], r: [0, 0, 90] });
    torso.add('Metal', cyl(0.05, 0.05, 0.02, 8), { p: [0.22, 0.625, -0.27], r: [0, 0, 90] });
    torso.add('Metal', cyl(0.05, 0.05, 0.02, 8), { p: [-0.22, 0.625, -0.27], r: [0, 0, 90] });
    // Battery module with charge LEDs on the right side of the pack.
    torso.add('SuitGrey', box(0.08, 0.34, 0.15), { p: [-0.275, 0.27, -0.27] });
    for (let i = 0; i < 3; i++) {
      torso.add('LedGreen', box(0.006, 0.05, 0.09), { p: [-0.318, 0.18 + i * 0.08, -0.27] });
    }

    // Tool belt.
    const hips = avatar.part('Hips');
    hips.add('Strap', ring(0.2, 0.02, 12), { p: [0, -0.08, 0], s: [1, 1, 0.8] });
    hips.add('Strap', box(0.08, 0.09, 0.05), { p: [0.16, -0.13, 0.1], r: [0, 30, 0] });
    hips.add('Strap', box(0.08, 0.09, 0.05), { p: [-0.16, -0.13, 0.1], r: [0, -30, 0] });
    hips.add('Metal', box(0.02, 0.14, 0.012), { p: [0.205, -0.15, -0.02] });

    // Pistol-grip drill in the right hand, pointing forward.
    const hand = avatar.part('Hand_R');
    hand.add('Strap', box(0.035, 0.09, 0.045), { p: [0, -0.11, 0.02] });
    hand.add('Accent', box(0.06, 0.07, 0.19), { p: [0, -0.07, 0.1] });
    hand.add('Metal', cyl(0.022, 0.022, 0.04, 6), { p: [0, -0.07, 0.215], r: [90, 0, 0] });
    hand.add('Metal', cyl(0.007, 0.003, 0.09, 5), { p: [0, -0.07, 0.28], r: [90, 0, 0] });

    avatar.anchor('FX_Sparks', 'Hand_R', { p: [0, -0.07, 0.33], r: [90, 0, 0] }, {
      preset: 'sparks',
      clips: ['action_loop'],
    });
  },

  action: {
    duration: 1.6,
    samples: 24,
    pose(u) {
      const jitter = wave(u, 6);
      return {
        Hips: { p: [0, -0.02, 0] },
        Torso: { r: [12, -10, 0] },
        Head: { r: [10, -6, 0] },
        UpperArm_R: { r: [-70, 0, 6] },
        LowerArm_R: { r: [-15 + 1.5 * jitter, 0, 0] },
        Hand_R: { r: [90, 0, 0] },
        UpperArm_L: { r: [-50, 0, -12] },
        LowerArm_L: { r: [-45, 0, 0] },
        UpperLeg_L: { r: [-15, 0, 0] },
        LowerLeg_L: { r: [25, 0, 0] },
        Foot_L: { r: [-10, 0, 0] },
        UpperLeg_R: { r: [5, 0, 0] },
        LowerLeg_R: { r: [10, 0, 0] },
        Foot_R: { r: [-15, 0, 0] },
      };
    },
  },
};
