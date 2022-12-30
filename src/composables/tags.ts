export const useTags = () => {
  const router = useRouter();

  const tagMap = computed(() => router.currentRoute.value.meta?.tagMap);
  const tags = computed(() =>
    Object.keys(tagMap.value || {}).sort((a, b) => {
      const la = tagMap.value[a].blogs.length;
      const lb = tagMap.value[b].blogs.length;

      if (la === lb) return a.localeCompare(b);
      return lb - la;
    })
  );

  return { tagMap, tags };
};
