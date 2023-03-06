import { z } from "astro:content";

export const blogSchema = z
  .object({
    author: z.string().optional(),
    title: z.string(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional()
  })
  .strict();

export type BlogFrontmatter = z.infer<typeof blogSchema>;
