import { visit } from "unist-util-visit";
import type * as mdast from "mdast";
import type { RemarkPlugin } from "@astrojs/markdown-remark";

export const remarkCodeBlock = (): ReturnType<RemarkPlugin> => {
  return (tree) => {
    visit(tree, "code", (node, index, parent) => {
      if (!parent || typeof index !== "number") return;

      const lang = (node.lang ?? "").trim();

      const start: mdast.Paragraph = {
        type: "paragraph",
        children: [
          {
            type: "html",
            value: `<div class="language-${lang}"><span class="lang">`
          },
          {
            type: "text",
            value: lang
          },
          {
            type: "html",
            value: "</span>"
          }
        ]
      };
      const end: mdast.Html = {
        type: "html",
        value: "</div>"
      };

      parent.children.splice(index, 0, start);
      parent.children.splice(index + 2, 0, end);

      return index + 3;
    });
  };
};
