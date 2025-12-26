"use client"

import { X, Star, Package, Calendar, MessageSquare, Image as ImageIcon, User, Check } from "lucide-react"
import { Review } from "@/service/review.service"
import { Button } from "@/component/ui/Button"

interface ReviewDetailDialogProps {
    review: Review
    onClose: () => void
    onReplyClick: () => void
}

function RatingStars({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`w-5 h-5 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                />
            ))}
            <span className="text-sm text-muted-foreground ml-2">({rating}/5)</span>
        </div>
    )
}

export function ReviewDetailDialog({ review, onClose, onReplyClick }: ReviewDetailDialogProps) {
    const hasReply = !!review.seller_reply;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Dialog */}
            <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border p-4 flex items-center justify-between z-10 flex-shrink-0">
                    <h2 className="text-lg font-semibold">Review Details</h2>
                    <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="p-4 space-y-5 overflow-y-auto flex-1">
                    {/* Review ID */}
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">Review ID</p>
                        <p className="font-mono text-primary">REV{String(review.id).padStart(3, '0')}</p>
                    </div>

                    {/* Reviewer */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            <User className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Reviewer</p>
                            <p className="font-medium">{review.user?.name || "Anonymous"}</p>
                        </div>
                    </div>

                    {/* Product */}
                    <div>
                        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                            <Package className="w-3.5 h-3.5" /> Product
                        </p>
                        <p className="font-medium">{review.target?.name || "Store Review"}</p>
                    </div>

                    {/* Rating */}
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">Rating</p>
                        <RatingStars rating={review.rating} />
                    </div>

                    {/* Date */}
                    <div>
                        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" /> Date
                        </p>
                        <p>{new Date(review.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>

                    {/* Review Text */}
                    <div>
                        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                            <MessageSquare className="w-3.5 h-3.5" /> Review
                        </p>
                        <p className="leading-relaxed text-sm bg-muted/30 p-3 rounded-lg border border-border">{review.description}</p>
                    </div>

                    {/* Images */}
                    {review.images && review.images.length > 0 && (
                        <div>
                            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                                <ImageIcon className="w-3.5 h-3.5" /> Images
                            </p>
                            <div className="flex gap-2 flex-wrap">
                                {review.images.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        alt={`Review image ${idx + 1}`}
                                        className="w-20 h-20 rounded-lg border border-border object-cover"
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Seller Reply Section */}
                    {hasReply && (
                        <div className="border-t border-border pt-4">
                            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                                <Check className="w-3.5 h-3.5 text-green-500" /> Your Reply
                            </p>
                            <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-green-500">Store Owner</span>
                                    {review.seller_reply_at && (
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(review.seller_reply_at).toLocaleDateString('en-IN')}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm">{review.seller_reply}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-card/95 backdrop-blur-sm border-t border-border p-4 flex justify-end gap-3 flex-shrink-0">
                    <Button variant="outline" onClick={onClose}>Close</Button>
                    <Button onClick={onReplyClick} className={`gap-2 ${hasReply ? 'bg-green-700 hover:bg-green-800' : 'bg-green-600 hover:bg-green-700'}`}>
                        <MessageSquare className="w-4 h-4" />
                        {hasReply ? 'Edit Reply' : 'Reply'}
                    </Button>
                </div>
            </div>
        </div>
    )
}
