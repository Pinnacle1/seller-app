import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/service/orders.service";
import { queryKeys } from "./keys";
import { OrdersQueryParams, Order, UpdateOrderStatusRequest } from "@/types/order";

export function useOrdersQuery(storeId: number | null, params?: Omit<OrdersQueryParams, 'store_id'>) {
    const queryParams: OrdersQueryParams = {
        ...params,
        store_id: storeId ?? undefined,
    };

    return useQuery({
        queryKey: queryKeys.orders.list(storeId!, params as Record<string, unknown>),
        queryFn: async () => {
            const response = await orderService.getOrders(queryParams);
            if (!response.success) {
                throw new Error(response.message || "Failed to fetch orders");
            }
            return {
                orders: response.data?.orders ?? [],
                pagination: {
                    total: response.data?.total ?? 0,
                    page: response.data?.page ?? 1,
                    limit: response.data?.limit ?? 20,
                },
            };
        },
        enabled: !!storeId,
    });
}

export function useOrderDetailQuery(orderId: number | null) {
    return useQuery({
        queryKey: queryKeys.orders.detail(orderId!),
        queryFn: async () => {
            const response = await orderService.getOrderById(orderId!);
            if (!response.success) {
                throw new Error(response.message || "Failed to fetch order");
            }
            return response.data as Order;
        },
        enabled: !!orderId,
    });
}

export function useUpdateOrderStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ orderId, data }: { orderId: number; data: UpdateOrderStatusRequest }) => {
            const response = await orderService.updateOrderStatus(orderId, data);
            if (!response.success) {
                throw new Error(response.message || "Failed to update order");
            }
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
        },
    });
}
