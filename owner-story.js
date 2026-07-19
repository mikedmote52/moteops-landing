const ownerStory = document.querySelector('[data-owner-story]');

if (ownerStory) {
  const scenes = [...ownerStory.querySelectorAll('[data-owner-scene]')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setOwnerStoryState(name) {
    ownerStory.dataset.ownerStoryState = name;
    scenes.forEach((scene) => {
      scene.classList.toggle('is-active', scene.dataset.ownerScene === name);
    });
  }

  if (!reducedMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setOwnerStoryState(visible.target.dataset.ownerScene);
    }, { threshold: [0.35, 0.6, 0.85] });

    scenes.forEach((scene) => observer.observe(scene));
  }

  ownerStory.querySelector('[data-owner-story-handoff]')?.addEventListener('click', () => {
    const heading = document.querySelector('#care-hub-showcase #gallery-title');
    window.setTimeout(() => {
      heading?.setAttribute('tabindex', '-1');
      heading?.focus();
    }, reducedMotion ? 0 : 500);
  });
}
