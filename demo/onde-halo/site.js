class HaloSound {
  constructor() {
    this.context = null;
    this.analyser = null;
    this.master = null;
    this.nodes = [];
    this.data = null;
    this.running = false;
  }

  async start() {
    if (this.running) return true;
    const AudioEngine = window.AudioContext || window.webkitAudioContext;
    if (!AudioEngine) return false;

    try {
      this.context ||= new AudioEngine();
      await this.context.resume();
      const now = this.context.currentTime;
      this.analyser = this.context.createAnalyser();
      this.analyser.fftSize = 128;
      this.analyser.smoothingTimeConstant = .86;
      this.data = new Uint8Array(this.analyser.frequencyBinCount);

      this.master = this.context.createGain();
      this.master.gain.setValueAtTime(0, now);
      this.master.gain.linearRampToValueAtTime(.12, now + 1.4);
      this.master.connect(this.analyser).connect(this.context.destination);

      const filter = this.context.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(880, now);
      filter.Q.value = .7;
      filter.connect(this.master);
      this.nodes.push(filter);

      [55, 82.5, 110].forEach((frequency, index) => {
        const oscillator = this.context.createOscillator();
        const gain = this.context.createGain();
        oscillator.type = index === 1 ? 'triangle' : 'sine';
        oscillator.frequency.value = frequency;
        oscillator.detune.value = index * 4 - 3;
        gain.gain.value = [.28, .09, .04][index];
        oscillator.connect(gain).connect(filter);
        oscillator.start();
        this.nodes.push(oscillator, gain);
      });

      const lfo = this.context.createOscillator();
      const lfoGain = this.context.createGain();
      lfo.frequency.value = .075;
      lfoGain.gain.value = 420;
      lfo.connect(lfoGain).connect(filter.frequency);
      lfo.start();
      this.nodes.push(lfo, lfoGain);
      this.running = true;
      return true;
    } catch {
      this.destroy();
      return false;
    }
  }

  stop() {
    if (!this.running || !this.master || !this.context) return;
    const now = this.context.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(0, now + .45);
    window.setTimeout(() => this.destroy(), 520);
  }

  energy() {
    if (!this.running || !this.analyser || !this.data) return 0;
    this.analyser.getByteFrequencyData(this.data);
    return this.data.reduce((total, value) => total + value, 0) / this.data.length / 255;
  }

  destroy() {
    this.nodes.forEach((node) => {
      try { node.stop?.(); } catch { /* already stopped */ }
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
  }
}

const root = document.documentElement;
const canvas = document.querySelector('#sound-field');
const context = canvas?.getContext('2d', { alpha: true });
const sound = new HaloSound();
const toggles = [...document.querySelectorAll('[data-sound-toggle]')];
const status = document.querySelector('[data-sound-status]');
const sections = [...document.querySelectorAll('[data-stage]')];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let soundEnabled = false;
let frame = 0;
let hidden = document.hidden;
let width = 0;
let height = 0;
let dpr = 1;
let pointerX = 0;
let pointerY = 0;

function setSoundUI(enabled, unavailable = false) {
  toggles.forEach((toggle) => {
    toggle.setAttribute('aria-pressed', String(enabled));
    const label = toggle.querySelector('[data-sound-label]');
    if (label) label.textContent = unavailable ? 'Sound unavailable' : enabled ? 'Sound off' : toggle.classList.contains('inline-sound') ? 'Activate sound field' : 'Sound on';
  });
  if (status) status.textContent = unavailable ? 'Sound unavailable in this browser. The visual field remains active.' : enabled ? 'Field active. Procedural audio is responding in real time.' : 'Field standing by. Sound is off.';
}

async function toggleSound() {
  if (soundEnabled) {
    soundEnabled = false;
    sound.stop();
    setSoundUI(false);
    return;
  }
  const started = await sound.start();
  soundEnabled = started;
  setSoundUI(started, !started);
}

toggles.forEach((toggle) => toggle.addEventListener('click', toggleSound));

function resizeCanvas() {
  if (!canvas || !context) return;
  dpr = Math.min(window.devicePixelRatio || 1, 1.75);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function drawField(time, energy) {
  if (!context || hidden) return;
  context.clearRect(0, 0, width, height);
  const cx = width * (.5 + pointerX * .025);
  const cy = height * (.48 + pointerY * .02);
  const base = Math.min(width, height) * .13;
  const rings = width < 700 ? 7 : 11;

  for (let index = rings; index >= 0; index -= 1) {
    const phase = reducedMotion.matches ? 0 : (time * .000045 * (index % 2 ? 1 : -1));
    const radius = base + index * Math.min(width, height) * .062 + Math.sin(phase * 10 + index) * (5 + energy * 19);
    context.beginPath();
    context.ellipse(cx, cy, radius * 1.24, radius * .56, phase, 0, Math.PI * 2);
    context.strokeStyle = index % 3 === 0 ? `rgba(229,161,111,${.05 + energy * .18})` : `rgba(242,239,232,${.025 + energy * .08})`;
    context.lineWidth = index % 3 === 0 ? 1 : .6;
    context.stroke();
  }

  const particles = width < 700 ? 24 : 48;
  for (let index = 0; index < particles; index += 1) {
    const seed = index * 17.31;
    const drift = reducedMotion.matches ? 0 : time * .000012 * (index % 3 + 1);
    const x = (Math.sin(seed + drift) * .5 + .5) * width;
    const y = (Math.cos(seed * .73 + drift * .8) * .5 + .5) * height;
    const size = .5 + (index % 4) * .3 + energy * 1.4;
    context.fillStyle = `rgba(229,161,111,${.08 + energy * .22})`;
    context.fillRect(x, y, size, size);
  }
}

function updateStage() {
  const viewportCenter = window.scrollY + window.innerHeight * .5;
  let active = sections[0];
  let best = Infinity;
  sections.forEach((section) => {
    const center = section.offsetTop + section.offsetHeight * .5;
    const distance = Math.abs(viewportCenter - center);
    if (distance < best) { best = distance; active = section; }
  });

  const stage = active?.dataset.stage || 'hero';
  const settings = {
    hero: ['0', '0px', '0px', '1', '-8deg'],
    thesis: ['0', '20vw', '-3vh', '.82', '18deg'],
    anatomy: ['1', '-16vw', '5vh', '.88', '-18deg'],
    field: ['0', '-22vw', '-2vh', '.78', '24deg'],
    materials: ['0', '21vw', '7vh', '.72', '-28deg'],
    finale: ['0', '23vw', '-2vh', '.9', '8deg']
  }[stage];
  root.style.setProperty('--explode', settings[0]);
  root.style.setProperty('--product-x', settings[1]);
  root.style.setProperty('--product-y', settings[2]);
  root.style.setProperty('--product-scale', settings[3]);
  root.style.setProperty('--product-rotate', settings[4]);
  document.body.dataset.stage = stage;
  document.body.classList.toggle('is-scrolled', window.scrollY > 30);
}

function render(time = 0) {
  const energy = soundEnabled ? Math.min(1, sound.energy() * 3.7) : .04 + Math.sin(time * .0012) * .015;
  root.style.setProperty('--energy', energy.toFixed(3));
  drawField(time, energy);
  if (!hidden) frame = requestAnimationFrame(render);
}

window.addEventListener('resize', resizeCanvas, { passive: true });
window.addEventListener('scroll', updateStage, { passive: true });
window.addEventListener('pointermove', (event) => {
  if (reducedMotion.matches) return;
  pointerX = event.clientX / window.innerWidth * 2 - 1;
  pointerY = event.clientY / window.innerHeight * 2 - 1;
  root.style.setProperty('--pointer-x', pointerX.toFixed(3));
  root.style.setProperty('--pointer-y', pointerY.toFixed(3));
}, { passive: true });

document.addEventListener('visibilitychange', () => {
  hidden = document.hidden;
  cancelAnimationFrame(frame);
  if (!hidden) frame = requestAnimationFrame(render);
});

resizeCanvas();
updateStage();
setSoundUI(false);
frame = requestAnimationFrame(render);
