<script setup lang="ts">
import { ExternalLink, ArrowLeft } from 'lucide-vue-next';
import { projects } from '@/constants/projects';
import { RouterLink } from 'vue-router';
</script>

<template>
  <main id="main-content" class="container py-5 min-vh-100 position-relative" role="main">
    <!-- Back Button -->
    <div class="mb-4" v-motion-fade-visible-once>
      <RouterLink to="/" class="btn btn-link text-secondary text-decoration-none d-inline-flex align-items-center gap-2 p-0 back-link">
        <ArrowLeft class="w-5 h-5" />
        <span class="fw-medium">Back to Home</span>
      </RouterLink>
    </div>

    <!-- Header -->
    <div class="row mb-5">
      <div class="col-12 text-center" v-motion-fade-visible-once>
        <span class="d-inline-block px-3 py-1 rounded-pill bg-body-tertiary border text-secondary small mb-3">
          My Portfolio
        </span>
        <h1 class="display-4 fw-bold mb-3">Selected Projects</h1>
        <p class="text-secondary lead mx-auto" style="max-width: 600px;">
          A blend of innovative products, corporate solutions, and creative experiments.
        </p>
      </div>
    </div>

    <!-- Gallery -->
    <div class="row g-4">
      <div 
        v-for="(project, index) in projects" 
        :key="project.id" 
        class="col-md-6 col-xl-4"
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: index * 100 } }"
      >
        <div class="card h-100 border-0 bg-transparent project-card">
          <!-- Image Container -->
          <div class="card-img-top position-relative overflow-hidden rounded-4 shadow-sm mb-3 group-hover-lift">
            <div class="aspect-ratio-box">
              <img :src="project.image" :alt="project.title" class="img-fluid w-100 h-100 object-fit-cover" loading="lazy" />
            </div>
            
            <!-- Overlay (Visible on Hover) -->
            <div class="overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-black bg-opacity-50 opacity-0 transition-opacity">
              <a v-if="project.link" :href="project.link" target="_blank" rel="noopener noreferrer" class="btn btn-light rounded-pill px-4 me-2 scale-up" :aria-label="`Visit ${project.title} (opens in new tab)`">
                Visit Site <ExternalLink class="w-4 h-4 ms-1 d-inline" aria-hidden="true" />
              </a>
              <span v-else class="badge bg-warning text-dark py-2 px-3 rounded-pill scale-up">
                {{ project.status }}
              </span>
            </div>
          </div>

          <!-- Content -->
          <div class="card-body px-1">
            <div class="d-flex align-items-center justify-content-between mb-2">
              <div class="d-flex align-items-center gap-2">
                <component :is="project.icon" class="text-secondary w-5 h-5" />
                <h3 class="h5 fw-bold mb-0">{{ project.title }}</h3>
              </div>
              <span v-if="project.status" class="badge bg-body-tertiary border text-warning small">{{ project.status }}</span>
            </div>
            
            <p class="text-muted small mb-3 line-clamp-2">
              {{ project.description }}
            </p>

            <div class="d-flex flex-wrap gap-2">
              <span 
                v-for="tag in project.tags" 
                :key="tag" 
                class="tech-badge"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.aspect-ratio-box {
  width: 100%;
  aspect-ratio: 16/9;
  background-color: var(--card-bg);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Hover & Focus Effects */
.project-card:hover .overlay,
.project-card:focus-within .overlay {
  opacity: 1 !important;
}

.project-card:hover .group-hover-lift {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
}

.group-hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.transition-opacity {
  transition: opacity 0.3s ease;
}

.scale-up {
  transform: scale(0.9);
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.project-card:hover .scale-up {
  transform: scale(1);
}

/* Grayscale Effect */
.project-card img {
  filter: grayscale(100%);
  transition: filter 0.4s ease;
}

.project-card:hover img,
.project-card:active img {
  filter: grayscale(0%);
}
.tech-badge {
  padding: 0.4rem 0.8rem;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 500;
  background: rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.08);
  color: var(--text-secondary);
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .tech-badge {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.tech-badge:hover {
  background: var(--text-color);
  color: var(--bg-color);
  border-color: var(--text-color);
  transform: translateY(-2px);
}

.back-link {
  transition: transform 0.3s ease, color 0.3s ease;
}

.back-link:hover {
  color: var(--text-color) !important;
  transform: translateX(-5px);
}
</style>
