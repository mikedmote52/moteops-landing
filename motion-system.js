const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const motionToggle = document.querySelector('[data-motion-toggle]');
const studioFilms = [...document.querySelectorAll('[data-studio-film]')];
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

function syncFilm(film) {
  if (!motionEnabled || !filmIsVisible(film)) return film.pause();
  loadFilm(film);
  film.play().catch(() => {
    film.closest('[data-studio-study]')?.classList.add('video-paused');
    motionEnabled = false;
    studioFilms.forEach((item) => item.pause());
    updateMotionControl();
  });
}

function setMotionEnabled(enabled) {
  motionEnabled = Boolean(enabled);
  updateMotionControl();
  studioFilms.forEach(syncFilm);
}

const filmObserver = new IntersectionObserver((entries) => {
  entries.forEach(({ target }) => syncFilm(target));
}, { rootMargin: '25% 0px', threshold: 0.15 });

studioFilms.forEach((film) => filmObserver.observe(film));
motionToggle?.addEventListener('click', () => setMotionEnabled(!motionEnabled));
motionPreference.addEventListener('change', (event) => setMotionEnabled(!event.matches));
updateMotionControl();

window.moteMotion = { setMotionEnabled, isEnabled: () => motionEnabled };
