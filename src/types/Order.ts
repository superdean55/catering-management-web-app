import type { FieldValue } from "firebase/firestore"
import type { BillItem } from "./BillItem"

export interface Order{
    id: string,
    code: string,
    tableId: string,
    payDeskId: string,
    date: string,
    time: string,
    billItems: BillItem[],
    uid: string,
    timestamp: FieldValue,
    isApproved: boolean,
    isCompleted: boolean
}