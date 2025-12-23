"use client"

import { useState } from "react"
import { DashboardLayout } from "@/component/layout/DashboardLayout"
import { RefreshCw, CheckCircle } from "lucide-react"
import { useEarningsQuery, useEarningsByStoreQuery, usePayoutsQuery, useRequestPayout } from "@/queries/use-payouts-query"
import { useStoresQuery } from "@/queries/use-stores-query"
import { useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/queries/keys"

// Components
import { EarningsOverview } from "./components/EarningsOverview"
import { StoreBreakdown } from "./components/StoreBreakdown"
import { PayoutHistory } from "./components/PayoutHistory"

interface PayoutsClientProps {
    storeSlug?: string
}

export function PayoutsClient({ storeSlug }: PayoutsClientProps) {
    const queryClient = useQueryClient()

    // Local UI state
    const [activeTab, setActiveTab] = useState<"overview" | "history">("overview")
    const [selectedStoreFilter, setSelectedStoreFilter] = useState<number | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    // Stores list (React Query - server state)
    const { data: stores = [] } = useStoresQuery()

    // Payout data (React Query - server state)
    const { data: earnings, isPending: earningsLoading, error: earningsError } = useEarningsQuery()
    const { data: storeEarnings = [], isPending: storeEarningsLoading } = useEarningsByStoreQuery()
    const { data: payouts = [], isPending: payoutsLoading, error: payoutsError } = usePayoutsQuery({ store_id: selectedStoreFilter ?? undefined })

    // Request payout mutation
    const requestPayoutMutation = useRequestPayout()

    const isLoading = earningsLoading || storeEarningsLoading || payoutsLoading
    const error = earningsError || payoutsError

    const handleRefresh = () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.payouts.all })
    }

    const handleRequestPayout = async (storeId?: number) => {
        try {
            await requestPayoutMutation.mutateAsync(storeId ? { store_id: storeId } : {})
            setSuccessMessage("Payout request submitted successfully!")
            setTimeout(() => setSuccessMessage(null), 5000)
        } catch (err) {
            // Error handled by mutation
        }
    }

    const handleStoreFilterChange = (storeId: number | null) => {
        setSelectedStoreFilter(storeId)
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

    // Show loading state
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
                            View your earnings across all stores and request payouts
                        </p>
                    </div>
                    <button
                        onClick={handleRefresh}
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
                        <p className="text-sm text-destructive">{error.message}</p>
                        <button onClick={handleRefresh} className="text-xs text-destructive hover:underline">
                            Retry
                        </button>
                    </div>
                )}

                {/* Earnings Overview */}
                {earnings && <EarningsOverview earnings={earnings} formatCurrency={formatCurrency} />}

                {/* Tabs */}
                <div className="flex gap-2 border-b border-border">
                    <button
                        onClick={() => setActiveTab("overview")}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "overview" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                    >
                        Store Breakdown
                    </button>
                    <button
                        onClick={() => setActiveTab("history")}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "history" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                    >
                        Payout History
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === "overview" && (
                    <StoreBreakdown
                        storeEarnings={storeEarnings}
                        totalEarnings={earnings ?? null}
                        isRequesting={requestPayoutMutation.isPending}
                        onRequestPayout={handleRequestPayout}
                        formatCurrency={formatCurrency}
                    />
                )}

                {activeTab === "history" && (
                    <PayoutHistory
                        payouts={payouts}
                        stores={stores}
                        selectedStoreFilter={selectedStoreFilter}
                        onStoreFilterChange={handleStoreFilterChange}
                        formatCurrency={formatCurrency}
                        formatDate={formatDate}
                    />
                )}
            </div>
        </DashboardLayout>
    )
}
