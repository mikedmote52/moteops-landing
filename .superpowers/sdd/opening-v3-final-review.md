# Mote Ops opening film V3, final production review

## Scope

- Seven accepted Seedance 2.0 shots.
- Four accepted Nano Banana 2 preparation images.
- Deterministic Mote Ops interface plates composited into the physical laptop and phone.
- Exact 50-second silent 1080p and 720p masters.
- Local homepage integration only. Production was not deployed.

## Credit control

- Approved ceiling: 675 credits.
- Exact spend: 566 credits.
- Unused authority: 109 credits.
- Spend includes two rejected 54-credit chaos attempts, seven accepted Seedance shots, and four accepted 2-credit preparation images.

## Film review

- Shot 1 keeps the handset, planted right hand, desk props, wardrobe, and two employees stable. Three concise pressure lines replace floating generated labels.
- Shot 2 holds the Mote Ops invitation for 6.4 seconds before the visible opening state. The interface is perspective-matched inside the laptop bezel.
- Shots 3 through 5 show onboarding, inbox, calendar, calls, leads, and financial review in two-second or longer deterministic states.
- Shot 6 uses the same office, employees, and wardrobe, then shows Mike close the laptop, stand, and leave.
- Shot 7 holds the phone status while Mike reads, then resolves to the beach headline, operating line, and free-consultation CTA.
- Office tattoos remain covered. Beach tattoos are naturally visible.
- No audio is present.

## Media evidence

- 1080p master: 1920×1080, H.264, 24 fps, 1,200 frames, 50.000 seconds.
- 720p master: 1280×720, H.264, 24 fps, 1,200 frames, 50.000 seconds.
- Both masters use fast-start MP4 layout and contain zero audio streams.
- Poster: 1920×1080 JPEG.
- Exact hashes and byte sizes are recorded in `assets/cinematic/mote-ops-opening-v3-manifest.json`.

## Homepage evidence

- Desktop selects the 1080p source and constrains the opening frame to 1,040 pixels.
- Mobile selects the 720p source and keeps the film at full available width.
- Both viewports have zero horizontal overflow.
- Motion off pauses the film. Motion on resumes it.
- The play-once and replay behavior remains intact.
- Browser review found meaningful content, no error overlay, and no recorded console errors.
- The complete repository suite passes 99 of 99 tests, the static build exits successfully, and `git diff --check` is clean.
