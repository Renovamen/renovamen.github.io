<template>
  <a
    class="relative hstack space-x-5 p-4 !no-underline !text-c"
    border="1 c hover:transparent"
    bg="hover:gray-100 dark:hover:gray-600"
    :href="project.link"
    :title="project.name"
    target="_blank"
    rel="noopener noreferrer"
  >
    <div class="flex-auto">
      <div class="text-normal hstack space-x-2">
        <span mr-1>{{ project.name }}</span>
        <span
          v-for="icon of project.tech"
          :key="`${project.name}-${icon}`"
          class="text-xs"
          :class="icon"
        />
        <span v-if="star" hstack space-x-1>
          <span i-noto-v1:star text-xs />
          <span class="text-sm mt-0.5">{{ star }}</span>
        </span>
      </div>
      <div class="text-sm opacity-50 font-normal mt-1" v-html="project.desc" />
    </div>
    <div class="pt-2 text-3xl opacity-50">
      <OhVueIcons v-if="project.icon === 'oh-vue-icons'" />
      <OhMyCV v-else-if="project.icon === 'oh-my-cv'" />
      <div v-else :class="project.icon || 'i-carbon-unknown'" />
    </div>
  </a>
</template>

<script setup lang="ts">
import type { ProjectItem } from "@types";
import OhVueIcons from "./icons/OhVueIcons.vue";
import OhMyCV from "./icons/OhMyCV.vue";

const props = defineProps<{ project: ProjectItem }>();

const api = "https://api.github.com/repos/" + props.project.repo;
const star = ref(null);

const getRepoStars = async () => {
  const data = await fetch(api).then((res) => res.json());
  return data.stargazers_count;
};

onMounted(async () => props.project.repo && (star.value = await getRepoStars()));
</script>
