import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const html = readFileSync(resolve(root, 'index.html'), 'utf8');

test('publishes one clear diagnostic offer', () => {
  assert.match(html, /<h1\b[^>]*>[\s\S]*?<\/h1>/i);
  assert.equal((html.match(/<h1\b/gi) ?? []).length, 1);
  assert.match(html, /\$1,000/);
  assert.match(html, /one (?:working )?week/i);
  assert.match(html, /one workflow/i);
  assert.match(html, /automate[\s\S]*simplify[\s\S]*(?:leave it alone|leave alone)/i);
});

test('uses one real booking destination for every booking link', () => {
  const bookingLinks = [...html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([^<]*(?:<span[^>]*>[^<]*<\/span>)?[^<]*)<\/a>/gi)]
    .filter(([, , label]) => /Book|fit call/i.test(label));
  assert.ok(bookingLinks.length >= 3, 'expected at least three booking links');
  for (const [, href] of bookingLinks) {
    assert.equal(href, 'https://calendly.com/mikedmote/30min');
  }
});

test('contains the required navigable sections', () => {
  for (const id of ['offer', 'process', 'fit', 'about', 'faq']) {
    assert.match(html, new RegExp(`id="${id}"`));
    assert.match(html, new RegExp(`href="#${id}"`));
  }
});

test('uses native accessible FAQ disclosures and labels examples honestly', () => {
  assert.ok((html.match(/<details\b/gi) ?? []).length >= 4);
  assert.ok((html.match(/<summary\b/gi) ?? []).length >= 4);
  assert.match(html, /illustrative example/i);
  assert.doesNotMatch(html, /Billion-Dollar Solo Operator/i);
  assert.doesNotMatch(html, /data (?:never|doesn.t) (?:leave|copy)/i);
});

test('references only local assets that exist', () => {
  const local = [...html.matchAll(/(?:href|src)="(?!https?:|mailto:|#)([^"?]+)(?:\?[^"#]*)?"/g)]
    .map(([, path]) => path.replace(/^\//, ''))
    .filter(Boolean);
  assert.ok(local.includes('site.css'));
  assert.ok(local.includes('site.js'));
  for (const path of local) assert.ok(existsSync(resolve(root, path)), `missing ${path}`);
});

test('provides reduced-motion styling and sticky CTA hooks', () => {
  const css = readFileSync(resolve(root, 'site.css'), 'utf8');
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(html, /data-sticky-cta/);
  assert.match(html, /id="hero-booking"/);
});

test('keeps the hidden mobile CTA out of the accessibility tree', () => {
  const js = readFileSync(resolve(root, 'site.js'), 'utf8');
  assert.match(html, /data-sticky-cta[^>]*aria-hidden="true"/);
  assert.match(js, /setAttribute\('aria-hidden',\s*String\(!show\)\)/);
  assert.match(js, /tabIndex\s*=\s*show\s*\?\s*0\s*:\s*-1/);
});
