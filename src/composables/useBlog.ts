import { ref } from 'vue'
import type { Component } from 'vue'

export interface BlogPostFrontmatter {
  title: string
  description: string
  date: string
  readTime: string
  tags?: string[]
}

export interface BlogPost {
  slug: string
  frontmatter: BlogPostFrontmatter
  component: Component
}

// Dynamically import all markdown files from the blog directory
const modules = import.meta.glob<{ default: Component, frontmatter: BlogPostFrontmatter }>(
  '../../content/blog/*.md',
  { eager: true }
)

// Transform modules into an array of post objects
const rawPosts = Object.entries(modules).map(([path, module]) => {
  // Extract filename from path (e.g., "../../content/blog/my-first-post.md" -> "my-first-post.md")
  const filename = path.split('/').pop() || ''
  // Create slug by removing the .md extension
  const slug = filename.replace(/\.md$/, '')

  return {
    slug,
    frontmatter: module.frontmatter || {},
    component: module.default,
  } as BlogPost
})

// Sort posts by date descending (newest first)
rawPosts.sort((a, b) => {
  const dateA = new Date(a.frontmatter.date).getTime()
  const dateB = new Date(b.frontmatter.date).getTime()
  return dateB - dateA
})

// Store posts in a reactive ref
const posts = ref<BlogPost[]>(rawPosts)

export function useBlog() {
  /**
   * Helper function to find a specific post's component and metadata by its slug
   */
  const getPostBySlug = (slug: string) => {
    return posts.value.find(post => post.slug === slug)
  }

  /**
   * Get the previous (older) and next (newer) post for a given slug
   */
  const getAdjacentPosts = (slug: string) => {
    const index = posts.value.findIndex(post => post.slug === slug)
    if (index === -1) return { prev: null, next: null }
    
    // Since posts are sorted newest first (descending):
    // The "next" post chronologically is the one before it in the array
    // The "prev" post chronologically is the one after it in the array
    const next = index > 0 ? posts.value[index - 1] : null
    const prev = index < posts.value.length - 1 ? posts.value[index + 1] : null

    return { prev, next }
  }

  return {
    posts,
    getPostBySlug,
    getAdjacentPosts
  }
}

