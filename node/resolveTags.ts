import fs from "fs-extra";
import fg from "fast-glob";
import matter from "gray-matter";
import { slugify } from "@renovamen/utils";
import { resolvePath } from "./utils";

const prefix = "/posts/tags/";

export const resolveTags = (routes: any[]) => {
  const tagMap = {} as { [key: string]: { path: string; blogs: string[] } };

  routes
    .filter((item) => item.meta?.layout === "post")
    .forEach((item) => {
      item.meta.frontmatter.tags?.forEach((tag: string) => {
        if (tag in tagMap) tagMap[tag].blogs.push(item.path);
        else
          tagMap[tag] = {
            path: `${prefix}${slugify(tag)}`,
            blogs: [item.path]
          };
      });
    });

  return routes.map((item) => {
    if (item.path === "/posts" || item.path.startsWith(prefix)) {
      if (!item.meta) item.meta = {};
      item.meta.tagMap = tagMap;
    }
    return item;
  });
};

export const getTagPathsFromFiles = async (
  sourceDir: string,
  exclude?: string[]
) => {
  sourceDir = resolvePath(sourceDir);

  const files = await fg("**/*.md", { cwd: sourceDir, ignore: exclude });
  const tags: Set<string> = new Set();

  await Promise.all(
    files.map(async (f) => {
      const raw = await fs.readFile(`${sourceDir}/${f}`);
      const { data } = matter(raw);
      data.tags?.forEach((tag: string) => tags.add(`${prefix}${slugify(tag)}`));
    })
  );

  return [...tags];
};
