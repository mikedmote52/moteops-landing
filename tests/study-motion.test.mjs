import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const root = new URL('../demo/', import.meta.url);
const studies = {
  'vessel-zero': { formId: '#mission-form', output: '[data-depth]', canvas: true },
  'solaire-01': { formId: '#schedule-form', output: '[data-minutes]', canvas: false },
};

function createHarness(study, { observer = true, legacyMediaQuery = false } = {}) {
  const source = readFileSync(new URL(`${study}/site.js`, root), 'utf8');
  const config = studies[study];
  const listeners = new Map();
  const windowListeners = new Map();
  const frames = new Map();
  let nextFrame = 1;
  const rootElement = { dataset: {}, style: { setProperty() {} } };
  const label = { textContent: 'Motion on' };
  const toggleListeners = new Map();
  const toggle = {
    setAttribute() {},
    querySelector() { return label; },
    addEventListener(type, listener) { toggleListeners.set(type, listener); },
    click() { toggleListeners.get('click')?.(); },
  };
  const films = [{ top: 20, bottom: 220 }].map((rect) => ({
    rect,
    paused: true,
    playCount: 0,
    pauseCount: 0,
    play() { this.paused = false; this.playCount += 1; return Promise.resolve(); },
    pause() { this.paused = true; this.pauseCount += 1; },
    closest() { return { classList: { add() {}, remove() {} } }; },
    getBoundingClientRect() { return this.rect; },
    addEventListener() {},
  }));
  const form = {
    route: { value: 'shelf' }, depth: { value: '3000' }, priority: { value: 'optics' },
    program: { value: 'imaging' }, sessionMinutes: { value: '180' },
    addEventListener() {},
  };
  const status = { querySelector() { return { textContent: '', innerHTML: '' }; } };
  const canvas = {
    width: 0, height: 0, style: {},
    getContext() { return { clearRect() {}, setTransform() {}, beginPath() {}, arc() {}, fill() {}, fillStyle: '' }; },
  };
  const mediaListeners = [];
  const mediaQuery = {
    matches: false,
    addEventListener: legacyMediaQuery ? undefined : (type, listener) => { if (type === 'change') mediaListeners.push(listener); },
    addListener(listener) { mediaListeners.push(listener); },
    emit(matches) { this.matches = matches; mediaListeners.forEach((listener) => listener({ matches })); },
  };
  const document = {
    documentElement: rootElement,
    body: { scrollHeight: 2000 },
    querySelector(selector) {
      if (selector === '[data-motion-toggle]') return toggle;
      if (selector === '[aria-live]') return status;
      if (selector === config.formId) return form;
      if (selector === config.output) return { textContent: '' };
      if (selector === '#particle-field') return canvas;
      return null;
    },
    querySelectorAll(selector) { return selector === '[data-autoplay]' ? films : []; },
    addEventListener(type, listener) { listeners.set(type, listener); },
  };
  const globalWindow = {
    addEventListener(type, listener) {
      const entries = windowListeners.get(type) ?? [];
      entries.push(listener);
      windowListeners.set(type, entries);
    },
  };
  class FakeIntersectionObserver {
    constructor(callback) { this.callback = callback; }
    observe(target) { this.callback([{ target, isIntersecting: true }]); }
  }
  const context = {
    document,
    window: globalWindow,
    matchMedia: () => mediaQuery,
    innerHeight: 600,
    innerWidth: 1200,
    scrollY: 0,
    devicePixelRatio: 1,
    Math,
    addEventListener: globalWindow.addEventListener.bind(globalWindow),
    requestAnimationFrame(callback) { const id = nextFrame++; frames.set(id, callback); return id; },
    cancelAnimationFrame(id) { frames.delete(id); },
  };
  if (observer) context.IntersectionObserver = FakeIntersectionObserver;
  return {
    films,
    mediaQuery,
    scheduledFrames() { return frames.size; },
    run() { vm.runInNewContext(source, context, { filename: `${study}/site.js` }); },
    toggle,
    context,
    dispatchWindow(type) { (windowListeners.get(type) ?? []).forEach((listener) => listener()); },
  };
}

for (const study of Object.keys(studies)) {
  test(`${study} keeps useful static film fallback and 44px controls`, () => {
    const html = readFileSync(new URL(`${study}/index.html`, root), 'utf8');
    const css = readFileSync(new URL(`${study}/site.css`, root), 'utf8');
    assert.match(html, /poster="media\/[a-z]{2}-0[1-3]\.webp"/);
    assert.match(html, /data-motion-toggle/);
    assert.match(css, /\.motion-toggle[\s\S]*min-height\s*:\s*44px/i);
    assert.match(css, /\.form-actions button[\s\S]*min-height\s*:\s*44px/i);
  });

  test(`${study} falls back safely without IntersectionObserver and supports legacy media listeners`, async () => {
    const harness = createHarness(study, { observer: false, legacyMediaQuery: true });
    harness.run();
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(harness.films[0].paused, false);
    harness.mediaQuery.emit(true);
    assert.equal(harness.films[0].paused, true);
    harness.mediaQuery.emit(false);
    assert.equal(harness.films[0].paused, false);
  });

  test(`${study} ignores an old rejected play promise after a newer opt-in`, async () => {
    const harness = createHarness(study);
    let rejectFirst;
    let plays = 0;
    harness.films[0].play = function play() {
      this.paused = false;
      plays += 1;
      if (plays === 1) return new Promise((resolve, reject) => { rejectFirst = reject; });
      return Promise.resolve();
    };
    harness.run();
    harness.toggle.click();
    harness.toggle.click();
    rejectFirst(new Error('interrupted'));
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(harness.context.document.documentElement.dataset.motion, 'on');
    assert.equal(harness.films[0].paused, false);
  });
}

test('VESSEL ZERO stops canvas scheduling when Motion is explicitly off', () => {
  const harness = createHarness('vessel-zero');
  harness.run();
  assert.ok(harness.scheduledFrames() > 0);
  harness.toggle.click();
  assert.equal(harness.scheduledFrames(), 0);
});
