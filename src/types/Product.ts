import type { FieldValue } from "firebase/firestore";
import type { ArticleUnit } from "./ArticleUnit";
import type { ProductItem } from "./ProductItem";
import type { TaxRate } from "./TaxRate";

export interface Product{
    id: string,
    name: string,
    code: string,
    articleUnit: ArticleUnit,
    taxRate: TaxRate,
    price: string,
    creationDate: string,
    imageName: string,
    imageUrl: string,
    productItems: ProductItem[],
    timestamp: FieldValue,
}