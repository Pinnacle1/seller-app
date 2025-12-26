"use client"

import { type TextareaHTMLAttributes, forwardRef } from "react"

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string
    error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className = "", label, error, ...props }, ref) => {
        return (
            <div className="space-y-1.5">
                {label && <label className="text-sm text-muted-foreground">{label}</label>}
                <textarea
                    ref={ref}
                    className={`w-full min-h-[80px] p-3 bg-input text-foreground border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground/50 transition-colors resize-y ${error ? "border-destructive" : ""} ${className}`}
                    {...props}
                />
                {error && <p className="text-xs text-destructive">{error}</p>}
            </div>
        )
    },
)

Textarea.displayName = "Textarea"
