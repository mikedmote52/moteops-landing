import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const root = new URL('../demo/solaire-01/', import.meta.url);
const read = (name) => readFileSync(new URL(name, root), 'utf8');

test('ships the approved six-chapter architectural monograph', () => {
  const html = read('index.html');
  const ids = [...html.matchAll(/<section[^>]+id="([^"]+)"/g)].map((match) => match[1]);

  assert.deepEqual(ids, ['approach', 'solar-axis', 'aperture', 'material', 'alignment', 'planner']);
  assert.match(html, /fictional Mote Ops design concept/i);
  assert.match(html, /Concept observation schedule/i);
  for (const id of ['so-01', 'so-02', 'so-03']) assert.match(html, new RegExp(`media/${id}\\.mp4`));
});

test('uses an independent architectural system and deterministic schedule', () => {
  const css = read('site.css');
  const js = read('site.js');
  assert.match(css, /#D8C8A8/i);
  assert.match(css, /#25221E/i);
  assert.match(js, /function buildSchedule/);
  assert.match(js, /IntersectionObserver/);
  assert.match(js, /prefers-reduced-motion/);
  assert.doesNotMatch(css, /glass|backdrop-filter|radial-gradient/i);
});
