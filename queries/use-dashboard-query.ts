import { useQuery } from "@tanstack/react-query";
import { dashboardService, DashboardData } from "@/service/dashboard.service";
import { queryKeys } from "./keys";

export function useDashboardQuery(storeId: number | null) {
    return useQuery({
        queryKey: queryKeys.dashboard.byStore(storeId!),
        queryFn: async () => {
            const response = await dashboardService.getDashboardData(storeId!);
            if (!response.success) {
                throw new Error(response.message || "Failed to fetch dashboard");
            }
            return response.data as DashboardData;
        },
        enabled: !!storeId,
    });
}
