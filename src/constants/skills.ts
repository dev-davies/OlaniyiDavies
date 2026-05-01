import type { Skill } from '@/types/skill';

// Import tech stack icons
import htmlIcon from '@/assets/icons/html.svg';
import cssIcon from '@/assets/icons/css.svg';
import bootstrapIcon from '@/assets/icons/bootstrap.svg';
import vuejsIcon from '@/assets/icons/vuejs.svg';
import nuxtIcon from '@/assets/icons/nuxt.svg';
import reactIcon from '@/assets/icons/react.svg';
import nextjsIcon from '@/assets/icons/nextjs.svg';

import phpIcon from '@/assets/icons/php.svg';
import laravelIcon from '@/assets/icons/laravel.svg';
import pythonIcon from '@/assets/icons/python.svg';
import flaskIcon from '@/assets/icons/flask.svg';
import nodejsIcon from '@/assets/icons/nodejs.svg';
import nitroIcon from '@/assets/icons/nitro.svg';

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
      { src: vuejsIcon, name: 'Vue.js' },
      { src: nuxtIcon, name: 'Nuxt' },
      { src: reactIcon, name: 'React' },
      { src: nextjsIcon, name: 'Next.js' }
    ], 
    desc: 'HTML, CSS, Bootstrap, Vue, React, Nuxt, Next' 
  },
  { 
    name: 'Backend', 
    icons: [
      { src: phpIcon, name: 'PHP' },
      { src: laravelIcon, name: 'Laravel' },
      { src: pythonIcon, name: 'Python' },
      { src: flaskIcon, name: 'Flask' },
      { src: nodejsIcon, name: 'Node.js' },
      { src: nitroIcon, name: 'Nitro' }
    ], 
    desc: 'PHP, Python, Node.js, Laravel, Flask, Nitro' 
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
