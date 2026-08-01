# Plain Vue Testbed — ABSTENTION test (the negative case)

A plain Vue 3 + Vite SPA — NOT Nuxt, NOT SvelteKit. This is the ABSTENTION test: the detector must recognize
it is unsupported and the gate must REFUSE setup. Unlike every other testbed (which should produce a PR),
this one must produce NOTHING.

## Why this is the sharp test: Nuxt != plain Vue
Plain Vue shares Vue SFCs (.vue files) with Nuxt, so a naive detector could misclassify it as Nuxt and try to
run useSeoMeta setup that doesn't apply. This repo is deliberately, unambiguously plain Vue:
  - NO nuxt dependency, NO nuxt.config
  - explicit vue-router (manual routes) instead of Nuxt's pages/ auto-routing
  - createApp(...).mount('#app') entry (plain Vue), not Nuxt's app
  - @vitejs/plugin-vue, not nuxt

## Expected result — CLEAN ABSTENTION (do NOT expect a PR)
Capability scan:
  - framework is NOT "Nuxt"  (must-not-detect-as-Nuxt — the key assertion)
  - setupEligibility is NOT "Eligible" (NotSupported / Unknown — specific label not required yet, since the
    capability model has no first-class plain-Vue dimension)
  - an explicit reason in the summary (why setup isn't offered)
Setup attempt (if made):
  - the eligibility gate REJECTS with HTTP 400 (not eligible) -> no run, no PR
  - OR, if a run result comes back, it is NOT a wiring run: 0 changed files, no PR
  - openSetupPrUrl is null / absent

## What a FAILURE looks like (the bug this test catches)
  - framework detected as "Nuxt"  -> misclassification
  - setup runs and tries to insert useSeoMeta into .vue files -> WRONG mechanism for plain Vue
  - any changed files / any PR opened
If any of those happen, that's the Nuxt-vs-plain-Vue detector bug your spec warned about.

## Pilot manifest case (abstention shape — different keys from eligible cases)
    { "id": "plain-vue-abstention", "websiteId": "<guid>", "repositoryId": <id>,
      "mustNotDetectFramework": "Nuxt",
      "expectSetupAttempt": false,
      "expectedChangedFileCount": 0 }

## Note on the honest expectation
Do NOT require a specific Unknown-vs-NotSupported label yet — the capability model doesn't have a first-class
Vue dimension. The assertions that matter: not-Nuxt, no setup executed, zero files changed, explicit reason.
