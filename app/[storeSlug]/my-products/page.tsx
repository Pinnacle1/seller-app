import { MyProductsClient } from "@/component/my-products/component.Client"

interface PageProps {
    params: Promise<{
        storeSlug: string
    }>
}

export default async function MyProductsPage({ params }: PageProps) {
    const { storeSlug } = await params
    return <MyProductsClient key={storeSlug} storeSlug={storeSlug} />
}
