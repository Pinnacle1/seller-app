import { EditProductClient } from "@/component/edit-product/component.Client"

interface PageProps {
    params: Promise<{
        storeSlug: string
        id: string
    }>
}

export default async function EditProductPage({ params }: PageProps) {
    const { storeSlug, id } = await params
    return <EditProductClient key={`${storeSlug}-${id}`} id={id} storeSlug={storeSlug} />
}
