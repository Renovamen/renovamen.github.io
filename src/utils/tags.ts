import type { CollectionEntry } from "astro:content";

export const getTags = (posts: CollectionEntry<"blog">[]) => {
  const numPostsPerTag: Record<string, number> = { all: posts.length };

  for (const post of posts) {
    for (const tag of post.data.tags ?? []) {
      numPostsPerTag[tag] = (numPostsPerTag[tag] ?? 0) + 1;
    }
  }

  const tags = Object.entries(numPostsPerTag)
    .filter(([tag]) => tag !== "all")
    .sort(([tagA, countA], [tagB, countB]) => countB - countA || tagA.localeCompare(tagB))
    .map(([tag]) => tag);

  return { tags, numPostsPerTag };
};
