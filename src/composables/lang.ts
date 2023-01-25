export const useLang = () => {
  const route = useRoute();

  const lang = computed<string | undefined>(() => {
    if (!route.path.startsWith("/posts")) return undefined; // not in "posts" folder

    const list = route.path.split("/");
    return list.length === 2 || list[2] === "tags" ? "en" : list[2];
  });

  return lang;
};
