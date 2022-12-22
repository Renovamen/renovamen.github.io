// Modified from: https://github.com/vuejs/vitepress/blob/main/src/node/markdown/plugins/preWrapper.ts

import type { PluginSimple } from "markdown-it";

const extractLang = (info: string) =>
  info
    .trim()
    .replace(/(-vue|{| ).*$/, "")
    .replace(/^vue-html$/, "template");

export const codeBlock: PluginSimple = (md) => {
  const fence = md.renderer.rules.fence!;

  md.renderer.rules.fence = (...args) => {
    const { info } = args[0][args[1]];

    const lang = extractLang(info);
    const rawCode = fence(...args);

    return `<div class="language-${lang}">
    <span class="lang">${lang}</span>
    ${rawCode}
    </div>`;
  };
};

export default codeBlock;
