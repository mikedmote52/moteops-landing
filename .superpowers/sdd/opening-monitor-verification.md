# Mote Ops actor-monitor verification

Verified July 23, 2026.

## Candidate

- Deployed source commit: `7e5794b32bda906460192c0e143a8e3fd4a42488`.
- Branch: `feat/moteops-opening-v2`.
- Generated footage changed: no.
- Additional Higgsfield credits spent: 0.
- Master duration: 26.791667 seconds at 24 fps.
- Push-in: seven frames, beginning at 9.108333 seconds.
- Stable interface plateaus: 9.400000–11.200000, 11.200000–13.000000, 13.000000–14.800000, and 14.800000–16.600000.
- Pull-back: seven frames, beginning at 16.600000 seconds.

## Automated gate

- Repository tests: 84 passed, 0 failed.
- Opening-film tests: 10 passed, 0 failed.
- Static build: passed.
- Whitespace check: passed.
- Media contract: passed.
- Frame-boundary review: passed.

## Desktop browser, 1440 × 1000

- Opening story x-position: 130 pixels.
- Opening story width: 1180 pixels.
- Responsive source: `mote-ops-opening-1080.mp4`.
- Duration: 26.791667 seconds.
- Horizontal overflow: 0.
- Motion state: on.
- Replay became visible at completion, reset the film, hid itself, and restarted playback.
- Page errors: 0.
- Console errors: 0.
- Evidence: `opening-monitor-desktop.png`.

## Phone browser, 390 × 844

- Opening story x-position: 16 pixels.
- Opening story width: 358 pixels.
- Responsive source: `mote-ops-opening-720.mp4`.
- Duration: 26.791667 seconds.
- The actor, office context, monitor bezel, and primary interface decisions remain visible.
- Horizontal overflow: 0.
- Page errors: 0.
- Console errors: 0.
- Evidence: `opening-monitor-mobile.png`.

## Reduced motion

- Motion starts off.
- Neither source has a `src` before explicit activation.
- After activation, the 720p source loads and playback advances.
- Page errors: 0.
- Console errors: 0.

## Protected preview

- Deployment ID: `dpl_58gG1SLXH1CSaZhtTBGe2nn9E24M`.
- Deployment state: `READY`.
- Deployment type: preview, with no production promotion.
- Project: `moteops-cinematic-review`.
- Deployment URL: `https://moteops-cinematic-review-iuzlbx60h-mikedmote52-projects.vercel.app`.
- Temporary review URL: `https://moteops-cinematic-review-iuzlbx60h-mikedmote52-projects.vercel.app/?_vercel_share=QQla9rdpaA1Bl7wZlUhkDOpYdFCOHL46`.
- Temporary review access expires July 24, 2026 at 7:04:34 AM.
- Vercel recorded `gitDirty=1` because excluded local review evidence and project-link metadata were present during the CLI deployment. The deployed release files match source commit `7e5794b`.

Authenticated deployment checks:

- Homepage, opening stylesheet, motion script, and poster: HTTP 200.
- Both MP4 range requests for bytes 0–1023: HTTP 206 with 1024 bytes.
- Full 1080p and 720p media: HTTP 200.
- `/production/opening-film/build-opening-film.sh`: HTTP 404.

## Deployed artifact identity

| Artifact | Bytes | SHA-256 |
| --- | ---: | --- |
| `mote-ops-opening-1080.mp4` | 11,415,547 | `c543b52b348c1cc920c71f42951fa5e8035bcb93b40b077759f24aaf9e18f445` |
| `mote-ops-opening-720.mp4` | 4,087,813 | `38644eea2470b0d527efb33647b247722bab8885b1092552882a7e4ae1d3551f` |
| `mote-ops-opening-poster.webp` | 67,898 | `5ea9c3e576ca7cd76e9a1e49e3ec7e6b20333dd6ff0b153769d0c6fa2e24d5ce` |

## Production boundary

- Main checkout: `753781147fddbc7fd7644d079276cd3473012f26`.
- Remote `origin/main`: `753781147fddbc7fd7644d079276cd3473012f26`.
- `moteops.tech` was not deployed, aliased, promoted, merged, or changed.
