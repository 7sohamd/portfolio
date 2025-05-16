"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  color: string
}

interface TechIcon {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  rotation: number
  rotationSpeed: number
  icon: string
  opacity: number
}

const techIcons = [
  "⚛️", // React
  "🟢", // Node
  "🔥", // Firebase
  "🐍", // Python
  "☕", // Java
  "🅰️", // Angular
  "🟦", // TypeScript
  "💻", // Code
  "🖥️", // Computer
  "📱", // Mobile
  "🚀", // Deployment
  "🔷", // GraphQL
  "🐘", // PHP
  "🐬", // MySQL
  "🍃", // MongoDB
]

export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePosition = useRef({ x: 0, y: 0 })
  const particles = useRef<Particle[]>([])
  const techIconsRef = useRef<TechIcon[]>([])
  const animationFrameId = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas to full screen
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
      initTechIcons()
    }

    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY }
    }

    // Initialize particles
    const initParticles = () => {
      const particleCount = 200; // Increased from a lower value (e.g., 100) to 200
      particles.current = Array.from({ length: particleCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1, // Particle size between 1 and 4
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        color: `rgba(199, 120, 221, 1)`, // Full visibility
      }))
    }

    // Initialize tech icons
    const initTechIcons = () => {
      techIconsRef.current = []
      const iconCount = Math.floor((canvas.width * canvas.height) / 70000) // Fewer icons than particles

      for (let i = 0; i < iconCount; i++) {
        techIconsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 15 + 15, // Size between 15-30px
          speedX: Math.random() * 0.3 - 0.15,
          speedY: Math.random() * 0.3 - 0.15,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() * 0.5 - 0.25) * 0.5,
          icon: techIcons[Math.floor(Math.random() * techIcons.length)],
          opacity: Math.random() * 0.2 + 0.3, // Increased opacity range
        })
      }
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw and update tech icons (behind particles)
      techIconsRef.current.forEach((icon) => {
        ctx.save()
        ctx.translate(icon.x, icon.y)
        ctx.rotate((icon.rotation * Math.PI) / 180)
        ctx.globalAlpha = icon.opacity
        ctx.font = `${icon.size}px Arial`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(icon.icon, 0, 0)
        ctx.restore()

        // Update position
        icon.x += icon.speedX
        icon.y += icon.speedY
        icon.rotation += icon.rotationSpeed

        // Wrap around edges
        if (icon.x > canvas.width + icon.size) icon.x = -icon.size
        if (icon.x < -icon.size) icon.x = canvas.width + icon.size
        if (icon.y > canvas.height + icon.size) icon.y = -icon.size
        if (icon.y < -icon.size) icon.y = canvas.height + icon.size
      })

      // Draw and update particles
      particles.current.forEach((particle, index) => {
        // Draw particle
        ctx.fillStyle = particle.color
        ctx.globalAlpha = 0.3; // Increased from 0.8 to 1 for full visibility
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 0.3

        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Wrap around edges
        if (particle.x > canvas.width) particle.x = 0
        if (particle.x < 0) particle.x = canvas.width
        if (particle.y > canvas.height) particle.y = 0
        if (particle.y < 0) particle.y = canvas.height

        // Connect particles that are close to mouse
        const dx = mousePosition.current.x - particle.x
        const dy = mousePosition.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 120) {
          // Draw line to mouse
          ctx.beginPath()
          ctx.strokeStyle = `rgba(199, 120, 221, ${0.6 - distance / 400})`; // Increased base opacity from 0.3 to 0.6
          ctx.lineWidth = 0.5
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(mousePosition.current.x, mousePosition.current.y)
          ctx.stroke()

          // Slightly attract particles to mouse
          particle.x += dx * 0.01
          particle.y += dy * 0.01
        }

        // Connect nearby particles
        particles.current.forEach((otherParticle, otherIndex) => {
          if (index !== otherIndex) {
            const dx = particle.x - otherParticle.x
            const dy = particle.y - otherParticle.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 80) {
              ctx.beginPath()
              ctx.strokeStyle = `rgba(100, 100, 100, ${0.2 - distance / 400})`
              ctx.lineWidth = 0.3
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(otherParticle.x, otherParticle.y)
              ctx.stroke()
            }
          }
        })
      })

      animationFrameId.current = requestAnimationFrame(animate)
    }

    // Set up event listeners
    window.addEventListener("resize", handleResize)
    window.addEventListener("mousemove", handleMouseMove)

    // Initialize
    handleResize()
    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationFrameId.current)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0" />
}
