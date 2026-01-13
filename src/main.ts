import { createApp } from 'vue'
import './assets/scss/main.scss'
import App from './App.vue'
import router from './router'
import { MotionPlugin } from '@vueuse/motion'

import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const app = createApp(App)

app.use(router)
app.use(MotionPlugin)

app.mount('#app')
