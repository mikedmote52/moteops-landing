import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const root = new URL('../demo/onde-halo/', import.meta.url);
const read = (name) => readFileSync(new URL(name, root), 'utf8');

test('ships a complete cinematic product story with honest concept framing', () => {
  const html = read('index.html');
  const ids = [...html.matchAll(/<section[^>]+id="([^"]+)"/g)].map((match) => match[1]);

  assert.deepEqual(ids, ['hero', 'thesis', 'anatomy', 'field', 'materials', 'finale']);
  assert.match(html, /fictional product concept/i);
  assert.match(html, /A Mote Ops design demonstration/i);
  assert.match(html, /No preorder\. No checkout\./i);
  assert.match(html, /<button[^>]+data-sound-toggle[^>]+aria-pressed="false"/i);
  assert.match(html, /<canvas[^>]+id="sound-field"[^>]+aria-hidden="true"/i);
  assert.match(html, /site\.css/);
  assert.match(html, /site\.js/);
});

test('defines local responsive product geometry and reduced-motion behavior', () => {
  const html = read('index.html');
  const css = read('site.css');

  for (const part of ['halo-shell', 'driver-array', 'magnet-core', 'copper-plinth']) {
    assert.match(html, new RegExp(`class="[^"]*${part}`));
  }

  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/i);
  assert.match(css, /@media\s*\(max-width:\s*760px\)/i);
  assert.match(css, /:focus-visible/);
  assert.doesNotMatch(css, /url\(["']?https?:\/\//i);
});

test('implements sound, scroll staging, canvas energy, and safe fallbacks', () => {
  const js = read('site.js');

  assert.match(js, /class HaloSound/);
  assert.match(js, /AudioContext|webkitAudioContext/);
  assert.match(js, /createAnalyser/);
  assert.match(js, /aria-pressed/);
  assert.match(js, /Sound unavailable/);
  assert.match(js, /prefers-reduced-motion/);
  assert.match(js, /visibilitychange/);
  assert.match(js, /requestAnimationFrame/);
  assert.match(js, /data-stage/);
  assert.doesNotMatch(js, /fetch\s*\(|XMLHttpRequest|sendBeacon/);
});
