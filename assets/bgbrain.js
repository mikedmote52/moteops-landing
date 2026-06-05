/* ──────────────────────────────────────────────────────────────────────────
 * bgbrain.js — Mote Ops scroll-driven background, "Brain" variant (v2, richer).
 *
 * Bioluminescent digital vines grow inward from the four corners as you scroll.
 * Each main vine branches into finer dendrites that fork off as it grows, so the
 * corners read organic and fractal rather than as four lone lines. The vines
 * converge on a centralized "AI Brain" — a structured internal lattice (concentric
 * node rings wired with chords and a few long cross-links), not a blob. Near the
 * end of the scroll the brain blooms in and fires: staggered glowing data pulses
 * travel down every vine and strike the brain, which then settles into a stable
 * glow with subtle synaptic flickers.
 *
 * Architecture / blueprint:
 *   - Full-screen fixed SVG behind content (#bgfield), responsive viewBox.
 *   - Vines + dendrites are <path> drawn on via the stroke-dashoffset trick;
 *     true lengths measured with getTotalLength() AFTER mount.
 *   - A single GSAP timeline is scrubbed by one ScrollTrigger on <body>:
 *       0%→62%  growth   : main vines draw inward.
 *       18%→72% branch   : dendrites fork off, staggered, as their parent draws.
 *       64%→100% assembly: brain blooms in; pulses fire down the vines; a glow
 *                          swell peaks at convergence; final ~10% locks it.
 *   - Only opacity / transform / SVG path attributes animate — no layout repaints.
 *   - All particles are pooled and reused. No per-frame allocation.
 *   - A separate rAF loop drives the assembled-brain synaptic flicker; it is
 *     paused by IntersectionObserver whenever #bgfield is offscreen, and never
 *     starts under reduced-motion.
 *
 * Robustness:
 *   - Element/particle counts scale down on small or low-power devices.
 *   - prefers-reduced-motion and missing-GSAP both fall back to the static
 *     assembled state (no timeline, no rAF).
 *   - Whole-field opacity follows scroll so gold-on-dark eases to a quiet
 *     ink-readable schematic on the cream body.
 *
 * Self-contained. Exposes window.__bgbrain for the prototype panel / captures.
 * ────────────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  var field = document.getElementById('bgfield');
  if (!field) return;

  // BOLD two-tone palette. Mike's direction: make it obvious and impressive, not
  // a whisper. Saturated luminous gold leads the foreground (brain core, main
  // vines, bloom, pulses); a genuinely vivid teal-cyan is the clearly-perceptible
  // second color in the dendrites and the brain's outer ring. On the cream body
  // both tones crossfade to deep ink so they still read, but stay strong.
  var GOLD = '#E8B445';        // saturated, luminous warm gold (foreground)
  var TEAL = '#3FB6D8';        // vivid cool teal-cyan — the unmistakable 2nd hue
  var SLATE = TEAL;            // (alias kept; cool tone is now the vivid teal)
  var CORE = '#FFE9A8';        // bright warm pulse/flicker core
  var AMBER = '#F2C75B';       // bloom — rich, saturated gold-amber at convergence
  var INK = '#1F1A14';         // deep warm ink (gold on cream)
  var INK_COOL = '#14323D';    // deep teal-ink (teal on cream) — keeps the hue
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // We only need core GSAP now (we drive progress ourselves, not via
  // ScrollTrigger), so the brain still animates even if the ScrollTrigger CDN
  // fails to load. No GSAP at all → static assembled fallback below.
  var hasGSAP = !!window.gsap;
  // Accepts #RRGGBB or rgb(r,g,b) so nested mixes are safe.
  function mix2(c1, c2, t) {
    function h(s){
      if (s.charAt(0)==='#') return [parseInt(s.slice(1,3),16),parseInt(s.slice(3,5),16),parseInt(s.slice(5,7),16)];
      var m=s.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i); return m?[+m[1],+m[2],+m[3]]:[0,0,0];
    }
    var a=h(c1), b=h(c2);
    return 'rgb('+Math.round(a[0]+(b[0]-a[0])*t)+','+Math.round(a[1]+(b[1]-a[1])*t)+','+Math.round(a[2]+(b[2]-a[2])*t)+')';
  }

  /* ── Device scaling ───────────────────────────────────────────────────────
   * Fewer dendrites / pulses / brain nodes on small or low-core machines. */
  // Width can read 0 if the script initializes while the tab is hidden/0-size;
  // fall back to a desktop default so we don't wrongly latch into mobile/low tier.
  var vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) || 1280;
  var cores = navigator.hardwareConcurrency || 4;
  // ?tier=low|mid|high forces a tier (capture / testing); otherwise auto-detect.
  var tierQP = (new URLSearchParams(location.search).get('tier') || '').toLowerCase();
  var TIER = (tierQP === 'low' || tierQP === 'mid' || tierQP === 'high') ? tierQP
           : (vw < 560 || cores <= 2) ? 'low' : (vw < 1024 || cores <= 4) ? 'mid' : 'high';
  var SCALE = { low: 0, mid: 1, high: 2 }[TIER];           // 0,1,2

  // Mobile gets a punchy treatment: don't let low tier strip the dendrites and
  // pulses down to almost nothing — keep mid-ish counts and raise intensity, so
  // the small screen feels alive instead of flat. Still pauses offscreen and
  // honors reduced-motion below.
  var IS_MOBILE = vw <= 640;
  var INTENSITY = IS_MOBILE ? 1.5 : 1.0;
  function tierPick(arr) { return IS_MOBILE ? arr[Math.max(1, SCALE)] : arr[SCALE]; }

  var DENDRITES_PER_VINE = tierPick([2, 3, 4]);            // sub-vines per corner
  var PULSES_PER_VINE    = tierPick([1, 2, 3]);            // staggered pulses
  var BRAIN_RING_COUNT   = tierPick([3, 4, 4]);            // concentric rings
  var FLICKER_COUNT      = tierPick([4, 7, 10]);           // synaptic flickers

  var VW = 1440, VH = 900, CX = VW / 2, CY = VH / 2;
  var brainR = 156;

  /* ── SVG scaffold ─────────────────────────────────────────────────────────── */
  // Tighter viewBox on mobile zooms the brain so it fills the narrow screen and
  // reads as a centerpiece rather than a small mark behind the headline.
  var vbW = IS_MOBILE ? 980 : VW, vbH = VH;
  var vbX = (VW - vbW) / 2, vbY = 0;
  var svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', vbX + ' ' + vbY + ' ' + vbW + ' ' + vbH);
  svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
  svg.setAttribute('aria-hidden', 'true');

  // Radial gradients give each brain node a lit core → shaded rim (a small lit
  // sphere). Warm nodes lead the core/inner rings; cool nodes recede on the
  // outer ring. A faint radial "brain haze" adds soft interior shading so the
  // lattice reads as a volume, not a flat ring of dots. All defined ONCE here.
  // Luminous lit cores (near-white centers) so nodes read as glowing spheres.
  var lightW = mix2(GOLD, '#FFFFFF', 0.78), rimW = mix2(GOLD, '#3a2c08', 0.30);
  var lightC = mix2(TEAL, '#FFFFFF', 0.70), rimC = mix2(TEAL, '#062029', 0.30);
  var defs = document.createElementNS(NS, 'defs');
  defs.innerHTML =
    // stronger glow — bigger blur so the lattice and nodes bloom with light
    '<filter id="bgGlow" x="-80%" y="-80%" width="260%" height="260%">' +
      '<feGaussianBlur stdDeviation="5" result="b"/>' +
      '<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>' +
    '</filter>' +
    '<filter id="bgBloom" x="-150%" y="-150%" width="400%" height="400%">' +
      '<feGaussianBlur stdDeviation="22"/>' +
    '</filter>' +
    '<radialGradient id="brainNodeW" cx="36%" cy="32%" r="75%">' +
      '<stop offset="0%" stop-color="#FFFFFF"/>' +
      '<stop offset="38%" stop-color="' + lightW + '"/>' +
      '<stop offset="100%" stop-color="' + rimW + '"/>' +
    '</radialGradient>' +
    '<radialGradient id="brainNodeC" cx="36%" cy="32%" r="75%">' +
      '<stop offset="0%" stop-color="#EAFBFF"/>' +
      '<stop offset="38%" stop-color="' + lightC + '"/>' +
      '<stop offset="100%" stop-color="' + rimC + '"/>' +
    '</radialGradient>' +
    // brain haze reads as an actual warm glow, not a smudge
    '<radialGradient id="brainHaze" cx="50%" cy="48%" r="55%">' +
      '<stop offset="0%" stop-color="' + mix2(GOLD, '#FFFFFF', 0.35) + '" stop-opacity="0.55"/>' +
      '<stop offset="55%" stop-color="' + AMBER + '" stop-opacity="0.22"/>' +
      '<stop offset="100%" stop-color="' + GOLD + '" stop-opacity="0"/>' +
    '</radialGradient>';
  svg.appendChild(defs);

  function el(tag, attrs) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }
  function ptOnCircle(deg, dist) {
    var a = deg * Math.PI / 180;
    return [CX + Math.cos(a) * dist, CY + Math.sin(a) * dist];
  }

  /* ── Convergence bloom (behind everything, swells at assembly) ────────────── */
  // Bloom carries a touch more saturation (amber) so the convergence reads warm.
  var bloom = el('circle', { cx: CX, cy: CY, r: brainR * 0.9, fill: AMBER, opacity: 0, filter: 'url(#bgBloom)' });
  svg.appendChild(bloom);

  /* ── Vines + branching dendrites ──────────────────────────────────────────── */
  // Glow on the vine group so the growing lines read as luminous neural light.
  var vineG = el('g', { filter: 'url(#bgGlow)' });
  var vines = [];      // main vines: { el, len, from:[x,y], endAngle }
  var dendrites = [];  // sub-vines:  { el, len }

  // Each corner gets one main winding vine to a point just outside the brain,
  // plus a few dendrites that fork off its midsection toward nearby angles.
  var corners = [
    { from: [0, 0],   c1: [380, 130], c2: [430, 320], endA: 208 },
    { from: [VW, 0],  c1: [1060, 130],c2: [1010, 320],endA: 332 },
    { from: [0, VH],  c1: [380, 770], c2: [430, 580], endA: 152 },
    { from: [VW, VH], c1: [1060, 770],c2: [1010, 580],endA: 28  }
  ];

  // Cubic bezier point + tangent, for spawning dendrites along the main vine.
  function bez(p0, p1, p2, p3, t) {
    var mt = 1 - t;
    var x = mt*mt*mt*p0[0] + 3*mt*mt*t*p1[0] + 3*mt*t*t*p2[0] + t*t*t*p3[0];
    var y = mt*mt*mt*p0[1] + 3*mt*mt*t*p1[1] + 3*mt*t*t*p2[1] + t*t*t*p3[1];
    return [x, y];
  }

  corners.forEach(function (c, ci) {
    var end = ptOnCircle(c.endA, brainR + 14);
    var d = 'M ' + c.from[0] + ' ' + c.from[1] +
            ' C ' + c.c1[0] + ' ' + c.c1[1] + ', ' + c.c2[0] + ' ' + c.c2[1] +
            ', ' + end[0] + ' ' + end[1];
    var p = el('path', { d: d, fill: 'none', stroke: GOLD, 'stroke-width': '2.6',
                         'stroke-linecap': 'round', opacity: '0.95' });
    vineG.appendChild(p);
    var mainVine = { el: p, from: c.from, len: 0, endA: c.endA };
    vines.push(mainVine);

    // Dendrites fork from points along the parent's first ~two thirds, ending at
    // a nearby angle on the brain so the whole corner feeds the center.
    for (var k = 0; k < DENDRITES_PER_VINE; k++) {
      var t = 0.30 + (k / Math.max(1, DENDRITES_PER_VINE)) * 0.34;   // 0.30..0.64
      var base = bez(c.from, c.c1, c.c2, end, t);
      var spreadDeg = (k % 2 === 0 ? 1 : -1) * (10 + k * 6);
      var dEnd = ptOnCircle(c.endA + spreadDeg, brainR + 10);
      // a single control point biased outward from the parent for an organic fork
      var ctrl = [ base[0] + (dEnd[0] - base[0]) * 0.35 + (ci < 2 ? 30 : -30),
                   base[1] + (dEnd[1] - base[1]) * 0.30 + (ci % 2 ? 40 : -40) ];
      var dd = 'M ' + base[0].toFixed(1) + ' ' + base[1].toFixed(1) +
               ' Q ' + ctrl[0].toFixed(1) + ' ' + ctrl[1].toFixed(1) +
               ' ' + dEnd[0].toFixed(1) + ' ' + dEnd[1].toFixed(1);
      // Dendrites carry the vivid teal — the unmistakable second hue — so the
      // forking tendrils visibly contrast the gold main vines.
      var dStroke = mix2(TEAL, '#FFFFFF', 0.12);
      var dp = el('path', { d: dd, fill: 'none', stroke: dStroke, 'stroke-width': '1.6',
                            'stroke-linecap': 'round', opacity: '0.8' });
      vineG.appendChild(dp);
      dendrites.push({ el: dp, len: 0, spawnT: t });
    }
  });
  svg.appendChild(vineG);

  /* ── The brain: structured internal lattice ───────────────────────────────── */
  var brainG = el('g', { opacity: '0', filter: 'url(#bgGlow)' });
  // Soft interior haze behind the lattice — gives the brain volume/shading so it
  // reads as a lit mass rather than a flat wire ring. Static fill, no cost.
  brainG.appendChild(el('circle', { cx: CX, cy: CY, r: brainR * 0.92, fill: 'url(#brainHaze)' }));
  var brainNodes = [];
  var ringSpec = [ { r: 0, n: 1 }, { r: 52, n: 6 }, { r: 98, n: 10 }, { r: 150, n: 15 } ]
                  .slice(0, BRAIN_RING_COUNT + 1);
  ringSpec.forEach(function (ring, ri) {
    for (var i = 0; i < ring.n; i++) {
      var a = (i / ring.n) * Math.PI * 2 + ri * 0.32;
      brainNodes.push({ x: CX + Math.cos(a) * ring.r, y: CY + Math.sin(a) * ring.r, ri: ri });
    }
  });
  // Short neighbor chords (lattice structure) + a few long cross-links (depth).
  var latticeD = '';
  for (var a1 = 0; a1 < brainNodes.length; a1++) {
    for (var b1 = a1 + 1; b1 < brainNodes.length; b1++) {
      var dx = brainNodes[a1].x - brainNodes[b1].x, dy = brainNodes[a1].y - brainNodes[b1].y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 22 && dist < 70) {
        latticeD += 'M ' + brainNodes[a1].x.toFixed(1) + ' ' + brainNodes[a1].y.toFixed(1) +
                    ' L ' + brainNodes[b1].x.toFixed(1) + ' ' + brainNodes[b1].y.toFixed(1) + ' ';
      }
    }
  }
  // long cross-links from a handful of outer nodes through the core
  var outer = brainNodes.filter(function (n) { return n.ri === ringSpec.length - 1; });
  for (var x = 0; x < outer.length; x += 3) {
    var opp = outer[(x + Math.floor(outer.length / 2)) % outer.length];
    latticeD += 'M ' + outer[x].x.toFixed(1) + ' ' + outer[x].y.toFixed(1) +
                ' L ' + opp.x.toFixed(1) + ' ' + opp.y.toFixed(1) + ' ';
  }
  brainG.appendChild(el('path', { d: latticeD, fill: 'none', stroke: GOLD, 'stroke-width': '1.4', opacity: '0.85' }));

  var flickerNodes = [];   // subset of node circles used for synaptic flicker
  var lastRing = ringSpec.length - 1;
  brainNodes.forEach(function (nd, i) {
    // Inner rings glow warm (gold gradient), the outer ring takes the vivid teal;
    // each node is radially shaded with a near-white core to read as a lit sphere.
    var fillId = nd.ri >= lastRing ? 'url(#brainNodeC)' : 'url(#brainNodeW)';
    var c = el('circle', { cx: nd.x, cy: nd.y, r: nd.ri === 0 ? 7 : (6 - nd.ri * 0.7), fill: fillId });
    brainG.appendChild(c);
    if (i % Math.max(1, Math.round(brainNodes.length / FLICKER_COUNT)) === 0) flickerNodes.push(c);
  });
  svg.appendChild(brainG);

  /* ── Pulse pool (reused; one set fires per scrub pass) ─────────────────────── */
  var pulseG = el('g', { filter: 'url(#bgGlow)' });
  var pulses = [];   // { el, vine, offset }  offset staggers start along the path
  vines.forEach(function (v) {
    for (var k = 0; k < PULSES_PER_VINE; k++) {
      var c = el('circle', { r: '3.2', fill: CORE, opacity: '0' });
      pulseG.appendChild(c);
      pulses.push({ el: c, vine: v, offset: k / PULSES_PER_VINE });
    }
  });
  svg.appendChild(pulseG);

  field.innerHTML = '';
  field.appendChild(svg);

  /* ── Measure path lengths, prime the dash trick ───────────────────────────── */
  function prime(item) {
    var len = item.el.getTotalLength ? item.el.getTotalLength() : 1200;
    item.len = len;
    item.el.style.strokeDasharray = len;
    item.el.style.strokeDashoffset = len;
  }
  vines.forEach(prime);
  dendrites.forEach(prime);

  /* ── Contrast tuning: strong gold on dark hero → quiet on cream body ───────── */
  // Mobile rides higher and fades less on the cream body so the brain stays
  // vivid the whole scroll rather than washing out to a faint sketch.
  // Stay bold throughout. On the cream body we only ease down a little (floor
  // ~0.82) so the ink-toned art is clearly visible, never ghostly.
  function fieldOpacityForProgress(p) {
    return IS_MOBILE ? Math.min(1, (1.0 - Math.min(1, p / 0.18) * 0.12) * INTENSITY)
                     : (1.0 - Math.min(1, p / 0.18) * 0.18);
  }

  function showAllDrawn() {
    vines.forEach(function (v) { v.el.style.strokeDashoffset = 0; });
    dendrites.forEach(function (d) { d.el.style.strokeDashoffset = 0; });
  }

  /* ── Static assembled state (reduced-motion / no-GSAP fallback) ───────────── */
  function renderAssembled() {
    showAllDrawn();
    brainG.setAttribute('opacity', '1');
    bloom.setAttribute('opacity', '0.30');
    pulses.forEach(function (p) { p.el.setAttribute('opacity', '0'); });
    field.style.opacity = fieldOpacityForProgress(1);
  }

  if (prefersReduced || !hasGSAP) {
    renderAssembled();
    window.__bgbrain = { rendered: 'static', reason: prefersReduced ? 'reduced-motion' : 'no-gsap', tier: TIER };
    return;
  }

  /* ── Scrubbed GSAP timeline ───────────────────────────────────────────────── */
  var gsap = window.gsap;

  function placePulse(p, t) {
    var v = p.vine;
    if (!v.el.getPointAtLength) return;
    var pt = v.el.getPointAtLength(Math.max(0, Math.min(1, t)) * v.len);
    p.el.setAttribute('cx', pt.x); p.el.setAttribute('cy', pt.y);
  }

  // We build a PAUSED GSAP timeline (GSAP only interpolates; it does NOT read
  // scroll) and drive its progress ourselves from window.pageYOffset in a single
  // rAF loop — the same dead-simple, reliable mechanism the orrery uses. This
  // sidesteps ScrollTrigger's trigger-measurement and scroll-listener quirks
  // (which can pin the timeline at progress 0 when document.body height reads
  // collapsed). We keep a gentle eased follow for the premium "scrub" lag, and
  // pause the loop when #bgfield is offscreen / the tab is hidden.
  var tl = gsap.timeline({ paused: true });

  // whole-field opacity tracks scroll (driven via our progress, below)

  // 0%→62% growth: main vines draw in
  vines.forEach(function (v) {
    tl.to(v.el, { strokeDashoffset: 0, duration: 0.62, ease: 'power1.inOut' }, 0);
  });
  // 18%→~70% branch: dendrites fork off, staggered by spawn point
  dendrites.forEach(function (d, i) {
    tl.to(d.el, { strokeDashoffset: 0, duration: 0.40, ease: 'power1.out' }, 0.18 + (i % 5) * 0.06);
  });

  // 64%→100% assembly: brain blooms in
  tl.to(brainG, { attr: { opacity: 1 }, duration: 0.22, ease: 'power2.out' }, 0.64);
  // bloom swell peaks bright at convergence then settles to a strong steady glow
  tl.to(bloom, { attr: { opacity: 0.62 }, duration: 0.12, ease: 'power2.out' }, 0.66)
    .to(bloom, { attr: { opacity: 0.30 }, duration: 0.18, ease: 'power1.inOut' }, 0.78);

  // staggered pulses fire down each vine into the brain
  pulses.forEach(function (p, i) {
    var st = { t: 0 };
    tl.fromTo(st, { t: 0 }, {
      t: 1, duration: 0.22, ease: 'power2.in',
      onStart: function () { p.el.setAttribute('opacity', '0.95'); },
      onUpdate: function () { placePulse(p, st.t); },
      onComplete: function () { p.el.setAttribute('opacity', '0'); }
    }, 0.64 + p.offset * 0.10 + (i % 3) * 0.02);
  });

  // final 10% lock
  tl.to(brainG, { duration: 0.10, ease: 'sine.inOut',
    onStart: function () { brainG.setAttribute('opacity', '1'); } }, 0.90);

  /* ── Unified scroll + flicker loop (paused when offscreen / tab hidden) ──────
   * Reads scroll → target progress, eases the paused timeline toward it (scrub
   * lag), sets field opacity, fires pulses in their window, and runs the
   * synaptic flicker once assembled. Single rAF; no per-frame allocation. */
  function scrollProgress() {
    var max = (document.documentElement.scrollHeight || 0) - window.innerHeight;
    return max > 0 ? Math.max(0, Math.min(1, window.pageYOffset / max)) : 0;
  }
  var cur = scrollProgress();          // eased progress (what the timeline shows)
  var running = false, rafId = 0, t0 = performance.now();
  function frame(now) {
    if (!running) { rafId = 0; return; }
    var target = scrollProgress();
    // exponential ease toward target — gives the premium "scrub 1.5" lag feel
    cur += (target - cur) * 0.12;
    if (Math.abs(target - cur) < 0.0005) cur = target;
    tl.progress(cur);
    field.style.opacity = fieldOpacityForProgress(cur);

    // data pulses fire down the vines in the 0.64→0.92 window
    var time = (now - t0) / 1000;
    for (var pi = 0; pi < pulses.length; pi++) {
      var pe = pulses[pi];
      if (cur > 0.64 && cur < 0.92) { placePulse(pe, (cur - 0.64) / 0.24); pe.el.setAttribute('opacity', '0.95'); }
      else pe.el.setAttribute('opacity', '0');
    }
    // synaptic flicker once the brain is assembled
    var assembled = cur > 0.66;
    for (var i = 0; i < flickerNodes.length; i++) {
      var tw = assembled ? (0.72 + 0.28 * Math.sin(time * 1.6 + i * 1.7)) : 0;
      flickerNodes[i].setAttribute('opacity', tw.toFixed(3));
    }
    rafId = requestAnimationFrame(frame);
  }
  var frozen = false;
  function start() { if (frozen) return; if (!running) { running = true; rafId = requestAnimationFrame(frame); } }
  function stop() { running = false; if (rafId) cancelAnimationFrame(rafId); rafId = 0; }

  // paint once synchronously, then run. #bgfield is a full-viewport fixed layer,
  // so it's on screen whenever the tab is. We therefore START the loop by default
  // and only PAUSE it when the tab is hidden (visibilitychange) — gating purely
  // on IntersectionObserver is fragile (it can report a 0-size/non-intersecting
  // box in some contexts and wedge the loop off). This guarantees the scroll
  // animation runs for a real, visible user while still saving battery when the
  // tab is backgrounded.
  tl.progress(cur); field.style.opacity = fieldOpacityForProgress(cur);
  if (!document.hidden) start();
  document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else start(); });

  /* ── Expose for prototype panel / static captures ─────────────────────────── */
  window.__bgbrain = {
    timeline: tl, tier: TIER,
    counts: { dendrites: dendrites.length, pulses: pulses.length, brainNodes: brainNodes.length },
    // freeze() latches the loop off so a renderAt() frame holds (static captures)
    freeze: function () { frozen = true; stop(); },
    renderAt: function (p) {
      p = Math.max(0, Math.min(1, p));
      cur = p;                       // also set eased state so the loop holds it
      tl.progress(p);
      field.style.opacity = fieldOpacityForProgress(p);
      // show the assembled flicker nodes at full when frozen past assembly, so a
      // captured end-state isn't caught mid-flicker at near-zero opacity.
      if (p > 0.66) { for (var fi = 0; fi < flickerNodes.length; fi++) flickerNodes[fi].setAttribute('opacity', '1'); }
      pulses.forEach(function (pe) {
        if (p > 0.64 && p < 0.92) { placePulse(pe, (p - 0.64) / 0.24); pe.el.setAttribute('opacity', '0.95'); }
        else pe.el.setAttribute('opacity', '0');
      });
      return p;
    },
    vines: vines, dendrites: dendrites
  };
})();
