"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { KycForm } from "./components/KycForm"
import { StatusBanner } from "./components/StatusBanner"

export function KycClient() {
  const router = useRouter()
  const [status, setStatus] = useState<"none" | "pending" | "verified" | "rejected">("none")

  const handleSubmit = () => {
    setStatus("pending")
  }

  const handleSkip = () => {
    router.push("/home")
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">KYC Verification</h1>
          <p className="text-muted-foreground text-sm">Complete verification to publish products and receive payouts</p>
        </div>

        {status !== "none" && (
          <div className="mb-6">
            <StatusBanner
              status={status}
              message={
                status === "pending"
                  ? "We're reviewing your documents. This usually takes 24-48 hours."
                  : status === "rejected"
                    ? "Please re-upload clear images of your documents."
                    : "Your account is verified. You can now publish products."
              }
            />
          </div>
        )}

        {status === "none" && (
          <div className="border border-border rounded-xl p-4 md:p-6">
            <KycForm onSubmit={handleSubmit} onSkip={handleSkip} />
          </div>
        )}

        {status === "pending" && (
          <div className="text-center">
            <button onClick={() => router.push("/home")} className="text-sm text-muted-foreground underline">
              Continue to Dashboard →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
