import type { FieldValue } from "firebase/firestore"

export interface PayDesk{
    id: string,
    name: string,
    deposite: string,
    startOfWorkingHours: string,
    endOfWorkingHours: string,
    totalCash: string,
    userId: string,
    bills: string [],
    isInUse: boolean,
    creatinoDate: string,
    timestamp: FieldValue,
}