# Review package: 9fe2f3c..ed264eb

## Commits
ed264eb test: reject opening V3 chaos mutation

## Files changed
 .superpowers/sdd/opening-v3-shot-01-review.md      | 78 ++++++++++++++++++++++
 assets/cinematic/mote-ops-opening-v3-manifest.json | 34 +++++++++-
 tests/opening-film-v3.test.mjs                     | 36 ++++++++--
 3 files changed, 138 insertions(+), 10 deletions(-)

## Diff
diff --git a/.superpowers/sdd/opening-v3-shot-01-review.md b/.superpowers/sdd/opening-v3-shot-01-review.md
new file mode 100644
index 0000000..0f55c85
--- /dev/null
+++ b/.superpowers/sdd/opening-v3-shot-01-review.md
@@ -0,0 +1,78 @@
+# Opening Film V3, Shot 1 Chaos Review
+
+## Decision
+
+Rejected. Do not use this generation as a continuity reference and do not
+generate a retry without a new task.
+
+## Submission
+
+- Shot: `chaos`
+- Job: `910e5f0f-5f73-4b2d-97f9-7bf6eefae091`
+- Model: Seedance 2.0
+- Cost: 54 credits
+- Attempts submitted: 1
+- Account balance before: 2,373.36 credits
+- Account balance after: 2,319.36 credits
+- Source reference: accepted office job
+  `879db0a2-91d0-4276-ad5d-169a5606b303`
+- Output: H.264, 1920 by 1080, 24 fps, 145 frames, 6.041667 seconds
+- File size: 7,855,696 bytes
+- SHA-256:
+  `15fc8565dd11792d0b99e2c6152bbd52be4f533bd9b2e5327e88bc233fce59f7`
+- Local source:
+  `production/opening-film-v3/raw/shot-01-chaos.mp4`
+
+The submission used the locked prompt and parameters, one result, no audio,
+and the declined unrelated preset override. No second generation was
+submitted.
+
+## Review coverage
+
+The 12 half-second samples at 0.0 through 5.5 seconds were inspected in the
+contact sheet. All 145 source frames were also extracted and inspected in
+six consecutive 24-frame sheets plus frame 145. This covered every visible
+hand, corded phone, smartphone, keyboard, laptop, desk prop, and employee
+movement.
+
+## Findings
+
+### Disqualifying continuity defect
+
+From roughly 1.3 through 1.7 seconds, Mike reaches toward the black smartphone
+on the desk. The black smartphone visibly becomes a loose white paper as it
+is lifted. The object change is visible across consecutive frames, not just
+motion blur. Mike then repeatedly handles loose papers until roughly 3.2
+seconds. This directly fails the locked constraints that paper stacks remain
+untouched, Mike never handles loose paper, and no object may transform,
+duplicate, or disappear.
+
+### Other failed constraints
+
+- One background employee is visible throughout, not the required two.
+- Mike does not perform a distinct movement with a visible mouse.
+- The papers and notebook nearest Mike move repeatedly instead of remaining
+  stable.
+
+### Constraints that passed
+
+- Mike's face, beard, hair, glasses, and apparent age remain stable.
+- The charcoal long-sleeve button-down remains consistent.
+- Both forearms stay covered and no tattoo texture visibly bleeds through.
+- The office geometry, shelving, cabinets, and visible employee remain
+  broadly stable.
+- No readable generated text, floating label, hologram, neon effect, or
+  manufacturer-style logo appears.
+- No clear anatomical hand duplication or malformed finger is visible.
+- Camera movement remains restrained.
+
+## One-variable retry note
+
+Change actor hand blocking only:
+
+> Mike's right hand remains planted on one visible mouse for the entire shot;
+> every phone, book, folder, and loose paper stays outside his reach.
+
+Identity, wardrobe, office, lighting, employee arrangement, duration, camera,
+and every other prompt variable remain unchanged. This note records a
+possible future correction only. No retry was submitted.
diff --git a/assets/cinematic/mote-ops-opening-v3-manifest.json b/assets/cinematic/mote-ops-opening-v3-manifest.json
index 6f64426..4e57c4a 100644
--- a/assets/cinematic/mote-ops-opening-v3-manifest.json
+++ b/assets/cinematic/mote-ops-opening-v3-manifest.json
@@ -1,28 +1,56 @@
 {
   "schema": "mote-ops-opening/v3",
-  "status": "awaiting-generation",
+  "status": "shot-01-rejected",
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
     "approvedCreditCap": 675,
-    "creditsSpent": 0,
+    "creditsSpent": 54,
     "shots": [
-      { "id": "chaos", "durationSeconds": 6, "preflightCredits": 54, "status": "not-generated", "jobId": null, "credits": null, "attempts": [] },
+      {
+        "id": "chaos",
+        "durationSeconds": 6,
+        "preflightCredits": 54,
+        "status": "rejected",
+        "jobId": "910e5f0f-5f73-4b2d-97f9-7bf6eefae091",
+        "credits": 54,
+        "review": ".superpowers/sdd/opening-v3-shot-01-review.md",
+        "attempts": [
+          {
+            "jobId": "910e5f0f-5f73-4b2d-97f9-7bf6eefae091",
+            "credits": 54,
+            "outcome": "rejected during frame review",
+            "reason": "From about 1.3 to 1.7 seconds, the black smartphone under Mike's reaching hand visibly becomes a loose white paper as he lifts it. Mike then repeatedly handles loose papers through about 3.2 seconds, despite the locked-prop and no-paper-handling constraints. Only one background employee is present instead of the required two, and no distinct mouse movement occurs.",
+            "changedPromptVariable": "Actor hand blocking only: Mike's right hand remains planted on one visible mouse for the entire shot; every phone, book, folder, and loose paper stays outside his reach.",
+            "source": {
+              "path": "production/opening-film-v3/raw/shot-01-chaos.mp4",
+              "codec": "H.264",
+              "width": 1920,
+              "height": 1080,
+              "frameRate": 24,
+              "frameCount": 145,
+              "durationSeconds": 6.041667,
+              "sizeBytes": 7855696,
+              "sha256": "15fc8565dd11792d0b99e2c6152bbd52be4f533bd9b2e5327e88bc233fce59f7"
+            }
+          }
+        ]
+      },
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
diff --git a/tests/opening-film-v3.test.mjs b/tests/opening-film-v3.test.mjs
index 53cd4a7..f3fe336 100644
--- a/tests/opening-film-v3.test.mjs
+++ b/tests/opening-film-v3.test.mjs
@@ -10,48 +10,70 @@ test('declares the exact seven-shot silent V3 generation contract', () => {
   const manifest = JSON.parse(read('assets/cinematic/mote-ops-opening-v3-manifest.json'));
   assert.equal(manifest.schema, 'mote-ops-opening/v3');
   assert.equal(manifest.durationSeconds, 50);
   assert.equal(manifest.audio, false);
   assert.equal(manifest.generation.model, 'Seedance 2.0');
   assert.equal(manifest.generation.mode, 'std');
   assert.equal(manifest.generation.resolution, '1080p');
   assert.equal(manifest.generation.firstPassCredits, 450);
   assert.equal(manifest.generation.provisionalCap, 675);
   assert.equal(manifest.generation.approvedCreditCap, 675);
-  assert.equal(manifest.generation.creditsSpent, 0);
+  assert.equal(manifest.generation.creditsSpent, 54);
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
-  for (const shot of manifest.generation.shots) {
-    assert.equal(shot.status, 'not-generated');
-    assert.equal(shot.jobId, null);
-    assert.equal(shot.credits, null);
-  }
+  assert.deepEqual(
+    manifest.generation.shots.map(({ id, status }) => ({ id, status })),
+    [
+      { id: 'chaos', status: 'rejected' },
+      { id: 'discovery', status: 'not-generated' },
+      { id: 'onboarding', status: 'not-generated' },
+      { id: 'inbox-calendar', status: 'not-generated' },
+      { id: 'calls-finance', status: 'not-generated' },
+      { id: 'control-restored', status: 'not-generated' },
+      { id: 'beach-payoff', status: 'not-generated' },
+    ]
+  );
 });

 test('does not allow V3 generation without exact approved authority', () => {
   const manifest = JSON.parse(read('assets/cinematic/mote-ops-opening-v3-manifest.json'));
   assert.equal(manifest.generation.firstPassCredits, 450);
   assert.equal(manifest.generation.approvedCreditCap, 675);
   assert.ok(manifest.generation.approvedCreditCap >= manifest.generation.firstPassCredits);
-  assert.equal(manifest.generation.creditsSpent, 0);
+  assert.equal(manifest.generation.creditsSpent, 54);
+});
+
+test('records one rejected chaos attempt without silently retrying', () => {
+  const manifest = JSON.parse(read('assets/cinematic/mote-ops-opening-v3-manifest.json'));
+  const shot = manifest.generation.shots.find(({ id }) => id === 'chaos');
+  assert.equal(shot.status, 'rejected');
+  assert.equal(shot.jobId, '910e5f0f-5f73-4b2d-97f9-7bf6eefae091');
+  assert.equal(shot.credits, 54);
+  assert.equal(shot.attempts.length, 1);
+  assert.equal(shot.attempts[0].outcome, 'rejected during frame review');
+  assert.match(shot.attempts[0].reason, /smartphone.*loose white paper/i);
+  assert.match(shot.attempts[0].changedPromptVariable, /hand blocking only/i);
+  assert.ok(shot.review.endsWith('opening-v3-shot-01-review.md'));
+  assert.equal(manifest.generation.creditsSpent, 54);
+  assert.ok(manifest.generation.creditsSpent <= manifest.generation.approvedCreditCap);
 });

 test('defines prompts that lock Mike, office wardrobe, props, and blank screens', () => {
   const prompts = JSON.parse(read('production/opening-film-v3/generation-prompts.json'));
   assert.equal(prompts.referenceElement.id, '089862a9-bb77-4b46-88dd-14629f777d5c');
   assert.equal(prompts.references.officeJobId, '879db0a2-91d0-4276-ad5d-169a5606b303');
   assert.equal(prompts.references.beachJobId, 'edb3bca7-2cb7-4cae-b1dc-1bcc71ecea1d');
   assert.deepEqual(Object.keys(prompts.shots), [
     'chaos',
     'discovery',
