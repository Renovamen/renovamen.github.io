import fs from "fs-extra";
import matter from "gray-matter";
import { readingTime, lastUpdated } from "./blog";
import { resolvePath } from "./utils";
import { getBlogs, checkBlogLang, type BlogMeta } from "../shared";

const isBlog = (route: any, lang: string) =>
  route.path.startsWith("/posts") &&
  route.path !== `/posts` &&
  route.path !== `/posts/zh` &&
  !route.path.startsWith(`/posts/tags`) &&
  !route.path.startsWith(`/posts/zh/tags`) &&
  checkBlogLang(route.path, lang);

export const resolveBlogFile = (route: any, lang: string) => {
  if (!isBlog(route, lang)) return;

  const offset = lang === "en" ? 0 : lang.length + 1;
  const path = resolvePath(route.component.slice(1));
  const md = fs.readFileSync(path, "utf-8");
  const { content, data } = matter(md);

  route.meta = Object.assign(route.meta || {}, {
    frontmatter: data,
    layout: "post",
    date: route.path.substring(7 + offset, 17 + offset),
    readingTime: readingTime(content),
    lastUpdated: lastUpdated(path)
  } as BlogMeta);

  return route;
};

export const resolveBlogList = (routes: any[], lang: string) => {
  const blogs = getBlogs(routes, { lang });

  return routes
    .filter((item) => isBlog(item, lang))
    .map((item) => {
      const i = blogs.findIndex((blog) => blog.path === item.path);

      item.meta = {
        ...item.meta,
        prev: i < blogs.length ? blogs[i + 1] : null,
        next: i > 0 ? blogs[i - 1] : null
      } as BlogMeta;

      return item;
    });
};
