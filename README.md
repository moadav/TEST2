# next-test-app

A minimal but complete Next.js 14 (App Router) app for testing the SEO capability scan.

It deliberately exercises both native head mechanisms:
- `app/layout.tsx` and `app/about/page.tsx` use static `export const metadata`
- `app/blog/[slug]/page.tsx` uses dynamic `export async function generateMetadata`

## Expected capability scan result
- framework: `Next.js`
- status: `Ready` (metadata mechanisms present and setting title/description)
- setupEligibility: `NotEligible` (route setup isn't supported for Next.js — by design)
- support: existingValueFixes `Supported`, coverageAudit `Partial`, routeHeadSetup `NotSupported`

## To test the "Missing" path
Delete the `metadata` exports from `app/layout.tsx` and `app/about/page.tsx` and the
`generateMetadata` from the blog route, then re-scan: status should become `Missing`,
but setupEligibility should STILL be `NotEligible` (proving setup is gated off for Next.js,
even when the app has no SEO).

## Push it
```
git init && git add . && git commit -m "next test app"
git branch -M main
git remote add origin https://github.com/<you>/next-test-app.git
git push -u origin main
```
