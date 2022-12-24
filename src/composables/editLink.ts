import { editLink } from "../../shared";

export function useEditLink() {
  const route = useRoute();

  return computed(() => {
    const { text, pattern } = editLink;
    const url = pattern.replace(/:path/g, route.path + ".md");
    return { url, text };
  });
}
