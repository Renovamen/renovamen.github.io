import dayjs from "dayjs";
import { sync } from "cross-spawn";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const formatDate = (date: string | Date, year = true) => {
  return year ? dayjs(date).format("MMM D, YYYY") : dayjs(date).format("MMM D");
};

export const lastUpdated = (slug: string) => {
  const file = path.resolve(__dirname, "../content/blog", slug + ".md");
  const child = sync("git", ["log", "-1", '--pretty="%ci"', file]);
  const output = child.stdout.toString();
  return new Date(output).toLocaleString();
};
