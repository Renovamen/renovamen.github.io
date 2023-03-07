import { visit } from "unist-util-visit";
import type * as mdast from "mdast";
import type * as unified from "unified";

const getImages = (info: string) => {
  if (info !== "") {
    const images =
      "<div>" +
      info
        .split(" ")
        .map((src) => {
          const alt = src.match(/(?=[^]+$).*(?=\.)/);
          return `<img src="${src}" alt="${alt}" loading="lazy" decoding="async" />`;
        })
        .join("") +
      "</div>";
    return `<div class="paper-images">${images}</div>`;
  } else {
    return `<div class="paper-images no-image"></div>`;
  }
};

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

      if (node.name === "paper") {
        data.hProperties = { class: ["paper-block"] };

        let info = "";

        if (node.children[0]?.data?.directiveLabel) {
          info = ((node.children[0] as mdast.Paragraph).children[0] as mdast.Text).value;
          node.children.splice(0, 1);
        }

        const images = getImages(info);

        const prev: mdast.HTML = {
          type: "html",
          value: `${images}<div class="paper-details">`
        };
        const next: mdast.HTML = {
          type: "html",
          value: "</div>"
        };

        node.children.splice(0, 0, prev);
        node.children.splice(node.children.length + 2, 0, next);
      }
    });
  };
};
