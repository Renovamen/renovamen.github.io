import { visit } from "unist-util-visit";
import type { Root, Paragraph, Text } from "mdast";
import type { Plugin } from "unified";

type DirectiveLabelData = { directiveLabel?: boolean };

const CUSTOM_BLOCK_NAMES = new Set(["info", "tip", "warning", "danger", "details"]);

const takeDirectiveLabel = (children: Root["children"]) => {
  const firstChild = children[0];

  if (
    firstChild?.type !== "paragraph" ||
    !(firstChild.data as DirectiveLabelData | undefined)?.directiveLabel
  ) {
    return "";
  }

  children.shift();
  return ((firstChild as Paragraph).children[0] as Text | undefined)?.value ?? "";
};

const getImageAlt = (src: string) => {
  const fileName = src.substring(src.lastIndexOf("/") + 1);
  const extensionIndex = fileName.lastIndexOf(".");

  return extensionIndex === -1 ? fileName : fileName.substring(0, extensionIndex);
};

const getImages = (info: string) => {
  const imageSources = info.trim().split(/\s+/).filter(Boolean);

  if (imageSources.length === 0) {
    return `<div class="paper-images no-image"></div>`;
  }

  const images = imageSources
    .map((src) => {
      return `<img src="${src}" alt="${getImageAlt(src)}" loading="lazy" decoding="async" />`;
    })
    .join("");

  return `<div class="paper-images"><div>${images}</div></div>`;
};

export const remarkContainer: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, "containerDirective", (node) => {
      const data = node.data || (node.data = {});
      const children = node.children;

      if (CUSTOM_BLOCK_NAMES.has(node.name)) {
        data.hProperties = { class: ["custom-block", node.name] };
        data.hName = node.name === "details" ? "details" : "div";

        const title = takeDirectiveLabel(children) || node.name.toUpperCase();

        const titleNode: Paragraph = {
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
        const images = getImages(takeDirectiveLabel(children));

        children.unshift({
          type: "html",
          value: `${images}<div class="paper-details">`
        });

        children.push({
          type: "html",
          value: "</div>"
        });
      }
    });
  };
};
