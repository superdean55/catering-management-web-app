import type { FieldValue } from "firebase/firestore"
import type { ConclusionItem } from "./ConclusionItem"

export interface Conclusion{
    id: string,
    number: number,
    userName: string,
    paydeskName: string,
    date: string,
    time: string,
    timestamp: FieldValue,
    conclusionItems: ConclusionItem[],
    totalCash: number
}