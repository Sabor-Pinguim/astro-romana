// H-S1: game-balance puzzle for planning an Ingenuity-inspired survey route.
(() => {
  const WIDTH = 5, HEIGHT = 5;
  // The checkpoints admit a route through every cell; the last is the endpoint.
  const CHECKPOINTS = [[0, 0], [4, 1], [0, 2], [4, 3], [4, 4]];
  const $ = id => document.getElementById(id);
  const game = $('scout-game'), board = $('scout-board'), dialog = $('minigame-dialog');
  let path = [], active = false, drawing = false;

  function checkpointAt(x, y) { return CHECKPOINTS.findIndex(([cx, cy]) => cx === x && cy === y); }
  function render() {
    const visited = new Map(path.map(([x, y], i) => [`${x},${y}`, i]));
    const reached = path.filter(([x, y]) => checkpointAt(x, y) >= 0).length;
    board.querySelectorAll('.scout-tile').forEach(cell => {
      const x = Number(cell.dataset.x), y = Number(cell.dataset.y), n = checkpointAt(x, y);
      const index = visited.get(`${x},${y}`), previous = path[index - 1], next = path[index + 1];
      cell.className = 'scout-tile';
      if (index !== undefined) {
        cell.classList.add('visited');
        if (index === path.length - 1) cell.classList.add('drone');
        for (const neighbor of [previous, next]) {
          if (!neighbor) continue;
          if (neighbor[0] < x) cell.classList.add('link-left');
          if (neighbor[0] > x) cell.classList.add('link-right');
          if (neighbor[1] < y) cell.classList.add('link-up');
          if (neighbor[1] > y) cell.classList.add('link-down');
        }
      }
      cell.textContent = n >= 0 ? String(n + 1) : '';
      cell.setAttribute('aria-label', `Row ${y + 1}, column ${x + 1}${n >= 0 ? `, waypoint ${n + 1}` : ''}${index !== undefined ? ', on route' : ''}`);
    });
    $('scout-points').textContent = `${reached} / ${CHECKPOINTS.length} WAYPOINTS`;
    $('scout-time').textContent = `${path.length} / ${WIDTH * HEIGHT} SECTORS`;
  }
  function stop() { active = false; drawing = false; }
  function reset() {
    stop(); path = [CHECKPOINTS[0].slice()]; active = true;
    $('scout-status').textContent = 'Connect the numbered points in order and cover every sector. Drag, tap adjacent cells, or use the arrows. Trace back to undo.';
    $('scout-start').hidden = false; $('scout-start').textContent = 'Reset route';
    $('minigame-done').hidden = true;
    game.querySelectorAll('[data-scout]').forEach(button => { button.disabled = false; });
    render();
  }
  function moveTo(x, y) {
    if (!active || x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) return;
    const [px, py] = path[path.length - 1];
    if (Math.abs(x - px) + Math.abs(y - py) !== 1) return;
    const prior = path.findIndex(([cx, cy]) => cx === x && cy === y);
    if (prior >= 0) {
      path = path.slice(0, prior + 1);
      $('scout-status').textContent = 'Route shortened. Continue from the highlighted sector.';
      render(); return;
    }
    const checkpoint = checkpointAt(x, y);
    const reached = path.filter(([cx, cy]) => checkpointAt(cx, cy) >= 0).length;
    if (checkpoint >= 0 && checkpoint !== reached) { $('scout-status').textContent = `Visit waypoint ${reached + 1} next.`; return; }
    if (checkpoint === CHECKPOINTS.length - 1 && path.length !== WIDTH * HEIGHT - 1) {
      $('scout-status').textContent = 'Cover every sector before reaching the final waypoint.'; return;
    }
    path.push([x, y]);
    if (path.length === WIDTH * HEIGHT && checkpoint === CHECKPOINTS.length - 1) {
      stop(); $('scout-status').textContent = 'Survey route complete. The scout map is ready for the crew.';
      game.querySelectorAll('[data-scout]').forEach(button => { button.disabled = true; });
      dialog.dispatchEvent(new CustomEvent('astro:minigame-completed', { detail: { id: 'H-S1' } }));
    } else $('scout-status').textContent = 'Connect the points in order and cover every sector.';
    render();
  }
  function move(dx, dy) { const [x, y] = path[path.length - 1]; moveTo(x + dx, y + dy); }
  for (let y = 0; y < HEIGHT; y++) for (let x = 0; x < WIDTH; x++) {
    const cell = document.createElement('button');
    cell.type = 'button'; cell.dataset.x = x; cell.dataset.y = y; cell.tabIndex = -1;
    cell.className = 'scout-tile';
    cell.addEventListener('click', () => moveTo(x, y));
    board.append(cell);
  }
  $('scout-start').addEventListener('click', reset);
  game.querySelectorAll('[data-scout]').forEach(button => button.addEventListener('click', () => { const [dx, dy] = button.dataset.scout.split(',').map(Number); move(dx, dy); }));
  board.addEventListener('pointerdown', event => {
    if (!active || event.button !== 0) return;
    const cell = event.target.closest('.scout-tile');
    if (!cell) return;
    drawing = true; board.setPointerCapture(event.pointerId); moveTo(Number(cell.dataset.x), Number(cell.dataset.y)); event.preventDefault();
  });
  board.addEventListener('pointermove', event => {
    if (!drawing) return;
    const cell = document.elementFromPoint(event.clientX, event.clientY)?.closest('.scout-tile');
    if (cell && board.contains(cell)) moveTo(Number(cell.dataset.x), Number(cell.dataset.y));
  });
  board.addEventListener('pointerup', () => { drawing = false; });
  board.addEventListener('pointercancel', () => { drawing = false; });
  dialog.addEventListener('keydown', event => {
    if (dialog.dataset.exp !== 'H-S1') return;
    const moves = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], KeyW: [0, -1], KeyS: [0, 1], KeyA: [-1, 0], KeyD: [1, 0] };
    if (moves[event.code]) { event.preventDefault(); event.stopPropagation(); move(...moves[event.code]); }
  });
  dialog.addEventListener('close', stop);
  window.ASTRO_SCOUT = { reset, stop };
})();
