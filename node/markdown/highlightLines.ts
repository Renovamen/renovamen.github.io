// Modified from: https://github.com/vuejs/vitepress/blob/main/src/node/markdown/plugins/highlightLines.ts

import type { PluginSimple } from "markdown-it";

const RE = /{([\d,-]+)}/;

export const highlightLinesPlugin: PluginSimple = (md) => {
  const fence = md.renderer.rules.fence!;

  md.renderer.rules.fence = (...args) => {
    const [tokens, idx] = args;
    const token = tokens[idx];
    const info = token.info;

    if (!info || !RE.test(info)) {
      return fence(...args);
    }

    const lang = info.replace(RE, "").trim();

    // ensure the next plugin get the correct lang
    token.info = lang + " " + RE.exec(info)![1];

    return fence(...args);
  };
};

export default highlightLinesPlugin;
