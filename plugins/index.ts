import type { RemarkPlugins, RehypePlugins } from "astro";
import rehypeExternalLinks from "rehype-external-links";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { rehypeHeadingIds } from '@astrojs/markdown-remark';
import remarkToc from "remark-toc";
import remarkDirective from "remark-directive";
import remarkMath from "remark-math";
import { remarkImage } from "./image";
import { remarkCodeBlock } from "./codeBlock";
import { remarkContainer } from "./container";

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
      },
      onVisitHighlightedLine: (node: any) => {
        node.properties.className.push("highlighted");
      }
    }
  ],
  rehypeHeadingIds,
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
