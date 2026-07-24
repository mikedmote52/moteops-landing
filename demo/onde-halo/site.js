import { HaloScene } from './halo-scene.js?v=20260723-task6c';

/* TESTABLE COORDINATORS START */
export function normalizeFieldEnergy(enabled, sample) {
  if (!enabled) return .08;
  const normalized = Math.min(1, Math.max(0, (Number(sample) || 0) / 255));
  return .32 + normalized * .68;
}

export class HaloSound {
  constructor({
    clearTimer = (timer) => window.clearTimeout(timer),
    createContext = () => {
      const AudioEngine = window.AudioContext || window.webkitAudioContext;
      return AudioEngine ? new AudioEngine() : null;
    },
    setTimer = (callback, delay) => window.setTimeout(callback, delay),
  } = {}) {
    this.clearTimer = clearTimer;
    this.createContext = createContext;
    this.setTimer = setTimer;
    this.context = null;
    this.analyser = null;
    this.master = null;
    this.nodes = [];
    this.data = null;
    this.running = false;
    this.pendingStart = null;
    this.generation = 0;
    this.stopTimer = 0;
  }

  start() {
    if (this.running) return true;
    if (this.pendingStart) return this.pendingStart;
    if (this.stopTimer) this.destroy();

    const context = this.createContext();
    if (!context) return Promise.resolve(false);
    const generation = ++this.generation;
    this.context = context;

    const pending = (async () => {
      try {
        await context.resume();
        if (generation !== this.generation || this.context !== context) return false;

        const now = context.currentTime;
        this.analyser = context.createAnalyser();
        this.analyser.fftSize = 128;
        this.analyser.smoothingTimeConstant = .86;
        this.data = new Uint8Array(this.analyser.frequencyBinCount);

        this.master = context.createGain();
        this.master.gain.setValueAtTime(0, now);
        this.master.gain.linearRampToValueAtTime(.12, now + 1.4);
        this.master.connect(this.analyser).connect(context.destination);

        const filter = context.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(880, now);
        filter.Q.value = .7;
        filter.connect(this.master);
        this.nodes.push(filter);

        [55, 82.5, 110].forEach((frequency, index) => {
          const oscillator = context.createOscillator();
          const gain = context.createGain();
          oscillator.type = index === 1 ? 'triangle' : 'sine';
          oscillator.frequency.value = frequency;
          oscillator.detune.value = index * 4 - 3;
          gain.gain.value = [.28, .09, .04][index];
          oscillator.connect(gain).connect(filter);
          oscillator.start();
          this.nodes.push(oscillator, gain);
        });

        const lfo = context.createOscillator();
        const lfoGain = context.createGain();
        lfo.frequency.value = .075;
        lfoGain.gain.value = 420;
        lfo.connect(lfoGain).connect(filter.frequency);
        lfo.start();
        this.nodes.push(lfo, lfoGain);
        this.running = true;
        return true;
      } catch {
        if (generation === this.generation) this.destroy();
        return false;
      } finally {
        if (this.pendingStart === pending) this.pendingStart = null;
      }
    })();

    this.pendingStart = pending;
    return pending;
  }

  stop() {
    if (this.pendingStart && !this.running) {
      this.destroy();
      return;
    }
    if (!this.running || !this.master || !this.context) return;
    const now = this.context.currentTime;
    this.running = false;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(0, now + .45);
    this.stopTimer = this.setTimer(() => this.destroy(), 520);
  }

  energy() {
    if (!this.running || !this.analyser || !this.data) return 0;
    this.analyser.getByteFrequencyData(this.data);
    return this.data.reduce((total, value) => total + value, 0) / this.data.length;
  }

  destroy() {
    this.generation += 1;
    this.clearTimer(this.stopTimer);
    this.stopTimer = 0;
    this.nodes.forEach((node) => {
      try { node.stop?.(); } catch { /* The oscillator may already be stopped. */ }
      node.disconnect?.();
    });
    this.nodes = [];
    this.master?.disconnect();
    this.analyser?.disconnect();
    this.context?.close?.();
    this.context = null;
    this.analyser = null;
    this.master = null;
    this.data = null;
    this.running = false;
    this.pendingStart = null;
  }
}

export class HyperbeltPlayback {
  constructor(video, {
    isEligible,
    networkEmpty,
    onFailed = () => {},
    onPlaying = () => {},
  }) {
    this.video = video;
    this.isEligible = isEligible;
    this.networkEmpty = networkEmpty;
    this.onFailed = onFailed;
    this.onPlaying = onPlaying;
    this.failed = false;
    this.generation = 0;
    this.pending = null;
  }

  invalidate() {
    this.generation += 1;
    this.pending = null;
    this.video?.pause();
  }

  sync() {
    if (!this.video || this.failed) return Promise.resolve(false);
    if (!this.isEligible()) {
      this.invalidate();
      return Promise.resolve(false);
    }
    if (!this.video.paused) return Promise.resolve(true);
    if (this.pending) return this.pending;

    const generation = ++this.generation;
    this.video.muted = true;
    this.video.defaultMuted = true;
    this.video.loop = true;
    this.video.playsInline = true;
    if (this.video.networkState === this.networkEmpty) this.video.load();

    let playResult;
    try {
      playResult = this.video.play();
    } catch (error) {
      this.failed = true;
      this.onFailed(error);
      return Promise.resolve(false);
    }

    const pending = Promise.resolve(playResult)
      .then(() => {
        if (generation !== this.generation || !this.isEligible()) {
          if (!this.isEligible()) this.video.pause();
          return false;
        }
        this.onPlaying();
        return true;
      })
      .catch((error) => {
        const interrupted = error?.name === 'AbortError';
        if (generation !== this.generation || !this.isEligible() || interrupted) return false;
        this.failed = true;
        this.onFailed(error);
        return false;
      })
      .finally(() => {
        if (this.pending === pending) this.pending = null;
      });

    this.pending = pending;
    return pending;
  }
}

export class SoundToggleCoordinator {
  constructor({ onState, sound }) {
    this.onState = onState;
    this.sound = sound;
    this.enabled = false;
    this.requested = false;
    this.generation = 0;
  }

  toggle() {
    this.requested = !this.requested;
    const generation = ++this.generation;

    if (!this.requested) {
      this.enabled = false;
      this.sound.stop();
      this.onState(false, false);
      return Promise.resolve(false);
    }

    let startResult;
    try {
      startResult = this.sound.start();
    } catch {
      startResult = false;
    }

    return Promise.resolve(startResult).then((started) => {
      if (generation !== this.generation) return false;
      if (!this.requested) {
        this.sound.stop();
        return false;
      }
      this.enabled = Boolean(started);
      this.onState(this.enabled, !this.enabled);
      return this.enabled;
    });
  }

  reset({ destroy = false } = {}) {
    this.generation += 1;
    this.requested = false;
    this.enabled = false;
    if (destroy) this.sound.destroy();
    else this.sound.stop();
    this.onState(false, false);
  }
}

export class BfcacheLifecycle {
  constructor({ dispose, restore, suspend }) {
    this.dispose = dispose;
    this.restore = restore;
    this.suspend = suspend;
    this.state = 'active';
  }

  handlePageHide(event) {
    if (!event.persisted) {
      if (this.state !== 'disposed') this.dispose();
      this.state = 'disposed';
      return;
    }
    if (this.state !== 'active') return;
    this.suspend();
    this.state = 'suspended';
  }

  handlePageShow(event) {
    if (!event.persisted || this.state !== 'suspended') return;
    this.restore();
    this.state = 'active';
  }
}
/* TESTABLE COORDINATORS END */

const root = document.documentElement;
const body = document.body;
const fieldCanvas = document.querySelector('#sound-field');
const fieldContext = fieldCanvas?.getContext('2d', { alpha: true });
const haloCanvas = document.querySelector('[data-halo-canvas]');
const productStage = haloCanvas?.closest('.product-stage');
const productStatus = document.querySelector('[data-product-status]');
const modeButtons = [...document.querySelectorAll('[data-product-mode]')];
const explodeButton = document.querySelector('[data-product-explode]');
const hyperbeltVideo = document.querySelector('[data-hyperbelt-video]');
const hyperbeltSource = document.querySelector('[data-hyperbelt-video] source');
const videoFallback = document.querySelector('[data-video-fallback]');
const sound = new HaloSound();
const soundToggles = [...document.querySelectorAll('[data-sound-toggle]')];
const soundStatus = document.querySelector('[data-sound-status]');
const sections = [...document.querySelectorAll('[data-stage]')];
const hero = document.querySelector('#hero');
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

const modeLabels = {
  assembled: 'Full object view.',
  shell: 'Acoustic shell isolated.',
  core: 'Magnetic core isolated.',
};

let haloScene = null;
let selectedMode = 'assembled';
let exploded = false;
let soundEnabled = false;
let frame = 0;
let hidden = document.hidden;
let width = 0;
let height = 0;
let dpr = 1;
let pointerX = 0;
let pointerY = 0;
let visualEnergy = .08;
let activeStage = 'hero';
let heroHasBeenVisible = false;
let cinematicSectionNear = false;
let videoFailed = false;
let disposed = false;
let hyperbeltPlayback = null;

function setSoundUI(enabled, unavailable = false) {
  soundToggles.forEach((toggle) => {
    toggle.setAttribute('aria-pressed', String(enabled));
    const label = toggle.querySelector('[data-sound-label]');
    if (!label) return;
    if (unavailable) label.textContent = 'Sound unavailable';
    else if (enabled) label.textContent = 'Sound off';
    else label.textContent = toggle.classList.contains('inline-sound') ? 'Activate sound field' : 'Sound on';
  });

  if (!soundStatus) return;
  if (unavailable) soundStatus.textContent = 'Sound unavailable in this browser. The visual field remains active.';
  else if (enabled) soundStatus.textContent = 'Field active. Procedural audio is responding in real time.';
  else soundStatus.textContent = 'Field standing by. Sound is off.';
}

function toggleSound() {
  return soundCoordinator.toggle();
}

const soundCoordinator = new SoundToggleCoordinator({
  sound,
  onState: (enabled, unavailable) => {
    soundEnabled = enabled;
    setSoundUI(enabled, unavailable);
  },
});

function setProductStatus(message) {
  if (productStatus) productStatus.textContent = message;
}

function selectMode(mode, announce = true) {
  selectedMode = modeLabels[mode] ? mode : 'assembled';
  modeButtons.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.productMode === selectedMode));
  });
  haloScene?.setMode(selectedMode);
  if (announce) setProductStatus(modeLabels[selectedMode]);
}

function setExploded(value, announce = true) {
  exploded = Boolean(value);
  explodeButton?.setAttribute('aria-pressed', String(exploded));
  haloScene?.setExploded(exploded);
  if (announce) setProductStatus(exploded ? 'Construction separated.' : 'Product assembled.');
}

function markVideoFailed() {
  if (videoFailed) return;
  videoFailed = true;
  body.classList.add('video-failed');
  hyperbeltVideo?.pause();
  hyperbeltVideo?.setAttribute('hidden', '');
  if (videoFallback) {
    videoFallback.hidden = false;
  }
}

function canPlayHyperbelt() {
  return Boolean(
    hyperbeltVideo
    && !videoFailed
    && !motionQuery.matches
    && !hidden
    && heroHasBeenVisible
    && cinematicSectionNear
  );
}

async function syncHyperbeltPlayback() {
  await hyperbeltPlayback?.sync();
}

function resizeField() {
  if (!fieldCanvas || !fieldContext) return;
  dpr = Math.min(window.devicePixelRatio || 1, 1.75);
  width = window.innerWidth;
  height = window.innerHeight;
  fieldCanvas.width = Math.round(width * dpr);
  fieldCanvas.height = Math.round(height * dpr);
  fieldContext.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function drawField(time, energy) {
  if (!fieldContext || hidden) return;
  fieldContext.clearRect(0, 0, width, height);
  const cx = width * (.5 + pointerX * .025);
  const cy = height * (.48 + pointerY * .02);
  const base = Math.min(width, height) * .13;
  const rings = width < 700 ? 7 : 11;

  for (let index = rings; index >= 0; index -= 1) {
    const phase = motionQuery.matches ? 0 : time * .000045 * (index % 2 ? 1 : -1);
    const radius = base + index * Math.min(width, height) * .062 + Math.sin(phase * 10 + index) * (5 + energy * 19);
    fieldContext.beginPath();
    fieldContext.ellipse(cx, cy, radius * 1.24, radius * .56, phase, 0, Math.PI * 2);
    fieldContext.strokeStyle = index % 3 === 0
      ? `rgba(229,161,111,${.05 + energy * .18})`
      : `rgba(242,239,232,${.025 + energy * .08})`;
    fieldContext.lineWidth = index % 3 === 0 ? 1 : .6;
    fieldContext.stroke();
  }

  const particles = width < 700 ? 24 : 48;
  for (let index = 0; index < particles; index += 1) {
    const seed = index * 17.31;
    const drift = motionQuery.matches ? 0 : time * .000012 * (index % 3 + 1);
    const x = (Math.sin(seed + drift) * .5 + .5) * width;
    const y = (Math.cos(seed * .73 + drift * .8) * .5 + .5) * height;
    const size = .5 + (index % 4) * .3 + energy * 1.4;
    fieldContext.fillStyle = `rgba(229,161,111,${.08 + energy * .22})`;
    fieldContext.fillRect(x, y, size, size);
  }
}

function scrollProgress() {
  const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  if (!motionQuery.matches) return Math.min(1, Math.max(0, window.scrollY / scrollable));
  const stageIndex = Math.max(0, sections.findIndex((section) => section.dataset.stage === activeStage));
  return sections.length > 1 ? stageIndex / (sections.length - 1) : 0;
}

function updateStage() {
  const viewportCenter = window.scrollY + window.innerHeight * .5;
  let active = sections[0];
  let best = Infinity;

  sections.forEach((section) => {
    const center = section.offsetTop + section.offsetHeight * .5;
    const distance = Math.abs(viewportCenter - center);
    if (distance < best) {
      best = distance;
      active = section;
    }
  });

  activeStage = active?.dataset.stage || 'hero';
  const settings = {
    hero: ['0', '0px', '0px', '1', '-8deg'],
    thesis: ['0', '20vw', '-3vh', '.82', '18deg'],
    anatomy: ['1', '-16vw', '5vh', '.88', '-18deg'],
    field: ['0', '-22vw', '-2vh', '.78', '24deg'],
    materials: ['0', '21vw', '7vh', '.72', '-28deg'],
    finale: ['0', '23vw', '-2vh', '.9', '8deg'],
  }[activeStage];

  root.style.setProperty('--explode', settings[0]);
  root.style.setProperty('--product-x', settings[1]);
  root.style.setProperty('--product-y', settings[2]);
  root.style.setProperty('--product-scale', settings[3]);
  root.style.setProperty('--product-rotate', settings[4]);
  body.dataset.stage = activeStage;
  body.classList.toggle('is-scrolled', window.scrollY > 30);
  haloScene?.setStage(scrollProgress());
}

function render(time = 0) {
  const sampledEnergy = normalizeFieldEnergy(soundEnabled, sound.energy());
  visualEnergy += (sampledEnergy - visualEnergy) * (soundEnabled ? .16 : .06);
  root.style.setProperty('--energy', visualEnergy.toFixed(3));
  root.style.setProperty('--audio-energy', visualEnergy.toFixed(3));
  haloScene?.setEnergy(visualEnergy);
  drawField(time, visualEnergy);
  if (!hidden && !disposed) frame = requestAnimationFrame(render);
}

function initializeHaloScene() {
  if (!haloCanvas || disposed) {
    productStage?.classList.add('webgl-unavailable');
    return;
  }

  try {
    haloScene = new HaloScene(haloCanvas, {
      reducedMotion: motionQuery.matches,
      onUnavailable: () => productStage?.classList.add('webgl-unavailable'),
    });
    selectMode(selectedMode, false);
    setExploded(exploded, false);
    haloScene.setStage(scrollProgress());
    haloScene.setEnergy(visualEnergy);
  } catch {
    productStage?.classList.add('webgl-unavailable');
  }
}

function handleVisibilityChange() {
  hidden = document.hidden;
  cancelAnimationFrame(frame);
  frame = 0;
  if (hidden) {
    hyperbeltPlayback?.invalidate();
    return;
  }
  frame = requestAnimationFrame(render);
  void syncHyperbeltPlayback();
}

function handleMotionChange() {
  if (motionQuery.matches) {
    hyperbeltPlayback?.invalidate();
    if (videoFallback) videoFallback.hidden = false;
  } else if (!videoFailed && videoFallback) {
    videoFallback.hidden = true;
  }

  haloScene?.dispose();
  haloScene = null;
  requestAnimationFrame(initializeHaloScene);
  updateStage();
  void syncHyperbeltPlayback();
}

function suspendExperience() {
  cancelAnimationFrame(frame);
  frame = 0;
  soundCoordinator.reset({ destroy: true });
  hyperbeltPlayback?.invalidate();
  haloScene?.dispose();
  haloScene = null;
  heroObserver?.disconnect();
  sectionObserver?.disconnect();
}

function restoreExperience() {
  if (disposed) return;
  hidden = document.hidden;
  nearbySections.clear();
  cinematicSectionNear = false;
  observeExperience();
  resizeField();
  updateStage();
  requestAnimationFrame(initializeHaloScene);
  if (!hidden && !frame) frame = requestAnimationFrame(render);
  void syncHyperbeltPlayback();
}

function disposeExperience() {
  if (disposed) return;
  suspendExperience();
  disposed = true;
}

modeButtons.forEach((button) => {
  button.addEventListener('click', () => selectMode(button.dataset.productMode));
});
explodeButton?.addEventListener('click', () => setExploded(!exploded));
soundToggles.forEach((toggle) => toggle.addEventListener('click', toggleSound));
hyperbeltVideo?.addEventListener('error', markVideoFailed);
hyperbeltSource?.addEventListener('error', markVideoFailed);
hyperbeltVideo?.addEventListener('playing', () => body.classList.add('video-playing'));

hyperbeltPlayback = hyperbeltVideo
  ? new HyperbeltPlayback(hyperbeltVideo, {
      isEligible: canPlayHyperbelt,
      networkEmpty: HTMLMediaElement.NETWORK_EMPTY,
      onFailed: markVideoFailed,
      onPlaying: () => body.classList.add('video-playing'),
    })
  : null;

const heroObserver = hero && 'IntersectionObserver' in window
  ? new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) heroHasBeenVisible = true;
      void syncHyperbeltPlayback();
    }, { threshold: .08 })
  : null;

const nearbySections = new Set();
const sectionObserver = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) nearbySections.add(entry.target);
        else nearbySections.delete(entry.target);
      });
      cinematicSectionNear = nearbySections.size > 0;
      void syncHyperbeltPlayback();
    }, { rootMargin: '55% 0px 55% 0px', threshold: 0 })
  : null;

function observeExperience() {
  if (heroObserver) heroObserver.observe(hero);
  else heroHasBeenVisible = true;
  if (sectionObserver) sections.forEach((section) => sectionObserver.observe(section));
  else cinematicSectionNear = true;
}

const lifecycle = new BfcacheLifecycle({
  dispose: disposeExperience,
  restore: restoreExperience,
  suspend: suspendExperience,
});

observeExperience();

window.addEventListener('resize', resizeField, { passive: true });
window.addEventListener('scroll', updateStage, { passive: true });
window.addEventListener('pointermove', (event) => {
  if (motionQuery.matches) return;
  pointerX = event.clientX / window.innerWidth * 2 - 1;
  pointerY = event.clientY / window.innerHeight * 2 - 1;
  root.style.setProperty('--pointer-x', pointerX.toFixed(3));
  root.style.setProperty('--pointer-y', pointerY.toFixed(3));
}, { passive: true });
document.addEventListener('visibilitychange', handleVisibilityChange);
window.addEventListener('pagehide', (event) => lifecycle.handlePageHide(event));
window.addEventListener('pageshow', (event) => lifecycle.handlePageShow(event));
motionQuery.addEventListener?.('change', handleMotionChange);

resizeField();
updateStage();
selectMode('assembled', false);
setExploded(false, false);
setSoundUI(false);
if (motionQuery.matches && videoFallback) videoFallback.hidden = false;
frame = requestAnimationFrame(render);
requestAnimationFrame(initializeHaloScene);
