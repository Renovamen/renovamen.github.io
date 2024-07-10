import { visit } from "unist-util-visit";
import type { RehypePlugin } from "@astrojs/markdown-remark";

export const rehypeFixHeadingIds = (): ReturnType<RehypePlugin> => {
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
