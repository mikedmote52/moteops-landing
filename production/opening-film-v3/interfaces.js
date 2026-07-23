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

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
const requested = new URLSearchParams(location.search).get('plate') || 'invitation';
const plate = plates[requested];
if (!plate) throw new Error(`Unknown plate: ${requested}`);
document.documentElement.dataset.plate = requested;
document.body.dataset.plate = requested;
document.querySelector('#app').innerHTML = renderers[plate.view](plate);
document.querySelector('#status').textContent = `${requested} ready`;
window.scrollTo(0, 0);
