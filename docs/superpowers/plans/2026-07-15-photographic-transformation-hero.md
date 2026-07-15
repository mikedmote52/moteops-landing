# Photographic Transformation Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the confusing abstract hero diagram with realistic desktop and phone imagery that shows an overwhelmed owner, Mote Ops organizing the work, and a simple owner brief with three decisions.

**Architecture:** Keep the static HTML and CSS site. Add two local raster assets selected through a semantic `picture` element, preserve all current hero copy and actions, and add a short textual stage legend plus an honest illustrative disclosure. No JavaScript or external image request is required.

**Tech Stack:** Static HTML, CSS, PNG assets, Node test runner, built in image generation tool, existing browser verification workflow

## Global Constraints

1. Remove the current `.hero-system-plate` diagram completely.
2. Keep the existing hero headline, supporting copy, actions, and trust statements.
3. Use local assets only.
4. Use a distinct vertical asset at widths up to 760 pixels.
5. Keep the existing cream, dark green, orange, and black palette. Add no blue styling.
6. Label the image as an illustrative demonstration using fictional business information.
7. Do not describe the image as a real customer screenshot or a live connection.
8. Add no JavaScript behavior or network request.
9. Preserve every existing demonstration, email choice, booking action, and navigation link.
10. Produce no horizontal overflow at 390 by 844 pixels.

---

## File Map

1. `tests/site-contract.test.mjs` defines the hero image, copy, asset, safety, and removal contracts.
2. `assets/moteops-transformation-hero-v1.png` is the approved wide photographic asset.
3. `assets/moteops-transformation-hero-mobile-v1.png` is the generated vertical photographic asset.
4. `index.html` owns the semantic `picture`, stage labels, alternative text, and disclosure.
5. `site.css` owns the desktop frame, mobile stacking, labels, and overflow behavior.

### Task 1: Define the Photographic Hero Contract

**Files:**

1. Modify: `tests/site-contract.test.mjs`
2. Test: `tests/site-contract.test.mjs`

**Interfaces:**

1. Consumes: the existing `elementById(id, expectedTag)` helper and filesystem imports.
2. Produces: a contract for `.hero-transformation`, local desktop and phone assets, exact alternative text, the three stage labels, the disclosure, and removal of `.hero-system-plate` from the hero.

- [ ] **Step 1: Write the failing contract test**

Insert this test after `leads with Mike as a practical AI integration partner`:

```js
test('shows a truthful photographic transformation instead of an abstract hero diagram', () => {
  const hero = elementById('top', 'section').source;
  assert.doesNotMatch(hero, /hero-system-plate|hero-inputs|hero-core|hero-outputs/i);
  assert.match(hero, /class="hero-transformation"/i);
  assert.match(hero, /<picture\b/i);
  assert.match(hero, /media="\(max-width: 760px\)"/i);
  assert.match(hero, /assets\/moteops-transformation-hero-mobile-v1\.png/i);
  assert.match(hero, /assets\/moteops-transformation-hero-v1\.png/i);
  assert.match(hero, /A small business owner moves from an overflowing inbox, missed calls, paperwork, and calendar conflicts to a Mote Ops agent organizing the work and a simple screen showing three decisions and a drafted email ready for approval\./i);
  for (const label of ['Before', 'Mote Ops working', 'Three decisions need you']) {
    assert.match(hero, new RegExp(`>${label}<`, 'i'));
  }
  assert.match(hero, /Illustrative demonstration using fictional business information\./i);
  assert.ok(existsSync(resolve(root, 'assets/moteops-transformation-hero-v1.png')));
  assert.ok(existsSync(resolve(root, 'assets/moteops-transformation-hero-mobile-v1.png')));
});
```

- [ ] **Step 2: Run the focused test and confirm the expected failure**

```bash
node --test --test-name-pattern="photographic transformation" tests/site-contract.test.mjs
```

Expected: FAIL because the current hero still contains `.hero-system-plate`.

- [ ] **Step 3: Commit the failing test**

```bash
git add tests/site-contract.test.mjs
git commit -m "test: define photographic hero contract"
```

### Task 2: Prepare the Desktop and Phone Assets

**Files:**

1. Create: `assets/moteops-transformation-hero-v1.png`
2. Create: `assets/moteops-transformation-hero-mobile-v1.png`

**Interfaces:**

1. Consumes: approved desktop source `/Users/michaelmote/.codex/generated_images/019f5241-c6dd-7cf2-a952-51dd214a43be/exec-db068345-fb35-490c-83b5-9ae4cc67e0f4.png`.
2. Produces: two local PNG files consumed by the `picture` element in Task 3.

- [ ] **Step 1: Copy the approved desktop asset into the site**

```bash
cp /Users/michaelmote/.codex/generated_images/019f5241-c6dd-7cf2-a952-51dd214a43be/exec-db068345-fb35-490c-83b5-9ae4cc67e0f4.png assets/moteops-transformation-hero-v1.png
```

- [ ] **Step 2: Generate the vertical phone asset with the built in image generation tool**

Use this exact prompt:

```text
Use case: ads-marketing
Asset type: photorealistic mobile website hero, portrait composition
Primary request: Show one small business owner moving through three vertically stacked photographic moments. At the top the owner is overwhelmed at a crowded desk with an overflowing email inbox, missed calls, paperwork, sticky notes, calendar conflicts, and many tasks. In the middle a realistic deep green and warm cream Mote Ops application screen visibly sorts email, calls, tasks, calendar conflicts, and customer records while preparing drafts. At the bottom the same owner is calm at a clean desk viewing a simple Mote Ops owner brief with three decisions and a realistic email draft ready for approval.
Style: premium editorial commercial photography with highly realistic application screens, natural human proportions, authentic small business environment.
Composition: portrait 4 by 5, clear visual progression from top to bottom, important content inside the center 85 percent.
Color palette: warm cream, deep forest green, black, restrained burnt orange. No blue dominant palette.
Text: only these prominent phrases may appear: "AGENT WORKING", "3 decisions need you", "Draft ready for approval".
Constraints: recognizable email interface, realistic agent activity, realistic drafted email. No robots, no holograms, no glowing brain, no abstract arrows, no real software logos, no watermark.
```

- [ ] **Step 3: Copy the generated output into the site**

Use the workspace file copy action to copy the exact PNG path reported by the built in image generation result to `assets/moteops-transformation-hero-mobile-v1.png`. Preserve the original generated image in its default location.

- [ ] **Step 4: Verify both assets are valid PNG files**

```bash
file assets/moteops-transformation-hero-v1.png assets/moteops-transformation-hero-mobile-v1.png
sips -g pixelWidth -g pixelHeight assets/moteops-transformation-hero-v1.png assets/moteops-transformation-hero-mobile-v1.png
```

Expected: both are PNG images; the desktop image is landscape and the phone image is portrait.

- [ ] **Step 5: Commit the assets**

```bash
git add assets/moteops-transformation-hero-v1.png assets/moteops-transformation-hero-mobile-v1.png
git commit -m "assets: add photographic Mote Ops transformation"
```

### Task 3: Replace the Abstract Hero Diagram

**Files:**

1. Modify: `index.html`
2. Test: `tests/site-contract.test.mjs`

**Interfaces:**

1. Consumes: the two asset paths from Task 2.
2. Produces: `.hero-transformation`, `.hero-transformation-media`, `.hero-transformation-stages`, and `.hero-transformation-note` for Task 4 styling.

- [ ] **Step 1: Replace the current `.hero-system-plate` element with the photographic figure**

Use this exact markup:

```html
      <figure class="hero-transformation">
        <picture class="hero-transformation-media">
          <source media="(max-width: 760px)" srcset="assets/moteops-transformation-hero-mobile-v1.png">
          <img src="assets/moteops-transformation-hero-v1.png" alt="A small business owner moves from an overflowing inbox, missed calls, paperwork, and calendar conflicts to a Mote Ops agent organizing the work and a simple screen showing three decisions and a drafted email ready for approval.">
        </picture>
        <figcaption>
          <ol class="hero-transformation-stages"><li>Before</li><li>Mote Ops working</li><li>Three decisions need you</li></ol>
          <p class="hero-transformation-note">Illustrative demonstration using fictional business information.</p>
        </figcaption>
      </figure>
```

- [ ] **Step 2: Run the focused contract test**

```bash
node --test --test-name-pattern="photographic transformation" tests/site-contract.test.mjs
```

Expected: PASS.

- [ ] **Step 3: Run the full static test suite**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 4: Commit the semantic hero**

```bash
git add index.html
git commit -m "feat: replace abstract hero with photographic transformation"
```

### Task 4: Style the Photographic Hero Responsively

**Files:**

1. Modify: `site.css`
2. Test: `tests/site-contract.test.mjs`

**Interfaces:**

1. Consumes: the four class names from Task 3 and the existing palette variables.
2. Produces: a framed desktop photograph, vertical phone photograph, stage legend, and readable disclosure without overflow.

- [ ] **Step 1: Remove the obsolete hero diagram style block**

Delete the rules beginning with `.hero-system-plate` through `.hero-core em` and delete the mobile `.hero-inputs,.hero-outputs` and `.hero-system-plate` declarations.

- [ ] **Step 2: Add the photographic figure styles after the `.hero-trust` rules**

```css
.hero-transformation{min-width:0;margin:0;border:2px solid var(--soot);background:var(--soot);box-shadow:8px 9px 0 var(--copper)}
.hero-transformation-media{display:block;background:var(--soot);overflow:hidden}
.hero-transformation-media img{display:block;width:100%;height:auto;aspect-ratio:16/9;object-fit:cover}
.hero-transformation figcaption{background:var(--paper);color:var(--soot)}
.hero-transformation-stages{display:grid;grid-template-columns:repeat(3,1fr);margin:0;padding:0;border-top:1px solid var(--soot);list-style:none}
.hero-transformation-stages li{padding:10px 12px;color:var(--forest);font:900 .62rem ui-monospace,SFMono-Regular,monospace;text-align:center;text-transform:uppercase;letter-spacing:.06em}
.hero-transformation-stages li+li{border-left:1px solid var(--soot)}
.hero-transformation-note{margin:0;padding:8px 12px;border-top:1px solid var(--rule);color:var(--muted);font-size:.68rem;text-align:center}
```

- [ ] **Step 3: Add the phone layout to the final `max-width:760px` rules**

```css
.hero-transformation{margin-top:8px;box-shadow:5px 6px 0 var(--copper)}
.hero-transformation-media img{aspect-ratio:4/5;object-fit:cover}
.hero-transformation-stages{grid-template-columns:1fr}
.hero-transformation-stages li+li{border-top:1px solid var(--soot);border-left:0}
.hero-transformation-note{padding:9px 10px}
```

- [ ] **Step 4: Run all checks**

```bash
npm test
git diff --check
npm run build
node tests/check-links.mjs
```

Expected: all tests pass, diff check is silent, static build succeeds, and link checks pass.

- [ ] **Step 5: Commit the responsive styling**

```bash
git add site.css
git commit -m "style: frame photographic transformation across devices"
```

### Task 5: Verify the Site Preview and Publish

**Files:**

1. Verify: `index.html`
2. Verify: `site.css`
3. Verify: `assets/moteops-transformation-hero-v1.png`
4. Verify: `assets/moteops-transformation-hero-mobile-v1.png`

**Interfaces:**

1. Consumes: the completed static site from Tasks 1 through 4.
2. Produces: a tested live homepage on `https://moteops.tech/` with the photographic transformation replacing the abstract diagram.

- [ ] **Step 1: Start the local site**

```bash
npm run dev
```

- [ ] **Step 2: Verify desktop and phone layouts in the browser**

At desktop width and at 390 by 844 pixels, confirm:

1. The full transformation is immediately understandable.
2. The phone uses the vertical asset.
3. The hero headline and primary action remain dominant.
4. The stage labels and disclosure are readable.
5. The sticky booking action does not cover the labels.
6. There is no horizontal page overflow.
7. Existing demonstrations and contact actions still work.
8. There are no browser errors or external image requests.

- [ ] **Step 3: Push the feature branch and merge it into main**

```bash
git push origin feat/private-ai-workbench
git -C /Users/michaelmote/Desktop/hobby/active/moteops-landing pull --ff-only
git -C /Users/michaelmote/Desktop/hobby/active/moteops-landing merge --no-ff feat/private-ai-workbench -m "merge: add photographic transformation hero"
```

- [ ] **Step 4: Verify the merged main branch**

```bash
git -C /Users/michaelmote/Desktop/hobby/active/moteops-landing status --short
npm test
npm run build
node tests/check-links.mjs
```

Run the three verification commands from `/Users/michaelmote/Desktop/hobby/active/moteops-landing`.

- [ ] **Step 5: Publish and verify GitHub Pages**

```bash
git -C /Users/michaelmote/Desktop/hobby/active/moteops-landing push origin main
gh run list --repo mikedmote52/moteops-landing --limit 5
```

Watch the new deployment until it succeeds, then open `https://moteops.tech/?hero=photo1` and repeat the desktop and phone checks from Step 2.
