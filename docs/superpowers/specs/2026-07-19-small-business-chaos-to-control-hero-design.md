# Mote Ops Small-Business Chaos-to-Control Hero Design

Date: 2026-07-19
Status: Approved direction

## Purpose

Replace the current single composite hero image with a human, credible transformation story. A visitor should immediately recognize the experience of operating a small business through missed calls, email, text messages, spreadsheets, calendars, invoices, and memory. The page should then show how Mote Ops connects those existing systems and turns scattered signals into one supervised operating view.

The hero must lead naturally into the real interactive CC's Care Hub demonstration. It must not use a second fake dashboard as proof.

## Visitor Story

The sequence has three states:

1. `The business is everywhere.` A realistic over-the-shoulder scene shows one owner at a desk. A phone is visibly ringing. The computer and surrounding work communicate missed calls, an overloaded inbox, unanswered text messages, a scheduling conflict, an overdue invoice, and a spreadsheet issue. The owner is visibly overloaded, but the scene remains believable rather than theatrical.
2. `Mote Ops connects what you already use.` A short interface-led transition identifies the existing inputs: calls and texts, email, calendar, files and spreadsheets, and finance. Those inputs flow through a supervised Mote Ops layer that organizes context, prepares work, and preserves approval boundaries.
3. `One calm place to decide what happens next.` The story resolves by pointing directly into the live CC's Care Hub demonstration already on the page. The visitor can then interact with the real demo workspace rather than inspecting another rendered mockup.

## Structure

### Hero Copy

Keep the current positioning and primary booking action. Replace the right-side composite figure with the transformation story.

The first scene carries only a concise framing line and small, specific pressure signals. It should not place detailed UI text inside the generated photograph. Readable notification labels are implemented in HTML so they remain accurate, responsive, and accessible.

### Overwhelmed Owner Scene

Create one photorealistic, editorial image with:

- camera behind and slightly above the owner
- a normal small-business office, not a futuristic control room
- one primary monitor, one laptop, and a phone on the desk
- the phone clearly in an incoming-call state
- papers, notebook, and ordinary work materials
- natural daylight and restrained color
- enough negative space for HTML notification overlays

The visible signals should represent:

- 4 missed calls
- 37 unread emails
- 6 unanswered texts
- 2 calendar conflicts
- 1 overdue invoice
- a spreadsheet that needs review

The image must avoid legible generated text, branded software interfaces, multiple workers, luxury office styling, and exaggerated disaster imagery.

### Connection Layer

The second state is code-native HTML and CSS, not a generated image. Five source signals move into a centered Mote Ops processing rail:

- Calls + texts
- Email
- Calendar
- Files + spreadsheets
- Finance

The rail describes three bounded functions:

- organize incoming work
- prepare useful next steps
- hold consequential actions for approval

Motion is restrained and scroll-triggered. It visualizes connection and reduction, not autonomous action. Reduced-motion users receive the same information without animation.

### Proof Handoff

The final state does not introduce a generic result screen. It presents a short bridge:

`This is what “one calm place” looks like for CC's Learning Center.`

The bridge points into the existing interactive Care Hub section and provides one control:

`Explore the Care Hub`

The control scrolls to the Care Hub workspace and moves focus to its heading. The existing demo truth disclosure remains visible.

## Interaction

On desktop, the transformation occupies the right side of the hero and advances subtly with page scroll. The owner scene remains dominant; overlays enter in a readable sequence, then consolidate into the connection layer.

On phone, the story becomes three stacked sections. Nothing depends on hover or precision dragging. The generated scene uses a phone-specific crop through CSS, while all labels remain real HTML.

Every control must work. No fake ringing sound, fake live data, fake account connection, or dead dashboard control is permitted.

## Visual Direction

The photography should feel like a candid editorial business photograph. The interface layer should use the existing Mote Ops cream, soot, forest, copper, and signal colors, with fewer borders and less diagram-like density than the current composite.

The emotional progression is:

- pressure
- clarity
- control

Avoid generic AI gradients, glowing neural networks, chatbot imagery, floating holograms, and dense SaaS tiles.

## Truth Boundaries

The hero is an illustrative scenario using fictional information. It may demonstrate the common operational pattern Mote Ops is built to address.

It may not claim:

- that the displayed accounts are live
- that every source integrates automatically
- that Mote Ops has measured outcomes for CC's
- that messages, payments, scheduling changes, or customer actions occur without approval

The Care Hub remains labeled as an interactive demonstration with fictional family records and unmeasured client results.

## Technical Design

The static homepage receives:

- one versioned photorealistic image asset under `assets/`
- an isolated `owner-story.css` stylesheet
- an isolated `owner-story.js` behavior file
- semantic transformation markup in `index.html`
- updated contract and behavior tests

No changes are required in the user-modified `site.css`. Existing hero assets remain in the repository for immediate rollback. A dedicated commit provides an additional Git rollback point.

The JavaScript uses `IntersectionObserver` to update story state and a normal anchor/focus handoff to the Care Hub. The experience remains complete when JavaScript is unavailable.

## Verification

Before completion:

- generated image is visually inspected for realistic composition and artifacts
- all contract and behavior tests pass
- the static build passes
- the local page loads at port 8008
- the transformation is checked at 1440 by 900
- the transformation is checked at 390 by 844
- there is no horizontal page overflow
- the Care Hub handoff works
- reduced-motion behavior is present
- no browser console errors occur
- the prior hero remains recoverable through Git and retained assets
