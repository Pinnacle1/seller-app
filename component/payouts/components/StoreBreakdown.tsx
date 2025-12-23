"use client"

import { Store, RefreshCw, ArrowRight, Wallet } from "lucide-react"
import { StoreEarnings, SellerEarnings } from "@/types/payout"

interface StoreBreakdownProps {
    storeEarnings: StoreEarnings[]
    totalEarnings: SellerEarnings | null
    isRequesting: boolean
    onRequestPayout: (storeId?: number) => void
    formatCurrency: (amount: number) => string
}

export function StoreBreakdown({
    storeEarnings,
    totalEarnings,
    isRequesting,
    onRequestPayout,
    formatCurrency
}: StoreBreakdownProps) {
    if (storeEarnings.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <Store className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No store earnings yet</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {storeEarnings.map((store) => (
                <div
                    key={store.store_id}
                    className="p-4 bg-card border border-border rounded-xl"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-primary/10 rounded-lg">
                                <Store className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold">{store.store_name}</h3>
                                <p className="text-xs text-muted-foreground">
                                    {store.total_orders} orders
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-6">
                            <div className="text-right">
                                <p className="text-xs text-muted-foreground">Revenue</p>
                                <p className="font-medium">{formatCurrency(store.total_revenue)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-muted-foreground">Commission (5%)</p>
                                <p className="font-medium text-red-500">-{formatCurrency(store.total_commission)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-muted-foreground">Available</p>
                                <p className="font-medium text-green-500">{formatCurrency(store.available_for_payout)}</p>
                            </div>

                            <button
                                onClick={() => onRequestPayout(store.store_id)}
                                disabled={isRequesting || store.available_for_payout <= 0}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isRequesting ? (
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        Request Payout
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            {/* Request All Payouts Button */}
            {totalEarnings && totalEarnings.available_for_payout > 0 && (
                <div className="pt-4 border-t border-border">
                    <button
                        onClick={() => onRequestPayout()}
                        disabled={isRequesting}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {isRequesting ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                            <>
                                <Wallet className="w-4 h-4" />
                                Request All Payouts ({formatCurrency(totalEarnings.available_for_payout)})
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    )
}
