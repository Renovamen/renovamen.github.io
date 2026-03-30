import { onMount, createSignal, Show, Switch, Match, For } from "solid-js";
import type { Component } from "solid-js";
import { OhVueIcons, OhMyCV } from "./icons";
import type { ProjectItem } from "@/types";

export const Project: Component<{ project: ProjectItem }> = (props) => {
  const [star, setStar] = createSignal<number>();

  const getRepoStars = async (repo: string) => {
    const response = await fetch(`https://api.github.com/repos/${repo}`);
    if (!response.ok) throw new Error(`Failed to fetch repo metadata for ${repo}`);

    const data = await response.json();
    return typeof data.stargazers_count === "number" ? data.stargazers_count : undefined;
  };

  onMount(async () => {
    if (!props.project.repo) return;

    try {
      const stargazersCount = await getRepoStars(props.project.repo);
      if (stargazersCount != null) setStar(stargazersCount);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <a
      class="relative hstack gap-x-5 p-4 !no-underline !text-fg"
      border="~ border/60 hover:transparent"
      bg="hover:bg-dark"
      href={props.project.link}
      title={props.project.name}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div flex-auto h-full>
        <div class="hstack flex-wrap">
          <div whitespace-nowrap mr-3>
            {props.project.name}
          </div>
          <div hstack gap-x-2>
            <For each={props.project.tech}>
              {(icon) => <span class={`text-xs ${icon}`} />}
            </For>

            <Show when={star()}>
              <span hstack gap-x-1>
                <span i-noto-v1:star text-xs />
                <span class="text-sm mt-0.5">{star()}</span>
              </span>
            </Show>
          </div>
        </div>
        <div mt-1 text="sm fg-light" innerHTML={props.project.desc} />
      </div>

      <div pt-2 text="3xl fg-light">
        <Switch fallback={<div class={props.project.icon || "i-carbon-unknown"} />}>
          <Match when={props.project.icon === "oh-vue-icons"}>
            <OhVueIcons />
          </Match>
          <Match when={props.project.icon === "oh-my-cv"}>
            <OhMyCV />
          </Match>
        </Switch>
      </div>
    </a>
  );
};

export default Project;
