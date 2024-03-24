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

  return sortedPosts.reduce<Record<string, CollectionEntry<"blog">[]>>((acc, post) => {
    const year = getPostDate(post.id).substring(0, 4);
    acc[year] ? acc[year].push(post) : (acc[year] = [post]);
    return acc;
  }, {});
};

export const getPostsByTag = (posts: CollectionEntry<"blog">[], tag: string) =>
  posts.filter((post) => post.data.tags?.includes(tag));
