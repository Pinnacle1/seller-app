"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { onboardService, StoreData } from "@/service/onboard.service";
import {
    CreateStoreRequest,
    UploadLogoRequest,
    EmailVerificationRequest,
    PhoneVerificationRequest,
    VerifyOTPRequest,
    Pan,
    Aadhaar,
    Bank
} from "@/types/onboard";

// ============== Types ==============

export interface StoreInfo {
    id: number | null;
    name: string;
    description: string;
    logoUrl: string | null;
}

export interface KycInfo {
    aadhaarName: string;
    aadhaarNumber: string;
    aadhaarSubmitted: boolean;
    panName: string;
    panNumber: string;
    panSubmitted: boolean;
}

export interface BankInfo {
    accountName: string;
    accountNumber: string;
    ifscCode: string;
    submitted: boolean;
}

export interface VerificationInfo {
    phone: string;
    email: string;
    phoneVerified: boolean;
    emailVerified: boolean;
}

// ============== State Types ==============

type OnboardingState = {
    // Current step (0-indexed)
    currentStep: number;

    // Completed steps set
    completedSteps: number[];

    // Data - Step 1: Store Info
    storeInfo: StoreInfo;

    // Data - Step 3: Verification
    verification: VerificationInfo;

    // Data - Step 4: KYC (Aadhaar & PAN)
    kyc: KycInfo;

    // Data - Step 5: Bank Details
    bank: BankInfo;

    // UI States
    isLoading: boolean;
    error: string | null;
    successMessage: string | null;

    // User data from registration/auth
    userData: {
        email: string;
        phone: string;
    } | null;
};

type OnboardingActions = {
    // Step navigation
    setCurrentStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;
    markStepCompleted: (step: number) => void;
    isStepCompleted: (step: number) => boolean;

    // Store Info Actions
    setStoreInfo: (info: Partial<StoreInfo>) => void;
    fetchStores: () => Promise<void>;
    createStore: (data: CreateStoreRequest) => Promise<boolean>;
    uploadStoreLogo: (data: UploadLogoRequest) => Promise<boolean>;

    // Verification Actions
    setVerification: (info: Partial<VerificationInfo>) => void;
    sendEmailOtp: (email: string) => Promise<boolean>;
    sendPhoneOtp: (phone: string) => Promise<boolean>;
    verifyOtp: (identifier: string, otp: string, type: 'email' | 'phone') => Promise<boolean>;

    // KYC Actions
    setKyc: (info: Partial<KycInfo>) => void;
    fetchKycStatus: () => Promise<void>;
    submitPan: (data: Pan) => Promise<boolean>;
    submitAadhaar: (data: Aadhaar) => Promise<boolean>;
    deletePan: () => Promise<boolean>;
    deleteAadhaar: () => Promise<boolean>;

    // Bank Actions
    setBank: (info: Partial<BankInfo>) => void;
    fetchBankDetails: () => Promise<void>;
    submitBankDetails: (data: Bank) => Promise<boolean>;
    deleteBankDetails: () => Promise<boolean>;

    // State Management
    setUserData: (data: { email: string; phone: string } | null) => void;
    clearError: () => void;
    resetOnboarding: () => void;
};

// ============== Initial State ==============

const initialState: OnboardingState = {
    currentStep: 0,
    completedSteps: [],
    storeInfo: {
        id: null,
        name: "",
        description: "",
        logoUrl: null,
    },
    verification: {
        phone: "",
        email: "",
        phoneVerified: false,
        emailVerified: false,
    },
    kyc: {
        aadhaarName: "",
        aadhaarNumber: "",
        aadhaarSubmitted: false,
        panName: "",
        panNumber: "",
        panSubmitted: false,
    },
    bank: {
        accountName: "",
        accountNumber: "",
        ifscCode: "",
        submitted: false,
    },
    userData: null,
    isLoading: false,
    error: null,
    successMessage: null,
};

// ============== Store ==============

const useOnboardingStore = create<OnboardingState & OnboardingActions>()(
    persist(
        (set, get) => ({
            ...initialState,

            // ============== Step Navigation ==============

            setCurrentStep: (step) => set({ currentStep: step }),

            nextStep: () => set((state) => ({
                currentStep: Math.min(state.currentStep + 1, 4)
            })),

            prevStep: () => set((state) => ({
                currentStep: Math.max(state.currentStep - 1, 0)
            })),

            markStepCompleted: (step) => set((state) => ({
                completedSteps: state.completedSteps.includes(step)
                    ? state.completedSteps
                    : [...state.completedSteps, step]
            })),

            isStepCompleted: (step) => get().completedSteps.includes(step),

            // ============== Store Info Actions ==============

            setStoreInfo: (info) => set((state) => ({
                storeInfo: { ...state.storeInfo, ...info }
            })),

            fetchStores: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await onboardService.getStores();
                    if (response.success && response.data && response.data.length > 0) {
                        const store = response.data[0];
                        set({
                            storeInfo: {
                                id: store.id,
                                name: store.name,
                                description: store.description,
                                logoUrl: store.logo_url,
                            },
                        });
                        // If we have a store, mark step 0 (Store Info) as completed?? 
                        // Assuming step 0 is store creation.
                        get().markStepCompleted(0);
                    }
                } catch (error: any) {
                    set({ error: error.message || "Failed to fetch stores" });
                } finally {
                    set({ isLoading: false });
                }
            },

            createStore: async (data) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await onboardService.createStore(data);
                    if (response.success && response.data) {
                        set({
                            storeInfo: {
                                id: response.data.id,
                                name: response.data.name,
                                description: response.data.description,
                                logoUrl: response.data.logo_url || null,
                            },
                            successMessage: "Store created successfully!",
                        });
                        get().markStepCompleted(0);
                        return true;
                    } else {
                        set({ error: response.message || "Failed to create store" });
                        return false;
                    }
                } catch (error: any) {
                    set({ error: error.message || "Failed to create store" });
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            },

            uploadStoreLogo: async (data) => {
                set({ isLoading: true, error: null });
                try {
                    // Note definition of uploadLogo in service takes { storeId, logo }
                    // Assuming 'logo' is the string URL or base64. 
                    // The service calls PATCH endpoint.
                    const response = await onboardService.uploadLogo(data);
                    if (response.success) {
                        set((state) => ({
                            storeInfo: { ...state.storeInfo, logoUrl: data.logo }
                        }));
                        return true;
                    } else {
                        set({ error: response.message || "Failed to upload logo" });
                        return false;
                    }
                } catch (error: any) {
                    set({ error: error.message || "Failed to upload logo" });
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            },

            // ============== Verification Actions ==============

            setVerification: (info) => set((state) => ({
                verification: { ...state.verification, ...info }
            })),

            sendEmailOtp: async (email) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await onboardService.EmailVerification({ email });
                    if (response.success) {
                        return true;
                    } else {
                        set({ error: response.message || "Failed to send email OTP" });
                        return false;
                    }
                } catch (error: any) {
                    set({ error: error.message || "Failed to send email OTP" });
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            },

            sendPhoneOtp: async (phone) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await onboardService.PhoneVerification({ phone });
                    if (response.success) {
                        return true;
                    } else {
                        set({ error: response.message || "Failed to send phone OTP" });
                        return false;
                    }
                } catch (error: any) {
                    set({ error: error.message || "Failed to send phone OTP" });
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            },

            verifyOtp: async (identifier, otp, type) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await onboardService.VerifyOTP({ phoneOrEmail: identifier, otp });
                    if (response.success) {
                        set((state) => ({
                            verification: {
                                ...state.verification,
                                [type === 'email' ? 'emailVerified' : 'phoneVerified']: true
                            }
                        }));
                        return true;
                    } else {
                        set({ error: response.message || "Invalid OTP" });
                        return false;
                    }
                } catch (error: any) {
                    set({ error: error.message || "Verification failed" });
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            },

            // ============== KYC Actions ==============

            setKyc: (info) => set((state) => ({
                kyc: { ...state.kyc, ...info }
            })),

            fetchKycStatus: async () => {
                set({ isLoading: true, error: null });
                try {
                    // This could fetch all status. For now calling getStatus endpoint
                    // or individual get endpoints if getStatus just returns general status
                    const response = await onboardService.GetKYCStatus();
                    // Assuming response structure needs to be mapped to state
                    if (response.success && response.data) {
                        // Logic to update state based on response.data
                        // Since types are loose here without seeing exact response structure,
                        // We can add specific calls:
                        const panRes = await onboardService.GetPan();
                        const aadhaarRes = await onboardService.GetAadhaar();

                        // Update store if data exists
                        set((state) => ({
                            kyc: {
                                ...state.kyc,
                                panSubmitted: !!panRes.data,
                                panNumber: panRes.data?.pan_number || "",
                                panName: panRes.data?.pan_name || "",
                                aadhaarSubmitted: !!aadhaarRes.data,
                                aadhaarNumber: aadhaarRes.data?.aadhaar_number || "",
                                aadhaarName: aadhaarRes.data?.aadhaar_name || "",
                            }
                        }));
                    }
                } catch (error: any) {
                    // console.log("KYC Fetch error", error); 
                    // Silent fail as it might be empty
                } finally {
                    set({ isLoading: false });
                }
            },

            submitPan: async (data) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await onboardService.SubmitPan(data);
                    if (response.success) {
                        set((state) => ({
                            kyc: {
                                ...state.kyc,
                                panName: data.name,
                                panNumber: data.pan_number,
                                panSubmitted: true
                            }
                        }));
                        return true;
                    } else {
                        set({ error: response.message || "Failed to submit PAN" });
                        return false;
                    }
                } catch (error: any) {
                    set({ error: error.message || "Failed to submit PAN" });
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            },

            submitAadhaar: async (data) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await onboardService.SubmitAadhar(data);
                    if (response.success) {
                        set((state) => ({
                            kyc: {
                                ...state.kyc,
                                aadhaarName: data.name,
                                aadhaarNumber: data.aadhaar_number,
                                aadhaarSubmitted: true
                            }
                        }));
                        return true;
                    } else {
                        set({ error: response.message || "Failed to submit Aadhaar" });
                        return false;
                    }
                } catch (error: any) {
                    set({ error: error.message || "Failed to submit Aadhaar" });
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            },

            deletePan: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await onboardService.DeletePan();
                    if (response.success) {
                        set((state) => ({
                            kyc: { ...state.kyc, panSubmitted: false, panNumber: "", panName: "" }
                        }));
                        return true;
                    }
                    return false;
                } catch (error: any) {
                    set({ error: error.message });
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            },

            deleteAadhaar: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await onboardService.DeleteAadhaar();
                    if (response.success) {
                        set((state) => ({
                            kyc: { ...state.kyc, aadhaarSubmitted: false, aadhaarNumber: "", aadhaarName: "" }
                        }));
                        return true;
                    }
                    return false;
                } catch (error: any) {
                    set({ error: error.message });
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            },

            // ============== Bank Actions ==============

            setBank: (info) => set((state) => ({
                bank: { ...state.bank, ...info }
            })),

            fetchBankDetails: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await onboardService.GetBank();
                    if (response.success && response.data) {
                        set((state) => ({
                            bank: {
                                ...state.bank,
                                accountName: response.data.account_holder_name,
                                accountNumber: response.data.account_number,
                                ifscCode: response.data.ifsc_code,
                                submitted: true
                            }
                        }));
                    }
                } catch (error: any) {
                    // Silent fail or minimal error logging
                } finally {
                    set({ isLoading: false });
                }
            },

            submitBankDetails: async (data) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await onboardService.SubmitBank(data);
                    if (response.success) {
                        set((state) => ({
                            bank: {
                                ...state.bank,
                                accountName: data.name,
                                accountNumber: data.account_number,
                                ifscCode: data.ifsc_code,
                                submitted: true
                            }
                        }));
                        return true;
                    } else {
                        set({ error: response.message || "Failed to submit bank details" });
                        return false;
                    }
                } catch (error: any) {
                    set({ error: error.message || "Failed to submit bank details" });
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            },

            deleteBankDetails: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await onboardService.DeleteBank();
                    if (response.success) {
                        set((state) => ({
                            bank: { ...state.bank, submitted: false, accountName: "", accountNumber: "", ifscCode: "" }
                        }));
                        return true;
                    }
                    return false;
                } catch (error: any) {
                    set({ error: error.message });
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            },

            // ============== State Management ==============

            setUserData: (data) => set({ userData: data }),

            clearError: () => set({ error: null, successMessage: null }),

            resetOnboarding: () => set(initialState),
        }),
        {
            name: "thriftzy-onboarding",
            storage: createJSONStorage(() => sessionStorage),
            partialize: (state) => ({
                currentStep: state.currentStep,
                completedSteps: state.completedSteps,
                storeInfo: state.storeInfo,
                verification: state.verification,
                kyc: state.kyc,
                bank: state.bank,
                userData: state.userData,
            }),
        }
    )
);

export default useOnboardingStore;
