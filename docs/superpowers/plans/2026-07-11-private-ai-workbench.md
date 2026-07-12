# Private AI Workbench Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild moteops.tech as a distinctive Operator's Workbench that explains and demonstrates private AI systems, local LLMs, phone access, supervised workflows, and client control centers without overstating current proof.

**Architecture:** Keep the static HTML/CSS/JavaScript deployment and extend it with one browser-only AIOS route model. Semantic HTML contains the complete story and evidence labels; JavaScript controls only synthetic state transitions; CSS supplies the workbench art direction and responsive compositions. Existing lead, Care Hub, pricing, proof, and contact behavior remain intact.

**Tech Stack:** Static HTML5, CSS custom properties and responsive layout, vanilla JavaScript, Node.js built-in test runner, GitHub Pages.

## Global Constraints

- Production colors exclude blue, indigo, purple, cyan, aqua, and turquoise.
- No gradients, glassmorphism, glowing orbs, decorative AI brains, generic SaaS dashboards, or uniform rounded-card grids.
- No public request may connect to Mike's Mac, Ollama endpoint, Voice OS endpoint, private bridge artifacts, or client data.
- Every demonstration uses synthetic data and labels that fact visibly.
- Consequential actions remain human-approved in copy and interaction design.
- `qwen3-coder:30b` and `qwen3:14b` are described only as Mike's verified current local installation, never as universal client requirements.
- The CC's real control center stays protected and is linked only as “Owner access — sign-in required.”
- All controls must perform visible state changes and announce those changes accessibly.

---

### Task 1: Lock the Product Story and Claim Boundaries in Tests

**Files:**
- Modify: `tests/site-contract.test.mjs`
- Modify: `tests/site-behavior.test.mjs`

**Interfaces:**
- Consumes: Existing `index.html` and `site.js` as UTF-8 strings.
- Produces: Failing contracts for the new HTML sections and JavaScript state controller.

- [ ] **Step 1: Replace the legacy hero contract and add the AIOS architecture contract**

Add these tests to `tests/site-contract.test.mjs`, replacing the current hero-specific assertions that require the after-hours headline:

```js
test('leads with the private AI system promise in plain language', () => {
  assert.equal((html.match(/<h1\b/gi) ?? []).length, 1);
  assert.match(html, /build private AI systems around the way your business already works/i);
  assert.match(html, /phone/i);
  assert.match(html, /email/i);
  assert.match(html, /files/i);
  assert.match(html, /human approval/i);
});

test('shows all five layers of the private AI operating system', () => {
  assert.match(html, /id="aios-workbench"/);
  for (const layer of ['Inputs', 'Context', 'Intelligence', 'Control', 'Outputs']) {
    assert.match(html, new RegExp(`data-system-layer="${layer.toLowerCase()}"`, 'i'));
  }
  assert.match(html, /What needs my attention today/i);
  assert.match(html, /Synthetic demonstration/i);
  assert.match(html, /human-approved/i);
});

test('states current local-model evidence without making it a universal requirement', () => {
  assert.match(html, /qwen3-coder:30b/);
  assert.match(html, /qwen3:14b/);
  assert.match(html, /Mike.s current Mac installation/i);
  assert.match(html, /configured per client/i);
  assert.doesNotMatch(html, /every client (?:gets|requires|needs) (?:a )?local (?:LLM|model)/i);
});

test('publishes installable systems as equipment plates', () => {
  assert.match(html, /id="systems"/);
  for (const system of ['Private AI Control Center', 'Local LLM Workstation', 'Phone and Voice Operator', 'Operational Memory', 'Supervised Customer Workflow', 'Client Workspace']) {
    assert.match(html, new RegExp(system, 'i'));
  }
  assert.match(html, /id="operator-day"/);
  assert.match(html, /7:00 AM/);
  assert.match(html, /4:45 PM/);
});
```

- [ ] **Step 2: Add privacy and palette contracts**

Append:

```js
test('does not expose private local services or production client data', () => {
  assert.doesNotMatch(html, /(?:localhost|127\.0\.0\.1|0\.0\.0\.0):(?:11434|8787)/i);
  assert.doesNotMatch(html, /api\/tags|token=/i);
  assert.match(html, /No live connection to Mike.s Mac/i);
});

test('uses the non-blue workbench palette', () => {
  const css = readFileSync(resolve(root, 'site.css'), 'utf8');
  for (const token of ['--bone', '--soot', '--forest', '--copper', '--signal']) {
    assert.match(css, new RegExp(token));
  }
  assert.doesNotMatch(css, /#5046e5|#3328b8|#149eb5/i);
  assert.doesNotMatch(css, /linear-gradient|radial-gradient/i);
});
```

- [ ] **Step 3: Add AIOS behavior contracts**

Append to `tests/site-behavior.test.mjs`:

```js
test('routes synthetic requests through the five AIOS layers', () => {
  assert.match(js, /systemRouteButtons/);
  assert.match(js, /setSystemRoute/);
  assert.match(js, /SYSTEM_ROUTES/);
  assert.match(js, /data-system-layer/);
  assert.match(js, /data-system-evidence/);
});

test('supports approval and reset without contacting a live service', () => {
  assert.match(js, /data-system-approve/);
  assert.match(js, /data-system-reset/);
  assert.match(js, /Synthetic route approved/i);
  assert.doesNotMatch(js, /fetch\s*\(|XMLHttpRequest|WebSocket/);
});
```

- [ ] **Step 4: Run the tests and verify RED**

Run: `npm test`

Expected: the new workbench tests fail because `#aios-workbench`, the five layers, palette tokens, and `setSystemRoute` do not exist. Existing demo tests remain green.

- [ ] **Step 5: Commit the failing contracts**

```bash
git add tests/site-contract.test.mjs tests/site-behavior.test.mjs
git commit -m "test: define private AI workbench contracts"
```

---

### Task 2: Recompose the Page Around the Workbench Story

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: Existing lead demo, Care Hub demo, pricing, proof, fit, about, FAQ, and contact markup.
- Produces: Semantic `#aios-workbench`, `#systems`, and `#operator-day` sections plus updated navigation and hero.

- [ ] **Step 1: Replace the header navigation and hero**

Use this content structure at the top of `index.html`:

```html
<nav aria-label="Primary navigation">
  <a href="#aios-workbench">The system</a>
  <a href="#systems">What we install</a>
  <a href="#working-demos">Working demos</a>
  <a href="#pricing">Start here</a>
  <a href="#proof">Evidence</a>
</nav>

<section class="hero workbench-hero" aria-labelledby="hero-title">
  <div class="hero-copy">
    <p class="eyebrow"><span class="signal-lamp"></span> PRIVATE AI SYSTEMS FOR SMALL BUSINESS</p>
    <h1 id="hero-title">We build private AI systems around the way your business already works.</h1>
    <p class="hero-lede">Connect the phone, email, files, policies, and software you already use to a supervised operating layer—with local models where they earn their place and human approval where judgment matters.</p>
    <div class="hero-actions">
      <a class="button" href="#aios-workbench">Trace a request through the system <span aria-hidden="true">↓</span></a>
      <a class="text-link" href="https://calendly.com/mikedmote/30min" target="_blank" rel="noopener noreferrer">Book a fit call <span aria-hidden="true">↗</span></a>
    </div>
  </div>
  <div class="hero-system-plate" aria-label="System overview">
    <span class="plate-stamp">ASSEMBLED FOR THE WORK BETWEEN YOUR TOOLS</span>
    <div class="hero-inputs"><span>Phone</span><span>Email</span><span>Files</span></div>
    <div class="hero-core"><small>PRIVATE OPERATING LAYER</small><strong>Context + models + rules</strong><em>Human approval stays in circuit</em></div>
    <div class="hero-outputs"><span>Owner brief</span><span>Control center</span><span>Voice operator</span></div>
  </div>
</section>
```

- [ ] **Step 2: Add the interactive AIOS workbench section before the existing demos**

Create `#aios-workbench` with:

```html
<section class="system-section section-pad" id="aios-workbench" aria-labelledby="system-title">
  <div class="workbench-heading">
    <p class="kicker">PLATE 01 · TRACE THE SIGNAL</p>
    <h2 id="system-title">See what happens between a question and a useful answer.</h2>
    <p>Select a synthetic request. No live connection to Mike's Mac, local models, or client systems is made.</p>
  </div>
  <div class="system-console">
    <div class="system-requests" role="tablist" aria-label="Sample requests">
      <button type="button" role="tab" aria-selected="true" data-system-route="brief">What needs my attention today?</button>
      <button type="button" role="tab" aria-selected="false" data-system-route="private-files">Review these private files</button>
      <button type="button" role="tab" aria-selected="false" data-system-route="follow-up">Prepare the next follow-up</button>
    </div>
    <ol class="signal-path">
      <li data-system-layer="inputs"><small>01 · INPUTS</small><strong data-system-layer-title>Phone request</strong><p data-system-layer-copy>The owner asks from a secure phone interface.</p></li>
      <li data-system-layer="context"><small>02 · CONTEXT</small><strong>Operating memory</strong><p>Canonical documents and current project state are attached.</p></li>
      <li data-system-layer="intelligence"><small>03 · INTELLIGENCE</small><strong>Task-appropriate model</strong><p data-system-model>A local model handles the synthetic private-file task.</p></li>
      <li data-system-layer="control"><small>04 · CONTROL</small><strong>Rules and permissions</strong><p>Boundaries, audit state, and approval requirements are applied.</p></li>
      <li data-system-layer="outputs"><small>05 · OUTPUTS</small><strong data-system-output>Owner brief</strong><p>A visible result waits for the owner where judgment is required.</p></li>
    </ol>
    <aside class="evidence-log" data-system-evidence aria-live="polite">
      <span class="plate-stamp">SYNTHETIC DEMONSTRATION</span>
      <h3>Route evidence</h3>
      <p data-system-status>Ready to trace the morning-brief request.</p>
      <dl><div><dt>Current installation</dt><dd>Ollama with qwen3-coder:30b and qwen3:14b on Mike's Mac</dd></div><div><dt>Client installation</dt><dd>Configured per client after privacy, task, and hardware review</dd></div></dl>
      <button type="button" data-system-approve>Approve sample output</button>
      <button type="button" data-system-reset>Reset route</button>
    </aside>
  </div>
</section>
```

- [ ] **Step 3: Add the equipment plates and operator-day sections**

Create `#systems` containing six numbered `<article class="equipment-plate">` elements. Each article must have four labeled lines: `Problem`, `Installed`, `Human-owned`, and `Evidence`. Use the six system names from the specification.

Create `#operator-day` containing four `<li>` entries at 7:00 AM, 10:15 AM, 1:30 PM, and 4:45 PM. Add this disclaimer verbatim: `Illustrative composite—not a claim that every event runs unattended.`

- [ ] **Step 4: Group and relabel the existing demos**

Wrap the existing lead and Care Hub sections in a shared `<div id="working-demos">` region with an introductory heading: `Two businesses. One supervised pattern. Different installations.` Preserve every existing `data-*` hook and protected Care Hub link.

- [ ] **Step 5: Update supporting copy without changing commercial facts**

Update symptoms, proof, FAQ, and closing copy to refer to the larger private-system offer. Preserve all four prices, the audit-first path, the leave-it-alone verdict, the real-client/demo-data qualification, and Mike's two-audits-per-month capacity.

- [ ] **Step 6: Run contract tests**

Run: `node --test tests/site-contract.test.mjs`

Expected: the new content contracts pass except the palette contract; existing Care Hub, pricing, proof, contact, and accessibility contracts pass.

- [ ] **Step 7: Commit the content architecture**

```bash
git add index.html tests/site-contract.test.mjs
git commit -m "feat: reframe site around private AI systems"
```

---

### Task 3: Implement the Operator's Workbench Design System

**Files:**
- Modify: `site.css`

**Interfaces:**
- Consumes: Semantic classes and `data-system-layer` hooks from Task 2.
- Produces: Non-blue visual system, responsive AIOS signal path, equipment plates, and mobile operator timeline.

- [ ] **Step 1: Replace root tokens and global surfaces**

Start `site.css` with:

```css
:root {
  --bone:#eee5d1;
  --paper:#f7f0df;
  --soot:#171713;
  --ink:#292820;
  --forest:#173b30;
  --forest-2:#285747;
  --copper:#9b552f;
  --signal:#d94b24;
  --brass:#b7ad43;
  --muted:#6d695d;
  --rule:#bcb29c;
  --shadow:8px 9px 0 rgba(23,23,19,.12);
}
```

Remove the Google Font import and use a deliberate system/editorial stack: `Arial Narrow`, `Helvetica Neue`, sans-serif for headings; `Georgia`, serif for editorial copy; `ui-monospace`, `SFMono-Regular`, monospace for technical labels.

- [ ] **Step 2: Build the workbench primitives**

Implement square/lightly softened panels, 1–2px ledger rules, stamped labels with rotated borders, physical-looking controls, and paper grain using a small CSS repeating pattern rather than an image or gradient. Do not use `linear-gradient` or `radial-gradient`; use borders, pseudo-elements, and solid fills.

Required selectors:

```css
.workbench-hero {}
.hero-system-plate {}
.plate-stamp {}
.system-console {}
.system-requests {}
.signal-path {}
.signal-path [data-system-layer] {}
.signal-path [data-system-layer].is-active {}
.evidence-log {}
.equipment-plate {}
.operator-day {}
```

- [ ] **Step 3: Restyle existing demonstrations without changing behavior**

Map the lead demo and Care Hub demo to the same visual grammar: ruled headers, plate numbers, forest control surfaces, copper connectors, and signal-orange actions. Retain clear status colors and WCAG AA contrast. Do not hide text behind texture or decorative handwriting.

- [ ] **Step 4: Build mobile-first alternate compositions**

At `max-width: 760px`:

- Stack the hero system plate as inputs → core → outputs.
- Render `.signal-path` as a vertical path with only `.is-active` expanded; inactive layers keep their title visible.
- Make route controls horizontally scrollable with visible labels.
- Render equipment plates in one column.
- Turn `.operator-day` into a vertical ledger.
- Maintain 44×44px minimum interactive targets.

- [ ] **Step 5: Add accessibility and print rules**

Keep `:focus-visible`, `prefers-reduced-motion: reduce`, and print styles. Reduced motion must disable route pulses while keeping the final state visible.

- [ ] **Step 6: Run the palette and complete contract tests**

Run: `npm test`

Expected: all contract tests pass except the JavaScript AIOS behavior tests.

- [ ] **Step 7: Commit the workbench visual system**

```bash
git add site.css
git commit -m "style: build operator workbench design system"
```

---

### Task 4: Implement the Synthetic AIOS Route Controller

**Files:**
- Modify: `site.js`

**Interfaces:**
- Consumes: `[data-system-route]`, `[data-system-layer]`, `[data-system-evidence]`, `[data-system-status]`, `[data-system-approve]`, and `[data-system-reset]`.
- Produces: `setSystemRoute(routeName)`, deterministic five-layer state, approval/reset behavior, and live-region announcements.

- [ ] **Step 1: Define the route data**

Add:

```js
const SYSTEM_ROUTES = {
  brief: {
    input: 'Phone request',
    inputCopy: 'The owner asks what needs attention from the secure phone interface.',
    model: 'Current project state is summarized with the configured task model.',
    output: 'Owner brief',
    ready: 'Morning-brief route traced. The sample output is waiting for owner review.'
  },
  'private-files': {
    input: 'Selected private files',
    inputCopy: 'The owner selects a bounded set of documents for local review.',
    model: 'The sample task routes to a local model; no file leaves the demonstration.',
    output: 'Private review notes',
    ready: 'Private-file route traced. The synthetic notes remain local to this page.'
  },
  'follow-up': {
    input: 'Open customer item',
    inputCopy: 'A supervised queue surfaces one incomplete customer follow-up.',
    model: 'A task-appropriate model prepares a draft using the sample policy context.',
    output: 'Approval-ready draft',
    ready: 'Follow-up route traced. The sample draft is waiting for owner approval.'
  }
};
```

- [ ] **Step 2: Implement deterministic route switching**

Add `systemRouteButtons`, `systemLayers`, and `systemStatus` queries. Implement `setSystemRoute(routeName)` to update tab selection, input title/copy, model explanation, output title, evidence status, and `.is-active` layer classes. All five layers should become active in order via CSS animation; with reduced motion they become active immediately.

- [ ] **Step 3: Implement approval and reset**

The approval button changes only the local demo state and announces: `Synthetic route approved. Nothing was sent and no live system was changed.` Reset calls `setSystemRoute('brief')` and announces that the workbench was reset.

No `fetch`, `XMLHttpRequest`, `WebSocket`, timer-driven network simulation, or local URL belongs in `site.js`.

- [ ] **Step 4: Run behavior tests and verify GREEN**

Run: `node --test tests/site-behavior.test.mjs`

Expected: all behavior tests pass, including the new no-network assertion.

- [ ] **Step 5: Run the full suite**

Run: `npm test`

Expected: all tests pass.

- [ ] **Step 6: Commit the interaction**

```bash
git add site.js tests/site-behavior.test.mjs
git commit -m "feat: add synthetic AIOS route demonstration"
```

---

### Task 5: Mirror, Audit, and Publish the Finished Site

**Files:**
- Modify: `demo/supervised-lead-system/index.html`
- Modify: `demo/supervised-lead-system/site.css`
- Modify: `demo/supervised-lead-system/site.js`
- Verify: `index.html`, `site.css`, `site.js`, `tests/*.test.mjs`

**Interfaces:**
- Consumes: Completed root site.
- Produces: Matching standalone demo build and verified GitHub Pages deployment.

- [ ] **Step 1: Mirror the final root assets**

Copy `index.html`, `site.css`, and `site.js` into `demo/supervised-lead-system/` so the standalone path cannot drift from the published root experience.

- [ ] **Step 2: Run automated verification**

Run:

```bash
npm test
npm run build
node tests/check-links.mjs
git diff --check
```

Expected: all tests pass, the static build command exits 0, every internal reference resolves, and `git diff --check` produces no output.

- [ ] **Step 3: Perform desktop browser verification**

At a desktop viewport, verify:

- Hero promise is understandable without the AIOS acronym.
- Each of the three system routes changes all five layers and evidence text.
- Approval and reset work and announce status.
- Lead demo edit/save/approve/skip/reset still work.
- Care Hub tabs/tasks/forms still work.
- Pricing and proof qualifications remain visible.
- Every navigation, Calendly, email, and protected Care Hub link is correct.

- [ ] **Step 4: Perform mobile and accessibility verification**

At a 390×844 viewport, verify the vertical system path, 44px controls, readable equipment plates, vertical operator-day ledger, sticky CTA behavior, keyboard focus, and reduced-motion presentation.

- [ ] **Step 5: Commit the mirrored build**

```bash
git add demo/supervised-lead-system/index.html demo/supervised-lead-system/site.css demo/supervised-lead-system/site.js
git commit -m "chore: mirror private AI workbench demo"
```

- [ ] **Step 6: Publish and verify GitHub Pages**

Push `main`, watch the Pages workflow to completion, then fetch `https://moteops.tech/?v=<commit>` and confirm the workbench headline, `qwen3-coder:30b`, `Operator's Workbench`, and both working demo headings exist in live HTML.

- [ ] **Step 7: Record final evidence**

Report the commit hash, test count, link-check count, Pages workflow result, live URL, and any capabilities deliberately labeled as demonstration-only.

---

## Plan Self-Review

- Specification coverage: primary message, five-layer AIOS, verified local models, phone access, six installable systems, operator timeline, both existing demos, commercial ladder, proof boundaries, mobile behavior, accessibility, and deployment are each assigned to a task.
- Placeholder scan: no TBD, TODO, “implement later,” or unspecified error-handling steps remain.
- Interface consistency: HTML `data-system-*` hooks in Task 2 match JavaScript queries in Task 4 and test assertions in Task 1.
