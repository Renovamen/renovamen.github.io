import type { RouteMeta } from "vue-router";
import { resolve } from "path";
import fs from "fs-extra";
import matter from "gray-matter";
import dayjs from "dayjs";
import { readingTime, type ReadingTime } from "./readingTime";

export interface BlogFrontmatter {
  title: string;
}

export interface BlogPager {
  path: string;
  title: string;
  date: string;
}

export interface BlogMeta extends RouteMeta {
  frontmatter: BlogFrontmatter;
  layout: "post";
  date: string;
  readingTime: ReadingTime;
  prev: BlogPager | null;
  next: BlogPager | null;
}

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
  } as BlogMeta);

  return route;
};

export const resolveBlogList = (routes: any[]) => {
  const blogs = routes
    .filter((item: any) => item.meta?.layout === "post")
    .map((item: any) => ({
      path: item.path,
      title: item.meta.frontmatter.title,
      date: item.meta.date
    }))
    .sort((a: any, b: any) => dayjs(b.date).unix() - dayjs(a.date).unix());

  return routes.map((item) => {
    const i = blogs.findIndex((blog) => blog.path === item.path);

    item.meta = {
      ...item.meta,
      prev: i < blogs.length ? blogs[i + 1] : null,
      next: i > 0 ? blogs[i - 1] : null
    };

    return item;
  });
};
