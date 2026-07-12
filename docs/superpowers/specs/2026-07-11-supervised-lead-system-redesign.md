# Mote Ops Supervised Lead System Redesign

**Date:** 2026-07-11  
**Status:** Approved for implementation

## Objective

Rebuild `moteops.tech` so an owner of a 5–15 employee HVAC, plumbing, or electrical company understands within seconds that Mote Ops helps prevent new inquiries and follow-ups from disappearing between existing tools.

The website is a commercial test for a service business, not a SaaS product launch. It must make the complete diagnose → prove → install → support path clear, while demonstrating the supervised workflow with synthetic data and avoiding unproven results.

## Positioning

Primary promise:

> Mote Ops organizes every new inquiry, identifies what the customer needs, drafts the next response, and holds it for human approval—so leads do not disappear between inbox, voicemail, and scheduling software.

The audit is the on-ramp, not the finished product. Mote Ops may recommend configuring an existing tool, simplifying the process, building a supervised workflow, or leaving the workflow alone.

## Audience

Primary:

- HVAC businesses
- Plumbing businesses
- Electrical contractors
- Owner-operated teams with approximately 5–15 employees

Secondary fits such as landscaping and cleaning may be mentioned after the primary audience is established. Healthcare, legal, financial, and childcare workflows are not homepage target markets.

## First viewport

Headline:

> After-hours leads shouldn’t wait until Monday.

Supporting copy explains that Mote Ops reads inbound inquiries, organizes the facts, prepares the next response, and keeps a human responsible for every send.

Primary action: `Book a 30-minute fit call` → existing Calendly URL.

Secondary action: `Watch a lead move through the system` → connected demo.

The product visual is the first state of the working synthetic HVAC lead demonstration. It must be flat, legible, and labeled `Synthetic demonstration — sample data`.

## Connected interactive demonstration

One fictional after-hours HVAC lead moves through three user-controlled states. The demo never auto-plays.

### State 1: Lead arrives

Raw voicemail:

> Hi, it’s Dana. Our AC stopped working this afternoon, and it’s getting really hot. We have a newborn. Do you handle emergency calls?

The system extracts:

- Customer: Dana
- Request: AC not cooling
- Urgency: High
- Service address: Missing
- Callback preference: Missing

The page explains the urgency signal without collecting medical information.

### State 2: Intake completes

The system drafts a response asking only for the service address and callback preference. It explains that the case is held for owner review because urgency is high and required dispatch information is missing.

### State 3: Owner brief

Dana’s lead appears beside a stalled quote and a routine maintenance request. The visitor can:

- Approve a draft, changing its visible status without sending anything.
- Edit Dana’s draft in a real textarea and save the edit in page state.
- Skip an item, changing its visible status.
- Open `Why flagged?` to inspect the classification explanation.
- Reset the synthetic demo.

Every control must work with keyboard and touch. Status updates must be announced to assistive technology. Synthetic actions must never transmit data.

## Cost calculator

The calculator justifies the audit using visitor-controlled inputs, not generic ROI claims.

Inputs:

- Follow-ups per week
- Minutes per follow-up
- Hourly labor value
- Missed leads per month
- Average job value

Outputs:

- Annual follow-up labor burden: `followUps × minutes / 60 × hourlyValue × 50`
- Annual lead value at risk: `missedLeads × averageJobValue × 12`
- Combined annual friction
- $1,000 audit as a percentage of combined friction

Values are illustrative estimates, not guaranteed savings or revenue.

## Information architecture

1. Header: Demo, How it works, Pricing, Fit, Proof, booking action.
2. Hero: concrete missed-lead problem and demo state 1.
3. Connected demo: three states and real synthetic interactions.
4. Supervised loop: Catch → Understand → Draft → Human approves.
5. Cost calculator: visitor-specific friction math.
6. Recognizable symptoms: missed inquiries, stalled quotes, fragmented tools, owner-held follow-ups.
7. Engagement ladder:
   - Workflow Audit — $1,000
   - Micro-Sprint — $1,500–$2,500
   - Full Installation — $4,000–$6,000
   - 90-Day Support — $750/month, optional
8. Proof: accurately describe the CC’s Care Hub build as a real client project currently using demonstration data; show technical capabilities separately from measured outcomes.
9. Fit/non-fit: primary verticals and explicit excluded workflows.
10. Mike: accountable operator and maximum two new audits per month.
11. FAQ.
12. Closing booking and email actions.

## Proof and trust

- Do not call CC’s Care Hub a completed production workflow or claim measured results.
- Describe it as a real client build covering enrollment, tours, forms, follow-ups, and placement, presently using demonstration data while the operating workflow is validated.
- State that Mote Ops is establishing its first measured client results.
- Do not use testimonials without explicit client approval.
- Do not claim multiple customers, verified ROI, guaranteed revenue, autonomous sends, or local-only data handling.
- Every public demonstration uses synthetic data.
- Present the leave-it-alone verdict as a feature of the audit.
- State `I take on no more than two new workflow audits each month`; do not imply current availability or use countdown pressure.

## Conversion

Primary conversion is the existing Calendly fit call.

Secondary conversion is a functional `mailto:` link to `hello@moteops.tech` with a prefilled request for the diagnostic process. No unconnected form will appear.

The engagement ladder uses one shared booking action rather than separate checkout flows. It makes the post-audit path explicit without obligating the buyer to continue.

## Visual design

Preserve the current warm paper, ink, indigo, cyan, amber, Manrope, and DM Sans system. Preserve the editorial rules, restrained card craft, and dark rhythm sections.

Changes:

- Cap desktop hero typography so the working demo remains visible in the first viewport.
- Remove decorative card tilt.
- Use semantic status colors: amber = missing information, indigo = system action, cyan = neutral signal, green = approved.
- Use operational UI as the illustration; no robots, stock photos, or decorative product screenshots.
- Add restrained 120–180 ms state transitions and scroll reveals, disabled under reduced-motion preferences.
- Keep layouts spacious but reduce explanatory copy density.

## Responsive behavior

Desktop hero uses two columns. The connected demo becomes full width below the hero.

Mobile reading order is headline → supporting copy → CTA → demo. Demo panels stack vertically. The mobile booking action must never cover demo navigation or inputs. No horizontal overflow is permitted at 390 px.

## Verification

- Automated contract tests for copy, sections, price ladder, synthetic labels, proof boundaries, links, and local assets.
- Interaction tests for demo states, edit persistence, approve/skip/reset, calculator math, and mobile CTA accessibility state.
- Browser verification at 1440×1000 and 390×844.
- Keyboard, focus, native disclosure, reduced motion, live region, and contrast checks.
- Verify all visible controls perform their labeled action.
- Verify no browser console errors and no horizontal overflow.
- Verify live production content after GitHub Pages deployment.

## Success criteria

Within five seconds, the intended buyer can identify the missed-lead problem, supervised system, human approval boundary, working demo, and next action. Within one scroll, the buyer can operate the demo. Within the page, the buyer can understand the four engagement stages, prices, proof status, and fit boundaries without relying on FAQ copy.
