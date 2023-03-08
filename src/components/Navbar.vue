<template>
  <header
    ref="navbar"
    class="z-40 w-full h-14 hstack justify-between bg-c font-ui"
    p="x-4 md:x-5"
    :class="[
      isFixed && 'fixed -top-14 left-0 transition duration-300 border-b border-c',
      isVisible && 'translate-y-full shadow-nav',
      !isFixed && !isVisible && 'absolute top-0 left-0'
    ]"
  >
    <a class="font-bold" un-text="c-light hover:c-dark" href="/">
      <span text="lg">hi@zxh</span>
      <div i-fa6-solid:angle-right class="prompt inline-block" />
      <span class="blink">_</span>
    </a>

    <nav hstack space-x-4>
      <a nav-item href="/projects" title="Projects">
        <div i-ph:rocket-launch-duotone md:hidden />
        <span class="lt-md:hidden" :class="[activePage === 'projects' && 'active']">
          Projects
        </span>
      </a>

      <a nav-item href="/posts" title="Blog">
        <div i-majesticons:pencil-line md:hidden />
        <span class="lt-md:hidden" :class="[activePage === 'posts' && 'active']">
          Blog
        </span>
      </a>

      <a nav-item href="/search" title="Search">
        <span i-uil:search />
      </a>

      <a nav-item href="/rss.xml" title="RSS" target="_blank" rel="noopener noreferrer">
        <div i-jam:rss-feed />
      </a>

      <button nav-item title="Toggle dark" @click="toggleDark()">
        <div i="carbon-sun dark:carbon-moon" />
      </button>

      <slot />
    </nav>
  </header>
</template>

<script setup lang="ts">
import { toggleDark } from "@composables/dark";

defineProps<{
  activePage?: string;
}>();

const navbar = ref<HTMLElement | null>(null);
const isFixed = ref(false);
const isVisible = ref(false);

onMounted(() => {
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
      if (navbar.value && y.value > navbar.value!.offsetHeight) isFixed.value = true;
    }
  });
});
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

nav span.active {
  @apply underline decoration-wavy decoration underline-offset-4;
}
</style>
