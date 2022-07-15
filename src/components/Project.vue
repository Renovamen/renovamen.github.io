<template>
  <a
    class="relative flex items-center space-x-5 p-4 !no-underline"
    border="1 gray-200 dark:gray-600 hover:transparent"
    bg="hover:gray-100 dark:hover:gray-600"
    :href="item.link"
    :title="item.name"
    rel="noopener noreferrer"
    target="_blank"
  >
    <div class="flex-auto">
      <div class="text-normal hstack space-x-2">
        <span>{{ item.name }}</span>
        <span v-if="star" hstack space-x-1 opacity-60>
          <div i-ph:star text-xs />
          <span text-sm>{{ star }}</span>
        </span>
      </div>
      <div class="text-sm opacity-50 font-normal mt-1" v-html="item.desc" />
    </div>
    <div class="pt-2 text-3xl opacity-50">
      <OhVueIcons v-if="item.icon === 'oh-vue-icons'" />
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
