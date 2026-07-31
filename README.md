# Nuxt SEO Testbed

A deliberately SEO-incomplete **Nuxt 3** site, built to exercise **Optimizy Tier 2 setup PRs**
(Nuxt static-page `useSeoMeta` fill). Every page renders real content but **no document `<title>` or
`<meta name="description">`** — so a crawl flags missing metadata, and the setup path has something honest to fix.

## What the detector sees
- **Framework:** Nuxt (`nuxt` dependency + `nuxt.config.ts` + `.vue` pages)
- **Status:** `Missing` — no `useHead`/`useSeoMeta` call carries a title in any page/layout/app file, and there
  is no `app.head.title` in `nuxt.config.ts`, so the project is **setup-eligible**.

## What a setup run does to this repo (verified end-to-end)
Running the Nuxt Tier 2 setup against this repo at HEAD produces:

| Route          | Action    | Why |
|----------------|-----------|-----|
| `/`            | **wired** | static page; seeds title `Northwind Studio` from `<h1>`, description from lead `<p>` |
| `/about`       | **wired** | static, title `About Northwind Studio` |
| `/services`    | **wired** | static, title `Services` |
| `/contact`     | **wired** | static, title `Contact Us` |
| `/blog`        | **wired** | static; has a `<script setup>`, so `useSeoMeta(...)` is inserted **inside** it before `</script>` |
| `/pricing`     | *skipped* | `MissingDescriptionSeed` — has an `<h1>` but no literal lead `<p>`; the mutator won't invent a description |
| `/blog/[slug]` | *skipped* | `DynamicRoute` — dynamic routes need data-shape analysis, not auto-wired in v1 |

`app.vue`, `layouts/default.vue`, and `nuxt.config.ts` are **never touched** (verified byte-identical). The
change set is source-only — no `package.json`/lockfile edits, no import lines (Nuxt auto-imports `useSeoMeta`).
After mutation the project re-detects as **Ready** and `nuxt build` passes.

## The three insertion shapes this repo covers
- **markup-first** (`/`, `/about`, `/services`, `/contact`): no script block → a new `<script setup>` is added before `<template>`.
- **existing `<script setup>`** (`/blog`): the `useSeoMeta(...)` call is inserted inside the existing block, before `</script>` — existing logic untouched.
- *(A normal-`<script>`-only page would get a SEPARATE `<script setup>` added beside it; none is included here, but the mutator handles it — see the `nuxt-existing-normal-script` acceptance fixture.)*

## Run it locally (the same gate the backend runs)
```bash
npm install
npm run build      # nuxt build — the Optimizy build gate runs this
npm run preview    # serve the built app locally
```

## Deploy it (so the crawler has a live target)
This is a standard Nuxt 3 app. Two options:
- **SSR / node or edge host** (recommended, most faithful to what a crawler sees): deploy to Vercel, Netlify,
  Cloudflare, or any Node host — Nuxt auto-detects the preset. Pages are server-rendered with no `<title>`,
  which is exactly the SEO issue.
- **Static**: `npm run generate` prerenders to `.output/public/` (crawlLinks in `nuxt.config.ts` follows links
  from `/` so the blog posts prerender too). Host the folder anywhere static.

## End-to-end test flow
1. Push this repo to a test GitHub repo connected to the Optimizy GitHub App.
2. Deploy it and **crawl the live site** so a Website with open SEO issues exists
   (a connected repo alone has nothing to act on — capability scans are repo-based, runs are crawl-based).
3. Trigger setup as a **dry run first** (`dryRun: true`) → expect `DryRunReady`: it stages the diff and opens
   no PR, so you can eyeball the five inserted `useSeoMeta(...)` blocks and the wired/skipped split above.
4. Re-run without `dryRun` → expect `PrOpened` with the 5 wired routes; merge or close before re-running
   (the idempotency guard returns `PrAlreadyOpen` while one is open).

## To change what wires
- Give `/pricing` a literal lead `<p>` under its `<h1>` → it becomes wireable.
- To make the project *ineligible* (a run reports `NotEligible`), add `app: { head: { title: '…' } }` to
  `nuxt.config.ts`, or a `useSeoMeta({ title: '…' })` to `app.vue`.
