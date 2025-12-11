"use client"

import { useState } from "react"
import { Input } from "@/component/ui/Input"
import { Building2 } from "lucide-react"

interface BankDetailsStepProps {
  onComplete: () => void
}

export function BankDetailsStep({ onComplete }: BankDetailsStepProps) {
  const [accountName, setAccountName] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [confirmAccountNumber, setConfirmAccountNumber] = useState("")
  const [ifscCode, setIfscCode] = useState("")
  const [bankName, setBankName] = useState("")
  const [branchName, setBranchName] = useState("")

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full border border-border flex items-center justify-center">
          <Building2 className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Bank Details</h2>
        <p className="text-sm text-muted-foreground">Add your bank account for receiving payouts</p>
      </div>

      <div className="border border-border rounded-xl p-4 md:p-6 space-y-4">
        <Input
          label="Account Holder Name"
          placeholder="Enter name as per bank account"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
        />

        <Input
          label="Account Number"
          placeholder="Enter account number"
          type="password"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
        />

        <Input
          label="Confirm Account Number"
          placeholder="Re-enter account number"
          value={confirmAccountNumber}
          onChange={(e) => setConfirmAccountNumber(e.target.value.replace(/\D/g, ""))}
          error={
            confirmAccountNumber && accountNumber !== confirmAccountNumber ? "Account numbers don't match" : undefined
          }
        />

        <Input
          label="IFSC Code"
          placeholder="ABCD0001234"
          value={ifscCode}
          onChange={(e) => setIfscCode(e.target.value.toUpperCase().slice(0, 11))}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Bank Name"
            placeholder="Enter bank name"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
          />
          <Input
            label="Branch Name"
            placeholder="Enter branch name"
            value={branchName}
            onChange={(e) => setBranchName(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
