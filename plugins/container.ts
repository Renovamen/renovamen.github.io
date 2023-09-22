import { visit } from "unist-util-visit";
import type * as mdast from "mdast";
import type { RemarkPlugin } from "@astrojs/markdown-remark";

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

export const remarkContainer = (): RemarkPlugin => {
  return (tree) => {
    visit(tree, "containerDirective", (node) => {
      const data = node.data || (node.data = {});
      const children = node.children;

      if (["info", "tip", "warning", "danger", "details"].includes(node.name)) {
        data.hProperties = { class: ["custom-block", node.name] };
        data.hName = node.name === "details" ? "details" : "div";

        let title = node.name.toUpperCase();

        if (children[0]?.data?.directiveLabel) {
          title = ((children[0] as mdast.Paragraph).children[0] as mdast.Text).value;
          children.shift();
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

        children.unshift(titleNode);
      }

      if (node.name === "paper") {
        data.hProperties = { class: ["paper-block"] };

        let info = "";

        if (children[0]?.data?.directiveLabel) {
          info = ((children[0] as mdast.Paragraph).children[0] as mdast.Text).value;
          children.shift();
        }

        const images = getImages(info);

        const prev: mdast.Html = {
          type: "html",
          value: `${images}<div class="paper-details">`
        };
        const next: mdast.Html = {
          type: "html",
          value: "</div>"
        };

        children.unshift(prev);
        children.push(next);
      }
    });
  };
};
