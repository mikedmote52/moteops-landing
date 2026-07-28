import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Script } from 'node:vm';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

const sectionStart = html.indexOf('<section class="biz-section');
const sectionEnd = html.indexOf('</section>', html.indexOf('biz-footnote'));
const section = html.slice(sectionStart, sectionEnd);
const sectionText = section
  .replace(/<style[\s\S]*?<\/style>/g, '')
  .replace(/<[^>]+>/g, ' ');

test('picker section exists and sits between the opening film and the Tuesday section', () => {
  assert.ok(sectionStart > -1, 'biz-section present');
  const filmPos = html.indexOf('data-cinematic-film');
  const tuesdayPos = html.indexOf('id="tuesday"');
  assert.ok(filmPos > -1 && tuesdayPos > -1);
  assert.ok(sectionStart > filmPos, 'picker comes after the opening film');
  assert.ok(sectionStart < tuesdayPos, 'picker comes before the Tuesday section');
});

test('six business cards, each a native details element with a summary', () => {
  const cards = section.match(/<details class="biz-card"/g) || [];
  assert.equal(cards.length, 6);
  const summaries = section.match(/<summary>/g) || [];
  assert.equal(summaries.length, 6, 'every card opens without JavaScript');
});

test('every card has at least three concrete use cases and a checkable source link', () => {
  const bodies = section.split('<details class="biz-card"').slice(1);
  for (const body of bodies) {
    const uses = body.match(/<li><strong>/g) || [];
    assert.ok(uses.length >= 3, 'card has at least 3 use cases');
    const sources = body.match(/class="biz-sources"[\s\S]*?<\/p>/)[0];
    const links = sources.match(/href="https:\/\//g) || [];
    assert.ok(links.length >= 1, 'card cites at least one external source');
  }
});

test('external source links open safely in a new tab', () => {
  const externals = section.match(/<a href="https:[^>]+>/g) || [];
  assert.ok(externals.length >= 6);
  for (const a of externals) {
    assert.ok(a.includes('rel="noopener noreferrer"'), `unsafe external link: ${a}`);
    assert.ok(a.includes('target="_blank"'), `external link missing target: ${a}`);
  }
});

test('picker copy avoids banned phrases, unexplained jargon, and em-dashes', () => {
  const banned = [
    'AI-powered', 'leverage', 'transform', 'harness', 'synergy', 'robust',
    'scalable', 'cutting-edge', 'innovative', 'solution', 'revolutionary',
    'game-changing', 'LLM', 'workflow automation', '—',
  ];
  const lower = sectionText.toLowerCase();
  for (const word of banned) {
    assert.ok(!lower.includes(word.toLowerCase()), `banned phrase in picker copy: ${word}`);
  }
});

test('picker is framed as what is possible, not as client results', () => {
  assert.ok(section.includes('not Mote Ops client results'), 'honesty label present');
});

test('stylesheet and script are linked with cache-busting versions', () => {
  assert.match(html, /business-picker\.css\?v=[\w-]+/);
  assert.match(html, /business-picker\.js\?v=[\w-]+/);
});

test('enhancement script parses and only enhances, never gates, the cards', () => {
  const js = readFileSync(new URL('../business-picker.js', import.meta.url), 'utf8');
  assert.doesNotThrow(() => new Script(js));
  assert.ok(!js.includes('display'), 'script never hides content');
  assert.ok(!js.includes('innerHTML'), 'script injects no markup');
});

test('every card offers a lower-commitment next step into the Tuesday demo', () => {
  const nexts = section.match(/href="#tuesday"/g) || [];
  assert.ok(nexts.length >= 6);
  assert.ok(section.includes('href="email.html"'), 'email path present for readers not ready to book');
});
