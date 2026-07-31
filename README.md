# Stale-Lockfile Testbed

A React + Vite **insertion-eligible** SEO testbed whose committed `package-lock.json` is deliberately
**out of sync** with `package.json` (`package.json` asks for react-router-dom ^7, the lockfile has 6.x).
This is the exact condition that makes a frozen `npm ci` refuse — used to validate the setup **stale-lockfile
policy** (rollout safety item #1).

## Why it's out of sync
The lockfile was generated for react-router-dom 6.x, then package.json was bumped to ^7.1.0 WITHOUT
reinstalling. So `npm ci` fails with:
    npm error code EUSAGE
    npm error `npm ci` can only install packages when your package.json and package-lock.json ... are in sync.
That EUSAGE signal is what the gate's IsStaleLockfileFailure detector matches (distinct from 404/network).

## The three cases to run (this is the end-to-end proof of item #1)

### Case A — default run (no fallback flag): FAIL CLEARLY
Run setup with SEO_SETUP_ALLOW_LOCKFILE_FALLBACK unset (or != "1").
EXPECT:
  - status: InstallOrBuildFailed
  - the message names the cause specifically: "committed lockfile is out of sync with package.json ...
    npm ci refused" (NOT an opaque "install failed")
  - result flag StaleLockfile = true
  - NO PR opened, lockfile NOT rewritten

### Case B — run WITH fallback enabled: FALL BACK, FLAGGED
Set SEO_SETUP_ALLOW_LOCKFILE_FALLBACK=1, run setup again.
EXPECT:
  - status: PrOpened (permissive retry installed + build passed)
  - result flag LockfileFallbackUsed = true
  - PR body contains the note: "your committed lockfile was out of sync with package.json. Setup updated
    the lockfile to match as part of this PR"
  - the PR's changed files INCLUDE package-lock.json (updated to 7.x) — expected & explained

### Case C — genuinely broken repo (control): FAIL, NO FALLBACK
Temporarily add a nonexistent dependency to package.json (e.g. "no-such-pkg-zzz": "1.0.0") and regenerate
the lockfile so pkg.json and lock AGREE on the bad package:
    npm install --package-lock-only   # (will still write the bad entry)
Then run setup even WITH SEO_SETUP_ALLOW_LOCKFILE_FALLBACK=1.
EXPECT:
  - status: InstallOrBuildFailed (the install fails on E404, NOT a lockfile-sync issue)
  - NO fallback (the gate must only fall back on stale-lockfile, never on network/404/other)
  - proves the detector doesn't over-trigger

## To make it a clean insertion testbed for Nuxt/SvelteKit instead
The same principle applies to any manager — commit a lockfile, then change package.json without reinstalling.
For npm the signal is EUSAGE; pnpm is ERR_PNPM_OUTDATED_LOCKFILE; yarn strings are unverified (confirm on
the runner).

## Detector status
Insertion-eligible React/Vite (no head mechanism -> Missing -> setup would wire Helmet WITHOUT adding a
dependency, so DependenciesChanged=false -> frozen npm ci -> hits the stale lockfile). That's the point:
an insertion setup on a repo with a pre-existing stale lockfile is exactly where item #1 matters.
