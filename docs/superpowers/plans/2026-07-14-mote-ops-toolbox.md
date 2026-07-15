# Mote Ops Toolbox Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a compact, truthful Mote Ops toolbox section that names n8n and the other modern technologies Mike can use while keeping the homepage understandable to a nontechnical small business owner.

**Architecture:** Keep the static HTML and CSS architecture. Add one semantic section inside the existing evidence area, after the real Care Hub case story and before the collapsed technical proof. The section is informational, has no JavaScript, and uses the existing editorial workbench visual language.

**Tech Stack:** Semantic HTML, existing CSS custom properties, Node test runner, existing static site contract tests

## Global Constraints

1. Keep the customer problem and business outcome primary.
2. Describe named products as available build tools, not as products deployed in every client installation.
3. Do not represent n8n or Microsoft 365 as part of the verified Mac installation.
4. Keep the existing cream, dark green, orange, and black palette. Add no blue.
5. Use text rather than vendor logos or image assets.
6. Add no interaction, animation, dependency, or network request.
7. Preserve all existing demonstration behavior, email choices, navigation, and booking links.
8. Stack the toolbox into one column on mobile with no horizontal overflow at 390 pixels.

---

## File Map

1. `tests/site-contract.test.mjs` defines the required copy, tool names, truth boundary, and placement contract.
2. `index.html` contains the semantic toolbox section and customer facing copy.
3. `site.css` owns the editorial toolbox layout and responsive behavior.

### Task 1: Define the Toolbox Contract

**Files:**

1. Modify: `tests/site-contract.test.mjs`
2. Test: `tests/site-contract.test.mjs`

**Interfaces:**

1. Consumes: the existing `elementById(id, expectedTag)` test helper.
2. Produces: a contract requiring `section#toolbox`, the four purpose groups, the approved tool names, the client guidance, and placement between `.case-study` and `.technical-proof`.

- [ ] **Step 1: Write the failing contract test**

Insert this test immediately after `centers evidence on the real Care Hub build without inflating results`:

```js
test('shows a modern toolbox as supporting proof rather than the product', () => {
  const evidence = elementById('evidence', 'section');
  const toolbox = elementById('toolbox', 'section');
  assert.ok(toolbox.start >= evidence.start && toolbox.end <= evidence.end);

  const caseStudyIndex = evidence.source.indexOf('class="case-study"');
  const toolboxIndex = evidence.source.indexOf('id="toolbox"');
  const technicalProofIndex = evidence.source.indexOf('class="technical-proof"');
  assert.ok(caseStudyIndex < toolboxIndex, 'toolbox should follow the real case story');
  assert.ok(toolboxIndex < technicalProofIndex, 'toolbox should precede the technical proof');

  assert.match(toolbox.source, /THE MOTE OPS TOOLBOX/i);
  assert.match(toolbox.source, /Built with the right tools\. Never trapped in one\./i);
  for (const purpose of ['Automate', 'Think', 'Connect', 'Deliver']) {
    assert.match(toolbox.source, new RegExp(`>${purpose}<`, 'i'));
  }
  for (const tool of ['n8n', 'OpenAI', 'Claude', 'Codex', 'Ollama', 'Gmail', 'Microsoft 365']) {
    assert.match(toolbox.source, new RegExp(tool, 'i'));
  }
  assert.match(toolbox.source, /You do not need to learn the platforms or decide which model to use/i);
  assert.match(toolbox.source, /Technology changes quickly\. Your system should keep working\./i);
  assert.doesNotMatch(toolbox.source, /every (?:client|project|installation) uses/i);
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run:

```bash
node --test --test-name-pattern="modern toolbox" tests/site-contract.test.mjs
```

Expected: FAIL with `missing #toolbox section`.

- [ ] **Step 3: Commit the failing contract**

```bash
git add tests/site-contract.test.mjs
git commit -m "test: define homepage toolbox contract"
```

### Task 2: Add the Semantic Toolbox Content

**Files:**

1. Modify: `index.html`
2. Test: `tests/site-contract.test.mjs`

**Interfaces:**

1. Consumes: the `section#toolbox` contract from Task 1 and the existing `#evidence` section.
2. Produces: `section#toolbox`, `.toolbox-intro`, `.toolbox-grid`, `.toolbox-item`, `.toolbox-tools`, and `.toolbox-close` for Task 3 styling.

- [ ] **Step 1: Add the approved section after `.case-study` and before `.technical-proof`**

Insert this exact markup in `index.html`:

```html
      <section class="toolbox" id="toolbox" aria-labelledby="toolbox-title">
        <div class="toolbox-intro">
          <div>
            <p class="kicker">THE MOTE OPS TOOLBOX</p>
            <h3 id="toolbox-title">Built with the right tools. Never trapped in one.</h3>
          </div>
          <p>Mote Ops selects, connects, and supports the technology that fits your business. You do not need to learn the platforms or decide which model to use.</p>
        </div>
        <ol class="toolbox-grid">
          <li class="toolbox-item"><span>01</span><h4>Automate</h4><p>Move repetitive work reliably between systems.</p><p class="toolbox-tools">n8n · Webhooks · Scheduled workflows · APIs</p></li>
          <li class="toolbox-item"><span>02</span><h4>Think</h4><p>Select intelligence for the task, privacy needs, and budget.</p><p class="toolbox-tools">OpenAI · Claude · Codex · Ollama · Private local models</p></li>
          <li class="toolbox-item"><span>03</span><h4>Connect</h4><p>Work around the software your business already uses.</p><p class="toolbox-tools">Gmail · Microsoft 365 · Calendars · Forms · Customer software</p></li>
          <li class="toolbox-item"><span>04</span><h4>Deliver</h4><p>Put useful work where a person can review and act.</p><p class="toolbox-tools">Custom dashboards · Approval queues · Phone access · Operating briefs</p></li>
        </ol>
        <p class="toolbox-close">Technology changes quickly. Your system should keep working. Mote Ops chooses the tools, connects them to your real workflow, tests the result, and helps your team use it.</p>
      </section>
```

- [ ] **Step 2: Run the focused contract test**

Run:

```bash
node --test --test-name-pattern="modern toolbox" tests/site-contract.test.mjs
```

Expected: PASS.

- [ ] **Step 3: Run all static contract tests**

Run:

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 4: Commit the semantic content**

```bash
git add index.html
git commit -m "feat: add Mote Ops toolbox content"
```

### Task 3: Style the Editorial Toolbox Responsively

**Files:**

1. Modify: `site.css`
2. Test: `tests/site-contract.test.mjs`

**Interfaces:**

1. Consumes: the six toolbox class names produced by Task 2 and the existing palette variables `--bone`, `--soot`, `--forest`, `--copper`, `--signal`, `--brass`, `--paper`, and `--muted`.
2. Produces: a four column desktop layout, two column tablet layout, and one column mobile layout without JavaScript.

- [ ] **Step 1: Add the desktop editorial toolbox styles before `.technical-proof`**

Add this exact CSS in `site.css` after `.case-route i`:

```css
.toolbox{margin-top:clamp(42px,7vw,78px);border:2px solid var(--soot);background:var(--soot);color:var(--bone);box-shadow:7px 8px 0 var(--copper)}
.toolbox-intro{display:grid;grid-template-columns:1.1fr .9fr;gap:clamp(28px,6vw,82px);align-items:end;padding:clamp(28px,5vw,54px)}
.toolbox-intro .kicker{color:var(--brass)}
.toolbox-intro h3{max-width:680px;margin:0;color:#fff;font-size:clamp(2rem,4vw,4rem)}
.toolbox-intro>p{max-width:520px;margin:0;color:var(--bone)}
.toolbox-grid{display:grid;grid-template-columns:repeat(4,1fr);margin:0;padding:0;border-top:1px solid var(--brass);list-style:none}
.toolbox-item{min-width:0;padding:24px}
.toolbox-item+.toolbox-item{border-left:1px solid var(--brass)}
.toolbox-item>span{color:var(--brass);font:800 .68rem ui-monospace,SFMono-Regular,monospace}
.toolbox-item h4{margin:22px 0 10px;color:#fff;font-size:1.45rem}
.toolbox-item>p:not(.toolbox-tools){min-height:62px;margin:0;color:var(--bone);font-size:.86rem}
.toolbox-tools{margin:22px 0 0;padding-top:15px;border-top:1px solid var(--copper);color:#fff;font:800 .72rem/1.65 ui-monospace,SFMono-Regular,monospace;overflow-wrap:anywhere}
.toolbox-close{margin:0;padding:20px clamp(24px,5vw,54px);border-top:1px solid var(--brass);color:var(--bone);font-size:.88rem}
```

- [ ] **Step 2: Add the tablet layout to the existing `max-width:1020px` rules**

Add these declarations inside the final `@media(max-width:1020px)` block:

```css
.toolbox-intro{grid-template-columns:1fr}
.toolbox-grid{grid-template-columns:1fr 1fr}
.toolbox-item:nth-child(3){border-left:0}
.toolbox-item:nth-child(n+3){border-top:1px solid var(--brass)}
```

- [ ] **Step 3: Add the mobile layout to the final `max-width:760px` rules**

Add these declarations inside the final `@media(max-width:760px)` block:

```css
.toolbox{box-shadow:5px 6px 0 var(--copper)}
.toolbox-intro{padding:28px 21px}
.toolbox-grid{grid-template-columns:1fr}
.toolbox-item,.toolbox-item:nth-child(3){border-left:0}
.toolbox-item+.toolbox-item,.toolbox-item:nth-child(n+3){border-top:1px solid var(--brass)}
.toolbox-item>p:not(.toolbox-tools){min-height:0}
.toolbox-close{padding:20px 21px}
```

- [ ] **Step 4: Run the full test suite**

Run:

```bash
npm test
```

Expected: all tests pass, including the palette and network safety contracts.

- [ ] **Step 5: Check formatting and the static build command**

Run:

```bash
git diff --check
npm run build
```

Expected: `git diff --check` prints nothing and the build reports that no build step is required.

- [ ] **Step 6: Commit the visual treatment**

```bash
git add site.css
git commit -m "style: present toolbox as an editorial field guide"
```

### Task 4: Verify the Complete Homepage and Publish

**Files:**

1. Verify: `index.html`
2. Verify: `site.css`
3. Verify: `site.js`
4. Verify: `email.html`

**Interfaces:**

1. Consumes: the completed static site from Tasks 1 through 3.
2. Produces: a tested live homepage on `https://moteops.tech/` with the toolbox visible between the Care Hub proof and technical disclosure.

- [ ] **Step 1: Run all automated checks from a clean working tree**

Run:

```bash
git status --short
npm test
npm run build
node tests/check-links.mjs
```

Expected: the working tree is clean, all tests pass, the static build succeeds, and all checked links resolve.

- [ ] **Step 2: Start the local site and inspect desktop and mobile**

Run:

```bash
npm run dev
```

Verify at desktop width and at 390 by 844 pixels:

1. The toolbox follows the Care Hub case story.
2. All four purpose groups are readable.
3. The mobile layout has one column and no horizontal page overflow.
4. No blue appears.
5. The technical proof still opens.
6. Each demonstration still responds to its controls.
7. The booking and email actions still open real destinations.

- [ ] **Step 3: Push the feature branch and merge it into main**

```bash
git push origin feat/private-ai-workbench
git -C /Users/michaelmote/Desktop/hobby/active/moteops-landing merge --no-ff feat/private-ai-workbench
git -C /Users/michaelmote/Desktop/hobby/active/moteops-landing push origin main
```

Expected: the main branch contains the toolbox commits and GitHub Pages begins publishing the new revision.

- [ ] **Step 4: Verify the live site**

Open `https://moteops.tech/?toolbox=20260714` and repeat the desktop and mobile checks from Step 2. Confirm that the delivered HTML contains `id="toolbox"` and that the section names n8n without claiming it is part of the verified Mac installation.
