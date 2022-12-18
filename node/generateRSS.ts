// Credits: https://github.com/Zhengqbbb/qbb.sh/blob/main/build/node/rss.ts

import { resolve } from "path";
import fs from "fs-extra";
import fg from "fast-glob";
import matter from "gray-matter";
import { Feed, type Author, type FeedOptions } from "feed";
import { cyan, dim, gray, green, yellow } from "kolorist";
import { hostname, title, description, author } from "../src/meta";

const __sourceDir = resolve(__dirname, "../pages/posts");
const __output = "dist/";
const __outputDir = resolve(__dirname, "../", __output);

const getBlogs = async () => {
  const files = await fg("**/*.md", { cwd: __sourceDir, ignore: ["index.md"] });

  return (
    await Promise.all(
      files.map(async (f) => {
        const date = f.substring(0, 10);
        const raw = await fs.readFile(`${__sourceDir}/${f}`);
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

const generate = async () => {
  const siteOptions: FeedOptions = {
    title: title,
    description: description,
    id: hostname,
    link: hostname,
    author: { name: author, link: hostname },
    copyright: `© ${author} 2022`,
    feedLinks: {
      json: `${hostname}/feed.json`,
      atom: `${hostname}/feed.atom`,
      rss: `${hostname}/feed.xml`
    },
    favicon: `${hostname}/favicon.svg`
  };

  const feed = new Feed(siteOptions);
  const blogs = await getBlogs();

  blogs.forEach((item) => {
    feed.addItem({
      ...siteOptions,
      author: [siteOptions.author as Author],
      title: item.title,
      date: item.date,
      description: "",
      id: `${hostname}/${item.path}`,
      link: `${hostname}/${item.path}`
    });
  });

  await fs.ensureDir(__outputDir);
  await fs.writeFile(resolve(__outputDir, "feed.xml"), feed.rss2(), "utf-8");
  await fs.writeFile(resolve(__outputDir, "feed.atom"), feed.atom1(), "utf-8");
  await fs.writeFile(resolve(__outputDir, "feed.json"), feed.json1(), "utf-8");

  return ["feed.xml", "feed.atom", "feed.json"];
};

export const generateRSS = async () => {
  const start = new Date().getTime();
  console.log(`${gray("[rss]")} ${yellow("Generating RSS...")}`);

  const files = await generate();
  files?.filter(Boolean).forEach((i) => {
    console.log(dim(__output) + cyan(i));
  });

  console.log(
    `${green("✓")} Generated RSS in ${((Date.now() - start) / 1000).toFixed(
      2
    )}s`
  );
};
