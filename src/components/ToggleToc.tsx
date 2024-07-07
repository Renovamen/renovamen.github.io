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
    if (isTocOpen()) document.documentElement.classList.add("toc-open");
    else document.documentElement.classList.remove("toc-open");
  };

  onMount(handleClass);

  return (
    <button class="nav-item" aria-label="Toggle toc" onClick={toggleToc}>
      {isTocOpen() ? <div i-ri:menu-3-line /> : <div i-ri:menu-fold-line />}
    </button>
  );
};

export default ToggleToc;
