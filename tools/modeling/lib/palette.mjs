import * as THREE from 'three';

// Shared low-poly palette. Every avatar uses these material names so the look stays
// consistent in Godot and in the viewer. Colors follow real suits: white soft goods,
// navy life-support backpack (xEMU), grey glove tips (AxEMU), gold visor (Apollo/EMU).
const BASE = {
  Suit: { color: '#E2DED6', roughness: 0.85 },
  SuitGrey: { color: '#B9BCC2', roughness: 0.7 },
  Helmet: { color: '#F4F4F1', roughness: 0.35 },
  Visor: { color: '#1B2433', roughness: 0.12, metalness: 0.6 },
  VisorGold: { color: '#D4A72C', roughness: 0.2, metalness: 1.0 },
  Pack: { color: '#2A3550', roughness: 0.6 },
  Metal: { color: '#9EA4AD', roughness: 0.35, metalness: 0.85 },
  Glove: { color: '#E6E3DC', roughness: 0.8 },
  GloveTip: { color: '#5E6168', roughness: 0.6 },
  Boot: { color: '#D9D6CF', roughness: 0.8 },
  Sole: { color: '#3A3D44', roughness: 0.9 },
  Strap: { color: '#4A4F59', roughness: 0.8 },
  Bag: { color: '#CDBF9E', roughness: 0.9 },
  Lamp: { color: '#FFF6DD', emissive: '#FFF6DD', emissiveIntensity: 2.5, roughness: 0.3 },
  LedGreen: { color: '#38E07B', emissive: '#38E07B', emissiveIntensity: 2.0, roughness: 0.3 },
  LedRed: { color: '#FF3B30', emissive: '#FF3B30', emissiveIntensity: 2.0, roughness: 0.3 },
  // Rocket parts materials (references/parts/parts.md §3).
  Hull: { color: '#E9E9E4', roughness: 0.6 },
  HullBlack: { color: '#1E2024', roughness: 0.55 },
  Foam: { color: '#C8742F', roughness: 0.95 },
  Steel: { color: '#B9BEC4', metalness: 0.9, roughness: 0.3 },
  Aluminum: { color: '#C4C8CC', metalness: 0.8, roughness: 0.45 },
  Titanium: { color: '#8F9196', metalness: 0.85, roughness: 0.4 },
  Copper: { color: '#A8683A', metalness: 0.9, roughness: 0.35 },
  NozzleDark: { color: '#3A3633', metalness: 0.6, roughness: 0.6 },
  FoilGold: { color: '#D4A72C', metalness: 1.0, roughness: 0.3 },
  FoilSilver: { color: '#C9CDD1', metalness: 1.0, roughness: 0.3 },
};

function makeMaterial(name, def) {
  const material = new THREE.MeshStandardMaterial({
    name,
    color: new THREE.Color(def.color),
    roughness: def.roughness ?? 0.8,
    metalness: def.metalness ?? 0.0,
  });
  if (def.emissive) {
    material.emissive = new THREE.Color(def.emissive);
    material.emissiveIntensity = def.emissiveIntensity ?? 1.0;
  }
  return material;
}

/**
 * Builds the material set for one avatar.
 * `Accent` and `Screen` take the character's identity color.
 */
export function createPalette(accentHex) {
  const materials = {};
  for (const [name, def] of Object.entries(BASE)) materials[name] = makeMaterial(name, def);
  materials.Accent = makeMaterial('Accent', { color: accentHex, roughness: 0.6 });
  materials.Screen = makeMaterial('Screen', {
    color: accentHex,
    emissive: accentHex,
    emissiveIntensity: 2.0,
    roughness: 0.3,
  });
  return materials;
}

/** Builds the shared material set for rocket parts and cabin/stage equipment. */
export function createPartsPalette() {
  const materials = {};
  for (const [name, def] of Object.entries(BASE)) materials[name] = makeMaterial(name, def);
  return materials;
}
