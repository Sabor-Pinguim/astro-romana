import { addLimbBand, addLimbStripe } from '../lib/avatar.mjs';
import { ball, box, cyl } from '../lib/shapes.mjs';
import { wave } from '../lib/animations.mjs';

export default {
  id: 'oscar',
  name: 'Oscar',
  role: 'Especialista de Dados e Telecom',
  accent: '#1FA2FF',
  visor: 'Visor',
  summary: 'Antena de chicote na mochila como a da Apollo, mini-antena parabólica, tablet no pulso e câmera no capacete.',
  equipment: [
    { item: 'Antena de chicote no topo da mochila', basis: 'Antena de rádio da mochila (PLSS) das EVAs da Apollo' },
    { item: 'Mini-antena parabólica', basis: 'Antenas de alto ganho (estilizado)' },
    { item: 'Tablet no antebraço esquerdo', basis: 'Display no pulso, evolução do cuff checklist' },
    { item: 'Câmera extra no capacete', basis: 'Câmera HD do conjunto de luzes e câmeras do capacete (EHIP) na ISS' },
  ],
  animations: {
    idle_loop: 'Parado, respirando',
    walk_loop: 'Caminhada em baixa gravidade',
    wave: 'Aceno',
    action_loop: 'Transmitindo pelo tablet (pulsos na antena)',
  },

  build(avatar) {
    for (const [s, side] of [['L', 1], ['R', -1]]) {
      addLimbBand(avatar, `UpperArm_${s}`, { y: -0.1, radius: 0.077 });
      addLimbBand(avatar, `UpperArm_${s}`, { y: -0.17, radius: 0.076, height: 0.02 });
      addLimbStripe(avatar, `LowerLeg_${s}`, side, { y: -0.17, length: 0.26, offset: 0.083 });
    }

    const torso = avatar.part('Torso');
    // Whip antenna on the top-left of the pack.
    torso.add('Metal', box(0.05, 0.05, 0.05), { p: [0.17, 0.6, -0.32] });
    torso.add('Metal', cyl(0.007, 0.007, 0.5, 5), { p: [0.17, 0.85, -0.32] });
    torso.add('Screen', ball(0.02, 6, 4), { p: [0.17, 1.1, -0.32] });
    // Small dish on the top-right of the pack.
    torso.add('Metal', cyl(0.012, 0.012, 0.08, 6), { p: [-0.15, 0.62, -0.3] });
    torso.add('Helmet', cyl(0.09, 0.025, 0.035, 10), { p: [-0.15, 0.68, -0.32], r: [-35, 0, 0] });
    torso.add('Metal', cyl(0.005, 0.005, 0.07, 4), { p: [-0.15, 0.72, -0.3], r: [-35, 0, 0] });

    // Data pad on the left forearm.
    avatar.part('LowerArm_L').add('Strap', box(0.1, 0.13, 0.022), { p: [0, -0.12, 0.072] });
    avatar.part('LowerArm_L').add('Screen', box(0.084, 0.11, 0.004), { p: [0, -0.12, 0.084] });

    // Extra helmet camera with a red "recording" light.
    const head = avatar.part('Head');
    head.add('SuitGrey', box(0.05, 0.05, 0.09), { p: [-0.11, 0.33, 0.03], r: [0, 0, -30] });
    head.add('Visor', cyl(0.016, 0.016, 0.02, 6), { p: [-0.11, 0.33, 0.08], r: [90, 0, 0] });
    head.add('LedRed', box(0.012, 0.012, 0.012), { p: [-0.095, 0.36, 0.07] });

    avatar.anchor('FX_Antenna', 'Torso', { p: [0.17, 1.1, -0.32] }, { preset: 'signal', clips: ['action_loop'] });
  },

  action: {
    duration: 2.4,
    samples: 24,
    pose(u) {
      const s = wave(u);
      return {
        Hips: { p: [0, 0.004 * s, 0] },
        Torso: { r: [4, 0, 0] },
        Head: { r: [20 + 2 * s, 0, 0] },
        UpperArm_L: { r: [-35, 0, -14] },
        LowerArm_L: { r: [-80, 0, 0] },
        UpperArm_R: { r: [-30, 0, 12] },
        LowerArm_R: { r: [-70 + 8 * wave(u, 4), 0, 0] },
      };
    },
  },
};
