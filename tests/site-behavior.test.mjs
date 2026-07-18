import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const js = readFileSync(resolve(root, 'site.js'), 'utf8');
const careJsPath = resolve(root, 'care-hub-showcase.js');
const careJs = existsSync(careJsPath) ? readFileSync(careJsPath, 'utf8') : '';

function straightLineRenderFunction(name) {
  const match = js.match(new RegExp(`function\\s+${name}\\s*\\(\\s*data\\s*\\)\\s*\\{\\n([\\s\\S]*?)\\n\\}`, 'i'));
  assert.ok(match, `missing straight-line ${name}(data) helper`);
  assert.doesNotMatch(match[1], /[{}]/, `${name} must not contain nested blocks`);
  return match[1];
}

function assertRenderPurity(name, helper) {
  assert.doesNotMatch(helper, /\b(?:fetch|XMLHttpRequest|WebSocket|EventSource|sendBeacon|localStorage|sessionStorage|indexedDB)\b|\blocation\b|\bwindow\s*\.\s*open\b/i);
  const calls = [...helper.matchAll(/\b([A-Za-z_$][\w$]*(?:\s*\.\s*[A-Za-z_$][\w$]*)*)\s*\(/g)]
    .map(([, call]) => call.replace(/\s+/g, ''));
  const unexpected = calls.filter((call) => call !== 'announce' && call !== 'document.querySelector' && !call.endsWith('.replaceChildren'));
  assert.deepEqual(unexpected, [], `${name} contains non-render calls: ${unexpected.join(', ')}`);
}

function assertRenderField(helper, selector, valueExpression) {
  const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const direct = js.match(new RegExp(`(?:const|let)\\s+([A-Za-z_$][\\w$]*)\\s*=\\s*document\\.querySelector\\(\\s*['"]\\[${escape(selector)}\\]['"]\\s*\\)`, 'i'));
  const objectField = js.match(new RegExp(`(?:const|let)\\s+([A-Za-z_$][\\w$]*)\\s*=\\s*\\{[\\s\\S]{0,1200}?([A-Za-z_$][\\w$]*)\\s*:\\s*document\\.querySelector\\(\\s*['"]\\[${escape(selector)}\\]['"]\\s*\\)`, 'i'));
  const reference = direct?.[1] ?? (objectField ? `${objectField[1]}.${objectField[2]}` : null);
  const cachedWrite = reference && new RegExp(`${escape(reference)}\\s*(?:\\?\\.|\\.)\\s*(?:textContent|innerText)\\s*=\\s*${escape(valueExpression)}|${escape(reference)}\\s*(?:\\?\\.|\\.)\\s*replaceChildren\\(\\s*${escape(valueExpression)}`, 'i').test(helper);
  const directWrite = new RegExp(`document\\.querySelector\\(\\s*['"]\\[${escape(selector)}\\]['"]\\s*\\)\\s*(?:\\?\\.|\\.)\\s*(?:(?:textContent|innerText)\\s*=\\s*${escape(valueExpression)}|replaceChildren\\(\\s*${escape(valueExpression)}\\s*\\))`, 'i').test(helper);
  assert.ok(cachedWrite || directWrite, `${selector} must be written from ${valueExpression} inside its render helper`);
}

test('implements the three-demo secondary gallery with wrapped keyboard navigation', () => {
  assert.match(js, /DEMO_GALLERY/);
  assert.match(js, /const\s+DEMO_GALLERY\s*=\s*\[\s*['"]operator['"]\s*,\s*['"]documents['"]\s*,\s*['"]leads['"]\s*\]/i);
  assert.doesNotMatch(js, /DEMO_GALLERY\s*=\s*\[[^\]]*['"]care['"]/i);
  assert.match(js, /setGalleryDemo/);
  for (const key of ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End']) {
    assert.match(js, new RegExp(key));
  }
  assert.match(js, /(?:galleryTabButtons|galleryTabs)[\s\S]{0,2500}preventDefault\s*\(\s*\)[\s\S]{0,800}\.focus\s*\(\s*\)/i);
  assert.match(js, /(?:%\s*(?:galleryTabButtons|galleryTabs)\.length|index\s*===\s*-1|index\s*<\s*0)/i);
  assert.match(js, /moreExamples\.open\s*=\s*true/i, 'deep links must open the collapsed secondary gallery');
  assert.match(js, /data-open-demo[\s\S]{0,500}preventDefault\s*\(\s*\)[\s\S]{0,500}selectedTab\?\.focus\s*\(\s*\)/i);
});

test('updates every operator request field from local demo data', () => {
  assert.match(js, /OPERATOR_REQUESTS/);
  assert.match(js, /function\s+setOperatorRequest\s*\(\s*name\s*\)\s*\{\s*const\s+data\s*=\s*OPERATOR_REQUESTS\s*\[\s*name\s*\][\s\S]{0,600}renderOperatorRequest\(\s*data\s*\)/i);
  const helper = straightLineRenderFunction('renderOperatorRequest');
  for (const field of ['request-text', 'context', 'route', 'result', 'approval']) {
    assertRenderField(helper, `data-operator-${field}`, `data.${field === 'request-text' ? 'request' : field}`);
  }
  assert.match(helper, /\bannounce\s*\(/i, 'renderOperatorRequest must announce its result');
  assert.match(helper, /announce\s*\(\s*data\.status\s*,\s*operatorStatus\s*\)/i);
  assertRenderPurity('renderOperatorRequest', helper);
  assert.match(js, /operatorApprove\?\.addEventListener\s*\(\s*['"]click['"][\s\S]{0,500}Sample brief approved[\s\S]{0,500}Nothing was sent or changed[\s\S]{0,200}operatorStatus/i);
});

test('defines exact operator prompts and truthful synthetic routing evidence', () => {
  for (const key of ['attention', 'care', 'private']) assert.match(js, new RegExp(`\\b${key}\\s*:`));
  for (const prompt of [
    'What needs my attention today?',
    "Continue the CC's Care Hub project.",
    'Review these files privately.',
  ]) assert.ok(js.includes(prompt), `missing exact operator prompt: ${prompt}`);
  assert.match(js, /project\/status routing/i);
  assert.match(js, /CC's Care Hub project/i);
  assert.match(js, /only the three listed fictional source files/i);
  assert.match(js, /bounded private-file review/i);
  assert.doesNotMatch(js, /\b(?:projects|followups)\s*:/);
});

test('runs document tasks and updates findings, source, and status locally', () => {
  assert.match(js, /DOCUMENT_TASKS/);
  assert.match(js, /function\s+runDocumentTask\s*\(\s*name\s*\)\s*\{\s*const\s+data\s*=\s*DOCUMENT_TASKS\s*\[\s*name\s*\][\s\S]{0,300}renderDocumentTask\(\s*data\s*\)/i);
  const helper = straightLineRenderFunction('renderDocumentTask');
  assertRenderField(helper, 'data-document-findings', 'data.finding');
  assertRenderField(helper, 'data-document-source', 'data.source');
  assertRenderField(helper, 'data-document-status', 'data.status');
  assert.match(helper, /\bannounce\s*\(/i, 'renderDocumentTask must announce its result');
  assert.match(helper, /announce\s*\(\s*data\.status\s*,\s*documentStatus\s*\)/i);
  assertRenderPurity('renderDocumentTask', helper);
  assert.match(js, /documentReset\?\.addEventListener\s*\(\s*['"]click['"][\s\S]{0,500}renderDocumentTask\(\s*documentIntro\s*\)/i, 'document reset must render the single intro state');
  assert.equal((js.match(/renderDocumentTask\(\s*documentIntro\s*\)/g) ?? []).length, 1, 'document reset must render its intro exactly once');
  assert.match(js, /if\s*\(\s*documentTaskButtons\.length\s*\)\s*runDocumentTask\(\s*['"]commitments['"]\s*\)/i, 'document demo must initialize its selected task and visible result together');
});

test('retains lead selectors inside the secondary gallery', () => {
  assert.match(js, /\[data-demo-state\]/);
  assert.match(js, /\[data-demo-next\]/);
});

test('implements explicit three-state demo navigation', () => {
  assert.match(js, /currentDemoState/);
  assert.match(js, /setDemoState/);
  assert.match(js, /\[data-demo-state\]/);
  assert.match(js, /\[data-demo-next\]/);
});

test('implements real synthetic approve edit skip and reset behavior', () => {
  assert.match(js, /data-action="approve"/);
  assert.match(js, /data-action="edit"/);
  assert.match(js, /data-action="skip"/);
  assert.match(js, /data-demo-reset/);
  assert.match(js, /draftEditor/);
  assert.match(js, /savedDraft/);
});

test('contains no obsolete calculator behavior', () => {
  assert.doesNotMatch(js, /followUps\s*\*\s*minutes|missedLeads\s*\*\s*jobValue|auditPercent|Intl\.NumberFormat/);
});

test('maintains accessible sticky CTA and announces interaction status', () => {
  assert.match(js, /setAttribute\('aria-hidden',\s*String\(!show\)\)/);
  assert.match(js, /tabIndex\s*=\s*show\s*\?\s*0\s*:\s*-1/);
  assert.match(js, /announce/);
});

test('suppresses the sticky booking action while any interactive demo is in view', () => {
  assert.match(js, /stickyGuardSections\s*=\s*\[\s*['"]#demo-gallery['"]\s*\]/);
  assert.match(js, /stickyGuardSections/);
  assert.match(js, /guardSectionsInView/);
  assert.match(js, /heroInView/);
  assert.match(js, /updateStickyCta/);
  assert.match(js, /!heroInView\s*&&\s*guardSectionsInView\.size\s*===\s*0/);
  assert.match(js, /IntersectionObserver/);
});

test('implements the Care Hub environment in a dedicated local-only controller', () => {
  assert.ok(careJs, 'missing care-hub-showcase.js');
  for (const hook of [
    'data-care-view',
    'data-care-family-tab',
    'data-care-metric',
    'data-care-task',
    'data-care-form',
    'data-care-guide',
    'data-care-modal-close',
  ]) assert.match(careJs, new RegExp(hook, 'i'));
  assert.match(careJs, /function\s+setCareView/i);
  assert.match(careJs, /function\s+setFamilyTab/i);
  assert.match(careJs, /aria-pressed/i);
  assert.match(careJs, /aria-hidden/i);
  assert.match(careJs, /Escape/i);
  assert.match(careJs, /dataset\.openLabel/i, 'task controls must retain a visible open-state label');
  assert.match(careJs, /dataset\.completeLabel/i, 'task controls must expose a visible completed-state label');
  assert.match(careJs, /\.focus\s*\(\s*\)/i, 'view routing must place focus in the newly visible view');
  assert.match(careJs, /\binert\b/i, 'the guide must make background content inert');
  assert.match(careJs, /document\.body\.style\.overflow/i, 'the guide must prevent background scrolling');
  assert.match(careJs, /Tab/i, 'the guide must trap keyboard focus');
  assert.doesNotMatch(careJs, /\bfetch\s*\(|XMLHttpRequest|WebSocket|EventSource|sendBeacon|localStorage|sessionStorage|indexedDB/i);
});

test('has no obsolete interactive architecture route controller and keeps network safety', () => {
  assert.doesNotMatch(js, /SYSTEM_ROUTES|systemRouteButtons|setSystemRoute|data-system-(?:route|approve|reset|status|evidence)/);
  assert.doesNotMatch(js, /careTabButtons|setCareTab|\[data-care-task\]|\[data-care-form\]/);
  assert.doesNotMatch(js, /\b(?:fetch|EventSource|WebSocket)\s*\(|\b(?:navigator\.)?sendBeacon\s*\(|\bnew\s+XMLHttpRequest\b/i);
});
