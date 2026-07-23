const ownerStory = document.querySelector('[data-owner-story]');

if (ownerStory) {
  const scenes = [...ownerStory.querySelectorAll('[data-owner-scene]')];
  const ownerMotionPreference = typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : { matches: false };
  const sceneRatios = new Map(scenes.map((scene) => [scene, 0]));
  let motionEnabled = window.moteMotion?.isEnabled?.() ?? !ownerMotionPreference.matches;
  let observer;

  function setOwnerStoryState(name) {
    ownerStory.dataset.ownerStoryState = name;
    scenes.forEach((scene) => {
      scene.classList.toggle('is-active', scene.dataset.ownerScene === name);
    });
  }

  function showStaticScenes() {
    ownerStory.classList.add('is-owner-story-static');
    scenes.forEach((scene) => scene.classList.add('is-active'));
  }

  function observeScenes() {
    if (observer || !motionEnabled) return;
    if (!('IntersectionObserver' in window)) {
      showStaticScenes();
      return;
    }
    ownerStory.classList.remove('is-owner-story-static');
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        sceneRatios.set(entry.target, entry.intersectionRatio);
      });
      const visible = [...sceneRatios.entries()]
        .sort((a, b) => b[1] - a[1])[0];
      if (visible?.[1] > 0) setOwnerStoryState(visible[0].dataset.ownerScene);
    }, { threshold: [0.35, 0.6, 0.85] });
    scenes.forEach((scene) => observer.observe(scene));
  }

  function syncOwnerMotion(enabled) {
    motionEnabled = Boolean(enabled);
    if (motionEnabled) observeScenes();
    else {
      observer?.disconnect();
      observer = undefined;
      ownerStory.classList.remove('is-owner-story-static');
      setOwnerStoryState('pressure');
    }
  }

  document.addEventListener('mote:motionchange', ({ detail }) => syncOwnerMotion(detail?.enabled));
  syncOwnerMotion(motionEnabled);

  ownerStory.querySelector('[data-owner-story-handoff]')?.addEventListener('click', () => {
    const heading = document.querySelector('#care-hub-showcase #gallery-title');
    window.setTimeout(() => {
      heading?.setAttribute('tabindex', '-1');
      heading?.focus();
    }, motionEnabled ? 500 : 0);
  });
}
