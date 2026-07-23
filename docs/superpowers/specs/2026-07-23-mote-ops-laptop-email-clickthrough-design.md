# Mote Ops Laptop Email Clickthrough Design

**Status:** Approved design, awaiting written-spec review  
**Date:** 2026-07-23  
**Owner:** Mike Mote  
**Surface:** `moteops.tech` homepage opening film  
**Production boundary:** No generation credits and no production deployment.

## 1. Purpose

Make the Mote Ops discovery moment read as one continuous action inside the overwhelmed owner's office.

The current film cuts from the actor's green laptop to a different desktop monitor. That change breaks spatial continuity and makes the Mote Ops invitation look like a separate website panel. The revision keeps the discovery, email, and clickthrough on the laptop already in front of the actor.

## 2. Approved story sequence

1. The owner struggles through the existing chaotic office scene.
2. He turns his attention to the laptop already on his desk.
3. A realistic email inbox appears on that laptop screen.
4. A new Mote Ops message is visible and becomes the focus.
5. The message opens on the same laptop.
6. The actor clicks **See how Mote Ops can help**.
7. The laptop loads `moteops.tech`.
8. The existing organization and cleanup sequence begins.
9. The controlled-work outcome and beach ending remain intact.

The viewer must be able to follow the cause and effect without explanatory captions: the owner sees an email, opens it, visits Mote Ops, gets the work under control, and gets his time back.

## 3. Email content

The email must be brief enough to read during the shot.

- **Sender:** Mote Ops
- **Subject:** AI could help your business. Where do you start?
- **Preview/body:** Mote Ops finds the work AI can take off your plate.
- **Primary link:** See how Mote Ops can help
- **Destination shown after click:** `moteops.tech`

No additional marketing paragraphs, fake testimonials, pricing, or decorative claims are added.

## 4. Physical laptop treatment

The email and website must appear inside the actor's actual green-screen laptop in the original office footage.

The composite must:

- follow the laptop screen's perspective as the camera changes from the angled office view to the frontal close-up;
- stay within the physical display bezel;
- preserve the original room, desk, actor, papers, phone, and laptop hardware;
- match the scene's exposure, contrast, slight screen softness, reflections, and depth of field;
- avoid a perfectly clean full-frame interface that could be confused with the surrounding homepage;
- remain readable at the film's mobile display size.

The angled and frontal laptop views may use separate tracked screen treatments. The transition between them must still feel like the same email on the same computer.

## 5. Interaction and timing

The discovery beat uses the available breakdown footage through its frontal laptop close-up instead of cutting away when the green screen first appears.

The screen action is:

1. **Inbox recognition:** the angled laptop shows a recognizable inbox with the Mote Ops message highlighted.
2. **Opened email:** the frontal laptop close-up shows the short email.
3. **Clickthrough:** a restrained cursor moves to **See how Mote Ops can help**, the link visibly depresses, and the laptop loads a compact `moteops.tech` landing view.
4. **Cleanup handoff:** the landing view transitions into the existing Mote Ops organization screens.

The click is communicated by the cursor and link response on the actor's laptop. The revision does not invent an unsupported close-up of the actor's hand.

Timing targets:

- the inbox remains visible long enough to identify the sender and subject;
- the opened email receives at least 2.2 seconds of stable reading time;
- the click response remains visible for at least 0.35 seconds;
- the `moteops.tech` landing state remains visible for at least 1.2 seconds before the cleanup sequence;
- the controlled actor outcome and complete beach ending are not shortened.

If the available moving close-up is shorter than the required reading time, the final clean laptop frame may be held with a restrained local camera push. The screen remains live during the hold so the cursor and clickthrough can occur without creating a frozen-looking scene.

## 6. Local production architecture

This revision is a deterministic local composite:

- create dedicated inbox, opened-email, and landing-page plates in HTML and CSS;
- capture those plates at a resolution suitable for the laptop screen;
- perspective-map the plates into the green area of the accepted source footage;
- use separate geometry for the angled and frontal laptop segments;
- retain edge shading, screen texture, and scene lighting above the inserted content;
- assemble the revised sequence with the existing local media pipeline;
- rebuild the 1080p, 720p, poster, and media-manifest outputs.

No Higgsfield or Seedance generation is required. The accepted actor footage, later cleanup material, and beach footage remain the source of truth.

## 7. Website behavior

Only the film content changes. The surrounding homepage player retains:

- its current contained desktop and mobile dimensions;
- Motion on/off behavior;
- play-once and replay behavior;
- poster and reduced-motion fallbacks;
- existing adjacent written explanation;
- no horizontal overflow.

The email's link is part of the film narrative. It is not presented as a live clickable control in the webpage player.

## 8. Verification

The revision is complete only when:

- the email is visibly contained inside the actor's laptop in the original room;
- the screen content follows the laptop perspective without spilling over the bezel;
- the same Mote Ops message remains continuous from angled inbox to frontal email;
- sender, subject, short preview, and primary link are readable on desktop and phone;
- the viewer can see the cursor click **See how Mote Ops can help**;
- `moteops.tech` visibly loads on the same laptop before the cleanup sequence;
- the screen composite retains believable softness, reflections, and scene lighting;
- there is no cut to the previous unrelated desktop-monitor mockup;
- the cleanup outcome and full beach payoff remain present;
- 1080p and 720p versions have matching story timing and no audio;
- automated site tests, media-integrity checks, reduced-motion behavior, desktop review, mobile review, and frame-boundary review pass.

## 9. Release boundary

Implementation may produce a protected preview for review.

It may not:

- spend generation credits;
- replace accepted actor footage with generated footage;
- merge the revision branch;
- publish the revision to `moteops.tech`;
- change hosting access or sharing settings.

Production remains unchanged until Mike reviews the revised film and explicitly approves publishing it.
