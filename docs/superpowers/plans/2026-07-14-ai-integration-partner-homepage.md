# Mote Ops AI Integration Partner Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Mote Ops homepage so a nontechnical small business owner immediately understands that Mike helps identify, build, connect, and support useful AI solutions.

**Architecture:** Keep the existing static HTML, CSS, and JavaScript structure and the four browser local demonstrations. Replace the long technical sales narrative with eight direct sections, translate system language into customer outcomes, and preserve precise evidence boundaries. Reuse the current interaction functions where possible and remove behavior that no longer has a visible surface.

**Tech Stack:** Semantic HTML, custom CSS, browser JavaScript, Node built in test runner, Vercel static hosting

## Global Constraints

1. The first screen must explain the integration partner offer without technical AI terminology.
2. The page must contain no more than 950 visible words outside demonstration interfaces and collapsed disclosures.
3. Preserve bone, soot, forest, copper, signal orange, and brass. Do not introduce blue family colors, gradients, glass effects, glowing brains, floating chat bubbles, or stock AI imagery.
4. Keep all four demonstrations functional, synthetic, browser local, and accurately labeled.
5. Every visible control must perform the action it implies.
6. Preserve reduced motion, keyboard demo control, focus visibility, and a 375 pixel layout without horizontal overflow.
7. Keep the existing Calendly destination and use a functional email action with subject `A workflow I want help with`.
8. Do not claim measured return on investment or completed production outcomes that are not established.

---

### Task 1: Replace the Homepage Contract

**Files:**

1. Modify: `tests/site-contract.test.mjs`
2. Modify: `tests/site-behavior.test.mjs`

**Interfaces:**

1. Consumes: `index.html`, `site.css`, and `site.js` as plain text fixtures.
2. Produces: the exact public content, section order, evidence, interaction, and removal contract used by all later tasks.

- [ ] **Step 1: Replace the content contract with the approved positioning**

Add assertions for one H1 containing `You know AI could help your business`, the supporting statements `figure out where`, `build the right solution`, and `make it work`, and the actions `Tell me what is slowing you down` and `See what I can build`.

Assert the order of these section IDs:

```js
const orderedIds = ['problems', 'capabilities', 'process', 'demo-gallery', 'evidence', 'services', 'questions'];
let cursor = -1;
for (const id of orderedIds) {
  const next = html.indexOf(`id="${id}"`);
  assert.ok(next > cursor, `${id} should appear in the approved order`);
  cursor = next;
}
```

Assert all six problem statements, all six capability names, the four method verbs, and `Mike Mote` before `demo-gallery`.

- [ ] **Step 2: Add concise page and removal assertions**

Assert that direct main sections are at most eight, the H1 count is one, and these obsolete public surfaces are absent:

```js
for (const obsolete of ['id="calculator"', 'id="operator-day"', 'Annual follow-up labor burden', 'equipment-plate']) {
  assert.doesNotMatch(html, new RegExp(obsolete, 'i'));
}
```

Assert the functional mail link, the existing Calendly URL, all four demo selectors, the Care Hub URL, the pricing path, the honest evidence statements, and at least four question disclosures.

- [ ] **Step 3: Update behavior assertions**

Keep tests for gallery keyboard control, operator prompt changes, private document task changes, lead approve, edit, skip and reset, Care Hub tab and task state, sticky action suppression, and live region announcements. Remove the calculator behavior assertion because the calculator no longer exists.

- [ ] **Step 4: Run the tests and verify the new contract fails for the expected reasons**

Run:

```bash
node --test tests/site-contract.test.mjs tests/site-behavior.test.mjs
```

Expected: FAIL because the current homepage uses the previous headline, previous section order, technical equipment plates, and the calculator.

- [ ] **Step 5: Commit the failing contract**

```bash
git add tests/site-contract.test.mjs tests/site-behavior.test.mjs
git commit -m "test: define AI integration homepage contract"
```

### Task 2: Rebuild the Sales Narrative

**Files:**

1. Modify: `index.html`
2. Test: `tests/site-contract.test.mjs`

**Interfaces:**

1. Consumes: the exact section IDs and copy contract from Task 1.
2. Produces: semantic sections for `problems`, `capabilities`, `process`, `demo-gallery`, `evidence`, `services`, and `questions`; existing demonstration data attributes remain available to `site.js`.

- [ ] **Step 1: Implement the hero and customer recognition sections**

Set the title and description to practical AI integration for small businesses. Build one hero with the approved headline, supporting copy, actions, and three trust statements. Add `#problems` with the six approved customer problems and customer outcome links.

- [ ] **Step 2: Implement capabilities and working method**

Add `#capabilities` with the six outcome based capabilities and one concrete example each. Add `#process` with Understand, Simplify, Build, and Support, plus the early Mike introduction and accountability statement.

- [ ] **Step 3: Preserve and relabel the four demonstrations**

Move the current gallery to `#demo-gallery`. Preserve all existing gallery, operator, document, lead, and Care Hub data attributes. Change visible labels to:

```text
Ask what needs attention from a phone
Find a cited answer inside business information
Move a new lead from message to approved response
Keep a family moving through enrollment
```

Each panel must state the customer problem, what the interaction proves, `Synthetic public data`, and the correct live connection boundary.

- [ ] **Step 4: Implement evidence, services, questions, and closing action**

Build `#evidence` around the CC Care Hub problem, build, and current evidence. Place local model and phone proof in one collapsed disclosure. Build `#services` with the free fit conversation, $1,000 discovery, existing bounded build ranges, and optional support beginning at $750 monthly. Build `#questions` with fit and at least four disclosures. End with the approved workflow call and functional email action.

- [ ] **Step 5: Remove duplicate and obsolete sections**

Delete the calculator, audience strip, operator day timeline, technical equipment plate grid, separate proof repetition, separate fit section, separate about section, and duplicate closing copy. Preserve unique evidence only where it supports the new eight section narrative.

- [ ] **Step 6: Run the content contract**

Run:

```bash
node --test tests/site-contract.test.mjs
```

Expected: PASS with zero failures.

- [ ] **Step 7: Commit the narrative**

```bash
git add index.html tests/site-contract.test.mjs
git commit -m "feat: position Mote Ops as an AI integration partner"
```

### Task 3: Simplify Behavior and Preserve Real Demonstrations

**Files:**

1. Modify: `site.js`
2. Test: `tests/site-behavior.test.mjs`

**Interfaces:**

1. Consumes: the existing `data-gallery-tab`, `data-gallery-panel`, operator, document, lead, Care Hub, and sticky action attributes retained in Task 2.
2. Produces: keyboard accessible gallery selection, local demo state transitions, status announcements, and a sticky action that remains absent over demonstration controls.

- [ ] **Step 1: Remove the obsolete calculator path**

Delete calculator element lookups, number formatting, input listeners, and calculation functions. Keep the remaining functions independent of removed DOM nodes.

- [ ] **Step 2: Preserve gallery and demonstration behavior**

Confirm `setGalleryDemo(index, focus)` updates selected tabs and panels, handles ArrowLeft, ArrowRight, Home, and End, and announces the selected working example. Preserve operator prompt, document task, lead queue, draft editing, reset, Care Hub tabs, forms, and task controls.

- [ ] **Step 3: Align sticky action suppression with the new page**

Use `#demo-gallery` as the demonstration region. Keep the action unfocusable and hidden when the hero is visible or any demonstration control is in view.

- [ ] **Step 4: Run behavior tests**

Run:

```bash
node --test tests/site-behavior.test.mjs
```

Expected: PASS with zero failures.

- [ ] **Step 5: Commit the behavior cleanup**

```bash
git add site.js tests/site-behavior.test.mjs
git commit -m "refactor: focus homepage behavior on working demos"
```

### Task 4: Build the Calmer Workbench Layout

**Files:**

1. Modify: `site.css`
2. Test: `tests/site-contract.test.mjs`

**Interfaces:**

1. Consumes: the semantic classes and section IDs added in Task 2.
2. Produces: the complete desktop and phone presentation, focus treatment, reduced motion behavior, and demo specific workspaces.

- [ ] **Step 1: Create the hero, recognition, capability, and process layouts**

Use the current brand tokens. Give the hero a decisive two column editorial composition, use ruled problem rows rather than generic cards, use a compact capability ledger, and combine the four method steps with the Mike introduction.

- [ ] **Step 2: Reduce visual competition around demonstrations**

Keep each demonstration's existing visual language but increase surrounding space, simplify gallery navigation, and keep only one workspace visible. Make evidence labels legible without turning them into dominant badges.

- [ ] **Step 3: Style evidence, services, and questions**

Use one strong Care Hub case composition, a four step commercial path, and a compact question list. Do not create a grid of interchangeable rounded cards.

- [ ] **Step 4: Implement phone and accessibility rules**

At 760 pixels and below, use one column, full width demonstration controls, horizontally scrollable gallery selectors, and a phone layout with no miniature device frame. At 430 pixels and below, reduce heading scale and control padding. Preserve `:focus-visible` and `prefers-reduced-motion: reduce`.

- [ ] **Step 5: Run the full automated suite**

Run:

```bash
npm test
```

Expected: all tests pass with zero failures.

- [ ] **Step 6: Commit the responsive presentation**

```bash
git add site.css
git commit -m "style: simplify the Mote Ops customer journey"
```

### Task 5: Verify and Publish the Complete Journey

**Files:**

1. Modify only if verification reveals a defect: `index.html`, `site.css`, `site.js`, or tests
2. Verify: `tests/check-links.mjs`

**Interfaces:**

1. Consumes: the finished static site from Tasks 1 through 4.
2. Produces: a tested public deployment at `https://moteops.tech/`.

- [ ] **Step 1: Run fresh automated verification**

Run:

```bash
npm test
npm run build
node tests/check-links.mjs
git diff --check
```

Expected: all commands exit zero, all tests pass, and no whitespace errors appear.

- [ ] **Step 2: Start the existing local preview**

Run `npm run dev` and use the exact local URL printed by the server.

- [ ] **Step 3: Verify the desktop customer journey**

At a 1280 pixel viewport, verify the hero comprehension path, navigation, all four demonstrations, lead approve, edit, skip, reset, Care Hub tabs and controls, collapsed proof disclosure, Calendly destinations, email destination, sticky action suppression, and zero console errors.

- [ ] **Step 4: Verify the phone customer journey**

At 390 by 844, verify the first screen, section order, gallery scrolling, all demonstration controls, no covered actions, no horizontal overflow, and readable service pricing.

- [ ] **Step 5: Correct any verified defects under a failing regression test**

For every defect, add or adjust the narrowest automated assertion, observe the failure, apply the minimal correction, and rerun the focused test before the full suite.

- [ ] **Step 6: Commit verification corrections if any**

```bash
git add index.html site.css site.js tests
git commit -m "fix: close homepage verification gaps"
```

- [ ] **Step 7: Deploy the verified branch to production**

Run the existing production deployment command and confirm the deployment reports success. Open the exact public URL with a fresh cache parameter and repeat the headline, one demonstration, Calendly, email, and console checks.

- [ ] **Step 8: Record the release**

Update the shared Mote Ops bridge with the deployed commit, public verification evidence, files changed, and any remaining honest evidence limits.
