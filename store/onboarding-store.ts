import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// ============== Types ==============

export interface StoreInfo {
    id: number | null;
    name: string;
    slug: string;
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

// ============== State & Action Types ==============

type State = {
    // Navigation
    currentStep: number;
    completedSteps: number[];

    // Data
    storeInfo: StoreInfo;
    verification: VerificationInfo;
    kyc: KycInfo;
    bank: BankInfo;
    userData: { email: string; phone: string } | null;

    // UI
    isLoading: boolean;
    error: string | null;
    successMessage: string | null;
};

type Action = {
    // Step navigation
    setCurrentStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;
    markStepCompleted: (step: number) => void;

    // Data setters
    setStoreInfo: (info: Partial<StoreInfo>) => void;
    setVerification: (info: Partial<VerificationInfo>) => void;
    setKyc: (info: Partial<KycInfo>) => void;
    setBank: (info: Partial<BankInfo>) => void;
    setUserData: (data: { email: string; phone: string } | null) => void;

    // UI setters
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setSuccessMessage: (message: string | null) => void;
    clearError: () => void;
    reset: () => void;
};

// ============== Initial Values ==============

const initialStoreInfo: StoreInfo = {
    id: null,
    name: "",
    slug: "",
    description: "",
    logoUrl: null,
};

const initialVerification: VerificationInfo = {
    phone: "",
    email: "",
    phoneVerified: false,
    emailVerified: false,
};

const initialKyc: KycInfo = {
    aadhaarName: "",
    aadhaarNumber: "",
    aadhaarSubmitted: false,
    panName: "",
    panNumber: "",
    panSubmitted: false,
};

const initialBank: BankInfo = {
    accountName: "",
    accountNumber: "",
    ifscCode: "",
    submitted: false,
};

// ============== Store ==============

const useOnboardingStore = create<State & Action>()(
    persist(
        (set) => ({
            // Initial state
            currentStep: 0,
            completedSteps: [],
            storeInfo: initialStoreInfo,
            verification: initialVerification,
            kyc: initialKyc,
            bank: initialBank,
            userData: null,
            isLoading: false,
            error: null,
            successMessage: null,

            // Step navigation
            setCurrentStep: (step) => set({ currentStep: step }),
            nextStep: () =>
                set((state) => ({ currentStep: Math.min(state.currentStep + 1, 4) })),
            prevStep: () =>
                set((state) => ({ currentStep: Math.max(state.currentStep - 1, 0) })),
            markStepCompleted: (step) =>
                set((state) => ({
                    completedSteps: state.completedSteps.includes(step)
                        ? state.completedSteps
                        : [...state.completedSteps, step],
                })),

            // Data setters
            setStoreInfo: (info) =>
                set((state) => ({ storeInfo: { ...state.storeInfo, ...info } })),
            setVerification: (info) =>
                set((state) => ({ verification: { ...state.verification, ...info } })),
            setKyc: (info) =>
                set((state) => ({ kyc: { ...state.kyc, ...info } })),
            setBank: (info) =>
                set((state) => ({ bank: { ...state.bank, ...info } })),
            setUserData: (data) => set({ userData: data }),

            // UI setters
            setLoading: (isLoading) => set({ isLoading }),
            setError: (error) => set({ error }),
            setSuccessMessage: (successMessage) => set({ successMessage }),
            clearError: () => set({ error: null, successMessage: null }),
            reset: () =>
                set({
                    currentStep: 0,
                    completedSteps: [],
                    storeInfo: initialStoreInfo,
                    verification: initialVerification,
                    kyc: initialKyc,
                    bank: initialBank,
                    userData: null,
                    isLoading: false,
                    error: null,
                    successMessage: null,
                }),
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
