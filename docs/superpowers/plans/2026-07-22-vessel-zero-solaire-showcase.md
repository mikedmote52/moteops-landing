# VESSEL ZERO and SOLAIRE / 01 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build, verify, and publish two independent cinematic fictional showcase websites using Seedance 2.0 footage and truthful functional interactions.

**Architecture:** Each concept is an isolated static site with its own HTML, CSS, JavaScript, tests, posters, and optimized video. VESSEL ZERO and SOLAIRE / 01 are separate implementation milestones so either can be reviewed or deployed without the other. Shared homepage integration happens only after both sites pass isolated verification.

**Tech Stack:** Semantic HTML, modern CSS, browser JavaScript, Canvas 2D, Node test runner, ffmpeg media optimization, Higgsfield Seedance 2.0, Vercel static deployment.

## Global Constraints

- Use the approved palettes, typography families, copy tone, six-chapter structures, and shot briefs from `docs/superpowers/specs/2026-07-22-vessel-zero-solaire-showcase-design.md`.
- Reject purple/cyan gradient washes, glassmorphism, glowing orbs, random blurred blobs, generic futuristic copy, generated lettering, impossible materials, fake live data, and nonfunctional controls.
- Label both sites as fictional Mote Ops design concepts.
- Generate three 8-second, 16:9, 1080p, high-bitrate Seedance clips per site with no generated text or logos.
- Keep sound optional and off by default. Do not depend on sound for comprehension.
- Use `requestAnimationFrame`, intersection observers, capped canvas DPR, poster fallbacks, reduced-motion behavior, and mobile-specific choreography.
- Do not add scroll hijacking, external runtime dependencies, or a frontend framework.
- Do not modify unrelated uncommitted homepage or legal-page work.
- Do not publish the live `moteops.tech` homepage. Publish only separate review deployments under the explicit approval in this session.

---

### Task 1: Create an isolated execution worktree and media inventory

**Files:**
- Create: `demo/vessel-zero/media/manifest.json`
- Create: `demo/solaire-01/media/manifest.json`
- Test: `tests/showcase-media.test.mjs`

**Interfaces:**
- Consumes: six approved Seedance shot briefs from the design specification.
- Produces: media slots named `vz-01`, `vz-02`, `vz-03`, `so-01`, `so-02`, and `so-03`, each with `source`, `web`, `poster`, `width`, `height`, and `duration` fields.

- [ ] **Step 1: Create an isolated worktree from commit `26e443d`**

Run the `superpowers:using-git-worktrees` workflow. Use branch `feat/cinematic-showcase-pair` and a repository-local ignored worktree path.

- [ ] **Step 2: Write the failing media contract test**

```js
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

for (const [site, ids] of Object.entries({
  'vessel-zero': ['vz-01', 'vz-02', 'vz-03'],
  'solaire-01': ['so-01', 'so-02', 'so-03'],
})) {
  test(`${site} declares three local cinematic media slots`, () => {
    const root = new URL(`../demo/${site}/media/`, import.meta.url);
    const manifest = JSON.parse(readFileSync(new URL('manifest.json', root), 'utf8'));
    assert.deepEqual(manifest.clips.map(({ id }) => id), ids);
    for (const clip of manifest.clips) {
      assert.match(clip.web, /^media\/[a-z0-9-]+\.mp4$/);
      assert.match(clip.poster, /^media\/[a-z0-9-]+\.webp$/);
      assert.equal(clip.width, 1920);
      assert.equal(clip.height, 1080);
      assert.ok(clip.duration >= 7.5 && clip.duration <= 8.5);
      assert.ok(existsSync(new URL(clip.web.replace('media/', ''), root)));
      assert.ok(existsSync(new URL(clip.poster.replace('media/', ''), root)));
    }
  });
}
```

- [ ] **Step 3: Run the test and verify the missing-manifest failure**

Run: `node --test tests/showcase-media.test.mjs`

Expected: FAIL because both manifests do not exist.

- [ ] **Step 4: Create initial manifests with the exact six IDs**

Each manifest uses this shape:

```json
{
  "clips": [
    {"id":"vz-01","source":"source/vz-01.mp4","web":"media/vz-01.mp4","poster":"media/vz-01.webp","width":1920,"height":1080,"duration":8}
  ]
}
```

Repeat complete entries for the other IDs. The test remains red until real local assets exist.

- [ ] **Step 5: Commit the red media contract**

```bash
git add tests/showcase-media.test.mjs demo/vessel-zero/media/manifest.json demo/solaire-01/media/manifest.json
git commit -m "test: define cinematic showcase media contract"
```

---

### Task 2: Generate, download, inspect, and optimize the six Seedance clips

**Files:**
- Create: `demo/vessel-zero/media/source/vz-01.mp4`
- Create: `demo/vessel-zero/media/source/vz-02.mp4`
- Create: `demo/vessel-zero/media/source/vz-03.mp4`
- Create: `demo/vessel-zero/media/vz-01.mp4`
- Create: `demo/vessel-zero/media/vz-02.mp4`
- Create: `demo/vessel-zero/media/vz-03.mp4`
- Create: `demo/vessel-zero/media/vz-01.webp`
- Create: `demo/vessel-zero/media/vz-02.webp`
- Create: `demo/vessel-zero/media/vz-03.webp`
- Create: `demo/solaire-01/media/source/so-01.mp4`
- Create: `demo/solaire-01/media/source/so-02.mp4`
- Create: `demo/solaire-01/media/source/so-03.mp4`
- Create: `demo/solaire-01/media/so-01.mp4`
- Create: `demo/solaire-01/media/so-02.mp4`
- Create: `demo/solaire-01/media/so-03.mp4`
- Create: `demo/solaire-01/media/so-01.webp`
- Create: `demo/solaire-01/media/so-02.webp`
- Create: `demo/solaire-01/media/so-03.webp`
- Modify: both `media/manifest.json` files with measured durations.

**Interfaces:**
- Consumes: exact prompt text under `Seedance shot briefs` in the design specification.
- Produces: six reviewed, local, optimized media pairs consumed by HTML `<video>` elements.

- [ ] **Step 1: Generate VZ-01 only**

In the signed-in Higgsfield web generator select Seedance 2.0, 8 seconds, 16:9, 1080p, high bitrate, and paste the exact VZ-01 prompt. Submit one generation.

- [ ] **Step 2: Inspect VZ-01 frame-by-frame**

Reject the clip if cables warp, vehicle geometry changes, text or logos appear, materials look plastic, motion feels weightless, or bloom hides detail. If rejected, revise one prompt clause and regenerate once before reassessing.

- [ ] **Step 3: Generate the remaining five clips sequentially**

Use the exact approved prompts and the same settings. Review each completed clip before submitting the next one. Do not batch speculative alternatives.

- [ ] **Step 4: Download and normalize filenames**

Save original downloads under each site's `media/source/` directory using the six stable IDs.

- [ ] **Step 5: Optimize each clip and create posters**

Run the equivalent command for every clip:

```bash
ffmpeg -i media/source/vz-01.mp4 -an -c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p -movflags +faststart -vf "scale=1920:-2" media/vz-01.mp4
ffmpeg -ss 00:00:01.500 -i media/vz-01.mp4 -frames:v 1 -vf "scale=1600:-2" -c:v libwebp -quality 86 media/vz-01.webp
```

- [ ] **Step 6: Measure the final files and update manifests**

Use `ffprobe` to confirm width, height, duration, codec, and absence of audio. Update only measured duration values.

- [ ] **Step 7: Run the media contract**

Run: `node --test tests/showcase-media.test.mjs`

Expected: PASS, 2 tests and 0 failures.

- [ ] **Step 8: Commit verified media**

```bash
git add demo/vessel-zero/media demo/solaire-01/media tests/showcase-media.test.mjs
git commit -m "feat: add reviewed Seedance showcase footage"
```

---

### Task 3: Build VESSEL ZERO with a tested mission planner

**Files:**
- Create: `demo/vessel-zero/index.html`
- Create: `demo/vessel-zero/site.css`
- Create: `demo/vessel-zero/site.js`
- Create: `tests/vessel-zero.test.mjs`

**Interfaces:**
- Consumes: `media/vz-01.mp4`, `media/vz-02.mp4`, `media/vz-03.mp4` and matching posters.
- Produces: `calculateMission({ route, depth, priority }): { durationHours, energyPercent, packageName }`, `resetMission()`, and a complete six-section site.

- [ ] **Step 1: Write the failing structural and interaction tests**

```js
test('ships the approved six-chapter expedition story', () => {
  const ids = [...html.matchAll(/<section[^>]+id="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(ids, ['deployment', 'descent', 'sensing', 'array', 'encounter', 'planner']);
  assert.match(html, /fictional Mote Ops design concept/i);
  assert.match(html, /Concept mission simulation/i);
  for (const id of ['vz-01', 'vz-02', 'vz-03']) assert.match(html, new RegExp(`media/${id}\\.mp4`));
});

test('keeps motion progressive and planner rules deterministic', () => {
  assert.match(js, /function calculateMission/);
  assert.match(js, /requestAnimationFrame/);
  assert.match(js, /IntersectionObserver/);
  assert.match(js, /prefers-reduced-motion/);
  assert.match(js, /aria-live/);
  assert.doesNotMatch(js, /fetch\s*\(|XMLHttpRequest|sendBeacon/);
});
```

- [ ] **Step 2: Run the VESSEL ZERO tests and verify failure**

Run: `node --test tests/vessel-zero.test.mjs`

Expected: FAIL because the site files do not exist.

- [ ] **Step 3: Implement semantic HTML**

Create the six exact section IDs, one `<h1>`, clear fictional framing, three local videos with posters, the mission planner form, visible fallback copy, a skip link, and a Mote Ops return link.

- [ ] **Step 4: Implement the expedition visual system**

Use the exact four-color palette and IBM Plex families. Build hard rules, depth marks, mission coordinates, sparse particle canvas, and safety-orange active states. Do not use gradients for atmosphere or reuse ONDE HALO geometry.

- [ ] **Step 5: Implement deterministic mission calculations**

```js
const ROUTES = {
  shelf: { hours: 3.5, energy: 38, packageName: 'Optical survey package' },
  slope: { hours: 5.25, energy: 57, packageName: 'Water-column package' },
  trench: { hours: 7.75, energy: 76, packageName: 'Pressure and sonar package' },
};

function calculateMission({ route, depth, priority }) {
  const base = ROUTES[route] || ROUTES.shelf;
  const depthFactor = Math.max(0, Number(depth) - 1000) / 4000;
  const priorityFactor = priority === 'samples' ? 1.12 : priority === 'mapping' ? 1.06 : 1;
  return {
    durationHours: Number((base.hours * priorityFactor + depthFactor).toFixed(1)),
    energyPercent: Math.min(94, Math.round(base.energy + depthFactor * 14)),
    packageName: base.packageName,
  };
}
```

- [ ] **Step 6: Implement progressive motion and fallbacks**

Use one RAF loop for scroll variables, an intersection observer for media pause/play, a DPR-capped canvas, reduced-motion branches, and a `video-error` class that exposes the poster and fallback caption.

- [ ] **Step 7: Run the VESSEL ZERO tests**

Run: `node --test tests/vessel-zero.test.mjs`

Expected: PASS with 0 failures.

- [ ] **Step 8: Commit the complete VESSEL ZERO milestone**

```bash
git add demo/vessel-zero tests/vessel-zero.test.mjs
git commit -m "feat: build VESSEL ZERO cinematic concept"
```

---

### Task 4: Build SOLAIRE / 01 with a tested observation planner

**Files:**
- Create: `demo/solaire-01/index.html`
- Create: `demo/solaire-01/site.css`
- Create: `demo/solaire-01/site.js`
- Create: `tests/solaire-01.test.mjs`

**Interfaces:**
- Consumes: `media/so-01.mp4`, `media/so-02.mp4`, `media/so-03.mp4` and matching posters.
- Produces: `buildSchedule({ date, program, sessionMinutes }): Array<{ label, minutes }>` and a complete six-section site.

- [ ] **Step 1: Write the failing structural and interaction tests**

```js
test('ships the approved six-chapter architectural monograph', () => {
  const ids = [...html.matchAll(/<section[^>]+id="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(ids, ['approach', 'solar-axis', 'aperture', 'material', 'alignment', 'planner']);
  assert.match(html, /fictional Mote Ops design concept/i);
  assert.match(html, /Concept observation schedule/i);
  for (const id of ['so-01', 'so-02', 'so-03']) assert.match(html, new RegExp(`media/${id}\\.mp4`));
});

test('uses an independent architectural system and deterministic schedule', () => {
  assert.match(css, /#D8C8A8/i);
  assert.match(css, /#25221E/i);
  assert.match(js, /function buildSchedule/);
  assert.match(js, /IntersectionObserver/);
  assert.match(js, /prefers-reduced-motion/);
  assert.doesNotMatch(css, /glass|backdrop-filter|radial-gradient/i);
});
```

- [ ] **Step 2: Run the SOLAIRE tests and verify failure**

Run: `node --test tests/solaire-01.test.mjs`

Expected: FAIL because the site files do not exist.

- [ ] **Step 3: Implement semantic HTML**

Create the six exact section IDs, one `<h1>`, clear fictional framing, three local videos with posters, architectural annotations, the observation planner, fallback copy, a skip link, and a Mote Ops return link.

- [ ] **Step 4: Implement the architectural visual system**

Use the five approved colors, Source Serif 4, and Source Sans 3. Build elevation-like grids, long rules, restrained captions, material closeups, and a daylight-to-night transition without generic luxury treatment.

- [ ] **Step 5: Implement deterministic schedule generation**

```js
function buildSchedule({ program, sessionMinutes }) {
  const total = Math.max(60, Math.min(360, Number(sessionMinutes) || 120));
  const setup = program === 'spectroscopy' ? 35 : 25;
  const calibration = program === 'imaging' ? 25 : 20;
  const close = 15;
  return [
    { label: 'Instrument setup', minutes: setup },
    { label: 'Calibration', minutes: calibration },
    { label: 'Observation', minutes: Math.max(20, total - setup - calibration - close) },
    { label: 'Close-down', minutes: close },
  ];
}
```

- [ ] **Step 6: Implement progressive motion and fallbacks**

Use one RAF loop for shadow/aperture variables, intersection-observer media control, reduced-motion branches, and poster-led error states. Do not share VESSEL ZERO layout or animation curves.

- [ ] **Step 7: Run the SOLAIRE tests**

Run: `node --test tests/solaire-01.test.mjs`

Expected: PASS with 0 failures.

- [ ] **Step 8: Commit the complete SOLAIRE milestone**

```bash
git add demo/solaire-01 tests/solaire-01.test.mjs
git commit -m "feat: build SOLAIRE 01 architectural concept"
```

---

### Task 5: Add truthful homepage portals without disturbing existing work

**Files:**
- Modify: `index.html`
- Modify: `site.css`
- Modify: `tests/site-contract.test.mjs`

**Interfaces:**
- Consumes: two locally verified concept URLs.
- Produces: separate `DESIGN CONCEPT / FICTIONAL PRODUCT` portal cards after the existing ONDE HALO card.

- [ ] **Step 1: Extend the failing homepage contract**

```js
test('keeps all fictional cinematic concepts separate from client proof', () => {
  const gallery = elementById('demo-gallery', 'section');
  for (const [id, href, title] of [
    ['vessel-concept', 'demo/vessel-zero/index.html', 'VESSEL ZERO'],
    ['solaire-concept', 'demo/solaire-01/index.html', 'SOLAIRE / 01'],
  ]) {
    const concept = elementById(id, 'aside');
    assert.ok(concept.start >= gallery.start && concept.end <= gallery.end);
    assert.match(concept.source, /DESIGN CONCEPT/i);
    assert.match(concept.source, /FICTIONAL/i);
    assert.match(concept.source, new RegExp(href.replaceAll('/', '\\/')));
    assert.match(concept.source, new RegExp(title.replace('/', '\\/')));
  }
});
```

- [ ] **Step 2: Run the homepage contract and verify failure**

Run: `node --test tests/site-contract.test.mjs`

Expected: FAIL because both portal cards are missing.

- [ ] **Step 3: Add the two portal cards**

Use semantic `<aside>` elements after the current ONDE concept. Each card states that the interface, motion, footage direction, and code are real while the brand and product are fictional.

- [ ] **Step 4: Add focused portal styling**

Extend the existing concept gallery system without changing unrelated homepage sections or overwriting current uncommitted visual work.

- [ ] **Step 5: Run the homepage and full static test suite**

Run: `npm test`

Expected: all tests pass with 0 failures.

- [ ] **Step 6: Commit homepage integration**

```bash
git add index.html site.css tests/site-contract.test.mjs
git commit -m "feat: add cinematic concepts to showcase portal"
```

---

### Task 6: Verify the complete pair and publish separate review links

**Files:**
- Modify: `demo/vessel-zero/.gitignore`
- Create: `demo/vessel-zero/.vercel/project.json` through Vercel linking
- Modify: `demo/solaire-01/.gitignore`
- Create: `demo/solaire-01/.vercel/project.json` through Vercel linking

**Interfaces:**
- Consumes: both complete static sites and full repository test suite.
- Produces: two stable public HTTPS review URLs.

- [ ] **Step 1: Run complete automated verification**

Run:

```bash
npm test
find demo/vessel-zero demo/solaire-01 -type f -maxdepth 2 -print
```

Expected: 0 failing tests and all referenced media files present.

- [ ] **Step 2: Start one local static server**

Run: `npx serve .`

Keep the server alive through both browser reviews.

- [ ] **Step 3: Verify both sites on desktop and 390-pixel mobile**

For each site verify section order, video/poster behavior, planner calculations, reset, copy status, keyboard focus, reduced motion, no horizontal overflow, and no console warnings or errors.

- [ ] **Step 4: Perform the theater check**

Click every visible control. Remove or repair anything that does not perform the action it implies. Confirm concept data is labeled as simulated and no number is presented as live.

- [ ] **Step 5: Deploy VESSEL ZERO as a separate Vercel project**

From `demo/vessel-zero`, create or link project `moteops-vessel-zero`, then run the production deployment command. Confirm the returned deployment is READY and the stable URL returns HTTP 200.

- [ ] **Step 6: Deploy SOLAIRE / 01 as a separate Vercel project**

From `demo/solaire-01`, create or link project `moteops-solaire-01`, then run the production deployment command. Confirm the returned deployment is READY and the stable URL returns HTTP 200.

- [ ] **Step 7: Verify both public URLs**

Check public HTML, CSS, JavaScript, all three MP4 files, and all posters for HTTP 200. Run one public desktop and mobile browser pass per site.

- [ ] **Step 8: Commit deployment metadata and final verification fixes**

```bash
git add demo/vessel-zero/.gitignore demo/solaire-01/.gitignore demo/vessel-zero demo/solaire-01 tests
git commit -m "chore: prepare cinematic concepts for review"
```

- [ ] **Step 9: Report the two stable HTTPS review links**

Return the URLs as the primary deliverable. State that the live `moteops.tech` homepage remains unchanged until a separate explicit publish decision.
