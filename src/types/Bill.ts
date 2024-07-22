import type { BillItem } from "./BillItem";

export interface Bill{
    id: string,
    creationDate: string,
    billItems: BillItem[],
    totalCash: string,
    JIR: string,
    ZKI: string,
    paydeskName: string,
    user: string
}