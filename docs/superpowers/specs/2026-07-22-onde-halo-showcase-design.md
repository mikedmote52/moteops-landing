# ONDE HALO Showcase Design

## Purpose

Build a standalone, portfolio-grade product site that demonstrates MoteOps' ability to turn an original product idea into a polished digital experience. ONDE and HALO are fictional. The page must feel like a complete launch site rather than a UI exercise.

## Creative Direction

HALO is a levitating 360-degree loudspeaker: a matte-charcoal acoustic ring suspended over a machined copper plinth. The central silhouette is a floating torus. The visual system uses near-black graphite, warm copper, chalk-white type, audio-wave geometry, sparse particles, and controlled light.

The page follows a cinematic product-film rhythm:

1. Hero reveal: HALO floats in a large dark field while wave rings react to sound.
2. Product thesis: sound without a front or back.
3. Exploded anatomy: shell, driver array, magnetic core, and copper plinth separate as the visitor scrolls.
4. Spatial sound: an interactive listening field responds to pointer movement and audio energy.
5. Material study: charcoal ceramic, woven acoustic mesh, and copper are shown at editorial scale.
6. Closing launch statement: one clear fictional product CTA and a MoteOps showcase disclosure.

## Interaction Model

- Sound starts off. A persistent `Sound on` control creates a procedural ambient soundscape with the Web Audio API after a user gesture.
- The same analyser data drives the canvas wave field, product glow, and visual equalizer.
- Scroll progress controls product rotation, levitation, and exploded-part separation.
- Pointer movement introduces restrained parallax on capable devices.
- Keyboard controls, focus styles, status announcements, and a working sound toggle are required.
- `prefers-reduced-motion` disables continuous drift and replaces scroll interpolation with stable states.

## Architecture

The demo lives at `demo/onde-halo/` and is independent of the homepage. It uses semantic HTML, one focused stylesheet, and one JavaScript module. The product is built with layered HTML/SVG/CSS so it remains sharp and interactive without a WebGL dependency. A single canvas renders the living sound field. The optional Higgsfield image is an atmosphere layer, never the only representation of the product.

## Content and Truth Boundaries

- ONDE and HALO are explicitly fictional concept work.
- Product specifications are illustrative and must not be presented as tested engineering claims.
- The MoteOps credit explains that strategy, art direction, interface design, motion, and implementation were produced as a demonstration.
- No purchase, preorder, account, checkout, or data collection flow is implied.

## Performance and Resilience

- No framework, build step, remote font, or required third-party script.
- The core page works if the optional image or audio engine is unavailable.
- Canvas resolution is capped by device pixel ratio and pauses when the page is hidden.
- Mobile receives the same narrative with simpler parallax and larger controls.

## Verification

- Contract tests assert section order, truth disclosure, control semantics, and asset references.
- Behavior tests exercise the sound toggle, exploded-stage progression, reduced-motion branch, and graceful Web Audio failure.
- Browser verification covers 1440x900 desktop and a 390x844 phone viewport.
- Every visible control must perform the action it claims.

