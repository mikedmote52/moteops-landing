# Mote Ops Email-to-Beach Opening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static overwhelmed-owner opening and lower quiet desk film with one 24-second, likeness-based story that moves from business breakdown, through visible Mote Ops cleanup and owner approval, to Mike enjoying regained time at the beach.

**Architecture:** Produce three separately reviewed eight-second Seedance plates using one temporary Higgsfield Reference Element, then assemble them with deterministic local HTML captures and post-produced typography. Integrate the silent two-resolution master into the existing global motion system as a play-once opening figure with deferred loading, offscreen pause, reduced-motion poster, completion-only replay, accessible story text, and a protected preview release gate.

**Tech Stack:** Static HTML/CSS/JavaScript, Node test runner, Higgsfield Reference Element, Seedance 2.0, FFmpeg/FFprobe, Chromium capture, WebP, Vercel protected preview.

## Global Constraints

- The approved design is `docs/superpowers/specs/2026-07-23-mote-ops-email-to-beach-opening-design.md`.
- Use a one-off Reference Element from Mike's Photos 2, 4, and 5. Do not create a reusable Soul or digital twin.
- Do not use Photo 7 because another person appears.
- Generate exactly three initial eight-second Seedance 2.0 shots, one at a time.
- Before any generation, preflight all three shots and present the exact per-shot and total credit cost.
- The prior 75-credit authorization does not authorize this production.
- Stop after a rejected shot. Change one prompt variable, preflight the replacement, and obtain a higher cap before exceeding the approved total.
- Generated footage supplies Mike, the office, the beach, and physical action only.
- Every readable screen, email, interface, pressure label, logo, and end card comes from local HTML/CSS captures or post-production typography.
- Consequential actions stay behind Mike's approval. The film must not imply autonomous sending, payment, signing, or scheduling.
- Final masters are H.264, 1920x1080 and 1280x720, 24fps, exactly 24 seconds, silent, and faststart.
- The 1600x900 WebP poster must work as the complete reduced-motion experience with adjacent accessible text.
- The opener plays once, pauses offscreen, resumes when visible, ends on the beach frame, and reveals a 44-pixel Replay story control only after completion.
- Keep the existing page-level Motion control. Do not add another global toggle.
- Preserve the `owner-connect`, `owner-control`, Care Hub, proof, boundaries, Studio, method, capabilities, start, and questions sections.
- Remove the old `owner-pressure` article and lower `operating-transition` figure after the new opener passes local tests.
- Do not publish to `moteops.tech`. Create only a protected preview after local verification and obtain separate approval before any live release.
- Avoid the banned brand phrases in page copy. Do not use em dashes in user-facing copy.

## File Map

- Create `production/opening-film/plates.html`: local, non-public capture surface for the discovery email, organized inbox, calendar resolution, review packet, approval queue, and manifest card.
- Create `production/opening-film/plates.css`: deterministic 1920x1080 visual system using the existing cream, ink, forest, copper, and signal colors.
- Create `production/opening-film/capture-plates.sh`: local Chrome capture script that saves six exact 1920x1080 PNG plates without adding a browser dependency.
- Create `production/opening-film/opening-film.ass`: timed pressure labels and beach closing typography.
- Create `production/opening-film/build-opening-film.sh`: deterministic FFmpeg assembly for the 24-second 1080p master, 720p derivative, and poster.
- Create `production/opening-film/raw/.gitkeep`: expected destination for the three accepted source plates; generated raw video stays excluded from release.
- Create `assets/cinematic/mote-ops-opening-manifest.json`: generation, review, processing, output metadata, hashes, and disclosure record.
- Create `tests/opening-film.test.mjs`: story order, truthful copy, media, manifest, responsive-source, replay, and removed-asset contracts.
- Modify `index.html:16-24,38-115,448`: add the opening stylesheet/script references and figure, retain detailed owner story, remove the repeated pressure card and lower quiet film.
- Create `opening-film.css`: desktop overlay, mobile film-first layout, poster, captions, story summary, and replay styling.
- Modify `owner-story.css:1-87,283-326`: remove pressure-photo styles and adapt the retained connect/control cards.
- Modify `cinematic-shell.css:8-55`: make the new full-width opening the dominant first visual without disturbing later section reveals.
- Modify `motion-system.js:3-76`: add play-once completion and replay behavior while preserving shared lazy loading and stale-play protection.
- Modify `tests/motion-system.test.mjs`: add ended-event, completion-only replay, reduced-motion defer, and replay-reset tests.
- Modify `tests/showcase-media.test.mjs:29-94`: replace the old eight-second transition contract with the 24-second responsive opening contract.
- Modify `tests/site-contract.test.mjs:66-116`: assert opening order and removal of the repeated pressure block.
- Modify `.vercelignore`: exclude `production/opening-film/` and raw generation assets from preview uploads.
- Remove `assets/cinematic/mote-ops-01.mp4` and `assets/cinematic/mote-ops-01.webp` only after replacement media passes every local contract.
- Remove `assets/cinematic/manifest.json` with the old transition media after the replacement manifest passes every local contract.

---

### Task 1: Lock the production ledger and capture plates

**Files:**
- Create: `production/opening-film/plates.html`
- Create: `production/opening-film/plates.css`
- Create: `production/opening-film/capture-plates.sh`
- Create: `production/opening-film/raw/.gitkeep`
- Create: `assets/cinematic/mote-ops-opening-manifest.json`
- Create: `tests/opening-film.test.mjs`
- Modify: `.gitignore`
- Modify: `.vercelignore`

**Interfaces:**
- Consumes: the approved discovery-email copy and fictional business scenario.
- Produces: `npm run capture:opening-plates`, six 1920x1080 PNGs under `production/opening-film/rendered/`, and manifest schema `mote-ops-opening/v1`.

- [ ] **Step 1: Add a failing source-truth and capture-surface test**

Create `tests/opening-film.test.mjs` with:

```js
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const root = resolve(new URL('..', import.meta.url).pathname);
const read = (path) => readFileSync(resolve(root, path), 'utf8');

test('defines truthful local inserts for the complete cleanup story', () => {
  const plates = read('production/opening-film/plates.html');
  assert.match(plates, /data-plate="discovery-email"/);
  assert.match(plates, /You should not have to be the operating system\./);
  assert.match(plates, /Show me how/);
  assert.match(plates, /data-plate="organized-inbox"/);
  assert.match(plates, /data-plate="calendar-resolution"/);
  assert.match(plates, /data-plate="review-packet"/);
  assert.match(plates, /data-plate="approval-queue"/);
  assert.match(plates, /data-plate="beach-end-card"/);
  assert.match(plates, /Fictional business scenario/);
  assert.doesNotMatch(plates, /\b(?:sent|paid|signed|booked automatically)\b/i);
});

test('starts an auditable opening-film manifest without claiming generation', () => {
  const manifest = JSON.parse(read('assets/cinematic/mote-ops-opening-manifest.json'));
  assert.equal(manifest.schema, 'mote-ops-opening/v1');
  assert.equal(manifest.status, 'awaiting-credit-approval');
  assert.equal(manifest.generation.creditsSpent, 0);
  assert.equal(manifest.generation.approvedCreditCap, null);
  assert.deepEqual(manifest.generation.shots.map(({ id }) => id), [
    'breakdown-discovery',
    'cleanup-control',
    'beach-payoff',
  ]);
  assert.ok(manifest.generation.shots.every(({ jobId }) => jobId === null));
  assert.equal(manifest.disclosure, 'AI-generated film · fictional business scenario featuring Mike Mote.');
});

test('keeps production sources out of release uploads', () => {
  const vercelIgnore = read('.vercelignore');
  assert.match(vercelIgnore, /^production\/opening-film\/$/m);
  assert.match(vercelIgnore, /^assets\/cinematic\/source\/$/m);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
node --test tests/opening-film.test.mjs
```

Expected: FAIL because the production files and opening manifest do not exist.

- [ ] **Step 3: Create the exact capture surface**

Create `production/opening-film/plates.html` as one document with six `<section class="plate" data-plate="...">` elements. Use only this approved copy:

```html
<section class="plate plate-email" data-plate="discovery-email">
  <p class="truth">FICTIONAL BUSINESS SCENARIO</p>
  <header><span>MOTE OPS</span><small>Today, 9:42 AM</small></header>
  <main>
    <p>FROM: MOTE OPS</p>
    <h1>You should not have to be the operating system.</h1>
    <p>You know AI could help. You do not need another disconnected tool to manage.</p>
    <p>Mote Ops organizes the people, tools, and decisions your business already depends on.</p>
    <strong>Show me how →</strong>
  </main>
</section>

<section class="plate" data-plate="organized-inbox">
  <p class="truth">FICTIONAL BUSINESS SCENARIO</p>
  <header><span>MOTE OPS · INCOMING WORK</span><small>Organized for review</small></header>
  <main class="work-list">
    <article><b>CALLS + TEXTS</b><strong>Follow-up prepared</strong><span>Waiting for Mike</span></article>
    <article><b>EMAIL</b><strong>Priority messages grouped</strong><span>Drafts prepared</span></article>
    <article><b>FILES</b><strong>Spreadsheet summarized</strong><span>Exceptions surfaced</span></article>
  </main>
</section>

<section class="plate" data-plate="calendar-resolution">
  <p class="truth">FICTIONAL BUSINESS SCENARIO</p>
  <header><span>SCHEDULE REVIEW</span><small>One conflict found</small></header>
  <main class="decision-card">
    <p>CALENDAR CONFLICT</p>
    <h1>Two meetings need the same hour.</h1>
    <div><span>Move internal review to 2:30 PM</span><strong>Ready for approval</strong></div>
  </main>
</section>

<section class="plate" data-plate="review-packet">
  <p class="truth">FICTIONAL BUSINESS SCENARIO</p>
  <header><span>REVIEW PACKET</span><small>Prepared, not executed</small></header>
  <main class="work-list">
    <article><b>SPREADSHEET</b><strong>Three exceptions summarized</strong><span>Source rows attached</span></article>
    <article><b>INVOICE</b><strong>One item needs review</strong><span>No payment initiated</span></article>
    <article><b>FOLLOW-UP</b><strong>Reply drafted</strong><span>Not sent</span></article>
  </main>
</section>

<section class="plate" data-plate="approval-queue">
  <p class="truth">FICTIONAL BUSINESS SCENARIO</p>
  <header><span>MOTE OPS · APPROVAL QUEUE</span><small>Mike remains in control</small></header>
  <main class="approval-list">
    <article><span>01</span><div><b>Follow up</b><small>Reply drafted</small></div><strong>REVIEW</strong></article>
    <article><span>02</span><div><b>Review payment</b><small>Invoice flagged</small></div><strong>REVIEW</strong></article>
    <article><span>03</span><div><b>Confirm schedule</b><small>Conflict resolved</small></div><strong>REVIEW</strong></article>
  </main>
</section>

<section class="plate plate-end" data-plate="beach-end-card">
  <p>MOTE OPS</p>
  <h1>Mote Ops cleaned up the work.<br>Mike found the beach.</h1>
  <strong>Your people and tools already do the work. We help them work as one.</strong>
  <small>AI-generated film · fictional business scenario featuring Mike Mote.</small>
</section>
```

Create `production/opening-film/plates.css` with a fixed 1920x1080 canvas, `#f5f1e8` paper, `#181a16` ink, `#153f35` forest, `#a45530` copper, `#ef5a37` signal, high-contrast borders, no gradients, and a 96px safe margin. Add this inline script after the six plates so only the plate named by the URL is rendered:

```html
<script>
  const selectedPlate = new URLSearchParams(location.search).get('plate');
  document.querySelectorAll('[data-plate]').forEach((node) => {
    node.hidden = node.dataset.plate !== selectedPlate;
  });
</script>
```

- [ ] **Step 4: Add deterministic Chromium capture**

Create `production/opening-film/capture-plates.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

chrome="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
here="$(cd "$(dirname "$0")" && pwd)"
output="$here/rendered"
profile="$(mktemp -d "${TMPDIR:-/tmp}/mote-opening-chrome.XXXXXX")"
trap 'rm -rf "$profile"' EXIT
mkdir -p "$output"

for plate in discovery-email organized-inbox calendar-resolution review-packet approval-queue beach-end-card; do
  "$chrome" \
    --headless=new \
    --disable-gpu \
    --hide-scrollbars \
    --force-device-scale-factor=1 \
    --user-data-dir="$profile" \
    --window-size=1920,1080 \
    --screenshot="$output/$plate.png" \
    "file://$here/plates.html?plate=$plate"
done
```

Add package script:

```json
"capture:opening-plates": "bash production/opening-film/capture-plates.sh"
```

- [ ] **Step 5: Add the initial manifest and exclusions**

Create `assets/cinematic/mote-ops-opening-manifest.json` with:

```json
{
  "schema": "mote-ops-opening/v1",
  "status": "awaiting-credit-approval",
  "title": "Mote Ops email-to-beach opening",
  "durationSeconds": 24,
  "disclosure": "AI-generated film · fictional business scenario featuring Mike Mote.",
  "referenceElement": {
    "kind": "one-off",
    "id": null,
    "sourcePhotoCount": 3,
    "sourcePhotos": ["Photo 2", "Photo 4", "Photo 5"],
    "reusableSoulCreated": false
  },
  "generation": {
    "model": "Seedance 2.0",
    "creditsSpent": 0,
    "approvedCreditCap": null,
    "preflight": [],
    "shots": [
      {"id":"breakdown-discovery","seconds":8,"jobId":null,"credits":null,"status":"not-generated","review":null},
      {"id":"cleanup-control","seconds":8,"jobId":null,"credits":null,"status":"not-generated","review":null},
      {"id":"beach-payoff","seconds":8,"jobId":null,"credits":null,"status":"not-generated","review":null}
    ]
  },
  "capturePlates": [
    "discovery-email",
    "organized-inbox",
    "calendar-resolution",
    "review-packet",
    "approval-queue",
    "beach-end-card"
  ],
  "outputs": {"master1080":null,"master720":null,"poster":null},
  "frameReview": null
}
```

Append exact directory exclusions:

```gitignore
production/opening-film/raw/*.mp4
production/opening-film/rendered/*.png
assets/cinematic/source/
```

and:

```text
production/opening-film/
assets/cinematic/source/
```

to `.vercelignore`.

- [ ] **Step 6: Capture the plates and verify GREEN**

Run:

```bash
npm run capture:opening-plates
node --test tests/opening-film.test.mjs
sips -g pixelWidth -g pixelHeight production/opening-film/rendered/*.png
```

Expected: six 1920x1080 PNGs, focused tests PASS, and no production source path appears in release HTML.

- [ ] **Step 7: Commit the production scaffold**

```bash
git add .gitignore .vercelignore package.json tests/opening-film.test.mjs production/opening-film/plates.html production/opening-film/plates.css production/opening-film/capture-plates.sh production/opening-film/raw/.gitkeep assets/cinematic/mote-ops-opening-manifest.json
git commit -m "test: lock opening film production contract"
```

---

### Task 2: Create the one-off likeness reference and obtain the credit cap

**Files:**
- Modify: `assets/cinematic/mote-ops-opening-manifest.json`
- Create: `.superpowers/sdd/opening-film-credit-receipt.md`

**Interfaces:**
- Consumes: Mike-selected Photos 2, 4, and 5 through the Higgsfield upload widget.
- Produces: one temporary Reference Element ID, three literal Seedance preflight receipts, and Mike's explicit integer credit cap.

- [ ] **Step 1: Upload only the approved identity references**

Use the Higgsfield media upload widget because remote generation tools cannot read Codex attachment paths. Select exactly Photos 2, 4, and 5. Verify that no other person appears and that medical branding, hats, headphones, and novelty clothing are absent.

- [ ] **Step 2: Create one temporary Reference Element**

Use the uploaded media IDs to create a one-off Reference Element. Do not create a Soul, save a reusable identity model, or include local source paths in the manifest.

Replace the manifest's `referenceElement.id: null` with the exact `reference_element_id` returned by Higgsfield in the same turn. Do not enter a sample ID, a local path, or an uploaded media ID in this field.

- [ ] **Step 3: Preflight all three prompts without generating**

Use Seedance 2.0, standard mode, 1080p, 16:9, silent, eight seconds, and the one-off Reference Element.

Prompt 1:

```text
Photoreal commercial plate, 16:9. Mike Mote, matching the supplied one-off face reference, works inside a believable small business office that is close to operational breakdown. He wears a charcoal unbranded overshirt and dark trousers. Restrained handheld camera urgency. He answers a desk phone while a mobile phone vibrates, a colleague waits at the doorway, a printer adds paperwork, and he switches rapidly between a laptop and loose documents. His stress is active and believable, never theatrical or unsafe. In the final two seconds he notices one promising email on the monitor and leans toward it, ending on a stable over-the-shoulder composition with the monitor unobstructed for later screen replacement. All screens show soft blank neutral blocks with no readable text, numbers, icons, logos, brands, or interfaces. No medical clothing, badges, employer marks, glowing effects, floating UI, slapstick, panic, danger, or extra fingers.
```

Prompt 2:

```text
Photoreal commercial plate, 16:9. The same Mike Mote in the same small business office and charcoal unbranded overshirt, with exact face, beard, hair, body, wardrobe, and lighting continuity from the first plate. The atmosphere becomes deliberate and controlled. Mike reviews prepared work on a laptop, checks a short paper decision packet, makes three clear approval gestures one at a time, closes the notebook or laptop, stands, and leaves a quiet organized desk. Stable camera that settles from a small controlled push-in to a composed wide frame. The phone stops demanding attention and the physical desk becomes orderly through Mike's ordinary actions, never magical disappearance. Screens remain softly blank and neutral for later replacement. No readable text, numbers, icons, logos, generated interface, autonomous action, glowing effects, object teleportation, synthetic grin, or extra fingers.
```

Prompt 3:

```text
Photoreal dry-humor commercial plate, 16:9. The same Mike Mote, matching the supplied one-off face reference, arrives at a calm Northern California beach in a simple white short-sleeve linen shirt and neutral sunglasses. Begin on a close match-cut action of Mike opening and putting on his sunglasses, then widen as he walks a few steps toward the water, exhales, settles into the free time, and gives one small relieved knowing smile. Natural late-afternoon coastal light, restrained cinematic camera, believable wind and ocean movement, quiet confidence. Hold the final composition for the last two seconds with clean negative space on the left for typography. No luxury-resort posing, no broad commercial smile, no other recognizable people, no logos, no text, no fantasy effects, no medical clothing, no novelty clothing, no body distortion, and no extra fingers.
```

Record every literal preflight response in `generation.preflight`:

```json
{"shotId":"breakdown-discovery","credits":36,"preflightId":"literal-tool-id"}
```

Use the returned integer instead of the example `36`.

- [ ] **Step 4: Stop and obtain explicit credit approval**

Calculate:

```text
total = breakdown-discovery + cleanup-control + beach-payoff
```

Present all three exact costs and the exact total to Mike. Do not generate until Mike explicitly approves a cap at or above that total in the current session.

Record the approval in `.superpowers/sdd/opening-film-credit-receipt.md` and update `generation.approvedCreditCap` to the literal approved integer.
Set manifest `status` to `awaiting-generation`.

- [ ] **Step 5: Verify and commit the approved ledger**

Run:

```bash
node --test tests/opening-film.test.mjs
git diff --check
```

Expected: PASS; manifest status remains `awaiting-generation`; credits spent remains `0`.

```bash
git add assets/cinematic/mote-ops-opening-manifest.json .superpowers/sdd/opening-film-credit-receipt.md
git commit -m "docs: record opening film credit approval"
```

---

### Task 3: Generate and review the breakdown and cleanup plates

**Files:**
- Modify: `assets/cinematic/mote-ops-opening-manifest.json`
- Create: `.superpowers/sdd/opening-shot-01-review.md`
- Create: `.superpowers/sdd/opening-shot-02-review.md`
- Runtime only: `production/opening-film/raw/shot-01-breakdown.mp4`
- Runtime only: `production/opening-film/raw/shot-02-cleanup.mp4`

**Interfaces:**
- Consumes: approved preflight IDs, approved credit cap, one-off Reference Element, Prompts 1 and 2.
- Produces: two accepted eight-second raw plates and exact generation/review records.

- [ ] **Step 1: Generate only Shot 1**

Submit Prompt 1 using its approved preflight configuration. Immediately record the literal job ID and charged credits. Download the result to `production/opening-film/raw/shot-01-breakdown.mp4`.

- [ ] **Step 2: Review Shot 1 before continuing**

Extract:

```bash
mkdir -p .superpowers/sdd/opening-shot-01-frames
ffmpeg -y -i production/opening-film/raw/shot-01-breakdown.mp4 -vf "fps=2,scale=960:-2" .superpowers/sdd/opening-shot-01-frames/%03d.jpg
```

Review all 16 frames for:

- Mike's face, beard, hair, body, hands, and wardrobe;
- active but believable stress;
- phone, colleague, printer, documents, laptop, and camera continuity;
- stable over-the-shoulder finish;
- blank, replaceable screens;
- no text, logo, brand, UI, medical clothing, or physical defect.

Write PASS or the first concrete rejection reason to `.superpowers/sdd/opening-shot-01-review.md`.

If rejected, stop. Change only one prompt variable, preflight the replacement, update projected spend, and obtain a higher cap before the replacement could exceed the approved cap.

- [ ] **Step 3: Generate only Shot 2 after Shot 1 passes**

Submit Prompt 2 using its approved configuration. Record the literal job ID and charged credits. Download to `production/opening-film/raw/shot-02-cleanup.mp4`.

- [ ] **Step 4: Review Shot 2 before continuing**

Extract at two frames per second and review:

- identity and wardrobe continuity with Shot 1;
- three distinct owner approval gestures;
- ordinary physical cleanup, no magical disappearance;
- close-and-leave ending;
- stable camera and blank screens;
- no autonomous-action implication, generated text, logos, UI, or hand defect.

Write the exact result to `.superpowers/sdd/opening-shot-02-review.md`. Stop on rejection under the same one-variable and credit-cap rule.

- [ ] **Step 5: Update the ledger and commit receipts**

Set each accepted shot to:

```json
{
  "id": "breakdown-discovery",
  "seconds": 8,
  "jobId": "literal-job-id",
  "credits": 36,
  "status": "accepted",
  "review": ".superpowers/sdd/opening-shot-01-review.md"
}
```

Use literal IDs and charged integers. Set `generation.creditsSpent` to the exact cumulative charge.

```bash
git add assets/cinematic/mote-ops-opening-manifest.json .superpowers/sdd/opening-shot-01-review.md .superpowers/sdd/opening-shot-02-review.md
git commit -m "docs: accept opening office plates"
```

---

### Task 4: Generate and review the beach payoff

**Files:**
- Modify: `assets/cinematic/mote-ops-opening-manifest.json`
- Create: `.superpowers/sdd/opening-shot-03-review.md`
- Runtime only: `production/opening-film/raw/shot-03-beach.mp4`

**Interfaces:**
- Consumes: accepted office plates for identity comparison, approved beach preflight, one-off Reference Element.
- Produces: the accepted eight-second beach plate that owns seconds 16 through 24 of the finished story.

- [ ] **Step 1: Recheck remaining approved credits**

Calculate:

```text
remaining cap = approvedCreditCap - creditsSpent
```

Assert that the literal Shot 3 charge is at or below the remaining cap. Stop if it is not.

- [ ] **Step 2: Generate only the beach plate**

Submit Prompt 3 with the approved Reference Element. Record the literal job ID and charged credits. Download to `production/opening-film/raw/shot-03-beach.mp4`.

- [ ] **Step 3: Review the complete beach action**

Extract:

```bash
mkdir -p .superpowers/sdd/opening-shot-03-frames
ffmpeg -y -i production/opening-film/raw/shot-03-beach.mp4 -vf "fps=2,scale=960:-2" .superpowers/sdd/opening-shot-03-frames/%03d.jpg
```

Review all frames for:

- Mike's likeness against Photos 2, 4, and 5 and the two accepted office shots;
- simple white linen shirt and neutral sunglasses;
- readable sunglasses match-cut action;
- beach arrival, exhale, and small knowing smile;
- natural ocean and wind movement;
- two-second final hold and left-side negative space;
- no extra recognizable person, logo, distorted body, hand defect, or synthetic grin.

The beach plate fails if it is merely a static portrait or if the payoff cannot be understood as regained time.

- [ ] **Step 4: Record acceptance and commit**

Write `.superpowers/sdd/opening-shot-03-review.md`, set Shot 3 to `accepted`, update exact `creditsSpent`, and set manifest `status` to `ready-for-post`.

```bash
git add assets/cinematic/mote-ops-opening-manifest.json .superpowers/sdd/opening-shot-03-review.md
git commit -m "docs: accept opening beach payoff"
```

---

### Task 5: Assemble and verify the 24-second film

**Files:**
- Create: `production/opening-film/opening-film.ass`
- Create: `production/opening-film/build-opening-film.sh`
- Create: `assets/cinematic/mote-ops-opening-1080.mp4`
- Create: `assets/cinematic/mote-ops-opening-720.mp4`
- Create: `assets/cinematic/mote-ops-opening-poster.webp`
- Modify: `assets/cinematic/mote-ops-opening-manifest.json`
- Modify: `tests/opening-film.test.mjs`
- Modify: `tests/showcase-media.test.mjs`

**Interfaces:**
- Consumes: three accepted raw MP4s and six captured PNGs.
- Produces: exact 24-second release media, output hashes, media metadata, and frame-review evidence.

- [ ] **Step 1: Extend the media tests and verify RED**

Add tests that:

- resolve all three manifest output paths;
- use FFprobe to assert H.264, 24fps, no audio, 24.00 to 24.05 seconds;
- assert 1920x1080 and 1280x720;
- assert `moov` precedes `mdat`;
- use Sips to assert 1600x900 poster;
- compare SHA-256 against the manifest;
- assert the old `mote-ops-01` paths are not used by `index.html`.

Run:

```bash
node --test tests/opening-film.test.mjs tests/showcase-media.test.mjs
```

Expected: FAIL because final media does not exist.

- [ ] **Step 2: Create timed post typography**

Create `production/opening-film/opening-film.ass`:

```text
[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080
ScaledBorderAndShadow: yes
WrapStyle: 2

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Pressure,Arial Narrow,34,&H00181A16,&H00181A16,&H00A45530,&H00F5F1E8,-1,0,0,0,100,100,1.5,0,3,2,0,7,28,28,18,1
Style: Beach,Georgia,62,&H00F5F1E8,&H00F5F1E8,&H00181A16,&HCC181A16,-1,0,0,0,100,100,-1.5,0,3,2,0,7,34,34,24,1
Style: BeachSmall,Arial Narrow,27,&H00F5F1E8,&H00F5F1E8,&H00181A16,&HCC181A16,-1,0,0,0,100,100,1.2,0,3,2,0,7,28,28,18,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 0,0:00:00.40,0:00:02.20,Pressure,,0,0,0,,{\pos(130,155)}MISSED CALLS
Dialogue: 0,0:00:01.15,0:00:03.10,Pressure,,0,0,0,,{\pos(1320,180)}UNREAD EMAIL
Dialogue: 0,0:00:02.00,0:00:04.10,Pressure,,0,0,0,,{\pos(1380,430)}UNANSWERED TEXTS
Dialogue: 0,0:00:02.80,0:00:05.30,Pressure,,0,0,0,,{\pos(120,660)}CALENDAR CONFLICT
Dialogue: 0,0:00:03.50,0:00:05.80,Pressure,,0,0,0,,{\pos(1180,760)}SPREADSHEET REVIEW
Dialogue: 0,0:00:04.10,0:00:05.80,Pressure,,0,0,0,,{\pos(700,120)}INVOICE REVIEW
Dialogue: 0,0:00:20.20,0:00:24.00,Beach,,0,0,0,,{\pos(110,590)}Mote Ops cleaned up the work.\NMike found the beach.
Dialogue: 0,0:00:22.00,0:00:24.00,BeachSmall,,0,0,0,,{\pos(112,800)}Your people and tools already do the work. We help them work as one.
```

The pressure style uses opaque cream boxes with ink text and copper borders. The beach styles sit on a solid translucent ink box within the left-side negative space, with no gradient or glow.

- [ ] **Step 3: Create deterministic assembly**

Create `production/opening-film/build-opening-film.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "$0")/../.." && pwd)"
production="$root/production/opening-film"
raw="$production/raw"
rendered="$production/rendered"
output="$root/assets/cinematic"

required=(
  "$raw/shot-01-breakdown.mp4"
  "$raw/shot-02-cleanup.mp4"
  "$raw/shot-03-beach.mp4"
  "$rendered/discovery-email.png"
  "$rendered/organized-inbox.png"
  "$rendered/calendar-resolution.png"
  "$rendered/review-packet.png"
  "$rendered/approval-queue.png"
  "$production/opening-film.ass"
)
for path in "${required[@]}"; do
  test -f "$path" || { echo "Missing required input: $path" >&2; exit 1; }
done

normalize="fps=24,scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,setsar=1,format=yuv420p"

ffmpeg -y \
  -i "$raw/shot-01-breakdown.mp4" \
  -framerate 24 -loop 1 -t 2.2 -i "$rendered/discovery-email.png" \
  -i "$raw/shot-02-cleanup.mp4" \
  -framerate 24 -loop 1 -t 1.0 -i "$rendered/organized-inbox.png" \
  -framerate 24 -loop 1 -t 1.0 -i "$rendered/calendar-resolution.png" \
  -framerate 24 -loop 1 -t 1.0 -i "$rendered/review-packet.png" \
  -framerate 24 -loop 1 -t 1.4 -i "$rendered/approval-queue.png" \
  -i "$raw/shot-03-beach.mp4" \
  -filter_complex "
    [0:v]${normalize},trim=start=0:end=5.8,setpts=PTS-STARTPTS[v0];
    [1:v]${normalize},trim=duration=2.2,setpts=PTS-STARTPTS[v1];
    [2:v]${normalize},split=2[s2a][s2b];
    [s2a]trim=start=0:end=1.4,setpts=PTS-STARTPTS[v2];
    [3:v]${normalize},trim=duration=1.0,setpts=PTS-STARTPTS[v3];
    [4:v]${normalize},trim=duration=1.0,setpts=PTS-STARTPTS[v4];
    [5:v]${normalize},trim=duration=1.0,setpts=PTS-STARTPTS[v5];
    [6:v]${normalize},trim=duration=1.4,setpts=PTS-STARTPTS[v6];
    [s2b]trim=start=5.8:end=8.0,setpts=PTS-STARTPTS[v7];
    [7:v]${normalize},trim=start=0:end=8.0,setpts=PTS-STARTPTS[v8];
    [v0][v1][v2][v3][v4][v5][v6][v7][v8]concat=n=9:v=1:a=0[story];
    [story]ass='$production/opening-film.ass'[master]
  " \
  -map "[master]" -an -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p \
  -r 24 -t 24 -movflags +faststart "$output/mote-ops-opening-1080.mp4"

ffmpeg -y -i "$output/mote-ops-opening-1080.mp4" \
  -vf "scale=1280:720:flags=lanczos" -an -c:v libx264 -preset slow -crf 20 \
  -pix_fmt yuv420p -r 24 -t 24 -movflags +faststart \
  "$output/mote-ops-opening-720.mp4"

ffmpeg -y -ss 4.2 -i "$output/mote-ops-opening-1080.mp4" \
  -frames:v 1 -vf "scale=1600:900:flags=lanczos" \
  -c:v libwebp -quality 82 "$output/mote-ops-opening-poster.webp"
```

The concat inputs sum to exactly 24 seconds. The command uses full-frame cuts, so interface text stays sharp and the beach payoff retains its full eight seconds.

- [ ] **Step 4: Run the build and populate exact metadata**

Run:

```bash
bash production/opening-film/build-opening-film.sh
ffprobe -v error -show_entries format=duration,size:stream=codec_name,codec_type,width,height,r_frame_rate -of json assets/cinematic/mote-ops-opening-1080.mp4
ffprobe -v error -show_entries format=duration,size:stream=codec_name,codec_type,width,height,r_frame_rate -of json assets/cinematic/mote-ops-opening-720.mp4
shasum -a 256 assets/cinematic/mote-ops-opening-1080.mp4 assets/cinematic/mote-ops-opening-720.mp4 assets/cinematic/mote-ops-opening-poster.webp
```

Write the literal metadata, size, and hashes to `outputs`. Set manifest `status` to `media-verified`.

- [ ] **Step 5: Perform the full frame review**

Extract two frames per second plus frames at 5.79, 5.81, 7.99, 8.01, 13.79, 13.81, 15.99, 16.01, 20.2, and 23.7 seconds.

Review identity, hands, continuity, readable real text, safe margins, approval truth, cut continuity, beach plausibility, and final readability. Record:

```json
"frameReview": {
  "timesSeconds": [0,0.5,1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,5.79,5.81,6,6.5,7,7.5,7.99,8.01,8.5,9,9.4,10.4,11.4,12.4,13.8,15,15.99,16.01,17,18,19,20,20.2,21,22,23,23.7,24],
  "result": "passed",
  "reviewFile": ".superpowers/sdd/opening-film-frame-review.md"
}
```

- [ ] **Step 6: Verify GREEN and commit media**

```bash
node --test tests/opening-film.test.mjs tests/showcase-media.test.mjs
npm test
npm run build
git diff --check
git add production/opening-film/opening-film.ass production/opening-film/build-opening-film.sh assets/cinematic/mote-ops-opening-1080.mp4 assets/cinematic/mote-ops-opening-720.mp4 assets/cinematic/mote-ops-opening-poster.webp assets/cinematic/mote-ops-opening-manifest.json tests/opening-film.test.mjs tests/showcase-media.test.mjs .superpowers/sdd/opening-film-frame-review.md
git commit -m "feat: produce Mote Ops email-to-beach film"
```

---

### Task 6: Integrate the play-once opener into the homepage

**Files:**
- Modify: `index.html:16-24,38-115,448`
- Create: `opening-film.css`
- Modify: `owner-story.css:1-87,283-326`
- Modify: `cinematic-shell.css:8-55`
- Modify: `motion-system.js:3-76`
- Modify: `tests/motion-system.test.mjs`
- Modify: `tests/opening-film.test.mjs`
- Modify: `tests/site-contract.test.mjs`
- Remove: `assets/cinematic/mote-ops-01.mp4`
- Remove: `assets/cinematic/mote-ops-01.webp`
- Remove: `assets/cinematic/manifest.json`

**Interfaces:**
- Consumes: `window.moteMotion`, `[data-cinematic-film]`, `mote:motionchange`, responsive media assets.
- Produces: `[data-opening-story]`, `[data-play-once]`, `[data-replay-story]`, `data-complete`, and the first-major-visual page contract.

- [ ] **Step 1: Add failing page and playback tests**

Assert:

```js
const opening = html.indexOf('data-opening-story');
const ownerConnect = html.indexOf('data-owner-scene="connect"');
const careHub = html.indexOf('id="care-hub-showcase"');
assert.ok(opening > 0 && opening < ownerConnect && ownerConnect < careHub);
assert.match(html, /mote-ops-opening-1080\.mp4/);
assert.match(html, /mote-ops-opening-720\.mp4/);
assert.match(html, /mote-ops-opening-poster\.webp/);
assert.match(html, /autoplay muted playsinline/);
assert.doesNotMatch(html, /\sloop(?:\s|>)/);
assert.match(html, /data-replay-story[^>]*hidden/);
assert.doesNotMatch(html, /owner-pressure/);
assert.doesNotMatch(html, /operating-transition/);
assert.doesNotMatch(html, /mote-ops-01\.(?:mp4|webp)/);
```

Extend the motion harness with `ended`, `currentTime`, `duration`, `hidden`, and replay click behavior. Test that:

- reduced motion leaves all source `src` properties empty;
- ending sets `data-complete="true"` and reveals Replay story;
- sync does not autoplay a completed film;
- Replay sets `currentTime=0`, hides itself, clears complete, and plays only when motion is on and visible;
- Motion off pauses the opener;
- a stale rejected request cannot override later opt-in.

Run focused tests and expect RED.

- [ ] **Step 2: Replace the repeated opening markup**

Inside `#top`, put the figure before `.hero-copy` in DOM order:

```html
<figure class="opening-story" data-opening-story>
  <div class="opening-story-frame">
    <video autoplay muted playsinline preload="none"
      poster="assets/cinematic/mote-ops-opening-poster.webp"
      data-cinematic-film data-play-once
      aria-describedby="opening-story-summary opening-story-disclosure">
      <source data-src="assets/cinematic/mote-ops-opening-1080.mp4"
        media="(min-width: 761px)" type="video/mp4">
      <source data-src="assets/cinematic/mote-ops-opening-720.mp4"
        type="video/mp4">
    </video>
    <button type="button" data-replay-story hidden>Replay story</button>
  </div>
  <figcaption>
    <p id="opening-story-summary">A fictional overwhelmed business owner finds Mote Ops, reviews three prepared decisions, closes the laptop, and gets his afternoon back at the beach.</p>
    <small id="opening-story-disclosure">AI-generated film · fictional business scenario featuring Mike Mote.</small>
  </figcaption>
</figure>
```

Keep `.hero-copy` immediately after the figure. Change its secondary link to:

```html
<a class="text-link" href="#owner-story">See how the work gets organized <span aria-hidden="true">↓</span></a>
```

Keep `#owner-story`, but include only `owner-connect`, `owner-control`, and `owner-story-truth`. Remove the old lower `operating-transition` figure.

- [ ] **Step 3: Implement editorial responsive layout**

Create `opening-film.css` with:

- full-bleed figure directly beneath the fixed header;
- 16:9 frame, ink background, 2px ink border, copper offset edge;
- desktop `.hero-copy` as a readable cream panel over the lower-left safe area, maximum width 760px;
- mobile DOM flow with video first and headline/action directly below;
- caption and disclosure visible below the frame;
- 44px Replay story button in the lower-right safe margin;
- `[hidden]{display:none!important}`;
- `html[data-motion="off"]` poster remains visible with no source loading;
- no gradient, glow, blur-heavy glass panel, or decorative floating UI;
- at 390px, 16px side margins, 16:9 video, and no horizontal overflow.

Remove the obsolete `.owner-photo`, `.owner-signals`, and mobile pressure-label selectors from `owner-story.css`. Preserve connect/control styles.

- [ ] **Step 4: Add play-once behavior to the shared motion system**

Add:

```js
function filmCompleted(film) {
  return film.matches('[data-play-once]') && film.dataset.complete === 'true';
}

function setFilmComplete(film, complete) {
  film.dataset.complete = String(complete);
  const replay = film.closest('[data-opening-story]')?.querySelector('[data-replay-story]');
  if (replay) replay.hidden = !complete;
}
```

In `syncFilm`, pause and return when `filmCompleted(film)` is true. Register:

```js
studioFilms.forEach((film) => {
  if (!film.matches('[data-play-once]')) return;
  film.addEventListener('ended', () => {
    pauseFilm(film);
    setFilmComplete(film, true);
  });
  const replay = film.closest('[data-opening-story]')?.querySelector('[data-replay-story]');
  replay?.addEventListener('click', () => {
    setFilmComplete(film, false);
    film.currentTime = 0;
    syncFilm(film);
  });
});
```

Update `loadFilm` to choose the first matching deferred source without eagerly filling both responsive sources. Preserve request-token invalidation in `pauseFilm` and rejection handling.

- [ ] **Step 5: Remove superseded media and verify**

After all focused tests pass:

```bash
git rm assets/cinematic/mote-ops-01.mp4 assets/cinematic/mote-ops-01.webp
git rm assets/cinematic/manifest.json
node --test tests/opening-film.test.mjs tests/motion-system.test.mjs tests/showcase-media.test.mjs tests/site-contract.test.mjs
npm test
npm run build
git diff --check
```

Expected: all tests PASS, the old media is absent, no raw source is staged, and `.vercel/` remains untouched.

- [ ] **Step 6: Commit the homepage integration**

```bash
git add index.html opening-film.css owner-story.css cinematic-shell.css motion-system.js tests/motion-system.test.mjs tests/opening-film.test.mjs tests/site-contract.test.mjs .vercelignore
git commit -m "feat: open Mote Ops with email-to-beach story"
```

---

### Task 7: Verify locally and create one protected review preview

**Files:**
- Create: `.superpowers/sdd/opening-film-local-verification.md`
- Create: `.superpowers/sdd/opening-film-preview-receipt.md`
- Create: `.superpowers/sdd/opening-film-desktop.png`
- Create: `.superpowers/sdd/opening-film-mobile.png`
- Create: `.superpowers/sdd/opening-film-reduced-motion.png`

**Interfaces:**
- Consumes: complete local candidate and existing `moteops-cinematic-review` Vercel project metadata.
- Produces: browser evidence, one protected preview URL, deployment metadata, and no live-domain change.

- [ ] **Step 1: Run complete local verification**

```bash
npm test
npm run build
git diff --check
git status --short
```

Expected:

- every test passes;
- build passes;
- only intended candidate changes and untracked `.vercel/` metadata appear;
- no raw generated source is staged;
- no external URL is present in the opening-film implementation.

- [ ] **Step 2: Verify 1440x1000 desktop**

Serve locally and inspect:

- opening film is the first major visual below the header;
- headline and booking action are visible with the opening;
- motion begins automatically when system preference permits;
- film pauses offscreen and resumes at the same timestamp;
- it stops on the beach frame;
- Replay story is absent before completion, then appears and works;
- owner-connect and owner-control remain below;
- Care Hub interactions and focus handoff still work;
- no console errors, warnings, overlays, or overflow.

Retain screenshot and exact video timing evidence.

- [ ] **Step 3: Verify 390x844 mobile**

Inspect:

- video first, headline and booking action immediately after;
- real typography is readable;
- opening uses the 720p source;
- no horizontal overflow;
- 44px Replay story target;
- Motion control remains the only global motion toggle;
- Care Hub and Studio remain usable.

- [ ] **Step 4: Verify reduced motion and failure fallback**

Emulate `prefers-reduced-motion: reduce` before load. Assert:

- both source `src` values remain empty;
- poster, summary, disclosure, headline, and booking action remain visible;
- explicit Motion on loads and plays the correct source;
- simulated play rejection preserves readable fallback and a working later opt-in.

- [ ] **Step 5: Create only an explicit protected preview**

Inspect `.openai/hosting.json` first if present and use Sites when it exists. Otherwise reuse the existing opaque Vercel review-project ID from `.vercel/project.json`. Do not create another project, change SSO, access, sharing, aliases, domains, or `moteops.tech`.

Create one explicit preview deployment, not a production-target deployment. Record the literal deployment ID, URL, commit SHA, protection state, and tested asset hashes in `.superpowers/sdd/opening-film-preview-receipt.md`.

- [ ] **Step 6: Verify the protected deployment**

Using authenticated read-only requests:

- HTML, CSS, JavaScript, poster, 1080p, and 720p assets return 200;
- MP4 Range requests return 206;
- public raw generation and `production/opening-film/` paths return 404;
- downloaded hashes match the manifest;
- desktop, mobile, normal-motion, and reduced-motion behavior match local evidence.

- [ ] **Step 7: Commit evidence and stop at the release gate**

```bash
git add .superpowers/sdd/opening-film-local-verification.md .superpowers/sdd/opening-film-preview-receipt.md .superpowers/sdd/opening-film-desktop.png .superpowers/sdd/opening-film-mobile.png .superpowers/sdd/opening-film-reduced-motion.png
git commit -m "docs: verify email-to-beach review candidate"
```

Send Mike the protected preview link. State explicitly that `moteops.tech` remains unchanged. Do not publish, alias, merge, or promote until Mike reviews the desktop and phone preview and gives separate live-release approval.
