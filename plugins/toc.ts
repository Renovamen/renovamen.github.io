import { toc } from "mdast-util-toc";
import { visit } from "unist-util-visit";
import type { RemarkPlugin } from "@astrojs/markdown-remark";

export const remarkToc: RemarkPlugin = (options = {}) => {
  return (node) => {
    const result = toc(
      node,
      Object.assign({}, options, {
        heading: options.heading || "toc|table[ -]of[ -]contents?"
      })
    );

    if (
      result.endIndex === null ||
      result.index === null ||
      result.index === -1 ||
      !result.map
    ) {
      return;
    }

    visit(result.map, "link", (child) => {
      // ensure it doesn't start with a number
      child.url = "#" + child.url.substring(1).replace(/^(\d)/, "_$1");
    });

    node.children = [
      ...node.children.slice(0, result.index),
      result.map,
      ...node.children.slice(result.endIndex)
    ];
  };
};
