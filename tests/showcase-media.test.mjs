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

test('records the approved two-attempt generation workflow before recovering the first composition', () => {
  const manifest = JSON.parse(readFileSync(resolve(cinematicDirectory, 'manifest.json'), 'utf8'));
  assert.deepEqual(manifest.generation.approval, {
    currentSessionCreditCap: 75,
    firstPreflightCredits: 36,
    replacementPreflightCredits: 36,
    replacementSubmittedWithinApprovedCap: true,
    record: 'After the first literal 36-credit preflight, the user approved spending up to 75 credits in this current session. The replacement brought cumulative spend to 72 credits, so no higher cap was needed.',
  });
  assert.deepEqual(manifest.generation.attempts.map(({ jobId, outcome, credits }) => ({ jobId, outcome, credits })), [
    { jobId: 'fbf4f283-de62-45a2-bfb1-9bc426dd7d98', outcome: 'rejected during frame review', credits: 36 },
    { jobId: '8c30a591-0f17-4b62-8c05-986beb3d5f82', outcome: 'rejected during frame review', credits: 36 },
  ]);
  assert.match(manifest.generation.attempts[1].changedPromptVariable, /unbranded hardware/i);
  assert.equal(manifest.generation.outputRecovery.sourceJob, 'fbf4f283-de62-45a2-bfb1-9bc426dd7d98');
  assert.equal(manifest.generation.outputRecovery.additionalCredits, 0);
});

test('keeps the local Mote Ops film and poster contract intact', { skip: !hasFfprobe || !hasSips ? 'ffprobe and sips are required for the local media contract' : false }, () => {
  const manifest = JSON.parse(readFileSync(resolve(cinematicDirectory, 'manifest.json'), 'utf8'));
  const videoPath = resolve(root, manifest.output.video.path);
  const posterPath = resolve(root, manifest.output.poster.path);
  assert.ok(existsSync(videoPath), 'local transition MP4 exists');
  assert.ok(existsSync(posterPath), 'local transition WebP poster exists');

  const probe = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration:stream=codec_name,codec_type,width,height,r_frame_rate', '-of', 'json', videoPath], { encoding: 'utf8' });
  assert.equal(probe.status, 0, probe.stderr);
  const metadata = JSON.parse(probe.stdout);
  const video = metadata.streams.find(({ codec_type }) => codec_type === 'video');
  assert.equal(metadata.streams.filter(({ codec_type }) => codec_type === 'audio').length, 0);
  assert.equal(video.codec_name, 'h264');
  assert.equal(video.width, 1920);
  assert.equal(video.height, 1080);
  assert.equal(video.r_frame_rate, '24/1');
  assert.ok(Number(metadata.format.duration) >= 8 && Number(metadata.format.duration) <= 8.1);

  const atoms = mp4Atoms(videoPath);
  assert.ok(atoms.find(({ type }) => type === 'moov').offset < atoms.find(({ type }) => type === 'mdat').offset, 'moov precedes mdat for faststart');
  const dimensions = spawnSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', posterPath], { encoding: 'utf8' });
  assert.equal(dimensions.status, 0, dimensions.stderr);
  assert.match(dimensions.stdout, /pixelWidth: 1600/);
  assert.match(dimensions.stdout, /pixelHeight: 900/);
  assert.equal(sha256(videoPath), manifest.output.video.sha256);
  assert.equal(sha256(posterPath), manifest.output.poster.sha256);
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
