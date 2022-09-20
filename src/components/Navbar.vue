<template>
  <header
    ref="navbar"
    class="z-40 w-full h-14 flex justify-between items-center bg-c font-ui"
    p="x-4 md:x-5"
    :class="[
      isFixed &&
        'fixed -top-14 left-0 transition duration-300 border-b border-c',
      isVisible && 'translate-y-full shadow-nav',
      !isFixed && !isVisible && 'absolute top-0 left-0'
    ]"
  >
    <router-link class="font-bold" un-text="c-light hover:c-dark" to="/">
      <span text="lg">hi@zxh</span>
      <div i-fa6-solid:angle-right class="prompt inline-block" />
      <span class="blink">_</span>
    </router-link>
    <nav class="flex space-x-4">
      <router-link to="/projects" title="Projects" class="nav-item">
        <div i-ph:rocket-launch-duotone class="md:hidden" />
        <span class="lt-md:hidden">Projects</span>
      </router-link>

      <router-link to="/posts" title="Blog" class="nav-item">
        <div i-majesticons:paper-fold-text-line class="md:hidden" />
        <span class="lt-md:hidden">Blog</span>
      </router-link>

      <button nav-item title="Toggle dark" @click="toggleDark()">
        <div i="carbon-sun dark:carbon-moon" />
      </button>

      <slot />
    </nav>
  </header>
</template>

<script setup lang="ts">
import { isClient } from "@renovamen/utils";
import { toggleDark } from "~/composables/dark";

const navbar = ref<HTMLElement | null>(null);
const isFixed = ref(false);
const isVisible = ref(false);

if (isClient) {
  const { y, directions } = useScroll(document);

  watch(y, () => {
    if (directions.top) {
      // scrolling up
      if (y.value > 0 && isFixed.value) isVisible.value = true;
      else {
        isVisible.value = false;
        isFixed.value = false;
      }
    } else if (directions.bottom) {
      // scrolling down
      isVisible.value = false;
      if (navbar.value && y.value > navbar.value!.offsetHeight)
        isFixed.value = true;
    }
  });
}
</script>

<style scoped>
.prompt {
  vertical-align: -0.2em;
  font-size: 0.85em;
}

.blink {
  animation: blinker 1s none infinite;
}

@keyframes blinker {
  50% {
    opacity: 0;
  }
}
</style>
