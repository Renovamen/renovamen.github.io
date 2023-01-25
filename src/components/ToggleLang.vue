<template>
  <span text-c-lighter text-2xl>
    <router-link class="link" to="/posts">EN</router-link> /
    <router-link class="link" to="/posts/zh">中文</router-link>
  </span>
</template>

<style scoped>
.link {
  @apply font-bold text-c-lighter !opacity-100;
}
</style>
