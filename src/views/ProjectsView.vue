<script setup lang="ts">
import { ExternalLink, Zap, CreditCard, Gamepad2, GraduationCap, TrendingUp } from 'lucide-vue-next';
import { ref } from 'vue';

// Import Project Images
import dattinImg from '@/assets/img/dev-davies.github.io_dattin_.png';
import novelSolarImg from '@/assets/img/novelsolar.com_.png';
import primePayImg from '@/assets/img/www.prime-pay.africa_.png';
import zitraImg from '@/assets/img/www.zitrainvestments.com_.png';
import academyImg from '@/assets/img/Novelsolar Academy.png';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link?: string;
  github?: string;
  icon: any;
  status?: string; // e.g. 'In Development'
}

const projects = ref<Project[]>([
  {
    id: 1,
    title: 'Dat Tin',
    description: 'A Nigerian-themed charades/party game that celebrates local culture. Progressive Web App (PWA) with offline support and installability.',
    image: dattinImg,
    tags: ['Vue.js', 'PWA', 'Game Logic', 'Touch Events'],
    link: 'https://dev-davies.github.io/dattin/',
    icon: Gamepad2
  },
  {
    id: 2,
    title: 'Novel Solar',
    description: 'Corporate website for a leading renewable energy provider. Features service showcases, dynamic content, and lead generation forms.',
    image: novelSolarImg,
    tags: ['Corporate', 'Energy', 'Responsive', 'Lead Gen'],
    link: 'https://novelsolar.com',
    icon: Zap
  },
  {
    id: 3,
    title: 'PrimePay',
    description: 'Modern fintech solution for seamless payment processing. Focused on security, speed, and user experience in the African market.',
    image: primePayImg,
    tags: ['Fintech', 'Payments', 'Security', 'Dashboard'],
    link: 'https://www.prime-pay.africa',
    icon: CreditCard
  },
  {
    id: 4,
    title: 'Zitra Investments',
    description: 'Investment management platform offering tailored financial growth strategies. Clean, trustworthy design for financial services.',
    image: zitraImg,
    tags: ['Finance', 'Investment', 'Real-time Data'],
    link: 'https://www.zitrainvestments.com',
    icon: TrendingUp
  },
  {
    id: 5,
    title: 'NovelSolar Academy',
    description: 'An upcoming energy and tech training academy platform. Empowering the next generation of solar engineers and tech talent.',
    image: academyImg,
    tags: ['EdTech', 'LMS', 'Training', 'Coming Soon'],
    status: 'In Development',
    icon: GraduationCap
  }
]);
</script>

<template>
  <div class="container py-5 min-vh-100">
    <!-- Header -->
    <div class="row mb-5">
      <div class="col-12 text-center" v-motion-fade-visible-once>
        <span class="d-inline-block px-3 py-1 rounded-pill bg-body-tertiary border text-secondary small mb-3">
          My Portfolio
        </span>
        <h2 class="display-4 fw-bold mb-3">Selected Projects</h2>
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
              <img :src="project.image" :alt="project.title" class="img-fluid w-100 h-100 object-fit-cover" />
            </div>
            
            <!-- Overlay (Visible on Hover) -->
            <div class="overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-black bg-opacity-50 opacity-0 transition-opacity">
              <a v-if="project.link" :href="project.link" target="_blank" class="btn btn-light rounded-pill px-4 me-2 scale-up">
                Visit Site <ExternalLink class="w-4 h-4 ms-1 d-inline" />
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
                class="badge bg-body-tertiary text-secondary fw-normal border"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
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

/* Hover Effects */
.project-card:hover .overlay {
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
</style>
