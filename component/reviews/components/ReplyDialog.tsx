"use client"

import { useState } from "react"
import { X, Star, Loader2, Send, Trash2 } from "lucide-react"
import { Review, reviewService } from "@/service/review.service"
import { Button } from "@/component/ui/Button"
import { Textarea } from "@/component/ui/Textarea"

interface ReplyDialogProps {
    review: Review
    onClose: () => void
    onReplyUpdated: () => void
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
        </div>
    )
}

export function ReplyDialog({ review, onClose, onReplyUpdated }: ReplyDialogProps) {
    const [reply, setReply] = useState(review.seller_reply || "")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const hasExistingReply = !!review.seller_reply;

    const handleSubmit = async () => {
        if (!reply.trim()) return
        setIsSubmitting(true)
        try {
            const response = await reviewService.addReply(review.id, reply.trim())
            if (response.success) {
                onReplyUpdated()
                onClose()
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const response = await reviewService.deleteReply(review.id)
            if (response.success) {
                onReplyUpdated()
                onClose()
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Dialog */}
            <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="border-b border-border p-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">{hasExistingReply ? 'Edit Reply' : 'Reply to Review'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Original Review */}
                <div className="p-4 bg-muted/30 border-b border-border">
                    <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold">{review.user?.name || "Customer"}</p>
                        <RatingStars rating={review.rating} />
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3">{review.description}</p>
                </div>

                {/* Reply Input */}
                <div className="p-4 space-y-4">
                    <div>
                        <label className="text-sm font-medium mb-2 block">Your Reply</label>
                        <Textarea
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            placeholder="Write your reply to this review..."
                            rows={4}
                            className="resize-none"
                            maxLength={500}
                        />
                        <p className="text-xs text-muted-foreground mt-1 text-right">{reply.length}/500</p>
                    </div>

                    <div className="flex items-center gap-3">
                        {hasExistingReply && (
                            <Button
                                variant="outline"
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="gap-2 text-red-500 border-red-500/30 hover:bg-red-500/10"
                            >
                                {isDeleting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Trash2 className="w-4 h-4" />
                                )}
                                Delete
                            </Button>
                        )}
                        <div className="flex-1" />
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !reply.trim() || reply.trim().length < 5}
                            className="gap-2 bg-green-600 hover:bg-green-700"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                            {hasExistingReply ? 'Update' : 'Send'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
