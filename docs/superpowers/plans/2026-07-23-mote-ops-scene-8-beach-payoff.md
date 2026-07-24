# Mote Ops Scene 8 Beach Payoff Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish an isolated eight-second sunglasses-to-phone beach payoff for Mike's approval without spending credits or changing production.

**Architecture:** Use the first four seconds of the existing sunglasses-arrival source, then make a clean cut to four seconds of the existing phone-check source. Apply only the deterministic `phone-zero` plate through the already verified device-crop composite so the ocean remains untouched. Keep the consultation copy out of this scene and deploy only the isolated hybrid scene to the private review project.

**Tech Stack:** FFmpeg, ffprobe, existing deterministic interface plates, Vercel preview

## Global Constraints

- Use zero Higgsfield or Seedance credits.
- Do not join Scene 8 to the approved film until Mike accepts it.
- Do not add the closing-copy plate to Scene 8.
- Reserve the consultation message for a separate final card.
- Do not deploy to production.
- Output 1920 by 1080, 24 fps, silent H.264.

---

### Task 1: Build the hybrid beach payoff

**Files:**
- Read: `production/opening-film-v3/raw/shot-07-beach-reference.mp4`
- Read: `production/opening-film-v3/raw/shot-07-beach-payoff.mp4`
- Inspect: `production/opening-film-v3/rendered/interfaces/phone-zero.png`
- Create: `/tmp/moteops-scene-08-hybrid-review/scene-08-sunglasses-phone.mp4`

**Interfaces:**
- Consumes: accepted sunglasses arrival, accepted phone performance, and deterministic phone plate
- Produces: verified eight-second hybrid Scene 8 candidate

- [x] **Step 1: Normalize both source windows**

Trim the sunglasses source to seconds zero through four and the phone source to seconds zero through four. Normalize both windows to 1920 by 1080, 24 fps, square pixels, and silent H.264.

- [x] **Step 2: Composite the phone status**

Restrict chroma keying to the tracked physical phone crop in the second source window and place `phone-zero.png` inside the bezel. Do not add `closing-copy.png`.

- [x] **Step 3: Join and probe the render**

Concatenate the two normalized four-second windows. Run `ffprobe` and assert 1920 by 1080, 24 fps, eight seconds, no audio, and H.264 video.

- [x] **Step 4: Inspect story beats**

Extract one frame per second and frames around the four-second cut. Confirm Mike puts on sunglasses and arrives before the cut, checks the readable phone after the cut, smiles, the phone message remains inside the phone, the ocean is untouched, and no large closing copy appears.

### Task 2: Publish the isolated review

**Files:**
- Reuse: `/tmp/moteops-scene-08-hybrid-review/scene-08-sunglasses-phone.mp4`
- Modify: `/tmp/moteops-transition-card-review/index.html`

**Interfaces:**
- Consumes: isolated Scene 8 candidate
- Produces: temporary phone-viewable review link

- [x] **Step 1: Package only Scene 8**

Copy the eight-second hybrid beach render into the private review directory and point the review page to that file.

- [x] **Step 2: Deploy only a preview**

Deploy without `--prod`, obtain a temporary authenticated share URL, and confirm the deployment is Ready.

- [x] **Step 3: Verify phone playback**

At 390 by 844, confirm video `readyState` is 4, the duration is eight seconds, and horizontal overflow is zero.

- [x] **Step 4: Record the result**

Update the bridge state and log with the isolated hybrid review deployment, zero-credit confirmation, separate-final-card status, and unchanged production status.
