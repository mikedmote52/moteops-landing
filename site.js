const heroBooking = document.querySelector('#hero-booking');
const stickyCta = document.querySelector('[data-sticky-cta]');

if (heroBooking && stickyCta && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(([entry]) => {
    const show = !entry.isIntersecting;
    stickyCta.classList.toggle('is-visible', show);
    stickyCta.setAttribute('aria-hidden', String(!show));
    stickyCta.tabIndex = show ? 0 : -1;
  }, { threshold: 0.1 });

  observer.observe(heroBooking);
}
