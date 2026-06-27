# SvelteKit SEO Testbed

A deliberately SEO-incomplete SvelteKit site, built to exercise **Optimizy Tier 2 setup PRs**
(SvelteKit static-route `<svelte:head>` fill). Every page renders real content but **no document
`<title>` or `<meta name="description">`** — so a crawl flags missing metadata, and the setup path
has something honest to fix.

## What the detector sees
- **Framework:** SvelteKit (`@sveltejs/kit` dependency + `svelte.config.js` + route files)
- **Status:** `Missing` — there is no `<svelte:head><title>` in any `+page.svelte` or `+layout.svelte`,
  so the project is **setup-eligible**. (An unwired config or an `app.html` shell title would not change this.)

## What a setup run does to this repo (verified end-to-end)
Running the SvelteKit Tier 2 setup against this repo at HEAD produces:

| Route            | Action      | Why |
|------------------|-------------|-----|
| `/`              | **wired**   | static `+page.svelte`, seeds title `Northwind Studio` from `<h1>`, description from lead `<p>` |
| `/about`         | **wired**   | static, title `About Northwind Studio` |
| `/services`      | **wired**   | static, title `Services` |
| `/contact`       | **wired**   | static, title `Contact Us` |
| `/blog`          | **wired**   | static; has a `<script>` import, so the head is inserted *after* the script |
| `/pricing`       | *skipped*   | `MissingDescriptionSeed` — has an `<h1>` but no literal lead `<p>`; the mutator won't invent a description |
| `/blog/[slug]`   | *skipped*   | `DynamicRoute` — dynamic routes need data-shape analysis, not auto-wired in v1 |

`+layout.svelte`, `src/app.html`, and `svelte.config.js` are **never touched**. The change set is
source-only (no `package.json`/lockfile edits) — SvelteKit setup is insertion, not installation.
After mutation the project re-detects as **Ready** and `npm run build` passes (adapter-static prerender).

## Run it (locally, the same gate the backend runs)
```bash
npm install
npm run build      # adapter-static prerenders every route to build/
npm run preview    # serve build/ locally
```

## Deploy it (so the crawler has a live target)
`build/` is a static site — host it anywhere: Cloudflare Pages, Netlify, GitHub Pages, or Vercel
(static). adapter-static is used deliberately so the Optimizy build gate — which runs
`npm install && npm run build` on the backend, **not** on a hosting platform — passes too.

## End-to-end test flow
1. Push this repo to a test GitHub repo connected to the Optimizy GitHub App.
2. Deploy `build/` and **crawl the live site** so a Website with open SEO issues exists
   (a connected repo alone has nothing to act on — capability scans are repo-based, runs are crawl-based).
3. Trigger setup as a **dry run first** (`dryRun: true`) → expect `DryRunReady`: it stages the diff and
   opens no PR, so you can eyeball the inserted `<svelte:head>` blocks and the wired/skipped split above.
4. Re-run without `dryRun` → expect `PrOpened` with the 5 wired routes; merge or close before re-running
   (the idempotency guard returns `PrAlreadyOpen` while one is open).

## To make a route un-skippable (if you want more wired routes)
Add a literal lead `<p>` under the `<h1>` in `src/routes/pricing/+page.svelte`, or convert
`/blog/[slug]` to a set of static pages. To make the project *ineligible* (so a run reports
`NotEligible`), add a `<svelte:head><title>…</title></svelte:head>` to `+layout.svelte`.
