import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { Script } from 'node:vm';

const root = resolve(import.meta.dirname, '..');
const PAGES = ['plumbers', 'restaurants', 'tutors', 'salons', 'landscapers', 'retail'];
const pages = PAGES.map((name) => ({
  name,
  html: readFileSync(resolve(root, 'for', `${name}.html`), 'utf8'),
}));
const textOf = (html) => html.replace(/<[^>]+>/g, ' ');

test('each trade page is genuinely personalized, not one template with a renamed title', () => {
  const heroes = pages.map(({ html }) => html.match(/<h1>([\s\S]*?)<\/h1>/)[1].trim());
  assert.equal(new Set(heroes).size, 6, 'every page opens with its own scenario');
  const drafts = pages.map(({ html }) => html.match(/<blockquote>([\s\S]*?)<\/blockquote>/)[1].trim());
  assert.equal(new Set(drafts).size, 6, 'every page demos its own drafted message');
  const firsts = pages.map(({ html }) => html.match(/first-plate">\s*<h3>([\s\S]*?)<\/h3>/)[1].trim());
  assert.equal(new Set(firsts).size, 6, 'every page recommends its own first build');
});

for (const { name, html } of pages) {
  test(`for/${name}.html carries the full personalized presentation`, () => {
    const beats = html.match(/<article class="week-beat">/g) || [];
    assert.equal(beats.length, 3, 'three your-week moments');
    const uses = html.match(/<li><strong>/g) || [];
    assert.ok(uses.length >= 4, 'at least four researched use cases');
    const sources = html.match(/class="biz-sources"[\s\S]*?<\/p>/)[0];
    assert.ok((sources.match(/href="https:\/\//g) || []).length >= 3, 'at least three checkable sources');
    assert.ok(html.includes('not Mote Ops client results'), 'honesty label present');
    for (const control of ['data-try-frame', 'data-try-act="approve"', 'data-try-act="edit"', 'data-try-act="skip"', 'data-try-status']) {
      assert.ok(html.includes(control), `demo control missing: ${control}`);
    }
    assert.ok(html.includes('href="../index.html#your-business"'), 'path back to the picker');
    assert.ok(html.includes('href="../email.html"'), 'low-commitment email path');
    assert.match(html, /for-trade\.css\?v=[\w-]+/);
    assert.match(html, /for-trade\.js\?v=[\w-]+/);
  });

  test(`for/${name}.html copy avoids banned phrases and em-dashes`, () => {
    const banned = [
      'AI-powered', 'leverage', 'transform', 'harness', 'synergy', 'robust',
      'scalable', 'cutting-edge', 'innovative', 'revolutionary', 'game-changing',
      'LLM', 'workflow', '—',
    ];
    const lower = textOf(html).toLowerCase();
    for (const word of banned) {
      assert.ok(!lower.includes(word.toLowerCase()), `banned phrase in for/${name}.html: ${word}`);
    }
  });

  test(`for/${name}.html local references resolve and external links are safe`, () => {
    const refs = [...html.matchAll(/\b(?:href|src)="([^"]+)"/g)].map(([, ref]) => ref);
    for (const ref of refs) {
      if (/^(?:https?:|mailto:|#)/.test(ref)) continue;
      const path = ref.split(/[?#]/)[0];
      assert.ok(existsSync(resolve(root, 'for', path)), `missing local asset ${path}`);
    }
    for (const anchor of html.match(/<a href="https:[^>]+>/g) || []) {
      assert.ok(anchor.includes('rel="noopener noreferrer"'), `unsafe external link: ${anchor}`);
    }
  });
}

test('demo script parses, only writes status text, and never sends anything', () => {
  const js = readFileSync(resolve(root, 'for-trade.js'), 'utf8');
  assert.doesNotThrow(() => new Script(js));
  assert.ok(!js.includes('fetch') && !js.includes('XMLHttpRequest'), 'demo makes no network calls');
  assert.ok(!js.includes('innerHTML'), 'demo injects no markup');
});

test('trade pages are discoverable in the sitemap', () => {
  const sitemap = readFileSync(resolve(root, 'sitemap.xml'), 'utf8');
  for (const name of PAGES) {
    assert.ok(sitemap.includes(`https://moteops.tech/for/${name}.html`), `sitemap missing for/${name}.html`);
  }
});
