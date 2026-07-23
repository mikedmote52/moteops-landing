import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const root = resolve(new URL('..', import.meta.url).pathname);
const cinematicDirectory = resolve(root, 'assets/cinematic');
const hasFfprobe = !spawnSync('ffprobe', ['-version']).error;
const hasSips = !spawnSync('sips', ['--help']).error;

function sha256(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

function mp4Atoms(path) {
  const bytes = readFileSync(path);
  const atoms = [];
  for (let offset = 0; offset + 8 <= bytes.length;) {
    let size = bytes.readUInt32BE(offset);
    const type = bytes.subarray(offset + 4, offset + 8).toString('latin1');
    if (size === 1) size = Number(bytes.readBigUInt64BE(offset + 8));
    if (size === 0) size = bytes.length - offset;
    assert.ok(size >= 8, `invalid ${type} atom size`);
    atoms.push({ type, offset });
    offset += size;
  }
  return atoms;
}

test('declares one local responsive Mote Ops opening film', () => {
  const html = readFileSync(resolve(root, 'index.html'), 'utf8');
  const opening = html.slice(html.indexOf('data-opening-story'), html.indexOf('</figure>', html.indexOf('data-opening-story')));
  assert.match(html, /assets\/cinematic\/mote-ops-opening-1080\.mp4/i);
  assert.match(html, /assets\/cinematic\/mote-ops-opening-720\.mp4/i);
  assert.match(html, /assets\/cinematic\/mote-ops-opening-poster\.webp/i);
  assert.match(html, /autoplay muted playsinline/i);
  assert.doesNotMatch(opening, /\sloop(?:\s|>)/i);
});

test('defers the Mote Ops film source and registers it with motion controls', () => {
  const html = readFileSync(resolve(root, 'index.html'), 'utf8');
  const motion = readFileSync(resolve(root, 'motion-system.js'), 'utf8');
  assert.match(html, /<figure class="opening-story"[\s\S]*data-cinematic-film[\s\S]*<source data-src="assets\/cinematic\/mote-ops-opening-1080\.mp4"/i);
  assert.match(html, /<source data-src="assets\/cinematic\/mote-ops-opening-720\.mp4"/i);
  assert.match(motion, /querySelectorAll\('\[data-studio-film\]'\)/);
  assert.match(motion, /querySelectorAll\('\[data-cinematic-film\]'\)/);
});

test('records the approved opening-film generation ledger', () => {
  const manifest = JSON.parse(readFileSync(resolve(cinematicDirectory, 'mote-ops-opening-manifest.json'), 'utf8'));
  assert.equal(manifest.generation.approvedCreditCap, 288);
  assert.equal(manifest.generation.creditsSpent, 288);
  assert.deepEqual(manifest.generation.shots.map(({ status }) => status), [
    'accepted',
    'accepted',
    'accepted',
  ]);
  assert.equal(manifest.generation.attempts.length, 4);
  assert.equal(manifest.generation.attempts.filter(({ outcome }) => /rejected/.test(outcome)).length, 1);
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
