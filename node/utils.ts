export const slugify = (str: string) =>
  encodeURI(
    str
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace whitespace with -
      .replace(
        /[\]\[\!\'\#\$\%\&\(\)\*\+\,\.\/\:\;\<\=\>\?\@\\\^\_\{\|\}\~\`。，、；：？！…—·ˉ¨‘’“”々～‖∶＂＇｀｜〃〔〕〈〉《》「」『』．〖〗【】（）［］｛｝]/g,
        ""
      ) // Remove known punctuators
      .replace(/^\-+/, "") // Remove leading -
      .replace(/\-+$/, "") // Remove trailing -
  );
