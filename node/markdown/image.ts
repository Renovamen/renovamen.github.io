// Borrowed from: https://github.com/Zhengqbbb/qbb.sh/blob/main/build/markdown/image.ts

import type { PluginSimple } from "markdown-it";

export const imagePlugin: PluginSimple = (md) => {
  const imageRE = /^<!-- (w=(?<width>\d+))? ?(desc="(?<desc>.*)")? -->/i;
  const imageRender = md.renderer.rules.image!;

  md.renderer.rules.image = (...args) => {
    const [tokens, idx] = args;
    const match = tokens[idx + 2]
      ? tokens[idx + 2].content.match(imageRE)
      : null;

    if (match) {
      tokens[idx + 2].content = "";

      if (match.groups?.width) {
        tokens[idx].attrs?.push(["width", match.groups.width]);
      }

      let code = imageRender(...args);

      if (match.groups?.desc) {
        code = `<figure alt="${tokens[idx].content}">
          ${code}
          <figcaption>${md.renderInline(match.groups.desc)}</figcaption>
        </figure>`;
      }

      return code;
    }

    return imageRender(...args);
  };
};

export default imagePlugin;
