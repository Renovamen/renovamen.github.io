<template>
  <Layout>
    <div class="article-header mt-6 mb-8 mx-auto">
      <h1 class="text-3xl font-bold">{{ title }}</h1>
      <p class="opacity-50 mt-2">
        {{ formatDate(date) }} · {{ readingTime }} min
      </p>
    </div>
    <RouterView />
  </Layout>
</template>

<script setup lang="ts">
import { formatDate } from "~/utils";

const router = useRouter();

const meta = router.currentRoute.value.meta;

const title = meta.frontmatter.title;
const date = meta.date;
const readingTime = meta.readingTime.minutes;
</script>

<style scoped>
.article-header {
  max-width: 65ch;
}
</style>
