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
const studioHtml = existsSync(resolve(root, 'studio.html'))
  ? readFileSync(resolve(root, 'studio.html'), 'utf8')
  : '';

function attribute(tag, name) {
  return tag.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']*)["']`, 'i'))?.[1] ?? null;
}

function elementById(id, expectedTag, source = html) {
  const opening = [...source.matchAll(/<([a-z][\w:-]*)\b[^>]*>/gi)].find((match) =>
    (!expectedTag || match[1].toLowerCase() === expectedTag.toLowerCase()) && attribute(match[0], 'id') === id);
  assert.ok(opening, `missing #${id}${expectedTag ? ` ${expectedTag}` : ''}`);
  const tag = opening[1].toLowerCase();
  const tokens = [...source.slice(opening.index).matchAll(new RegExp(`<\\/?${tag}\\b[^>]*>`, 'gi'))];
  let depth = 0;
  for (const token of tokens) {
    depth += /^<\//.test(token[0]) ? -1 : 1;
    if (depth === 0) {
      const end = opening.index + token.index + token[0].length;
      return { start: opening.index, end, openingTag: opening[0], source: source.slice(opening.index, end) };
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
  assert.match(hero, /You've heard AI could help your business\./i);
  assert.match(hero, /Getting started is the part I do\./i);
  assert.match(hero, /nothing goes out without your approval/i);
  assert.match(hero, /Book a fit conversation/i);
  assert.match(hero, /href="#tuesday"/i);
  assert.ok(hero.indexOf('hero-copy') < hero.indexOf('data-opening-story'), 'plain pitch must precede the film');
  assert.doesNotMatch(hero, /MCP|agent runtime|control plane|model routing/i);
});

test('walks a nontechnical owner through one Tuesday with real controls', () => {
  const tuesday = elementById('tuesday', 'section').source;
  assert.match(tuesday, /You don't need to understand AI\. You need your Tuesday back\./i);
  assert.match(tuesday, /Sample scenarios using fictional business information\./i);
  assert.equal((tuesday.match(/data-tuesday="/gi) ?? []).length, 4);
  for (const scenario of ['email', 'call', 'invoice', 'doc']) {
    assert.match(tuesday, new RegExp(`data-tuesday=["']${scenario}["']`, 'i'));
  }
  for (const act of ['approve', 'edit', 'skip']) {
    assert.match(tuesday, new RegExp(`data-tuesday-act=["']${act}["']`, 'i'));
  }
  assert.match(tuesday, /Nothing ever sends itself/i);
  assert.match(tuesday, /Same pattern, whole business\./i);
  for (const hook of ['TUESDAY_SCENARIOS', 'data-tuesday-act', 'data-tuesday-status']) {
    assert.ok(js.includes(hook), `site.js must wire the walkthrough: ${hook}`);
  }
  assert.ok(css.includes('.tuesday-beat'), 'site.css must style the walkthrough');
});

test('keeps the hero film without the retired owner-story sequence', () => {
  const hero = elementById('top', 'section').source;
  assert.doesNotMatch(hero, /hero-system-plate|hero-inputs|hero-core|hero-outputs/i);
  assert.match(hero, /data-opening-story/i);
  assert.match(hero, /mote-ops-opening-v3-1080\.mp4/i);
  assert.match(hero, /mote-ops-opening-v3-720\.mp4/i);
  assert.doesNotMatch(hero, /<figcaption/i);
  assert.doesNotMatch(hero, /data-owner-story/i, 'owner story was retired: the Tuesday walkthrough replaced it');
  assert.doesNotMatch(html, /owner-story\.(?:css|js)/i, 'index must not load retired owner-story assets');
});

test('uses the approved cinematic section order', () => {
  const orderedIds = ['top', 'tuesday', 'pains', 'demo-gallery', 'care-hub-showcase', 'evidence', 'boundaries', 'method', 'capabilities', 'start', 'mote-ops-studio', 'questions'];
  let cursor = -1;
  for (const id of orderedIds) {
    const next = html.indexOf(`id="${id}"`);
    assert.ok(next > cursor, `${id} should appear in the approved order`);
    cursor = next;
  }
  assert.doesNotMatch(html, /id="owner-story"|id="toolbox"|class="case-study"/i, 'retired sections must stay retired');
  assert.equal((html.match(/<section\b[^>]*data-page-section\b/gi) ?? []).length, 10);
  for (const obsolete of ['id="calculator"', 'id="operator-day"', 'Annual follow-up labor burden', 'equipment-plate']) {
    assert.doesNotMatch(html, new RegExp(obsolete, 'i'));
  }
});

test('keeps six recognizable frictions with sourced stats near the top', () => {
  const pains = elementById('pains', 'section');
  assert.match(pains.source, /class="start-frictions"/i);
  for (const phrase of [
    'Your inbox has become the company task list.',
    'Leads and follow ups disappear between people and tools.',
    'Staff keep searching for the same documents and answers.',
    'Important work depends on what the owner remembers.',
    'Repetitive updates, reports, and data entry consume the day.',
    'You want to use AI but do not know where to start.',
  ]) assert.ok(pains.source.includes(phrase), `missing friction: ${phrase}`);
  for (const stat of ['TAB survey', 'HBR / InsideSales', 'Goldman Sachs']) {
    assert.ok(pains.source.includes(stat), `missing stat attribution: ${stat}`);
  }
  assert.equal((pains.source.match(/symptom-stat/g) ?? []).length, 3);
  assert.doesNotMatch(pains.source, /\b(?:LLM|RAG|API|webhook|vector|inference|orchestration|agent runtime)\b/i);
  const start = elementById('start', 'section');
  assert.doesNotMatch(start.source, /start-frictions/i);
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
  assert.match(careShowcase.source, /Here's one we built for a daycare\. Yours would look like your business\./i);
  assert.match(careShowcase.source, /CC['’]s Learning Center had enrollment scattered across tools and memory/i);
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

test('places three fictional Studio studies on their own page, linked from the footer', () => {
  assert.ok(studioHtml.length > 0, 'studio.html must exist');
  assert.match(html, /<footer[\s\S]*href="studio\.html"/i, 'index footer must link the studio page');
  const studio = elementById('mote-ops-studio', 'section', studioHtml);
  assert.match(studioHtml, /motion-system\.js/i);
  assert.match(studioHtml, /studio\.css/i);
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
  assert.match(studio.source, /<img\b[^>]*class=["'][^"']*studio-onde-poster[^"']*["'][^>]*src=["']demo\/onde-halo\/assets\/hyperbelt-poster\.webp["']/i);
  assert.match(studio.source, /Interactive 3D product/i);
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
  assert.doesNotMatch(evidence, /class="case-study"/i, 'the Care Hub recap card was retired; the demo carries the story');
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

test('keeps the technical proof accordion without the retired toolbox catalog', () => {
  const evidence = elementById('evidence', 'section');
  assert.doesNotMatch(evidence.source, /id="toolbox"/i, 'the toolbox catalog was retired; capabilities carries the outcome list');
  assert.doesNotMatch(evidence.source, /n8n|Ollama(?!\s+qwen)/i, 'tool-name jargon stays off the homepage main path');
  assert.match(evidence.source, /class="technical-proof"/i);
  assert.ok(evidence.source.indexOf('class="beta-evidence"') < evidence.source.indexOf('class="technical-proof"'));
});

test('keeps the portfolio present as a compact studio band before the close', () => {
  const band = elementById('mote-ops-studio', 'section');
  assert.match(band.source, /MOTE OPS STUDIO · FICTIONAL DESIGN WORK/i);
  assert.match(band.source, /Systems can work well and still feel exceptional\./i);
  for (const route of ['demo/onde-halo/index.html', 'demo/vessel-zero/index.html', 'demo/solaire-01/index.html', 'studio.html']) {
    assert.match(band.source, new RegExp(`href=["']${route.replaceAll('/', '\\/')}["']`, 'i'));
  }
  assert.doesNotMatch(band.source, /<video\b/i, 'the band stays lightweight; films live on studio.html');
  const start = elementById('start', 'section');
  const questions = elementById('questions', 'section');
  assert.ok(band.start > start.end && band.end < questions.start, 'band sits between the path and the close');
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
