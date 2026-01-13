<script setup lang="ts">
import { Camera, Database, Layout, Smartphone, Terminal, Figma, Server } from 'lucide-vue-next';
import portraitUrl from '@/assets/img/portrait.jpg';
import { onMounted, onUnmounted, ref, nextTick } from 'vue';

const currentChars = ref<string[]>([]);
const isFadingOut = ref(false); // Controls the flow direction
const titles = [
  "I'm Davies Folorunso", 
  "I'm a Fullstack Developer", 
  "I'm a Wordpress Developer"
];
let currentIndex = 0;
let timeoutId: number;

const startLoop = () => {
  // Initialize with first title
  updateChars(titles[0]);

  const loop = () => {
    timeoutId = window.setTimeout(() => {
      // 1. Trigger Fade Out (Flow L -> R)
      isFadingOut.value = true;

      setTimeout(() => {
        // 2. Swap Text
        currentIndex = (currentIndex + 1) % titles.length;
        updateChars(titles[currentIndex]);
        
        // 3. Trigger Fade In (Flow L -> R)
        isFadingOut.value = false;

        loop(); // Recursion
      }, 1000); // Wait for full exit animation (approx 1s)

    }, 3500); // Read time
  };
  loop();
};

const updateChars = (text: string) => {
  // Use a unique separation to ensure Vue re-renders the spans if text changes length or content
  // Adding spaces ensures layout stability
  currentChars.value = text.split('');
};

onMounted(() => {
  startLoop();
});

onUnmounted(() => {
  clearTimeout(timeoutId);
});

const skills = [
  { name: 'Frontend', icon: Layout, desc: 'Vue, React, TypeScript' },
  { name: 'Backend', icon: Server, desc: 'Node.js, Python, Flask' },
  { name: 'Database', icon: Database, desc: 'PostgreSQL, MongoDB' },
  { name: 'Mobile', icon: Smartphone, desc: 'React Native, Flutter' },
  { name: 'Design', icon: Figma, desc: 'Figma, Adobe XD' },
  { name: 'DevOps', icon: Terminal, desc: 'Docker, AWS, CI/CD' },
];
</script>

<template>
  <div class="container py-5">
    <!-- Hero Section -->
    <div class="row min-h-screen align-items-center mb-5">
      <div class="col-12 text-center">
        
        <!-- Portrait -->
        <div class="d-inline-block mb-4 p-1 rounded-4 border border-2 border-secondary overflow-hidden position-relative avatar-container">
          <img :src="portraitUrl" alt="Davies Folorunso" class="w-100 h-100 object-fit-cover" />
        </div>

        <div class="mb-4 d-flex align-items-center justify-content-center" style="min-height: 80px;">
           <h1 class="display-1 fw-bold mb-0 tracking-tighter morph-container">
             <span 
               v-for="(char, index) in currentChars" 
               :key="index"
               class="morph-char"
               :class="{ 'out': isFadingOut, 'in': !isFadingOut }"
               :style="{ '--delay': `${index * 0.03}s` }"
             >{{ char === ' ' ? '&nbsp;' : char }}</span>
           </h1>
        </div>
        
        <p class="lead mb-4 text-secondary">Creative Coder | Problem Solver</p>
        <div class="d-flex justify-content-center gap-3">
          <button class="btn btn-primary btn-lg rounded-pill px-4">
             <Camera class="me-2 w-5 h-5" /> View Work
          </button>
        </div>
      </div>
    </div>

    <!-- About Me Section -->
    <div class="row justify-content-center py-5">
      <div class="col-lg-8 text-center">
        <h2 class="h3 fw-bold mb-4">About Me</h2>
        <div 
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :visible="{ opacity: 1, y: 0, transition: { duration: 600 } }"
        >
          <p class="lead text-secondary mb-4">
            Hello! I'm a passionate developer who bridges the gap between engineering and design. 
            I build accessible, pixel-perfect, and performant web experiences.
          </p>
          <p class="text-secondary mb-0">
            With a background in creative coding and a love for clean aesthetics, I strive to create digital products 
            that are not only functional but also visually compelling. When I'm not coding, you can find me exploring new coffee shops, 
            reading sci-fi novels, or tinkering with new tech stacks.
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
        <div class="row g-3">
          <div class="col-6 col-md-4" v-for="skill in skills" :key="skill.name">
            <div 
              class="card h-100 border-0 shadow-sm skill-card"
              v-motion
              :initial="{ opacity: 0, y: 20 }"
              :visible="{ opacity: 1, y: 0, transition: { duration: 500 } }"
            >
              <div class="card-body p-4 d-flex flex-column align-items-center text-center">
                <div class="icon-box mb-3 rounded-circle d-flex align-items-center justify-content-center">
                  <component :is="skill.icon" class="w-6 h-6" />
                </div>
                <h5 class="card-title fw-bold mb-1 h6">{{ skill.name }}</h5>
                <p class="card-text small text-secondary mb-0">{{ skill.desc }}</p>
              </div>
            </div>
          </div>
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

          <!-- Experience Item 1 -->
          <div class="d-flex mb-5 position-relative" v-motion-slide-visible-once-bottom>
            <div class="timeline-dot bg-dark rounded-circle border border-4 border-light position-absolute" style="width: 16px; height: 16px; left: 17px; top: 5px;"></div>
            <div class="ps-5">
              <h4 class="h5 fw-bold mb-1">Senior Frontend Engineer</h4>
              <p class="text-secondary small mb-2">TechCorp Inc. &bull; 2023 - Present</p>
              <p class="text-muted">
                Spearheading the migration of legacy monoliths to modern micro-frontends using Vue 3 and TypeScript. 
                Improved site performance by 40% and established a comprehensive design system.
              </p>
            </div>
          </div>

          <!-- Experience Item 2 -->
          <div class="d-flex mb-5 position-relative" v-motion-slide-visible-once-bottom>
            <div class="timeline-dot bg-dark rounded-circle border border-4 border-light position-absolute" style="width: 16px; height: 16px; left: 17px; top: 5px;"></div>
            <div class="ps-5">
              <h4 class="h5 fw-bold mb-1">Full Stack Developer</h4>
              <p class="text-secondary small mb-2">Creative Agency &bull; 2021 - 2023</p>
              <p class="text-muted">
                Developed interactive marketing campaigns for Fortune 500 clients. 
                Utilized WebGL and GSAP for award-winning visual experiences. Built custom CMS solutions with Python/Django.
              </p>
            </div>
          </div>

          <!-- Experience Item 3 -->
          <div class="d-flex position-relative" v-motion-slide-visible-once-bottom>
            <div class="timeline-dot bg-dark rounded-circle border border-4 border-light position-absolute" style="width: 16px; height: 16px; left: 17px; top: 5px;"></div>
            <div class="ps-5">
              <h4 class="h5 fw-bold mb-1">Junior Web Developer</h4>
              <p class="text-secondary small mb-2">StartUp Hub &bull; 2019 - 2021</p>
              <p class="text-muted">
                Collaborated with cross-functional teams to launch MVP products. 
                Focused on responsive UI implementation and REST API integration.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tracking-tighter {
  letter-spacing: -0.05em;
}

.skill-card {
  background-color: var(--card-bg);
  border: 1px solid var(--border-color) !important;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.skill-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.05) !important;
}

.icon-box {
  width: 48px;
  height: 48px;
  background-color: var(--bg-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
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
</style>
