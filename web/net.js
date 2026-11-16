// Multiplayer link (docs/multiplayer.md): wraps the room client (multiplayer/client/room-client.js) for the game.
// window.ASTRO_NET: mode 'solo' | 'host' | 'guest', the seat, the peers, and the room channels. Without a server
// the game stays solo, as before. The host runs the rules; guests send actions (act) and draw the state they get.
(() => {
  'use strict';
  // Room server (multiplayer/README.md). Static copies of the game (GitHub Pages, pages opened from disk) cannot find
  // it on their own: they use NET_SERVER, the VM's address (multiplayer/deploy; its setup.sh prints it, and needs
  // EXTRA_ORIGINS=https://<user>.github.io for Pages). A page the VM serves talks to its own host at /ws; localhost uses
  // the local server (cd multiplayer && npm start). ?server=ws(s)://…/ws overrides all of it.
  const NET_SERVER = 'wss://35-193-156-110.sslip.io/ws'; // the VM (IP 35.193.156.110, multiplayer/deploy)
  const LOCAL_SERVER = 'ws://localhost:8787/ws';
  // Screens a guest can join in (the server's DEFAULT_JOINABLE); after the launch only a dropped player comes back.
  const JOINABLE = ['menu', 'orbit', 'lobby', 'planner'];
  const params = new URLSearchParams(location.search);
  // Multiplayer switch: on static hosts (GitHub Pages, *.github.io) only with NET_SERVER set; on everywhere else (the
  // VM in multiplayer/deploy, localhost, pages opened from disk). ?server=wss://…/ws turns it on anywhere.
  const STATIC_HOSTS = /(^|\.)github\.io$/i;
  const staticHost = STATIC_HOSTS.test(location.hostname);
  const MULTIPLAYER_ENABLED = params.has('server') || !!NET_SERVER || !staticHost;
  const localhost = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  const site = location.protocol.startsWith('http') && !localhost && !staticHost ? `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws` : '';
  const url = params.get('server') || (localhost ? LOCAL_SERVER : site || NET_SERVER || LOCAL_SERVER);
  const ERRORS = {
    'room-not-found': 'Room not found.', 'room-full': 'This crew is full.', 'in-progress': 'The mission already launched.',
    'seat-taken': 'That crew member already has a player.', unreachable: 'Could not reach the room server.', 'connection-lost': 'Lost the connection to the room server.',
    'host-left': 'The host left: the room closed.', expired: 'The room expired.', server: 'The room server restarted.',
    replaced: 'This seat was opened in another tab.', 'too-many-rooms': 'The room server is full. Try again later.',
  };
  const listeners = new Map();
  const fire = (type, ...args) => (listeners.get(type) || []).forEach(fn => { try { fn(...args); } catch (err) { console.error('ASTRO_NET listener failed:', err); } });
  let room = null;
  function client() {
    if (!MULTIPLAYER_ENABLED) return null;
    if (room) return room;
    if (!window.RoomClient || !url) return null;
    room = new RoomClient({ url });
    for (const type of ['welcome', 'peers', 'phase', 'state', 'event', 'act', 'pose', 'msg', 'status', 'closed', 'error']) room.on(type, (...args) => fire(type, ...args));
    return room;
  }
  const inRoom = () => MULTIPLAYER_ENABLED && !!room?.inRoom;
  const net = {
    enabled: MULTIPLAYER_ENABLED,
    url, JOINABLE,
    get mode() { return inRoom() ? (room.isHost ? 'host' : 'guest') : 'solo'; },
    get isHost() { return inRoom() && room.isHost; },
    get isGuest() { return inRoom() && !room.isHost; },
    get code() { return inRoom() ? room.code : null; },
    get seat() { return inRoom() ? room.you.seat : null; },
    get you() { return inRoom() ? room.you : null; },
    get peers() { return inRoom() ? room.peers : []; },
    get phase() { return inRoom() ? room.phase : null; },
    get cached() { return inRoom() ? room.state : {}; },
    get poses() { return inRoom() ? [...room.poses.values()] : []; }, // the last pose of each peer: [{ from, data }]
    get status() { return room?.status || 'idle'; },
    get joinable() { return inRoom() && JOINABLE.includes(room.phase); },
    get link() { return inRoom() ? RoomClient.linkFor(room.code) : ''; },
    available: () => MULTIPLAYER_ENABLED && !!(window.RoomClient && url),
    message: err => ERRORS[err?.code || err] || `Room error: ${err?.code || err?.message || err}.`,
    on(type, fn) { if (!listeners.has(type)) listeners.set(type, new Set()); listeners.get(type).add(fn); return () => listeners.get(type).delete(fn); },
    peerOf: seat => (inRoom() ? room.peers.find(p => p.seat === seat) : null) || null,
    // My crew member, or an AI one while I am the host (solo counts as host).
    owns: seat => !inRoom() ? true : room.you.seat === seat || (room.isHost && !room.peers.some(p => p.seat === seat)),
    create: phase => client()?.create({ phase }),
    join: code => client()?.join(code),
    leave() { room?.leave(); },
    setPhase: phase => inRoom() && room.isHost && room.setPhase(phase),
    setState: (key, data) => inRoom() && room.isHost && room.setState(key, data),
    emit: data => inRoom() && room.isHost && room.emit(data),
    act: (name, ...args) => inRoom() && !room.isHost && room.act({ name, args }),
    pose: data => inRoom() && room.pose(data),
    send: (data, to) => inRoom() && room.send(data, to),
    setSeat: seat => inRoom() && room.setSeat(seat),
  };
  window.ASTRO_NET = net;
  // Back into the room after a reload, or into the room of an invite link (?room=CODE). app.js listens to
  // 'welcome' and 'error'; a failed link join is reported there.
  net.start = async () => {
    if (!MULTIPLAYER_ENABLED) return;
    const c = client();
    if (!c) return;
    if (await c.rejoin().catch(() => null)) return;
    const code = RoomClient.codeFromUrl();
    if (code) await c.join(code).catch(err => fire('error', err));
  };
})();
