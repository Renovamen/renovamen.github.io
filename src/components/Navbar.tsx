import { onMount, createEffect, createSignal, type Component } from "solid-js";
import { useScroll, useDark } from "solidjs-use";
import ToggleToc from "@components/ToggleToc";

export const Navbar: Component<{
  activePage?: string;
  hasToc?: boolean;
}> = (props) => {
  const [isDark, setDark] = useDark();
  const [isFixed, setIsFixed] = createSignal(false);
  const [isVisible, setIsVisible] = createSignal(false);

  // eslint-disable-next-line prefer-const
  let navbar: HTMLElement | undefined = undefined;

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
        if (navbar && y() > navbar.offsetHeight) setIsFixed(true);
      }
    });
  });

  return (
    <header
      ref={navbar}
      class={`z-30 w-full h-14 hstack justify-between bg-c font-ui px-4 md:px-5 ${
        isFixed() && "fixed -top-14 left-0 transition duration-300 border-b border-c"
      } ${isVisible() && "translate-y-full shadow-nav"} ${
        !isFixed() && !isVisible() && "absolute top-0 left-0"
      }`}
    >
      <a font-bold text="c-light hover:c-dark" href="/">
        <span text-lg>hi@zxh</span>
        <div i-fa6-solid:angle-right class="prompt inline-block" />
        <span class="blink">_</span>
      </a>

      <nav hstack space-x-4>
        <a nav-item href="/projects" title="Projects">
          <div i-ph:rocket-launch-duotone class="md:hidden" />
          <span class={`lt-md:hidden ${props.activePage === "projects" && "active"}`}>
            Projects
          </span>
        </a>

        <a nav-item href="/posts" title="Blog">
          <div i-majesticons:pencil-line class="md:hidden" />
          <span class={`lt-md:hidden ${props.activePage === "posts" && "active"}`}>
            Blog
          </span>
        </a>

        <a nav-item href="/search" title="Search">
          <span i-uil:search />
        </a>

        <button nav-item title="Toggle dark" onClick={() => setDark(!isDark())}>
          <div i="carbon-sun dark:carbon-moon" />
        </button>

        {props.hasToc && <ToggleToc />}
      </nav>
    </header>
  );
};

export default Navbar;
