import { END_POINT } from "../constant/endpoint-contstant";
import { endpoints } from "../constant/endpoint";
import { COOKIE_ACCESS_TOKEN, getCookie } from "../utils/cookie-helper";
import {
    OrderListResponse,
    OrderResponse,
    OrderMutationResponse,
    OrdersQueryParams,
    UpdateOrderStatusRequest
} from "../types/order";

export const orderService = {
    /**
     * Get all orders for the seller
     */
    getOrders: async (params?: OrdersQueryParams): Promise<OrderListResponse> => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append("page", String(params.page));
        if (params?.limit) queryParams.append("limit", String(params.limit));
        if (params?.store_id) queryParams.append("store_id", String(params.store_id));
        if (params?.status) queryParams.append("status", params.status);

        const queryString = queryParams.toString();
        const url = queryString ? `${endpoints.getorders}?${queryString}` : endpoints.getorders;

        return END_POINT.get(
            url,
            true,
            "V1",
            { auth: true, token: getCookie(COOKIE_ACCESS_TOKEN) }
        );
    },

    /**
     * Get a single order by ID
     */
    getOrderById: async (id: number | string): Promise<OrderResponse> => {
        return END_POINT.get(
            endpoints.getorderbyid.replace(":id", String(id)),
            true,
            "V1",
            { auth: true, token: getCookie(COOKIE_ACCESS_TOKEN) }
        );
    },

    /**
     * Update order status (ship, deliver, cancel)
     */
    updateOrderStatus: async (id: number | string, data: UpdateOrderStatusRequest): Promise<OrderMutationResponse> => {
        return END_POINT.PATCH(
            endpoints.updateorderstatus.replace(":id", String(id)),
            data,
            true,
            "V1",
            { auth: true, token: getCookie(COOKIE_ACCESS_TOKEN) }
        );
    }
};
