# Opening Film V3, Shot 1 Chaos Review

## Decision

Rejected after one controlled retry. Do not use either generation as a
continuity reference. Do not submit another retry or generate later shots.

## Attempt 1 submission

- Shot: `chaos`
- Job: `910e5f0f-5f73-4b2d-97f9-7bf6eefae091`
- Model: Seedance 2.0
- Cost: 54 credits
- Attempts submitted: 1
- Account balance before: 2,373.36 credits
- Account balance after: 2,319.36 credits
- Source reference: accepted office job
  `879db0a2-91d0-4276-ad5d-169a5606b303`
- Output: H.264, 1920 by 1080, 24 fps, 145 frames, 6.041667 seconds
- File size: 7,855,696 bytes
- SHA-256:
  `15fc8565dd11792d0b99e2c6152bbd52be4f533bd9b2e5327e88bc233fce59f7`
- Preserved local source:
  `production/opening-film-v3/raw/shot-01-chaos-attempt-01-rejected.mp4`

The submission used the locked prompt and parameters, one result, no audio,
and the declined unrelated preset override.

## Attempt 2 controlled retry

- Job: `bc199863-0494-4bca-a76a-32781d65f637`
- Model: Seedance 2.0
- Cost: 54 credits
- Total attempts submitted: 2
- Total V3 credits spent: 108 of the approved 675-credit cap
- Account balance before: 2,319.36 credits
- Account balance after: 2,265.36 credits
- Source reference: accepted office job
  `879db0a2-91d0-4276-ad5d-169a5606b303`
- Declined preset id: `24bae836-2c4a-48e0-89b6-49fcc0b21612`
- Output: H.264, 1920 by 1080, 24 fps, 145 frames, 6.041667 seconds
- File size: 6,042,874 bytes
- SHA-256:
  `906f0b1dc255584fadbc120cda9e9ed03013fb1cfb585da26e2b14ce43e9dec7`
- Canonical local source:
  `production/opening-film-v3/raw/shot-01-chaos.mp4`

The retry used the original exact chaos prompt and parameters, plus only this
approved actor-hand-blocking sentence:

> Mike’s left hand remains on the corded handset. His right hand moves only
> between one visible mouse and one keyboard. Every smartphone, book, folder,
> and loose paper remains fixed outside his hand path.

The no-spend preflight returned exactly 54 credits. The authority check was
`54 + 54 <= 675`. Exactly one retry result was requested. Generated audio was
disabled. No further generation was submitted.

## Review coverage

For both attempts, the 12 half-second samples at 0.0 through 5.5 seconds were
inspected in contact sheets. All 145 frames of each source were also extracted
and inspected in six consecutive 24-frame sheets plus frame 145. The retry
received four additional close interaction sheets spanning frames 24 through
83. This covered every visible hand, corded phone, smartphone, book, folder,
loose paper, keyboard, laptop, desk prop, and employee movement.

## Findings

### Disqualifying continuity defect

From roughly 1.3 through 1.7 seconds, Mike reaches toward the black smartphone
on the desk. The black smartphone visibly becomes a loose white paper as it
is lifted. The object change is visible across consecutive frames, not just
motion blur. Mike then repeatedly handles loose papers until roughly 3.2
seconds. This directly fails the locked constraints that paper stacks remain
untouched, Mike never handles loose paper, and no object may transform,
duplicate, or disappear.

### Other failed constraints

- One background employee is visible throughout, not the required two.
- Mike does not perform a distinct movement with a visible mouse.
- The papers and notebook nearest Mike move repeatedly instead of remaining
  stable.

### Constraints that passed

- Mike's face, beard, hair, glasses, and apparent age remain stable.
- The charcoal long-sleeve button-down remains consistent.
- Both forearms stay covered and no tattoo texture visibly bleeds through.
- The office geometry, shelving, cabinets, and visible employee remain
  broadly stable.
- No readable generated text, floating label, hologram, neon effect, or
  manufacturer-style logo appears.
- No clear anatomical hand duplication or malformed finger is visible.
- Camera movement remains restrained.

## Controlled retry findings

The retry repeats the same disqualifying behavior despite the exact approved
hand-path change:

- From about 1.1 seconds, Mike's right hand leaves the book stack and reaches
  across the desk toward the black smartphone.
- Across consecutive frames around 1.5 seconds, the black smartphone visibly
  becomes a loose white paper while Mike lifts it. This is an object mutation,
  not motion blur.
- Through about 3.3 seconds, Mike handles the transformed paper, the book
  stack, a folder, and additional loose papers. These actions violate both the
  original locked-prop language and the only added retry sentence.
- Only one background employee appears, not the required two.
- No distinct visible mouse movement occurs.

The retry otherwise preserves Mike's face, beard, hair, glasses, age, charcoal
long-sleeve shirt, closed cuffs, hidden tattoos, broad office geometry, and
restrained camera movement. No readable generated text, floating label,
hologram, neon effect, or clear malformed hand appears.

## One proposed future variable

The controlled retry proves that verbal hand blocking alone does not override
the motion-heavy office video reference. If a future separately authorized
rebuild revisits this shot, change the media input only: replace that video
reference with one reviewed clean start image. Preserve identity, wardrobe,
office, lighting, framing, duration, camera, and every other prompt parameter.

Action language for the clean start image:

> Mike keeps the corded handset at his left ear for the entire six-second
> shot. His right forearm remains planted on the bare desk edge and his empty
> right hand stays still. He never reaches toward, touches, lifts, moves, or
> handles any desk object. Pressure is conveyed only through his expression
> and the two waiting employees.

This is a proposal only. No further retry was submitted.

## Previous retry variable

Change actor hand blocking only:

> Mike’s left hand remains on the corded handset. His right hand moves only between one visible mouse and one keyboard. Every smartphone, book, folder, and loose paper remains fixed outside his hand path.

This is also the exact variable that was applied to Attempt 2. The earlier
set-dressing sentence was only a proposed future change and was never used in
that generation.

This was the only change used for Attempt 2.
