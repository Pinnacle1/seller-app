import { END_POINT } from "../constant/endpoint-contstant";
import { endpoints } from "../constant/endpoint";
import { COOKIE_ACCESS_TOKEN, getCookie } from "../utils/cookie-helper";

export interface DashboardData {
    // Overview metrics
    todaySales: number;
    totalSales: number;
    totalOrders: number;
    pendingOrders: number;
    shippedOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;

    // Inventory
    totalProducts: number;
    lowStockProducts: number;
    outOfStockProducts: number;

    // Revenue
    todayRevenue: number;
    weekRevenue: number;
    monthRevenue: number;
    pendingPayouts: number;

    // Recent activity
    recentOrders: RecentOrder[];
    topProducts: TopProduct[];

    // Alerts & notifications
    alerts: DashboardAlert[];
}

export interface RecentOrder {
    id: number;
    order_number: string;
    customer_name: string;
    total: number;
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
    created_at: string;
    items_count: number;
}

export interface TopProduct {
    id: number;
    title: string;
    image_url: string;
    sales_count: number;
    revenue: number;
    stock: number;
}

export interface DashboardAlert {
    id: string;
    type: 'warning' | 'info' | 'success' | 'error';
    title: string;
    message: string;
    action_url?: string;
    action_label?: string;
    created_at: string;
}

export interface DashboardResponse {
    success: boolean;
    message?: string;
    data?: DashboardData;
}

export const dashboardService = {
    // Get full dashboard data for the current store
    getDashboardData: async (storeId: number): Promise<DashboardResponse> => {
        try {
            // Get dashboard stats from existing endpoint - pass store_id
            const dashboardRes = await END_POINT.get(
                `${endpoints.dashboard}?store_id=${storeId}`,
                true,
                "V1",
                { auth: true, token: getCookie(COOKIE_ACCESS_TOKEN) }
            );

            const stats = dashboardRes.data?.stats || {};

            // Build dashboard data using the new backend response
            const dashboardData: DashboardData = {
                todaySales: 0, // Would need time-filtered API
                totalSales: stats.total_orders || 0,
                totalOrders: stats.total_orders || 0,
                pendingOrders: stats.pending_orders || 0,
                shippedOrders: stats.shipped_orders || 0,
                deliveredOrders: stats.delivered_orders || 0,
                cancelledOrders: stats.cancelled_orders || 0,

                totalProducts: stats.total_products || 0,
                lowStockProducts: stats.low_stock_products || 0,
                outOfStockProducts: stats.out_of_stock_products || 0,

                todayRevenue: 0, // Would need time-filtered API
                weekRevenue: 0,
                monthRevenue: stats.month_revenue || stats.total_revenue || 0,
                pendingPayouts: stats.pending_payouts || 0,

                recentOrders: (stats.recent_orders || []).map((o: any) => ({
                    id: o.id,
                    order_number: `#${o.id}`,
                    customer_name: o.customer_name || 'Customer',
                    total: o.total_amount || 0,
                    status: o.status,
                    created_at: o.created_at,
                    items_count: 1
                })),

                topProducts: (stats.top_products || []).map((p: any) => ({
                    id: p.id,
                    title: p.title,
                    image_url: p.image_url || '',
                    sales_count: 0,
                    revenue: 0,
                    stock: p.quantity
                })),

                alerts: generateAlerts(stats, stats.low_stock_products || 0, stats.out_of_stock_products || 0, stats.pending_orders || 0)
            };

            return {
                success: true,
                data: dashboardData
            };
        } catch (error: any) {
            console.error("Dashboard fetch error:", error);
            return {
                success: false,
                message: error.message || "Failed to fetch dashboard data"
            };
        }
    }
};

// Helper function to generate alerts
function generateAlerts(
    stats: any,
    lowStock: number,
    outOfStock: number,
    pendingOrders: number
): DashboardAlert[] {
    const alerts: DashboardAlert[] = [];

    if (outOfStock > 0) {
        alerts.push({
            id: 'out-of-stock',
            type: 'error',
            title: 'Out of Stock Items',
            message: `${outOfStock} product${outOfStock > 1 ? 's are' : ' is'} out of stock.`,
            action_url: '/my-products?filter=out-of-stock',
            action_label: 'View Products',
            created_at: new Date().toISOString()
        });
    }

    if (lowStock > 0) {
        alerts.push({
            id: 'low-stock',
            type: 'warning',
            title: 'Low Stock Alert',
            message: `${lowStock} product${lowStock > 1 ? 's have' : ' has'} low stock (≤5 units).`,
            action_url: '/my-products?filter=low-stock',
            action_label: 'Restock Now',
            created_at: new Date().toISOString()
        });
    }

    if (pendingOrders > 0) {
        alerts.push({
            id: 'pending-orders',
            type: 'info',
            title: 'Orders to Process',
            message: `You have ${pendingOrders} pending order${pendingOrders > 1 ? 's' : ''} to process.`,
            action_url: '/orders?filter=pending',
            action_label: 'View Orders',
            created_at: new Date().toISOString()
        });
    }

    return alerts;
}
