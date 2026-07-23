# Mote Ops opening v2 verification

Verified July 23, 2026 from candidate commit `44bfe14b6878f0e4afca02832163ca0b589ebbb1`.

## Scope

- Existing generated footage preserved.
- No Higgsfield credits spent.
- Four computer-interface cuts held for 1.8 seconds each.
- Finished duration: 26.791667 seconds at 24 fps.
- Desktop player centered and constrained to 1180 pixels.
- Phone player width preserved.
- `moteops.tech` unchanged on production commit `753781147fddbc7fd7644d079276cd3473012f26`.

## Local browser evidence

### Desktop, 1440 × 1000

- Opening story box: x 130, width 1180.
- Viewport clearance: 130 pixels on each side.
- 1080p source loaded and advanced during playback.
- Duration: 26.791667 seconds.
- Replay appeared after completion, reset the film to 0, and restarted playback.
- Horizontal overflow: 0.
- Page errors: 0.
- Console errors: 0.

Evidence: `opening-v2-desktop.png`

### Phone, 390 × 844

- Opening story box: x 16, width 358.
- 720p source loaded and advanced during playback.
- Duration: 26.791667 seconds.
- Horizontal overflow: 0.
- Page errors: 0.
- Console errors: 0.

Evidence: `opening-v2-mobile.png`

### Reduced motion

- Before opt-in, neither source was assigned and the video remained paused.
- After selecting Motion, the 720p source loaded and playback advanced.
- Page errors: 0.

## Frame review

Frames immediately before and after the interface boundaries at 9.4, 11.2, 13.0, 14.8, and 16.6 seconds were inspected. The office-to-beach boundary at 18.8 seconds and the revised beach overlays were also inspected.

- Each interface plate holds without a blank or duplicated frame.
- Every boundary is a clean cut.
- The actor footage remains at its original speed.
- The beach ending remains unchanged apart from its later timeline position.

Manifest frame-review result: `passed`.

## Protected preview

- Deployment ID: `dpl_E6p17ukmo6MiV27pYeqdbSExxM5R`
- Deployment state: `READY`
- Deployment target: preview
- Source commit: `44bfe14b6878f0e4afca02832163ca0b589ebbb1`
- Protected deployment: `https://moteops-cinematic-review-r22li3i8w-mikedmote52-projects.vercel.app`
- Temporary review link: `https://moteops-cinematic-review-r22li3i8w-mikedmote52-projects.vercel.app/?_vercel_share=cwyb2QmaIYPvvtvKuFtrUFqvN65GqvUI`
- Review-link expiration: July 24, 2026 at 6:08:42 AM

The deployed homepage, film stylesheet, motion script, and poster return HTTP 200. Both MP4s return HTTP 206 for `bytes=0-1023`. Production working routes return HTTP 404.

## Deployed artifact identity

| Artifact | Bytes | SHA-256 |
| --- | ---: | --- |
| `mote-ops-opening-1080.mp4` | 11,113,052 | `b5d9a969b96f2d33024e9508a5be88e85a31f704d6873bb0e5ed3ef4469730b5` |
| `mote-ops-opening-720.mp4` | 3,932,353 | `ef1e8d6aed0ec50485dc84083d20cc4a29ab8df19271961b2bb10f615a25b3bd` |
| `mote-ops-opening-poster.webp` | 67,898 | `5ea9c3e576ca7cd76e9a1e49e3ec7e6b20333dd6ff0b153769d0c6fa2e24d5ce` |
