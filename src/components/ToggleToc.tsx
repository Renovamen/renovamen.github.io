import { createEffect, createSignal, onMount, type Component } from "solid-js";
import { useWindowSize } from "solidjs-use";

export const ToggleToc: Component = () => {
  const { width } = useWindowSize();
  const [isTocOpen, setIsTocOpen] = createSignal(false);
  let previousIsDesktop: boolean | undefined;

  const toggleToc = () => {
    setIsTocOpen(!isTocOpen());
    handleClass();
  };

  const handleClass = () => {
    if (isTocOpen()) document.documentElement.classList.add("toc-open");
    else document.documentElement.classList.remove("toc-open");
  };

  createEffect(() => {
    const isDesktop = width() > 1200;

    // Only resync when crossing the desktop breakpoint, so manual toggles persist.
    if (previousIsDesktop === undefined || previousIsDesktop !== isDesktop) {
      previousIsDesktop = isDesktop;
      setIsTocOpen(isDesktop);
    }
  });

  createEffect(handleClass);
  onMount(handleClass);

  return (
    <button class="nav-item" aria-label="Toggle toc" onClick={toggleToc}>
      {isTocOpen() ? <div i-ri:menu-3-line /> : <div i-ri:menu-fold-line />}
    </button>
  );
};

export default ToggleToc;
