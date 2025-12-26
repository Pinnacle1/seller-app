"use client"

import { useCallback } from "react"
import { onboardService } from "@/service/onboard.service"
import useOnboardingStore from "@/store/onboarding-store"
import { handleError } from "./utils/handle-error"
import {
    CreateStoreRequest,
    UploadLogoRequest,
    Pan,
    Aadhaar,
    Bank
} from "@/types/onboard"

/**
 * Hook to orchestrate onboarding operations
 * Follows pattern: Component → Hook → Service → Store
 */
export function useOnboarding() {
    const {
        setStoreInfo,
        setVerification,
        setKyc,
        setBank,
        setLoading,
        setError,
        setSuccessMessage,
        markStepCompleted,
        clearError,
        reset,
    } = useOnboardingStore()

    // ============== Store Actions ==============

    const fetchStores = useCallback(async () => {
        const { isLoading } = useOnboardingStore.getState()
        if (isLoading) return

        setLoading(true)
        setError(null)

        try {
            const response = await onboardService.getStores()
            if (response.success && response.data && response.data.length > 0) {
                const store = response.data[0]
                setStoreInfo({
                    id: store.id,
                    name: store.name,
                    slug: store.slug,
                    description: store.description,
                    logoUrl: store.logo_url,
                })
                markStepCompleted(0)
            }
        } catch (error: any) {
            const message = handleError(error, "fetchStores")
            setError(message)
        } finally {
            setLoading(false)
        }
    }, [setStoreInfo, setLoading, setError, markStepCompleted])

    const createStore = useCallback(async (data: CreateStoreRequest): Promise<boolean> => {
        setLoading(true)
        setError(null)

        try {
            const response = await onboardService.createStore(data)
            if (response.success && response.data) {
                setStoreInfo({
                    id: response.data.id,
                    name: response.data.name,
                    slug: response.data.slug,
                    description: response.data.description,
                    logoUrl: response.data.logo_url || null,
                })
                setSuccessMessage("Store created successfully!")
                markStepCompleted(0)
                return true
            } else {
                setError(response.message || "Failed to create store")
                return false
            }
        } catch (error: any) {
            const message = handleError(error, "createStore")
            setError(message)
            return false
        } finally {
            setLoading(false)
        }
    }, [setStoreInfo, setLoading, setError, setSuccessMessage, markStepCompleted])

    const uploadStoreLogo = useCallback(async (data: UploadLogoRequest): Promise<boolean> => {
        setLoading(true)
        setError(null)

        try {
            const response = await onboardService.uploadLogo(data)
            if (response.success) {
                setStoreInfo({ logoUrl: data.logo })
                return true
            } else {
                setError(response.message || "Failed to upload logo")
                return false
            }
        } catch (error: any) {
            const message = handleError(error, "uploadStoreLogo")
            setError(message)
            return false
        } finally {
            setLoading(false)
        }
    }, [setStoreInfo, setLoading, setError])

    // ============== Verification Actions ==============

    const sendEmailOtp = useCallback(async (email: string): Promise<boolean> => {
        setLoading(true)
        setError(null)

        try {
            const response = await onboardService.EmailVerification({ email })
            if (response.success) {
                return true
            } else {
                setError(response.message || "Failed to send email OTP")
                return false
            }
        } catch (error: any) {
            const message = handleError(error, "sendEmailOtp")
            setError(message)
            return false
        } finally {
            setLoading(false)
        }
    }, [setLoading, setError])

    const sendPhoneOtp = useCallback(async (phone: string): Promise<boolean> => {
        setLoading(true)
        setError(null)

        try {
            const response = await onboardService.PhoneVerification({ phone })
            if (response.success) {
                return true
            } else {
                setError(response.message || "Failed to send phone OTP")
                return false
            }
        } catch (error: any) {
            const message = handleError(error, "sendPhoneOtp")
            setError(message)
            return false
        } finally {
            setLoading(false)
        }
    }, [setLoading, setError])

    const verifyOtp = useCallback(async (
        identifier: string,
        otp: string,
        type: 'email' | 'phone'
    ): Promise<boolean> => {
        setLoading(true)
        setError(null)

        try {
            const response = await onboardService.VerifyOTP({ phoneOrEmail: identifier, otp })
            if (response.success) {
                setVerification({
                    [type === 'email' ? 'emailVerified' : 'phoneVerified']: true
                })
                return true
            } else {
                setError(response.message || "Invalid OTP")
                return false
            }
        } catch (error: any) {
            const message = handleError(error, "verifyOtp")
            setError(message)
            return false
        } finally {
            setLoading(false)
        }
    }, [setVerification, setLoading, setError])

    // ============== KYC Actions ==============

    const fetchKycStatus = useCallback(async () => {
        setLoading(true)

        try {
            await onboardService.GetKYCStatus()
            const [panRes, aadhaarRes] = await Promise.all([
                onboardService.GetPan(),
                onboardService.GetAadhaar(),
            ])

            setKyc({
                panSubmitted: !!panRes.data,
                panNumber: panRes.data?.pan_number || "",
                panName: panRes.data?.pan_name || "",
                aadhaarSubmitted: !!aadhaarRes.data,
                aadhaarNumber: aadhaarRes.data?.aadhaar_number || "",
                aadhaarName: aadhaarRes.data?.aadhaar_name || "",
            })
        } catch (error: any) {
            // Silent fail - KYC might be empty
        } finally {
            setLoading(false)
        }
    }, [setKyc, setLoading])

    const submitPan = useCallback(async (data: Pan): Promise<boolean> => {
        setLoading(true)
        setError(null)

        try {
            const response = await onboardService.SubmitPan(data)
            if (response.success) {
                setKyc({
                    panName: data.name,
                    panNumber: data.pan_number,
                    panSubmitted: true,
                })
                return true
            } else {
                setError(response.message || "Failed to submit PAN")
                return false
            }
        } catch (error: any) {
            const message = handleError(error, "submitPan")
            setError(message)
            return false
        } finally {
            setLoading(false)
        }
    }, [setKyc, setLoading, setError])

    const submitAadhaar = useCallback(async (data: Aadhaar): Promise<boolean> => {
        setLoading(true)
        setError(null)

        try {
            const response = await onboardService.SubmitAadhar(data)
            if (response.success) {
                setKyc({
                    aadhaarName: data.name,
                    aadhaarNumber: data.aadhaar_number,
                    aadhaarSubmitted: true,
                })
                return true
            } else {
                setError(response.message || "Failed to submit Aadhaar")
                return false
            }
        } catch (error: any) {
            const message = handleError(error, "submitAadhaar")
            setError(message)
            return false
        } finally {
            setLoading(false)
        }
    }, [setKyc, setLoading, setError])

    const deletePan = useCallback(async (): Promise<boolean> => {
        setLoading(true)
        setError(null)

        try {
            const response = await onboardService.DeletePan()
            if (response.success) {
                setKyc({ panSubmitted: false, panNumber: "", panName: "" })
                return true
            }
            return false
        } catch (error: any) {
            const message = handleError(error, "deletePan")
            setError(message)
            return false
        } finally {
            setLoading(false)
        }
    }, [setKyc, setLoading, setError])

    const deleteAadhaar = useCallback(async (): Promise<boolean> => {
        setLoading(true)
        setError(null)

        try {
            const response = await onboardService.DeleteAadhaar()
            if (response.success) {
                setKyc({ aadhaarSubmitted: false, aadhaarNumber: "", aadhaarName: "" })
                return true
            }
            return false
        } catch (error: any) {
            const message = handleError(error, "deleteAadhaar")
            setError(message)
            return false
        } finally {
            setLoading(false)
        }
    }, [setKyc, setLoading, setError])

    // ============== Bank Actions ==============

    const fetchBankDetails = useCallback(async () => {
        setLoading(true)

        try {
            const response = await onboardService.GetBank()
            if (response.success && response.data) {
                setBank({
                    accountName: response.data.account_holder_name,
                    accountNumber: response.data.account_number,
                    ifscCode: response.data.ifsc_code,
                    submitted: true,
                })
            }
        } catch (error: any) {
            // Silent fail - bank might be empty
        } finally {
            setLoading(false)
        }
    }, [setBank, setLoading])

    const submitBankDetails = useCallback(async (data: Bank): Promise<boolean> => {
        setLoading(true)
        setError(null)

        try {
            const response = await onboardService.SubmitBank(data)
            if (response.success) {
                setBank({
                    accountName: data.name,
                    accountNumber: data.account_number,
                    ifscCode: data.ifsc_code,
                    submitted: true,
                })
                return true
            } else {
                setError(response.message || "Failed to submit bank details")
                return false
            }
        } catch (error: any) {
            const message = handleError(error, "submitBankDetails")
            setError(message)
            return false
        } finally {
            setLoading(false)
        }
    }, [setBank, setLoading, setError])

    const deleteBankDetails = useCallback(async (): Promise<boolean> => {
        setLoading(true)
        setError(null)

        try {
            const response = await onboardService.DeleteBank()
            if (response.success) {
                setBank({ submitted: false, accountName: "", accountNumber: "", ifscCode: "" })
                return true
            }
            return false
        } catch (error: any) {
            const message = handleError(error, "deleteBankDetails")
            setError(message)
            return false
        } finally {
            setLoading(false)
        }
    }, [setBank, setLoading, setError])

    return {
        // Store actions
        fetchStores,
        createStore,
        uploadStoreLogo,

        // Verification actions
        sendEmailOtp,
        sendPhoneOtp,
        verifyOtp,

        // KYC actions
        fetchKycStatus,
        submitPan,
        submitAadhaar,
        deletePan,
        deleteAadhaar,

        // Bank actions
        fetchBankDetails,
        submitBankDetails,
        deleteBankDetails,

        // State management
        clearError,
        reset,
    }
}
