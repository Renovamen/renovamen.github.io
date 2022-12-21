export const useTags = () => {
  const router = useRouter();

  const tagMap = computed(() => router.currentRoute.value.meta?.tagMap);
  const tags = computed(() =>
    Object.keys(tagMap.value || {}).sort(
      (a, b) => tagMap.value[b].blogs.length - tagMap.value[a].blogs.length
    )
  );

  return { tagMap, tags };
};
