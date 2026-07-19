const demoPanels = [...document.querySelectorAll('[data-demo-panel]')];
const demoStateButtons = [...document.querySelectorAll('[data-demo-state]')];
const demoNext = document.querySelector('[data-demo-next]');
const demoReset = document.querySelector('[data-demo-reset]');
const demoStatus = document.querySelector('[data-demo-status]');
const draftEditor = document.querySelector('[data-draft-editor]');
const draftText = document.querySelector('[data-draft-text]');
const originalDraft = draftEditor?.value ?? '';
let savedDraft = originalDraft;
let currentDemoState = 0;

const stateLabels = ['Lead arrives', 'Intake completes', 'Owner brief'];
const nextLabels = ['Next: complete intake', 'Next: open owner brief', 'Restart demo'];

function announce(message, region = demoStatus) {
  if (region) region.textContent = message;
}

const DEMO_GALLERY = ['operator', 'documents', 'leads'];
const galleryTabButtons = [...document.querySelectorAll('[data-gallery-demo]')];
const galleryPanels = [...document.querySelectorAll('[data-gallery-panel]')];
const moreExamples = document.querySelector('#more-examples');

function setGalleryDemo(name) {
  const selectedName = DEMO_GALLERY.includes(name) ? name : DEMO_GALLERY[0];
  galleryTabButtons.forEach((button) => {
    const active = button.dataset.galleryDemo === selectedName;
    button.setAttribute('aria-selected', String(active));
    button.tabIndex = active ? 0 : -1;
  });
  galleryPanels.forEach((panel) => {
    const active = panel.dataset.galleryPanel === selectedName;
    panel.hidden = !active;
    const tab = galleryTabButtons.find((button) => button.dataset.galleryDemo === panel.dataset.galleryPanel);
    if (tab) panel.setAttribute('aria-labelledby', tab.id);
  });
}

galleryTabButtons.forEach((button, index) => {
  button.addEventListener('click', () => setGalleryDemo(button.dataset.galleryDemo));
  button.addEventListener('keydown', (event) => {
    let nextIndex;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % galleryTabButtons.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + galleryTabButtons.length) % galleryTabButtons.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = galleryTabButtons.length - 1;
    else return;
    event.preventDefault();
    const nextButton = galleryTabButtons[nextIndex];
    setGalleryDemo(nextButton.dataset.galleryDemo);
    nextButton.focus();
  });
});

document.querySelectorAll('[data-open-demo]').forEach((link) => link.addEventListener('click', (event) => {
  event.preventDefault();
  if (moreExamples) moreExamples.open = true;
  setGalleryDemo(link.dataset.openDemo);
  const selectedTab = galleryTabButtons.find((button) => button.dataset.galleryDemo === link.dataset.openDemo);
  moreExamples?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  selectedTab?.focus();
}));

const OPERATOR_REQUESTS = {
  attention: {
    request: 'What needs my attention today?',
    context: 'Synthetic project statuses, commitments, and open decisions',
    route: 'Project/status routing → owner attention brief',
    result: 'Two fictional customer follow-ups and one synthetic project decision need review today.',
    approval: 'You approve every customer-facing action; this sample changes nothing.',
    status: 'Synthetic owner brief ready for review. Nothing was sent or changed.'
  },
  care: {
    request: "Continue the CC's Care Hub project.",
    context: "Synthetic CC's Care Hub project status, latest completed step, and fictional next task",
    route: "Project/status routing → CC's Care Hub project",
    result: 'The synthetic enrollment-workspace review is complete; the fictional next task is to verify the forms view.',
    approval: 'You choose whether work continues; no project or client record is changed.',
    status: "Synthetic CC's Care Hub project status ready. Nothing was sent or changed."
  },
  private: {
    request: 'Review these files privately.',
    context: 'Only the three listed fictional source files in the document demonstration',
    route: 'Bounded private-file review → prerecorded local-model sample',
    result: 'One fictional commitment is overdue, with its synthetic source attached.',
    approval: 'The bounded review is read-only; no live files are opened, uploaded, or changed.',
    status: 'Synthetic bounded private-file review ready. No live connection was made.'
  }
};

const operatorRequestButtons = [...document.querySelectorAll('[data-operator-request]')];
const operatorRequestText = document.querySelector('[data-operator-request-text]');
const operatorContext = document.querySelector('[data-operator-context]');
const operatorRoute = document.querySelector('[data-operator-route]');
const operatorResult = document.querySelector('[data-operator-result]');
const operatorApproval = document.querySelector('[data-operator-approval]');
const operatorApprove = document.querySelector('[data-operator-approve]');
const operatorStatus = document.querySelector('[data-operator-status]');
const operatorApproveLabel = operatorApprove?.textContent ?? 'Approve sample brief';

function renderOperatorRequest(data) {
  operatorRequestText.textContent = data.request;
  operatorContext.textContent = data.context;
  operatorRoute.textContent = data.route;
  operatorResult.textContent = data.result;
  operatorApproval.textContent = data.approval;
  announce(data.status, operatorStatus);
}

function setOperatorRequest(name) {
  const data = OPERATOR_REQUESTS[name];
  if (!data) return setOperatorRequest('attention');
  operatorRequestButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.operatorRequest === name)));
  operatorApprove?.setAttribute('aria-pressed', 'false');
  if (operatorApprove) operatorApprove.textContent = operatorApproveLabel;
  renderOperatorRequest(data);
}

operatorRequestButtons.forEach((button) => button.addEventListener('click', () => setOperatorRequest(button.dataset.operatorRequest)));
operatorApprove?.addEventListener('click', () => {
  operatorApprove.setAttribute('aria-pressed', 'true');
  operatorApprove.textContent = 'Sample brief approved';
  announce('Sample brief approved in this local demonstration. Nothing was sent or changed.', operatorStatus);
});

const DOCUMENT_TASKS = {
  commitments: {
    task: 'Find overdue commitments',
    finding: 'One customer update is overdue.',
    source: 'Customer Commitments.csv, row 4 (fictional source)',
    status: 'Synthetic finding ready for review.'
  },
  policy: {
    task: 'Summarize the service policy',
    finding: 'Owner review is required before after-hours dispatch.',
    source: 'Northstar Service Policy.pdf, p. 3 (fictional source)',
    status: 'Synthetic policy summary ready for review.'
  },
  dates: {
    task: 'Compare project dates',
    finding: 'The Cedar milestone follows the Northstar review by four business days.',
    source: 'Q3 Project Notes.docx, fictional schedule table',
    status: 'Synthetic date comparison ready for review.'
  }
};

const documentTaskButtons = [...document.querySelectorAll('[data-document-task]')];
const documentReset = document.querySelector('[data-document-reset]');
const documentFindings = document.querySelector('[data-document-findings]');
const documentSource = document.querySelector('[data-document-source]');
const documentStatus = document.querySelector('[data-document-status]');
const documentIntro = {
  finding: 'Choose a bounded task to inspect the fictional source files.',
  source: 'Only the three listed fictional sources will be used.',
  status: 'Document demonstration reset and ready. No files were read and nothing was changed.'
};

function renderDocumentTask(data) {
  documentFindings.textContent = data.finding;
  documentSource.textContent = data.source;
  documentStatus.textContent = data.status;
  announce(data.status, documentStatus);
}

function runDocumentTask(name) {
  const data = DOCUMENT_TASKS[name];
  if (!data) return runDocumentTask('commitments');
  documentTaskButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.documentTask === name)));
  renderDocumentTask(data);
}

documentTaskButtons.forEach((button) => button.addEventListener('click', () => runDocumentTask(button.dataset.documentTask)));
documentReset?.addEventListener('click', () => {
  documentTaskButtons.forEach((button) => button.setAttribute('aria-pressed', 'false'));
  renderDocumentTask(documentIntro);
});

function setDemoState(nextState) {
  currentDemoState = Math.max(0, Math.min(2, Number(nextState)));
  demoPanels.forEach((panel, index) => {
    const active = index === currentDemoState;
    panel.hidden = !active;
    panel.classList.toggle('is-active', active);
  });
  demoStateButtons.forEach((button, index) => {
    const active = index === currentDemoState;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-selected', String(active));
    button.tabIndex = active ? 0 : -1;
  });
  if (demoNext) demoNext.innerHTML = `${nextLabels[currentDemoState]} <span aria-hidden="true">→</span>`;
  announce(`Stage ${currentDemoState + 1} of 3: ${stateLabels[currentDemoState]}.`);
}

demoStateButtons.forEach((button) => button.addEventListener('click', () => setDemoState(button.dataset.demoState)));
demoNext?.addEventListener('click', () => setDemoState(currentDemoState === 2 ? 0 : currentDemoState + 1));

function resetDemo() {
  savedDraft = originalDraft;
  if (draftEditor) {
    draftEditor.value = originalDraft;
    draftEditor.classList.remove('is-editing');
  }
  if (draftText) draftText.textContent = originalDraft;
  document.querySelectorAll('.brief-row').forEach((row) => row.classList.remove('is-approved', 'is-skipped'));
  setDemoState(0);
  announce('Demo reset. Stage 1 of 3: Lead arrives.');
}
demoReset?.addEventListener('click', resetDemo);

document.querySelectorAll('[data-action="edit"]').forEach((button) => {
  button.addEventListener('click', () => {
    setDemoState(1);
    if (draftEditor) {
      draftEditor.classList.add('is-editing');
      draftEditor.focus();
    }
    announce('Draft editor opened. Nothing will be sent.');
  });
});

document.querySelector('[data-action="save"]')?.addEventListener('click', () => {
  if (!draftEditor || !draftText) return;
  savedDraft = draftEditor.value.trim() || originalDraft;
  draftEditor.value = savedDraft;
  draftText.textContent = savedDraft;
  draftEditor.classList.remove('is-editing');
  announce('Draft edit saved in this synthetic demonstration. Nothing was sent.');
});

document.querySelectorAll('[data-action="approve"]').forEach((button) => {
  button.addEventListener('click', () => {
    const row = button.closest('.brief-row');
    row?.classList.remove('is-skipped');
    row?.classList.add('is-approved');
    announce('Sample draft approved in the demonstration. Nothing was sent.');
  });
});

document.querySelectorAll('[data-action="skip"]').forEach((button) => {
  button.addEventListener('click', () => {
    const row = button.closest('.brief-row');
    row?.classList.remove('is-approved');
    row?.classList.add('is-skipped');
    announce('Sample item skipped in the demonstration.');
  });
});

const heroBooking = document.querySelector('#hero-booking');
const stickyGuardSections = ['[data-owner-story]', '#demo-gallery']
  .map((selector) => document.querySelector(selector))
  .filter(Boolean);
const stickyCta = document.querySelector('[data-sticky-cta]');
let heroInView = true;
const guardSectionsInView = new Set();
function updateStickyCta() {
  if (!stickyCta) return;
  const heroRect = heroBooking?.getBoundingClientRect();
  heroInView = Boolean(heroRect && heroRect.top < window.innerHeight && heroRect.bottom > 0);
  guardSectionsInView.clear();
  stickyGuardSections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) guardSectionsInView.add(section);
  });
  const show = !heroInView && guardSectionsInView.size === 0;
  stickyCta.classList.toggle('is-visible', show);
  stickyCta.setAttribute('aria-hidden', String(!show));
  stickyCta.tabIndex = show ? 0 : -1;
}
if (heroBooking && stickyCta && 'IntersectionObserver' in window) {
  const heroObserver = new IntersectionObserver(([entry]) => {
    heroInView = entry.isIntersecting;
    updateStickyCta();
  }, { threshold: 0.1 });
  heroObserver.observe(heroBooking);
  const guardObserver = new IntersectionObserver(() => updateStickyCta(), { threshold: 0 });
  stickyGuardSections.forEach((section) => guardObserver.observe(section));
}
window.addEventListener('scroll', updateStickyCta, { passive: true });
window.addEventListener('resize', updateStickyCta);

setDemoState(0);
if (galleryTabButtons.length) setGalleryDemo('operator');
if (operatorRequestButtons.length) setOperatorRequest('attention');
if (documentTaskButtons.length) runDocumentTask('commitments');
updateStickyCta();
requestAnimationFrame(() => requestAnimationFrame(updateStickyCta));
