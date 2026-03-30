import { visit } from "unist-util-visit";
import { fromMarkdown } from "mdast-util-from-markdown";
import type { Root, Html, RootContent } from "mdast";
import type { Plugin } from "unified";

export const remarkImage: Plugin<[], Root> = () => {
  const imageRE = /^<!-- (w=(?<width>\d+))? ?(desc="(?<desc>.*)")? -->/i;

  return (tree) => {
    visit(tree, "image", (node, index, parent) => {
      if (!parent || typeof index !== "number") return;

      const content = (parent.children[index + 2] as Html)?.value;
      const match = content?.match(imageRE);

      if (match) {
        const { width, desc } = match.groups || {};
        const image = `<img src="${node.url}" alt="${node.alt}"${width ? ` width="${width}"` : ""} />`;

        const figNodes = [
          {
            type: "html",
            value: `<figure alt="${node.alt}">${image}`
          },
          ...(desc
            ? [
                { type: "html", value: "<figcaption>" },
                ...fromMarkdown(desc).children,
                { type: "html", value: "</figcaption>" }
              ]
            : []),
          {
            type: "html",
            value: "</figure>"
          }
        ] as RootContent[];

        parent.children.splice(index, 3, ...figNodes);
        return index + figNodes.length;
      }
    });
  };
};
