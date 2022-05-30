<template>
  <header
    ref="navbar"
    class="z-40 w-full h-14 flex justify-between items-center px-4 md:px-5"
    bg="white dark:gray-700"
    :class="[
      isFixed &&
        'fixed -top-14 left-0 transition duration-300 border-b border-gray-200 dark:border-gray-600',
      isVisible && 'translate-y-full nav-shadow',
      !isFixed && !isVisible && 'absolute top-0 left-0'
    ]"
  >
    <router-link
      font="bold"
      un-text="lg gray-600 hover:black dark:(gray-300 hover:white)"
      to="/"
    >
      $ cd /home/
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

      <button
        class="nav-item !outline-none"
        title="Toggle dark"
        @click="toggleDark()"
      >
        <div i="carbon-sun dark:carbon-moon" />
      </button>

      <slot />
    </nav>
  </header>
</template>

<script setup lang="ts">
import { toggleDark } from "~/composables/dark";
import { isClient } from "~/utils";

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
