import adapter from '@sveltejs/adapter-static';

// adapter-static builds anywhere (no platform detection), so the Optimizy build gate — which runs
// `npm install && npm run build` on the backend, NOT on Vercel/Netlify — passes. Deploy the `build/`
// output to any static host (Cloudflare Pages, Netlify, GitHub Pages, Vercel static).
export default {
  kit: {
    adapter: adapter()
  }
};
