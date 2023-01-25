export const useLang = () => {
  const route = useRoute();

  const lang = computed<string | undefined>(() => {
    if (!route.path.startsWith("/posts")) return undefined; // not in "posts" folder

    const list = route.path.split("/");

    if (list.length > 2 && list[2] === "zh") return "zh";
    return "en";
  });

  return lang;
};
