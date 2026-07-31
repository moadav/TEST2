# React SEO Testbed

A deliberately SEO-incomplete **React + Vite** SPA for testing **Optimizy Tier 2 setup PRs** (Helmet-style
wiring). It validates the build gate's **permissive-install** path — React setup INSTALLS react-helmet-async,
so its PR legitimately changes package.json + package-lock.json (unlike the insertion frameworks).

## Routing shape matters (this is what the classifier resolves)
The React setup route classifier resolves each `<Route element={<Home/>}>` by:
1. finding the import — `import Home from './pages/Home'` — in the router file, then
2. resolving that specifier to a file (appending .tsx/.jsx/.ts/.js).

So this repo uses **split page files** (`src/pages/*.jsx`) with **extensionless imports**
(`import Home from './pages/Home'`, NOT `'./pages/Home.jsx'`). Two things break resolution and make the
mutator skip every route with "no component file resolved":
- writing the extension in the import (`'./pages/Home.jsx'`) — the resolver appends its own, so it looks for
  `Home.jsx.jsx` and fails;
- colocating components in App.jsx with no import — there's no import for the resolver to follow.

## What the detector sees
- **Framework:** React/Vite (react + vite + a `createRoot(...)` entry in src/main.jsx)
- **Status:** `Missing` — no react-helmet(-async) dependency, no `<Helmet>`, no head manager/custom SEO
  component, and index.html has no `<title>`. So the project is **setup-eligible**.

## What a setup run does
- adds `react-helmet-async` to package.json (a real dependency install),
- mounts one `<HelmetProvider>` at the render entry (src/main.jsx),
- adds a `<Helmet>` with title/description to each resolved page component, seeded from its `<h1>`/`<p>`,
- runs the build gate, which — because dependencies changed — uses a **permissive install**, so
  package-lock.json updates to match.

Expected PR change set: **package.json + package-lock.json + src/main.jsx + src/pages/{Home,About,Services,Contact}.jsx**.
The lockfile change here is CORRECT and intended (contrast: SvelteKit/Nuxt PRs must NOT change the lockfile).

## Run / deploy / test
```bash
npm install && npm run build && npm run preview
```
Deploy `dist/` to any static host, crawl the live URL so a Website with open issues exists, then dry-run
(`dryRun: true` → DryRunReady) before the real run.

## The contrast this validates
| Framework | Setup type   | Lockfile in PR?    | Gate install |
|-----------|--------------|--------------------|--------------|
| Nuxt      | insertion    | no                 | frozen (npm ci) |
| SvelteKit | insertion    | no                 | frozen |
| React     | installation | **yes** (intended) | permissive (npm install) |
