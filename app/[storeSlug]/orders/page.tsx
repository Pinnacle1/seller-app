import { OrdersClient } from "@/component/orders/Component.Client"

interface PageProps {
    params: Promise<{
        storeSlug: string
    }>
}

export default async function OrdersPage({ params }: PageProps) {
    const { storeSlug } = await params
    return <OrdersClient key={storeSlug} storeSlug={storeSlug} />
}
