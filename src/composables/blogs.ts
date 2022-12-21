import dayjs from "dayjs";
import type { ComputedRef } from "vue";

type BlogType = {
  path: string;
  title: string;
  date: string;
};

export const useBlog = (tag?: ComputedRef<string | undefined>) => {
  const router = useRouter();

  const blogs = computed<BlogType[]>(() =>
    router
      .getRoutes()
      .filter((i: any) => i.meta.layout === "post")
      .filter((i: any) =>
        tag?.value ? i.meta.frontmatter.tags?.includes(tag.value) : true
      )
      .map(
        (i: any): BlogType => ({
          path: i.path,
          title: i.meta.frontmatter.title,
          date: i.meta.date
        })
      )
      .sort(
        (a: BlogType, b: BlogType) =>
          dayjs(b.date).unix() - dayjs(a.date).unix()
      )
  );

  const yearToBlog = computed(() => {
    const map: Record<string, BlogType[]> = {};

    for (const b of blogs.value) {
      const y = b.date.substring(0, 4);
      map[y] ? map[y].push(b) : (map[y] = [b]);
    }

    return map;
  });

  return { blogs, yearToBlog };
};
