import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const html = readFileSync(resolve(root, 'index.html'), 'utf8');
const css = readFileSync(resolve(root, 'site.css'), 'utf8');
const js = readFileSync(resolve(root, 'site.js'), 'utf8');

function sectionById(id) {
  const match = html.match(new RegExp(`<section\\b[^>]*\\bid=["']${id}["'][^>]*>[\\s\\S]*?<\\/section>`, 'i'));
  assert.ok(match, `missing #${id} section`);
  return match[0];
}

test('leads with the private AI system promise in plain language', () => {
  assert.equal((html.match(/<h1\b/gi) ?? []).length, 1);
  assert.match(html, /build private AI systems around the way your business already works/i);
  assert.match(html, /phone/i);
  assert.match(html, /email/i);
  assert.match(html, /files/i);
  assert.match(html, /human approval/i);
});

test('shows all five layers of the private AI operating system', () => {
  assert.match(html, /id="aios-workbench"/);
  for (const layer of ['Inputs', 'Context', 'Intelligence', 'Control', 'Outputs']) {
    assert.match(html, new RegExp(`data-system-layer="${layer.toLowerCase()}"`, 'i'));
  }
  assert.match(html, /What needs my attention today/i);
  assert.match(html, /Synthetic demonstration/i);
  assert.match(html, /human-approved/i);
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
  const usedHexColors = [...css.matchAll(/#[\da-f]{3}(?:[\da-f]{3})?\b/gi)]
    .map(([color]) => color.toLowerCase());
  const unapprovedHexColors = [...new Set(usedHexColors.filter((color) => !approvedHexColors.has(color)))].sort();
  assert.deepEqual(unapprovedHexColors, [], `unapproved CSS hex colors: ${unapprovedHexColors.join(', ')}`);

  const colorFunctions = [...css.matchAll(/\b(?:rgba?|hsla?)\([^)]*\)/gi)].map(([color]) => color);
  const neutralAlphaShadow = /^rgba?\(\s*0(?:\s*,\s*0){2}\s*(?:,|\/)\s*(?:0?\.\d+|0|1(?:\.0+)?)\s*\)$/i;
  const unapprovedColorFunctions = [...new Set(colorFunctions.filter((color) => !neutralAlphaShadow.test(color)))].sort();
  assert.deepEqual(unapprovedColorFunctions, [], `unapproved CSS color functions: ${unapprovedColorFunctions.join(', ')}`);

  const prohibitedColorFamilies = /\b(?:blue|indigo|purple|violet|cyan|teal|navy|aqua|turquoise)\b/i;
  assert.doesNotMatch(css, prohibitedColorFamilies);
  assert.doesNotMatch(css, /linear-gradient|radial-gradient/i);
});

test('keeps synthetic-data disclosures inside each public demonstration', () => {
  assert.match(sectionById('aios-workbench'), /Synthetic demonstration/i);
  assert.match(sectionById('demo'), /Synthetic demonstration.{0,20}sample data/is);
  assert.match(sectionById('care-hub-demo'), /No real family records/i);
});
