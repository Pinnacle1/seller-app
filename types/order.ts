// Order Types - Aligned with Backend API

export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";

export interface OrderItem {
    id: number;
    product_id: number;
    product_title: string;
    product_image: string | null;
    quantity: number;
    price_at_purchase: number;
}

export interface ShippingAddress {
    name: string;
    phone: string;
    line1: string;
    line2: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
}

export interface Order {
    id: number;
    user_name: string;
    user_email: string;
    status: OrderStatus;
    total_amount: number;
    payment_method: string;
    items: OrderItem[];
    shipping_address: ShippingAddress | null;
    created_at: string;
}

// Request types
export interface UpdateOrderStatusRequest {
    status: "shipped" | "delivered" | "cancelled";
    tracking_number?: string;
    notes?: string;
}

export interface OrdersQueryParams {
    page?: number;
    limit?: number;
    store_id?: number;
    status?: OrderStatus;
}

// API Response types
export interface OrderListResponse {
    success: boolean;
    message?: string;
    data?: {
        orders: Order[];
        total: number;
        page: number;
        limit: number;
    };
}

export interface OrderResponse {
    success: boolean;
    message?: string;
    data?: Order;
}

export interface OrderMutationResponse {
    success: boolean;
    message: string;
    data?: Order;
}
