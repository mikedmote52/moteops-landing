# Task 4 Controlled Retry Report

## Outcome

The single authorized chaos retry was rejected during full frame review. The
same disqualifying prop mutation returned despite the exact approved
actor-hand-blocking sentence. Shot 1 remains rejected. No later shot and no
additional retry was generated.

V3 spend is now 108 credits of the approved 675-credit cap. The balance moved
from 2,319.36 to 2,265.36 credits for this retry.

## Preservation and authority

- The first rejected source was preserved before the canonical path changed:
  `production/opening-film-v3/raw/shot-01-chaos-attempt-01-rejected.mp4`
- Preserved SHA-256:
  `15fc8565dd11792d0b99e2c6152bbd52be4f533bd9b2e5327e88bc233fce59f7`
- The no-spend preflight returned exactly 54 credits.
- Authority check: `54 + 54 <= 675`.
- Exactly one retry result was submitted.
- Generated audio was disabled.
- Declined preset id:
  `24bae836-2c4a-48e0-89b6-49fcc0b21612`

## Retry generation

- Job: `bc199863-0494-4bca-a76a-32781d65f637`
- Cost: 54 credits
- Source reference: accepted office job
  `879db0a2-91d0-4276-ad5d-169a5606b303`
- Output: H.264, 1920 by 1080, 24 fps, 145 frames, 6.041667 seconds
- File size: 6,042,874 bytes
- SHA-256:
  `906f0b1dc255584fadbc120cda9e9ed03013fb1cfb585da26e2b14ce43e9dec7`
- Canonical local source:
  `production/opening-film-v3/raw/shot-01-chaos.mp4`

The retry preserved the exact original prompt, parameters, and office video
reference, appending only:

> Mike’s left hand remains on the corded handset. His right hand moves only
> between one visible mouse and one keyboard. Every smartphone, book, folder,
> and loose paper remains fixed outside his hand path.

This is the exact variable applied to Attempt 2. The later set-dressing note
was a proposed future change, not an applied generation variable.

## Review decision

Rejected. Around 1.1 seconds, Mike's right hand leaves the book area and
reaches toward the black smartphone. Across consecutive frames around 1.5
seconds, the smartphone visibly becomes a loose white paper. Mike then handles
the transformed paper, the book stack, a folder, and additional loose papers
through about 3.3 seconds. Only one background employee appears, and no
distinct visible mouse action occurs.

Identity, glasses, beard, office wardrobe, closed cuffs, hidden tattoos, broad
office geometry, camera restraint, and hand anatomy otherwise remain stable.
There is no readable generated text or obvious logo.

Every half-second sample was inspected. All 145 frames were inspected in seven
full-frame sheets, with frames 24 through 83 inspected again in four close
interaction sheets covering the hands, corded handset, smartphone, keyboard,
laptop, desk props, and employee.

## One future variable, not submitted

The old office video reference visibly contains the same reach and clutter
that failed twice. The next proposed single variable is therefore the media
input: replace that motion-heavy video reference with one reviewed clean start
image. Preserve identity, wardrobe, office, lighting, framing, duration,
camera, and every other prompt parameter.

Action language for the clean start image:

> Mike keeps the corded handset at his left ear for the entire six-second
> shot. His right forearm remains planted on the bare desk edge and his empty
> right hand stays still. He never reaches toward, touches, lifts, moves, or
> handles any desk object. Pressure is conveyed only through his expression
> and the two waiting employees.

No further retry was submitted.

## Verification

- Focused retry ledger test: 1 of 1 passed.
- Full test suite: 95 of 95 passed.
- `git diff --check`: clean.
- No live-site file changed.
- No deployment occurred.
