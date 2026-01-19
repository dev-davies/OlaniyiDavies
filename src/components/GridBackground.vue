<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useMouse, useWindowSize, useDark } from '@vueuse/core'

const canvas = ref<HTMLCanvasElement | null>(null)
// Initialize with negative values to ensure 'inactive' state at start
// Initialize with negative values to ensure 'inactive' state at start
const mouseX = ref(-1000) 
const mouseY = ref(-1000)
const lastMouseMoveTime = ref(Date.now())
const isMouseIdle = ref(false)
const shapeFormationPoints = ref<{ x: number; y: number }[]>([])

// Standard mouse tracking (fallback for desktop)
const { x: desktopX, y: desktopY } = useMouse({ type: 'client' })

watch([desktopX, desktopY], () => {
  // Only use mouse if not currently processing touch (simple heuristic)
  mouseX.value = desktopX.value
  mouseY.value = desktopY.value
  lastMouseMoveTime.value = Date.now()
  isMouseIdle.value = false
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
  targetX?: number;     // Target position for formation
  targetY?: number;
}

const particles: Particle[] = []
let animationFrameId: number

// Generate shape formation points (text "Hi")
const generateShapePoints = (centerX: number, centerY: number): { x: number; y: number }[] => {
  const points: { x: number; y: number }[] = []
  const tempCanvas = document.createElement('canvas')
  const ctx = tempCanvas.getContext('2d')
  if (!ctx) return points

  tempCanvas.width = 200
  tempCanvas.height = 100
  
  ctx.fillStyle = 'white'
  ctx.font = 'bold 80px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('Hi', 100, 50)
  
  const imageData = ctx.getImageData(0, 0, 200, 100)
  const data = imageData.data
  
  // Sample pixels to create formation points
  for (let y = 0; y < 100; y += 3) {
    for (let x = 0; x < 200; x += 3) {
      const index = (y * 200 + x) * 4
      if (data[index + 3] > 128) { // If pixel is visible
        points.push({
          x: centerX + (x - 100) * 2,
          y: centerY + (y - 50) * 2
        })
      }
    }
  }
  
  return points
}

// Check for mouse idle and trigger shape formation
const checkMouseIdle = () => {
  const idleTime = Date.now() - lastMouseMoveTime.value
  if (idleTime > 2000 && !isMouseIdle.value) {
    isMouseIdle.value = true
    shapeFormationPoints.value = generateShapePoints(mouseX.value, mouseY.value)
  }
}

// Initialize random particles
const initParticles = () => {
  particles.length = 0
  
  // Dynamic Count Logic:
  // 1. Dark Mode: Always 400 (Stars) - Doubled from 200
  // 2. Light Mode: 
  //    - Desktop: 2400 (Dust Storm) - Doubled from 1200
  //    - Mobile (<768px): 800 (Light Dust) - Doubled from 400
  let count = 400
  if (!isDark.value) {
    count = width.value < 768 ? 800 : 2400
  }
  
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width.value,
      y: Math.random() * height.value,
      vx: (Math.random() - 0.5) * 0.5, // Faster natural drift (increased from 0.2)
      vy: (Math.random() - 0.5) * 0.5,
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
      lastMouseMoveTime.value = Date.now()
      isMouseIdle.value = false
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

  // Check for mouse idle
  checkMouseIdle()

  // Clear Canvas
  ctx.clearRect(0, 0, width.value, height.value)
  
  particles.forEach((p, index) => {
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

    // 3. Shape Formation Mode
    if (isMouseIdle.value && shapeFormationPoints.value.length > 0) {
      // Assign target point if not already assigned
      if (p.targetX === undefined || p.targetY === undefined) {
        const targetPoint = shapeFormationPoints.value[index % shapeFormationPoints.value.length]
        if (targetPoint && targetPoint.x !== undefined && targetPoint.y !== undefined) {
          p.targetX = targetPoint.x
          p.targetY = targetPoint.y
        }
      }
      
      // Move toward target
      if (p.targetX !== undefined && p.targetY !== undefined) {
        const tdx = p.targetX - p.x
        const tdy = p.targetY - p.y
        const targetDistance = Math.sqrt(tdx * tdx + tdy * tdy)
        
        if (targetDistance > 5) {
          const formationStrength = 0.05
          p.vx += tdx * formationStrength
          p.vy += tdy * formationStrength
        }
      }
    } else {
      // 3b. Regular Attraction Logic (Mouse & Touch)
      p.targetX = undefined
      p.targetY = undefined
      
      const forceDistance = 200
      if (distance < forceDistance) {
        const force = (forceDistance - distance) / forceDistance
        const angle = Math.atan2(dy, dx)
        const moveStrength = 0.8 // Increased from 0.5 for stronger attraction
        
        p.vx += Math.cos(angle) * force * moveStrength
        p.vy += Math.sin(angle) * force * moveStrength
      }
    }

    // 4. Physics & Limits
    const maxSpeed = 4 // Increased from 2 for faster movement
    const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
    if (speed > maxSpeed) {
      p.vx = (p.vx / speed) * maxSpeed
      p.vy = (p.vy / speed) * maxSpeed
    } else if (!isMouseIdle.value && distance > 200 && speed > 0.2) {
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
