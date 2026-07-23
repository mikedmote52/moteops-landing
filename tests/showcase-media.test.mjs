import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const root = resolve(new URL('..', import.meta.url).pathname);

test('declares one local Mote Ops operating transition film', () => {
  const html = readFileSync(resolve(root, 'index.html'), 'utf8');
  assert.match(html, /assets\/cinematic\/mote-ops-01\.mp4/i);
  assert.match(html, /assets\/cinematic\/mote-ops-01\.webp/i);
  assert.match(html, /autoplay muted loop playsinline/i);
});

test('defers the Mote Ops film source and registers it with motion controls', () => {
  const html = readFileSync(resolve(root, 'index.html'), 'utf8');
  const motion = readFileSync(resolve(root, 'motion-system.js'), 'utf8');
  assert.match(html, /<figure class="operating-transition"[\s\S]*data-cinematic-film[\s\S]*<source data-src="assets\/cinematic\/mote-ops-01\.mp4"/i);
  assert.match(motion, /querySelectorAll\('\[data-studio-film\]'\)/);
  assert.match(motion, /querySelectorAll\('\[data-cinematic-film\]'\)/);
});

for (const [site, ids] of Object.entries({
  'vessel-zero': ['vz-01', 'vz-02', 'vz-03'],
  'solaire-01': ['so-01', 'so-02', 'so-03'],
})) {
  test(`${site} declares three local cinematic media slots`, () => {
    const root = new URL(`../demo/${site}/media/`, import.meta.url);
    const manifest = JSON.parse(readFileSync(new URL('manifest.json', root), 'utf8'));
    assert.deepEqual(manifest.clips.map(({ id }) => id), ids);
    for (const clip of manifest.clips) {
      assert.match(clip.web, /^media\/[a-z0-9-]+\.mp4$/);
      assert.match(clip.poster, /^media\/[a-z0-9-]+\.webp$/);
      assert.equal(clip.width, 1920);
      assert.equal(clip.height, 1080);
      assert.ok(clip.duration >= 7.5 && clip.duration <= 8.5);
      assert.ok(existsSync(new URL(clip.web.replace('media/', ''), root)));
      assert.ok(existsSync(new URL(clip.poster.replace('media/', ''), root)));
    }
  });
}
