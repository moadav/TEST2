# Monorepo app-path test repo

A two-app monorepo for confirming `RepositoryAppPath` end to end. The two apps are deliberately
**co-equal** so `AppRootLocator` refuses to guess — which is the only situation where setting an app
path changes the outcome. (A single nested app would be auto-discovered, so it wouldn't prove
anything.)

```
package.json            workspace root, no framework deps   → score 0 (not an app)
apps/web/               Astro marketing site                → score 4, depth 2
apps/admin/             SvelteKit dashboard                 → score 4, depth 2  (ties with web)
```

Confirmed via locator simulation:

| configuredAppPath | Resolve result |
|---|---|
| `null` (none) | **Ambiguous** → `[apps/admin, apps/web]` |
| `apps/web` | **Resolved** → `apps/web` |
| `apps/admin` | **Resolved** → `apps/admin` |
| `apps/nope` (typo) | falls through → Ambiguous (graceful) |

## Steps

1. **Push** this repo to a test repo your test GitHub App can see (e.g. `moadav/MONOREPO`), then
   enable it so it shows up in the repo list. Note its `repositoryId`.

2. **Scan WITHOUT an app path.** Run the capability check. Expect:
   - `status: Missing` (or `Unknown`) — the root has no framework, and the two apps are ambiguous so
     the scan falls back to the root.
   - a warning like: *"Multiple frontend apps detected (apps/admin, apps/web); configure an app path
     so the right one is classified."*
   - `support.existingValueFixes` will NOT be `Supported` (it's the fallback/root result).

3. **Set the app path:**
   ```
   PUT /api/github/repositories/{repositoryId}/app-path
   Content-Type: application/json

   { "appPath": "apps/web" }
   ```
   Expect `{ "appPath": "apps/web", "rescanRequired": true }`.

4. **Re-run the capability check.** Expect the flip:
   - `status: Ready`
   - `framework: Astro`
   - `support.existingValueFixes: Supported`
   - `fromCache: false` (the endpoint's cache-invalidation forced a fresh scan)

   This single flip proves the whole chain: path persisted → cache invalidated → scan resolved into
   `apps/web` → Astro provider routed.

5. **(Optional) Point it at the other app** to confirm routing through the configured path:
   ```
   { "appPath": "apps/admin" }
   ```
   Re-run → `framework: SvelteKit`, `status: Ready`, `existingValueFixes: Supported`.

6. **(Optional) Typo test** — set `{ "appPath": "apps/nope" }`, re-run. The path doesn't exist, so
   the locator falls back to discovery → Ambiguous again (status returns to Missing). Confirms a bad
   path degrades gracefully instead of breaking the scan.

## What each failure would mean

- **Still `Missing` after step 4, `fromCache: true`** → cache not invalidated (the `ExecuteDeleteAsync`
  didn't run or didn't match). Check the endpoint fired and `rescanRequired` was true.
- **Still `Missing`, `fromCache: false`** → the scan ran but didn't resolve into `apps/web`. Either the
  `AppPath` write was lost (migration not applied — verify the column exists) or the call-site edit
  (`configuredAppPath: repo.AppPath`) didn't land in the scan service.
- **`Astro/Partial` instead of `Ready`** → resolved into the app correctly, but detection read it as
  partial; check `apps/web/src/pages/index.astro` still has its `<title>`.

## Live-serving note

You don't need to serve this for the capability scan — detection works on the cloned source. If you
also want to crawl it, `apps/web` is Astro (`npm i && npm run build` → static output) and `apps/admin`
is SvelteKit (SSR, needs `npm run build && npm run preview`). But the app-path confirmation above is
purely the capability scan, which needs no runtime.
