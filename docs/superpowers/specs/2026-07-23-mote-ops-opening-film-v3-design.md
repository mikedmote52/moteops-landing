# Mote Ops Opening Film V3 Design

## Purpose

Replace the current 28-second homepage film with a continuity-controlled, silent-first commercial that clearly shows how Mote Ops helps an overwhelmed business owner regain control of the day.

The replacement must fix the current film's visible defects:

- objects must not transform, disappear, or change identity while Mike handles them;
- the discovery of Mote Ops must be slow and readable;
- the invitation, onboarding, cursor movement, and review workflow must look like a real computer interaction;
- the interface sequence must show what Mote Ops actually prepares;
- the calm office must be the same physical office as the chaotic office;
- Mike's identity, wardrobe, glasses, hair, beard, and body proportions must remain consistent;
- tattoos must not bleed through office clothing;
- the beach scene may intentionally show Mike's tattoos;
- the opening must use one restrained text treatment rather than unrelated floating labels.

The live film remains unchanged until the replacement has passed review and Mike explicitly approves production.

## Approved Direction

The film uses a continuity-controlled hybrid approach:

- Seedance 2.0 creates Mike's performance, camera movement, coworkers, office atmosphere, and beach scene.
- Real Mote Ops interfaces are built locally in HTML and CSS, captured deterministically, animated with a real cursor path, and perspective-tracked into the physical laptop and phone.
- Seedance is not asked to generate readable interface text.
- The commercial is silent-first and must communicate completely without audio.

This approach is preferred over a fully generated film because readable screens, cursor behavior, device geometry, and approval states must remain exact. It is preferred over repairing the current edit because the current wardrobe, office, pacing, and object continuity problems span the whole film.

## Runtime and Story Structure

The target runtime is exactly 50 seconds. The sequence is divided into seven independently reviewable shots.

### Shot 1: Chaos, 0:00–0:06

The camera observes Mike in a busy small-business office. He wears a charcoal long-sleeve button-down shirt with both cuffs fully buttoned, dark trousers, and his usual glasses. His tattoos are completely covered.

Mike handles only stable props: a desk phone, mouse, keyboard, and laptop. Paper stacks may be visible but Mike does not shuffle books, pens, folders, or loose objects. Employees in the background wait for answers and continue working. The stress comes from performance, device activity, and accumulating work, not from frantic camera movement or transforming props.

One restrained three-line caption appears as a single composition:

> Meetings stack up.
> Your inbox keeps growing.
> Calls get missed.

There are no floating alert boxes, scattered labels, glowing effects, or generated interface text.

### Shot 2: Discovery, 0:06–0:14

Mike pauses during the pressure, notices a new Mote Ops email on his laptop, and reads it. His reaction must be visible before the camera moves.

The timing is deliberate:

- two seconds for Mike to notice the invitation;
- three seconds for Mike and the viewer to read it;
- two seconds for the cursor to move toward the call to action;
- one second for the click response and camera handoff.

The camera makes a slow, natural push toward the laptop while preserving the laptop bezel and physical office context.

The email interface contains:

- subject: `Drowning in the work? Start here.`
- sender: `Mote Ops`
- message: `Mote Ops organizes email, meetings, calls, leads, and financial review around the tools you already use.`
- button: `See how Mote Ops can help`

The click leads into the Mote Ops onboarding interface.

### Shot 3: Onboarding, 0:14–0:19

The onboarding remains inside the same physical laptop. It asks only:

1. Which tools do you use?
2. What work is taking the most time?
3. Which actions must wait for your approval?

Mike selects email, calendar, calls and leads, and financial review. Approval boundaries are visibly enabled by default. The interface uses plain language and does not expose technical implementation details.

### Shot 4: Inbox and Calendar Review, 0:19–0:27

Mike reviews two realistic prepared-work views, with approximately four seconds per view.

Inbox:

- `286 messages organized`
- `18 replies prepared`
- each reply remains a draft until approved;
- the source message and prepared response are visibly connected.

Calendar:

- `3 conflicts resolved`
- `2 changes ready`
- each proposed schedule change identifies the original conflict and remains waiting for approval.

Mike moves the cursor naturally, reads the prepared work, and approves it. Buttons show visible pressed and completed states.

### Shot 5: Calls, Leads, and Financial Review, 0:27–0:35

Mike reviews two more views, again with approximately four seconds per view.

Calls and leads:

- `7 missed calls summarized`
- `4 follow-ups prepared`
- each summary identifies the caller, time, and requested next step.

Financial review:

- `5 exceptions summarized`
- `2 items need review`
- Mote Ops prepares the review and highlights exceptions;
- Mote Ops does not move money, initiate payments, or imply autonomous financial action.

Mike approves the prepared work after reviewing it.

### Shot 6: Control Restored, 0:35–0:42

The final dashboard reads:

> Pending tasks: 0
> You're clear for the day.

Mike exhales, closes the laptop, and looks relieved. The office is the same room from Shot 1, with the same desk, shelves, windows, employees, and camera geography. The desk is orderly, the lighting is softer, and the employees are relaxed and visibly moving through their work. Mike gets up and leaves the workspace.

The room must not become a different office. Control is communicated through staging, behavior, surface organization, and light.

### Shot 7: Beach Payoff and CTA, 0:42–0:50

Mike is at the beach in a white short-sleeve linen shirt. His tattoos may be visible, but their placement and appearance must be consistent with his supplied references. The wardrobe change is intentional and occurs only after he leaves the office.

Mike looks down at his phone. The tracked phone interface reads:

> Mote Ops
> Pending tasks: 0
> Enjoy your day.

The established closing copy remains:

> Mote Ops cleaned up the work.
> Mike found the beach.

Supporting line:

> Your people and tools already do the work. We help them work as one.

Closing call to action:

> Book your consultation today.
> Free 30-minute consultation to see what Mote Ops can do for you.

The copy must remain readable within the final hold and must not cover Mike's face, phone, or tattoos.

## Identity, Wardrobe, and Environment Continuity

One Mike identity reference is used across the complete film. The reference set must prioritize straight-on face detail, three-quarter face detail, body proportions, glasses, beard, hair, and real tattoo placement.

Office rules:

- charcoal long-sleeve button-down shirt;
- sleeves and cuffs fully closed;
- no visible tattoos;
- no tattoo texture beneath or through the shirt;
- same glasses, beard length, haircut, body proportions, and age;
- same office environment and employee cast across Shots 1 through 6.

Beach rules:

- white short-sleeve linen shirt;
- tattoos visible only where the shirt naturally exposes them;
- tattoo placement grounded in Mike's reference photographs;
- same face, beard, hair, glasses state, body proportions, and age as the office sequence.

The accepted current office footage may serve as an environment and composition reference, but none of its object morphing or rushed action is preserved. A single office continuity anchor and a single employee arrangement are carried through every office generation. The calm office uses the same anchor rather than a newly invented room.

## Cinematography and Visual Treatment

The visual language is natural, restrained, and professional:

- 16:9 composition;
- 24 frames per second;
- 1080p Seedance standard mode;
- silent output;
- natural 35mm and 50mm commercial framing;
- slow pushes and conventional over-the-shoulder coverage;
- no whip pans, orbiting cameras, artificial speed ramps, or exaggerated depth effects;
- neutral office whites and warm practical light;
- Mote Ops cream, deep green, and restrained rust accents only inside the interface and typography;
- no teal-orange grade, neon glow, holograms, particles, or generic AI imagery.

The chaotic office may be slightly cooler and flatter. The controlled office may be warmer and softer, but both must retain the same room geometry and time-of-day plausibility.

## Interface Production

The following interfaces are built as local, deterministic HTML and CSS views:

1. Mote Ops invitation email
2. onboarding
3. inbox review
4. calendar review
5. calls and leads review
6. financial review
7. final dashboard
8. beach phone notification
9. closing beach copy and consultation CTA

The interfaces use real browser typography, exact Mote Ops colors, restrained information density, and conventional application patterns. Every visible action must work inside the captured interface:

- cursor paths are deterministic;
- hover states appear before clicks;
- clicks produce pressed feedback;
- approval changes the item's status;
- the queue reaches zero only after Mike approves the prepared items.

Screen captures are perspective-warped to the measured device corners on every moving frame. Integration includes appropriate blur, brightness, screen falloff, reflections, and film grain so the interface looks emitted by the physical device rather than pasted over the website.

The interface must remain inside the laptop or phone bezel. Close views may push toward the screen, but enough physical bezel or room context remains to preserve spatial continuity.

## Trust and Claims

The film presents Mote Ops as preparing work for human review.

Allowed states include:

- prepared;
- organized;
- summarized;
- ready for approval;
- waiting for review;
- approved by Mike.

The film must not imply that Mote Ops autonomously:

- sends consequential messages;
- reschedules meetings without approval;
- contacts leads without approval;
- pays invoices;
- moves money;
- signs agreements;
- takes any irreversible external action.

The financial view is strictly read, organize, summarize, and prepare for review.

## Generation and Credit Control

Seven Seedance 2.0 performance plates are planned at 1080p standard mode:

| Shot | Duration |
| --- | ---: |
| Chaos | 6 seconds |
| Discovery | 8 seconds |
| Onboarding | 5 seconds |
| Inbox and calendar | 8 seconds |
| Calls, leads, and finance | 8 seconds |
| Control restored | 7 seconds |
| Beach payoff | 8 seconds |
| **Total** | **50 seconds** |

At the previously observed rate of nine credits per second, the estimated first pass is 450 credits. A 50 percent retry reserve produces a recommended provisional cap of 675 credits.

This is an estimate, not spending authorization. Every prompt must receive an exact Higgsfield cost preflight before generation. Mike must approve the exact cap after preflight. No generation may exceed the approved cap, and no retry may be submitted when the remaining cap cannot cover it.

Shots are generated and reviewed sequentially. A failed shot receives one-variable revisions. The changed prompt variable and reason for rejection are recorded before any retry.

## Review Gates

Every generated shot is reviewed at half-second intervals and at every cut boundary. High-motion hand, cursor, device, sleeve, face, and exit frames receive additional review.

A shot is rejected for any of the following:

- changing face, glasses, beard, hair, age, or body proportions;
- wardrobe drift;
- tattoos visible through office clothing;
- tattoos moving or changing in the beach scene;
- object transformation, disappearance, duplication, or identity change;
- malformed hands or physically impossible interaction;
- changing office geometry or employees;
- generated readable text or logos;
- laptop or phone geometry that cannot support a credible tracked interface;
- cursor movement that does not match Mike's hand behavior;
- autonomous consequential action;
- camera movement that obscures the story.

The assembled film must pass:

- exact 50-second duration;
- silent audio contract;
- 1920×1080 master and responsive 1280×720 derivative;
- H.264 fast-start encoding;
- local media hash ledger;
- desktop and phone browser playback;
- autoplay, play-once, Motion Off, Motion On, and Replay behavior;
- no horizontal overflow;
- no browser errors;
- readable invitation, onboarding, review states, phone message, end copy, and CTA;
- protected preview review before production.

## Rollback and Publication

The current production media stays intact while V3 is developed. New media uses separate source and review paths until final approval.

The first external deployment is a protected review preview. Publishing to `moteops.tech` requires Mike's explicit approval after he reviews the complete assembled film. If the V3 release is rejected after publication, the previous verified media and manifest remain available for rollback.
