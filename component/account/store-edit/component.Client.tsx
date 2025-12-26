"use client"

import { useState, useEffect, ChangeEvent, useMemo } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/component/layout/DashboardLayout"
import { Button } from "@/component/ui/Button"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useStoresQuery, useUpdateStore, useUploadStoreLogo } from "@/queries/use-stores-query"
import { uploadToCloudinary } from "@/service/cloudinary.service"
import { GeneralTab, AddressTab, PolicyTab, StoreAddressData, StorePoliciesData } from "./components"

interface EditStoreClientProps { storeId: number }

export function EditStoreClient({ storeId }: EditStoreClientProps) {
    const router = useRouter()
    const { data: stores = [], isPending: storesLoading } = useStoresQuery()
    const updateStoreMutation = useUpdateStore()
    const uploadLogoMutation = useUploadStoreLogo()

    const store = stores.find(s => s.id === storeId)

    // Form state
    const [logoFile, setLogoFile] = useState<File | null>(null)
    const [logoPreview, setLogoPreview] = useState<string | null>(null)
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [address, setAddress] = useState<StoreAddressData>({})
    const [policies, setPolicies] = useState<StorePoliciesData>({})
    const [isSaving, setIsSaving] = useState(false)
    const [activeTab, setActiveTab] = useState<'general' | 'address' | 'policy'>('general')

    // Original values for change detection
    const [originalName, setOriginalName] = useState("")
    const [originalDescription, setOriginalDescription] = useState("")
    const [originalAddress, setOriginalAddress] = useState<StoreAddressData>({})
    const [originalPolicies, setOriginalPolicies] = useState<StorePoliciesData>({})

    useEffect(() => {
        if (store) {
            setName(store.name); setDescription(store.description); setLogoPreview(store.logo_url)
            const addr = { address_line1: store.address_line1, address_line2: store.address_line2, city: store.city, state: store.state, country: store.country || "India", pincode: store.pincode, address_phone: store.address_phone }
            const pol = { shipping_policy: store.shipping_policy, return_policy: store.return_policy, support_contact: store.support_contact }
            setAddress(addr); setPolicies(pol)
            // Set originals
            setOriginalName(store.name); setOriginalDescription(store.description)
            setOriginalAddress(addr); setOriginalPolicies(pol)
        }
    }, [store])

    // Change detection
    const hasGeneralChanges = useMemo(() => logoFile !== null || name !== originalName || description !== originalDescription, [logoFile, name, description, originalName, originalDescription])
    const hasAddressChanges = useMemo(() => JSON.stringify(address) !== JSON.stringify(originalAddress), [address, originalAddress])
    const hasPolicyChanges = useMemo(() => JSON.stringify(policies) !== JSON.stringify(originalPolicies), [policies, originalPolicies])

    const handleLogoSelect = (e: ChangeEvent<HTMLInputElement>) => { if (e.target.files?.[0]) { setLogoFile(e.target.files[0]); setLogoPreview(URL.createObjectURL(e.target.files[0])) } }

    const handleSaveGeneral = async () => {
        if (!store) return; setIsSaving(true)
        try {
            if (logoFile) { const res = await uploadToCloudinary(logoFile); await uploadLogoMutation.mutateAsync({ storeId: store.id, logoUrl: res.secure_url }); setLogoFile(null) }
            if (name !== originalName || description !== originalDescription) { await updateStoreMutation.mutateAsync({ storeId: store.id, data: { name, description } }); setOriginalName(name); setOriginalDescription(description) }
        } finally { setIsSaving(false) }
    }

    const handleSaveAddress = async () => {
        if (!store) return; setIsSaving(true)
        try { await updateStoreMutation.mutateAsync({ storeId: store.id, data: address }); setOriginalAddress(address) }
        finally { setIsSaving(false) }
    }

    const handleSavePolicies = async () => {
        if (!store) return; setIsSaving(true)
        try { await updateStoreMutation.mutateAsync({ storeId: store.id, data: policies }); setOriginalPolicies(policies) }
        finally { setIsSaving(false) }
    }

    if (storesLoading || !store) return <DashboardLayout><div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-10 h-10 animate-spin text-muted-foreground" /></div></DashboardLayout>

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-4 mb-2">
                    <div className="hidden md:inline-flex">
                        <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft className="w-5 h-5" /></Button>
                    </div>
                    <div><h1 className="text-2xl font-bold">Edit Store</h1></div>
                </div>
                <div className="flex border-b border-border">
                    {(['general', 'address', 'policy'] as const).map(tab => (
                        <button key={tab} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`} onClick={() => setActiveTab(tab)}>{tab === 'general' ? 'General Info' : tab === 'address' ? 'Address' : 'Policies'}</button>
                    ))}
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                    {activeTab === 'general' && <GeneralTab name={name} description={description} logoPreview={logoPreview} isSaving={isSaving} hasChanges={hasGeneralChanges} onNameChange={setName} onDescriptionChange={setDescription} onLogoSelect={handleLogoSelect} onSave={handleSaveGeneral} />}
                    {activeTab === 'address' && <AddressTab address={address} isSaving={isSaving} hasChanges={hasAddressChanges} onAddressChange={(f, v) => setAddress(p => ({ ...p, [f]: v }))} onSave={handleSaveAddress} />}
                    {activeTab === 'policy' && <PolicyTab policies={policies} isSaving={isSaving} hasChanges={hasPolicyChanges} onPoliciesChange={(f, v) => setPolicies(p => ({ ...p, [f]: v }))} onSave={handleSavePolicies} />}
                </div>
            </div>
        </DashboardLayout>
    )
}
