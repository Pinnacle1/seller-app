"use client"

import { useState } from "react"
import { Input } from "@/component/ui/Input"
import { CreditCard, FileText } from "lucide-react"

interface AadharPanStepProps {
  onComplete: () => void
}

export function AadharPanStep({ onComplete }: AadharPanStepProps) {
  const [aadharNumber, setAadharNumber] = useState("")
  const [aadharName, setAadharName] = useState("")
  const [panNumber, setPanNumber] = useState("")
  const [panName, setPanName] = useState("")

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full border border-border flex items-center justify-center">
          <FileText className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Identity Verification</h2>
        <p className="text-sm text-muted-foreground">Provide your Aadhar and PAN details for KYC</p>
      </div>

      <div className="space-y-4">
        {/* Aadhar Card */}
        <div className="border border-border rounded-xl p-4 md:p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">Aadhar Card</span>
          </div>

          <Input
            label="Name (as per Aadhar)"
            placeholder="Enter full name"
            value={aadharName}
            onChange={(e) => setAadharName(e.target.value)}
          />
          <Input
            label="Aadhar Number"
            placeholder="XXXX XXXX XXXX"
            value={aadharNumber}
            onChange={(e) => setAadharNumber(e.target.value.replace(/\D/g, "").slice(0, 12))}
          />
        </div>

        {/* PAN Card */}
        <div className="border border-border rounded-xl p-4 md:p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">PAN Card</span>
          </div>

          <Input
            label="Name (as per PAN)"
            placeholder="Enter full name"
            value={panName}
            onChange={(e) => setPanName(e.target.value)}
          />
          <Input
            label="PAN Number"
            placeholder="ABCDE1234F"
            value={panNumber}
            onChange={(e) => setPanNumber(e.target.value.toUpperCase().slice(0, 10))}
          />
        </div>
      </div>
    </div>
  )
}
