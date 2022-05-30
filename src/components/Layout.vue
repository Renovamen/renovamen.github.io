<template>
  <main
    class="flex flex-col min-h-full"
    p="x-4 t-24 b-6"
    text="gray-800 dark:gray-200"
  >
    <div class="flex-1 mb-6">
      <Navbar>
        <slot name="navbar" />
      </Navbar>
      <slot />
    </div>
    <Footer />
  </main>
</template>
