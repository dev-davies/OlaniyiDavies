<script setup lang="ts">
import { Home, FolderGit2, Github, Linkedin, Mail } from 'lucide-vue-next';
import ThemeToggle from './ThemeToggle.vue';
import { RouterLink } from 'vue-router';

// Defines the items in the dock
const dockItems = [
  { name: 'Home', icon: Home, route: '/' },
  { name: 'Projects', icon: FolderGit2, route: '/projects' },
  { name: 'GitHub', icon: Github, href: 'https://github.com/dev-davies/' },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://www.linkedin.com/in/davies-folorunso-sentinel/' },
  { name: 'Contact', icon: Mail, href: 'mailto:dvsfolorunso@gmail.com' },
]
</script>

<template>
  <nav class="fixed-bottom mb-4 d-flex justify-content-center pointer-events-none" style="z-index: 1050;" aria-label="Main Navigation">
    <div class="dock-container glass-effect p-2 rounded-4 d-flex gap-2 align-items-center shadow-lg pointer-events-auto">
      
      <template v-for="item in dockItems" :key="item.name">
        <!-- Internal Link -->
        <RouterLink 
          v-if="item.route"
          :to="item.route"
          class="dock-item btn btn-link text-decoration-none d-flex align-items-center justify-content-center"
          :aria-label="item.name"
          v-motion
          :initial="{ scale: 1 }"
          :hovered="{ scale: 1.2 }"
        >
          <component :is="item.icon" class="icon-size" aria-hidden="true" />
        </RouterLink>

        <!-- External Link -->
        <a 
          v-else
          :href="item.href"
          target="_blank"
          rel="noopener noreferrer"
          class="dock-item btn btn-link text-decoration-none d-flex align-items-center justify-content-center"
          :aria-label="`${item.name} (opens in new tab)`"
          v-motion
          :initial="{ scale: 1 }"
          :hovered="{ scale: 1.2 }"
        >
          <component :is="item.icon" class="icon-size" aria-hidden="true" />
        </a>
      </template>

      <div class="vr mx-1 bg-secondary opacity-50" aria-hidden="true"></div>
      
      <ThemeToggle />
      
    </div>
  </nav>
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
  /* Optimize rendering during scale transforms */
  will-change: transform;
  backface-visibility: hidden;
  transform-style: preserve-3d;
  /* Force sharp edges on SVG */
  shape-rendering: geometricPrecision;
}

@media (max-width: 768px) {
  .dock-container {
    padding: 0.25rem !important; /* Smaller padding */
    gap: 0.25rem !important;
  }

  .dock-item {
    width: 40px;
    height: 40px;
    border-radius: 10px;
  }

  .icon-size {
    width: 20px;
    height: 20px;
  }
}
</style>
