import type { FieldValue } from "firebase/firestore"
import type { ConclusionItem } from "./ConclusionItem"

export interface PayDesk{
    id: string,
    name: string,
    deposite: string,
    startOfWorkingHours: string,
    endOfWorkingHours: string,
    totalCash: number,
    userId: string,
    conclusionItems: ConclusionItem [],
    conclusionNumber: number,
    billNumber: number,
    currentYear: string,
    isInUse: boolean,
    isDisabled: boolean,
    creationDate: string,
    logInDate: string,
    logInTime: string,
    timestamp: FieldValue,
}