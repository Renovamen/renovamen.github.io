<template>
  <div>
    <span space-x-1 mr-3>
      <span i-uil:tag-alt text="sm c-light" />
      <router-link :to="allURL" un-text="!c-light">all</router-link>
      <sup>{{ blogNum() }}</sup>
    </span>

    <span v-for="tag in tags" :key="tagMap[tag].path" space-x-1 mr-3>
      <span i-uil:tag-alt text="sm c-light" />
      <router-link :to="tagMap[tag].path" un-text="!c-light">
        {{ tag }}
      </router-link>
      <sup>{{ blogNum(tag) }}</sup>
    </span>
  </div>
</template>

<script setup lang="ts">
const { tagMap, tags } = useTags();
const lang = useLang();

const totalblogNum = useBlog(lang)["blogs"].value.length;
const allURL = computed(() =>
  lang.value === "en" ? "/posts" : `/posts/${lang.value}`
);

const blogNum = (tag?: string) => {
  if (!tag) return totalblogNum;
  else return tagMap.value[tag].blogs.length;
};
</script>
