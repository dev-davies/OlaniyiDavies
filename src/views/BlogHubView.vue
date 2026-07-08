<script setup lang="ts">
import { useBlog } from '@/composables/useBlog'
import { ArrowRight } from 'lucide-vue-next'

const { posts } = useBlog()
</script>

<template>
  <main class="blog-hub-view py-5">
    <div class="container">
      <div class="mb-5 text-center">
        <h1 class="display-4 fw-bold">Blog</h1>
        <p class="lead text-secondary">Thoughts, tutorials, and insights on development.</p>
      </div>

      <div class="row g-4">
        <div v-for="post in posts" :key="post.slug" class="col-md-6 col-lg-4">
          <RouterLink :to="`/blog/${post.slug}`" class="text-decoration-none">
            <div class="card h-100 border-0 shadow-sm blog-card transition-hover overflow-hidden">
              <img v-if="post.frontmatter.image" :src="post.frontmatter.image" class="card-img-top" :alt="post.frontmatter.title" style="height: 200px; object-fit: cover;" />
              <div class="card-body p-4 d-flex flex-column">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="text-muted small">{{ post.frontmatter.date }}</span>
                  <span class="badge bg-light text-dark border">{{ post.frontmatter.readTime }}</span>
                </div>
                <h4 class="card-title fw-bold text-dark mb-3">{{ post.frontmatter.title }}</h4>
                <p class="card-text text-secondary mb-4 flex-grow-1">
                  {{ post.frontmatter.description }}
                </p>
                <div class="mt-auto text-primary fw-medium d-flex align-items-center">
                  Read More
                  <ArrowRight class="ms-2" :size="16" />
                </div>
              </div>
            </div>
          </RouterLink>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.blog-hub-view {
  min-height: 100vh;
}
.blog-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 12px;
}
.blog-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 1rem 3rem rgba(0,0,0,.175)!important;
}
</style>
