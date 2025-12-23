import { KycClient } from "@/component/kyc/component.Client"

interface PageProps {
    params: Promise<{
        storeSlug: string
    }>
}

export default async function KycPage({ params }: PageProps) {
    const { storeSlug } = await params
    return <KycClient key={storeSlug} storeSlug={storeSlug} />
}
