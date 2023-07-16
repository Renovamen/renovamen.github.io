import type { RemarkPlugins, RehypePlugins } from "astro";
import remarkDirective from "remark-directive";
import remarkMath from "remark-math";
import { remarkToc } from "./toc";
import { remarkImage } from "./image";
import { remarkCodeBlock } from "./codeBlock";
import { remarkContainer } from "./container";
import rehypeExternalLinks from "rehype-external-links";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { rehypeHeadingIds } from "@astrojs/markdown-remark";
import { rehypeFixHeadingIds } from "./fixHeadingIds";

export const remarkPlugins: RemarkPlugins = [
  remarkMath,
  remarkCodeBlock,
  remarkImage,
  remarkDirective,
  remarkContainer,
  [remarkToc, { maxDepth: 3 }]
];

export const rehypePlugins: RehypePlugins = [
  rehypeKatex,
  [rehypeExternalLinks, { target: "_blank", rel: "noopener noreferrer" }],
  [
    rehypePrettyCode,
    {
      theme: {
        light: "github-light",
        dark: "github-dark"
      }
    }
  ],
  rehypeHeadingIds,
  rehypeFixHeadingIds,
  [
    rehypeAutolinkHeadings,
    {
      properties: {
        ariaHidden: "true",
        tabIndex: -1,
        class: "header-anchor"
      },
      content: {
        type: "text",
        value: "#"
      }
    }
  ]
];
