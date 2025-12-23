import { HomeClient } from "@/component/home/component.Client"

interface PageProps {
    params: Promise<{
        storeSlug: string
    }>
}

export default async function HomePage({ params }: PageProps) {
    const { storeSlug } = await params
    return <HomeClient key={storeSlug} storeSlug={storeSlug} />
}
