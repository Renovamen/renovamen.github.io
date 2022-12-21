<template>
  <div>
    <span space-x-1 mr-3>
      <span i-uil:tag-alt text="sm c-light" />
      <router-link to="/posts" un-text="!c-light">all</router-link>
      <sup>{{ postNum() }}</sup>
    </span>

    <span v-for="tag in tags" :key="tagMap[tag].path" space-x-1 mr-3>
      <span i-uil:tag-alt text="sm c-light" />
      <router-link :to="tagMap[tag].path" un-text="!c-light">
        {{ tag }}
      </router-link>
      <sup>{{ postNum(tag) }}</sup>
    </span>
  </div>
</template>

<script setup lang="ts">
const { tagMap, tags } = useTags();
const totalPostNum = useBlog()["blogs"].value.length;

const postNum = (tag?: string) => {
  if (!tag) return totalPostNum;
  else return tagMap.value[tag].blogs.length;
};
</script>
