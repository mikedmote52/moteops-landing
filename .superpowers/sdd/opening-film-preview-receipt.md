# Opening film protected-preview receipt

Verified July 22, 2026.

- Deployment ID: `dpl_GjG2c8DFMWzTBo9NetfJnq7QjMwa`
- Deployment state: `READY`
- Deployment target: preview
- Source commit: `3804ae4336fcc5e25c671342756958f341bc2738`
- Protected deployment: `https://moteops-cinematic-review-mpi2df4kf-mikedmote52-projects.vercel.app`
- Temporary review link: `https://moteops-cinematic-review-mpi2df4kf-mikedmote52-projects.vercel.app/?_vercel_share=gDhhky5TaUklyw43NMEhkr5d3WkdNA3O`
- Review-link expiration: July 24, 2026 at 5:41:46 AM
- Production domain changed: no

## Deployed checks

- Homepage, film stylesheet, motion script, and poster return HTTP 200.
- Both video files support byte ranges and return HTTP 206 for `bytes=0-1023`.
- Browser check at 390 × 844 loads the 720p film with no page or console errors.
- Production working files under `/production/opening-film/` return HTTP 404.

## Deployed artifact identity

| Artifact | Bytes | SHA-256 |
| --- | ---: | --- |
| `mote-ops-opening-1080.mp4` | 11,072,304 | `0b280781f8b4b823fbe487c225318972c3db9e71524b11bd51001833efb5a5a3` |
| `mote-ops-opening-720.mp4` | 3,915,984 | `5cd8ed00051b9db9f9b321429db2c73a56befd3ab42c3e3f850cbdc3a1677f77` |
| `mote-ops-opening-poster.webp` | 67,898 | `5ea9c3e576ca7cd76e9a1e49e3ec7e6b20333dd6ff0b153769d0c6fa2e24d5ce` |
