"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import useActiveStoreStore from "@/store/active-store"
import { LoginForm } from "./components/LoginForm"
import { RegisterForm } from "./components/RegisterForm"

export function AuthClient() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const { activeStoreSlug } = useActiveStoreStore()

  const handleLoginSuccess = () => {
    if (activeStoreSlug) {
      router.push(`/${activeStoreSlug}/home`)
      return
    }
    router.push("/dashboard")
  }

  const handleRegisterSuccess = () => {
    router.push("/onboarding")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Fynde Seller</h1>
          <p className="text-sm text-muted-foreground">{isLogin ? "Welcome back" : "Start selling today"}</p>
        </div>
        <div className="border border-border rounded-xl p-6">
          {isLogin ? (
            <LoginForm onSwitch={() => setIsLogin(false)} onSuccess={handleLoginSuccess} />
          ) : (
            <RegisterForm onSwitch={() => setIsLogin(true)} onSuccess={handleRegisterSuccess} />
          )}
        </div>
        <div className="mt-6 flex justify-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isLogin ? "bg-foreground" : "bg-border"}`} />
          <span className={`w-2 h-2 rounded-full ${!isLogin ? "bg-foreground" : "bg-border"}`} />
        </div>
      </div>
    </div>
  )
}
