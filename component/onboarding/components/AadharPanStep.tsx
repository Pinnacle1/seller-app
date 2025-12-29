"use client"

import { useState, forwardRef, useImperativeHandle, useEffect } from "react"
import { Input } from "@/component/ui/Input"
import { CreditCard, FileText, CheckCircle, Loader2 } from "lucide-react"
import useOnboardingStore from "@/store/onboarding-store"
import { useOnboarding } from "@/hooks/use-onboarding"
import type { FormStepHandle } from "../component.Client"

export const AadharPanStep = forwardRef<FormStepHandle>((_, ref) => {
  // Get store state and hook actions
  const {
    kyc,
    setKyc,
    markStepCompleted,
    setCurrentStep
  } = useOnboardingStore()
  const { submitAadhaar: submitAadhaarApi, submitPan: submitPanApi } = useOnboarding()

  // Local state for form
  const [aadharNumber, setAadharNumber] = useState("")
  const [aadharName, setAadharName] = useState("")
  const [panNumber, setPanNumber] = useState("")
  const [panName, setPanName] = useState("")
  const [loading, setLoading] = useState(false)
  const [aadharError, setAadharError] = useState("")
  const [panError, setPanError] = useState("")

  // Initialize from store on mount
  useEffect(() => {
    setAadharNumber(kyc.aadhaarNumber || "")
    setAadharName(kyc.aadhaarName || "")
    setPanNumber(kyc.panNumber || "")
    setPanName(kyc.panName || "")
  }, []) // Only run on mount

  // Update store when local state changes
  const handleAadharNameChange = (value: string) => {
    setAadharName(value)
    setKyc({ aadhaarName: value })
    if (aadharError) setAadharError("")
  }

  const handleAadharNumberChange = (value: string) => {
    const cleanValue = value.replace(/\D/g, "").slice(0, 12)
    setAadharNumber(cleanValue)
    setKyc({ aadhaarNumber: cleanValue })
    if (aadharError) setAadharError("")
  }

  const handlePanNameChange = (value: string) => {
    setPanName(value)
    setKyc({ panName: value })
    if (panError) setPanError("")
  }

  const handlePanNumberChange = (value: string) => {
    const cleanValue = value.toUpperCase().slice(0, 10)
    setPanNumber(cleanValue)
    setKyc({ panNumber: cleanValue })
    if (panError) setPanError("")
  }

  // Validate Aadhaar - 12 digits
  const isValidAadhar = (num: string) => /^\d{12}$/.test(num)

  // Validate PAN - ABCDE1234F format
  const isValidPan = (num: string) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(num)

  // Mask Aadhaar for display (show only last 4)
  const maskedAadhaar = aadharNumber ? `XXXX XXXX ${aadharNumber.slice(-4)}` : ""

  // Mask PAN for display (show first and last 2)
  const maskedPan = panNumber ? `${panNumber.slice(0, 2)}XXXXX${panNumber.slice(-2)}` : ""

  const submitAadhar = async () => {
    if (!aadharName.trim()) {
      setAadharError("Name is required")
      return false
    }
    if (!isValidAadhar(aadharNumber)) {
      setAadharError("Please enter a valid 12-digit Aadhaar number")
      return false
    }

    setLoading(true)
    setAadharError("")

    try {
      const success = await submitAadhaarApi({
        name: aadharName,
        aadhaar_number: aadharNumber,
      })
      if (success) {
        return true
      } else {
        setAadharError(useOnboardingStore.getState().error || "Failed to submit Aadhaar")
        return false
      }
    } catch (err: any) {
      console.error("Aadhaar submission error:", err)
      setAadharError("Failed to submit Aadhaar")
      return false
    } finally {
      setLoading(false)
    }
  }

  const submitPan = async () => {
    if (!panName.trim()) {
      setPanError("Name is required")
      return false
    }
    if (!isValidPan(panNumber)) {
      setPanError("Please enter a valid PAN number (e.g., ABCDE1234F)")
      return false
    }

    setLoading(true)
    setPanError("")

    try {
      const success = await submitPanApi({
        name: panName,
        pan_number: panNumber,
      })
      if (success) {
        return true
      } else {
        setPanError(useOnboardingStore.getState().error || "Failed to submit PAN")
        return false
      }
    } catch (err: any) {
      console.error("PAN submission error:", err)
      setPanError("Failed to submit PAN")
      return false
    } finally {
      setLoading(false)
    }
  }

  useImperativeHandle(ref, () => ({
    submit: async () => {
      // This step is optional, so if nothing is filled, just proceed
      const hasAadharData = aadharName.trim() || aadharNumber.trim()
      const hasPanData = panName.trim() || panNumber.trim()

      // If any data is entered, validate and submit
      if (hasAadharData && !kyc.aadhaarSubmitted) {
        const success = await submitAadhar()
        if (!success) return false
      }

      if (hasPanData && !kyc.panSubmitted) {
        const success = await submitPan()
        if (!success) return false
      }

      markStepCompleted(3)
      setCurrentStep(4)
      return true
    }
  }))

  const handleSubmitAadhar = async () => {
    await submitAadhar()
  }

  const handleSubmitPan = async () => {
    await submitPan()
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-foreground/5 border border-border flex items-center justify-center">
          <FileText className="w-8 h-8 text-foreground" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Identity Verification (KYC)</h2>
        <p className="text-sm text-muted-foreground">Provide your Aadhaar and PAN details for KYC</p>
      </div>

      <div className="space-y-4">
        {/* Aadhar Card */}
        <div className="border border-border rounded-xl p-4 md:p-6 space-y-4 bg-muted/30">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">Aadhaar Card</span>
            {kyc.aadhaarSubmitted && <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />}
          </div>

          {kyc.aadhaarSubmitted && (
            <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg mb-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <p className="text-sm text-green-500">Aadhaar submitted. Verification pending.</p>
            </div>
          )}

          <Input
            label="Name (as per Aadhaar)"
            placeholder="Enter full name"
            value={aadharName}
            onChange={(e) => handleAadharNameChange(e.target.value)}
            disabled={kyc.aadhaarSubmitted}
          />
          <Input
            label="Aadhaar Number"
            placeholder="XXXX XXXX XXXX"
            value={kyc.aadhaarSubmitted ? maskedAadhaar : aadharNumber}
            onChange={(e) => handleAadharNumberChange(e.target.value)}
            disabled={kyc.aadhaarSubmitted}
          />

          {aadharError && <p className="text-sm text-destructive">{aadharError}</p>}

          {!kyc.aadhaarSubmitted && (
            <button
              onClick={handleSubmitAadhar}
              disabled={loading || !aadharName.trim() || !isValidAadhar(aadharNumber)}
              className="w-full py-2.5 text-sm font-medium border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Aadhaar"
              )}
            </button>
          )}
        </div>

        {/* PAN Card */}
        <div className="border border-border rounded-xl p-4 md:p-6 space-y-4 bg-muted/30">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">PAN Card</span>
            {kyc.panSubmitted && <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />}
          </div>

          {kyc.panSubmitted && (
            <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg mb-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <p className="text-sm text-green-500">PAN submitted. Verification pending.</p>
            </div>
          )}

          <Input
            label="Name (as per PAN)"
            placeholder="Enter full name"
            value={panName}
            onChange={(e) => handlePanNameChange(e.target.value)}
            disabled={kyc.panSubmitted}
          />
          <Input
            label="PAN Number"
            placeholder="ABCDE1234F"
            value={kyc.panSubmitted ? maskedPan : panNumber}
            onChange={(e) => handlePanNumberChange(e.target.value)}
            disabled={kyc.panSubmitted}
          />

          {panError && <p className="text-sm text-destructive">{panError}</p>}

          {!kyc.panSubmitted && (
            <button
              onClick={handleSubmitPan}
              disabled={loading || !panName.trim() || !isValidPan(panNumber)}
              className="w-full py-2.5 text-sm font-medium border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit PAN"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
})

AadharPanStep.displayName = "AadharPanStep"
