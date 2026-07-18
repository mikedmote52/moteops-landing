import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const html = readFileSync(resolve(root, 'index.html'), 'utf8');
const css = readFileSync(resolve(root, 'site.css'), 'utf8');
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

test('leads with Mike as a practical AI integration partner', () => {
  assert.equal((html.match(/<h1\b/gi) ?? []).length, 1);
  const hero = elementById('top', 'section').source;
  assert.match(hero, /You know AI could help your business\./i);
  assert.match(hero, /I help you figure out where, build the right solution, and make it work\./i);
  assert.match(hero, /simplify repetitive work/i);
  assert.match(hero, /connect the tools (?:you|they) already use/i);
  assert.match(hero, /train the people who use them/i);
  assert.match(hero, /Tell me what is slowing you down/i);
  assert.match(hero, /See what I can build/i);
  assert.doesNotMatch(hero, /\b(?:AIOS|local LLM|control plane|model routing|agent runtime|operational memory)\b/i);
});

test('shows a truthful photographic transformation instead of an abstract hero diagram', () => {
  const hero = elementById('top', 'section').source;
  assert.doesNotMatch(hero, /hero-system-plate|hero-inputs|hero-core|hero-outputs/i);
  assert.match(hero, /class="hero-transformation"/i);
  assert.match(hero, /<picture\b/i);
  assert.match(hero, /media="\(max-width: 760px\)"/i);
  assert.match(hero, /assets\/moteops-transformation-hero-mobile-v1\.png/i);
  assert.match(hero, /assets\/moteops-transformation-hero-v1\.png/i);
  assert.match(hero, /A small business owner moves from an overflowing inbox, missed calls, paperwork, and calendar conflicts to a Mote Ops agent organizing the work and a simple screen showing three decisions and a drafted email ready for approval\./i);
  for (const label of ['Before', 'Mote Ops working', 'Three decisions need you']) {
    assert.match(hero, new RegExp(`>${label}<`, 'i'));
  }
  assert.match(hero, /Illustrative demonstration using fictional business information\./i);
  assert.ok(existsSync(resolve(root, 'assets/moteops-transformation-hero-v1.png')));
  assert.ok(existsSync(resolve(root, 'assets/moteops-transformation-hero-mobile-v1.png')));
});

test('pairs every phone transformation scene with its caption', () => {
  const hero = elementById('top', 'section').source;
  assert.match(hero, /class="hero-transformation-mobile"/i);
  assert.equal((hero.match(/class="hero-transformation-mobile-stage/g) || []).length, 3);
  assert.match(hero, /hero-transformation-mobile-crop is-before[\s\S]*?<span>Before<\/span>/i);
  assert.match(hero, /hero-transformation-mobile-crop is-working[\s\S]*?<span>Mote Ops working<\/span>/i);
  assert.match(hero, /hero-transformation-mobile-crop is-result[\s\S]*?<span>Three decisions need you<\/span>/i);
});

test('uses the approved concise section order', () => {
  const orderedIds = ['problems', 'capabilities', 'process', 'demo-gallery', 'evidence', 'services', 'questions'];
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

test('names six familiar problems before technical implementation language', () => {
  const problems = elementById('problems', 'section');
  const capabilities = elementById('capabilities', 'section');
  assert.ok(problems.end <= capabilities.start);
  for (const phrase of [
    'Your inbox has become the company task list.',
    'Leads and follow ups disappear between people and tools.',
    'Staff keep searching for the same documents and answers.',
    'Important work depends on what the owner remembers.',
    'Repetitive updates, reports, and data entry consume the day.',
    'You want to use AI but do not know what is worth building.',
  ]) assert.ok(problems.source.includes(phrase), `missing problem: ${phrase}`);
  assert.doesNotMatch(problems.source, /\b(?:LLM|RAG|API|webhook|vector|inference|orchestration|agent runtime)\b/i);
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

test('introduces Mike and the four step method before demonstrations', () => {
  const process = elementById('process', 'section');
  const gallery = elementById('demo-gallery', 'section');
  assert.ok(process.end <= gallery.start);
  for (const step of ['Understand', 'Simplify', 'Build', 'Support']) assert.match(process.source, new RegExp(`>${step}<`, 'i'));
  assert.match(process.source, /Mike Mote/i);
  assert.match(process.source, /discovery, design, implementation, and review/i);
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

test('preserves real local controls across the Care Hub and secondary demonstrations', () => {
  const gallery = elementById('demo-gallery', 'section').source;
  for (const hook of [
    'data-operator-request', 'data-operator-approve', 'data-document-task', 'data-document-reset',
    'data-demo-state', 'data-demo-next', 'data-demo-reset', 'data-action="approve"',
    'data-action="edit"', 'data-action="skip"', 'data-care-view', 'data-care-family-tab',
    'data-care-metric', 'data-care-task', 'data-care-form', 'data-care-guide',
  ]) assert.match(gallery, new RegExp(hook, 'i'));
  assert.doesNotMatch(gallery, /href="https:\/\/care\.moteops\.tech\/"/i);
});

test('centers evidence on the real Care Hub build without inflating results', () => {
  const evidence = elementById('evidence', 'section').source;
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

test('publishes a flexible commercial path with discovery as one phase', () => {
  const services = elementById('services', 'section').source;
  for (const phrase of ['Fit conversation', 'Workflow discovery', 'Implementation', 'Continuing support']) {
    assert.match(services, new RegExp(phrase, 'i'));
  }
  for (const price of ['$1,000', '$1,500 to $2,500', '$4,000 to $6,000', '$750']) {
    assert.match(services, new RegExp(price.replace(/[$]/g, '\\$'), 'i'));
  }
  assert.match(services, /leave it alone/i);
  assert.match(services, /larger agent or integration systems are scoped separately/i);
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
