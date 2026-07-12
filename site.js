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

const SYSTEM_ROUTES = {
  brief: {
    input: 'Phone request',
    inputCopy: 'The owner asks what needs attention from the secure phone interface.',
    model: 'Current project state is summarized with the configured task model.',
    output: 'Owner brief',
    ready: 'Morning-brief route traced. The sample output is waiting for owner review.'
  },
  'private-files': {
    input: 'Selected private files',
    inputCopy: 'The owner selects a bounded set of documents for local review.',
    model: 'The sample task routes to a local model; no file leaves the demonstration.',
    output: 'Private review notes',
    ready: 'Private-file route traced. The synthetic notes remain local to this page.'
  },
  'follow-up': {
    input: 'Open customer item',
    inputCopy: 'A supervised queue surfaces one incomplete customer follow-up.',
    model: 'A task-appropriate model prepares a draft using the sample policy context.',
    output: 'Approval-ready draft',
    ready: 'Follow-up route traced. The sample draft is waiting for owner approval.'
  }
};

const systemRouteButtons = [...document.querySelectorAll('[data-system-route]')];
const systemLayers = [...document.querySelectorAll('[data-system-layer]')];
const systemPanel = document.querySelector('#system-panel');
const systemEvidence = document.querySelector('[data-system-evidence]');
const systemStatus = document.querySelector('[data-system-status]');
const systemInputTitle = document.querySelector('[data-system-layer-title]');
const systemInputCopy = document.querySelector('[data-system-layer-copy]');
const systemModel = document.querySelector('[data-system-model]');
const systemOutput = document.querySelector('[data-system-output]');
const systemApprove = document.querySelector('[data-system-approve]');
const systemApproveLabel = systemApprove?.textContent ?? 'Approve sample output';
const reduceSystemMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
let systemRouteRun = 0;

function resetSystemApproval() {
  if (!systemApprove) return;
  systemApprove.setAttribute('aria-pressed', 'false');
  systemApprove.textContent = systemApproveLabel;
}

function setSystemRoute(routeName) {
  const route = SYSTEM_ROUTES[routeName] ?? SYSTEM_ROUTES.brief;
  const selectedRoute = SYSTEM_ROUTES[routeName] ? routeName : 'brief';
  systemRouteButtons.forEach((button) => {
    const active = button.dataset.systemRoute === selectedRoute;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-selected', String(active));
    button.tabIndex = active ? 0 : -1;
  });
  const activeButton = systemRouteButtons.find((button) => button.dataset.systemRoute === selectedRoute);
  if (systemPanel && activeButton) systemPanel.setAttribute('aria-labelledby', activeButton.id);
  const routeRun = ++systemRouteRun;
  systemLayers.forEach((layer) => {
    layer.classList.remove('is-active', 'is-current');
    layer.style.transitionDelay = '0ms';
  });
  const activateLayers = () => {
    if (routeRun !== systemRouteRun) return;
    systemLayers.forEach((layer) => layer.classList.add('is-active'));
    systemLayers[systemLayers.length - 1]?.classList.add('is-current');
  };
  if (reduceSystemMotion) activateLayers();
  else requestAnimationFrame(() => requestAnimationFrame(() => {
    systemLayers.forEach((layer, index) => {
      window.setTimeout(() => {
        if (routeRun !== systemRouteRun) return;
        systemLayers.forEach((currentLayer) => currentLayer.classList.remove('is-current'));
        layer.classList.add('is-active', 'is-current');
      }, index * 120);
    });
  }));
  if (systemInputTitle) systemInputTitle.textContent = route.input;
  if (systemInputCopy) systemInputCopy.textContent = route.inputCopy;
  if (systemModel) systemModel.textContent = route.model;
  if (systemOutput) systemOutput.textContent = route.output;
  resetSystemApproval();
  announce(route.ready, systemStatus);
}

systemRouteButtons.forEach((button, index) => {
  button.addEventListener('click', () => setSystemRoute(button.dataset.systemRoute));
  button.addEventListener('keydown', (event) => {
    const lastIndex = systemRouteButtons.length - 1;
    let nextIndex;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % systemRouteButtons.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + systemRouteButtons.length) % systemRouteButtons.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = lastIndex;
    else return;

    event.preventDefault();
    const nextButton = systemRouteButtons[nextIndex];
    setSystemRoute(nextButton.dataset.systemRoute);
    nextButton.focus();
  });
});

systemApprove?.setAttribute('aria-pressed', 'false');
systemApprove?.addEventListener('click', () => {
  systemApprove.setAttribute('aria-pressed', 'true');
  systemApprove.textContent = 'Sample output approved';
  announce('Synthetic route approved. Nothing was sent and no live system was changed.', systemStatus);
});

document.querySelector('[data-system-reset]')?.addEventListener('click', () => {
  setSystemRoute('brief');
  resetSystemApproval();
  announce('Synthetic workbench reset to the morning-brief route. Nothing was sent.', systemStatus);
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

const calculator = document.querySelector('[data-calculator]');
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

function boundedNumber(id) {
  const input = document.querySelector(`#${id}`);
  if (!input) return 0;
  const value = Number(input.value);
  const min = Number(input.min || 0);
  const max = Number(input.max || Number.MAX_SAFE_INTEGER);
  return Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : 0;
}

function updateCalculator() {
  const followUps = boundedNumber('follow-ups');
  const minutes = boundedNumber('minutes');
  const hourlyValue = boundedNumber('hourly-value');
  const missedLeads = boundedNumber('missed-leads');
  const jobValue = boundedNumber('job-value');
  const annualLabor = followUps * minutes / 60 * hourlyValue * 50;
  const annualLeadRisk = missedLeads * jobValue * 12;
  const annualTotal = annualLabor + annualLeadRisk;
  const auditPercent = annualTotal > 0 ? Math.round(1000 / annualTotal * 100) : 0;
  const laborResult = document.querySelector('[data-labor-result]');
  const leadResult = document.querySelector('[data-lead-result]');
  const totalResult = document.querySelector('[data-total-result]');
  const auditResult = document.querySelector('[data-audit-result]');
  if (laborResult) laborResult.textContent = money.format(annualLabor);
  if (leadResult) leadResult.textContent = money.format(annualLeadRisk);
  if (totalResult) totalResult.textContent = money.format(annualTotal);
  if (auditResult) auditResult.textContent = annualTotal > 0
    ? `A $1,000 audit equals about ${auditPercent}% of this estimate.`
    : 'Add your estimates to compare the $1,000 audit.';
}
calculator?.addEventListener('input', updateCalculator);
updateCalculator();

const careTabButtons = [...document.querySelectorAll('[data-care-tab]')];
const carePanels = [...document.querySelectorAll('[data-care-panel]')];
const careStatus = document.querySelector('[data-care-status]');
function setCareTab(tabName) {
  careTabButtons.forEach((button) => {
    const active = button.dataset.careTab === tabName;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-selected', String(active));
    button.tabIndex = active ? 0 : -1;
  });
  carePanels.forEach((panel) => { panel.hidden = panel.dataset.carePanel !== tabName; });
  if (careStatus) careStatus.textContent = `Care Hub demo: ${tabName.replace('-', ' ')} view open. All records are fictional.`;
}
careTabButtons.forEach((button) => button.addEventListener('click', () => setCareTab(button.dataset.careTab)));
document.querySelectorAll('[data-care-task]').forEach((button) => button.addEventListener('click', () => {
  const complete = button.classList.toggle('is-complete');
  if (!button.dataset.originalLabel) button.dataset.originalLabel = button.textContent;
  button.textContent = complete ? 'Marked ready ✓' : button.dataset.originalLabel;
  if (careStatus) careStatus.textContent = complete ? 'Sample task marked ready in this Care Hub demo. Nothing was sent.' : 'Sample task returned to its open state.';
}));
document.querySelectorAll('[data-care-form]').forEach((button) => button.addEventListener('click', () => {
  const complete = button.getAttribute('aria-pressed') !== 'true';
  button.setAttribute('aria-pressed', String(complete));
  button.classList.toggle('is-complete', complete);
  const mark = button.querySelector('span');
  const label = button.querySelector('em');
  if (mark) mark.textContent = complete ? '✓' : '';
  if (label) label.textContent = complete ? 'Complete' : 'Needs follow-up';
  if (careStatus) careStatus.textContent = `Sample form marked ${complete ? 'complete' : 'for follow-up'}. No family record was changed.`;
}));
if (careTabButtons.length) setCareTab('pipeline');

const heroBooking = document.querySelector('#hero-booking');
const stickyGuardSections = ['#aios-workbench', '#demo', '#care-hub-demo']
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
if (systemRouteButtons.length) setSystemRoute('brief');
updateStickyCta();
requestAnimationFrame(() => requestAnimationFrame(updateStickyCta));
