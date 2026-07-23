const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const motionToggle = document.querySelector('[data-motion-toggle]');
const studioFilms = [
  ...document.querySelectorAll('[data-studio-film]'),
  ...document.querySelectorAll('[data-cinematic-film]'),
];
const playRequests = new WeakMap();
let motionEnabled = !motionPreference.matches;

function updateMotionControl() {
  document.documentElement.dataset.motion = motionEnabled ? 'on' : 'off';
  motionToggle?.setAttribute('aria-pressed', String(motionEnabled));
  const label = motionToggle?.querySelector('[data-motion-label]');
  if (label) label.textContent = motionEnabled ? 'Motion on' : 'Motion off';
  document.dispatchEvent(new CustomEvent('mote:motionchange', { detail: { enabled: motionEnabled } }));
}

function loadFilm(film) {
  const source = film.querySelector('source[data-src]');
  if (!source || source.src) return;
  source.src = source.dataset.src;
  film.load();
}

function filmIsVisible(film) {
  const rect = film.getBoundingClientRect();
  return rect.bottom > 0 && rect.top < innerHeight;
}

function pauseFilm(film) {
  playRequests.set(film, (playRequests.get(film) ?? 0) + 1);
  film.pause();
}

function syncFilm(film) {
  if (!motionEnabled || !filmIsVisible(film)) return pauseFilm(film);
  loadFilm(film);
  const request = (playRequests.get(film) ?? 0) + 1;
  playRequests.set(film, request);
  film.play().catch(() => {
    if (!motionEnabled || playRequests.get(film) !== request) return;
    film.closest('[data-studio-study]')?.classList.add('video-paused');
    motionEnabled = false;
    studioFilms.forEach(pauseFilm);
    updateMotionControl();
  });
}

function setMotionEnabled(enabled) {
  motionEnabled = Boolean(enabled);
  updateMotionControl();
  studioFilms.forEach(syncFilm);
}

function syncVisibleFilms() {
  studioFilms.forEach(syncFilm);
}

if ('IntersectionObserver' in window) {
  const filmObserver = new IntersectionObserver((entries) => {
    entries.forEach(({ target }) => syncFilm(target));
  }, { rootMargin: '0px', threshold: 0 });
  studioFilms.forEach((film) => filmObserver.observe(film));
} else {
  addEventListener('scroll', syncVisibleFilms, { passive: true });
  addEventListener('resize', syncVisibleFilms);
  syncVisibleFilms();
}

motionToggle?.addEventListener('click', () => setMotionEnabled(!motionEnabled));
const syncMotionPreference = (event) => setMotionEnabled(!event.matches);
if (typeof motionPreference.addEventListener === 'function') motionPreference.addEventListener('change', syncMotionPreference);
else if (typeof motionPreference.addListener === 'function') motionPreference.addListener(syncMotionPreference);
updateMotionControl();

window.moteMotion = { setMotionEnabled, isEnabled: () => motionEnabled };
