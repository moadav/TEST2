import { error } from '@sveltejs/kit';
import { posts } from '$lib/posts.js';

export function entries() {
  return posts.map((p) => ({ slug: p.slug }));
}

export function load({ params }) {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) throw error(404, 'Post not found');
  return { post };
}
