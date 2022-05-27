import { resolve } from "path";
import fs from "fs-extra";
import matter from "gray-matter";
import { readingTime } from ".";

export const resolveBlogFile = (route: any) => {
  if (!route.path.startsWith("/posts") || route.path === "/posts") return;

  const path = resolve(__dirname, "..", route.component.slice(1));
  const md = fs.readFileSync(path, "utf-8");
  const { content, data } = matter(md);

  route.meta = Object.assign(route.meta || {}, {
    frontmatter: data,
    layout: "post",
    date: route.path.substring(7, 17),
    readingTime: readingTime(content)
  });

  return route;
};
