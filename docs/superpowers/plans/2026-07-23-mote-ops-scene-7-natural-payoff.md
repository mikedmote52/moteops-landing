# Mote Ops Scene 7 Natural Payoff Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a zero-credit payoff that places the readable dashboard at the end of the established close laptop shot, then cuts to the happy actor with the laptop already closed.

**Architecture:** Extend the approved close laptop workflow with a deterministic `Today is under control.` hold using the same screen geometry. Trim the calm-office source to begin only after the laptop is closed, so its green screen and any cross-angle replacement are never visible. Concatenate the corrected payoff after approved Scenes 1 through 5 and the unchanged Scene 6 calls review, then publish only to the private review project.

**Tech Stack:** FFmpeg, ffprobe, Python, Pillow, existing HTML dashboard plate, Vercel preview

## Global Constraints

- Use zero Higgsfield or Seedance credits.
- Preserve approved Scenes 1 through 5 and the Scene 6 calls review unchanged.
- Do not add the beach or CTA.
- Do not deploy to production.
- Output 1920 by 1080, 24 fps, silent H.264.

---

### Task 1: Prove the rejected transition cause and select the clean cut

**Files:**
- Inspect: `/tmp/moteops-scene-07-natural.mp4`
- Inspect: `/tmp/moteops-scene-06-close-v2.mp4`
- Inspect: `production/opening-film-v3/raw/shot-06-control-restored.mp4`

**Interfaces:**
- Consumes: rejected Scene 7 render and its raw source
- Produces: confirmed evidence that the dashboard changes physical angle at the cut, plus an exact source time where the laptop is already closed

- [ ] **Step 1: Probe both clips**

Run `ffprobe` on the close laptop render and calm-office source to confirm resolution and frame rate.

- [ ] **Step 2: Compare opening and closing frames**

Extract quarter-second frames around the calm-office laptop close. Select the first frame where the laptop is fully closed and the actor is visibly relieved.

- [ ] **Step 3: Record the single fix**

Keep the dashboard in the close laptop geometry and remove every dashboard frame from the calm-office angle.

### Task 2: Render the close dashboard payoff

**Files:**
- Reuse: `/tmp/moteops-scene-07-post/plate/dashboard-zero.png`
- Reuse: `/tmp/moteops-scene-06-post/composite_scene6.py`
- Create: `/tmp/moteops-scene-07-dashboard-close.mp4`

**Interfaces:**
- Consumes: final approved Scene 6 physical frame and deterministic dashboard plate
- Produces: readable close-screen dashboard hold

- [ ] **Step 1: Composite the dashboard**

Map the dashboard plate into the exact Scene 6 screen quadrilateral, apply the established close crop, and hold `Today is under control.` for approximately 1.5 seconds.

- [ ] **Step 2: Verify the render**

Run `ffprobe` and assert 1920 by 1080, 24 fps, approximately 1.5 seconds, no audio, and H.264 video.

- [ ] **Step 3: Inspect the story beats**

Compare the final calls frame and first dashboard frame. Confirm the physical laptop, angle, crop, and screen boundary remain fixed while only the interface changes.

### Task 3: Render the closed-laptop exit

**Files:**
- Reuse: `production/opening-film-v3/raw/shot-06-control-restored.mp4`
- Create: `/tmp/moteops-scene-07-closed-exit.mp4`

**Interfaces:**
- Consumes: calm-office source beginning after the laptop is closed
- Produces: happy actor smile, stand, and exit with no visible replacement screen

- [ ] **Step 1: Trim after the close**

Start at the first clean closed-laptop frame and preserve the remaining actor performance through the office exit.

- [ ] **Step 2: Verify no interface is visible**

Inspect the first, middle, and final frames. Confirm the laptop remains closed and no green or replacement screen appears.

### Task 4: Assemble and publish the private review

**Files:**
- Reuse: `/tmp/moteops-scene-06-review/scenes-01-through-06.mp4`
- Create: `/tmp/moteops-scene-07-corrected-review/scenes-01-through-07-corrected.mp4`
- Modify: `/tmp/moteops-transition-card-review/index.html`

**Interfaces:**
- Consumes: approved Scenes 1 through 6, close dashboard payoff, and closed-laptop exit
- Produces: private phone-viewable review deployment

- [ ] **Step 1: Concatenate the clips**

Concatenate approved Scenes 1 through 6, the close dashboard payoff, and the closed-laptop exit without changing any approved preceding content.

- [ ] **Step 2: Verify the boundary**

Extract frames around both boundaries. Confirm the dashboard appears in the same close screen, then the next office angle begins with the laptop already closed.

- [ ] **Step 3: Deploy only a preview**

Deploy the review directory without `--prod`, obtain a temporary authenticated share URL, and confirm the deployment is Ready.

- [ ] **Step 4: Verify phone playback**

At 390 by 844, confirm video `readyState` is 4 and horizontal overflow is zero.

- [ ] **Step 5: Record the result**

Update the bridge state and log with the review deployment, zero-credit confirmation, and unchanged production status.
