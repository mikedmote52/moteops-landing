# Small-Business Chaos-to-Control Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the artificial composite homepage hero with a credible, responsive chaos-to-control story that ends in the real interactive CC's Care Hub demonstration.

**Architecture:** Keep the static homepage and isolate the feature in `owner-story.css` and `owner-story.js`. Use one generated editorial photograph as the human first state, semantic HTML for every readable operational signal, and a local-only scroll/focus controller for the connection and Care Hub handoff.

**Tech Stack:** Static HTML, scoped CSS, vanilla JavaScript, Node test runner, built-in image generation, local HTTP preview.

## Global Constraints

- Keep the current hero positioning and primary booking action.
- Use a normal small-business office and avoid futuristic AI imagery.
- Keep readable notification labels in HTML, not inside the generated image.
- Preserve human approval boundaries and make no live-connection or measured-outcome claims.
- Use the existing interactive Care Hub as the final proof state.
- Do not modify the user-owned dirty `site.css` or unrelated approved CC's image files.
- Retain the current hero assets and Git history for immediate rollback.
- Support `prefers-reduced-motion: reduce`.
- Permit no horizontal page overflow at 390 by 844.

---

### Task 1: Define The Hero Story Contract

**Files:**
- Modify: `tests/site-contract.test.mjs`
- Test: `tests/site-contract.test.mjs`

**Interfaces:**
- Consumes: Existing `elementById('top', 'section')` test helper.
- Produces: Required markup hooks `data-owner-story`, `data-owner-scene`, `data-owner-signal`, `data-owner-source`, and `data-owner-story-handoff`.

- [ ] **Step 1: Replace the old composite-image contract with failing story assertions**

```js
test('shows a truthful small-business chaos-to-control story', () => {
  const hero = elementById('top', 'section').source;
  assert.match(hero, /data-owner-story/i);
  assert.match(hero, /assets\/small-business-owner-overwhelmed-v1\.webp/i);
  for (const pressure of ['4 missed calls', '37 unread emails', '6 unanswered texts', '2 calendar conflicts', '1 overdue invoice', 'Spreadsheet needs review']) {
    assert.match(hero, new RegExp(pressure, 'i'));
  }
  for (const source of ['Calls \\+ texts', 'Email', 'Calendar', 'Files \\+ spreadsheets', 'Finance']) {
    assert.match(hero, new RegExp(source, 'i'));
  }
  assert.match(hero, /organize incoming work/i);
  assert.match(hero, /prepare useful next steps/i);
  assert.match(hero, /hold consequential actions for approval/i);
  assert.match(hero, /This is what “one calm place” looks like for CC's Learning Center\./i);
  assert.match(hero, /href="#care-hub-showcase"/i);
  assert.match(hero, /Illustrative scenario using fictional business information\./i);
  assert.doesNotMatch(hero, /moteops-transformation-hero-(?:mobile-)?v1\.png/i);
});
```

- [ ] **Step 2: Run the focused contract test and verify RED**

Run: `node --test --test-name-pattern="chaos-to-control story" tests/site-contract.test.mjs`

Expected: FAIL because `data-owner-story` and the new asset are absent.

- [ ] **Step 3: Add asset, stylesheet, script, truth, and rollback assertions**

```js
const ownerCss = existsSync(resolve(root, 'owner-story.css'))
  ? readFileSync(resolve(root, 'owner-story.css'), 'utf8')
  : '';

test('isolates and preserves the owner story presentation', () => {
  assert.ok(existsSync(resolve(root, 'assets/small-business-owner-overwhelmed-v1.webp')));
  assert.ok(existsSync(resolve(root, 'assets/moteops-transformation-hero-v1.png')));
  assert.match(html, /owner-story\.css\?v=20260719/i);
  assert.match(html, /owner-story\.js\?v=20260719/i);
  assert.match(ownerCss, /prefers-reduced-motion:\s*reduce/i);
  assert.match(ownerCss, /@media\s*\(max-width:\s*760px\)/i);
});
```

- [ ] **Step 4: Run both focused tests and verify RED**

Run: `node --test --test-name-pattern="owner story|chaos-to-control story" tests/site-contract.test.mjs`

Expected: FAIL because the isolated files and generated asset do not exist.

- [ ] **Step 5: Commit the failing contract**

```bash
git add tests/site-contract.test.mjs
git commit -m "test: define owner transformation story"
```

### Task 2: Create The Human First-State Asset And Semantic Story

**Files:**
- Create: `assets/small-business-owner-overwhelmed-v1.webp`
- Create: `owner-story.css`
- Modify: `index.html`
- Test: `tests/site-contract.test.mjs`

**Interfaces:**
- Consumes: Task 1's markup hooks and copy assertions.
- Produces: A responsive three-state `data-owner-story` component and one versioned editorial photograph.

- [ ] **Step 1: Generate the editorial photograph**

Use built-in image generation with this production prompt:

```text
Use case: photorealistic-natural
Asset type: wide website hero photograph
Primary request: A candid editorial photograph from behind and slightly above an overwhelmed small-business owner at a real desk. The owner is looking at one primary desktop monitor and one laptop; a smartphone lies prominently on the desk with its screen visibly lit as an incoming call. Ordinary papers, a notebook, receipts, and a coffee cup suggest a busy working day without looking staged.
Scene/backdrop: modest independent-business back office, natural daylight, warm practical materials, lived-in but credible
Subject: one adult small-business owner, seen from behind with face not identifiable
Style/medium: premium documentary business photography, natural texture, realistic optics, no CGI
Composition/framing: landscape 16:10, owner centered low, monitor left-center, phone clearly visible in lower foreground, open negative space around screen and desk edges for later HTML overlays
Lighting/mood: late-morning window light, pressured but not bleak
Color palette: warm cream, charcoal, muted forest green, restrained copper
Constraints: no readable text in screens; generic email rows and spreadsheet shapes only; one person; anatomically correct hands; realistic phone; realistic cables and desk objects
Avoid: futuristic control room, holograms, glowing AI graphics, branded software, readable generated text, multiple workers, luxury office, catastrophe imagery, split-screen montage, watermark
```

Inspect the generated result, copy the selected image into `assets/`, and convert it to WebP if necessary.

- [ ] **Step 2: Replace the old `hero-transformation` figure with semantic story markup**

The markup must include:

```html
<section class="owner-story" data-owner-story aria-label="From scattered work to one calm operating view">
  <article class="owner-scene is-active" data-owner-scene="pressure">
    <div class="owner-photo">
      <img src="assets/small-business-owner-overwhelmed-v1.webp" alt="An overwhelmed small-business owner seen from behind at a desk with a ringing phone, computer, laptop, paperwork, and unfinished work.">
      <ul class="owner-signals" aria-label="Common pressures competing for the owner's attention">
        <li data-owner-signal="calls"><strong>4</strong> missed calls</li>
        <li data-owner-signal="email"><strong>37</strong> unread emails</li>
        <li data-owner-signal="texts"><strong>6</strong> unanswered texts</li>
        <li data-owner-signal="calendar"><strong>2</strong> calendar conflicts</li>
        <li data-owner-signal="invoice"><strong>1</strong> overdue invoice</li>
        <li data-owner-signal="sheet">Spreadsheet needs review</li>
      </ul>
    </div>
    <div class="owner-scene-copy"><span>01 · THE BUSINESS IS EVERYWHERE</span><h2>Every tool is asking for your attention.</h2></div>
  </article>
  <article class="owner-scene" data-owner-scene="connect">
    <!-- five semantic source items, Mote Ops processing rail, and three bounded functions -->
  </article>
  <article class="owner-scene" data-owner-scene="control">
    <span>03 · ONE CALM PLACE</span>
    <h2>This is what “one calm place” looks like for CC's Learning Center.</h2>
    <a href="#care-hub-showcase" data-owner-story-handoff>Explore the Care Hub <span aria-hidden="true">↓</span></a>
  </article>
  <p class="owner-story-truth">Illustrative scenario using fictional business information. Connections are configured around each client's approved systems and boundaries.</p>
</section>
```

- [ ] **Step 3: Add the isolated stylesheet and script references**

Add after `site.css`:

```html
<link rel="stylesheet" href="owner-story.css?v=20260719">
```

Add with the existing deferred scripts:

```html
<script src="owner-story.js?v=20260719" defer></script>
```

- [ ] **Step 4: Implement responsive presentation in `owner-story.css`**

Use scoped `.owner-story` selectors. Desktop presents one contained editorial frame with layered HTML signals and a clear connection rail. At `max-width: 760px`, use stacked scenes, keep labels at least 12px, controls at least 44px, and prevent any fixed-width overflow. Under reduced motion, remove transforms and transitions.

- [ ] **Step 5: Run the contract tests and verify GREEN**

Run: `node --test tests/site-contract.test.mjs`

Expected: all contract tests pass.

- [ ] **Step 6: Commit the visual story**

```bash
git add index.html owner-story.css assets/small-business-owner-overwhelmed-v1.webp tests/site-contract.test.mjs
git commit -m "feat: add human chaos-to-control hero"
```

### Task 3: Add Progressive Story And Care Hub Handoff Behavior

**Files:**
- Create: `owner-story.js`
- Modify: `tests/site-behavior.test.mjs`
- Test: `tests/site-behavior.test.mjs`

**Interfaces:**
- Consumes: `[data-owner-story]`, `[data-owner-scene]`, and `[data-owner-story-handoff]`.
- Produces: `setOwnerStoryState(name)`, intersection-driven active state, and accessible Care Hub focus handoff.

- [ ] **Step 1: Write failing behavior tests**

```js
const ownerJsPath = resolve(root, 'owner-story.js');
const ownerJs = existsSync(ownerJsPath) ? readFileSync(ownerJsPath, 'utf8') : '';

test('progresses the owner story locally and respects reduced motion', () => {
  assert.ok(ownerJs, 'missing owner-story.js');
  assert.match(ownerJs, /function\s+setOwnerStoryState\s*\(\s*name\s*\)/i);
  assert.match(ownerJs, /IntersectionObserver/i);
  assert.match(ownerJs, /matchMedia\s*\(\s*['"]\(prefers-reduced-motion:\s*reduce\)['"]\s*\)/i);
  assert.match(ownerJs, /classList\.toggle\s*\(\s*['"]is-active['"]/i);
  assert.doesNotMatch(ownerJs, /\bfetch\s*\(|XMLHttpRequest|WebSocket|EventSource|sendBeacon|localStorage|sessionStorage|indexedDB/i);
});

test('hands focus from the story into the Care Hub', () => {
  assert.match(ownerJs, /data-owner-story-handoff/i);
  assert.match(ownerJs, /care-hub-showcase/i);
  assert.match(ownerJs, /gallery-title/i);
  assert.match(ownerJs, /\.focus\s*\(\s*\)/i);
});
```

- [ ] **Step 2: Run focused behavior tests and verify RED**

Run: `node --test --test-name-pattern="owner story|Care Hub" tests/site-behavior.test.mjs`

Expected: FAIL because `owner-story.js` does not exist.

- [ ] **Step 3: Implement the local controller**

Implement:

```js
const ownerStory = document.querySelector('[data-owner-story]');

if (ownerStory) {
  const scenes = [...ownerStory.querySelectorAll('[data-owner-scene]')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setOwnerStoryState(name) {
    ownerStory.dataset.ownerStoryState = name;
    scenes.forEach((scene) => scene.classList.toggle('is-active', scene.dataset.ownerScene === name));
  }

  if (!reducedMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting)
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
```

- [ ] **Step 4: Run the focused behavior tests and verify GREEN**

Run: `node --test --test-name-pattern="owner story|Care Hub" tests/site-behavior.test.mjs`

Expected: all focused tests pass.

- [ ] **Step 5: Run the complete automated suite**

Run: `npm test && npm run build && git diff --check`

Expected: all tests pass, static build succeeds, and diff check emits no output.

- [ ] **Step 6: Commit behavior**

```bash
git add owner-story.js tests/site-behavior.test.mjs index.html
git commit -m "feat: animate owner story and hand off to Care Hub"
```

### Task 4: Visual And Interaction Verification

**Files:**
- Modify only if verification reveals a defect: `owner-story.css`, `owner-story.js`, `index.html`, relevant tests

**Interfaces:**
- Consumes: Complete local homepage at `http://localhost:8008/?v=20260719`.
- Produces: Verified desktop and phone experience with no theater or overflow.

- [ ] **Step 1: Start or confirm the local preview**

Run: `curl -I http://localhost:8008/`

Expected: `HTTP/1.0 200 OK`. If absent, run `python3 -m http.server 8008` from the repository root.

- [ ] **Step 2: Verify desktop rendering at 1440 by 900**

Check:

- owner is credibly photographed from behind
- phone appears to be ringing
- all six pressure signals are readable and do not cover the owner's head
- connection layer reduces five tools into three bounded functions
- final state points into the real Care Hub
- no generated text artifacts are visible
- no browser console errors

- [ ] **Step 3: Verify phone rendering at 390 by 844**

Check:

- all three states stack in story order
- labels are readable without zoom
- no horizontal overflow
- the owner and ringing phone remain visible in the crop
- `Explore the Care Hub` is at least 44 pixels high
- the existing Care Hub remains usable

- [ ] **Step 4: Exercise the handoff**

Activate `Explore the Care Hub`.

Expected: the browser navigates to `#care-hub-showcase` and keyboard focus moves to `#gallery-title`.

- [ ] **Step 5: Verify reduced-motion presentation**

Emulate `prefers-reduced-motion: reduce`.

Expected: all information remains visible and no state depends on animation.

- [ ] **Step 6: Re-run final evidence**

Run: `npm test && npm run build && git diff --check && git status --short`

Expected: tests and build pass; only known unrelated user changes remain outside committed feature files.

- [ ] **Step 7: Commit any verification fixes**

```bash
git add owner-story.css owner-story.js index.html tests/site-contract.test.mjs tests/site-behavior.test.mjs
git commit -m "fix: polish owner story across desktop and phone"
```
