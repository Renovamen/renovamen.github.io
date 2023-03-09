<template>
  <div class="giscus" />
</template>

<script setup lang="ts">
import { GISCUS } from "@config";

const theme = computed(() => (isDark.value ? GISCUS.dark : GISCUS.light));

const getScriptElement = () => {
  const element = document.createElement("script");

  element.setAttribute("src", "https://giscus.app/client.js");
  element.setAttribute("data-repo", GISCUS.repo);
  element.setAttribute("data-repo-id", GISCUS.repoId);
  element.setAttribute("data-category", GISCUS.category);
  element.setAttribute("data-category-id", GISCUS.categoryId);
  element.setAttribute("data-theme", theme.value);
  element.setAttribute("data-lang", "en");
  element.setAttribute("data-mapping", "pathname");
  element.setAttribute("data-reactions-enabled", "1");
  element.setAttribute("data-emit-metadata", "0");
  element.setAttribute("crossorigin", "anonymous");
  element.setAttribute("async", "true");

  return element;
};

const updateGiscus = () => {
  const iframe = document.querySelector<HTMLIFrameElement>("iframe.giscus-frame");
  iframe?.contentWindow?.postMessage(
    {
      giscus: {
        setConfig: {
          theme: theme.value
        }
      }
    },
    "https://giscus.app"
  );
};

onMounted(() => {
  document.head.appendChild(getScriptElement());
});

watch(theme, updateGiscus);
</script>
