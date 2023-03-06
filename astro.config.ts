import { defineConfig } from "astro/config";
import unocss from "unocss/astro";
import vue from "@astrojs/vue";
import sitemap from "@astrojs/sitemap";
import autoimport from "unplugin-auto-import/astro";
import remarkToc from "remark-toc";
import rehypeExternalLinks from "rehype-external-links";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import { remarkCodeBlock, remarkImage } from "./remark";

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
    remarkPlugins: [
      remarkMath,
      remarkCodeBlock,
      remarkImage,
      [remarkToc, { maxDepth: 3 }]
    ],
    rehypePlugins: [
      rehypeKatex,
      [rehypeExternalLinks, { target: "_blank", rel: "noopener noreferrer" }],
      [
        rehypePrettyCode,
        {
          theme: {
            light: "github-light",
            dark: "github-dark"
          },
          onVisitHighlightedLine: (node: any) => {
            node.properties.className.push("highlighted");
          }
        }
      ]
    ],
    syntaxHighlight: false
  }
});
