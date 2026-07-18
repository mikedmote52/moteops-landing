const careRoot = document.querySelector('[data-care-root]');

if (careRoot) {
  const viewButtons = [...careRoot.querySelectorAll('[data-care-view]')];
  const viewPanels = [...careRoot.querySelectorAll('[data-care-panel]')];
  const familyButtons = [...careRoot.querySelectorAll('[data-care-family-tab]')];
  const familyPanels = [...careRoot.querySelectorAll('[data-care-family-panel]')];
  const careStatus = careRoot.querySelector('[data-care-status]');
  const careTitle = careRoot.querySelector('[data-care-title]');
  const careSubtitle = careRoot.querySelector('[data-care-subtitle]');
  const guide = careRoot.querySelector('[data-care-guide-dialog]');
  const guideButton = careRoot.querySelector('[data-care-guide]');
  let guideOpener = null;

  const viewCopy = {
    today: ["Good morning, CC's", 'A calm, clear view of what needs attention today.'],
    families: ['Families & Enrollment', 'Move every inquiry forward with personal, organized follow-up.'],
    modules: ['Care Hub modules', 'The operating areas that can make up the complete system.'],
    integrations: ['Integration registry', 'Replaceable connection points for the tools the directors approve.'],
    discovery: ['Director discovery', 'Questions that turn assumptions into an accurate build.']
  };

  const profileCopy = {
    avery: ['Avery Chen · Milo', 'Tour requested · Toddler program · Website inquiry', 'Offer three weekday tour times'],
    jordan: ['Jordan Rivera · Sofia', 'Tour scheduled · Preschool program · Family referral', 'Prepare Friday tour notes'],
    taylor: ['Taylor Brooks · Noah', 'Application · Infant program · Google inquiry', 'Request two remaining forms'],
    morgan: ['Morgan Patel · Leela', 'New lead · Preschool program · Phone inquiry', 'Prepare first response'],
    casey: ['Casey Nguyen · Eli', 'Enrolled · Pre-K program · Sibling referral', 'Placement confirmed'],
    riley: ['Riley Thompson · Emma', 'Waitlist · Toddler program · Yelp inquiry', 'Review classroom capacity']
  };

  function announceCare(message) {
    if (careStatus) careStatus.textContent = message;
  }

  function setFamilyTab(tab) {
    const selected = familyButtons.some((button) => button.dataset.careFamilyTab === tab) ? tab : 'overview';
    familyButtons.forEach((button) => {
      const active = button.dataset.careFamilyTab === selected;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    familyPanels.forEach((panel) => { panel.hidden = panel.dataset.careFamilyPanel !== selected; });
    announceCare(`${selected.replaceAll('-', ' ')} open. All records in this demonstration are fictional.`);
  }

  function setCareView(view, familyTab) {
    const selected = viewCopy[view] ? view : 'today';
    viewButtons.forEach((button) => {
      const active = button.dataset.careView === selected;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    viewPanels.forEach((panel) => { panel.hidden = panel.dataset.carePanel !== selected; });
    if (careTitle) careTitle.textContent = viewCopy[selected][0];
    if (careSubtitle) careSubtitle.textContent = viewCopy[selected][1];
    if (selected === 'families') setFamilyTab(familyTab || 'overview');
    else announceCare(`${viewCopy[selected][0]} open. All records in this demonstration are fictional.`);
  }

  viewButtons.forEach((button) => button.addEventListener('click', () => setCareView(button.dataset.careView)));
  familyButtons.forEach((button) => button.addEventListener('click', () => setFamilyTab(button.dataset.careFamilyTab)));

  careRoot.querySelectorAll('[data-care-metric]').forEach((button) => {
    button.addEventListener('click', () => setCareView('families', button.dataset.careMetric));
  });

  careRoot.querySelectorAll('[data-care-open-family]').forEach((button) => {
    button.addEventListener('click', () => setCareView('families', button.dataset.careOpenFamily));
  });

  const taskButtons = [...careRoot.querySelectorAll('[data-care-task]')];
  taskButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const complete = button.getAttribute('aria-pressed') !== 'true';
      button.setAttribute('aria-pressed', String(complete));
      const label = button.querySelector('em');
      if (label) label.textContent = complete ? 'Complete' : 'Mark done';
      const queueTasks = [...careRoot.querySelectorAll('.care-queue [data-care-task]')];
      const openCount = queueTasks.filter((task) => task.getAttribute('aria-pressed') !== 'true').length;
      const counter = careRoot.querySelector('[data-care-open-count]');
      if (counter) counter.textContent = String(openCount);
      announceCare(complete ? 'Demo task completed locally. Nothing was sent or changed.' : 'Demo task returned to the open queue.');
    });
  });

  const formButtons = [...careRoot.querySelectorAll('[data-care-form]')];
  function updateFormCount() {
    const complete = formButtons.filter((button) => button.getAttribute('aria-pressed') === 'true').length;
    careRoot.querySelectorAll('[data-care-form-count]').forEach((count) => { count.textContent = `${complete} / ${formButtons.length}`; });
  }
  formButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const complete = button.getAttribute('aria-pressed') !== 'true';
      button.setAttribute('aria-pressed', String(complete));
      const mark = button.querySelector('i');
      const label = button.querySelector('small');
      if (mark) mark.textContent = complete ? '✓' : '';
      if (label) label.textContent = complete ? 'Complete' : 'Needs follow-up';
      updateFormCount();
      announceCare(`Demo form marked ${complete ? 'complete' : 'for follow-up'}. No family record was changed.`);
    });
  });

  careRoot.querySelectorAll('[data-care-profile]').forEach((button) => {
    button.addEventListener('click', () => {
      const profile = profileCopy[button.dataset.careProfile];
      if (!profile) return;
      setCareView('families', 'family-profiles');
      careRoot.querySelectorAll('.care-profile-list [data-care-profile]').forEach((item) => item.classList.toggle('is-active', item.dataset.careProfile === button.dataset.careProfile));
      const name = careRoot.querySelector('[data-care-profile-name]');
      const detail = careRoot.querySelector('[data-care-profile-detail]');
      const next = careRoot.querySelector('[data-care-profile-next]');
      if (name) name.textContent = profile[0];
      if (detail) detail.textContent = profile[1];
      if (next) next.textContent = profile[2];
      announceCare(`${profile[0]} profile open. This is fictional demonstration information.`);
    });
  });

  function closeGuide() {
    if (!guide) return;
    guide.hidden = true;
    guide.setAttribute('aria-hidden', 'true');
    guideOpener?.focus();
  }

  guideButton?.addEventListener('click', () => {
    guideOpener = guideButton;
    guide.hidden = false;
    guide.setAttribute('aria-hidden', 'false');
    guide.querySelector('[data-care-modal-close]')?.focus();
  });
  guide?.querySelectorAll('[data-care-modal-close]').forEach((button) => button.addEventListener('click', closeGuide));
  guide?.addEventListener('click', (event) => { if (event.target === guide) closeGuide(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && guide && !guide.hidden) closeGuide(); });

  updateFormCount();
  setCareView('today');
}
