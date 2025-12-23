import { END_POINT } from "../constant/endpoint-contstant";
import { endpoints } from "../constant/endpoint";
import { COOKIE_ACCESS_TOKEN, getCookie } from "../utils/cookie-helper";

export interface SellerData {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    role: string;
    email_verified: boolean;
    phone_verified: boolean;
    created_at: string;
}

export interface SellerKYC {
    pan_verified: boolean;
    aadhaar_verified: boolean;
    bank_verified: boolean;
    overall_status: 'pending' | 'verified' | 'rejected';
}

export interface SellerBankDetails {
    account_holder_name: string;
    account_number: string;
    ifsc_code: string;
    bank_name?: string;
}

export interface AccountResponse {
    success: boolean;
    message?: string;
    data?: SellerData;
}

export interface UpdateSellerRequest {
    name?: string;
    phone?: string;
}

export const accountService = {
    // Get current seller profile
    getProfile: async (): Promise<AccountResponse> => {
        return END_POINT.get(
            endpoints.me,
            true,
            "V1",
            { auth: true, token: getCookie(COOKIE_ACCESS_TOKEN) }
        );
    },

    // Update seller profile
    updateProfile: async (data: UpdateSellerRequest): Promise<{ success: boolean; message?: string }> => {
        return END_POINT.PATCH(
            endpoints.me,
            data,
            true,
            "V1",
            { auth: true, token: getCookie(COOKIE_ACCESS_TOKEN) }
        );
    },

    // Get KYC status
    getKYCStatus: async (): Promise<{ success: boolean; data?: SellerKYC }> => {
        try {
            const [panRes, aadhaarRes, bankRes] = await Promise.all([
                END_POINT.get(endpoints.getpan, true, "V1", { auth: true, token: getCookie(COOKIE_ACCESS_TOKEN) }),
                END_POINT.get(endpoints.getaadhaar, true, "V1", { auth: true, token: getCookie(COOKIE_ACCESS_TOKEN) }),
                END_POINT.get(endpoints.getbank, true, "V1", { auth: true, token: getCookie(COOKIE_ACCESS_TOKEN) })
            ]);

            const pan_verified = panRes.success && panRes.data;
            const aadhaar_verified = aadhaarRes.success && aadhaarRes.data;
            const bank_verified = bankRes.success && bankRes.data;

            let overall_status: 'pending' | 'verified' | 'rejected' = 'pending';
            if (pan_verified && aadhaar_verified && bank_verified) {
                overall_status = 'verified';
            }

            return {
                success: true,
                data: {
                    pan_verified,
                    aadhaar_verified,
                    bank_verified,
                    overall_status
                }
            };
        } catch (error) {
            return { success: false };
        }
    },

    // Get bank details
    getBankDetails: async (): Promise<{ success: boolean; data?: SellerBankDetails }> => {
        return END_POINT.get(
            endpoints.getbank,
            true,
            "V1",
            { auth: true, token: getCookie(COOKIE_ACCESS_TOKEN) }
        );
    }
};
