<script setup lang="ts">
import { isClient } from "@renovamen/utils";

// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: "Xiaohan Zou",
  meta: [
    { name: "description", content: "A dragon lost in human world." },
    {
      name: "theme-color",
      content: computed(() => (isDark.value ? "#374151" : "#ffffff"))
    }
  ]
});

// Scroll to top after route change
const route = useRoute();

watch(
  () => route.path,
  () => isClient && window.scrollTo({ top: 0 })
);
</script>

<template>
  <RouterView />
</template>
