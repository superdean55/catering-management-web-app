import type { ArticleUnit } from "./ArticleUnit";

export interface RawMaterial{
    id: string,
    name: string,
    unit: ArticleUnit,
    quantity: number
}