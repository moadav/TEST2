# SvelteKit Testbed — SOURCE-ONLY Stage 1 scenario (third mechanism: <svelte:head>)

SvelteKit with static routes, Missing head (no <svelte:head>) -> insertion-eligible. Setup inserts
<svelte:head> with title/description into +page.svelte files. Source-only mode, same as Nuxt:

    dependenciesChanged = false
    lockfile UNCHANGED
    LockfileFallbackUsed = false

## Expected Stage 1 result (source-only criteria — same family as Nuxt, NOT the React dep-adding mode)
    Status: PrOpened
    InstallScriptsEnabled: false
    LockfileFallbackUsed: false
    Changed files: src/routes/+page.svelte, src/routes/about/+page.svelte ONLY
    package.json / package-lock.json: UNCHANGED
    Build: passed
    Post-mutation detector: Ready
    One open setup PR

## Manual PR review (SvelteKit source-only)
- <svelte:head> inserted into each +page.svelte (correct placement, valid Svelte 4 markup)
- <title> and <meta name="description"> present, once per page
- seeds match the page (/ -> home metadata, /about -> about metadata)
- +layout.svelte, svelte.config.js, vite.config.js, app.html UNTOUCHED
- package.json / package-lock.json UNCHANGED (no dep added — source only)
- PR body: mechanism label is SvelteKit-true (<svelte:head>), NOT useSeoMeta or Helmet; no duplicated lines
- branch: no node_modules, no .svelte-kit, no build output, no unrelated changes

## Version notes (testbed was aligned to these — matters for a clean build)
- svelte@4 (uses <slot/> + export let, NOT $props()/{@render} runes — those are Svelte 5)
- the sveltekit() Vite plugin imports from '@sveltejs/kit/vite' (NOT @sveltejs/vite-plugin-svelte)
- lockfile reconciled via double npm install (npm ci accepts it). Don't use --package-lock-only.

## Pilot manifest case
    { "id": "sveltekit-static", "websiteId": "<guid>", "repositoryId": <id>,
      "expectedFramework": "SvelteKit", "expectedEligibility": "Eligible",
      "expectedDependencyMutation": false, "expectedFinalStatus": "Ready",
      "allowedChangedFiles": ["src/routes/**"],
      "forbiddenChangedFiles": ["package.json","package-lock.json","pnpm-lock.yaml","yarn.lock"],
      "allowLockfileFallback": false }
