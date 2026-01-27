import type { Project } from '@/types/project';
import { Zap, CreditCard, Gamepad2, GraduationCap, TrendingUp } from 'lucide-vue-next';

// Import Project Images
import dattinImg from '@/assets/images/projects/dev-davies.github.io_dattin_.png';
import novelSolarImg from '@/assets/images/projects/novelsolar.com_.png';
import primePayImg from '@/assets/images/projects/www.prime-pay.africa_.png';
import zitraImg from '@/assets/images/projects/www.zitrainvestments.com_.png';
import academyImg from '@/assets/images/projects/Novelsolar Academy.png';

export const projects: Project[] = [
  {
    id: 1,
    title: 'Dat Tin',
    description: 'A Nigerian-themed taboo game that celebrates local culture. Progressive Web App (PWA) with offline support and installability.',
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
];
