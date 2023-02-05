<template>
  <div class="flip-image perspective-600">
    <img class="rounded duration-800 !my-0" :src="src" :alt="alt" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  src: string;
  alt?: string;
}>();
</script>

<style scoped>
.flip-image:hover img {
  @apply rotate-y-180;
}
</style>
