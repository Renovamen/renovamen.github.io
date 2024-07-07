import { createSignal, Show, type Component } from "solid-js";

export const TocButtons: Component<{ prev?: string; next?: string }> = (props) => {
  const tips = ["Last Post", "Next Post", "Back to Top", "Print"];
  const [tipId, setTipId] = createSignal(0);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const print = () => window.print();

  return (
    <div class="table-of-contents-btns fixed z-20 pl-2">
      <div hstack justify-end pt-18 pb-2 bg-bg>
        <Show when={tipId}>
          <span text="sm fg-light" italic mr-3>
            {tips[tipId() - 1]}
          </span>
        </Show>

        <Show when={props.prev}>
          <a
            class="flex-center text-fg! hover:opacity-75"
            href={`/posts/${props.prev}`}
            onMouseEnter={() => setTipId(1)}
            onMouseLeave={() => setTipId(0)}
          >
            <span i-ic:round-keyboard-arrow-left text-xl />
          </a>
        </Show>

        <Show when={props.next}>
          <a
            href={`/posts/${props.next}`}
            class="flex-center text-fg! hover:opacity-75"
            onMouseEnter={() => setTipId(2)}
            onMouseLeave={() => setTipId(0)}
          >
            <span i-ic:round-keyboard-arrow-right text-xl />
          </a>
        </Show>

        <button
          onClick={scrollTop}
          flex-center
          hover:opacity-60
          onMouseEnter={() => setTipId(3)}
          onMouseLeave={() => setTipId(0)}
        >
          <span i-ic:round-keyboard-arrow-up text-xl />
        </button>

        <button
          onClick={print}
          class="flex-center hover:opacity-75 ml-1.5"
          onMouseEnter={() => setTipId(4)}
          onMouseLeave={() => setTipId(0)}
        >
          <span i-mi:print text-sm />
        </button>
      </div>
    </div>
  );
};

export default TocButtons;
