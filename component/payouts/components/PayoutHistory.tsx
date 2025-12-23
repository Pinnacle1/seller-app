"use client"

import {
    CreditCard,
    Filter,
    Clock,
    FileText,
    CheckCircle,
    RefreshCw,
    XCircle,
    AlertCircle
} from "lucide-react"
import { Payout } from "@/types/payout"

interface PayoutHistoryProps {
    payouts: Payout[]
    stores: { id: number; name: string }[]
    selectedStoreFilter: number | null
    onStoreFilterChange: (storeId: number | null) => void
    formatCurrency: (amount: number) => string
    formatDate: (dateString: string) => string
}

const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
    pending: { color: "text-yellow-500 bg-yellow-500/10", icon: Clock, label: "Pending" },
    requested: { color: "text-blue-500 bg-blue-500/10", icon: FileText, label: "Requested" },
    approved: { color: "text-green-500 bg-green-500/10", icon: CheckCircle, label: "Approved" },
    processing: { color: "text-blue-500 bg-blue-500/10", icon: RefreshCw, label: "Processing" },
    completed: { color: "text-green-500 bg-green-500/10", icon: CheckCircle, label: "Completed" },
    rejected: { color: "text-red-500 bg-red-500/10", icon: XCircle, label: "Rejected" },
    failed: { color: "text-red-500 bg-red-500/10", icon: AlertCircle, label: "Failed" }
}

export function PayoutHistory({
    payouts,
    stores,
    selectedStoreFilter,
    onStoreFilterChange,
    formatCurrency,
    formatDate
}: PayoutHistoryProps) {
    // Filter payouts by selected store
    const filteredPayouts = selectedStoreFilter
        ? payouts.filter(p => p.store_id === selectedStoreFilter)
        : payouts

    return (
        <div className="space-y-4">
            {/* Store Filter */}
            {stores.length > 1 && (
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <select
                        value={selectedStoreFilter || ""}
                        onChange={(e) => onStoreFilterChange(e.target.value ? parseInt(e.target.value) : null)}
                        className="px-3 py-1.5 bg-muted border border-border rounded-lg text-sm"
                    >
                        <option value="">All Stores</option>
                        {stores.map(store => (
                            <option key={store.id} value={store.id}>{store.name}</option>
                        ))}
                    </select>
                </div>
            )}

            {filteredPayouts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No payout history yet</p>
                </div>
            ) : (
                filteredPayouts.map((payout) => {
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
    )
}
