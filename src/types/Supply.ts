import type { FieldValue } from "firebase/firestore"
import type { SupplyItem } from "./SupplyItem"

export interface Supply{
    id: string,
    uid: string,
    updateDate: string,
    timestamp: FieldValue,
    updateCausedByDocumentName: string,
    supplyItems: SupplyItem[]
}