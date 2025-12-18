"use client"

import { type InputHTMLAttributes, forwardRef, useState } from "react"
import { Eye, EyeOff } from "lucide-react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className = "", label, error, type, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === "password"

  return (
    <div className="space-y-1.5">
      {label && <label className="text-sm text-muted-foreground">{label}</label>}
      <div className="relative">
        <input
          ref={ref}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          className={`w-full h-10 px-3 bg-input text-foreground border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground/50 transition-colors ${error ? "border-destructive" : ""} ${className} ${isPassword ? "pr-10" : ""}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
})

Input.displayName = "Input"
