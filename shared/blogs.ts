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

export const checkBlogLang = (path: string, lang: string) =>
  lang === "en" ? path.split("/").length === 3 : path.split("/")[2] === lang;

export const getBlogs = (
  routes: any[],
  options?: {
    tag?: string;
    lang?: string;
  }
): BlogType[] =>
  routes
    // is blog
    .filter((item: any) => item.meta?.layout === "post")
    // check language
    .filter((item: any) =>
      options?.lang ? checkBlogLang(item.path, options.lang) : true
    )
    // check tags
    .filter((item: any) =>
      options?.tag ? item.meta.frontmatter.tags?.includes(options.tag) : true
    )
    .map(
      (item: any): BlogType => ({
        path: item.path,
        title: item.meta.frontmatter.title,
        date: item.meta.date
      })
    )
    // sort by date (reverse order)
    .sort((a, b) => dayjs(b.date).unix() - dayjs(a.date).unix());
