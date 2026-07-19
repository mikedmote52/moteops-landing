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
    const sceneRatios = new Map(scenes.map((scene) => [scene, 0]));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        sceneRatios.set(entry.target, entry.intersectionRatio);
      });
      const visible = [...sceneRatios.entries()]
        .sort((a, b) => b[1] - a[1])[0];
      if (visible?.[1] > 0) setOwnerStoryState(visible[0].dataset.ownerScene);
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
