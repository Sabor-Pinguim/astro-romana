// Minimal glTF 2.0 binary (GLB) writer for a few indexed triangle meshes (textured or vertex-colored).
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
 * @param {object[]} nodes  one root node per mesh, in order (the first is the terrain):
 * @param {string} nodes[].nodeName
 * @param {string} nodes[].meshName
 * @param {Float32Array} nodes[].positions  xyz per vertex
 * @param {Float32Array} [nodes[].normals]  xyz per vertex (without them, viewers use flat normals)
 * @param {Float32Array|Uint16Array} [nodes[].uvs]  uv per vertex (origin top-left), with material.image; Uint16 = normalized
 * @param {Uint16Array} [nodes[].colors]    linear RGBA per vertex, normalized unsigned short (COLOR_0)
 * @param {Uint16Array|Uint32Array} nodes[].indices
 * @param {object} nodes[].material  { name, baseColorFactor: [r,g,b,a], image?: { name, bytes, mimeType, repeatU? } }
 * @param {object} [nodes[].extras]  copied to the node's glTF "extras"
 * @returns {Buffer}
 */
export function writeGlb(nodes) {
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

  const accessors = [];
  const addAccessor = (accessor) => accessors.push(accessor) - 1;
  const json = {
    asset: { version: '2.0', generator: 'astro-romana tools/terrain' },
    scene: 0,
    scenes: [{ nodes: nodes.map((_, i) => i) }],
    nodes: [],
    meshes: [],
    materials: [],
  };
  const textures = [];
  const images = [];

  for (const mesh of nodes) {
    const vertexCount = mesh.positions.length / 3;
    const attributes = {
      POSITION: addAccessor({ bufferView: addView(mesh.positions, ARRAY_BUFFER), componentType: FLOAT, count: vertexCount, type: 'VEC3', ...minMax(mesh.positions, 3) }),
    };
    if (mesh.normals) attributes.NORMAL = addAccessor({ bufferView: addView(mesh.normals, ARRAY_BUFFER), componentType: FLOAT, count: vertexCount, type: 'VEC3' });
    if (mesh.uvs) {
      const quantized = mesh.uvs instanceof Uint16Array; // normalized unsigned short: half the bytes of float
      attributes.TEXCOORD_0 = addAccessor({
        bufferView: addView(mesh.uvs, ARRAY_BUFFER), componentType: quantized ? UNSIGNED_SHORT : FLOAT, ...(quantized ? { normalized: true } : {}), count: vertexCount, type: 'VEC2',
      });
    }
    if (mesh.colors) {
      attributes.COLOR_0 = addAccessor({ bufferView: addView(mesh.colors, ARRAY_BUFFER), componentType: UNSIGNED_SHORT, normalized: true, count: vertexCount, type: 'VEC4' });
    }
    const indices = addAccessor({
      bufferView: addView(mesh.indices, ELEMENT_ARRAY_BUFFER),
      componentType: mesh.indices instanceof Uint16Array ? UNSIGNED_SHORT : UNSIGNED_INT,
      count: mesh.indices.length,
      type: 'SCALAR',
    });

    const pbr = { baseColorFactor: mesh.material.baseColorFactor, metallicFactor: 0, roughnessFactor: 1 };
    if (mesh.material.image) {
      images.push({ name: mesh.material.image.name, bufferView: addView(mesh.material.image.bytes), mimeType: mesh.material.image.mimeType });
      textures.push({ sampler: mesh.material.image.repeatU ? 1 : 0, source: images.length - 1 });
      pbr.baseColorTexture = { index: textures.length - 1 };
    }
    json.materials.push({ name: mesh.material.name, pbrMetallicRoughness: pbr });
    json.meshes.push({ name: mesh.meshName, primitives: [{ attributes, indices, material: json.materials.length - 1, mode: 4 }] });
    const node = { name: mesh.nodeName, mesh: json.meshes.length - 1 };
    if (mesh.extras) node.extras = mesh.extras;
    json.nodes.push(node);
  }
  if (textures.length) {
    json.textures = textures;
    // Linear filtering with mipmaps; clamp so the edges do not bleed into each other
    // (sampler 1 repeats along u, for textures that wrap around, like the horizon's azimuth).
    json.samplers = [{ magFilter: 9729, minFilter: 9987, wrapS: 33071, wrapT: 33071 }];
    if (textures.some((t) => t.sampler === 1)) json.samplers.push({ magFilter: 9729, minFilter: 9987, wrapS: 10497, wrapT: 33071 });
    json.images = images;
  }
  json.accessors = accessors;
  json.bufferViews = bufferViews;
  json.buffers = [{ byteLength }];

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
