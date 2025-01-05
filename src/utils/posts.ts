import { getCollection, type CollectionEntry } from "astro:content";

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
  posts.sort((a, b) => getPostDate(b.id).localeCompare(getPostDate(a.id)));

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
