import type { BillItem } from "./BillItem"

export interface Bill{
    id: string,
    number: number,
    tableId: string,
    Date: string,
    Time: string,
    billItems: BillItem[],
    totalCash: number,
    JIR: string,
    ZKI: string,
    paydeskName: string,
    user: string,
    isCancelled: boolean,
    byOrderId: string
}