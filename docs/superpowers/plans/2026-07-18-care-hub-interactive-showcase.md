# Care Hub Interactive Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage's generic demo gallery with a faithful, interactive CC's Care Hub environment that demonstrates a real Mote Ops small-business implementation pattern without overstating client results.

**Architecture:** The homepage will keep its existing static HTML/CSS/JavaScript stack. A new scoped stylesheet and local-only JavaScript module will own the Care Hub environment, while the three existing generic demonstrations move into one collapsed secondary section and continue using `site.js`.

**Tech Stack:** Semantic HTML5, scoped CSS, vanilla JavaScript, Node.js built-in test runner, Playwright browser verification.

## Global Constraints

- Preserve the unrelated uncommitted changes in `site.css` and the approved image assets.
- Use the real Care Hub source in `/Users/michaelmote/Documents/Codex/2026-07-11/yes-the-easiest-way-is-to/work/ccs-care-hub` as the visual and workflow reference.
- Make Care Hub the visible default demonstration; do not embed the protected production URL.
- Use fictional family records only, make no network requests, and never imply measured client outcomes.
- Keep the visitor-facing language focused on business work rather than prototype internals.
- Keep every visible control functional and provide keyboard, focus, reduced-motion, and live-status support.
- At phone width, render a responsive application rather than a scaled desktop screenshot.

---

### Task 1: Lock The Homepage Contract

**Files:**
- Modify: `tests/site-contract.test.mjs`
- Modify: `tests/site-behavior.test.mjs`

**Interfaces:**
- Consumes: Existing `index.html`, `site.js`, and Node test helpers.
- Produces: Failing tests for the Care Hub markup, truthful copy, secondary gallery, and local interaction hooks.

- [ ] **Step 1: Replace the four-equal-demo contract with the primary Care Hub contract**

Add contract assertions that require:

```js
const careShowcase = elementById('care-hub-showcase', 'section').source;
assert.match(careShowcase, /A WORKING SMALL-BUSINESS ENVIRONMENT/i);
assert.match(careShowcase, /Step inside something we built\./i);
assert.match(careShowcase, /Interactive demonstration using fictional family records/i);
for (const label of ['Today', 'Families', 'Modules', 'Integrations', 'Discovery']) {
  assert.match(careShowcase, new RegExp(`>${label}<`, 'i'));
}
for (const metric of ['6 families', '2 open', '3 / 5', '1 review']) {
  assert.match(careShowcase, new RegExp(metric.replace('/', '\\/'), 'i'));
}
```

Require the adaptation bridge copy and four business examples:

```js
for (const phrase of [
  'THE PATTERN TRAVELS',
  'We build around the way your business actually works.',
  'Insurance',
  'Home services',
  'Clinic',
  'Professional office',
]) assert.match(careShowcase, new RegExp(phrase, 'i'));
```

Require a collapsed `<details>` with only the three secondary demos:

```js
const moreExamples = elementById('more-examples', 'details').source;
assert.doesNotMatch(moreExamples.match(/<details\b[^>]*>/i)?.[0] ?? '', /\bopen\b/i);
assert.deepEqual(
  tagsWithRole(moreExamples, 'button', 'tab').map((tag) => attribute(tag, 'data-gallery-demo')),
  ['operator', 'documents', 'leads'],
);
```

- [ ] **Step 2: Add behavior-source assertions**

Read `care-hub-showcase.js` and require the interaction hooks:

```js
const careJs = readFileSync(resolve(root, 'care-hub-showcase.js'), 'utf8');
for (const hook of [
  'data-care-view',
  'data-care-family-tab',
  'data-care-metric',
  'data-care-task',
  'data-care-form',
  'data-care-guide',
  'data-care-modal-close',
]) assert.match(careJs, new RegExp(hook, 'i'));
assert.doesNotMatch(careJs, /\bfetch\s*\(|XMLHttpRequest|WebSocket|localStorage|sessionStorage/i);
```

Update the existing gallery expectations from `['operator', 'documents', 'leads', 'care']` to `['operator', 'documents', 'leads']`.

- [ ] **Step 3: Run tests to verify RED**

Run: `npm test`

Expected: FAIL because `#care-hub-showcase`, `#more-examples`, and `care-hub-showcase.js` do not exist yet.

- [ ] **Step 4: Commit the failing contract**

```bash
git add tests/site-contract.test.mjs tests/site-behavior.test.mjs
git commit -m "test: define Care Hub showcase contract"
```

### Task 2: Build The Faithful Care Hub Environment

**Files:**
- Modify: `index.html`
- Create: `care-hub-showcase.css`

**Interfaces:**
- Consumes: The hooks defined by Task 1 and the approved design specification.
- Produces: Semantic Care Hub workspace markup and scoped responsive styles for `care-hub-showcase.js`.

- [ ] **Step 1: Add the dedicated stylesheet**

Add after `site.css`:

```html
<link rel="stylesheet" href="care-hub-showcase.css?v=20260718">
```

- [ ] **Step 2: Replace the current gallery with the Care Hub showcase**

Create `#care-hub-showcase` with:

```html
<div class="care-showcase-intro">
  <p class="kicker">A WORKING SMALL-BUSINESS ENVIRONMENT</p>
  <h2>Step inside something we built.</h2>
  <p>CC's Care Hub turns scattered enrollment work into one clear place for families, tours, forms, follow-up, and director decisions. Explore the demonstration below.</p>
</div>
<p class="care-showcase-truth">Interactive demonstration using fictional family records. The Care Hub workflow and interface are real; client results are still being measured.</p>
```

Inside the environment add:

- A deep-green navigation rail with CC's Care Hub branding and the five primary view buttons.
- A workspace header, demo-information banner, Today metrics, follow-up queue, director focus, and next-tour card.
- Families sub-navigation for Overview, Pipeline, Tours, Family profiles, Required forms, and Classroom placement.
- Modules, Integrations, and Discovery views that truthfully distinguish built modules from discovery placeholders.
- A hidden accessible guide dialog.

All view containers use `data-care-panel`; all family subviews use `data-care-family-panel`. Only Today is visible initially.

- [ ] **Step 3: Add the adaptation bridge**

Immediately below the environment, add:

```html
<section class="care-adaptation" aria-labelledby="care-adaptation-title">
  <p class="kicker">THE PATTERN TRAVELS</p>
  <h3 id="care-adaptation-title">We build around the way your business actually works.</h3>
  <p>The same approach can organize an insurance office, a home-service company, a clinic, or a professional office without forcing each business into the same software.</p>
</section>
```

Add four concise examples:

- Insurance: client profiles, underwriter requests, and reviewed email drafts.
- Home services: missed calls, job intake, scheduling, and owner approval.
- Clinic: intake, follow-up, records, and supervised next steps.
- Professional office: inboxes, documents, deadlines, and daily priorities.

Add the CTA copy: `Show Mike the part of your business that feels scattered.`

- [ ] **Step 4: Move generic demonstrations into a collapsed secondary section**

Wrap the existing operator, document, and lead tabs/panels in:

```html
<details class="more-examples" id="more-examples">
  <summary>More working examples <span>Phone briefs, document review, and lead intake</span></summary>
  <!-- Existing three-tab gallery -->
</details>
```

Remove the old simplified Care Hub tab and panel. Change the evidence link to `href="#care-hub-showcase"` and remove `data-open-demo="care"`.

- [ ] **Step 5: Add scoped visual styling**

Create `care-hub-showcase.css` with all selectors rooted at `.care-showcase`. Define:

```css
.care-showcase {
  --care-deep: #0e4b3a;
  --care-green: #145743;
  --care-paper: #fffdf8;
  --care-cream: #f6f1e8;
  --care-line: #e4dccc;
  --care-coral: #e66b55;
  --care-peach: #f8d9c7;
  --care-sage: #dfead8;
  --care-blue: #dceff3;
  --care-yellow: #f8e5a4;
}
```

Reproduce the reference composition: fixed-width rail within the demo frame, cream workspace, editorial serif headings, four metric cards, queue/focus split, rounded cards, restrained shadows, and coral/sage/blue/gold accents.

At `max-width: 900px`, move primary navigation into a horizontal strip and use two metric columns. At `max-width: 620px`, stack content, retain two metric columns, keep controls at least 44px tall, and prevent horizontal page overflow. Add `:focus-visible` and `prefers-reduced-motion: reduce`.

- [ ] **Step 6: Run contract tests**

Run: `npm test`

Expected: Markup and asset tests pass; behavior tests may still fail because the new JavaScript does not exist.

- [ ] **Step 7: Commit the environment**

```bash
git add index.html care-hub-showcase.css
git commit -m "feat: make Care Hub the primary homepage demonstration"
```

### Task 3: Wire Every Care Hub Interaction

**Files:**
- Create: `care-hub-showcase.js`
- Modify: `site.js`
- Modify: `index.html`

**Interfaces:**
- Consumes: `data-care-*` controls and panels from Task 2.
- Produces: Local-only view switching, task/form state, guide dialog behavior, and accessible status announcements.

- [ ] **Step 1: Load the new script**

Add before the closing body tag:

```html
<script src="care-hub-showcase.js?v=20260718" defer></script>
```

- [ ] **Step 2: Implement primary view and family subview routing**

Create `care-hub-showcase.js` with:

```js
const careRoot = document.querySelector('[data-care-root]');

function setCareView(view, familyTab) {
  // Update data-care-view buttons, primary panels, heading copy,
  // and optionally activate the requested Families subview.
}

function setFamilyTab(tab) {
  // Update data-care-family-tab buttons and data-care-family-panel elements.
}
```

Metric cards route to Pipeline, Tours, Required forms, and Classroom placement. The next-tour control routes to Tours. The director-focus control routes to Families Overview.

- [ ] **Step 3: Implement local task and form state**

Each `[data-care-task]` toggles completion styling, `aria-pressed`, its visible action label, the open-task count, and `[data-care-status]`.

Each `[data-care-form]` toggles its completion state, updates the displayed completed count, and announces the change. No state leaves the page and no network API is called.

- [ ] **Step 4: Implement guide dialog accessibility**

Open `[data-care-guide-dialog]` from `[data-care-guide]`, focus the close control, close from the close button or Escape, restore focus to the opener, and keep `aria-hidden` synchronized.

- [ ] **Step 5: Remove obsolete Care Hub gallery code**

In `site.js`, change:

```js
const DEMO_GALLERY = ['operator', 'documents', 'leads'];
```

Delete the old `[data-care-tab]`, `[data-care-task]`, and `[data-care-form]` handler block so only `care-hub-showcase.js` owns Care Hub behavior.

- [ ] **Step 6: Run the complete test suite**

Run: `npm test`

Expected: PASS with zero failures.

- [ ] **Step 7: Commit behavior**

```bash
git add care-hub-showcase.js site.js index.html
git commit -m "feat: add interactive Care Hub workflow"
```

### Task 4: Verify The Visitor Experience

**Files:**
- Modify only if verification reveals a defect: `index.html`, `care-hub-showcase.css`, `care-hub-showcase.js`, `site.js`, `tests/*.test.mjs`

**Interfaces:**
- Consumes: Completed static homepage and local preview server.
- Produces: Verified desktop and phone experiences with no fake controls, overflow, console errors, or network requests.

- [ ] **Step 1: Run automated checks**

Run:

```bash
npm test
npm run build
```

Expected: both commands exit `0`.

- [ ] **Step 2: Start a local preview**

Run:

```bash
python3 -m http.server 8008
```

Expected: homepage responds at `http://localhost:8008/?v=20260718`.

- [ ] **Step 3: Verify desktop behavior at 1440x900**

Check:

- Care Hub is the immediate default demonstration.
- Today, Families, Modules, Integrations, and Discovery all switch visibly.
- All six family subviews switch visibly.
- Metrics route to the matching family subview.
- Queue tasks and form controls update their counts and status text.
- Guide opens, closes by button and Escape, and restores focus.
- More examples starts collapsed and retains all three existing demo interactions.
- Console has no errors and no Care Hub interaction triggers a network request.

- [ ] **Step 4: Verify phone behavior at 390x844**

Check:

- No horizontal page overflow.
- The Care Hub brand, demo truth, heading, and metrics are readable without zooming.
- Navigation is reachable and controls are at least 44px tall.
- Metrics remain a compact two-column grid.
- Queue, focus, tour, pipeline, forms, and adaptation cards stack cleanly.
- The page looks like a responsive application, not a scaled desktop screenshot.

- [ ] **Step 5: Fix only observed defects and rerun verification**

For each defect, first add or tighten a failing automated assertion when practical, then make the smallest correction and rerun `npm test`.

- [ ] **Step 6: Commit verified corrections**

```bash
git add index.html care-hub-showcase.css care-hub-showcase.js site.js tests
git commit -m "fix: polish Care Hub showcase responsiveness"
```

- [ ] **Step 7: Record the rollback point**

Report the pre-change commit `8965f28` and the final feature commit so the previous homepage can be restored immediately with a normal Git revert rather than destructive history rewriting.
