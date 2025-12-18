// Product Types - Aligned with Backend API

export type ProductStatus = "active" | "inactive";
export type ProductCondition = "new" | "good" | "fair";

export interface ProductImage {
    id?: number;
    image_url: string;
    position: number;
}

export interface ProductAttribute {
    id?: number;
    name: string;
    value: string;
}

// Full product type as returned from API
export interface Product {
    id: number;
    store_id: number;
    title: string;
    description: string;
    category: string;
    condition: ProductCondition;
    price: number;
    quantity: number;
    images: ProductImage[];
    attributes: ProductAttribute[];
    created_at: string;
    updated_at: string;
}

// Request type for creating a product (matches backend CreateProductRequest)
export interface CreateProductRequest {
    store_id: number;
    title: string;
    description: string;
    category: string;
    condition: ProductCondition;
    price: number;
    quantity: number;
    images?: string[];  // Array of image URLs
    attributes?: { name: string; value: string }[];
}

// Request type for updating a product (matches backend UpdateProductRequest)
export interface UpdateProductRequest {
    title?: string;
    description?: string;
    category?: string;
    condition?: ProductCondition;
    price?: number;
    quantity?: number;
    is_active?: boolean;
}

// API response types
export interface ProductListResponse {
    success: boolean;
    message: string;
    data?: {
        products: Product[];
        total: number;
        page: number;
        limit: number;
    };
}

export interface ProductResponse {
    success: boolean;
    message: string;
    data?: Product;  // Backend returns product directly in data, not { product: Product }
}

export interface ProductMutationResponse {
    success: boolean;
    message: string;
    data?: Product;
}

// Query params for fetching products
export interface ProductsQueryParams {
    page?: number;
    limit?: number;
    store_id?: number;
    category?: string;
    condition?: ProductCondition;
}
