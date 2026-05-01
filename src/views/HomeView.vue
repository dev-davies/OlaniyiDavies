<script setup lang="ts">
import { Camera, Github, Linkedin, Mail, MessageCircle, Download } from 'lucide-vue-next';
import portraitUrl from '@/assets/images/portrait.jpg';

// Import constants
import { skills } from '@/constants/skills';
import { personal } from '@/constants/personal';
import { projects } from '@/constants/projects';
import { computed } from 'vue';

// Import composables
import { useTextMorph } from '@/composables/useTextMorph';

// Use text morphing composable
const { wordGroups, isFadingOut } = useTextMorph(personal.titles);

// Logic to rotate highlighted project every 3 days
const highlightedProject = computed(() => {
  if (!projects.length) return null;
  
  const ROTATION_DAYS = 3;
  const startOfEpoch = new Date('2024-01-01').getTime(); // Fixed reference point
  const now = Date.now();
  
  const msInDay = 1000 * 60 * 60 * 24;
  const daysSinceEpoch = Math.floor((now - startOfEpoch) / msInDay);
  
  // Use modulo to cycle through projects
  const rotationIndex = Math.floor(daysSinceEpoch / ROTATION_DAYS) % projects.length;
  return projects[rotationIndex];
});
</script>

<template>
  <main id="main-content" class="container py-5" role="main">
    <!-- Hero Section -->
    <div class="row min-h-screen align-items-center mb-5">
      <div class="col-12 text-center">
        
        <!-- Portrait -->
        <div class="d-inline-block mb-4 p-1 rounded-4 border border-2 border-secondary overflow-hidden position-relative avatar-container">
          <img :src="portraitUrl" alt="Davies Folorunso" class="w-100 h-100 object-fit-cover" />
        </div>

        <div class="mb-4 d-flex align-items-center justify-content-center" style="min-height: 80px;">
           <h1 class="display-1 fw-bold mb-0 tracking-tighter morph-container" style="column-gap: 0.3em; row-gap: 0;">
             <span 
               v-for="(group, gIndex) in wordGroups"
               :key="gIndex"
               class="d-inline-block text-nowrap"
             >
               <span 
                 v-for="(char, cIndex) in group.chars" 
                 :key="cIndex"
                 class="morph-char"
                 :class="{ 'out': isFadingOut, 'in': !isFadingOut }"
                 :style="{ '--delay': `${(group.startIndex + cIndex) * 0.03}s` }"
               >{{ char }}</span>
             </span>
           </h1>
        </div>
        
        <p class="lead mb-5 text-secondary mx-auto" style="max-width: 700px; line-height: 1.6;">
          {{ personal.tagline }}
        </p>
        <div class="d-flex justify-content-center gap-3 flex-wrap">
          <RouterLink to="/projects" class="btn btn-primary btn-lg rounded-pill px-4">
             <Camera class="me-2 w-5 h-5" /> View Work
          </RouterLink>
          <a href="/documents/Davies_Folorunso_CV.pdf" download="Davies_Folorunso_CV.pdf" class="btn btn-outline-dark btn-lg rounded-pill px-4 cv-download-btn">
             <Download class="me-2 w-5 h-5" /> Download CV
          </a>
          <a :href="`mailto:${personal.email}`" class="btn btn-outline-secondary btn-lg rounded-pill px-4">
             Contact Me
          </a>
        </div>
      </div>
    </div>

    <!-- About Me Section -->
    <div class="row justify-content-center py-5">
      <div class="col-lg-8 text-center">
        <h2 class="h3 fw-bold mb-4">About Me</h2>
        <div 
          class="card about-card border-0 shadow-sm p-4 p-md-5"
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :visible="{ opacity: 1, y: 0, transition: { duration: 600 } }"
        >
          <p class="lead text-secondary mb-4 mx-auto" style="max-width: 700px;">
            {{ personal.about.intro }}
          </p>
          <p class="text-secondary mb-0 mx-auto" style="max-width: 700px;">
            {{ personal.about.description }}
          </p>
          <p class="text-secondary mb-0 mt-3 mx-auto" style="max-width: 700px;">
            {{ personal.about.interests }}
          </p>
        </div>
      </div>
    </div>

    <!-- Skills Section -->
    <div class="row justify-content-center py-5">
      <div class="col-12 mb-4 text-center">
        <h2 class="h3 fw-bold mb-2">Technical Arsenal</h2>
        <p class="text-secondary">The tools I use to bring ideas to life</p>
      </div>
      
      <div class="col-lg-10">
        <div class="row g-4">
          <div class="col-12 col-md-6 col-lg-4" v-for="skill in skills" :key="skill.name">
            <div 
              class="card h-100 border-0 shadow-sm skill-card"
              v-motion
              :initial="{ opacity: 0, y: 20 }"
              :visible="{ opacity: 1, y: 0, transition: { duration: 500 } }"
            >
              <div class="card-body p-5 d-flex flex-column align-items-center text-center">
                <h3 class="card-title fw-bold mb-4 h5">{{ skill.name }}</h3>
                <div class="icons-grid mb-3">
                  <div 
                    v-for="(icon, index) in skill.icons" 
                    :key="index"
                    class="icon-item"
                  >
                    <img 
                      :src="icon.src" 
                      :alt="icon.name" 
                      class="tech-icon mb-2" 
                    />
                    <span class="tech-name">{{ icon.name }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- What I have been upto Section -->
    <div class="row justify-content-center py-5">
       <div class="col-lg-10">
          <h2 class="h3 fw-bold mb-4 text-center">What I have been upto</h2>
          <div 
            v-if="highlightedProject"
            class="card about-card border-0 shadow-sm p-4 p-md-5 overflow-hidden mb-4" 
            v-motion-slide-visible-once-bottom
          >
            <div class="row align-items-center g-5">
               <div class="col-md-6 order-2 order-md-1">
                  <div class="d-flex align-items-center gap-2 mb-3">
                     <component :is="highlightedProject.icon" class="w-6 h-6 text-primary" />
                     <h3 class="h4 fw-bold mb-0">{{ highlightedProject.title }}</h3>
                  </div>
                  <p class="text-secondary mb-4">
                     {{ highlightedProject.description }}
                  </p>
                  
                  <div class="d-flex flex-wrap gap-2 mb-4">
                    <span 
                      v-for="tag in highlightedProject.tags" 
                      :key="tag" 
                      class="tech-badge"
                    >
                      {{ tag }}
                    </span>
                  </div>

                  <a v-if="highlightedProject.link" :href="highlightedProject.link" target="_blank" rel="noopener noreferrer" class="btn btn-primary rounded-pill px-4" :aria-label="`View ${highlightedProject.title} project (opens in new tab)`">
                      View Project
                  </a>
               </div>
               <div class="col-md-6 order-1 order-md-2">
                  <div class="rounded-4 overflow-hidden shadow-sm position-relative">
                     <img :src="highlightedProject.image" :alt="`${highlightedProject.title} Project Showcase`" class="img-fluid w-100 object-fit-cover" loading="lazy" />
                  </div>
               </div>
            </div>
          </div>
          
          <div class="text-center" v-motion-fade-visible-once>
             <RouterLink to="/projects" class="btn btn-outline-secondary rounded-pill px-5 btn-lg">
                View More Projects
             </RouterLink>
          </div>

       </div>
    </div>

    <!-- Experience Section -->
    <div class="row justify-content-center py-5">
      <div class="col-12 mb-4 text-center">
        <h2 class="h3 fw-bold mb-2">My Journey</h2>
        <p class="text-secondary">Where I've added value alongside great teams</p>
      </div>

      <div class="col-lg-8">
        <div class="experience-timeline position-relative">
          <!-- Timeline Vertical Line -->
          <div class="timeline-line bg-secondary opacity-25 position-absolute start-0 h-100" style="width: 2px; left: 24px;"></div>

          <!-- Experience Item 1 (Novel Integrated Services) -->
          <div 
            v-for="(exp, index) in personal.experience" 
            :key="index"
            class="d-flex position-relative" 
            :class="{ 'mb-5': index < personal.experience.length - 1 }"
            v-motion-slide-visible-once-bottom
          >
            <div class="timeline-dot bg-dark rounded-circle border border-4 border-light position-absolute" style="width: 16px; height: 16px; left: 17px; top: 5px;"></div>
            <div class="ps-5">
              <h3 class="h5 fw-bold mb-1">{{ exp.title }}</h3>
              <p class="text-secondary small mb-2">{{ exp.company }} &bull; {{ exp.period }}</p>
              <p class="text-muted">{{ exp.description }}</p>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Contact Section -->
    <div class="row justify-content-center py-5 mb-5">
      <div class="col-lg-8 text-center">
        <h2 class="h3 fw-bold mb-4">Get in Touch</h2>
        <p class="lead text-secondary mb-5">
          Whether you have a question, a project idea, or just want to say hi, my inbox is always open.
        </p>

        <div class="d-flex justify-content-center gap-4 mb-4">
           
           <a :href="personal.social.github" target="_blank" rel="noopener noreferrer" class="text-decoration-none text-secondary social-link" aria-label="GitHub (opens in new tab)">
             <Github class="w-8 h-8" />
             <span class="d-block small mt-2">GitHub</span>
           </a>

           <a :href="personal.social.linkedin" target="_blank" rel="noopener noreferrer" class="text-decoration-none text-secondary social-link" aria-label="LinkedIn (opens in new tab)">
             <Linkedin class="w-8 h-8" />
             <span class="d-block small mt-2">LinkedIn</span>
           </a>

           <a :href="`mailto:${personal.email}`" class="text-decoration-none text-secondary social-link">
             <Mail class="w-8 h-8" />
             <span class="d-block small mt-2">Email</span>
           </a>

           <a :href="personal.social.whatsapp" target="_blank" rel="noopener noreferrer" class="text-decoration-none text-secondary social-link" aria-label="WhatsApp (opens in new tab)">
             <MessageCircle class="w-8 h-8" />
             <span class="d-block small mt-2">WhatsApp</span>
           </a>

        </div>
        
        <p class="text-muted small">
          &copy; {{ new Date().getFullYear() }} Davies Folorunso. Built with Vue & Bootstrap.
        </p>

      </div>
    </div>
  </main>
</template>

<style scoped>
.tracking-tighter {
  letter-spacing: -0.05em;
}

.skill-card {
  background-color: var(--card-bg);
  border: 1px solid var(--border-color) !important;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  min-height: 320px;
}

.skill-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.05) !important;
}

.icons-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  justify-items: center;
  align-items: start;
  width: 100%;
  max-width: 280px;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.tech-icon {
  width: 64px;
  height: 64px;
  object-fit: contain;
  /* Grayscale by default */
  filter: grayscale(100%) brightness(1.2);
  transition: filter 0.3s ease, transform 0.3s ease;
  /* Optimize rendering */
  will-change: filter, transform;
  backface-visibility: hidden;
}

.tech-name {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-color);
  text-align: center;
  line-height: 1.2;
}

/* Full color on hover */
.skill-card:hover .tech-icon {
  filter: grayscale(0%) brightness(1);
  transform: scale(1.1);
}

/* Dark theme adjustments */
[data-bs-theme="dark"] .tech-icon {
  filter: grayscale(100%) brightness(0.8) invert(1);
}

[data-bs-theme="dark"] .skill-card:hover .tech-icon {
  filter: grayscale(0%) brightness(1) invert(0);
}

.avatar-container {
  width: 200px;
  height: 280px;
  background-color: var(--card-bg);
  transition: transform 0.3s ease;
}

.avatar-container:hover {
  transform: scale(1.05);
}

.morph-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.morph-char {
  display: inline-block;
  opacity: 1;
  filter: blur(0);
  transform: translateY(0) scale(1);
  transition: opacity 0.5s ease, filter 0.5s ease, transform 0.5s ease;
  transition-delay: var(--delay);
  will-change: opacity, filter, transform;
}

/* Exit State: Blur out, move up, scale down */
.morph-char.out {
  opacity: 0;
  filter: blur(8px);
  transform: translateY(-10px) scale(0.9);
}

/* Enter Initial State (handled by Vue conditional class swapping, 
   but we want them to start invisible if we were using v-enter-from.
   Since we use a persistent list and toggle class 'out', 
   when 'out' is removed, it transitions back to base state.) */

@media (max-width: 768px) {
  .display-1 {
    font-size: 3rem; /* Scale down hero text */
  }
  
  .avatar-container {
    width: 160px;
    height: 220px;
  }
  
  .lead {
    font-size: 1rem;
  }

  /* Adjust timeline for smaller screens */
  .experience-timeline .ps-5 {
    padding-left: 2rem !important;
  }
}

.social-link {
  transition: transform 0.2s ease, color 0.2s ease;
}

.social-link:hover {
  transform: translateY(-3px);
  color: var(--text-color) !important;
}

.w-8 { width: 32px; }
.h-8 { height: 32px; }

.about-card {
  background-color: var(--card-bg);
  border: 1px solid var(--border-color) !important;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.about-card:hover {
  transform: translateY(-8px); /* Stronger lift */
  border-color: rgba(0,0,0,0.2) !important;
  box-shadow: 0 20px 40px rgba(0,0,0,0.08) !important;
}

[data-bs-theme="dark"] .about-card:hover {
  border-color: rgba(255,255,255,0.3) !important;
  box-shadow: 0 20px 40px rgba(255,255,255,0.05) !important; /* White glow */
}

/* Download CV Button - Theme Adaptive */
.cv-download-btn {
  border-width: 2px !important;
  transition: all 0.3s ease;
}

/* Dark mode - Light outline with light text */
[data-bs-theme="dark"] .cv-download-btn {
  border-color: rgba(255, 255, 255, 0.8) !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

[data-bs-theme="dark"] .cv-download-btn:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
  border-color: rgba(255, 255, 255, 1) !important;
  color: #fff !important;
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
</style>
