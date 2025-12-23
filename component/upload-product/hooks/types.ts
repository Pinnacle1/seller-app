import { ProductCondition } from "@/types/product"

export interface ImageFile {
    id: string
    file?: File
    url: string
    isUploading?: boolean
}

export interface DetailField {
    id: string
    name: string
    value: string
}

export interface Subcategory {
    value: string
    label: string
}

export interface Category {
    value: string
    label: string
    subcategories: Subcategory[]
}

export const categories: Category[] = [
    {
        value: "tops",
        label: "Tops",
        subcategories: [
            { value: "shirt", label: "Shirt" },
            { value: "baggy_shirt", label: "Baggy Shirt" },
            { value: "tshirt", label: "T-Shirt" },
            { value: "baggy_tshirt", label: "Baggy T-Shirt" },
            { value: "hoodie", label: "Hoodie" },
            { value: "sweatshirt", label: "Sweatshirt" },
        ],
    },
    {
        value: "bottomwear",
        label: "Bottomwear",
        subcategories: [
            { value: "pants", label: "Pants" },
            { value: "baggy_pants", label: "Baggy Pants" },
            { value: "joggers", label: "Joggers" },
            { value: "jeans", label: "Jeans" },
            { value: "shorts", label: "Shorts" },
        ],
    },
    {
        value: "outerwear",
        label: "Outerwear",
        subcategories: [
            { value: "jackets", label: "Jackets" },
            { value: "overshirt", label: "Overshirt" },
            { value: "coat", label: "Coat" },
        ],
    },
    {
        value: "footwear",
        label: "Footwear",
        subcategories: [
            { value: "shoes", label: "Shoes" },
            { value: "casual_shoes", label: "Casual Shoes" },
            { value: "sneakers", label: "Sneakers" },
            { value: "slides", label: "Slides / Sandals" },
        ],
    },
    {
        value: "accessories",
        label: "Accessories",
        subcategories: [
            { value: "chain", label: "Chain" },
            { value: "ring", label: "Ring" },
            { value: "bracelet", label: "Bracelet" },
            { value: "cap", label: "Cap / Hat" },
            { value: "belt", label: "Belt" },
            { value: "watch", label: "Watch" },
            { value: "sunglasses", label: "Sunglasses" },
        ],
    },
    {
        value: "bags",
        label: "Bags",
        subcategories: [
            { value: "backpack", label: "Backpack" },
            { value: "sling_bag", label: "Sling Bag" },
            { value: "tote_bag", label: "Tote Bag" },
        ],
    },
    {
        value: "other",
        label: "Other",
        subcategories: [],
    },
]

export const conditions: { value: ProductCondition; label: string }[] = [
    { value: "new", label: "New with tags" },
    { value: "good", label: "Good" },
    { value: "fair", label: "Fair" },
]

// Helper to get subcategories for a category
export function getSubcategories(categoryValue: string): Subcategory[] {
    const category = categories.find(c => c.value === categoryValue)
    return category?.subcategories ?? []
}

// Helper to check if category has subcategories
export function hasSubcategories(categoryValue: string): boolean {
    const category = categories.find(c => c.value === categoryValue)
    return (category?.subcategories?.length ?? 0) > 0
}
