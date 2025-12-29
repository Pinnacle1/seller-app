import { END_POINT } from "../constant/endpoint-contstant";
import { endpoints } from "../constant/endpoint";
import {
    AuthResponse,
    LoginRequest,
    RegisterRequest,
    ChangePasswordRequest,
    GoogleOAuthRequest,
    MessageResponse,
    MeResponse
} from "../types/auth";

import { COOKIE_ACCESS_TOKEN, getCookie, removeCookie, setCookie } from "../utils/cookie-helper";
import useActiveStoreStore from "../store/active-store";
import useOnboardingStore from "../store/onboarding-store";

export const authService = {
    login: async (data: LoginRequest) => {
        try {
            const result: AuthResponse = await END_POINT.post(endpoints.login, data, true, "V1");
            if (result.success && result.data) {
                // Store access token with 30-day expiry for sellers
                setCookie(COOKIE_ACCESS_TOKEN, result.data.tokens.accessToken, 30);
            }
            return result;
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    },

    register: async (data: RegisterRequest) => {
        try {
            const result: AuthResponse = await END_POINT.post(endpoints.register, data, true, "V1");
            if (result.success && result.data) {
                // Store access token with 30-day expiry for sellers
                setCookie(COOKIE_ACCESS_TOKEN, result.data.tokens.accessToken, 30);
            }
            return result;
        } catch (error) {
            console.error("Register error:", error);
            throw error;
        }
    },

    logout: async () => {
        try {
            const token = getCookie(COOKIE_ACCESS_TOKEN);
            if (token) {
                // Just clear the token, no need to call backend for sellers
                // (since we don't store refresh tokens for sellers)
            }
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            removeCookie(COOKIE_ACCESS_TOKEN);
            // Clear stores
            useActiveStoreStore.getState().clear();
            useOnboardingStore.getState().reset();
        }
    },

    changePassword: async (data: ChangePasswordRequest) => {
        try {
            const token = getCookie(COOKIE_ACCESS_TOKEN);
            const result: MessageResponse = await END_POINT.post(
                endpoints.change_password,
                data,
                true,
                "V1",
                { auth: true, token }
            );
            return result;
        } catch (error) {
            console.error("Change password error:", error);
            throw error;
        }
    },

    googleLogin: async (idToken: string) => {
        try {
            const data: GoogleOAuthRequest = { idToken };
            const result: AuthResponse = await END_POINT.post(endpoints.google_login, data, true, "V1");
            if (result.success && result.data) {
                // Store access token with 30-day expiry for sellers
                setCookie(COOKIE_ACCESS_TOKEN, result.data.tokens.accessToken, 30);
            }
            return result;
        } catch (error) {
            console.error("Google login error:", error);
            throw error;
        }
    },

    me: async (): Promise<MeResponse> => {
        try {
            const token = getCookie(COOKIE_ACCESS_TOKEN);
            const result: MeResponse = await END_POINT.get(
                endpoints.me,
                undefined,
                "V1",
                { auth: true, token }
            );
            return result;
        } catch (error) {
            console.error("Get current user error:", error);
            throw error;
        }
    },

    logoutAll: async () => {
        try {
            const token = getCookie(COOKIE_ACCESS_TOKEN);
            await END_POINT.post(endpoints.logout_all, {}, true, "V1", { auth: true, token });
        } catch (error) {
            console.error("Logout all error:", error);
            throw error;
        } finally {
            removeCookie(COOKIE_ACCESS_TOKEN);
            // Clear stores
            useActiveStoreStore.getState().clear();
            useOnboardingStore.getState().reset();
        }
    }
};