<template>
  <Layout class="post">
    <template v-if="isToc" #navbar>
      <button nav-item title="Toggle toc" @click="isTocOpen = !isTocOpen">
        <div i-fluent:sidebar-search-rtl-20-regular />
      </button>
    </template>

    <div class="prose-lg mt-6 mb-8 mx-auto">
      <h1 class="text-4xl font-bold">{{ title }}</h1>
      <p class="opacity-50 mt-2">
        {{ formatDate(date) }} · {{ readingTime }} min
      </p>
    </div>

    <article ref="content" :class="isTocOpen && 'toc-open'">
      <RouterView />
    </article>

    <div
      v-if="prevBlog || nextBlog"
      class="prose-lg mx-auto grid md:grid-cols-2 pt-4 mt-16 border-t border-c"
    >
      <span class="prev">
        <RouterLink v-if="prevBlog" hover:underline :to="prevBlog.path">
          {{ prevBlog.title }}
        </RouterLink>
      </span>
      <span class="next text-right">
        <RouterLink v-if="nextBlog" hover:underline :to="nextBlog.path">
          {{ nextBlog.title }}
        </RouterLink>
      </span>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { isClient } from "@renovamen/utils";
import { formatDate } from "~/utils";

const router = useRouter();

const meta = computed(() => router.currentRoute.value.meta);

const title = computed(() => meta.value.frontmatter.title);
const date = computed(() => meta.value.date);
const readingTime = computed(() => meta.value.readingTime.minutes);

const prevBlog = computed(() => meta.value.prev);
const nextBlog = computed(() => meta.value.next);

const content = ref<HTMLDivElement>();

onMounted(() => {
  const navigate = () => {
    if (location.hash) {
      document
        .querySelector(decodeURIComponent(location.hash))
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleAnchors = (event: MouseEvent & { target: HTMLElement }) => {
    const link = event.target.closest("a");

    if (
      !event.defaultPrevented &&
      link &&
      event.button === 0 &&
      link.target !== "_blank" &&
      link.rel !== "external" &&
      !link.download &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey
    ) {
      const url = new URL(link.href);
      if (url.origin !== window.location.origin) return;

      event.preventDefault();
      const { pathname, hash } = url;
      if (hash && (!pathname || pathname === location.pathname)) {
        window.history.replaceState({}, "", hash);
        navigate();
      } else {
        router.push({ path: pathname, hash });
      }
    }
  };

  useEventListener(window, "hashchange", navigate);
  useEventListener(content.value!, "click", handleAnchors, { passive: false });

  navigate();
  setTimeout(navigate, 500);
});

const isTocOpen = ref(false);
const isToc = ref(false);

onMounted(() => {
  const initToc = () =>
    nextTick(() => {
      if (isClient) {
        const toc = document.querySelector(".table-of-contents");
        isToc.value = toc ? true : false;
      }
    });

  initToc();

  watch(
    () => router.currentRoute.value.path,
    () => initToc()
  );
});
</script>

<style scoped>
.prev a::before {
  content: "← ";
}
.next a::after {
  content: " →";
}
</style>
