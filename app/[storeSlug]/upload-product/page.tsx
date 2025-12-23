import { UploadProductClient } from "@/component/upload-product/component.Client"

interface PageProps {
    params: Promise<{
        storeSlug: string
    }>
}

export default async function UploadProductPage({ params }: PageProps) {
    const { storeSlug } = await params
    return <UploadProductClient key={storeSlug} storeSlug={storeSlug} />
}
