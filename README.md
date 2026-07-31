# Stale-Lockfile Testbed (Nuxt) — build-safe stale target

Nuxt insertion testbed with a committed lockfile deliberately out of sync with package.json. Stale is created
by ADDING a trivial, build-irrelevant dependency (is-odd) to package.json WITHOUT updating the lockfile — so
`npm ci` refuses ("Missing: is-odd from lock file"), but the fallback `npm install` resolves cleanly and the
Nuxt build is unaffected (vue stays 3.x, nothing imports is-odd).

## Why this target (not a vue downgrade)
An earlier version made it stale by asking for vue ^2.7 — that made `npm ci` refuse correctly, but the
fallback then installed Vue 2, which Nuxt 3 can't build (`unctx`/getContext error). That conflated the
stale-lockfile policy with a build-compatibility failure. Adding a harmless dep keeps the test focused purely
on the lockfile policy.

## Cases (insertion framework -> frozen npm ci -> hits the policy)
- A (no flag): InstallOrBuildFailed, clear "out of sync" message, StaleLockfile=true, no PR. [CONFIRMED]
- B (SEO_SETUP_ALLOW_LOCKFILE_FALLBACK=1): PrOpened, lockfileFallbackUsed=true, PR body note, changed files
  include package-lock.json (now with is-odd) + the two useSeoMeta .vue edits, build passes.
- C (control): add a NONEXISTENT dep and regenerate the lockfile so they AGREE (bad pkg in both) -> npm ci
  fails on E404, NOT stale -> no fallback even with the flag. Proves the detector doesn't over-trigger.

## Keep stale on commit
Do not `npm install` before committing. Verify: `git show HEAD:package-lock.json | grep -c is-odd` -> 0 (lock
lacks is-odd = stale). package.json HAS is-odd.
