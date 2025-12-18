"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { productService } from "@/service/myproducts.service";
import {
    Product,
    ProductsQueryParams,
    CreateProductRequest,
    UpdateProductRequest,
} from "@/types/product";

// ============== State Types ==============

interface ProductsState {
    products: Product[];
    pagination: {
        total: number;
        page: number;
        limit: number;
    };
    queryParams: ProductsQueryParams;
    selectedProduct: Product | null;
    isLoading: boolean;
    isLoadingMore: boolean;
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
    error: string | null;
    selectedIds: number[];
    lastFetched: number | null;
}

interface ProductsActions {
    fetchProducts: (params?: ProductsQueryParams) => Promise<void>;
    loadMoreProducts: () => Promise<void>;
    refreshProducts: () => Promise<void>;
    fetchProductById: (id: number | string) => Promise<Product | null>;
    createProduct: (data: CreateProductRequest) => Promise<Product | null>;
    updateProduct: (id: number | string, data: UpdateProductRequest) => Promise<Product | null>;
    deleteProduct: (id: number | string) => Promise<boolean>;
    bulkDeleteProducts: (ids: number[]) => Promise<{ success: boolean; deleted: number }>;
    toggleSelection: (id: number) => void;
    selectAll: () => void;
    deselectAll: () => void;
    setQueryParams: (params: ProductsQueryParams) => void;
    setSelectedProduct: (product: Product | null) => void;
    clearError: () => void;
    reset: () => void;
}

// ============== Initial State ==============

const initialState: ProductsState = {
    products: [],
    pagination: {
        total: 0,
        page: 1,
        limit: 20,
    },
    queryParams: {
        page: 1,
        limit: 20,
    },
    selectedProduct: null,
    isLoading: false,
    isLoadingMore: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    error: null,
    selectedIds: [],
    lastFetched: null,
};

// ============== Store ==============

const useProductStore = create<ProductsState & ProductsActions>()(
    persist(
        (set, get) => ({
            ...initialState,

            fetchProducts: async (params?: ProductsQueryParams) => {
                const queryParams = params || get().queryParams;
                set({ isLoading: true, error: null, queryParams });

                try {
                    const response = await productService.getProducts(queryParams);

                    if (response.success && response.data) {
                        set({
                            products: response.data.products || [],
                            pagination: {
                                total: response.data.total || 0,
                                page: response.data.page || 1,
                                limit: response.data.limit || 20,
                            },
                            isLoading: false,
                            lastFetched: Date.now(),
                        });
                    } else {
                        set({
                            error: response.message || "Failed to fetch products",
                            isLoading: false,
                        });
                    }
                } catch (error: any) {
                    set({
                        error: error.message || "Failed to fetch products",
                        isLoading: false,
                    });
                }
            },

            loadMoreProducts: async () => {
                const { pagination, queryParams, products } = get();
                const totalPages = Math.ceil(pagination.total / pagination.limit);

                if (pagination.page >= totalPages) return;

                set({ isLoadingMore: true, error: null });

                try {
                    const nextPage = pagination.page + 1;
                    const response = await productService.getProducts({
                        ...queryParams,
                        page: nextPage,
                    });

                    if (response.success && response.data) {
                        set({
                            products: [...products, ...(response.data.products || [])],
                            pagination: {
                                total: response.data.total || 0,
                                page: response.data.page || nextPage,
                                limit: response.data.limit || 20,
                            },
                            queryParams: { ...queryParams, page: nextPage },
                            isLoadingMore: false,
                        });
                    } else {
                        set({
                            error: response.message || "Failed to load more products",
                            isLoadingMore: false,
                        });
                    }
                } catch (error: any) {
                    set({
                        error: error.message || "Failed to load more products",
                        isLoadingMore: false,
                    });
                }
            },

            refreshProducts: async () => {
                const { queryParams } = get();
                await get().fetchProducts({ ...queryParams, page: 1 });
            },

            fetchProductById: async (id) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await productService.getProductById(id);

                    if (response.success && response.data) {
                        set({
                            selectedProduct: response.data,
                            isLoading: false,
                        });
                        return response.data;
                    } else {
                        set({
                            error: response.message || "Failed to fetch product",
                            isLoading: false,
                        });
                        return null;
                    }
                } catch (error: any) {
                    set({
                        error: error.message || "Failed to fetch product",
                        isLoading: false,
                    });
                    return null;
                }
            },

            createProduct: async (data) => {
                set({ isCreating: true, error: null });

                try {
                    const response = await productService.createProduct(data);

                    if (response.success && response.data) {
                        const currentProducts = get().products;
                        const currentPagination = get().pagination;
                        set({
                            products: [response.data, ...currentProducts],
                            pagination: { ...currentPagination, total: currentPagination.total + 1 },
                            isCreating: false,
                        });
                        return response.data;
                    } else {
                        set({
                            error: response.message || "Failed to create product",
                            isCreating: false,
                        });
                        return null;
                    }
                } catch (error: any) {
                    set({
                        error: error.message || "Failed to create product",
                        isCreating: false,
                    });
                    return null;
                }
            },

            updateProduct: async (id, data) => {
                set({ isUpdating: true, error: null });

                try {
                    const response = await productService.updateProduct(id, data);

                    if (response.success && response.data) {
                        const currentProducts = get().products;
                        set({
                            products: currentProducts.map(p =>
                                p.id === Number(id) ? response.data! : p
                            ),
                            isUpdating: false,
                        });

                        if (get().selectedProduct?.id === Number(id)) {
                            set({ selectedProduct: response.data });
                        }

                        return response.data;
                    } else {
                        set({
                            error: response.message || "Failed to update product",
                            isUpdating: false,
                        });
                        return null;
                    }
                } catch (error: any) {
                    set({
                        error: error.message || "Failed to update product",
                        isUpdating: false,
                    });
                    return null;
                }
            },

            deleteProduct: async (id) => {
                set({ isDeleting: true, error: null });

                try {
                    const response = await productService.deleteProduct(id);

                    if (response.success) {
                        const currentProducts = get().products;
                        const currentPagination = get().pagination;
                        set({
                            products: currentProducts.filter(p => p.id !== Number(id)),
                            pagination: { ...currentPagination, total: currentPagination.total - 1 },
                            isDeleting: false,
                        });
                        return true;
                    } else {
                        set({
                            error: response.message || "Failed to delete product",
                            isDeleting: false,
                        });
                        return false;
                    }
                } catch (error: any) {
                    set({
                        error: error.message || "Failed to delete product",
                        isDeleting: false,
                    });
                    return false;
                }
            },

            bulkDeleteProducts: async (ids) => {
                set({ isDeleting: true, error: null });

                try {
                    const result = await productService.bulkDeleteProducts(ids);

                    if (result.success) {
                        const currentProducts = get().products;
                        const currentPagination = get().pagination;
                        set({
                            products: currentProducts.filter(p => !ids.includes(p.id)),
                            pagination: { ...currentPagination, total: currentPagination.total - result.deleted },
                            selectedIds: [],
                            isDeleting: false,
                        });
                    } else {
                        set({ isDeleting: false });
                    }

                    return { success: result.success, deleted: result.deleted };
                } catch (error: any) {
                    set({
                        error: error.message || "Failed to delete products",
                        isDeleting: false,
                    });
                    return { success: false, deleted: 0 };
                }
            },

            toggleSelection: (id) => {
                const { selectedIds } = get();
                if (selectedIds.includes(id)) {
                    set({ selectedIds: selectedIds.filter(i => i !== id) });
                } else {
                    set({ selectedIds: [...selectedIds, id] });
                }
            },

            selectAll: () => {
                const { products } = get();
                set({ selectedIds: products.map(p => p.id) });
            },

            deselectAll: () => {
                set({ selectedIds: [] });
            },

            setQueryParams: (params) => {
                set({ queryParams: { ...get().queryParams, ...params } });
            },

            setSelectedProduct: (product) => {
                set({ selectedProduct: product });
            },

            clearError: () => {
                set({ error: null });
            },

            reset: () => {
                set(initialState);
            },
        }),
        {
            name: "thriftzy-products",
            storage: createJSONStorage(() => sessionStorage),
            partialize: (state) => ({
                queryParams: state.queryParams,
                lastFetched: state.lastFetched,
            }),
        }
    )
);

export default useProductStore;
