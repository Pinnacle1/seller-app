import { END_POINT } from "../constant/endpoint-contstant";
import { endpoints } from "../constant/endpoint";
import { COOKIE_ACCESS_TOKEN, getCookie } from "../utils/cookie-helper";
import {
    CreateProductRequest,
    UpdateProductRequest,
    ProductListResponse,
    ProductResponse,
    ProductMutationResponse,
    ProductsQueryParams,
} from "../types/product";

// Build query string from params
const buildQueryString = (params?: ProductsQueryParams): string => {
    if (!params) return "";

    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", String(params.page));
    if (params.limit) queryParams.append("limit", String(params.limit));
    if (params.store_id) queryParams.append("store_id", String(params.store_id));
    if (params.category) queryParams.append("category", params.category);
    if (params.condition) queryParams.append("condition", params.condition);

    const queryString = queryParams.toString();
    return queryString ? `?${queryString}` : "";
};

export const productService = {

    /**
     * Get all products for the seller with optional filtering and pagination
     */
    getProducts: async (params?: ProductsQueryParams): Promise<ProductListResponse> => {
        const queryString = buildQueryString(params);
        return END_POINT.get(
            `${endpoints.getproducts}${queryString}`,
            true,
            "V1",
            { auth: true, token: getCookie(COOKIE_ACCESS_TOKEN) }
        );
    },

    /**
     * Get a single product by ID
     */
    getProductById: async (id: number | string): Promise<ProductResponse> => {
        return END_POINT.get(
            endpoints.getproductbyid.replace(":id", String(id)),
            true,
            "V1",
            { auth: true, token: getCookie(COOKIE_ACCESS_TOKEN) }
        );
    },

    /**
     * Create a new product
     */
    createProduct: async (data: CreateProductRequest): Promise<ProductMutationResponse> => {
        return END_POINT.post(
            endpoints.createproduct,
            data,
            true,
            "V1",
            { auth: true, token: getCookie(COOKIE_ACCESS_TOKEN) }
        );
    },

    /**
     * Update an existing product
     */
    updateProduct: async (id: number | string, data: UpdateProductRequest): Promise<ProductMutationResponse> => {
        return END_POINT.PATCH(
            endpoints.updateproduct.replace(":id", String(id)),
            data,
            true,
            "V1",
            { auth: true, token: getCookie(COOKIE_ACCESS_TOKEN) }
        );
    },

    /**
     * Delete a product
     */
    deleteProduct: async (id: number | string): Promise<{ success: boolean; message: string }> => {
        return END_POINT.Delete(
            endpoints.deleteproduct.replace(":id", String(id)),
            true,
            "V1",
            { auth: true, token: getCookie(COOKIE_ACCESS_TOKEN) }
        );
    },

    /**
     * Bulk delete products
     */
    bulkDeleteProducts: async (ids: (number | string)[]): Promise<{ success: boolean; message: string; deleted: number }> => {
        const results = await Promise.allSettled(
            ids.map(id => productService.deleteProduct(id))
        );

        const deleted = results.filter(r => r.status === 'fulfilled' && (r.value as any).success).length;

        return {
            success: deleted === ids.length,
            message: deleted === ids.length
                ? `Successfully deleted ${deleted} products`
                : `Deleted ${deleted} of ${ids.length} products`,
            deleted
        };
    },
};
