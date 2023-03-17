import { visit } from "unist-util-visit";
import type { RehypePlugin } from "@astrojs/markdown-remark";

export const rehypeFixHeadingIds: RehypePlugin = () => {
  return (tree) => {
    visit(tree, "element", (node) => {
      const { tagName } = node;
      if (tagName[0] !== "h") return;

      const [, level] = tagName.match(/h([0-6])/) ?? [];
      if (!level) return;

      if (!node.properties?.id || typeof node.properties.id !== "string") return;

      // ensure it doesn't start with a number
      node.properties.id = node.properties.id.replace(/^(\d)/, "_$1");
    });
  };
};
