/* ──────────────────────────────────────────────────────────────────────────
 * bgcode.js — Mote Ops binary-code perimeter texture.
 *
 * A quiet field of 0s and 1s around the EDGES of the viewport, fading inward to
 * nothing at the center, so it frames the central orrery/brain without ever
 * crowding it. At rest it is barely-there — a low-contrast digital grain. As you
 * scroll it comes FORWARD: edge digits brighten and drift gently downward, as if
 * the code is surfacing, then recede. Restrained and elegant, not a Matrix wall.
 *
 * Performance discipline (matches bgfield.js — we just fixed scroll jank):
 *   - ONE <canvas>, all glyphs drawn in a single paint per frame. No SVG filters,
 *     no per-glyph DOM nodes.
 *   - Scroll is read once per animation frame (rAF-throttled, no scroll listener),
 *     so it can never thrash on rapid scroll.
 *   - Density scales down on phones; glyphs are a fixed grid (no per-frame alloc).
 *   - Paused on tab hide (document.hidden); prefers-reduced-motion paints one
 *     static low-contrast frame and never loops.
 *
 * Layering: lives in #bgcode at z-index 0, behind all content (z-index 1), so it
 * NEVER touches text legibility. Self-contained, no dependencies.
 * Exposes window.__bgcode for inspection / capture.
 * ────────────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var host = document.getElementById('bgcode');
  if (!host) return;

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) || 1280;
  var IS_MOBILE = vw <= 640;

  // Palette — the same saturated gold/teal as the orrery, kept very translucent so
  // the field stays a texture, not a foreground element.
  var GOLD = [232, 180, 69];   // #E8B445
  var TEAL = [63, 182, 216];   // #3FB6D8

  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d', { alpha: true });
  host.innerHTML = '';
  host.appendChild(canvas);

  // Grid sizing. Cells are sparser/larger on mobile so glyph COUNT stays low
  // (fewer fillText calls per frame = smoother), while still reading as a field.
  var CELL = IS_MOBILE ? 34 : 26;        // px between glyph cells (CSS px)
  var FONT = IS_MOBILE ? 13 : 12;        // glyph font size (CSS px)
  var dpr = Math.min(window.devicePixelRatio || 1, IS_MOBILE ? 1.5 : 2); // cap DPR on phones

  var cols = 0, rows = 0, cells = [];
  var W = 0, H = 0;

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  // Edge-weight mask: ~1 at the perimeter, 0 across a protected central column so
  // the code only ever FRAMES the viewport and never sits behind body text. The
  // horizontal and vertical falloffs are computed INDEPENDENTLY: a cell is lit if
  // it is near a left/right edge OR a top/bottom edge, but the interior (far from
  // every edge) stays empty. The horizontal reach is deliberately a small slice of
  // the width — on a narrow phone column the text fills the middle, so the side
  // bands must be thin or they'd bleed under the copy (the bug this fixes).
  function smoothstep(t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }
  function edgeWeight(x, y) {
    var dx = Math.min(x, W - x);                 // px to nearest L/R edge
    var dy = Math.min(y, H - y);                 // px to nearest T/B edge
    // side band: ~22% of the width per side, leaving the center ~56% clear
    var hReach = W * 0.22;
    // top/bottom band: a shallow strip so it reads as a frame, not a full curtain
    var vReach = H * 0.16;
    var hw = 1 - smoothstep(dx / hReach);        // 1 at side edge → 0 toward center
    var vw = 1 - smoothstep(dy / vReach);        // 1 at top/bottom → 0 toward middle
    // near a horizontal OR vertical edge; squared so the band edge fades softly
    var w = Math.max(hw, vw);
    return w * w;
  }

  function build() {
    W = host.clientWidth || vw;
    H = host.clientHeight || (window.innerHeight || 800);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '600 ' + FONT + 'px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

    cols = Math.ceil(W / CELL) + 1;
    rows = Math.ceil(H / CELL) + 1;
    cells = [];
    // Deterministic pseudo-random (no Math.random — keeps it stable across the
    // capture harness and avoids surprise reflows). Hash by cell index.
    function rnd(i) { var x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); }
    var idx = 0;
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var x = c * CELL + CELL * 0.5;
        var y = r * CELL + CELL * 0.5;
        var w = edgeWeight(x, y);
        // Skip interior cells entirely — they'd be invisible and cost paint time.
        if (w < 0.04) { idx++; continue; }
        var ra = rnd(idx);
        cells.push({
          x: x, y: y, w: w,
          char: rnd(idx + 7) > 0.5 ? '1' : '0',
          // per-cell flicker + flip cadence, so the field shimmers unevenly
          tw: 0.6 + ra * 0.9,
          ph: ra * 6.28,
          flip: 2.2 + rnd(idx + 3) * 5.5,   // seconds between digit flips
          nextFlip: rnd(idx + 5) * 4,
          teal: rnd(idx + 11) > 0.62        // a minority of glyphs are teal
        });
        idx++;
      }
    }
  }

  /* ── Scroll → emergence factor (read once per frame) ───────────────────────── */
  function scrollProgress() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    return max > 0 ? clamp(window.pageYOffset / max, 0, 1) : 0;
  }

  var t0 = (window.performance && performance.now) ? performance.now() : Date.now();
  function now() { return ((window.performance && performance.now) ? performance.now() : Date.now()); }

  function render() {
    var time = (now() - t0) / 1000;
    var p = prefersReduced ? 0 : scrollProgress();

    // Emergence: the field is barely-there at rest and comes forward mid-scroll,
    // peaking around the middle of the page, then easing back so it recedes near
    // the footer. A gentle hump, not a linear ramp.
    var hump = Math.sin(clamp(p, 0, 1) * Math.PI);          // 0 → 1 → 0
    var emerge = 0.22 + 0.78 * hump;                         // floor so edges never fully vanish

    // Slight forward drift: glyphs ease downward as the field surfaces.
    var drift = (prefersReduced ? 0 : (p * 26 + time * 2.0) % CELL);

    ctx.clearRect(0, 0, W, H);

    for (var i = 0; i < cells.length; i++) {
      var cell = cells[i];

      // occasional digit flip (cheap; only a string swap)
      if (!prefersReduced) {
        cell.nextFlip -= 0.016;  // ~per-frame at 60fps; exact dt not needed for cadence
        if (cell.nextFlip <= 0) { cell.char = cell.char === '1' ? '0' : '1'; cell.nextFlip = cell.flip; }
      }

      // per-glyph twinkle so the field shimmers
      var tw = prefersReduced ? 0.7 : (0.55 + 0.45 * Math.sin(time * cell.tw + cell.ph));
      // base alpha: very low at rest (texture), lifted by emergence + edge weight
      var alpha = cell.w * tw * emerge * (IS_MOBILE ? 0.16 : 0.14);
      if (alpha < 0.012) continue;   // skip near-invisible glyphs (saves fillText)

      var col = cell.teal ? TEAL : GOLD;
      ctx.fillStyle = 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + alpha.toFixed(3) + ')';
      var yy = cell.y + drift * cell.w;   // edge cells drift more than inner ones
      if (yy > H + CELL) yy -= (H + CELL); // wrap so drift is seamless
      ctx.fillText(cell.char, cell.x, yy);
    }
  }

  /* ── rAF loop with visibility pause (same discipline as bgfield) ───────────── */
  var running = false, rafId = 0;
  function tick() {
    if (!running) { rafId = 0; return; }
    render();
    rafId = requestAnimationFrame(tick);
  }
  function start() { if (!running) { running = true; rafId = requestAnimationFrame(tick); } }
  function stop() { running = false; if (rafId) cancelAnimationFrame(rafId); rafId = 0; }

  build();

  if (prefersReduced || !('requestAnimationFrame' in window)) {
    render();   // one static low-contrast frame, no loop
  } else {
    render();
    if (!document.hidden) start();
    document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else start(); });
  }

  // Rebuild the grid on resize (debounced) so the perimeter tracks the viewport.
  var rt = 0;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () { build(); if (!running && !prefersReduced && !document.hidden) start(); render(); }, 200);
  }, { passive: true });

  window.__bgcode = {
    cellCount: function () { return cells.length; },
    mobile: IS_MOBILE,
    render: render,
    stop: stop, start: start
  };
})();
