// Astro Romana room server: HTTP (/health and the test page) and the WebSocket relay at /ws.
// Run: npm start (PORT, ALLOWED_ORIGINS and the limits in config.mjs come from the environment).

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { WebSocketServer } from 'ws';
import { loadConfig } from './config.mjs';
import { RoomHub } from './rooms.mjs';

// Files served over HTTP. The test page loads ../client/room-client.js, which resolves to /client/… here and
// to multiplayer/client/… when the page is opened from disk.
const STATIC = {
  '/': ['demo/index.html', 'text/html; charset=utf-8'],
  '/index.html': ['demo/index.html', 'text/html; charset=utf-8'],
  '/client/room-client.js': ['client/room-client.js', 'text/javascript; charset=utf-8'],
};
const OPEN = 1; // WebSocket.OPEN

export async function startServer(config = loadConfig(), { log = console.log } = {}) {
  const hub = new RoomHub(config, { log });
  const started = Date.now();

  const http = createServer(async (req, res) => {
    const path = new URL(req.url, 'http://localhost').pathname;
    if (req.method !== 'GET' && req.method !== 'HEAD') return reply(res, 405, 'text/plain', 'method not allowed');
    if (path === '/health') {
      return reply(res, 200, 'application/json', JSON.stringify({ ok: true, protocol: config.PROTOCOL_VERSION, uptimeSec: Math.round((Date.now() - started) / 1000), ...hub.stats() }));
    }
    const file = STATIC[path];
    if (!file) return reply(res, 404, 'text/plain', 'not found');
    try { reply(res, 200, file[1], await readFile(new URL(file[0], import.meta.url))); }
    catch { reply(res, 500, 'text/plain', 'file missing'); }
  });

  // maxPayload is a hard stop (the socket closes); messages above MAX_MESSAGE_BYTES but below it get a
  // polite `too-large` error instead.
  const wss = new WebSocketServer({ noServer: true, maxPayload: config.MAX_MESSAGE_BYTES * 4 });
  const allowed = new Set(config.ALLOWED_ORIGINS);
  http.on('upgrade', (req, socket, head) => {
    const path = new URL(req.url, 'http://localhost').pathname;
    const origin = req.headers.origin; // browsers always send it ("null" from file://); other clients may not
    if (path !== '/ws' || (allowed.size && origin !== undefined && !allowed.has(origin))) {
      socket.end('HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n');
      return;
    }
    wss.handleUpgrade(req, socket, head, ws => wss.emit('connection', ws, req));
  });

  wss.on('connection', ws => {
    const conn = { send: message => { if (ws.readyState === OPEN) ws.send(JSON.stringify(message)); } };
    const bucket = { tokens: config.RATE_BURST, at: Date.now(), warnedAt: 0 };
    ws.isAlive = true;
    ws.on('pong', () => { ws.isAlive = true; });
    ws.on('message', (raw, isBinary) => {
      const now = Date.now();
      bucket.tokens = Math.min(config.RATE_BURST, bucket.tokens + (now - bucket.at) / 1000 * config.RATE_PER_SEC);
      bucket.at = now;
      if (bucket.tokens < 1) { // drop; tell the client at most once a second
        if (now - bucket.warnedAt > 1000) { bucket.warnedAt = now; conn.send({ t: 'error', code: 'rate-limited' }); }
        return;
      }
      bucket.tokens -= 1;
      if (isBinary) return conn.send({ t: 'error', code: 'bad-message' });
      if (raw.length > config.MAX_MESSAGE_BYTES) return conn.send({ t: 'error', code: 'too-large' });
      let msg;
      try { msg = JSON.parse(raw); } catch { return conn.send({ t: 'error', code: 'bad-message' }); }
      hub.handle(conn, msg);
    });
    ws.on('close', () => hub.disconnect(conn));
    ws.on('error', () => {}); // 'close' follows
  });

  // Heartbeat: a socket that missed the last ping is gone (closing it frees the seat after the grace period).
  const ping = setInterval(() => {
    for (const ws of wss.clients) {
      if (!ws.isAlive) { ws.terminate(); continue; }
      ws.isAlive = false;
      ws.ping();
    }
  }, config.PING_INTERVAL_MS);
  const sweep = setInterval(() => hub.sweep(), config.SWEEP_INTERVAL_MS);

  await new Promise(resolve => http.listen(config.PORT, config.HOST || undefined, resolve));
  const { port } = http.address();

  async function close(reason = 'server') {
    clearInterval(ping);
    clearInterval(sweep);
    hub.closeAll(reason);
    for (const ws of wss.clients) ws.close(1001, 'server closing'); // flushes the `closed` messages first
    await Promise.race([new Promise(resolve => wss.close(() => resolve())), new Promise(resolve => setTimeout(resolve, 2000))]);
    for (const ws of wss.clients) ws.terminate();
    http.closeAllConnections();
    await new Promise(resolve => http.close(() => resolve()));
  }

  return { port, url: `ws://localhost:${port}/ws`, http: `http://localhost:${port}`, hub, close };
}

function reply(res, status, type, body) {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' });
  res.end(body);
}

// Entry point (npm start).
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const config = loadConfig();
  const server = await startServer(config);
  console.log(`room server on ${config.HOST || '*'}:${server.port} · test page ${server.http}/ · origins ${config.ALLOWED_ORIGINS.join(', ') || 'any'}`);
  for (const signal of ['SIGTERM', 'SIGINT']) {
    process.once(signal, async () => { await server.close('server'); process.exit(0); }); // Cloud Run sends SIGTERM
  }
}
