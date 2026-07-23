import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { readFileSync, statSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('../..', import.meta.url));
const manifestPath = resolve(root, 'assets/cinematic/mote-ops-opening-manifest.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

function hash(path) {
  return createHash('sha256').update(readFileSync(resolve(root, path))).digest('hex');
}

function probe(path) {
  const result = spawnSync('ffprobe', [
    '-v', 'error',
    '-show_entries', 'format=duration:stream=codec_name,codec_type,width,height,r_frame_rate',
    '-of', 'json',
    resolve(root, path),
  ], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr);
  const metadata = JSON.parse(result.stdout);
  const video = metadata.streams.find(({ codec_type }) => codec_type === 'video');
  const audio = metadata.streams.filter(({ codec_type }) => codec_type === 'audio');
  if (!video || audio.length) throw new Error(`${path} must contain one silent video stream`);
  return { ...video, duration: Number(metadata.format.duration) };
}

function updateOutput(record, path) {
  const metadata = probe(path);
  record.path = path;
  record.codec = 'H.264';
  record.width = Number(metadata.width);
  record.height = Number(metadata.height);
  record.frameRate = 24;
  record.durationSeconds = metadata.duration;
  record.sizeBytes = statSync(resolve(root, path)).size;
  record.sha256 = hash(path);
  record.audio = false;
  record.faststart = true;
}

manifest.status = 'media-verified';
manifest.durationSeconds = 28;
manifest.capturePlates = [
  'laptop-inbox',
  'laptop-email',
  'laptop-email-click',
  'laptop-site',
  'organized-inbox',
  'calendar-resolution',
  'review-packet',
  'approval-queue',
  'beach-end-card',
];
delete manifest.postProduction.monitorComposite;
manifest.postProduction.laptopComposite = {
  generatedCredits: 0,
  source: 'accepted breakdown-discovery footage from 5.5 through 8.0 seconds',
  trackFramesPerSecond: 24,
  movingInboxSeconds: 1.25,
  emailStableHoldSeconds: 2.2,
  clickResponseSeconds: 0.35,
  siteStableHoldSeconds: 1.2,
  cleanupStableHoldSeconds: 1.8,
  destination: 'moteops.tech',
};

updateOutput(
  manifest.outputs.master1080,
  'assets/cinematic/mote-ops-opening-1080.mp4'
);
updateOutput(
  manifest.outputs.master720,
  'assets/cinematic/mote-ops-opening-720.mp4'
);

const posterPath = 'assets/cinematic/mote-ops-opening-poster.webp';
manifest.outputs.poster = {
  path: posterPath,
  width: 1600,
  height: 900,
  sizeBytes: statSync(resolve(root, posterPath)).size,
  sha256: hash(posterPath),
};

manifest.frameReview = {
  timesSeconds: [
    0, 0.5, 1, 2, 3, 4, 5, 5.49, 5.51, 5.75,
    6.25, 6.74, 6.76, 7.5, 8.94, 8.96, 9.29, 9.31,
    10.0, 10.49, 10.51, 11.4, 12.32, 12.34, 13.2,
    14.15, 14.18, 15.0, 15.99, 16.01, 16.9, 17.82,
    17.84, 18.8, 19.99, 20.01, 21, 22, 23, 24, 25,
    26, 27, 27.99,
  ],
  result: 'pending-local-review',
  reviewFile: '.superpowers/sdd/opening-laptop-frame-review.md',
};

writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
