import { END_POINT } from "../constant/endpoint-contstant";
import { endpoints } from "../constant/endpoint";
import { COOKIE_ACCESS_TOKEN, getCookie } from "../utils/cookie-helper";

export interface Review {
    id: number;
    type: "product" | "store";
    product_id: number | null;
    store_id: number | null;
    rating: number;
    description: string;
    images: string[];
    user: { id: number; name: string };
    target: { id: number; name: string };
    seller_reply: string | null;
    seller_reply_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface ReviewsResponse {
    success: boolean;
    message?: string;
    data?: {
        reviews: Review[];
        total: number;
        page: number;
        limit: number;
        average_rating: number;
        rating_distribution: Record<string, number>;
    };
}

export interface ReviewDetailResponse {
    success: boolean;
    message?: string;
    data?: Review;
}

export const reviewService = {
    getStoreReviews: async (storeId: number, params: { page?: number; limit?: number } = {}): Promise<ReviewsResponse> => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', String(params.page));
        if (params.limit) queryParams.append('limit', String(params.limit));
        const path = endpoints.getstorereviews.replace(':id', String(storeId));
        const url = queryParams.toString() ? `${path}?${queryParams}` : path;

        return END_POINT.get(url, true, "V1", { auth: true, token: getCookie(COOKIE_ACCESS_TOKEN) });
    },

    getReviewById: async (reviewId: number): Promise<ReviewDetailResponse> => {
        const path = endpoints.getreviewbyid.replace(':id', String(reviewId));
        return END_POINT.get(path, true, "V1", { auth: true, token: getCookie(COOKIE_ACCESS_TOKEN) });
    },

    addReply: async (reviewId: number, reply: string): Promise<ReviewDetailResponse> => {
        return END_POINT.post(
            `/reviews/${reviewId}/reply`,
            { reply },
            true,
            "V1",
            { auth: true, token: getCookie(COOKIE_ACCESS_TOKEN) }
        );
    },

    deleteReply: async (reviewId: number): Promise<{ success: boolean; message?: string; data?: Review }> => {
        return END_POINT.Delete(
            `/reviews/${reviewId}/reply`,
            true,
            "V1",
            { auth: true, token: getCookie(COOKIE_ACCESS_TOKEN) }
        );
    },
};
