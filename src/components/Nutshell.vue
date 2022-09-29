<template>
  <span
    class="text-c-active cursor-pointer hover:underline"
    @click="isOpen = !isOpen"
  >
    <span>{{ text }}</span>
  </span>
  <div v-if="isOpen" text-c my-2 py-2 border="y-1.5 c-dark">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text: string;
}>();

const isOpen = ref(false);
</script>
