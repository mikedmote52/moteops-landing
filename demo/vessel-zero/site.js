const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const root = document.documentElement;
const films = [...document.querySelectorAll('[data-autoplay]')];
const motionToggle = document.querySelector('[data-motion-toggle]');
const statusRegion = document.querySelector('[aria-live]');
let motionEnabled = !motionPreference.matches;

function filmIsVisible(film) {
  const rect = film.getBoundingClientRect();
  return rect.bottom > 0 && rect.top < innerHeight;
}

function updateMotionToggle() {
  root.dataset.motion = motionEnabled ? 'on' : 'off';
  motionToggle.setAttribute('aria-pressed', String(motionEnabled));
  motionToggle.querySelector('[data-motion-label]').textContent = motionEnabled ? 'Motion on' : 'Motion off';
}

function stopMotionAfterPlaybackFailure(film) {
  film.closest('.chapter').classList.add('video-paused');
  motionEnabled = false;
  films.forEach((item) => item.pause());
  updateMotionToggle();
}

function setMotionEnabled(enabled) {
  motionEnabled = enabled;
  updateMotionToggle();
  for (const film of films) {
    if (!motionEnabled || !filmIsVisible(film)) film.pause();
    else film.play().then(() => film.closest('.chapter').classList.remove('video-paused')).catch(() => stopMotionAfterPlaybackFailure(film));
  }
}

motionToggle.addEventListener('click', () => setMotionEnabled(!motionEnabled));
motionPreference.addEventListener('change', (event) => setMotionEnabled(!event.matches));

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

for (const film of films) {
  film.addEventListener('error', () => film.closest('.chapter').classList.add('video-error'));
}

const mediaObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    const film = entry.target;
    if (!motionEnabled || !entry.isIntersecting) film.pause();
    else film.play().catch(() => stopMotionAfterPlaybackFailure(film));
  }
}, { threshold: 0.25 });
films.forEach((film) => mediaObserver.observe(film));

let ticking = false;
function updateScroll() {
  const progress = scrollY / Math.max(1, document.body.scrollHeight - innerHeight);
  root.style.setProperty('--scroll', progress.toFixed(4));
  ticking = false;
}
addEventListener('scroll', () => {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(updateScroll);
  }
}, { passive: true });
updateScroll();

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
  context.clearRect(0, 0, innerWidth, innerHeight);
  context.fillStyle = 'rgba(232,236,233,.34)';
  for (const p of particles) {
    p.y -= p.v;
    if (p.y < -2) p.y = innerHeight + 2;
    context.beginPath(); context.arc(p.x, p.y, p.r, 0, Math.PI * 2); context.fill();
  }
  if (!motionPreference.matches) requestAnimationFrame(drawParticles);
}
addEventListener('resize', sizeCanvas, { passive: true });
sizeCanvas();
drawParticles();
setMotionEnabled(motionEnabled);

window.calculateMission = calculateMission;
window.resetMission = resetMission;
