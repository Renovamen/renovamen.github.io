import { onMount, createSignal, type Component } from "solid-js";
import { OhVueIcons, OhMyCV } from "./icons";
import type { ProjectItem } from "@types";

export const Project: Component<{ project: ProjectItem }> = (props) => {
  /* eslint-disable-next-line solid/reactivity */
  const api = "https://api.github.com/repos/" + props.project.repo;
  const [star, setStar] = createSignal<string>();

  const getRepoStars = async () => {
    const data = await fetch(api).then((res) => res.json());
    return data.stargazers_count;
  };

  onMount(async () => props.project.repo && setStar(await getRepoStars()));

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
      <div flex-auto>
        <div class="hstack flex-wrap">
          <div whitespace-nowrap mr-3>
            {props.project.name}
          </div>
          <div hstack space-x-2>
            {props.project.tech &&
              props.project.tech.map((icon) => <span class={`text-xs ${icon}`} />)}

            {star() && (
              <span hstack gap-x-1>
                <span i-noto-v1:star text-xs />
                <span class="text-sm mt-0.5">{star()}</span>
              </span>
            )}
          </div>
        </div>
        <div mt-1 text="sm fg-light" innerHTML={props.project.desc} />
      </div>

      <div pt-2 text="3xl fg-light">
        {props.project.icon === "oh-vue-icons" ? (
          <OhVueIcons />
        ) : props.project.icon === "oh-my-cv" ? (
          <OhMyCV />
        ) : (
          <div class={props.project.icon || "i-carbon-unknown"} />
        )}
      </div>
    </a>
  );
};

export default Project;
