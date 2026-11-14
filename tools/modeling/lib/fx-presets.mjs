// Particle presets referenced by FX_* anchors. They are written to manifest.json so the
// web viewer and (later) Godot GPUParticles3D can share the same numbers.
//
// Units: rate = particles/s, life = s, speed = m/s, spread = half-angle in degrees
// around the anchor's local +Y, size = [start, end] in m, gravity = m/s² pulling down
// (3.71 = Mars surface gravity, NSSDCA Mars fact sheet).
export const MARS_GRAVITY = 3.71;

export const FX_PRESETS = {
  thrust: {
    description: 'Jato de gás frio do propulsor (inspirado no SAFER da NASA)',
    colors: ['#E6F6FF', '#5AA9FF'],
    blending: 'additive',
    rate: 140,
    life: [0.25, 0.45],
    speed: [2.5, 4.0],
    spread: 9,
    size: [0.08, 0.02],
    gravity: 0,
  },
  sparks: {
    description: 'Faíscas da ferramenta de reparo',
    colors: ['#FFF3B0', '#FF7A00'],
    blending: 'additive',
    rate: 90,
    life: [0.3, 0.7],
    speed: [1.2, 2.6],
    spread: 55,
    size: [0.035, 0.01],
    gravity: MARS_GRAVITY,
  },
  signal: {
    description: 'Pulsos de sinal saindo da antena',
    colors: ['#B8F0FF', '#1FA2FF'],
    blending: 'additive',
    rate: 60,
    life: [0.9, 1.3],
    speed: [0.5, 0.8],
    spread: 90,
    size: [0.05, 0.015],
    gravity: 0,
  },
  dust: {
    description: 'Poeira marciana levantada pela coleta de amostra',
    colors: ['#D08A55', '#8E5A3A'],
    blending: 'normal',
    rate: 55,
    life: [0.8, 1.6],
    speed: [0.3, 0.9],
    spread: 70,
    size: [0.06, 0.16],
    gravity: MARS_GRAVITY,
  },
  footdust: {
    description: 'Poeira levantada pelos passos',
    colors: ['#C17E4E', '#7A4B33'],
    blending: 'normal',
    rate: 20,
    life: [0.6, 1.1],
    speed: [0.2, 0.5],
    spread: 80,
    size: [0.05, 0.13],
    gravity: MARS_GRAVITY,
  },
};
