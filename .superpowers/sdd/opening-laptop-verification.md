# Corrected opening laptop clickthrough verification

## User story

An overwhelmed business owner sees a Mote Ops invitation on his real laptop, opens it, clicks through to `moteops.tech`, sees the work become organized, returns to a controlled office, and gets his time back at the beach.

## Build and media

- `npm test`: passed, 85 tests.
- `npm run build`: passed.
- `git diff --check`: passed.
- 1080 master: H.264, 1920 × 1080, 24 fps, silent, fast-start, 28.000 seconds.
- 720 master: H.264, 1280 × 720, 24 fps, silent, fast-start, 28.000 seconds.
- Full frame review at every manifest boundary: passed.
- Rejected flat rotate-and-scale moving insert: removed.
- Replacement moving insert: four-corner perspective track across all 30 frames.
- Inbox and opened email: conventional system-mail layout with contained typography.
- Additional Higgsfield or Seedance credits spent: 0.

## Browser checks

### Desktop

- Viewport: 1440 × 1000.
- Film width: 1180 pixels.
- Selected source: `mote-ops-opening-1080.mp4`.
- Duration reported by browser: 28 seconds.
- Screenshot captured at 6.00 seconds, the exact moving-laptop moment rejected in the prior preview.
- Horizontal overflow: none.
- Framework error overlay: none.
- Browser console errors: none.
- Screenshot: `.superpowers/sdd/opening-laptop-desktop.png`.

### Mobile

- Viewport: 390 × 844.
- Film width: 339 pixels.
- Selected source: `mote-ops-opening-720.mp4`.
- Duration reported by browser: 28 seconds.
- Horizontal overflow: none.
- Browser console errors: none.
- Screenshot captured at 6.00 seconds, the exact moving-laptop moment rejected in the prior preview: `.superpowers/sdd/opening-laptop-mobile.png`.
- The complete visible email interface remains inside the physical black laptop bezel.

### Motion and replay

- Selecting Motion Off paused the film and preserved its current time.
- Selecting Motion On resumed the film.
- Completing the film revealed `Replay story`.
- Selecting Replay hid the control, reset the film, and resumed playback from the beginning.

## Protected preview

- Project: `moteops-cinematic-review`.
- Deployment: `dpl_FzkPmr224d1pz4sRJM27mcDcx38o`.
- Target: preview.
- Status: ready.
- Canonical URL: `https://moteops-cinematic-review-2dz1y8659-mikedmote52-projects.vercel.app`.
- Unauthenticated request: redirected to Vercel SSO, confirming deployment protection.
- Temporary review access expires July 24, 2026 at 9:06 AM.
- Root document: HTTP 200 through authenticated deployment access.
- 1080 media: HTTP 206 in the browser, 11,538,889 bytes.
- 720 media: HTTP 206 in the browser, 4,174,510 bytes.
- Remote 1080 SHA-256: `002597f562f266e7cb78f0e6a2c3661c304f376a7692138b81f3b9801a714365`.
- Remote 720 SHA-256: `70b2c87093aa278419b91bcdd2b080ed0a994986f7c739696b95f84151141b6e`.
- Remote hashes match the audited local masters.
- `/production/opening-film/build-laptop-discovery.sh`: HTTP 404.
- `/.vercel/project.json`: HTTP 404.

## Result

Passed. The previously rejected moving-laptop shot is perspective-matched and contained on the protected deployment at desktop and phone sizes. No production deployment was created.
