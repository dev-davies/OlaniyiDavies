<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useBlog } from '@/composables/useBlog'
import { ArrowLeft } from 'lucide-vue-next'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { getPostBySlug } = useBlog()
const post = computed(() => getPostBySlug(slug.value))
</script>

<template>
  <main class="blog-post-view py-5">
    <div class="container" v-if="post">
      <div class="row justify-content-center">
        <div class="col-lg-8 col-md-10">
          <RouterLink to="/blog" class="text-decoration-none text-muted mb-4 d-inline-flex align-items-center gap-2 transition-hover">
            <ArrowLeft :size="16" /> Back to Blog
          </RouterLink>

          <header class="mb-5">
            <h1 class="fw-bold mb-3 display-5">{{ post.frontmatter.title }}</h1>
            <div class="d-flex align-items-center text-muted gap-3">
              <span>{{ post.frontmatter.date }}</span>
              <span>•</span>
              <span>{{ post.frontmatter.readTime }}</span>
            </div>
            <hr class="mt-4 mb-5" />
          </header>

          <!-- Render the markdown content -->
          <article class="prose">
            <component :is="post.component" />
          </article>
        </div>
      </div>
    </div>
    
    <div class="container text-center py-5" v-else>
      <h2 class="fw-bold mb-3">Post not found</h2>
      <p class="text-secondary mb-4">The article you're looking for doesn't exist or has been moved.</p>
      <RouterLink to="/blog" class="btn btn-primary px-4 py-2">Return to Blog</RouterLink>
    </div>
  </main>
</template>

<style scoped>
.transition-hover {
  transition: color 0.2s ease;
}
.transition-hover:hover {
  color: var(--bs-primary) !important;
}

/* Base styles for the prose markdown content */
.prose :deep(h1), .prose :deep(h2), .prose :deep(h3) {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-weight: 700;
}
.prose :deep(p) {
  margin-bottom: 1.25rem;
  line-height: 1.7;
  color: #4a5568;
}
.prose :deep(pre) {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  overflow-x: auto;
  margin-bottom: 1.5rem;
}
.prose :deep(code) {
  font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 0.875em;
}
</style>
