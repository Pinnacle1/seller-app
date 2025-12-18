export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: "buyer" | "seller";
    created_at: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    phone: string;
    password: string;
    role?: "buyer" | "seller";
}

export interface LoginRequest {
    emailOrPhone?: string;
    email?: string;
    phone?: string;
    password: string;
}

export interface GoogleOAuthRequest {
    idToken: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface TokenPair {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data?: {
        user: User;
        tokens: TokenPair;
    };
}

export interface MessageResponse {
    success: boolean;
    message: string;
}

export interface MeResponse {
    success: boolean;
    message: string;
    data?: User;  // Backend returns user directly in data, not { user: User }
}
