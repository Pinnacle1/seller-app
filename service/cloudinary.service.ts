import { CLOUDINARY_CONFIG, getCloudinaryUploadUrl } from "../constant/cloudinary"

export interface CloudinaryUploadResponse {
    secure_url: string
    public_id: string
    format: string
    width: number
    height: number
}

export const uploadToCloudinary = async (file: File): Promise<CloudinaryUploadResponse> => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", CLOUDINARY_CONFIG.UPLOAD_PRESET)

    const response = await fetch(getCloudinaryUploadUrl(), {
        method: "POST",
        body: formData,
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error?.message || "Upload failed")
    }

    return response.json()
}
