"use client"

import { cn } from "@/lib/utils"
import { motion, Variants } from "framer-motion"
import { ElementType, ReactNode, RefObject } from "react"

interface TimelineContentProps {
  as?: ElementType
  animationNum?: number
  timelineRef?: RefObject<HTMLElement | null>
  customVariants?: Variants
  className?: string
  children?: ReactNode
}

const defaultVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: i * 0.12, duration: 0.5, ease: "easeOut" },
  }),
}

export function TimelineContent({
  as: Tag = "div",
  animationNum = 0,
  customVariants,
  className,
  children,
}: TimelineContentProps) {
  const variants = customVariants || defaultVariants
  const MotionTag = motion[Tag as keyof typeof motion] as typeof motion.div ?? motion.div

  return (
    <MotionTag
      className={cn(className)}
      custom={animationNum}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={variants}
    >
      {children}
    </MotionTag>
  )
}
