"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/component/layout/DashboardLayout"
import { payoutService } from "@/service/payout.service"
import {
    SellerEarnings,
    StoreEarnings,
    Payout,
    CreatePayoutRequest
} from "@/types/payout"
import {
    RefreshCw,
    Wallet,
    TrendingUp,
    CreditCard,
    CheckCircle,
    Clock,
    AlertCircle,
    XCircle,
    ArrowRight,
    IndianRupee,
    Store,
    FileText
} from "lucide-react"

const statusConfig = {
    pending: { color: "text-yellow-500 bg-yellow-500/10", icon: Clock, label: "Pending" },
    requested: { color: "text-blue-500 bg-blue-500/10", icon: FileText, label: "Requested" },
    approved: { color: "text-green-500 bg-green-500/10", icon: CheckCircle, label: "Approved" },
    processing: { color: "text-blue-500 bg-blue-500/10", icon: RefreshCw, label: "Processing" },
    completed: { color: "text-green-500 bg-green-500/10", icon: CheckCircle, label: "Completed" },
    rejected: { color: "text-red-500 bg-red-500/10", icon: XCircle, label: "Rejected" },
    failed: { color: "text-red-500 bg-red-500/10", icon: AlertCircle, label: "Failed" }
}

export function PayoutsClient() {
    const [earnings, setEarnings] = useState<SellerEarnings | null>(null)
    const [storeEarnings, setStoreEarnings] = useState<StoreEarnings[]>([])
    const [payouts, setPayouts] = useState<Payout[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isRequesting, setIsRequesting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<"overview" | "history">("overview")

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const [earningsRes, storeEarningsRes, payoutsRes] = await Promise.all([
                payoutService.getEarnings(),
                payoutService.getEarningsByStore(),
                payoutService.getPayouts()
            ])

            if (earningsRes.success) setEarnings(earningsRes.data)
            if (storeEarningsRes.success) setStoreEarnings(storeEarningsRes.data)
            if (payoutsRes.success) setPayouts(payoutsRes.data)
        } catch (err: any) {
            setError(err.message || "Failed to fetch payout data")
        } finally {
            setIsLoading(false)
        }
    }

    const handleRequestPayout = async (storeId?: number) => {
        setIsRequesting(true)
        setError(null)
        try {
            const data: CreatePayoutRequest = storeId ? { store_id: storeId } : {}
            const response = await payoutService.requestPayout(data)
            if (response.success) {
                setSuccessMessage("Payout request submitted successfully!")
                fetchData()
                setTimeout(() => setSuccessMessage(null), 5000)
            }
        } catch (err: any) {
            setError(err.message || "Failed to request payout")
        } finally {
            setIsRequesting(false)
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }).format(amount)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        })
    }

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-64">
                    <RefreshCw className="w-8 h-8 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold">Payouts & Earnings</h1>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            View your earnings and request payouts
                        </p>
                    </div>
                    <button
                        onClick={() => fetchData()}
                        disabled={isLoading}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                        Refresh
                    </button>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <p className="text-sm text-green-500">{successMessage}</p>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center justify-between">
                        <p className="text-sm text-destructive">{error}</p>
                        <button onClick={() => setError(null)} className="text-xs text-destructive hover:underline">
                            Dismiss
                        </button>
                    </div>
                )}

                {/* Earnings Overview Cards */}
                {earnings && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        {/* Total Revenue */}
                        <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-2 bg-primary/20 rounded-lg">
                                    <TrendingUp className="w-4 h-4 text-primary" />
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground">Total Revenue</p>
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
                )}

                {/* Commission Info */}
                {earnings && (
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-yellow-600">Platform Commission: 5%</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Total commission deducted: {formatCurrency(earnings.total_commission)}
                            </p>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-2 border-b border-border">
                    <button
                        onClick={() => setActiveTab("overview")}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "overview"
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Store Breakdown
                    </button>
                    <button
                        onClick={() => setActiveTab("history")}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "history"
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Payout History
                    </button>
                </div>

                {/* Store Breakdown */}
                {activeTab === "overview" && (
                    <div className="space-y-4">
                        {storeEarnings.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <Store className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>No store earnings yet</p>
                            </div>
                        ) : (
                            storeEarnings.map((store) => (
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
                                                onClick={() => handleRequestPayout(store.store_id)}
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
                            ))
                        )}

                        {/* Request All Payouts Button */}
                        {earnings && earnings.available_for_payout > 0 && (
                            <div className="pt-4 border-t border-border">
                                <button
                                    onClick={() => handleRequestPayout()}
                                    disabled={isRequesting}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                                >
                                    {isRequesting ? (
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>
                                            <Wallet className="w-4 h-4" />
                                            Request All Payouts ({formatCurrency(earnings.available_for_payout)})
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Payout History */}
                {activeTab === "history" && (
                    <div className="space-y-3">
                        {payouts.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>No payout history yet</p>
                            </div>
                        ) : (
                            payouts.map((payout) => {
                                const config = statusConfig[payout.status] || statusConfig.pending
                                const StatusIcon = config.icon

                                return (
                                    <div
                                        key={payout.id}
                                        className="p-4 bg-card border border-border rounded-xl"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${config.color}`}>
                                                    <StatusIcon className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-medium">Payout #{payout.id}</p>
                                                        <span className={`text-xs px-2 py-0.5 rounded-full ${config.color}`}>
                                                            {config.label}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatDate(payout.created_at)}
                                                        {payout.store && ` • ${payout.store.name}`}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="text-xs text-muted-foreground">Gross</p>
                                                    <p className="text-sm">{formatCurrency(payout.gross_amount)}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-muted-foreground">Commission</p>
                                                    <p className="text-sm text-red-500">-{formatCurrency(payout.commission_amount)}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-muted-foreground">Net</p>
                                                    <p className="font-semibold text-green-500">{formatCurrency(payout.net_amount)}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {payout.admin_notes && (
                                            <div className="mt-3 p-2 bg-muted/50 rounded-lg">
                                                <p className="text-xs text-muted-foreground">
                                                    <span className="font-medium">Note:</span> {payout.admin_notes}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )
                            })
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}
