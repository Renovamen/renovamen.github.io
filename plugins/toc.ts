import { toc } from "mdast-util-toc";
import { visit } from "unist-util-visit";
import type { RemarkPlugin } from "@astrojs/markdown-remark";

export const remarkToc = (options = {} as { heading?: string }): RemarkPlugin => {
  return (node) => {
    const result = toc(
      node,
      Object.assign({}, options, {
        heading: options.heading || "toc|table[ -]of[ -]contents?"
      })
    );

    if (
      result.endIndex === undefined ||
      result.index === undefined ||
      result.index === -1 ||
      !result.map
    ) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    visit(result.map, "link", (child: any) => {
      // ensure it doesn't start with a number
      child.url = "#" + child.url.substring(1).replace(/^(\d)/, "_$1");
    });

    // add class "table-of-contents" to the generated toc element
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = result.map.data || ((result.map.data = {}) as any);
    data.hProperties = { class: "table-of-contents" };

    // replace "toc" heading with the generated toc element
    node.children.splice(result.index - 1, 1, result.map);
  };
};
