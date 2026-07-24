# Mote Ops Scene 8 Beach Payoff Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish an isolated eight-second beach payoff for Mike's approval without spending credits or changing production.

**Architecture:** Reuse the accepted raw beach source and existing deterministic `phone-zero` and `closing-copy` plates. Use the already verified device-crop composite so the ocean remains untouched, then deploy only the isolated scene to the private review project.

**Tech Stack:** FFmpeg, ffprobe, existing deterministic interface plates, Vercel preview

## Global Constraints

- Use zero Higgsfield or Seedance credits.
- Do not join Scene 8 to the approved film until Mike accepts it.
- Do not deploy to production.
- Output 1920 by 1080, 24 fps, silent H.264.

---

### Task 1: Verify the existing beach composite

**Files:**
- Inspect: `production/opening-film-v3/raw/shot-07-beach-payoff.mp4`
- Inspect: `production/opening-film-v3/rendered/segments/07-beach-payoff.mp4`
- Inspect: `production/opening-film-v3/rendered/interfaces/phone-zero.png`
- Inspect: `production/opening-film-v3/rendered/interfaces/closing-copy.png`

**Interfaces:**
- Consumes: accepted source and deterministic plates
- Produces: verified isolated Scene 8 candidate

- [ ] **Step 1: Probe the render**

Run `ffprobe` and assert 1920 by 1080, 24 fps, eight seconds, no audio, and H.264 video.

- [ ] **Step 2: Inspect story beats**

Extract one frame per second. Confirm the phone message remains inside the phone, the ocean is untouched, Mike smiles and looks toward the water, and the closing block stays in the left negative space.

### Task 2: Publish the isolated review

**Files:**
- Reuse: `production/opening-film-v3/rendered/segments/07-beach-payoff.mp4`
- Modify: `/tmp/moteops-transition-card-review/index.html`

**Interfaces:**
- Consumes: isolated Scene 8 candidate
- Produces: temporary phone-viewable review link

- [ ] **Step 1: Package only Scene 8**

Copy the eight-second beach render into the private review directory and point the review page to that file.

- [ ] **Step 2: Deploy only a preview**

Deploy without `--prod`, obtain a temporary authenticated share URL, and confirm the deployment is Ready.

- [ ] **Step 3: Verify phone playback**

At 390 by 844, confirm video `readyState` is 4, the duration is eight seconds, and horizontal overflow is zero.

- [ ] **Step 4: Record the result**

Update the bridge state and log with the isolated review deployment, zero-credit confirmation, and unchanged production status.
