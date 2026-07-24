# Mote Ops Scene 8 Beach Payoff Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and privately review one exact eight-second beach payoff where Mike arrives, pulls his phone from his pocket, sees that Mote Ops has zero tasks pending, and enjoys the ocean.

**Architecture:** Generate one fresh continuous Mike performance with Seedance 2.0, using the existing approved Mote Ops reference element and beach continuity reference. Derive all three editorial beats from that one source, replace only the physical phone display with deterministic artwork, and publish Scene 8 alone. The separate consultation card and full-film join remain blocked until Mike approves Scene 8.

**Tech Stack:** Higgsfield Seedance 2.0, FFmpeg, ffprobe, deterministic HTML or image plate capture, Vercel preview, agent-browser

## Global Constraints

- Preflight the exact generation cost before submitting any job.
- Do not spend credits until Mike approves the exact cost and prompt package.
- Use one actor-performance generation only unless Mike separately approves a retry.
- Preserve Mike's face, beard, hair, age, body proportions, white short-sleeve linen shirt, sunglasses, tattoos, phone, beach, and light direction.
- Keep tattoos visible only on exposed skin. They must not move, multiply, change, or bleed through fabric.
- The generated phone screen contains one uninterrupted matte chroma green surface for deterministic replacement.
- Scene 8 is exactly 8.0 seconds, 1920 by 1080, 24 fps, silent H.264.
- Do not create the 3.5-second consultation card until Mike approves Scene 8.
- Do not join Scene 8 to the approved 38.5-second film until Mike approves Scene 8.
- Do not deploy to production.

---

### Task 1: Preflight one Seedance source

**Files:**
- Read: `production/opening-film-v3/generation-prompts.json`
- Modify: `production/opening-film-v3/generation-prompts.json`
- Modify: `assets/cinematic/mote-ops-opening-v3-manifest.json`

**Interfaces:**
- Consumes: completed Mote Ops reference element, existing accepted beach continuity job, approved Scene 8 design
- Produces: exact prompt package and exact credit cost, with no submitted generation

- [x] **Step 1: Confirm the model contract**

Use the Higgsfield model catalog to confirm Seedance 2.0 accepts eight seconds, 16:9, standard mode, 1080p, silent output, image references, and video references.

- [x] **Step 2: Save the exact prompt package**

Store this prompt under `proposedShots["beach-payoff-redesign"]` so the blocked revision does not enter the accepted seven-shot contract:

```text
<<<089862a9-bb77-4b46-88dd-14629f777d5c>>> Mote Ops beach payoff, one fresh eight-second continuous photoreal commercial performance at the same understated beach, wardrobe, sunset light, and restrained color as the supplied beach continuity reference. Preserve Mike Mote's exact face, beard, hair, age, body proportions, sunglasses, white short-sleeve linen shirt, and real dark-ink arm tattoo placement. Mike walks naturally into a medium beach frame, settles, reaches into one trouser pocket, pulls out one consistent modern phone, raises it, studies it briefly, gives one small relieved smile, lowers or pockets the phone, and turns his attention toward the ocean. Keep Mike and the phone visible with enough detail from 3.0 through 5.5 seconds for a deliberate close editorial insert. The phone display is one flat uninterrupted matte chroma green surface, exact color 0x008a50, fully contained inside the bezel and unobstructed by fingers. The camera remains on the same side with one restrained steady movement. Natural body motion and hands. No internal scene cuts, morphs, dissolves, time jumps, extra people, extra phones, phone duplication, object transformation, wardrobe change, moving tattoos, tattoo bleed-through, malformed hands, generated text, logos, luxury-resort staging, exaggerated acting, or broad commercial posing.
```

Store these parameters with the prompt:

```json
{
  "model": "seedance_2_0",
  "duration": 8,
  "aspect_ratio": "16:9",
  "resolution": "1080p",
  "mode": "std",
  "bitrate_mode": "high",
  "genre": "comedy",
  "generate_audio": false,
  "count": 1
}
```

- [x] **Step 3: Run a zero-spend cost preflight**

Call Seedance 2.0 with the exact prompt, parameters, existing accepted beach job as `video_references`, and `get_cost: true`. Confirm the response contains a credit cost and no generation job.

- [x] **Step 4: Enforce the owner gate**

Report the exact cost and full creative summary to Mike. Stop until he approves that exact spend. If the cost exceeds the recorded 35.5-credit project remainder, do not submit the job.

### Task 2: Generate and inspect the single actor source

**Files:**
- Modify: `assets/cinematic/mote-ops-opening-v3-manifest.json`
- Create: `production/opening-film-v3/raw/shot-07-beach-redesign.mp4`
- Create: `/tmp/moteops-scene-08-redesign/source-contact.jpg`

**Interfaces:**
- Consumes: Mike's exact approved cost and prompt package
- Produces: one accepted or rejected eight-second continuous beach source

- [x] **Step 1: Submit exactly one generation**

Remove `get_cost`, submit the otherwise identical Seedance 2.0 request, and record the returned job identifier before polling.

- [x] **Step 2: Wait for the submitted job**

Poll only that job until it reports completed or failed. Do not submit a replacement automatically.

- [x] **Step 3: Retrieve and normalize the result**

Save the completed result as `production/opening-film-v3/raw/shot-07-beach-redesign.mp4`. Normalize to 1920 by 1080, 24 fps, square pixels, silent H.264 without changing its duration.

- [x] **Step 4: Inspect every story beat**

Extract two frames per second and inspect the full clip for:

- identity and wardrobe continuity;
- one natural pocket-to-phone action;
- one consistent phone with uninterrupted green display;
- stable tattoo placement and no fabric bleed-through;
- no object mutation, disappearing hands, extra fingers, or generated text;
- a usable phone moment between 3.0 and 5.5 seconds;
- a visible relieved smile and ocean payoff.

If any acceptance item fails, mark the source rejected and stop. Do not spend credits on a retry without a new explicit approval.

### Task 2B: Generate the explicitly approved locked-hair retry

**Files:**
- Read: `production/opening-film-v3/raw/shot-07-beach-source.png`
- Modify: `production/opening-film-v3/generation-prompts.json`
- Create: `production/opening-film-v3/raw/shot-07-beach-redesign-retry.mp4`

**Interfaces:**
- Consumes: Mike's explicit approval for exactly 36 additional credits, accepted no-phone beach start image
- Produces: one corrected eight-second source or one recorded rejection

- [x] **Step 1: Preflight the corrected request**

Use the accepted no-phone beach start image as `start_image`. Remove the older beach video reference. Require the exact short swept-back haircut, no ponytail, no bun, no long hair, front or three-quarter front framing, pocket pull, phone check, smile, and ocean look. Require the cost preflight to return exactly 36 credits.

- [x] **Step 2: Submit one corrected generation**

If and only if the preflight returns exactly 36 credits, submit the identical request once. Record the job identifier before polling. Do not submit an automatic retry.

- [x] **Step 3: Inspect before editing**

Normalize and extract two frames per second. Reject the source if the haircut changes, a ponytail or bun appears, the phone or hands mutate, the wardrobe or tattoos drift, or the pocket-to-phone action fails.

### Task 3: Build the isolated eight-second edit

**Files:**
- Create: `production/opening-film-v3/rendered/interfaces/phone-zero-redesign.png`
- Create: `/tmp/moteops-scene-08-redesign/scene-08-beach-redesign.mp4`
- Create: `/tmp/moteops-scene-08-redesign/edit-contact.jpg`

**Interfaces:**
- Consumes: accepted single-source beach performance
- Produces: exact eight-second arrival, phone insert, and ocean-payoff edit

- [x] **Step 1: Build the phone plate**

Create a restrained Mote Ops phone screen with exactly:

```text
MOTE OPS
0 TASKS
ENJOY YOUR DAY
```

Use cream, deep green, rust, and black. Keep all text centered, large, and readable.

- [x] **Step 2: Select cuts from one source**

Use source windows matching the approved structure:

- 0.0–3.25 seconds: beach arrival and phone pull;
- 3.25–5.25 seconds: close crop of the same phone moment;
- 5.25–8.0 seconds: return to the same source performance for the smile and ocean.

Adjust cut points by at most 0.25 second only to land on complete physical actions. Preserve the exact eight-second total by compensating in the adjacent window.

- [x] **Step 3: Replace only the phone display**

Track or perspective-match `phone-zero-redesign.png` inside the physical phone bezel during the close insert. Restrict keying and replacement to the device crop so Mike, his hand, shirt, tattoos, sky, and ocean remain untouched.

- [x] **Step 4: Verify the media contract**

Use ffprobe to assert:

```text
duration=8.000000
codec=h264
width=1920
height=1080
frame_rate=24/1
audio_streams=0
```

- [x] **Step 5: Inspect the edit**

Extract one frame per second and eight frames around both cuts. Confirm the action reads as arrival, phone result, and human payoff; the returning Mike frame matches the source before the insert; and no large closing copy appears.

### Task 4: Publish only Scene 8 for approval

**Files:**
- Modify: `/tmp/moteops-transition-card-review/index.html`
- Copy: `/tmp/moteops-scene-08-redesign/scene-08-beach-redesign.mp4` to `/tmp/moteops-transition-card-review/scene-08-beach-redesign.mp4`

**Interfaces:**
- Consumes: verified isolated Scene 8
- Produces: temporary private phone-viewable review link

- [x] **Step 1: Package the isolated review**

Point the private review page only to `scene-08-beach-redesign.mp4`. Label it `Scene 8 · Beach payoff redesign`.

- [x] **Step 2: Deploy a preview**

Deploy the already linked `moteops-cinematic-review` project without `--prod`. Confirm the deployment reports Ready and create a temporary authenticated share URL.

- [x] **Step 3: Verify phone playback**

At 390 by 844, confirm:

```json
{
  "readyState": 4,
  "duration": 8,
  "videoWidth": 1920,
  "videoHeight": 1080,
  "overflow": 0,
  "errorOverlay": false
}
```

- [x] **Step 4: Run repository verification**

Run `npm test` and require all 99 tests to pass.

- [x] **Step 5: Stop at the approval gate**

Send Mike the isolated review link. Do not create the consultation card, join the film, push production, or spend retry credits until Mike responds.

### Task 5: Create the consultation card only after Scene 8 approval

**Files:**
- Create: `production/opening-film-v3/rendered/interfaces/final-consultation-card.png`
- Create: `/tmp/moteops-scene-08-redesign/final-consultation-card.mp4`

**Interfaces:**
- Consumes: Mike's explicit Scene 8 approval
- Produces: exact 3.5-second silent Mote Ops end card

- [x] **Step 1: Render the approved copy**

Use the existing cream, deep green, rust, and black system with:

```text
This was made by Mote Ops.
Book your free 30-minute consultation.
moteops.tech
```

- [x] **Step 2: Encode the card**

Encode exactly 3.5 seconds at 1920 by 1080, 24 fps, silent H.264. Use restrained entrance motion and no generated imagery.

- [x] **Step 3: Publish the card separately**

Publish only the end card to the private review project and stop for approval before joining the 50-second film.
