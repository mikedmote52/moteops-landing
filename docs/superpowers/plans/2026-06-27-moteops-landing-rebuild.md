# Mote Ops Landing Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current `moteops.tech` homepage with a new premium, bright, warm-precision landing page that positions Mote Ops as the installer of practical AI operating systems for owner-led businesses.

**Architecture:** Keep the site as a static single-file landing page so deployment and rollback remain simple. Rebuild `index.html` around approved positioning, reuse existing real assets where possible, and keep the primary conversion path to Calendly with a secondary proof path to example installs.

**Tech Stack:** Static HTML, CSS, and light vanilla JavaScript

## Global Constraints

- Keep rollback trivial by changing only `index.html` plus documentation unless a small supporting asset becomes necessary.
- Do not invent fake metrics, fake client quotes, or claim completed outcomes that are not grounded in current artifacts.
- Remove the `Ring Mike` primary motion from the homepage and use a single primary Calendly CTA plus a secondary proof CTA.
- Use a bright, warm, editorial visual system with stronger typography and a more premium layout than the current site.
- Keep the page functional as a static site with no build step required.

---

### Task 1: Lock page architecture and content map

**Files:**
- Create: `docs/superpowers/plans/2026-06-27-moteops-landing-rebuild.md`
- Modify: `index.html`

**Interfaces:**
- Consumes: existing business positioning decisions from the active redesign session
- Produces: final section order and copy targets for the homepage rebuild

- [ ] **Step 1: Define the section sequence**

```text
1. Header / nav
2. Hero with dual CTA
3. Proof strip
4. Owner bottleneck section
5. What Mote Ops installs
6. Featured childcare lane
7. Multi-vertical service lanes
8. Why Mote Ops is different
9. Build-your-own-AIOS secondary offer
10. Process / engagement steps
11. Final CTA
12. Footer
```

- [ ] **Step 2: Confirm the homepage copy rules**

```text
- Lead with plain-language owner relief
- Translate AIOS into practical business operations language
- Keep childcare / learning centers as the featured lane
- Present home services and insurance as secondary verticals
- Use example installs and representative visuals without overstating delivered outcomes
```

- [ ] **Step 3: Keep the link map minimal**

```text
Primary CTA: https://calendly.com/mikedmote/30min
Secondary CTA: /rebuilds
Supporting links: live example sites and existing proof surfaces only where grounded
```

### Task 2: Rebuild the homepage visual system and structure

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: the section map and grounded asset inventory
- Produces: a complete replacement homepage with responsive layout, styling, and animations

- [ ] **Step 1: Replace the current dark hero and old positioning**

```html
<section class="hero">
  <p class="eyebrow">Practical AI systems for owner-led businesses</p>
  <h1>Stop being the system.</h1>
  <p class="hero-copy">Mote Ops installs practical AI workflows for owner-led businesses so follow-up, intake, scheduling, communication, reporting, and admin work stop living in your head.</p>
</section>
```

- [ ] **Step 2: Add a premium warm-precision design system**

```css
:root {
  --bg: #f7f2ea;
  --surface: rgba(255, 252, 247, 0.78);
  --surface-strong: #fffdf9;
  --ink: #1c160f;
  --muted: #6f6558;
  --line: rgba(31, 23, 15, 0.12);
  --accent: #bc5c3d;
  --accent-2: #d9a441;
  --sage: #7e8f72;
  --serif: "Fraunces", Georgia, serif;
  --sans: "Plus Jakarta Sans", system-ui, sans-serif;
  --mono: "IBM Plex Mono", ui-monospace, monospace;
}
```

- [ ] **Step 3: Build the conversion and proof sections**

```html
<div class="hero-actions">
  <a class="btn btn-primary" href="https://calendly.com/mikedmote/30min">Book a consultation</a>
  <a class="btn btn-secondary" href="/rebuilds">See example installs</a>
</div>
```

- [ ] **Step 4: Add the featured childcare lane and secondary vertical cards**

```html
<article class="lane-card lane-card-featured">...</article>
<article class="lane-card">Home services...</article>
<article class="lane-card">Independent insurance brokers...</article>
```

- [ ] **Step 5: Add lightweight reveal motion only**

```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("in");
  });
}, { threshold: 0.18 });
document.querySelectorAll(".reveal").forEach((node) => observer.observe(node));
```

### Task 3: Verify the static site works and is visually coherent

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: rebuilt homepage markup
- Produces: verified static site ready for user review or deploy

- [ ] **Step 1: Run a local static server**

```bash
cd ~/Desktop/hobby/active/moteops-landing
python3 -m http.server 8008
```

- [ ] **Step 2: Smoke-test the homepage response**

```bash
curl -I http://127.0.0.1:8008/
```

- [ ] **Step 3: Visually verify desktop and mobile render**

```bash
npx playwright screenshot --device="Desktop Chrome HiDPI" http://127.0.0.1:8008/ /tmp/moteops-desktop.png
npx playwright screenshot --device="iPhone 13" http://127.0.0.1:8008/ /tmp/moteops-mobile.png
```

- [ ] **Step 4: Review the git diff for intentional scope**

```bash
git -C ~/Desktop/hobby/active/moteops-landing diff -- index.html docs/superpowers/plans/2026-06-27-moteops-landing-rebuild.md
```
