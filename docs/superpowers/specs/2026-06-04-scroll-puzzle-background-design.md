# Scroll-driven background: constellation that assembles into a machine

**Date:** 2026-06-04
**Surface:** `index.html` (moteops.tech landing page, GitHub Pages)
**Status:** design — prototype stage

## Intent

Take the background art Mike already loves (the sparse, twinkling gold constellation in the
dark hero) and make it *deepen as the user scrolls*. The loose star-scatter slowly assembles
into a deliberate, legible mechanism — order emerging from noise. That is the "essence of AI"
read: scattered signal becoming structure. It must stay faint, elegant, and well under the
text. Subtle and mechanical, never loud or busy.

## Constraints (hard)

- **Keep the current constellation.** The hero's existing 7-point cluster + twinkle is the
  starting state, not something to replace.
- **Ground in `~/mote-ops/pipeline/cockpit/tokens.css`:** gold `#C9A24A`, ink `#1A1714`,
  line `#E9E3D8`, Playfair + JetBrains Mono. Motion durations 120/200/320ms, easing
  `cubic-bezier(0.2,0,0,1)`. House rule: restraint, **no gradients, no hype aesthetics, no
  glow blooms**, hairline strokes only.
- **Do not break the layout** or the "see three rebuilt" link (`index.html:535` → `/rebuilds.html`).
- **Respect `prefers-reduced-motion`:** reduced motion shows the final assembled state,
  static. No scroll-tied motion.
- **Performance:** single inline SVG, transforms + opacity only (GPU-compositable),
  `requestAnimationFrame`-throttled scroll listener, `pointer-events: none`, no libraries,
  no build step. Self-contained in `index.html`.

## Motion language

- Background motion is tied to **scroll position**, not a timer. A normalized scroll progress
  `p` (0 at top → 1 at bottom) drives node opacity, link stroke-dash draw, and lattice
  tightening. Scroll up → it disassembles back toward the star scatter. This is the
  "mechanical, deliberate" feel.
- Independent **micro-motion** continues gently when still: the existing twinkle on points,
  plus a very slow ring rotation (orrery variant). Slow enough to read as "alive," never
  distracting.
- The background spans the full page behind all sections (fixed/absolute layer at low
  opacity), darkening/lightening to stay legible against both the dark hero and the cream body.

## Two prototype variants (same idea, different machine)

- **A · Orrery** — concentric slowly-rotating rings with nodes riding them; reads as a
  celestial machine / clockwork. More organic, closer to the existing constellation feel.
- **B · Lattice** — an angular circuit/grid that assembles node-by-node, links drawing as
  closed circuits; reads as schematic / neural net. More structured, more "AI."

Both share palette, restraint, reduced-motion behavior, and performance budget. Mike picks
one (or a blend) from the live prototype.

## Layering against the existing page

- Hero stays dark; background gold reads at the existing ~0.3 opacity there.
- Over the cream body sections, the same line-art continues but at lower opacity so text
  contrast (WCAG) is unaffected. Text sits on `z-index` above the art; art is
  `pointer-events: none` so it never intercepts clicks (forms, demo iframes, links).

## Verification

- Prototype shown in browser; Mike feels the scroll and picks a variant.
- After pick: integrate into `index.html` without disturbing existing CSS/JS, confirm the
  rebuilds link, the Ring-Mike form, and the demo iframes still work, confirm reduced-motion
  path, confirm no console errors and smooth scroll on a normal viewport.
