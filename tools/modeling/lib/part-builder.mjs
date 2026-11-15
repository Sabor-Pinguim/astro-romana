import * as THREE from 'three';
import { createPartsPalette } from './palette.mjs';
import { PartSet } from './shapes.mjs';

const DEG = THREE.MathUtils.DEG2RAD;

/**
 * Helper for building a low-poly rocket engine or propellant tank in real meters (+Y up, +Z front).
 * Keeps Table 4.3 positions in part-origin coordinates and automatically converts them to
 * local coordinates when attaching geometry under a pivoted node such as `Gimbal`.
 */
export function createPartBuilder({
  id,
  name,
  category,
  tier,
  displayName,
  vehicle,
  role,
  summary,
  originNote,
  attachTop = [0, 0, 0],
  attachBottom = null,
  extraAnchors = [],
  gimbal = null,
  fxExhaust = null,
  fxAnchors = [],
  budget,
  references = [],
}) {
  const materials = createPartsPalette();
  const root = new THREE.Group();
  root.name = name;

  const nodes = { [name]: root, Root: root };
  const parts = { [name]: new PartSet(materials) };

  const addEmptyNode = (nodeName, pos, rotDeg = [0, 0, 0], userData = null) => {
    const node = new THREE.Object3D();
    node.name = nodeName;
    node.position.set(...pos);
    node.rotation.set(rotDeg[0] * DEG, rotDeg[1] * DEG, rotDeg[2] * DEG);
    if (userData) node.userData = userData;
    root.add(node);
    nodes[nodeName] = node;
    return node;
  };

  addEmptyNode('Attach_Top', attachTop);
  if (attachBottom) addEmptyNode('Attach_Bottom', attachBottom);
  for (const extra of extraAnchors) addEmptyNode(extra.name, extra.pos, extra.rot ?? [0, 0, 0]);

  let gimbalNode = null;
  const gimbalPos = gimbal ?? [0, 0, 0];
  if (gimbal) {
    gimbalNode = new THREE.Group();
    gimbalNode.name = 'Gimbal';
    gimbalNode.position.set(...gimbal);
    root.add(gimbalNode);
    nodes.Gimbal = gimbalNode;
    parts.Gimbal = new PartSet(materials);
  }

  const fx = [];
  if (fxExhaust) {
    addEmptyNode('FX_Exhaust', fxExhaust.pos, [180, 0, 0], { fx: fxExhaust.preset });
    fx.push({ anchor: 'FX_Exhaust', preset: fxExhaust.preset, clips: null });
  }
  for (const anchor of fxAnchors) {
    addEmptyNode(anchor.name, anchor.pos, anchor.rot ?? [0, 0, 0], { fx: anchor.preset });
    fx.push({ anchor: anchor.name, preset: anchor.preset, clips: null });
  }

  const builder = {
    id,
    name,
    category,
    tier,
    displayName,
    vehicle,
    role,
    summary,
    originNote,
    root,
    materials,
    fx,
    budget,
    references,
    add(target, materialKey, geometry, transform = {}) {
      const key = target === 'Root' ? name : target;
      const set = parts[key];
      if (!set) throw new Error(`${id}: unknown target node "${target}"`);
      const t = { ...transform };
      if (target === 'Gimbal' && gimbalNode) {
        const p = t.p ?? [0, 0, 0];
        t.p = [p[0] - gimbalPos[0], p[1] - gimbalPos[1], p[2] - gimbalPos[2]];
      }
      set.add(materialKey, geometry, t);
      return builder;
    },
    finish() {
      parts[name].attachTo(root, name);
      if (gimbalNode) parts.Gimbal.attachTo(gimbalNode, 'Gimbal');
      return root;
    },
  };

  return builder;
}
