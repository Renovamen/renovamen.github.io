import { onMount, createEffect, type Component } from "solid-js";
import { useDark } from "solidjs-use";
import { GISCUS } from "@config";

export const Giscus: Component = () => {
  const [isDark] = useDark();
  const getTheme = () => (isDark() ? GISCUS.dark : GISCUS.light);

  const getScriptElement = (theme: string) => {
    const element = document.createElement("script");

    element.setAttribute("src", "https://giscus.app/client.js");
    element.setAttribute("data-repo", GISCUS.repo);
    element.setAttribute("data-repo-id", GISCUS.repoId);
    element.setAttribute("data-category", GISCUS.category);
    element.setAttribute("data-category-id", GISCUS.categoryId);
    element.setAttribute("data-theme", theme);
    element.setAttribute("data-lang", "en");
    element.setAttribute("data-mapping", "pathname");
    element.setAttribute("data-reactions-enabled", "1");
    element.setAttribute("data-emit-metadata", "0");
    element.setAttribute("crossorigin", "anonymous");
    element.setAttribute("async", "true");

    return element;
  };

  const updateGiscus = (theme: string) => {
    const iframe = document.querySelector<HTMLIFrameElement>("iframe.giscus-frame");
    iframe?.contentWindow?.postMessage(
      {
        giscus: {
          setConfig: {
            theme
          }
        }
      },
      "https://giscus.app"
    );
  };

  onMount(() => {
    document.head.appendChild(getScriptElement(getTheme()));
  });

  createEffect(() => updateGiscus(getTheme()));

  return <div class="giscus" />;
};

export default Giscus;
