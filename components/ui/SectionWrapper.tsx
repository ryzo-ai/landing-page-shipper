'use client'

import { motion } from 'framer-motion'
import { CSSProperties, ReactNode } from 'react'

interface SectionWrapperProps {
  children: ReactNode
  className?: string
  id?: string
  style?: CSSProperties
}

export default function SectionWrapper({ children, className = '', id, style }: SectionWrapperProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-80px' }}
      className={className}
      style={style}
    >
      {children}
    </motion.section>
  )
}
