import { onMount, createEffect, createSignal, Show, type Component } from "solid-js";
import { useScroll } from "solidjs-use";
import ToggleDark from "@components/ToggleDark";
import ToggleToc from "@components/ToggleToc";

export const Navbar: Component<{
  activePage?: string;
  hasToc?: boolean;
}> = (props) => {
  const [isFixed, setIsFixed] = createSignal(false);
  const [isVisible, setIsVisible] = createSignal(false);

  const [navbar, setNavbar] = createSignal<HTMLDivElement>();

  onMount(() => {
    const { y, directions } = useScroll(document);

    createEffect(() => {
      if (directions.top) {
        // scrolling up
        if (y() > 0 && isFixed()) setIsVisible(true);
        else {
          setIsVisible(false);
          setIsFixed(false);
        }
      } else if (directions.bottom) {
        // scrolling down
        setIsVisible(false);
        if (y() > (navbar()?.offsetHeight ?? 0)) setIsFixed(true);
      }
    });
  });

  return (
    <header
      ref={setNavbar}
      class={`z-30 w-full h-14 hstack justify-between bg-bg font-ui px-4 md:px-5 ${
        isFixed() && "fixed -top-14 left-0 transition duration-300 border-b"
      } ${isVisible() && "translate-y-full shadow"} ${
        !isFixed() && !isVisible() && "absolute top-0 left-0"
      }`}
    >
      <a class="font-bold text-fg-light hover:text-fg-dark" href="/">
        <span text-lg>hi@zxh</span>
        <div class="prompt i-fa6-solid:angle-right inline-block" />
        <span class="blink">_</span>
      </a>

      <nav hstack gap-x-4>
        <a
          class={`nav-item ${props.activePage === "projects" && "nav-active"}`}
          href="/projects"
          aria-label="Projects"
        >
          <div i-ph:rocket-launch-duotone class="md:hidden" />
          <span lt-md:hidden>Projects</span>
        </a>

        <a
          class={`nav-item ${props.activePage === "posts" && "nav-active"}`}
          href="/posts"
          aria-label="Blog"
        >
          <div i-majesticons:pencil-line class="md:hidden" />
          <span lt-md:hidden>Blog</span>
        </a>

        <a
          class={`nav-item ${props.activePage === "search" && "nav-active"}`}
          href="/search"
          aria-label="Search"
        >
          <span i-uil:search />
        </a>

        <ToggleDark />

        <Show when={props.hasToc}>
          <ToggleToc />
        </Show>
      </nav>
    </header>
  );
};

export default Navbar;
