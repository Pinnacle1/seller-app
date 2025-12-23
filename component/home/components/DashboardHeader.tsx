"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/component/ui/Button"
import { Eye, Upload } from "lucide-react"

interface DashboardHeaderProps {
    storeName?: string
    storeSlug: string
}

export function DashboardHeader({ storeName, storeSlug }: DashboardHeaderProps) {
    const router = useRouter()

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold">Welcome back!</h1>
                <p className="text-sm text-muted-foreground">
                    Here's what's happening with <span className="font-medium text-foreground">{storeName || "your store"}</span> today
                </p>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => router.push(`/${storeSlug}/my-products`)} className="gap-2 bg-transparent">
                    <Eye className="w-4 h-4" />
                    View Products
                </Button>
                <Button size="sm" onClick={() => router.push(`/${storeSlug}/upload-product`)} className="gap-2">
                    <Upload className="w-4 h-4" />
                    Add Product
                </Button>
            </div>
        </div>
    )
}
