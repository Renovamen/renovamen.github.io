import { getCollection, type CollectionEntry } from "astro:content";

export const getPostDate = (id: string) => id.split("/").pop()!.substring(0, 10);

export const getPosts = async (lang?: string) =>
  await getCollection(
    "blog",
    ({ id, data }) =>
      (lang ? (lang === "zh" ? id.startsWith("zh/") : !id.startsWith("zh/")) : true) &&
      !data.draft
  );

export const getSortedPosts = (posts: CollectionEntry<"blog">[]) =>
  posts.sort((a, b) => getPostDate(b.id).localeCompare(getPostDate(a.id)));

export const getSortedPostsByYear = (posts: CollectionEntry<"blog">[]) => {
  const sortedPosts = getSortedPosts(posts);
  const map: Record<string, CollectionEntry<"blog">[]> = {};

  for (const p of sortedPosts) {
    const y = getPostDate(p.id).substring(0, 4);
    map[y] ? map[y].push(p) : (map[y] = [p]);
  }

  return map;
};

export const getPostsByTag = (posts: CollectionEntry<"blog">[], tag: string) =>
  posts.filter((post) => post.data.tags?.includes(tag));
