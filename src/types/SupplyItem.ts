import type { ArticleUnit } from "./ArticleUnit"

export interface SupplyItem{
    rawMaterialId: string,
    name: string,
    code: string,
    unit: ArticleUnit,
    quantity: number
}