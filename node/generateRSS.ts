// Credits: https://github.com/Zhengqbbb/qbb.sh/blob/main/build/node/rss.ts

import * as path from "path";
import fs from "fs-extra";
import fg from "fast-glob";
import matter from "gray-matter";
import { Feed, type Author, type FeedOptions } from "feed";
import { cyan, dim, gray, green, yellow } from "kolorist";
import { resolvePath } from "./utils";

export interface RSSOptions {
  /**
   * Base URI
   * @default "http://localhost/"
   */
  hostname?: string;
  /**
   * Site title
   * @default ""
   */
  title?: string;
  /**
   * Site description
   * @default ""
   */
  description?: string;
  /**
   * Site author
   * @default ""
   */
  author?: string;
  /**
   * Copyright
   * @default "© ${author} 2022"
   */
  copyright?: string;
  /**
   * Source directory
   */
  sourceDir: string;
  /**
   * Output directory
   * @default "dist"
   */
  outDir?: string;
  /**
   * Array of strings with excluded files.
   * Example: ["file1.md", "dir/file2.md"]
   * @default []
   */
  exclude?: string[];
}

const resolveOptions = (options: RSSOptions) => {
  const copyright = `© ${options.author} 2022`;

  return Object.assign(
    {
      hostname: "http://localhost/",
      title: "",
      description: "",
      author: "",
      copyright: copyright,
      outDir: "dist",
      exclude: []
    },
    options
  );
};

const getBlogs = async (sourceDir: string, exclude?: string[]) => {
  sourceDir = resolvePath(sourceDir);
  const files = await fg("**/*.md", { cwd: sourceDir, ignore: exclude });

  return (
    await Promise.all(
      files.map(async (f) => {
        const date = f.substring(0, 10);
        const raw = await fs.readFile(`${sourceDir}/${f}`);
        const { data } = matter(raw);

        return {
          path: `posts/${f.replace(/\.md?/, "")}`,
          title: data.title,
          date: new Date(date)
        };
      })
    )
  ).sort((a, b) => b.date.getTime() - a.date.getTime());
};

const generate = async (options: RSSOptions) => {
  const siteOptions: FeedOptions = {
    title: options.title!,
    description: options.description,
    id: options.hostname!,
    link: options.hostname,
    author: { name: options.author, link: options.hostname },
    copyright: options.copyright!,
    feedLinks: {
      json: `${options.hostname}/feed.json`,
      atom: `${options.hostname}/feed.atom`,
      rss: `${options.hostname}/feed.xml`
    }
  };

  const feed = new Feed(siteOptions);
  const blogs = await getBlogs(options.sourceDir, options.exclude);

  blogs.forEach((item) => {
    feed.addItem({
      ...siteOptions,
      author: [siteOptions.author as Author],
      title: item.title,
      date: item.date,
      description: "",
      id: `${options.hostname}/${item.path}`,
      link: `${options.hostname}/${item.path}`
    });
  });

  const outDir = resolvePath(options.outDir!);

  await fs.ensureDir(outDir);
  await fs.writeFile(path.resolve(outDir, "feed.xml"), feed.rss2(), "utf-8");
  await fs.writeFile(path.resolve(outDir, "feed.atom"), feed.atom1(), "utf-8");
  await fs.writeFile(path.resolve(outDir, "feed.json"), feed.json1(), "utf-8");

  return ["feed.xml", "feed.atom", "feed.json"];
};

export const generateRSS = async (options: RSSOptions) => {
  options = resolveOptions(options);

  const start = new Date().getTime();
  console.log(`${gray("[rss]")} ${yellow("Generating RSS...")}`);

  const files = await generate(options);
  files?.filter(Boolean).forEach((i) => {
    console.log(dim(path.join(options.outDir!, cyan(i))));
  });

  console.log(
    `${green("✓")} Generated RSS in ${((Date.now() - start) / 1000).toFixed(
      2
    )}s`
  );
};
