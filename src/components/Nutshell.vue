<template>
  <span
    class="text-c-active cursor-pointer hover:underline"
    @click="isOpen = !isOpen"
  >
    {{ text }}
  </span>
  <div v-show="isOpen" text-c-light my-2 py-2 border="y c-dark">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text: string;
}>();

const isOpen = ref(false);
</script>
