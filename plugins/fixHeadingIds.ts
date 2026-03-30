import { visit } from "unist-util-visit";
import type { Root } from "hast";
import type { Plugin } from "unified";

export const rehypeFixHeadingIds: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, "element", (node) => {
      const { tagName, properties } = node;

      if (
        !/^h[1-6]$/.test(tagName) ||
        !properties?.id ||
        typeof properties.id !== "string"
      )
        return;

      // Ensure the id doesn't start with a number
      properties.id = properties.id.replace(/^(\d)/, "_$1");
    });
  };
};
