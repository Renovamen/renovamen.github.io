<template>
  <div class="flex flex-wrap">
    <a
      v-for="(item, i) in links"
      :key="`social-${i}-${item.icon}`"
      class="btn font-normal px-3 h-9 mr-1 mb-1"
      :href="item.link"
      :target="isExternal(item.link) ? '_blank' : '_self'"
    >
      <div :class="item.icon" class="w-5 h-5" />
      <div v-if="item.name">{{ item.name }}</div>
    </a>
  </div>
</template>

<script setup lang="ts">
import { isExternal } from "~/utils";

type Item = {
  icon: string;
  link: string;
  name?: string;
  size?: string;
};

defineProps<{ links: Array<Item> }>();
</script>
