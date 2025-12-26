import { EditStoreClient } from "@/component/account/store-edit/component.Client"
import { use } from "react"

export default function EditStorePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    return <EditStoreClient storeId={parseInt(id)} />
}
