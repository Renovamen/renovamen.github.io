<template>
  <Layout class="post">
    <div class="article-header mt-6 mb-8 mx-auto">
      <h1 class="text-3xl font-bold">{{ title }}</h1>
      <p class="opacity-50 mt-2">
        {{ formatDate(date) }} · {{ readingTime }} min
      </p>
    </div>
    <article ref="content">
      <RouterView />
    </article>
  </Layout>
</template>

<script setup lang="ts">
import { formatDate } from "~/utils";

const router = useRouter();

const meta = router.currentRoute.value.meta;

const title = meta.frontmatter.title;
const date = meta.date;
const readingTime = meta.readingTime.minutes;

const content = ref<HTMLDivElement>()

onMounted(() => {
  const navigate = () => {
    if (location.hash) {
      document.querySelector(decodeURIComponent(location.hash))
        ?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleAnchors = (
    event: MouseEvent & { target: HTMLElement },
  ) => {
    const link = event.target.closest('a')

    if (
      !event.defaultPrevented
      && link
      && event.button === 0
      && link.target !== '_blank'
      && link.rel !== 'external'
      && !link.download
      && !event.metaKey
      && !event.ctrlKey
      && !event.shiftKey
      && !event.altKey
    ) {
      const url = new URL(link.href)
      if (url.origin !== window.location.origin) return

      event.preventDefault()
      const { pathname, hash } = url
      if (hash && (!pathname || pathname === location.pathname)) {
        window.history.replaceState({}, '', hash)
        navigate()
      }
      else {
        router.push({ path: pathname, hash })
      }
    }
  }

  useEventListener(window, 'hashchange', navigate)
  useEventListener(content.value!, 'click', handleAnchors, { passive: false })

  navigate()
  setTimeout(navigate, 500)
})
</script>

<style scoped>
.article-header {
  max-width: 65ch;
}
</style>
