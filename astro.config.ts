import { defineConfig } from "astro/config";
import unocss from "unocss/astro";
import vue from "@astrojs/vue";
import sitemap from "@astrojs/sitemap";
import autoimport from "unplugin-auto-import/astro";
import remarkToc from "remark-toc";
import rehypeExternalLinks from "rehype-external-links";

// https://astro.build/config
export default defineConfig({
  site: "https://zxh.io/",
  integrations: [
    unocss(),
    vue(),
    autoimport({
      imports: ["vue", "@vueuse/head", "@vueuse/core"],
      dts: "src/auto-imports.d.ts",
      dirs: ["src/composables"],
      vueTemplate: true,
      eslintrc: {
        enabled: true
      }
    }),
    sitemap()
  ],
  markdown: {
    remarkPlugins: [[remarkToc, { maxDepth: 3 }]],
    rehypePlugins: [
      [rehypeExternalLinks, { target: "_blank", rel: "noopener noreferrer" }]
    ],
    shikiConfig: {
      theme: "one-dark-pro",
      wrap: true
    }
  }
});
