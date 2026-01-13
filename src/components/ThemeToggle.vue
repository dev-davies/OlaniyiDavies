<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import { Sun, Moon } from 'lucide-vue-next'

const isDark = useDark({
  selector: 'body',
  attribute: 'data-bs-theme',
  valueDark: 'dark',
  valueLight: 'light',
})
const toggleDark = useToggle(isDark)
</script>

<template>
  <button 
    @click="toggleDark()" 
    class="btn btn-link nav-link p-2 d-flex align-items-center justify-content-center"
    aria-label="Toggle Theme"
  >
    <Moon v-if="!isDark" class="w-5 h-5 text-dark" />
    <Sun v-else class="w-5 h-5 text-warning" />
  </button>
</template>

<style scoped>
.nav-link {
  color: inherit;
  transition: transform 0.2s;
}
.nav-link:hover {
  transform: scale(1.1);
}
</style>
