export interface CreateStoreRequest {
    name: string;
    description: string;
}

export interface UploadLogoRequest {
    storeId: number;
    logo: string;
}

export interface EmailVerificationRequest {
    email: string;
}

export interface PhoneVerificationRequest {
    phone: string;
}

export interface VerifyOTPRequest {
    phoneOrEmail: string;
    otp: string;
}

export interface Pan {
    name: string;
    pan_number: string;
}

export interface Aadhaar {
    name: string;
    aadhaar_number: string;
}

export interface Bank {
    name: string;
    account_number: string;
    ifsc_code: string;
}
