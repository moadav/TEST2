# Clean Nuxt Testbed — SOURCE-ONLY Stage 1 scenario

A Nuxt insertion testbed with an IN-SYNC lockfile. This is the CLEAN source-only scenario:
- Missing head (no useHead/useSeoMeta) -> setup-eligible for insertion
- lockfile matches package.json -> frozen `npm ci` SUCCEEDS -> NO fallback -> source files only

## Expected Stage 1 result (source-only criteria — do NOT mix with the is-odd fallback criteria)
    Status: PrOpened
    InstallScriptsEnabled: false
    LockfileFallbackUsed: FALSE          <- the key difference from the is-odd repo
    Changed files: pages/index.vue, pages/about.vue ONLY
    package.json:      UNCHANGED
    package-lock.json: UNCHANGED          <- NOT in the diff (no fallback)
    Build: passed
    Post-mutation detector: Ready
    One open setup PR

## Keeping it in sync when you commit
The lockfile was reconciled (double npm install) so `npm ci` accepts it. Do NOT regenerate it with
`npm install --package-lock-only` (that produces a lock npm ci rejects). If you edit deps, run
`npm install` twice to reconcile, then verify: `rm -rf node_modules && npm ci --dry-run` exits 0.

## Manual PR review (source-only)
- <script setup> placed correctly in each .vue; useSeoMeta once per page
- title/description seeds match the page (index -> home metadata, about -> about metadata)
- nuxt.config.ts, package.json, package-lock.json ALL untouched
- PR body says "page-local useSeoMeta"; wired routes: /, /about
- branch has no node_modules / build output / unrelated changes
