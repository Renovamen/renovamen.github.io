import dayjs from "dayjs";
import { sync } from "cross-spawn";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const formatDate = (date: string | Date, type: 0 | 1 | 2 = 0) => {
  switch (type) {
    case 0:
      return dayjs(date).format("MMM D, YYYY");
    case 1:
      return dayjs(date).format("MMM D");
    case 2:
      return dayjs(date).format("YYYY/MM");
  }
};

// Modified from: https://github.com/vuejs/vitepress/blob/main/src/node/utils/getGitTimestamp.ts
export const lastUpdated = (id: string) => {
  // a workaround to find absolute path for a blog file
  const fileDev = path.resolve(__dirname, "../content/blog", id);
  const fileProd = path.resolve(__dirname, "../../../src/content/blog", id);
  const file = fs.existsSync(fileDev) ? fileDev : fileProd;

  const child = sync("git", ["log", "-1", '--pretty="%ci"', file]);
  const output = child.stdout.toString();
  return new Date(output).toLocaleString();
};
