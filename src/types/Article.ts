import type { ArticleUnit } from "./ArticleUnit";
import type { TaxRate } from "./TaxRate";

export interface Article{
    id: string,
    categoryId: string,
    name: string,
    code: string,
    articleUnit: ArticleUnit,
    taxRate: TaxRate,
    creationDate: string,
    imageName: string,
    imageUrl: string
}