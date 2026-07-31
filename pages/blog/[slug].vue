<script setup>
import { posts } from '~/utils/posts'
const route = useRoute()
const post = posts.find((p) => p.slug === route.params.slug)
</script>

<template>
  <article v-if="post">
    <h1>{{ post.title }}</h1>
    <p>{{ post.body }}</p>
  </article>
</template>
