"use client";

import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { removeCookie, COOKIE_ACCESS_TOKEN } from "@/utils/cookie-helper";

import useActiveStoreStore from "@/store/active-store";
import useOnboardingStore from "@/store/onboarding-store";

export function QueryProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const handleUnauthorized = (error: Error) => {
        // Check if error message or status indicates unauthorized
        if (error.message.includes("401") || error.message.toLowerCase().includes("unauthorized")) {
            removeCookie(COOKIE_ACCESS_TOKEN);

            // Clear stores
            useActiveStoreStore.getState().clear();
            useOnboardingStore.getState().reset();

            router.push("/auth");
        }
    };

    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000, // 1 minute
                        gcTime: 5 * 60 * 1000, // 5 minutes
                        retry: 1,
                        refetchOnWindowFocus: false,
                    },
                },
                queryCache: new QueryCache({
                    onError: (error) => handleUnauthorized(error),
                }),
                mutationCache: new MutationCache({
                    onError: (error) => handleUnauthorized(error),
                }),
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
