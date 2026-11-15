import { addHarnessStripe, addHelmetStripe, addLimbBand, addLimbStripe } from '../lib/avatar.mjs';
import { box, cyl, cylOpen } from '../lib/shapes.mjs';
import { wave } from '../lib/animations.mjs';

export default {
  id: 'lucas',
  name: 'Lucas',
  role: 'Engenheiro de Sistemas',
  accent: '#F2A900',
  visor: 'Visor',
  summary:
    'Duas listras paralelas âmbar no capacete, joelheiras e biqueiras reforçadas, faixas duplas nas canelas e faixa no antebraço, painel ROSA e furadeira.',
  equipment: [
    { item: 'Duas listras paralelas no capacete, faixas duplas nas canelas e faixa no antebraço', basis: 'Marcações âmbar de alta visibilidade para identificação do engenheiro' },
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
    // Signature amber engineering pattern: twin helmet crown stripes, hip harness trim,
    // reinforced knee pads & boot toe guards, double shin bands, forearm band, vertical arm stripe.
    addHelmetStripe(avatar, 'twin');
    addHarnessStripe(avatar, 'Hips', { p: [0.095, -0.02, 0.195], s: [0.028, 0.16, 0.014], r: [8, 0, 26] });
    addHarnessStripe(avatar, 'Hips', { p: [-0.095, -0.02, 0.195], s: [0.028, 0.16, 0.014], r: [8, 0, -26] });

    for (const [s, side] of [['L', 1], ['R', -1]]) {
      avatar.part(`UpperLeg_${s}`).add('Accent', box(0.15, 0.098, 0.056), { p: [side * 0.016, -0.365, 0.098] });
      avatar.part(`Foot_${s}`).add('Accent', box(0.162, 0.054, 0.092), { p: [side * 0.016, -0.062, 0.162], r: [12, 0, 0] });
      addLimbBand(avatar, `LowerLeg_${s}`, { y: -0.075, radius: 0.111, height: 0.024, x: side * 0.016 });
      addLimbBand(avatar, `LowerLeg_${s}`, { y: -0.3, radius: 0.104, height: 0.024, x: side * 0.016 });
      addLimbBand(avatar, `LowerArm_${s}`, { y: -0.17, radius: 0.095, height: 0.036, x: side * 0.006 });
      addLimbStripe(avatar, `UpperArm_${s}`, side, { y: -0.175, length: 0.15, offset: 0.125, width: 0.042 });
    }

    const torso = avatar.part('Torso');
    // Rolled solar blanket on top of the pack.
    torso.add('Visor', cylOpen(0.045, 0.045, 0.44, 8), { p: [0, 0.625, -0.335], r: [0, 0, 90] });
    torso.add('Metal', cyl(0.052, 0.052, 0.022, 8), { p: [0.23, 0.625, -0.335], r: [0, 0, 90] });
    torso.add('Metal', cyl(0.052, 0.052, 0.022, 8), { p: [-0.23, 0.625, -0.335], r: [0, 0, 90] });
    torso.add('Accent', cyl(0.047, 0.047, 0.036, 8), { p: [0, 0.625, -0.335], r: [0, 0, 90] });
    // Battery module with charge LEDs on the right side of the pack.
    torso.add('SuitGrey', box(0.085, 0.34, 0.155), { p: [-0.28, 0.27, -0.33] });
    torso.add('Accent', box(0.088, 0.03, 0.16), { p: [-0.28, 0.45, -0.33] });
    for (let i = 0; i < 3; i++) {
      torso.add('LedGreen', box(0.006, 0.05, 0.09), { p: [-0.324, 0.18 + i * 0.08, -0.33] });
    }

    // Tool belt fitted over the fuller bellowed pelvis.
    const hips = avatar.part('Hips');
    hips.add('Pack', cyl(0.244, 0.244, 0.044, 8), { p: [0, -0.055, 0], s: [1.06, 1, 0.86] });
    hips.add('Pack', box(0.085, 0.095, 0.054), { p: [0.195, -0.105, 0.12], r: [0, 28, 0] });
    hips.add('Pack', box(0.085, 0.095, 0.054), { p: [-0.195, -0.105, 0.12], r: [0, -28, 0] });
    hips.add('Accent', box(0.088, 0.022, 0.056), { p: [0.195, -0.065, 0.12], r: [0, 28, 0] });
    hips.add('Accent', box(0.088, 0.022, 0.056), { p: [-0.195, -0.065, 0.12], r: [0, -28, 0] });
    hips.add('Metal', box(0.02, 0.14, 0.012), { p: [0.242, -0.125, -0.01] });

    // Pistol-grip drill in the right hand, pointing forward.
    const hand = avatar.part('Hand_R');
    hand.add('GloveTip', box(0.036, 0.09, 0.048), { p: [0, -0.11, 0.03] });
    hand.add('Accent', box(0.062, 0.072, 0.195), { p: [0, -0.07, 0.11] });
    hand.add('Metal', cyl(0.022, 0.022, 0.04, 6), { p: [0, -0.07, 0.225], r: [90, 0, 0] });
    hand.add('Metal', cyl(0.007, 0.003, 0.09, 5), { p: [0, -0.07, 0.29], r: [90, 0, 0] });

    avatar.anchor('FX_Sparks', 'Hand_R', { p: [0, -0.07, 0.34], r: [90, 0, 0] }, {
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
