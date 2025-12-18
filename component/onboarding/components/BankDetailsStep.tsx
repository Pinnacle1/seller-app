"use client"

import { useState, forwardRef, useImperativeHandle, useEffect } from "react"
import { Input } from "@/component/ui/Input"
import { Building2, CheckCircle, Loader2 } from "lucide-react"
import { onboardService } from "@/service/onboard.service"
import useOnboardingStore from "@/store/onboarding-store"
import type { FormStepHandle } from "../component.Client"

export const BankDetailsStep = forwardRef<FormStepHandle>((_, ref) => {
  // Get store state
  const {
    bank,
    setBank,
    markStepCompleted
  } = useOnboardingStore()

  // Local state for form - DO NOT sync confirmAccountNumber with accountNumber
  const [accountName, setAccountName] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [confirmAccountNumber, setConfirmAccountNumber] = useState("")
  const [ifscCode, setIfscCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Initialize from store on mount ONLY
  useEffect(() => {
    setAccountName(bank.accountName || "")
    setAccountNumber(bank.accountNumber || "")
    // Only set confirm if bank was already submitted (returning to page)
    if (bank.submitted && bank.accountNumber) {
      setConfirmAccountNumber(bank.accountNumber)
    }
    setIfscCode(bank.ifscCode || "")
  }, []) // Empty dependency - only run on mount

  // Update store when local state changes (except confirmAccountNumber)
  const handleAccountNameChange = (value: string) => {
    setAccountName(value)
    setBank({ accountName: value })
    if (error) setError("")
  }

  const handleAccountNumberChange = (value: string) => {
    const cleanValue = value.replace(/\D/g, "").slice(0, 18)
    setAccountNumber(cleanValue)
    setBank({ accountNumber: cleanValue })
    if (error) setError("")
  }

  const handleConfirmAccountNumberChange = (value: string) => {
    const cleanValue = value.replace(/\D/g, "").slice(0, 18)
    setConfirmAccountNumber(cleanValue)
    if (error) setError("")
  }

  const handleIfscCodeChange = (value: string) => {
    const cleanValue = value.toUpperCase().slice(0, 11)
    setIfscCode(cleanValue)
    setBank({ ifscCode: cleanValue })
    if (error) setError("")
  }

  // Validate IFSC - ABCD0123456 format
  const isValidIfsc = (code: string) => /^[A-Z]{4}0[A-Z0-9]{6}$/.test(code)

  // Validate account number - 9-18 digits
  const isValidAccountNumber = (num: string) => /^\d{9,18}$/.test(num)

  const submitBankDetails = async () => {
    // Validation
    if (!accountName.trim()) {
      setError("Account holder name is required")
      return false
    }

    if (!isValidAccountNumber(accountNumber)) {
      setError("Please enter a valid account number (9-18 digits)")
      return false
    }

    if (accountNumber !== confirmAccountNumber) {
      setError("Account numbers don't match")
      return false
    }

    if (!isValidIfsc(ifscCode)) {
      setError("Please enter a valid IFSC code (e.g., ABCD0123456)")
      return false
    }

    setLoading(true)
    setError("")

    try {
      const success = await useOnboardingStore.getState().submitBankDetails({
        name: accountName,
        account_number: accountNumber,
        ifsc_code: ifscCode,
      })

      if (success) {
        return true
      } else {
        setError(useOnboardingStore.getState().error || "Failed to submit bank details")
        return false
      }
    } catch (err: any) {
      console.error("Bank submission error:", err)
      setError("Failed to submit bank details")
      return false
    } finally {
      setLoading(false)
    }
  }

  useImperativeHandle(ref, () => ({
    submit: async () => {
      // This step is optional, so if nothing is filled, just proceed
      const hasData = accountName.trim() || accountNumber.trim() || ifscCode.trim()

      if (hasData && !bank.submitted) {
        const success = await submitBankDetails()
        if (!success) return false
      }

      markStepCompleted(4)
      return true
    }
  }))

  const handleSubmit = async () => {
    await submitBankDetails()
  }

  // Check if form is valid
  const isFormValid =
    accountName.trim() &&
    isValidAccountNumber(accountNumber) &&
    accountNumber === confirmAccountNumber &&
    isValidIfsc(ifscCode)

  // Mask account number for display
  const maskedAccountNumber = accountNumber ? `****${accountNumber.slice(-4)}` : ""

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-foreground/5 border border-border flex items-center justify-center">
          <Building2 className="w-8 h-8 text-foreground" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Bank Details</h2>
        <p className="text-sm text-muted-foreground">Add your bank account for receiving payouts</p>
      </div>

      <div className="border border-border rounded-xl p-4 md:p-6 space-y-4 bg-muted/30">
        {bank.submitted && (
          <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg mb-4">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <p className="text-sm text-green-500 font-medium">Bank details submitted successfully!</p>
          </div>
        )}

        <Input
          label="Account Holder Name"
          placeholder="Enter name as per bank account"
          value={accountName}
          onChange={(e) => handleAccountNameChange(e.target.value)}
          disabled={bank.submitted}
        />

        <Input
          label="Account Number"
          placeholder="Enter account number"
          type={bank.submitted ? "text" : "password"}
          value={bank.submitted ? maskedAccountNumber : accountNumber}
          onChange={(e) => handleAccountNumberChange(e.target.value)}
          disabled={bank.submitted}
        />

        {!bank.submitted && (
          <Input
            label="Confirm Account Number"
            placeholder="Re-enter account number"
            value={confirmAccountNumber}
            onChange={(e) => handleConfirmAccountNumberChange(e.target.value)}
            error={
              confirmAccountNumber && accountNumber !== confirmAccountNumber
                ? "Account numbers don't match"
                : undefined
            }
          />
        )}

        <Input
          label="IFSC Code"
          placeholder="ABCD0123456"
          value={ifscCode}
          onChange={(e) => handleIfscCodeChange(e.target.value)}
          disabled={bank.submitted}
        />

        {error && <p className="text-sm text-destructive text-center">{error}</p>}

        {!bank.submitted && (
          <button
            onClick={handleSubmit}
            disabled={loading || !isFormValid}
            className="w-full py-2.5 text-sm font-medium bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Bank Details"
            )}
          </button>
        )}
      </div>

      <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <p className="text-xs text-blue-400 text-center">
          This step is optional. You can skip and add bank details later from your dashboard.
        </p>
      </div>

      {bank.submitted && (
        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
          <p className="text-sm text-green-500">You're all set! Click "Finish" to complete onboarding.</p>
        </div>
      )}
    </div>
  )
})

BankDetailsStep.displayName = "BankDetailsStep"
