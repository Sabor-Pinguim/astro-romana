import { addLimbBand, addLimbStripe } from '../lib/avatar.mjs';
import { box, cyl } from '../lib/shapes.mjs';
import { wave } from '../lib/animations.mjs';

export default {
  id: 'helena',
  name: 'Helena',
  role: 'Comandante e Piloto',
  accent: '#D7263D',
  visor: 'VisorGold',
  summary:
    'Faixas vermelhas como as de comandante da Apollo e de EV1 na ISS, visor dourado e propulsor de emergência nas costas.',
  equipment: [
    { item: 'Faixas vermelhas nas pernas e braços', basis: 'Comandantes da Apollo e o EV1 na ISS usam faixas vermelhas para identificação' },
    { item: 'Visor dourado', basis: 'Visor com camada de ouro dos capacetes Apollo/EMU' },
    { item: 'Propulsor sob a mochila com 4 bocais', basis: 'SAFER, propulsor de resgate preso à base da mochila do EMU' },
    { item: 'Controle de mão no peito', basis: 'Controle manual do SAFER, montado no módulo de display do peito' },
    { item: 'Checklist no pulso esquerdo', basis: 'Cuff checklist usado em caminhadas espaciais' },
  ],
  animations: {
    idle_loop: 'Parada, respirando',
    walk_loop: 'Caminhada em baixa gravidade',
    wave: 'Aceno',
    action_loop: 'Pairando com o propulsor (partículas nos bocais)',
  },

  build(avatar) {
    for (const [s, side] of [['L', 1], ['R', -1]]) {
      addLimbStripe(avatar, `UpperLeg_${s}`, side, { y: -0.19, length: 0.3, offset: 0.1 });
      addLimbStripe(avatar, `LowerLeg_${s}`, side, { y: -0.17, length: 0.26, offset: 0.083 });
      addLimbBand(avatar, `UpperArm_${s}`, { y: -0.13, radius: 0.077 });
    }

    // SAFER-style jet pack bolted under the life-support pack.
    const torso = avatar.part('Torso');
    torso.add('SuitGrey', box(0.5, 0.1, 0.24), { p: [0, -0.07, -0.27] });
    torso.add('Accent', box(0.51, 0.02, 0.25), { p: [0, -0.02, -0.27] });
    for (const x of [0.21, -0.21]) {
      for (const z of [-0.19, -0.35]) {
        torso.add('Metal', cyl(0.02, 0.03, 0.05, 6), { p: [x, -0.14, z] });
      }
    }
    // Hand controller on the chest box.
    torso.add('Strap', box(0.12, 0.045, 0.07), { p: [0, 0.165, 0.22] });
    torso.add('Metal', cyl(0.01, 0.012, 0.05, 6), { p: [0.03, 0.205, 0.225] });
    torso.add('LedRed', box(0.02, 0.012, 0.02), { p: [-0.03, 0.19, 0.24] });

    // Cuff checklist on the left forearm.
    avatar.part('LowerArm_L').add('SuitGrey', box(0.1, 0.07, 0.03), { p: [0, -0.15, 0.066] });
    avatar.part('LowerArm_L').add('Accent', box(0.1, 0.012, 0.031), { p: [0, -0.11, 0.066] });

    const thruster = { preset: 'thrust', clips: ['action_loop'] };
    avatar.anchor('FX_Thruster_L', 'Torso', { p: [0.21, -0.17, -0.27], r: [180, 0, 0] }, thruster);
    avatar.anchor('FX_Thruster_R', 'Torso', { p: [-0.21, -0.17, -0.27], r: [180, 0, 0] }, thruster);
  },

  action: {
    duration: 2.4,
    samples: 16,
    pose(u) {
      const s = wave(u);
      return {
        Hips: { p: [0, 0.22 + 0.035 * s, 0], r: [4, 0, 0] },
        Torso: { r: [5, 0, 2 * s] },
        Head: { r: [-5, 6 * wave(u, 1, 0.25), 0] },
        UpperLeg_L: { r: [-12 + 3 * s, 0, 4] },
        UpperLeg_R: { r: [-8 - 3 * s, 0, -4] },
        LowerLeg_L: { r: [28, 0, 0] },
        LowerLeg_R: { r: [22, 0, 0] },
        Foot_L: { r: [18, 0, 0] },
        Foot_R: { r: [15, 0, 0] },
        UpperArm_R: { r: [-50, 0, 8] },
        LowerArm_R: { r: [-65, 0, 0] },
        UpperArm_L: { r: [-8, 0, 30 + 4 * s] },
        LowerArm_L: { r: [-20, 0, 0] },
      };
    },
  },
};
