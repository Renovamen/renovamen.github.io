<template>
  <div
    class="search hstack h-14 w-full rounded border border-c-dark"
    :class="[isFocus && 'focus !border-c-active']"
  >
    <span w-12 h-14 flex-center>
      <span class="icon i-uil:search w-5 h-5 text-c-lighter" />
    </span>
    <input
      ref="input"
      v-model="searchText"
      class="flex-1 h-full bg-transparent pr-2 placeholder:text-c-lighter focus:outline-none"
      placeholder="Search for articles ..."
      type="text"
      name="search"
      autoComplete="off"
      autoFocus
      @focus="isFocus = true"
      @blur="isFocus = false"
    />
  </div>

  <div v-if="searchText.length > 1" mt-8 text-c-light>
    Found {{ searchResults.length }}
    {{ searchResults.length === 1 ? " result" : " results" }} for "{{ searchText }}"
  </div>

  <ul p-0>
    <div
      v-for="{ item, refIndex } of searchResults"
      :key="`${refIndex}-${item.title}`"
      my-4
    >
      <p flex items-start my-1>
        <span w-16 mt-0.5 text="sm c-lighter">{{ item.date }}</span>
        <a :href="`/posts/${item.slug}`">{{ item.title }}</a>
      </p>
      <p pl-16 my-1 text="sm c-light">{{ item.excerpt }}...</p>
    </div>
  </ul>
</template>

<script setup lang="ts">
import Fuse from "fuse.js";

export type SearchItem = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
};

const props = defineProps<{ searchList: SearchItem[] }>();

const fuse = new Fuse(props.searchList, {
  keys: ["title", "excerpt"],
  includeMatches: true,
  minMatchCharLength: 2,
  threshold: 0.5
});

const isFocus = ref(true);
const input = ref<HTMLInputElement>();
const searchText = ref("");

onMounted(() => {
  // if URL has search query,
  // insert that search query in input field
  const searchUrl = new URLSearchParams(window.location.search);
  const searchStr = searchUrl.get("q");
  if (searchStr) searchText.value = searchStr;

  // put focus cursor at the end of the string
  setTimeout(function () {
    input.value!.selectionStart = input.value!.selectionEnd = searchStr?.length || 0;
  }, 50);
});

// update search string in URL
watch(searchText, () => {
  if (searchText.value.length > 0) {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("q", searchText.value);
    const newRelativePathQuery = window.location.pathname + "?" + searchParams.toString();
    history.pushState(null, "", newRelativePathQuery);
  } else {
    history.pushState(null, "", window.location.pathname);
  }
});

// add search result only if input value is more than one character
const searchResults = computed(() =>
  searchText.value.length > 1 ? fuse.search(searchText.value) : []
);
</script>

<style scoped>
.search.focus .icon {
  @apply text-c-active opacity-100;
}
</style>
