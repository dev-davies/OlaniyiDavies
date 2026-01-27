import type { Skill } from '@/types/skill';

// Import tech stack icons
import htmlIcon from '@/assets/icons/html.svg';
import cssIcon from '@/assets/icons/css.svg';
import bootstrapIcon from '@/assets/icons/bootstrap.svg';
import vuejsIcon from '@/assets/icons/vuejs.svg';
import phpIcon from '@/assets/icons/php.svg';
import laravelIcon from '@/assets/icons/laravel.svg';
import pythonIcon from '@/assets/icons/python.svg';
import flaskIcon from '@/assets/icons/flask.svg';
import postgresqlIcon from '@/assets/icons/postgresql.svg';
import sqliteIcon from '@/assets/icons/sqlite.svg';
import pwaIcon from '@/assets/icons/pwa.svg';
import dockerIcon from '@/assets/icons/docker.svg';
import wordpressIcon from '@/assets/icons/wordpress.svg';
import elementorIcon from '@/assets/icons/elementor.svg';

export const skills: Skill[] = [
  { 
    name: 'Frontend', 
    icons: [
      { src: htmlIcon, name: 'HTML' },
      { src: cssIcon, name: 'CSS' },
      { src: bootstrapIcon, name: 'Bootstrap' },
      { src: vuejsIcon, name: 'Vue.js' }
    ], 
    desc: 'HTML, CSS, Bootstrap, Vue.js' 
  },
  { 
    name: 'Backend', 
    icons: [
      { src: phpIcon, name: 'PHP' },
      { src: laravelIcon, name: 'Laravel' },
      { src: pythonIcon, name: 'Python' },
      { src: flaskIcon, name: 'Flask' }
    ], 
    desc: 'PHP (Laravel), Python (Flask)' 
  },
  { 
    name: 'Database', 
    icons: [
      { src: postgresqlIcon, name: 'PostgreSQL' },
      { src: sqliteIcon, name: 'SQLite' }
    ], 
    desc: 'PostgreSQL, SQLite' 
  },
  { 
    name: 'DevOps', 
    icons: [
      { src: pwaIcon, name: 'PWA' },
      { src: dockerIcon, name: 'Docker' }
    ], 
    desc: 'PWA, Docker' 
  },
  { 
    name: 'WordPress', 
    icons: [
      { src: wordpressIcon, name: 'WordPress' },
      { src: elementorIcon, name: 'Elementor' }
    ], 
    desc: 'CMS & Page Builder' 
  },
];
