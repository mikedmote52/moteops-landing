# Review package: 0c697b5..0451583

## Commits
0451583 test: record rejected chaos retry

## Files changed
 .superpowers/sdd/opening-v3-shot-01-review.md      | 95 ++++++++++++++++++----
 .superpowers/sdd/task-4-retry-report.md            | 80 ++++++++++++++++++
 assets/cinematic/mote-ops-opening-v3-manifest.json | 24 +++++-
 tests/opening-film-v3.test.mjs                     | 33 ++++++--
 4 files changed, 207 insertions(+), 25 deletions(-)

## Diff
diff --git a/.superpowers/sdd/opening-v3-shot-01-review.md b/.superpowers/sdd/opening-v3-shot-01-review.md
index 93e96f5..00f62c3 100644
--- a/.superpowers/sdd/opening-v3-shot-01-review.md
+++ b/.superpowers/sdd/opening-v3-shot-01-review.md
@@ -1,46 +1,76 @@
 # Opening Film V3, Shot 1 Chaos Review

 ## Decision

-Rejected. Do not use this generation as a continuity reference and do not
-generate a retry without a new task.
+Rejected after one controlled retry. Do not use either generation as a
+continuity reference. Do not submit another retry or generate later shots.

-## Submission
+## Attempt 1 submission

 - Shot: `chaos`
 - Job: `910e5f0f-5f73-4b2d-97f9-7bf6eefae091`
 - Model: Seedance 2.0
 - Cost: 54 credits
 - Attempts submitted: 1
 - Account balance before: 2,373.36 credits
 - Account balance after: 2,319.36 credits
 - Source reference: accepted office job
   `879db0a2-91d0-4276-ad5d-169a5606b303`
 - Output: H.264, 1920 by 1080, 24 fps, 145 frames, 6.041667 seconds
 - File size: 7,855,696 bytes
 - SHA-256:
   `15fc8565dd11792d0b99e2c6152bbd52be4f533bd9b2e5327e88bc233fce59f7`
-- Local source:
-  `production/opening-film-v3/raw/shot-01-chaos.mp4`
+- Preserved local source:
+  `production/opening-film-v3/raw/shot-01-chaos-attempt-01-rejected.mp4`

 The submission used the locked prompt and parameters, one result, no audio,
-and the declined unrelated preset override. No second generation was
-submitted.
+and the declined unrelated preset override.
+
+## Attempt 2 controlled retry
+
+- Job: `bc199863-0494-4bca-a76a-32781d65f637`
+- Model: Seedance 2.0
+- Cost: 54 credits
+- Total attempts submitted: 2
+- Total V3 credits spent: 108 of the approved 675-credit cap
+- Account balance before: 2,319.36 credits
+- Account balance after: 2,265.36 credits
+- Source reference: accepted office job
+  `879db0a2-91d0-4276-ad5d-169a5606b303`
+- Declined preset id: `24bae836-2c4a-48e0-89b6-49fcc0b21612`
+- Output: H.264, 1920 by 1080, 24 fps, 145 frames, 6.041667 seconds
+- File size: 6,042,874 bytes
+- SHA-256:
+  `906f0b1dc255584fadbc120cda9e9ed03013fb1cfb585da26e2b14ce43e9dec7`
+- Canonical local source:
+  `production/opening-film-v3/raw/shot-01-chaos.mp4`
+
+The retry used the original exact chaos prompt and parameters, plus only this
+approved actor-hand-blocking sentence:
+
+> Mike’s left hand remains on the corded handset. His right hand moves only
+> between one visible mouse and one keyboard. Every smartphone, book, folder,
+> and loose paper remains fixed outside his hand path.
+
+The no-spend preflight returned exactly 54 credits. The authority check was
+`54 + 54 <= 675`. Exactly one retry result was requested. Generated audio was
+disabled. No further generation was submitted.

 ## Review coverage

-The 12 half-second samples at 0.0 through 5.5 seconds were inspected in the
-contact sheet. All 145 source frames were also extracted and inspected in
-six consecutive 24-frame sheets plus frame 145. This covered every visible
-hand, corded phone, smartphone, keyboard, laptop, desk prop, and employee
-movement.
+For both attempts, the 12 half-second samples at 0.0 through 5.5 seconds were
+inspected in contact sheets. All 145 frames of each source were also extracted
+and inspected in six consecutive 24-frame sheets plus frame 145. The retry
+received four additional close interaction sheets spanning frames 24 through
+83. This covered every visible hand, corded phone, smartphone, book, folder,
+loose paper, keyboard, laptop, desk prop, and employee movement.

 ## Findings

 ### Disqualifying continuity defect

 From roughly 1.3 through 1.7 seconds, Mike reaches toward the black smartphone
 on the desk. The black smartphone visibly becomes a loose white paper as it
 is lifted. The object change is visible across consecutive frames, not just
 motion blur. Mike then repeatedly handles loose papers until roughly 3.2
 seconds. This directly fails the locked constraints that paper stacks remain
@@ -59,19 +89,52 @@ duplicate, or disappear.
 - Mike's face, beard, hair, glasses, and apparent age remain stable.
 - The charcoal long-sleeve button-down remains consistent.
 - Both forearms stay covered and no tattoo texture visibly bleeds through.
 - The office geometry, shelving, cabinets, and visible employee remain
   broadly stable.
 - No readable generated text, floating label, hologram, neon effect, or
   manufacturer-style logo appears.
 - No clear anatomical hand duplication or malformed finger is visible.
 - Camera movement remains restrained.

-## One-variable retry note
+## Controlled retry findings
+
+The retry repeats the same disqualifying behavior despite the exact approved
+hand-path change:
+
+- From about 1.1 seconds, Mike's right hand leaves the book stack and reaches
+  across the desk toward the black smartphone.
+- Across consecutive frames around 1.5 seconds, the black smartphone visibly
+  becomes a loose white paper while Mike lifts it. This is an object mutation,
+  not motion blur.
+- Through about 3.3 seconds, Mike handles the transformed paper, the book
+  stack, a folder, and additional loose papers. These actions violate both the
+  original locked-prop language and the only added retry sentence.
+- Only one background employee appears, not the required two.
+- No distinct visible mouse movement occurs.
+
+The retry otherwise preserves Mike's face, beard, hair, glasses, age, charcoal
+long-sleeve shirt, closed cuffs, hidden tattoos, broad office geometry, and
+restrained camera movement. No readable generated text, floating label,
+hologram, neon effect, or clear malformed hand appears.
+
+## One new changed prompt variable
+
+The controlled retry proves that verbal hand blocking alone does not prevent
+the model from selecting reachable desk props. If a future separately
+authorized rebuild revisits this shot, change reachable set dressing only:
+
+> The desk surface within Mike’s reach contains only the corded handset, one
+> mouse, one keyboard, and one laptop; every smartphone, book, folder, pen,
+> and loose paper is physically absent from his reach.
+
+Identity, wardrobe, office, lighting, employee arrangement, duration, action,
+camera, and every other prompt variable remain unchanged. This is a record
+only. No further retry was submitted.
+
+## Previous retry variable

 Change actor hand blocking only:

 > Mike’s left hand remains on the corded handset. His right hand moves only between one visible mouse and one keyboard. Every smartphone, book, folder, and loose paper remains fixed outside his hand path.

-Identity, wardrobe, office, lighting, employee arrangement, duration, camera,
-and every other prompt variable remain unchanged. This note records a
-possible future correction only. No retry was submitted.
+This was the only change used for Attempt 2.
diff --git a/.superpowers/sdd/task-4-retry-report.md b/.superpowers/sdd/task-4-retry-report.md
new file mode 100644
index 0000000..2beec9a
--- /dev/null
+++ b/.superpowers/sdd/task-4-retry-report.md
@@ -0,0 +1,80 @@
+# Task 4 Controlled Retry Report
+
+## Outcome
+
+The single authorized chaos retry was rejected during full frame review. The
+same disqualifying prop mutation returned despite the exact approved
+actor-hand-blocking sentence. Shot 1 remains rejected. No later shot and no
+additional retry was generated.
+
+V3 spend is now 108 credits of the approved 675-credit cap. The balance moved
+from 2,319.36 to 2,265.36 credits for this retry.
+
+## Preservation and authority
+
+- The first rejected source was preserved before the canonical path changed:
+  `production/opening-film-v3/raw/shot-01-chaos-attempt-01-rejected.mp4`
+- Preserved SHA-256:
+  `15fc8565dd11792d0b99e2c6152bbd52be4f533bd9b2e5327e88bc233fce59f7`
+- The no-spend preflight returned exactly 54 credits.
+- Authority check: `54 + 54 <= 675`.
+- Exactly one retry result was submitted.
+- Generated audio was disabled.
+- Declined preset id:
+  `24bae836-2c4a-48e0-89b6-49fcc0b21612`
+
+## Retry generation
+
+- Job: `bc199863-0494-4bca-a76a-32781d65f637`
+- Cost: 54 credits
+- Source reference: accepted office job
+  `879db0a2-91d0-4276-ad5d-169a5606b303`
+- Output: H.264, 1920 by 1080, 24 fps, 145 frames, 6.041667 seconds
+- File size: 6,042,874 bytes
+- SHA-256:
+  `906f0b1dc255584fadbc120cda9e9ed03013fb1cfb585da26e2b14ce43e9dec7`
+- Canonical local source:
+  `production/opening-film-v3/raw/shot-01-chaos.mp4`
+
+The retry preserved the exact original prompt, parameters, and office video
+reference, appending only:
+
+> Mike’s left hand remains on the corded handset. His right hand moves only
+> between one visible mouse and one keyboard. Every smartphone, book, folder,
+> and loose paper remains fixed outside his hand path.
+
+## Review decision
+
+Rejected. Around 1.1 seconds, Mike's right hand leaves the book area and
+reaches toward the black smartphone. Across consecutive frames around 1.5
+seconds, the smartphone visibly becomes a loose white paper. Mike then handles
+the transformed paper, the book stack, a folder, and additional loose papers
+through about 3.3 seconds. Only one background employee appears, and no
+distinct visible mouse action occurs.
+
+Identity, glasses, beard, office wardrobe, closed cuffs, hidden tattoos, broad
+office geometry, camera restraint, and hand anatomy otherwise remain stable.
+There is no readable generated text or obvious logo.
+
+Every half-second sample was inspected. All 145 frames were inspected in seven
+full-frame sheets, with frames 24 through 83 inspected again in four close
+interaction sheets covering the hands, corded handset, smartphone, keyboard,
+laptop, desk props, and employee.
+
+## One future variable, not submitted
+
+Reachable set dressing is the one newly recorded variable:
+
+> The desk surface within Mike’s reach contains only the corded handset, one
+> mouse, one keyboard, and one laptop; every smartphone, book, folder, pen,
+> and loose paper is physically absent from his reach.
+
+No further retry was submitted.
+
+## Verification
+
+- Focused retry ledger test: 1 of 1 passed.
+- Full test suite: 95 of 95 passed.
+- `git diff --check`: clean.
+- No live-site file changed.
+- No deployment occurred.
diff --git a/assets/cinematic/mote-ops-opening-v3-manifest.json b/assets/cinematic/mote-ops-opening-v3-manifest.json
index e45e52f..c49b67b 100644
--- a/assets/cinematic/mote-ops-opening-v3-manifest.json
+++ b/assets/cinematic/mote-ops-opening-v3-manifest.json
@@ -6,48 +6,66 @@
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
-    "creditsSpent": 54,
+    "creditsSpent": 108,
     "shots": [
       {
         "id": "chaos",
         "durationSeconds": 6,
         "preflightCredits": 54,
         "status": "rejected",
-        "jobId": "910e5f0f-5f73-4b2d-97f9-7bf6eefae091",
+        "jobId": "bc199863-0494-4bca-a76a-32781d65f637",
         "credits": 54,
         "review": ".superpowers/sdd/opening-v3-shot-01-review.md",
         "attempts": [
           {
             "jobId": "910e5f0f-5f73-4b2d-97f9-7bf6eefae091",
             "credits": 54,
             "outcome": "rejected during frame review",
             "reason": "From about 1.3 to 1.7 seconds, the black smartphone under Mike's reaching hand visibly becomes a loose white paper as he lifts it. Mike then repeatedly handles loose papers through about 3.2 seconds, despite the locked-prop and no-paper-handling constraints. Only one background employee is present instead of the required two, and no distinct mouse movement occurs.",
             "changedPromptVariable": "Mike’s left hand remains on the corded handset. His right hand moves only between one visible mouse and one keyboard. Every smartphone, book, folder, and loose paper remains fixed outside his hand path.",
             "source": {
-              "path": "production/opening-film-v3/raw/shot-01-chaos.mp4",
+              "path": "production/opening-film-v3/raw/shot-01-chaos-attempt-01-rejected.mp4",
               "codec": "H.264",
               "width": 1920,
               "height": 1080,
               "frameRate": 24,
               "frameCount": 145,
               "durationSeconds": 6.041667,
               "sizeBytes": 7855696,
               "sha256": "15fc8565dd11792d0b99e2c6152bbd52be4f533bd9b2e5327e88bc233fce59f7"
             }
+          },
+          {
+            "jobId": "bc199863-0494-4bca-a76a-32781d65f637",
+            "credits": 54,
+            "outcome": "rejected during frame review",
+            "reason": "From about 1.1 to 1.6 seconds, Mike reaches across the desk for the black smartphone. Across consecutive frames around 1.5 seconds, the smartphone visibly becomes a loose white paper in his hand. He then handles the transformed paper, the book stack, a folder, and additional loose papers through about 3.3 seconds, despite the explicit hand-path constraint. Only one background employee is present instead of the required two, and no distinct visible mouse action occurs.",
+            "changedPromptVariable": "The desk surface within Mike’s reach contains only the corded handset, one mouse, one keyboard, and one laptop; every smartphone, book, folder, pen, and loose paper is physically absent from his reach.",
+            "source": {
+              "path": "production/opening-film-v3/raw/shot-01-chaos.mp4",
+              "codec": "H.264",
+              "width": 1920,
+              "height": 1080,
+              "frameRate": 24,
+              "frameCount": 145,
+              "durationSeconds": 6.041667,
+              "sizeBytes": 6042874,
+              "sha256": "906f0b1dc255584fadbc120cda9e9ed03013fb1cfb585da26e2b14ce43e9dec7"
+            }
           }
         ]
       },
       { "id": "discovery", "durationSeconds": 8, "preflightCredits": 72, "status": "not-generated", "jobId": null, "credits": null, "attempts": [] },
       { "id": "onboarding", "durationSeconds": 5, "preflightCredits": 45, "status": "not-generated", "jobId": null, "credits": null, "attempts": [] },
       { "id": "inbox-calendar", "durationSeconds": 8, "preflightCredits": 72, "status": "not-generated", "jobId": null, "credits": null, "attempts": [] },
       { "id": "calls-finance", "durationSeconds": 8, "preflightCredits": 72, "status": "not-generated", "jobId": null, "credits": null, "attempts": [] },
       { "id": "control-restored", "durationSeconds": 7, "preflightCredits": 63, "status": "not-generated", "jobId": null, "credits": null, "attempts": [] },
       { "id": "beach-payoff", "durationSeconds": 8, "preflightCredits": 72, "status": "not-generated", "jobId": null, "credits": null, "attempts": [] }
     ]
diff --git a/tests/opening-film-v3.test.mjs b/tests/opening-film-v3.test.mjs
index f0ad958..efd1cb1 100644
--- a/tests/opening-film-v3.test.mjs
+++ b/tests/opening-film-v3.test.mjs
@@ -10,21 +10,21 @@ test('declares the exact seven-shot silent V3 generation contract', () => {
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
-  assert.equal(manifest.generation.creditsSpent, 54);
+  assert.equal(manifest.generation.creditsSpent, 108);
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
@@ -49,38 +49,59 @@ test('declares the exact seven-shot silent V3 generation contract', () => {
     assert.equal(shot.credits, null, shot.id);
     assert.deepEqual(shot.attempts, [], shot.id);
   }
 });

 test('does not allow V3 generation without exact approved authority', () => {
   const manifest = JSON.parse(read('assets/cinematic/mote-ops-opening-v3-manifest.json'));
   assert.equal(manifest.generation.firstPassCredits, 450);
   assert.equal(manifest.generation.approvedCreditCap, 675);
   assert.ok(manifest.generation.approvedCreditCap >= manifest.generation.firstPassCredits);
-  assert.equal(manifest.generation.creditsSpent, 54);
+  assert.equal(manifest.generation.creditsSpent, 108);
 });

-test('records one rejected chaos attempt without silently retrying', () => {
+test('records two rejected chaos attempts and stops after the controlled retry', () => {
   const manifest = JSON.parse(read('assets/cinematic/mote-ops-opening-v3-manifest.json'));
   const shot = manifest.generation.shots.find(({ id }) => id === 'chaos');
   assert.equal(shot.status, 'rejected');
-  assert.equal(shot.jobId, '910e5f0f-5f73-4b2d-97f9-7bf6eefae091');
+  assert.equal(shot.jobId, 'bc199863-0494-4bca-a76a-32781d65f637');
   assert.equal(shot.credits, 54);
-  assert.equal(shot.attempts.length, 1);
+  assert.equal(shot.attempts.length, 2);
   assert.equal(shot.attempts[0].outcome, 'rejected during frame review');
   assert.match(shot.attempts[0].reason, /smartphone.*loose white paper/i);
   assert.equal(
     shot.attempts[0].changedPromptVariable,
     'Mike’s left hand remains on the corded handset. His right hand moves only between one visible mouse and one keyboard. Every smartphone, book, folder, and loose paper remains fixed outside his hand path.'
   );
+  assert.equal(
+    shot.attempts[0].source.path,
+    'production/opening-film-v3/raw/shot-01-chaos-attempt-01-rejected.mp4'
+  );
+  assert.equal(shot.attempts[1].jobId, 'bc199863-0494-4bca-a76a-32781d65f637');
+  assert.equal(shot.attempts[1].credits, 54);
+  assert.equal(shot.attempts[1].outcome, 'rejected during frame review');
+  assert.match(shot.attempts[1].reason, /smartphone.*loose white paper/i);
+  assert.match(shot.attempts[1].reason, /book.*folder.*loose papers/i);
+  assert.equal(
+    shot.attempts[1].changedPromptVariable,
+    'The desk surface within Mike’s reach contains only the corded handset, one mouse, one keyboard, and one laptop; every smartphone, book, folder, pen, and loose paper is physically absent from his reach.'
+  );
+  assert.equal(
+    shot.attempts[1].source.path,
+    'production/opening-film-v3/raw/shot-01-chaos.mp4'
+  );
+  assert.equal(
+    shot.attempts[1].source.sha256,
+    '906f0b1dc255584fadbc120cda9e9ed03013fb1cfb585da26e2b14ce43e9dec7'
+  );
   assert.ok(shot.review.endsWith('opening-v3-shot-01-review.md'));
-  assert.equal(manifest.generation.creditsSpent, 54);
+  assert.equal(manifest.generation.creditsSpent, 108);
   assert.ok(manifest.generation.creditsSpent <= manifest.generation.approvedCreditCap);
 });

 test('defines prompts that lock Mike, office wardrobe, props, and blank screens', () => {
   const prompts = JSON.parse(read('production/opening-film-v3/generation-prompts.json'));
   assert.equal(prompts.referenceElement.id, '089862a9-bb77-4b46-88dd-14629f777d5c');
   assert.equal(prompts.references.officeJobId, '879db0a2-91d0-4276-ad5d-169a5606b303');
   assert.equal(prompts.references.beachJobId, 'edb3bca7-2cb7-4cae-b1dc-1bcc71ecea1d');
   assert.deepEqual(Object.keys(prompts.shots), [
     'chaos',
> Superseded recovery artifact: this captured historical diff contains an
> inaccurate proposed set-dressing value in Attempt 2. The authoritative
> corrected ledger is the manifest, test, shot review, retry report, and
> `recovery-2026-07-23.md` at recovery commit `cb2ba7e`.
