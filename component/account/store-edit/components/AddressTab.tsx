"use client"

import { ChangeEvent } from "react"
import { Button } from "@/component/ui/Button"
import { Input } from "@/component/ui/Input"
import { MapPin, Save, Loader2 } from "lucide-react"

export interface StoreAddressData {
    address_line1?: string
    address_line2?: string
    city?: string
    state?: string
    country?: string
    pincode?: string
    address_phone?: string
}

interface AddressTabProps {
    address: StoreAddressData
    isSaving: boolean
    hasChanges: boolean
    onAddressChange: (field: keyof StoreAddressData, value: string) => void
    onSave: () => void
}

export function AddressTab({ address, isSaving, hasChanges, onAddressChange, onSave }: AddressTabProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-primary" />
                <h3 className="font-medium">Store Address</h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Address Line 1" value={address.address_line1 || ""} onChange={(e: ChangeEvent<HTMLInputElement>) => onAddressChange('address_line1', e.target.value)} placeholder="Street address" />
                <Input label="Address Line 2 (Optional)" value={address.address_line2 || ""} onChange={(e: ChangeEvent<HTMLInputElement>) => onAddressChange('address_line2', e.target.value)} placeholder="Apartment, suite, etc." />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
                <Input label="City" value={address.city || ""} onChange={(e: ChangeEvent<HTMLInputElement>) => onAddressChange('city', e.target.value)} />
                <Input label="State" value={address.state || ""} onChange={(e: ChangeEvent<HTMLInputElement>) => onAddressChange('state', e.target.value)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
                <Input label="Pincode" value={address.pincode || ""} onChange={(e: ChangeEvent<HTMLInputElement>) => onAddressChange('pincode', e.target.value)} />
                <Input label="Country" value={address.country || "India"} onChange={(e: ChangeEvent<HTMLInputElement>) => onAddressChange('country', e.target.value)} />
                <Input label="Phone" value={address.address_phone || ""} onChange={(e: ChangeEvent<HTMLInputElement>) => onAddressChange('address_phone', e.target.value)} />
            </div>

            {hasChanges && (
                <div className="flex justify-end pt-2">
                    <Button onClick={onSave} disabled={isSaving} className="gap-2">
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save 
                    </Button>
                </div>
            )}
        </div>
    )
}
