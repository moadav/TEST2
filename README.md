# React/Vite Testbed — DEPENDENCY-ADDING Stage 1 scenario (opposite of Nuxt source-only)

A React + Vite SPA, Missing head (no Helmet) -> insertion-eligible. Setup ADDS react-helmet-async, so this
exercises the OPPOSITE mutation mode from the Nuxt source-only testbed:

    Nuxt:   source only,   dependenciesChanged=false, lockfile UNCHANGED
    React:  source + deps, dependenciesChanged=TRUE,  lockfile INTENTIONALLY changed  <- this testbed

## Expected Stage 1 result (dependency-adding criteria)
    Status: PrOpened
    InstallScriptsEnabled: false
    LockfileFallbackUsed: false                 (lockfile is in sync; the change is the INTENDED dep add, not a fallback)
    Changed files: package.json, package-lock.json, src/main.jsx (HelmetProvider mount),
                   src/pages/Home.jsx, src/pages/About.jsx (<Helmet> per page)
    package.json:      CHANGED  (react-helmet-async added)   <- the key difference from Nuxt
    package-lock.json: CHANGED  (intended, because a dependency was added)
    Build: passed
    Post-mutation detector: Ready
    One open setup PR

## Why the lockfile change here is LEGITIMATE (not a fallback)
The lockfile changes because setup ADDED a dependency (react-helmet-async) — dependenciesChanged=true. This is
the intended-mutation branch of the lockfile invariant, distinct from the Nuxt is-odd fallback (where the
lockfile changed because it was stale). Review under dependency-adding criteria: lockfile change is EXPECTED
and correct here.

## Manual PR review (dependency-adding)
- package.json: react-helmet-async added to dependencies (correct version range)
- package-lock.json: updated to include react-helmet-async + its deps (intended)
- src/main.jsx: <HelmetProvider> wraps the app (mounted once)
- src/pages/Home.jsx, About.jsx: <Helmet><title>...</title><meta description></Helmet> added, once per page,
  seeds matched to the correct page (Home->home metadata, About->about metadata)
- PR body: mechanism label is React-true (Helmet/HelmetProvider), NOT "useSeoMeta"; NO duplicated lines;
  NO lockfile-fallback note (this isn't a fallback)
- branch: no node_modules, no dist, no unrelated changes

## Keep the lockfile in sync when committing
Reconciled via double npm install (npm ci accepts it). Do NOT use `npm install --package-lock-only`.
Verify: `rm -rf node_modules && npm ci --dry-run` exits 0.

## Pilot manifest case (for the harness, when you run Stage 0 against it)
    { "id": "react-vite", "websiteId": "<guid>", "repositoryId": <id>,
      "expectedFramework": "React/Vite", "expectedEligibility": "Eligible",
      "expectedDependencyMutation": true, "expectedFinalStatus": "Ready",
      "allowedChangedFiles": ["package.json","package-lock.json","src/main.jsx","src/pages/**"],
      "forbiddenChangedFiles": [], "allowLockfileFallback": false }
