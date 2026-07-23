# Mote Ops Discovery-Monitor Verification

**Date:** 2026-07-23
**Candidate commit:** `d9daac140b453695b4d6cc066b5e5e729fd67a3d`
**Branch:** `feat/moteops-opening-v2`
**Result:** Passed

## Candidate behavior

- The chaos scene remains unchanged through 5.8 seconds.
- Accepted cleanup footage plays at natural speed for the 2.6-second actor-attention beat.
- A seven-frame push connects the actor to the discovery email inside the physical monitor.
- The discovery email has a complete 2.2-second stable hold.
- The four cleanup interfaces each retain a complete 1.8-second stable hold.
- A seven-frame pull returns to the actor before the controlled outcome.
- The complete eight-second beach ending remains intact.
- The master duration is exactly 28.000000 seconds.

## Local media

| Output | Codec | Dimensions | FPS | Duration | Size | SHA-256 | Audio |
|---|---|---:|---:|---:|---:|---|---|
| `mote-ops-opening-1080.mp4` | H.264 | 1920 by 1080 | 24/1 | 28.000000 | 12,061,493 bytes | `ee5622e9f07befd80fbc7592aa0b5eda731d97fe8f4b1a1a4a598fbaa80cfa21` | none |
| `mote-ops-opening-720.mp4` | H.264 | 1280 by 720 | 24/1 | 28.000000 | 4,283,396 bytes | `d8d36fa2b7834cd5bc4107327eab5211e45abb2931f28c43edfd2aed656018f4` | none |
| `mote-ops-opening-poster.webp` | WebP | 1600 by 900 | n/a | n/a | 68,112 bytes | `e67d51381dbe870939c4eaa733c59f288035a0dd439fa1cd117a874bee44e465` | n/a |

Both MP4s place `moov` before `mdat` and pass the repository fast-start contract.

## Automated gate

- `npm test`: 84 passed, 0 failed
- `npm run build`: passed
- `git diff --check`: passed
- Manifest JSON parse: passed
- Frame-boundary review: passed
- Review file: `.superpowers/sdd/opening-discovery-monitor-frame-review.md`

## Browser verification

### Desktop, 1440 by 1000

- Opening story width: 1,180 pixels
- Document scroll width: 1,440 pixels, no horizontal overflow
- Film duration: 28 seconds
- Motion state: on
- Film played once and exposed Replay
- Discovery email is visibly bounded by the physical monitor
- Page body contains meaningful content
- Console errors: 0
- Page errors: 0
- Framework error overlay: none

### Phone, 390 by 844

- Opening story width: 358 pixels
- Document scroll width: 390 pixels, no horizontal overflow
- Discovery headline remains readable inside the monitor
- The film remains visually separate from the next website section
- Motion control remains 44 pixels high
- Sticky booking action remains below the opening film and does not cover it
- Console errors: 0
- Page errors: 0

### Reduced motion and replay

- Reduced-motion load kept `currentSrc` empty, Motion off, and the poster visible
- Explicit Motion opt-in loaded the 720p film and advanced playback
- Completed film exposed Replay
- Replay reset the film to zero, resumed playback, and hid the Replay control

## Protected preview

- Project: `moteops-cinematic-review`
- Deployment: `dpl_2EHNyYf1Ruj9YvJ6DMrfdy6uhRTh`
- State: READY
- Target: preview
- URL: `https://moteops-cinematic-review-lj54h8uc4-mikedmote52-projects.vercel.app`
- Temporary review URL: `https://moteops-cinematic-review-lj54h8uc4-mikedmote52-projects.vercel.app/?_vercel_share=aHECFaKdANjdpancka88zXFrIO7eyqQz`
- Temporary review access expires July 24, 2026 at 7:35:01 AM Pacific

Authenticated deployed checks:

- `/`: 200
- `/assets/cinematic/mote-ops-opening-1080.mp4`: 200, `content-length: 12061493`
- byte range `0-1023`: 206, `content-range: bytes 0-1023/12061493`
- `/production/opening-film/raw/shot-01-breakdown.mp4`: 404

## Release boundary

- Higgsfield generation: none
- Additional credits spent: 0
- Replacement footage: none
- Access or protection changes: none
- Alias or promotion: none
- Merge: none
- Production deployment: none
- `main`: `753781147fddbc7fd7644d079276cd3473012f26`
- `origin/main`: `753781147fddbc7fd7644d079276cd3473012f26`
- `moteops.tech`: unchanged
