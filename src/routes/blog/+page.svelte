<script>
  import { posts } from '$lib/posts.js';
</script>

<h1>From the Blog</h1>
<p>Notes on building fast, accessible websites for small teams.</p>

<ul>
  {#each posts as post}
    <li><a href="/blog/{post.slug}">{post.title}</a></li>
  {/each}
</ul>
