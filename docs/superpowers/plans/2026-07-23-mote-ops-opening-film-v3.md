# Mote Ops Opening Film V3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current 28-second homepage movie with a verified 50-second silent Mote Ops commercial that preserves Mike, wardrobe, tattoos, office, props, device geometry, and approval boundaries across the complete chaos-to-beach story.

**Architecture:** Seedance 2.0 supplies seven separate performance plates. A local deterministic interface system supplies every readable laptop and phone screen, cursor move, click response, approval state, opening caption, closing copy, and CTA. FFmpeg perspective tracking composites the real interfaces into accepted performance plates, then assembles responsive silent masters while retaining the current production film as rollback media.

**Tech Stack:** Seedance 2.0 through Higgsfield, the existing completed Mike reference Element, HTML/CSS/JavaScript, headless Chrome, FFmpeg/ffprobe, Node.js test runner, sharp, agent-browser, Vercel protected previews, GitHub.

## Global Constraints

- Work only in `.worktrees/moteops-opening-v3` on `feat/moteops-opening-v3`.
- The final runtime is exactly 50 seconds, encoded as 50.000 seconds at 24 frames per second.
- Generate seven 16:9 Seedance 2.0 plates at 1080p, standard mode, standard bitrate, with generated audio disabled.
- Use the completed `Mike Mote Opening` reference Element for Mike's identity in every shot.
- Use the accepted current office generation as the first office continuity reference and the accepted current beach generation as the beach continuity reference.
- Office wardrobe is one charcoal long-sleeve button-down with fully closed cuffs; tattoos are never visible and never bleed through fabric.
- Beach wardrobe is one white short-sleeve linen shirt; tattoos may be visible only where naturally exposed and must follow Mike's supplied references.
- Mike handles only the phone, mouse, keyboard, and laptop. He never shuffles books, pens, folders, or loose props.
- The office in Shots 1 through 6 remains the same room with the same desk, shelves, windows, employees, and camera geography.
- All readable device interfaces are deterministic local composites; Seedance receives blank matte-green device screens.
- Mote Ops prepares work for Mike's approval and never appears to send consequential messages, reschedule meetings, contact leads, move money, pay invoices, or sign agreements without approval.
- The first-pass Seedance preflight is exactly 450 credits: 54 + 72 + 45 + 72 + 72 + 63 + 72.
- The provisional retry-inclusive cap is 675 credits. Do not submit generation until Mike approves that exact cap after preflight.
- Generate and review shots sequentially. Change one prompt variable per retry and record the rejected job, cost, reason, and changed variable.
- Reject any identity drift, malformed hands, prop mutation, wardrobe drift, tattoo bleed, changing office geometry, generated text/logo, or unusable device geometry.
- Keep the current live movie and media paths unchanged until Mike approves the protected V3 preview for production.
- Do not publish to `moteops.tech` during this plan.

---

## File Map

### New production files

- `production/opening-film-v3/generation-prompts.json`: exact shot prompts, model parameters, continuity references, and approved duration map.
- `production/opening-film-v3/interfaces.html`: accessible local shell for every laptop, phone, opening, and closing plate.
- `production/opening-film-v3/interfaces.css`: Mote Ops interface and caption visual system.
- `production/opening-film-v3/interfaces.js`: deterministic plate data and DOM renderer selected by `?plate=`.
- `production/opening-film-v3/capture-interfaces.sh`: captures all 1600×900 laptop plates and 1080×1920 phone plate.
- `production/opening-film-v3/build-screen-sequences.sh`: animates cursor paths and click states into six exact interface sequences.
- `production/opening-film-v3/composite-devices.sh`: chroma keys and perspective-tracks interface sequences into Shots 2 through 7.
- `production/opening-film-v3/build-opening-film-v3.sh`: overlays opening/closing copy, concatenates accepted shots, emits 1080p/720p masters, and builds the poster.
- `production/opening-film-v3/update-manifest.mjs`: records source/output metadata and hashes without overwriting generation history.
- `production/opening-film-v3/tracks/*.ffscript`: measured four-corner laptop and phone geometry.
- `production/opening-film-v3/raw/*.mp4`: local accepted Seedance downloads; ignored from release uploads.
- `production/opening-film-v3/rendered/*`: local captured plates, interface sequences, composites, contact sheets, and review frames; ignored from release uploads.

### New release and evidence files

- `assets/cinematic/mote-ops-opening-v3-manifest.json`: generation, cost, review, post-production, and output ledger.
- `assets/cinematic/mote-ops-opening-v3-1080.mp4`: protected-review 1920×1080 silent master.
- `assets/cinematic/mote-ops-opening-v3-720.mp4`: protected-review 1280×720 silent derivative.
- `assets/cinematic/mote-ops-opening-v3-poster.webp`: V3 poster.
- `.superpowers/sdd/opening-v3-shot-01-review.md` through `.superpowers/sdd/opening-v3-shot-07-review.md`: sequential shot decisions.
- `.superpowers/sdd/opening-v3-final-review.md`: final frame, browser, hash, and preview receipt.

### Modified files

- `tests/opening-film-v3.test.mjs`: V3 contracts.
- `package.json`: V3 capture and build scripts.
- `.gitignore`: V3 raw and rendered source exclusions.
- `.vercelignore`: V3 production source exclusion.
- `index.html`: protected branch only, points to V3 media after V3 media passes.
- `opening-film.css`: only if the final V3 aspect or poster behavior requires a verified branch-only adjustment.

---

### Task 1: Lock the V3 generation and release contracts

**Files:**
- Create: `tests/opening-film-v3.test.mjs`
- Create: `assets/cinematic/mote-ops-opening-v3-manifest.json`
- Create: `production/opening-film-v3/generation-prompts.json`
- Modify: `.gitignore`
- Modify: `.vercelignore`

**Interfaces:**
- Produces: manifest schema `mote-ops-opening/v3`.
- Produces: ordered shot ids `chaos`, `discovery`, `onboarding`, `inbox-calendar`, `calls-finance`, `control-restored`, `beach-payoff`.
- Produces: exact prompt records consumed by Tasks 3 through 10.

- [ ] **Step 1: Write the failing V3 contract test**

Create `tests/opening-film-v3.test.mjs` with:

```js
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const root = resolve(new URL('..', import.meta.url).pathname);
const read = (path) => readFileSync(resolve(root, path), 'utf8');

test('declares the exact seven-shot silent V3 generation contract', () => {
  const manifest = JSON.parse(read('assets/cinematic/mote-ops-opening-v3-manifest.json'));
  assert.equal(manifest.schema, 'mote-ops-opening/v3');
  assert.equal(manifest.durationSeconds, 50);
  assert.equal(manifest.audio, false);
  assert.equal(manifest.generation.model, 'Seedance 2.0');
  assert.equal(manifest.generation.mode, 'std');
  assert.equal(manifest.generation.resolution, '1080p');
  assert.equal(manifest.generation.firstPassCredits, 450);
  assert.equal(manifest.generation.provisionalCap, 675);
  assert.equal(manifest.generation.approvedCreditCap, null);
  assert.equal(manifest.generation.creditsSpent, 0);
  assert.deepEqual(
    manifest.generation.shots.map(({ id, durationSeconds, preflightCredits }) => ({
      id, durationSeconds, preflightCredits,
    })),
    [
      { id: 'chaos', durationSeconds: 6, preflightCredits: 54 },
      { id: 'discovery', durationSeconds: 8, preflightCredits: 72 },
      { id: 'onboarding', durationSeconds: 5, preflightCredits: 45 },
      { id: 'inbox-calendar', durationSeconds: 8, preflightCredits: 72 },
      { id: 'calls-finance', durationSeconds: 8, preflightCredits: 72 },
      { id: 'control-restored', durationSeconds: 7, preflightCredits: 63 },
      { id: 'beach-payoff', durationSeconds: 8, preflightCredits: 72 },
    ]
  );
  for (const shot of manifest.generation.shots) {
    assert.equal(shot.status, 'not-generated');
    assert.equal(shot.jobId, null);
    assert.equal(shot.credits, null);
  }
});

test('defines prompts that lock Mike, office wardrobe, props, and blank screens', () => {
  const prompts = JSON.parse(read('production/opening-film-v3/generation-prompts.json'));
  assert.equal(prompts.referenceElement.id, '089862a9-bb77-4b46-88dd-14629f777d5c');
  assert.equal(prompts.references.officeJobId, '879db0a2-91d0-4276-ad5d-169a5606b303');
  assert.equal(prompts.references.beachJobId, 'edb3bca7-2cb7-4cae-b1dc-1bcc71ecea1d');
  assert.deepEqual(Object.keys(prompts.shots), [
    'chaos',
    'discovery',
    'onboarding',
    'inbox-calendar',
    'calls-finance',
    'control-restored',
    'beach-payoff',
  ]);
  for (const [id, shot] of Object.entries(prompts.shots)) {
    assert.match(shot.prompt, /Mike Mote Opening/);
    assert.match(shot.prompt, /no readable generated text or logos/i);
    assert.equal(shot.params.aspect_ratio, '16:9', id);
    assert.equal(shot.params.resolution, '1080p', id);
    assert.equal(shot.params.mode, 'std', id);
    assert.equal(shot.params.generate_audio, false, id);
  }
  for (const id of ['chaos', 'discovery', 'onboarding', 'inbox-calendar', 'calls-finance', 'control-restored']) {
    assert.match(prompts.shots[id].prompt, /charcoal long-sleeve button-down/i);
    assert.match(prompts.shots[id].prompt, /tattoos.*(?:covered|not visible)/i);
  }
  assert.match(prompts.shots['beach-payoff'].prompt, /white short-sleeve linen shirt/i);
  assert.match(prompts.shots['beach-payoff'].prompt, /tattoos.*reference/i);
});

test('keeps V3 raw production inputs outside release uploads', () => {
  assert.match(read('.gitignore'), /^production\/opening-film-v3\/raw\/$/m);
  assert.match(read('.gitignore'), /^production\/opening-film-v3\/rendered\/$/m);
  assert.match(read('.vercelignore'), /^production\/opening-film-v3\/$/m);
});
```

- [ ] **Step 2: Run the contract test and verify RED**

Run:

```bash
node --test tests/opening-film-v3.test.mjs
```

Expected: FAIL because the V3 manifest and prompts do not exist.

- [ ] **Step 3: Add the exact initial manifest**

Create `assets/cinematic/mote-ops-opening-v3-manifest.json`:

```json
{
  "schema": "mote-ops-opening/v3",
  "status": "awaiting-credit-approval",
  "title": "Mote Ops continuity-controlled opening",
  "durationSeconds": 50,
  "audio": false,
  "disclosure": "AI-generated film · fictional business scenario featuring Mike Mote.",
  "generation": {
    "model": "Seedance 2.0",
    "mode": "std",
    "resolution": "1080p",
    "bitrateMode": "standard",
    "firstPassCredits": 450,
    "provisionalCap": 675,
    "approvedCreditCap": null,
    "creditsSpent": 0,
    "shots": [
      { "id": "chaos", "durationSeconds": 6, "preflightCredits": 54, "status": "not-generated", "jobId": null, "credits": null, "attempts": [] },
      { "id": "discovery", "durationSeconds": 8, "preflightCredits": 72, "status": "not-generated", "jobId": null, "credits": null, "attempts": [] },
      { "id": "onboarding", "durationSeconds": 5, "preflightCredits": 45, "status": "not-generated", "jobId": null, "credits": null, "attempts": [] },
      { "id": "inbox-calendar", "durationSeconds": 8, "preflightCredits": 72, "status": "not-generated", "jobId": null, "credits": null, "attempts": [] },
      { "id": "calls-finance", "durationSeconds": 8, "preflightCredits": 72, "status": "not-generated", "jobId": null, "credits": null, "attempts": [] },
      { "id": "control-restored", "durationSeconds": 7, "preflightCredits": 63, "status": "not-generated", "jobId": null, "credits": null, "attempts": [] },
      { "id": "beach-payoff", "durationSeconds": 8, "preflightCredits": 72, "status": "not-generated", "jobId": null, "credits": null, "attempts": [] }
    ]
  },
  "postProduction": {
    "interfaces": [],
    "deviceTracks": [],
    "openingCaption": "Meetings stack up. Your inbox keeps growing. Calls get missed.",
    "closingHeadline": "Mote Ops cleaned up the work. Mike found the beach.",
    "closingTagline": "Your people and tools already do the work. We help them work as one.",
    "closingCta": "Book your consultation today. Free 30-minute consultation to see what Mote Ops can do for you."
  },
  "outputs": {
    "master1080": null,
    "master720": null,
    "poster": null
  },
  "frameReview": {
    "intervalSeconds": 0.5,
    "additionalTimesSeconds": []
  }
}
```

- [ ] **Step 4: Add exact prompts and generation parameters**

Create `production/opening-film-v3/generation-prompts.json`. Every prompt begins with the reference element placeholder and also names the completed Element for auditability:

```json
{
  "referenceElement": {
    "id": "089862a9-bb77-4b46-88dd-14629f777d5c",
    "name": "Mike Mote Opening",
    "status": "completed"
  },
  "references": {
    "officeJobId": "879db0a2-91d0-4276-ad5d-169a5606b303",
    "beachJobId": "edb3bca7-2cb7-4cae-b1dc-1bcc71ecea1d"
  },
  "shots": {
    "chaos": {
      "prompt": "<<<089862a9-bb77-4b46-88dd-14629f777d5c>>> Mike Mote Opening, six-second single continuous restrained commercial shot in the exact same realistic small-business office as the office video reference. Mike wears one charcoal long-sleeve button-down shirt with both cuffs fully buttoned, dark trousers, and his usual glasses. His tattoos are completely covered and no tattoo texture shows through the fabric. Mike listens to one corded desk phone, moves one mouse, types briefly on one keyboard, and glances toward one laptop while two consistent employees wait in the background. Stable paper stacks remain untouched. Mike never handles a pen, book, folder, or loose paper. Natural credible pressure, not slapstick. Locked room geometry, stable props, stable employees, physically plausible hands. Camera uses only a very slow short push. Laptop and device screens are turned away or blank and contain no readable generated text or logos. No object transformation, duplication, disappearance, wardrobe change, tattoo visibility, malformed fingers, moving furniture, floating labels, holograms, neon effects, readable generated text or logos.",
      "params": { "duration": 6, "aspect_ratio": "16:9", "resolution": "1080p", "mode": "std", "bitrate_mode": "standard", "genre": "drama", "generate_audio": false, "count": 1 }
    },
    "discovery": {
      "prompt": "<<<089862a9-bb77-4b46-88dd-14629f777d5c>>> Mike Mote Opening, eight-second single continuous restrained commercial shot continuing the exact same office, desk, employee arrangement, lighting, camera side, and charcoal long-sleeve button-down wardrobe from the accepted chaos shot. Both cuffs remain fully buttoned, tattoos completely covered with no bleed-through. Mike pauses, notices something useful on his physical laptop, looks at the screen for two full seconds, reads for three full seconds, then slowly moves the mouse and performs one natural click. His relief begins subtly. The camera makes a slow push toward the laptop but keeps the bezel visible. The laptop display is one flat uninterrupted matte chroma green surface, color 0x008a50, fully inside the bezel, stable, unobstructed, with all four corners visible for tracking. Mike touches only the mouse and keyboard. Same stable props and employees. No screen content, object transformation, wardrobe change, tattoos, malformed hands, fast camera move, generated text or logos.",
      "params": { "duration": 8, "aspect_ratio": "16:9", "resolution": "1080p", "mode": "std", "bitrate_mode": "standard", "genre": "drama", "generate_audio": false, "count": 1 }
    },
    "onboarding": {
      "prompt": "<<<089862a9-bb77-4b46-88dd-14629f777d5c>>> Mike Mote Opening, five-second over-the-shoulder commercial shot in the exact same office and charcoal long-sleeve button-down wardrobe as the accepted discovery shot. Both cuffs fully buttoned, tattoos covered, no bleed-through. Mike calmly uses the mouse and performs three separated natural selection clicks while reading the laptop. The camera is nearly locked with only a subtle push. The laptop display is one flat uninterrupted matte chroma green surface, color 0x008a50, stable inside the bezel with all four corners visible. Same desk, shelves, windows, employees, props, light direction, glasses, beard, hair, age, and body proportions. No readable generated screen content, no object mutation, no hand distortion, no wardrobe drift, no tattoos, no generated text or logos.",
      "params": { "duration": 5, "aspect_ratio": "16:9", "resolution": "1080p", "mode": "std", "bitrate_mode": "standard", "genre": "drama", "generate_audio": false, "count": 1 }
    },
    "inbox-calendar": {
      "prompt": "<<<089862a9-bb77-4b46-88dd-14629f777d5c>>> Mike Mote Opening, eight-second over-the-shoulder commercial shot continuing the exact same office, camera side, desk, employees, and charcoal long-sleeve button-down wardrobe. Cuffs fully buttoned, tattoos covered with no bleed-through. Mike reads carefully, moves the mouse naturally, performs one review click near 3.5 seconds, pauses, then performs one approval click near 7 seconds. His posture gradually relaxes. The physical laptop display is one flat uninterrupted matte chroma green surface, color 0x008a50, stable inside the bezel and never occluded, all corners visible. Stable props, realistic hands, natural commercial pace. No generated interface, no readable text, no object mutation, no changing room, no wardrobe drift, no tattoos, no logos.",
      "params": { "duration": 8, "aspect_ratio": "16:9", "resolution": "1080p", "mode": "std", "bitrate_mode": "standard", "genre": "drama", "generate_audio": false, "count": 1 }
    },
    "calls-finance": {
      "prompt": "<<<089862a9-bb77-4b46-88dd-14629f777d5c>>> Mike Mote Opening, eight-second over-the-shoulder commercial shot continuing the exact same office, camera side, desk, employees, and charcoal long-sleeve button-down wardrobe. Cuffs fully buttoned, tattoos covered with no bleed-through. Mike reads a prepared summary, moves the mouse naturally, performs one review click near 3.5 seconds, pauses, then performs one approval click near 7 seconds. His expression is now controlled and relieved. The physical laptop display is one flat uninterrupted matte chroma green surface, color 0x008a50, stable inside the bezel and never occluded, all corners visible. Stable props, realistic hands, natural commercial pace. No generated interface, no readable text, no payment action, no object mutation, no changing room, no wardrobe drift, no tattoos, no logos.",
      "params": { "duration": 8, "aspect_ratio": "16:9", "resolution": "1080p", "mode": "std", "bitrate_mode": "standard", "genre": "drama", "generate_audio": false, "count": 1 }
    },
    "control-restored": {
      "prompt": "<<<089862a9-bb77-4b46-88dd-14629f777d5c>>> Mike Mote Opening, seven-second restrained commercial shot in the exact same office, desk, shelves, windows, employees, and charcoal long-sleeve button-down wardrobe as every preceding accepted office shot. Cuffs fully buttoned, tattoos covered with no bleed-through. The office is now orderly and serene through neat surfaces, softer natural light, and relaxed happy employees, but the room geometry and people do not change. For two full seconds Mike reads the laptop, whose display is one stable matte chroma green surface color 0x008a50 inside the bezel. He exhales, gives a small relieved smile, closes the laptop normally, stands, and walks out of the workspace while employees continue working comfortably. Physically plausible hands and laptop hinge. No new office, no object mutation, no wardrobe drift, no tattoos, no generated text or logos.",
      "params": { "duration": 7, "aspect_ratio": "16:9", "resolution": "1080p", "mode": "std", "bitrate_mode": "standard", "genre": "drama", "generate_audio": false, "count": 1 }
    },
    "beach-payoff": {
      "prompt": "<<<089862a9-bb77-4b46-88dd-14629f777d5c>>> Mike Mote Opening, eight-second natural dry-humor commercial payoff at the same understated beach as the beach video reference. Mike has the exact same face, beard, hair, age, glasses state, and body proportions as the accepted office sequence. He intentionally wears one white short-sleeve linen shirt. Tattoos are visible only on naturally exposed arms and follow the placement and dark ink character in Mike's supplied reference photographs; tattoos do not move, multiply, or change. Mike looks down at a phone for three full seconds, then smiles and looks toward the water as the camera gently widens. The phone display is one flat uninterrupted matte chroma green surface color 0x008a50, stable inside the bezel and unobstructed for tracking. Natural daylight, restrained color, clean negative space on the left for final copy. No luxury-resort staging, no other recognizable person, no malformed hands, no moving tattoos, no generated phone text, no readable generated text or logos.",
      "params": { "duration": 8, "aspect_ratio": "16:9", "resolution": "1080p", "mode": "std", "bitrate_mode": "standard", "genre": "comedy", "generate_audio": false, "count": 1 }
    }
  }
}
```

- [ ] **Step 5: Exclude V3 production sources**

Append to `.gitignore`:

```gitignore
production/opening-film-v3/raw/
production/opening-film-v3/rendered/
```

Append to `.vercelignore`:

```gitignore
production/opening-film-v3/
```

- [ ] **Step 6: Run tests and verify GREEN**

Run:

```bash
node --test tests/opening-film-v3.test.mjs
npm test
git diff --check
```

Expected: V3 tests PASS; full suite PASS; diff check has no output.

- [ ] **Step 7: Commit**

```bash
git add tests/opening-film-v3.test.mjs \
  assets/cinematic/mote-ops-opening-v3-manifest.json \
  production/opening-film-v3/generation-prompts.json \
  .gitignore .vercelignore
git commit -m "test: lock opening film V3 contract"
```

---

### Task 2: Build the deterministic Mote Ops interface plates

**Files:**
- Create: `production/opening-film-v3/interfaces.html`
- Create: `production/opening-film-v3/interfaces.css`
- Create: `production/opening-film-v3/interfaces.js`
- Create: `production/opening-film-v3/capture-interfaces.sh`
- Modify: `tests/opening-film-v3.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: exact copy from `mote-ops-opening-v3-manifest.json`.
- Produces: named PNG plates in `production/opening-film-v3/rendered/interfaces/`.
- Produces: `capture:opening-v3-interfaces` package script.

- [ ] **Step 1: Add a failing interface contract**

Append:

```js
test('builds every readable V3 interface as a deterministic local plate', () => {
  const html = read('production/opening-film-v3/interfaces.html');
  const css = read('production/opening-film-v3/interfaces.css');
  const js = read('production/opening-film-v3/interfaces.js');
  const capture = read('production/opening-film-v3/capture-interfaces.sh');
  const packageJson = JSON.parse(read('package.json'));
  const plates = [
    'invitation', 'invitation-clicked',
    'onboarding-tools', 'onboarding-work', 'onboarding-approval',
    'inbox', 'inbox-approved', 'calendar', 'calendar-approved',
    'calls', 'calls-approved', 'finance', 'finance-approved',
    'dashboard-zero', 'phone-zero', 'opening-copy', 'closing-copy',
  ];
  for (const plate of plates) {
    assert.match(js, new RegExp(`['"]${plate}['"]\\s*:`), plate);
    assert.match(capture, new RegExp(`\\n  ${plate}\\n`), plate);
  }
  for (const copy of [
    'Drowning in the work? Start here.',
    'See how Mote Ops can help',
    '286 messages organized',
    '18 replies prepared',
    '3 conflicts resolved',
    '2 changes ready',
    '7 missed calls summarized',
    '4 follow-ups prepared',
    '5 exceptions summarized',
    '2 items need review',
    'Pending tasks: 0',
    'Enjoy your day.',
    'Mote Ops cleaned up the work.',
    'Mike found the beach.',
    'Book your consultation today.',
    'Free 30-minute consultation',
  ]) assert.match(js, new RegExp(copy.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.doesNotMatch(js, /\b(?:sent automatically|paid automatically|rescheduled automatically)\b/i);
  assert.match(html, /aria-live="polite"/);
  assert.match(css, /--mote-cream:\s*#f5f1e8/);
  assert.match(css, /--mote-green:\s*#0d4b3d/);
  assert.equal(packageJson.scripts['capture:opening-v3-interfaces'],
    'bash production/opening-film-v3/capture-interfaces.sh');
});
```

- [ ] **Step 2: Run and verify RED**

Run:

```bash
node --test --test-name-pattern="deterministic local plate" tests/opening-film-v3.test.mjs
```

Expected: FAIL because interface files do not exist.

- [ ] **Step 3: Implement one data-driven interface shell**

Create `interfaces.html` with one `#app`, one polite status region, local CSS, and local JS:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Mote Ops Film Interface</title>
  <link rel="stylesheet" href="interfaces.css">
</head>
<body>
  <main id="app"></main>
  <p class="sr-only" aria-live="polite" id="status"></p>
  <script src="interfaces.js"></script>
</body>
</html>
```

Create `interfaces.js` around a single `plates` object. Use these exact plate entries and statuses:

```js
const plates = {
  'invitation': { view: 'mail', eyebrow: 'FROM MOTE OPS', title: 'Drowning in the work? Start here.', body: 'Mote Ops organizes email, meetings, calls, leads, and financial review around the tools you already use.', action: 'See how Mote Ops can help', state: 'ready' },
  'invitation-clicked': { view: 'mail', eyebrow: 'FROM MOTE OPS', title: 'Drowning in the work? Start here.', body: 'Mote Ops organizes email, meetings, calls, leads, and financial review around the tools you already use.', action: 'Opening Mote Ops…', state: 'clicked' },
  'onboarding-tools': { view: 'onboarding', step: '1 of 3', title: 'Which tools do you use?', options: ['Email', 'Calendar', 'Calls + leads', 'Financial review'], selected: ['Email', 'Calendar', 'Calls + leads', 'Financial review'] },
  'onboarding-work': { view: 'onboarding', step: '2 of 3', title: 'What work is taking the most time?', options: ['Inbox follow-up', 'Schedule changes', 'Missed calls', 'Financial review'], selected: ['Inbox follow-up', 'Schedule changes', 'Missed calls', 'Financial review'] },
  'onboarding-approval': { view: 'onboarding', step: '3 of 3', title: 'Which actions must wait for your approval?', options: ['Send prepared replies', 'Change the calendar', 'Contact a lead', 'Act on financial items'], selected: ['Send prepared replies', 'Change the calendar', 'Contact a lead', 'Act on financial items'], note: 'Approval stays on.' },
  'inbox': { view: 'review', eyebrow: 'INBOX', title: '286 messages organized', metric: '18 replies prepared', rows: [['Jordan Lee', 'Proposal question', 'Reply prepared'], ['CC’s Learning Center', 'Tour follow-up', 'Reply prepared'], ['Northline Supply', 'Delivery timing', 'Reply prepared']], action: 'Approve prepared replies', state: 'ready' },
  'inbox-approved': { view: 'review', eyebrow: 'INBOX', title: '286 messages organized', metric: '18 replies prepared', rows: [['Jordan Lee', 'Proposal question', 'Approved'], ['CC’s Learning Center', 'Tour follow-up', 'Approved'], ['Northline Supply', 'Delivery timing', 'Approved']], action: 'Approved', state: 'approved' },
  'calendar': { view: 'review', eyebrow: 'CALENDAR', title: '3 conflicts resolved', metric: '2 changes ready', rows: [['Team review', 'Move to 2:30 PM', 'Ready for approval'], ['Client call', 'Move to Thursday', 'Ready for approval']], action: 'Approve schedule changes', state: 'ready' },
  'calendar-approved': { view: 'review', eyebrow: 'CALENDAR', title: '3 conflicts resolved', metric: '2 changes ready', rows: [['Team review', 'Move to 2:30 PM', 'Approved'], ['Client call', 'Move to Thursday', 'Approved']], action: 'Approved', state: 'approved' },
  'calls': { view: 'review', eyebrow: 'CALLS + LEADS', title: '7 missed calls summarized', metric: '4 follow-ups prepared', rows: [['Avery Chen', 'Asked about availability', 'Follow-up prepared'], ['Northline Supply', 'Delivery update', 'Follow-up prepared'], ['Jordan Rivera', 'Requested a callback', 'Follow-up prepared']], action: 'Approve follow-ups', state: 'ready' },
  'calls-approved': { view: 'review', eyebrow: 'CALLS + LEADS', title: '7 missed calls summarized', metric: '4 follow-ups prepared', rows: [['Avery Chen', 'Asked about availability', 'Approved'], ['Northline Supply', 'Delivery update', 'Approved'], ['Jordan Rivera', 'Requested a callback', 'Approved']], action: 'Approved', state: 'approved' },
  'finance': { view: 'review', eyebrow: 'FINANCIAL REVIEW', title: '5 exceptions summarized', metric: '2 items need review', rows: [['Invoice 1048', 'Amount differs from estimate', 'Review'], ['Vendor renewal', 'Price changed', 'Review']], action: 'Mark review complete', state: 'ready' },
  'finance-approved': { view: 'review', eyebrow: 'FINANCIAL REVIEW', title: '5 exceptions summarized', metric: '2 items need review', rows: [['Invoice 1048', 'Amount differs from estimate', 'Reviewed'], ['Vendor renewal', 'Price changed', 'Reviewed']], action: 'Review complete', state: 'approved' },
  'dashboard-zero': { view: 'zero', eyebrow: 'TODAY', title: 'Pending tasks: 0', body: 'You’re clear for the day.' },
  'phone-zero': { view: 'phone', eyebrow: 'MOTE OPS', title: 'Pending tasks: 0', body: 'Enjoy your day.' },
  'opening-copy': { view: 'overlay', lines: ['Meetings stack up.', 'Your inbox keeps growing.', 'Calls get missed.'] },
  'closing-copy': { view: 'closing', title: ['Mote Ops cleaned up the work.', 'Mike found the beach.'], body: 'Your people and tools already do the work. We help them work as one.', action: ['Book your consultation today.', 'Free 30-minute consultation to see what Mote Ops can do for you.'] }
};
```

Implement the renderers exactly as pure template functions:

```js
const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
}[char]));

const nav = (active) => `
  <aside class="app-nav">
    <strong>MOTE OPS</strong>
    ${['Today', 'Inbox', 'Calendar', 'Calls + leads', 'Financial review']
      .map((item) => `<span class="${item === active ? 'is-active' : ''}">${escapeHtml(item)}</span>`)
      .join('')}
  </aside>`;

const appShell = (active, body) => `<section class="app-shell">${nav(active)}<div class="app-main">${body}</div></section>`;

const renderMail = (plate) => appShell('Inbox', `
  <p class="eyebrow">${escapeHtml(plate.eyebrow)}</p>
  <p class="mail-meta">Mote Ops &lt;hello@moteops.tech&gt; · Today</p>
  <h1>${escapeHtml(plate.title)}</h1>
  <p class="lede">${escapeHtml(plate.body)}</p>
  <button class="action" data-state="${escapeHtml(plate.state)}">${escapeHtml(plate.action)}</button>
`);

const renderOnboarding = (plate) => appShell('Today', `
  <p class="eyebrow">SETUP · ${escapeHtml(plate.step)}</p>
  <h1>${escapeHtml(plate.title)}</h1>
  <div class="option-grid">${plate.options.map((option) => `
    <button class="option ${plate.selected.includes(option) ? 'is-selected' : ''}">
      <span>${plate.selected.includes(option) ? '✓' : ''}</span>${escapeHtml(option)}
    </button>`).join('')}</div>
  ${plate.note ? `<p class="boundary-note">${escapeHtml(plate.note)}</p>` : ''}
`);

const renderReview = (plate) => appShell(plate.eyebrow === 'INBOX' ? 'Inbox' :
  plate.eyebrow === 'CALENDAR' ? 'Calendar' :
  plate.eyebrow === 'CALLS + LEADS' ? 'Calls + leads' : 'Financial review', `
  <p class="eyebrow">${escapeHtml(plate.eyebrow)}</p>
  <h1>${escapeHtml(plate.title)}</h1>
  <p class="metric">${escapeHtml(plate.metric)}</p>
  <div class="review-list">${plate.rows.map((row) => `
    <article class="review-row">
      <strong>${escapeHtml(row[0])}</strong>
      <span>${escapeHtml(row[1])}</span>
      <em>${escapeHtml(row[2])}</em>
    </article>`).join('')}</div>
  <button class="action" data-state="${escapeHtml(plate.state)}">${escapeHtml(plate.action)}</button>
`);

const renderZero = (plate) => appShell('Today', `
  <p class="eyebrow">${escapeHtml(plate.eyebrow)}</p>
  <div class="zero-mark" aria-hidden="true">✓</div>
  <h1>${escapeHtml(plate.title)}</h1>
  <p class="lede">${escapeHtml(plate.body)}</p>
`);

const renderPhone = (plate) => `
  <section class="phone">
    <div class="phone-card">
      <p class="eyebrow">${escapeHtml(plate.eyebrow)}</p>
      <h1>${escapeHtml(plate.title)}</h1>
      <p class="lede">${escapeHtml(plate.body)}</p>
    </div>
  </section>`;

const renderOverlay = (plate) => `
  <section class="overlay">${plate.lines.map((line) => `<strong>${escapeHtml(line)}</strong>`).join('')}</section>`;

const renderClosing = (plate) => `
  <section class="closing">
    <div class="closing-block">
      <h1>${plate.title.map((line) => `<span>${escapeHtml(line)}</span>`).join('')}</h1>
      <p>${escapeHtml(plate.body)}</p>
      <strong>${escapeHtml(plate.action[0])}</strong>
      <small>${escapeHtml(plate.action[1])}</small>
    </div>
  </section>`;

const renderers = {
  mail: renderMail,
  onboarding: renderOnboarding,
  review: renderReview,
  zero: renderZero,
  phone: renderPhone,
  overlay: renderOverlay,
  closing: renderClosing,
};
```

Select the plate with:

```js
const requested = new URLSearchParams(location.search).get('plate') || 'invitation';
const plate = plates[requested];
if (!plate) throw new Error(`Unknown plate: ${requested}`);
document.body.dataset.plate = requested;
document.querySelector('#app').innerHTML = renderers[plate.view](plate);
document.querySelector('#status').textContent = `${requested} ready`;
```

Create `interfaces.css` with:

```css
:root {
  --mote-cream: #f5f1e8;
  --mote-green: #0d4b3d;
  --mote-ink: #171813;
  --mote-rust: #b95c36;
  --mote-rule: #bcb29c;
}
* { box-sizing: border-box; }
html, body { margin: 0; width: 100%; min-height: 100%; background: var(--mote-cream); color: var(--mote-ink); }
body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
#app { width: 1600px; height: 900px; overflow: hidden; }
.app-shell { display: grid; grid-template-columns: 236px 1fr; width: 100%; height: 100%; }
.app-nav { padding: 54px 34px; border-right: 1px solid var(--mote-rule); background: #eee8dc; }
.app-main { padding: 76px 84px; }
.eyebrow { color: var(--mote-green); font: 800 18px/1.2 ui-monospace, monospace; letter-spacing: .11em; }
h1 { max-width: 980px; margin: 20px 0 22px; font: 700 64px/.96 Georgia, serif; letter-spacing: -.035em; }
.metric { color: var(--mote-rust); font-size: 26px; font-weight: 800; }
.review-row { display: grid; grid-template-columns: 1fr 1.4fr auto; gap: 24px; padding: 24px 0; border-top: 1px solid var(--mote-rule); }
.action { display: inline-flex; min-height: 58px; align-items: center; margin-top: 28px; padding: 0 28px; background: var(--mote-green); color: white; font-weight: 800; }
[data-state="approved"] .action { background: #466c54; }
.phone { width: 1080px; height: 1920px; padding: 290px 92px; background: #111; color: white; }
.phone-card { padding: 78px 66px; border-radius: 42px; background: var(--mote-cream); color: var(--mote-ink); }
.overlay, .closing { width: 1920px; height: 1080px; background: transparent; }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); }
```

Append these exact styles:

```css
.app-nav { display: flex; flex-direction: column; gap: 18px; }
.app-nav strong { margin-bottom: 34px; font: 900 24px/1 ui-monospace, monospace; letter-spacing: .14em; }
.app-nav span { padding: 14px 16px; color: #625f56; font-weight: 700; }
.app-nav span.is-active { background: var(--mote-green); color: white; }
.mail-meta, .lede { max-width: 980px; color: #55564f; font: 400 25px/1.45 Georgia, serif; }
.option-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; max-width: 1040px; }
.option { display: flex; min-height: 86px; align-items: center; gap: 18px; border: 1px solid var(--mote-rule); background: #fbf8f1; padding: 0 24px; text-align: left; font: 750 24px/1.2 inherit; }
.option span { display: grid; width: 34px; height: 34px; place-items: center; border: 1px solid var(--mote-rule); }
.option.is-selected { border-color: var(--mote-green); box-shadow: inset 6px 0 var(--mote-green); }
.option.is-selected span { background: var(--mote-green); color: white; }
.boundary-note { margin-top: 28px; color: var(--mote-green); font-weight: 800; }
.review-list { margin-top: 34px; border-bottom: 1px solid var(--mote-rule); }
.review-row strong, .review-row span { font-style: normal; font-size: 21px; }
.review-row em { color: var(--mote-green); font-style: normal; font-weight: 800; }
.zero-mark { display: grid; width: 96px; height: 96px; place-items: center; border-radius: 50%; background: var(--mote-green); color: white; font-size: 48px; }
.overlay { display: flex; flex-direction: column; justify-content: center; gap: 8px; padding-left: 112px; }
.overlay strong { width: max-content; background: rgba(245, 241, 232, .94); border: 2px solid var(--mote-ink); padding: 13px 18px; font: 900 34px/1.05 "Arial Narrow", sans-serif; letter-spacing: .02em; }
.closing { display: flex; align-items: center; padding-left: 96px; }
.closing-block { width: 850px; background: rgba(13, 75, 61, .96); border: 2px solid var(--mote-cream); box-shadow: 12px 12px 0 rgba(185, 92, 54, .9); color: white; padding: 38px 42px; }
.closing-block h1 { margin: 0 0 18px; color: white; font-size: 52px; }
.closing-block h1 span, .closing-block strong, .closing-block small { display: block; }
.closing-block p { margin: 0 0 24px; color: #e5ded0; font: 400 23px/1.4 Georgia, serif; }
.closing-block strong { font-size: 24px; }
.closing-block small { margin-top: 7px; color: #e5ded0; font-size: 18px; }
button { border-radius: 0; cursor: default; }
```

Do not add gradients, glow, blue, purple, particles, or generic AI motifs.

- [ ] **Step 4: Add deterministic capture**

Create `capture-interfaces.sh` following the existing headless Chrome pattern. The plate array must be:

```bash
plates=(
  invitation
  invitation-clicked
  onboarding-tools
  onboarding-work
  onboarding-approval
  inbox
  inbox-approved
  calendar
  calendar-approved
  calls
  calls-approved
  finance
  finance-approved
  dashboard-zero
  phone-zero
  opening-copy
  closing-copy
)
```

Use `--window-size=1080,1920` only for `phone-zero`; use `--window-size=1600,900` for application plates; use `--window-size=1920,1080` for opening and closing overlays. Save each image as `rendered/interfaces/$plate.png`. Use a `mktemp -d` Chrome profile and delete it with a trap.

Add to `package.json`:

```json
"capture:opening-v3-interfaces": "bash production/opening-film-v3/capture-interfaces.sh"
```

- [ ] **Step 5: Capture and inspect**

Run:

```bash
npm run capture:opening-v3-interfaces
montage production/opening-film-v3/rendered/interfaces/*.png \
  -thumbnail 320x180 -tile 4x -geometry +8+8 \
  production/opening-film-v3/rendered/interface-contact-sheet.png
```

Inspect `interface-contact-sheet.png`. Reject clipped copy, overlapping rows, text smaller than the current accepted laptop plates, or any CTA that cannot be read at the website's 390px viewport.

- [ ] **Step 6: Run tests and commit**

```bash
node --test tests/opening-film-v3.test.mjs
npm test
git diff --check
git add production/opening-film-v3/interfaces.html \
  production/opening-film-v3/interfaces.css \
  production/opening-film-v3/interfaces.js \
  production/opening-film-v3/capture-interfaces.sh \
  tests/opening-film-v3.test.mjs package.json
git commit -m "feat: add opening film V3 interfaces"
```

---

### Task 3: Confirm identity references, exact costs, and spending authority

**Files:**
- Modify: `assets/cinematic/mote-ops-opening-v3-manifest.json`
- Create: `.superpowers/sdd/opening-v3-preflight.md`

**Interfaces:**
- Consumes: seven prompts from `generation-prompts.json`.
- Produces: confirmed Element status, current balance snapshot, exact seven-shot preflight, and `approvedCreditCap`.
- Gate: no Task 4 tool submission until `approvedCreditCap` is an integer at least 450.

- [ ] **Step 1: Verify the existing identity Element**

Call the reference Element tool with action `get` and id `089862a9-bb77-4b46-88dd-14629f777d5c`.

Expected:

```text
name: Mike Mote Opening
status: completed
source images: 3
```

Stop if status is not `completed`.

- [ ] **Step 2: Verify the current Higgsfield balance**

Call the Higgsfield balance tool.

Record the returned plan and credits in `.superpowers/sdd/opening-v3-preflight.md`. The planning snapshot was Ultra with 2,709.86 credits; use the fresh execution value as authoritative.

- [ ] **Step 3: Run exact no-spend cost preflights**

For each prompt, call Seedance 2.0 with its exact `params`, add `model: "seedance_2_0"` and `get_cost: true`, and do not add media references to the preflight because media references do not change the published duration price.

Expected:

```text
chaos: 54
discovery: 72
onboarding: 45
inbox-calendar: 72
calls-finance: 72
control-restored: 63
beach-payoff: 72
first pass total: 450
```

If any exact result differs, replace `firstPassCredits`, each `preflightCredits`, and `provisionalCap` with the returned values. Set provisional cap to `ceil(firstPassTotal * 1.5)`.

- [ ] **Step 4: Present the exact cap and stop for approval**

Report:

```text
Exact first pass: 450 credits.
Retry reserve: 225 credits.
Maximum authorized spend requested: 675 credits.
Current film remains live until private review.
Approve 675 credits?
```

Do not continue until Mike approves.

- [ ] **Step 5: Record approval**

Set:

```json
"status": "awaiting-generation",
"approvedCreditCap": 675
```

Record approval timestamp, current balance, exact preflight calls, and zero credits spent in `.superpowers/sdd/opening-v3-preflight.md`.

- [ ] **Step 6: Verify the gate and commit**

Add:

```js
test('does not allow V3 generation without exact approved authority', () => {
  const manifest = JSON.parse(read('assets/cinematic/mote-ops-opening-v3-manifest.json'));
  assert.equal(manifest.generation.firstPassCredits, 450);
  assert.equal(manifest.generation.approvedCreditCap, 675);
  assert.ok(manifest.generation.approvedCreditCap >= manifest.generation.firstPassCredits);
  assert.equal(manifest.generation.creditsSpent, 0);
});
```

Run:

```bash
node --test --test-name-pattern="approved authority" tests/opening-film-v3.test.mjs
npm test
git add assets/cinematic/mote-ops-opening-v3-manifest.json \
  .superpowers/sdd/opening-v3-preflight.md tests/opening-film-v3.test.mjs
git commit -m "docs: approve opening film V3 generation cap"
```

---

### Task 4: Generate and accept Shot 1, Chaos

**Files:**
- Create local: `production/opening-film-v3/raw/shot-01-chaos.mp4`
- Create: `.superpowers/sdd/opening-v3-shot-01-review.md`
- Modify: `assets/cinematic/mote-ops-opening-v3-manifest.json`
- Modify: `tests/opening-film-v3.test.mjs`

**Interfaces:**
- Consumes: `prompts.shots.chaos`.
- Media input: current accepted office job `879db0a2-91d0-4276-ad5d-169a5606b303` with role `video_references`.
- Produces: accepted Shot 1 job id used as continuity reference in Task 5.

- [ ] **Step 1: Add a failing acceptance test**

```js
test('records an accepted six-second chaos plate', () => {
  const manifest = JSON.parse(read('assets/cinematic/mote-ops-opening-v3-manifest.json'));
  const shot = manifest.generation.shots.find(({ id }) => id === 'chaos');
  assert.equal(shot.status, 'accepted');
  assert.equal(shot.credits, 54);
  assert.match(shot.jobId, /^[0-9a-f-]{36}$/);
  assert.ok(shot.review.endsWith('opening-v3-shot-01-review.md'));
});
```

Run and expect FAIL because status is `not-generated`.

- [ ] **Step 2: Reconfirm remaining authority**

Assert in the manifest:

```text
creditsSpent + 54 <= approvedCreditCap
```

Stop if false.

- [ ] **Step 3: Submit one Seedance generation**

Call Seedance 2.0 with the exact chaos prompt and params, plus:

```json
{
  "model": "seedance_2_0",
  "medias": [
    { "role": "video_references", "value": "879db0a2-91d0-4276-ad5d-169a5606b303" }
  ]
}
```

Do not request more than one result.

- [ ] **Step 4: Download and frame-review the result**

Save the completed result as `raw/shot-01-chaos.mp4`.

Run:

```bash
ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate \
  -show_entries format=duration -of json \
  production/opening-film-v3/raw/shot-01-chaos.mp4
ffmpeg -hide_banner -loglevel error \
  -i production/opening-film-v3/raw/shot-01-chaos.mp4 \
  -vf "fps=2,scale=640:-1,tile=4x3:padding=6:margin=6:color=F5F1E8" \
  -frames:v 1 production/opening-film-v3/rendered/shot-01-contact.png
```

Review every half-second and separately inspect every frame containing hands, phone, mouse, keyboard, or employee movement.

Accept only if the shirt, cuffs, hidden tattoos, face, glasses, beard, hands, employees, office, props, and screen staging pass all global constraints.

- [ ] **Step 5: Record accept or one-variable rejection**

If accepted, write the review with job id, cost, dimensions, duration, hash, frame times, and explicit continuity findings. Set `status: accepted`, `jobId`, `credits: 54`, `review`, append the attempt, and increment `creditsSpent`.

If rejected, write `status: rejected`, the exact defect, and one changed prompt variable. Preflight the retry, verify it remains within 675, and submit only after the rejection is recorded. Never change identity, wardrobe, office, action, and camera simultaneously.

- [ ] **Step 6: Run tests and commit**

```bash
node --test --test-name-pattern="accepted six-second chaos" tests/opening-film-v3.test.mjs
npm test
git add assets/cinematic/mote-ops-opening-v3-manifest.json \
  .superpowers/sdd/opening-v3-shot-01-review.md tests/opening-film-v3.test.mjs
git commit -m "feat: accept opening V3 chaos shot"
```

---

### Task 5: Generate and accept Shot 2, Discovery

**Files:**
- Create local: `production/opening-film-v3/raw/shot-02-discovery.mp4`
- Create: `.superpowers/sdd/opening-v3-shot-02-review.md`
- Modify: manifest and V3 tests

**Interfaces:**
- Consumes: accepted Shot 1 job id from the manifest as `video_references`.
- Produces: stable eight-second green-screen laptop plate and accepted Shot 2 job id.

- [ ] **Step 1: Add a failing test**

Append:

```js
test('records an accepted eight-second discovery plate', () => {
  const manifest = JSON.parse(read('assets/cinematic/mote-ops-opening-v3-manifest.json'));
  const shot = manifest.generation.shots.find(({ id }) => id === 'discovery');
  assert.equal(shot.status, 'accepted');
  assert.equal(shot.durationSeconds, 8);
  assert.equal(shot.credits, 72);
  assert.match(shot.jobId, /^[0-9a-f-]{36}$/);
  assert.equal(shot.review, '.superpowers/sdd/opening-v3-shot-02-review.md');
  assert.deepEqual(shot.performanceTiming, {
    noticeHoldSeconds: 2,
    readHoldSeconds: 3,
    cursorSeconds: 2,
    clickSeconds: 1
  });
});
```

- [ ] **Step 2: Verify RED and remaining cap**

Run:

```bash
node --test --test-name-pattern="accepted eight-second discovery" tests/opening-film-v3.test.mjs
```

Expected: FAIL because discovery is `not-generated`. Read the manifest and confirm `creditsSpent + 72 <= approvedCreditCap`.

- [ ] **Step 3: Generate**

Read the accepted Shot 1 job UUID from `generation.shots[id=chaos].jobId`. Use the exact discovery prompt and params with `model: "seedance_2_0"`. Construct `medias` as a one-item array whose item has role `video_references` and value equal to that actual UUID. Generate one result with `generate_audio: false`.

- [ ] **Step 4: Review**

Create a two-frames-per-second contact sheet and full-resolution stills at 0.0, 1.5, 2.0, 5.0, 6.0, 7.0, and 7.9 seconds. Confirm the actor visibly notices and reads before the mouse move, the camera does not rush, the chroma surface stays inside the bezel, all four corners remain measurable, and the shirt/tattoos remain correct.

- [ ] **Step 5: Record accepted result or one-variable rejection**

If accepted, write `.superpowers/sdd/opening-v3-shot-02-review.md` with job id, 72-credit cost, dimensions, duration, SHA-256, inspected times, identity verdict, wardrobe verdict, tattoo verdict, laptop-corner verdict, and timing verdict. Set:

```json
{
  "status": "accepted",
  "jobId": "actual completed generation UUID",
  "credits": 72,
  "review": ".superpowers/sdd/opening-v3-shot-02-review.md",
  "performanceTiming": {
    "noticeHoldSeconds": 2,
    "readHoldSeconds": 3,
    "cursorSeconds": 2,
    "clickSeconds": 1
  }
}
```

Append the attempt record and increment `creditsSpent` by 72. If rejected, append the rejected job, 72 credits, exact defect, and one changed prompt variable before preflighting a retry. Verify the retry remains within 675.

- [ ] **Step 6: Run tests and commit**

```bash
node --test --test-name-pattern="accepted eight-second discovery" tests/opening-film-v3.test.mjs
npm test
git add assets/cinematic/mote-ops-opening-v3-manifest.json \
  .superpowers/sdd/opening-v3-shot-02-review.md tests/opening-film-v3.test.mjs
git commit -m "feat: accept opening V3 discovery shot"
```

---

### Task 6: Generate and accept Shot 3, Onboarding

**Files:**
- Create local: `production/opening-film-v3/raw/shot-03-onboarding.mp4`
- Create: `.superpowers/sdd/opening-v3-shot-03-review.md`
- Modify: manifest and V3 tests

**Interfaces:**
- Consumes: accepted Shot 2 job id as continuity `video_references`.
- Produces: five-second stable green-screen plate with three separated mouse selections.

- [ ] **Step 1: Add RED acceptance contract**

Append:

```js
test('records an accepted five-second onboarding plate', () => {
  const manifest = JSON.parse(read('assets/cinematic/mote-ops-opening-v3-manifest.json'));
  const shot = manifest.generation.shots.find(({ id }) => id === 'onboarding');
  assert.equal(shot.status, 'accepted');
  assert.equal(shot.durationSeconds, 5);
  assert.equal(shot.credits, 45);
  assert.match(shot.jobId, /^[0-9a-f-]{36}$/);
  assert.equal(shot.review, '.superpowers/sdd/opening-v3-shot-03-review.md');
  assert.deepEqual(shot.clickWindowsSeconds, [1.5, 3.1, 4.5]);
});
```

Run the focused test and expect FAIL because onboarding is `not-generated`.

- [ ] **Step 2: Generate only within cap**

Confirm `creditsSpent + 45 <= approvedCreditCap`. Read the accepted discovery job UUID from the manifest and pass that actual value with role `video_references`. Generate the exact onboarding prompt and params once, with no audio.

- [ ] **Step 3: Review**

Inspect every half-second and full-resolution frames around each mouse motion. Confirm the laptop corners are stable and Mike's hand does not cross the screen surface.

- [ ] **Step 4: Record accepted result or rejection**

Write `.superpowers/sdd/opening-v3-shot-03-review.md` with job id, 45-credit cost, media metadata/hash, every inspected frame, identity/wardrobe/tattoo verdicts, three mouse-action windows, and laptop-corner verdict. For acceptance, set status, UUID, credits, review path, and `clickWindowsSeconds: [1.5, 3.1, 4.5]`; append the attempt and add 45 to `creditsSpent`. For rejection, record the exact defect and one changed prompt variable before any retry, then prove the retry remains within 675.

- [ ] **Step 5: Run tests and commit**

```bash
node --test --test-name-pattern="accepted five-second onboarding" tests/opening-film-v3.test.mjs
npm test
git add assets/cinematic/mote-ops-opening-v3-manifest.json \
  .superpowers/sdd/opening-v3-shot-03-review.md tests/opening-film-v3.test.mjs
git commit -m "feat: accept opening V3 onboarding shot"
```

---

### Task 7: Generate and accept Shot 4, Inbox and Calendar

**Files:**
- Create local: `production/opening-film-v3/raw/shot-04-inbox-calendar.mp4`
- Create: `.superpowers/sdd/opening-v3-shot-04-review.md`
- Modify: manifest and V3 tests

**Interfaces:**
- Consumes: accepted Shot 3 as continuity reference.
- Produces: eight-second stable green-screen plate with review actions near 3.5 and 7 seconds.

- [ ] **Step 1: Add RED acceptance contract**

Append:

```js
test('records an accepted inbox and calendar review plate', () => {
  const manifest = JSON.parse(read('assets/cinematic/mote-ops-opening-v3-manifest.json'));
  const shot = manifest.generation.shots.find(({ id }) => id === 'inbox-calendar');
  assert.equal(shot.status, 'accepted');
  assert.equal(shot.durationSeconds, 8);
  assert.equal(shot.credits, 72);
  assert.match(shot.jobId, /^[0-9a-f-]{36}$/);
  assert.equal(shot.review, '.superpowers/sdd/opening-v3-shot-04-review.md');
  assert.deepEqual(shot.clickWindowsSeconds, [3.5, 7.0]);
});
```

Run the focused test and expect FAIL.

- [ ] **Step 2: Generate within cap**

Confirm `creditsSpent + 72 <= approvedCreditCap`. Read the accepted onboarding UUID from the manifest and pass that actual value as `video_references`. Generate the exact inbox-calendar prompt and params once, with no audio.

- [ ] **Step 3: Review**

Inspect all half-second frames plus 3.25, 3.5, 3.75, 6.75, 7.0, and 7.25 seconds. Confirm both clicks are physically plausible and Mike's gaze matches screen changes.

- [ ] **Step 4: Record accepted result or rejection**

Write `.superpowers/sdd/opening-v3-shot-04-review.md` with job/cost, metadata/hash, all inspected frames, continuity verdicts, screen geometry, gaze timing, and both clicks. For acceptance, set status, UUID, 72 credits, review path, and `clickWindowsSeconds: [3.5, 7.0]`; append the attempt and add 72 to `creditsSpent`. For rejection, record one defect and one changed variable before any within-cap retry.

- [ ] **Step 5: Run tests and commit**

```bash
node --test --test-name-pattern="accepted inbox and calendar" tests/opening-film-v3.test.mjs
npm test
git add assets/cinematic/mote-ops-opening-v3-manifest.json \
  .superpowers/sdd/opening-v3-shot-04-review.md tests/opening-film-v3.test.mjs
git commit -m "feat: accept opening V3 inbox calendar shot"
```

---

### Task 8: Generate and accept Shot 5, Calls and Financial Review

**Files:**
- Create local: `production/opening-film-v3/raw/shot-05-calls-finance.mp4`
- Create: `.superpowers/sdd/opening-v3-shot-05-review.md`
- Modify: manifest and V3 tests

**Interfaces:**
- Consumes: accepted Shot 4 as continuity reference.
- Produces: eight-second stable green-screen plate with two approvals and no implied financial action.

- [ ] **Step 1: Add RED acceptance contract**

Append:

```js
test('records an accepted calls and financial review plate', () => {
  const manifest = JSON.parse(read('assets/cinematic/mote-ops-opening-v3-manifest.json'));
  const shot = manifest.generation.shots.find(({ id }) => id === 'calls-finance');
  assert.equal(shot.status, 'accepted');
  assert.equal(shot.durationSeconds, 8);
  assert.equal(shot.credits, 72);
  assert.match(shot.jobId, /^[0-9a-f-]{36}$/);
  assert.equal(shot.review, '.superpowers/sdd/opening-v3-shot-05-review.md');
  assert.deepEqual(shot.clickWindowsSeconds, [3.5, 7.0]);
  assert.equal(shot.financialAction, 'review-only');
});
```

Run the focused test and expect FAIL.

- [ ] **Step 2: Generate within cap**

Confirm `creditsSpent + 72 <= approvedCreditCap`. Read the accepted inbox-calendar UUID from the manifest and pass that actual UUID as `video_references`. Generate the exact calls-finance prompt and params once, with no audio.

- [ ] **Step 3: Review**

Inspect every half-second plus 3.25, 3.5, 3.75, 6.75, 7.0, and 7.25 seconds. Confirm both clicks are physically plausible and Mike's gaze matches the future screen changes. Reject any payment gesture, banking interface, autonomous outcome, changing wardrobe, tattoo bleed, altered employees, or altered office.

- [ ] **Step 4: Record accepted result or rejection**

Write `.superpowers/sdd/opening-v3-shot-05-review.md` with job/cost, metadata/hash, every inspected frame, continuity verdicts, two click windows, and explicit `financialAction: review-only`. For acceptance, set status, UUID, 72 credits, review path, click windows, and financial action; append the attempt and add 72 to `creditsSpent`. For rejection, record one defect and one changed variable before any within-cap retry.

- [ ] **Step 5: Run tests and commit**

```bash
node --test --test-name-pattern="accepted calls and financial" tests/opening-film-v3.test.mjs
npm test
git add assets/cinematic/mote-ops-opening-v3-manifest.json \
  .superpowers/sdd/opening-v3-shot-05-review.md tests/opening-film-v3.test.mjs
git commit -m "feat: accept opening V3 calls finance shot"
```

---

### Task 9: Generate and accept Shot 6, Control Restored

**Files:**
- Create local: `production/opening-film-v3/raw/shot-06-control-restored.mp4`
- Create: `.superpowers/sdd/opening-v3-shot-06-review.md`
- Modify: manifest and V3 tests

**Interfaces:**
- Consumes: accepted Shot 5 as continuity reference.
- Produces: seven-second same-office dashboard hold, laptop close, stand, and exit.

- [ ] **Step 1: Add RED acceptance contract**

Append:

```js
test('records an accepted same-office control plate', () => {
  const manifest = JSON.parse(read('assets/cinematic/mote-ops-opening-v3-manifest.json'));
  const shot = manifest.generation.shots.find(({ id }) => id === 'control-restored');
  assert.equal(shot.status, 'accepted');
  assert.equal(shot.durationSeconds, 7);
  assert.equal(shot.credits, 63);
  assert.match(shot.jobId, /^[0-9a-f-]{36}$/);
  assert.equal(shot.review, '.superpowers/sdd/opening-v3-shot-06-review.md');
  assert.equal(shot.sameOffice, true);
  assert.equal(shot.sameEmployees, true);
  assert.equal(shot.screenHoldSeconds, 2);
});
```

Run the focused test and expect FAIL.

- [ ] **Step 2: Generate within cap**

Confirm `creditsSpent + 63 <= approvedCreditCap`. Read the accepted calls-finance UUID from the manifest and pass that actual UUID as `video_references`. Generate the exact control-restored prompt and params once, with no audio.

- [ ] **Step 3: Review**

Inspect every half-second plus each frame during the laptop close and standing motion. Compare a Shot 1 wide frame with the Shot 6 wide frame. Desk, shelves, windows, employees, and camera side must match. Reject a new room even if attractive.

- [ ] **Step 4: Record accepted result or rejection**

Write `.superpowers/sdd/opening-v3-shot-06-review.md` with job/cost, metadata/hash, every inspected frame, paired Shot 1 and Shot 6 comparison frames, same-room findings, same-employee findings, laptop-close findings, and exit findings. For acceptance, set status, UUID, 63 credits, review path, `sameOffice: true`, `sameEmployees: true`, and `screenHoldSeconds: 2`; append the attempt and add 63 to `creditsSpent`. For rejection, record one defect and one changed variable before any within-cap retry.

- [ ] **Step 5: Run tests and commit**

```bash
node --test --test-name-pattern="accepted same-office control" tests/opening-film-v3.test.mjs
npm test
git add assets/cinematic/mote-ops-opening-v3-manifest.json \
  .superpowers/sdd/opening-v3-shot-06-review.md tests/opening-film-v3.test.mjs
git commit -m "feat: accept opening V3 control shot"
```

---

### Task 10: Generate and accept Shot 7, Beach Payoff

**Files:**
- Create local: `production/opening-film-v3/raw/shot-07-beach-payoff.mp4`
- Create: `.superpowers/sdd/opening-v3-shot-07-review.md`
- Modify: manifest and V3 tests

**Interfaces:**
- Consumes: existing accepted beach job as `video_references`, not the office clip.
- Produces: eight-second beach plate with three-second trackable phone hold and clean left negative space.

- [ ] **Step 1: Add RED acceptance contract**

Append:

```js
test('records an accepted beach payoff with stable tattoos and phone', () => {
  const manifest = JSON.parse(read('assets/cinematic/mote-ops-opening-v3-manifest.json'));
  const shot = manifest.generation.shots.find(({ id }) => id === 'beach-payoff');
  assert.equal(shot.status, 'accepted');
  assert.equal(shot.durationSeconds, 8);
  assert.equal(shot.credits, 72);
  assert.match(shot.jobId, /^[0-9a-f-]{36}$/);
  assert.equal(shot.review, '.superpowers/sdd/opening-v3-shot-07-review.md');
  assert.equal(shot.phoneHoldSeconds, 3);
  assert.equal(shot.whiteShortSleeveShirt, true);
  assert.equal(shot.tattoosMatchReferences, true);
});
```

Run the focused test and expect FAIL.

- [ ] **Step 2: Generate within cap**

Confirm `creditsSpent + 72 <= approvedCreditCap`. Generate the exact beach prompt and params once with `edb3bca7-2cb7-4cae-b1dc-1bcc71ecea1d` as `video_references` and no audio.

- [ ] **Step 3: Review**

Inspect every half-second and every frame containing the phone or visible tattoo edges. Confirm Mike's identity matches office shots, tattoo placement is stable, the phone screen remains measurable, the beach is understated, and left-side copy space stays clean.

- [ ] **Step 4: Record accepted result or rejection**

Write `.superpowers/sdd/opening-v3-shot-07-review.md` with job/cost, metadata/hash, every inspected frame, identity comparison, shirt verdict, tattoo-reference comparison, phone-corner verdict, and negative-space verdict. For acceptance, set status, UUID, 72 credits, review path, `phoneHoldSeconds: 3`, `whiteShortSleeveShirt: true`, and `tattoosMatchReferences: true`; append the attempt and add 72 to `creditsSpent`. For rejection, record one defect and one changed variable before any within-cap retry.

- [ ] **Step 5: Close generation ledger and commit**

When accepted, set manifest status to `ready-for-post`. Assert `creditsSpent <= 675` and every shot is accepted. Run:

```bash
node --test --test-name-pattern="accepted beach payoff" tests/opening-film-v3.test.mjs
npm test
git add assets/cinematic/mote-ops-opening-v3-manifest.json \
  .superpowers/sdd/opening-v3-shot-07-review.md tests/opening-film-v3.test.mjs
git commit -m "feat: accept opening V3 beach shot"
```

---

### Task 11: Animate and perspective-track every real interface

**Files:**
- Create: `production/opening-film-v3/build-screen-sequences.sh`
- Create: `production/opening-film-v3/composite-devices.sh`
- Create: `production/opening-film-v3/tracks/shot-02.ffscript`
- Create: `production/opening-film-v3/tracks/shot-03.ffscript`
- Create: `production/opening-film-v3/tracks/shot-04.ffscript`
- Create: `production/opening-film-v3/tracks/shot-05.ffscript`
- Create: `production/opening-film-v3/tracks/shot-06.ffscript`
- Create: `production/opening-film-v3/tracks/shot-07-phone.ffscript`
- Modify: `tests/opening-film-v3.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: accepted raw shots and captured PNG plates.
- Produces: exact-duration `rendered/composite-02.mp4` through `composite-07.mp4`.

- [ ] **Step 1: Add RED tracking contracts**

Require:

```js
test('animates V3 cursor states and four-corner device composites', () => {
  const screens = read('production/opening-film-v3/build-screen-sequences.sh');
  const composite = read('production/opening-film-v3/composite-devices.sh');
  for (const name of ['discovery', 'onboarding', 'inbox-calendar', 'calls-finance', 'dashboard-zero', 'phone-zero']) {
    assert.match(screens, new RegExp(`${name}\\.mp4`));
  }
  assert.match(screens, /overlay=x=/);
  assert.match(screens, /invitation-clicked\.png/);
  assert.match(screens, /inbox-approved\.png/);
  assert.match(screens, /calendar-approved\.png/);
  assert.match(screens, /calls-approved\.png/);
  assert.match(screens, /finance-approved\.png/);
  assert.match(composite, /chromakey=0x008a50:0\.12:0\.03/);
  assert.match(composite, /perspective=/);
  assert.match(composite, /sense=destination/);
  assert.doesNotMatch(composite, /rotate=/);
  for (const id of ['02', '03', '04', '05', '06', '07-phone']) {
    const track = read(`production/opening-film-v3/tracks/shot-${id}.ffscript`);
    assert.match(track, /# 0\.00/);
    assert.match(track, /perspective@screen/);
  }
});
```

- [ ] **Step 2: Measure device corners**

Extract accepted shots at 4 frames per second:

```bash
for n in 02 03 04 05 06 07; do
  ffmpeg -hide_banner -loglevel error \
    -i "production/opening-film-v3/raw/shot-${n}-"*.mp4 \
    -vf fps=4 "production/opening-film-v3/rendered/track-${n}-%04d.png"
done
```

For every frame, record top-left, top-right, bottom-left, and bottom-right coordinates. Write one `perspective@screen` command per sampled time. Interpolate only between adjacent measured samples. Never reuse coordinates from another shot.

- [ ] **Step 3: Build exact screen sequences**

Use FFmpeg looped PNG inputs and cursor overlays. Timing:

```text
discovery: invitation 0.0–7.0, cursor move 5.0–7.0, clicked 7.0–8.0
onboarding: tools 0.0–1.7, work 1.7–3.4, approval 3.4–5.0
inbox-calendar: inbox 0.0–3.5, inbox-approved 3.5–4.0, calendar 4.0–7.0, calendar-approved 7.0–8.0
calls-finance: calls 0.0–3.5, calls-approved 3.5–4.0, finance 4.0–7.0, finance-approved 7.0–8.0
dashboard-zero: dashboard-zero 0.0–2.0
phone-zero: phone-zero 0.0–3.0
```

Use one local SVG cursor rendered to PNG. Animate with FFmpeg `overlay=x='start+(end-start)*progress':y='...'` expressions. Add a restrained click ring for 0.20 seconds at each click. Do not animate application cards, counters, or decorative particles.

- [ ] **Step 4: Composite into physical devices**

For each shot:

1. key only the matte green region;
2. run the interface sequence through `perspective@screen` using the shot's measured track;
3. add `gblur=sigma=.35`, `eq=brightness=-.03:contrast=.96`, and a 6 percent white reflection layer;
4. overlay the treated interface under the original device bezel;
5. preserve 24fps, 1920×1080, and exact source duration.

- [ ] **Step 5: Frame-review composites**

Create contact sheets at 4 fps. Inspect full resolution at every click and every device corner movement. Reject spill outside the bezel, sliding, flat rotation, cursor mismatch, clipped text, and any plate that visually blends into the webpage rather than the filmed device.

- [ ] **Step 6: Run tests and commit**

```bash
node --test --test-name-pattern="four-corner device" tests/opening-film-v3.test.mjs
npm test
git add production/opening-film-v3/build-screen-sequences.sh \
  production/opening-film-v3/composite-devices.sh \
  production/opening-film-v3/tracks \
  tests/opening-film-v3.test.mjs package.json
git commit -m "feat: track opening V3 device interfaces"
```

---

### Task 12: Assemble and verify the 50-second responsive masters

**Files:**
- Create: `production/opening-film-v3/build-opening-film-v3.sh`
- Create: `production/opening-film-v3/update-manifest.mjs`
- Create: `assets/cinematic/mote-ops-opening-v3-1080.mp4`
- Create: `assets/cinematic/mote-ops-opening-v3-720.mp4`
- Create: `assets/cinematic/mote-ops-opening-v3-poster.webp`
- Modify: manifest and V3 tests

**Interfaces:**
- Consumes: Shot 1 raw plate, Shots 2–7 accepted composites, opening and closing overlays.
- Produces: verified exact media files and hashes.

- [ ] **Step 1: Add RED final media contract**

Require exact filenames, duration 50, 24fps, H.264, 1920×1080 and 1280×720 dimensions, no audio streams, `moov` before `mdat`, non-null manifest output metadata, and the ordered seven-shot concatenation.

- [ ] **Step 2: Implement assembly**

`build-opening-film-v3.sh` must:

1. capture interfaces;
2. build screen sequences;
3. composite devices;
4. normalize every input to 1920×1080, 24fps, square pixels, yuv420p;
5. overlay `opening-copy.png` only from 0.5 to 5.5 seconds on Shot 1;
6. concatenate durations 6, 8, 5, 8, 8, 7, and 8;
7. overlay `closing-copy.png` from global 45.0 through 50.0 seconds;
8. encode silent H.264 CRF 18 with `+faststart`;
9. scale the 720p derivative with Lanczos and encode CRF 20;
10. create the poster from a clean Shot 1 frame without copy;
11. call `update-manifest.mjs`.

The exact concat filter is:

```text
[v1][v2][v3][v4][v5][v6][v7]concat=n=7:v=1:a=0,settb=1/24
```

- [ ] **Step 3: Implement metadata update**

For each output, record:

```json
{
  "path": "...",
  "codec": "H.264",
  "width": 1920,
  "height": 1080,
  "frameRate": 24,
  "durationSeconds": 50,
  "sizeBytes": 0,
  "sha256": "",
  "audio": false,
  "faststart": true
}
```

Use `ffprobe`, `stat`, and Node `createHash`. Preserve all generation attempts and costs. Set manifest status to `media-verified` only after every contract passes.

- [ ] **Step 4: Build and inspect**

Run:

```bash
bash production/opening-film-v3/build-opening-film-v3.sh
ffprobe -v error -show_streams -show_format \
  assets/cinematic/mote-ops-opening-v3-1080.mp4
ffmpeg -hide_banner -loglevel error \
  -i assets/cinematic/mote-ops-opening-v3-1080.mp4 \
  -vf "fps=2,scale=480:-1,tile=5x5:padding=6:margin=6:color=F5F1E8" \
  -frames:v 1 production/opening-film-v3/rendered/final-contact-sheet.jpg
```

Review every half-second, all seven cuts, all cursor clicks, office before/after continuity, phone notification, closing copy, and CTA.

- [ ] **Step 5: Run tests and commit**

```bash
node --test tests/opening-film-v3.test.mjs
npm test
npm run build
git diff --check
git add production/opening-film-v3/build-opening-film-v3.sh \
  production/opening-film-v3/update-manifest.mjs \
  assets/cinematic/mote-ops-opening-v3-manifest.json \
  assets/cinematic/mote-ops-opening-v3-1080.mp4 \
  assets/cinematic/mote-ops-opening-v3-720.mp4 \
  assets/cinematic/mote-ops-opening-v3-poster.webp \
  tests/opening-film-v3.test.mjs
git commit -m "feat: assemble opening film V3"
```

---

### Task 13: Integrate, verify, and deploy a protected review

**Files:**
- Modify: `index.html`
- Modify: V3 tests
- Create: `.superpowers/sdd/opening-v3-final-review.md`

**Interfaces:**
- Consumes: verified V3 media.
- Produces: protected review URL only.
- Does not modify production or `moteops.tech`.

- [ ] **Step 1: Add RED homepage V3 contract**

Require:

```js
test('loads only the verified V3 opening media in the review branch', () => {
  const html = read('index.html');
  assert.match(html, /mote-ops-opening-v3-1080\.mp4/);
  assert.match(html, /mote-ops-opening-v3-720\.mp4/);
  assert.match(html, /mote-ops-opening-v3-poster\.webp/);
  assert.doesNotMatch(html, /mote-ops-opening-1080\.mp4/);
  assert.match(html, /data-cinematic-film data-play-once/);
  assert.doesNotMatch(html, /\sloop(?:\s|>)/);
});
```

- [ ] **Step 2: Update only the three media references**

In `index.html`, replace the current poster, 1080 source, and 720 source with V3 filenames. Do not alter hero copy, CTA behavior, owner story, Care Hub, or cinematic studies.

- [ ] **Step 3: Run local desktop and phone browser verification**

Start a local static server. With agent-browser verify:

```text
1440×1000:
- V3 1080 source selected
- duration exactly 50
- video advances with Motion On
- pauses with Motion Off
- replay appears after completion and works
- no caption gap
- no horizontal overflow
- no error overlay or console error

390×844:
- V3 720 source selected
- readable invitation, reviews, phone, closing copy, and CTA
- no clipping or overflow
- Motion Off/On and replay work
```

Capture desktop and phone screenshots and record the exact evaluations in `.superpowers/sdd/opening-v3-final-review.md`.

- [ ] **Step 4: Run full local release verification**

```bash
npm test
npm run build
git diff --check
sha256sum assets/cinematic/mote-ops-opening-v3-1080.mp4 \
  assets/cinematic/mote-ops-opening-v3-720.mp4 \
  assets/cinematic/mote-ops-opening-v3-poster.webp
```

- [ ] **Step 5: Commit the review candidate**

```bash
git add index.html tests/opening-film-v3.test.mjs \
  .superpowers/sdd/opening-v3-final-review.md
git commit -m "test: verify opening film V3 candidate"
```

- [ ] **Step 6: Deploy protected preview**

Deploy the exact committed branch source to the existing protected Vercel review project. Do not use `--prod`, do not alias `moteops.tech`, and do not change access settings.

Verify:

- deployment status READY;
- HTML and all three V3 media assets return 200;
- 1080 MP4 byte ranges return 206;
- remote hashes match local;
- production-source routes return 404;
- protected desktop and phone browser checks reproduce local results.

- [ ] **Step 7: Stop for Mike's production decision**

Send the protected review link, state that V3 is ready for review, report the integer in `generation.creditsSpent` as the exact number of credits spent out of the 675 maximum, and state that production is still unchanged.

Do not merge, push main, promote, alias, or publish until Mike explicitly approves this exact protected review.
