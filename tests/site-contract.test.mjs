import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const html = readFileSync(resolve(root, 'index.html'), 'utf8');

test('leads with the concrete home-service promise', () => {
  assert.equal((html.match(/<h1\b/gi) ?? []).length, 1);
  assert.match(html, /After-hours leads shouldn.t wait until Monday/i);
  assert.match(html, /HVAC/);
  assert.match(html, /plumbing/i);
  assert.match(html, /electrical/i);
  assert.match(html, /nothing goes out without you/i);
});

test('contains one connected synthetic lead demonstration', () => {
  assert.match(html, /id="demo"/);
  assert.match(html, /Synthetic demonstration.{0,20}sample data/is);
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
  assert.match(html, /CC.s Care Hub/i);
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
