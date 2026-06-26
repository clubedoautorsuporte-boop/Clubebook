'use client'

import React from 'react'
import { motion } from 'motion/react'
import { Star } from 'lucide-react'

export type Testimonial = {
  text: string
  image: string
  name: string
  role: string
}

export function TestimonialsColumn({
  className,
  testimonials,
  duration = 10,
}: {
  className?: string
  testimonials: Testimonial[]
  duration?: number
}) {
  return (
    <div className={className} style={{ overflow: 'hidden' }}>
      <motion.div
        animate={{ translateY: '-50%' }}
        transition={{ duration, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
        className="flex flex-col gap-4 pb-4"
      >
        {[0, 1].map(idx => (
          <React.Fragment key={idx}>
            {testimonials.map(({ text, image, name, role }, i) => (
              <div
                key={`${idx}-${i}`}
                className="w-[280px] rounded-2xl border border-[#1c2438] bg-[#0f1523] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
              >
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="size-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-[13px] italic leading-relaxed text-[#c8d3eb]">
                  &ldquo;{text}&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <img
                    src={image}
                    alt={name}
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full object-cover ring-1 ring-[#1c2438]"
                  />
                  <div>
                    <div className="text-sm font-semibold leading-tight text-white">{name}</div>
                    <div className="text-xs leading-tight text-[#6b7a99]">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  )
}
