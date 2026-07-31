<template>
  <div>
    <nav>
      <NuxtLink to="/">Home</NuxtLink>
      <NuxtLink to="/about">About</NuxtLink>
      <NuxtLink to="/services">Services</NuxtLink>
      <NuxtLink to="/pricing">Pricing</NuxtLink>
      <NuxtLink to="/contact">Contact</NuxtLink>
      <NuxtLink to="/blog">Blog</NuxtLink>
    </nav>
    <main>
      <slot />
    </main>
    <footer><small>Northwind Studio — a Nuxt SEO test site.</small></footer>
  </div>
</template>
