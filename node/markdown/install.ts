import type MarkdownIt from "markdown-it";
import { slugify } from "@renovamen/utils";
import LinkAttributes from "markdown-it-link-attributes";
// @ts-expect-error missing types
import TOC from "markdown-it-table-of-contents";
import anchor from "markdown-it-anchor";
import KaTeX from "@renovamen/markdown-it-katex";
import CodeBlock from "./codeBlock";
import HighlightLines from "./highlightLines";

export const installMarkdownPlugins = (md: MarkdownIt) => {
  md.use(HighlightLines);
  md.use(CodeBlock);

  md.use(anchor, {
    slugify,
    permalink: anchor.permalink.linkInsideHeader({
      symbol: "#",
      renderAttrs: () => ({ "aria-hidden": "true" })
    })
  });

  md.use(LinkAttributes, {
    matcher: (link: string) => /^https?:\/\//.test(link),
    attrs: {
      target: "_blank",
      rel: "noopener"
    }
  });

  md.use(TOC, {
    includeLevel: [2, 3],
    slugify
  });

  md.use(KaTeX);
};
