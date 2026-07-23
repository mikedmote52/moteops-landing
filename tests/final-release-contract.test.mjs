import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const root = resolve(new URL('..', import.meta.url).pathname);
const releasedFiles = [];

function walk(directory) {
  for (const entry of readdirSync(directory)) {
    if (['.git', '.vercel', '.superpowers', '.worktrees', 'docs', 'node_modules'].includes(entry)) continue;
    const path = resolve(directory, entry);
    if (statSync(path).isDirectory()) walk(path);
    else if (
      /\.(?:html|css)$/i.test(entry)
      && !/\.(?:bak|pre|codex|v04)-/i.test(entry)
      && spawnSync('git', ['-C', root, 'check-ignore', '-q', '--', path]).status !== 0
    ) releasedFiles.push(path);
  }
}

function sha256(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

function mp4Atoms(path) {
  const bytes = readFileSync(path);
  const atoms = [];
  for (let offset = 0; offset + 8 <= bytes.length;) {
    const size = bytes.readUInt32BE(offset);
    atoms.push({ type: bytes.subarray(offset + 4, offset + 8).toString('latin1'), offset });
    offset += size;
  }
  return atoms;
}

walk(root);

test('keeps linked development worktrees outside the release scan', () => {
  assert.match(walk.toString(), /'\.worktrees'/);
});

test('keeps ignored local prototypes outside the release scan', () => {
  assert.equal(releasedFiles.some((path) => path.endsWith('/_bgproto-real.html')), false);
});

test('uses a root-only deployment package contract that excludes raw study inputs and local review metadata', () => {
  const ignore = readFileSync(resolve(root, '.vercelignore'), 'utf8');
  for (const pattern of [
    'demo/vessel-zero/media/source/**',
    'demo/solaire-01/media/source/**',
    '**/.vercelignore',
    '.vercel/**',
    '.superpowers/**',
    'index.v04-*',
  ]) assert.match(ignore, new RegExp(`^${pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'm'));
  assert.doesNotMatch(ignore, /demo\/(?:vessel-zero|solaire-01)\/media\/(?:vz|so)-0[1-3]\.mp4/);
});

test('does not ship third-party resource requests from HTML or CSS', () => {
  const externalResource = /<(?:link|script|img|audio|video|source)\b[^>]+(?:href|src)=["']https?:\/\//i;
  const externalCssResource = /@import\s+(?:url\()?\s*["']?https?:\/\/|url\(\s*["']?https?:\/\//i;
  for (const path of releasedFiles) {
    const source = readFileSync(path, 'utf8');
    assert.doesNotMatch(source, externalResource, path);
    assert.doesNotMatch(source, externalCssResource, path);
  }
});

test('keeps the approved operating line consistent in document and share metadata', () => {
  const html = readFileSync(resolve(root, 'index.html'), 'utf8');
  const line = 'Your people and tools already do the work. Mote Ops helps them work as one.';
  assert.match(html, new RegExp(`<title>Mote Ops \\| ${line.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</title>`));
  assert.match(html, new RegExp(`<meta property="og:title" content="${line.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}">`));
  assert.match(html, /<meta name="description" content="Your people and tools already do the work\. Mote Ops helps them work as one\./);
  assert.match(html, /<meta property="og:description" content="Your people and tools already do the work\. Mote Ops helps them work as one\./);
});

test('visibly labels the cinematic portfolio studies as AI-generated fictional work', () => {
  for (const path of ['demo/vessel-zero/index.html', 'demo/solaire-01/index.html']) {
    assert.match(readFileSync(resolve(root, path), 'utf8'), /AI-generated film\s*[·&middot;]\s*fictional (?:business )?scenario(?:\/study)?/i, path);
  }
  assert.doesNotMatch(readFileSync(resolve(root, 'index.html'), 'utf8'), /AI-generated film\s*[·&middot;]\s*fictional business scenario/i);
});

test('records audit-grade checked metadata for every optimized study media pair', () => {
  for (const [site, ids] of Object.entries({
    'vessel-zero': ['vz-01', 'vz-02', 'vz-03'],
    'solaire-01': ['so-01', 'so-02', 'so-03'],
  })) {
    const mediaRoot = resolve(root, 'demo', site, 'media');
    const manifest = JSON.parse(readFileSync(resolve(mediaRoot, 'manifest.json'), 'utf8'));
    assert.deepEqual(manifest.clips.map(({ id }) => id), ids);
    for (const clip of manifest.clips) {
      assert.equal(clip.audit.provider, 'not recorded');
      assert.equal(clip.audit.generationJob, 'not recorded');
      assert.equal(clip.audit.reviewStatus, 'reviewed for private preview');
      assert.equal(clip.audit.fictionalDisclosure, 'AI-generated film · fictional scenario/study');
      const videoPath = resolve(mediaRoot, `${clip.id}.mp4`);
      const posterPath = resolve(mediaRoot, `${clip.id}.webp`);
      const probe = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=codec_name,codec_type,width,height,r_frame_rate', '-of', 'json', videoPath], { encoding: 'utf8' });
      assert.equal(probe.status, 0, probe.stderr);
      const video = JSON.parse(probe.stdout).streams.find(({ codec_type }) => codec_type === 'video');
      assert.deepEqual(clip.audit.video, {
        codec: video.codec_name,
        resolution: `${video.width}x${video.height}`,
        frameRate: video.r_frame_rate,
        audio: 'none',
        faststart: true,
        sha256: sha256(videoPath),
      });
      const dimensions = spawnSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', posterPath], { encoding: 'utf8' });
      assert.equal(dimensions.status, 0, dimensions.stderr);
      assert.deepEqual(clip.audit.poster, {
        resolution: '1600x900',
        sha256: sha256(posterPath),
      });
      const atoms = mp4Atoms(videoPath);
      assert.ok(atoms.find(({ type }) => type === 'moov').offset < atoms.find(({ type }) => type === 'mdat').offset);
    }
  }
});
