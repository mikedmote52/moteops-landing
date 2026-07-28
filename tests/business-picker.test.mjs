import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const html = readFileSync(resolve(root, 'index.html'), 'utf8');

const sectionStart = html.indexOf('<section class="biz-section');
const sectionEnd = html.indexOf('</section>', html.indexOf('biz-footnote'));
const section = html.slice(sectionStart, sectionEnd);
const sectionText = section.replace(/<[^>]+>/g, ' ');

test('picker section exists and sits between the opening film and the Tuesday section', () => {
  assert.ok(sectionStart > -1, 'biz-section present');
  const filmPos = html.indexOf('data-cinematic-film');
  const tuesdayPos = html.indexOf('id="tuesday"');
  assert.ok(filmPos > -1 && tuesdayPos > -1);
  assert.ok(sectionStart > filmPos, 'picker comes after the opening film');
  assert.ok(sectionStart < tuesdayPos, 'picker comes before the Tuesday section');
});

test('six doorways, each a plain link to its own trade page that exists on disk', () => {
  const doors = [...section.matchAll(/<a class="biz-door" href="(for\/[a-z-]+\.html)"/g)];
  assert.equal(doors.length, 6);
  const targets = doors.map((m) => m[1]);
  assert.equal(new Set(targets).size, 6, 'every doorway leads to a different page');
  for (const target of targets) {
    assert.ok(existsSync(resolve(root, target)), `missing trade page ${target}`);
  }
});

test('every doorway carries a personalized hook, not a generic label', () => {
  const hooks = [...section.matchAll(/<small>([^<]+)<\/small>/g)].map((m) => m[1]);
  assert.equal(hooks.length, 6);
  assert.equal(new Set(hooks).size, 6, 'hooks must differ per trade');
  for (const hook of hooks) {
    assert.ok(hook.length > 30, `hook too thin to be personalized: ${hook}`);
  }
});

test('picker copy avoids banned phrases, unexplained jargon, and em-dashes', () => {
  const banned = [
    'AI-powered', 'leverage', 'transform', 'harness', 'synergy', 'robust',
    'scalable', 'cutting-edge', 'innovative', 'solution', 'revolutionary',
    'game-changing', 'LLM', 'workflow', '—',
  ];
  const lower = sectionText.toLowerCase();
  for (const word of banned) {
    assert.ok(!lower.includes(word.toLowerCase()), `banned phrase in picker copy: ${word}`);
  }
});

test('picker stylesheet is linked with a cache-busting version and the old script is gone', () => {
  assert.match(html, /business-picker\.css\?v=[\w-]+/);
  assert.ok(!html.includes('business-picker.js'), 'obsolete accordion script still referenced');
  assert.ok(!existsSync(resolve(root, 'business-picker.js')), 'obsolete accordion script still on disk');
});

test('a lower-commitment email path survives for readers not ready to book', () => {
  assert.ok(section.includes('href="email.html"'));
});
