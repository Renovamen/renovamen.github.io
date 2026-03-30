import { slugify } from "@renovamen/utils";
import { getCollection, type CollectionEntry } from "astro:content";
import { getTags } from "./tags";

export const getPostDate = (id: string) => id.split("/").pop()!.substring(0, 10);

export const getPosts = async (lang?: string) => {
  const posts = await getCollection("blog");

  return posts.filter(({ id, data }) => {
    const isLangMatch =
      lang === "zh" ? id.startsWith("zh/") : lang ? !id.startsWith("zh/") : true;
    return isLangMatch && !data.draft;
  });
};

export const getSortedPosts = (posts: CollectionEntry<"blog">[]) =>
  [...posts].sort((a, b) => getPostDate(b.id).localeCompare(getPostDate(a.id)));

export const getSortedPostsByYear = (posts: CollectionEntry<"blog">[]) => {
  const sortedPosts = getSortedPosts(posts);

  return sortedPosts.reduce(
    (acc, post) => {
      const year = getPostDate(post.id).slice(0, 4);
      (acc[year] ||= []).push(post);
      return acc;
    },
    {} as Record<string, CollectionEntry<"blog">[]>
  );
};

export const getPostsByTag = (posts: CollectionEntry<"blog">[], tag: string) =>
  posts.filter((post) => post.data.tags?.includes(tag));

export const getPostStaticPaths = async (lang: "en" | "zh") =>
  (await getPosts(lang)).map((post) => ({
    params: { id: lang === "zh" ? post.id.split("/")[1] : post.id },
    props: { post }
  }));

export const getTagStaticPaths = async (lang: "en" | "zh") => {
  const posts = await getPosts(lang);
  const { tags } = getTags(posts);

  return tags.map((tag) => ({
    params: { tag: slugify(tag) },
    props: { tag }
  }));
};
