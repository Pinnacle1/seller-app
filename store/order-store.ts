"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { orderService } from "@/service/orders.service";
import {
    Order,
    OrdersQueryParams,
    UpdateOrderStatusRequest
} from "@/types/order";

// ============== State Types ==============

interface OrdersState {
    orders: Order[];
    pagination: {
        total: number;
        page: number;
        limit: number;
    };
    queryParams: OrdersQueryParams;
    selectedOrder: Order | null;
    isLoading: boolean;
    isUpdating: boolean;
    error: string | null;
    lastFetched: number | null;
}

interface OrdersActions {
    fetchOrders: (params?: OrdersQueryParams) => Promise<void>;
    refreshOrders: () => Promise<void>;
    fetchOrderById: (id: number | string) => Promise<Order | null>;
    updateOrderStatus: (id: number | string, data: UpdateOrderStatusRequest) => Promise<Order | null>;
    setQueryParams: (params: OrdersQueryParams) => void;
    setSelectedOrder: (order: Order | null) => void;
    clearError: () => void;
    reset: () => void;
}

// ============== Initial State ==============

const initialState: OrdersState = {
    orders: [],
    pagination: {
        total: 0,
        page: 1,
        limit: 20,
    },
    queryParams: {
        page: 1,
        limit: 20,
    },
    selectedOrder: null,
    isLoading: false,
    isUpdating: false,
    error: null,
    lastFetched: null,
};

// ============== Store ==============

const useOrderStore = create<OrdersState & OrdersActions>()(
    persist(
        (set, get) => ({
            ...initialState,

            fetchOrders: async (params?: OrdersQueryParams) => {
                set({ isLoading: true, error: null });

                const mergedParams = { ...get().queryParams, ...params };

                try {
                    const response = await orderService.getOrders(mergedParams);

                    if (response.success && response.data) {
                        set({
                            orders: response.data.orders,
                            pagination: {
                                total: response.data.total,
                                page: response.data.page,
                                limit: response.data.limit,
                            },
                            queryParams: mergedParams,
                            isLoading: false,
                            lastFetched: Date.now(),
                        });
                    } else {
                        set({
                            error: response.message || "Failed to fetch orders",
                            isLoading: false,
                        });
                    }
                } catch (error: any) {
                    set({
                        error: error.message || "Failed to fetch orders",
                        isLoading: false,
                    });
                }
            },

            refreshOrders: async () => {
                const { queryParams } = get();
                await get().fetchOrders({ ...queryParams, page: 1 });
            },

            fetchOrderById: async (id) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await orderService.getOrderById(id);

                    if (response.success && response.data) {
                        set({
                            selectedOrder: response.data,
                            isLoading: false,
                        });
                        return response.data;
                    } else {
                        set({
                            error: response.message || "Failed to fetch order",
                            isLoading: false,
                        });
                        return null;
                    }
                } catch (error: any) {
                    set({
                        error: error.message || "Failed to fetch order",
                        isLoading: false,
                    });
                    return null;
                }
            },

            updateOrderStatus: async (id, data) => {
                set({ isUpdating: true, error: null });

                try {
                    const response = await orderService.updateOrderStatus(id, data);

                    if (response.success && response.data) {
                        // Update the order in the list
                        const currentOrders = get().orders;
                        set({
                            orders: currentOrders.map((o) =>
                                o.id === Number(id) ? response.data! : o
                            ),
                            isUpdating: false,
                        });

                        // Update selected order if it's the same
                        if (get().selectedOrder?.id === Number(id)) {
                            set({ selectedOrder: response.data });
                        }

                        return response.data;
                    } else {
                        set({
                            error: response.message || "Failed to update order status",
                            isUpdating: false,
                        });
                        return null;
                    }
                } catch (error: any) {
                    set({
                        error: error.message || "Failed to update order status",
                        isUpdating: false,
                    });
                    return null;
                }
            },

            setQueryParams: (params) => {
                set({ queryParams: params });
            },

            setSelectedOrder: (order) => {
                set({ selectedOrder: order });
            },

            clearError: () => {
                set({ error: null });
            },

            reset: () => {
                set(initialState);
            },
        }),
        {
            name: "thriftzy-orders",
            storage: createJSONStorage(() => sessionStorage),
            partialize: (state) => ({
                queryParams: state.queryParams,
            }),
        }
    )
);

export default useOrderStore;
