import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/service/myproducts.service";
import { queryKeys } from "./keys";
import { ProductsQueryParams, Product, CreateProductRequest, UpdateProductRequest } from "@/types/product";

export function useProductsQuery(storeId: number | null, params?: Omit<ProductsQueryParams, 'store_id'>) {
    const queryParams: ProductsQueryParams = {
        ...params,
        store_id: storeId ?? undefined,
    };

    return useQuery({
        queryKey: queryKeys.products.list(storeId!, params as Record<string, unknown>),
        queryFn: async () => {
            const response = await productService.getProducts(queryParams);
            if (!response.success) {
                throw new Error(response.message || "Failed to fetch products");
            }
            return {
                products: response.data?.products ?? [],
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

export function useProductDetailQuery(productId: number | null) {
    return useQuery({
        queryKey: queryKeys.products.detail(productId!),
        queryFn: async () => {
            const response = await productService.getProductById(productId!);
            if (!response.success) {
                throw new Error(response.message || "Failed to fetch product");
            }
            return response.data as Product;
        },
        enabled: !!productId,
    });
}

export function useCreateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateProductRequest) => {
            const response = await productService.createProduct(data);
            if (!response.success) {
                throw new Error(response.message || "Failed to create product");
            }
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
        },
    });
}

export function useUpdateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ productId, data }: { productId: number; data: UpdateProductRequest }) => {
            const response = await productService.updateProduct(productId, data);
            if (!response.success) {
                throw new Error(response.message || "Failed to update product");
            }
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(variables.productId) });
        },
    });
}

export function useDeleteProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (productId: number) => {
            const response = await productService.deleteProduct(productId);
            if (!response.success) {
                throw new Error(response.message || "Failed to delete product");
            }
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
        },
    });
}

export function useBulkDeleteProducts() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (productIds: number[]) => {
            const response = await productService.bulkDeleteProducts(productIds);
            if (!response.success) {
                throw new Error(response.message || "Failed to delete products");
            }
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
        },
    });
}
