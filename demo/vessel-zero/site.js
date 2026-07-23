const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const root = document.documentElement;
const films = [...document.querySelectorAll('[data-autoplay]')];
const motionToggle = document.querySelector('[data-motion-toggle]');
const statusRegion = document.querySelector('[aria-live]');
let motionEnabled = !motionPreference.matches;
let motionGeneration = 0;

function filmIsVisible(film) {
  const rect = film.getBoundingClientRect();
  return rect.bottom > 0 && rect.top < innerHeight;
}

function updateMotionToggle() {
  root.dataset.motion = motionEnabled ? 'on' : 'off';
  motionToggle.setAttribute('aria-pressed', String(motionEnabled));
  motionToggle.querySelector('[data-motion-label]').textContent = motionEnabled ? 'Motion on' : 'Motion off';
}

function stopMotionAfterPlaybackFailure(film, generation) {
  if (generation !== motionGeneration || !motionEnabled) return;
  film.closest('.chapter').classList.add('video-paused');
  setMotionEnabled(false);
}

function playFilm(film) {
  const generation = motionGeneration;
  let attempt;
  try { attempt = film.play(); } catch (error) { stopMotionAfterPlaybackFailure(film, generation); return; }
  Promise.resolve(attempt)
    .then(() => {
      if (generation === motionGeneration && motionEnabled) film.closest('.chapter').classList.remove('video-paused');
    })
    .catch(() => stopMotionAfterPlaybackFailure(film, generation));
}

function syncFilms() {
  for (const film of films) {
    if (!motionEnabled || !filmIsVisible(film)) film.pause();
    else playFilm(film);
  }
}

let particleFrame = 0;
const canvas = document.querySelector('#particle-field');
const context = canvas.getContext('2d');
let particles = [];

function sizeCanvas() {
  const dpr = Math.min(devicePixelRatio || 1, 1.5);
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  canvas.style.width = `${innerWidth}px`;
  canvas.style.height = `${innerHeight}px`;
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  particles = Array.from({ length: Math.min(46, Math.floor(innerWidth / 22)) }, () => ({
    x: Math.random() * innerWidth, y: Math.random() * innerHeight, r: Math.random() * 1.2 + 0.2, v: Math.random() * 0.18 + 0.04,
  }));
}

function drawParticles() {
  particleFrame = 0;
  context.clearRect(0, 0, innerWidth, innerHeight);
  context.fillStyle = 'rgba(232,236,233,.34)';
  for (const particle of particles) {
    particle.y -= particle.v;
    if (particle.y < -2) particle.y = innerHeight + 2;
    context.beginPath(); context.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2); context.fill();
  }
  if (motionEnabled) particleFrame = requestAnimationFrame(drawParticles);
}

function syncParticles() {
  if (!motionEnabled) {
    if (particleFrame) cancelAnimationFrame(particleFrame);
    particleFrame = 0;
  } else if (!particleFrame) drawParticles();
}

function setMotionEnabled(enabled) {
  motionEnabled = Boolean(enabled);
  motionGeneration += 1;
  updateMotionToggle();
  syncFilms();
  syncParticles();
  if (!motionEnabled) root.style.setProperty('--scroll', '0');
}

motionToggle.addEventListener('click', () => setMotionEnabled(!motionEnabled));
if (typeof motionPreference.addEventListener === 'function') motionPreference.addEventListener('change', (event) => setMotionEnabled(!event.matches));
else if (typeof motionPreference.addListener === 'function') motionPreference.addListener((event) => setMotionEnabled(!event.matches));

const ROUTES = {
  shelf: { hours: 3.5, energy: 38, packageName: 'Optical survey package' },
  slope: { hours: 5.25, energy: 57, packageName: 'Water-column package' },
  trench: { hours: 7.75, energy: 76, packageName: 'Pressure and sonar package' },
};

function calculateMission({ route, depth, priority }) {
  const base = ROUTES[route] || ROUTES.shelf;
  const depthFactor = Math.max(0, Number(depth) - 1000) / 4000;
  const priorityFactor = priority === 'samples' ? 1.12 : priority === 'mapping' ? 1.06 : 1;
  return {
    durationHours: Number((base.hours * priorityFactor + depthFactor).toFixed(1)),
    energyPercent: Math.min(94, Math.round(base.energy + depthFactor * 14)),
    packageName: base.packageName,
  };
}

function renderMission(values) {
  const result = calculateMission(values);
  statusRegion.querySelector('[data-duration]').textContent = `${result.durationHours.toFixed(1)} H`;
  statusRegion.querySelector('[data-energy]').textContent = `${result.energyPercent}%`;
  statusRegion.querySelector('[data-package]').textContent = result.packageName;
}

function resetMission() {
  requestAnimationFrame(() => {
    const form = document.querySelector('#mission-form');
    document.querySelector('[data-depth]').textContent = `${Number(form.depth.value).toLocaleString()} M`;
    renderMission({ route: form.route.value, depth: form.depth.value, priority: form.priority.value });
  });
}

const form = document.querySelector('#mission-form');
form.addEventListener('input', () => {
  document.querySelector('[data-depth]').textContent = `${Number(form.depth.value).toLocaleString()} M`;
});
form.addEventListener('submit', (event) => {
  event.preventDefault();
  renderMission({ route: form.route.value, depth: form.depth.value, priority: form.priority.value });
});
form.addEventListener('reset', resetMission);

for (const film of films) film.addEventListener('error', () => film.closest('.chapter').classList.add('video-error'));
if (typeof IntersectionObserver === 'function') {
  const mediaObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!motionEnabled || !entry.isIntersecting) entry.target.pause();
      else playFilm(entry.target);
    }
  }, { threshold: 0.25 });
  films.forEach((film) => mediaObserver.observe(film));
} else {
  addEventListener('scroll', syncFilms, { passive: true });
  addEventListener('resize', syncFilms, { passive: true });
}

let ticking = false;
function updateScroll() {
  if (motionEnabled) {
    const progress = scrollY / Math.max(1, document.body.scrollHeight - innerHeight);
    root.style.setProperty('--scroll', progress.toFixed(4));
  }
  ticking = false;
}
addEventListener('scroll', () => {
  if (motionEnabled && !ticking) {
    ticking = true;
    requestAnimationFrame(updateScroll);
  }
}, { passive: true });
addEventListener('resize', () => { sizeCanvas(); if (motionEnabled) syncParticles(); }, { passive: true });
sizeCanvas();
updateScroll();
setMotionEnabled(motionEnabled);

window.calculateMission = calculateMission;
window.resetMission = resetMission;
