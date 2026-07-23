# Task 4 Report

## Outcome

The first and only six-second Seedance 2.0 chaos generation was rejected
during frame review. The account was charged 54 credits, taking V3 spend from
0 to 54 credits and leaving 621 credits of the approved 675-credit cap.

The generated black smartphone visibly changes into a loose white paper as
Mike lifts it around 1.3 to 1.7 seconds. He continues handling loose papers,
only one background employee is present, and no distinct mouse movement
occurs. These defects violate the locked continuity contract. No retry and no
later shot were generated.

## Generation

- Job: `910e5f0f-5f73-4b2d-97f9-7bf6eefae091`
- Cost: 54 credits
- Before balance: 2,373.36 credits
- After balance: 2,319.36 credits
- Source: H.264, 1920 by 1080, 24 fps, 145 frames, 6.041667 seconds
- SHA-256:
  `15fc8565dd11792d0b99e2c6152bbd52be4f533bd9b2e5327e88bc233fce59f7`

## Review

Reviewed every half-second sample and all 145 source frames. The detailed
findings and the single proposed future change to actor hand blocking are in
`.superpowers/sdd/opening-v3-shot-01-review.md`.

The exact single-variable retry note is:

> Mike’s left hand remains on the corded handset. His right hand moves only between one visible mouse and one keyboard. Every smartphone, book, folder, and loose paper remains fixed outside his hand path.

## TDD

- RED: the focused rejected-attempt test failed while the manifest still
  reported `not-generated`.
- GREEN: the focused test passed after the manifest recorded the one rejected
  attempt, its exact defect, its source metadata, the one changed prompt
  variable, and `creditsSpent: 54`.

## Scope

No live-site file was changed. No deployment occurred. The current opening
film remains live. The raw generation and rendered inspection assets remain
excluded from release uploads.

## Reviewer fix verification

- Replaced the retry note everywhere with the exact approved hand-path
  sentence above.
- Restored explicit `jobId: null`, `credits: null`, and empty-attempt
  assertions for all six untouched shots.
- Focused V3 tests: 2 of 2 passed.
- Full suite: 95 of 95 passed.
- `git diff --check`: clean.
- No generation, Higgsfield call, credit spend, or deployment occurred during
  these fixes.
