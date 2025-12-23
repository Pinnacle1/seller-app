"use client"

import { useRouter } from "next/navigation"
import { Card } from "@/component/ui/Card"
import { Button } from "@/component/ui/Button"
import { Store, Plus, ChevronRight, Eye, CheckCircle, Clock } from "lucide-react"

interface StoreItem {
    id: number
    name: string
    slug: string
    description?: string
    logo_url?: string
    is_verified?: boolean
    is_active?: boolean
    products_count?: number
    created_at?: string
    [key: string]: any  // Allow additional properties
}

interface StoresSectionProps {
    stores: StoreItem[]
    onStoreClick: (store: any) => void
}

export function StoresSection({ stores, onStoreClick }: StoresSectionProps) {
    const router = useRouter()

    return (
        <Card>
            <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-foreground/10 flex items-center justify-center">
                        <Store className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold">My Stores</h3>
                        <p className="text-xs text-muted-foreground">{stores.length} store{stores.length !== 1 ? 's' : ''}</p>
                    </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => router.push("/add-store")} className="gap-2 bg-transparent">
                    <Plus className="w-4 h-4" />
                    Add Store
                </Button>
            </div>
            <div className="divide-y divide-border">
                {stores.length === 0 ? (
                    <div className="p-8 text-center">
                        <Store className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-sm text-muted-foreground mb-4">No stores yet</p>
                        <Button onClick={() => router.push("/add-store")}>Create Your First Store</Button>
                    </div>
                ) : (
                    stores.map((store) => (
                        <div key={store.id} className="p-4 hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                                    {store.logo_url ? (
                                        <img src={store.logo_url} alt={store.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <Store className="w-6 h-6 text-primary" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-semibold truncate">{store.name}</h4>
                                        {store.is_verified ? (
                                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                        ) : (
                                            <Clock className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground">/{store.slug} • {store.products_count || 0} products</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => router.push(`/${store.slug}/home`)} className="gap-1">
                                        <Eye className="w-4 h-4" />
                                        <span className="hidden sm:inline">View</span>
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => onStoreClick(store)}>
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Card>
    )
}
