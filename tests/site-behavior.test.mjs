import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const js = readFileSync(resolve(import.meta.dirname, '..', 'site.js'), 'utf8');

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

test('implements the four-demo gallery with wrapped keyboard navigation', () => {
  assert.match(js, /DEMO_GALLERY/);
  assert.match(js, /setGalleryDemo/);
  for (const key of ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End']) {
    assert.match(js, new RegExp(key));
  }
  assert.match(js, /(?:galleryTabButtons|galleryTabs)[\s\S]{0,2500}preventDefault\s*\(\s*\)[\s\S]{0,800}\.focus\s*\(\s*\)/i);
  assert.match(js, /(?:%\s*(?:galleryTabButtons|galleryTabs)\.length|index\s*===\s*-1|index\s*<\s*0)/i);
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

test('retains lead and Care selectors inside the unified gallery', () => {
  assert.match(js, /\[data-demo-state\]/);
  assert.match(js, /\[data-demo-next\]/);
  assert.match(js, /\[data-care-task\]/);
  assert.match(js, /\[data-care-form\]/);
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

test('calculates annual friction from visitor inputs', () => {
  assert.match(js, /followUps\s*\*\s*minutes\s*\/\s*60\s*\*\s*hourlyValue\s*\*\s*50/);
  assert.match(js, /missedLeads\s*\*\s*jobValue\s*\*\s*12/);
  assert.match(js, /auditPercent/);
  assert.match(js, /Intl\.NumberFormat/);
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

test('implements Care Hub tabs and local-only task and form controls', () => {
  assert.match(js, /careTabButtons/);
  assert.match(js, /setCareTab/);
  assert.match(js, /\[data-care-task\]/);
  assert.match(js, /\[data-care-form\]/);
  assert.match(js, /Care Hub demo/i);
});

test('routes synthetic requests through the five AIOS layers', () => {
  assert.match(js, /systemRouteButtons/);
  assert.match(js, /setSystemRoute/);
  assert.match(js, /SYSTEM_ROUTES/);
  assert.match(js, /data-system-layer/);
  assert.match(js, /data-system-evidence/);
  assert.match(js, /function\s+setSystemRoute\b[\s\S]{0,1800}(?:classList\.(?:add|remove|toggle)|hidden\s*=|setAttribute\()[\s\S]{0,1800}(?:textContent|innerText|replaceChildren)[\s\S]{0,1000}\bannounce\s*\(/i);
});

test('tracks one current layer while completing a sequential route', () => {
  assert.match(js, /classList\.remove\(['"]is-active['"],\s*['"]is-current['"]\)/);
  assert.match(js, /systemLayers\.forEach\(\(currentLayer\)\s*=>\s*currentLayer\.classList\.remove\(['"]is-current['"]\)\)/);
  assert.match(js, /layer\.classList\.add\(['"]is-active['"],\s*['"]is-current['"]\)/);
  assert.match(js, /systemLayers\[systemLayers\.length\s*-\s*1\][\s\S]{0,100}classList\.add\(['"]is-current['"]\)/);
});

test('keeps the route tab connected to the changing panel', () => {
  assert.match(js, /systemPanel/);
  assert.match(js, /setAttribute\(['"]aria-labelledby['"],\s*activeButton\.id\)/);
});

test('supports wrapped keyboard navigation between system routes', () => {
  assert.match(js, /ArrowRight/);
  assert.match(js, /ArrowDown/);
  assert.match(js, /ArrowLeft/);
  assert.match(js, /ArrowUp/);
  assert.match(js, /Home/);
  assert.match(js, /End/);
  assert.match(js, /preventDefault\s*\(\s*\)/);
  assert.match(js, /\.focus\s*\(\s*\)/);
});

test('supports approval and reset without contacting a live service', () => {
  assert.match(js, /data-system-approve/);
  assert.match(js, /data-system-reset/);
  assert.match(js, /Synthetic route approved/i);
  assert.match(js, /setAttribute\(\s*['"]aria-pressed['"]\s*,\s*['"]true['"]\s*\)/);
  assert.match(js, /setAttribute\(\s*['"]aria-pressed['"]\s*,\s*['"]false['"]\s*\)/);
  assert.match(js, /Sample output approved/);
  assert.match(js, /Approve sample output/);
  assert.match(js, /systemApprove\?\.addEventListener\s*\(\s*['"]click['"][\s\S]{0,1200}(?:textContent|innerText|classList\.|hidden\s*=|setAttribute\()[\s\S]{0,600}\bannounce\s*\(/i);
  assert.match(js, /data-system-reset[\s\S]{0,1200}addEventListener\s*\(\s*['"]click['"][\s\S]{0,1200}(?:setSystemRoute\s*\(|textContent|innerText|classList\.|hidden\s*=|setAttribute\()[\s\S]{0,600}\bannounce\s*\(/i);
  assert.doesNotMatch(js, /\b(?:fetch|EventSource|WebSocket)\s*\(|\b(?:navigator\.)?sendBeacon\s*\(|\bnew\s+XMLHttpRequest\b/i);
});
