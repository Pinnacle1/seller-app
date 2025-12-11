"use client"

import { type SelectHTMLAttributes, forwardRef } from "react"

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string; label: string }[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", label, options, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && <label className="text-sm text-muted-foreground">{label}</label>}
        <select
          ref={ref}
          className={`w-full h-10 px-3 bg-input text-foreground border border-border rounded-lg text-sm focus:outline-none focus:border-foreground/50 transition-colors ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    )
  },
)

Select.displayName = "Select"
