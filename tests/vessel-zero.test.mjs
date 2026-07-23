import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const root = new URL('../demo/vessel-zero/', import.meta.url);
const read = (name) => readFileSync(new URL(name, root), 'utf8');

test('ships the approved six-chapter expedition story', () => {
  const html = read('index.html');
  const ids = [...html.matchAll(/<section[^>]+id="([^"]+)"/g)].map((match) => match[1]);

  assert.deepEqual(ids, ['deployment', 'descent', 'sensing', 'array', 'encounter', 'planner']);
  assert.match(html, /fictional Mote Ops design concept/i);
  assert.match(html, /Concept mission simulation/i);
  for (const id of ['vz-01', 'vz-02', 'vz-03']) assert.match(html, new RegExp(`media/${id}\\.mp4`));
});

test('keeps motion progressive and planner rules deterministic', () => {
  const js = read('site.js');
  assert.match(js, /function calculateMission/);
  assert.match(js, /requestAnimationFrame/);
  assert.match(js, /IntersectionObserver/);
  assert.match(js, /prefers-reduced-motion/);
  assert.match(js, /aria-live/);
  assert.doesNotMatch(js, /fetch\s*\(|XMLHttpRequest|sendBeacon/);
});

