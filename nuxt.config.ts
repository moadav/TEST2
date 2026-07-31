// No app.head.title on purpose: the site renders real content but no document <title>, so a crawl flags
// missing metadata and the Tier 2 setup path has something honest to fix. crawlLinks lets `nuxt generate`
// prerender the blog posts by following links from the blog index (for static hosting).
export default defineNuxtConfig({
  ssr: true,
  nitro: { prerender: { crawlLinks: true, routes: ['/'] } }
})
