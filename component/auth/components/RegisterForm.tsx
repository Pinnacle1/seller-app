"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/component/ui/Input"
import { Button } from "@/component/ui/Button"

import { authService } from "@/service/auth.service"

interface RegisterFormProps {
  onSwitch: () => void
  onSuccess: () => void
}

export function RegisterForm({ onSwitch, onSuccess }: RegisterFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await authService.register({
        name,
        email,
        phone,
        password,
        role: "seller" // Force role to seller for this app
      })

      if (result.success) {
        onSuccess()
      } else {
        setError(result.message || "Registration failed")
      }
    } catch (err: any) {
      console.error("Registration failed:", err)
      setError(err.response?.data?.message || err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Full Name"
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        label="Email"
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        label="Phone"
        type="tel"
        placeholder="Enter phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <Input
        label="Password"
        type="password"
        placeholder="Create password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="text-sm text-destructive text-center">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating Account..." : "Create Account"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <button type="button" onClick={onSwitch} className="text-foreground underline">
          Sign In
        </button>
      </p>
    </form>
  )
}
