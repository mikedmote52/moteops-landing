# Mote Ops Cinematic Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign `moteops.tech` as a cinematic, motion-rich operating story that explains what Mote Ops does, preserves real working proof, adds the three fictional Studio studies, and prepares a separately approved Seedance commercial using Mike's likeness.

**Architecture:** Preserve the current static HTML/CSS/JavaScript site and its existing Care Hub, owner-story, and demonstration controllers. Add an isolated page-level motion controller and an isolated Studio component, then reshape the document hierarchy and cinematic styling without a framework migration. Keep the commercial as a gated media-production track whose output is not added to the site until likeness, storyboard, cost, and final clip are separately approved.

**Tech Stack:** Semantic HTML, CSS, vanilla JavaScript, Node test runner, local MP4/WebP media, Higgsfield, Seedance 2.0, Vercel preview deployment.

## Global Constraints

- Preserve the current dirty homepage candidate and unrelated user changes.
- Keep CC's Care Hub and measured operational evidence above fictional Studio work.
- Add no framework and no new runtime dependency.
- Use the existing bone, soot, forest, copper, and signal palette for Mote Ops.
- Avoid generated text, fake interfaces, generic AI visuals, glass panels, gradients, glowing networks, and ornamental animation.
- All videos use local production assets, poster fallbacks, and `autoplay muted loop playsinline`.
- Reduced-motion preference starts with motion off; the visitor may explicitly turn motion on.
- Every visible control performs the action it implies.
- No live `moteops.tech` publish occurs without Mike's explicit approval after preview review.
- Mike's likeness is used only from media he explicitly uploads and only in the separately approved commercial storyboard.

---

### Task 1: Preserve the current homepage candidate and import the verified studies

**Files:**
- Commit existing: `index.html`
- Commit existing: `site.css`
- Commit existing: `owner-story.css`
- Commit existing: `email.html`
- Commit existing: `rebuilds.html`
- Commit existing: `privacy.html`
- Commit existing: `terms.html`
- Commit existing: `ai-practices.html`
- Commit existing: `tests/site-contract.test.mjs`
- Import: `demo/vessel-zero/`
- Import: `demo/solaire-01/`
- Import: `tests/vessel-zero.test.mjs`
- Import: `tests/solaire-01.test.mjs`
- Import: `tests/showcase-media.test.mjs`

**Interfaces:**
- Consumes: current main worktree candidate and feature branch `feat/cinematic-showcase-pair` at `43ade06`.
- Produces: one recoverable baseline commit plus local `/demo/vessel-zero/` and `/demo/solaire-01/` routes available to homepage links.

- [x] **Step 1: Verify the current dirty candidate before checkpointing**

Run:

```bash
npm test
npm run build
git diff --check
```

Expected: all tests pass, the static build exits 0, and `git diff --check` prints nothing.

- [x] **Step 2: Commit only the existing approved candidate files**

Run:

```bash
git add index.html site.css owner-story.css email.html rebuilds.html privacy.html terms.html ai-practices.html tests/site-contract.test.mjs
git commit -m "feat: checkpoint cinematic Mote Ops homepage candidate"
```

Expected: the commit contains only the listed homepage, proof, legal, and contract files. Unrelated images, local metadata, and package artifacts remain untouched.

- [x] **Step 3: Create the isolated redesign worktree**

Run from the main repository root:

```bash
git check-ignore -q .worktrees
git worktree add .worktrees/moteops-cinematic-redesign -b feat/moteops-cinematic-redesign
cd .worktrees/moteops-cinematic-redesign
```

Expected: `.worktrees` is ignored, the new worktree is on `feat/moteops-cinematic-redesign`, and it begins from the checkpoint commit created in Step 2.

- [x] **Step 4: Import the verified study commits without touching homepage files**

Run:

```bash
git cherry-pick 95a6571 0537e2c 1401a15 dfb55ff 8a8ca70 43ade06
```

Expected: the two demo directories and their tests are present; `index.html`, `site.css`, `owner-story.css`, and `site.js` show no new cherry-pick diff.

- [x] **Step 5: Verify the imported study routes**

Run:

```bash
node --test tests/showcase-media.test.mjs tests/vessel-zero.test.mjs tests/solaire-01.test.mjs
```

Expected: six tests pass and zero fail.

---

### Task 2: Replace the single ONDE card with the Mote Ops Studio

**Files:**
- Modify: `index.html`
- Create: `studio.css`
- Modify: `tests/site-contract.test.mjs`

**Interfaces:**
- Consumes: local study routes created in Task 1.
- Produces: `#mote-ops-studio`, three `[data-studio-study]` articles, and two `[data-studio-film]` videos for the motion controller in Task 3.

- [x] **Step 1: Write the failing Studio hierarchy test**

Add to `tests/site-contract.test.mjs`:

```js
test('places three fictional Studio studies after operational evidence', () => {
  const evidence = elementById('evidence', 'section');
  const studio = elementById('mote-ops-studio', 'section');
  const method = elementById('method', 'section');
  assert.ok(studio.start > evidence.end, 'Studio must follow operational evidence');
  assert.ok(studio.end < method.start, 'Studio must precede the method');
  assert.match(studio.source, /Mote Ops Studio/i);
  assert.match(studio.source, /Systems can work well and still feel exceptional/i);
  assert.equal((studio.source.match(/data-studio-study/gi) ?? []).length, 3);
  for (const route of [
    'demo/onde-halo/index.html',
    'demo/vessel-zero/index.html',
    'demo/solaire-01/index.html',
  ]) assert.match(studio.source, new RegExp(`href=["']${route.replaceAll('/', '\\/')}["']`, 'i'));
  assert.equal((studio.source.match(/FICTIONAL (?:PRODUCT|DESIGN) (?:CONCEPT|STUDY)/gi) ?? []).length, 3);
  assert.doesNotMatch(studio.source, /client result|measured outcome|production install/i);
});
```

- [x] **Step 2: Run the test to verify it fails**

Run:

```bash
node --test tests/site-contract.test.mjs
```

Expected: FAIL because `#mote-ops-studio` does not exist.

- [x] **Step 3: Add the Studio stylesheet and section markup**

Add to `<head>` in `index.html`:

```html
<link rel="stylesheet" href="studio.css?v=cinematic-20260722">
```

Move the complete existing `#evidence` section so it follows `#demo-gallery`. Remove the current `#onde-concept` aside from inside `#demo-gallery`, then replace it with this standalone section after `#evidence` and before `#method`. Preserve every existing node inside `#evidence`; only its document position changes.

```html
<section class="studio-section section-pad" id="mote-ops-studio" aria-labelledby="studio-title" data-page-section>
  <header class="studio-heading">
    <p class="kicker">MOTE OPS STUDIO · FICTIONAL DESIGN WORK</p>
    <h2 id="studio-title">Systems can work well and still feel exceptional.</h2>
    <p>Three original studies in product storytelling, cinematic motion, and interface craft. Fictional products, real design and engineering.</p>
  </header>
  <div class="studio-grid">
    <article class="studio-study studio-onde" data-studio-study>
      <div class="studio-code">STUDY / 001</div>
      <div class="studio-preview" aria-hidden="true"><span class="studio-onde-ring"></span></div>
      <div class="studio-copy"><p>FICTIONAL PRODUCT CONCEPT</p><h3>ONDE HALO</h3><strong>Sound, interaction, and product storytelling.</strong><a href="demo/onde-halo/index.html">Enter the experience <span aria-hidden="true">↗</span></a></div>
    </article>
    <article class="studio-study studio-vessel" data-studio-study>
      <div class="studio-code">STUDY / 002</div>
      <video class="studio-film" autoplay muted loop playsinline preload="none" poster="demo/vessel-zero/media/vz-01.webp" data-studio-film><source data-src="demo/vessel-zero/media/vz-01.mp4" type="video/mp4"></video>
      <div class="studio-copy"><p>FICTIONAL DESIGN STUDY</p><h3>VESSEL ZERO</h3><strong>Cinematic scale and technical restraint.</strong><a href="demo/vessel-zero/index.html">Enter the expedition <span aria-hidden="true">↗</span></a></div>
    </article>
    <article class="studio-study studio-solaire" data-studio-study>
      <div class="studio-code">STUDY / 003</div>
      <video class="studio-film" autoplay muted loop playsinline preload="none" poster="demo/solaire-01/media/so-01.webp" data-studio-film><source data-src="demo/solaire-01/media/so-01.mp4" type="video/mp4"></video>
      <div class="studio-copy"><p>FICTIONAL DESIGN STUDY</p><h3>SOLAIRE / 01</h3><strong>Editorial architecture and controlled motion.</strong><a href="demo/solaire-01/index.html">Enter the observatory <span aria-hidden="true">↗</span></a></div>
    </article>
  </div>
</section>
```

Create `studio.css` with an asymmetric lead-study layout, Mote Ops palette, square corners, editorial rules, 44-pixel links, one-column mobile composition, and no gradients or translucent-card effects. The file must include these complete layout contracts:

```css
.studio-section{background:#1b1916;color:#f7f1e6;overflow:hidden}
.studio-heading{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(280px,.8fr);gap:clamp(28px,6vw,90px);align-items:end;margin-bottom:clamp(36px,6vw,78px)}
.studio-heading h2{max-width:900px;margin:.15em 0 0;color:#f7f1e6;font-size:clamp(3rem,7vw,7.5rem);line-height:.88;letter-spacing:-.06em}
.studio-heading>p:last-child{max-width:520px;color:#bbb2a5;font:400 1.05rem/1.65 Georgia,serif}
.studio-grid{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(320px,.85fr);gap:18px}
.studio-study{position:relative;min-height:520px;overflow:hidden;border:1px solid #665f55;background:#0e0d0c;color:#f7f1e6}
.studio-onde{grid-row:span 2;min-height:1058px}
.studio-film{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.studio-study::after{content:"";position:absolute;z-index:1;left:0;right:0;bottom:0;height:62%;background:#0e0d0ce8;pointer-events:none}
.studio-code{position:absolute;z-index:2;top:22px;right:24px;font:800 .65rem ui-monospace,monospace;letter-spacing:.16em}
.studio-copy{position:absolute;z-index:3;left:clamp(24px,4vw,54px);right:clamp(24px,4vw,54px);bottom:clamp(26px,5vw,58px)}
.studio-copy p{color:#d37b4c;font:800 .64rem ui-monospace,monospace;letter-spacing:.14em}
.studio-copy h3{margin:.2em 0;color:#fff;font-size:clamp(2.5rem,5vw,5.4rem);line-height:.9;letter-spacing:-.055em}
.studio-copy strong{display:block;max-width:520px;color:#c7beb0;font:400 1rem/1.5 Georgia,serif}
.studio-copy a{display:inline-flex;min-height:44px;align-items:center;gap:16px;margin-top:24px;border-bottom:1px solid #d37b4c;color:#fff;font:800 .72rem ui-monospace,monospace;letter-spacing:.1em;text-decoration:none;text-transform:uppercase}
.studio-preview{position:absolute;inset:0;display:grid;place-items:center}
.studio-onde-ring{width:min(44vw,470px);aspect-ratio:1;border:60px solid #292724;border-radius:50%;box-shadow:inset 10px 10px 18px #4b4740,inset -12px -12px 20px #050505,0 42px 80px #000;transform:rotateX(64deg) rotateZ(-9deg)}
@media(max-width:820px){.studio-heading,.studio-grid{grid-template-columns:1fr}.studio-onde{grid-row:auto;min-height:640px}.studio-study{min-height:620px}.studio-heading h2{font-size:clamp(3rem,14vw,5.4rem)}.studio-onde-ring{width:280px;border-width:40px}}
@media(prefers-reduced-motion:reduce){.studio-onde-ring{transform:rotateX(64deg) rotateZ(-9deg)}}
```

- [x] **Step 4: Run the contract test**

Run:

```bash
node --test tests/site-contract.test.mjs
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add index.html studio.css tests/site-contract.test.mjs
git commit -m "feat: add Mote Ops Studio portfolio"
```

---

### Task 3: Add one honest page-level motion system

**Files:**
- Modify: `index.html`
- Create: `motion-system.js`
- Create: `tests/motion-system.test.mjs`
- Modify: `studio.css`

**Interfaces:**
- Consumes: `[data-studio-film]`, `[data-owner-story]`, and `prefers-reduced-motion`.
- Produces: `window.moteMotion`, `setMotionEnabled(boolean)`, root `data-motion="on|off"`, and a `[data-motion-toggle]` control.

- [x] **Step 1: Write the failing motion contract test**

Create `tests/motion-system.test.mjs`:

```js
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const js = readFileSync(new URL('../motion-system.js', import.meta.url), 'utf8');

test('provides one accessible motion control and lazy cinematic playback', () => {
  assert.match(html, /data-motion-toggle/);
  assert.match(html, /aria-pressed="true"/);
  assert.match(html, /motion-system\.js\?v=/);
  assert.match(js, /function setMotionEnabled/);
  assert.match(js, /prefers-reduced-motion/);
  assert.match(js, /IntersectionObserver/);
  assert.match(js, /dataset\.src/);
  assert.match(js, /play\(\)\.catch/);
  assert.match(js, /window\.moteMotion/);
  assert.doesNotMatch(js, /fetch\s*\(|XMLHttpRequest|sendBeacon/);
});
```

- [x] **Step 2: Run the test to verify it fails**

Run:

```bash
node --test tests/motion-system.test.mjs
```

Expected: FAIL because `motion-system.js` does not exist.

- [x] **Step 3: Add the motion control and controller**

Add immediately after the skip link in `index.html`:

```html
<button class="motion-toggle" type="button" data-motion-toggle aria-pressed="true"><span aria-hidden="true"></span><b data-motion-label>Motion on</b></button>
```

Add before the closing body tag:

```html
<script src="motion-system.js?v=cinematic-20260722" defer></script>
```

Create `motion-system.js`:

```js
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
```

Add the button styles to `studio.css` using a solid soot background, visible focus state, 44-pixel minimum height, and a signal-orange state dot. Add `html[data-motion="off"] .studio-film{visibility:hidden}` only when posters remain visible as article backgrounds.

- [x] **Step 4: Run the test and full suite**

Run:

```bash
node --test tests/motion-system.test.mjs
npm test
```

Expected: the motion test and full suite pass.

- [x] **Step 5: Commit**

```bash
git add index.html studio.css motion-system.js tests/motion-system.test.mjs
git commit -m "feat: add accessible cinematic motion system"
```

---

### Task 4: Reframe the homepage around the Mote Ops operating story

**Files:**
- Modify: `index.html`
- Modify: `owner-story.css`
- Modify: `owner-story.js`
- Create: `cinematic-shell.css`
- Create: `cinematic-shell.js`
- Modify: `tests/site-contract.test.mjs`
- Create: `tests/cinematic-shell.test.mjs`

**Interfaces:**
- Consumes: existing three `[data-owner-scene]` states and `mote:motionchange` events.
- Produces: a full-viewport narrative hero, chapter-numbered page sections, and CSS variables `--page-progress` and `--section-progress`.

- [x] **Step 1: Update the failing positioning and hierarchy contracts**

Replace the existing hero-positioning assertions in `tests/site-contract.test.mjs` with:

```js
test('positions Mote Ops as the operating layer for existing people and tools', () => {
  const hero = elementById('top', 'section').source;
  assert.match(hero, /Your people and tools already do the work\./i);
  assert.match(hero, /Mote Ops helps them work as one\./i);
  assert.match(hero, /finds the operational drag/i);
  assert.match(hero, /keeps consequential actions behind approval/i);
  assert.match(hero, /Book a fit conversation/i);
  assert.doesNotMatch(hero, /MCP|agent runtime|control plane|model routing/i);
});
```

Create `tests/cinematic-shell.test.mjs`:

```js
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const js = readFileSync(new URL('../cinematic-shell.js', import.meta.url), 'utf8');

test('stages the existing operating story without hijacking scroll', () => {
  for (const chapter of ['PRESSURE', 'WORKING PROOF', 'EVIDENCE', 'STUDIO', 'METHOD', 'START']) {
    assert.match(html, new RegExp(`data-chapter=["']${chapter}["']`, 'i'));
  }
  assert.match(js, /requestAnimationFrame/);
  assert.match(js, /--page-progress/);
  assert.match(js, /IntersectionObserver/);
  assert.match(js, /mote:motionchange/);
  assert.doesNotMatch(js, /preventDefault\(\).*scroll|wheel|touchmove/s);
});
```

- [x] **Step 2: Run the focused tests to verify they fail**

Run:

```bash
node --test tests/site-contract.test.mjs tests/cinematic-shell.test.mjs
```

Expected: FAIL on the new hero copy and missing cinematic shell.

- [x] **Step 3: Update hero copy and section chapter attributes**

Use this hero framing in `index.html`:

```html
<p class="eyebrow"><span class="signal-lamp"></span> SMALL-BUSINESS AI OPERATING SYSTEMS</p>
<h1 id="hero-title">Your people and tools already do the work. <em>Mote Ops helps them work as one.</em></h1>
<p class="hero-lede">Mote Ops finds the operational drag, organizes the relevant context, prepares useful work, and keeps consequential actions behind approval.</p>
```

Add exact chapter attributes:

```html
data-chapter="PRESSURE"
data-chapter="WORKING PROOF"
data-chapter="EVIDENCE"
data-chapter="STUDIO"
data-chapter="METHOD"
data-chapter="START"
```

Use them respectively on `#top`, `#demo-gallery`, `#evidence`, `#mote-ops-studio`, `#method`, and `#start`.

- [x] **Step 4: Add the cinematic shell assets**

Add versioned stylesheet and script tags in `index.html`.

Create `cinematic-shell.js`:

```js
const chapterSections = [...document.querySelectorAll('[data-chapter]')];
let pageFramePending = false;
let pageMotionEnabled = window.moteMotion?.isEnabled() ?? !matchMedia('(prefers-reduced-motion: reduce)').matches;

function updatePageProgress() {
  const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
  document.documentElement.style.setProperty('--page-progress', (scrollY / max).toFixed(4));
  pageFramePending = false;
}

function requestPageProgress() {
  if (pageFramePending || !pageMotionEnabled) return;
  pageFramePending = true;
  requestAnimationFrame(updatePageProgress);
}

const chapterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => entry.target.classList.toggle('is-chapter-visible', entry.isIntersecting));
}, { rootMargin: '-15% 0px -15%', threshold: 0.1 });

chapterSections.forEach((section) => chapterObserver.observe(section));
addEventListener('scroll', requestPageProgress, { passive: true });
addEventListener('resize', requestPageProgress, { passive: true });
document.addEventListener('mote:motionchange', ({ detail }) => {
  pageMotionEnabled = detail.enabled;
  if (!pageMotionEnabled) document.documentElement.style.setProperty('--page-progress', '0');
  else requestPageProgress();
});
updatePageProgress();
```

Create `cinematic-shell.css` with:

```css
:root{--page-progress:0}
[data-chapter]{position:relative}
[data-chapter]::before{content:attr(data-chapter);position:absolute;z-index:3;top:22px;right:clamp(18px,3vw,44px);font:800 .62rem ui-monospace,monospace;letter-spacing:.16em;color:currentColor;opacity:.52}
.workbench-hero{min-height:100svh;align-items:start;padding-top:clamp(96px,12vh,150px)}
.workbench-hero h1{max-width:1280px;font-size:clamp(4rem,9vw,9.5rem);line-height:.84;letter-spacing:-.075em}
.workbench-hero h1 em{display:block;color:var(--forest);font-family:Georgia,serif;font-weight:400}
.owner-story{margin-top:clamp(46px,8vh,100px)}
.owner-scene{transition:opacity .7s ease,transform .7s cubic-bezier(.2,.8,.2,1)}
html[data-motion="on"] .owner-scene:not(.is-active){transform:translateY(36px) scale(.985)}
.is-chapter-visible>.section-heading h2,.is-chapter-visible>.studio-heading h2{transform:none;opacity:1}
.section-heading h2,.studio-heading h2{transform:translateY(24px);opacity:.72;transition:transform .7s cubic-bezier(.2,.8,.2,1),opacity .7s ease}
@media(max-width:760px){.workbench-hero h1{font-size:clamp(3.3rem,16vw,5.5rem)}[data-chapter]::before{top:14px}}
@media(prefers-reduced-motion:reduce){.section-heading h2,.studio-heading h2,.owner-scene{transition:none;transform:none;opacity:1}}
```

Replace `owner-story.js` with the motion-aware controller below. It keeps the existing Care Hub focus handoff, disconnects observation while motion is off, and reconnects without duplicating observers:

```js
const ownerStory = document.querySelector('[data-owner-story]');

if (ownerStory) {
  const scenes = [...ownerStory.querySelectorAll('[data-owner-scene]')];
  const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
  const sceneRatios = new Map(scenes.map((scene) => [scene, 0]));
  let motionEnabled = window.moteMotion?.isEnabled() ?? !motionPreference.matches;
  let observer;

  function setOwnerStoryState(name) {
    ownerStory.dataset.ownerStoryState = name;
    scenes.forEach((scene) => scene.classList.toggle('is-active', scene.dataset.ownerScene === name));
  }

  function observeScenes() {
    if (observer || !motionEnabled || !('IntersectionObserver' in window)) return;
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => sceneRatios.set(entry.target, entry.intersectionRatio));
      const visible = [...sceneRatios.entries()].sort((a, b) => b[1] - a[1])[0];
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
      setOwnerStoryState('pressure');
    }
  }

  document.addEventListener('mote:motionchange', ({ detail }) => syncOwnerMotion(detail.enabled));
  syncOwnerMotion(motionEnabled);

  ownerStory.querySelector('[data-owner-story-handoff]')?.addEventListener('click', () => {
    const heading = document.querySelector('#care-hub-showcase #gallery-title');
    setTimeout(() => {
      heading?.setAttribute('tabindex', '-1');
      heading?.focus();
    }, motionEnabled ? 500 : 0);
  });
}
```

- [x] **Step 5: Run focused and full tests**

Run:

```bash
node --test tests/site-contract.test.mjs tests/cinematic-shell.test.mjs
npm test
npm run build
```

Expected: all tests pass and the build exits 0.

- [x] **Step 6: Commit**

```bash
git add index.html owner-story.css owner-story.js cinematic-shell.css cinematic-shell.js tests/site-contract.test.mjs tests/cinematic-shell.test.mjs
git commit -m "feat: stage Mote Ops as a cinematic operating story"
```

---

### Task 5: Produce one Seedance Mote Ops transition film

**Files:**
- Create: `assets/cinematic/mote-ops-01.mp4`
- Create: `assets/cinematic/mote-ops-01.webp`
- Create: `assets/cinematic/manifest.json`
- Modify: `index.html`
- Modify: `studio.css`
- Modify: `tests/showcase-media.test.mjs`

**Interfaces:**
- Consumes: approved Higgsfield generation access and the Mote Ops anti-slop standard.
- Produces: one silent 8-second 16:9 transition film and poster, used between the owner story and working proof.

- [x] **Step 1: Add the failing media contract**

Add to `tests/showcase-media.test.mjs`:

```js
test('declares one local Mote Ops operating transition film', () => {
  const html = readFileSync(resolve(root, 'index.html'), 'utf8');
  assert.match(html, /assets\/cinematic\/mote-ops-01\.mp4/i);
  assert.match(html, /assets\/cinematic\/mote-ops-01\.webp/i);
  assert.match(html, /autoplay muted loop playsinline/i);
});
```

- [x] **Step 2: Run the test to verify it fails**

Run:

```bash
node --test tests/showcase-media.test.mjs
```

Expected: FAIL because the Mote Ops film is absent.

- [x] **Step 3: Preflight exactly one Seedance generation**

Use the approved prompt:

```text
Documentary-grade over-the-shoulder view of a small-business owner at a real working desk near the end of the day. Begin with ordinary pressure in the environment: a ringing phone, paper notes, a laptop, a monitor, and a calendar, all physically plausible and with no readable screen text. Make one slow stabilized lateral camera move as the owner pauses, reviews a short organized list on the monitor, and places one hand calmly beside a notebook. Natural California window light shifts from cool late afternoon to a warmer practical desk lamp. Restrained cream, charcoal, forest, and copper palette, 40mm lens, realistic materials, subtle human movement, 24fps, silent, 8 seconds, 16:9. No readable text, logos, holograms, glowing AI graphics, floating interfaces, extra fingers, changing furniture, synthetic smile, dramatic transformation effect, or autonomous machine imagery.
```

Run a Seedance 2.0 cost preflight for one 8-second 16:9 result. Do not submit generation until the cost is shown and approved in the current session.

- [x] **Step 4: Generate and review one clip**

After approval, submit one result. Review frames at 0, 2, 4, 6, and 8 seconds for face/hand integrity, geometry, readable generated text, temporal continuity, and Mote Ops palette. If rejected, change one prompt variable and preflight one replacement. Do not batch variants.

- [x] **Step 5: Optimize and integrate the approved film**

Normalize to H.264, 1920 by 1080, no audio, fast start, and produce a 1600 by 900 WebP poster. Record source job, duration, codec, dimensions, file size, and review note in `manifest.json`.

Add a semantic transition figure before `#demo-gallery`:

```html
<figure class="operating-transition" aria-label="Illustrative transition from scattered work to one supervised operating view">
  <video autoplay muted loop playsinline preload="metadata" poster="assets/cinematic/mote-ops-01.webp" data-cinematic-film>
    <source src="assets/cinematic/mote-ops-01.mp4" type="video/mp4">
  </video>
  <figcaption><span>PRESSURE → PREPARED WORK</span><strong>The system prepares. The owner decides.</strong><small>Illustrative Mote Ops scenario using fictional business information.</small></figcaption>
</figure>
```

Register `[data-cinematic-film]` with the page motion system.

- [x] **Step 6: Run media and full tests**

Run:

```bash
node --test tests/showcase-media.test.mjs
npm test
```

Expected: all tests pass.

- [x] **Step 7: Commit**

```bash
git add assets/cinematic index.html studio.css motion-system.js tests/showcase-media.test.mjs
git commit -m "feat: add Mote Ops Seedance operating film"
```

---

### Task 6: Prepare the likeness commercial as a separate approval-gated asset

**Files:**
- Create after approval: `docs/creative/mote-ops-commercial-storyboard.md`
- Create after approval: `assets/commercial/mote-ops-commercial-master.mp4`
- Create after approval: `assets/commercial/mote-ops-commercial-poster.webp`

**Interfaces:**
- Consumes: one to three Mike-provided reference photos from the Higgsfield upload widget and an approved one-off reference element.
- Produces: a 15-to-24-second silent-first brand film; no site integration until Mike approves the rendered master.

- [ ] **Step 1: Confirm the identity path**

Use a one-off Higgsfield reference element for this commercial. Do not train a reusable digital twin unless Mike separately requests it and provides 5-to-20 approved photographs.

- [ ] **Step 2: Write the storyboard before generation**

Create this three-shot structure in `docs/creative/mote-ops-commercial-storyboard.md`:

```markdown
1. PRESSURE, 0–6 seconds: Mike enters a real-feeling small office environment after a busy day. The camera stays observational. No dialogue and no generated screen text.
2. BUILD, 6–14 seconds: close physical details of Mike mapping a workflow, checking a working interface, and testing an approval state. Real hands, paper, keyboard, and screen glow; interface inserts are composited from real site captures, not generated.
3. CONTROL, 14–22 seconds: Mike reviews three prepared decisions, closes the notebook, and looks toward the workspace. End card is real typography added in post: “Mote Ops. Your people and tools already do the work. We help them work as one.”
```

- [ ] **Step 3: Review storyboard and preflight cost**

Present the storyboard, aspect ratios, shot count, voice/no-voice decision, and exact credit cost. Do not generate until Mike explicitly approves this package.

- [ ] **Step 4: Generate one shot at a time**

Use the approved Mike reference element with Seedance 2.0. Review identity, hands, continuity, setting, clothing, and physical plausibility after every shot. Stop after any rejected shot and revise one variable.

- [ ] **Step 5: Assemble with real Mote Ops interface captures and typography**

Generated footage supplies only the filmed environment and Mike's likeness. Real site captures supply every interface. HTML/CSS or post-production graphics supply every word, logo, and end card.

- [ ] **Step 6: Deliver review masters, not a live publish**

Create 16:9 and 9:16 review masters only after the horizontal master is approved. Do not add either commercial to the public website or social channels without a separate publish approval.

---

### Task 7: Verify the integrated candidate and create a private review deployment

**Files:**
- Modify only if verification finds a defect: files changed in Tasks 2 through 5.
- Do not modify: production domain settings.

**Interfaces:**
- Consumes: completed site tasks and approved local media.
- Produces: one separate Vercel review URL and a verification receipt.

- [ ] **Step 1: Run the complete automated gate**

Run:

```bash
npm test
npm run build
git diff --check
```

Expected: zero failures and clean whitespace validation.

- [ ] **Step 2: Verify local desktop behavior**

At 1440 by 1000 verify:

- hero pressure-to-control story;
- Care Hub controls and focus handoff;
- Mote Ops transition film time advances;
- all three Studio studies and links;
- Motion on, Motion off, and restored playback;
- no browser errors or warnings;
- no horizontal overflow.

- [ ] **Step 3: Verify mobile and reduced motion**

At 390 by 844 verify:

- single-column hero and Studio;
- 44-pixel controls;
- no hover dependency;
- reduced-motion starts off;
- explicit Motion on starts visible film playback;
- every poster and link remains available with motion off;
- no horizontal overflow.

- [ ] **Step 4: Deploy a separate review project**

Create or update a Vercel review project that does not change the `moteops.tech` alias. Confirm HTTP 200 for HTML, CSS, JavaScript, posters, and range requests for MP4 media.

- [ ] **Step 5: Review with Mike**

Send the review URL with the exact note: the live `moteops.tech` site is unchanged. Publishing to the production domain requires Mike's explicit approval after reviewing desktop and phone.

- [ ] **Step 6: Commit any verified final correction**

```bash
git add index.html site.css owner-story.css owner-story.js studio.css motion-system.js cinematic-shell.css cinematic-shell.js tests/site-contract.test.mjs tests/motion-system.test.mjs tests/cinematic-shell.test.mjs tests/showcase-media.test.mjs
git commit -m "fix: close cinematic homepage verification findings"
```

Expected: no commit is created when verification requires no correction.
