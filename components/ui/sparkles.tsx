"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface SparklesProps {
  className?: string
  color?: string
  density?: number
  speed?: number
}

interface Particle {
  x: number
  y: number
  size: number
  opacity: number
  vx: number
  vy: number
  life: number
  maxLife: number
}

export function Sparkles({
  className,
  color = "#00e5c3",
  density = 60,
  speed = 0.5,
}: SparklesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number
    const particles: Particle[] = []

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const spawn = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5 + 0.5,
      opacity: 0,
      vx: (Math.random() - 0.5) * speed * 0.4,
      vy: -Math.random() * speed * 0.6 - 0.1,
      life: 0,
      maxLife: Math.random() * 120 + 80,
    })

    for (let i = 0; i < density; i++) {
      const p = spawn()
      p.life = Math.random() * p.maxLife
      p.opacity = Math.sin((p.life / p.maxLife) * Math.PI) * 0.7
      particles.push(p)
    }

    const hex2rgb = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)
      return `${r},${g},${b}`
    }
    const rgb = hex2rgb(color.startsWith("#") ? color : "#00e5c3")

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        p.life++
        p.x += p.vx
        p.y += p.vy
        p.opacity = Math.sin((p.life / p.maxLife) * Math.PI) * 0.75
        if (p.life >= p.maxLife) Object.assign(p, spawn(), { life: 0 })
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${rgb},${p.opacity})`
        ctx.fill()
      }
      animId = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
    }
  }, [color, density, speed])

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 h-full w-full", className)}
    />
  )
}
