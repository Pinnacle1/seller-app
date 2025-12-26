import { useQuery } from "@tanstack/react-query";
import { reviewService, Review } from "@/service/review.service";
import { queryKeys } from "./keys";

export function useStoreReviewsQuery(storeId: number, params: { page?: number; limit?: number } = {}) {
    return useQuery({
        queryKey: queryKeys.reviews.list(storeId, params),
        queryFn: async () => {
            const response = await reviewService.getStoreReviews(storeId, params);
            if (!response.success) {
                throw new Error("Failed to fetch reviews");
            }
            return response.data;
        },
        enabled: !!storeId,
    });
}

export function useReviewDetailQuery(reviewId: number) {
    return useQuery({
        queryKey: queryKeys.reviews.detail(reviewId),
        queryFn: async () => {
            const response = await reviewService.getReviewById(reviewId);
            if (!response.success) {
                throw new Error("Failed to fetch review");
            }
            return response.data;
        },
        enabled: !!reviewId,
    });
}
