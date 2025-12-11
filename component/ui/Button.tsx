"use client"

import { type ButtonHTMLAttributes, forwardRef } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive"
  size?: "sm" | "md" | "lg"
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors border disabled:opacity-50 disabled:pointer-events-none"

    const variants = {
      primary: "bg-primary text-primary-foreground border-primary hover:bg-primary/90",
      secondary: "bg-secondary text-secondary-foreground border-border hover:bg-secondary/80",
      outline: "bg-transparent text-foreground border-border hover:bg-accent",
      ghost: "bg-transparent text-foreground border-transparent hover:bg-accent",
      destructive: "bg-destructive text-destructive-foreground border-destructive hover:bg-destructive/90",
    }

    const sizes = {
      sm: "h-8 px-3 text-xs rounded-md",
      md: "h-10 px-4 text-sm rounded-lg",
      lg: "h-12 px-6 text-base rounded-lg",
    }

    return (
      <button ref={ref} className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
        {children}
      </button>
    )
  },
)

Button.displayName = "Button"
