<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useMouse, useWindowSize, useDark, usePreferredReducedMotion } from '@vueuse/core'

const canvas = ref<HTMLCanvasElement | null>(null)
// Initialize with negative values to ensure 'inactive' state at start
// Initialize with negative values to ensure 'inactive' state at start
const mouseX = ref(-1000) 
const mouseY = ref(-1000)
const lastMouseMoveTime = ref(Date.now())
const isMouseIdle = ref(false)
const shapeFormationPoints = ref<{ x: number; y: number }[]>([])
const pulseCount = ref(0)
const pulsePhase = ref(0)

// Standard mouse tracking (fallback for desktop)
const { x: desktopX, y: desktopY } = useMouse({ type: 'client' })

watch([desktopX, desktopY], () => {
  // Only use mouse if not currently processing touch (simple heuristic)
  mouseX.value = desktopX.value
  mouseY.value = desktopY.value
  lastMouseMoveTime.value = Date.now()
  isMouseIdle.value = false
  pulseCount.value = 0
})

const { width, height } = useWindowSize()
const preferredReducedMotion = usePreferredReducedMotion()
const isMobile = ref(width.value < 768)

watch(width, () => {
  isMobile.value = width.value < 768
})
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
  isFormationParticle?: boolean; // Whether this particle is part of the shape
}

const particles: Particle[] = []
let animationFrameId: number
let lastFrameTime = 0
const TARGET_FPS = 30
const FRAME_INTERVAL = 1000 / TARGET_FPS

// Pre-rendered glow sprite (replaces expensive per-particle shadowBlur)
const glowCanvas = document.createElement('canvas')
const GLOW_SIZE = 24
glowCanvas.width = GLOW_SIZE
glowCanvas.height = GLOW_SIZE
;(() => {
  const gCtx = glowCanvas.getContext('2d')
  if (!gCtx) return
  const g = gCtx.createRadialGradient(GLOW_SIZE / 2, GLOW_SIZE / 2, 0, GLOW_SIZE / 2, GLOW_SIZE / 2, GLOW_SIZE / 2)
  g.addColorStop(0, 'rgba(255, 255, 255, 0.35)')
  g.addColorStop(1, 'rgba(255, 255, 255, 0)')
  gCtx.fillStyle = g
  gCtx.fillRect(0, 0, GLOW_SIZE, GLOW_SIZE)
})()

// Generate different shape patterns
const generateTextShape = (text: string, centerX: number, centerY: number, fontSize: number = 120): { x: number; y: number }[] => {
  const points: { x: number; y: number }[] = []
  const tempCanvas = document.createElement('canvas')
  const ctx = tempCanvas.getContext('2d')
  if (!ctx) return points

  tempCanvas.width = 300
  tempCanvas.height = 150
  
  ctx.fillStyle = 'white'
  ctx.font = `bold ${fontSize}px Arial, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  
  // Draw text multiple times for bolder appearance
  ctx.fillText(text, 150, 75)
  ctx.fillText(text, 150, 75)
  
  const imageData = ctx.getImageData(0, 0, 300, 150)
  const data = imageData.data
  
  // Sample pixels to create formation points
  for (let y = 0; y < 150; y += 2) {
    for (let x = 0; x < 300; x += 2) {
      const index = (y * 300 + x) * 4
      const alpha = data[index + 3]
      if (alpha !== undefined && alpha > 128) {
        points.push({
          x: centerX + (x - 150) * 1.5,
          y: centerY + (y - 75) * 1.5
        })
      }
    }
  }
  
  return points
}

const generateHeartShape = (centerX: number, centerY: number): { x: number; y: number }[] => {
  const points: { x: number; y: number }[] = []
  const scale = 8
  
  for (let t = 0; t < Math.PI * 2; t += 0.05) {
    const x = scale * 16 * Math.pow(Math.sin(t), 3)
    const y = -scale * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
    points.push({ x: centerX + x, y: centerY + y })
  }
  
  return points
}

const generateStarShape = (centerX: number, centerY: number): { x: number; y: number }[] => {
  const points: { x: number; y: number }[] = []
  const outerRadius = 100
  const innerRadius = 45
  const spikes = 5
  
  for (let i = 0; i < spikes * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius
    const angle = (i * Math.PI) / spikes - Math.PI / 2
    
    for (let r = 0; r <= radius; r += 3) {
      points.push({
        x: centerX + r * Math.cos(angle),
        y: centerY + r * Math.sin(angle)
      })
    }
  }
  
  return points
}

const generateSmileyShape = (centerX: number, centerY: number): { x: number; y: number }[] => {
  const points: { x: number; y: number }[] = []
  const radius = 80
  
  // Face circle
  for (let angle = 0; angle < Math.PI * 2; angle += 0.05) {
    points.push({
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    })
  }
  
  // Left eye
  for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
    points.push({
      x: centerX - 30 + 10 * Math.cos(angle),
      y: centerY - 20 + 10 * Math.sin(angle)
    })
  }
  
  // Right eye
  for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
    points.push({
      x: centerX + 30 + 10 * Math.cos(angle),
      y: centerY - 20 + 10 * Math.sin(angle)
    })
  }
  
  // Smile
  for (let angle = 0; angle < Math.PI; angle += 0.05) {
    points.push({
      x: centerX + 40 * Math.cos(angle),
      y: centerY + 20 + 40 * Math.sin(angle)
    })
  }
  
  return points
}

const generateWaveShape = (centerX: number, centerY: number): { x: number; y: number }[] => {
  const points: { x: number; y: number }[] = []
  
  for (let x = -150; x <= 150; x += 3) {
    const y = Math.sin(x * 0.03) * 50
    points.push({ x: centerX + x, y: centerY + y })
    // Add thickness
    points.push({ x: centerX + x, y: centerY + y + 5 })
    points.push({ x: centerX + x, y: centerY + y - 5 })
  }
  
  return points
}

const shapes = [
  { name: 'hi', generator: (x: number, y: number) => generateTextShape('Hi', x, y, 140) },
  { name: 'heart', generator: generateHeartShape },
  { name: 'star', generator: generateStarShape },
  { name: 'smiley', generator: generateSmileyShape },
  { name: 'wave', generator: generateWaveShape }
]

// Check for mouse idle and trigger shape formation
const checkMouseIdle = () => {
  const idleTime = Date.now() - lastMouseMoveTime.value
  if (idleTime > 2000 && !isMouseIdle.value) {
    isMouseIdle.value = true
    pulseCount.value = 0
    // Randomly select a shape
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)]
    if (randomShape) {
      shapeFormationPoints.value = randomShape.generator(mouseX.value, mouseY.value)
      
      // Assign formation status to only a subset of particles (every 3rd particle)
      // This leaves 2/3 of particles free to continue normal behavior
      particles.forEach((p, index) => {
        p.isFormationParticle = index % 3 === 0
      })
    }
  }
  
  // Pulse animation and dispersion
  if (isMouseIdle.value) {
    pulsePhase.value = (pulsePhase.value + 0.05) % (Math.PI * 2)
    
    // Count pulses (one pulse = one complete cycle)
    if (pulsePhase.value < 0.1 && pulsePhase.value > 0) {
      pulseCount.value += 1
    }
    
    // Disperse after 3 pulses
    if (pulseCount.value >= 3) {
      isMouseIdle.value = false
      shapeFormationPoints.value = []
      pulseCount.value = 0
      pulsePhase.value = 0
      // Reset all formation flags
      particles.forEach(p => {
        p.isFormationParticle = false
        p.targetX = undefined
        p.targetY = undefined
      })
    }
  }
}

// Initialize random particles
const initParticles = () => {
  particles.length = 0
  
  // Dynamic Count Logic: 400 for Mobile, 1200 for Desktop
  const count = isMobile.value ? 250 : 600
  
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width.value,
      y: Math.random() * height.value,
      vx: (Math.random() - 0.5) * 0.8, // Faster natural drift (increased from 0.5)
      vy: (Math.random() - 0.5) * 0.8,
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

// Consolidated watcher: theme changes + resize
watch([isDark, width, height], () => {
  if (canvas.value) {
    canvas.value.width = width.value
    canvas.value.height = height.value
    initParticles()
  }
})

// Animation Loop
const animate = (timestamp: number = 0) => {
  animationFrameId = requestAnimationFrame(animate)

  // Frame throttle — cap at 30fps for smooth but efficient rendering
  const elapsed = timestamp - lastFrameTime
  if (elapsed < FRAME_INTERVAL) return
  lastFrameTime = timestamp - (elapsed % FRAME_INTERVAL)

  const ctx = canvas.value?.getContext('2d')
  if (!ctx || !canvas.value || preferredReducedMotion.value === 'reduce') return

  // Check for mouse idle
  checkMouseIdle()

  // Cache reactive values outside hot loop to avoid repeated Vue proxy access
  const w = width.value
  const h = height.value
  const dark = isDark.value
  const mobile = isMobile.value
  const mx = mouseX.value
  const my = mouseY.value

  // Clear Canvas
  ctx.clearRect(0, 0, w, h)
  
  particles.forEach((p, index) => {
    // 1. Calculate distance to mouse/touch
    const dx = mx - p.x
    const dy = my - p.y
    const distSq = dx * dx + dy * dy
    const distance = Math.sqrt(distSq)
    
    // 2. Twinkle Logic (Dark Mode Only)
    if (dark) {
      p.opacity += p.twinkleSpeed
      if (p.opacity > 1 || p.opacity < 0.2) p.twinkleSpeed = -p.twinkleSpeed
    } else {
      p.opacity = 0.6
    }

    // 3. Shape Formation Mode (only for designated particles)
    if (isMouseIdle.value && shapeFormationPoints.value.length > 0 && p.isFormationParticle) {
      // Assign target point if not already assigned
      if (p.targetX === undefined || p.targetY === undefined) {
        const targetPoint = shapeFormationPoints.value[index % shapeFormationPoints.value.length]
        if (targetPoint && targetPoint.x !== undefined && targetPoint.y !== undefined) {
          p.targetX = targetPoint.x
          p.targetY = targetPoint.y
        }
      }
      
      // Move toward target with pulse effect
      if (p.targetX !== undefined && p.targetY !== undefined) {
        // Apply pulse effect (breathing motion)
        const pulseScale = 1 + Math.sin(pulsePhase.value) * 0.1
        const targetX = mx + (p.targetX - mx) * pulseScale
        const targetY = my + (p.targetY - my) * pulseScale
        
        const tdx = targetX - p.x
        const tdy = targetY - p.y
        const targetDistance = Math.sqrt(tdx * tdx + tdy * tdy)
        
        if (targetDistance > 5) {
          const formationStrength = 0.08 // Increased from 0.05 for faster formation
          p.vx += tdx * formationStrength
          p.vy += tdy * formationStrength
        }
      }
    } else {
      // 3b. Regular Attraction Logic (Mouse & Touch) - for non-formation particles
      p.targetX = undefined
      p.targetY = undefined
      
      const forceDistance = 200
      if (distance < forceDistance) {
        const force = (forceDistance - distance) / forceDistance
        const angle = Math.atan2(dy, dx)
        // Extra boost for non-formation particles during shape mode
        const moveStrength = (isMouseIdle.value && shapeFormationPoints.value.length > 0) ? 2.5 : 1.5
        
        p.vx += Math.cos(angle) * force * moveStrength
        p.vy += Math.sin(angle) * force * moveStrength
      }
    }

    // 4. Physics & Limits
    const maxSpeed = 6 // Increased from 4 for even faster movement
    const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
    if (speed > maxSpeed) {
      p.vx = (p.vx / speed) * maxSpeed
      p.vy = (p.vy / speed) * maxSpeed
    } else if (!isMouseIdle.value && distance > 200 && speed > 0.2) {
        // Less friction for non-formation particles during shape mode
        const frictionMultiplier = (isMouseIdle.value && !p.isFormationParticle) ? 0.98 : 0.95
        p.vx *= frictionMultiplier
        p.vy *= frictionMultiplier
    }

    // 5. Move
    p.x += p.vx
    p.y += p.vy

    // 6. Wrap
    if (p.x < 0) p.x = w
    if (p.x > w) p.x = 0
    if (p.y < 0) p.y = h
    if (p.y > h) p.y = 0

    // 7. Draw
    if (dark) {
      // Glow effect via pre-rendered sprite (replaces expensive shadowBlur)
      if (!mobile && p.size > 0.8) {
        const glowScale = p.size * 4
        ctx.globalAlpha = p.opacity * 0.4
        ctx.drawImage(glowCanvas, p.x - glowScale / 2, p.y - glowScale / 2, glowScale, glowScale)
        ctx.globalAlpha = 1
      }
      ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`
    } else {
      ctx.fillStyle = `rgba(100, 100, 90, ${p.opacity})`
    }
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx.fill()
  })

}

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
