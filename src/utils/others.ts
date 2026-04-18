import dayjs from "dayjs";
import { sync } from "cross-spawn";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATE_FORMATS = ["MMM D, YYYY", "MMM D", "YYYY/MM"] as const;
const BLOG_FILE_CANDIDATES = [
  "../content/blog",
  "../../src/content/blog"
] as const satisfies readonly string[];

export const formatDate = (date: string | Date, type: 0 | 1 | 2 = 0) =>
  dayjs(date).format(DATE_FORMATS[type]);

const getBlogFilePath = (id: string) => {
  const candidates = BLOG_FILE_CANDIDATES.map((basePath) =>
    path.resolve(__dirname, basePath, `${id}.md`)
  );

  return candidates.find(fs.existsSync) ?? candidates.at(-1)!;
};

// Modified from: https://github.com/vuejs/vitepress/blob/main/src/node/utils/getGitTimestamp.ts
export const lastUpdated = (id: string) => {
  const output = sync("git", ["log", "-1", '--pretty="%ci"', getBlogFilePath(id)])
    .stdout.toString()
    .trim();

  return new Date(output).toLocaleString();
};
