// Cloudinary Configuration
// Get these from your Cloudinary Dashboard

export const CLOUDINARY_CONFIG = {
    // Your Cloudinary cloud name (found in Dashboard)
    CLOUD_NAME: "dopxmg0za",

    // Unsigned upload preset name (create in Settings -> Upload -> Upload presets)
    UPLOAD_PRESET: "thrift",
}

// Cloudinary upload URL
export const getCloudinaryUploadUrl = () => {
    return `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.CLOUD_NAME}/image/upload`
}
