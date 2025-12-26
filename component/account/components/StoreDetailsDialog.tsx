"use client"

import { X, Store, Truck, RotateCcw, Headphones, CheckCircle, Clock, MapPin } from "lucide-react"
import { StoreData } from "@/service/onboard.service"

interface StoreDetailsDialogProps {
    store: StoreData
    onClose: () => void
}

export function StoreDetailsDialog({ store, onClose }: StoreDetailsDialogProps) {
    const hasAddress = store.address_line1 || store.city || store.state
    const hasPolicy = store.shipping_policy || store.return_policy || store.support_contact

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Dialog */}
            <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border p-4 flex items-center justify-between z-10">
                    <h2 className="text-lg font-semibold">Store Details</h2>
                    <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-6">
                    {/* Store Info */}
                    <div className="flex items-start gap-4">
                        {store.logo_url ? (
                            <img src={store.logo_url} alt={store.name} className="w-20 h-20 rounded-xl object-cover border border-border" />
                        ) : (
                            <div className="w-20 h-20 rounded-xl bg-muted flex items-center justify-center">
                                <Store className="w-8 h-8 text-muted-foreground" />
                            </div>
                        )}

                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                                <h3 className="text-xl font-bold">{store.name}</h3>
                                {store.is_verified ? (
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                ) : (
                                    <Clock className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground font-mono">/{store.slug}</p>
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

                    {/* Description */}
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Description</p>
                        <p className="text-sm leading-relaxed">{store.description || "No description provided."}</p>
                    </div>

                    {/* Store Stats */}
                    {store.products_count !== undefined && (
                        <div className="grid grid-cols-3 gap-3">
                            <div className="p-3 rounded-xl bg-muted/50 text-center">
                                <p className="text-xl font-bold">{store.products_count}</p>
                                <p className="text-xs text-muted-foreground">Products</p>
                            </div>
                            <div className="p-3 rounded-xl bg-muted/50 text-center">
                                <p className="text-xl font-bold">{Number(store.rating_avg || 0).toFixed(1)}</p>
                                <p className="text-xs text-muted-foreground">Rating</p>
                            </div>
                            <div className="p-3 rounded-xl bg-muted/50 text-center">
                                <p className="text-xl font-bold">{store.rating_count || 0}</p>
                                <p className="text-xs text-muted-foreground">Reviews</p>
                            </div>
                        </div>
                    )}

                    {/* Store Address */}
                    {hasAddress && (
                        <div className="space-y-3">
                            <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <MapPin className="w-4 h-4" /> Store Address
                            </p>
                            <div className="p-3 rounded-xl bg-muted/30 border border-border">
                                {store.address_line1 && <p className="text-sm">{store.address_line1}</p>}
                                {store.address_line2 && <p className="text-sm">{store.address_line2}</p>}
                                <p className="text-sm text-muted-foreground">
                                    {[store.city, store.state, store.pincode].filter(Boolean).join(", ")}
                                </p>
                                {store.country && <p className="text-sm text-muted-foreground">{store.country}</p>}
                                {store.address_phone && <p className="text-sm text-muted-foreground mt-1">Phone: {store.address_phone}</p>}
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
                                    <p className="text-xs text-muted-foreground">
                                        {store.shipping_policy || "Standard shipping: 3-5 business days. Express options available."}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border">
                                <RotateCcw className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">Return Policy</p>
                                    <p className="text-xs text-muted-foreground">
                                        {store.return_policy || "14-day return policy for unused items with original tags."}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border">
                                <Headphones className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">Customer Support</p>
                                    <p className="text-xs text-muted-foreground">
                                        {store.support_contact || "Contact support@thriftzy.com for any assistance."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Store Created */}
                    <div className="pt-4 border-t border-border">
                        <p className="text-xs text-muted-foreground text-center">
                            Store created on {new Date(store.created_at).toLocaleDateString('en-IN', {
                                year: 'numeric', month: 'long', day: 'numeric'
                            })}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
