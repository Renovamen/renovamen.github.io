import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

export const blogSchema = z
  .object({
    author: z.string().optional(),
    title: z.string(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional()
  })
  .strict();

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: blogSchema
});

export const collections = { blog };
