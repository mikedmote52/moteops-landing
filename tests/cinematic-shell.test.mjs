import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const js = readFileSync(new URL('../cinematic-shell.js', import.meta.url), 'utf8');
const ownerStoryJs = readFileSync(new URL('../owner-story.js', import.meta.url), 'utf8');

test('stages the existing operating story without hijacking scroll', () => {
  for (const chapter of ['PRESSURE', 'WORKING PROOF', 'EVIDENCE', 'STUDIO', 'METHOD', 'START']) {
    assert.match(html, new RegExp(`data-chapter=["']${chapter}["']`, 'i'));
  }
  assert.match(js, /requestAnimationFrame/);
  assert.match(js, /--page-progress/);
  assert.match(js, /--section-progress/);
  assert.match(js, /IntersectionObserver/);
  assert.match(js, /mote:motionchange/);
  assert.doesNotMatch(js, /preventDefault\(\).*scroll|wheel|touchmove/s);
});

test('keeps motion preference bindings isolated across classic scripts', () => {
  assert.match(js, /pageMotionPreference/);
  assert.match(ownerStoryJs, /ownerMotionPreference/);
  assert.doesNotMatch(js, /\b(?:const|let)\s+motionPreference\b/);
  assert.doesNotMatch(ownerStoryJs, /\b(?:const|let)\s+motionPreference\b/);
});
