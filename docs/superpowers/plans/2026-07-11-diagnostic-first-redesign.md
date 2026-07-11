# Mote Ops Diagnostic-First Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current Mote Ops landing page with a tested, responsive, diagnostic-first marketing site that sells a one-week, $1,000 workflow diagnostic.

**Architecture:** Keep the existing static GitHub Pages architecture. Build the page as semantic HTML in `index.html`, with focused styling in `site.css` and progressive enhancement in `site.js`; validate the public contract with Node's built-in test runner.

**Tech Stack:** HTML5, CSS, browser JavaScript, Node.js built-in test runner, static GitHub Pages hosting.

## Global Constraints

- Preserve `https://moteops.tech` and the existing Calendly booking URL.
- Make every visible control functional and keyboard accessible.
- Use no fake live state, invented customer proof, unsupported ROI, or absolute privacy/ownership claims.
- Label all workflow examples as illustrative.
- Keep the core page useful when JavaScript is disabled.
- Support phone and desktop layouts and `prefers-reduced-motion`.

---

### Task 1: Public contract tests

**Files:**
- Create: `tests/site-contract.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: static `index.html`, `site.css`, and `site.js` files.
- Produces: `npm test`, which verifies the offer, claims, links, semantics, assets, and interaction hooks.

- [ ] Write Node tests that require one H1; the `$1,000`, one-week offer; the Calendly link; required section anchors; FAQ details; illustrative labels; referenced local assets; reduced-motion CSS; and the sticky CTA hook.
- [ ] Run `npm test` and confirm it fails because the redesigned contract is absent.
- [ ] Add the `test` script to `package.json` without changing the deployment scripts.
- [ ] Run `npm test` again and confirm the contract still fails on the old page.

### Task 2: Semantic marketing page

**Files:**
- Replace: `index.html`
- Create: `site.css`

**Interfaces:**
- Consumes: the public contract established by Task 1.
- Produces: a complete one-page site with anchors `offer`, `process`, `fit`, `about`, and `faq`.

- [ ] Build the navigation, hero, problem framing, diagnostic walkthrough, deliverable, fit/non-fit, process, founder, FAQ, and closing CTA sections.
- [ ] Use the exact offer: one workflow, one week, $1,000, and a written automate/simplify/leave-alone verdict.
- [ ] Use the existing Calendly URL for every booking control and mark examples illustrative.
- [ ] Implement responsive editorial styling, visible focus, strong contrast, scroll offsets, print-safe basics, and reduced-motion overrides.
- [ ] Run `npm test` and confirm all structural and content contract assertions pass.

### Task 3: Progressive interaction behavior

**Files:**
- Create: `site.js`
- Modify: `tests/site-contract.test.mjs`

**Interfaces:**
- Consumes: `#hero-booking`, `[data-sticky-cta]`, and internal hash links from `index.html`.
- Produces: sticky mobile booking visibility via `IntersectionObserver`, while leaving all navigation and FAQ behavior native.

- [ ] Add a failing contract test for the observer, `is-visible` class, and no-JavaScript-safe CTA markup.
- [ ] Run `npm test` and confirm the new test fails for missing script behavior.
- [ ] Implement the smallest script that toggles the sticky CTA only when the hero booking action is out of view.
- [ ] Run `npm test` and confirm the full suite passes.

### Task 4: Rendered verification and demo packaging

**Files:**
- Create: `tests/check-links.mjs`
- Create: `demo/diagnostic-first/index.html`
- Create: `demo/diagnostic-first/site.css`
- Create: `demo/diagnostic-first/site.js`

**Interfaces:**
- Consumes: the finished root site.
- Produces: a self-contained preview path and fresh verification evidence.

- [ ] Add link and local-asset checks that reject missing anchors, missing files, and non-working `href` values.
- [ ] Run the checker and fix any failures.
- [ ] Copy the tested page assets into `demo/diagnostic-first/` using formatting-safe filesystem copy commands.
- [ ] Start the existing local server and inspect desktop and phone viewports in the browser.
- [ ] Test navigation, FAQ disclosure, Calendly targets, sticky CTA visibility, keyboard focus, console errors, and horizontal overflow.
- [ ] Run `npm test`, `npm run build`, the link checker, and `git diff --check` fresh before delivery.
