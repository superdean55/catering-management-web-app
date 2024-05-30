import type { ReceiptItem } from "./ReceiptItem";

export interface Receipt{
    id: string,
    supplierName: string,
    supplierOib: string,
    documentDate: string,
    receiptNumber: string,
    documentIdentifier: string,
    receiptItems: ReceiptItem[],
    uploadDate: string
}