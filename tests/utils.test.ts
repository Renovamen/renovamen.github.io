import assert from "node:assert/strict";
import test from "node:test";
import path from "node:path";
import { sync } from "cross-spawn";
import { formatDate, lastUpdated } from "../src/utils/others.ts";
import { readingTime } from "../src/utils/readingTime.ts";
import { getTags } from "../src/utils/tags.ts";

test("formatDate formats supported output variants", () => {
  assert.equal(formatDate("2024-02-03"), "Feb 3, 2024");
  assert.equal(formatDate("2024-02-03", 1), "Feb 3");
  assert.equal(formatDate("2024-02-03", 2), "2024/02");
});

test("lastUpdated resolves git timestamp for blog content files", () => {
  const postId = "2022-12-19-monocular-visual-odometry";
  const file = path.resolve("src/content/blog", `${postId}.md`);
  const expected = new Date(
    sync("git", ["log", "-1", '--pretty="%ci"', file]).stdout.toString().trim()
  ).toLocaleString();

  assert.equal(lastUpdated(postId), expected);
});

test("readingTime counts mixed-language content and can exclude blocks", () => {
  const text = `Hello world
你好世界
\`\`\`ts
const hidden = true;
\`\`\`
$$
E = mc^2
$$`;

  assert.deepEqual(readingTime(text), { minutes: 1, words: 13 });
  assert.deepEqual(readingTime(text, { excludeCodeBlock: true, excludeTexBlock: true }), {
    minutes: 1,
    words: 6
  });
});

test("getTags sorts by post count and then alphabetically", () => {
  const posts = [
    { data: { tags: ["css", "astro"] } },
    { data: { tags: ["typescript"] } },
    { data: { tags: ["astro", "typescript"] } },
    { data: {} }
  ] as Parameters<typeof getTags>[0];

  assert.deepEqual(getTags(posts), {
    tags: ["astro", "typescript", "css"],
    numPostsPerTag: {
      astro: 2,
      css: 1,
      typescript: 2,
      all: 4
    }
  });
});
