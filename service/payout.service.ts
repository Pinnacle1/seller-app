import { END_POINT } from "../constant/endpoint-contstant";
import { endpoints } from "../constant/endpoint";
import { COOKIE_ACCESS_TOKEN, getCookie } from "../utils/cookie-helper";
import {
    SellerEarningsResponse,
    EarningsByStoreResponse,
    PayoutListResponse,
    PayoutResponse,
    PayoutMutationResponse,
    CreatePayoutRequest,
    PayoutQueryParams
} from "../types/payout";

export const payoutService = {
    /**
     * Get seller's total earnings summary
     * @param storeId - Optional store ID to filter earnings
     */
    getEarnings: async (storeId?: number): Promise<SellerEarningsResponse> => {
        const url = storeId
            ? `${endpoints.getearnings}?store_id=${storeId}`
            : endpoints.getearnings;
        return END_POINT.get(
            url,
            true,
            "V1",
            { auth: true, token: getCookie(COOKIE_ACCESS_TOKEN) }
        );
    },

    /**
     * Get earnings breakdown by store
     * @param storeId - Optional store ID to filter earnings
     */
    getEarningsByStore: async (storeId?: number): Promise<EarningsByStoreResponse> => {
        const url = storeId
            ? `${endpoints.getearningsbystore}?store_id=${storeId}`
            : endpoints.getearningsbystore;
        return END_POINT.get(
            url,
            true,
            "V1",
            { auth: true, token: getCookie(COOKIE_ACCESS_TOKEN) }
        );
    },

    /**
     * Get all payout requests
     */
    getPayouts: async (params?: PayoutQueryParams): Promise<PayoutListResponse> => {
        const queryParams = new URLSearchParams();
        if (params?.store_id) queryParams.append("store_id", String(params.store_id));
        if (params?.page) queryParams.append("page", String(params.page));
        if (params?.limit) queryParams.append("limit", String(params.limit));
        if (params?.status) queryParams.append("status", params.status);

        const queryString = queryParams.toString();
        const url = queryString ? `${endpoints.getpayouts}?${queryString}` : endpoints.getpayouts;

        return END_POINT.get(
            url,
            true,
            "V1",
            { auth: true, token: getCookie(COOKIE_ACCESS_TOKEN) }
        );
    },

    /**
     * Get payout by ID
     */
    getPayoutById: async (id: number | string): Promise<PayoutResponse> => {
        return END_POINT.get(
            endpoints.getpayoutbyid.replace(":id", String(id)),
            true,
            "V1",
            { auth: true, token: getCookie(COOKIE_ACCESS_TOKEN) }
        );
    },

    /**
     * Request a payout
     */
    requestPayout: async (data: CreatePayoutRequest): Promise<PayoutMutationResponse> => {
        return END_POINT.post(
            endpoints.requestpayout,
            data,
            true,
            "V1",
            { auth: true, token: getCookie(COOKIE_ACCESS_TOKEN) }
        );
    }
};
