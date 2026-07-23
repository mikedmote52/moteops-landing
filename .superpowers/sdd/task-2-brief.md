### Task 2: Build the deterministic Mote Ops interface plates

**Files:**
- Create: `production/opening-film-v3/interfaces.html`
- Create: `production/opening-film-v3/interfaces.css`
- Create: `production/opening-film-v3/interfaces.js`
- Create: `production/opening-film-v3/capture-interfaces.sh`
- Modify: `tests/opening-film-v3.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: exact copy from `mote-ops-opening-v3-manifest.json`.
- Produces: named PNG plates in `production/opening-film-v3/rendered/interfaces/`.
- Produces: `capture:opening-v3-interfaces` package script.

- [ ] **Step 1: Add a failing interface contract**

Append:

```js
test('builds every readable V3 interface as a deterministic local plate', () => {
  const html = read('production/opening-film-v3/interfaces.html');
  const css = read('production/opening-film-v3/interfaces.css');
  const js = read('production/opening-film-v3/interfaces.js');
  const capture = read('production/opening-film-v3/capture-interfaces.sh');
  const packageJson = JSON.parse(read('package.json'));
  const plates = [
    'invitation', 'invitation-clicked',
    'onboarding-tools', 'onboarding-work', 'onboarding-approval',
    'inbox', 'inbox-approved', 'calendar', 'calendar-approved',
    'calls', 'calls-approved', 'finance', 'finance-approved',
    'dashboard-zero', 'phone-zero', 'opening-copy', 'closing-copy',
  ];
  for (const plate of plates) {
    assert.match(js, new RegExp(`['"]${plate}['"]\\s*:`), plate);
    assert.match(capture, new RegExp(`\\n  ${plate}\\n`), plate);
  }
  for (const copy of [
    'Drowning in the work? Start here.',
    'See how Mote Ops can help',
    '286 messages organized',
    '18 replies prepared',
    '3 conflicts resolved',
    '2 changes ready',
    '7 missed calls summarized',
    '4 follow-ups prepared',
    '5 exceptions summarized',
    '2 items need review',
    'Pending tasks: 0',
    'Enjoy your day.',
    'Mote Ops cleaned up the work.',
    'Mike found the beach.',
    'Book your consultation today.',
    'Free 30-minute consultation',
  ]) assert.match(js, new RegExp(copy.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.doesNotMatch(js, /\b(?:sent automatically|paid automatically|rescheduled automatically)\b/i);
  assert.match(html, /aria-live="polite"/);
  assert.match(css, /--mote-cream:\s*#f5f1e8/);
  assert.match(css, /--mote-green:\s*#0d4b3d/);
  assert.equal(packageJson.scripts['capture:opening-v3-interfaces'],
    'bash production/opening-film-v3/capture-interfaces.sh');
});
```

- [ ] **Step 2: Run and verify RED**

Run:

```bash
node --test --test-name-pattern="deterministic local plate" tests/opening-film-v3.test.mjs
```

Expected: FAIL because interface files do not exist.

- [ ] **Step 3: Implement one data-driven interface shell**

Create `interfaces.html` with one `#app`, one polite status region, local CSS, and local JS:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Mote Ops Film Interface</title>
  <link rel="stylesheet" href="interfaces.css">
</head>
<body>
  <main id="app"></main>
  <p class="sr-only" aria-live="polite" id="status"></p>
  <script src="interfaces.js"></script>
</body>
</html>
```

Create `interfaces.js` around a single `plates` object. Use these exact plate entries and statuses:

```js
const plates = {
  'invitation': { view: 'mail', eyebrow: 'FROM MOTE OPS', title: 'Drowning in the work? Start here.', body: 'Mote Ops organizes email, meetings, calls, leads, and financial review around the tools you already use.', action: 'See how Mote Ops can help', state: 'ready' },
  'invitation-clicked': { view: 'mail', eyebrow: 'FROM MOTE OPS', title: 'Drowning in the work? Start here.', body: 'Mote Ops organizes email, meetings, calls, leads, and financial review around the tools you already use.', action: 'Opening Mote Ops…', state: 'clicked' },
  'onboarding-tools': { view: 'onboarding', step: '1 of 3', title: 'Which tools do you use?', options: ['Email', 'Calendar', 'Calls + leads', 'Financial review'], selected: ['Email', 'Calendar', 'Calls + leads', 'Financial review'] },
  'onboarding-work': { view: 'onboarding', step: '2 of 3', title: 'What work is taking the most time?', options: ['Inbox follow-up', 'Schedule changes', 'Missed calls', 'Financial review'], selected: ['Inbox follow-up', 'Schedule changes', 'Missed calls', 'Financial review'] },
  'onboarding-approval': { view: 'onboarding', step: '3 of 3', title: 'Which actions must wait for your approval?', options: ['Send prepared replies', 'Change the calendar', 'Contact a lead', 'Act on financial items'], selected: ['Send prepared replies', 'Change the calendar', 'Contact a lead', 'Act on financial items'], note: 'Approval stays on.' },
  'inbox': { view: 'review', eyebrow: 'INBOX', title: '286 messages organized', metric: '18 replies prepared', rows: [['Jordan Lee', 'Proposal question', 'Reply prepared'], ['CC’s Learning Center', 'Tour follow-up', 'Reply prepared'], ['Northline Supply', 'Delivery timing', 'Reply prepared']], action: 'Approve prepared replies', state: 'ready' },
  'inbox-approved': { view: 'review', eyebrow: 'INBOX', title: '286 messages organized', metric: '18 replies prepared', rows: [['Jordan Lee', 'Proposal question', 'Approved'], ['CC’s Learning Center', 'Tour follow-up', 'Approved'], ['Northline Supply', 'Delivery timing', 'Approved']], action: 'Approved', state: 'approved' },
  'calendar': { view: 'review', eyebrow: 'CALENDAR', title: '3 conflicts resolved', metric: '2 changes ready', rows: [['Team review', 'Move to 2:30 PM', 'Ready for approval'], ['Client call', 'Move to Thursday', 'Ready for approval']], action: 'Approve schedule changes', state: 'ready' },
  'calendar-approved': { view: 'review', eyebrow: 'CALENDAR', title: '3 conflicts resolved', metric: '2 changes ready', rows: [['Team review', 'Move to 2:30 PM', 'Approved'], ['Client call', 'Move to Thursday', 'Approved']], action: 'Approved', state: 'approved' },
  'calls': { view: 'review', eyebrow: 'CALLS + LEADS', title: '7 missed calls summarized', metric: '4 follow-ups prepared', rows: [['Avery Chen', 'Asked about availability', 'Follow-up prepared'], ['Northline Supply', 'Delivery update', 'Follow-up prepared'], ['Jordan Rivera', 'Requested a callback', 'Follow-up prepared']], action: 'Approve follow-ups', state: 'ready' },
  'calls-approved': { view: 'review', eyebrow: 'CALLS + LEADS', title: '7 missed calls summarized', metric: '4 follow-ups prepared', rows: [['Avery Chen', 'Asked about availability', 'Approved'], ['Northline Supply', 'Delivery update', 'Approved'], ['Jordan Rivera', 'Requested a callback', 'Approved']], action: 'Approved', state: 'approved' },
  'finance': { view: 'review', eyebrow: 'FINANCIAL REVIEW', title: '5 exceptions summarized', metric: '2 items need review', rows: [['Invoice 1048', 'Amount differs from estimate', 'Review'], ['Vendor renewal', 'Price changed', 'Review']], action: 'Mark review complete', state: 'ready' },
  'finance-approved': { view: 'review', eyebrow: 'FINANCIAL REVIEW', title: '5 exceptions summarized', metric: '2 items need review', rows: [['Invoice 1048', 'Amount differs from estimate', 'Reviewed'], ['Vendor renewal', 'Price changed', 'Reviewed']], action: 'Review complete', state: 'approved' },
  'dashboard-zero': { view: 'zero', eyebrow: 'TODAY', title: 'Pending tasks: 0', body: 'You’re clear for the day.' },
  'phone-zero': { view: 'phone', eyebrow: 'MOTE OPS', title: 'Pending tasks: 0', body: 'Enjoy your day.' },
  'opening-copy': { view: 'overlay', lines: ['Meetings stack up.', 'Your inbox keeps growing.', 'Calls get missed.'] },
  'closing-copy': { view: 'closing', title: ['Mote Ops cleaned up the work.', 'Mike found the beach.'], body: 'Your people and tools already do the work. We help them work as one.', action: ['Book your consultation today.', 'Free 30-minute consultation to see what Mote Ops can do for you.'] }
};
```

Implement the renderers exactly as pure template functions:

```js
const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
}[char]));

const nav = (active) => `
  <aside class="app-nav">
    <strong>MOTE OPS</strong>
    ${['Today', 'Inbox', 'Calendar', 'Calls + leads', 'Financial review']
      .map((item) => `<span class="${item === active ? 'is-active' : ''}">${escapeHtml(item)}</span>`)
      .join('')}
  </aside>`;

const appShell = (active, body) => `<section class="app-shell">${nav(active)}<div class="app-main">${body}</div></section>`;

const renderMail = (plate) => appShell('Inbox', `
  <p class="eyebrow">${escapeHtml(plate.eyebrow)}</p>
  <p class="mail-meta">Mote Ops &lt;hello@moteops.tech&gt; · Today</p>
  <h1>${escapeHtml(plate.title)}</h1>
  <p class="lede">${escapeHtml(plate.body)}</p>
  <button class="action" data-state="${escapeHtml(plate.state)}">${escapeHtml(plate.action)}</button>
`);

const renderOnboarding = (plate) => appShell('Today', `
  <p class="eyebrow">SETUP · ${escapeHtml(plate.step)}</p>
  <h1>${escapeHtml(plate.title)}</h1>
  <div class="option-grid">${plate.options.map((option) => `
    <button class="option ${plate.selected.includes(option) ? 'is-selected' : ''}">
      <span>${plate.selected.includes(option) ? '✓' : ''}</span>${escapeHtml(option)}
    </button>`).join('')}</div>
  ${plate.note ? `<p class="boundary-note">${escapeHtml(plate.note)}</p>` : ''}
`);

const renderReview = (plate) => appShell(plate.eyebrow === 'INBOX' ? 'Inbox' :
  plate.eyebrow === 'CALENDAR' ? 'Calendar' :
  plate.eyebrow === 'CALLS + LEADS' ? 'Calls + leads' : 'Financial review', `
  <p class="eyebrow">${escapeHtml(plate.eyebrow)}</p>
  <h1>${escapeHtml(plate.title)}</h1>
  <p class="metric">${escapeHtml(plate.metric)}</p>
  <div class="review-list">${plate.rows.map((row) => `
    <article class="review-row">
      <strong>${escapeHtml(row[0])}</strong>
      <span>${escapeHtml(row[1])}</span>
      <em>${escapeHtml(row[2])}</em>
    </article>`).join('')}</div>
  <button class="action" data-state="${escapeHtml(plate.state)}">${escapeHtml(plate.action)}</button>
`);

const renderZero = (plate) => appShell('Today', `
  <p class="eyebrow">${escapeHtml(plate.eyebrow)}</p>
  <div class="zero-mark" aria-hidden="true">✓</div>
  <h1>${escapeHtml(plate.title)}</h1>
  <p class="lede">${escapeHtml(plate.body)}</p>
`);

const renderPhone = (plate) => `
  <section class="phone">
    <div class="phone-card">
      <p class="eyebrow">${escapeHtml(plate.eyebrow)}</p>
      <h1>${escapeHtml(plate.title)}</h1>
      <p class="lede">${escapeHtml(plate.body)}</p>
    </div>
  </section>`;

const renderOverlay = (plate) => `
  <section class="overlay">${plate.lines.map((line) => `<strong>${escapeHtml(line)}</strong>`).join('')}</section>`;

const renderClosing = (plate) => `
  <section class="closing">
    <div class="closing-block">
      <h1>${plate.title.map((line) => `<span>${escapeHtml(line)}</span>`).join('')}</h1>
      <p>${escapeHtml(plate.body)}</p>
      <strong>${escapeHtml(plate.action[0])}</strong>
      <small>${escapeHtml(plate.action[1])}</small>
    </div>
  </section>`;

const renderers = {
  mail: renderMail,
  onboarding: renderOnboarding,
  review: renderReview,
  zero: renderZero,
  phone: renderPhone,
  overlay: renderOverlay,
  closing: renderClosing,
};
```

Select the plate with:

```js
const requested = new URLSearchParams(location.search).get('plate') || 'invitation';
const plate = plates[requested];
if (!plate) throw new Error(`Unknown plate: ${requested}`);
document.body.dataset.plate = requested;
document.querySelector('#app').innerHTML = renderers[plate.view](plate);
document.querySelector('#status').textContent = `${requested} ready`;
```

Create `interfaces.css` with:

```css
:root {
  --mote-cream: #f5f1e8;
  --mote-green: #0d4b3d;
  --mote-ink: #171813;
  --mote-rust: #b95c36;
  --mote-rule: #bcb29c;
}
* { box-sizing: border-box; }
html, body { margin: 0; width: 100%; min-height: 100%; background: var(--mote-cream); color: var(--mote-ink); }
body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
#app { width: 1600px; height: 900px; overflow: hidden; }
.app-shell { display: grid; grid-template-columns: 236px 1fr; width: 100%; height: 100%; }
.app-nav { padding: 54px 34px; border-right: 1px solid var(--mote-rule); background: #eee8dc; }
.app-main { padding: 76px 84px; }
.eyebrow { color: var(--mote-green); font: 800 18px/1.2 ui-monospace, monospace; letter-spacing: .11em; }
h1 { max-width: 980px; margin: 20px 0 22px; font: 700 64px/.96 Georgia, serif; letter-spacing: -.035em; }
.metric { color: var(--mote-rust); font-size: 26px; font-weight: 800; }
.review-row { display: grid; grid-template-columns: 1fr 1.4fr auto; gap: 24px; padding: 24px 0; border-top: 1px solid var(--mote-rule); }
.action { display: inline-flex; min-height: 58px; align-items: center; margin-top: 28px; padding: 0 28px; background: var(--mote-green); color: white; font-weight: 800; }
[data-state="approved"] .action { background: #466c54; }
.phone { width: 1080px; height: 1920px; padding: 290px 92px; background: #111; color: white; }
.phone-card { padding: 78px 66px; border-radius: 42px; background: var(--mote-cream); color: var(--mote-ink); }
.overlay, .closing { width: 1920px; height: 1080px; background: transparent; }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); }
```

Append these exact styles:

```css
.app-nav { display: flex; flex-direction: column; gap: 18px; }
.app-nav strong { margin-bottom: 34px; font: 900 24px/1 ui-monospace, monospace; letter-spacing: .14em; }
.app-nav span { padding: 14px 16px; color: #625f56; font-weight: 700; }
.app-nav span.is-active { background: var(--mote-green); color: white; }
.mail-meta, .lede { max-width: 980px; color: #55564f; font: 400 25px/1.45 Georgia, serif; }
.option-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; max-width: 1040px; }
.option { display: flex; min-height: 86px; align-items: center; gap: 18px; border: 1px solid var(--mote-rule); background: #fbf8f1; padding: 0 24px; text-align: left; font: 750 24px/1.2 inherit; }
.option span { display: grid; width: 34px; height: 34px; place-items: center; border: 1px solid var(--mote-rule); }
.option.is-selected { border-color: var(--mote-green); box-shadow: inset 6px 0 var(--mote-green); }
.option.is-selected span { background: var(--mote-green); color: white; }
.boundary-note { margin-top: 28px; color: var(--mote-green); font-weight: 800; }
.review-list { margin-top: 34px; border-bottom: 1px solid var(--mote-rule); }
.review-row strong, .review-row span { font-style: normal; font-size: 21px; }
.review-row em { color: var(--mote-green); font-style: normal; font-weight: 800; }
.zero-mark { display: grid; width: 96px; height: 96px; place-items: center; border-radius: 50%; background: var(--mote-green); color: white; font-size: 48px; }
.overlay { display: flex; flex-direction: column; justify-content: center; gap: 8px; padding-left: 112px; }
.overlay strong { width: max-content; background: rgba(245, 241, 232, .94); border: 2px solid var(--mote-ink); padding: 13px 18px; font: 900 34px/1.05 "Arial Narrow", sans-serif; letter-spacing: .02em; }
.closing { display: flex; align-items: center; padding-left: 96px; }
.closing-block { width: 850px; background: rgba(13, 75, 61, .96); border: 2px solid var(--mote-cream); box-shadow: 12px 12px 0 rgba(185, 92, 54, .9); color: white; padding: 38px 42px; }
.closing-block h1 { margin: 0 0 18px; color: white; font-size: 52px; }
.closing-block h1 span, .closing-block strong, .closing-block small { display: block; }
.closing-block p { margin: 0 0 24px; color: #e5ded0; font: 400 23px/1.4 Georgia, serif; }
.closing-block strong { font-size: 24px; }
.closing-block small { margin-top: 7px; color: #e5ded0; font-size: 18px; }
button { border-radius: 0; cursor: default; }
```

Do not add gradients, glow, blue, purple, particles, or generic AI motifs.

- [ ] **Step 4: Add deterministic capture**

Create `capture-interfaces.sh` following the existing headless Chrome pattern. The plate array must be:

```bash
plates=(
  invitation
  invitation-clicked
  onboarding-tools
  onboarding-work
  onboarding-approval
  inbox
  inbox-approved
  calendar
  calendar-approved
  calls
  calls-approved
  finance
  finance-approved
  dashboard-zero
  phone-zero
  opening-copy
  closing-copy
)
```

Use `--window-size=1080,1920` only for `phone-zero`; use `--window-size=1600,900` for application plates; use `--window-size=1920,1080` for opening and closing overlays. Save each image as `rendered/interfaces/$plate.png`. Use a `mktemp -d` Chrome profile and delete it with a trap.

Add to `package.json`:

```json
"capture:opening-v3-interfaces": "bash production/opening-film-v3/capture-interfaces.sh"
```

- [ ] **Step 5: Capture and inspect**

Run:

```bash
npm run capture:opening-v3-interfaces
montage production/opening-film-v3/rendered/interfaces/*.png \
  -thumbnail 320x180 -tile 4x -geometry +8+8 \
  production/opening-film-v3/rendered/interface-contact-sheet.png
```

Inspect `interface-contact-sheet.png`. Reject clipped copy, overlapping rows, text smaller than the current accepted laptop plates, or any CTA that cannot be read at the website's 390px viewport.

- [ ] **Step 6: Run tests and commit**

```bash
node --test tests/opening-film-v3.test.mjs
npm test
git diff --check
git add production/opening-film-v3/interfaces.html \
  production/opening-film-v3/interfaces.css \
  production/opening-film-v3/interfaces.js \
  production/opening-film-v3/capture-interfaces.sh \
  tests/opening-film-v3.test.mjs package.json
git commit -m "feat: add opening film V3 interfaces"
```

---
