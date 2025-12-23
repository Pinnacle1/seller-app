import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { payoutService } from "@/service/payout.service";
import { queryKeys } from "./keys";
import { PayoutQueryParams, CreatePayoutRequest } from "@/types/payout";

export function useEarningsQuery(storeId?: number) {
    return useQuery({
        queryKey: queryKeys.payouts.earnings(),
        queryFn: async () => {
            const response = await payoutService.getEarnings(storeId);
            if (!response.success) {
                throw new Error("Failed to fetch earnings");
            }
            return response.data;
        },
    });
}

export function useEarningsByStoreQuery(storeId?: number) {
    return useQuery({
        queryKey: [...queryKeys.payouts.all, "by-store", storeId] as const,
        queryFn: async () => {
            const response = await payoutService.getEarningsByStore(storeId);
            if (!response.success) {
                throw new Error("Failed to fetch earnings by store");
            }
            return response.data;
        },
    });
}

export function usePayoutsQuery(params?: PayoutQueryParams) {
    return useQuery({
        queryKey: queryKeys.payouts.history(params as Record<string, unknown>),
        queryFn: async () => {
            const response = await payoutService.getPayouts(params);
            if (!response.success) {
                throw new Error("Failed to fetch payouts");
            }
            return response.data;
        },
    });
}

export function useRequestPayout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreatePayoutRequest) => {
            const response = await payoutService.requestPayout(data);
            if (!response.success) {
                throw new Error(response.message || "Failed to request payout");
            }
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.payouts.all });
        },
    });
}
