"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/component/layout/DashboardLayout"
import { ReviewList, ReviewDetailDialog, ReplyDialog } from "./components"
import useActiveStoreStore from "@/store/active-store"
import { useStoreReviewsQuery } from "@/queries/use-reviews-query"
import { useStoresQuery } from "@/queries/use-stores-query"
import { Review } from "@/service/review.service"
import { RefreshCw, Download, Search, Star, SlidersHorizontal } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/queries/keys"

interface ReviewsClientProps {
    storeSlug: string
}

export function ReviewsClient({ storeSlug }: ReviewsClientProps) {
    const queryClient = useQueryClient()

    // Local UI state
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedReview, setSelectedReview] = useState<Review | null>(null)
    const [replyingReview, setReplyingReview] = useState<Review | null>(null)
    const [queryParams, setQueryParams] = useState({ page: 1, limit: 20 })

    // Active store context
    const { activeStoreId, setActiveStore, isSwitching } = useActiveStoreStore()

    // Stores list
    const { data: stores = [] } = useStoresQuery()

    // Find and set active store based on URL slug
    useEffect(() => {
        if (stores.length > 0) {
            const store = stores.find(s => s.slug === storeSlug)
            if (store && store.id !== activeStoreId) {
                setActiveStore({
                    id: store.id,
                    slug: store.slug,
                    name: store.name,
                    logo_url: store.logo_url,
                })
            }
        }
    }, [stores, storeSlug, activeStoreId, setActiveStore])

    // Reviews data
    const { data: reviewsData, isPending: isLoading, error, refetch } = useStoreReviewsQuery(activeStoreId ?? 0, queryParams)

    const reviews = reviewsData?.reviews ?? []
    const pagination = { total: reviewsData?.total ?? 0, page: reviewsData?.page ?? 1, limit: reviewsData?.limit ?? 20 }
    const avgRating = reviewsData?.average_rating ?? 0

    const handleRefresh = () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all })
    }

    const handleReplyUpdated = () => {
        // Refresh reviews to get updated reply
        refetch()
    }

    const handleViewReply = () => {
        if (selectedReview) {
            setReplyingReview(selectedReview)
            setSelectedReview(null)
        }
    }

    return (
        <DashboardLayout >
            <div className="space-y-4 sm:space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold">Customer Reviews</h1>
                        <p className="text-xs sm:text-sm text-muted-foreground">Manage and respond to customer feedback</p>
                    </div>
                    {/* <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors w-full sm:w-auto">
                        <Download className="w-4 h-4" />
                        Export
                    </button> */}
                </div>

                {/* Stats Cards */}
                {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-4 bg-card border border-border rounded-xl">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <Star className="w-4 h-4" />
                            <span className="text-xs">Total Reviews</span>
                        </div>
                        <p className="text-xl font-bold">{pagination.total}</p>
                    </div>
                    <div className="p-4 bg-card border border-border rounded-xl">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs">Avg Rating</span>
                        </div>
                        <p className="text-xl font-bold">{avgRating.toFixed(1)}</p>
                    </div>
                    <div className="p-4 bg-card border border-border rounded-xl">
                        <div className="flex items-center gap-2 text-green-500 mb-1">
                            <Star className="w-4 h-4" />
                            <span className="text-xs">5 Star</span>
                        </div>
                        <p className="text-xl font-bold">{reviewsData?.rating_distribution?.["5"] ?? 0}</p>
                    </div>
                    <div className="p-4 bg-card border border-border rounded-xl">
                        <div className="flex items-center gap-2 text-red-500 mb-1">
                            <Star className="w-4 h-4" />
                            <span className="text-xs">1-2 Star</span>
                        </div>
                        <p className="text-xl font-bold">
                            {(reviewsData?.rating_distribution?.["1"] ?? 0) + (reviewsData?.rating_distribution?.["2"] ?? 0)}
                        </p>
                    </div>
                </div> */}

                {/* Search & Filter Row */}
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="relative flex-1 max-w-[200px] sm:max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search reviews..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                    </div>

                    <div className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground">
                        <span>Sort:</span>
                        <button className="font-medium text-foreground hover:text-primary">Newest</button>
                    </div>

                    <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-border rounded-lg text-xs sm:text-sm hover:bg-accent transition-colors">
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Filter</span>
                    </button>

                    <button
                        onClick={handleRefresh}
                        disabled={isLoading}
                        className="p-2 rounded-lg border border-border hover:bg-accent transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center justify-between">
                        <p className="text-xs sm:text-sm text-destructive">{error.message}</p>
                        <button onClick={() => refetch()} className="text-xs text-destructive hover:underline">
                            Retry
                        </button>
                    </div>
                )}

                {/* Review List */}
                <ReviewList
                    reviews={reviews}
                    isLoading={isLoading || isSwitching}
                    onViewClick={(review) => setSelectedReview(review)}
                    onReplyClick={(review) => setReplyingReview(review)}
                />

                {/* Pagination */}
                {pagination.total > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-muted-foreground pt-2">
                        <p>Showing {reviews.length} of {pagination.total} reviews</p>
                        <div className="flex items-center gap-2">
                            <button
                                className="px-3 py-1.5 rounded border border-border hover:bg-accent disabled:opacity-50 text-xs"
                                disabled={pagination.page <= 1}
                                onClick={() => setQueryParams(prev => ({ ...prev, page: prev.page - 1 }))}
                            >
                                Previous
                            </button>
                            <span className="px-3 py-1.5 bg-primary text-primary-foreground rounded text-xs font-medium">
                                {pagination.page}
                            </span>
                            <button
                                className="px-3 py-1.5 rounded border border-border hover:bg-accent text-xs"
                                disabled={pagination.page * pagination.limit >= pagination.total}
                                onClick={() => setQueryParams(prev => ({ ...prev, page: prev.page + 1 }))}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* View Dialog */}
            {selectedReview && (
                <ReviewDetailDialog
                    review={selectedReview}
                    onClose={() => setSelectedReview(null)}
                    onReplyClick={handleViewReply}
                />
            )}

            {/* Reply Dialog */}
            {replyingReview && (
                <ReplyDialog
                    review={replyingReview}
                    onClose={() => setReplyingReview(null)}
                    onReplyUpdated={handleReplyUpdated}
                />
            )}
        </DashboardLayout>
    )
}
