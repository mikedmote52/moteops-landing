# Opening film local verification

Verified July 22, 2026 from commit `3804ae4336fcc5e25c671342756958f341bc2738`.

## Automated checks

- `npm test`: 78 of 78 tests passed.
- `npm run build`: completed successfully.
- `git diff --check`: clean.

## Desktop, 1440 × 1000

- The 16:9 film is the first major visual in the hero.
- The 1080p source loads; the 720p source is not requested.
- The film pauses offscreen and resumes when returned to view.
- Playback completes once, then exposes the replay control.
- Replay resets the film and starts playback.
- No horizontal overflow, page errors, console errors, or error overlay.

Evidence: `opening-film-desktop.png`

## Mobile, 390 × 844

- The film appears before the headline.
- Only the 720p source loads.
- The page has one global motion control.
- The replay control is 123.6 × 44 CSS pixels.
- The Care Hub and booking path remain available.
- No horizontal overflow, page errors, or console errors.

Evidence: `opening-film-mobile.png`

## Reduced motion and recovery

- With reduced motion enabled, neither video source loads before opt-in.
- The poster, story summary, and booking path remain visible.
- Selecting Motion loads the 720p source and starts playback.
- A simulated initial autoplay rejection returns the page to Motion Off without hiding the summary or poster.
- Selecting Motion after playback is restored starts the film successfully.

Evidence: `opening-film-reduced-motion.png`
