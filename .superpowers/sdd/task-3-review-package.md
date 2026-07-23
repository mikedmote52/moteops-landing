# Review package: 5b833ed..9fe2f3c

## Commits
9fe2f3c docs: approve opening film V3 generation cap

## Files changed
 .superpowers/sdd/opening-v3-preflight.md           | 47 ++++++++++++++++++++++
 assets/cinematic/mote-ops-opening-v3-manifest.json |  4 +-
 engagement/audit.md                                |  8 ++++
 tests/opening-film-v3.test.mjs                     | 10 ++++-
 4 files changed, 66 insertions(+), 3 deletions(-)

## Diff
diff --git a/.superpowers/sdd/opening-v3-preflight.md b/.superpowers/sdd/opening-v3-preflight.md
new file mode 100644
index 0000000..e1d0b8b
--- /dev/null
+++ b/.superpowers/sdd/opening-v3-preflight.md
@@ -0,0 +1,47 @@
+# Mote Ops Opening Film V3 Preflight
+
+Status: approved for generation
+
+## Identity
+
+- Element: Mike Mote Opening
+- Element id: `089862a9-bb77-4b46-88dd-14629f777d5c`
+- Status: completed
+- Source images: 3
+
+## Balance
+
+- Plan: Ultra
+- Available credits at preflight: 2,373.36
+- Credits spent by this V3 preflight: 0
+
+## Exact Seedance 2.0 no-spend preflight
+
+| Shot | Duration | Credits |
+| --- | ---: | ---: |
+| chaos | 6 seconds | 54 |
+| discovery | 8 seconds | 72 |
+| onboarding | 5 seconds | 45 |
+| inbox-calendar | 8 seconds | 72 |
+| calls-finance | 8 seconds | 72 |
+| control-restored | 7 seconds | 63 |
+| beach-payoff | 8 seconds | 72 |
+| **First pass** | **50 seconds** | **450** |
+
+Three short prompts triggered an unrelated `IN THE DARK` preset suggestion during
+cost lookup. Their no-spend preflights were repeated with that preset explicitly
+declined so the intended direct Seedance 2.0 route remained unchanged.
+
+## Requested authority
+
+- Exact first pass: 450 credits
+- Retry reserve: 225 credits
+- Maximum requested cap: 675 credits
+- Current production film remains unchanged through private review.
+- Approval: approved by Mike
+- Approved maximum: 675 credits
+- Approval timestamp: 2026-07-23 19:40 UTC
+- V3 credits spent at approval: 0
+
+Generation may proceed shot by shot under the 675-credit maximum. This approval
+does not authorize deployment or any change to the current production film.
diff --git a/assets/cinematic/mote-ops-opening-v3-manifest.json b/assets/cinematic/mote-ops-opening-v3-manifest.json
index c8e3852..6f64426 100644
--- a/assets/cinematic/mote-ops-opening-v3-manifest.json
+++ b/assets/cinematic/mote-ops-opening-v3-manifest.json
@@ -1,25 +1,25 @@
 {
   "schema": "mote-ops-opening/v3",
-  "status": "awaiting-credit-approval",
+  "status": "awaiting-generation",
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
-    "approvedCreditCap": null,
+    "approvedCreditCap": 675,
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
diff --git a/engagement/audit.md b/engagement/audit.md
new file mode 100644
index 0000000..82f9885
--- /dev/null
+++ b/engagement/audit.md
@@ -0,0 +1,8 @@
+# Engagement Audit Log
+
+## 2026-07-23 19:40:15 UTC, authorize Mote Ops opening film V3 generation
+- Decision: approved
+- Approver: Mike
+- Reason: Mike explicitly approved the exact 675-credit maximum after a 450-credit first-pass preflight and 225-credit retry reserve.
+- Skill: audit-log
+- Target: private Mote Ops opening film V3 review
diff --git a/tests/opening-film-v3.test.mjs b/tests/opening-film-v3.test.mjs
index 9e9244e..53cd4a7 100644
--- a/tests/opening-film-v3.test.mjs
+++ b/tests/opening-film-v3.test.mjs
@@ -9,21 +9,21 @@ const read = (path) => readFileSync(resolve(root, path), 'utf8');
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
-  assert.equal(manifest.generation.approvedCreditCap, null);
+  assert.equal(manifest.generation.approvedCreditCap, 675);
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
@@ -32,20 +32,28 @@ test('declares the exact seven-shot silent V3 generation contract', () => {
       { id: 'beach-payoff', durationSeconds: 8, preflightCredits: 72 },
     ]
   );
   for (const shot of manifest.generation.shots) {
     assert.equal(shot.status, 'not-generated');
     assert.equal(shot.jobId, null);
     assert.equal(shot.credits, null);
   }
 });

+test('does not allow V3 generation without exact approved authority', () => {
+  const manifest = JSON.parse(read('assets/cinematic/mote-ops-opening-v3-manifest.json'));
+  assert.equal(manifest.generation.firstPassCredits, 450);
+  assert.equal(manifest.generation.approvedCreditCap, 675);
+  assert.ok(manifest.generation.approvedCreditCap >= manifest.generation.firstPassCredits);
+  assert.equal(manifest.generation.creditsSpent, 0);
+});
+
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
