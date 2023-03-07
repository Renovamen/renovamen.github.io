import { visit } from "unist-util-visit";
import type * as mdast from "mdast";
import type * as unified from "unified";

export const remarkContainer: unified.Plugin<[], mdast.Root> = () => {
  return (tree) => {
    visit(tree, "containerDirective", (node) => {
      const data = node.data || (node.data = {});

      if (["info", "tip", "warning", "danger", "details"].includes(node.name)) {
        data.hProperties = { class: ["custom-block", node.name] };
        data.hName = node.name === "details" ? "details" : "div";

        let title = node.name.toUpperCase();

        if (node.children[0]?.data?.directiveLabel) {
          title = ((node.children[0] as mdast.Paragraph).children[0] as mdast.Text).value;
          node.children.splice(0, 1);
        }

        const titleNode: mdast.Paragraph = {
          type: "paragraph",
          data: {
            hName: node.name === "details" ? "summary" : "p",
            hProperties: { class: "custom-block-title" }
          },
          children: [
            {
              type: "text",
              value: title
            }
          ]
        };

        node.children.splice(0, 0, titleNode);
      }
    });
  };
};
