# Mote Ops Email-to-Beach Opening Film Design

**Status:** Approved concept, awaiting written-spec review  
**Date:** 2026-07-23  
**Owner:** Mike Mote  
**Surface:** `moteops.tech` homepage cinematic candidate  
**Production boundary:** No new generation or credit spend occurs until the exact three-shot cost is preflighted and approved.

## 1. Purpose

Replace the current overwhelmed-owner image card and the later quiet desk transition with one active opening story that makes the Mote Ops value proposition immediately visible:

1. A small business is close to operational breakdown.
2. The owner knows AI could help but does not need another disconnected tool.
3. The owner finds a Mote Ops email in the crowded inbox and clicks it.
4. Mote Ops visibly organizes the work and prepares consequential actions for approval.
5. The owner regains control, leaves work, and reaches the beach.

The film must show cause and effect. Mote Ops is the reason the day changes. The beach is the human payoff, not an unrelated lifestyle image.

## 2. Approved message

The film's core promise is:

> Mote Ops organizes the people, tools, context, and decisions a small business already depends on. The system prepares the work. The owner remains in control.

The humorous closing line is:

> **Mote Ops cleaned up the work. Mike found the beach.**

The existing operating line remains underneath:

> Mote Ops. Your people and tools already do the work. We help them work as one.

The humor is dry and confident. It must not become slapstick, exaggerated acting, a superhero rescue, or instant AI magic.

## 3. Master structure

The silent horizontal master is 24 seconds, assembled from three separately reviewed eight-second generated plates plus real interface and typography inserts.

### Shot 1: BREAKDOWN AND DISCOVERY, 0–8 seconds

Mike is at the center of a small office in visible operational distress. The company feels close to losing control, not merely busy.

Physical activity includes:

- a desk phone ringing while Mike handles another call;
- a mobile phone receiving messages;
- an employee or colleague waiting at the doorway for an answer;
- paperwork and a printer adding to the queue;
- a calendar conflict demanding attention;
- a spreadsheet and an invoice both awaiting review;
- Mike switching between devices and losing the order of operations.

The camera uses restrained handheld urgency, short cuts, and a tightening composition. Mike's performance is stressed and active but believable. The scene must never imply danger, self-harm, financial collapse, or a medical emergency.

Real post-produced typography identifies the pressure:

- missed calls;
- unread emails;
- unanswered texts;
- calendar conflict;
- spreadsheet review;
- invoice review.

No count is presented as a real Mote Ops customer metric. All business information is explicitly fictional.

At approximately six seconds, Mike notices one email in the crowded inbox. The generated plate ends on a stable over-the-shoulder monitor position. A real HTML email capture replaces the generated screen for the discovery insert.

Approved email copy:

> **FROM: MOTE OPS**  
> **You should not have to be the operating system.**  
> You know AI could help. You do not need another disconnected tool to manage.  
> Mote Ops organizes the people, tools, and decisions your business already depends on.  
> **Show me how →**

Mike clicks the real post-produced call to action. The click provides the transition into Shot 2.

### Shot 2: CLEANUP AND CONTROL, 8–16 seconds

The Mote Ops click match-cuts into a calmer, more deliberate office sequence. Mote Ops visibly:

- organizes incoming email;
- logs missed calls and messages;
- identifies and resolves the calendar conflict;
- summarizes the spreadsheet;
- flags the invoice for review;
- prepares follow-up drafts;
- places consequential actions into one approval queue.

Every interface is a real Mote Ops, Care Hub, or purpose-built HTML capture composited in post. No generated UI, pseudo-text, fake dashboard, invented customer record, invented client outcome, or fabricated metric is permitted.

The generated footage supplies only Mike, the physical office, and believable actions. The edit supplies the cleanup through:

- real full-frame interface inserts;
- match cuts from cluttered to ordered work;
- the phone becoming quiet;
- paperwork reducing to one prepared decision packet;
- the camera settling from handheld urgency into a stable composition.

Mike reviews three prepared decisions. He approves only the actions shown as approval-ready. The film does not imply that Mote Ops independently sends messages, moves money, signs contracts, or takes another consequential action.

The scene ends when Mike closes the notebook or laptop and leaves a calm, organized workspace behind.

### Shot 3: BEACH PAYOFF, 16–24 seconds

The notebook or laptop close match-cuts to Mike opening or putting on sunglasses at the beach.

Mike wears a simple white short-sleeve linen shirt and sunglasses. He arrives at the beach, takes in the ocean, and visibly settles into free time. The performance is understated: a small relieved smile or knowing look, not a broad commercial pose.

The final typography is applied in post:

> **Mote Ops cleaned up the work. Mike found the beach.**

Then:

> Mote Ops. Your people and tools already do the work. We help them work as one.

The final frame holds long enough to read and becomes the playback end state.

## 4. Identity and reference policy

Use a one-off Higgsfield Reference Element for this film. Do not train a reusable Soul or digital twin.

Preferred identity references are Mike's supplied Photos 2, 4, and 5 because they provide:

- one clear front-facing view with glasses;
- two clean natural-light views without glasses;
- consistent beard, hairline, face shape, and skin tone.

Do not use Photo 7 because another person appears in it. Avoid Photos 1, 3, and 6 as primary references because the hat, sunglasses, medical-scrub branding, headphones, novelty clothing, or extreme angle could contaminate wardrobe and identity. They may be inspected only as secondary face-shape context if the reference tool requires more coverage.

The generated wardrobe is:

- office: charcoal or black unbranded overshirt, dark trousers, no medical scrubs, badges, employer marks, or logos;
- beach: white short-sleeve linen shirt and neutral sunglasses.

Tattoos may appear only when consistent and physically plausible. Identity review prioritizes face, beard, hair, eyes, hands, and body proportions over tattoo recreation.

Higgsfield cannot consume the Codex attachment paths directly. Mike must re-select three to seven photos through the Higgsfield upload widget before the one-off Reference Element is created.

## 5. Website placement

The new film becomes the first major visual directly under the site header.

It replaces:

- the current `owner-pressure` photo card shown in Mike's mobile screenshot;
- the current lower `operating-transition` quiet desk film.

It does not add a third cinematic block or duplicate the pressure story.

Desktop composition:

- full-width editorial film directly below the header;
- approved hero headline and primary action remain visible with the opening;
- film occupies the dominant visual area;
- pressure labels remain inside safe title margins.

Mobile composition:

- film appears immediately below the header;
- headline and booking action follow without requiring a long scroll;
- all pressure labels remain legible at 390 pixels;
- no horizontal overflow or hover-only behavior.

The existing `owner-connect` and `owner-control` explanations remain below the opener as the detailed explanation of what the film just showed. The old `owner-pressure` article is removed to avoid repetition.

## 6. Playback behavior

The master is silent-first and has no audio track.

Playback contract:

- `autoplay muted playsinline`;
- no infinite loop;
- plays once when visible and Motion is on;
- pauses when offscreen or Motion is turned off;
- resumes from the paused time when the visitor returns;
- ends on the beach frame;
- exposes one 44-pixel **Replay story** control only after completion;
- Replay restarts only after explicit activation;
- integrates with the existing page-level Motion control;
- does not add a second global motion toggle.

Reduced-motion contract:

- Motion starts off;
- no source is eagerly loaded;
- a strong poster shows overwhelmed Mike and the approved pressure framing;
- the full story remains available as accessible text;
- the visitor may explicitly enable Motion and then play the film.

Failure contract:

- playback rejection preserves the poster and readable story;
- stale rejected play promises cannot disable a later visitor opt-in;
- missing `IntersectionObserver` uses the existing safe visibility fallback;
- no visible control is inert.

## 7. Media outputs

Create:

- `assets/cinematic/mote-ops-opening-1080.mp4`, H.264, 1920×1080, 24fps, no audio, faststart;
- `assets/cinematic/mote-ops-opening-720.mp4`, H.264, 1280×720, 24fps, no audio, faststart;
- `assets/cinematic/mote-ops-opening-poster.webp`, 1600×900;
- `assets/cinematic/mote-ops-opening-manifest.json`.

The manifest records:

- every preflight and approved credit cap;
- reference-element identity and source-photo count without private local paths;
- every generation job and prompt revision;
- per-shot acceptance or rejection;
- source and output codec, dimensions, duration, frame rate, audio state, faststart, size, and SHA-256;
- post-production interface and typography sources;
- fictional-scenario and generated-film disclosure;
- frame-review result.

Remove the prior quiet desk MP4, poster, and active markup from the release candidate after the new opener passes review. Git history remains the recovery path.

## 8. Generation workflow and credit gate

Preflight exactly three eight-second Seedance 2.0 shots with the approved one-off Mike Reference Element:

1. breakdown and discovery;
2. cleanup and control;
3. beach payoff.

Present the per-shot and total credit cost before generation. The prior 75-credit authorization is exhausted by the earlier 72-credit transition-film work and does not authorize this production.

After a new exact cap is approved:

- generate one shot at a time;
- review identity, hands, physical action, continuity, wardrobe, lighting, screen cleanliness, and editability;
- stop after any rejected shot;
- revise one prompt variable;
- preflight any replacement;
- request a higher cap before exceeding the approved total;
- never batch speculative variants.

## 9. Post-production rules

Generated footage contains no usable screen content. Every readable screen, email, interface, logo, pressure label, and end card is created from:

- real Mote Ops or Care Hub captures;
- purpose-built local HTML/CSS capture plates;
- post-production typography.

The real discovery email is created locally, rendered in a browser, and captured as a clean insert. It does not imply that Mote Ops actually sent an email to a real business.

The edit uses simple match cuts, controlled speed changes, and restrained camera transitions. It prohibits:

- holograms;
- glowing AI networks;
- floating interfaces;
- magical object disappearance;
- generated words or logos;
- unreadable pseudo-text;
- synthetic smiles;
- exaggerated breakdown acting;
- claims that Mote Ops acts autonomously.

## 10. Disclosure and accessibility

Visible disclosure:

> AI-generated film · fictional business scenario featuring Mike Mote.

The page provides a concise text summary for visitors who cannot or do not watch the film. Burned-in typography uses high contrast, safe margins, and sufficient hold time. The video is decorative only where equivalent text is present; otherwise its surrounding figure and caption communicate the story.

## 11. Verification

Automated contracts must prove:

- the opener appears before the detailed operating story;
- the old pressure image and lower quiet desk film are absent;
- both responsive video files and the poster exist locally;
- media metadata, hashes, faststart, and no-audio state match the manifest;
- Motion off pauses playback and preserves the poster;
- reduced motion defers video loading;
- Replay appears only after completion and works;
- stale playback failures cannot override a newer opt-in;
- no external resource URLs or generated interface assets are introduced;
- the three Mote Ops Studio studies and Care Hub hierarchy remain unchanged.

Browser verification covers:

- 1440×1000 desktop;
- 390×844 mobile;
- normal and reduced motion;
- initial autoplay, offscreen pause, return resume, completion, and Replay;
- pressure-label legibility;
- hero and booking-action visibility;
- Care Hub handoff;
- no console errors, warnings, overlays, or horizontal overflow.

Media review covers frames and transitions throughout all 24 seconds, with explicit checks for identity drift, hand defects, object continuity, generated text, logos, UI artifacts, and beach-shot plausibility.

## 12. Release boundary

The new film is integrated only into the isolated `moteops-cinematic-review` preview after it passes local review. It is not published to `moteops.tech`, promoted, shared on social channels, or used in advertising without a separate explicit approval after Mike reviews the protected desktop and phone preview.
