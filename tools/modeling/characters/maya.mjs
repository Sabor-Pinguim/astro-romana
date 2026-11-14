import { addLimbBand, addLimbStripe } from '../lib/avatar.mjs';
import { box, cyl } from '../lib/shapes.mjs';
import { smooth } from '../lib/animations.mjs';

/** White cross on a green square (ISO 7010 first-aid sign; the red cross emblem is legally protected). */
function addFirstAidSign(part, { p, size, normalAxis }) {
  const [x, y, z] = p;
  const t = 0.01;
  const thin = size * 0.22;
  const long = size * 0.7;
  if (normalAxis === 'z') {
    part.add('Accent', box(size, size, t), { p });
    part.add('Suit', box(long, thin, t), { p: [x, y, z - t * 0.6] });
    part.add('Suit', box(thin, long, t), { p: [x, y, z - t * 0.6] });
  } else {
    part.add('Accent', box(t, size, size), { p });
    part.add('Suit', box(t, thin, long), { p: [x + t * 0.6, y, z] });
    part.add('Suit', box(t, long, thin), { p: [x + t * 0.6, y, z] });
  }
}

export default {
  id: 'maya',
  name: 'Maya',
  role: 'Cientista de Missão e Oficial Médica',
  accent: '#2BB673',
  visor: 'Visor',
  summary: 'Pá de coleta como a da Apollo 17, bolsas de amostra, câmera no peito e símbolo de primeiros socorros.',
  equipment: [
    { item: 'Pá/ancinho de coleta com cabo longo', basis: 'Ferramentas de geologia de Harrison Schmitt na Apollo 17' },
    { item: 'Bolsas de amostra no quadril e na mochila', basis: 'Bolsas de coleta penduradas na mochila nas EVAs da Apollo' },
    { item: 'Câmera no peito', basis: 'Câmera Hasselblad presa ao peito na Apollo' },
    { item: 'Símbolo de primeiros socorros (cruz branca em fundo verde)', basis: 'Oficial médica; padrão ISO 7010 de primeiros socorros' },
  ],
  animations: {
    idle_loop: 'Parada, respirando',
    walk_loop: 'Caminhada em baixa gravidade',
    wave: 'Aceno',
    action_loop: 'Agachando para coletar amostra (poeira na pá)',
  },

  build(avatar) {
    for (const [s, side] of [['L', 1], ['R', -1]]) {
      addLimbStripe(avatar, `UpperLeg_${s}`, side, { y: -0.19, length: 0.3, offset: 0.1 });
      addLimbBand(avatar, `LowerArm_${s}`, { y: -0.08, radius: 0.069 });
    }

    const torso = avatar.part('Torso');
    addFirstAidSign(torso, { p: [0, 0.17, -0.372], size: 0.16, normalAxis: 'z' });
    // Chest camera.
    torso.add('Strap', box(0.09, 0.08, 0.07), { p: [0, 0.12, 0.24] });
    torso.add('Visor', cyl(0.025, 0.025, 0.04, 8), { p: [0, 0.12, 0.29], r: [90, 0, 0] });
    // Sample bag hanging from the pack.
    torso.add('Bag', box(0.12, 0.16, 0.06), { p: [0.16, 0.04, -0.4] });
    torso.add('Accent', box(0.122, 0.03, 0.062), { p: [0.16, 0.11, -0.4] });

    addFirstAidSign(avatar.part('UpperArm_L'), { p: [0.077, -0.1, 0], size: 0.06, normalAxis: 'x' });

    // Hip sample bag.
    avatar.part('Hips').add('Bag', box(0.1, 0.13, 0.06), { p: [0.2, -0.1, 0.02], r: [0, 0, 8] });
    avatar.part('Hips').add('Accent', box(0.102, 0.025, 0.062), { p: [0.205, -0.045, 0.02], r: [0, 0, 8] });

    // Long-handled scoop held in the right hand.
    const hand = avatar.part('Hand_R');
    hand.add('Metal', cyl(0.012, 0.012, 0.86, 6), { p: [0, -0.36, 0.03] });
    hand.add('Accent', cyl(0.016, 0.016, 0.1, 6), { p: [0, -0.02, 0.03] });
    hand.add('Metal', box(0.11, 0.025, 0.13), { p: [0, -0.8, 0.07], r: [20, 0, 0] });
    hand.add('Metal', box(0.11, 0.05, 0.015), { p: [0, -0.78, 0.13], r: [20, 0, 0] });

    avatar.anchor('FX_Scoop', 'Hand_R', { p: [0, -0.8, 0.07] }, { preset: 'dust', clips: ['action_loop'] });
  },

  action: {
    duration: 2.6,
    samples: 26,
    pose(u) {
      const d = smooth(0.08, 0.35, u) * (1 - smooth(0.7, 0.95, u));
      const scoop = Math.sin(Math.PI * Math.min(1, Math.max(0, (u - 0.38) / 0.32)));
      return {
        Hips: { p: [0, -0.18 * d, 0] },
        UpperLeg_L: { r: [-45 * d, 0, 4 * d] },
        UpperLeg_R: { r: [-45 * d, 0, -4 * d] },
        LowerLeg_L: { r: [80 * d, 0, 0] },
        LowerLeg_R: { r: [80 * d, 0, 0] },
        Foot_L: { r: [-35 * d, 0, 0] },
        Foot_R: { r: [-35 * d, 0, 0] },
        Torso: { r: [28 * d, 0, 0] },
        Head: { r: [18 * d, 0, 0] },
        UpperArm_R: { r: [-30 * d - 12 * scoop, 0, -4 * d] },
        LowerArm_R: { r: [-15 * d, 0, 0] },
        Hand_R: { r: [10 * scoop, 0, 0] },
        UpperArm_L: { r: [-25 * d, 0, 8 * d] },
        LowerArm_L: { r: [-45 * d, 0, 0] },
      };
    },
  },
};
