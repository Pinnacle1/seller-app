"use client"

import { useState } from "react"
import { X, Store, Edit, Save, Loader2, Truck, RotateCcw, Headphones, CheckCircle, Clock } from "lucide-react"
import { Button } from "@/component/ui/Button"
import { Input } from "@/component/ui/Input"
import { StoreData, onboardService } from "@/service/onboard.service"
import { useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/queries/keys"

interface StoreDetailsDialogProps {
    store: StoreData
    onClose: () => void
}

export function StoreDetailsDialog({ store, onClose }: StoreDetailsDialogProps) {
    const queryClient = useQueryClient()

    const [isEditing, setIsEditing] = useState(false)
    const [editName, setEditName] = useState(store.name)
    const [editDescription, setEditDescription] = useState(store.description)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSave = async () => {
        setIsSaving(true)
        setError(null)

        try {
            const res = await onboardService.updateStore(store.id, {
                name: editName,
                description: editDescription
            })

            if (res.success) {
                // Invalidate stores query to refetch
                queryClient.invalidateQueries({ queryKey: queryKeys.stores.all })
                setIsEditing(false)
            } else {
                setError(res.message || "Failed to update store")
            }
        } catch (err: any) {
            setError(err.message || "Failed to update store")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Dialog */}
            <div className="relative w-full max-w-lg mx-4 bg-card border border-border rounded-2xl shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border p-4 flex items-center justify-between z-10">
                    <h2 className="text-lg font-semibold">Store Details</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-accent rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-6">
                    {/* Store Info */}
                    <div className="flex items-start gap-4">
                        {store.logo_url ? (
                            <img
                                src={store.logo_url}
                                alt={store.name}
                                className="w-20 h-20 rounded-xl object-cover border border-border"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-xl bg-muted flex items-center justify-center">
                                <Store className="w-8 h-8 text-muted-foreground" />
                            </div>
                        )}

                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                                {isEditing ? (
                                    <Input
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="text-lg font-semibold"
                                    />
                                ) : (
                                    <h3 className="text-xl font-bold">{store.name}</h3>
                                )}
                                {store.is_verified ? (
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                ) : (
                                    <Clock className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground font-mono">/{store.slug}</p>

                            {/* Status Badges */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className={`px-2 py-0.5 text-xs rounded-full ${store.is_verified ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                    {store.is_verified ? "Verified" : "Pending Verification"}
                                </span>
                                <span className={`px-2 py-0.5 text-xs rounded-full ${store.is_active ? 'bg-blue-500/10 text-blue-500' : 'bg-muted text-muted-foreground'}`}>
                                    {store.is_active ? "Active" : "Inactive"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                            <p className="text-sm text-destructive">{error}</p>
                        </div>
                    )}

                    {/* Description */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-muted-foreground">Description</p>
                            {!isEditing && (
                                <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                                    <Edit className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                        {isEditing ? (
                            <textarea
                                className="w-full h-24 px-3 py-2 bg-input text-foreground border border-border rounded-xl text-sm focus:outline-none focus:border-foreground/50 resize-none"
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                placeholder="Describe your store..."
                            />
                        ) : (
                            <p className="text-sm leading-relaxed">
                                {store.description || "No description provided."}
                            </p>
                        )}
                    </div>

                    {/* Edit Actions */}
                    {isEditing && (
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                className="flex-1 bg-transparent"
                                onClick={() => {
                                    setIsEditing(false)
                                    setEditName(store.name)
                                    setEditDescription(store.description)
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="flex-1 gap-2"
                                onClick={handleSave}
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                Save Changes
                            </Button>
                        </div>
                    )}

                    {/* Store Stats */}
                    {store.products_count !== undefined && (
                        <div className="grid grid-cols-3 gap-3">
                            <div className="p-3 rounded-xl bg-muted/50 text-center">
                                <p className="text-xl font-bold">{store.products_count}</p>
                                <p className="text-xs text-muted-foreground">Products</p>
                            </div>
                            <div className="p-3 rounded-xl bg-muted/50 text-center">
                                <p className="text-xl font-bold">{store.rating_avg?.toFixed(1) || "0.0"}</p>
                                <p className="text-xs text-muted-foreground">Rating</p>
                            </div>
                            <div className="p-3 rounded-xl bg-muted/50 text-center">
                                <p className="text-xl font-bold">{store.rating_count || 0}</p>
                                <p className="text-xs text-muted-foreground">Reviews</p>
                            </div>
                        </div>
                    )}

                    {/* Store Policies */}
                    <div className="space-y-3">
                        <p className="text-sm font-medium text-muted-foreground">Store Policies</p>

                        <div className="space-y-2">
                            <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border">
                                <Truck className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">Shipping Policy</p>
                                    <p className="text-xs text-muted-foreground">Standard shipping: 3-5 business days. Express options available.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border">
                                <RotateCcw className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">Return Policy</p>
                                    <p className="text-xs text-muted-foreground">14-day return policy for unused items with original tags.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border">
                                <Headphones className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">Customer Support</p>
                                    <p className="text-xs text-muted-foreground">Contact support@thriftzy.com for any assistance.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Store Created */}
                    <div className="pt-4 border-t border-border">
                        <p className="text-xs text-muted-foreground text-center">
                            Store created on {new Date(store.created_at).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
