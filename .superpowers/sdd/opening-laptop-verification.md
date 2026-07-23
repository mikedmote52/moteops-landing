# Opening laptop clickthrough verification

## User story

An overwhelmed business owner sees a Mote Ops invitation on his real laptop, opens it, clicks through to `moteops.tech`, sees the work become organized, returns to a controlled office, and gets his time back at the beach.

## Build and media

- `npm test`: passed, 85 tests.
- `npm run build`: passed.
- `git diff --check`: passed.
- 1080 master: H.264, 1920 × 1080, 24 fps, silent, fast-start, 28.000 seconds.
- 720 master: H.264, 1280 × 720, 24 fps, silent, fast-start, 28.000 seconds.
- Full frame review at every manifest boundary: passed.
- Additional Higgsfield or Seedance credits spent: 0.

## Browser checks

### Desktop

- Viewport: 1440 × 1000.
- Film width: 1180 pixels.
- Selected source: `mote-ops-opening-1080.mp4`.
- Duration reported by browser: 28 seconds.
- Autoplay: playing.
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
- Screenshot captured at the readable opened-email hold: `.superpowers/sdd/opening-laptop-mobile.png`.

### Motion and replay

- Selecting Motion Off paused the film and preserved its current time.
- Selecting Motion On resumed the film.
- Completing the film revealed `Replay story`.
- Selecting Replay hid the control, reset the film, and resumed playback from the beginning.

## Protected preview

- Project: `moteops-cinematic-review`.
- Deployment: `dpl_CJWRRzUL3eHKc45C5rGBGUjDnTPB`.
- Target: preview.
- Status: ready.
- Canonical URL: `https://moteops-cinematic-review-bvk3blhaz-mikedmote52-projects.vercel.app`.
- Unauthenticated request: redirected to Vercel SSO, confirming deployment protection.
- Temporary review access expires July 24, 2026 at 8:48 AM.
- Root document: HTTP 200 through authenticated deployment access.
- 1080 media: HTTP 200 for HEAD, HTTP 206 in the browser, 11,521,981 bytes.
- 720 media: HTTP 200 for HEAD, HTTP 206 in the browser, 4,183,078 bytes.
- Remote 1080 SHA-256: `c6131f579239b855dc7097bf2ff579b10af2565bf1e3f1e5e4293a345736e780`.
- Remote 720 SHA-256: `4423fa41f8fd14914c21997c3d3ad177ece58ebdfe059c8a56f77fc7025ee8b1`.
- Remote hashes match the audited local masters.
- `/production/opening-film/build-opening-film.sh`: HTTP 404.
- `/.vercel/project.json`: HTTP 404.

## Result

Passed. The complete film story and homepage controls work on the protected deployment at desktop and phone sizes. No production deployment was created.
