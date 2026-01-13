<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useMouse, useWindowSize, useDark } from '@vueuse/core'

const canvas = ref<HTMLCanvasElement | null>(null)
const { x: mouseX, y: mouseY } = useMouse()
const { width, height } = useWindowSize()
const isDark = useDark({ selector: 'body', attribute: 'data-bs-theme' })

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;      // Current opacity
  twinkleSpeed: number; // Speed of twinkling
}

const particles: Particle[] = []
let animationFrameId: number

// Initialize random particles
const initParticles = () => {
  particles.length = 0
  
  // Dynamic Count: Day mode is "busier" (600) vs Night mode "stars" (200)
  const count = isDark.value ? 200 : 600
  
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width.value,
      y: Math.random() * height.value,
      vx: (Math.random() - 0.5) * 0.2, // Slower natural drift
      vy: (Math.random() - 0.5) * 0.2,
      size: Math.random() * 2,
      opacity: Math.random(),
      twinkleSpeed: Math.random() * 0.02 + 0.005
    })
  }
}

// Watch for theme changes to re-init particles
watch(isDark, () => {
  initParticles()
})

// Animation Loop
const animate = () => {
  const ctx = canvas.value?.getContext('2d')
  if (!ctx || !canvas.value) return

  // Clear Canvas
  ctx.clearRect(0, 0, width.value, height.value)
  
  particles.forEach(p => {
    // 1. Calculate distance to mouse
    const dx = mouseX.value - p.x
    const dy = mouseY.value - p.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    // 2. Twinkle Logic (Dark Mode Only)
    if (isDark.value) {
      p.opacity += p.twinkleSpeed
      if (p.opacity > 1 || p.opacity < 0.2) p.twinkleSpeed = -p.twinkleSpeed
    } else {
      p.opacity = 0.6 // Consistent solid look in Light Mode
    }

    // 3. Mouse Attraction
    const forceDistance = 200
    if (distance < forceDistance) {
      const force = (forceDistance - distance) / forceDistance
      const angle = Math.atan2(dy, dx)
      const moveStrength = 0.5
      
      p.vx += Math.cos(angle) * force * moveStrength
      p.vy += Math.sin(angle) * force * moveStrength
    }

    // 4. Physics & Limits
    const maxSpeed = 2
    const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
    if (speed > maxSpeed) {
      p.vx = (p.vx / speed) * maxSpeed
      p.vy = (p.vy / speed) * maxSpeed
    } else if (distance > forceDistance && speed > 0.2) {
        // Stronger friction to return to "drift" state
        p.vx *= 0.95
        p.vy *= 0.95
    }

    // 5. Move
    p.x += p.vx
    p.y += p.vy

    // 6. Wrap
    if (p.x < 0) p.x = width.value
    if (p.x > width.value) p.x = 0
    if (p.y < 0) p.y = height.value
    if (p.y > height.value) p.y = 0

    // 7. Draw
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    
    if (isDark.value) {
      // Star Style
      ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`
      ctx.shadowBlur = p.size * 2
      ctx.shadowColor = 'white'
    } else {
      // Busy Dust Style (Darker for contrast against cream)
      ctx.fillStyle = `rgba(100, 100, 90, ${p.opacity})`
      ctx.shadowBlur = 0
    }
    
    ctx.fill()
    ctx.shadowBlur = 0 
  })

  animationFrameId = requestAnimationFrame(animate)
}

// Handle resizing
watch([width, height], () => {
  if (canvas.value) {
    canvas.value.width = width.value
    canvas.value.height = height.value
    initParticles()
  }
})

// Start
onMounted(() => {
  if (canvas.value) {
    canvas.value.width = width.value
    canvas.value.height = height.value
    initParticles()
    animate()
  }
})

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId)
})
</script>

<template>
  <canvas ref="canvas" class="grid-canvas"></canvas>
</template>

<style scoped>
.grid-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  pointer-events: none;
  background-color: var(--bg-color);
  transition: background-color 0.4s ease;
}
</style>

<style>
/* Remove global override to allow local control */
</style>
