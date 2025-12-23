"use client"

import { Card } from "@/component/ui/Card"
import { Button } from "@/component/ui/Button"
import { Input } from "@/component/ui/Input"
import { User, Mail, Phone, Calendar, Edit, Save, X, Loader2, CheckCircle } from "lucide-react"
import { SellerData } from "@/service/account.service"

interface ProfileSectionProps {
    seller: SellerData | null
    isEditing: boolean
    editName: string
    editPhone: string
    isSaving: boolean
    onEditChange: (editing: boolean) => void
    onNameChange: (value: string) => void
    onPhoneChange: (value: string) => void
    onSave: () => void
    formatDate: (dateString: string) => string
}

export function ProfileSection({
    seller,
    isEditing,
    editName,
    editPhone,
    isSaving,
    onEditChange,
    onNameChange,
    onPhoneChange,
    onSave,
    formatDate
}: ProfileSectionProps) {
    return (
        <Card>
            <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-foreground/10 flex items-center justify-center">
                        <User className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold">Seller Profile</h3>
                        <p className="text-xs text-muted-foreground">Your personal information</p>
                    </div>
                </div>
                {isEditing ? (
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => onEditChange(false)}>
                            <X className="w-4 h-4" />
                        </Button>
                        <Button size="sm" onClick={onSave} disabled={isSaving}>
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        </Button>
                    </div>
                ) : (
                    <Button variant="outline" size="sm" onClick={() => onEditChange(true)}>
                        <Edit className="w-4 h-4" />
                    </Button>
                )}
            </div>
            <div className="p-4">
                {isEditing ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input label="Full Name" value={editName} onChange={(e) => onNameChange(e.target.value)} />
                        <Input label="Phone Number" value={editPhone} onChange={(e) => onPhoneChange(e.target.value)} />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">Name</p>
                            <p className="font-medium">{seller?.name || "Not set"}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">Email</p>
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                <p className="text-sm">{seller?.email}</p>
                                {seller?.email_verified && <CheckCircle className="w-4 h-4 text-green-500" />}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">Phone</p>
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                <p className="text-sm">{seller?.phone || "Not provided"}</p>
                                {seller?.phone_verified && <CheckCircle className="w-4 h-4 text-green-500" />}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">Member Since</p>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <p className="text-sm">{seller?.created_at ? formatDate(seller.created_at) : "N/A"}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    )
}
