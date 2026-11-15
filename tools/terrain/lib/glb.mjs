// Minimal glTF 2.0 binary (GLB) writer for one textured, indexed triangle mesh.
// Written by hand (instead of three.js GLTFExporter) because the exporter needs a
// browser canvas to embed textures; this keeps the build headless and byte-stable.

const FLOAT = 5126;
const UNSIGNED_SHORT = 5123;
const UNSIGNED_INT = 5125;
const ARRAY_BUFFER = 34962;
const ELEMENT_ARRAY_BUFFER = 34963;

function align4(n) {
  return (n + 3) & ~3;
}

function minMax(array, components) {
  const min = new Array(components).fill(Infinity);
  const max = new Array(components).fill(-Infinity);
  for (let i = 0; i < array.length; i++) {
    const c = i % components;
    if (array[i] < min[c]) min[c] = array[i];
    if (array[i] > max[c]) max[c] = array[i];
  }
  return { min, max };
}

/**
 * @param {object} mesh
 * @param {string} mesh.nodeName      node name (Godot reads suffixes such as "-col")
 * @param {string} mesh.meshName
 * @param {Float32Array} mesh.positions  xyz per vertex
 * @param {Float32Array} mesh.normals    xyz per vertex
 * @param {Float32Array} mesh.uvs        uv per vertex (origin top-left)
 * @param {Uint16Array|Uint32Array} mesh.indices
 * @param {object} mesh.material  { name, baseColorFactor: [r,g,b,a], image: { name, bytes, mimeType } }
 * @param {object} [mesh.extras]  copied to the node's glTF "extras"
 * @returns {Buffer}
 */
export function writeGlb(mesh) {
  const chunks = [];
  const bufferViews = [];
  let byteLength = 0;
  const addView = (typedArrayOrBuffer, target) => {
    const bytes = Buffer.from(typedArrayOrBuffer.buffer ?? typedArrayOrBuffer, typedArrayOrBuffer.byteOffset ?? 0, typedArrayOrBuffer.byteLength);
    const view = { buffer: 0, byteOffset: byteLength, byteLength: bytes.length };
    if (target) view.target = target;
    bufferViews.push(view);
    chunks.push(bytes);
    const padded = align4(bytes.length);
    if (padded > bytes.length) chunks.push(Buffer.alloc(padded - bytes.length));
    byteLength += padded;
    return bufferViews.length - 1;
  };

  const vertexCount = mesh.positions.length / 3;
  const positionBounds = minMax(mesh.positions, 3);
  const accessors = [
    { bufferView: addView(mesh.positions, ARRAY_BUFFER), componentType: FLOAT, count: vertexCount, type: 'VEC3', ...positionBounds },
    { bufferView: addView(mesh.normals, ARRAY_BUFFER), componentType: FLOAT, count: vertexCount, type: 'VEC3' },
    { bufferView: addView(mesh.uvs, ARRAY_BUFFER), componentType: FLOAT, count: vertexCount, type: 'VEC2' },
    {
      bufferView: addView(mesh.indices, ELEMENT_ARRAY_BUFFER),
      componentType: mesh.indices instanceof Uint16Array ? UNSIGNED_SHORT : UNSIGNED_INT,
      count: mesh.indices.length,
      type: 'SCALAR',
    },
  ];
  const imageView = addView(mesh.material.image.bytes);

  const node = { name: mesh.nodeName, mesh: 0 };
  if (mesh.extras) node.extras = mesh.extras;
  const json = {
    asset: { version: '2.0', generator: 'astro-romana tools/terrain' },
    scene: 0,
    scenes: [{ nodes: [0] }],
    nodes: [node],
    meshes: [
      {
        name: mesh.meshName,
        primitives: [{ attributes: { POSITION: 0, NORMAL: 1, TEXCOORD_0: 2 }, indices: 3, material: 0, mode: 4 }],
      },
    ],
    materials: [
      {
        name: mesh.material.name,
        pbrMetallicRoughness: {
          baseColorTexture: { index: 0 },
          baseColorFactor: mesh.material.baseColorFactor,
          metallicFactor: 0,
          roughnessFactor: 1,
        },
      },
    ],
    textures: [{ sampler: 0, source: 0 }],
    // Linear filtering with mipmaps; clamp so the edges do not bleed into each other.
    samplers: [{ magFilter: 9729, minFilter: 9987, wrapS: 33071, wrapT: 33071 }],
    images: [{ name: mesh.material.image.name, bufferView: imageView, mimeType: mesh.material.image.mimeType }],
    accessors,
    bufferViews,
    buffers: [{ byteLength }],
  };

  let jsonBytes = Buffer.from(JSON.stringify(json), 'utf8');
  jsonBytes = Buffer.concat([jsonBytes, Buffer.alloc(align4(jsonBytes.length) - jsonBytes.length, 0x20)]);
  const bin = Buffer.concat(chunks);

  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0); // "glTF"
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(12 + 8 + jsonBytes.length + 8 + bin.length, 8);
  const jsonHeader = Buffer.alloc(8);
  jsonHeader.writeUInt32LE(jsonBytes.length, 0);
  jsonHeader.writeUInt32LE(0x4e4f534a, 4); // "JSON"
  const binHeader = Buffer.alloc(8);
  binHeader.writeUInt32LE(bin.length, 0);
  binHeader.writeUInt32LE(0x004e4942, 4); // "BIN\0"
  return Buffer.concat([header, jsonHeader, jsonBytes, binHeader, bin]);
}

/** Reads the JSON chunk of a GLB (used by the validator). */
export function readGlbJson(bytes) {
  if (bytes.readUInt32LE(0) !== 0x46546c67) throw new Error('not a GLB file');
  const length = bytes.readUInt32LE(12);
  return JSON.parse(bytes.subarray(20, 20 + length).toString('utf8'));
}
