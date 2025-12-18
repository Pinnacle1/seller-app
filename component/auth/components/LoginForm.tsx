"use client"

import type React from "react"
import { authService } from "@/service/auth.service"
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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await authService.login({
        emailOrPhone: email,
        password
      })

      if (result.success) {
        onSuccess()
      } else {
        setError(result.message || "Login failed")
      }
    } catch (err: any) {
      console.error("Login failed:", err)
      setError(err.response?.data?.message || err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
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
      {error && <p className="text-sm text-destructive text-center">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing In..." : "Sign In"}
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
