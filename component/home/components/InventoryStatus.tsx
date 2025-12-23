"use client"

import { Card } from "@/component/ui/Card"
import { Button } from "@/component/ui/Button"
import { TopProduct } from "@/service/dashboard.service"
import { ArrowRight, Package, AlertTriangle, PackageX } from "lucide-react"
import Link from "next/link"

interface InventoryStatusProps {
    totalProducts: number
    lowStockProducts: number
    outOfStockProducts: number
    topProducts: TopProduct[]
    storeSlug: string
}

export function InventoryStatus({
    totalProducts,
    lowStockProducts,
    outOfStockProducts,
    topProducts,
    storeSlug
}: InventoryStatusProps) {
    return (
        <Card>
            <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Inventory Status</h3>
                    <Link href={`/${storeSlug}/my-products`}>
                        <Button variant="ghost" size="sm" className="gap-1 text-xs">
                            Manage
                            <ArrowRight className="w-3 h-3" />
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="p-4 space-y-4">
                {/* Inventory Stats */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                        <Package className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
                        <p className="text-xl font-bold">{totalProducts}</p>
                        <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-amber-500/10">
                        <AlertTriangle className="w-5 h-5 text-amber-500 mx-auto mb-2" />
                        <p className="text-xl font-bold text-amber-500">{lowStockProducts}</p>
                        <p className="text-xs text-muted-foreground">Low Stock</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-red-500/10">
                        <PackageX className="w-5 h-5 text-red-500 mx-auto mb-2" />
                        <p className="text-xl font-bold text-red-500">{outOfStockProducts}</p>
                        <p className="text-xs text-muted-foreground">Out of Stock</p>
                    </div>
                </div>

                {/* Top Products */}
                {topProducts.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Top Products</p>
                        <div className="space-y-2">
                            {topProducts.slice(0, 3).map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/${storeSlug}/edit-product/${product.id}`}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors"
                                >
                                    {product.image_url ? (
                                        <img
                                            src={product.image_url}
                                            alt={product.title}
                                            className="w-10 h-10 rounded-lg object-cover border border-border"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                                            <Package className="w-5 h-5 text-muted-foreground" />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{product.title}</p>
                                        <p className="text-xs text-muted-foreground">Stock: {product.stock}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Card>
    )
}
