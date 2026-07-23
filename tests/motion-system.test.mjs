import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const js = readFileSync(new URL('../motion-system.js', import.meta.url), 'utf8');

test('provides one accessible motion control and lazy cinematic playback', () => {
  assert.match(html, /data-motion-toggle/);
  assert.match(html, /aria-pressed="true"/);
  assert.match(html, /motion-system\.js\?v=/);
  assert.match(js, /function setMotionEnabled/);
  assert.match(js, /prefers-reduced-motion/);
  assert.match(js, /IntersectionObserver/);
  assert.match(js, /dataset\.src/);
  assert.match(js, /play\(\)\.catch/);
  assert.match(js, /window\.moteMotion/);
  assert.doesNotMatch(js, /fetch\s*\(|XMLHttpRequest|sendBeacon/);
});
