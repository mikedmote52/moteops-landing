import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
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
  assert.equal(manifest.generation.creditsSpent, 164);
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
      { id: 'discovery', status: 'not-generated' },
      { id: 'onboarding', status: 'not-generated' },
      { id: 'inbox-calendar', status: 'not-generated' },
      { id: 'calls-finance', status: 'not-generated' },
      { id: 'control-restored', status: 'not-generated' },
      { id: 'beach-payoff', status: 'not-generated' },
    ]
  );
  for (const shot of manifest.generation.shots.slice(1)) {
    assert.equal(shot.jobId, null, shot.id);
    assert.equal(shot.credits, null, shot.id);
    assert.deepEqual(shot.attempts, [], shot.id);
  }
});

test('does not allow V3 generation without exact approved authority', () => {
  const manifest = JSON.parse(read('assets/cinematic/mote-ops-opening-v3-manifest.json'));
  assert.equal(manifest.generation.firstPassCredits, 450);
  assert.equal(manifest.generation.approvedCreditCap, 675);
  assert.ok(manifest.generation.approvedCreditCap >= manifest.generation.firstPassCredits);
  assert.equal(manifest.generation.creditsSpent, 164);
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
  assert.equal(manifest.generation.creditsSpent, 164);
  assert.ok(manifest.generation.creditsSpent <= manifest.generation.approvedCreditCap);
});

test('records the single accepted clean-start prep image and exact credit spend', () => {
  const manifest = JSON.parse(read('assets/cinematic/mote-ops-opening-v3-manifest.json'));
  assert.equal(manifest.generation.prepAssets.length, 1);
  const [asset] = manifest.generation.prepAssets;
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
  const acceptedRetry = manifest.generation.shots[0].attempts[2];
  assert.equal(manifest.generation.creditsSpent, 108 + asset.credits + acceptedRetry.credits);
  assert.ok(manifest.generation.creditsSpent <= manifest.generation.approvedCreditCap);
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
