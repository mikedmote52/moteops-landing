# Mote Ops Actor-Monitor Composite Design

**Status:** Awaiting written-spec approval
**Date:** 2026-07-23
**Owner:** Mike Mote
**Surface:** `moteops.tech` homepage opening-film revision
**Production boundary:** No Higgsfield generation, credit spend, or live-site change.

## 1. Purpose

Repair the transition between the actor looking at his computer and the four Mote Ops interface views.

The current cut replaces the entire film frame with a bright interface plate. Inside the website player, that plate can be mistaken for a new website section. The revision must make it unmistakable that the actor is reviewing Mote Ops on his own monitor.

## 2. Approved visual treatment

The four existing interface plates remain unchanged in content. Each plate is placed inside a realistic dark monitor frame built locally in post-production.

The composite uses:

- an accepted office frame from `shot-02-cleanup.mp4` as the surrounding environment;
- a 1,344-pixel-wide dark monitor bezel, exactly 70 percent of the 1920-pixel film width;
- the interface plate contained entirely inside the monitor screen;
- visible desk and office context around the monitor;
- a slight perspective treatment so the display belongs to the physical scene;
- restrained glass reflection and edge shading;
- mild background blur and dimming to keep the interface readable;
- no floating windows, invented controls, decorative glow, or generated text.

The monitor should feel physically present in the actor's workspace, not pasted on top of the website.

## 3. Composition

The monitor is centered with a slight rightward bias that follows the actor's gaze and the accepted cleanup footage.

At 1920 by 1080:

- outer monitor width target: 1,344 pixels;
- inner screen uses the largest possible 16:9 area inside the bezel;
- office context remains visible on every side;
- the monitor and its screen remain inside title-safe margins;
- the four interface headings and primary actions remain legible when the film is displayed at 358 pixels wide on a 390-pixel phone viewport.

The monitor frame uses a thin upper and side bezel plus a slightly deeper lower bezel. It does not add a stand or cover interface copy.

## 4. Motion and timing

The transition begins with the actor looking at the computer.

1. The camera makes a restrained seven-frame push toward the monitor.
2. The first interface composite becomes clear within the physical monitor.
3. Each of the four interface states receives a full 1.8-second readable hold.
4. The last state transitions through a restrained seven-frame pull back to the actor.
5. The accepted actor footage continues before the existing beach cut.

The push and pull use scale, position, blur, and dissolve together. The movement preserves the sense of one workstation and does not resemble a slide transition or full-screen website takeover.

The expected 24fps master duration remains 26.791667 seconds. Each transition is seven frames, or 0.291667 seconds. The 1.8-second reading plateaus are preserved by including the transition time outside those plateaus, not by shortening them or slowing the actor footage.

## 5. Local production architecture

The change is deterministic and local:

- keep the four current HTML/CSS interface sources;
- add one dedicated monitor-composite capture surface;
- derive the office background from the accepted cleanup source;
- render four 1920 by 1080 monitor-composite PNGs;
- update the FFmpeg assembly to use those composites and the approved transition timing;
- produce the existing 1080p, 720p, poster, and manifest outputs.

No new generated actor footage is required. The source video remains the accepted footage already paid for and disclosed.

## 6. Responsive website behavior

The website player dimensions approved in the previous revision remain:

- maximum width of 1,180 pixels on desktop;
- approximately 358 pixels wide in the 390-pixel mobile viewport;
- no horizontal overflow;
- the existing Motion control, play-once behavior, replay behavior, poster fallback, and reduced-motion behavior remain unchanged.

Only the content inside the film changes. The surrounding homepage layout does not change in this revision.

## 7. Accessibility and failure behavior

The film remains silent and decorative to the adjacent written story. Existing accessible text continues to explain the fictional scenario.

If motion is disabled or playback fails:

- the current poster remains visible;
- the page does not expose an inert transition control;
- the written operating-system explanation remains readable;
- no interface content is required to understand the page's core offer.

## 8. Verification

The revision is complete only when all of the following pass:

- every interface view is visibly bounded by the same monitor bezel;
- office or desk context is visible around all four views;
- no interface plate touches the outer edge of the film frame;
- each interface state has at least 1.8 seconds of stable readable time;
- the push-in and pull-back each last seven frames;
- the master duration is 26.791667 seconds, with a one-frame tolerance;
- 1080p and 720p outputs have matching story timing and no audio;
- desktop review at 1,440 pixels makes the monitor relationship clear;
- mobile review at 390 pixels keeps the major headings and actions readable;
- reduced-motion, replay, and Motion-control contracts still pass;
- automated site tests, static build, media integrity checks, and frame-boundary review pass.

## 9. Release boundary

Implementation may create a new protected preview in the existing isolated review project.

It may not:

- spend Higgsfield credits;
- generate replacement video;
- alter Vercel access or sharing settings;
- merge the revision branch;
- publish to `moteops.tech`.

Production remains unchanged until Mike reviews the revised protected preview and explicitly approves publishing it.
