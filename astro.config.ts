import { defineConfig } from "astro/config";
import unocss from "unocss/astro";
import vue from "@astrojs/vue";
import sitemap from "@astrojs/sitemap";
import autoimport from "unplugin-auto-import/astro";
import { remarkPlugins, rehypePlugins } from "./plugins";

// https://astro.build/config
export default defineConfig({
  site: "https://zxh.io/",
  integrations: [
    unocss(),
    vue(),
    autoimport({
      imports: ["vue", "@vueuse/core"],
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
    remarkPlugins,
    rehypePlugins,
    syntaxHighlight: false
  }
});
