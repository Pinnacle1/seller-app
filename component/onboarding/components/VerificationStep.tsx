"use client"

import { useState, forwardRef, useImperativeHandle, useEffect } from "react"
import { Input } from "@/component/ui/Input"
import { Mail, Phone, CheckCircle, Loader2, ShieldCheck, Lock } from "lucide-react"
import { authService } from "@/service/auth.service"
import useOnboardingStore from "@/store/onboarding-store"
import { useOnboarding } from "@/hooks/use-onboarding"
import type { FormStepHandle } from "../component.Client"

export const VerificationStep = forwardRef<FormStepHandle>((_, ref) => {
  // Get store state and hook actions
  const {
    verification,
    setVerification,
    userData,
    setUserData,
    markStepCompleted,
    setCurrentStep
  } = useOnboardingStore()
  const { sendPhoneOtp, sendEmailOtp, verifyOtp } = useOnboarding()

  // Local state for OTP
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [phoneOtp, setPhoneOtp] = useState("")
  const [emailOtp, setEmailOtp] = useState("")
  const [phoneSent, setPhoneSent] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [phoneLoading, setPhoneLoading] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)
  const [phoneError, setPhoneError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Fetch user data and initialize form on mount
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true)

      // If we already have verification data in store, use that
      if (verification.phone || verification.email) {
        setPhone(verification.phone)
        setEmail(verification.email)
        setIsLoading(false)
        return
      }

      // If we have user data in store, use that
      if (userData?.phone || userData?.email) {
        const phoneValue = userData.phone || ""
        const emailValue = userData.email || ""
        setPhone(phoneValue)
        setEmail(emailValue)
        setVerification({ phone: phoneValue, email: emailValue })
        setIsLoading(false)
        return
      }

      // Otherwise, fetch from API
      try {
        const result = await authService.me()
        if (result.success && result.data) {
          const user = result.data
          const phoneValue = user.phone || ""
          const emailValue = user.email || ""

          // Save to store
          setUserData({ phone: phoneValue, email: emailValue })
          setVerification({ phone: phoneValue, email: emailValue })

          // Set local state
          setPhone(phoneValue)
          setEmail(emailValue)
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeData()
  }, []) // Only run on mount

  // Check if values came from registration (for display purposes)
  const isPhoneFromRegistration = !!userData?.phone && phone === userData.phone
  const isEmailFromRegistration = !!userData?.email && email === userData.email

  useImperativeHandle(ref, () => ({
    submit: async () => {
      if (!verification.phoneVerified) {
        setPhoneError("Please verify your phone number")
        return false
      }
      if (!verification.emailVerified) {
        setEmailError("Please verify your email address")
        return false
      }
      markStepCompleted(2)
      setCurrentStep(3)
      return true
    }
  }))

  const handleSendPhoneOtp = async () => {
    if (phone.length < 10) {
      setPhoneError("Please enter a valid 10-digit phone number")
      return
    }

    setPhoneLoading(true)
    setPhoneError("")

    try {
      // Save phone to store
      setVerification({ phone })

      const success = await sendPhoneOtp(phone)
      if (success) {
        setPhoneSent(true)
      } else {
        setPhoneError(useOnboardingStore.getState().error || "Failed to send OTP")
      }
    } catch (err: any) {
      console.error("Phone OTP error:", err)
      setPhoneError("Failed to send OTP")
    } finally {
      setPhoneLoading(false)
    }
  }

  const handleSendEmailOtp = async () => {
    if (!email.includes("@")) {
      setEmailError("Please enter a valid email address")
      return
    }

    setEmailLoading(true)
    setEmailError("")

    try {
      // Save email to store
      setVerification({ email })

      const success = await sendEmailOtp(email)
      if (success) {
        setEmailSent(true)
      } else {
        setEmailError(useOnboardingStore.getState().error || "Failed to send OTP")
      }
    } catch (err: any) {
      console.error("Email OTP error:", err)
      setEmailError("Failed to send OTP")
    } finally {
      setEmailLoading(false)
    }
  }

  const handleVerifyPhone = async () => {
    if (phoneOtp.length !== 6) {
      setPhoneError("Please enter a 6-digit OTP")
      return
    }

    setPhoneLoading(true)
    setPhoneError("")

    try {
      const success = await verifyOtp(phone, phoneOtp, 'phone')
      if (!success) {
        setPhoneError(useOnboardingStore.getState().error || "Invalid OTP")
      }
    } catch (err: any) {
      console.error("Phone verify error:", err)
      setPhoneError("Verification failed")
    } finally {
      setPhoneLoading(false)
    }
  }

  const handleVerifyEmail = async () => {
    if (emailOtp.length !== 6) {
      setEmailError("Please enter a 6-digit OTP")
      return
    }

    setEmailLoading(true)
    setEmailError("")

    try {
      const success = await verifyOtp(email, emailOtp, 'email')
      if (!success) {
        setEmailError(useOnboardingStore.getState().error || "Invalid OTP")
      }
    } catch (err: any) {
      console.error("Email verify error:", err)
      setEmailError("Verification failed")
    } finally {
      setEmailLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-foreground/5 border border-border flex items-center justify-center">
          <ShieldCheck className="w-8 h-8 text-foreground" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Verify Your Contact</h2>
        <p className="text-sm text-muted-foreground">Verify your phone and email to secure your account</p>
      </div>

      <div className="space-y-4">
        {/* Phone Verification */}
        <div className="border border-border rounded-xl p-4 md:p-6 space-y-4 bg-muted/30">
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">Mobile Number</span>
            {verification.phoneVerified && <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />}
          </div>

          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                placeholder="Enter mobile number"
                value={phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 10)
                  setPhone(value)
                  setVerification({ phone: value })
                }}
                disabled={phoneSent || verification.phoneVerified || isPhoneFromRegistration}
              />
              {(isPhoneFromRegistration || verification.phoneVerified) && (
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              )}
            </div>
            {!phoneSent && !verification.phoneVerified && (
              <button
                onClick={handleSendPhoneOtp}
                disabled={phoneLoading || phone.length < 10}
                className="shrink-0 px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {phoneLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send OTP"}
              </button>
            )}
          </div>

          {isPhoneFromRegistration && !phoneSent && !verification.phoneVerified && (
            <p className="text-xs text-muted-foreground">
              Phone number from registration. Click "Send OTP" to verify.
            </p>
          )}

          {phoneSent && !verification.phoneVerified && (
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Enter 6-digit OTP"
                  value={phoneOtp}
                  onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                />
              </div>
              <button
                onClick={handleVerifyPhone}
                disabled={phoneLoading || phoneOtp.length !== 6}
                className="shrink-0 px-4 py-2 text-sm font-medium bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {phoneLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify"}
              </button>
            </div>
          )}

          {phoneError && <p className="text-sm text-destructive">{phoneError}</p>}

          {verification.phoneVerified && (
            <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <p className="text-sm text-green-500">Phone verified successfully</p>
            </div>
          )}
        </div>

        {/* Email Verification */}
        <div className="border border-border rounded-xl p-4 md:p-6 space-y-4 bg-muted/30">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">Email Address</span>
            {verification.emailVerified && <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />}
          </div>

          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                placeholder="Enter email address"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setVerification({ email: e.target.value })
                }}
                disabled={emailSent || verification.emailVerified || isEmailFromRegistration}
              />
              {(isEmailFromRegistration || verification.emailVerified) && (
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              )}
            </div>
            {!emailSent && !verification.emailVerified && (
              <button
                onClick={handleSendEmailOtp}
                disabled={emailLoading || !email.includes("@")}
                className="shrink-0 px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {emailLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send OTP"}
              </button>
            )}
          </div>

          {isEmailFromRegistration && !emailSent && !verification.emailVerified && (
            <p className="text-xs text-muted-foreground">
              Email from registration. Click "Send OTP" to verify.
            </p>
          )}

          {emailSent && !verification.emailVerified && (
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Enter 6-digit OTP"
                  value={emailOtp}
                  onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                />
              </div>
              <button
                onClick={handleVerifyEmail}
                disabled={emailLoading || emailOtp.length !== 6}
                className="shrink-0 px-4 py-2 text-sm font-medium bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {emailLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify"}
              </button>
            </div>
          )}

          {emailError && <p className="text-sm text-destructive">{emailError}</p>}

          {verification.emailVerified && (
            <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <p className="text-sm text-green-500">Email verified successfully</p>
            </div>
          )}
        </div>
      </div>

      {verification.phoneVerified && verification.emailVerified && (
        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
          <p className="text-sm text-green-500">Both verified! Click "Next" to proceed.</p>
        </div>
      )}

      <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <p className="text-xs text-yellow-500 text-center">
          This step is required. You must verify both phone and email to continue.
        </p>
      </div>
    </div>
  )
})

VerificationStep.displayName = "VerificationStep"
