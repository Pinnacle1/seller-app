import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { accountService, UpdateSellerRequest } from "@/service/account.service";
import { queryKeys } from "./keys";

export function useSellerProfileQuery() {
    return useQuery({
        queryKey: queryKeys.account.profile(),
        queryFn: async () => {
            const response = await accountService.getProfile();
            if (!response.success) {
                throw new Error(response.message || "Failed to fetch profile");
            }
            return response.data;
        },
    });
}

export function useKycStatusQuery() {
    return useQuery({
        queryKey: queryKeys.account.kyc(),
        queryFn: async () => {
            const response = await accountService.getKYCStatus();
            if (!response.success) {
                throw new Error("Failed to fetch KYC status");
            }
            return response.data;
        },
    });
}

export function useBankDetailsQuery() {
    return useQuery({
        queryKey: queryKeys.account.bank(),
        queryFn: async () => {
            const response = await accountService.getBankDetails();
            if (!response.success) {
                throw new Error("Failed to fetch bank details");
            }
            return response.data;
        },
    });
}

export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: UpdateSellerRequest) => {
            const response = await accountService.updateProfile(data);
            if (!response.success) {
                throw new Error(response.message || "Failed to update profile");
            }
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.account.profile() });
        },
    });
}

// Address Hooks
export function useAddressesQuery() {
    return useQuery({
        queryKey: queryKeys.account.addresses(),
        queryFn: async () => {
            const response = await accountService.getAddresses();
            if (!response.success) {
                throw new Error("Failed to fetch addresses");
            }
            return response.data || [];
        },
    });
}

export function useCreateAddress() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            const response = await accountService.createAddress(data);
            if (!response.success) {
                throw new Error(response.message || "Failed to create address");
            }
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.account.addresses() });
        },
    });
}

export function useUpdateAddress() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: number; data: any }) => {
            const response = await accountService.updateAddress(id, data);
            if (!response.success) {
                throw new Error(response.message || "Failed to update address");
            }
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.account.addresses() });
        },
    });
}

export function useDeleteAddress() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            const response = await accountService.deleteAddress(id);
            if (!response.success) {
                throw new Error(response.message || "Failed to delete address");
            }
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.account.addresses() });
        },
    });
}
