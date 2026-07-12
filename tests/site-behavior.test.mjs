import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const js = readFileSync(resolve(import.meta.dirname, '..', 'site.js'), 'utf8');

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

test('suppresses the sticky booking action while demo controls are in view', () => {
  assert.match(js, /demoSection/);
  assert.match(js, /heroInView/);
  assert.match(js, /demoInView/);
  assert.match(js, /updateStickyCta/);
  assert.match(js, /!heroInView\s*&&\s*!demoInView/);
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
});

test('supports approval and reset without contacting a live service', () => {
  assert.match(js, /data-system-approve/);
  assert.match(js, /data-system-reset/);
  assert.match(js, /Synthetic route approved/i);
  assert.doesNotMatch(js, /fetch\s*\(|XMLHttpRequest|WebSocket/);
});
