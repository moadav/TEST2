<script setup>
import { posts } from '~/utils/posts'

useSeoMeta({
  title: 'From the Blog',
  description: 'Notes on building fast, accessible websites for small teams.'
})
</script>

<template>
  <section>
    <h1>From the Blog</h1>
    <p>Notes on building fast, accessible websites for small teams.</p>
    <ul>
      <li v-for="post in posts" :key="post.slug">
        <NuxtLink :to="`/blog/${post.slug}`">{{ post.title }}</NuxtLink>
      </li>
    </ul>
  </section>
</template>
