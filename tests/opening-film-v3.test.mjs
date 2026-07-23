import assert from 'node:assert/strict';
import { accessSync, constants, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const root = resolve(new URL('..', import.meta.url).pathname);
const read = (path) => readFileSync(resolve(root, path), 'utf8');

test('declares the exact seven-shot silent V3 generation contract', () => {
  const manifest = JSON.parse(read('assets/cinematic/mote-ops-opening-v3-manifest.json'));
  assert.equal(manifest.schema, 'mote-ops-opening/v3');
  assert.equal(manifest.durationSeconds, 50);
  assert.equal(manifest.audio, false);
  assert.equal(manifest.generation.model, 'Seedance 2.0');
  assert.equal(manifest.generation.mode, 'std');
  assert.equal(manifest.generation.resolution, '1080p');
  assert.equal(manifest.generation.firstPassCredits, 450);
  assert.equal(manifest.generation.provisionalCap, 675);
  assert.equal(manifest.generation.approvedCreditCap, 675);
  assert.equal(manifest.generation.creditsSpent, 566);
  assert.deepEqual(
    manifest.generation.shots.map(({ id, durationSeconds, preflightCredits }) => ({
      id, durationSeconds, preflightCredits,
    })),
    [
      { id: 'chaos', durationSeconds: 6, preflightCredits: 54 },
      { id: 'discovery', durationSeconds: 8, preflightCredits: 72 },
      { id: 'onboarding', durationSeconds: 5, preflightCredits: 45 },
      { id: 'inbox-calendar', durationSeconds: 8, preflightCredits: 72 },
      { id: 'calls-finance', durationSeconds: 8, preflightCredits: 72 },
      { id: 'control-restored', durationSeconds: 7, preflightCredits: 63 },
      { id: 'beach-payoff', durationSeconds: 8, preflightCredits: 72 },
    ]
  );
  assert.deepEqual(
    manifest.generation.shots.map(({ id, status }) => ({ id, status })),
    [
      { id: 'chaos', status: 'accepted' },
      { id: 'discovery', status: 'accepted' },
      { id: 'onboarding', status: 'accepted' },
      { id: 'inbox-calendar', status: 'accepted' },
      { id: 'calls-finance', status: 'accepted' },
      { id: 'control-restored', status: 'accepted' },
      { id: 'beach-payoff', status: 'accepted' },
    ]
  );
  for (const shot of manifest.generation.shots) {
    assert.ok(shot.jobId, shot.id);
    assert.equal(shot.credits, shot.preflightCredits, shot.id);
    assert.ok(shot.attempts.length >= 1, shot.id);
  }
});

test('does not allow V3 generation without exact approved authority', () => {
  const manifest = JSON.parse(read('assets/cinematic/mote-ops-opening-v3-manifest.json'));
  assert.equal(manifest.generation.firstPassCredits, 450);
  assert.equal(manifest.generation.approvedCreditCap, 675);
  assert.ok(manifest.generation.approvedCreditCap >= manifest.generation.firstPassCredits);
  assert.equal(manifest.generation.creditsSpent, 566);
});

test('records two rejected chaos attempts and the accepted clean-start retry', () => {
  const manifest = JSON.parse(read('assets/cinematic/mote-ops-opening-v3-manifest.json'));
  const shot = manifest.generation.shots.find(({ id }) => id === 'chaos');
  assert.equal(shot.status, 'accepted');
  assert.equal(shot.jobId, 'd7edc581-53cc-412e-9a48-36546b2b734e');
  assert.equal(shot.credits, 54);
  assert.equal(shot.attempts.length, 3);
  assert.equal(shot.attempts[0].outcome, 'rejected during frame review');
  assert.match(shot.attempts[0].reason, /smartphone.*loose white paper/i);
  assert.equal(
    shot.attempts[0].changedPromptVariable,
    'Mike’s left hand remains on the corded handset. His right hand moves only between one visible mouse and one keyboard. Every smartphone, book, folder, and loose paper remains fixed outside his hand path.'
  );
  assert.equal(
    shot.attempts[0].source.path,
    'production/opening-film-v3/raw/shot-01-chaos-attempt-01-rejected.mp4'
  );
  assert.equal(shot.attempts[1].jobId, 'bc199863-0494-4bca-a76a-32781d65f637');
  assert.equal(shot.attempts[1].credits, 54);
  assert.equal(shot.attempts[1].outcome, 'rejected during frame review');
  assert.match(shot.attempts[1].reason, /smartphone.*loose white paper/i);
  assert.match(shot.attempts[1].reason, /book.*folder.*loose papers/i);
  assert.equal(
    shot.attempts[1].changedPromptVariable,
    'Mike’s left hand remains on the corded handset. His right hand moves only between one visible mouse and one keyboard. Every smartphone, book, folder, and loose paper remains fixed outside his hand path.'
  );
  assert.equal(
    shot.attempts[1].source.path,
    'production/opening-film-v3/raw/shot-01-chaos.mp4'
  );
  assert.equal(
    shot.attempts[1].source.sha256,
    '906f0b1dc255584fadbc120cda9e9ed03013fb1cfb585da26e2b14ce43e9dec7'
  );
  assert.equal(shot.attempts[2].jobId, 'd7edc581-53cc-412e-9a48-36546b2b734e');
  assert.equal(shot.attempts[2].credits, 54);
  assert.equal(shot.attempts[2].outcome, 'accepted during frame review');
  assert.equal(
    shot.attempts[2].startImageMediaId,
    '085b50e6-5a13-4bc9-9006-65bd1d4cfd98'
  );
  assert.equal(
    shot.attempts[2].source.path,
    'production/opening-film-v3/raw/shot-01-chaos-attempt-03.mp4'
  );
  assert.equal(
    shot.attempts[2].source.sha256,
    'ec15ed9bfb07e84d0b0ef623599f7eecfbbfdeb6ea161cdf3efcf86fa360f8ab'
  );
  assert.equal(shot.futureProposal.status, 'clean-start-image-accepted');
  assert.equal(shot.futureProposal.type, 'replace-video-reference-with-clean-start-image');
  assert.equal(
    shot.futureProposal.removeVideoReferenceJobId,
    '879db0a2-91d0-4276-ad5d-169a5606b303'
  );
  assert.equal(shot.futureProposal.replacementMedia.role, 'start_image');
  assert.equal(shot.futureProposal.replacementMedia.status, 'accepted');
  assert.equal(
    shot.futureProposal.replacementMedia.jobId,
    'd1161b13-e5cc-461b-ad33-65baff65977f'
  );
  assert.equal(
    shot.futureProposal.replacementMedia.review,
    '.superpowers/sdd/opening-v3-clean-start-image-review.md'
  );
  assert.match(shot.futureProposal.replacementMedia.requirements, /pre-reach.*bare desk edge/i);
  assert.equal(
    shot.futureProposal.actionLanguage,
    'Mike keeps the corded handset at his left ear for the entire six-second shot. His right forearm remains planted on the bare desk edge and his empty right hand stays still. He never reaches toward, touches, lifts, moves, or handles any desk object. Pressure is conveyed only through his expression and the two waiting employees.'
  );
  assert.ok(shot.review.endsWith('opening-v3-shot-01-review.md'));
  assert.equal(manifest.generation.creditsSpent, 566);
  assert.ok(manifest.generation.creditsSpent <= manifest.generation.approvedCreditCap);
});

test('records all accepted prep images and exact credit spend', () => {
  const manifest = JSON.parse(read('assets/cinematic/mote-ops-opening-v3-manifest.json'));
  assert.equal(manifest.generation.prepAssets.length, 4);
  const asset = manifest.generation.prepAssets.find(({ id }) => id === 'shot-01-clean-start');
  assert.ok(asset);
  assert.equal(asset.id, 'shot-01-clean-start');
  assert.equal(asset.type, 'image');
  assert.equal(asset.role, 'start_image');
  assert.equal(asset.model, 'Nano Banana 2');
  assert.equal(asset.status, 'accepted');
  assert.equal(asset.jobId, 'd1161b13-e5cc-461b-ad33-65baff65977f');
  assert.equal(asset.preflightCredits, 2);
  assert.equal(asset.credits, 2);
  assert.equal(asset.source.frameNumber, 0);
  assert.equal(asset.source.mediaId, '241d62d0-a218-456e-8d1d-b6bedf1a6c5a');
  assert.equal(
    asset.source.sha256,
    '67ffdce42b69112b7b395170ca4c0cae77656db4fa899a452ff0ff4290a89c06'
  );
  assert.equal(asset.output.path, 'production/opening-film-v3/raw/shot-01-clean-start.png');
  assert.equal(asset.output.codec, 'PNG');
  assert.equal(asset.output.width, 2752);
  assert.equal(asset.output.height, 1536);
  assert.equal(asset.output.sizeBytes, 4773911);
  assert.equal(
    asset.output.sha256,
    '9ca41cb4ccf8c38923ec36611f3a9752861828b67642a5bb70ed01a68637da55'
  );
  assert.equal(asset.review, '.superpowers/sdd/opening-v3-clean-start-image-review.md');
  assert.deepEqual(
    manifest.generation.prepAssets.map(({ id, credits, status }) => ({ id, credits, status })),
    [
      { id: 'shot-01-clean-start', credits: 2, status: 'accepted' },
      { id: 'shot-02-discovery-start', credits: 2, status: 'accepted' },
      { id: 'shot-06-control-start', credits: 2, status: 'accepted' },
      { id: 'shot-07-beach-start', credits: 2, status: 'accepted' },
    ]
  );
  const acceptedShotCredits = manifest.generation.shots
    .flatMap(({ attempts }) => attempts)
    .filter(({ outcome }) => outcome === 'accepted during frame review')
    .reduce((sum, { credits }) => sum + credits, 0);
  const rejectedShotCredits = manifest.generation.shots[0].attempts
    .filter(({ outcome }) => outcome === 'rejected during frame review')
    .reduce((sum, { credits }) => sum + credits, 0);
  const prepCredits = manifest.generation.prepAssets.reduce((sum, { credits }) => sum + credits, 0);
  assert.equal(manifest.generation.creditsSpent,
    acceptedShotCredits + rejectedShotCredits + prepCredits);
  assert.equal(manifest.generation.creditsSpent, 566);
  assert.ok(manifest.generation.creditsSpent <= manifest.generation.approvedCreditCap);
});

test('records exact accepted Seedance jobs and source hashes for every final shot', () => {
  const manifest = JSON.parse(read('assets/cinematic/mote-ops-opening-v3-manifest.json'));
  const expected = {
    chaos: ['d7edc581-53cc-412e-9a48-36546b2b734e',
      'ec15ed9bfb07e84d0b0ef623599f7eecfbbfdeb6ea161cdf3efcf86fa360f8ab'],
    discovery: ['6253590f-e39e-4da1-8414-e6716a674ceb',
      'b4a90f0c4c67fcb44881e1604ce0d6d0bbfcf90aad62cb980ff7f1cfbacc11e6'],
    onboarding: ['1577b651-79df-48ca-a20e-04b0813c94e9',
      '1ccefc8cb034ce0830f07e9c87455de8826e56508ae28c7efd501f09c1d7d128'],
    'inbox-calendar': ['02e09570-6277-44cc-bbb7-5bca5be79e62',
      '5bf5b9f728d6682fc74cd8d76ab5a0ca26ad3aac321bb8d956b99dea69d6e959'],
    'calls-finance': ['e12bfae4-63d8-41de-94b9-83635f159f43',
      'fdb79a45ba061aeaed7608eb43d335eff085dcb922f3b3de8813258813064b21'],
    'control-restored': ['b72e02dd-7af1-4624-9cba-9a87dca1dbcb',
      '0448abd7e5ac3324db6a4d6bfd407132873031f8197fcab78733f55837fcda23'],
    'beach-payoff': ['69fd8499-f035-46fc-9edd-795cbf3393be',
      'b512b46efd7bb0f818b20d111bb33d0de210379af275b5d6a32ac02113a85c24'],
  };
  for (const shot of manifest.generation.shots) {
    const [jobId, sha256] = expected[shot.id];
    assert.equal(shot.jobId, jobId, shot.id);
    assert.equal(shot.attempts.at(-1).source.sha256, sha256, shot.id);
    assert.equal(shot.attempts.at(-1).source.width, 1920, shot.id);
    assert.equal(shot.attempts.at(-1).source.height, 1080, shot.id);
    assert.equal(shot.attempts.at(-1).source.frameRate, 24, shot.id);
  }
});

test('defines prompts that lock Mike, office wardrobe, props, and blank screens', () => {
  const prompts = JSON.parse(read('production/opening-film-v3/generation-prompts.json'));
  assert.equal(prompts.referenceElement.id, '089862a9-bb77-4b46-88dd-14629f777d5c');
  assert.equal(prompts.references.officeJobId, '879db0a2-91d0-4276-ad5d-169a5606b303');
  assert.equal(prompts.references.beachJobId, 'edb3bca7-2cb7-4cae-b1dc-1bcc71ecea1d');
  assert.deepEqual(Object.keys(prompts.shots), [
    'chaos',
    'discovery',
    'onboarding',
    'inbox-calendar',
    'calls-finance',
    'control-restored',
    'beach-payoff',
  ]);
  for (const [id, shot] of Object.entries(prompts.shots)) {
    assert.match(shot.prompt, /Mike Mote Opening/);
    assert.match(shot.prompt, /no readable generated text or logos/i);
    assert.equal(shot.params.aspect_ratio, '16:9', id);
    assert.equal(shot.params.resolution, '1080p', id);
    assert.equal(shot.params.mode, 'std', id);
    assert.equal(shot.params.generate_audio, false, id);
  }
  for (const id of ['chaos', 'discovery', 'onboarding', 'inbox-calendar', 'calls-finance', 'control-restored']) {
    assert.match(prompts.shots[id].prompt, /charcoal(?: opaque)? long-sleeve button-down/i);
    assert.match(
      prompts.shots[id].prompt,
      /tattoo.*(?:covered|not visible|visibility or bleed-through)/i
    );
  }
  assert.match(prompts.shots['beach-payoff'].prompt, /white short-sleeve linen shirt/i);
  assert.match(prompts.shots['beach-payoff'].prompt, /tattoos.*reference/i);
});

test('keeps V3 raw production inputs outside release uploads', () => {
  assert.match(read('.gitignore'), /^production\/opening-film-v3\/raw\/$/m);
  assert.match(read('.gitignore'), /^production\/opening-film-v3\/rendered\/$/m);
  assert.match(read('.vercelignore'), /^production\/opening-film-v3\/$/m);
});

test('builds every readable V3 interface as a deterministic local plate', () => {
  const html = read('production/opening-film-v3/interfaces.html');
  const css = read('production/opening-film-v3/interfaces.css');
  const js = read('production/opening-film-v3/interfaces.js');
  const capture = read('production/opening-film-v3/capture-interfaces.sh');
  const packageJson = JSON.parse(read('package.json'));
  const plates = [
    'invitation', 'invitation-clicked',
    'onboarding-tools', 'onboarding-work', 'onboarding-approval',
    'inbox', 'inbox-approved', 'calendar', 'calendar-approved',
    'calls', 'calls-approved', 'finance', 'finance-approved',
    'dashboard-zero', 'phone-zero', 'opening-copy', 'closing-copy',
  ];
  for (const plate of plates) {
    assert.match(js, new RegExp(`['"]${plate}['"]\\s*:`), plate);
    assert.match(capture, new RegExp(`\\n  ${plate}\\n`), plate);
  }
  for (const copy of [
    'Drowning in the work? Start here.',
    'See how Mote Ops can help',
    '286 messages organized',
    '18 replies prepared',
    '3 conflicts resolved',
    '2 changes ready',
    '7 missed calls summarized',
    '4 follow-ups prepared',
    '5 exceptions summarized',
    '2 items need review',
    'Pending tasks: 0',
    'Enjoy your day.',
    'Mote Ops cleaned up the work.',
    'Mike found the beach.',
    'Book your consultation today.',
    'Free 30-minute consultation',
  ]) assert.match(js, new RegExp(copy.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.doesNotMatch(js, /\b(?:sent automatically|paid automatically|rescheduled automatically)\b/i);
  assert.match(html, /aria-live="polite"/);
  assert.match(css, /--mote-cream:\s*#f5f1e8/);
  assert.match(css, /--mote-green:\s*#0d4b3d/);
  assert.equal(packageJson.scripts['capture:opening-v3-interfaces'],
    'bash production/opening-film-v3/capture-interfaces.sh');
});

test('resets restored browser scroll before deterministic interface capture', () => {
  assert.match(read('production/opening-film-v3/interfaces.js'), /scrollTo\(0,\s*0\)/);
  assert.match(read('production/opening-film-v3/capture-interfaces.sh'),
    /--user-data-dir="\$profile\/\$plate"/);
});

test('sizes phone and copy canvases for compositing viewports', () => {
  const css = read('production/opening-film-v3/interfaces.css');
  const js = read('production/opening-film-v3/interfaces.js');
  assert.match(js, /document\.documentElement\.dataset\.plate\s*=\s*requested/);
  assert.match(css,
    /body\[data-plate="phone-zero"\]\s+#app\s*\{\s*width:\s*1080px;\s*height:\s*1920px;/);
  assert.match(css,
    /body\[data-plate="opening-copy"\]\s+#app,\s*body\[data-plate="closing-copy"\]\s+#app\s*\{\s*width:\s*1920px;\s*height:\s*1080px;/);
  assert.match(css,
    /html\[data-plate="opening-copy"\][\s\S]*background:\s*transparent/);
});

test('keeps V3 action copy at the accepted laptop plate size', () => {
  assert.match(read('production/opening-film-v3/interfaces.css'),
    /\.action\s*\{[^}]*font-size:\s*23px;/s);
});

test('styles an approved action from the button own data state', () => {
  const css = read('production/opening-film-v3/interfaces.css');
  assert.match(css,
    /\.action\[data-state="approved"\]\s*\{\s*background:\s*#466c54;/);
  assert.doesNotMatch(css, /\[data-state="approved"\]\s+\.action/);
});

test('assembles an exact silent 50-second master with perspective-matched device screens', () => {
  const compose = read('production/opening-film-v3/compose-film.sh');
  const packageJson = JSON.parse(read('package.json'));
  accessSync(resolve(root, 'production/opening-film-v3/compose-film.sh'), constants.X_OK);
  assert.match(compose, /perspective=/);
  assert.match(compose, /colorkey=0x008a50/);
  assert.match(compose, /phone_crop="crop=/);
  assert.match(compose, /\[phone-source\]\$phone_crop,colorkey=/);
  assert.match(compose, /opening-copy\.png/);
  assert.match(compose, /closing-copy\.png/);
  for (const duration of [6, 8, 5, 8, 8, 7, 8]) {
    assert.match(compose, new RegExp(`trim=duration=${duration}(?:[,;])`));
  }
  assert.match(compose, /-an\b/);
  assert.match(compose, /-movflags \+faststart/);
  assert.match(compose, /mote-ops-opening-v3-1080\.mp4/);
  assert.match(compose, /mote-ops-opening-v3-720\.mp4/);
  assert.match(compose, /mote-ops-opening-v3-poster\.jpg/);
  assert.equal(packageJson.scripts['compose:opening-v3'],
    'bash production/opening-film-v3/compose-film.sh');
});

test('renders exact 50-second silent 1080p and 720p masters', () => {
  const manifest = JSON.parse(read('assets/cinematic/mote-ops-opening-v3-manifest.json'));
  assert.equal(manifest.status, 'masters-assembled-awaiting-site-integration');
  assert.deepEqual(manifest.outputs, {
    master1080: {
      path: 'assets/cinematic/mote-ops-opening-v3-1080.mp4',
      width: 1920,
      height: 1080,
      frameRate: 24,
      frameCount: 1200,
      durationSeconds: 50,
      sizeBytes: 21877931,
      sha256: 'f6e6073a2ae7d2e627921f42b5954816465807e282b8d21851f367ad4268cb05',
    },
    master720: {
      path: 'assets/cinematic/mote-ops-opening-v3-720.mp4',
      width: 1280,
      height: 720,
      frameRate: 24,
      frameCount: 1200,
      durationSeconds: 50,
      sizeBytes: 6720682,
      sha256: 'a7c88ca7372002726260ff78c595d0bf2157dbc3118414153462fd2139989cbf',
    },
    poster: {
      path: 'assets/cinematic/mote-ops-opening-v3-poster.jpg',
      width: 1920,
      height: 1080,
      sizeBytes: 135241,
      sha256: '36fe2a8a38941aa5215f50d1d5f959048a7ed2c8863e2a55bea8f55e7a86abaa',
    },
  });
  for (const [path, width, height] of [
    ['assets/cinematic/mote-ops-opening-v3-1080.mp4', 1920, 1080],
    ['assets/cinematic/mote-ops-opening-v3-720.mp4', 1280, 720],
  ]) {
    accessSync(resolve(root, path), constants.R_OK);
    const result = spawnSync('ffprobe', [
      '-v', 'error',
      '-show_entries', 'stream=codec_type,width,height,nb_frames',
      '-show_entries', 'format=duration',
      '-of', 'json',
      resolve(root, path),
    ], { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    const probe = JSON.parse(result.stdout);
    assert.equal(probe.format.duration, '50.000000', path);
    assert.equal(probe.streams[0].width, width, path);
    assert.equal(probe.streams[0].height, height, path);
    assert.equal(probe.streams[0].nb_frames, '1200', path);
    assert.equal(probe.streams.filter(({ codec_type }) => codec_type === 'audio').length, 0, path);
  }
});
