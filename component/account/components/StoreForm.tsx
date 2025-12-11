"use client"

import { useState } from "react"
import { Input } from "@/component/ui/Input"
import { Button } from "@/component/ui/Button"
import { UploadZone } from "@/component/ui/UploadZone"

export function StoreForm() {
  const [storeName, setStoreName] = useState("My Thrift Store")
  const [description, setDescription] = useState("Quality secondhand items")
  const [address, setAddress] = useState("")

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Store Info</h3>
      <UploadZone label="Store Logo" />
      <Input label="Store Name" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
      <div className="space-y-1.5">
        <label className="text-sm text-muted-foreground">Description</label>
        <textarea
          className="w-full h-20 px-3 py-2 bg-input text-foreground border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground/50 resize-none"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <Input
        label="Business Address"
        placeholder="Enter address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <Button>Save Changes</Button>
    </div>
  )
}
