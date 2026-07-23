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
