# ONDE HALO Hyperbelt Media

Generation date: 2026-07-23

## Generation Ledger

### Environment Plate

- Model: Higgsfield Recraft V4.1
- Job ID: `43c77b9c-cf45-47d9-97f4-ce724e4d3892`
- Parameters: `16:9`, `2k`, `standard`, `count: 1`
- Charged credits: 8
- Master filename: `hyperbelt-poster-source.png`
- Master SHA-256: `fb27a40779b6cdcd49e4162d7b0563d576687a92406054b09f345ce3e0528d5b`
- Master properties: PNG, RGB, 2688x1536

Prompt:

> Ultra-wide cinematic deep-space hyperbelt environment, a slow river of fine
> galaxy dust bending through dark graphite space, subtle gravitational lensing,
> large orbital arcs and distant particulate depth, restrained oxidized-copper
> energy along one edge, premium science-fiction product-film atmosphere,
> center-left area intentionally dark and open for editorial typography,
> center-right area with dimensional depth for a floating product overlay,
> photorealistic, no starscape cliché, no hyperspace streaks, no planet, no
> spacecraft, no people, no product, no logo, no letters, no text.

### Motion Sequence

- Model: Higgsfield Seedance 2.0
- Job ID: `6938bdd9-5b6c-4cc1-b2fd-0deafaff5b78`
- Parameters: `16:9`, `duration: 12`, `resolution: 1080p`, `mode: std`, `bitrate_mode: high`, `genre: epic`, `generate_audio: false`, `count: 1`
- Charged credits: 108
- Master filename: `hyperbelt-seedance-source.mp4`
- Master SHA-256: `32b366431b2ee4131cfa86a8ac83f6ea8e539684745d3455a9086491f5841e16`
- Master properties: H.264, 1920x1080, 24 fps, 12.041667 seconds, silent, 117641228 bytes

Prompt:

> The deep-space hyperbelt slowly breathes and drifts in layered parallax.
> Microscopic galaxy dust follows curved gravitational paths; enormous orbital
> arcs pass almost imperceptibly; restrained copper energy travels through the
> field like a low-frequency pulse. Camera movement is a very slow forward glide
> with no cuts, no shake, and no sudden acceleration. Preserve the open dark
> typography area and the product-overlay area. Seamless-loop-friendly ending.
> No text, no product, no spacecraft, no planet, no people, no flashing.

## Localized Assets

- `hyperbelt-poster.webp`: WebP, VP8, 1920x1098, 301,124 bytes, quality 84 target.
- `hyperbelt-seedance.mp4`: H.264 High Profile, level 4.1, 1920x1080, yuv420p, 24 fps, 12.041667 seconds, silent, 6,272,159 bytes, 4,166,970 bit/s container bitrate, `faststart` enabled. SHA-256: `71999d60ed2d16b37a5596a4ff907e821317cd3325311d63ce4c26b45a674df5`.

The poster was resized from 2688x1536 to 1920x1098 with a Lanczos filter and encoded at WebP quality 84. The supplied ffmpeg build did not include the `libwebp` encoder, so the equivalent WebP encode used the installed Pillow/libwebp encoder. The video used the exact ffmpeg command specified in the Task 2 brief.

The bundled video was later optimized from the same approved master with H.264 `libx264`, `-preset slow`, `-crf 29`, High Profile level 4.1, yuv420p, 24 fps, silent audio removal, and `+faststart`. The optimized file is 6,272,159 bytes at 4,166,970 bit/s, preserving 1920x1080 and 12.041667 seconds.

Total generation spend: 116 credits (8 Recraft + 108 Seedance). The account balance moved from 2709.86 to 2593.86, confirming the exact charge.

The hyperbelt atmosphere was generated with Higgsfield Seedance from a
Higgsfield Recraft environment plate. The HALO product is rendered separately
in real time by the website.
