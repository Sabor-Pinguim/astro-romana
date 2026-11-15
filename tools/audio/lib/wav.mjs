// Minimal 16-bit PCM WAV writer/reader.
//
// Looping files get a "smpl" chunk with one forward loop, so players that read it
// loop at the exact frame. Use closeLoop() for loops: see its comment for why.

const SMPL_BYTES = 36 + 24; // header + one loop

/**
 * @param {Float32Array[]} channels samples in [-1, 1], one array per channel
 * @param {number} sampleRate
 * @param {{ loop?: { start: number, end: number } }} [options] loop frames;
 *   `end` is the last frame of the loop (inclusive, as in the WAV spec)
 * @returns {Buffer}
 */
export function encodeWav(channels, sampleRate, { loop } = {}) {
  const numChannels = channels.length;
  const frames = channels[0].length;
  const dataBytes = frames * numChannels * 2;
  const smplChunk = loop ? 8 + SMPL_BYTES : 0;
  const buf = Buffer.alloc(12 + (8 + 16) + (8 + dataBytes) + smplChunk);
  let o = 0;
  const str = (s) => { buf.write(s, o, 'ascii'); o += 4; };
  const u32 = (v) => { buf.writeUInt32LE(v, o); o += 4; };
  const u16 = (v) => { buf.writeUInt16LE(v, o); o += 2; };

  str('RIFF'); u32(buf.length - 8); str('WAVE');
  str('fmt '); u32(16); u16(1); u16(numChannels); u32(sampleRate);
  u32(sampleRate * numChannels * 2); u16(numChannels * 2); u16(16);
  str('data'); u32(dataBytes);
  for (let i = 0; i < frames; i++) {
    for (let c = 0; c < numChannels; c++) {
      const v = Math.max(-1, Math.min(1, channels[c][i]));
      buf.writeInt16LE(Math.round(v * 32767), o); o += 2;
    }
  }
  if (loop) {
    str('smpl'); u32(SMPL_BYTES);
    u32(0); u32(0); // manufacturer, product
    u32(Math.round(1e9 / sampleRate)); // sample period (ns)
    u32(60); u32(0); u32(0); u32(0); // MIDI unity note, pitch fraction, SMPTE format/offset
    u32(1); u32(0); // one loop, no sampler data
    u32(0); u32(0); u32(loop.start); u32(loop.end); u32(0); u32(0); // id, forward, start, end, fraction, play count (0 = infinite)
  }
  return buf;
}

/**
 * Prepares an N-frame seamless loop: appends a copy of frame 0 and
 * returns the loop points { start: 0, end: N }.
 *
 * Players that loop [start, end) play exactly N frames per cycle. Players that
 * follow the WAV spec (inclusive end) repeat one frame per cycle, which is inaudible.
 */
export function closeLoop(channels) {
  const frames = channels[0].length;
  const closed = channels.map((ch) => {
    const out = new Float32Array(frames + 1);
    out.set(ch);
    out[frames] = ch[0];
    return out;
  });
  return { channels: closed, loop: { start: 0, end: frames } };
}

/**
 * @param {Buffer} buf
 * @returns {{ sampleRate: number, numChannels: number, bitsPerSample: number, format: number,
 *   frames: number, channels: Float32Array[], loop: { start: number, end: number } | null }}
 */
export function decodeWav(buf) {
  if (buf.toString('ascii', 0, 4) !== 'RIFF' || buf.toString('ascii', 8, 12) !== 'WAVE') {
    throw new Error('not a RIFF/WAVE file');
  }
  let fmt = null;
  let data = null;
  let loop = null;
  for (let o = 12; o + 8 <= buf.length;) {
    const id = buf.toString('ascii', o, o + 4);
    const size = buf.readUInt32LE(o + 4);
    const body = o + 8;
    if (id === 'fmt ') {
      fmt = {
        format: buf.readUInt16LE(body),
        numChannels: buf.readUInt16LE(body + 2),
        sampleRate: buf.readUInt32LE(body + 4),
        bitsPerSample: buf.readUInt16LE(body + 14),
      };
    } else if (id === 'data') {
      data = { offset: body, size };
    } else if (id === 'smpl' && buf.readUInt32LE(body + 28) > 0) {
      loop = { start: buf.readUInt32LE(body + 36 + 8), end: buf.readUInt32LE(body + 36 + 12) };
    }
    o = body + size + (size % 2);
  }
  if (!fmt || !data) throw new Error('missing fmt or data chunk');
  const frames = data.size / (fmt.numChannels * 2);
  const channels = Array.from({ length: fmt.numChannels }, () => new Float32Array(frames));
  if (fmt.format === 1 && fmt.bitsPerSample === 16) {
    for (let i = 0; i < frames; i++) {
      for (let c = 0; c < fmt.numChannels; c++) {
        channels[c][i] = buf.readInt16LE(data.offset + (i * fmt.numChannels + c) * 2) / 32767;
      }
    }
  }
  return { ...fmt, frames, channels, loop };
}
