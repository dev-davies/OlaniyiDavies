<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useBlog } from '@/composables/useBlog'
import { ArrowLeft, Twitter, Linkedin } from 'lucide-vue-next'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { getPostBySlug, getAdjacentPosts } = useBlog()
const post = computed(() => getPostBySlug(slug.value))
const adjacentPosts = computed(() => getAdjacentPosts(slug.value))
const currentUrl = computed(() => typeof window !== 'undefined' ? window.location.href : '')
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
          <article class="prose mb-5">
            <component :is="post.component" />
          </article>

          <!-- Tags Section -->
          <div v-if="post.frontmatter.tags?.length" class="mt-5 pt-4 border-top">
            <h5 class="fw-bold mb-3">Tags</h5>
            <div class="d-flex flex-wrap gap-2">
              <span v-for="tag in post.frontmatter.tags" :key="tag" class="badge bg-light text-dark border px-3 py-2">
                #{{ tag }}
              </span>
            </div>
          </div>

          <!-- Share Section -->
          <div class="mt-4 d-flex align-items-center gap-3">
            <h6 class="mb-0 fw-bold">Share this article:</h6>
            <a :href="`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.frontmatter.title)}&url=${encodeURIComponent(currentUrl)}`" target="_blank" class="btn btn-sm btn-outline-primary rounded-pill px-3 d-inline-flex align-items-center">
              <Twitter :size="16" class="me-1" /> Twitter
            </a>
            <a :href="`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`" target="_blank" class="btn btn-sm btn-outline-primary rounded-pill px-3 d-inline-flex align-items-center">
              <Linkedin :size="16" class="me-1" /> LinkedIn
            </a>
          </div>

          <!-- What do you think Section -->
          <div class="mt-5 bg-light p-4 rounded-4 text-center">
            <h4 class="fw-bold mb-2">What do you think?</h4>
            <p class="text-secondary mb-3">Do you disagree, have additions, or just want to discuss? I'd love to hear from you.</p>
            <a href="mailto:dvsolaniyi@gmail.com" class="btn btn-primary px-4 py-2 fw-medium">
              Email me at dvsolaniyi@gmail.com
            </a>
          </div>

          <!-- Previous / Next Section -->
          <div class="mt-5 pt-4 border-top d-flex justify-content-between">
             <RouterLink v-if="adjacentPosts.prev" :to="`/blog/${adjacentPosts.prev.slug}`" class="text-decoration-none w-50 pe-3 transition-hover">
               <div class="text-muted small mb-1">← Previous Post</div>
               <div class="fw-bold text-dark">{{ adjacentPosts.prev.frontmatter.title }}</div>
             </RouterLink>
             <div v-else class="w-50 pe-3"></div>

             <RouterLink v-if="adjacentPosts.next" :to="`/blog/${adjacentPosts.next.slug}`" class="text-decoration-none text-end w-50 ps-3 transition-hover">
               <div class="text-muted small mb-1">Next Post →</div>
               <div class="fw-bold text-dark">{{ adjacentPosts.next.frontmatter.title }}</div>
             </RouterLink>
             <div v-else class="w-50 ps-3"></div>
          </div>
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
.prose :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 16px;
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.1);
  margin: 2.5rem auto;
  display: block;
}
</style>
