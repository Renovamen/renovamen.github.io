import type MarkdownIt from "markdown-it";
import type { RenderRule } from "markdown-it/lib/renderer";
// @ts-expect-error missing types
import container from "markdown-it-container";

export const containerPlugin = (md: MarkdownIt) => {
  md.use(...createContainer("tip", "TIP", md))
    .use(...createContainer("info", "INFO", md))
    .use(...createContainer("warning", "WARNING", md))
    .use(...createContainer("danger", "DANGER", md))
    .use(...createContainer("details", "Details", md))
    .use(...createPubContainer());
};

type ContainerArgs = [typeof container, string, { render: RenderRule }];

const createContainer = (
  klass: string,
  defaultTitle: string,
  md: MarkdownIt
): ContainerArgs => {
  return [
    container,
    klass,
    {
      render(tokens, idx) {
        const token = tokens[idx];
        const info = token.info.trim().slice(klass.length).trim();
        if (token.nesting === 1) {
          const title = md.renderInline(info || defaultTitle);
          if (klass === "details") {
            return `<details class="${klass} custom-block"><summary>${title}</summary>\n`;
          }
          return `<div class="${klass} custom-block"><p class="custom-block-title">${title}</p>\n`;
        } else {
          return klass === "details" ? `</details>\n` : `</div>\n`;
        }
      }
    }
  ];
};

const createPubContainer = (): ContainerArgs => {
  return [
    container,
    "pub",
    {
      render(tokens, idx) {
        const token = tokens[idx];
        const info = token.info.trim().slice(3).trim();

        if (token.nesting === 1) {
          if (info !== "") {
            const images =
              "<div>" +
              info
                .split(" ")
                .map((src) => {
                  const alt = src.match(/(?=[^\/]+$).*(?=\.)/);
                  return `<img src="${src}" alt="${alt}" loading="lazy" decoding="async" />`;
                })
                .join("") +
              "</div>";
            return `<div class="pub-block"><div class="pub-images">${images}</div><div class="pub-details">\n`;
          } else {
            return `<div class="pub-block"><div class="pub-images no-image"></div><div class="pub-details">\n`;
          }
        } else {
          return `</div></div>\n`;
        }
      }
    }
  ];
};

export default containerPlugin;
