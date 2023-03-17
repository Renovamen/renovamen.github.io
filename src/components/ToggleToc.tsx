import { onMount, createSignal, type Component } from "solid-js";
import { useWindowSize } from "solidjs-use";

export const ToggleToc: Component = () => {
  const { width } = useWindowSize();
  const [isTocOpen, setIsTocOpen] = createSignal(width() > 1200);

  const toggleToc = () => {
    setIsTocOpen(!isTocOpen());
    handleClass();
  };

  const handleClass = () => {
    const html = document.querySelector("html") as HTMLElement;
    if (isTocOpen()) html.classList.add("toc-open");
    else html.classList.remove("toc-open");
  };

  onMount(handleClass);

  return (
    <button class="nav-item ml-4" title="Toggle toc" onClick={toggleToc}>
      {isTocOpen() ? <div i-ri:menu-3-line /> : <div i-ri:menu-fold-line />}
    </button>
  );
};

export default ToggleToc;
