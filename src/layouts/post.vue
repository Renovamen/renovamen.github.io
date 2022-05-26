<template>
  <Layout>
    <div class="article-header mt-6 mb-8 mx-auto">
      <h1 class="text-3xl font-bold">{{ title }}</h1>
      <p class="opacity-50 mt-2">
        {{ formatDate(date) }}
      </p>
    </div>
    <RouterView />
  </Layout>
</template>

<script setup lang="ts">
import { formatDate } from "~/utils";

const router = useRouter();

const title = computed(() => router.currentRoute.value.meta.frontmatter.title);
const date = computed(() => router.currentRoute.value.meta.date);
</script>

<style scoped>
.article-header {
  max-width: 65ch;
}
</style>
