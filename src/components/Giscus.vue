<template>
  <div class="giscus" />
</template>

<script setup lang="ts">
import { isClient } from "@renovamen/utils";
import { giscus } from "../../shared";

const theme = computed(() => (isDark.value ? giscus.dark : giscus.light));

const getScriptElement = () => {
  const element = document.createElement("script");

  element.setAttribute("src", "https://giscus.app/client.js");
  element.setAttribute("data-repo", giscus.repo);
  element.setAttribute("data-repo-id", giscus.repoId);
  element.setAttribute("data-category", giscus.category);
  element.setAttribute("data-category-id", giscus.categoryId);
  element.setAttribute("data-theme", theme.value);
  element.setAttribute("data-lang", "en");
  element.setAttribute("data-mapping", "pathname");
  element.setAttribute("data-reactions-enabled", "1");
  element.setAttribute("data-emit-metadata", "0");
  element.setAttribute("data-loading", "lazy");
  element.setAttribute("crossorigin", "anonymous");
  element.setAttribute("async", "true");

  return element;
};

const updateGiscus = () => {
  const iframe = document.querySelector<HTMLIFrameElement>(
    "iframe.giscus-frame"
  );
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

if (isClient) {
  const scriptElement = ref<HTMLScriptElement>(getScriptElement());

  onMounted(() => {
    document.head.appendChild(scriptElement.value);
  });

  onBeforeUnmount(() => {
    document.head.removeChild(scriptElement.value);
  });

  watch(theme, updateGiscus);
}
</script>
