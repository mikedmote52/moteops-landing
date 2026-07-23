import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const html = readFileSync(resolve(root, 'index.html'), 'utf8');
const css = readFileSync(resolve(root, 'site.css'), 'utf8');
const careCss = existsSync(resolve(root, 'care-hub-showcase.css'))
  ? readFileSync(resolve(root, 'care-hub-showcase.css'), 'utf8')
  : '';
const ownerCss = existsSync(resolve(root, 'owner-story.css'))
  ? readFileSync(resolve(root, 'owner-story.css'), 'utf8')
  : '';
const studioCss = existsSync(resolve(root, 'studio.css'))
  ? readFileSync(resolve(root, 'studio.css'), 'utf8')
  : '';
const js = readFileSync(resolve(root, 'site.js'), 'utf8');

function attribute(tag, name) {
  return tag.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']*)["']`, 'i'))?.[1] ?? null;
}

function elementById(id, expectedTag) {
  const opening = [...html.matchAll(/<([a-z][\w:-]*)\b[^>]*>/gi)].find((match) =>
    (!expectedTag || match[1].toLowerCase() === expectedTag.toLowerCase()) && attribute(match[0], 'id') === id);
  assert.ok(opening, `missing #${id}${expectedTag ? ` ${expectedTag}` : ''}`);
  const tag = opening[1].toLowerCase();
  const tokens = [...html.slice(opening.index).matchAll(new RegExp(`<\\/?${tag}\\b[^>]*>`, 'gi'))];
  let depth = 0;
  for (const token of tokens) {
    depth += /^<\//.test(token[0]) ? -1 : 1;
    if (depth === 0) {
      const end = opening.index + token.index + token[0].length;
      return { start: opening.index, end, openingTag: opening[0], source: html.slice(opening.index, end) };
    }
  }
  assert.fail(`missing closing </${tag}> for #${id}`);
}

function tagsWithRole(source, tagName, role) {
  return [...source.matchAll(new RegExp(`<${tagName ?? '[a-z][\\w:-]*'}\\b[^>]*>`, 'gi'))]
    .map(([tag]) => tag).filter((tag) => attribute(tag, 'role') === role);
}

function galleryPanelRanges(gallery) {
  const panels = tagsWithRole(gallery.source, null, 'tabpanel').map((openingTag) => ({
    openingTag,
    id: attribute(openingTag, 'id'),
    panel: attribute(openingTag, 'data-gallery-panel'),
    start: gallery.source.indexOf(openingTag),
  })).sort((a, b) => a.start - b.start);
  return panels.map((panel, index) => ({
    ...panel,
    source: gallery.source.slice(panel.start, panels[index + 1]?.start ?? gallery.source.length),
  }));
}

test('positions Mote Ops as the operating layer for existing people and tools', () => {
  assert.equal((html.match(/<h1\b/gi) ?? []).length, 1);
  const hero = elementById('top', 'section').source;
  assert.match(hero, /Your people and tools already do the work\./i);
  assert.match(hero, /Mote Ops helps them work as one\./i);
  assert.match(hero, /finds the operational drag/i);
  assert.match(hero, /keeps consequential actions behind approval/i);
  assert.match(hero, /Book a fit conversation/i);
  assert.doesNotMatch(hero, /MCP|agent runtime|control plane|model routing/i);
});

test('shows a truthful small-business chaos-to-control story', () => {
  const hero = elementById('top', 'section').source;
  assert.doesNotMatch(hero, /hero-system-plate|hero-inputs|hero-core|hero-outputs/i);
  assert.match(hero, /data-opening-story/i);
  assert.match(hero, /mote-ops-opening-v3-1080\.mp4/i);
  assert.match(hero, /mote-ops-opening-v3-720\.mp4/i);
  assert.doesNotMatch(hero, /<figcaption/i);
  assert.doesNotMatch(hero, /fictional overwhelmed business owner finds Mote Ops/i);
  assert.match(hero, /data-owner-story/i);
  assert.doesNotMatch(hero, /assets\/small-business-owner-overwhelmed-v1\.webp/i);
  for (const source of ['Calls \\+ texts', 'Email', 'Calendar', 'Files \\+ spreadsheets', 'Finance']) {
    assert.match(hero, new RegExp(source, 'i'));
  }
  assert.match(hero, /organize incoming work/i);
  assert.match(hero, /prepare useful next steps/i);
  assert.match(hero, /hold consequential actions for approval/i);
  assert.match(hero, /class="owner-organize"/i);
  assert.match(hero, /class="owner-outcome"/i);
  assert.doesNotMatch(hero, /class="owner-functions"/i);
  assert.match(hero, /A noisy day becomes three calm decisions\./i);
  assert.match(hero, /class="owner-decisions"/i);
  for (const decision of ['Follow up', 'Review payment', 'Confirm schedule']) {
    assert.match(hero, new RegExp(`<strong>${decision}</strong>`, 'i'));
  }
  assert.match(hero, /one calm place looks like for CC's Learning Center/i);
  assert.match(hero, /href="#care-hub-showcase"/i);
  assert.match(hero, /Illustrative scenario using fictional business information\./i);
  assert.doesNotMatch(hero, /moteops-transformation-hero-(?:mobile-)?v1\.png/i);
});

test('isolates and preserves the owner story presentation', () => {
  assert.ok(existsSync(resolve(root, 'assets/moteops-transformation-hero-v1.png')));
  assert.match(html, /owner-story\.css\?v=cinematic-20260722/i);
  assert.match(html, /owner-story\.js\?v=cinematic-20260722/i);
  assert.match(ownerCss, /prefers-reduced-motion:\s*reduce/i);
  assert.match(ownerCss, /@media\s*\(max-width:\s*760px\)/i);
  assert.doesNotMatch(ownerCss, /\.owner-connect\s*\{[^}]*linear-gradient/si);
});

test('uses the approved cinematic section order', () => {
  const orderedIds = ['top', 'owner-story', 'demo-gallery', 'care-hub-showcase', 'evidence', 'boundaries', 'mote-ops-studio', 'method', 'capabilities', 'start', 'questions'];
  let cursor = -1;
  for (const id of orderedIds) {
    const next = html.indexOf(`id="${id}"`);
    assert.ok(next > cursor, `${id} should appear in the approved order`);
    cursor = next;
  }
  assert.equal((html.match(/<section\b[^>]*data-page-section\b/gi) ?? []).length, 8);
  for (const obsolete of ['id="calculator"', 'id="operator-day"', 'Annual follow-up labor burden', 'equipment-plate']) {
    assert.doesNotMatch(html, new RegExp(obsolete, 'i'));
  }
});

test('keeps six recognizable frictions inside the commercial close', () => {
  const start = elementById('start', 'section');
  assert.match(start.source, /class="start-frictions"/i);
  for (const phrase of [
    'Your inbox has become the company task list.',
    'Leads and follow ups disappear between people and tools.',
    'Staff keep searching for the same documents and answers.',
    'Important work depends on what the owner remembers.',
    'Repetitive updates, reports, and data entry consume the day.',
    'You want to use AI but do not know what is worth building.',
  ]) assert.ok(start.source.includes(phrase), `missing friction: ${phrase}`);
  assert.doesNotMatch(start.source, /\b(?:LLM|RAG|API|webhook|vector|inference|orchestration|agent runtime)\b/i);
});

test('presents six outcomes instead of a technical product catalog', () => {
  const capabilities = elementById('capabilities', 'section').source;
  for (const capability of [
    'Automate repetitive office work',
    'Connect the tools you already use',
    'Build a private assistant over company information',
    'Create supervised agents for customer and internal work',
    'Build focused dashboards and client workspaces',
    'Train your team to use AI confidently',
  ]) assert.match(capabilities, new RegExp(capability, 'i'));
  assert.match(capabilities, /tool agnostic/i);
  assert.match(capabilities, /simplest dependable approach/i);
});

test('shows the six stage method with a deliverable per stage after the working proof', () => {
  const method = elementById('method', 'section');
  const gallery = elementById('demo-gallery', 'section');
  assert.ok(gallery.end <= method.start, 'the method should follow the working proof');
  for (const stage of ['Diagnose', 'Map', 'Adapt', 'Install', 'Teach', 'Expand']) {
    assert.match(method.source, new RegExp(`>${stage}<`, 'i'));
  }
  for (const deliverable of ['Written diagnosis', 'Workflow map', 'Build plan', 'Working install', 'Owner walkthrough', 'Evidence review']) {
    assert.match(method.source, new RegExp(deliverable, 'i'));
  }
  assert.match(method.source, /Mike Mote/i);
  assert.match(method.source, /not a dashboard vendor/i);
  assert.match(method.source, /one accountable person/i);
});

test('makes the real Care Hub workflow the primary working demonstration', () => {
  const gallery = elementById('demo-gallery', 'section');
  const careShowcase = elementById('care-hub-showcase', 'section');
  assert.ok(careShowcase.start >= gallery.start && careShowcase.end <= gallery.end);
  assert.match(careShowcase.source, /A WORKING SMALL-BUSINESS ENVIRONMENT/i);
  assert.match(careShowcase.source, /Step inside something we built\./i);
  assert.match(careShowcase.source, /CC['’]s Care Hub turns scattered enrollment work into one clear place/i);
  assert.match(careShowcase.source, /Interactive demonstration using fictional family records/i);
  assert.match(careShowcase.source, /workflow and interface are real; client results are still being measured/i);
  for (const label of ['Today', 'Families', 'Modules', 'Integrations', 'Discovery']) {
    assert.match(careShowcase.source, new RegExp(`>${label}<`, 'i'));
  }
  for (const metric of ['6 families', '2 open', '3 / 5', '1 review']) {
    assert.match(careShowcase.source, new RegExp(metric.replace('/', '\\/'), 'i'));
  }
  for (const familyView of ['Overview', 'Pipeline', 'Tours', 'Family profiles', 'Required forms', 'Classroom placement']) {
    assert.match(careShowcase.source, new RegExp(`>${familyView}<`, 'i'));
  }
});

test('shows how the Care Hub implementation pattern adapts to other small businesses', () => {
  const careShowcase = elementById('care-hub-showcase', 'section').source;
  for (const phrase of [
    'THE PATTERN TRAVELS',
    'We build around the way your business actually works.',
    'Insurance',
    'Home services',
    'Clinic',
    'Professional office',
    'Show Mike the part of your business that feels scattered.',
  ]) assert.match(careShowcase, new RegExp(phrase, 'i'));
});

test('keeps three secondary demonstrations accessible but collapsed by default', () => {
  const moreExamples = elementById('more-examples', 'details');
  assert.doesNotMatch(moreExamples.openingTag, /\bopen\b/i);
  assert.equal(tagsWithRole(moreExamples.source, null, 'tablist').length, 1);
  const tabs = tagsWithRole(moreExamples.source, 'button', 'tab');
  assert.equal(tabs.length, 3);
  assert.deepEqual(tabs.map((tag) => attribute(tag, 'data-gallery-demo')), ['operator', 'documents', 'leads']);
  const labels = [
    'Ask what needs attention from a phone',
    'Find a cited answer inside business information',
    'Move a new lead from message to approved response',
  ];
  tabs.forEach((tab, index) => {
    const start = moreExamples.source.indexOf(tab);
    const end = moreExamples.source.indexOf('</button>', start);
    const text = moreExamples.source.slice(start + tab.length, end).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    assert.equal(text, labels[index]);
  });
  const panels = galleryPanelRanges(moreExamples);
  assert.equal(panels.length, 3);
  assert.equal(panels.filter(({ openingTag }) => !/\bhidden(?:\s|>)/i.test(openingTag)).length, 1);
  for (const panel of panels) {
    assert.match(panel.source, /Customer problem:/i);
    assert.match(panel.source, /What this proves:/i);
    assert.match(panel.source, /Synthetic public data/i);
    assert.match(panel.source, /No live (?:business data|connection)/i);
  }
});

test('places three fictional Studio studies after operational evidence', () => {
  const evidence = elementById('evidence', 'section');
  const studio = elementById('mote-ops-studio', 'section');
  const method = elementById('method', 'section');
  assert.ok(studio.start > evidence.end, 'Studio must follow operational evidence');
  assert.ok(studio.end < method.start, 'Studio must precede the method');
  assert.match(studio.source, /Mote Ops Studio/i);
  assert.match(studio.source, /Systems can work well and still feel exceptional/i);
  assert.equal((studio.source.match(/data-studio-study/gi) ?? []).length, 3);
  const films = [...studio.source.matchAll(/<video\b[^>]*\bdata-studio-film\b[^>]*>[\s\S]*?<\/video>/gi)].map(([film]) => film);
  assert.equal(films.length, 2, 'Studio should expose exactly two deferred films');
  for (const film of films) {
    const video = film.match(/^<video\b[^>]*>/i)?.[0] ?? '';
    const poster = attribute(video, 'poster');
    assert.equal(attribute(video, 'preload'), 'none');
    assert.ok(poster?.startsWith('demo/'), 'Studio film poster must be local');
    assert.ok(existsSync(resolve(root, poster)), `missing Studio film poster: ${poster}`);
    const sources = [...film.matchAll(/<source\b[^>]*>/gi)].map(([source]) => source);
    assert.equal(sources.length, 1, 'Studio film should have one nested source');
    const source = sources[0];
    const dataSrc = attribute(source, 'data-src');
    assert.ok(dataSrc?.startsWith('demo/'), 'Studio film source must be local and deferred');
    assert.ok(existsSync(resolve(root, dataSrc)), `missing Studio film source: ${dataSrc}`);
    assert.doesNotMatch(source, /(?:^|\s)src\s*=/i, 'Studio film source must not eagerly load');
  }
  for (const route of [
    'demo/onde-halo/index.html',
    'demo/vessel-zero/index.html',
    'demo/solaire-01/index.html',
  ]) assert.match(studio.source, new RegExp(`href=["']${route.replaceAll('/', '\\/')}["']`, 'i'));
  assert.equal((studio.source.match(/FICTIONAL (?:PRODUCT|DESIGN) (?:CONCEPT|STUDY)/gi) ?? []).length, 3);
  assert.doesNotMatch(studio.source, /client result|measured outcome|production install/i);
  assert.match(studioCss, /\.studio-heading \.kicker\{color:#d37b4c\}/i);
});

test('preserves real local controls across the Care Hub and secondary demonstrations', () => {
  const gallery = elementById('demo-gallery', 'section').source;
  for (const hook of [
    'data-operator-request', 'data-operator-approve', 'data-document-task', 'data-document-reset',
    'data-demo-state', 'data-demo-next', 'data-demo-reset', 'data-action="approve"',
    'data-action="edit"', 'data-action="skip"', 'data-care-view', 'data-care-family-tab',
    'data-care-metric', 'data-care-task', 'data-care-form', 'data-care-guide',
  ]) assert.match(gallery, new RegExp(hook, 'i'));
  assert.doesNotMatch(gallery, /href="https:\/\/care\.moteops\.tech\/"/i);
  for (const button of gallery.matchAll(/<button\b[^>]*data-care-task[^>]*>/gi)) {
    assert.match(button[0], /data-open-label=/i);
    assert.match(button[0], /data-complete-label=/i);
  }
  assert.match(careCss, /min-height:\s*44px/i);
  assert.doesNotMatch(careCss, /\.care-shell\s*\{[^}]*margin-(?:left|right):\s*-\d/si);
});

test('centers evidence on the real Care Hub build without inflating results', () => {
  const evidence = elementById('evidence', 'section').source;
  assert.match(evidence, /Clear boundaries are part of the product\./i);
  assert.match(evidence, /class="boundary-ledger"/i);
  for (const boundary of ['Minimum access', 'Synthetic testing first', 'Visible approval rules', 'No invented results', 'Documented model and data choices']) {
    assert.match(evidence, new RegExp(boundary, 'i'));
  }
  assert.match(evidence, /href="ai-practices\.html"/i);
  assert.match(evidence, /href="privacy\.html"/i);
  assert.match(evidence, /href="terms\.html"/i);
  assert.match(evidence, /CC['’]s Care Hub/i);
  assert.match(evidence, /real client build/i);
  assert.match(evidence, /public demonstration uses fictional records/i);
  assert.match(evidence, /measured client results are (?:still )?being established/i);
  assert.match(evidence, /<details\b/i);
  assert.doesNotMatch(evidence.match(/<details\b[^>]*>/i)?.[0] ?? '', /\bopen\b/i);
  assert.match(evidence, /qwen3-coder:30b/i);
  assert.match(evidence, /phone access patterns/i);
  assert.doesNotMatch(html, /verified ROI|guaranteed (?:savings|revenue|results)/i);
});

test('presents the Email Organizer as honest beta evidence only', () => {
  const evidence = elementById('evidence', 'section').source;
  assert.match(evidence, /class="beta-evidence"/i);
  assert.match(evidence, /invite-only beta/i);
  assert.match(evidence, /no send path exists in the code/i);
  assert.match(evidence, /351 automated tests passing as of July 19, 2026/i);
  assert.match(evidence, /still being measured/i);
  assert.doesNotMatch(html, /not copied elsewhere/i);
  assert.doesNotMatch(html, /Billion-Dollar Solo Operator/i);
});

test('shows a modern toolbox as supporting proof rather than the product', () => {
  const evidence = elementById('evidence', 'section');
  const toolbox = elementById('toolbox', 'section');
  assert.ok(toolbox.start >= evidence.start && toolbox.end <= evidence.end);

  const caseStudyIndex = evidence.source.indexOf('class="case-study"');
  const toolboxIndex = evidence.source.indexOf('id="toolbox"');
  const technicalProofIndex = evidence.source.indexOf('class="technical-proof"');
  assert.ok(caseStudyIndex < toolboxIndex, 'toolbox should follow the real case story');
  assert.ok(toolboxIndex < technicalProofIndex, 'toolbox should precede the technical proof');

  assert.match(toolbox.source, /THE MOTE OPS TOOLBOX/i);
  assert.match(toolbox.source, /Built with the right tools\. Never trapped in one\./i);
  for (const purpose of ['Automate', 'Think', 'Connect', 'Deliver']) {
    assert.match(toolbox.source, new RegExp(`>${purpose}<`, 'i'));
  }
  for (const tool of ['n8n', 'OpenAI', 'Claude', 'Codex', 'Ollama', 'Gmail', 'Microsoft 365']) {
    assert.match(toolbox.source, new RegExp(tool, 'i'));
  }
  assert.match(toolbox.source, /You do not need to learn the platforms or decide which model to use/i);
  assert.match(toolbox.source, /Technology changes quickly\. Your system should keep working\./i);
  assert.doesNotMatch(toolbox.source, /every (?:client|project|installation) uses/i);
});

test('publishes one commercial path with the price fixed in writing and no public dollar figures', () => {
  const start = elementById('start', 'section').source;
  for (const phrase of ['Fit conversation', 'Diagnosis', 'Fixed scope, then the build', 'Teaching, then optional support']) {
    assert.match(start, new RegExp(phrase, 'i'));
  }
  assert.match(start, /agreed in writing before implementation starts/i);
  assert.match(start, /leave it alone/i);
  assert.match(start, /If I am not the right person, I say so\./i);
  assert.doesNotMatch(start, /\$\s?\d/, 'the commercial path must not show dollar figures');
  const evidence = elementById('evidence', 'section').source;
  assert.doesNotMatch(evidence, /\$\s?\d/, 'evidence must not show dollar figures');
});

test('states the legal identity and links every legal page from the footer', () => {
  const footer = html.slice(html.lastIndexOf('<footer'));
  assert.match(footer, /West Coast Medical Legal Consult LLC/i);
  assert.match(footer, /California limited liability company/i);
  assert.match(footer, /dba Mote Ops/i);
  for (const page of ['privacy.html', 'terms.html', 'ai-practices.html']) {
    assert.match(footer, new RegExp(`href="${page.replace('.', '\\.')}"`, 'i'));
    assert.ok(existsSync(resolve(root, page)), `missing ${page}`);
    const legal = readFileSync(resolve(root, page), 'utf8');
    assert.match(legal, /West Coast Medical Legal Consult LLC/i);
    assert.match(legal, /site\.css\?v=cinematic-20260722/i);
  }
  const aiPractices = readFileSync(resolve(root, 'ai-practices.html'), 'utf8');
  assert.match(aiPractices, /no send path exists in the code/i);
  assert.doesNotMatch(aiPractices, /not copied elsewhere/i);
});

test('uses one booking destination and a functional workflow email', () => {
  const calendly = [...html.matchAll(/href="(https:\/\/calendly\.com\/mikedmote\/30min)"/g)];
  assert.ok(calendly.length >= 3);
  assert.match(html, /href="email\.html"/i);
  assert.match(html, /Email Mike about a workflow/i);
  assert.doesNotMatch(html, /href="mailto:hello@moteops\.tech/i);

  const emailPagePath = resolve(root, 'email.html');
  assert.ok(existsSync(emailPagePath), 'missing email choice page');
  const emailPage = readFileSync(emailPagePath, 'utf8');
  assert.match(emailPage, /hello@moteops\.tech/i);
  assert.match(emailPage, /mail\.google\.com\/mail\/\?view=cm/i);
  assert.match(emailPage, /outlook\.office\.com\/mail\/deeplink\/compose/i);
  assert.match(emailPage, /compose\.mail\.yahoo\.com/i);
});

test('keeps accessible questions, assets, motion, and sticky action', () => {
  const questions = elementById('questions', 'section').source;
  assert.ok((questions.match(/<details\b/gi) ?? []).length >= 4);
  assert.match(html, /aria-live="polite"/i);
  assert.match(html, /data-sticky-cta[^>]*aria-hidden="true"/i);
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  const local = [...html.matchAll(/(?:href|src)="(?!https?:|mailto:|#)([^"?]+)(?:\?[^"#]*)?"/g)]
    .map(([, path]) => path.replace(/^\//, '')).filter(Boolean);
  for (const path of local) assert.ok(existsSync(resolve(root, path)), `missing ${path}`);
});

test('does not expose private local services or production client data', () => {
  const publicSources = [html, css, js].join('\n');
  const privateHost = String.raw`(?:localhost|0\.0\.0\.0|127(?:\.\d{1,3}){3}|10(?:\.\d{1,3}){3}|192\.168(?:\.\d{1,3}){2}|172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2}|\[?::1\]?|[\w.-]+\.local)`;
  assert.doesNotMatch(publicSources, new RegExp(privateHost, 'i'));
  assert.doesNotMatch(js, /\b(?:fetch|EventSource|WebSocket)\s*\(|\b(?:navigator\.)?sendBeacon\s*\(|\bnew\s+XMLHttpRequest\b/i);
  assert.match(html, /No live connection to Mike['’]s Mac/i);
});

test('uses only the approved non blue workbench palette', () => {
  for (const token of ['--bone', '--soot', '--forest', '--copper', '--signal']) assert.match(css, new RegExp(token));
  assert.doesNotMatch(css, /\b(?:blue|indigo|purple|violet|cyan|teal|navy|aqua|turquoise)\b/i);
  assert.doesNotMatch(css, /linear-gradient|radial-gradient/i);
});
