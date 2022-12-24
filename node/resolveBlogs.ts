import fs from "fs-extra";
import matter from "gray-matter";
import { readingTime, lastUpdated } from "./blog";
import { resolvePath } from "./utils";
import { getBlogs, type BlogMeta } from "../shared";

const isBlog = (route: any) =>
  route.path.startsWith("/posts") &&
  route.path !== "/posts" &&
  !route.path.startsWith("/posts/tags");

export const resolveBlogFile = (route: any) => {
  if (!isBlog(route)) return;

  const path = resolvePath(route.component.slice(1));
  const md = fs.readFileSync(path, "utf-8");
  const { content, data } = matter(md);

  route.meta = Object.assign(route.meta || {}, {
    frontmatter: data,
    layout: "post",
    date: route.path.substring(7, 17),
    readingTime: readingTime(content),
    lastUpdated: lastUpdated(path)
  } as BlogMeta);

  return route;
};

export const resolveBlogList = (routes: any[]) => {
  const blogs = getBlogs(routes);

  return routes.filter(isBlog).map((item) => {
    const i = blogs.findIndex((blog) => blog.path === item.path);

    item.meta = {
      ...item.meta,
      prev: i < blogs.length ? blogs[i + 1] : null,
      next: i > 0 ? blogs[i - 1] : null
    } as BlogMeta;

    return item;
  });
};
