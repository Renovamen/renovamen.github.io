<template>
  <template v-for="key in Object.keys(yearToBlog)" :key="key">
    <h3>{{ key }}</h3>
    <div
      v-for="route in yearToBlog[key]"
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
import { formatDate } from "~/utils";

const router = useRouter();
const path = computed(() => router.currentRoute.value.path);

const { tagMap, tags } = useTags();

const tag = computed(() => {
  const tagName = tags.value.find((t) => tagMap.value[t].path === path.value);
  return tagName;
});
const { yearToBlog } = useBlog(tag);
</script>
