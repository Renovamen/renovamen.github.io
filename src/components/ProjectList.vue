<template>
  <template v-for="key in Object.keys(projects)" :key="key">
    <h3>{{ key }}</h3>
    <div class="grid grid-cols-1 sm:grid-cols-2 py-2 gap-2">
      <a
        v-for="(item, i) in projects[key]"
        :key="i"
        class="relative flex items-center space-x-5 p-4 !no-underline"
        border="1 gray-200 dark:gray-600 hover:transparent"
        bg="hover:gray-100 dark:hover:gray-600"
        :href="item.link"
        :title="item.name"
        rel="noopener noreferrer"
        target="_blank"
      >
        <div class="flex-auto">
          <div class="text-normal hstack">
            <span>{{ item.name }}</span>
            <div v-if="item.cn" i-icon-park-outline:chinese ml-1 text-sm />
          </div>
          <div class="text-sm opacity-50 font-normal mt-1" v-html="item.desc" />
        </div>
        <div v-if="item.icon" class="pt-2">
          <OhCV v-if="item.icon === 'oh-cv'" class="text-3xl opacity-60" />
          <OhVueIcons
            v-if="item.icon === 'oh-vue-icons'"
            class="text-3xl opacity-60"
          />
          <div
            v-else
            class="text-3xl opacity-50"
            :class="item.icon || 'i-carbon-unknown'"
          />
        </div>
      </a>
    </div>
  </template>
</template>

<script setup lang="ts">
defineProps<{ projects: Record<string, any[]> }>();
</script>
