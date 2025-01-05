import type { CollectionEntry } from "astro:content";

export const getTags = (posts: CollectionEntry<"blog">[]) => {
  const numPostsPerTag = posts.reduce(
    (acc, post) => {
      post.data.tags?.forEach((tag) => {
        acc[tag] = (acc[tag] ?? 0) + 1;
      });
      return acc;
    },
    {} as Record<string, number>
  );

  const tags = Object.entries(numPostsPerTag)
    .sort(([tagA, countA], [tagB, countB]) => countB - countA || tagA.localeCompare(tagB))
    .map(([tag]) => tag);

  numPostsPerTag["all"] = posts.length;

  return { tags, numPostsPerTag };
};
