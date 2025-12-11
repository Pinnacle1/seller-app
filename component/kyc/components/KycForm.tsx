"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/component/ui/Input"
import { Button } from "@/component/ui/Button"
import { Select } from "@/component/ui/Select"
import { UploadZone } from "@/component/ui/UploadZone"

interface KycFormProps {
  onSubmit: () => void
  onSkip: () => void
}

const merchantTypes = [
  { value: "individual", label: "Individual" },
  { value: "business", label: "Business" },
]

export function KycForm({ onSubmit, onSkip }: KycFormProps) {
  const [aadharNumber, setAadharNumber] = useState("")
  const [panNumber, setPanNumber] = useState("")
  const [bankAccount, setBankAccount] = useState("")
  const [ifsc, setIfsc] = useState("")
  const [accountHolder, setAccountHolder] = useState("")
  const [merchantType, setMerchantType] = useState("individual")
  const [gst, setGst] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-medium border-b border-border pb-2">Identity Documents</h3>
        <Input
          label="Aadhar Number"
          placeholder="XXXX XXXX XXXX"
          value={aadharNumber}
          onChange={(e) => setAadharNumber(e.target.value)}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UploadZone label="Aadhar Front" />
          <UploadZone label="Aadhar Back" />
        </div>
        <Input
          label="PAN Number"
          placeholder="ABCDE1234F"
          value={panNumber}
          onChange={(e) => setPanNumber(e.target.value)}
        />
        <UploadZone label="PAN Card Image" />
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium border-b border-border pb-2">Bank Details</h3>
        <Input
          label="Account Holder Name"
          placeholder="As per bank records"
          value={accountHolder}
          onChange={(e) => setAccountHolder(e.target.value)}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Bank Account Number"
            placeholder="Account number"
            value={bankAccount}
            onChange={(e) => setBankAccount(e.target.value)}
          />
          <Input label="IFSC Code" placeholder="BANK0001234" value={ifsc} onChange={(e) => setIfsc(e.target.value)} />
        </div>
        <UploadZone label="Cancelled Cheque / Passbook" />
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium border-b border-border pb-2">Business Info</h3>
        <Select
          label="Merchant Type"
          options={merchantTypes}
          value={merchantType}
          onChange={(e) => setMerchantType(e.target.value)}
        />
        <Input
          label="GST Number (Optional)"
          placeholder="22AAAAA0000A1Z5"
          value={gst}
          onChange={(e) => setGst(e.target.value)}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onSkip} className="sm:flex-1 bg-transparent">
          Skip for Now
        </Button>
        <Button type="submit" className="sm:flex-1">
          Submit for Verification
        </Button>
      </div>
    </form>
  )
}
