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
