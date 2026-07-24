# Mote Ops Scene 7 Natural Payoff Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a zero-credit Scene 7 review cut with a readable dashboard, natural wide framing, and the actor closing the laptop and leaving.

**Architecture:** Reuse the accepted raw calm-office shot and existing deterministic dashboard compositor. Remove the rejected post-production zoom filter, concatenate the corrected six-second shot after the approved Scenes 1 through 6 master, and publish only to the private review project.

**Tech Stack:** FFmpeg, ffprobe, Python, Pillow, existing HTML dashboard plate, Vercel preview

## Global Constraints

- Use zero Higgsfield or Seedance credits.
- Preserve approved Scenes 1 through 6 unchanged.
- Do not add the beach or CTA.
- Do not deploy to production.
- Output 1920 by 1080, 24 fps, silent H.264.

---

### Task 1: Prove the rejected transition cause

**Files:**
- Inspect: `/tmp/moteops-scene-07-final-v2.mp4`
- Inspect: `/tmp/moteops-scene-07-post/composite_scene7.py`
- Inspect: `production/opening-film-v3/raw/shot-06-control-restored.mp4`

**Interfaces:**
- Consumes: rejected Scene 7 render and its raw source
- Produces: confirmed evidence that only the post-production scale animation caused the unwanted zoom

- [ ] **Step 1: Probe both clips**

Run `ffprobe` on the rejected render and raw source to confirm matching duration, resolution, and frame rate.

- [ ] **Step 2: Compare opening and closing frames**

Extract matching frames from both files. Confirm the raw source stays at its natural camera scale while the rejected render changes scale.

- [ ] **Step 3: Record the single fix**

Keep the tracked dashboard composite, remove only the scale animation, and preserve the source timing.

### Task 2: Render the corrected Scene 7

**Files:**
- Reuse: `/tmp/moteops-scene-07-post/plate/dashboard-zero.png`
- Reuse: `/tmp/moteops-scene-07-post/composite_scene7.py`
- Create: `/tmp/moteops-scene-07-natural.mp4`

**Interfaces:**
- Consumes: raw calm-office frames and deterministic dashboard plate
- Produces: six-second natural-framing Scene 7 H.264 clip

- [ ] **Step 1: Render without scale animation**

Encode the existing composited frame sequence directly at 1920 by 1080 and 24 fps with no crop, zoompan, or animated scale filter.

- [ ] **Step 2: Verify the render**

Run `ffprobe` and assert 1920 by 1080, 24 fps, approximately six seconds, no audio, and H.264 video.

- [ ] **Step 3: Inspect the story beats**

Review the opening dashboard frame, the dashboard hold, the laptop-close moment, and the actor's exit.

### Task 3: Assemble and publish the private review

**Files:**
- Reuse: `/tmp/moteops-scene-06-review/scenes-01-through-06.mp4`
- Create: `/tmp/moteops-scene-07-natural-review/scenes-01-through-07-natural.mp4`
- Modify: `/tmp/moteops-transition-card-review/index.html`

**Interfaces:**
- Consumes: approved Scenes 1 through 6 and corrected Scene 7
- Produces: private phone-viewable review deployment

- [ ] **Step 1: Concatenate the clips**

Normalize both inputs to 1920 by 1080, 24 fps, silent H.264 and concatenate them without changing Scenes 1 through 6.

- [ ] **Step 2: Verify the boundary**

Extract frames immediately before and after the cut. Confirm Scene 7 begins at natural wide scale, the dashboard remains readable, and no zoom animation occurs.

- [ ] **Step 3: Deploy only a preview**

Deploy the review directory without `--prod`, obtain a temporary authenticated share URL, and confirm the deployment is Ready.

- [ ] **Step 4: Verify phone playback**

At 390 by 844, confirm video `readyState` is 4 and horizontal overflow is zero.

- [ ] **Step 5: Record the result**

Update the bridge state and log with the review deployment, zero-credit confirmation, and unchanged production status.
