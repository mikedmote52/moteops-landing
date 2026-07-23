# Task 1 Report: Lock the V3 Generation and Release Contracts

## Implementation summary

Created the silent 50-second seven-shot V3 generation manifest and the ordered Seedance 2.0 prompt pack. Added an executable contract test for the generation values, prompt constraints, and release exclusions. Added V3 raw and rendered production exclusions to `.gitignore` and excluded the full V3 production directory from Vercel uploads.

The supplied prompt text and supplied test had one inconsistency: the test required the exact sentence `No readable generated text or logos.` in every shot, but five supplied prompts omitted it. Per coordinating-agent direction, that exact sentence was appended to `discovery`, `onboarding`, `inbox-calendar`, `calls-finance`, and `control-restored`, retaining all supplied prompt content and enforcing the stricter global constraint.

No media was generated, credits spent, deployment run, or production surface changed.

## RED evidence

Command:

```bash
node --test tests/opening-film-v3.test.mjs
```

Relevant output before implementation:

```text
not ok 1 - declares the exact seven-shot silent V3 generation contract
error: "ENOENT: no such file or directory, open '.../assets/cinematic/mote-ops-opening-v3-manifest.json'"
not ok 2 - defines prompts that lock Mike, office wardrobe, props, and blank screens
error: "ENOENT: no such file or directory, open '.../production/opening-film-v3/generation-prompts.json'"
not ok 3 - keeps V3 raw production inputs outside release uploads
error: The input did not match the regular expression /^production\\/opening-film-v3\\/raw\\/$/m
# pass 0
# fail 3
```

After adding the supplied prompt text verbatim, the focused test correctly exposed the specification inconsistency:

```text
not ok 2 - defines prompts that lock Mike, office wardrobe, props, and blank screens
error: The input did not match the regular expression /no readable generated text or logos/i
```

## GREEN evidence

Command:

```bash
node --test tests/opening-film-v3.test.mjs
```

Relevant output:

```text
# tests 3
# pass 3
# fail 0
```

## Full verification

Commands:

```bash
npm test
git diff --check
```

Results:

```text
# tests 88
# pass 88
# fail 0
```

`git diff --check` produced no output.

## Files changed

- `.gitignore`
- `.vercelignore`
- `assets/cinematic/mote-ops-opening-v3-manifest.json`
- `production/opening-film-v3/generation-prompts.json`
- `tests/opening-film-v3.test.mjs`

## Commit

`dfd9d89 test: lock opening film V3 contract`

## Self-review

The manifest uses the required schema, silent 50-second duration, seven ordered shots, exact initial no-spend generation ledger, and exact generation caps. The prompt pack holds the specified completed reference Element and both source-job IDs, preserves the office and beach wardrobe/identity constraints, uses 16:9/1080p/std/silent parameters for every shot, and carries the no-readable-text-or-logos constraint in every prompt. The only committed files are the five Task 1 implementation files. Existing untracked `package-lock.json` was present before this task and was not changed or staged.

## Concerns

The supplied exact prompt strings initially conflicted with the supplied test's universal literal no-text/no-logos assertion. The coordinating agent explicitly resolved this by appending `No readable generated text or logos.` to the five affected prompts. No remaining concern blocks later tasks.
