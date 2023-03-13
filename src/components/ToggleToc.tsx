import { onMount, createSignal, type Component } from "solid-js";
import { useWindowSize } from "solidjs-use";

export const ToggleToc: Component = () => {
  const { width } = useWindowSize();
  const [isToc, setIsToc] = createSignal(false);
  const [isTocOpen, setIsTocOpen] = createSignal(width() > 1200);

  onMount(() => {
    const toc = document.querySelector(".table-of-contents");
    setIsToc(toc ? true : false);
    handleClass();
  });

  const toggleToc = () => {
    setIsTocOpen(!isTocOpen());
    handleClass();
  };

  const handleClass = () => {
    const html = document.querySelector("html") as HTMLElement;
    if (isTocOpen()) html.classList.add("toc-open");
    else html.classList.remove("toc-open");
  };

  return (
    <>
      {isToc() && (
        <button class="nav-item ml-4" title="Toggle toc" onClick={toggleToc}>
          {isTocOpen() ? <div i-ri:menu-3-line /> : <div i-ri:menu-fold-line />}
        </button>
      )}
    </>
  );
};

export default ToggleToc;
