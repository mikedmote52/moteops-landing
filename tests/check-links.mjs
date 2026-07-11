import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const html = readFileSync(resolve(root, 'index.html'), 'utf8');
const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(([, id]) => id));
const refs = [...html.matchAll(/\b(?:href|src)="([^"]+)"/g)].map(([, ref]) => ref);

for (const ref of refs) {
  assert.ok(ref.trim(), 'empty link or asset reference');
  if (ref.startsWith('#')) assert.ok(ids.has(ref.slice(1)), `missing anchor target ${ref}`);
  if (!/^(?:https?:|mailto:|#)/.test(ref)) {
    const path = ref.split(/[?#]/)[0].replace(/^\//, '');
    assert.ok(existsSync(resolve(root, path)), `missing local asset ${path}`);
  }
}

const external = refs.filter((ref) => /^https?:/.test(ref));
assert.ok(external.every((ref) => /^https:\/\//.test(ref)), 'all external URLs must use HTTPS');
console.log(`Checked ${refs.length} references: ${external.length} external, ${refs.length - external.length} local or anchored.`);
