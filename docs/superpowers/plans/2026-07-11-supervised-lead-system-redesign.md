# Mote Ops Supervised Lead System Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Mote Ops homepage around a working supervised HVAC lead demonstration, cost calculator, honest proof, and clear paid engagement ladder.

**Architecture:** Preserve the static GitHub Pages deployment. Replace the current document and stylesheet while keeping progressive behavior in one dependency-free `site.js`; use Node’s built-in test runner for the public contract and browser behavior for rendered verification.

**Tech Stack:** Semantic HTML, CSS, browser JavaScript, Node.js built-in tests, GitHub Pages.

## Global Constraints

- All demo data is synthetic and never transmitted.
- All sends and consequential actions remain human-approved.
- The site must work without JavaScript except for the interactive demo and calculator.
- Every visible control must perform its labeled action.
- Do not claim measured client ROI, multiple customers, full autonomy, or production readiness that does not exist.
- Preserve the existing Calendly URL and custom domain.

---

### Task 1: Redesign contract tests

**Files:**
- Modify: `tests/site-contract.test.mjs`
- Create: `tests/site-behavior.test.mjs`

- [ ] Replace the old diagnostic-first assertions with failing assertions for the home-service headline, connected demo, four-rung pricing, cost calculator, CC’s proof boundary, synthetic labels, capacity statement, and email action.
- [ ] Add failing script-contract assertions for the three demo states, edit/approve/skip/reset handlers, calculator formulas, accessibility live region, and sticky CTA state.
- [ ] Run `npm test` and confirm the old page fails for the missing redesign.

### Task 2: Product-led semantic page

**Files:**
- Replace: `index.html`
- Replace: `site.css`

- [ ] Build the approved information architecture and exact first-viewport promise.
- [ ] Build the three-state demo markup, supervised loop, calculator form, symptoms, ladder, proof, fit, founder, FAQ, and dual closing actions.
- [ ] Implement responsive styling with the approved visual system and semantic colors.
- [ ] Run `npm test` and resolve only structural and claim failures.

### Task 3: Interactive demo and calculator

**Files:**
- Replace: `site.js`

- [ ] Implement explicit demo-state rendering and step controls.
- [ ] Implement edit/save, approve, skip, why-flagged, and reset behavior without network requests.
- [ ] Implement calculator input parsing and exact annual-friction formulas.
- [ ] Preserve accessible sticky CTA behavior and add live-region announcements.
- [ ] Run `npm test` and confirm the full suite passes.

### Task 4: Package and rendered verification

**Files:**
- Update: `demo/supervised-lead-system/index.html`
- Update: `demo/supervised-lead-system/site.css`
- Update: `demo/supervised-lead-system/site.js`

- [ ] Copy the tested root assets into the standalone demo path.
- [ ] Run contract tests, link checks, static build, and diff checks.
- [ ] Test desktop and phone rendering, demo controls, calculator values, FAQ, navigation, Calendly and email targets, console errors, and overflow.
- [ ] Fix failures, rerun the complete verification, and commit the exact validated source.

### Task 5: Production publication

**Files:**
- No additional source changes.

- [ ] Push the verified commit to the existing GitHub Pages branch.
- [ ] Wait for both deployment workflows to pass.
- [ ] Verify the production title, headline, demo assets, and interaction script from `https://moteops.tech`.
