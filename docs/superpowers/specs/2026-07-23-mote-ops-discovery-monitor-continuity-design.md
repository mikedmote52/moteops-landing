# Mote Ops Discovery-Monitor Continuity Design

**Status:** Awaiting written-spec approval
**Date:** 2026-07-23
**Owner:** Mike Mote
**Surface:** `moteops.tech` homepage opening-film revision
**Production boundary:** No Higgsfield generation, credit spend, or live-site change.

## 1. Purpose

Strengthen the moment when the overwhelmed business owner discovers Mote Ops.

The current edit moves too quickly from the actor's stress into the discovery email. The email also fills the film frame, so it can be mistaken for part of the surrounding website. The revision must let the actor's attention settle on his computer, then reveal the Mote Ops email as content on that same physical monitor.

## 2. Approved story order

The revised film follows one continuous cause-and-effect sequence:

1. The business is visibly chaotic and the owner is overwhelmed.
2. The owner stops, notices something on his computer, and looks at the monitor.
3. The camera makes a restrained push toward that monitor.
4. The Mote Ops discovery email appears inside the physical monitor.
5. The existing Mote Ops organization, calendar, review, and approval screens follow inside the same monitor treatment.
6. The camera pulls back to the owner after the work is controlled.
7. The existing beach ending shows the free time Mote Ops gave back.

The cleanup and beach scenes remain complete. The revision adds time instead of removing time from the outcome.

## 3. Actor-attention beat

The actor-looking shot uses the accepted cleanup footage at normal speed.

- Extend the current actor-attention beat from 1.4 seconds to 2.6 seconds.
- The added 1.2 seconds must show natural actor motion, not a freeze frame or artificial slow motion.
- Use the first 2.6 seconds of the accepted cleanup source for this beat.
- Keep the existing later actor segment from source time 5.8 through 8.0 seconds for the pull-back and pre-beach beat.
- Do not reuse overlapping source frames.

The longer beat gives the viewer time to understand that the actor has found something useful on his own screen.

## 4. Discovery email inside the monitor

The existing discovery-email design and copy remain unchanged. It is no longer shown as a full-film-frame plate.

Render the discovery email through the same deterministic physical-monitor capture surface used by the four cleanup interfaces:

- the same accepted office background;
- the same 1,344-pixel outer monitor width in the 1920-pixel master;
- the same bezel, perspective, glass reflection, edge shading, and rightward bias;
- the same visible desk and office context;
- the same title-safe placement;
- no floating browser chrome, decorative glow, invented controls, or generated text.

The monitor, office, and screen geometry must remain visually continuous when the discovery email changes to the later Mote Ops interface screens.

## 5. Motion and exact timeline

The master remains 24fps. Push and pull transitions remain seven frames, or 0.291667 seconds.

| Time | Beat | Treatment |
|---|---|---|
| 0.0 to 5.8 | Chaos | Existing accepted stress footage |
| 5.8 to 8.108333 | Actor notices screen | Accepted cleanup footage at normal speed |
| 8.108333 to 8.4 | Push into monitor | Seven-frame scale, position, blur, and dissolve transition |
| 8.4 to 10.6 | Discovery email | Full 2.2-second stable hold inside physical monitor |
| 10.6 to 12.4 | Organized work | Existing interface, 1.8-second stable hold inside monitor |
| 12.4 to 14.2 | Calendar resolved | Existing interface, 1.8-second stable hold inside monitor |
| 14.2 to 16.0 | Review prepared | Existing interface, 1.8-second stable hold inside monitor |
| 16.0 to 17.8 | Approval queue | Existing interface, 1.8-second stable hold inside monitor |
| 17.8 to 18.091667 | Pull back to actor | Seven-frame scale, position, blur, and dissolve transition |
| 18.091667 to 20.0 | Controlled outcome | Existing accepted actor footage |
| 20.0 to 28.0 | Beach | Existing complete eight-second beach ending |

The push begins only after the actor has held his attention on the computer for more than two seconds. The discovery email then has a complete 2.2-second stable reading plateau. The four later interface states retain their complete 1.8-second plateaus.

The expected encoded duration is approximately 28 seconds. At 24fps, the deterministic media pipeline may report 27.991667 seconds because of frame accounting. Either value is acceptable if every boundary above is within one frame.

The existing beach captions shift 1.2 seconds later with the beach scene:

- first beach caption: 24.2 to 28.0 seconds;
- second beach caption: 26.0 to 28.0 seconds.

## 6. Local production architecture

The revision is deterministic and local:

- add `discovery-email` to the existing monitor capture allowlist;
- render a fifth 1920 by 1080 monitor-composite PNG;
- remove the full-frame discovery-email segment from its current position;
- reorder the edit to place the extended actor-attention shot before the discovery composite;
- preserve the four approved cleanup monitor composites;
- preserve the existing cleanup-to-actor pull-back;
- shift the beach and its captions by 1.2 seconds;
- rebuild the existing 1080p, 720p, poster, and manifest outputs.

No new generated actor footage is required. No existing generated footage is altered.

## 7. Website and accessibility behavior

The surrounding homepage and player remain unchanged:

- maximum player width of 1,180 pixels on desktop;
- approximately 358 pixels wide in a 390-pixel mobile viewport;
- no horizontal overflow;
- existing Motion control, play-once behavior, replay behavior, poster fallback, and reduced-motion behavior;
- existing silent-film disclosure and adjacent written explanation.

The discovery email and later interfaces must read as monitor content at desktop and phone sizes. The film remains understandable even when motion is disabled or playback fails.

## 8. Verification

The revision is complete only when all of the following pass:

- the actor's attention beat lasts 2.6 seconds and uses natural-speed footage;
- the push begins after the actor has looked at the screen for more than two seconds;
- the discovery email is bounded by the same physical monitor as all four later interfaces;
- the discovery email has a full 2.2-second stable reading plateau;
- each later interface has a full 1.8-second stable reading plateau;
- the push and pull each last seven frames;
- the controlled actor outcome and complete eight-second beach ending remain present;
- the master duration is approximately 28 seconds, with a one-frame boundary tolerance;
- 1080p and 720p outputs have matching story timing and no audio;
- desktop review at 1,440 by 1,000 shows a smaller, properly contained player and clear monitor context;
- mobile review at 390 by 844 keeps the discovery headline and primary interface actions readable;
- reduced-motion, replay, Motion-control, automated site tests, static build, media-integrity checks, and frame-boundary review pass.

## 9. Release boundary

Implementation may create a new protected preview in the existing isolated review project.

It may not:

- spend Higgsfield credits;
- generate replacement video;
- alter Vercel access or sharing settings;
- merge the revision branch;
- publish to `moteops.tech`.

Production remains unchanged until Mike reviews the revised protected preview and explicitly approves publishing it.
