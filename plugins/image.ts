import { visit } from "unist-util-visit";
import { fromMarkdown } from "mdast-util-from-markdown";
import type * as mdast from "mdast";
import type { RemarkPlugin } from "@astrojs/markdown-remark";

export const remarkImage: RemarkPlugin = () => {
  const imageRE = /^<!-- (w=(?<width>\d+))? ?(desc="(?<desc>.*)")? -->/i;

  return (tree) => {
    visit(tree, "image", (node, index, parent) => {
      if (!parent || typeof index !== "number") return;

      const content = (parent.children[index + 2] as mdast.HTML)?.value;
      const match = content ? content.match(imageRE) : null;

      if (match) {
        const image = match.groups?.width
          ? `<img src="${node.url}" alt="${node.alt}" width="${match.groups.width}" />`
          : `<img src="${node.url}" alt="${node.alt}" />`;

        const figNodes: mdast.Content[] = [
          {
            type: "html",
            value: `<figure alt="${node.alt}">${image}`
          },
          {
            type: "html",
            value: "</figure>"
          }
        ];

        if (match.groups?.desc) {
          const capNodes: mdast.Content[] = [
            {
              type: "html",
              value: "<figcaption>"
            },
            ...fromMarkdown(match.groups.desc).children,
            {
              type: "html",
              value: "</figcaption>"
            }
          ];

          figNodes.splice(1, 0, ...capNodes);
        }

        parent.children.splice(index, 3);
        parent.children.splice(index, 0, ...figNodes);

        return index + figNodes.length;
      }
    });
  };
};
