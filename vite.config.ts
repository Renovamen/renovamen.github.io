import { resolve } from "path";
import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import Pages from "vite-plugin-pages";
import generateSitemap from "vite-ssg-sitemap";
import Layouts from "vite-plugin-vue-layouts";
import Components from "unplugin-vue-components/vite";
import AutoImport from "unplugin-auto-import/vite";
import Markdown from "vite-plugin-md";
import Unocss from "unocss/vite";
import { resolveBlogFile, installMarkdownPlugins } from "./node";

const markdownWrapperClasses = "prose m-auto text-left";

export default defineConfig({
  resolve: {
    alias: {
      "~/": `${resolve(__dirname, "src")}/`
    }
  },

  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/],
      reactivityTransform: true
    }),

    // https://github.com/hannoeru/vite-plugin-pages
    Pages({
      pagesDir: "pages",
      extensions: ["vue", "md"],
      extendRoute: (route) => resolveBlogFile(route)
    }),

    // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
    Layouts(),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: [
        "vue",
        "vue-router",
        "vue/macros",
        "@vueuse/head",
        "@vueuse/core"
      ],
      dts: "src/auto-imports.d.ts",
      dirs: ["src/composables"]
    }),

    // https://github.com/antfu/unplugin-vue-components
    Components({
      // allow auto load markdown components under `./src/components/`
      extensions: ["vue", "md"],
      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      dts: "src/components.d.ts"
    }),

    // https://github.com/antfu/unocss
    // see unocss.config.ts for config
    Unocss(),

    // https://github.com/antfu/vite-plugin-md
    // Don't need this? Try vitesse-lite: https://github.com/antfu/vitesse-lite
    Markdown({
      wrapperClasses: markdownWrapperClasses,
      headEnabled: true,
      markdownItSetup: (md) => installMarkdownPlugins(md)
    })
  ],

  // https://github.com/antfu/vite-ssg
  ssgOptions: {
    script: "async",
    formatting: "minify",
    onFinished: () => generateSitemap()
  }
});
