import type { ArticleUnit } from "./ArticleUnit";

export interface ReceiptItem{
    id: string,
    rawMaterialId: string,
    name: string,
    code: string,
    unit: ArticleUnit,
    quantity: string,
    pricePerUnit: string,
    amount: string
}