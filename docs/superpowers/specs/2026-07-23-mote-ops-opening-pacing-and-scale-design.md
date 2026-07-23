# Mote Ops opening pacing and desktop scale

## Status

Approved in conversation on July 23, 2026.

## Goal

Keep the current opening film and correct two presentation problems:

1. The film is too large on desktop and needs visible space around it.
2. The individual computer-interface cuts move too quickly to read comfortably.

## Film edit

- Preserve all three existing generated source scenes.
- Preserve the current stress performance, office continuity, interface artwork, disclosure, and beach ending.
- Do not spend additional Higgsfield credits.
- Keep the stress scene, discovery email, office lead-in, office tail, and beach scene at their current playback speed.
- Increase each of the four computer-interface holds from the current 1.0–1.4 seconds to 1.8 seconds.
- Use clean cuts. Do not add artificial slow motion, morphing, or decorative transition effects.
- Allow the finished film to grow from 24 seconds to 26.8 seconds so no existing scene must be compressed.
- Update the responsive masters, poster, manifest, duration contract, and hash evidence together.

## Website scale

- On desktop widths above 1020 pixels, center the film and constrain it to a maximum width of 1180 pixels.
- Preserve the 16:9 aspect ratio.
- Keep at least 32 pixels of space between the film and the viewport edge.
- Keep the existing full available width on phone and small tablet layouts.
- Preserve the current caption, disclosure, motion control, play-once behavior, offscreen pause, and replay behavior.

## Verification

- Automated tests must prove the new duration, four 1.8-second interface holds, and desktop width contract.
- A 1440-pixel desktop browser check must show the centered player below 1180 pixels wide with visible surrounding space.
- A 390-pixel phone check must show the player still using the available content width without horizontal overflow.
- Playback must advance normally, reveal replay after completion, and produce no browser or console errors.
- The live site remains unchanged until a separate preview is reviewed and Mike explicitly approves the revised cut for publication.
