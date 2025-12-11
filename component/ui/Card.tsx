"use client"

import { type HTMLAttributes, forwardRef } from "react"

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ className = "", children, ...props }, ref) => {
  return (
    <div ref={ref} className={`bg-card border border-border rounded-xl p-4 md:p-6 ${className}`} {...props}>
      {children}
    </div>
  )
})

Card.displayName = "Card"
