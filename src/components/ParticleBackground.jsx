import React from 'react'
import { motion } from 'framer-motion'

export default function ParticleBackground() {
  return (
    <div className="particle-bg">
      <div className="absolute inset-0 bg-gradient-to-br from-navy-900/95 via-navy-800/90 to-navy-700/95" />
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="particle-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f5d787" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#f5d787" stopOpacity="0" />
          </radialGradient>
        </defs>
        {[...Array(30)].map((_, i) => (
          <motion.circle
            key={i}
            cx={`${Math.random() * 100}%`}
            cy={`${Math.random() * 100}%`}
            r={Math.random() * 3 + 1}
            fill="url(#particle-glow)"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </svg>
    </div>
  )
}
