import type { CollectionEntry } from "astro:content";

export const getTags = (posts: CollectionEntry<"blog">[]) => {
  const numPostsPerTag = posts.reduce<Record<string, number>>((acc, post) => {
    post.data.tags?.forEach((tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {});

  const tags = Object.keys(numPostsPerTag).sort(
    (a, b) => numPostsPerTag[b] - numPostsPerTag[a] || a.localeCompare(b)
  );

  numPostsPerTag["all"] = posts.length;

  return { tags, numPostsPerTag };
};
