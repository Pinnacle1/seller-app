"use client"

import { type InputHTMLAttributes, forwardRef } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className = "", label, error, ...props }, ref) => {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-sm text-muted-foreground">{label}</label>}
      <input
        ref={ref}
        className={`w-full h-10 px-3 bg-input text-foreground border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground/50 transition-colors ${error ? "border-destructive" : ""} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
})

Input.displayName = "Input"
