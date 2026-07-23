# Mote Ops Actor-Monitor Composite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the four full-frame cleanup interfaces with deterministic composites that visibly place those interfaces inside the actor's monitor, while preserving the accepted footage, readable timing, responsive player, and production boundary.

**Architecture:** A dedicated local capture surface will combine one extracted frame from the accepted cleanup film, a CSS monitor shell, and the existing HTML interface plates. FFmpeg will use the four resulting composites with seven-frame push-in and pull-back dissolves while preserving four complete 1.8-second reading plateaus and the existing 26.791667-second story.

**Tech Stack:** Static HTML/CSS, shell scripts, headless Chrome, FFmpeg/ffprobe, Node test runner, Playwright with system Chrome, Vercel protected preview.

## Global Constraints

- Spend no Higgsfield credits and generate no replacement footage.
- Keep all four existing interface plates unchanged in meaning and copy.
- Render a 1,344-pixel-wide monitor bezel inside each 1,920 × 1,080 composite.
- Keep visible office context around every interface view.
- Keep each interface readable for a complete 1.8 seconds.
- Use seven-frame, 0.291667-second push-in and pull-back transitions at 24 fps.
- Preserve the 26.791667-second master duration with a one-frame tolerance.
- Preserve the 1,180-pixel desktop player and 358-pixel phone player behavior.
- Preserve the current disclosure, Motion control, reduced-motion behavior, play-once behavior, and replay behavior.
- Do not merge, publish to `moteops.tech`, alter access settings, or change the production deployment.

---

### Task 1: Build the deterministic monitor-composite capture surface

**Files:**
- Create: `production/opening-film/monitor-plates.html`
- Create: `production/opening-film/monitor-plates.css`
- Create: `production/opening-film/capture-monitor-plates.sh`
- Modify: `production/opening-film/plates.html`
- Modify: `production/opening-film/plates.css`
- Modify: `package.json`
- Modify: `tests/opening-film.test.mjs`

**Interfaces:**
- Consumes: `production/opening-film/raw/shot-02-cleanup.mp4` and the four existing plate names in `plates.html`.
- Produces: `production/opening-film/rendered/monitor-office.png` plus `monitor-organized-inbox.png`, `monitor-calendar-resolution.png`, `monitor-review-packet.png`, and `monitor-approval-queue.png`, all at 1,920 × 1,080.

- [ ] **Step 1: Write the failing capture-surface contract**

Add this test to `tests/opening-film.test.mjs`:

```js
test('captures four cleanup interfaces inside one physical monitor treatment', () => {
  const html = read('production/opening-film/monitor-plates.html');
  const css = read('production/opening-film/monitor-plates.css');
  const capture = read('production/opening-film/capture-monitor-plates.sh');
  const plates = read('production/opening-film/plates.html');
  const packageJson = JSON.parse(read('package.json'));

  assert.match(html, /class="monitor-shell"/);
  assert.match(html, /class="monitor-screen"/);
  assert.match(html, /class="monitor-reflection"/);
  assert.match(html, /plates\.html\?plate=/);
  assert.match(css, /\.monitor-shell[\s\S]*width:\s*1344px/);
  assert.match(css, /\.monitor-screen[\s\S]*width:\s*1280px[\s\S]*height:\s*720px/);
  assert.match(css, /background-image:\s*url\("rendered\/monitor-office\.png"\)/);
  assert.match(css, /filter:\s*blur\(8px\) brightness\(\.58\)/);
  assert.match(css, /perspective\(2400px\) rotateY\(-1\.5deg\) rotateX\(\.4deg\)/);
  assert.match(css, /\.monitor-reflection[\s\S]*linear-gradient/);

  for (const name of [
    'organized-inbox',
    'calendar-resolution',
    'review-packet',
    'approval-queue',
  ]) {
    assert.match(capture, new RegExp(`monitor-${name}\\.png`));
  }

  assert.match(capture, /shot-02-cleanup\.mp4/);
  assert.match(capture, /-ss 0\.8/);
  assert.match(capture, /--window-size=1920,1080/);
  assert.match(plates, /embedMode === 'monitor'/);
  assert.match(plates, /monitor-embed/);
  assert.equal(
    packageJson.scripts['capture:opening-monitor'],
    'bash production/opening-film/capture-monitor-plates.sh'
  );
});
```

- [ ] **Step 2: Run the focused test and confirm RED**

Run:

```bash
node --test --test-name-pattern="captures four cleanup interfaces" tests/opening-film.test.mjs
```

Expected: FAIL with `ENOENT` for `production/opening-film/monitor-plates.html`.

- [ ] **Step 3: Add the dedicated monitor page**

Create `production/opening-film/monitor-plates.html`:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Mote Ops monitor composite</title>
  <link rel="stylesheet" href="monitor-plates.css">
</head>
<body>
  <main class="monitor-stage">
    <div class="monitor-shell">
      <div class="monitor-screen">
        <iframe id="monitor-interface" title="Mote Ops interface"></iframe>
      </div>
      <div class="monitor-reflection" aria-hidden="true"></div>
    </div>
  </main>
  <script>
    const allowed = new Set([
      'organized-inbox',
      'calendar-resolution',
      'review-packet',
      'approval-queue',
    ]);
    const plate = new URLSearchParams(location.search).get('plate');
    if (!allowed.has(plate)) throw new Error(`Unsupported monitor plate: ${plate}`);
    const source = new URL('plates.html', location.href);
    source.searchParams.set('plate', plate);
    source.searchParams.set('embed', 'monitor');
    document.querySelector('#monitor-interface').src = source.href;
  </script>
</body>
</html>
```

- [ ] **Step 4: Add the physical monitor treatment**

Create `production/opening-film/monitor-plates.css`:

```css
:root {
  background: #171814;
  color-scheme: dark;
}

* { box-sizing: border-box; }

html,
body {
  height: 1080px;
  margin: 0;
  overflow: hidden;
  width: 1920px;
}

body::before {
  background-image: url("rendered/monitor-office.png");
  background-position: center;
  background-size: cover;
  content: "";
  filter: blur(8px) brightness(.58);
  inset: -18px;
  position: absolute;
}

.monitor-stage {
  height: 1080px;
  position: relative;
  width: 1920px;
}

.monitor-shell {
  background: linear-gradient(145deg, #252722, #0e100d 72%);
  border: 1px solid rgba(255, 255, 255, .14);
  border-radius: 18px;
  box-shadow: 0 42px 90px rgba(0, 0, 0, .52);
  height: 792px;
  left: 448px;
  padding: 28px 32px 44px;
  position: absolute;
  top: 138px;
  transform: perspective(2400px) rotateY(-1.5deg) rotateX(.4deg);
  transform-origin: center;
  width: 1344px;
}

.monitor-screen {
  background: #11130f;
  height: 720px;
  overflow: hidden;
  position: relative;
  width: 1280px;
}

.monitor-screen iframe {
  border: 0;
  height: 1080px;
  transform: scale(0.6666667);
  transform-origin: 0 0;
  width: 1920px;
}

.monitor-reflection {
  background: linear-gradient(
    118deg,
    rgba(255, 255, 255, .10),
    rgba(255, 255, 255, 0) 27%,
    rgba(255, 255, 255, .035) 72%,
    rgba(255, 255, 255, 0)
  );
  inset: 28px 32px 44px;
  pointer-events: none;
  position: absolute;
}
```

- [ ] **Step 5: Add the monitor-specific plate density**

In the existing `plates.html` script, define the embed mode before revealing the selected plate:

```js
const params = new URLSearchParams(location.search);
const selectedPlate = params.get('plate');
const embedMode = params.get('embed');
document.body.classList.toggle('overlay-mode', selectedPlate?.startsWith('overlay-'));
document.body.classList.toggle('monitor-embed', embedMode === 'monitor');
```

In `plates.css`, add:

```css
.monitor-embed .plate {
  padding: 72px;
}

.monitor-embed .plate::after {
  inset: 34px;
}

.monitor-embed .truth {
  left: 72px;
  top: 34px;
}

.monitor-embed .plate main {
  padding: 44px 70px 30px;
}

.monitor-embed .plate h1 {
  font-size: 104px;
}

.monitor-embed .work-list article,
.monitor-embed .approval-list article {
  min-height: 184px;
}
```

This changes typography density only when the interface is embedded in the monitor. It does not alter the existing discovery email or standalone capture plates.

- [ ] **Step 6: Add deterministic extraction and capture**

Create `production/opening-film/capture-monitor-plates.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

chrome="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
here="$(cd "$(dirname "$0")" && pwd)"
raw="$here/raw"
output="$here/rendered"
profile="$(mktemp -d "${TMPDIR:-/tmp}/mote-monitor-chrome.XXXXXX")"
trap 'rm -rf "$profile"' EXIT
mkdir -p "$output"

ffmpeg -hide_banner -loglevel warning -y \
  -ss 0.8 -i "$raw/shot-02-cleanup.mp4" -frames:v 1 \
  -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080" \
  "$output/monitor-office.png"

plates=(
  organized-inbox
  calendar-resolution
  review-packet
  approval-queue
)

for plate in "${plates[@]}"; do
  screenshot="$output/monitor-$plate.png"
  rm -f "$screenshot"
  "$chrome" \
    --headless=new \
    --allow-file-access-from-files \
    --disable-background-networking \
    --disable-component-update \
    --disable-gpu \
    --hide-scrollbars \
    --no-first-run \
    --force-device-scale-factor=1 \
    --user-data-dir="$profile" \
    --window-size=1920,1080 \
    --screenshot="$screenshot" \
    "file://$here/monitor-plates.html?plate=$plate" >/dev/null 2>&1 &
  chrome_pid=$!
  for _ in {1..100}; do
    test -s "$screenshot" && break
    sleep .1
  done
  if ! test -s "$screenshot"; then
    kill "$chrome_pid" 2>/dev/null || true
    wait "$chrome_pid" 2>/dev/null || true
    echo "Chrome did not render monitor-$plate within 10 seconds" >&2
    exit 1
  fi
  kill "$chrome_pid" 2>/dev/null || true
  wait "$chrome_pid" 2>/dev/null || true
done
```

Add to `package.json`:

```json
"capture:opening-monitor": "bash production/opening-film/capture-monitor-plates.sh"
```

- [ ] **Step 7: Run the focused and full contracts**

Run:

```bash
node --test --test-name-pattern="captures four cleanup interfaces" tests/opening-film.test.mjs
npm test
npm run build
git diff --check
```

Expected: the focused test and full repository suite pass; build and whitespace checks exit 0.

- [ ] **Step 8: Commit the capture surface**

```bash
git add tests/opening-film.test.mjs package.json production/opening-film/monitor-plates.html production/opening-film/monitor-plates.css production/opening-film/capture-monitor-plates.sh production/opening-film/plates.html production/opening-film/plates.css
git commit -m "feat: add actor monitor composite capture"
```

---

### Task 2: Render and visually approve the four monitor composites

**Files:**
- Create, ignored: `production/opening-film/rendered/monitor-office.png`
- Create, ignored: `production/opening-film/rendered/monitor-organized-inbox.png`
- Create, ignored: `production/opening-film/rendered/monitor-calendar-resolution.png`
- Create, ignored: `production/opening-film/rendered/monitor-review-packet.png`
- Create, ignored: `production/opening-film/rendered/monitor-approval-queue.png`
- Create: `.superpowers/sdd/opening-monitor-composite-review.md`

**Interfaces:**
- Consumes: the deterministic capture surface from Task 1 and the accepted cleanup source.
- Produces: four approved, ignored composite inputs for the media build.

- [ ] **Step 1: Capture the office frame and four composites**

Run:

```bash
npm run capture:opening-monitor
```

Expected: all five PNG files are written under `production/opening-film/rendered/`.

- [ ] **Step 2: Verify exact dimensions**

Run:

```bash
for image in production/opening-film/rendered/monitor-*.png; do
  sips -g pixelWidth -g pixelHeight "$image"
done
```

Expected: every image reports `pixelWidth: 1920` and `pixelHeight: 1080`.

- [ ] **Step 3: Inspect every composite at desktop and phone projection sizes**

Review all four full-resolution PNGs and scaled copies at 358 pixels wide. Require:

- the same bezel on every frame;
- visible actor or office context to the left and around the monitor;
- no interface content outside the screen;
- no plate touching the outer film edge;
- readable primary headings and actions at 358 pixels;
- no clipping, iframe load failure, blank frame, or browser chrome.

If any requirement fails, adjust only `monitor-plates.css` or the `.monitor-embed` rules, rerun the capture, and repeat this review.

- [ ] **Step 4: Record the source-composite review**

Create `.superpowers/sdd/opening-monitor-composite-review.md` containing:

```markdown
# Opening monitor composite review

- Source: accepted `shot-02-cleanup.mp4`, frame at 0.8 seconds.
- Generated footage: unchanged.
- Higgsfield credits spent: 0.
- Composite dimensions: 1920 × 1080.
- Monitor outer width: 1344 pixels.
- Interface screen: 1280 × 720.
- Desktop review: passed.
- 358-pixel phone projection: passed.
- Result: approved for film assembly.
```

- [ ] **Step 5: Commit the review receipt**

```bash
git add -f .superpowers/sdd/opening-monitor-composite-review.md
git commit -m "docs: approve actor monitor composite inputs"
```

---

### Task 3: Assemble the push-in, readable holds, and pull-back

**Files:**
- Modify: `production/opening-film/build-opening-film.sh`
- Modify: `tests/opening-film.test.mjs`

**Interfaces:**
- Consumes: the four approved `monitor-*.png` composites from Task 2.
- Produces: a deterministic 24fps edit with a seven-frame office-to-monitor transition, four 1.8-second stable interface plateaus, and a seven-frame monitor-to-office transition.

- [ ] **Step 1: Write the failing assembly contract**

Add this test:

```js
test('assembles monitor composites with seven-frame transitions and full reading plateaus', () => {
  const buildScript = read('production/opening-film/build-opening-film.sh');
  for (const name of [
    'monitor-organized-inbox.png',
    'monitor-calendar-resolution.png',
    'monitor-review-packet.png',
    'monitor-approval-queue.png',
  ]) {
    assert.match(buildScript, new RegExp(name.replace('.', '\\.')));
  }

  assert.match(buildScript, /interface_hold="1\.8"/);
  assert.match(buildScript, /transition="0\.291667"/);
  assert.match(buildScript, /transition_plate="2\.091667"/);
  assert.equal((buildScript.match(/duration=\$\{transition\}/g) || []).length, 2);
  assert.match(buildScript, /offset=1\.108333/);
  assert.match(buildScript, /offset=8\.600000/);
  assert.match(buildScript, /scale=w='trunc\(1920\*\(1\+0\.012\*min\(n\\,7\)\/7\)\/2\)\*2'/);
  assert.match(buildScript, /scale=w='trunc\(1920\*\(1\.012-0\.012\*min\(n\\,7\)\/7\)\/2\)\*2'/);
});
```

- [ ] **Step 2: Run the focused test and confirm RED**

Run:

```bash
node --test --test-name-pattern="assembles monitor composites" tests/opening-film.test.mjs
```

Expected: FAIL because the build still references the standalone full-frame plates.

- [ ] **Step 3: Replace the cleanup inputs and define exact timing**

Near the top of `build-opening-film.sh`, add:

```bash
interface_hold="1.8"
transition="0.291667"
transition_plate="2.091667"
```

Replace the four cleanup image inputs with:

```bash
-framerate 24 -loop 1 -t "$transition_plate" -i "$rendered/monitor-organized-inbox.png" \
-framerate 24 -loop 1 -t "$interface_hold" -i "$rendered/monitor-calendar-resolution.png" \
-framerate 24 -loop 1 -t "$interface_hold" -i "$rendered/monitor-review-packet.png" \
-framerate 24 -loop 1 -t "$transition_plate" -i "$rendered/monitor-approval-queue.png" \
```

Update the required-input list to use the same four `monitor-*.png` paths.

- [ ] **Step 4: Replace the hard cuts with the two transition segments**

Use the existing normalized actor lead and tail. Replace the four cleanup trims and the nine-input story concat with:

```text
[3:v]${normalize},trim=duration=${transition_plate},setpts=PTS-STARTPTS,
scale=w='trunc(1920*(1+0.012*min(n\,7)/7)/2)*2':h='trunc(1080*(1+0.012*min(n\,7)/7)/2)*2':eval=frame,
crop=1920:1080[v3];
[4:v]${normalize},trim=duration=${interface_hold},setpts=PTS-STARTPTS[v4];
[5:v]${normalize},trim=duration=${interface_hold},setpts=PTS-STARTPTS[v5];
[6:v]${normalize},trim=duration=${transition_plate},setpts=PTS-STARTPTS,
scale=w='trunc(1920*(1.012-0.012*min(n\,7)/7)/2)*2':h='trunc(1080*(1.012-0.012*min(n\,7)/7)/2)*2':eval=frame,
crop=1920:1080[v6];
[v2][v3]xfade=transition=fade:duration=${transition}:offset=1.108333[monitor_in];
[monitor_in][v4][v5][v6]concat=n=4:v=1:a=0[monitor_sequence];
[monitor_sequence][v7]xfade=transition=fade:duration=${transition}:offset=8.600000[cleanup];
[v0][v1][cleanup][v8]concat=n=4:v=1:a=0[story];
```

The first dissolve runs from global time 9.108333 to 9.400000. The four complete stable plateaus remain:

- 9.400000 to 11.200000;
- 11.200000 to 13.000000;
- 13.000000 to 14.800000;
- 14.800000 to 16.600000.

The pull-back runs from 16.600000 to 16.891667, and the accepted actor tail continues to the beach cut at 18.800000.

- [ ] **Step 5: Run the focused and full source contracts**

Run:

```bash
node --test --test-name-pattern="assembles monitor composites|holds four computer" tests/opening-film.test.mjs
npm test
npm run build
git diff --check
```

Expected: all source contracts and the full repository suite pass; static build and whitespace checks exit 0.

- [ ] **Step 6: Commit the assembly code**

```bash
git add tests/opening-film.test.mjs production/opening-film/build-opening-film.sh
git commit -m "feat: transition through actor monitor interfaces"
```

---

### Task 4: Render, audit, and record the revised responsive media

**Files:**
- Modify: `assets/cinematic/mote-ops-opening-1080.mp4`
- Modify: `assets/cinematic/mote-ops-opening-720.mp4`
- Modify: `assets/cinematic/mote-ops-opening-poster.webp`
- Modify: `assets/cinematic/mote-ops-opening-manifest.json`
- Modify: `tests/opening-film.test.mjs`
- Create: `.superpowers/sdd/opening-monitor-frame-review.md`

**Interfaces:**
- Consumes: the exact assembly from Task 3 and the four approved composite PNGs.
- Produces: silent, fast-start 1080p and 720p masters plus an auditable manifest and frame review.

- [ ] **Step 1: Add the manifest audit contract and confirm RED**

Extend the generation-ledger test:

```js
assert.deepEqual(manifest.postProduction.monitorComposite, {
  generatedCredits: 0,
  backgroundSource: 'accepted cleanup-control footage at 0.8 seconds',
  outerMonitorWidth: 1344,
  interfaceScreen: '1280x720',
  transitionFrames: 7,
  stableHoldSeconds: 1.8,
});
```

Run:

```bash
node --test --test-name-pattern="maintains an auditable opening-film" tests/opening-film.test.mjs
```

Expected: FAIL because `manifest.postProduction.monitorComposite` does not exist.

- [ ] **Step 2: Render the masters and poster**

Run:

```bash
bash production/opening-film/build-opening-film.sh
```

Expected: revised 1080p and 720p MP4s and the poster are written under `assets/cinematic/`.

- [ ] **Step 3: Measure and update the manifest**

Use `ffprobe`, `stat`, and `shasum -a 256` to record exact duration, dimensions, frame rate, byte size, audio state, fast-start order, and SHA-256 for the outputs.

Add:

```json
"postProduction": {
  "monitorComposite": {
    "generatedCredits": 0,
    "backgroundSource": "accepted cleanup-control footage at 0.8 seconds",
    "outerMonitorWidth": 1344,
    "interfaceScreen": "1280x720",
    "transitionFrames": 7,
    "stableHoldSeconds": 1.8
  }
}
```

Keep `durationSeconds` at `26.8`. Replace the output byte counts and hashes with the measured values. Add frame-review times at `9.10`, `9.39`, `9.41`, `11.19`, `11.21`, `12.99`, `13.01`, `14.79`, `14.81`, `16.59`, `16.61`, `16.89`, and `18.79`.

- [ ] **Step 4: Inspect every revised boundary**

Extract frames at the new review times and require:

- actor footage is visible before the push;
- the first interface appears only inside the monitor;
- the same monitor persists across all four states;
- no full-frame interface flashes at any boundary;
- the fourth interface pulls back into actor footage;
- no blank, duplicate, torn, or malformed frame appears;
- the beach transition remains unchanged.

Record results in `.superpowers/sdd/opening-monitor-frame-review.md` and set `manifest.frameReview.result` to `passed` only after every item passes.

- [ ] **Step 5: Verify exact media contracts**

Run:

```bash
node --test tests/opening-film.test.mjs
npm test
npm run build
git diff --check
```

Expected: all tests pass; both MP4s are silent H.264, 24fps, fast-start, and 26.791667 seconds within one frame; manifest sizes and hashes match the files.

- [ ] **Step 6: Commit media and review evidence**

```bash
git add tests/opening-film.test.mjs assets/cinematic/mote-ops-opening-1080.mp4 assets/cinematic/mote-ops-opening-720.mp4 assets/cinematic/mote-ops-opening-poster.webp assets/cinematic/mote-ops-opening-manifest.json
git add -f .superpowers/sdd/opening-monitor-frame-review.md
git commit -m "feat: render actor monitor opening revision"
```

---

### Task 5: Verify the complete experience and deploy a protected review

**Files:**
- Create: `.superpowers/sdd/opening-monitor-desktop.png`
- Create: `.superpowers/sdd/opening-monitor-mobile.png`
- Create: `.superpowers/sdd/opening-monitor-verification.md`

**Interfaces:**
- Consumes: the revised static site and verified media from Task 4.
- Produces: local browser evidence and one protected review URL, without changing production.

- [ ] **Step 1: Run the complete local release gate**

Run:

```bash
npm test
npm run build
git diff --check
git status --short
```

Expected: all repository tests pass; build and whitespace checks exit 0; only expected local `.vercel/` metadata may remain untracked.

- [ ] **Step 2: Verify desktop playback at 1,440 × 1,000**

Start a local server and use Playwright with system Chrome. Require:

- player x-position 130 and width 1,180;
- no horizontal overflow;
- 1080p source loads and playback advances;
- the push-in begins near 9.108 seconds;
- each interface is visibly inside a monitor;
- the pull-back begins near 16.600 seconds;
- replay appears after completion and restarts the story;
- no page errors or console errors.

Save `.superpowers/sdd/opening-monitor-desktop.png`.

- [ ] **Step 3: Verify phone playback at 390 × 844**

Require:

- player x-position 16 and width 358;
- 720p source loads and playback advances;
- major interface headings and actions remain readable;
- visible office context separates the film from the surrounding website;
- no horizontal overflow, page errors, or console errors.

Save `.superpowers/sdd/opening-monitor-mobile.png`.

- [ ] **Step 4: Recheck reduced motion and replay**

In reduced-motion mode, confirm neither video source is assigned before explicit Motion activation. After activation, confirm the correct responsive source loads and playback advances. At film completion, confirm the explicit Replay story control resets the film and restarts playback.

- [ ] **Step 5: Deploy only a protected preview**

Reuse the existing isolated `moteops-cinematic-review` Vercel project and create a preview deployment. Do not use `--prod`, change SSO, change sharing, attach an alias, or touch the production Mote Ops project.

Require:

- deployment state `READY`;
- deployed source commit matches the revision branch;
- homepage, CSS, JavaScript, and poster return HTTP 200;
- both MP4s return HTTP 206 for `Range: bytes=0-1023`;
- deployed media hashes match the local artifacts;
- `/production/opening-film/` routes return HTTP 404;
- `moteops.tech` remains at production commit `753781147fddbc7fd7644d079276cd3473012f26`.

- [ ] **Step 6: Write and commit the verification receipt**

Create `.superpowers/sdd/opening-monitor-verification.md` with:

- candidate commit;
- test count and commands;
- desktop and phone dimensions;
- transition and stable-hold timings;
- responsive media identity and hashes;
- reduced-motion and replay results;
- deployment ID, state, URL, and share-link expiration;
- private production-route checks;
- explicit statements that 0 Higgsfield credits were spent and production was unchanged.

Commit:

```bash
git add -f .superpowers/sdd/opening-monitor-desktop.png .superpowers/sdd/opening-monitor-mobile.png .superpowers/sdd/opening-monitor-verification.md
git commit -m "docs: verify actor monitor review candidate"
```

- [ ] **Step 7: Stop at the review URL**

Send Mike the protected preview link and concise summary. Do not merge or publish until he explicitly approves that exact preview.
