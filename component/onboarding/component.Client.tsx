"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { StoreInfoStep } from "./components/StoreInfoStep"
import { LogoUploadStep } from "./components/LogoUploadStep"
import { VerificationStep } from "./components/VerificationStep"
import { AadharPanStep } from "./components/AadharPanStep"
import { BankDetailsStep } from "./components/BankDetailsStep"
import { ChevronLeft, ChevronRight } from "lucide-react"

const STEPS = [
  { id: 1, title: "Store Info", canSkip: true },
  { id: 2, title: "Logo", canSkip: true },
  { id: 3, title: "Verify", canSkip: false },
  { id: 4, title: "KYC", canSkip: true },
  { id: 5, title: "Bank", canSkip: true },
]

export function OnboardingClient() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [stepCompleted, setStepCompleted] = useState<Record<number, boolean>>({})

  const handleNext = () => {
    setStepCompleted((prev) => ({ ...prev, [currentStep]: true }))
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    } else {
      router.push("/home")
    }
  }

  const handleSkip = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    } else {
      router.push("/home")
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const currentStepConfig = STEPS.find((s) => s.id === currentStep)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress Header */}
      <div className="p-4 border-b border-border">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-semibold">Complete Your Profile</h1>
            <span className="text-sm text-muted-foreground">
              {currentStep} of {STEPS.length}
            </span>
          </div>
          <div className="flex gap-1">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  step.id <= currentStep ? "bg-foreground" : "bg-border"
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {STEPS.map((step) => (
              <span
                key={step.id}
                className={`text-xs ${step.id === currentStep ? "text-foreground" : "text-muted-foreground"}`}
              >
                {step.title}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="max-w-2xl mx-auto">
          {currentStep === 1 && <StoreInfoStep onComplete={handleNext} />}
          {currentStep === 2 && <LogoUploadStep onComplete={handleNext} />}
          {currentStep === 3 && <VerificationStep onComplete={handleNext} />}
          {currentStep === 4 && <AadharPanStep onComplete={handleNext} />}
          {currentStep === 5 && <BankDetailsStep onComplete={handleNext} />}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="p-4 border-t border-border">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center gap-1 px-4 py-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex items-center gap-3">
            {currentStepConfig?.canSkip && (
              <button
                onClick={handleSkip}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Skip
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex items-center gap-1 px-6 py-2 text-sm bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors"
            >
              {currentStep === 5 ? "Finish" : "Next"}
              {currentStep < 5 && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
