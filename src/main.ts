import { ViteSSG } from 'vite-ssg'
import './assets/scss/main.scss'
import App from './App.vue'
import { routes } from './router'
import { MotionPlugin } from '@vueuse/motion'

// Bootstrap JS removed — no JS components (modals, dropdowns, etc.) are used

export const createApp = ViteSSG(
  App,
  { routes, base: import.meta.env.BASE_URL },
  ({ app }) => {
    app.use(MotionPlugin)
  }
)
