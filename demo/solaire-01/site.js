const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const root = document.documentElement;
const films = [...document.querySelectorAll('[data-autoplay]')];
const motionToggle = document.querySelector('[data-motion-toggle]');
const form = document.querySelector('#schedule-form');
const scheduleRegion = document.querySelector('[aria-live]');
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

function buildSchedule({ program, sessionMinutes }) {
  const total = Math.max(60, Math.min(360, Number(sessionMinutes) || 120));
  const setup = program === 'spectroscopy' ? 35 : 25;
  const calibration = program === 'imaging' ? 25 : 20;
  const close = 15;
  return [
    { label: 'Instrument setup', minutes: setup },
    { label: 'Calibration', minutes: calibration },
    { label: 'Observation', minutes: Math.max(20, total - setup - calibration - close) },
    { label: 'Close-down', minutes: close },
  ];
}

function renderSchedule() {
  const rows = buildSchedule({ program: form.program.value, sessionMinutes: form.sessionMinutes.value });
  scheduleRegion.querySelector('[data-schedule]').innerHTML = rows.map((row, index) =>
    `<li><span>0${index + 1}</span><strong>${row.label}</strong><time>${row.minutes} MIN</time></li>`
  ).join('');
}

form.addEventListener('input', () => {
  document.querySelector('[data-minutes]').textContent = `${form.sessionMinutes.value} MIN`;
});
form.addEventListener('submit', (event) => { event.preventDefault(); renderSchedule(); });
form.addEventListener('reset', () => requestAnimationFrame(() => {
  document.querySelector('[data-minutes]').textContent = `${form.sessionMinutes.value} MIN`;
  renderSchedule();
}));
renderSchedule();

for (const film of films) film.addEventListener('error', () => film.closest('.chapter').classList.add('video-error'));
const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!motionEnabled || !entry.isIntersecting) entry.target.pause();
    else entry.target.play().catch(() => stopMotionAfterPlaybackFailure(entry.target));
  }
}, { threshold: 0.3 });
films.forEach((film) => observer.observe(film));
setMotionEnabled(motionEnabled);

let framePending = false;
function setLightPosition() {
  const ratio = scrollY / Math.max(1, document.body.scrollHeight - innerHeight);
  document.documentElement.style.setProperty('--day', ratio.toFixed(4));
  framePending = false;
}
addEventListener('scroll', () => {
  if (!framePending) { framePending = true; requestAnimationFrame(setLightPosition); }
}, { passive: true });
setLightPosition();

window.buildSchedule = buildSchedule;
