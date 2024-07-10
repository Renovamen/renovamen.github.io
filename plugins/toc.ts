import { toc } from "mdast-util-toc";
import { visit } from "unist-util-visit";
import type { RemarkPlugin } from "@astrojs/markdown-remark";

export const remarkToc = (
  options = {} as { heading?: string }
): ReturnType<RemarkPlugin> => {
  return (node) => {
    const result = toc(node, {
      ...options,
      heading: options.heading || "toc|table[ -]of[ -]contents?"
    });

    if (
      result.endIndex === undefined ||
      result.index === undefined ||
      result.index === -1 ||
      !result.map
    ) {
      return;
    }

    visit(result.map, "link", (child) => {
      // Ensure it doesn't start with a number
      child.url = "#" + child.url.substring(1).replace(/^(\d)/, "_$1");
    });

    // Add class "table-of-contents" to the generated toc element
    result.map.data = result.map.data || {};
    result.map.data.hProperties = { class: "table-of-contents" };

    // Replace "toc" heading with the generated toc element
    node.children.splice(result.index - 1, 1, result.map);
  };
};
