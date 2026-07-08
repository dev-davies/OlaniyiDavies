<script setup lang="ts">
import { computed } from 'vue'
import { useBlog } from '@/composables/useBlog'
import { ArrowRight } from 'lucide-vue-next'

const { posts } = useBlog()
// Get first 3 posts
const recentPosts = computed(() => posts.value.slice(0, 3))
</script>

<template>
  <section class="blog-preview-section py-5">
    <div class="container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="fw-bold mb-0">Latest Articles</h2>
        <RouterLink to="/blog" class="text-decoration-none fw-semibold d-flex align-items-center gap-1">
          View all <ArrowRight :size="18" />
        </RouterLink>
      </div>
      
      <div class="row g-4">
        <div v-for="post in recentPosts" :key="post.slug" class="col-md-4">
          <RouterLink :to="`/blog/${post.slug}`" class="text-decoration-none">
            <div class="card h-100 border-0 shadow-sm blog-card transition-hover overflow-hidden">
              <img v-if="post.frontmatter.image" :src="post.frontmatter.image" class="card-img-top" :alt="post.frontmatter.title" style="height: 180px; object-fit: cover;" />
              <div class="card-body p-4 d-flex flex-column">
                <span class="text-body-secondary small mb-2">{{ post.frontmatter.date }}</span>
                <h5 class="card-title fw-bold text-body-emphasis">{{ post.frontmatter.title }}</h5>
                <p class="card-text text-body-secondary mb-4 flex-grow-1">
                  {{ post.frontmatter.description }}
                </p>
                <div class="mt-auto d-flex align-items-center text-primary fw-medium">
                  Read Article
                  <ArrowRight class="ms-2" :size="16" />
                </div>
              </div>
            </div>
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.blog-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 12px;
}
.blog-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
}
</style>
