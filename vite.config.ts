import { resolve } from "path";
import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import Pages from "vite-plugin-pages";
import generateSitemap from "vite-ssg-sitemap";
import Layouts from "vite-plugin-vue-layouts";
import Components from "unplugin-vue-components/vite";
import AutoImport from "unplugin-auto-import/vite";
import Markdown from "vite-plugin-vue-markdown";
import Unocss from "unocss/vite";
import {
  resolveBlogFile,
  resolveBlogList,
  resolveTags,
  installMarkdownPlugins,
  generateRSS,
  getTagPathsFromFiles,
  shiki
} from "./node";
import { hostname, title, description, author, shikiTheme } from "./shared";

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
      extendRoute: resolveBlogFile,
      onRoutesGenerated: (routes) => {
        resolveBlogList(routes);
        resolveTags(routes);
      }
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
      dirs: ["src/composables"],
      vueTemplate: true
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

    // https://github.com/antfu/vite-plugin-vue-markdown
    // Don't need this? Try vitesse-lite: https://github.com/antfu/vitesse-lite
    Markdown({
      wrapperClasses: "prose prose-lg m-auto text-left",
      headEnabled: true,
      markdownItOptions: {
        highlight: await shiki(shikiTheme)
      },
      markdownItSetup: installMarkdownPlugins
    })
  ],

  // https://github.com/antfu/vite-ssg
  ssgOptions: {
    script: "async",
    formatting: "minify",
    onFinished: () => {
      generateSitemap({
        hostname
      });
      generateRSS({
        hostname,
        title,
        description,
        author,
        sourceDir: "pages/posts",
        exclude: ["index.md", "tags/*"]
      });
    },
    includedRoutes: async (paths) => {
      const p = paths.filter(
        (i) => !["/:all(.*)*", "/posts/tags/:all(.*)", ""].includes(i)
      );
      const tagPaths = await getTagPathsFromFiles("pages/posts", [
        "index.md",
        "tags/*"
      ]);
      return p.concat(tagPaths);
    }
  }
});
