"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { StoreInfoStep } from "./components/StoreInfoStep"
import { LogoUploadStep } from "./components/LogoUploadStep"
import { VerificationStep } from "./components/VerificationStep"
import { AadharPanStep } from "./components/AadharPanStep"
import { BankDetailsStep } from "./components/BankDetailsStep"
import { Store, Image, ShieldCheck, CreditCard, Building2, Check, Loader2 } from "lucide-react"
import { authService } from "@/service/auth.service"
import useOnboardingStore from "@/store/onboarding-store"
import useActiveStoreStore from "@/store/active-store"

// Form step handle type for ref-based submission
export type FormStepHandle = {
  submit: () => Promise<boolean>
}

// Step configuration
const STEPS = [
  { id: 0, title: "Store Info", icon: Store, canSkip: false },
  { id: 1, title: "Logo", icon: Image, canSkip: true },
  { id: 2, title: "Verify", icon: ShieldCheck, canSkip: false },
  { id: 3, title: "KYC", icon: CreditCard, canSkip: true },
  { id: 4, title: "Bank", icon: Building2, canSkip: true },
]

// Animation variants
const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -100 : 100,
    opacity: 0,
  }),
}

// Progress Indicator Component
function ProgressIndicator({ steps, currentStep }: { steps: typeof STEPS; currentStep: number }) {
  const progressPercentage = Math.round(((currentStep + 1) / steps.length) * 100)

  return (
    <div className="w-full pt-2 pb-0 lg:pt-6 lg:pb-3">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-foreground/70">
            Overall Progress
          </span>
          <span className="text-sm font-medium text-foreground/70">
            {progressPercentage}%
          </span>
        </div>
        <div className="w-full bg-border rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="hidden md:flex items-center justify-between">
        {steps.map((stepItem, index) => {
          const Icon = stepItem.icon
          return (
            <div
              key={index}
              className="flex-1 flex items-center justify-center relative"
            >
              {/* Step Indicator */}
              <div className="max-w-fit flex flex-col items-center justify-center">
                <div className="flex flex-col justify-center items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${index < currentStep
                      ? "bg-green-500 text-white"
                      : index === currentStep
                        ? "bg-foreground text-background ring-4 ring-foreground/20"
                        : "bg-border text-muted-foreground"
                      }`}
                  >
                    {index < currentStep ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p
                      className={`text-xs font-medium ${index <= currentStep ? "text-foreground" : "text-muted-foreground"
                        }`}
                    >
                      {stepItem.title}
                    </p>
                  </div>
                </div>
              </div>
              {/* Step Line */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute top-[1rem] -right-[2rem] w-[4rem] h-1 mb-2 rounded-full transition-all duration-300 ${index < currentStep ? "bg-green-500" : "bg-border"
                    }`}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Mobile Step Indicator */}
      <div className="flex md:hidden items-center justify-center gap-2 mt-4">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${index === currentStep
              ? "w-8 bg-foreground"
              : index < currentStep
                ? "w-2 bg-green-500"
                : "w-2 bg-border"
              }`}
          />
        ))}
      </div>
    </div>
  )
}

// Navigation Footer Component
interface OnboardingFooterProps {
  onBack?: () => void
  onNext?: () => void
  onFinish?: () => void
  onSkip?: () => void
  isFirstStep: boolean
  isLastStep: boolean
  canSkip: boolean
  loading?: boolean
}

function OnboardingFooter({
  onBack,
  onNext,
  onFinish,
  onSkip,
  isFirstStep,
  isLastStep,
  canSkip,
  loading = false,
}: OnboardingFooterProps) {
  return (
    <div className="w-full flex items-center justify-between flex-wrap md:flex-nowrap gap-4 mt-8">
      {/* Back Button */}
      {!isFirstStep ? (
        <button
          onClick={onBack}
          disabled={loading}
          className="text-sm sm:text-base py-2.5 px-6 border border-border font-medium text-foreground rounded-full hover:bg-muted transition-colors disabled:opacity-50"
        >
          Previous
        </button>
      ) : (
        <div />
      )}

      {/* Next/Skip/Finish Buttons */}
      <div className="flex items-center justify-end gap-3">
        {canSkip && (
          <button
            onClick={onSkip}
            disabled={loading}
            className="text-sm sm:text-base py-2.5 px-6 border border-yellow-500/50 font-medium text-yellow-500 rounded-full hover:bg-yellow-500/10 transition-colors disabled:opacity-50"
          >
            {isLastStep ? "Skip & Finish" : "Skip"}
          </button>
        )}

        {!isLastStep ? (
          <button
            onClick={onNext}
            disabled={loading}
            className="text-sm sm:text-base py-2.5 px-6 bg-foreground font-medium text-background rounded-full hover:bg-foreground/90 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Next"
            )}
          </button>
        ) : (
          <button
            onClick={onFinish}
            disabled={loading}
            className="text-sm sm:text-base py-2.5 px-6 bg-green-500 font-medium text-white rounded-full hover:bg-green-600 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Finishing...
              </>
            ) : (
              "Finish"
            )}
          </button>
        )}
      </div>
    </div>
  )
}

export function OnboardingClient() {
  const router = useRouter()
  const formRef = useRef<FormStepHandle>(null)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [loading, setLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)

  // Use Zustand store
  const {
    currentStep,
    setCurrentStep,
    completedSteps,
    markStepCompleted,
    storeInfo,
    setStoreInfo,
    verification,
    setVerification,
    kyc,
    setKyc,
    bank,
    setBank,
    userData,
    setUserData,
    reset,
  } = useOnboardingStore()

  const { setActiveStore } = useActiveStoreStore()

  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === STEPS.length - 1
  const currentStepConfig = STEPS[currentStep]

  // Fetch user data on mount for verification step
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const result = await authService.me()
        if (result.success && result.data) {
          const user = result.data
          setUserData({
            email: user.email || "",
            phone: user.phone || "",
          })
          // Pre-fill verification if not already set
          if (!verification.email && user.email) {
            setVerification({ email: user.email })
          }
          if (!verification.phone && user.phone) {
            setVerification({ phone: user.phone })
          }
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error)
      } finally {
        setIsInitializing(false)
      }
    }

    fetchUserData()
  }, [])

  const goNext = useCallback(async () => {
    // For form-based steps, validate via ref
    if (formRef.current) {
      setLoading(true)
      try {
        const isValid = await formRef.current.submit()
        if (!isValid) {
          setLoading(false)
          return
        }
        markStepCompleted(currentStep)
      } catch (error) {
        console.error("Step validation error:", error)
        setLoading(false)
        return
      }
      setLoading(false)
    } else {
      markStepCompleted(currentStep)
    }

    if (!isLastStep) {
      setDirection(1)
      setCurrentStep(currentStep + 1)
    }
  }, [currentStep, isLastStep, markStepCompleted, setCurrentStep])

  const goBack = useCallback(() => {
    if (!isFirstStep) {
      setDirection(-1)
      setCurrentStep(currentStep - 1)
    }
  }, [isFirstStep, currentStep, setCurrentStep])

  const handleSkip = useCallback(() => {
    if (isLastStep) {
      // Skip & Finish for the last step - set active store first
      if (storeInfo.id && storeInfo.slug) {
        setActiveStore({
          id: storeInfo.id,
          slug: storeInfo.slug,
          name: storeInfo.name,
          logo_url: storeInfo.logoUrl,
        })
      }
      const slug = storeInfo.slug
      reset()
      router.push(slug ? `/${slug}/home` : "/dashboard")
    } else {
      setDirection(1)
      setCurrentStep(currentStep + 1)
    }
  }, [isLastStep, currentStep, router, reset, setCurrentStep, storeInfo, setActiveStore])

  const handleFinish = useCallback(async () => {
    // For the last step, try to submit if it has a form
    if (formRef.current) {
      setLoading(true)
      try {
        const isValid = await formRef.current.submit()
        if (!isValid) {
          setLoading(false)
          return
        }
      } catch (error) {
        console.error("Final step error:", error)
        setLoading(false)
        return
      }
      setLoading(false)
    }

    // Set active store before clearing onboarding data
    if (storeInfo.id && storeInfo.slug) {
      setActiveStore({
        id: storeInfo.id,
        slug: storeInfo.slug,
        name: storeInfo.name,
        logo_url: storeInfo.logoUrl,
      })
    }

    // Clear onboarding data and redirect
    const slug = storeInfo.slug
    reset()
    router.push(slug ? `/${slug}/home` : "/dashboard")
  }, [router, reset, storeInfo, setActiveStore])

  // Render step content
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <StoreInfoStep ref={formRef} />
      case 1:
        return <LogoUploadStep ref={formRef} />
      case 2:
        return <VerificationStep ref={formRef} />
      case 3:
        return <AadharPanStep ref={formRef} />
      case 4:
        return <BankDetailsStep ref={formRef} />
      default:
        return null
    }
  }

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-foreground" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-start py-8 px-4">
      <div className="w-full max-w-2xl xl:max-w-3xl flex flex-col gap-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Complete Your Profile</h1>
          <p className="text-muted-foreground mt-1">
            Step {currentStep + 1} of {STEPS.length}: {currentStepConfig.title}
          </p>
        </div>

        {/* Progress Indicator */}
        <ProgressIndicator steps={STEPS} currentStep={currentStep} />

        {/* Form Content with Animation */}
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentStep}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Footer */}
        <OnboardingFooter
          onBack={goBack}
          onNext={goNext}
          onFinish={handleFinish}
          onSkip={handleSkip}
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          canSkip={currentStepConfig.canSkip}
          loading={loading}
        />
      </div>
    </div>
  )
}
