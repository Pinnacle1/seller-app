"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/component/ui/Input"
import { Button } from "@/component/ui/Button"

interface LoginFormProps {
  onSwitch: () => void
  onSuccess: () => void
}

export function LoginForm({ onSwitch, onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email or Phone"
        type="text"
        placeholder="Enter email or phone"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        label="Password"
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button type="submit" className="w-full">
        Sign In
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <button type="button" onClick={onSwitch} className="text-foreground underline">
          Register
        </button>
      </p>
    </form>
  )
}
