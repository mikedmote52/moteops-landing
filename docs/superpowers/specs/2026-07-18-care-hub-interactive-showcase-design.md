# Mote Ops Care Hub Interactive Showcase Design

Date: 2026-07-18
Status: Approved direction, implementation pending

## Purpose

Replace the homepage's robotic, tile-led demonstration experience with a faithful, interactive version of the actual CC's Care Hub.

Visitors should be able to explore a convincing business environment, understand what Mote Ops built around CC's workflow, and immediately see how the same operating-hub pattern can be adapted for other small businesses.

The showcase must demonstrate working interface behavior without implying that fictional records, prototype connections, or unmeasured client outcomes are live production proof.

## Primary Visitor Story

1. See the actual CC's Care Hub interface rather than a generic AI diagram.
2. Understand that the Care Hub brings enrollment work into one calm operating environment.
3. Explore realistic views and controls using fictional demo records.
4. Recognize that Mote Ops can build the same class of system around another business's workflow.
5. Start a fit conversation about one operational bottleneck.

## Homepage Structure

### Demonstration Introduction

Replace the current gallery framing with:

- Eyebrow: `A WORKING SMALL-BUSINESS ENVIRONMENT`
- Heading: `Step inside something we built.`
- Supporting copy: `CC's Care Hub turns scattered enrollment work into one clear place for families, tours, forms, follow-up, and director decisions. Explore the demonstration below.`

The truth disclosure becomes one quiet line near the environment:

`Interactive demonstration using fictional family records. The Care Hub workflow and interface are real; client results are still being measured.`

This replaces repeated phrases such as `synthetic public data`, `working pattern`, `what this proves`, and `no live connection to Mike's Mac`.

### Interactive Care Hub Environment

The first and default demonstration is a faithful homepage adaptation of the actual Care Hub source at:

`/Users/michaelmote/Documents/Codex/2026-07-11/yes-the-easiest-way-is-to/work/ccs-care-hub`

The visual language must match the existing Care Hub:

- deep green navigation
- warm cream workspace
- Fraunces editorial headings
- coral, sage, blue, and gold status accents
- rounded white operational cards
- calm spacing and soft shadows
- CC's identity and Care Hub naming

The default `Today` view includes:

- `Good morning, CC's`
- enrollment, tour, forms, and placement metrics
- `Keep every family moving` follow-up queue
- `A personal path to enrollment` director-focus panel
- next scheduled tour card

Visitors can navigate through these meaningful demo areas:

- Today
- Families
- Enrollment pipeline
- Tours
- Required forms
- Classroom placement
- Modules
- Integrations
- Discovery

The showcase should reuse the real Care Hub labels, fictional records, and visual hierarchy instead of inventing a simplified parallel design.

### Interaction Contract

Every visible interactive control must perform a local, reversible action.

Required interactions:

- switch between the main Care Hub views
- open a metric into the relevant family workflow
- mark follow-up tasks complete and restore them
- navigate enrollment stages and family profiles
- inspect tour information
- toggle fictional required-form completion
- inspect classroom placement
- open the prototype guide

Retain additional source interactions only when they support the visitor story without requiring setup knowledge. Exclude source controls that primarily support prototype development, such as discovery export and adding arbitrary demo leads. No interaction may send messages, mutate external systems, expose client data, or claim a production effect.

The demo state remains in the browser session only. Reloading restores the fictional starting state.

### Adaptation Bridge

Immediately after the Care Hub environment, add:

- Eyebrow: `THE PATTERN TRAVELS`
- Heading: `We build around the way your business actually works.`
- Copy: `CC's needed one place for family inquiries, tours, forms, follow-up, and classroom decisions. Your version may organize submissions, service calls, patient intake, client requests, or office approvals. The workflow changes. The approach stays practical.`

Show four concise adaptations:

- Insurance office: clients, submissions, underwriter follow-up, renewals
- Home services: missed calls, estimates, scheduling, customer follow-up
- Clinic or care practice: intake, documents, appointments, handoffs
- Professional office: requests, files, approvals, deadlines

These are adaptation examples, not claims of completed installs.

End with a direct action:

`Show Mike the part of your business that feels scattered.`

## Existing Demonstrations

The current Operator, private-document, and lead demonstrations must not appear as equal, stale tiles before the Care Hub.

Move them into one collapsed `More examples` section after the Care Hub adaptation bridge. Opening that section presents one example at a time without a grid of equal-weight tiles.

The Care Hub remains the primary environment and receives the page's visual emphasis.

No current working demonstration may be left behind as a visible control that does nothing.

## Responsive Behavior

### Desktop

Present the Care Hub as a wide application environment with:

- persistent left navigation
- full metric row
- follow-up queue and director-focus split
- spacious workspace matching the actual application

### Tablet

Move navigation to a compact horizontal rail.
Keep metrics in two columns.
Stack the queue and director-focus sections when width requires it.

### Phone

The phone experience must be a real responsive application, not a scaled-down desktop screenshot.

- CC's identity and demo status stay visible at the top.
- Main navigation becomes horizontally scrollable view controls.
- Metrics use a two-column grid.
- Follow-up rows become readable stacked cards.
- Director focus and next-tour content follow the queue.
- Family pipeline stages scroll horizontally only where the workflow requires it.
- Touch targets remain at least 44 pixels.
- No horizontal page overflow is permitted.
- Copy avoids internal implementation language and long disclaimer blocks.

## Visual Tone

The experience should feel:

- warm
- calm
- capable
- human
- specific to a real business

It should not feel:

- like an AI control panel
- like a developer console
- like a grid of feature cards
- like a technical proof document
- like a generic SaaS template

Motion should be limited to meaningful view transitions, status completion, and panel entrance. Reduced-motion preferences must be respected.

## Truth And Proof Boundaries

Allowed:

- `Built around a real CC's Learning Center workflow`
- `Interactive demonstration`
- `Fictional family records`
- `The workflow and interface are real`
- `Client results are still being measured`
- `Mote Ops can adapt this pattern to other businesses`

Not allowed:

- completed or measured client outcome claims without evidence
- claims that integrations shown as placeholders are connected
- claims that other industry adaptations are completed client installs
- claims that the demo sends messages or changes external records
- production or reliability claims not supported by current audited evidence

## Technical Design

The Mote Ops landing page remains a static site.

The Care Hub showcase is implemented as an isolated homepage component using semantic HTML, scoped CSS, and local JavaScript state. It reuses the source application's information architecture, visual tokens, fictional records, and interaction behavior without embedding the protected `care.moteops.tech` deployment.

This avoids:

- the current `401` protection on the Care Hub deployment
- cross-origin iframe restrictions
- a desktop iframe that degrades on phones
- dependence on an external runtime for the public homepage

The component must not make network calls. Existing site tests must be updated to verify the new structure and local-only behavior.

## Verification

Before release:

- all static contract and behavior tests pass
- every visible Care Hub control is exercised
- desktop rendering is checked at 1440 by 900
- phone rendering is checked at 390 by 844
- no horizontal overflow exists
- no browser errors occur
- reduced-motion behavior is checked
- external links remain valid
- the demonstration makes no network request
- truth labels match the approved wording
- the current user-owned CC's concept-image CSS work remains preserved unless it directly conflicts with this approved design

## Release And Reversal

The current production version remains recoverable through Git history.

Implementation should be committed as a focused change and deployed only after local verification. If the result is rejected, the prior production commit remains available for immediate redeployment without destructive history rewriting.
