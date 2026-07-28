import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const shellJs = readFileSync(new URL('../cinematic-shell.js', import.meta.url), 'utf8');
const ownerStoryJs = readFileSync(new URL('../owner-story.js', import.meta.url), 'utf8');
const ownerStoryCss = readFileSync(new URL('../owner-story.css', import.meta.url), 'utf8');

function classList(initial = []) {
  const names = new Set(initial);
  return {
    add(...values) { values.forEach((value) => names.add(value)); },
    contains(value) { return names.has(value); },
    remove(...values) { values.forEach((value) => names.delete(value)); },
    toggle(value, force) {
      const enabled = force ?? !names.has(value);
      if (enabled) names.add(value);
      else names.delete(value);
      return enabled;
    },
  };
}

function createHarness({ observer = true } = {}) {
  const documentListeners = new Map();
  const windowListeners = new Map();
  const observers = [];
  const frames = [];
  const rootStyle = new Map();
  const chapters = ['PRESSURE', 'WORKING PROOF', 'EVIDENCE', 'STUDIO', 'METHOD', 'START']
    .map((chapter, index) => ({
      classList: classList(),
      dataset: { chapter },
      rect: { top: index === 0 ? -40 : 900 + (index * 500), bottom: index === 0 ? 760 : 1300 + (index * 500), height: 800 },
      getBoundingClientRect() { return this.rect; },
    }));
  const scenes = ['pressure', 'connect', 'control'].map((name, index) => ({
    classList: classList(index === 0 ? ['is-active'] : []),
    dataset: { ownerScene: name },
  }));
  const handoffListeners = new Map();
  const handoff = {
    addEventListener(type, listener) { handoffListeners.set(type, listener); },
    click() { handoffListeners.get('click')?.(); },
  };
  const heading = {
    attributes: {},
    focusCalls: 0,
    setAttribute(name, value) { this.attributes[name] = value; },
    focus() { this.focusCalls += 1; },
  };
  const ownerStory = {
    classList: classList(),
    dataset: { ownerStoryState: 'pressure' },
    querySelector(selector) { return selector === '[data-owner-story-handoff]' ? handoff : null; },
    querySelectorAll(selector) { return selector === '[data-owner-scene]' ? scenes : []; },
  };
  const document = {
    documentElement: {
      dataset: {},
      scrollHeight: 2400,
      style: {
        setProperty(name, value) { rootStyle.set(name, value); },
      },
    },
    addEventListener(type, listener) {
      const listeners = documentListeners.get(type) ?? [];
      listeners.push(listener);
      documentListeners.set(type, listeners);
    },
    dispatchEvent(event) { (documentListeners.get(event.type) ?? []).forEach((listener) => listener(event)); },
    querySelector(selector) {
      if (selector === '[data-owner-story]') return ownerStory;
      if (selector === '#care-hub-showcase #gallery-title') return heading;
      return null;
    },
    querySelectorAll(selector) { return selector === '[data-chapter]' ? chapters : []; },
  };
  const window = {
    innerHeight: 600,
    scrollY: 120,
    addEventListener(type, listener) {
      const listeners = windowListeners.get(type) ?? [];
      listeners.push(listener);
      windowListeners.set(type, listeners);
    },
    requestAnimationFrame(callback) { frames.push(callback); return frames.length; },
    setTimeout(callback) { callback(); return 1; },
  };
  const mediaQuery = { matches: false };
  class FakeIntersectionObserver {
    constructor(callback, options = {}) {
      this.callback = callback;
      this.disconnectCalls = 0;
      this.options = options;
      this.targets = [];
      observers.push(this);
    }

    disconnect() { this.disconnectCalls += 1; }
    observe(target) { this.targets.push(target); }
    emit(entries) { this.callback(entries); }
  }
  const context = {
    document,
    window,
    matchMedia: () => mediaQuery,
  };
  if (observer) {
    context.IntersectionObserver = FakeIntersectionObserver;
    window.IntersectionObserver = FakeIntersectionObserver;
  }

  return {
    chapters,
    context,
    document,
    handoff,
    heading,
    observers,
    ownerStory,
    rootStyle,
    scenes,
    dispatchMotion(enabled) { document.dispatchEvent({ type: 'mote:motionchange', detail: { enabled } }); },
    dispatchWindow(type) { (windowListeners.get(type) ?? []).forEach((listener) => listener()); },
    flushFrames() { frames.splice(0).forEach((callback) => callback()); },
    run() {
      vm.runInNewContext(shellJs, context, { filename: 'cinematic-shell.js' });
      vm.runInNewContext(ownerStoryJs, context, { filename: 'owner-story.js' });
    },
  };
}

test('keeps the approved chapters and static no-scroll-hijack guard', () => {
  for (const chapter of ['PRESSURE', 'START HERE', 'WHAT IT FIXES', 'WORKING PROOF', 'EVIDENCE', 'METHOD', 'START']) {
    assert.match(html, new RegExp(`data-chapter=["']${chapter}["']`, 'i'));
  }
  assert.doesNotMatch(shellJs, /preventDefault\(\).*scroll|wheel|touchmove/s);
  assert.match(shellJs, /pageMotionPreference/);
  assert.match(ownerStoryJs, /ownerMotionPreference/);
  assert.doesNotMatch(shellJs, /\b(?:const|let)\s+motionPreference\b/);
  assert.doesNotMatch(ownerStoryJs, /\b(?:const|let)\s+motionPreference\b/);
});

test('runs shell progress and owner observation without duplicate reconnects', () => {
  const harness = createHarness();
  harness.run();

  assert.equal(harness.rootStyle.get('--page-progress'), '0.0667');
  assert.match(harness.rootStyle.get('--section-progress'), /^0\./);
  assert.equal(harness.observers.length, 2);

  harness.context.window.scrollY = 600;
  harness.dispatchWindow('scroll');
  harness.flushFrames();
  assert.equal(harness.rootStyle.get('--page-progress'), '0.3333');

  const ownerObserver = harness.observers.find((item) => item.targets.includes(harness.scenes[0]));
  ownerObserver.emit([
    { target: harness.scenes[0], intersectionRatio: 0 },
    { target: harness.scenes[1], intersectionRatio: .6 },
    { target: harness.scenes[2], intersectionRatio: .85 },
  ]);
  assert.equal(harness.ownerStory.dataset.ownerStoryState, 'control');

  harness.dispatchMotion(false);
  assert.equal(harness.rootStyle.get('--page-progress'), '0');
  assert.equal(harness.rootStyle.get('--section-progress'), '0');
  assert.equal(ownerObserver.disconnectCalls, 1);

  harness.dispatchMotion(true);
  harness.dispatchMotion(true);
  assert.equal(harness.observers.length, 3);
  assert.equal(harness.observers.filter((item) => item.targets.includes(harness.scenes[0])).length, 2);
});

test('uses a truthful visible fallback when IntersectionObserver is unavailable', () => {
  const harness = createHarness({ observer: false });
  harness.run();

  assert.ok(harness.chapters.every((chapter) => chapter.classList.contains('is-chapter-visible')));
  assert.ok(harness.ownerStory.classList.contains('is-owner-story-static'));
  assert.ok(harness.scenes.every((scene) => scene.classList.contains('is-active')));
  assert.match(ownerStoryCss, /\.owner-story\.is-owner-story-static\s+\.owner-scene/);
});

test('keeps the Care Hub focus handoff in the motion-aware owner controller', () => {
  const harness = createHarness();
  harness.run();
  harness.handoff.click();

  assert.equal(harness.heading.attributes.tabindex, '-1');
  assert.equal(harness.heading.focusCalls, 1);
});
