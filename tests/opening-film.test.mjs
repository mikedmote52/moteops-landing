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
  assert.match(plates, /data-plate="organized-inbox"/);
  assert.match(plates, /data-plate="calendar-resolution"/);
  assert.match(plates, /data-plate="review-packet"/);
  assert.match(plates, /data-plate="approval-queue"/);
  assert.match(plates, /data-plate="beach-end-card"/);
  assert.match(plates, /Fictional business scenario/i);
  assert.doesNotMatch(plates, /\b(?:sent|paid|signed|booked automatically)\b/i);
});

test('defines a readable inbox-to-moteops laptop story', () => {
  const html = read('production/opening-film/laptop-plates.html');
  const css = read('production/opening-film/laptop-plates.css');
  const capture = read('production/opening-film/capture-laptop-plates.sh');
  const packageJson = JSON.parse(read('package.json'));

  for (const plate of [
    'laptop-inbox',
    'laptop-email',
    'laptop-email-click',
    'laptop-site',
  ]) {
    assert.match(html, new RegExp(`data-plate="${plate}"`));
    assert.match(capture, new RegExp(`\\n  ${plate}\\n`));
  }

  assert.match(html, /AI could help your business\. Where do you start\?/);
  assert.match(html, /Mote Ops finds the work AI can take off your plate\./);
  assert.match(html, /See how Mote Ops can help/);
  assert.match(html, /moteops\.tech/);
  assert.match(html, /aria-label="Inbox"/);
  assert.match(html, /aria-label="Message from Mote Ops"/);
  assert.match(css, /width:\s*1600px/);
  assert.match(css, /height:\s*900px/);
  assert.match(css, /\.email-cta\.is-clicked/);
  assert.match(css, /\.cursor-click/);
  assert.equal(
    packageJson.scripts['capture:opening-laptop'],
    'bash production/opening-film/capture-laptop-plates.sh'
  );
});

test('captures cleanup interfaces inside one physical monitor treatment', () => {
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
  assert.match(css, /\.monitor-shell[\s\S]*width:\s*1344px/);
  assert.match(css, /\.monitor-screen[\s\S]*width:\s*1280px[\s\S]*height:\s*720px/);
  assert.match(css, /background-image:\s*url\("rendered\/monitor-office\.png"\)/);
  assert.match(css, /filter:\s*blur\(8px\) brightness\(\.58\)/);
  assert.match(css, /perspective\(2400px\) rotateY\(-1\.5deg\) rotateX\(\.4deg\)/);
  assert.match(css, /\.monitor-reflection[\s\S]*linear-gradient/);

  for (const name of [
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
  assert.deepEqual(manifest.postProduction.laptopComposite, {
    generatedCredits: 0,
    source: 'accepted breakdown-discovery footage from 5.5 through 8.0 seconds',
    trackFramesPerSecond: 24,
    movingInboxSeconds: 1.25,
    emailStableHoldSeconds: 2.2,
    clickResponseSeconds: 0.35,
    siteStableHoldSeconds: 1.2,
    cleanupStableHoldSeconds: 1.8,
    destination: 'moteops.tech',
  });
});

test('keeps production sources out of release uploads', () => {
  const vercelIgnore = read('.vercelignore');
  assert.match(vercelIgnore, /^production\/opening-film\/$/m);
  assert.match(vercelIgnore, /^assets\/cinematic\/source\/$/m);
});

test('clears every pressure label before the discovery email cut', () => {
  const buildScript = read('production/opening-film/build-opening-film.sh');
  assert.doesNotMatch(buildScript, /between\(t,3\.5,5\.75\)/);
  assert.doesNotMatch(buildScript, /between\(t,4\.1,5\.75\)/);
  assert.match(buildScript, /between\(t,3\.5,5\.45\)/);
  assert.match(buildScript, /between\(t,4\.1,5\.45\)/);
});

test('composites the invitation and clickthrough into the actor laptop', () => {
  const track = read('production/opening-film/laptop-track.ffscript');
  const discovery = read('production/opening-film/build-laptop-discovery.sh');
  const build = read('production/opening-film/build-opening-film.sh');
  const laptopCss = read('production/opening-film/laptop-plates.css');

  for (const timestamp of ['5.50', '5.75', '6.00', '6.25', '6.50', '6.75']) {
    assert.match(track, new RegExp(`# ${timestamp}`));
  }
  assert.match(discovery, /chromakey=0x008a50:0\.12:0\.03/);
  assert.match(discovery, /laptop-inbox\.png/);
  assert.match(discovery, /laptop-email\.png/);
  assert.match(discovery, /laptop-email-click\.png/);
  assert.match(discovery, /laptop-site\.png/);
  assert.match(discovery, /perspective=/);
  assert.match(discovery, /sense=destination/);
  assert.doesNotMatch(discovery, /rotate=/);
  assert.doesNotMatch(discovery, /scale=w='760/);
  assert.match(discovery, /email_hold="2\.2"/);
  assert.match(discovery, /click_hold="0\.35"/);
  assert.match(discovery, /site_hold="1\.20"/);
  assert.match(discovery, /-t 5\.0/);
  assert.match(laptopCss, /-apple-system,\s*BlinkMacSystemFont,\s*"Segoe UI"/);
  assert.doesNotMatch(laptopCss, /\.opened-email h1[\s\S]*?font:\s*700 64px/);
  assert.match(build, /chaos_end="5\.5"/);
  assert.match(build, /interface_hold="1\.8"/);
  assert.match(build, /master_duration="28\.0"/);
  assert.match(build, /laptop-discovery\.mp4/);
  assert.doesNotMatch(build, /monitor-discovery-email\.png/);
  assert.doesNotMatch(build, /actor_attention=/);
});

test('records laptop clickthrough timing in the media ledger', () => {
  const manifest = JSON.parse(read('assets/cinematic/mote-ops-opening-manifest.json'));
  assert.equal(manifest.durationSeconds, 28);
  assert.deepEqual(manifest.postProduction.laptopComposite, {
    generatedCredits: 0,
    source: 'accepted breakdown-discovery footage from 5.5 through 8.0 seconds',
    trackFramesPerSecond: 24,
    movingInboxSeconds: 1.25,
    emailStableHoldSeconds: 2.2,
    clickResponseSeconds: 0.35,
    siteStableHoldSeconds: 1.2,
    cleanupStableHoldSeconds: 1.8,
    destination: 'moteops.tech',
  });
  assert.deepEqual(manifest.frameReview.timesSeconds, [
    0, 0.5, 1, 2, 3, 4, 5, 5.49, 5.51, 5.75,
    6.25, 6.74, 6.76, 7.5, 8.94, 8.96, 9.29, 9.31,
    10.0, 10.49, 10.51, 11.4, 12.32, 12.34, 13.2,
    14.15, 14.18, 15.0, 15.99, 16.01, 16.9, 17.82,
    17.84, 18.8, 19.99, 20.01, 21, 22, 23, 24, 25,
    26, 27, 27.99,
  ]);
});

test('centers a constrained opening film on desktop without shrinking phone layout', () => {
  const css = read('opening-film.css');
  assert.match(css, /@media \(min-width: 1021px\)[\s\S]*?\.opening-story\s*\{[\s\S]*?max-width:\s*1040px/);
  assert.match(css, /width:\s*calc\(100vw - 96px\)/);
  assert.match(css, /justify-self:\s*center/);
  assert.match(css, /\.opening-story video\s*\{[^}]*object-fit:\s*contain/s);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*?\.opening-story\s*\{[\s\S]*?width:\s*100%/);
});

test('opens the homepage with one play-once email-to-beach story', () => {
  const html = read('index.html');
  const opening = html.indexOf('data-opening-story');
  const tuesday = html.indexOf('id="tuesday"');
  const careHub = html.indexOf('id="care-hub-showcase"');
  const openingFigure = html.slice(opening, html.indexOf('</figure>', opening));
  assert.ok(opening > 0 && opening < tuesday && tuesday < careHub);
  assert.match(html, /mote-ops-opening-v3-1080\.mp4/);
  assert.match(html, /mote-ops-opening-v3-720\.mp4/);
  assert.match(html, /mote-ops-opening-v3-1080\.mp4\?v=opening-v3-final-20260723/);
  assert.match(html, /mote-ops-opening-v3-720\.mp4\?v=opening-v3-final-20260723/);
  assert.match(html, /mote-ops-opening-v3-poster\.jpg/);
  assert.match(html, /autoplay muted playsinline/);
  assert.doesNotMatch(openingFigure, /\sloop(?:\s|>)/);
  assert.match(html, /data-replay-story[^>]*hidden/);
  assert.match(openingFigure, /aria-label="Mote Ops opening film"/);
  assert.doesNotMatch(openingFigure, /<figcaption/);
  assert.doesNotMatch(openingFigure, /opening-story-(?:summary|disclosure)/);
  assert.doesNotMatch(openingFigure, /aria-describedby/);
  assert.doesNotMatch(html, /A fictional overwhelmed business owner finds Mote Ops/);
  assert.doesNotMatch(html, /AI-generated film · fictional business scenario featuring Mike Mote\./);
  assert.doesNotMatch(html, /owner-pressure/);
  assert.doesNotMatch(html, /operating-transition/);
  assert.doesNotMatch(html, /mote-ops-01\.(?:mp4|webp)/);
});

test('makes the final opening-film consultation action a real accessible link', () => {
  const html = read('index.html');
  const css = read('opening-film.css');
  const opening = html.indexOf('data-opening-story');
  const openingFigure = html.slice(opening, html.indexOf('</figure>', opening));

  assert.match(openingFigure, /data-opening-consultation/);
  assert.match(openingFigure, /href="https:\/\/calendly\.com\/mikedmote\/30min"/);
  assert.match(openingFigure, /data-active="false"/);
  assert.match(openingFigure, /tabindex="-1"/);
  assert.match(css, /\[data-opening-consultation\][\s\S]*min-height:\s*44px/);
  assert.match(css, /\[data-opening-consultation\]\[data-active="false"\][\s\S]*pointer-events:\s*none/);
});

test('lands the consultation hit target on the button painted into the film', () => {
  const css = read('opening-film.css');
  const rule = css.slice(
    css.indexOf('.opening-story [data-opening-consultation] {'),
    css.indexOf('}', css.indexOf('.opening-story [data-opening-consultation] {')),
  );
  const pct = (property) => {
    const match = rule.match(new RegExp(`${property}:\\s*([\\d.]+)%`));
    assert.ok(match, `${property} is declared as a percentage of the film frame`);
    return Number(match[1]);
  };

  // Measured from assets/cinematic/mote-ops-opening-v3-1080.mp4 (1920x1080) at
  // t=47.0s..49.9s: the moteops.tech button holds x 1290..1702, y 696..782.
  const button = { left: 67.19, right: 88.65, top: 64.44, bottom: 72.41 };

  // The rule is centre-anchored so the 44px floor expands symmetrically.
  assert.match(rule, /transform:\s*translateY\(-50%\)/);
  const centreY = pct('top');
  const height = pct('height');
  const left = pct('left');
  const width = pct('width');

  const buttonCentreY = (button.top + button.bottom) / 2;
  assert.ok(
    Math.abs(centreY - buttonCentreY) <= 0.5,
    `hit target centre ${centreY}% sits on the button centre ${buttonCentreY.toFixed(2)}%`,
  );

  const targetTop = centreY - height / 2;
  const targetBottom = centreY + height / 2;
  assert.ok(targetTop >= button.top - 0.6, `hit target top ${targetTop.toFixed(2)}% stays on the button`);
  assert.ok(targetBottom <= button.bottom + 0.6, `hit target bottom ${targetBottom.toFixed(2)}% stays on the button`);
  assert.ok(left >= button.left - 0.6, `hit target left ${left}% stays on the button`);
  assert.ok(left + width <= button.right + 0.6, `hit target right ${(left + width).toFixed(2)}% stays on the button`);

  // Regression guard: the shipped rule was top 56% / height 10%, which overlapped
  // the painted button by ~16px of its 84px and left the rest dead.
  assert.ok(targetTop > 60, 'hit target no longer floats above the button');
});

test('activates the consultation overlay only once the button is painted', () => {
  const js = read('motion-system.js');
  const match = js.match(/consultationStartSeconds\s*=\s*([\d.]+)/);
  assert.ok(match, 'the activation threshold is declared');
  const start = Number(match[1]);
  // The button is absent at t=46.6s and fully painted by t=47.0s.
  assert.ok(start >= 46.9, `activation at ${start}s waits for the painted button`);
  assert.ok(start < 50, `activation at ${start}s happens before the film ends`);
});

test('keeps the visible replay control above the invisible consultation target', () => {
  const css = read('opening-film.css');
  const zIndex = (selector) => {
    const start = css.indexOf(selector);
    assert.notEqual(start, -1, `${selector} is declared`);
    const rule = css.slice(start, css.indexOf('}', start));
    const match = rule.match(/z-index:\s*(\d+)/);
    assert.ok(match, `${selector} declares a z-index`);
    return Number(match[1]);
  };

  // On narrow frames the 44px consultation floor reaches into the replay
  // button, so the replay button has to win the stack.
  assert.ok(
    zIndex('.opening-story [data-replay-story] {') > zIndex('.opening-story [data-opening-consultation] {'),
    'replay stacks above the consultation hit target',
  );
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
