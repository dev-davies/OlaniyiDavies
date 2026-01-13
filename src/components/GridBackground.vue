<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useMouse, useWindowSize, useDark } from '@vueuse/core'

const canvas = ref<HTMLCanvasElement | null>(null)
// Initialize with negative values to ensure 'inactive' state at start
// Initialize with negative values to ensure 'inactive' state at start
const mouseX = ref(-1000) 
const mouseY = ref(-1000)

// Standard mouse tracking (fallback for desktop)
const { x: desktopX, y: desktopY } = useMouse({ type: 'client' })

watch([desktopX, desktopY], () => {
  // Only use mouse if not currently processing touch (simple heuristic)
  mouseX.value = desktopX.value
  mouseY.value = desktopY.value
})

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
  
  // Dynamic Count Logic:
  // 1. Dark Mode: Always 200 (Stars)
  // 2. Light Mode: 
  //    - Desktop: 1200 (Dust Storm)
  //    - Mobile (<768px): 400 (Light Dust - Performance friendly)
  let count = 200
  if (!isDark.value) {
    count = width.value < 768 ? 400 : 1200
  }
  
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

// Handle Touch Events for Mobile Interaction
const handleTouchMove = (e: TouchEvent) => {
  if (e.touches && e.touches.length > 0) {
    const touch = e.touches[0]
    if (touch) {
      mouseX.value = touch.clientX
      mouseY.value = touch.clientY
    }
  }
}

// Watch for theme changes to re-init particles
watch([isDark, width], () => { // Also re-init on resize to adjust density
  initParticles()
})

// Animation Loop
const animate = () => {
  const ctx = canvas.value?.getContext('2d')
  if (!ctx || !canvas.value) return

  // Clear Canvas
  ctx.clearRect(0, 0, width.value, height.value)
  
  particles.forEach(p => {
    // 1. Calculate distance to mouse/touch
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

    // 3. Attraction Logic (Mouse & Touch)
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
  <canvas ref="canvas" class="grid-canvas" @touchmove.passive="handleTouchMove"></canvas>
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
