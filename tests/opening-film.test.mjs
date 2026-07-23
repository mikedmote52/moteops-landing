import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const root = resolve(new URL('..', import.meta.url).pathname);
const read = (path) => readFileSync(resolve(root, path), 'utf8');
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

test('defines truthful local inserts for the complete cleanup story', () => {
  const plates = read('production/opening-film/plates.html');
  assert.match(plates, /data-plate="discovery-email"/);
  assert.match(plates, /You should not have to be the operating system\./);
  assert.match(plates, /Show me how/);
  assert.match(plates, /data-plate="organized-inbox"/);
  assert.match(plates, /data-plate="calendar-resolution"/);
  assert.match(plates, /data-plate="review-packet"/);
  assert.match(plates, /data-plate="approval-queue"/);
  assert.match(plates, /data-plate="beach-end-card"/);
  assert.match(plates, /Fictional business scenario/i);
  assert.doesNotMatch(plates, /\b(?:sent|paid|signed|booked automatically)\b/i);
});

test('captures discovery and cleanup interfaces inside one physical monitor treatment', () => {
  const html = read('production/opening-film/monitor-plates.html');
  const css = read('production/opening-film/monitor-plates.css');
  const capture = read('production/opening-film/capture-monitor-plates.sh');
  const plates = read('production/opening-film/plates.html');
  const packageJson = JSON.parse(read('package.json'));

  assert.match(html, /class="monitor-shell"/);
  assert.match(html, /class="monitor-screen"/);
  assert.match(html, /class="monitor-reflection"/);
  assert.match(html, /new URL\('plates\.html'/);
  assert.match(html, /source\.searchParams\.set\('plate', plate\)/);
  assert.match(html, /source\.searchParams\.set\('embed', 'monitor'\)/);
  assert.match(html, /'discovery-email'/);
  assert.match(css, /\.monitor-shell[\s\S]*width:\s*1344px/);
  assert.match(css, /\.monitor-screen[\s\S]*width:\s*1280px[\s\S]*height:\s*720px/);
  assert.match(css, /background-image:\s*url\("rendered\/monitor-office\.png"\)/);
  assert.match(css, /filter:\s*blur\(8px\) brightness\(\.58\)/);
  assert.match(css, /perspective\(2400px\) rotateY\(-1\.5deg\) rotateX\(\.4deg\)/);
  assert.match(css, /\.monitor-reflection[\s\S]*linear-gradient/);

  for (const name of [
    'discovery-email',
    'organized-inbox',
    'calendar-resolution',
    'review-packet',
    'approval-queue',
  ]) {
    assert.match(capture, new RegExp(`\\n  ${name}\\n`));
  }
  assert.match(capture, /screenshot="\$output\/monitor-\$plate\.png"/);

  assert.match(capture, /shot-02-cleanup\.mp4/);
  assert.match(capture, /-ss 0\.8/);
  assert.match(capture, /--window-size=1920,1080/);
  assert.match(plates, /embedMode === 'monitor'/);
  assert.match(plates, /monitor-embed/);
  assert.equal(
    packageJson.scripts['capture:opening-monitor'],
    'bash production/opening-film/capture-monitor-plates.sh'
  );
});

test('maintains an auditable opening-film generation ledger', () => {
  const manifest = JSON.parse(read('assets/cinematic/mote-ops-opening-manifest.json'));
  assert.equal(manifest.schema, 'mote-ops-opening/v1');
  assert.ok([
    'awaiting-credit-approval',
    'awaiting-generation',
    'ready-for-post',
    'media-verified',
  ].includes(manifest.status));
  assert.ok(Number.isInteger(manifest.generation.creditsSpent));
  assert.ok(manifest.generation.creditsSpent >= 0);
  assert.ok(
    manifest.generation.approvedCreditCap === null
      || Number.isInteger(manifest.generation.approvedCreditCap)
  );
  if (manifest.generation.approvedCreditCap !== null) {
    assert.ok(manifest.generation.creditsSpent <= manifest.generation.approvedCreditCap);
  }
  assert.deepEqual(manifest.generation.shots.map(({ id }) => id), [
    'breakdown-discovery',
    'cleanup-control',
    'beach-payoff',
  ]);
  for (const shot of manifest.generation.shots) {
    if (shot.status === 'not-generated') {
      assert.equal(shot.jobId, null);
      assert.equal(shot.credits, null);
    } else {
      assert.equal(typeof shot.jobId, 'string');
      assert.ok(Number.isInteger(shot.credits));
    }
  }
  assert.equal(manifest.disclosure, 'AI-generated film · fictional business scenario featuring Mike Mote.');
  assert.deepEqual(manifest.postProduction.monitorComposite, {
    generatedCredits: 0,
    backgroundSource: 'accepted cleanup-control footage at 0.8 seconds',
    outerMonitorWidth: 1344,
    interfaceScreen: '1280x720',
    transitionFrames: 7,
    actorAttentionSeconds: 2.6,
    discoveryStableHoldSeconds: 2.2,
    cleanupStableHoldSeconds: 1.8,
  });
});

test('keeps production sources out of release uploads', () => {
  const vercelIgnore = read('.vercelignore');
  assert.match(vercelIgnore, /^production\/opening-film\/$/m);
  assert.match(vercelIgnore, /^assets\/cinematic\/source\/$/m);
});

test('clears every pressure label before the discovery email cut', () => {
  const buildScript = read('production/opening-film/build-opening-film.sh');
  assert.doesNotMatch(buildScript, /between\(t,3\.5,5\.8\)/);
  assert.doesNotMatch(buildScript, /between\(t,4\.1,5\.8\)/);
  assert.match(buildScript, /between\(t,3\.5,5\.75\)/);
  assert.match(buildScript, /between\(t,4\.1,5\.75\)/);
});

test('assembles an actor-first discovery sequence in an approximately 28 second film', () => {
  const buildScript = read('production/opening-film/build-opening-film.sh');

  assert.match(buildScript, /actor_attention="2\.6"/);
  assert.match(buildScript, /discovery_hold="2\.2"/);
  assert.match(buildScript, /interface_hold="1\.8"/);
  assert.match(buildScript, /transition="0\.291667"/);
  assert.match(buildScript, /discovery_transition_plate="2\.491667"/);
  assert.match(buildScript, /transition_plate="2\.091667"/);
  assert.match(buildScript, /master_duration="28\.0"/);
  assert.match(buildScript, /monitor-discovery-email\.png/);
  assert.doesNotMatch(buildScript, /-i "\$rendered\/discovery-email\.png"/);
  assert.match(buildScript, /trim=start=0:end=\$\{actor_attention\}/);
  assert.match(buildScript, /offset=2\.308333/);
  assert.match(buildScript, /offset=12\.000000/);
  assert.match(buildScript, /concat=n=5:v=1:a=0,settb=1\/24\[monitor_sequence\]/);
  assert.equal((buildScript.match(/duration=\$\{transition\}/g) || []).length, 2);
  assert.match(buildScript, /between\(t,24\.2,28\.0\)/);
  assert.match(buildScript, /between\(t,26\.0,28\.0\)/);
  assert.equal((buildScript.match(/-r 24 -t "\$master_duration" -movflags/g) || []).length, 2);
});

test('records discovery continuity timing in the media ledger', () => {
  const manifest = JSON.parse(read('assets/cinematic/mote-ops-opening-manifest.json'));
  assert.equal(manifest.durationSeconds, 28);
  assert.deepEqual(manifest.postProduction.monitorComposite, {
    generatedCredits: 0,
    backgroundSource: 'accepted cleanup-control footage at 0.8 seconds',
    outerMonitorWidth: 1344,
    interfaceScreen: '1280x720',
    transitionFrames: 7,
    actorAttentionSeconds: 2.6,
    discoveryStableHoldSeconds: 2.2,
    cleanupStableHoldSeconds: 1.8,
  });
  assert.deepEqual(manifest.frameReview.timesSeconds, [
    0, 0.5, 1, 2, 3, 4, 5, 5.79, 5.81,
    7, 8.1, 8.39, 8.41, 9.5, 10.59, 10.61,
    11.5, 12.39, 12.41, 13.3, 14.19, 14.21,
    15.1, 15.99, 16.01, 16.9, 17.79, 17.81,
    18.09, 19, 19.99, 20.01, 21, 22, 23, 24.2,
    25, 26, 27, 27.99,
  ]);
});

test('centers a constrained opening film on desktop without shrinking phone layout', () => {
  const css = read('opening-film.css');
  assert.match(css, /@media \(min-width: 1021px\)[\s\S]*?\.opening-story\s*\{[\s\S]*?max-width:\s*1180px/);
  assert.match(css, /width:\s*calc\(100vw - 64px\)/);
  assert.match(css, /justify-self:\s*center/);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*?\.opening-story\s*\{[\s\S]*?width:\s*100%/);
});

test('opens the homepage with one play-once email-to-beach story', () => {
  const html = read('index.html');
  const opening = html.indexOf('data-opening-story');
  const ownerConnect = html.indexOf('data-owner-scene="connect"');
  const careHub = html.indexOf('id="care-hub-showcase"');
  const openingFigure = html.slice(opening, html.indexOf('</figure>', opening));
  assert.ok(opening > 0 && opening < ownerConnect && ownerConnect < careHub);
  assert.match(html, /mote-ops-opening-1080\.mp4/);
  assert.match(html, /mote-ops-opening-720\.mp4/);
  assert.match(html, /mote-ops-opening-poster\.webp/);
  assert.match(html, /autoplay muted playsinline/);
  assert.doesNotMatch(openingFigure, /\sloop(?:\s|>)/);
  assert.match(html, /data-replay-story[^>]*hidden/);
  assert.match(html, /AI-generated film · fictional business scenario featuring Mike Mote\./);
  assert.doesNotMatch(html, /owner-pressure/);
  assert.doesNotMatch(html, /operating-transition/);
  assert.doesNotMatch(html, /mote-ops-01\.(?:mp4|webp)/);
});

test('publishes exact silent fast-start opening masters and poster', {
  skip: !hasFfprobe || !hasSips ? 'ffprobe and sips are required for the local media contract' : false,
}, () => {
  const manifest = JSON.parse(read('assets/cinematic/mote-ops-opening-manifest.json'));
  const outputs = [
    { key: 'master1080', width: 1920, height: 1080 },
    { key: 'master720', width: 1280, height: 720 },
  ];

  for (const { key, width, height } of outputs) {
    const output = manifest.outputs[key];
    assert.equal(typeof output?.path, 'string', `${key} records its release path`);
    const path = resolve(root, output.path);
    assert.ok(existsSync(path), `${key} exists`);
    const probe = spawnSync('ffprobe', [
      '-v', 'error',
      '-show_entries', 'format=duration,size:stream=codec_name,codec_type,width,height,r_frame_rate',
      '-of', 'json',
      path,
    ], { encoding: 'utf8' });
    assert.equal(probe.status, 0, probe.stderr);
    const metadata = JSON.parse(probe.stdout);
    const video = metadata.streams.find(({ codec_type }) => codec_type === 'video');
    assert.equal(metadata.streams.filter(({ codec_type }) => codec_type === 'audio').length, 0);
    assert.equal(video.codec_name, 'h264');
    assert.equal(video.width, width);
    assert.equal(video.height, height);
    assert.equal(video.r_frame_rate, '24/1');
    assert.ok(Number(metadata.format.duration) >= 27.98 && Number(metadata.format.duration) <= 28.01);
    const atoms = mp4Atoms(path);
    assert.ok(atoms.find(({ type }) => type === 'moov').offset < atoms.find(({ type }) => type === 'mdat').offset);
    assert.equal(Number(metadata.format.size), output.sizeBytes);
    assert.equal(sha256(path), output.sha256);
  }

  const poster = manifest.outputs.poster;
  assert.equal(typeof poster?.path, 'string', 'poster records its release path');
  const posterPath = resolve(root, poster.path);
  assert.ok(existsSync(posterPath), 'poster exists');
  const dimensions = spawnSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', posterPath], { encoding: 'utf8' });
  assert.equal(dimensions.status, 0, dimensions.stderr);
  assert.match(dimensions.stdout, /pixelWidth: 1600/);
  assert.match(dimensions.stdout, /pixelHeight: 900/);
  assert.equal(sha256(posterPath), poster.sha256);
});
