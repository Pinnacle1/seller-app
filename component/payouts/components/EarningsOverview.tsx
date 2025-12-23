"use client"

import {
    TrendingUp,
    Wallet,
    CreditCard,
    FileText,
    AlertCircle
} from "lucide-react"
import { SellerEarnings } from "@/types/payout"

interface EarningsOverviewProps {
    earnings: SellerEarnings
    formatCurrency: (amount: number) => string
}

export function EarningsOverview({ earnings, formatCurrency }: EarningsOverviewProps) {
    return (
        <>
            {/* Earnings Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* Total Revenue */}
                <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-primary/20 rounded-lg">
                            <TrendingUp className="w-4 h-4 text-primary" />
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Total Revenue (All Stores)</p>
                    <p className="text-lg sm:text-xl font-bold">{formatCurrency(earnings.total_revenue)}</p>
                </div>

                {/* Net Earnings */}
                <div className="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                            <Wallet className="w-4 h-4 text-green-500" />
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Net Earnings (After 5% Commission)</p>
                    <p className="text-lg sm:text-xl font-bold text-green-500">{formatCurrency(earnings.net_earnings)}</p>
                </div>

                {/* Available for Payout */}
                <div className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                            <CreditCard className="w-4 h-4 text-blue-500" />
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Available for Payout</p>
                    <p className="text-lg sm:text-xl font-bold text-blue-500">{formatCurrency(earnings.available_for_payout)}</p>
                </div>

                {/* Total Orders */}
                <div className="p-4 bg-muted/50 border border-border rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-muted rounded-lg">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Total Orders</p>
                    <p className="text-lg sm:text-xl font-bold">{earnings.total_orders}</p>
                </div>
            </div>

            {/* Commission Info */}
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="text-sm font-medium text-yellow-600">Platform Commission: 5%</p>
                    <p className="text-xs text-muted-foreground mt-1">
                        Total commission deducted: {formatCurrency(earnings.total_commission)}
                    </p>
                </div>
            </div>
        </>
    )
}
