// @ts-check

import solid from "@astrojs/solid-js";
import { unified } from "@astrojs/markdown-remark";
import { defineConfig } from "astro/config";
import unocss from "unocss/astro";
import sitemap from "@astrojs/sitemap";
import { remarkPlugins, rehypePlugins } from "./plugins";

// https://astro.build/config
export default defineConfig({
  site: "https://zxh.me/",
  compressHTML: true,
  integrations: [
    solid(),
    unocss({
      injectReset: true
    }),
    sitemap()
  ],
  markdown: {
    processor: unified({
      remarkPlugins,
      rehypePlugins
    }),
    syntaxHighlight: false
  }
});
