// Integration: a real server on a random port, RoomClient over Node's global WebSocket, and raw ws clients for
// the transport limits (origin, size, rate).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import WebSocket from 'ws';
import { loadConfig } from '../config.mjs';
import { startServer } from '../server.mjs';
import '../client/room-client.js';

const { RoomClient } = globalThis;

async function withServer(overrides, fn) {
  const server = await startServer({ ...loadConfig({}), PORT: 0, ...overrides }, { log: () => {} });
  const clients = [];
  const client = opts => { const c = new RoomClient({ url: server.url, reconnect: false, ...opts }); clients.push(c); return c; };
  try { await fn(server, client); } finally {
    for (const c of clients) c.close();
    await server.close();
  }
}
const next = (room, type) => new Promise(resolve => { const off = room.on(type, (...args) => { off(); resolve(args); }); });
function raw(url, headers) {
  const ws = new WebSocket(url, { headers });
  const inbox = [];
  const waiters = [];
  ws.on('message', data => { const m = JSON.parse(data); const w = waiters.shift(); if (w) w(m); else inbox.push(m); });
  return {
    ws,
    open: () => new Promise((resolve, reject) => { ws.once('open', resolve); ws.once('error', reject); }),
    send: m => ws.send(typeof m === 'string' ? m : JSON.stringify(m)),
    next: () => inbox.length ? Promise.resolve(inbox.shift()) : new Promise(resolve => waiters.push(resolve)),
  };
}

test('a mission flow: create, link, join, seats, phase, state, act, pose, results, host leaves', () => withServer({}, async (server, client) => {
  const host = client(), guest = client();
  const created = await host.create();
  assert.equal(host.isHost, true);
  const link = RoomClient.linkFor(created.code, 'https://example.org/index.html#lobby');
  assert.equal(RoomClient.codeFromUrl(link), created.code);

  host.setState('planner', { site: 'jezero', rocket: { stages: 2 } });
  const peers = next(host, 'peers');
  const joined = await guest.join(RoomClient.codeFromUrl(link), { seat: 'oscar' });
  assert.equal(joined.you.seat, 'oscar');
  assert.deepEqual(guest.state.planner, { site: 'jezero', rocket: { stages: 2 } }); // cached for newcomers
  assert.equal((await peers)[0].length, 2);
  assert.deepEqual(guest.freeSeats, ['lucas', 'maya']);

  const seatChange = next(host, 'peers');
  guest.setSeat('lucas');
  await seatChange;
  assert.equal(host.peers.find(p => !p.host).seat, 'lucas');

  const act = next(host, 'act');
  guest.act({ name: 'togglePart', args: ['engine-raptor'] });
  const [data, from] = await act;
  assert.deepEqual(data, { name: 'togglePart', args: ['engine-raptor'] });
  assert.deepEqual(from, { id: guest.you.id, seat: 'lucas' });

  const phase = next(guest, 'phase');
  host.setPhase('cockpit');
  assert.deepEqual(await phase, ['cockpit']);
  const late = client();
  await assert.rejects(late.join(created.code), { code: 'in-progress' });

  const flight = next(guest, 'state');
  host.setState('flight', { step: 1, breakers: [true, false, true] });
  assert.deepEqual(await flight, ['flight', { step: 1, breakers: [true, false, true] }]);

  const pose = next(host, 'pose');
  guest.pose({ x: 3, z: -2, yaw: 1.5 });
  assert.equal((await pose)[1].seat, 'lucas');

  const results = next(guest, 'event');
  host.emit({ k: 'results', grade: 'A' });
  assert.deepEqual(await results, [{ k: 'results', grade: 'A' }]);

  const closed = next(guest, 'closed');
  host.leave();
  assert.deepEqual(await closed, ['host-left']);
  assert.equal(guest.inRoom, false);
}));

test('a guest that drops reconnects and keeps its seat', () => withServer({}, async (server, client) => {
  const host = client(), guest = client({ reconnect: true });
  const { code } = await host.create();
  const arrived = next(host, 'peers');
  await guest.join(code);
  await arrived;
  const seat = guest.you.seat;
  const offline = next(host, 'peers');
  const resumed = next(guest, 'welcome');
  guest.ws.close(); // network drop, not leave()
  assert.equal((await offline)[0].find(p => p.seat === seat).online, false);
  assert.equal((await resumed)[0].t, 'resumed');
  assert.equal(guest.you.seat, seat);
  assert.equal(guest.status, 'open');
}));

test('health and the test page are served', () => withServer({}, async server => {
  const health = await (await fetch(`${server.http}/health`)).json();
  assert.equal(health.ok, true);
  assert.equal(health.rooms, 0);
  const page = await fetch(`${server.http}/`);
  assert.match(await page.text(), /RoomClient/);
  assert.equal((await fetch(`${server.http}/client/room-client.js`)).status, 200);
  assert.equal((await fetch(`${server.http}/../config.mjs`)).status, 404);
}));

test('origins outside ALLOWED_ORIGINS are refused; file:// (null) can be allowed', () => withServer({ ALLOWED_ORIGINS: ['https://game.example', 'null'] }, async server => {
  await assert.rejects(raw(server.url, { Origin: 'https://evil.example' }).open(), /403/);
  const ok = raw(server.url, { Origin: 'null' });
  await ok.open();
  ok.ws.close();
}));

test('bad version, bad JSON, oversized and flooding messages get errors', () => withServer({ MAX_MESSAGE_BYTES: 1024, RATE_PER_SEC: 5, RATE_BURST: 5 }, async server => {
  const c = raw(server.url);
  await c.open();
  c.send({ v: 99, t: 'create' });
  assert.deepEqual(await c.next(), { t: 'error', code: 'bad-version', ref: 'create' });
  c.send('{not json');
  assert.deepEqual(await c.next(), { t: 'error', code: 'bad-message' });
  c.send({ t: 'pose', data: 'x'.repeat(2000) });
  assert.deepEqual(await c.next(), { t: 'error', code: 'too-large' });
  for (let i = 0; i < 10; i++) c.send({ t: 'pose', data: i });
  const errors = new Set();
  for (let i = 0; i < 3; i++) errors.add((await c.next()).code);
  assert.ok(errors.has('rate-limited'));
  c.ws.close();
}));
