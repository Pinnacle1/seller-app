"use client"

import { useRouter } from "next/navigation"
import { Card } from "@/component/ui/Card"
import { Button } from "@/component/ui/Button"
import { Shield, CheckCircle, Clock, AlertCircle, ChevronRight, Building2 } from "lucide-react"
import { SellerKYC, SellerBankDetails } from "@/service/account.service"

interface KYCSectionProps {
    kycStatus: SellerKYC | null
    bankDetails: SellerBankDetails | null
    hasStore: boolean
    storeSlug?: string
}

export function KYCSection({ kycStatus, bankDetails, hasStore, storeSlug }: KYCSectionProps) {
    const router = useRouter()

    const getKYCStatusColor = (status: string) => {
        switch (status) {
            case "verified": return "text-green-500 bg-green-500/10"
            case "pending": return "text-yellow-500 bg-yellow-500/10"
            case "rejected": return "text-red-500 bg-red-500/10"
            default: return "text-muted-foreground bg-muted"
        }
    }

    const getKYCIcon = (status: string) => {
        switch (status) {
            case "verified": return <CheckCircle className="w-5 h-5" />
            case "pending": return <Clock className="w-5 h-5" />
            case "rejected": return <AlertCircle className="w-5 h-5" />
            default: return <Shield className="w-5 h-5" />
        }
    }

    return (
        <Card>
            <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-foreground/10 flex items-center justify-center">
                        <Shield className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold">Verification & Bank Details</h3>
                        <p className="text-xs text-muted-foreground">KYC and payment setup</p>
                    </div>
                </div>
            </div>
            <div className="p-4 space-y-4">
                {/* KYC Status */}
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getKYCStatusColor(kycStatus?.overall_status || "not_started")}`}>
                            {getKYCIcon(kycStatus?.overall_status || "not_started")}
                        </div>
                        <div>
                            <p className="font-medium">KYC Verification</p>
                            <p className="text-xs text-muted-foreground capitalize">
                                {kycStatus?.overall_status?.replace("_", " ") || "Not Started"}
                            </p>
                        </div>
                    </div>
                    {kycStatus?.overall_status !== "verified" && hasStore && (
                        <Button variant="outline" size="sm" onClick={() => router.push(`/${storeSlug}/kyc`)} className="gap-1">
                            Complete KYC <ChevronRight className="w-4 h-4" />
                        </Button>
                    )}
                </div>

                {/* Bank Details */}
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bankDetails?.account_number ? "text-green-500 bg-green-500/10" : "text-muted-foreground bg-muted"}`}>
                            <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-medium">Bank Account</p>
                            <p className="text-xs text-muted-foreground">
                                {bankDetails?.account_number
                                    ? `****${bankDetails.account_number.slice(-4)}`
                                    : "Not added"}
                            </p>
                        </div>
                    </div>
                    {!bankDetails?.account_number && hasStore && (
                        <Button variant="outline" size="sm" onClick={() => router.push(`/${storeSlug}/kyc`)} className="gap-1">
                            Add Bank <ChevronRight className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    )
}
