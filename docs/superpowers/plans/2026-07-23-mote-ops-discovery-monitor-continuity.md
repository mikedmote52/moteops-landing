# Mote Ops Discovery-Monitor Continuity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the actor 1.2 additional seconds to notice his screen, reveal the existing Mote Ops discovery email inside the physical monitor, and preserve the complete cleanup and beach payoff in an approximately 28-second film.

**Architecture:** Extend the existing deterministic monitor-capture surface from four plates to five, then reorder the FFmpeg assembly so natural-speed actor footage precedes the discovery composite. Preserve the existing seven-frame transitions, four cleanup plateaus, responsive player, media ledger, and protected-review release boundary.

**Tech Stack:** Static HTML/CSS, Bash, headless Chrome, FFmpeg/ffprobe, Node test runner, Playwright with system Chrome, Vercel protected preview.

## Global Constraints

- Spend no Higgsfield credits and generate no replacement footage.
- Use the accepted cleanup footage at normal speed for the 2.6-second actor-attention beat.
- Put the existing discovery email inside the same 1,344-pixel physical monitor as the four cleanup interfaces.
- Give the discovery email a complete 2.2-second stable plateau.
- Keep each cleanup interface readable for a complete 1.8 seconds.
- Use seven-frame, 0.291667-second push-in and pull-back transitions at 24fps.
- Preserve the controlled actor outcome and complete eight-second beach ending.
- Target 28 seconds, accepting 27.991667 seconds from deterministic frame accounting.
- Shift the beach captions to 24.2 through 28.0 seconds and 26.0 through 28.0 seconds.
- Preserve the 1,180-pixel desktop player and approximately 358-pixel phone player.
- Preserve the disclosure, Motion control, reduced-motion behavior, play-once behavior, and replay behavior.
- Do not merge, publish to `moteops.tech`, alter access settings, or change production.

---

### Task 1: Lock the five-monitor and 28-second contracts in failing tests

**Files:**
- Modify: `tests/opening-film.test.mjs:46-175`
- Modify: `tests/opening-film.test.mjs:204-237`

**Interfaces:**
- Consumes: current capture, build-script, manifest, and MP4 contracts.
- Produces: failing assertions for the fifth monitor composite, actor-first ordering, exact stable plateaus, new cut boundaries, and approximately 28-second outputs.

- [ ] **Step 1: Replace the four-monitor capture assertion with a five-monitor contract**

Rename the test to `captures discovery and cleanup interfaces inside one physical monitor treatment`, add `discovery-email` to the name loop, and require five rendered monitor paths:

```js
assert.match(html, /'discovery-email'/);
for (const name of [
  'discovery-email',
  'organized-inbox',
  'calendar-resolution',
  'review-packet',
  'approval-queue',
]) {
  assert.match(capture, new RegExp(`\\n  ${name}\\n`));
  assert.match(capture, new RegExp(`monitor-\\$plate\\.png`));
}
```

- [ ] **Step 2: Replace the old duration and transition tests**

In `maintains an auditable opening-film generation ledger`, replace the existing `manifest.postProduction.monitorComposite` expectation with:

```js
assert.deepEqual(manifest.postProduction.monitorComposite, {
  generatedCredits: 0,
  backgroundSource: 'accepted cleanup-control footage at 0.8 seconds',
  outerMonitorWidth: 1344,
  interfaceScreen: '1280x720',
  transitionFrames: 7,
  actorAttentionSeconds: 2.6,
  discoveryStableHoldSeconds: 2.2,
  cleanupStableHoldSeconds: 1.8,
});
```

Replace the tests beginning with `holds four computer interface cuts` and `assembles monitor composites` with:

```js
test('assembles an actor-first discovery sequence in an approximately 28 second film', () => {
  const buildScript = read('production/opening-film/build-opening-film.sh');

  assert.match(buildScript, /actor_attention="2\.6"/);
  assert.match(buildScript, /discovery_hold="2\.2"/);
  assert.match(buildScript, /interface_hold="1\.8"/);
  assert.match(buildScript, /transition="0\.291667"/);
  assert.match(buildScript, /discovery_transition_plate="2\.491667"/);
  assert.match(buildScript, /transition_plate="2\.091667"/);
  assert.match(buildScript, /master_duration="28\.0"/);
  assert.match(buildScript, /monitor-discovery-email\.png/);
  assert.doesNotMatch(buildScript, /-i "\$rendered\/discovery-email\.png"/);
  assert.match(buildScript, /trim=start=0:end=\$\{actor_attention\}/);
  assert.match(buildScript, /offset=2\.308333/);
  assert.match(buildScript, /offset=12\.000000/);
  assert.match(buildScript, /concat=n=5:v=1:a=0,settb=1\/24\[monitor_sequence\]/);
  assert.equal((buildScript.match(/duration=\$\{transition\}/g) || []).length, 2);
  assert.match(buildScript, /between\(t,24\.2,28\.0\)/);
  assert.match(buildScript, /between\(t,26\.0,28\.0\)/);
  assert.equal((buildScript.match(/-r 24 -t "\$master_duration" -movflags/g) || []).length, 2);
});

test('records discovery continuity timing in the media ledger', () => {
  const manifest = JSON.parse(read('assets/cinematic/mote-ops-opening-manifest.json'));
  assert.equal(manifest.durationSeconds, 28);
  assert.deepEqual(manifest.postProduction.monitorComposite, {
    generatedCredits: 0,
    backgroundSource: 'accepted cleanup-control footage at 0.8 seconds',
    outerMonitorWidth: 1344,
    interfaceScreen: '1280x720',
    transitionFrames: 7,
    actorAttentionSeconds: 2.6,
    discoveryStableHoldSeconds: 2.2,
    cleanupStableHoldSeconds: 1.8,
  });
  assert.deepEqual(manifest.frameReview.timesSeconds, [
    0, 0.5, 1, 2, 3, 4, 5, 5.79, 5.81,
    7, 8.1, 8.39, 8.41, 9.5, 10.59, 10.61,
    11.5, 12.39, 12.41, 13.3, 14.19, 14.21,
    15.1, 15.99, 16.01, 16.9, 17.79, 17.81,
    18.09, 19, 19.99, 20.01, 21, 22, 23, 24.2,
    25, 26, 27, 27.99,
  ]);
});
```

Change the MP4 duration assertion to:

```js
assert.ok(Number(metadata.format.duration) >= 27.98 && Number(metadata.format.duration) <= 28.01);
```

- [ ] **Step 3: Run the focused contracts and confirm RED**

Run:

```bash
node --test --test-name-pattern="discovery|actor-first|media ledger|silent fast-start" tests/opening-film.test.mjs
```

Expected: FAIL because `discovery-email` is absent from the monitor capture list, the build still places a full-frame email before the actor, and the manifest and MP4s still report 26.8 seconds.

- [ ] **Step 4: Commit the RED contracts**

```bash
git add tests/opening-film.test.mjs
git commit -m "test: require discovery monitor continuity"
```

---

### Task 2: Add the discovery email to the physical-monitor capture

**Files:**
- Modify: `production/opening-film/monitor-plates.html:19-24`
- Modify: `production/opening-film/capture-monitor-plates.sh:17-22`
- Create, ignored: `production/opening-film/rendered/monitor-discovery-email.png`
- Modify: `tests/opening-film.test.mjs`

**Interfaces:**
- Consumes: the existing `discovery-email` plate in `production/opening-film/plates.html`.
- Produces: `production/opening-film/rendered/monitor-discovery-email.png`, 1920 by 1080, using the same office frame and monitor geometry as the four cleanup composites.

- [ ] **Step 1: Allow the discovery plate in the monitor page**

Change the allowlist to:

```js
const allowed = new Set([
  'discovery-email',
  'organized-inbox',
  'calendar-resolution',
  'review-packet',
  'approval-queue',
]);
```

- [ ] **Step 2: Capture the fifth monitor composite**

Change the capture array to:

```bash
plates=(
  discovery-email
  organized-inbox
  calendar-resolution
  review-packet
  approval-queue
)
```

Do not change `monitor-plates.css`; all five plates must share the same physical monitor.

- [ ] **Step 3: Run the capture and inspect exact output dimensions**

Run:

```bash
npm run capture:opening-monitor
sips -g pixelWidth -g pixelHeight production/opening-film/rendered/monitor-discovery-email.png
```

Expected:

```text
pixelWidth: 1920
pixelHeight: 1080
```

Inspect `monitor-discovery-email.png` at full size and at 358 pixels wide. Confirm the email remains entirely inside the bezel, office context is visible on all sides, and the headline remains readable.

- [ ] **Step 4: Run the focused capture contract**

Run:

```bash
node --test --test-name-pattern="captures discovery and cleanup interfaces" tests/opening-film.test.mjs
```

Expected: PASS.

- [ ] **Step 5: Commit the fifth monitor source**

```bash
git add production/opening-film/monitor-plates.html production/opening-film/capture-monitor-plates.sh
git commit -m "feat: place discovery email inside actor monitor"
```

The rendered PNG remains ignored production evidence and is not committed.

---

### Task 3: Reorder the film and preserve every stable plateau

**Files:**
- Modify: `production/opening-film/build-opening-film.sh:9-97`
- Modify: `tests/opening-film.test.mjs`

**Interfaces:**
- Consumes: accepted `shot-01-breakdown.mp4`, accepted `shot-02-cleanup.mp4`, five monitor composites, accepted `shot-03-beach.mp4`, and existing overlays.
- Produces: a 24fps silent master with global boundaries at 5.8, 8.108333, 8.4, 10.6, 12.4, 14.2, 16.0, 17.8, 18.091667, 20.0, and 28.0 seconds.

- [ ] **Step 1: Define the exact duration variables and required discovery composite**

Use:

```bash
actor_attention="2.6"
discovery_hold="2.2"
interface_hold="1.8"
transition="0.291667"
discovery_transition_plate="2.491667"
transition_plate="2.091667"
master_duration="28.0"
```

Replace the required full-frame email path with:

```bash
"$rendered/monitor-discovery-email.png"
```

- [ ] **Step 2: Reorder the FFmpeg inputs**

Use this video input order:

```bash
-i "$raw/shot-01-breakdown.mp4" \
-i "$raw/shot-02-cleanup.mp4" \
-framerate 24 -loop 1 -t "$discovery_transition_plate" -i "$rendered/monitor-discovery-email.png" \
-framerate 24 -loop 1 -t "$interface_hold" -i "$rendered/monitor-organized-inbox.png" \
-framerate 24 -loop 1 -t "$interface_hold" -i "$rendered/monitor-calendar-resolution.png" \
-framerate 24 -loop 1 -t "$interface_hold" -i "$rendered/monitor-review-packet.png" \
-framerate 24 -loop 1 -t "$transition_plate" -i "$rendered/monitor-approval-queue.png" \
-i "$raw/shot-03-beach.mp4" \
```

Give each overlay input `-t "$master_duration"`.

- [ ] **Step 3: Assemble the actor-first monitor sequence**

Replace the story portion of the filter graph with:

```text
[0:v]${normalize},trim=start=0:end=5.8,setpts=PTS-STARTPTS[v0];
[1:v]${normalize},split=2[s1a][s1b];
[s1a]trim=start=0:end=${actor_attention},setpts=PTS-STARTPTS[v1];
[2:v]${normalize},trim=duration=${discovery_transition_plate},setpts=PTS-STARTPTS,
scale=w='trunc(1920*(1+0.012*min(n\,7)/7)/2)*2':h='trunc(1080*(1+0.012*min(n\,7)/7)/2)*2':eval=frame,
crop=1920:1080,setsar=1[v2];
[3:v]${normalize},trim=duration=${interface_hold},setpts=PTS-STARTPTS[v3];
[4:v]${normalize},trim=duration=${interface_hold},setpts=PTS-STARTPTS[v4];
[5:v]${normalize},trim=duration=${interface_hold},setpts=PTS-STARTPTS[v5];
[6:v]${normalize},trim=duration=${transition_plate},setpts=PTS-STARTPTS,
scale=w='trunc(1920*(1.012-0.012*min(n\,7)/7)/2)*2':h='trunc(1080*(1.012-0.012*min(n\,7)/7)/2)*2':eval=frame,
crop=1920:1080,setsar=1[v6];
[s1b]trim=start=5.8:end=8.0,setpts=PTS-STARTPTS[v7];
[7:v]${normalize},trim=start=0:end=8.0,setpts=PTS-STARTPTS[v8];
[v1][v2]xfade=transition=fade:duration=${transition}:offset=2.308333[monitor_in];
[monitor_in][v3][v4][v5][v6]concat=n=5:v=1:a=0,settb=1/24[monitor_sequence];
[monitor_sequence][v7]xfade=transition=fade:duration=${transition}:offset=12.000000[cleanup];
[v0][cleanup][v8]concat=n=3:v=1:a=0[story];
```

Keep the existing pressure overlays. Change the beach overlays to:

```text
[o5][beach0]overlay=enable='between(t,24.2,28.0)'[o6];
[o6][beach1]overlay=enable='between(t,26.0,28.0)'[master]
```

Use `-t "$master_duration"` for both output encodes.

- [ ] **Step 4: Run the focused script contract**

Run:

```bash
node --test --test-name-pattern="actor-first discovery sequence" tests/opening-film.test.mjs
```

Expected: PASS.

- [ ] **Step 5: Commit the deterministic edit**

```bash
git add production/opening-film/build-opening-film.sh tests/opening-film.test.mjs
git commit -m "feat: extend actor discovery continuity"
```

---

### Task 4: Render, audit, and record the new masters

**Files:**
- Modify: `assets/cinematic/mote-ops-opening-1080.mp4`
- Modify: `assets/cinematic/mote-ops-opening-720.mp4`
- Modify: `assets/cinematic/mote-ops-opening-poster.webp`
- Modify: `assets/cinematic/mote-ops-opening-manifest.json`
- Create: `.superpowers/sdd/opening-discovery-monitor-frame-review.md`

**Interfaces:**
- Consumes: the Task 3 assembly and Task 2 composite.
- Produces: exact release media, updated hashes and byte sizes, an auditable 28-second manifest, and frame-review evidence.

- [ ] **Step 1: Render the masters**

Run:

```bash
bash production/opening-film/build-opening-film.sh
```

Expected: exit 0 and updated 1080p, 720p, and poster outputs.

- [ ] **Step 2: Probe the media contract**

Run:

```bash
for file in assets/cinematic/mote-ops-opening-1080.mp4 assets/cinematic/mote-ops-opening-720.mp4; do
  ffprobe -v error -show_entries format=duration,size -show_entries stream=codec_name,codec_type,width,height,r_frame_rate -of json "$file"
  shasum -a 256 "$file"
done
sips -g pixelWidth -g pixelHeight assets/cinematic/mote-ops-opening-poster.webp
shasum -a 256 assets/cinematic/mote-ops-opening-poster.webp
```

Expected: silent H.264, 24/1 fps, 1920 by 1080 and 1280 by 720, duration between 27.98 and 28.01 seconds, and a 1600 by 900 poster.

- [ ] **Step 3: Update the manifest with observed media facts**

Set:

```json
"durationSeconds": 28,
"postProduction": {
  "monitorComposite": {
    "generatedCredits": 0,
    "backgroundSource": "accepted cleanup-control footage at 0.8 seconds",
    "outerMonitorWidth": 1344,
    "interfaceScreen": "1280x720",
    "transitionFrames": 7,
    "actorAttentionSeconds": 2.6,
    "discoveryStableHoldSeconds": 2.2,
    "cleanupStableHoldSeconds": 1.8
  }
}
```

For both MP4 outputs, record `"durationSeconds": 28` plus the exact observed `sizeBytes` and SHA-256. Record the poster's exact observed `sizeBytes` and SHA-256.

Set `frameReview.timesSeconds` exactly to:

```json
[0, 0.5, 1, 2, 3, 4, 5, 5.79, 5.81, 7, 8.1, 8.39, 8.41, 9.5, 10.59, 10.61, 11.5, 12.39, 12.41, 13.3, 14.19, 14.21, 15.1, 15.99, 16.01, 16.9, 17.79, 17.81, 18.09, 19, 19.99, 20.01, 21, 22, 23, 24.2, 25, 26, 27, 27.99]
```

Set:

```json
"result": "passed",
"reviewFile": ".superpowers/sdd/opening-discovery-monitor-frame-review.md"
```

- [ ] **Step 4: Review the exact cut boundaries**

Extract and inspect frames at every `frameReview.timesSeconds` value. Record in `.superpowers/sdd/opening-discovery-monitor-frame-review.md`:

- natural actor motion from 5.8 through 8.108333;
- push completes at 8.4;
- discovery email is stable from 8.4 through 10.6;
- later interfaces cut at 10.6, 12.4, 14.2, and 16.0;
- pull begins at 17.8 and completes at 18.091667;
- controlled actor footage continues to 20.0;
- beach begins at 20.0 and remains through the end;
- no disappearing props, clothing discontinuity introduced by this edit, full-frame interface plate, or website-like visual break.

- [ ] **Step 5: Run the full local gate**

Run:

```bash
npm test
npm run build
git diff --check
```

Expected: every test passes; build and whitespace checks exit 0.

- [ ] **Step 6: Commit media and audit evidence**

```bash
git add assets/cinematic/mote-ops-opening-1080.mp4 assets/cinematic/mote-ops-opening-720.mp4 assets/cinematic/mote-ops-opening-poster.webp assets/cinematic/mote-ops-opening-manifest.json .superpowers/sdd/opening-discovery-monitor-frame-review.md
git commit -m "feat: render discovery monitor opening"
```

---

### Task 5: Verify responsive playback and create a protected review

**Files:**
- Create: `.superpowers/sdd/opening-discovery-monitor-verification.md`

**Interfaces:**
- Consumes: the committed Task 4 release candidate.
- Produces: desktop, phone, reduced-motion, replay, deployed-asset, and private-route evidence plus a protected review URL.

- [ ] **Step 1: Start the static preview and verify desktop behavior**

Run:

```bash
npm run dev -- -l 4173
```

Open `http://localhost:4173/` with the browser verifier and inspect at 1440 by 1000:

- player width does not exceed 1,180 pixels;
- actor attention lasts long enough to read as intentional;
- discovery and cleanup screens visibly belong to the actor's monitor;
- playback reaches approximately 28 seconds and reveals Replay;
- no horizontal overflow, browser errors, or warnings.

- [ ] **Step 2: Verify the 390 by 844 phone view**

Confirm:

- player remains approximately 358 pixels wide;
- discovery headline and primary cleanup actions remain readable;
- the film does not blend into the next website section;
- sticky CTA does not cover the film controls;
- no horizontal overflow.

- [ ] **Step 3: Verify reduced motion and replay**

Confirm:

- reduced motion keeps the poster until Motion is explicitly enabled;
- enabling Motion starts the film;
- the film plays once and exposes Replay;
- Replay returns to time zero and plays again.

- [ ] **Step 4: Create only a protected Vercel preview**

Deploy the exact committed branch head to the existing isolated review project. Do not promote, alias, merge, or change protection settings.

Confirm:

- deployment status is READY;
- HTML and required media return 200;
- MP4 byte-range request returns 206;
- a production-only source route returns 404;
- `moteops.tech` and `origin/main` still resolve to the pre-revision production commit.

- [ ] **Step 5: Record and commit the verification receipt**

Write `.superpowers/sdd/opening-discovery-monitor-verification.md` with:

- commit SHA;
- local test and build results;
- exact media metadata and hashes;
- desktop, phone, reduced-motion, and replay findings;
- protected deployment ID and review URL;
- 200, 206, and 404 results;
- explicit confirmation that no credits, merge, alias, access change, or production change occurred.

Then run:

```bash
git add .superpowers/sdd/opening-discovery-monitor-verification.md
git commit -m "docs: verify discovery monitor review candidate"
git status --short --branch
```

Expected: only the existing untracked `.vercel/` directory remains.
