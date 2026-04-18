import assert from "node:assert/strict";
import test from "node:test";
import remarkDirective from "remark-directive";
import remarkParse from "remark-parse";
import { unified } from "unified";
import type { Root } from "mdast";
import type { Plugin } from "unified";
import { remarkCodeBlock } from "../plugins/codeBlock.ts";
import { remarkContainer } from "../plugins/container.ts";
import { remarkImage } from "../plugins/image.ts";

const runRemarkPlugin = (
  markdown: string,
  plugin: Plugin<[], Root>,
  useDirective = false
) => {
  const processor = unified().use(remarkParse);

  if (useDirective) {
    processor.use(remarkDirective);
  }

  processor.use(plugin);

  return processor.runSync(processor.parse(markdown)) as Root;
};

test("remarkCodeBlock wraps fenced code blocks once", () => {
  const tree = runRemarkPlugin("```ts\nconsole.log(1)\n```", remarkCodeBlock);

  assert.equal(tree.children.length, 3);
  assert.equal(tree.children[0].type, "paragraph");
  assert.equal(tree.children[1].type, "code");
  assert.equal(tree.children[2].type, "html");

  const start = tree.children[0];
  const end = tree.children[2];

  assert.equal(start.children[0]?.type, "html");
  assert.equal(start.children[0]?.value, '<div class="language-ts"><span class="lang">');
  assert.equal(start.children[1]?.type, "text");
  assert.equal(start.children[1]?.value, "ts");
  assert.equal(start.children[2]?.type, "html");
  assert.equal(start.children[2]?.value, "</span>");
  assert.equal(end.value, "</div>");
});

test("remarkContainer turns directive labels into block titles", () => {
  const tree = runRemarkPlugin("::::info[Notice]\nBody\n::::", remarkContainer, true);
  const container = tree.children[0];

  assert.equal(container.type, "containerDirective");
  assert.deepEqual(container.data?.hProperties, { class: ["custom-block", "info"] });
  assert.equal(container.data?.hName, "div");
  assert.equal(container.children[0]?.type, "paragraph");
  assert.equal(container.children[0]?.data?.hName, "p");
  assert.deepEqual(container.children[0]?.data?.hProperties, {
    class: "custom-block-title"
  });
  assert.equal(container.children[0]?.children[0]?.type, "text");
  assert.equal(container.children[0]?.children[0]?.value, "Notice");
  assert.equal(container.children[1]?.type, "paragraph");
});

test("remarkContainer ignores extra spaces in paper image lists", () => {
  const tree = runRemarkPlugin(
    "::::paper[/img/one.png   /img/two.jpg]\nBody\n::::",
    remarkContainer,
    true
  );
  const container = tree.children[0];

  assert.equal(container.type, "containerDirective");
  assert.deepEqual(container.data?.hProperties, { class: ["paper-block"] });
  assert.equal(container.children[0]?.type, "html");
  assert.match(container.children[0]?.value, /src="\/img\/one\.png"/);
  assert.match(container.children[0]?.value, /src="\/img\/two\.jpg"/);
  assert.equal(container.children[0]?.value.match(/<img /g)?.length, 2);
  assert.doesNotMatch(container.children[0]?.value, /src=""/);
});

test("remarkImage keeps figcaption content inline instead of nesting a paragraph", () => {
  const tree = runRemarkPlugin(
    '![Alt](/img/example.png) <!-- w=320 desc="caption *md*" -->',
    remarkImage
  );
  const paragraph = tree.children[0];

  assert.equal(paragraph.type, "paragraph");
  assert.equal(paragraph.children[0]?.type, "html");
  assert.equal(
    paragraph.children[0]?.value,
    '<figure alt="Alt"><img src="/img/example.png" alt="Alt" width="320" />'
  );
  assert.equal(paragraph.children[1]?.type, "html");
  assert.equal(paragraph.children[1]?.value, "<figcaption>");
  assert.equal(paragraph.children[2]?.type, "text");
  assert.equal(paragraph.children[2]?.value, "caption ");
  assert.equal(paragraph.children[3]?.type, "emphasis");
  assert.equal(paragraph.children[4]?.type, "html");
  assert.equal(paragraph.children[4]?.value, "</figcaption>");
  assert.equal(paragraph.children[5]?.type, "html");
  assert.equal(paragraph.children[5]?.value, "</figure>");
  assert.ok(
    !paragraph.children.some((child) => (child as { type: string }).type === "paragraph")
  );
});
