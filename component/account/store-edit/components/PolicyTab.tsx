"use client"

import { ChangeEvent } from "react"
import { Button } from "@/component/ui/Button"
import { Input } from "@/component/ui/Input"
import { Textarea } from "@/component/ui/Textarea"
import { Truck, RotateCcw, Headphones, Save, Loader2 } from "lucide-react"

export interface StorePoliciesData {
    shipping_policy?: string
    return_policy?: string
    support_contact?: string
}

interface PolicyTabProps {
    policies: StorePoliciesData
    isSaving: boolean
    hasChanges: boolean
    onPoliciesChange: (field: keyof StorePoliciesData, value: string) => void
    onSave: () => void
}

export function PolicyTab({ policies, isSaving, hasChanges, onPoliciesChange, onSave }: PolicyTabProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <Truck className="w-4 h-4" /> Shipping Policy
                    </label>
                    <Textarea
                        value={policies.shipping_policy || ""}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onPoliciesChange('shipping_policy', e.target.value)}
                        rows={3}
                        placeholder="Describe your shipping policy..."
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <RotateCcw className="w-4 h-4" /> Return Policy
                    </label>
                    <Textarea
                        value={policies.return_policy || ""}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onPoliciesChange('return_policy', e.target.value)}
                        rows={3}
                        placeholder="Describe your return policy..."
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <Headphones className="w-4 h-4" /> Support Contact
                    </label>
                    <Input
                        value={policies.support_contact || ""}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => onPoliciesChange('support_contact', e.target.value)}
                        placeholder="Email or phone for customer support"
                    />
                </div>

                {hasChanges && (
                    <div className="flex justify-end pt-2">
                        <Button onClick={onSave} disabled={isSaving} className="gap-2">
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Policies
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
