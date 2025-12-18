import { END_POINT } from "../constant/endpoint-contstant";
import { endpoints } from "../constant/endpoint";
import { CreateStoreRequest, UploadLogoRequest, EmailVerificationRequest, PhoneVerificationRequest, VerifyOTPRequest, Pan, Aadhaar, Bank } from "../types/onboard";
import { COOKIE_ACCESS_TOKEN, getCookie } from "../utils/cookie-helper";

export interface StoreData {
    id: number;
    name: string;
    slug: string;
    description: string;
    logo_url: string;
    rating_avg: number;
    rating_count: number;
    is_active: boolean;
    is_verified: boolean;
    products_count?: number;
    created_at: string;
}

export interface SellerProfile {
    id: number;
    user_id: number;
    kyc_verified: boolean;
    gst_number: string;
    seller_status: "pending" | "approved" | "rejected";
    created_at: string;
}

export interface SellerStats {
    total_stores: number;
    total_products: number;
    total_orders: number;
    pending_orders: number;
    total_revenue: number;
    pending_payouts: number;
}

export interface CreateStoreResponse {
    success: boolean;
    message: string;
    data?: {
        id: number;
        name: string;
        slug: string;
        description: string;
        logo_url: string | null;
    };
}

export const onboardService = {

    getStores: async (): Promise<{ success: boolean; message?: string; data?: StoreData[] }> => {
        return END_POINT.get(
            endpoints.getstore,
            true,
            "V1",
            { auth: true, token: getCookie(COOKIE_ACCESS_TOKEN) }
        );
    },

    getDashboard: async (): Promise<{ success: boolean; data?: { profile: SellerProfile; stats: SellerStats } }> => {
        return END_POINT.get(
            endpoints.dashboard,
            true,
            "V1",
            { auth: true, token: getCookie(COOKIE_ACCESS_TOKEN) }
        );
    },

    createStore: async (data: CreateStoreRequest): Promise<CreateStoreResponse> => {
        return END_POINT.post(
            endpoints.createstore,
            {
                name: data.name,
                description: data.description,
            },
            true,
            "V1",
            { auth: true, token: getCookie(COOKIE_ACCESS_TOKEN) }
        );
    },

    updateStore: async (id: number, data: { name?: string; description?: string }) => {
        const path = endpoints.updatestore.replace(":id", String(id));
        return END_POINT.PATCH(
            path,
            data,
            true,
            "V1",
            { auth: true, token: getCookie(COOKIE_ACCESS_TOKEN) }
        );
    },

    uploadLogo: async (data: UploadLogoRequest) => {
        // Replace :id placeholder with actual store ID
        const path = endpoints.updatestore.replace(":id", String(data.storeId));

        return END_POINT.PATCH(
            path,
            {
                logo_url: data.logo,
            },
            true,
            "V1",
            { auth: true, token: getCookie(COOKIE_ACCESS_TOKEN) }
        );
    },

    EmailVerification: async (data: EmailVerificationRequest) => {
        return END_POINT.post(
            endpoints.sendEmailOtp,
            {
                email: data.email,
            },
            true,
            "V1",
            { auth: false } // Public route, no auth needed
        );
    },

    PhoneVerification: async (data: PhoneVerificationRequest) => {
        return END_POINT.post(
            endpoints.sendPhoneOtp,
            {
                phone: data.phone,
            },
            true,
            "V1",
            { auth: false } // Public route, no auth needed
        );
    },

    VerifyOTP: async (data: VerifyOTPRequest) => {
        return END_POINT.post(
            endpoints.verifyOtp,
            {
                identifier: data.phoneOrEmail, // Backend uses 'identifier' not 'phoneOrEmail'
                otp: data.otp,
            },
            true,
            "V1",
            { auth: false } // Public route, no auth needed
        );
    },

    // ============== KYC Services ==============

    GetKYCStatus: async () => {
        return END_POINT.get(
            endpoints.getstatus,
            true,
            "V1",
            { auth: true, token: getCookie(COOKIE_ACCESS_TOKEN) }
        );
    },

    GetPan: async () => {
        return END_POINT.get(
            endpoints.getpan,
            true,
            "V1",
            { auth: true, token: getCookie(COOKIE_ACCESS_TOKEN) }
        );
    },

    GetAadhaar: async () => {
        return END_POINT.get(
            endpoints.getaadhaar,
            true,
            "V1",
            { auth: true, token: getCookie(COOKIE_ACCESS_TOKEN) }
        );
    },

    GetBank: async () => {
        return END_POINT.get(
            endpoints.getbank,
            true,
            "V1",
            { auth: true, token: getCookie(COOKIE_ACCESS_TOKEN) }
        );
    },

    SubmitPan: async (data: Pan) => {
        return END_POINT.post(
            endpoints.submitpan,
            {
                pan_name: data.name,
                pan_number: data.pan_number,
            },
            true,
            "V1",
            { auth: true, token: getCookie(COOKIE_ACCESS_TOKEN) }
        );
    },

    SubmitAadhar: async (data: Aadhaar) => {
        return END_POINT.post(
            endpoints.submitaadhaar,
            {
                aadhaar_name: data.name,
                aadhaar_number: data.aadhaar_number,
            },
            true,
            "V1",
            { auth: true, token: getCookie(COOKIE_ACCESS_TOKEN) }
        );
    },

    SubmitBank: async (data: Bank) => {
        return END_POINT.post(
            endpoints.submitbank,
            {
                account_holder_name: data.name,
                account_number: data.account_number,
                ifsc_code: data.ifsc_code,
            },
            true,
            "V1",
            { auth: true, token: getCookie(COOKIE_ACCESS_TOKEN) }
        );
    },

    DeletePan: async () => {
        return END_POINT.Delete(
            endpoints.deletepan,
            true,
            "V1",
            { auth: true, token: getCookie(COOKIE_ACCESS_TOKEN) }
        );
    },

    DeleteAadhaar: async () => {
        return END_POINT.Delete(
            endpoints.deleteaadhaar,
            true,
            "V1",
            { auth: true, token: getCookie(COOKIE_ACCESS_TOKEN) }
        );
    },

    DeleteBank: async () => {
        return END_POINT.Delete(
            endpoints.deletebank,
            true,
            "V1",
            { auth: true, token: getCookie(COOKIE_ACCESS_TOKEN) }
        );
    },

}
