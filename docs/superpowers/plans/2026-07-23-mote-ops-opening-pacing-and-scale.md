# Mote Ops Opening Pacing and Desktop Scale Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the existing film content while making the desktop player smaller and extending the four computer-interface holds to 1.8 seconds each.

**Architecture:** The film remains a deterministic FFmpeg composition assembled from the accepted source scenes and local interface plates. Timing changes stay in the opening-film build script, display changes stay in the opening-film stylesheet, and the media manifest remains the audit record for the resulting responsive masters.

**Tech Stack:** Static HTML/CSS, Node test runner, FFmpeg/ffprobe, Chrome/Playwright, Vercel protected preview.

## Global Constraints

- Preserve all three existing generated source scenes and spend no additional Higgsfield credits.
- Preserve the stress scene, discovery email, office lead-in, office tail, and beach scene at their current playback speed.
- Hold each of the four computer-interface plates for exactly 1.8 seconds.
- Produce a 26.8-second silent H.264 film at 24 fps with fast-start metadata.
- Center the desktop player at a maximum width of 1180 pixels with at least 32 pixels of viewport space per side.
- Preserve the current phone width, caption, disclosure, motion control, play-once, offscreen pause, and replay behavior.
- Do not change `moteops.tech` until Mike separately approves the revised preview.

---

### Task 1: Lock pacing and display contracts

**Files:**
- Modify: `tests/opening-film.test.mjs`
- Modify: `production/opening-film/build-opening-film.sh`
- Modify: `opening-film.css`

**Interfaces:**
- Consumes: the existing `build-opening-film.sh` input order and `.opening-story` markup.
- Produces: a 26.8-second FFmpeg composition contract and a centered desktop `.opening-story` width contract.

- [ ] **Step 1: Write the failing timing and width tests**

Add tests that count four `trim=duration=1.8` interface segments, require `-t 26.8` on both released masters, require the beach overlays at `23.0–26.8` and `24.8–26.8`, and require a desktop rule containing `max-width: 1180px`, `width: calc(100vw - 64px)`, and centered placement.

```js
test('holds four computer interface cuts for 1.8 seconds in a 26.8 second film', () => {
  const buildScript = read('production/opening-film/build-opening-film.sh');
  assert.equal((buildScript.match(/trim=duration=1\.8/g) || []).length, 4);
  assert.equal((buildScript.match(/-t 26\.8/g) || []).length, 2);
  assert.match(buildScript, /between\(t,23\.0,26\.8\)/);
  assert.match(buildScript, /between\(t,24\.8,26\.8\)/);
});

test('centers a constrained opening film on desktop without shrinking phone layout', () => {
  const css = read('opening-film.css');
  assert.match(css, /@media \(min-width: 1021px\)[\s\S]*?\.opening-story\s*\{[\s\S]*?max-width:\s*1180px/);
  assert.match(css, /width:\s*calc\(100vw - 64px\)/);
  assert.match(css, /justify-self:\s*center/);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*?\.opening-story\s*\{[\s\S]*?width:\s*100%/);
});
```

- [ ] **Step 2: Run the focused tests and confirm RED**

Run:

```bash
node --test --test-name-pattern="holds four computer|centers a constrained" tests/opening-film.test.mjs
```

Expected: two assertion failures because the build is still 24 seconds and the player is still full bleed.

- [ ] **Step 3: Implement the minimum timing and CSS changes**

In `build-opening-film.sh`, change the four interface inputs and trims to 1.8 seconds, extend overlay inputs and both output limits to 26.8 seconds, and move the two beach overlays to the new beach interval. In `opening-film.css`, remove the desktop full-bleed margin and add:

```css
.opening-story {
  grid-column: 1 / -1;
  justify-self: center;
  margin: 0;
  min-width: 0;
  width: 100%;
}

@media (min-width: 1021px) {
  .opening-story {
    max-width: 1180px;
    width: calc(100vw - 64px);
  }
}
```

Keep the phone rule explicit:

```css
@media (max-width: 760px) {
  .opening-story {
    margin: 0;
    width: 100%;
  }
}
```

- [ ] **Step 4: Run focused and full tests**

Run:

```bash
node --test tests/opening-film.test.mjs
npm test
npm run build
git diff --check
```

Expected: all focused tests and all repository tests pass; build and whitespace checks exit 0.

- [ ] **Step 5: Commit**

```bash
git add tests/opening-film.test.mjs production/opening-film/build-opening-film.sh opening-film.css
git commit -m "feat: slow interface cuts and constrain opening film"
```

---

### Task 2: Render and audit revised media

**Files:**
- Modify: `assets/cinematic/mote-ops-opening-1080.mp4`
- Modify: `assets/cinematic/mote-ops-opening-720.mp4`
- Modify: `assets/cinematic/mote-ops-opening-poster.webp`
- Modify: `assets/cinematic/mote-ops-opening-manifest.json`
- Modify: `tests/opening-film.test.mjs`

**Interfaces:**
- Consumes: the accepted raw scenes and rendered local plates used by `build-opening-film.sh`.
- Produces: verified 26.8-second responsive masters and matching size/hash records.

- [ ] **Step 1: Copy the preserved ignored production inputs into the revision worktree**

Run:

```bash
cp -Rp ../moteops-cinematic-redesign/production/opening-film/raw/. production/opening-film/raw/
cp -Rp ../moteops-cinematic-redesign/production/opening-film/rendered production/opening-film/
```

Expected: the three raw MP4 files and all required rendered PNG plates exist locally and remain ignored by Git.

- [ ] **Step 2: Change the media-duration assertion and confirm RED**

Replace the 24-second range assertion with:

```js
assert.ok(Number(metadata.format.duration) >= 26.8 && Number(metadata.format.duration) <= 26.85);
```

Run:

```bash
node --test --test-name-pattern="publishes exact silent" tests/opening-film.test.mjs
```

Expected: FAIL because the committed masters are still 24 seconds.

- [ ] **Step 3: Render the revised masters and poster**

Run:

```bash
bash production/opening-film/build-opening-film.sh
```

Expected: new 1080p and 720p MP4s plus the WebP poster are written under `assets/cinematic/`.

- [ ] **Step 4: Measure outputs and update the manifest**

Run `ffprobe`, `stat`, and `shasum -a 256` for the three outputs. Update:

- `durationSeconds` to `26.8`
- `outputs.master1080.durationSeconds` and `outputs.master720.durationSeconds` to `26.8`
- both MP4 `sizeBytes` and `sha256`
- poster `sizeBytes` and `sha256`
- `frameReview.timesSeconds` to include the new interface boundaries `11.2`, `13.0`, `14.8`, `16.6`, the office-to-beach boundary `18.8`, and the new ending `26.8`
- `frameReview.result` to `pending-revised-frame-review`

- [ ] **Step 5: Verify the media contract**

Run:

```bash
node --test tests/opening-film.test.mjs
npm test
npm run build
git diff --check
```

Expected: all tests pass, both MP4s are silent H.264 at 24 fps with fast-start metadata, and manifest hashes match.

- [ ] **Step 6: Commit**

```bash
git add tests/opening-film.test.mjs assets/cinematic/mote-ops-opening-1080.mp4 assets/cinematic/mote-ops-opening-720.mp4 assets/cinematic/mote-ops-opening-poster.webp assets/cinematic/mote-ops-opening-manifest.json
git commit -m "feat: render slower Mote Ops opening cut"
```

---

### Task 3: Browser-review and deploy a protected preview

**Files:**
- Create: `.superpowers/sdd/opening-v2-desktop.png`
- Create: `.superpowers/sdd/opening-v2-mobile.png`
- Create: `.superpowers/sdd/opening-v2-verification.md`

**Interfaces:**
- Consumes: the revised static site and verified media from Tasks 1 and 2.
- Produces: browser evidence and a protected review URL without modifying the production domain.

- [ ] **Step 1: Start the local static server**

Run:

```bash
npx serve . -l 4173
```

Expected: the revision is available on a reported localhost port.

- [ ] **Step 2: Verify desktop and phone layouts**

Using Playwright with system Chrome:

- At 1440×1000, assert the film is centered, no wider than 1180 pixels, and at least 32 pixels from each viewport edge.
- At 390×844, assert the film uses the available content width and the page has no horizontal overflow.
- Verify playback advances, the duration is 26.8 seconds, replay appears after completion, reduced-motion defers source loading, and there are no page or console errors.
- Save desktop and phone screenshots.

- [ ] **Step 3: Complete the revised frame review**

Inspect frames immediately before and after each interface boundary and the `18.8` second beach cut. Update the manifest frame review result to `passed` only if every interface plate remains readable and the longer pacing has no blank or duplicated frames.

- [ ] **Step 4: Deploy only to the existing isolated Vercel review project**

Reuse the existing `moteops-cinematic-review` project metadata and run a preview deployment without a production target. Confirm the deployment is `READY`, its commit SHA matches the revision branch, and `moteops.tech` remains on production commit `7537811`.

- [ ] **Step 5: Verify deployed assets**

Using the temporary protected share URL, verify:

- homepage, stylesheet, motion script, and poster return HTTP 200
- both MP4s return HTTP 206 for `bytes=0-1023`
- deployed MP4 and poster hashes match the local revised artifacts
- local production routes under `/production/opening-film/` return HTTP 404

- [ ] **Step 6: Record and commit evidence**

Write `.superpowers/sdd/opening-v2-verification.md` with the deployment ID, share-link expiration, browser dimensions, media hashes, route checks, and the statement that `moteops.tech` was not changed.

```bash
git add -f .superpowers/sdd/opening-v2-desktop.png .superpowers/sdd/opening-v2-mobile.png .superpowers/sdd/opening-v2-verification.md
git commit -m "docs: verify slower opening review candidate"
```

- [ ] **Step 7: Run the final release gate**

Run:

```bash
npm test
npm run build
git diff --check
git status --short
```

Expected: all tests pass, build and whitespace checks exit 0, and only ignored/local deployment metadata remains untracked.
