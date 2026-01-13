<script setup lang="ts">
import { Home, FolderGit2 } from 'lucide-vue-next';
import ThemeToggle from './ThemeToggle.vue';
import { RouterLink } from 'vue-router';

// Defines the items in the dock
const dockItems = [
  { name: 'Home', icon: Home, route: '/' },
  { name: 'Projects', icon: FolderGit2, route: '/projects' },
  // Add more items here
]
</script>

<template>
  <div class="fixed-bottom mb-4 d-flex justify-content-center pointer-events-none">
    <div class="dock-container glass-effect p-2 rounded-4 d-flex gap-2 align-items-center shadow-lg pointer-events-auto">
      
      <RouterLink 
        v-for="item in dockItems" 
        :key="item.name" 
        :to="item.route"
        class="dock-item btn btn-link text-decoration-none d-flex align-items-center justify-content-center"
        v-motion
        :initial="{ scale: 1 }"
        :hovered="{ scale: 1.2 }"
      >
        <component :is="item.icon" class="icon-size" />
      </RouterLink>

      <div class="vr mx-1 bg-secondary opacity-50"></div>
      
      <ThemeToggle />
      
    </div>
  </div>
</template>

<style scoped>
.glass-effect {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

[data-bs-theme="dark"] .glass-effect {
  background: rgba(20, 20, 20, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.dock-item {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  color: var(--text-color);
  transition: background-color 0.2s;
}

.dock-item:hover {
  background-color: rgba(128, 128, 128, 0.1);
}

.icon-size {
  width: 24px;
  height: 24px;
}
</style>
