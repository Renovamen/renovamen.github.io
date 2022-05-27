<template>
  <template v-for="key in Object.keys(postMap)" :key="key">
    <h3>{{ key }}</h3>
    <div
      v-for="route in postMap[key]"
      :key="route.path"
      class="font-normal my-1 mx-0.5 flex"
    >
      <div class="w-14 h-6 leading-6 opacity-50 text-sm mr-2">
        {{ formatDate(route.date, false) }}
      </div>
      <router-link
        class="flex-1 !no-underline hover:(!underline)"
        :to="route.path"
      >
        {{ route.title }}
      </router-link>
    </div>
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
  .filter((i: any) => i.meta.layout === "post")
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
