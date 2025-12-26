import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { onboardService, StoreData, CreateStoreResponse } from "@/service/onboard.service";
import { queryKeys } from "./keys";
import { CreateStoreRequest } from "@/types/onboard";

export function useStoresQuery() {
    return useQuery({
        queryKey: queryKeys.stores.list(),
        queryFn: async () => {
            const response = await onboardService.getStores();
            if (!response.success) {
                throw new Error(response.message || "Failed to fetch stores");
            }
            return response.data ?? [];
        },
    });
}

export function useCreateStore() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateStoreRequest): Promise<CreateStoreResponse> => {
            const response = await onboardService.createStore(data);
            if (!response.success) {
                throw new Error(response.message || "Failed to create store");
            }
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.stores.all });
        },
    });
}

export function useUpdateStore() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ storeId, data }: { storeId: number; data: Partial<Omit<StoreData, 'id' | 'slug' | 'rating_avg' | 'rating_count' | 'is_verified' | 'products_count' | 'created_at'>> }) => {
            const response = await onboardService.updateStore(storeId, data);
            if (!response.success) {
                throw new Error(response.message || "Failed to update store");
            }
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.stores.all });
        },
    });
}

export function useUploadStoreLogo() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ storeId, logoUrl }: { storeId: number; logoUrl: string }) => {
            const response = await onboardService.uploadLogo({ storeId, logo: logoUrl });
            if (!response.success) {
                throw new Error(response.message || "Failed to upload logo");
            }
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.stores.all });
        },
    });
}
