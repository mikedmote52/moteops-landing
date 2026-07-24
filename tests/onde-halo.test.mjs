import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const root = new URL('../demo/onde-halo/', import.meta.url);
const read = (name) => readFileSync(new URL(name, root), 'utf8');
async function importCoordinatorClasses() {
  const source = read('site.js');
  const match = source.match(
    /\/\* TESTABLE COORDINATORS START \*\/([\s\S]*?)\/\* TESTABLE COORDINATORS END \*\//,
  );
  assert.ok(match, 'site.js exposes its lifecycle coordinators as a testable source block');
  return import(`data:text/javascript;charset=utf-8,${encodeURIComponent(match[1])}`);
}

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, reject, resolve };
}

function createAudioHarness() {
  const contexts = [];

  class AudioNode {
    constructor() {
      this.gain = {
        value: 0,
        cancelScheduledValues() {},
        linearRampToValueAtTime() {},
        setValueAtTime(_value) { this.value = _value; },
      };
      this.frequency = { setValueAtTime() {}, value: 0 };
      this.Q = { value: 0 };
      this.detune = { value: 0 };
      this.started = 0;
      this.stopped = 0;
    }

    connect() { return this; }
    disconnect() {}
    start() { this.started += 1; }
    stop() { this.stopped += 1; }
  }

  function createContext() {
    const resumeGate = deferred();
    const context = {
      analyser: null,
      closed: false,
      currentTime: 0,
      destination: new AudioNode(),
      nodes: [],
      resumeGate,
      createAnalyser() {
        this.analyser = new AudioNode();
        this.analyser.frequencyBinCount = 4;
        this.analyser.getByteFrequencyData = (data) => data.fill(32);
        this.nodes.push(this.analyser);
        return this.analyser;
      },
      createBiquadFilter() {
        const node = new AudioNode();
        this.nodes.push(node);
        return node;
      },
      createGain() {
        const node = new AudioNode();
        this.nodes.push(node);
        return node;
      },
      createOscillator() {
        const node = new AudioNode();
        this.nodes.push(node);
        return node;
      },
      close() {
        this.closed = true;
        return Promise.resolve();
      },
      resume() { return resumeGate.promise; },
    };
    contexts.push(context);
    return context;
  }

  return { contexts, createContext };
}

test('ships a complete cinematic product story with honest concept framing', () => {
  const html = read('index.html');
  const ids = [...html.matchAll(/<section[^>]+id="([^"]+)"/g)].map((match) => match[1]);

  assert.deepEqual(ids, ['hero', 'thesis', 'anatomy', 'field', 'materials', 'finale']);
  assert.match(html, /fictional product concept/i);
  assert.match(html, /A Mote Ops design demonstration/i);
  assert.match(html, /No preorder\. No checkout\./i);
  assert.match(html, /<button[^>]+data-sound-toggle[^>]+aria-pressed="false"/i);
  assert.match(html, /<canvas[^>]+id="sound-field"[^>]+aria-hidden="true"/i);
  assert.match(html, /site\.css/);
  assert.match(html, /site\.js/);
});

test('defines local responsive product geometry and reduced-motion behavior', () => {
  const html = read('index.html');
  const css = read('site.css');

  for (const part of ['halo-shell', 'driver-array', 'magnet-core', 'copper-plinth']) {
    assert.match(html, new RegExp(`class="[^"]*${part}`));
  }

  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/i);
  assert.match(css, /@media\s*\(max-width:\s*760px\)/i);
  assert.match(css, /:focus-visible/);
  assert.doesNotMatch(css, /url\(["']?https?:\/\//i);
});

test('implements sound, scroll staging, canvas energy, and safe fallbacks', () => {
  const js = read('site.js');

  assert.match(js, /class HaloSound/);
  assert.match(js, /AudioContext|webkitAudioContext/);
  assert.match(js, /createAnalyser/);
  assert.match(js, /if\s*\(this\.stopTimer\)\s*this\.destroy\(\)/);
  assert.match(js, /aria-pressed/);
  assert.match(js, /Sound unavailable/);
  assert.match(js, /prefers-reduced-motion/);
  assert.match(js, /visibilitychange/);
  assert.match(js, /requestAnimationFrame/);
  assert.match(js, /data-stage/);
  assert.doesNotMatch(js, /fetch\s*\(|XMLHttpRequest|sendBeacon/);
});

test('uses local Seedance atmosphere and real-time 3D with honest disclosure', () => {
  const html = read('index.html');

  assert.match(html, /assets\/hyperbelt-poster\.webp/);
  assert.match(html, /assets\/hyperbelt-seedance\.mp4/);
  assert.match(html, /Seedance-generated atmosphere/i);
  assert.match(html, /real-time browser 3D/i);
  assert.match(html, /data-halo-canvas/);
  assert.match(html, /data-product-mode="assembled"/);
  assert.match(html, /data-product-mode="shell"/);
  assert.match(html, /data-product-mode="core"/);
  assert.match(html, /data-product-explode/);
});

test('keeps 3D local, bounded, pausable, and replaceable by a fallback', () => {
  const html = read('index.html');
  const siteJs = read('site.js');
  const sceneJs = read('halo-scene.js');
  const source = [html, read('site.css'), siteJs, sceneJs].join('\n');
  const remoteDependency = /(?:<script\b[^>]*\bsrc\s*=\s*["']https?:|<(?:video|source)\b[^>]*\bsrc\s*=\s*["']https?:|url\(\s*["']?https?:|(?:import\s+[^;]*?\s+from\s+|import\s*\(\s*)["']https?:|from\s+["']https?:)/i;

  assert.match(html, /<script\s+type=["']module["']\s+src=["']site\.js(?:\?[^"']+)?["']><\/script>/i);
  assert.match(siteJs, /import\s*\{\s*HaloScene\s*\}\s*from\s*["']\.\/halo-scene\.js(?:\?[^"']+)?["']/);
  assert.match(sceneJs, /from\s+["']\.\/vendor\/three\.module\.js["']/);
  assert.match(sceneJs, /class HaloScene/);
  assert.match(sceneJs, /setMode\(/);
  assert.match(sceneJs, /setExploded\(/);
  assert.match(sceneJs, /setEnergy\(/);
  assert.match(sceneJs, /document\.hidden/);
  assert.match(sceneJs, /onUnavailable/);
  assert.match(sceneJs, /try\s*\{[\s\S]*?catch\s*\([^)]*\)\s*\{[\s\S]*?onUnavailable/);
  assert.match(html, /data-webgl-fallback/);
  assert.doesNotMatch(source, remoteDependency);
});

test('guards public 3D APIs after unavailable initialization and disposal', async () => {
  const sceneJs = read('halo-scene.js');

  for (const method of ['setMode', 'setExploded', 'setEnergy', 'setStage']) {
    assert.match(sceneJs, new RegExp(`${method}\\([^)]*\\)\\s*\\{\\s*if \\(this\\.unavailable \\|\\| this\\.disposed\\) return;`));
  }
  assert.match(sceneJs, /resize\(\)\s*\{\s*if \(this\.unavailable \|\| this\.disposed(?: \|\| [^)]*)?\) return;/);
  assert.match(sceneJs, /dispose\(\)\s*\{\s*if \(this\.disposed\) return;/);
  assert.match(sceneJs, /markUnavailable\([^)]*\)\s*\{[\s\S]*?this\.dispose\(\)/);

  const previous = {
    window: globalThis.window,
    document: globalThis.document,
    cancelAnimationFrame: globalThis.cancelAnimationFrame,
  };
  globalThis.window = { removeEventListener() {} };
  globalThis.document = { hidden: false, removeEventListener() {} };
  globalThis.cancelAnimationFrame = () => {};

  try {
    const { HaloScene } = await import(new URL('../demo/onde-halo/halo-scene.js', import.meta.url));
    const scene = new HaloScene(null);

    assert.equal(scene.unavailable, true);
    assert.equal(scene.disposed, true);
    assert.doesNotThrow(() => {
      scene.setMode('core');
      scene.setExploded(true);
      scene.setEnergy(1);
      scene.setStage(1);
      scene.resize();
      scene.dispose();
      scene.dispose();
    });
  } finally {
    globalThis.window = previous.window;
    globalThis.document = previous.document;
    globalThis.cancelAnimationFrame = previous.cancelAnimationFrame;
  }
});

test('provides reduced-motion and media-failure behavior', () => {
  const html = read('index.html');
  const css = read('site.css');
  const js = read('site.js');

  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(js, /querySelector\(['"][^'"]*data-hyperbelt-video/);
  assert.match(js, /querySelector\(['"]\[data-hyperbelt-video\]\s+source['"]\)/);
  assert.match(js, /querySelector\(['"][^'"]*data-video-fallback/);
  assert.match(js, /(?:querySelector\(['"][^'"]*data-hyperbelt-video[\s\S]*?addEventListener\(['"]error['"]|addEventListener\(['"]error['"][\s\S]*?data-hyperbelt-video)/);
  assert.match(js, /hyperbeltSource\?\.addEventListener\(['"]error['"],\s*markVideoFailed\)/);
  assert.match(js, /(?:data-video-fallback[\s\S]*?(?:hidden\s*=\s*false|removeAttribute\(['"]hidden['"]\)|classList\.(?:add|toggle)\()|(?:hidden\s*=\s*false|removeAttribute\(['"]hidden['"]\)|classList\.(?:add|toggle)\()[\s\S]*?data-video-fallback)/);
  assert.match(js, /onUnavailable\s*:\s*(?:\([^)]*\)\s*=>|function\s*\([^)]*\)\s*\{)/);
  assert.match(js, /onUnavailable[\s\S]{0,500}classList\.(?:add|toggle)\(['"]webgl-unavailable['"]\)/);
  assert.match(html, /data-video-fallback[^>]*(?:hidden|aria-hidden)/i);
  assert.match(css, /\.webgl-unavailable\s+[^{}]*\[data-webgl-fallback\][^{}]*\{[^}]*?(?:display\s*:\s*(?!none)|opacity\s*:\s*1|visibility\s*:\s*visible)/i);
  assert.match(html, /data-webgl-fallback/);
});

test('contains the experience within the viewport and keeps controls touch safe', () => {
  const css = read('site.css');

  assert.match(css, /html\s*\{[^}]*overflow-x:\s*clip/i);
  assert.match(css, /\[data-halo-canvas\]\s*\{[^}]*touch-action:\s*pan-y/i);
  assert.match(css, /@media\s*\(max-width:\s*760px\)[\s\S]*?\.text-scrim::before\s*\{[^}]*inset:\s*-30px\s+-20px/i);
  assert.match(css, /@media\s*\(max-width:\s*760px\)[\s\S]*?\.halo-viewport\s*\{[^}]*top:\s*36vh;[^}]*height:\s*48vh;[^}]*min-height:\s*0/i);
  assert.match(css, /\.sound-control\s*\{[^}]*min-height:\s*44px/i);
  assert.match(css, /\.mode-controls button\s*\{[^}]*min-height:\s*(?:4[4-9]|[5-9]\d)px/i);
});

test('reserves mobile content space above the fixed inspection console', () => {
  const css = read('site.css');
  const mobile = css
    .split(/@media\s*\(max-width:\s*760px\)\s*\{/i)[1]
    ?.split(/@media\s*\(max-width:\s*430px\)/i)[0] || '';

  assert.match(mobile, /--mobile-console-safe:\s*(?:25[0-9]|2[6-9][0-9])px/i);
  assert.match(mobile, /section\s*\{[^}]*padding:[^;}]*var\(--mobile-console-safe\)/i);
  assert.match(mobile, /\.part-ledger\s*\{[^}]*bottom:\s*var\(--mobile-console-safe\)/i);
  assert.match(mobile, /\.field-readout\s*\{[^}]*bottom:\s*var\(--mobile-(?:field-)?console-safe\)/i);
  assert.doesNotMatch(mobile, /(?:\.part-ledger|\.field-readout)\s*\{[^}]*bottom:\s*14vh/i);
});

test('keeps the complete mobile field readout above the fixed console', () => {
  const css = read('site.css');
  const mobile = css
    .split(/@media\s*\(max-width:\s*760px\)\s*\{/i)[1]
    ?.split(/@media\s*\(max-width:\s*430px\)/i)[0] || '';

  assert.match(mobile, /--mobile-field-console-safe:\s*(?:3[4-9][0-9]|[4-9][0-9]{2,})px/i);
  assert.match(mobile, /#field\s*\{[^}]*padding-bottom:\s*var\(--mobile-field-console-safe\)/i);
  assert.match(mobile, /\.field-copy\s*>\s*p\s*\{[^}]*margin:\s*24px\s+0\s+18px/i);
  assert.match(mobile, /\.inline-sound\s*\{[^}]*min-height:\s*50px/i);
  assert.match(mobile, /\.field-readout\s*\{[^}]*bottom:\s*var\(--mobile-field-console-safe\)/i);
});

test('makes the interactive 3D canvas keyboard operable with bounded controls', async () => {
  const html = read('index.html');
  const css = read('site.css');
  const sceneJs = read('halo-scene.js');

  assert.match(html, /<canvas[^>]+data-halo-canvas[^>]+tabindex="0"[^>]+aria-describedby="halo-model-instructions"/i);
  assert.match(html, /id="halo-model-instructions"[^>]*>[^<]*(?:arrow keys)[^<]*(?:plus|minus)[^<]*</i);
  assert.match(css, /\[data-halo-canvas\]:focus-visible\s*\{[^}]*outline:/i);
  assert.match(sceneJs, /addEventListener\(['"]keydown['"],\s*this\.handleKeyDown\)/);
  assert.match(sceneJs, /removeEventListener\(['"]keydown['"],\s*this\.handleKeyDown\)/);

  const { HaloScene } = await import(new URL('../demo/onde-halo/halo-scene.js', import.meta.url));
  const events = [];
  const scene = {
    cameraDistance: 7.2,
    disposed: false,
    pointer: { x: 0, y: 0 },
    render() {},
    updateCamera() {},
  };
  const press = (key) => HaloScene.prototype.handleKeyDown.call(scene, {
    key,
    preventDefault() { events.push(key); },
  });

  for (let index = 0; index < 30; index += 1) press('ArrowRight');
  assert.equal(scene.pointer.x, 0.85);
  for (let index = 0; index < 30; index += 1) press('ArrowUp');
  assert.equal(scene.pointer.y, -0.28);
  for (let index = 0; index < 30; index += 1) press('+');
  assert.equal(scene.cameraDistance, 5.2);
  for (let index = 0; index < 30; index += 1) press('PageDown');
  assert.equal(scene.cameraDistance, 8.5);
  assert.ok(events.includes('ArrowRight'));
  assert.ok(events.includes('+'));

  const before = { distance: scene.cameraDistance, x: scene.pointer.x, y: scene.pointer.y };
  press('Tab');
  assert.deepEqual(
    { distance: scene.cameraDistance, x: scene.pointer.x, y: scene.pointer.y },
    before,
  );
  assert.ok(!events.includes('Tab'));
});

test('lights the graphite and copper product with a warm high-contrast rig', () => {
  const sceneJs = read('halo-scene.js');

  assert.match(sceneJs, /toneMappingExposure\s*=\s*1\.(?:2[5-9]|[3-9]\d*)/);
  assert.match(sceneJs, /shellMaterial[\s\S]*?color:\s*0x3[0-9a-f]{5}/i);
  assert.match(sceneJs, /driverMaterial[\s\S]*?color:\s*0x4[0-9a-f]{5}/i);
  assert.match(sceneJs, /plinthMaterial[\s\S]*?color:\s*0x6[0-9a-f]{5}/i);
  assert.match(sceneJs, /new THREE\.HemisphereLight\(0xf[0-9a-f]{5},\s*0x1[0-9a-f]{5},\s*1\.[2-9]/i);
  assert.match(sceneJs, /new THREE\.DirectionalLight\(0xffe[0-9a-f]{3},\s*3\.[0-9]/i);
  assert.doesNotMatch(sceneJs, /0x6b8ca4/i);
});

test('gives enabled sound an immediate visible energy floor while preserving analyser response', async () => {
  const { normalizeFieldEnergy } = await importCoordinatorClasses();

  assert.equal(normalizeFieldEnergy(false, 255), 0.08);
  assert.equal(normalizeFieldEnergy(true, 0), 0.32);
  assert.equal(normalizeFieldEnergy(true, 127.5), 0.66);
  assert.equal(normalizeFieldEnergy(true, 999), 1);
});

test('serializes concurrent sound activation and cancels a pending graph before restart', async () => {
  const { HaloSound } = await importCoordinatorClasses();
  const harness = createAudioHarness();
  const sound = new HaloSound({
    clearTimer: () => {},
    createContext: harness.createContext,
    setTimer: () => 1,
  });

  const first = sound.start();
  const concurrent = sound.start();
  assert.strictEqual(first, concurrent);
  assert.equal(harness.contexts.length, 1);

  harness.contexts[0].resumeGate.resolve();
  assert.equal(await first, true);
  assert.equal(sound.running, true);
  assert.equal(harness.contexts.filter((context) => !context.closed).length, 1);

  sound.destroy();
  const pending = sound.start();
  sound.stop();
  const restarted = sound.start();
  assert.equal(harness.contexts.length, 3);
  assert.equal(harness.contexts[1].closed, true);

  harness.contexts[1].resumeGate.resolve();
  harness.contexts[2].resumeGate.resolve();
  assert.equal(await pending, false);
  assert.equal(await restarted, true);
  assert.equal(harness.contexts.filter((context) => !context.closed).length, 1);
  assert.equal(harness.contexts[2].nodes.filter((node) => node.started > 0).length, 4);
});

test('keeps stale sound completions from overwriting the latest requested UI state', async () => {
  const { SoundToggleCoordinator } = await importCoordinatorClasses();
  const starts = [deferred(), deferred()];
  const states = [];
  let startIndex = 0;
  let stops = 0;
  const coordinator = new SoundToggleCoordinator({
    onState: (enabled, unavailable) => states.push({ enabled, unavailable }),
    sound: {
      start: () => starts[startIndex++].promise,
      stop: () => { stops += 1; },
    },
  });

  const staleStart = coordinator.toggle();
  await coordinator.toggle();
  const latestStart = coordinator.toggle();

  starts[1].resolve(true);
  assert.equal(await latestStart, true);
  assert.deepEqual(states, [
    { enabled: false, unavailable: false },
    { enabled: true, unavailable: false },
  ]);

  starts[0].resolve(false);
  assert.equal(await staleStart, false);
  assert.deepEqual(states, [
    { enabled: false, unavailable: false },
    { enabled: true, unavailable: false },
  ]);
  assert.equal(coordinator.enabled, true);
  assert.equal(coordinator.requested, true);
  assert.equal(stops, 1);
});

test('restores BFCache resources once per persisted lifecycle without duplicating work', async () => {
  const { BfcacheLifecycle } = await importCoordinatorClasses();
  const calls = { dispose: 0, restore: 0, suspend: 0 };
  const lifecycle = new BfcacheLifecycle({
    dispose: () => { calls.dispose += 1; },
    restore: () => { calls.restore += 1; },
    suspend: () => { calls.suspend += 1; },
  });

  lifecycle.handlePageHide({ persisted: true });
  lifecycle.handlePageHide({ persisted: true });
  assert.deepEqual(calls, { dispose: 0, restore: 0, suspend: 1 });

  lifecycle.handlePageShow({ persisted: true });
  lifecycle.handlePageShow({ persisted: true });
  assert.deepEqual(calls, { dispose: 0, restore: 1, suspend: 1 });

  lifecycle.handlePageHide({ persisted: true });
  lifecycle.handlePageShow({ persisted: true });
  assert.deepEqual(calls, { dispose: 0, restore: 2, suspend: 2 });

  lifecycle.handlePageHide({ persisted: false });
  lifecycle.handlePageShow({ persisted: true });
  assert.deepEqual(calls, { dispose: 1, restore: 2, suspend: 2 });
});

test('invalidates pending video playback without turning intentional interruption into failure', async () => {
  const { HyperbeltPlayback } = await importCoordinatorClasses();
  const playGates = [];
  const video = {
    defaultMuted: false,
    loadCalls: 0,
    loop: false,
    muted: false,
    networkState: 0,
    pauseCalls: 0,
    paused: true,
    playsInline: false,
    load() { this.loadCalls += 1; },
    pause() { this.pauseCalls += 1; this.paused = true; },
    play() {
      const gate = deferred();
      playGates.push(gate);
      return gate.promise.then(() => { this.paused = false; });
    },
  };
  let eligible = true;
  let failures = 0;
  let playing = 0;
  const playback = new HyperbeltPlayback(video, {
    isEligible: () => eligible,
    networkEmpty: 0,
    onFailed: () => { failures += 1; },
    onPlaying: () => { playing += 1; },
  });

  const pendingResolve = playback.sync();
  eligible = false;
  playback.invalidate();
  playGates[0].resolve();
  assert.equal(await pendingResolve, false);
  assert.equal(video.paused, true);
  assert.equal(failures, 0);
  assert.equal(playing, 0);

  eligible = true;
  const pendingReject = playback.sync();
  eligible = false;
  playback.invalidate();
  const interruption = new Error('Playback interrupted by pause.');
  interruption.name = 'AbortError';
  playGates[1].reject(interruption);
  assert.equal(await pendingReject, false);
  assert.equal(playback.failed, false);
  assert.equal(failures, 0);

  eligible = true;
  const realFailure = playback.sync();
  const denied = new Error('Autoplay denied.');
  denied.name = 'NotAllowedError';
  playGates[2].reject(denied);
  assert.equal(await realFailure, false);
  assert.equal(playback.failed, true);
  assert.equal(failures, 1);
});
