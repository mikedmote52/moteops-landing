# Demo-First Workbench Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild moteops.tech so a nontechnical small-business owner recognizes their problem immediately and can operate four relevant demonstrations before encountering architecture terminology.

**Architecture:** Keep the static HTML/CSS/vanilla-JavaScript stack. Replace the architecture-first console with a single accessible demo gallery whose tab selections reveal four browser-local workspaces. Existing lead and Care Hub demos are moved into the gallery unchanged at the behavior-hook level; new phone-operator and private-document workspaces use deterministic synthetic state. Architecture becomes a collapsed read-only disclosure after the gallery.

**Tech Stack:** HTML5, CSS custom properties/responsive layout, vanilla JavaScript, Node.js built-in test runner, GitHub Pages.

## Global Constraints

- No technical implementation terminology above the demo gallery.
- Production colors remain restricted to the approved workbench palette; no blue-family colors, gradients, glassmorphism, or generic SaaS card grids.
- Every demo is browser-local, synthetic, and visibly labeled; no network request may reach Mike's Mac, Ollama, Voice OS, bridge artifacts, or client data.
- Existing lead and Care Hub controls, pricing, proof qualifications, contact links, and protected owner link remain functional.
- The gallery uses complete accessible tab/tabpanel semantics with arrow/Home/End keyboard navigation.
- The sticky booking CTA never covers a visible demo workspace.
- Root and `demo/supervised-lead-system/` assets remain byte-identical.

---

### Task 1: Define Customer-Comprehension and Demo Contracts

**Files:**
- Modify: `tests/site-contract.test.mjs`
- Modify: `tests/site-behavior.test.mjs`

**Interfaces:**
- Consumes: site HTML/CSS/JS as source strings.
- Produces: failing tests for the new problem-first hierarchy and demo gallery behavior.

- [ ] **Step 1: Add the problem-first content contract**

Add a test requiring the exact headline, supporting promise, `Does this sound familiar?`, and all six approved problem statements. Capture index positions and assert the problem section appears before `id="demo-gallery"`, which appears before `id="architecture-details"`.

```js
test('leads with customer problems before demos or architecture', () => {
  assert.match(html, /Your business is running on your memory, your inbox, and too many open tabs/i);
  assert.match(html, /finds the repetitive work slowing you down/i);
  for (const phrase of [
    'drowning in follow-ups',
    "inbox has become your company's to-do list",
    'struggle to find the latest customer',
    'inquiries arrive after hours',
    'because you remember it',
    "want to use AI in your business, but you don't know where to begin"
  ]) assert.match(html, new RegExp(phrase, 'i'));
  assert.ok(html.indexOf('Does this sound familiar?') < html.indexOf('id="demo-gallery"'));
  assert.ok(html.indexOf('id="demo-gallery"') < html.indexOf('id="architecture-details"'));
});
```

- [ ] **Step 2: Add gallery structure and disclosure contracts**

Require four stable gallery tabs and four distinct `role="tabpanel"` workspaces, outcome-based public labels, persistent synthetic/no-live labels inside each workspace, and a collapsed `<details id="architecture-details">` after the gallery. Each tab owns one complete workspace through unique `id`/`aria-controls` and `aria-labelledby` pairings.

Required tab values: `operator`, `documents`, `leads`, `care`.

- [ ] **Step 3: Add new-demo behavior contracts**

Require:

- `DEMO_GALLERY` data and `setGalleryDemo`.
- Wrapped arrow/Home/End gallery navigation.
- `OPERATOR_REQUESTS`, a pure `renderOperatorRequest(data)` helper updating request/context/route/result/approval fields, and `setOperatorRequest` selecting `const data = OPERATOR_REQUESTS[name]` before calling `renderOperatorRequest(data)`.
- `DOCUMENT_TASKS`, a pure `renderDocumentTask(data)` helper updating findings/source/status, and `runDocumentTask` selecting `const data = DOCUMENT_TASKS[name]` before calling `renderDocumentTask(data)`.
- Existing lead/Care selectors still present.
- Sticky guard includes `#demo-gallery` rather than relying on nested hidden sections.
- No networking primitives.

- [ ] **Step 4: Run RED**

Run: `npm test`

Expected: new customer hierarchy/gallery/operator/document tests fail; all existing privacy, palette, pricing, proof, lead, Care Hub, and link contracts remain green.

- [ ] **Step 5: Commit tests**

```bash
git add tests/site-contract.test.mjs tests/site-behavior.test.mjs
git commit -m "test: define customer-first demo gallery"
```

---

### Task 2: Recompose HTML Around Problems and Four Demo Workspaces

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: existing data hooks for lead and Care Hub workspaces.
- Produces: `#problem-recognition`, `#demo-gallery`, four gallery panels, and `#architecture-details`.

- [ ] **Step 1: Replace hero copy and primary action**

Use the exact approved headline/supporting promise. Set the primary action to `See what Mote Ops can fix` linking to `#problem-recognition`; retain the fit-call secondary action. Remove `AIOS`, `local LLM`, `operating layer`, and system-diagram language from the hero.

- [ ] **Step 2: Add the six-problem recognition section**

Create `<section id="problem-recognition">` with the approved heading and six numbered editorial problem lines. Each line includes a short outcome pointer such as `See the owner brief →` or `See lead follow-up →`, targeting the gallery with a `data-open-demo` value.

- [ ] **Step 3: Create gallery shell and outcome tabs**

```html
<section id="demo-gallery" aria-labelledby="gallery-title">
  <p class="kicker">TRY A REAL EXAMPLE</p>
  <h2 id="gallery-title">Choose the problem that feels most familiar.</h2>
  <div class="gallery-tabs" role="tablist" aria-label="Mote Ops demonstrations">
    <button id="gallery-tab-operator" role="tab" aria-controls="gallery-panel-operator" data-gallery-demo="operator">Know what needs attention today</button>
    <button id="gallery-tab-documents" role="tab" aria-controls="gallery-panel-documents" data-gallery-demo="documents">Find answers inside your business information</button>
    <button id="gallery-tab-leads" role="tab" aria-controls="gallery-panel-leads" data-gallery-demo="leads">Stop losing new leads</button>
    <button id="gallery-tab-care" role="tab" aria-controls="gallery-panel-care" data-gallery-demo="care">Keep every family moving toward enrollment</button>
  </div>
  <!-- four role=tabpanel workspaces -->
</section>
```

- [ ] **Step 4: Build the operator workspace**

Include a full-width mobile-friendly operator conversation surface with three prompt buttons. The visible fields are request, attached context, route, sample result, and approval requirement. Add persistent badges: `Working pattern`, `Synthetic public data`, `No live connection`.

Use secondary label `Mote Ops Operator demonstration` and sentence: `This proves that an owner can ask for current business status from a phone while project context and approval boundaries stay attached.`

- [ ] **Step 5: Build the private-document workspace**

Include three fictional source files and three bounded task buttons. The result area contains source-cited synthetic findings, model/evidence note, status, and reset. No upload control. Use secondary label `Private document-review demonstration` and persistent badges.

- [ ] **Step 6: Move existing lead and Care Hub markup into gallery panels**

Move—not duplicate—the complete lead demo into `gallery-panel-leads` and Care Hub into `gallery-panel-care`. Preserve every existing `data-demo-*`, `data-action`, `data-care-*`, synthetic label, and protected owner link.

- [ ] **Step 7: Replace architecture console with collapsed disclosure**

Create `<details id="architecture-details">` after the gallery with summary `How Mote Ops builds these systems`. Keep the five concise layers and three evidence categories. Remove architecture action buttons and route controls.

- [ ] **Step 8: Run content contracts and commit**

Run: `node --test tests/site-contract.test.mjs`

Expected: content/ordering tests pass; JavaScript behavior tests remain RED.

```bash
git add index.html
git commit -m "feat: make Mote Ops customer-problem first"
```

---

### Task 3: Implement Demo Gallery, Operator, and Document Interactions

**Files:**
- Modify: `site.js`
- Modify: `tests/site-behavior.test.mjs`

**Interfaces:**
- Consumes: `data-gallery-demo`, `data-gallery-panel`, `data-operator-request`, `data-document-task`, and existing lead/Care hooks.
- Produces: accessible gallery selection, two new deterministic demos, and preserved existing demos.

- [ ] **Step 1: Implement gallery state**

Define `DEMO_GALLERY = ['operator', 'documents', 'leads', 'care']`. `setGalleryDemo(name)` must update selected/hidden/tabIndex states and panel `aria-labelledby`. Add wrapped arrow/Home/End behavior and focus movement.

Problem-section `data-open-demo` links call `setGalleryDemo`, then focus the selected gallery tab without preventing normal anchor positioning.

- [ ] **Step 2: Implement operator request states**

Define three `OPERATOR_REQUESTS` objects containing `request`, `context`, `route`, `result`, `approval`, and `status`. `setOperatorRequest(name)` selects `const data = OPERATOR_REQUESTS[name]` and passes it to the pure `renderOperatorRequest(data)` helper. The render helper updates all visible fields and announces the synthetic result. Approval changes only local state and says nothing was sent or changed.

- [ ] **Step 3: Implement document tasks**

Define three `DOCUMENT_TASKS` objects with `task`, `finding`, `source`, and `status`. `runDocumentTask(name)` selects `const data = DOCUMENT_TASKS[name]` and passes it to the pure `renderDocumentTask(data)` helper. The render helper displays the synthetic finding, cited fictional source, and status. Reset returns to the intro state. Never use `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`, or `sendBeacon`.

- [ ] **Step 4: Simplify sticky guards**

Guard `#demo-gallery` as a single visible interaction region. Preserve hero suppression and aria-hidden/tabIndex state.

- [ ] **Step 5: Run behavior and full tests**

Run:

```bash
node --test tests/site-behavior.test.mjs
npm test
node --check site.js
git diff --check
```

Expected: all tests pass.

- [ ] **Step 6: Commit interaction**

```bash
git add site.js tests/site-behavior.test.mjs
git commit -m "feat: add four-workspace demo gallery"
```

---

### Task 4: Design Four Distinct Workspaces and Mobile Experience

**Files:**
- Modify: `site.css`

**Interfaces:**
- Consumes: gallery/workspace classes from Task 2 and selected/current states from Task 3.
- Produces: visually distinct, responsive demo surfaces in the approved workbench palette.

- [ ] **Step 1: Restyle hero and problems for rapid comprehension**

Keep the hero compact enough that the problem heading begins near the first viewport on common laptops. Render problems as numbered editorial rows with a strong first clause and small outcome pointer, not rounded cards.

- [ ] **Step 2: Build gallery selector and shared workspace frame**

Use a tab rail resembling labeled equipment drawers. Selected state uses forest/soot and signal borders with AA text contrast. All targets remain at least 44px.

- [ ] **Step 3: Differentiate the four demos**

- Operator: focused conversation/command surface with message rhythm and route receipt.
- Documents: split source ledger and finding sheet.
- Leads: retain dispatch-board character.
- Care Hub: retain enrollment-workspace character.

Do not flatten them into the same repeated card grid.

- [ ] **Step 4: Collapse architecture visually**

Style the `<details>` as a restrained service-manual disclosure. Closed state should occupy one compact row; open state remains readable but subordinate to demos.

- [ ] **Step 5: Complete mobile rules**

At `max-width:760px`, horizontally scroll the gallery tabs, render each workspace as one column, make operator use full screen width, hide sticky CTA throughout gallery view, and ensure no horizontal document overflow.

- [ ] **Step 6: Verify palette, accessibility, and tests**

Run: `npm test && git diff --check`

Expected: all tests pass; closed palette contract remains green.

- [ ] **Step 7: Commit styles**

```bash
git add site.css
git commit -m "style: build demo-first operator workspaces"
```

---

### Task 5: Mirror, Review, Deploy, and Verify Live

**Files:**
- Modify: `demo/supervised-lead-system/index.html`
- Modify: `demo/supervised-lead-system/site.css`
- Modify: `demo/supervised-lead-system/site.js`
- Verify: root site, tests, live GitHub Pages deployment.

**Interfaces:**
- Consumes: completed root assets.
- Produces: byte-identical mirror and live demo-first site.

- [ ] **Step 1: Mirror root assets**

Copy the final root HTML/CSS/JS to the demo directory and bump both asset cache keys to `demo-first-1` in root/mirror HTML.

- [ ] **Step 2: Run complete verification**

```bash
npm test
npm run build
node tests/check-links.mjs
node --check site.js
cmp -s index.html demo/supervised-lead-system/index.html
cmp -s site.css demo/supervised-lead-system/site.css
cmp -s site.js demo/supervised-lead-system/site.js
git diff --check
```

- [ ] **Step 3: Browser QA desktop and mobile**

Verify the first viewport, six-problem scan, all four gallery tabs, operator prompts, document tasks, lead controls, Care Hub controls, keyboard switching, architecture disclosure, sticky CTA suppression, no horizontal overflow, and zero console errors at desktop and 390×844.

- [ ] **Step 4: Whole-branch review**

Dispatch a final reviewer against this specification and plan. Fix all Critical/Important findings and re-review.

- [ ] **Step 5: Merge and deploy**

Merge to `main`, rerun the full suite on the merged result, push, watch GitHub Pages to success, and verify the live headline, gallery labels, cache-busted CSS/JS, and all four interactions.

- [ ] **Step 6: Report evidence**

Report commit, test/link counts, Pages workflow success, live URL, and the exact working-vs-synthetic boundaries.

---

## Plan Self-Review

- Coverage: customer headline, six problems, four real demo workspaces, architecture demotion, accessibility, mobile, privacy, mirror, and deployment are assigned.
- Scope: no uploads, live local calls, analytics, CMS, or new dependencies.
- Interfaces: HTML data hooks, JavaScript selectors, and test names use the same `operator/documents/leads/care` identifiers.
- Placeholders: no TBD/TODO or unspecified implementation steps remain.
