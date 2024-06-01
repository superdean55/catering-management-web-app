import type { FieldValue } from "firebase/firestore"
import type { SupplyItem } from "./SupplyItem"

export interface Supply{
    id: string,
    email: string,
    updateDate: string,
    timestamp: FieldValue,
    updateCausedByDocumentName: string,
    supplyItems: SupplyItem[]
}