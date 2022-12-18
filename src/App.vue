<script setup lang="ts">
import { isClient } from "@renovamen/utils";
import { title, description, themeLight, themeDark } from "~/meta";

// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: title,
  meta: [
    { name: "description", content: description },
    {
      name: "theme-color",
      content: computed(() => (isDark.value ? themeDark : themeLight))
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
