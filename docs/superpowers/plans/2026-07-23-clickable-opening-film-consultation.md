# Clickable Opening-Film Consultation Action Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the approved 50-second opening film on `moteops.tech` with a real Calendly link aligned over its final consultation action.

**Architecture:** Keep the approved film pixels unchanged and add one semantic HTML link inside the existing 16:9 opening frame. `motion-system.js` toggles the link from the video's `timeupdate`, `seeked`, `ended`, and replay state; `opening-film.css` aligns and sizes it. The approved review master becomes the production 1080p asset, with a derived 720p mobile asset and audited manifest metadata.

**Tech Stack:** Static HTML, CSS, browser JavaScript, Node test runner, ffmpeg/ffprobe, GitHub Pages.

## Global Constraints

- The booking destination is exactly `https://calendly.com/mikedmote/30min`.
- The action becomes interactive at exactly 46.5 seconds and remains interactive after the 50-second film ends.
- Replaying or seeking before 46.5 seconds hides the action and removes it from keyboard navigation.
- The touch target is at least 44 pixels high on desktop and phone.
- The approved 50-second silent film content remains visually unchanged.
- Production deployment is authorized in this session only after automated and browser verification pass.

---

### Task 1: Add the timed semantic consultation link

**Files:**
- Modify: `tests/opening-film.test.mjs`
- Modify: `index.html`
- Modify: `opening-film.css`

**Interfaces:**
- Consumes: existing `.opening-story-frame` 16:9 coordinate system
- Produces: `[data-opening-consultation]`, an anchor with `data-active="false"` and `tabindex="-1"`

- [x] **Step 1: Write the failing markup and style contract**

Add a test requiring:

```js
assert.match(openingFigure, /data-opening-consultation/);
assert.match(openingFigure, /href="https:\/\/calendly\.com\/mikedmote\/30min"/);
assert.match(openingFigure, /data-active="false"/);
assert.match(openingFigure, /tabindex="-1"/);
assert.match(css, /\[data-opening-consultation\][\s\S]*min-height:\s*44px/);
assert.match(css, /\[data-opening-consultation\]\[data-active="false"\][\s\S]*pointer-events:\s*none/);
```

- [x] **Step 2: Run the focused test and confirm RED**

Run:

```bash
node --test --test-name-pattern="play-once email-to-beach story|clickable consultation" tests/opening-film.test.mjs
```

Expected: FAIL because `data-opening-consultation` is absent.

- [x] **Step 3: Add the minimal link and responsive positioning**

Inside `.opening-story-frame`, after the video, add:

```html
<a class="opening-consultation"
  data-opening-consultation data-active="false" tabindex="-1"
  href="https://calendly.com/mikedmote/30min"
  target="_blank" rel="noopener noreferrer"
  aria-label="Book your free 30-minute Mote Ops consultation">
  Book your free 30-minute consultation
</a>
```

Style the link as an absolute hit target over the final card's `moteops.tech` box with `left: 67%`, `top: 56%`, `width: 22%`, and `height: 10%`. Keep it visually transparent except for keyboard focus, use `min-height: 44px`, and disable visibility and pointer events while `data-active="false"`.

- [x] **Step 4: Run the focused test and confirm GREEN**

Run the focused command from Step 2. Expected: PASS.

- [x] **Step 5: Commit the semantic action**

```bash
git add index.html opening-film.css tests/opening-film.test.mjs
git commit -m "feat: add opening film consultation action"
```

### Task 2: Synchronize link availability with film time

**Files:**
- Modify: `tests/motion-system.test.mjs`
- Modify: `motion-system.js`

**Interfaces:**
- Consumes: `[data-opening-consultation]` from Task 1 and `film.currentTime`
- Produces: `syncOpeningConsultation(film)`, which sets `data-active`, `hidden`, and `tabindex`

- [x] **Step 1: Extend the real harness and write failing behavior tests**

Give each opening story a consultation-link fake and require:

```js
film.currentTime = 46.49;
film.emit('timeupdate');
assert.equal(film.consultation.dataset.active, 'false');
assert.equal(film.consultation.tabIndex, -1);

film.currentTime = 46.5;
film.emit('timeupdate');
assert.equal(film.consultation.dataset.active, 'true');
assert.equal(film.consultation.tabIndex, 0);

film.emit('ended');
assert.equal(film.consultation.dataset.active, 'true');

film.replay.click();
assert.equal(film.consultation.dataset.active, 'false');
assert.equal(film.consultation.tabIndex, -1);
```

- [x] **Step 2: Run the focused behavior tests and confirm RED**

Run:

```bash
node --test --test-name-pattern="consultation|replay resets" tests/motion-system.test.mjs
```

Expected: FAIL because no timed consultation synchronization exists.

- [x] **Step 3: Add minimal playback synchronization**

Add:

```js
const consultationStartSeconds = 46.5;

function syncOpeningConsultation(film) {
  const action = film.closest('[data-opening-story]')?.querySelector('[data-opening-consultation]');
  if (!action) return;
  const active = film.currentTime >= consultationStartSeconds;
  action.dataset.active = String(active);
  action.tabIndex = active ? 0 : -1;
  action.hidden = !active;
}
```

Call it on `timeupdate`, `seeked`, and `ended`, and immediately after replay resets `currentTime` to zero.

- [x] **Step 4: Run focused and full tests**

Run:

```bash
node --test --test-name-pattern="consultation|replay resets" tests/motion-system.test.mjs
npm test
```

Expected: focused tests PASS and all repository tests PASS.

- [x] **Step 5: Commit playback behavior**

```bash
git add motion-system.js tests/motion-system.test.mjs
git commit -m "feat: time opening film consultation link"
```

### Task 3: Promote the approved full-film master

**Files:**
- Modify: `tests/opening-film-v3.test.mjs`
- Modify: `assets/cinematic/mote-ops-opening-v3-manifest.json`
- Replace: `assets/cinematic/mote-ops-opening-v3-1080.mp4`
- Replace: `assets/cinematic/mote-ops-opening-v3-720.mp4`

**Interfaces:**
- Consumes: `/tmp/moteops-opening-v3-final-review/mote-ops-opening-v3-50s-review.mp4`
- Produces: exact silent H.264 production masters at 1920x1080 and 1280x720, 24 fps, 1,200 frames, 50 seconds

- [x] **Step 1: Prepare and probe the deterministic 720p derivative**

Encode a temporary 720p fast-start H.264 derivative from the approved review master. Record both files' exact byte sizes and SHA-256 hashes before touching production assets.

- [x] **Step 2: Write the new expected media contract and confirm RED**

Update the expected `master1080` and `master720` size/hash values in `tests/opening-film-v3.test.mjs`, change the expected manifest status to `approved-for-production`, and require the exact four release-revision jobs and 711.5-credit total, then run:

```bash
node --test --test-name-pattern="renders exact 50-second" tests/opening-film-v3.test.mjs
```

Expected: FAIL because production still contains the previous masters.

- [x] **Step 3: Replace both production masters and update the manifest**

Copy the approved 1080p review master and prepared 720p derivative to their production paths. Update the manifest's output size/hash metadata, add the exact Scene 2 and Scene 8 revision ledger, record the final 711.5-credit approved cap and spend, and set its status to `approved-for-production`.

- [x] **Step 4: Verify the media contract is GREEN**

Run:

```bash
node --test --test-name-pattern="renders exact 50-second" tests/opening-film-v3.test.mjs
ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate,nb_frames -show_entries format=duration -of json assets/cinematic/mote-ops-opening-v3-1080.mp4
ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate,nb_frames -show_entries format=duration -of json assets/cinematic/mote-ops-opening-v3-720.mp4
```

Expected: test PASS; both videos report H.264, 24 fps, 1,200 frames, and 50.000000 seconds with the intended dimensions.

- [x] **Step 5: Commit the approved masters**

```bash
git add assets/cinematic/mote-ops-opening-v3-1080.mp4 assets/cinematic/mote-ops-opening-v3-720.mp4 assets/cinematic/mote-ops-opening-v3-manifest.json tests/opening-film-v3.test.mjs
git commit -m "feat: promote approved Mote Ops opening film"
```

### Task 4: Verify and publish production

**Files:**
- Modify: `docs/superpowers/plans/2026-07-23-clickable-opening-film-consultation.md`
- Modify: `/Users/michaelmote/Desktop/_handoffs/Codex-bridge/STATE.md`
- Modify: `/Users/michaelmote/Desktop/_handoffs/Codex-bridge/LOG.jsonl`

**Interfaces:**
- Consumes: Tasks 1–3
- Produces: verified live `https://moteops.tech/`

- [ ] **Step 1: Run release verification**

Run `npm test`, `npm run build`, `git diff --check`, media probes, and confirm a clean worktree.

- [ ] **Step 2: Verify a local production-equivalent page**

At 390x844 and 1440x900, verify the action is unavailable at 46.49 seconds, available at 46.5 seconds, at least 44 pixels high, keyboard focusable, aligned with the final card, and resolves to the exact Calendly URL.

- [ ] **Step 3: Publish the exact verified branch**

Fast-forward `main` to the verified branch head and push `origin/main`. Wait for the GitHub Pages deployment to complete.

- [ ] **Step 4: Verify the public site**

Repeat the phone and desktop checks at `https://moteops.tech/`. Confirm the approved film loads, the timed link works, Calendly resolves correctly, there is no horizontal overflow, and there are no console or media errors.

- [ ] **Step 5: Record the release**

Check every completed step in this plan, commit the plan state, and update the bridge with the production commit, deployment result, media properties, browser metrics, and test count.
