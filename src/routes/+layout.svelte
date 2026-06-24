<script>
  import { page } from '$app/stores';
</script>
<svelte:head><title>{$page.data.title}</title></svelte:head>
<nav><a href="/">Home</a> <a href="/about">About</a></nav>
<slot />
