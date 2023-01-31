import type MarkdownIt from "markdown-it";
import linkAttributesPlugin from "markdown-it-link-attributes";
// @ts-expect-error missing types
import tocPlugin from "markdown-it-table-of-contents";
import anchorPlugin from "markdown-it-anchor";
import katexPlugin from "@renovamen/markdown-it-katex";
import codeBlockPlugin from "./codeBlock";
import highlightLinesPlugin from "./highlightLines";
import containerPlugin from "./container";

// https://github.com/mdit-vue/mdit-vue/blob/main/packages/shared/src/slugify.ts
const rControl = /[\u0000-\u001f]/g;
const rSpecial = /[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'“”‘’<>,.?/]+/g;
const rCombining = /[\u0300-\u036F]/g;

const slugify = (str: string): string =>
  str
    .normalize("NFKD")
    // Remove accents
    .replace(rCombining, "")
    // Remove control characters
    .replace(rControl, "")
    // Replace special characters
    .replace(rSpecial, "-")
    // Remove continuos separators
    .replace(/-{2,}/g, "-")
    // Remove prefixing and trailing separators
    .replace(/^-+|-+$/g, "")
    // ensure it doesn't start with a number
    .replace(/^(\d)/, "_$1")
    // lowercase
    .toLowerCase();

export const installMarkdownPlugins = (md: MarkdownIt) => {
  md.use(highlightLinesPlugin);
  md.use(codeBlockPlugin);
  md.use(containerPlugin);

  md.use(anchorPlugin, {
    slugify,
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
