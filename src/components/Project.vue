<template>
  <a
    class="relative flex items-center space-x-5 p-4 !no-underline !text-c"
    border="1 c hover:transparent"
    bg="hover:gray-100 dark:hover:gray-600"
    :href="item.link"
    :title="item.name"
    target="_blank"
    rel="noopener noreferrer"
  >
    <div class="flex-auto">
      <div class="text-normal hstack space-x-2">
        <span mr-1>{{ item.name }}</span>
        <span
          v-for="icon of item.tech"
          :key="`${item.name}-${icon}`"
          class="text-xs"
          :class="icon"
        />
        <span v-if="star" hstack space-x-1>
          <span i-noto-v1:star text-xs />
          <span class="text-sm mt-0.5">{{ star }}</span>
        </span>
      </div>
      <div class="text-sm opacity-50 font-normal mt-1" v-html="item.desc" />
    </div>
    <div class="pt-2 text-3xl opacity-50">
      <OhVueIcons v-if="item.icon === 'oh-vue-icons'" />
      <OhCV v-else-if="item.icon === 'oh-cv'" />
      <div v-else :class="item.icon || 'i-carbon-unknown'" />
    </div>
  </a>
</template>

<script setup lang="ts">
const props = defineProps<{ item: any }>();

const api = "https://api.github.com/repos/" + props.item.repo;
const star = ref(null);

const getRepoStars = async () => {
  const data = await fetch(api).then((res) => res.json());
  return data.stargazers_count;
};

onMounted(async () => props.item.repo && (star.value = await getRepoStars()));
</script>
