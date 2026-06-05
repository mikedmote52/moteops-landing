/* ──────────────────────────────────────────────────────────────────────────
 * bgfield.js — Mote Ops scroll-driven background, "Orrery" variant (v2, richer).
 *
 * A faint gold constellation in the dark hero assembles, as you scroll, into a
 * deliberate clockwork orrery: concentric rings at varied radii, nodes of varied
 * size, subtle counter-rotation between neighboring rings, constellation linkages
 * that draw in, and small bodies that trace along the rings. Three depth layers
 * parallax at different scroll rates. On the dark hero the line-art glows gold;
 * as the page turns cream the same drawing eases to a quiet ink-readable
 * schematic so it never fights the text.
 *
 * Self-contained, no dependencies. SVG + transform/opacity only — no layout
 * repaints. Scroll position is read once per animation frame (single source of
 * truth), so it is robust to missed scroll events and naturally rAF-throttled.
 *
 * Robustness:
 *   - Ring / node / body counts scale down on small or low-power devices.
 *   - The rAF loop is paused by IntersectionObserver when #bgfield is offscreen,
 *     and on tab hide, to save battery.
 *   - prefers-reduced-motion renders the final assembled state, static, no loop.
 *
 * Grounded in cockpit tokens: gold #C9A24A, ink, restraint. Config: set
 * window.MOTEOPS_BG = { variant: 'orrery' } before load (this file is the orrery;
 * the brain lives in bgbrain.js). Exposes window.__bgfield for prototype/capture.
 * ────────────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  var field = document.getElementById('bgfield');
  if (!field) return;

  // BOLD two-tone palette (Mike: make it obvious, not a whisper). Saturated
  // luminous gold leads the foreground/inner rings; vivid teal-cyan is the clearly
  // visible second hue in the deeper rings and far parallax layer. On the cream
  // body both tones shift to deep, readable inks that KEEP their hue (warm vs
  // teal), so the art stays vivid on both grounds instead of washing out.
  var GOLD = '#E8B445';        // saturated luminous gold (foreground / near)
  var SLATE = '#3FB6D8';       // vivid teal-cyan (background / far) — unmistakable
  var INK = '#7A5E1E';         // deep warm gold-ink (gold on cream, still gold)
  var INK_COOL = '#1C6E86';    // deep teal-ink (teal on cream, still teal)
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Device scaling ───────────────────────────────────────────────────────── */
  // Width can read 0 if the script initializes while the tab is hidden/0-size;
  // fall back to a desktop default so we don't wrongly latch into mobile/low tier.
  var vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) || 1280;
  var cores = navigator.hardwareConcurrency || 4;
  // ?tier=low|mid|high forces a tier (capture / testing); otherwise auto-detect.
  var tierQP = (new URLSearchParams(location.search).get('tier') || '').toLowerCase();
  var TIER = (tierQP === 'low' || tierQP === 'mid' || tierQP === 'high') ? tierQP
           : (vw < 560 || cores <= 2) ? 'low' : (vw < 1024 || cores <= 4) ? 'mid' : 'high';
  var LVL = { low: 0, mid: 1, high: 2 }[TIER];

  // Mobile gets a deliberately punchier treatment: the art is re-centered into
  // view, opacity and stroke are raised, and we keep a healthy node/body count
  // so it reads as alive, not a faint afterthought. "Performance scaling" must
  // not flatten the small screen into nothing.
  var IS_MOBILE = vw <= 640;
  var INTENSITY = IS_MOBILE ? 1.7 : 1.0;   // multiplies line/node/body opacity
  // SVG feGaussianBlur over the parallax groups re-rasterizes every frame as the
  // layers translate — the dominant cost behind scroll jank on phone GPUs. Skip
  // the blur on mobile and lean on the radial-gradient node fills + raised
  // INTENSITY/stroke to keep it bold. Desktop keeps the true glow.
  var USE_GLOW = !IS_MOBILE;

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function smooth(t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }
  // Parse either #RRGGBB or rgb(r,g,b) into [r,g,b]. Accepting both is essential
  // because toneStroke() nests mix() results (rgb strings) back into mix().
  function parseColor(s) {
    if (s.charAt(0) === '#') return [parseInt(s.slice(1, 3), 16), parseInt(s.slice(3, 5), 16), parseInt(s.slice(5, 7), 16)];
    var m = s.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
    return m ? [+m[1], +m[2], +m[3]] : [0, 0, 0];
  }
  function mix(c1, c2, t) {
    var a = parseColor(c1), b = parseColor(c2);
    return 'rgb(' + Math.round(a[0] + (b[0] - a[0]) * t) + ',' + Math.round(a[1] + (b[1] - a[1]) * t) + ',' + Math.round(a[2] + (b[2] - a[2]) * t) + ')';
  }
  function el(tag, attrs) { var n = document.createElementNS(NS, tag); for (var k in attrs) n.setAttribute(k, attrs[k]); return n; }

  // Center the orrery so it FILLS the viewport (Mike wants it present across the
  // screen, not a faint corner detail). The hero constellation still lives in its
  // own top-right SVG; this page-spanning mechanism is centered behind everything.
  var cx = IS_MOBILE ? 720 : 760, cy = IS_MOBILE ? 430 : 440;

  /* ── Ring definitions ──────────────────────────────────────────────────────
   * Ring 0 is the existing hero cluster (visible at rest). Outer rings resolve
   * in with scroll. `speed` alternates sign for counter-rotation; `depth` (0..2)
   * assigns each ring to a parallax layer. Counts thin out on smaller devices. */
  var allRings = [
    { r: 92,  n: 7,  speed: 0.000, base: true, depth: 0 },
    { r: 156, n: 5,  speed: -0.060, depth: 1 },
    { r: 232, n: 9,  speed: 0.040,  depth: 0 },
    { r: 310, n: 8,  speed: -0.028, depth: 2 },
    { r: 398, n: 12, speed: 0.022,  depth: 1 },
    { r: 486, n: 14, speed: -0.016, depth: 2 }
  ];
  // Mobile keeps a strong-but-leaner ring count: 4 rings still reads as a full
  // orrery while cutting per-frame circle/node/link work for smoother scroll.
  var ringCount = IS_MOBILE ? 4 : [4, 5, 6][LVL];
  var rings = allRings.slice(0, ringCount);

  /* ── Parallax layers (3 depth planes, different scroll rates) ──────────────── */
  var layerG = [ el('g', {}), el('g', {}), el('g', {}) ];   // depth 0,1,2
  var parallaxRate = [0.0, 0.05, 0.11];                      // translateY per scroll progress * VH

  // Tighter viewBox on mobile zooms the scene so the re-centered orrery fills
  // the narrow screen and reads large, instead of being a tiny corner detail.
  var vbW = IS_MOBILE ? 1040 : 1440, vbH = IS_MOBILE ? 900 : 900;
  var svg = el('svg', { viewBox: '0 0 ' + vbW + ' ' + vbH, preserveAspectRatio: 'xMidYMid slice', 'aria-hidden': 'true' });

  /* ── Node shading via reusable radial gradients ────────────────────────────
   * Each node fills with a radial gradient (lit core → darker rim) so it reads
   * as a small sphere catching light, not a flat dot. Four variants cover warm
   * vs cool tone × dark-ground vs cream-ground, so the shading survives the
   * contrast crossfade. Defined ONCE in <defs>; nodes just reference by id, so
   * there is no per-frame allocation. */
  function lighten(hex, t) { return mix(hex, '#FFFFFF', t); }
  function darken(hex, t) { return mix(hex, '#000000', t); }
  var defs = el('defs', {});
  // Glow filter so rings/nodes/links bloom with light (luminous, not flat).
  var glow = document.createElementNS(NS, 'filter');
  glow.setAttribute('id', 'orrGlow');
  glow.setAttribute('x', '-30%'); glow.setAttribute('y', '-30%');
  glow.setAttribute('width', '160%'); glow.setAttribute('height', '160%');
  glow.innerHTML = '<feGaussianBlur stdDeviation="3.2" result="b"/>' +
                   '<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>';
  if (USE_GLOW) defs.appendChild(glow);
  function radial(id, coreCol, rimCol) {
    var g = el('radialGradient', { id: id, cx: '36%', cy: '32%', r: '75%' });
    g.appendChild(el('stop', { offset: '0%', 'stop-color': lighten(coreCol, 0.4) }));
    g.appendChild(el('stop', { offset: '45%', 'stop-color': coreCol }));
    g.appendChild(el('stop', { offset: '100%', 'stop-color': rimCol }));
    defs.appendChild(g);
  }
  // dark-ground: near-white lit core → tone rim, so nodes read as glowing spheres
  radial('ndWarmDark', lighten(GOLD, 0.85), darken(GOLD, 0.10));
  radial('ndCoolDark', lighten(SLATE, 0.80), darken(SLATE, 0.10));
  // cream-ground: bright core, deep-hued rim so nodes stay vivid on cream
  radial('ndWarmCream', lighten(INK, 0.55), darken(INK, 0.10));
  radial('ndCoolCream', lighten(INK_COOL, 0.55), darken(INK_COOL, 0.10));
  svg.appendChild(defs);
  // Glow the whole parallax stack on desktop (one filter, lattice blooms). On
  // mobile the filter is skipped — see USE_GLOW — so the layers composite cleanly
  // and scroll stays smooth. will-change hints the compositor to keep each
  // translating layer on its own GPU layer.
  layerG.forEach(function (g) {
    if (USE_GLOW) g.setAttribute('filter', 'url(#orrGlow)');
    g.style.willChange = 'transform';
  });

  // Without the blur, mobile strokes need a touch more weight to stay bold.
  var SW = IS_MOBILE ? 1.35 : 1.0;   // stroke-width multiplier

  // ring circles, grouped by depth so they parallax with their layer
  var ringEls = [];
  rings.forEach(function (ring) {
    var c = el('circle', { cx: cx, cy: cy, r: ring.r, fill: 'none', 'stroke-width': (1.8 * SW).toFixed(2) });
    layerG[ring.depth].appendChild(c);
    ringEls.push({ el: c, ring: ring });
  });

  /* ── Nodes on each ring + spoke link to center ─────────────────────────────── */
  var nodes = [];
  rings.forEach(function (ring, ri) {
    for (var i = 0; i < ring.n; i++) {
      var baseA = (i / ring.n) * Math.PI * 2 + ri * 0.7;
      var node = { ri: ri, baseA: baseA, ring: ring, base: !!ring.base, depth: ring.depth };
      // varied node sizes: inner ring biggest, a little size variation per node
      // (bigger overall so they read as glowing spheres, not specks)
      var rad = ri === 0 ? (6 + (i % 3 === 0 ? 2 : 0)) : Math.max(3, 5.5 - ri * 0.5 + (i % 4 === 0 ? 1.2 : 0));
      var c = el('circle', { r: rad });
      layerG[ring.depth].appendChild(c); node.el = c;
      var ln = el('line', { 'stroke-width': (1.5 * SW).toFixed(2) });
      layerG[ring.depth].appendChild(ln); node.link = ln;
      nodes.push(node);
    }
  });

  /* ── Inner constellation linkages (the original 7-point cluster) ───────────── */
  var innerLinks = [];
  var r0 = nodes.filter(function (n) { return n.ri === 0; });
  [[0, 1], [1, 2], [2, 3], [0, 4], [4, 5], [3, 6]].forEach(function (p) {
    if (r0[p[0]] && r0[p[1]]) {
      var ln = el('line', { 'stroke-width': (1.8 * SW).toFixed(2) });
      layerG[0].appendChild(ln); innerLinks.push({ a: r0[p[0]], b: r0[p[1]], el: ln });
    }
  });

  /* ── Cross-ring linkages that draw in with scroll (more lattice) ───────────── */
  // connect a node on ring k to the nearest-angle node on ring k+1, for a few
  // nodes per ring, so the orrery wires itself into a web as you scroll.
  var crossLinks = [];
  for (var ri = 1; ri < rings.length; ri++) {
    var inner = nodes.filter(function (n) { return n.ri === ri - 1; });
    var outer = nodes.filter(function (n) { return n.ri === ri; });
    var step = Math.max(1, Math.round(outer.length / 4));
    for (var oi = 0; oi < outer.length; oi += step) {
      // nearest inner node by base angle
      var best = null, bestD = 1e9;
      for (var ii = 0; ii < inner.length; ii++) {
        var d = Math.abs(((inner[ii].baseA - outer[oi].baseA + Math.PI) % (2 * Math.PI)) - Math.PI);
        if (d < bestD) { bestD = d; best = inner[ii]; }
      }
      if (best) {
        var ln = el('line', { 'stroke-width': (1.3 * SW).toFixed(2) });
        layerG[outer[oi].depth].appendChild(ln);
        crossLinks.push({ a: best, b: outer[oi], el: ln, ri: ri });
      }
    }
  }

  /* ── Small bodies tracing along the rings (life) ───────────────────────────── */
  // Mobile keeps tracing bodies (motion = "alive"); trimmed to 3 to lighten the
  // per-frame loop while staying clearly alive.
  var bodyCount = IS_MOBILE ? 3 : [0, 3, 5][LVL];
  var bodies = [];
  for (var bi = 0; bi < bodyCount; bi++) {
    var ring = rings[1 + (bi % Math.max(1, rings.length - 1))];
    var c = el('circle', { r: 3.2 });
    layerG[ring.depth].appendChild(c);
    bodies.push({ el: c, ring: ring, phase: bi * 1.7, dir: bi % 2 ? 1 : -1, speed: 0.18 + bi * 0.05 });
  }

  layerG.forEach(function (g) { svg.appendChild(g); });
  field.innerHTML = ''; field.appendChild(svg);

  /* ── Timing / loop scaffolding ─────────────────────────────────────────────── */
  var progress = 0;
  var t0 = (window.performance && performance.now) ? performance.now() : Date.now();
  function now() { return ((window.performance && performance.now) ? performance.now() : Date.now()); }
  function computeProgress() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    return max > 0 ? clamp(window.pageYOffset / max, 0, 1) : 0;
  }

  function render() {
    var reduced = prefersReduced;
    var p = reduced ? 1 : progress;
    var time = (now() - t0) / 1000;
    // Hold the vivid gold/teal across the dark hero, then crossfade to the deep
    // (still-hued) inks as the page turns cream around p≈0.16–0.30. Later + wider
    // than before so the bold color is present for most of the scroll.
    var inkT = smooth(clamp((p - 0.16) / 0.16, 0, 1));
    var stroke = mix(GOLD, INK, inkT);                 // warm stroke (legacy default)
    var onCream = inkT > 0.5;                           // ground flipped to cream?

    // Per-depth tone: depth 0 stays warm gold (foreground), deeper layers shade
    // cooler toward slate, then each crossfades to its matching ink on cream.
    // depthMix = 0 (warm) .. 1 (cool) by layer.
    function toneStroke(depth) {
      var depthMix = [0.0, 0.45, 0.82][depth] || 0;
      var dark = mix(GOLD, SLATE, depthMix);
      var cream = mix(INK, INK_COOL, depthMix);
      return mix(dark, cream, inkT);
    }
    // node gradient id by tone (warm vs cool) and ground (dark vs cream)
    function nodeFill(depth) {
      var cool = depth >= 1;
      return 'url(#nd' + (cool ? 'Cool' : 'Warm') + (onCream ? 'Cream' : 'Dark') + ')';
    }

    // Stay bold throughout — only a slight ease on the cream body so the art is
    // clearly visible everywhere, never ghostly.
    var baseFieldOp = IS_MOBILE ? (1.0 - inkT * 0.10) : (1.0 - inkT * 0.14);
    field.style.opacity = baseFieldOp.toFixed(3);

    // parallax layers — translate each depth plane by its rate
    for (var d = 0; d < layerG.length; d++) {
      var ty = (reduced ? 0 : p) * parallaxRate[d] * 900;
      layerG[d].setAttribute('transform', 'translate(0,' + ty.toFixed(1) + ')');
    }

    // depth dimming: nearer layers brighter, farther layers dimmer (atmosphere),
    // but keep the floor high enough that the far teal rings stay clearly visible.
    var depthDim = [1.0, 0.9, 0.82];

    // rings appear with scroll, toned + dimmed by depth (bold, glowing)
    ringEls.forEach(function (re, idx) {
      var appearR = re.ring.base ? 1 : smooth((p - 0.10 - idx * 0.11) / 0.34);
      re.el.setAttribute('stroke', toneStroke(re.ring.depth));
      re.el.style.opacity = clamp(appearR * (re.ring.base ? 0.55 : 0.65) * depthDim[re.ring.depth] * INTENSITY, 0, 0.95).toFixed(3);
    });

    // nodes — counter-rotation, twinkle, radial-shaded fill, depth tone on links
    nodes.forEach(function (nd, i) {
      var appear = nd.base ? 1 : smooth((p - 0.10 - nd.ri * 0.11) / 0.34);
      var rot = reduced ? 0 : time * nd.ring.speed;
      var a = nd.baseA + rot;
      var x = cx + Math.cos(a) * nd.ring.r, y = cy + Math.sin(a) * nd.ring.r;
      nd.el.setAttribute('cx', x); nd.el.setAttribute('cy', y);
      // gradient fill gives each node a lit core → shaded rim; swap only when the
      // ground (dark↔cream) or tone bucket changes, to avoid per-frame churn.
      var fillId = nodeFill(nd.depth);
      if (nd._fill !== fillId) { nd.el.setAttribute('fill', fillId); nd._fill = fillId; }
      nd._x = x; nd._y = y;
      var tw = reduced ? 0.95 : 0.75 + 0.25 * Math.sin(time * 1.2 + i * 0.9);
      nd.el.style.opacity = clamp(appear * tw * depthDim[nd.depth] * INTENSITY, 0, 1).toFixed(3);
      nd.link.setAttribute('x1', cx); nd.link.setAttribute('y1', cy);
      nd.link.setAttribute('x2', x); nd.link.setAttribute('y2', y);
      nd.link.setAttribute('stroke', toneStroke(nd.depth));
      nd.link.style.opacity = clamp((nd.base ? 0 : appear * 0.45) * depthDim[nd.depth] * INTENSITY, 0, 0.8).toFixed(3);
    });

    // inner constellation links (visible early)
    innerLinks.forEach(function (l) {
      l.el.setAttribute('x1', l.a._x); l.el.setAttribute('y1', l.a._y);
      l.el.setAttribute('x2', l.b._x); l.el.setAttribute('y2', l.b._y);
      l.el.setAttribute('stroke', stroke); l.el.style.opacity = clamp(0.6 * INTENSITY, 0, 0.85).toFixed(3);
    });

    // cross-ring links draw in progressively as the orrery wires up
    crossLinks.forEach(function (l) {
      var on = smooth((p - 0.20 - l.ri * 0.08) / 0.30);
      l.el.setAttribute('x1', l.a._x); l.el.setAttribute('y1', l.a._y);
      l.el.setAttribute('x2', l.b._x); l.el.setAttribute('y2', l.b._y);
      l.el.setAttribute('stroke', toneStroke(l.b.depth));
      l.el.style.opacity = clamp(on * 0.42 * depthDim[l.b.depth] * INTENSITY, 0, 0.7).toFixed(3);
    });

    // small bodies trace along their ring (shaded fill, depth tone + dimming)
    bodies.forEach(function (bd) {
      var appear = smooth((p - 0.16) / 0.34);
      var a = bd.phase + (reduced ? 0 : time * bd.speed * bd.dir);
      var x = cx + Math.cos(a) * bd.ring.r, y = cy + Math.sin(a) * bd.ring.r;
      bd.el.setAttribute('cx', x); bd.el.setAttribute('cy', y);
      var bFill = nodeFill(bd.ring.depth);
      if (bd._fill !== bFill) { bd.el.setAttribute('fill', bFill); bd._fill = bFill; }
      bd.el.style.opacity = clamp(appear * 0.7 * depthDim[bd.ring.depth] * INTENSITY, 0, 0.95).toFixed(3);
    });
  }

  /* ── rAF loop with offscreen/visibility pause ──────────────────────────────── */
  var running = false, rafId = 0, frozen = false;
  function tick() {
    if (!running) { rafId = 0; return; }
    progress = computeProgress();
    render();
    rafId = requestAnimationFrame(tick);
  }
  function start() { if (frozen) return; if (!running) { running = true; rafId = requestAnimationFrame(tick); } }
  function stop() { running = false; if (rafId) cancelAnimationFrame(rafId); rafId = 0; }

  if (prefersReduced || !('requestAnimationFrame' in window)) {
    progress = 1; render();   // static assembled state, no loop
  } else {
    progress = computeProgress();
    render();                  // paint once synchronously
    // #bgfield is a full-viewport fixed layer, on screen whenever the tab is, so
    // we start the loop by default and only pause on tab-hide. Gating purely on
    // IntersectionObserver is fragile (it can report a non-intersecting box in
    // some contexts and wedge the loop off).
    if (!document.hidden) start();
    document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else start(); });
  }

  /* ── Expose for prototype panel / captures ─────────────────────────────────── */
  window.__bgfield = {
    tier: TIER,
    counts: { rings: rings.length, nodes: nodes.length, crossLinks: crossLinks.length, bodies: bodies.length },
    setVariant: function () {},   // kept for API compatibility; variant chosen by loader
    // freeze() stops the rAF loop and latches it off so a renderAt() frame holds
    // (used for static captures; IntersectionObserver can't restart it after).
    freeze: function () { frozen = true; stop(); },
    renderAt: function (p) { progress = clamp(p, 0, 1); render(); return progress; },
    render: render
  };
})();
