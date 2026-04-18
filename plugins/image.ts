import { visit } from "unist-util-visit";
import { fromMarkdown } from "mdast-util-from-markdown";
import type { Root, Paragraph, PhrasingContent } from "mdast";
import type { Plugin } from "unified";

const imageRE = /^<!-- (w=(?<width>\d+))? ?(desc="(?<desc>.*)")? -->/i;

const getCaptionNodes = (desc: string): Paragraph["children"] => {
  return fromMarkdown(desc).children.flatMap((child) => {
    if (child.type === "paragraph") {
      return child.children;
    }

    return [child as PhrasingContent];
  });
};

export const remarkImage: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, "image", (node, index, parent) => {
      if (!parent || typeof index !== "number") return;

      const metadata = parent.children[index + 2];

      if (metadata?.type !== "html") return;

      const match = metadata.value.match(imageRE);

      if (match) {
        const { width, desc } = match.groups || {};
        const alt = node.alt ?? "";
        const image = `<img src="${node.url}" alt="${alt}"${width ? ` width="${width}"` : ""} />`;

        const figNodes = [
          {
            type: "html",
            value: `<figure alt="${alt}">${image}`
          },
          ...(desc
            ? [
                { type: "html", value: "<figcaption>" },
                ...getCaptionNodes(desc),
                { type: "html", value: "</figcaption>" }
              ]
            : []),
          {
            type: "html",
            value: "</figure>"
          }
        ] as PhrasingContent[];

        parent.children.splice(index, 3, ...figNodes);
        return index + figNodes.length;
      }
    });
  };
};
