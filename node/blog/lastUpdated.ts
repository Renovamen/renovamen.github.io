// Modified from: https://github.com/vuejs/vitepress/blob/main/src/node/utils/getGitTimestamp.ts

import { sync } from "cross-spawn";

export const lastUpdated = (file: string) => {
  const child = sync("git", ["log", "-1", '--pretty="%ci"', file]);
  const output = child.stdout.toString();
  return new Date(output).toLocaleString();
};
