<template>
  <div class="links flex flex-wrap">
    <a
      v-for="(item, i) in links"
      :key="`social-${i}-${item.icon}`"
      class="hstack space-x-1 rounded transition-colors px-3 h-9 mr-1 mb-1"
      bg="gray-100/90 hover:gray-500 dark:gray-50/10"
      un-text="sm hover:white"
      type="button"
      :href="item.link"
      :target="isExternal(item.link) ? '_blank' : '_self'"
    >
      <div :class="item.icon" class="w-5 h-5" />
      <div v-if="item.name">{{ item.name }}</div>
    </a>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import { isExternal } from "~/utils";

type Item = {
  icon: string;
  link: string;
  name?: string;
  size?: string;
};

defineProps({
  links: {
    type: Array as PropType<Array<Item>>,
    required: true
  }
});
</script>
