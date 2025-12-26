"use client"

import { Star, Eye, MessageSquare, Loader2, Check } from "lucide-react"
import { Review } from "@/service/review.service"
import { Button } from "@/component/ui/Button"

interface ReviewListProps {
    reviews: Review[]
    isLoading: boolean
    onViewClick: (review: Review) => void
    onReplyClick: (review: Review) => void
}

function RatingStars({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`w-4 h-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                />
            ))}
            <span className="text-xs text-muted-foreground ml-1">({rating})</span>
        </div>
    )
}

export function ReviewList({ reviews, isLoading, onViewClick, onReplyClick }: ReviewListProps) {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (reviews.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <Star className="w-12 h-12 text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No reviews yet</p>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {/* Desktop Table Header */}
            <div className="hidden md:grid md:grid-cols-[80px_1fr_1fr_140px_100px_160px] gap-4 px-4 py-2 text-xs font-medium text-muted-foreground uppercase border-b border-border">
                <span>ID</span>
                <span>Reviewer</span>
                <span>Product</span>
                <span>Rating</span>
                <span>Date</span>
                <span>Actions</span>
            </div>

            {reviews.map((review) => {
                const hasReply = !!review.seller_reply;

                return (
                    <div key={review.id} className="bg-card border border-border rounded-xl overflow-hidden">
                        {/* Desktop Row */}
                        <div className="hidden md:grid md:grid-cols-[80px_1fr_1fr_140px_100px_160px] gap-4 px-4 py-3 items-center">
                            <span className="text-xs font-mono text-primary">REV{String(review.id).padStart(3, '0')}</span>
                            <span className="font-medium truncate">{review.user?.name || "Anonymous"}</span>
                            <span className="text-sm text-muted-foreground truncate">{review.target?.name || "Store Review"}</span>
                            <RatingStars rating={review.rating} />
                            <span className="text-xs text-muted-foreground">
                                {new Date(review.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                            </span>
                            <div className="flex items-center gap-1.5">
                                <Button size="sm" variant="primary" onClick={() => onViewClick(review)} className="gap-1 h-7 px-2 text-xs">
                                    <Eye className="w-3 h-3" /> View
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => onReplyClick(review)}
                                    className={`gap-1 h-7 px-2 text-xs ${hasReply ? 'bg-green-700 hover:bg-green-800' : 'bg-green-600 hover:bg-green-700'}`}
                                >
                                    {hasReply ? <Check className="w-3 h-3" /> : <MessageSquare className="w-3 h-3" />}
                                    {hasReply ? 'Replied' : 'Reply'}
                                </Button>
                            </div>
                        </div>

                        {/* Mobile Card */}
                        <div className="md:hidden p-4 space-y-3">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold truncate">{review.user?.name || "Anonymous"}</p>
                                    <p className="text-xs text-muted-foreground truncate">{review.target?.name || "Store Review"}</p>
                                </div>
                                <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full flex-shrink-0">
                                    <Star className="w-3.5 h-3.5 fill-current" />
                                    <span className="text-sm font-medium">{review.rating}</span>
                                </div>
                            </div>

                            <p className="text-sm text-muted-foreground line-clamp-2">{review.description}</p>

                            {/* Show reply indicator */}
                            {hasReply && (
                                <div className="flex items-center gap-1.5 text-xs text-green-500">
                                    <Check className="w-3.5 h-3.5" />
                                    <span>You replied to this review</span>
                                </div>
                            )}

                            <div className="flex items-center justify-between pt-2 border-t border-border">
                                <span className="text-xs text-muted-foreground">
                                    {new Date(review.created_at).toLocaleDateString('en-IN')}
                                </span>
                                <div className="flex items-center gap-2">
                                    <Button size="sm" variant="outline" onClick={() => onViewClick(review)} className="gap-1.5 text-xs h-8">
                                        <Eye className="w-3.5 h-3.5" /> View
                                    </Button>
                                    <Button size="sm" onClick={() => onReplyClick(review)} className={`gap-1.5 text-xs h-8 ${hasReply ? 'bg-green-700 hover:bg-green-800' : 'bg-green-600 hover:bg-green-700'}`}>
                                        {hasReply ? <Check className="w-3.5 h-3.5" /> : <MessageSquare className="w-3.5 h-3.5" />}
                                        {hasReply ? 'Replied' : 'Reply'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
