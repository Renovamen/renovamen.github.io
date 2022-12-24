import dayjs from "dayjs";
import type { RouteMeta } from "vue-router";
import type { ReadingTime } from "../node/blog";

export interface BlogFrontmatter {
  title: string;
}

export interface BlogType {
  path: string;
  title: string;
  date: string;
}

export interface BlogMeta extends RouteMeta {
  frontmatter: BlogFrontmatter;
  layout: "post";
  date: string;
  readingTime: ReadingTime;
  lastUpdated: string;
  prev: BlogType | null;
  next: BlogType | null;
}

export const getBlogs = (routes: any[], tag?: string): BlogType[] =>
  routes
    .filter((item: any) => item.meta?.layout === "post")
    .filter((item: any) =>
      tag ? item.meta.frontmatter.tags?.includes(tag) : true
    )
    .map(
      (item: any): BlogType => ({
        path: item.path,
        title: item.meta.frontmatter.title,
        date: item.meta.date
      })
    )
    .sort((a, b) => dayjs(b.date).unix() - dayjs(a.date).unix());
