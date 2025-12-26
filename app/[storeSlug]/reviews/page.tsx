import { ReviewsClient } from "@/component/reviews/Component.Client"

interface ReviewsPageProps {
    params: Promise<{ slug: string }>
}

export default async function ReviewsPage({ params }: ReviewsPageProps) {
    const { slug } = await params
    return <ReviewsClient storeSlug={slug} />
}
