"use client"

import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/component/layout/DashboardLayout"
import { ProductForm } from "./components/ProductForm"

export function UploadProductClient() {
  const router = useRouter()

  const handleSubmit = (data: any) => {
    console.log("Product data:", data)
    router.push("/my-products")
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Upload Product</h1>
          <p className="text-sm text-muted-foreground">Add a new product to your store</p>
        </div>
        <div className="border border-border rounded-xl p-4 md:p-6">
          <ProductForm onSubmit={handleSubmit} />
        </div>
      </div>
    </DashboardLayout>
  )
}
