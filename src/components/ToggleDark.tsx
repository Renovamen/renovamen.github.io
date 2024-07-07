import { createEffect, type Component, type Signal } from "solid-js";
import { useColorMode, useCycleList, type BasicColorSchema } from "solidjs-use";

const modes: BasicColorSchema[] = ["auto", "light", "dark"];

export const ToggleDark: Component = () => {
  const { mode, setMode } = useColorMode({
    emitAuto: true
  });

  const { state, next } = useCycleList(modes, {
    initialValue: [mode, setMode] as Signal<BasicColorSchema>
  });

  createEffect(() => {
    const classes = document.documentElement.classList;

    classes.value = Array.from(classes)
      .filter((c) => !c.startsWith("theme-"))
      .join(" ");

    classes.add(`theme-${state()}`);
  });

  return (
    <button
      class="nav-item flex-center relative size-5"
      aria-label="Toggle dark"
      onClick={() => next()}
    >
      <div class="i-material-symbols:night-sight-auto-rounded theme-icon theme-auto:theme-icon-cur theme-light:theme-icon-prev theme-dark:theme-icon-next" />
      <div class="i-carbon:sun theme-icon theme-light:theme-icon-cur theme-dark:theme-icon-prev theme-auto:theme-icon-next" />
      <div class="i-carbon:moon theme-icon theme-dark:theme-icon-cur theme-auto:theme-icon-prev theme-light:theme-icon-next" />
    </button>
  );
};

export default ToggleDark;
