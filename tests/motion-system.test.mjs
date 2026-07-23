import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const js = readFileSync(new URL('../motion-system.js', import.meta.url), 'utf8');

function createHarness({ legacyMediaQuery = false, observer = true, rects = [{ top: 720, bottom: 920 }] } = {}) {
  const documentListeners = new Map();
  const windowListeners = new Map();
  const observers = [];
  const mediaListeners = [];
  const motionToggleListeners = new Map();
  const label = { textContent: 'Motion on' };
  const motionToggle = {
    attributes: { 'aria-pressed': 'true' },
    setAttribute(name, value) { this.attributes[name] = value; },
    getAttribute(name) { return this.attributes[name]; },
    querySelector(selector) { return selector === '[data-motion-label]' ? label : null; },
    addEventListener(type, listener) { motionToggleListeners.set(type, listener); },
    click() { motionToggleListeners.get('click')?.(); },
  };
  const films = rects.map((rect, index) => {
    const source = { dataset: { src: `film-${index}.mp4` }, src: '' };
    const scene = { classList: { add() {} } };
    return {
      currentTime: 0,
      paused: true,
      pauseCalls: 0,
      loadCalls: 0,
      rect: { ...rect },
      querySelector(selector) { return selector === 'source[data-src]' ? source : null; },
      closest() { return scene; },
      getBoundingClientRect() { return this.rect; },
      load() { this.loadCalls += 1; },
      pause() { this.paused = true; this.pauseCalls += 1; },
      play() { this.paused = false; this.currentTime += 1; return Promise.resolve(); },
      source,
    };
  });
  const mediaQuery = {
    matches: false,
    addEventListener: legacyMediaQuery ? undefined : (type, listener) => { if (type === 'change') mediaListeners.push(listener); },
    addListener: (listener) => { mediaListeners.push(listener); },
    emit(matches) {
      this.matches = matches;
      mediaListeners.forEach((listener) => listener({ matches }));
    },
  };
  const document = {
    documentElement: { dataset: {} },
    querySelector(selector) { return selector === '[data-motion-toggle]' ? motionToggle : null; },
    querySelectorAll(selector) { return selector === '[data-studio-film]' ? films : []; },
    addEventListener(type, listener) { documentListeners.set(type, listener); },
    dispatchEvent(event) { documentListeners.get(event.type)?.(event); },
  };
  const window = {
    addEventListener(type, listener) {
      const listeners = windowListeners.get(type) ?? [];
      listeners.push(listener);
      windowListeners.set(type, listeners);
    },
  };
  class FakeIntersectionObserver {
    constructor(callback, options = {}) {
      this.callback = callback;
      this.options = options;
      this.targets = [];
      this.visibility = new Map();
      observers.push(this);
    }

    observe(target) { this.targets.push(target); }
  }
  function isVisible(rect, rootMargin) {
    const expanded = String(rootMargin || '').includes('25%');
    const margin = expanded ? 150 : 0;
    return rect.bottom > -margin && rect.top < 600 + margin;
  }
  function deliverObserverChanges() {
    observers.forEach((item) => {
      item.targets.forEach((target) => {
        const visible = isVisible(target.rect, item.options.rootMargin);
        if (item.visibility.get(target) === visible) return;
        item.visibility.set(target, visible);
        item.callback([{ target, isIntersecting: visible, intersectionRatio: visible ? 1 : 0 }]);
      });
    });
  }
  function dispatchWindow(type) {
    (windowListeners.get(type) ?? []).forEach((listener) => listener());
  }
  function scrollFilm(film, top) {
    const height = film.rect.bottom - film.rect.top;
    film.rect = { top, bottom: top + height };
    deliverObserverChanges();
    dispatchWindow('scroll');
  }
  const context = {
    CustomEvent: class CustomEvent { constructor(type, init) { this.type = type; this.detail = init.detail; } },
    document,
    innerHeight: 600,
    matchMedia: () => mediaQuery,
    window,
    addEventListener: window.addEventListener.bind(window),
  };
  if (observer) context.IntersectionObserver = FakeIntersectionObserver;

  return {
    context,
    document,
    films,
    mediaQuery,
    motionToggle,
    run() { vm.runInNewContext(js, context, { filename: 'motion-system.js' }); },
    scrollFilm,
    dispatchWindow,
  };
}

const settle = () => new Promise((resolve) => setImmediate(resolve));

test('provides one accessible motion control and lazy cinematic playback', () => {
  assert.match(html, /data-motion-toggle/);
  assert.match(html, /aria-pressed="true"/);
  assert.match(html, /motion-system\.js\?v=/);
  assert.match(js, /function setMotionEnabled/);
  assert.match(js, /prefers-reduced-motion/);
  assert.match(js, /IntersectionObserver/);
  assert.match(js, /dataset\.src/);
  assert.match(js, /play\(\)\.catch/);
  assert.match(js, /window\.moteMotion/);
  assert.doesNotMatch(js, /fetch\s*\(|XMLHttpRequest|sendBeacon/);
});

test('ordinary scrolling assigns a Studio source and starts playback', async () => {
  const harness = createHarness();
  harness.run();

  harness.scrollFilm(harness.films[0], 650);
  harness.scrollFilm(harness.films[0], 550);
  await settle();

  assert.equal(harness.films[0].source.src, 'film-0.mp4');
  assert.ok(harness.films[0].currentTime > 0);
  assert.equal(harness.films[0].paused, false);
});

test('falls back to initial, scroll, and resize syncing without IntersectionObserver', async () => {
  const harness = createHarness({ observer: false, rects: [{ top: 40, bottom: 240 }, { top: 720, bottom: 920 }] });
  harness.run();
  await settle();

  assert.equal(harness.context.window.moteMotion.isEnabled(), true);
  assert.equal(harness.films[0].source.src, 'film-0.mp4');
  assert.equal(harness.films[1].source.src, '');

  harness.films[1].rect = { top: 50, bottom: 250 };
  harness.dispatchWindow('resize');
  await settle();

  assert.equal(harness.films[1].source.src, 'film-1.mp4');
  assert.ok(harness.films[1].currentTime > 0);
});

test('ignores a rejected stale play request after motion is enabled again', async () => {
  const harness = createHarness({ rects: [{ top: 40, bottom: 240 }] });
  let rejectFirstPlay;
  let plays = 0;
  harness.films[0].play = function play() {
    this.paused = false;
    plays += 1;
    if (plays === 1) return new Promise((resolve, reject) => { rejectFirstPlay = reject; });
    this.currentTime += 1;
    return Promise.resolve();
  };
  harness.run();

  harness.context.window.moteMotion.setMotionEnabled(true);
  harness.context.window.moteMotion.setMotionEnabled(false);
  harness.context.window.moteMotion.setMotionEnabled(true);
  rejectFirstPlay(new Error('interrupted by pause'));
  await settle();

  assert.equal(harness.context.window.moteMotion.isEnabled(), true);
  assert.equal(harness.document.documentElement.dataset.motion, 'on');
  assert.equal(harness.films[0].paused, false);
});

test('responds to reduced-motion changes through the legacy MediaQueryList listener', () => {
  const harness = createHarness({ legacyMediaQuery: true });
  harness.run();

  harness.mediaQuery.emit(true);
  assert.equal(harness.context.window.moteMotion.isEnabled(), false);
  assert.equal(harness.motionToggle.getAttribute('aria-pressed'), 'false');

  harness.mediaQuery.emit(false);
  assert.equal(harness.context.window.moteMotion.isEnabled(), true);
  assert.equal(harness.motionToggle.getAttribute('aria-pressed'), 'true');
});
