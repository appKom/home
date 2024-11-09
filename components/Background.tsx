"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"

export const Background = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const lines = Array.from({ length: 5 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"
      style={{
        width: '100%',
        top: `${(i + 1) * 20}%`,
        left: 0,
      }}
      animate={{
        x: ['-100%', '100%'],
        transition: {
          repeat: Infinity,
          repeatType: 'loop',
          duration: 10 + i * 2,
          ease: 'linear',
        },
      }}
    />
  ))

  return (
    <div className="fixed inset-0 -z-10 min-h-screen bg-gray-950 text-gray-100 overflow-hidden">
      {lines}
      <motion.div
        className="absolute pointer-events-none"
        animate={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(29, 78, 216, 0.15), transparent 80%)`,
        }}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"
        animate={{
          scaleX: [0, 1, 0],
          opacity: [0, 1, 0],
          transition: {
            repeat: Infinity,
            duration: 5,
            ease: 'easeInOut',
          },
        }}
      />
    </div>
  )
}