<template>
  <template v-for="key in Object.keys(blogMap)" :key="key">
    <h3>{{ key }}</h3>
    <div
      v-for="route in blogMap[key]"
      :key="route.path"
      class="font-normal my-1 mx-0.5 flex"
    >
      <div class="w-14 h-6 leading-6 opacity-50 text-sm mr-2">
        {{ formatDate(route.date, false) }}
      </div>
      <router-link class="flex-1 !text-c" :to="route.path">
        {{ route.title }}
      </router-link>
    </div>
  </template>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { formatDate } from "~/utils";

type Blog = {
  path: string;
  title: string;
  date: string;
};

const router = useRouter();

const blogs: Blog[] = router
  .getRoutes()
  .filter((i: any) => i.meta.layout === "post")
  .map(
    (i: any): Blog => ({
      path: i.path,
      title: i.meta.frontmatter.title,
      date: i.meta.date
    })
  )
  .sort((a: Blog, b: Blog) => dayjs(b.date).unix() - dayjs(a.date).unix());

const blogMap: Record<string, Blog[]> = {};

for (const b of blogs) {
  const y = b.date.substring(0, 4);
  blogMap[y] ? blogMap[y].push(b) : (blogMap[y] = [b]);
}
</script>
