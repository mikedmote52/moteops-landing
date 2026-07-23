import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const root = resolve(new URL('..', import.meta.url).pathname);
const read = (path) => readFileSync(resolve(root, path), 'utf8');

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
});

test('keeps production sources out of release uploads', () => {
  const vercelIgnore = read('.vercelignore');
  assert.match(vercelIgnore, /^production\/opening-film\/$/m);
  assert.match(vercelIgnore, /^assets\/cinematic\/source\/$/m);
});
