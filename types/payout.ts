// ============== Seller Earnings Types ==============

export interface SellerEarningsResponse {
    success: boolean;
    data: SellerEarnings;
}

export interface SellerEarnings {
    total_orders: number;
    total_revenue: number;
    total_commission: number;
    net_earnings: number;
    pending_payout: number;
    completed_payouts: number;
    available_for_payout: number;
}

export interface EarningsByStoreResponse {
    success: boolean;
    data: StoreEarnings[];
}

export interface StoreEarnings {
    store_id: number;
    store_name: string;
    total_orders: number;
    total_revenue: number;
    total_commission: number;
    net_earnings: number;
    pending_payout: number;
    available_for_payout: number;
}

// ============== Payout Types ==============

export interface PayoutListResponse {
    success: boolean;
    data: Payout[];
}

export interface PayoutResponse {
    success: boolean;
    data: Payout;
}

export interface Payout {
    id: number;
    store_id?: number;
    gross_amount: number;
    commission_amount: number;
    net_amount: number;
    status: "pending" | "requested" | "approved" | "processing" | "completed" | "rejected" | "failed";
    request_notes?: string;
    admin_notes?: string;
    transaction_id?: string;
    processed_at?: string;
    created_at: string;
    updated_at: string;
    store?: {
        id: number;
        name: string;
    };
}

export interface CreatePayoutRequest {
    store_id?: number;
    order_ids?: number[];
    request_notes?: string;
}

export interface PayoutMutationResponse {
    success: boolean;
    message: string;
    data: Payout;
}

// ============== Payout Query Parameters ==============

export interface PayoutQueryParams {
    status?: string;
    page?: number;
    limit?: number;
}
