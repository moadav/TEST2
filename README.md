# Stale-Lockfile Testbed (Nuxt — the CORRECT shape for item #1)

A **Nuxt** (insertion-framework) SEO testbed whose committed `package-lock.json` is deliberately out of sync
with `package.json` (package.json asks for vue ^2.7, lockfile has 3.5.x). This is the RIGHT shape to test the
stale-lockfile policy, because:

- Nuxt setup INSERTS source (useSeoMeta) and adds NO dependency -> DependenciesChanged = false
  -> the gate uses a FROZEN install (npm ci)
- a frozen npm ci on a stale lockfile REFUSES (EUSAGE) -> this is what item #1's policy handles.

## Why NOT React for this test
React setup ADDS react-helmet-async -> DependenciesChanged = true -> PERMISSIVE install (npm install), which
does NOT validate against the lockfile and silently resolves the tree. So a React run never hits the frozen
refusal and never exercises the stale-lockfile policy. Only insertion frameworks (Nuxt/SvelteKit) do.

## The three cases

### Case A — default (no fallback flag): FAIL CLEARLY
SEO_SETUP_ALLOW_LOCKFILE_FALLBACK unset. Run Nuxt setup.
EXPECT: InstallOrBuildFailed, message names "committed lockfile is out of sync with package.json ... npm ci
refused" (not opaque), StaleLockfile=true, no PR, lockfile not rewritten.

### Case B — fallback enabled: FALL BACK, FLAGGED
SEO_SETUP_ALLOW_LOCKFILE_FALLBACK=1. Run again.
EXPECT: PrOpened, LockfileFallbackUsed=true, PR body contains the "was out of sync ... updated the lockfile"
note, changed files INCLUDE package-lock.json (now vue 2.x — well, whatever resolves) plus the useSeoMeta
source edits.

### Case C — control (genuinely broken, not stale): FAIL, NO FALLBACK
Add a nonexistent dep AND regenerate the lockfile so pkg.json + lock AGREE on the bad package (so it's an
E404, not a sync problem). Run even WITH the fallback flag.
EXPECT: InstallOrBuildFailed on E404, NO fallback (proves the detector only fires on stale-lockfile, never on
network/404).

## Keep it stale when you commit
Do NOT run `npm install` before committing — that would sync the lockfile and destroy the test condition.
Verify after push:  git show HEAD:package-lock.json | grep -A2 '"node_modules/vue"' | grep version
Should show 3.5.x (stale vs package.json's ^2.7). If it shows 2.x, it got regenerated — re-stale it.

## Note
npm ci stale signal = EUSAGE + "in sync" (verified). This testbed uses npm; the same policy applies to
pnpm (ERR_PNPM_OUTDATED_LOCKFILE) and yarn (strings unverified — confirm on runner).
