import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const html = readFileSync(resolve(root, 'index.html'), 'utf8');
const css = readFileSync(resolve(root, 'site.css'), 'utf8');
const js = readFileSync(resolve(root, 'site.js'), 'utf8');

function sectionById(id) {
  return elementById(id, 'section').source;
}

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

test('leads with the private AI system promise in plain language', () => {
  assert.equal((html.match(/<h1\b/gi) ?? []).length, 1);
  const hero = sectionById('top');
  assert.match(hero, />Your business is running on your memory, your inbox, and too many open tabs\.<\/h1>/i);
  assert.match(hero, /Mote Ops finds the repetitive work slowing you down and builds a simple, supervised AI system around the tools you already use\./i);
});

test('leads with customer problems before demos or architecture', () => {
  const hero = elementById('top', 'section');
  const problems = elementById('problem-recognition', 'section');
  const gallery = elementById('demo-gallery', 'section');
  assert.ok(hero.end <= problems.start, 'hero must end before problem recognition begins');
  assert.ok(problems.end <= gallery.start, 'problem recognition must end before the demo gallery begins');
  assert.doesNotMatch(
    `${hero.source}\n${problems.source}`,
    /\b(?:AIOS|local LLM|operating layer|model routing|API|RAG|inference|embeddings?|vector database|prompt engineering|agents?|orchestration|webhooks?|schemas?|pipelines?)\b/i,
  );
  assert.match(problems.source, /Does this sound familiar\?/i);
  for (const phrase of [
    "You're drowning in follow-ups and small tasks.",
    "Your inbox has become your company's to-do list.",
    'You struggle to find the latest customer, project, or policy information.',
    'New inquiries arrive after hours and wait too long for a response.',
    'Important work only happens because you remember it.',
    "You want to use AI in your business, but you don't know where to begin—or what is actually worth paying for.",
  ]) assert.ok(problems.source.includes(phrase), `missing exact problem statement: ${phrase}`);
});

test('publishes four accessible outcome-led demos with persistent safety disclosures', () => {
  const gallery = elementById('demo-gallery', 'section');
  assert.equal(tagsWithRole(gallery.source, null, 'tablist').length, 1, 'gallery needs exactly one tablist');
  const tabs = tagsWithRole(gallery.source, 'button', 'tab');
  assert.equal(tabs.length, 4);
  assert.deepEqual(tabs.map((tag) => attribute(tag, 'data-gallery-demo')), ['operator', 'documents', 'leads', 'care']);
  const tabIds = tabs.map((tag) => attribute(tag, 'id'));
  assert.ok(tabIds.every(Boolean), 'every gallery tab needs an id');
  assert.equal(new Set(tabIds).size, 4, 'gallery tab ids must be unique');
  assert.equal(tabs.filter((tag) => attribute(tag, 'aria-selected') === 'true').length, 1);
  assert.equal(tabs.filter((tag) => attribute(tag, 'tabindex') === '0').length, 1);
  tabs.forEach((tag) => assert.equal(attribute(tag, 'tabindex'), attribute(tag, 'aria-selected') === 'true' ? '0' : '-1'));
  const panels = galleryPanelRanges(gallery);
  assert.equal(panels.length, 4);
  assert.deepEqual(panels.map(({ panel }) => panel), ['operator', 'documents', 'leads', 'care']);
  assert.equal(new Set(panels.map(({ panel }) => panel)).size, 4, 'gallery panel identities must be unique');
  assert.equal(new Set(panels.map(({ id }) => id)).size, 4, 'gallery panel ids must be unique');
  assert.deepEqual(tabs.map((tag) => attribute(tag, 'aria-controls')), panels.map(({ id }) => id));
  assert.deepEqual(panels.map(({ openingTag }) => attribute(openingTag, 'aria-labelledby')), tabIds);
  const approvedLabels = {
    operator: 'Know What Needs Attention Today',
    documents: 'Find Answers Inside Your Business Information',
    leads: 'Stop Losing New Leads',
    care: 'Keep Every Family Moving Toward Enrollment',
  };
  tabs.forEach((openingTag) => {
    const demo = attribute(openingTag, 'data-gallery-demo');
    const start = gallery.source.indexOf(openingTag);
    const end = gallery.source.indexOf('</button>', start);
    assert.ok(end >= 0, `${demo} gallery tab needs a closing button tag`);
    const label = gallery.source.slice(start + openingTag.length, end).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    assert.equal(label, approvedLabels[demo], `${demo} tab needs its exact approved outcome label`);
  });
  for (const panel of panels) {
    assert.match(panel.source, /Synthetic demonstration/i, `${panel.panel} workspace needs a synthetic-data label`);
    assert.match(panel.source, /No live (?:business data|connection)/i, `${panel.panel} workspace needs a no-live-data label`);
  }
  assert.match(panels.find(({ panel }) => panel === 'leads')?.source ?? '', /data-demo-(?:state|next|reset)/i, 'lead hooks must be inside the leads tabpanel');
  assert.match(panels.find(({ panel }) => panel === 'care')?.source ?? '', /data-care-(?:tab|task|form)/i, 'Care hooks must be inside the Care tabpanel');
});

test('demotes architecture to a collapsed disclosure after the demo gallery', () => {
  const gallery = elementById('demo-gallery', 'section');
  const architecture = elementById('architecture-details', 'details');
  assert.doesNotMatch(architecture.openingTag, /\bopen(?:\s*=|\s|>)/i, 'architecture disclosure must be collapsed');
  assert.ok(gallery.end <= architecture.start, 'architecture must begin after the demo gallery closes');
});

test('marks exactly one in-hero element as the sticky CTA visibility boundary', () => {
  assert.equal((html.match(/\bid=["']hero-booking["']/gi) ?? []).length, 1);
  const hero = sectionById('top');
  const booking = [...hero.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/gi)]
    .map(([source]) => source).find((source) => attribute(source.match(/<a\b[^>]*>/i)?.[0] ?? '', 'id') === 'hero-booking');
  assert.ok(booking, '#hero-booking must be inside the hero');
  assert.equal(attribute(booking.match(/<a\b[^>]*>/i)?.[0] ?? '', 'href'), '#problem-recognition');
  assert.equal(booking.replace(/<[^>]+>/g, '').replace(/\s*[↓→]\s*$/, '').trim(), 'See what Mote Ops can fix');
});

test('keeps all five concise architecture layers in the collapsed post-gallery disclosure', () => {
  const architecture = elementById('architecture-details', 'details');
  assert.doesNotMatch(architecture.openingTag, /\bopen(?:\s*=|\s|>)/i);
  for (const layer of ['Inputs', 'Context', 'Intelligence', 'Control', 'Outputs']) {
    assert.match(architecture.source, new RegExp(`data-system-layer=["']${layer.toLowerCase()}["'][^>]*>[\\s\\S]{0,160}<strong>${layer}<\\/strong>`, 'i'));
  }
  assert.ok(elementById('demo-gallery', 'section').end <= architecture.start);
});

test('publishes a truthful three-category evidence ledger', () => {
  for (const heading of ['Verified on Mike’s Mac', 'Demonstrated publicly', 'Configured per client']) {
    assert.match(html, new RegExp(heading, 'i'));
  }
  for (const phrase of [
    'qwen3-coder:30b', 'qwen3:14b', 'canonical operating context', 'Voice OS',
    'project/status routing', 'CC’s Care Hub', 'synthetic routing',
    'sample local-model response', 'sample approval', 'sample control-center records',
    'integrations', 'permissions', 'retention', 'local-versus-cloud choice', 'live business data',
  ]) assert.match(html, new RegExp(phrase, 'i'));
  assert.match(html, /working Voice OS components and phone-access patterns/i);
  assert.doesNotMatch(html, /working Voice OS(?! components)/i);
});

test('describes the operator day with the correct tasks and times', () => {
  const day = sectionById('operator-day');
  assert.match(day, /7:00 AM[\s\S]*morning brief/i);
  assert.match(day, /10:15 AM[\s\S]*phone[\s\S]*project[\s\S]*customer status/i);
  assert.match(day, /1:30 PM[\s\S]*local model[\s\S]*bounded private-file review/i);
  assert.match(day, /4:45 PM[\s\S]*owner approves follow-ups[\s\S]*records decisions/i);
});

test('starts the operator panel with a complete owner-attention request', () => {
  const operator = galleryPanelRanges(elementById('demo-gallery', 'section')).find(({ panel }) => panel === 'operator')?.source ?? '';
  assert.match(operator, /<dt>Request<\/dt><dd\s+data-operator-request-text>What needs my attention today\?<\/dd>/i);
  assert.match(operator, /<dt>Attached context<\/dt><dd\s+data-operator-context>Current project notes, commitments, and open decisions<\/dd>/i);
  assert.match(operator, /<dt>Route<\/dt><dd\s+data-operator-route>Owner status brief<\/dd>/i);
  assert.match(operator, /<dt>Sample result<\/dt><dd\s+data-operator-result>Two customer follow-ups and one project decision need review today\.<\/dd>/i);
  assert.match(operator, /<dt>Approval requirement<\/dt><dd\s+data-operator-approval>You approve every customer-facing action\.<\/dd>/i);
  assert.match(operator, /data-operator-approve[^>]*aria-pressed="false"/i);
  assert.match(operator, /aria-live="polite"\s+data-operator-status/i);
});

test('keeps gallery navigation scrollable and workspaces single-column on mobile', () => {
  const mobile = css.match(/@media\(max-width:760px\)\{[\s\S]*?\}\s*@media\(prefers-reduced-motion:reduce\)/)?.[0] ?? '';
  assert.match(mobile, /\.gallery-tabs\s*\{[^}]*overflow-x\s*:\s*auto/i);
  assert.match(mobile, /\[data-gallery-panel\][^{]*\{[^}]*grid-template-columns\s*:\s*1fr/i);
  assert.match(mobile, /\.(?:operator-workspace|document-workspace)[^{]*\{[^}]*grid-template-columns\s*:\s*1fr/i);
});

test('states current local-model evidence without making it a universal requirement', () => {
  assert.match(html, /qwen3-coder:30b/);
  assert.match(html, /qwen3:14b/);
  assert.match(html, /Mike['’]s current Mac installation/i);
  assert.match(html, /configured per client/i);
  assert.doesNotMatch(html, /every client (?:gets|requires|needs) (?:a )?local (?:LLM|model)/i);
});

test('publishes installable systems as equipment plates', () => {
  assert.match(html, /id="systems"/);
  for (const system of ['Private AI Control Center', 'Local LLM Workstation', 'Phone and Voice Operator', 'Operational Memory', 'Supervised Customer Workflow', 'Client Workspace']) {
    assert.match(html, new RegExp(system, 'i'));
  }
  assert.match(html, /id="operator-day"/);
  assert.match(html, /7:00 AM/);
  assert.match(html, /4:45 PM/);
});

test('contains one connected synthetic lead demonstration', () => {
  const demo = sectionById('demo');
  assert.match(demo, /Synthetic demonstration.{0,20}sample data/is);
  assert.match(html, /Dana/);
  assert.match(html, /AC not cooling/);
  assert.match(html, /Service address.{0,30}Missing/is);
  for (const state of ['Lead arrives', 'Intake completes', 'Owner brief']) {
    assert.match(html, new RegExp(state, 'i'));
  }
  for (const action of ['Approve', 'Edit', 'Skip', 'Why flagged', 'Reset demo']) {
    assert.match(html, new RegExp(action, 'i'));
  }
});

test('includes a safe public CC’s Care Hub demonstration', () => {
  const careHubDemo = sectionById('care-hub-demo');
  assert.match(careHubDemo, /CC['’]s Care Hub/i);
  assert.match(careHubDemo, /No real family records/i);
  assert.match(html, /Families &amp; Enrollment/i);
  assert.match(html, /Enrollment pipeline/i);
  assert.match(html, /Tour requests/i);
  assert.match(html, /Required forms/i);
  assert.match(html, /Classroom placement/i);
  assert.match(html, /href="https:\/\/care\.moteops\.tech\/"/);
  assert.match(html, /Owner access.{0,40}sign-in required/is);
});

test('publishes the full engagement ladder and the leave-it-alone option', () => {
  for (const price of ['$1,000', '$1,500–$2,500', '$4,000–$6,000', '$750']) {
    assert.match(html, new RegExp(price.replace(/[$]/g, '\\$')));
  }
  assert.match(html, /Workflow Audit/i);
  assert.match(html, /Micro-Sprint/i);
  assert.match(html, /Full Installation/i);
  assert.match(html, /90-Day Support/i);
  assert.match(html, /leave it alone/i);
  assert.match(html, /scopes? (?:the )?work separately/i);
});

test('includes visitor-controlled friction math without guaranteed results', () => {
  for (const id of ['follow-ups', 'minutes', 'hourly-value', 'missed-leads', 'job-value']) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.match(html, /Annual follow-up labor burden/i);
  assert.match(html, /Annual lead value at risk/i);
  assert.match(html, /illustrative estimate/i);
  assert.doesNotMatch(html, /guaranteed (?:savings|revenue|results)/i);
});

test('describes current proof precisely', () => {
  assert.match(html, /CC['’]s Care Hub/i);
  assert.match(html, /real client (?:build|project)/i);
  assert.match(html, /demonstration data/i);
  assert.match(html, /establishing (?:its|our) first measured client results/i);
  assert.match(html, /no more than two new workflow audits each month/i);
  assert.doesNotMatch(html, /completed production workflow/i);
  assert.doesNotMatch(html, /verified ROI/i);
});

test('uses one booking destination and a functional email alternative', () => {
  const calendly = [...html.matchAll(/href="(https:\/\/calendly\.com\/mikedmote\/30min)"/g)];
  assert.ok(calendly.length >= 3);
  assert.match(html, /mailto:hello@moteops\.tech\?subject=/i);
  assert.match(html, /diagnostic process/i);
});

test('contains the required navigable sections and accessible primitives', () => {
  for (const id of ['demo', 'how-it-works', 'calculator', 'pricing', 'proof', 'fit', 'about', 'faq']) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.ok((html.match(/<details\b/gi) ?? []).length >= 4);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /data-sticky-cta[^>]*aria-hidden="true"/);
});

test('references local assets that exist and supports reduced motion', () => {
  const local = [...html.matchAll(/(?:href|src)="(?!https?:|mailto:|#)([^"?]+)(?:\?[^"#]*)?"/g)]
    .map(([, path]) => path.replace(/^\//, ''))
    .filter(Boolean);
  assert.ok(local.includes('site.css'));
  assert.ok(local.includes('site.js'));
  for (const path of local) assert.ok(existsSync(resolve(root, path)), `missing ${path}`);
  const css = readFileSync(resolve(root, 'site.css'), 'utf8');
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
});

test('does not expose private local services or production client data', () => {
  const publicSources = [html, css, js].join('\n');
  const privateHost = String.raw`(?:localhost|0\.0\.0\.0|127(?:\.\d{1,3}){3}|10(?:\.\d{1,3}){3}|192\.168(?:\.\d{1,3}){2}|172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2}|\[?::1\]?|[\w.-]+\.local)`;
  const privatePath = String.raw`(?:\/api\/tags\b|\/ollama(?:\/|\b)|\/voice[-_]?os(?:\/|\b)|\/agent-bridge(?:\/|\b)|\/client[-_](?:data|records)(?:\/|\b)|token=)`;
  assert.doesNotMatch(publicSources, new RegExp(privateHost, 'i'));
  assert.doesNotMatch(publicSources, new RegExp(privatePath, 'i'));
  assert.doesNotMatch(html, new RegExp(String.raw`<(?:form|a|link|script|img|source|iframe)\b[^>]*(?:action|href|src)=["'][^"']*(?:${privateHost}|${privatePath})`, 'i'));
  assert.doesNotMatch(js, /\b(?:fetch|EventSource|WebSocket)\s*\(|\b(?:navigator\.)?sendBeacon\s*\(|\bnew\s+XMLHttpRequest\b/i);
  assert.match(html, /No live connection to Mike['’]s Mac/i);
});

test('uses the non-blue workbench palette', () => {
  for (const token of ['--bone', '--soot', '--forest', '--copper', '--signal']) {
    assert.match(css, new RegExp(token));
  }
  const approvedHexColors = new Set([
    '#eee5d1', '#f7f0df', '#171713', '#292820', '#173b30', '#285747',
    '#9b552f', '#d94b24', '#b7ad43', '#6d695d', '#bcb29c', '#fff', '#ffffff',
  ]);
  const usedHexColors = [...css.matchAll(/#[\da-f]{8}\b|#[\da-f]{6}\b|#[\da-f]{4}\b|#[\da-f]{3}\b/gi)]
    .map(([color]) => color.toLowerCase());
  const unapprovedHexColors = [...new Set(usedHexColors.filter((color) => !approvedHexColors.has(color)))].sort();
  assert.deepEqual(unapprovedHexColors, [], `unapproved CSS hex colors: ${unapprovedHexColors.join(', ')}`);

  const colorFunctions = [...css.matchAll(/\b(?:rgba?|hsla?|oklch|oklab|lab|lch|hwb|color)\([^)]*\)/gi)]
    .map(([color]) => color);
  const neutralAlphaShadow = /^rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*(?:0?\.\d+|0|1(?:\.0+)?)\s*\)$/i;
  const unapprovedColorFunctions = [...new Set(colorFunctions.filter((color) => !neutralAlphaShadow.test(color)))].sort();
  assert.deepEqual(unapprovedColorFunctions, [], `unapproved CSS color functions: ${unapprovedColorFunctions.join(', ')}`);

  const prohibitedColorFamilies = /\b(?:blue|indigo|purple|violet|cyan|teal|navy|aqua|turquoise)\b/i;
  assert.doesNotMatch(css, prohibitedColorFamilies);
  assert.doesNotMatch(css, /linear-gradient|radial-gradient/i);
});

test('keeps synthetic-data disclosures inside each public demonstration', () => {
  const panels = galleryPanelRanges(elementById('demo-gallery', 'section'));
  for (const name of ['operator', 'documents', 'leads', 'care']) {
    const panel = panels.find(({ panel }) => panel === name)?.source ?? '';
    assert.match(panel, /Synthetic demonstration/i, `${name} panel needs its own synthetic disclosure`);
    assert.match(panel, /No live (?:business data|connection)/i, `${name} panel needs its own no-live-data disclosure`);
  }
});
