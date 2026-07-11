# Mote Ops Diagnostic-First Website Redesign

**Date:** 2026-07-11  
**Status:** Approved direction  
**Primary URL:** `https://moteops.tech`

## Objective

Replace the current broad “owned AI install” pitch with a credible, conversion-focused front door for Mote Ops. The site will sell one clear first engagement: a one-week, $1,000 workflow diagnostic for owner-led service businesses.

The page must help a qualified owner understand the offer, trust Mike's judgment, and book a 30-minute fit call without implying that Mote Ops has production capabilities or customer proof it cannot substantiate.

## Audience and positioning

The primary audience is an owner or operator of a small service business who feels recurring operational friction—missed follow-ups, manual intake, inbox overload, repeated copying, or disconnected tools—but does not yet know whether automation is worth buying.

Mote Ops is positioned as a hands-on AI operations consultancy. Its advantage is not access to a particular model or a catalog of software. It is Mike's ability to enter one real workflow, measure it, identify the safest useful intervention, and recommend a no-build answer when automation would not pay back.

## Offer

The primary offer is a fixed-scope workflow diagnostic:

- One workflow only.
- One working week.
- $1,000 fixed price.
- Observation and measurement of the current workflow.
- A written verdict: automate, simplify without AI, or leave it alone.
- A practical next-step plan with expected value, risk, and ownership boundaries.

The site will not sell a broad implementation package, self-serve product, hosted inbox system, AI receptionist, or no-subscription guarantee. Implementation can be discussed after the diagnostic, but it is not promised as the default outcome.

## Information architecture

The site is a single-page public marketing site with these sections:

1. **Navigation:** Mote Ops wordmark, Offer, Process, Fit, About, and a persistent booking action.
2. **Hero:** A concrete operational problem, the one-week diagnostic, the $1,000 price, and two actions: book a fit call or inspect the process.
3. **Problem framing:** Common observable symptoms in owner-led businesses, phrased without invented statistics.
4. **Diagnostic walkthrough:** A compact visual showing signal collection, workflow measurement, bottleneck analysis, and the final verdict. All example content is labeled illustrative.
5. **Deliverable:** A tangible example of what the owner receives, including current-state map, time/cost tally, risk notes, and recommendation.
6. **Fit and non-fit:** Clear qualification for suitable workflows and explicit exclusions for sensitive, regulated, or authority-heavy work.
7. **Process:** Fit call, one-week observation, verdict review, optional next step.
8. **Founder section:** Mike as the accountable operator, grounded in the actual Mote Ops practice and one active client engagement without logo inflation or testimonial claims.
9. **FAQ:** Access, privacy, what happens after the diagnostic, why not use ChatGPT directly, and what a no-build verdict means.
10. **Closing call to action:** Book a 30-minute fit call through the existing Calendly URL.

## Visual design

The presentation will feel like a confident independent operator rather than a generic AI startup:

- Warm paper background, dark ink typography, electric indigo as the primary action color, and restrained cyan/amber status accents.
- Editorial display typography paired with a highly readable sans serif.
- A wide, structured desktop composition and a compact mobile-first reading order.
- Operational artifacts—tallies, decision labels, and annotated workflow steps—used as proof of thinking rather than a fake live dashboard.
- Subtle entrance and hover motion that respects reduced-motion settings.
- No ambient animation that competes with the offer, no marquee ticker, no fake “live” status, and no decorative interface controls.

## Interaction behavior

- Every booking control opens `https://calendly.com/mikedmote/30min` in a new tab.
- In-page navigation scrolls to real sections and supports keyboard focus.
- FAQ disclosures work with keyboard and screen readers.
- A mobile sticky booking action appears only after the hero action leaves view and never covers core content.
- No forms, counters, calculators, refresh controls, or demos will be shown unless they perform a real, testable function.

## Trust and claim boundaries

- The public page may state that Mote Ops currently has one active client engagement, but it will not imply multiple customers, quantified ROI, production scale, or verified testimonials.
- Any workflow example is explicitly illustrative or based on anonymized patterns, not presented as live customer data.
- Privacy language will state that access is scoped during the diagnostic and that sensitive or regulated workflows may be declined. It will not claim that data always stays local, is never copied, or that all tools run only in client-owned infrastructure.
- The site will not use “Billion-Dollar Solo Operator” or related private goal language.
- The page will not publish unsupported industry statistics or pricing comparisons.

## Technical approach

The improved demo will be implemented as a self-contained static site in the existing `moteops-landing` repository. This preserves the current GitHub Pages and custom-domain deployment path while minimizing runtime and maintenance risk.

HTML will provide semantic structure, CSS will own layout and motion, and a small progressive-enhancement script will manage the mobile booking visibility and any presentation-only state. The page will remain useful with JavaScript disabled.

## Verification

Before delivery or publication:

- Validate all internal anchors and external links.
- Verify every visible control performs the action its label implies.
- Check desktop and phone layouts, including horizontal overflow and sticky-action overlap.
- Check keyboard navigation, focus visibility, heading order, contrast, reduced motion, and FAQ semantics.
- Confirm the copy contains no unsupported customer, privacy, product-maturity, ownership, or ROI claims.
- Run the repository's available checks and inspect the rendered page in a browser.
- Build the demo locally first. Production publication requires a final comparison against the current site and confirmation that the custom-domain deployment path is intact.

## Success criteria

The redesign succeeds when a qualified owner can answer these questions within one minute:

1. What does Mote Ops sell first?
2. What does it cost and how long does it take?
3. What will I receive?
4. What kinds of work are a fit or not a fit?
5. What is the next action?

The page has one primary conversion metric: completed fit-call bookings originating from `moteops.tech`.
