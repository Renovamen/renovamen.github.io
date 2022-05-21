<template>
  <template v-for="key in Object.keys(postMap)" :key="key">
    <h3>{{ key }}</h3>
    <router-link
      v-for="route in postMap[key]"
      :key="route.path"
      class="font-normal my-1 mx-0.5 md:justify-between md:hstack !no-underline"
      :to="route.path"
    >
      <div class="title text-lg lt-md:-mt-4">
        {{ route.title }}
      </div>
      <div class="time opacity-50 text-sm">
        {{ formatDate(route.date) }}
      </div>
    </router-link>
  </template>
</template>

<script setup lang="ts">
import { formatDate } from "~/utils";

export interface Post {
  path: string;
  title: string;
  date: string;
}

const router = useRouter();

const posts: Post[] = router
  .getRoutes()
  .filter((i: any) => i.path.startsWith("/posts") && i.meta.frontmatter)
  .map((i: any) => ({
    path: i.path,
    title: i.meta.frontmatter.title,
    date: i.meta.date
  }))
  .sort((a: any, b: any) => b.date - a.date);

const postMap: Record<string, Post[]> = {};

for (const p of posts) {
  const y = p.date.substring(0, 4);
  postMap[y] ? postMap[y].push(p) : (postMap[y] = [p]);
}
</script>

<style scoped>
a:hover .title {
  @apply text-blue-500;
}

.dark a:hover .title {
  @apply text-blue-300;
}
</style>
