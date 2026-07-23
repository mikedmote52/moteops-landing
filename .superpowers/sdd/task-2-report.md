# Task 2 Report: Build the Deterministic Mote Ops Interface Plates

## Implementation

Created one local, data-driven interface shell with the exact 17 requested plate entries:

- Invitation and clicked invitation
- Three onboarding steps
- Ready and approved inbox, calendar, calls, and finance states
- Desktop and phone zero states
- Opening and closing copy composites

`interfaces.html` contains one `#app`, local CSS and JavaScript references, and one polite status region. `interfaces.js` contains the supplied plate copy, escaping helper, pure template renderers, query-string plate selection, accessibility status update, and deterministic scroll restoration handling. `interfaces.css` uses the supplied cream, green, ink, rust, and rule palette with no gradients, glow, blue, purple, particles, or generic AI motifs.

`capture-interfaces.sh` captures every named plate with local headless Chrome. Application plates use 1600×900, `phone-zero` uses 1080×1920, and both copy composites use 1920×1080. Each plate receives an isolated user-data subdirectory inside one trapped `mktemp -d` profile so browser state cannot shift later captures. The package script is:

```text
capture:opening-v3-interfaces
```

No Higgsfield call, media generation, credit spend, deployment, `index.html` edit, production change, or prompt-pack change occurred.

## RED evidence

The supplied contract was appended before interface implementation.

```bash
node --test --test-name-pattern="deterministic local plate" tests/opening-film-v3.test.mjs
```

Initial result:

```text
not ok 1 - builds every readable V3 interface as a deterministic local plate
error: ENOENT ... production/opening-film-v3/interfaces.html
# pass 0
# fail 1
```

Visual inspection then drove three additional strict RED/GREEN cycles:

1. Shared Chrome state clipped later review plates. The scroll-reset contract failed first because `scrollTo(0, 0)` and per-plate user-data directories were absent.
2. The phone and copy-canvas contract failed first because the document root lacked a plate identity, the 1080×1920 phone `#app` override was absent, and the 1920×1080 transparent copy-canvas overrides were absent.
3. The CTA-size contract failed first because `.action` inherited the browser’s roughly 13px default instead of the accepted laptop-plate 23px size.

Each failure was caused by the missing behavior under test, not a test syntax or setup error.

## GREEN evidence

The initial focused contract passed after the exact shell, plates, renderers, capture array, brand tokens, trust-boundary copy, and package script were implemented:

```text
# tests 1
# pass 1
# fail 0
```

The three visual regression contracts were each rerun individually after their minimal fixes and passed 1/1.

## Capture output

```bash
npm run capture:opening-v3-interfaces
```

Final result: exit 0 with 17 PNG files.

```text
14 application plates: 1600x900
phone-zero: 1080x1920, rgb24
opening-copy: 1920x1080, rgba
closing-copy: 1920x1080, rgba
```

The rendered outputs live under `production/opening-film-v3/rendered/interfaces/` and remain excluded from Git by the Task 1 release contract.

ImageMagick’s `montage` command is not installed on this Mac. The required equivalent 4-column contact sheet was therefore assembled locally with ffmpeg at:

```text
production/opening-film-v3/rendered/interface-contact-sheet.png
1304x932
```

## Visual review

The final contact sheet and representative full-resolution invitation, onboarding approval, inbox, phone, opening, and closing plates were inspected with `view_image`.

Corrections made from inspection:

- Eliminated clipped review headers and CTAs by preventing Chrome profile state from crossing plate captures.
- Expanded the phone `#app` from the default 900px height to the full 1920px capture, removing the cream lower half.
- Made opening and closing copy plates true RGBA composites rather than cream-backed frames.
- Increased action copy from the browser default to the accepted 23px laptop-plate size. Action labels are readable in the 320px contact-sheet tiles, clearing the 390px website-width check.

Final review found no clipped copy, overlapping rows, truncated CTA, or text below the accepted laptop-plate floor. Ready and approved states remain explicit in both action and row copy.

## Verification

Commands:

```bash
node --test tests/opening-film-v3.test.mjs
node --check production/opening-film-v3/interfaces.js
bash -n production/opening-film-v3/capture-interfaces.sh
npm test
git diff --check
git diff --cached --check
```

Results:

```text
Focused V3 tests: 7 passed, 0 failed
Full repository tests: 92 passed, 0 failed
JavaScript syntax: pass
Shell syntax: pass
Working diff check: clean
Staged diff check: clean
```

## Files changed

- `production/opening-film-v3/interfaces.html`
- `production/opening-film-v3/interfaces.css`
- `production/opening-film-v3/interfaces.js`
- `production/opening-film-v3/capture-interfaces.sh`
- `tests/opening-film-v3.test.mjs`
- `package.json`

## Commit

`44c51cc feat: add opening film V3 interfaces`

## Self-review

The commit contains exactly the six Task 2 files. The capture script is executable, uses the exact plate order, uses only local browser resources, assigns the required viewport to every plate class, and cleans the temporary profile through a trap. All supplied plate copy and explicit approval boundaries are preserved. The final copy composites have alpha, and the phone plate fills its complete portrait canvas.

`production/opening-film-v3/generation-prompts.json`, `assets/cinematic/mote-ops-opening-v3-manifest.json`, root `index.html`, deployment files, release media, and production state are unchanged. The pre-existing untracked `package-lock.json` was not changed or staged.

## Concerns

The only environment variance is the absence of ImageMagick `montage`; ffmpeg produced and verified the equivalent required contact sheet. Rendered plates and the contact sheet are intentionally ignored production artifacts, so they are present locally for downstream compositing but are not part of commit `44c51cc`. No remaining concern blocks Task 3.

## Reviewer follow-up

The reviewer identified that the approved-state selector used descendant syntax:

```css
[data-state="approved"] .action
```

The renderer places `data-state="approved"` on the `.action` button itself, so the selector never matched. A focused regression was added first to require `.action[data-state="approved"]` and prohibit the descendant form.

RED:

```bash
node --test --test-name-pattern="button own data state" tests/opening-film-v3.test.mjs
```

```text
not ok 1 - styles an approved action from the button own data state
error: input did not match /\.action\[data-state="approved"\]/
# pass 0
# fail 1
```

GREEN after the one-selector correction:

```text
# tests 1
# pass 1
# fail 0
```

The capture inventory typo above was also corrected from 13 to 14 application plates. Fresh follow-up verification passed 8/8 focused V3 tests and 93/93 full repository tests; JavaScript syntax, shell syntax, and `git diff --check` were clean. No generation, credit spend, deployment, or production change occurred.

Follow-up commit: `5b833ed fix: style approved V3 actions`.
