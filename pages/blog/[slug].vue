<script setup>
const route = useRoute();
const { data } = await useAsyncData(() => Promise.resolve({ title: route.params.slug.replace(/-/g, " ") }));
useHead({ title: data.value.title + " — Acme Blog" });
</script>
<template><h1>{{ data.title }}</h1></template>
