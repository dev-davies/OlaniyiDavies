<script setup lang="ts">
import { RouterView } from 'vue-router'
import TheDock from './components/layout/TheDock.vue'
import GridBackground from './components/ui/GridBackground.vue'
</script>

<template>
  <GridBackground />
  <RouterView />
  <TheDock />
</template>

<style>
/* Global resets or overrides if needed */
</style>
