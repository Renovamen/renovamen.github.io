import type MarkdownIt from "markdown-it";
import { slugify } from "@renovamen/utils";
import linkAttributesPlugin from "markdown-it-link-attributes";
// @ts-expect-error missing types
import tocPlugin from "markdown-it-table-of-contents";
import anchorPlugin from "markdown-it-anchor";
import katexPlugin from "@renovamen/markdown-it-katex";
import codeBlockPlugin from "./codeBlock";
import highlightLinesPlugin from "./highlightLines";
import containerPlugin from "./container";

export const installMarkdownPlugins = (md: MarkdownIt) => {
  md.use(highlightLinesPlugin);
  md.use(codeBlockPlugin);
  md.use(containerPlugin);

  md.use(anchorPlugin, {
    slugify: (s) => decodeURI(slugify(s)),
    permalink: anchorPlugin.permalink.linkInsideHeader({
      symbol: "#",
      ariaHidden: true
    })
  });

  md.use(linkAttributesPlugin, {
    matcher: (link: string) => /^https?:\/\//.test(link),
    attrs: {
      target: "_blank",
      rel: "noopener noreferrer"
    }
  });

  md.use(tocPlugin, {
    includeLevel: [2, 3],
    slugify
  });

  md.use(katexPlugin);
};
