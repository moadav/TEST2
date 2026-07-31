# React SEO Testbed

A deliberately SEO-incomplete **React + Vite** SPA, built to exercise **Optimizy Tier 2 setup PRs**
(react-helmet-async wiring) — and specifically to validate the build gate's **permissive-install** path.

## Why this repo exists
Unlike the SvelteKit/Nuxt testbeds (which are *insertion* frameworks — setup adds source only), **React
setup INSTALLS a dependency** (`react-helmet-async`) and mounts a `HelmetProvider`. So a React setup PR
legitimately changes `package.json` AND `package-lock.json`. This testbed confirms the new frozen-by-default
build gate correctly detects the intentional dependency change and uses a permissive install (so the lockfile
updates), rather than a frozen `npm ci` that would fail.

## What the detector sees
- **Framework:** React/Vite (`react` + `vite`, and a `createRoot(...)` client entry in `src/main.jsx` that
  maps it as a real app, not a component library)
- **Status:** `Missing` — there is NO head mechanism anywhere: no `react-helmet`(-async) dependency, no
  `<Helmet>`, no head manager, no custom SEO component, no `document.head` mutation, and `index.html` has no
  `<title>`. So the project is **setup-eligible**.

## What a setup run does to this repo
Running React Tier 2 setup against this repo at HEAD will:
- add `react-helmet-async` to `package.json` (a real dependency install),
- mount a single `<HelmetProvider>` at the app root,
- add a `<Helmet>` with title/description to each static page, seeded from the page's own `<h1>`/`<p>`,
- run the build gate, which (because dependencies changed) uses a **permissive install** so
  `package-lock.json` updates to match — and BOTH `package.json` and `package-lock.json` are intentionally
  part of the PR.

Expected PR change set: `package.json`, `package-lock.json`, `src/main.jsx` (HelmetProvider), and the page
files that got a `<Helmet>`. **The lockfile change here is correct and intended** — contrast with SvelteKit/
Nuxt PRs, where the lockfile must NOT change.

## Run it locally (the same gate the backend runs)
```bash
npm install
npm run build      # vite build
npm run preview
```

## Deploy it (so the crawler has a live target)
`dist/` is a static SPA — host it anywhere (Netlify, Cloudflare Pages, GitHub Pages, Vercel static). It's a
client-rendered SPA, so a crawler that executes JS sees the (currently title-less) pages; that's the SEO
issue the setup PR fixes by wiring Helmet.

## End-to-end test flow
1. Push to a test GitHub repo connected to the Optimizy GitHub App.
2. Deploy `dist/` and **crawl the live site** so a Website with open SEO issues exists.
3. Dry run first (`dryRun: true`) → `DryRunReady`; eyeball the staged diff (Helmet wiring + the dependency add).
4. Real run → `PrOpened`. **Confirm the PR includes `package.json` + `package-lock.json`** (intended) plus
   the Helmet source edits — this is the permissive-install path working.

## The contrast this validates
| Framework  | Setup type  | Lockfile in PR? | Gate install |
|------------|-------------|-----------------|--------------|
| Nuxt       | insertion   | **no** (must stay clean) | frozen (`npm ci`) |
| SvelteKit  | insertion   | **no** | frozen |
| React      | installation| **yes** (intended) | permissive (`npm install`) |
