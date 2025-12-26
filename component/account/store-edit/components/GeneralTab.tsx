"use client"

import { ChangeEvent } from "react"
import { Button } from "@/component/ui/Button"
import { Input } from "@/component/ui/Input"
import { Textarea } from "@/component/ui/Textarea"
import { Store, Upload, Save, Loader2 } from "lucide-react"

interface GeneralTabProps {
    name: string
    description: string
    logoPreview: string | null
    isSaving: boolean
    hasChanges: boolean
    onNameChange: (value: string) => void
    onDescriptionChange: (value: string) => void
    onLogoSelect: (e: ChangeEvent<HTMLInputElement>) => void
    onSave: () => void
}

export function GeneralTab({
    name, description, logoPreview, isSaving, hasChanges,
    onNameChange, onDescriptionChange, onLogoSelect, onSave
}: GeneralTabProps) {
    return (
        <div className="space-y-6">
            {/* Logo */}
            <div className="flex items-center gap-4">
                <div className="relative w-24 h-24 rounded-xl border border-border overflow-hidden bg-muted flex items-center justify-center group">
                    {logoPreview ? (
                        <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                        <Store className="w-8 h-8 text-muted-foreground" />
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <label className="cursor-pointer p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors">
                            <Upload className="w-5 h-5" />
                            <input type="file" className="hidden" accept="image/*" onChange={onLogoSelect} />
                        </label>
                    </div>
                </div>
                <div>
                    <h3 className="font-medium">Store Logo</h3>
                    <p className="text-xs text-muted-foreground mt-1">Recommended size: 200x200px</p>
                </div>
            </div>

            <Input label="Store Name" value={name} onChange={(e) => onNameChange(e.target.value)} />

            <div className="space-y-1.5">
                <label className="text-sm font-medium">Description</label>
                <Textarea value={description} onChange={(e) => onDescriptionChange(e.target.value)} rows={4} />
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
