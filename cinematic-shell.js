const chapterSections = [...document.querySelectorAll('[data-chapter]')];
const pageMotionPreference = typeof window.matchMedia === 'function'
  ? window.matchMedia('(prefers-reduced-motion: reduce)')
  : { matches: false };
const scheduleFrame = window.requestAnimationFrame?.bind(window) ?? ((callback) => window.setTimeout(callback, 0));
let pageFramePending = false;
let pageMotionEnabled = window.moteMotion?.isEnabled?.() ?? !pageMotionPreference.matches;

function updateSectionProgress() {
  const activeSection = chapterSections.find((section) => {
    const rect = section.getBoundingClientRect();
    return rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2;
  });
  if (!activeSection) return;
  const rect = activeSection.getBoundingClientRect();
  const range = Math.max(1, window.innerHeight + rect.height);
  const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / range));
  document.documentElement.style.setProperty('--section-progress', progress.toFixed(4));
}

function updatePageProgress() {
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  document.documentElement.style.setProperty('--page-progress', (window.scrollY / max).toFixed(4));
  updateSectionProgress();
  pageFramePending = false;
}

function requestPageProgress() {
  if (pageFramePending || !pageMotionEnabled) return;
  pageFramePending = true;
  scheduleFrame(updatePageProgress);
}

if ('IntersectionObserver' in window) {
  const chapterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('is-chapter-visible', entry.isIntersecting);
    });
  }, { rootMargin: '-15% 0px -15%', threshold: 0.1 });

  chapterSections.forEach((section) => chapterObserver.observe(section));
} else {
  chapterSections.forEach((section) => section.classList.add('is-chapter-visible'));
}

window.addEventListener('scroll', requestPageProgress, { passive: true });
window.addEventListener('resize', requestPageProgress, { passive: true });
document.addEventListener('mote:motionchange', ({ detail }) => {
  pageMotionEnabled = Boolean(detail?.enabled);
  if (!pageMotionEnabled) {
    document.documentElement.style.setProperty('--page-progress', '0');
    document.documentElement.style.setProperty('--section-progress', '0');
  }
  else requestPageProgress();
});

updatePageProgress();
