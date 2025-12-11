"use client"

import { Input } from "@/component/ui/Input"
import { Button } from "@/component/ui/Button"
import { useState } from "react"

export function PayoutDetails() {
  const [bankAccount, setBankAccount] = useState("XXXX1234")
  const [ifsc, setIfsc] = useState("HDFC0001234")
  const [holder, setHolder] = useState("John Doe")

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Payout Details</h3>
      <div className="p-4 bg-muted rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">Available Balance</p>
            <p className="text-2xl font-bold">₹12,450</p>
          </div>
          <Button size="sm">Request Payout</Button>
        </div>
      </div>
      <Input label="Account Holder" value={holder} onChange={(e) => setHolder(e.target.value)} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Bank Account" value={bankAccount} onChange={(e) => setBankAccount(e.target.value)} />
        <Input label="IFSC Code" value={ifsc} onChange={(e) => setIfsc(e.target.value)} />
      </div>
      <Button variant="outline">Update Bank Details</Button>
    </div>
  )
}
