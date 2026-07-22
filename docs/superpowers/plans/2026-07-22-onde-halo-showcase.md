# ONDE HALO Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and verify a standalone cinematic product demo for the fictional ONDE HALO levitating speaker, then link it from the MoteOps showcase.

**Architecture:** A static, dependency-free experience in `demo/onde-halo/` uses semantic HTML, layered SVG/CSS product geometry, one canvas sound field, and a Web Audio analyser. The homepage receives only a final link after the isolated demo passes tests and browser review.

**Tech Stack:** HTML5, CSS, browser JavaScript, SVG, Canvas 2D, Web Audio API, Node test runner.

## Global Constraints

- Sound is off until a user explicitly enables it.
- ONDE and HALO are labelled fictional concept work.
- No purchase, preorder, form submission, analytics, or data collection is added.
- No framework, build step, remote font, or required third-party script is introduced.
- Reduced-motion and mobile users receive a complete, legible experience.
- Existing MoteOps homepage changes remain untouched except for the final verified demo link.

---

### Task 1: Demo Contract

**Files:**
- Create: `tests/onde-halo.test.mjs`
- Create: `demo/onde-halo/index.html`

**Interfaces:**
- Consumes: Node's built-in test and filesystem modules.
- Produces: Required IDs `hero`, `thesis`, `anatomy`, `field`, `materials`, and `finale`; controls `data-sound-toggle` and `data-stage`.

- [ ] Write tests that fail while the demo files are absent and assert semantic section order, fictional disclosure, a real sound button, reduced-motion CSS, and local asset references.
- [ ] Run `node --test tests/onde-halo.test.mjs` and confirm failure because `demo/onde-halo/index.html` is missing.
- [ ] Add the minimal semantic HTML shell and run the test until the contract passes.

### Task 2: Visual System and Product Geometry

**Files:**
- Create: `demo/onde-halo/site.css`
- Modify: `demo/onde-halo/index.html`

**Interfaces:**
- Consumes: The section and product-part class names in `index.html`.
- Produces: Responsive product geometry, scroll sections, focus styles, and reduced-motion overrides.

- [ ] Extend the contract test with required local stylesheet and product-part selectors and verify it fails.
- [ ] Build the graphite/copper design system, layered HALO object, editorial sections, and responsive layouts.
- [ ] Run `node --test tests/onde-halo.test.mjs` and the full `npm test` suite.

### Task 3: Motion and Sound Engine

**Files:**
- Create: `demo/onde-halo/site.js`
- Modify: `demo/onde-halo/index.html`
- Modify: `tests/onde-halo.test.mjs`

**Interfaces:**
- Consumes: `[data-sound-toggle]`, `[data-sound-label]`, `[data-stage]`, `#sound-field`, and `.halo-product`.
- Produces: `HaloSound` with `start()`, `stop()`, `energy()`, and `destroy()`; scroll stage updates and canvas rendering.

- [ ] Add failing tests for the module reference, accessible sound state, Web Audio fallback copy, visibility pausing, and reduced-motion handling.
- [ ] Implement procedural oscillators, analyser-driven energy, canvas waves/particles, scroll progress, and pointer parallax.
- [ ] Run the focused and full test suites.

### Task 4: Deliberate Higgsfield Asset

**Files:**
- Create if generation succeeds: `demo/onde-halo/assets/halo-atmosphere.webp`
- Modify if generated: `demo/onde-halo/site.css`

**Interfaces:**
- Consumes: Higgsfield `generate_image` with a cost-only quote first.
- Produces: One optional local 16:9 atmosphere plate that does not contain text, logos, controls, or essential product details.

- [ ] Request an exact cost quote without generation and proceed only if it fits the free balance.
- [ ] Generate one 16:9 plate, download it locally, optimize it, and verify the page still works when it is absent.
- [ ] Re-run tests and inspect image contrast behind every text block.

### Task 5: Browser Verification and Showcase Link

**Files:**
- Modify: `index.html`
- Modify: `tests/site-contract.test.mjs`

**Interfaces:**
- Consumes: The verified `demo/onde-halo/index.html` entry point.
- Produces: One honest MoteOps showcase card or link labelled as fictional concept work.

- [ ] Add a failing homepage contract assertion for the ONDE demo link.
- [ ] Add the smallest homepage gallery entry without changing existing proof claims.
- [ ] Serve locally and verify desktop 1440x900, phone 390x844, keyboard controls, sound on/off, reduced motion, section transitions, console output, and all links.
- [ ] Run `npm test` and `node tests/check-links.mjs` before reporting completion.

