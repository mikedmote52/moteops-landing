# Mobile Transformation Captions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Place each phone transformation caption directly after the photographic scene it describes while leaving the desktop hero unchanged.

**Architecture:** Keep the current desktop picture and caption row. Add a phone only ordered sequence that reuses the existing portrait asset as three CSS cropped backgrounds, with one visible caption inside each stage item. Responsive CSS switches between the two presentations at 760 pixels.

**Tech Stack:** Static HTML, CSS, Node test runner, GitHub Pages

## Global Constraints

Phone order is exactly `Before`, `Mote Ops working`, `Three decisions need you`.

The disclosure appears once after the third stage.

Desktop presentation and photography remain unchanged.

No new image asset or dependency is added.

The page must have no horizontal overflow at 390 by 844 pixels.

---

### Task 1: Define the segmented phone contract

**Files:**

- Modify: `tests/site-contract.test.mjs`

**Interfaces:**

- Consumes: The hero HTML extracted by the existing site contract tests.
- Produces: A contract requiring `.hero-transformation-mobile`, three `.hero-transformation-mobile-stage` items, three crop classes, and the exact caption order.

- [ ] **Step 1: Write the failing test**

Add this test after the existing photographic hero contract:

```js
test('pairs every phone transformation scene with its caption', () => {
  const hero = section('top');
  assert.match(hero, /class="hero-transformation-mobile"/i);
  assert.equal((hero.match(/class="hero-transformation-mobile-stage/g) || []).length, 3);
  assert.match(hero, /hero-transformation-mobile-crop is-before[\s\S]*?<span>Before<\/span>/i);
  assert.match(hero, /hero-transformation-mobile-crop is-working[\s\S]*?<span>Mote Ops working<\/span>/i);
  assert.match(hero, /hero-transformation-mobile-crop is-result[\s\S]*?<span>Three decisions need you<\/span>/i);
});
```

- [ ] **Step 2: Run the focused test and verify failure**

Run:

```bash
node --test --test-name-pattern="pairs every phone transformation scene" tests/site-contract.test.mjs
```

Expected: FAIL because `hero-transformation-mobile` is absent.

- [ ] **Step 3: Commit the failing contract**

```bash
git add tests/site-contract.test.mjs
git commit -m "test: define paired mobile transformation captions"
```

### Task 2: Add the phone stage structure

**Files:**

- Modify: `index.html:41-50`
- Test: `tests/site-contract.test.mjs`

**Interfaces:**

- Consumes: `assets/moteops-transformation-hero-mobile-v1.png` and the current `.hero-transformation` figure.
- Produces: `.hero-transformation-desktop` and `.hero-transformation-mobile` presentations inside the same figure.

- [ ] **Step 1: Mark the existing picture and caption row as desktop presentation**

Change the existing picture class and caption row to:

```html
<picture class="hero-transformation-media hero-transformation-desktop">
```

```html
<ol class="hero-transformation-stages hero-transformation-desktop"><li>Before</li><li>Mote Ops working</li><li>Three decisions need you</li></ol>
```

- [ ] **Step 2: Add the segmented phone sequence before the disclosure**

```html
<ol class="hero-transformation-mobile" aria-label="From overwhelmed work to three clear decisions">
  <li class="hero-transformation-mobile-stage"><span class="hero-transformation-mobile-crop is-before" aria-hidden="true"></span><span>Before</span></li>
  <li class="hero-transformation-mobile-stage"><span class="hero-transformation-mobile-crop is-working" aria-hidden="true"></span><span>Mote Ops working</span></li>
  <li class="hero-transformation-mobile-stage"><span class="hero-transformation-mobile-crop is-result" aria-hidden="true"></span><span>Three decisions need you</span></li>
</ol>
```

- [ ] **Step 3: Run the focused contract**

Run:

```bash
node --test --test-name-pattern="pairs every phone transformation scene" tests/site-contract.test.mjs
```

Expected: PASS.

- [ ] **Step 4: Commit the semantic structure**

```bash
git add index.html tests/site-contract.test.mjs
git commit -m "feat: pair phone transformation scenes with captions"
```

### Task 3: Crop and switch the responsive presentation

**Files:**

- Modify: `site.css:37-44`
- Modify: `site.css:308-331`

**Interfaces:**

- Consumes: The three crop classes from Task 2.
- Produces: A desktop only horizontal layout and phone only vertical sequence at the existing 760 pixel breakpoint.

- [ ] **Step 1: Add base phone sequence styles**

Add after `.hero-transformation-note`:

```css
.hero-transformation-mobile{display:none;margin:0;padding:0;list-style:none}
.hero-transformation-mobile-stage>span:last-child{display:block;padding:10px 12px;border-top:1px solid var(--soot);color:var(--forest);font:900 .62rem ui-monospace,SFMono-Regular,monospace;text-align:center;text-transform:uppercase;letter-spacing:.06em}
.hero-transformation-mobile-crop{display:block;width:100%;background-image:url("assets/moteops-transformation-hero-mobile-v1.png");background-repeat:no-repeat;background-size:100% auto}
```

- [ ] **Step 2: Replace the current phone image and stacked caption rules**

Inside the existing `@media(max-width:760px)` block use:

```css
.hero-transformation-desktop{display:none}
.hero-transformation-mobile{display:block}
.hero-transformation-mobile-stage+li{border-top:2px solid var(--soot)}
.hero-transformation-mobile-crop.is-before{aspect-ratio:1003/505;background-position:center top}
.hero-transformation-mobile-crop.is-working{aspect-ratio:1003/513;background-position:center 48.2%}
.hero-transformation-mobile-crop.is-result{aspect-ratio:1003/500;background-position:center bottom}
.hero-transformation-note{padding:9px 10px}
```

Remove the phone rules that force `.hero-transformation-stages` into one column and set the portrait `<img>` to `aspect-ratio:4/5`.

- [ ] **Step 3: Run all automated verification**

Run:

```bash
npm test
npm run build
node tests/check-links.mjs
git diff --check
```

Expected: All tests pass, the static build succeeds, all references resolve, and the diff check is silent.

- [ ] **Step 4: Commit the responsive styling**

```bash
git add site.css
git commit -m "style: place phone captions under matching scenes"
```

### Task 4: Verify and publish

**Files:**

- Verify: `index.html`
- Verify: `site.css`

**Interfaces:**

- Consumes: The complete tested feature branch.
- Produces: A verified live phone layout on `https://moteops.tech/`.

- [ ] **Step 1: Start the local site and inspect desktop**

Run `npm run dev`. At 1440 by 1000 pixels verify the wide photograph and horizontal caption row remain unchanged, the image loads, and there is no horizontal overflow.

- [ ] **Step 2: Inspect the phone sequence**

At 390 by 844 pixels verify each photo is immediately followed by its matching caption, the disclosure follows the third caption, the sticky booking action does not cover content, and there are no browser errors or horizontal overflow.

- [ ] **Step 3: Merge and rerun verification on main**

Merge the feature branch into `main`, then run:

```bash
npm test
npm run build
node tests/check-links.mjs
```

Expected: All commands exit successfully.

- [ ] **Step 4: Publish and verify the live domain**

Push `main`, wait for the GitHub Pages deployment to succeed, then verify the live phone sequence at `https://moteops.tech/?hero=paired-captions1` with the same checks from Step 2.
