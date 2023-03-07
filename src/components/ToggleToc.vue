<template>
  <button v-if="isToc" class="nav-item ml-4" title="Toggle toc" @click="toggleToc">
    <div v-if="isTocOpen" i-ri:menu-3-line />
    <div v-else i-ri:menu-fold-line />
  </button>
</template>

<script setup lang="ts">
const { width } = useWindowSize();
const isTocOpen = ref(width.value > 1200);
const isToc = ref(false);

onMounted(() => {
  const toc = document.querySelector(".table-of-contents");
  isToc.value = toc ? true : false;
  handleClass();
});

const toggleToc = () => {
  isTocOpen.value = !isTocOpen.value;
  handleClass();
};

const handleClass = () => {
  const html = document.querySelector("html") as HTMLElement;
  if (isTocOpen.value) html.classList.add("toc-open");
  else html.classList.remove("toc-open");
};
</script>
