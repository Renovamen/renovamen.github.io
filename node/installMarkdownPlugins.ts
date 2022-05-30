import Prism from "markdown-it-prism";
import LinkAttributes from "markdown-it-link-attributes";
// @ts-expect-error missing types
import TOC from "markdown-it-table-of-contents";
import anchor from "markdown-it-anchor";
import type MarkdownIt from "markdown-it";
import { slugify } from ".";

export const installMarkdownPlugins = (md: MarkdownIt) => {
  // https://prismjs.com/
  md.use(Prism);

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
};
