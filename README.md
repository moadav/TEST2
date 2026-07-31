# React SEO Testbed (colocated routes)

A deliberately SEO-incomplete **React + Vite** SPA for testing **Optimizy Tier 2 setup PRs**
(Helmet-style wiring). It validates the build gate's **permissive-install** path — React setup INSTALLS
react-helmet-async, so its PR legitimately changes package.json + package-lock.json (unlike SvelteKit/Nuxt).

## Important: routes are COLOCATED in src/App.jsx
The React setup route classifier resolves `<Route element={<X/>}>` to the component's definition **in the
same file**. So the page components (Home/About/Services/Contact) are defined IN src/App.jsx, not imported
from separate files. A split-file structure (pages/About.jsx imported into App.jsx) leaves every route's
component file unresolved and the mutator skips them all — colocated is what the classifier resolves.

## What the detector sees
- **Framework:** React/Vite (react + vite + a `createRoot(...)` entry in src/main.jsx)
- **Status:** `Missing` — no react-helmet(-async) dependency, no `<Helmet>`, no head manager, no custom SEO
  component, and index.html has no `<title>`. So the project is **setup-eligible**.

## What a setup run does
- adds `react-helmet-async` to package.json (a real dependency install),
- mounts one `<HelmetProvider>` at the render entry,
- adds a `<Helmet>` with title/description to each route component in App.jsx, seeded from its `<h1>`/`<p>`,
- runs the build gate, which — because dependencies changed — uses a **permissive install**, so
  package-lock.json updates to match.

Expected PR change set: **package.json + package-lock.json + src/main.jsx + src/App.jsx**. The lockfile change
here is CORRECT and intended (contrast: SvelteKit/Nuxt PRs must NOT change the lockfile).

## Run / deploy / test
```bash
npm install && npm run build && npm run preview
```
Deploy `dist/` to any static host, crawl the live URL so a Website with open issues exists, then dry-run
(`dryRun: true` → DryRunReady) before the real run.

## The contrast this validates
| Framework | Setup type   | Lockfile in PR? | Gate install |
|-----------|--------------|-----------------|--------------|
| Nuxt      | insertion    | no              | frozen (npm ci) |
| SvelteKit | insertion    | no              | frozen |
| React     | installation | **yes** (intended) | permissive (npm install) |
